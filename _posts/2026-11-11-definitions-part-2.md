---
layout: post
title: "Definitions, Part 2"
date: 2026-11-11 11:19 -0700
tags: [faq]
summary: "Compaction: what happens when the context window fills, and the handoff file that keeps the work from getting lost."
signoff: false
sources:
  - title: "Claude Code changelog"
    by: Anthropic, on GitHub
    url: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
    archive: https://web.archive.org/web/20261111030949/https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
    accessed: 2026-11-10
  - title: "Effective harnesses for long-running agents"
    by: Justin Young, Anthropic
    url: https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
    archive: https://web.archive.org/web/20261111111106/https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
    date: 2025-11-26
    accessed: 2026-11-10
  - title: "Explore the context window"
    by: Claude Code docs, Anthropic
    url: https://code.claude.com/docs/en/context-window
    archive: https://web.archive.org/web/20261111111135/https://code.claude.com/docs/en/context-window
    accessed: 2026-11-10
---

[Previous: Definitions, Part 1](/notes/definitions-part-1/)
{: .series-nav}

Next is compaction. In Part 1, the context window had a limit: one million tokens on most
current Claude models. So what happens when a conversation gets close to it? This isn't
about your plan's usage limits, the things you're billed against; those come in [Part 4](/notes/definitions-part-4/).
This is just the room in the window.

When the window gets close to full, the agent does something called compaction. The
simplest way to explain it: it takes everything in the session and writes a summary of
it. A summary, by its nature, is a shortened version that tries to capture the essence of
the original, and because it's shorter, it takes up far less of your context window and
frees up room for more work.

That makes compaction lossy by definition: afterward, the session no longer has all the
detail it had before. That can be a problem. I've seen compaction remove enough of what
was being worked on that I had to go back and review earlier work, to get enough back into
the session to keep going on, say, a particular block of code. Destructive would overstate
it, but it can leave a narrow enough view that you have to go back and review.

Here's an everyday analogy. Picture a long meeting where the speaker uses a whiteboard as
they talk, making copious notes along the way. The space on the whiteboard is your context
window. When the speaker gets close to filling it, they take a moment to make a summary of
what has been discussed so far in one corner, and then erase the rest so they can keep
talking. That's compaction.

The apps give you an indicator of how full the window is, so you can see compaction
coming. In Claude Code it's a "Context left until auto-compact" countdown.[^1] The technique that works for me: when I see
it approaching, I tell the agent something like this:

> Compaction is approaching. We're going to either start a new session or compact this
> one. Write a handoff file you can read when the next session begins, so we can continue
> the work without missing a beat.

Whether the session compacts or I start a new one, the handoff file holds the state of the
current work. When the new session starts, or the compacted one picks back up, I tell it
to catch up from the handoff file, and once it has, to delete it. It gets back whatever
compaction lost and picks up right where we left off. Back in our long meeting, it would
be like taking a picture of the whiteboard before they erased it so you have it to refer to
later. I've found that quite effective.

I'm not the only one who landed there. Anthropic's own engineers, writing about agents
that run for a long time, put it flatly: "compaction isn't sufficient." Their fix is a
progress file the agent keeps up to date, so a fresh session can pick up the state of the
work. It's the same idea as my handoff file.[^2]

It works because of what survives compaction. Your rules and memory files are reloaded
from disk afterward; only the conversation gets squeezed into a summary. A handoff file
puts the state of the work in a file too, where the summary can't squeeze it, and the
agent reads it back when you tell it to.[^3]

I call it a handoff file, and there are certainly other ways to handle this. Some tools
already let you steer compaction, for instance by telling it what to focus on when it
summarizes, and I expect more automation to come.[^3] But the summary alone often isn't
enough to continue an active task. If you're in the middle of work and compaction is
near, have the agent write a handoff file first, then let it compact or start a new
session.

[Next: Definitions, Part 3](/notes/definitions-part-3/)
{: .series-nav}

[^1]: The indicator's name is from Claude Code's changelog; see source 1.
[^2]: Their progress file is called claude-progress.txt, kept "alongside the git history." See source 2.
[^3]: Anthropic's Claude Code docs list what survives compaction, and show /compact taking a focus, such as "/compact focus on the auth bug fix." See source 3.
