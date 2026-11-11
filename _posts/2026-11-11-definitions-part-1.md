---
layout: post
title: "Definitions, Part 1"
date: 2026-11-11 11:22 -0700
tags: [faq]
summary: "Tokens, the context window, and the rules that load into it."
signoff: false
sources:
  - title: "Glossary: Tokens"
    by: Anthropic
    url: https://platform.claude.com/docs/en/about-claude/glossary
    archive: https://web.archive.org/web/20261111110448/https://platform.claude.com/docs/en/about-claude/glossary
    accessed: 2026-11-10
  - title: "Key concepts"
    by: OpenAI
    url: https://developers.openai.com/api/docs/concepts
    archive: https://web.archive.org/web/20261111110523/https://developers.openai.com/api/docs/concepts
    accessed: 2026-11-10
  - title: "Understand and count tokens"
    by: Google
    url: https://aistudio.google.com/docs/tokens
    archive: https://web.archive.org/web/20261111110620/https://aistudio.google.com/docs/tokens
    accessed: 2026-11-10
  - title: "How large is the context window on paid Claude plans?"
    by: Claude Help Center
    url: https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans
    archive: https://web.archive.org/web/20261111110657/https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans
    accessed: 2026-11-10
  - title: "Context windows"
    by: Anthropic
    url: https://platform.claude.com/docs/en/build-with-claude/context-windows
    archive: https://web.archive.org/web/20261111110727/https://platform.claude.com/docs/en/build-with-claude/context-windows
    accessed: 2026-11-10
  - title: "How Claude remembers your project"
    by: Claude Code docs, Anthropic
    url: https://code.claude.com/docs/en/memory
    archive: https://web.archive.org/web/20261111033125/https://code.claude.com/docs/en/memory
    accessed: 2026-11-10
  - title: "Why Language Models Hallucinate"
    by: Adam Tauman Kalai et al.
    url: https://arxiv.org/abs/2509.04664
    archive: https://web.archive.org/web/20261111110821/https://arxiv.org/abs/2509.04664
    date: 2025-09-04
    accessed: 2026-11-09
  - title: "Agent workspace"
    by: OpenClaw docs
    url: https://docs.openclaw.ai/concepts/agent-workspace
    archive: https://web.archive.org/web/20261111110918/https://docs.openclaw.ai/concepts/agent-workspace
    accessed: 2026-11-11
  - title: "Custom instructions with AGENTS.md"
    by: OpenAI, Codex docs
    url: https://learn.chatgpt.com/docs/agent-configuration/agents-md
    archive: https://web.archive.org/web/20261111110946/https://learn.chatgpt.com/docs/agent-configuration/agents-md
    accessed: 2026-11-10
  - title: "Provide context with GEMINI.md files"
    by: Google, Gemini CLI docs
    url: https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md
    archive: https://web.archive.org/web/20261111111016/https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md
    accessed: 2026-11-10
---

I'm going to define a few terms here, and I'll try to tie things to a few analogies
in everyday life.

## The context window

The first is the context window. Picture going out to lunch with a friend. Everything the
two of you talk about during that lunch is the context window: the short-term memory of
that one conversation. It doesn't hold the long-term memory you share with that friend,
the background you have together, unless one of you brings it up at the table. It holds
only the conversation you had during that lunch.

## Tokens

The second term is token. It's a loose term: the vendors broadly agree on what a token
is, but each counts them a little differently. The closest everyday comparison is a word,
though in practice a token is often a piece of a word, something closer to a syllable.
Anthropic says a token averages about 3.5 English characters on its earlier models, and
that its newer models (Claude 4.7 and later) produce about 30 percent more tokens for the
same text. OpenAI and Google both say about 4 characters, or roughly three quarters of a
word.[^1]

On most current Claude models, the context window can hold up to one million tokens.[^2]

Back at lunch: every word you say, every word your friend says back, and every word that's
thought along the way is a token used during that conversation. So it's not just input and
output; it's also the thinking behind the discussion. Your input is usually your prompt,
and sometimes a file you hand over. The output coming back is tokens too: sometimes a
structured answer, sometimes a file if you're coding, sometimes a spreadsheet or whatever
else. But typically those are fairly small compared to the number of tokens "burned" in
the thinking, and on current models that thinking stays in the window for the rest of the
conversation.[^3]

