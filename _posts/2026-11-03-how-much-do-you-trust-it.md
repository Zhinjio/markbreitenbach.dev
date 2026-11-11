---
layout: post
title: "How much do you trust it?"
date: 2026-11-03 21:50 -0700
tags: [faq, validation]
summary: "I don't. That's the point of the whole operating model."
sources:
  - title: "DHH: Future of Programming, AI, Agentic Engineering, Vibe Coding & Linux (Lex Fridman Podcast #501), segment 8:44 to 10:15"
    by: Lex Fridman, with David Heinemeier Hansson
    url: https://www.youtube.com/watch?v=NYFGCESmikA&t=524
    date: 2026-08-26
    accessed: 2026-10-28
---

One of the questions I've been asked more than once is "how much do you trust it?" I'd like to break that into two questions, because they have different answers. The short answer, when you start this journey, is: you don't. Now I have to qualify that.

## Do you trust it to write good code?

This one has evolved over time, and one of the formative moments for me was an interview Lex Fridman did with David Heinemeier Hansson, the creator of Ruby on Rails and, more recently, Omarchy.[^1] I'll paraphrase the part that mattered to me. They were talking about the progress agents had made over the previous year or so, and he pointed to the release of Opus 4.5, around December 2025, as the turning point. Before that, by his own account, there was a lot of hand-holding: a lot of review, a lot of things it didn't produce accurately, code that didn't meet his standards. After it, his claim was that if that had been the last model anyone released, he'd have been happy. It was producing code that, with a few small notes about the approach, he wanted to merge. Code he'd be proud to ship. Code that looked beautiful to him.

He was talking specifically about Ruby, but this is a person who is, at least in some circles, acknowledged as one of the best producers of elegant code in the world. When he said that, it said something to me.

That was the point where my own answer changed. Do I trust it to write good code? Yes. But more to the point, I don't have to, because there are systems you can put in place to do the checking for you, so that you're no longer reviewing every line of code it writes. And frankly, the game I'm building is roughly 17,000 lines of code now, built against 16,000 lines of design and governance documentation. There is no way I could have produced all of that in the couple of months that active code has been written. No way.

So there was a point in this evolution where I had to let go a little. I went from the early stage, where I reviewed every line, to where I am now, where I don't review the code itself at all. I instead review the results of the tests run against it. That is a notable difference, and it's the whole answer to the first question: trust built over several months of good output, validated by the testing harness, by the subagents that audit the results, by checking the code against the design it was supposed to implement. And it's only getting better, as the models improve and as the tooling for testing their output improves with them.

## Do you trust it with access?

That's the other half, and the answer is different. The framework you use, Claude Code in my case, starts out very limited in what it allows the agent to do. The first time you start it, everything is manual. You grant it access to a single directory. It can't write a file without asking. It asks permission for every action it takes, and if you don't grant it, it doesn't happen. It tells you the command, you authorize it, it runs it, it reports the result.

That's a limited model, and not an efficient one. But if you're in that early, skeptical phase, it is exactly the right place to start, because it lets you see every action it takes, and that's how the trust gets built.

Eventually, and this is where I am now, you switch to an automatic mode: you grant it full permissions in a single directory, where it can read, write, and run the commands you've given it access to, and you define a set of rules it must operate by. One of mine, for example, is that it never runs a delete across a range of files. There is no such thing as `rm -rf *` in my shop; it simply won't do it, because I've forbidden it in the standing rules it must follow. How you write those rules, and how much the quality of that guidance matters, is a whole note of its own, and I'll get to it. But it's a big part of what establishing trust means in practice.

## The junior engineer

To draw a human parallel, think about what you'd do as a manager with a junior engineer who just started. Do you hand them the keys to the kingdom? Of course not. There's a progression. You start them on projects that let them demonstrate what they can do. You give them access to more resources as they go. You let them show their competence, their judgment, their ability to solve problems and reach good outcomes. They make mistakes, and you build frameworks around how to keep those mistakes from happening again.

This isn't any different. You start in an environment with no trust, and you build it progressively, until the agent has the access it needs to do the job well and efficiently.

So that's how I answered it. Do I trust it to write good code? Yes, proven over months and validated by tooling. Do I trust it with access? Only as far as I've extended it, one directory and one rule at a time, and that part will keep evolving too. I'll write up how I manage it, and the gotchas, separately.

[^1]: The segment runs from about 8:44 to 10:15; see source 1 below. I'm paraphrasing, not quoting. And I do recommend watching the whole interview. Fascinating stuff. David is a somewhat polarizing figure for some, so take that for what it's worth, but his competence and bona fides for this particular subject matter, I think, are unquestionable.
