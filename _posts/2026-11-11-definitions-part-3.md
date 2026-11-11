---
layout: post
title: "Definitions, Part 3"
date: 2026-11-11 11:16 -0700
tags: [faq]
summary: "Long-term memory: how agents keep what has to outlast one conversation, and one reason it's an area of active research."
signoff: false
sources:
  - title: "How Claude remembers your project"
    by: Claude Code docs, Anthropic
    url: https://code.claude.com/docs/en/memory
    archive: https://web.archive.org/web/20261111033125/https://code.claude.com/docs/en/memory
    accessed: 2026-11-10
  - title: "Effective context engineering for AI agents"
    by: Anthropic
    url: https://www.anthropic.com/research/effective-context-engineering-for-ai-agents
    archive: https://web.archive.org/web/20261111035403/https://www.anthropic.com/research/effective-context-engineering-for-ai-agents
    date: 2025-09-29
    accessed: 2026-11-10
  - title: "Effective harnesses for long-running agents"
    by: Justin Young, Anthropic
    url: https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
    archive: https://web.archive.org/web/20261111111106/https://www.anthropic.com/research/effective-harnesses-for-long-running-agents
    date: 2025-11-26
    accessed: 2026-11-10
  - title: "MemGPT: Towards LLMs as Operating Systems"
    by: Charles Packer et al.
    url: https://arxiv.org/abs/2310.08560
    archive: https://web.archive.org/web/20261111111316/https://arxiv.org/abs/2310.08560
    date: 2023-10-12
    accessed: 2026-11-10
  - title: "Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory"
    by: Prateek Chhikara et al.
    url: https://arxiv.org/abs/2504.19413
    archive: https://web.archive.org/web/20261111111342/https://arxiv.org/abs/2504.19413
    date: 2025-04-28
    accessed: 2026-11-10
  - title: "Zep: A Temporal Knowledge Graph Architecture for Agent Memory"
    by: Preston Rasmussen et al.
    url: https://arxiv.org/abs/2501.13956
    archive: https://web.archive.org/web/20261111111413/https://arxiv.org/abs/2501.13956
    date: 2025-01-20
    accessed: 2026-11-10
  - title: "Context Engineering for AI Agents: Lessons from Building Manus"
    by: Manus
    url: https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
    archive: https://web.archive.org/web/20261111111445/https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
    date: 2025-07-18
    accessed: 2026-11-10
  - title: "Context Engineering"
    by: LangChain
    url: https://www.langchain.com/blog/context-engineering-for-agents
    archive: https://web.archive.org/web/20261111111553/https://www.langchain.com/blog/context-engineering-for-agents
    date: 2025-07-02
    accessed: 2026-11-10
  - title: "Memory in the Age of AI Agents"
    by: Yuyang Hu et al.
    url: https://arxiv.org/abs/2512.13564
    archive: https://web.archive.org/web/20261111111620/https://arxiv.org/abs/2512.13564
    date: 2025-12-15
    accessed: 2026-11-10
  - title: "Hello Entire World"
    by: Thomas Dohmke, Entire
    url: https://entire.com/blog/hello-entire-world
    archive: https://web.archive.org/web/20261111115315/https://entire.com/blog/hello-entire-world
    date: 2026-02-10
    accessed: 2026-11-11
  - title: "How Version Control Will Evolve for the Agent Boom"
    by: Thomas Dohmke, Entire
    url: https://entire.com/blog/how-version-control-will-evolve-for-the-agent-boom
    archive: https://web.archive.org/web/20261111115347/https://entire.com/blog/how-version-control-will-evolve-for-the-agent-boom
    date: 2026-07-06
    accessed: 2026-11-11
---

[Previous: Definitions, Part 2](/notes/definitions-part-2/)
{: .series-nav}

Next is long-term memory. We've covered tokens, the context window and the rules in it,
and compaction.

Think about the work an agent does in a standard session with ChatGPT or Gemini in a web
browser: short engagements that don't produce a large project or code base. There's little
need for long-term project memory there, because everything happens in that one session.
There's no long-running project whose facts it has to remember. It's the web search you
just did, the image you just generated from a paragraph-long prompt, the research you just
had the agent complete.

