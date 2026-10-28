# CLAUDE.md: working on markbreitenbach.dev

Mark's personal site: operating notes on running engineering teams made of agents.
Jekyll 4, built and deployed by Cloudflare Pages on push to `main`. Mark's global rules
apply here as everywhere; these are the ones specific to this repo.

## Content

- Every note cites sources: a `sources:` list in front matter (title, author or site, URL,
  date accessed), rendered as a numbered bibliography by the post layout. Specific claims
  link to their source with kramdown footnotes. Fetch and verify every link before it
  ships. A claim a reader could ask "says who?" about gets a source or gets cut.
- No em-dashes or en-dashes anywhere: prose, code, comments, commit messages.
- Real names only with the person's permission. Testers by first name or nickname.
- Public copy is Mark's. Draft it, propose it, and wait for his wording. Nothing publishes
  without his ratification.
- `TOPICS.md` is the working roster of candidate notes. It is git-ignored and stays that
  way; never publish it or quote it on the site.

## Design

- The look is settled: graphite sheet on a dark stone ground, amber accent, Newsreader
  for titles, Inter for prose, IBM Plex Mono for furniture, edge tabs as the index.
  Colors, fonts and sizes live ONLY as CSS variables at the top of `assets/css/site.css`;
  never hard-code a color in markup.
- The edge tabs are a curated subset of tags, defined in `_data/tabs.yml`. Keep them to
  four topics plus about. Tag pages are addressable; before retiring or renaming a tag,
  add a redirect in `_redirects`.
- The dashed line down the sheet's left edge stands in for hand-sewn binding until a
  traced graphic replaces it. Leave it.
- No JavaScript, no analytics, no cookies, no tracking. The colophon promises this.

## Git

- Commits are Mark's: his identity, his approval before every commit and push, no AI
  attribution of any kind (no co-author trailers, no session links, no generated-with
  footers), per his global rules.
- Line endings are normalized by `.gitattributes` (`* text=auto eol=lf`).
- A shell on Mark's machine cannot delete files, and git's commit path leaves lock files
  it cannot remove; hand Mark the commit commands rather than running them from there.