One more thing worth knowing now: before every reply, the model reads the whole window
again, from the top. That rereading doesn't take up any more room; the conversation is in
the window once. What it does is count against your usage, which I'll come back to in
[Part 4](/notes/definitions-part-4/) on budget.

## What else is in the window

There's more in the context window than the conversation and the thinking. It also holds
the rules you set up, and descriptions of the tools and skills you've given your agent
access to. Everything it needs to do the work gets loaded into that window, even if only
briefly. All the research it does, the lookups to work out how to run a command, all of
that is part of the "thinking" I mentioned earlier.

Let's get back to the rules for a moment. Here I'm going to get specific about Claude,
because that's the tool I use, and I can be a lot more precise about it.

In your setup there's a global file called CLAUDE.md. Most of the configuration files
these agents use are Markdown, which is what the .md means; that's common to every agent
I've used so far. If you're not familiar with Markdown, don't worry about it: it's plain
text with a little formatting. When you install the app on your machine, the global
CLAUDE.md lives in a .claude folder in your user directory. It holds a set of rules that
builds up over time, either because you write them yourself or because you ask Claude to
add one. Claude doesn't add rules to it on its own; what it saves on its own goes
somewhere else, which I'll get to in [Part 3](/notes/definitions-part-3/), on memory.[^4]

You can also create a CLAUDE.md for a single project. The difference between the two is
scope. The global file is loaded into the context window at the start of every new
session, so the rules in it should be ones that apply to every session. Here are a couple
of simple examples; you can get a lot more involved than this.

One rule that's in every setup I have is that I'm an American English speaker and prefer
American spellings, not British ones. That rule sits at the very top, and as a result
every conversation I have with the agent uses American spellings.

Another, also right at the top, is that I prefer accuracy over inference and accuracy over
flow. Models are trained in ways that reward a confident guess over admitting they don't
know, and in practice that favors momentum: keeping the conversation and the work
moving.[^5] That's one reason a model will sometimes "hallucinate", making things up or
getting things wrong to keep you moving. My rule says: don't infer things just to keep the
project moving. Look things up, check your sources, and make sure what you tell me is
accurate, even if it means we slow down, or stop entirely, before we make a mistake. To my
mind that's one of the most important rules I have.

While this is specific to Claude, every agent tool I've used has had a similar main rules
file, and some have several. OpenClaw even has one called SOUL.md, for the agent's
"persona, tone, and boundaries."[^7] As you might imagine, how the agent uses these files
matters a lot: they guide how it behaves and how it works with you.

Those are global rules. Project rules go in a project's own CLAUDE.md and apply only to
that project. I'm being specific to Claude again, but the other agent tools have some
concept of a project too.[^6] A project rule might be about the programming language
you're using, or point to a document of best practices for Python, Rust or what
have you. Those rules load only into sessions you start inside that project. That's
another way to limit how much of your context window goes to things that aren't your work:
not your prompts, not the output, not the thinking, but the rules that define how the
agent should behave.

I add one more layer to make an even finer point of it. I run sessions on my Windows
desktop and on Linux machines, and the machines differ: some tools exist on the Linux side
that don't on Windows, the paths are different, and so on. So I keep a separate set of
rules for each machine, which lets me tune the agent's behavior to the machine it's
running on. My global CLAUDE.md is the same everywhere: it lives in git, and any change
syncs to every machine. Only the machine file differs, and it sits in a rules folder
inside .claude that Claude Code loads for every project on that machine.

[Next: Definitions, Part 2](/notes/definitions-part-2/)
{: .series-nav}

[^1]: Anthropic's figure is from its glossary; OpenAI's and Google's are from their developer docs. See sources 1 to 3.
[^2]: Claude's help center lists the size for each model; see source 4.
[^3]: Anthropic's docs: on current Claude models, thinking from earlier turns stays in the conversation and counts toward the window; older models dropped it after each turn. The same page says caching "changes what you pay for those tokens, not whether they count." See source 5.
[^4]: Anthropic's Claude Code docs spell this out: you write CLAUDE.md, and what Claude saves on its own is called auto memory. See source 6.
[^5]: Kalai and colleagues argue that the way models are trained and evaluated rewards "guessing over acknowledging uncertainty." See source 7.
[^7]: OpenClaw's docs list SOUL.md alongside AGENTS.md, its operating instructions, both loaded at the start of every session. See source 8.
[^6]: OpenAI's Codex reads a global AGENTS.md plus one per repository, and Google's Gemini CLI does the same with GEMINI.md. See sources 9 and 10.
