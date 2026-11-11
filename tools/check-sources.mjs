#!/usr/bin/env node
// Checks the sources listed in each note's front matter for link rot, and archives them.
//
//   node tools/check-sources.mjs                 check every published note (read-only)
//   node tools/check-sources.mjs --drafts        also check _drafts/
//   node tools/check-sources.mjs --file <path>   check one note
//   node tools/check-sources.mjs --archive       list sources with no archive: (dry run)
//   node tools/check-sources.mjs --archive --go  submit those to the Internet Archive and
//                                                print the archive: lines to add
//
// Nothing here edits a note. Checking only reads URLs. Archiving asks the Internet
// Archive's Save Page Now to snapshot each public source URL, a few seconds apart, and
// prints the snapshot URLs for the front matter.
//
// Report categories:
//   ok       the URL loads (2xx)
//   moved    it redirects somewhere else: update the URL
//   gone     404 or 410: look for an archive, a new location, or another source
//   unclear  403, 401, 429, other errors, or a timeout: often bot blocking; check by hand

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const UA = "Mozilla/5.0 (compatible; source-link-checker)";
const TIMEOUT_MS = 20000;
const ARCHIVE_GAP_MS = 12000;

function usage() {
  console.log(`Usage: node tools/check-sources.mjs [--drafts] [--file <path>] [--archive [--go]]

  (no options)     check every note in _posts/ (read-only)
  --drafts         also check notes in _drafts/
  --file <path>    check only this note
  --archive        list sources that have no archive: line (dry run, sends nothing)
  --archive --go   submit those sources to the Internet Archive, print archive: lines
  --help           show this help`);
}

// Parse arguments before doing anything.
const args = process.argv.slice(2);
const opts = { drafts: false, file: null, archive: false, go: false };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--help" || a === "-h") { usage(); process.exit(0); }
  else if (a === "--drafts") opts.drafts = true;
  else if (a === "--archive") opts.archive = true;
  else if (a === "--go") opts.go = true;
  else if (a === "--file") {
    opts.file = args[++i];
    if (!opts.file) { console.error("--file needs a path"); process.exit(2); }
  } else { console.error(`Unknown option: ${a}`); usage(); process.exit(2); }
}
if (opts.go && !opts.archive) { console.error("--go only works with --archive"); process.exit(2); }

function noteFiles() {
  if (opts.file) return [path.resolve(opts.file)];
  const dirs = ["_posts"].concat(opts.drafts ? ["_drafts"] : []);
  const files = [];
  for (const d of dirs) {
    const dir = path.join(ROOT, d);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (name.endsWith(".md")) files.push(path.join(dir, name));
    }
  }
  return files;
}

function unquote(v) {
  v = v.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).replace(/\\"/g, '"');
  }
  return v;
}

// Reads the sources: list from front matter. Handles the shape this site uses: a list of
// maps with scalar values, two-space indent.
function readSources(file) {
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return [];
  const lines = m[1].split("\n");
  const start = lines.findIndex((l) => /^sources:\s*$/.test(l));
  if (start < 0) return [];
  const sources = [];
  let cur = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\S/.test(line)) break;
    const item = line.match(/^\s*-\s+([\w-]+):\s*(.*)$/);
    const field = line.match(/^\s+([\w-]+):\s*(.*)$/);
    if (item) { cur = { [item[1]]: unquote(item[2]) }; sources.push(cur); }
    else if (field && cur) cur[field[1]] = unquote(field[2]);
  }
  return sources;
}

async function check(url) {
  let current = url;
  for (let hop = 0; hop < 10; hop++) {
    let res;
    try {
      res = await fetch(current, {
        redirect: "manual",
        headers: { "user-agent": UA, accept: "text/html,*/*" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (e) {
      return { kind: "unclear", detail: e.name === "TimeoutError" ? "timed out" : e.message };
    }
    res.body?.cancel().catch(() => {});
    if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
      current = new URL(res.headers.get("location"), current).href;
      continue;
    }
    if (res.status >= 200 && res.status < 300) {
      return current === url ? { kind: "ok", detail: String(res.status) } : { kind: "moved", detail: `-> ${current}` };
    }
    if (res.status === 404 || res.status === 410) return { kind: "gone", detail: String(res.status) };
    return { kind: "unclear", detail: String(res.status) };
  }
  return { kind: "unclear", detail: "too many redirects" };
}

async function archive(url) {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      redirect: "manual",
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(120000),
    });
    res.body?.cancel().catch(() => {});
    const loc = res.headers.get("location") || res.headers.get("content-location");
    if (loc && loc.includes("/web/")) return new URL(loc, "https://web.archive.org").href;
  } catch { /* fall through to the availability lookup */ }
  try {
    const res = await fetch(`https://archive.org/wayback/available?url=${encodeURIComponent(url)}`, {
      headers: { "user-agent": UA },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = await res.json();
    return data?.archived_snapshots?.closest?.url || null;
  } catch {
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, "/");

const files = noteFiles();
const counts = { ok: 0, moved: 0, gone: 0, unclear: 0 };
let toArchive = 0;

for (const file of files) {
  const sources = readSources(file).filter((s) => s.url);
  if (sources.length === 0) continue;
  console.log(`\n${rel(file)}`);
  for (const [i, s] of sources.entries()) {
    const n = i + 1;
    if (opts.archive) {
      if (s.archive) continue;
      toArchive++;
      if (!opts.go) { console.log(`  [${n}] would archive ${s.url}`); continue; }
      const snap = await archive(s.url);
      console.log(snap ? `  [${n}] ${s.url}\n      archive: ${snap}` : `  [${n}] ${s.url}\n      archive failed; try again later or by hand`);
      await sleep(ARCHIVE_GAP_MS);
      continue;
    }
    const r = await check(s.url);
    counts[r.kind]++;
    const flags = [s.archive ? "archived" : "", s.status ? `status: ${s.status}` : ""].filter(Boolean).join(", ");
    console.log(`  [${n}] ${r.kind.padEnd(7)} ${s.url}  ${r.detail}${flags ? `  (${flags})` : ""}`);
  }
}

if (opts.archive) {
  console.log(`\n${toArchive} source(s) without an archive${opts.go ? "" : " (dry run; add --go to submit)"}`);
} else {
  console.log(`\nok ${counts.ok}, moved ${counts.moved}, gone ${counts.gone}, unclear ${counts.unclear}`);
  process.exitCode = counts.gone > 0 ? 1 : 0;
}