Once you move to longer engagements, work at an enterprise level, or a coding project that
will take months, there's a real need for long-term memory, because you're certain to
exceed what one session can hold. You might have one session for design, another for
coding, and one or several for testing; a future note will cover that workflow. They all
need to share the history of the project, beyond the rules you've set up.

That's done with memory files. The simplest way, and still a common one, is a set of plain
files, each holding a few comments about how the project has gone: a finding from research,
a pattern you want followed in the code, and so on. They work like a rule set that extends
beyond CLAUDE.md and lasts across a long project. In Claude Code, these are the notes
Claude writes on its own as you work, the ones I said in [Part 1](/notes/definitions-part-1/) don't go into
CLAUDE.md.[^1]

Why keep them in files instead of loading them into every session? To save room. You want
what loads into every session to be as small as possible. That leaves the most room for
your current questions, your current coding task, your current design session, instead of
filling it with clutter that isn't relevant to what you're currently doing.

So what happens when a session needs something from memory? The agent searches the memory
files for what you discussed earlier. It's like the background you share with that friend
from lunch: years of it, which you don't recite at the table, but which comes back when
the conversation calls for it.

Here's a specific example. One of my projects is writing a book. To be clear, the agent
isn't writing the book for me; it helped me with the research. Before I put pen to paper
on a single chapter, I went through my outline and researched close to 120 topics,
everything from fusion reactors to 1960s Pennsylvania steel towns to specific conflicts in
Europe where a dictator staged a coup. Each topic went into its own file. I gave the agent
a prompt along these lines: find sources for this topic; I'm especially looking for
information about X, Y or Z; collect it all in a file and list the sources.

Another thing I like to do with research tasks is have the agent score each source it
found for accuracy. A research paper from a renowned institute would score high. A
website from an autocratic government, where you can almost guarantee some of what it
publishes is propaganda, would score lower. So might an unverified paper with no
citations and very small sample sizes.

When I sat down to write a chapter that drew on that research, I'd have the agent pull the
relevant pieces, so I had the specifics in front of me while I wrote. That meant searching
through all those individual files, and with more than a hundred of them, that kind of
lookup gets inefficient.

So I had the agent build an index. That was my idea, not something the tool did on its
own. Each line pointed to one research file, with a quick summary of what was in it and,
where it mattered, the years it covered. When I wanted the agent to find something we'd
researched, it found it fast.

Current tools do much the same thing automatically: they keep an index that points to the
deeper files, which is exactly what I'd set up.[^2] The agent doesn't need all of that
information in the context window all the time, only when you ask for it. You might say:
two weeks ago we talked about a ticket for this next bit of code; please read the ticket
and anything relevant to it so we can work on that code now. The agent will search the
memory files, and maybe old session transcripts, to dig out what you discussed two weeks
or three sessions ago. That information is current again. The agent can speak to the
earlier conversation and the decisions you reached, and you can hit the ground running,
picking up where that work left off.

One more thing: memory is extraordinarily important for long-running agents. So far I've
talked about long-running projects that take weeks or months, and the examples I just gave
apply there. But think instead about an agent that becomes your digital assistant, an
engagement that might last years, or the rest of your life. For that to work, it has to
remember a great deal about you and how to work with you, far more than any context
window holds, stored outside the window and indexed so it can find what it needs quickly.
That's why this is an area of so much active research. I see or read at least one article
every week on it, and I've listed several in the sources.[^3]

[Next: Definitions, Part 4](/notes/definitions-part-4/)
{: .series-nav}

[^1]: Anthropic's docs call this auto memory: "notes Claude writes itself based on your corrections and preferences." See source 1.
[^2]: In Claude Code, a file called MEMORY.md is the index, "one line per memory, loaded into every session," and the detailed files are read only when needed. See source 1.
[^3]: Sources 2 to 11: two Anthropic engineering posts, papers on MemGPT, Mem0 and Zep, write-ups from Manus and LangChain, a December 2025 survey of agent memory, and two posts from Entire on keeping agents' context in git as shared memory.
