---
layout: post
title: "Measuring drift"
date: 2026-11-18 00:48 -0700
tags: [validation]
summary: "A persona harness, baseline scores, and the call between intentional change and a bug."
sources:
  - title: "Test harness"
    by: Wikipedia
    url: https://en.wikipedia.org/wiki/Test_harness
    archive: https://web.archive.org/web/20261118061556/https://en.wikipedia.org/wiki/Test_harness
    accessed: 2026-11-17
  - title: "Testing legacy code with Golden Master"
    by: Sandro Mancuso, Codurance
    url: https://www.codurance.com/publications/2012/11/11/testing-legacy-code-with-golden-master
    archive: https://web.archive.org/web/20261118061717/https://www.codurance.com/publications/2012/11/11/testing-legacy-code-with-golden-master
    accessed: 2026-11-17
  - title: "Characterization Testing"
    by: Michael Feathers
    url: https://michaelfeathers.silvrback.com/characterization-testing
    archive: https://web.archive.org/web/20261114031954/https://michaelfeathers.silvrback.com/characterization-testing
    accessed: 2026-11-17
---

When I was at eBay, we had an internal tool that let the NOC and the troubleshooting staff monitor the performance of every API call anywhere on the site. At first glance you might say that's an incredible amount of overhead to carry, and that building a thing like that is a lot of tooling to maintain, and you'd be right. It took a significant bite out of the site's resources; from memory, something like a 15 percent increase in the server capacity we needed, just to accommodate the monitoring.

What it bought us was this: after any code roll, we could check whether any API call on the site had suddenly started behaving outside its normal boundaries. If creating a listing, which involved several calls, was now taking 15 milliseconds on average where it had been taking 8 before the roll, we knew something significant had changed. That by itself, without any further troubleshooting, could be enough to roll the code back and ask the developers whether they had properly assessed the impact of what they'd changed.

So how does this relate to agents and what I'm doing now?

I wanted to understand the impact that the changes I was making to the code were having on the way players progress through the game. So fairly early on I established a testing harness,[^harness] and it became a release gate: you don't release until the harness has been run, the results have been analyzed, and every anomaly has been ruled either intentional or a bug we need to fix. That ruling is mine. The agents can run the harness and analyze the results, but they aren't allowed to change a baseline or sign off on drift.

The harness is built on personas. Each persona is a type of player who reaches the game's milestones in a particular way. Some players are min-maxers; we call that the champion persona. Some are idle players who play for a couple of hours a day and leave the game off the rest of the time. Some keep the game running in the background all day but actively play maybe an hour. Each of those became a persona.

The harness simulates play for each persona with accelerated time. A play hour becomes a minute, or ten seconds, which lets it simulate weeks or even a month of play and measure how quickly each persona reaches each milestone. Those numbers become that persona's baseline scores. I've done this kind of testing before in my career, but I'm not sure I ever knew what it was called. After a bit of digging, I found a couple of sources I can point to for further reading, where it goes by "golden master testing"[^gm] or "characterization testing."[^ct]

For example, suppose the champion persona's recorded baseline for reaching the first milestone is one simulated play day. If I make a code change ahead of a release, run the harness, and the champion now takes two play days to reach it, I need to go back and think hard about whether that change was intentional.

In some cases it's decidedly intentional and I know about it ahead of time. Then the reason I'm running the harness against the new code isn't to compare against the old results at all; it's to establish a new baseline, because I already know play is going to change in that way. That's why it was important to build the harness very early: analyzing drift only makes sense if you have a span of time to analyze it over.

The personas grow over time. I started with one, had six by the end of day two and I'm up to ten now. One of them is even modeled on one of my beta testers. I won't name names, but he tends to play outside the normal boundaries of expected behavior. He's intentionally trying to break the game's mechanics, which is the absolute best kind of beta tester you can have. He played the game in ways I had not predicted, would not have chosen, and would not have considered normal, and as a result he uncovered a variety of bugs that needed fixing. So his persona in the harness now does some aberrant things, mostly to make sure that the fixes I put in for those bugs stay fixed.

The other aspect you can change over time is what metrics are measured. The harness has gone from just measuring milestone reach time to also measuring deaths, stalls per hour, raid pressure, where the persona reaches a "wall" in the content with that playstyle, etc. I've also switched from each persona carrying a single set of numbers to a grid: each persona is now measured across several play modes, like "always on" and "weekend."

It is perhaps worth mentioning that this can't measure "fun", or if you're developing an application, it may be an entirely different set of metrics. Is the application usable? How intuitive is the interface? How easy is it to navigate between functional areas? The harness will probably never be able to provide those answers. The intent is *not* to replace human testing. That will, for the moment anyway, remain valuable in myriad ways. It's also important to note that my own playthroughs, or a single tester's report, are a much less reliable measure than the harness. "The game feels slower" might be good insight, but it suffers from the N=1 fallacy, and a person's intuition, right or wrong, won't be as precise or as grounded in long history as what the harness provides. That doesn't mean it should be ignored; intuition is a strong force.

So what value has it provided so far? A quick search of my history shows three times the harness changed a release decision in a way nothing else would have. One example: after one set of changes, the harness showed the baseline moving for every persona that reached a Breakthrough, the game's transition from one geologic stratum to the next, and nothing in those changes should have touched it. Digging in turned up a small accounting error: a bit of a player's progress was being lost at every Breakthrough. Players had never noticed, because it was too small to feel. A small bug, but one that would never have been found by hand.

So to summarize: the harness gives you a set of baseline scores to measure against before every release. Grow or shrink the personas and metrics as the game changes. When you know a change will move the numbers, run the harness to cut a new baseline. When the numbers move and you didn't expect it, don't ship until you know why. How much drift is acceptable depends on changes you made. Maybe 10 percent is fine, and 20 percent isn't. That's a call you make as you're evaluating the results, maybe from the perspective of an architect, test engineer or product manager. That's the release gate in action: it doesn't ship until you're comfortable with the results.

This was a significant effort. It took at least a couple of weeks of my time, with agents working on it every day, or at least part of every day, building the personas and the harness and capturing the baselines. That's my version of eBay's 15 percent: a real cost, paid up front, for the ability to see drift at all. And I'll say it again: the earlier you do this, the better off you'll be, because drift is only measurable against history, and history only accumulates if you started recording it.

[^harness]: Wikipedia's definition is narrower than mine: "a collection of stubs and drivers configured to assist with the testing of an application or component." Mine simulates whole playthroughs. See source 1.
[^gm]: Sandro Mancuso, writing for Codurance in 2012: record a system's outputs for a fixed set of inputs, then compare later runs against that recording. See source 2.
[^ct]: Michael Feathers coined "characterization test" in *Working Effectively with Legacy Code*. His 2016 post describes writing tests that record what existing code actually does. See source 3.
