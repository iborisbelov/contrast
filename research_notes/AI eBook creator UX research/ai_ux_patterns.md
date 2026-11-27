# UX Patterns and Evidence for Generative-AI Products: Long Waits, Control over Output, Error and Unclear-Input Recovery, Novice Trust

Scope note: These notes cover pattern libraries, guidelines, and research. Shape of AI pattern descriptions below are paraphrased from the site's pattern index unless a specific pattern page is cited. Product examples are named only where a source confirms them; unverified product claims are listed under Gaps.

## 1. Waiting and progress: what keeps users confident and engaged during 30s-3min generations?

### Takeaway
A 30s-3min generation is far past the 10-second attention limit, so a spinner is the wrong tool. The evidence supports specific, step-labelled progress (percent-done or "step X of N"), showing work as it happens (labor illusion / operational transparency), streaming partial output so the first visible content appears quickly, a clear way to stop, and a plan or outline step before the expensive generation. A key design implication for an eBook generator is to break one long opaque wait into a sequence of short, visible, reviewable stages (brief → outline → chapter-by-chapter streaming).

### Cited Findings

**Classic response-time limits (Nielsen Norman Group)**
- 0.1 s feels instantaneous; 1.0 s keeps the user's flow of thought uninterrupted though the delay is noticed; 10 s is the limit for keeping attention on the dialogue. Beyond that, users switch to other tasks. — [NN/g, Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- For delays over 10 s: give feedback on when the computer expects to finish, use a percent-done indicator (preferably a graphic progress bar), give a clearly signposted way to interrupt, and assume users must reorient when they come back. Such delays "are only acceptable during natural breaks in the user's work." — [NN/g, Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/)

**Progress indicators (NN/g)**
- Show a progress indicator for any action longer than about 1 s; with no visible change, most users assume the action was not registered. — [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- Looped spinners suit roughly 2-10 s waits. Past 10 s, users lose patience and may abandon. Percent-done bars suit 10 s or longer. Step-count progress ("Updating address 3 of 50") also works for record-by-record work. Offer a way to stop long tasks. — [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- Avoid static "Loading…" text, since users can't tell whether the system is stuck. Start the animation slower and speed it up near the end. Give a rough time estimate with buffer. Show step counts where possible. — [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/)
- In a University of Nebraska-Lincoln study cited by NN/g, users who saw a moving progress bar were more satisfied and willing to wait about 3x longer than users with no indicator. — [NN/g, Progress Indicators](https://www.nngroup.com/articles/progress-indicators/) (secondary citation; primary study not retrieved)

**Skeleton screens (NN/g)**
- Skeleton screens are wireframe-like placeholders that preview page structure. They are recommended for full-page loads under about 10 s. Over 10 s, use a progress bar with an explicit duration estimate. Use progress bars or wizards, not skeletons, for non-page processes like file conversion. — [NN/g, Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)
- Benefits: they reassure users the page is loading rather than broken, make waits feel shorter as content takes shape, and reduce cognitive load by setting layout expectations. Caveats: avoid "frame-display" skeletons, which give no sense of structure, and use shimmer animation sparingly because of distraction and accessibility issues. — [NN/g, Skeleton Screens 101](https://www.nngroup.com/articles/skeleton-screens/)

**Labor illusion / operational transparency (academic)**
- Buell & Norton (2011, *Management Science* 57(9)) "The Labor Illusion: How Operational Transparency Increases Perceived Value." Across experiments simulating online travel and online dating services, showing the work being done increased perceived value. This runs counter to the conventional expectation that longer waits reduce satisfaction. Perceived provider effort created feelings of reciprocity, which mediated the effect. — [INFORMS / Management Science](https://pubsonline.informs.org/doi/10.1287/mnsc.1110.1376); bibliographic record at [RePEc/IDEAS](https://ideas.repec.org/r/inm/ormnsc/v57y2011i9p1564-1579.html)
- Follow-up: Buell, Kim & Tsay (2017, *Management Science*) "Creating Reciprocal Value Through Operational Transparency." In food service, reciprocal transparency, where customers and staff see each other, was associated with a 22.2% increase in customer-reported quality and 19.2% faster throughput. — [RePEc/IDEAS record](https://ideas.repec.org/a/inm/ormnsc/v63y2017i6p1673-1695.html) (figures from the search-result abstract summary)
- Caution: a marketing glossary claims an "8%-36% lift" from these studies. No primary source was found for that range, so don't cite it. — [Agile Brand Guide (unverified)](https://agilebrandguide.com/wiki/terms/labor-illusion/)

**Generative-AI-specific guidance on waiting (Apple HIG, updated June 2026)**
- "Factor processing time into your design." Generative models typically take longer, so "design a loading experience or generate in the background while a person uses another part of the app." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- "Consider giving specific, reassuring feedback during generation." Instead of "Processing…", use messages like "Summarizing key themes from your notes." Apple says specific feedback "reduces uncertainty and makes waiting feel purposeful." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple's change log notes that guidance on "providing feedback during content generation" was added June 8, 2026, so this guidance is very recent. — [Apple HIG, Generative AI (change log)](https://developer.apple.com/design/human-interface-guidelines/generative-ai)

**Streaming and time-to-first-visible-output**
- Practitioner sources agree that time to first token (TTFT) is what users experience as "the wait." Users judge responsiveness mostly by when the first content appears, not when the whole answer finishes. — [Redis blog, Streaming LLM responses](https://redis.io/blog/streaming-llm-responses); [Syncfusion, AI streaming UX](https://www.syncfusion.com/blogs/post/ai-streaming-ux-generative-ui)
- A fast first token doesn't guarantee a responsive feel if there is a long preamble or the front end delays rendering. Track "time to first visible content" and "time to useful content" separately. A blank screen leads users to assume the request was lost. — [Redis blog, How to improve LLM UX](https://redis.io/blog/how-to-improve-llm-ux-speed-latency-and-caching.md)
- Academic work on streaming quality of experience (Andes) argues that target TTFT should depend on the service, either constant or proportional to prompt length. — [Andes, arXiv 2404.16283](https://arxiv.org/pdf/2404.16283)
- Caution: claims that streaming feels "40% faster" or "10-20x" faster circulate in blogs without a primary source. Don't cite them. — (noted from the same search; no primary source found)

**Plan-first / outline-first generation (progressive generation)**
- Shape of AI's "Action plan" pattern has the AI outline its intended steps before running so users can confirm or adjust. It is recommended for compute-heavy or hard-to-undo tasks such as "generating a presentation." In "contractual" mode, the user must approve before execution. In "advisory" mode, the plan is shown as a progress guide. — [Shape of AI, Action plan](https://www.shapeof.ai/patterns/action-plan)
- Named examples: Gamma shows an outline and requires confirmation before generating slides. Chronicle, a presentation generator, uses the contractual path. Claude Projects mode surfaces steps before generating text. Replit and Devin pause execution previews for confirmation. Zapier shows a workflow outline in AI Drafting mode. Cursor makes the plan optional. Perplexity Labs uses adaptive plans. — [Shape of AI, Action plan](https://www.shapeof.ai/patterns/action-plan)
- Design considerations: show the plan before spending compute; keep it scannable with expandable steps; let users edit specific errors in the plan instead of regenerating it all; let experts collapse or skip it; make sure execution follows the plan or explains any deviation. — [Shape of AI, Action plan](https://www.shapeof.ai/patterns/action-plan)
- Gamma's own guide says its agent asks about audience, goal, and length, then proposes an outline that users can add to or cut before the deck is built. — [Gamma guide: turn an outline into a deck](https://gamma.app/explore/content/guides/how-do-i-turn-my-outline-into-a-deck-using-ai)
- A third-party walkthrough argues the outline is the cheapest place to fix structure: renaming a title there "takes seconds," versus manual editing after generation. — [MindStudio, Gamma walkthrough](https://www.mindstudio.ai/blog/create-professional-ai-presentation-gamma-under-10-minutes) (third-party)
- Other Shape of AI patterns relevant to waits: "Stream of Thought" reveals reasoning, tool use, and decisions; "Shared vision" gives live visibility into AI actions on a shared canvas; "Controls" manages information flow or pauses a request mid-stream; "Footprints" lets users trace the AI's steps from prompt to result. — [Shape of AI pattern index](https://www.shapeof.ai/); [Stream of Thought](https://www.shapeof.ai/patterns/stream-of-thought); [Controls](https://www.shapeof.ai/patterns/controls)

### Inferences
- For an eBook generator (likely 30s-3min end-to-end), the NN/g >10 s rules apply directly. Use a determinate, step-based indicator ("Writing chapter 3 of 8: 'Budgeting basics'") rather than a spinner, add a rough time estimate with buffer, and include a visible Stop or Pause control.
- Combine labor illusion with Apple's "specific feedback" guidance. Status lines should describe real work ("Drafting chapter 2 intro", "Choosing a cover palette") rather than generic messages. They should reflect actual pipeline stages, not fake theater.
- Outline-first approval turns one long wait into two shorter, natural breaks (brief → outline ~seconds; outline → book). It also gives the user a meaningful task during the first wait: reviewing and editing the outline. This matches NN/g's advice that long delays belong at "natural breaks."
- Streaming chapters into a live book preview (skeleton pages that fill in) gives early visible output. That makes it the main engagement mechanism, because users can start reading chapter 1 while chapter 5 is generating.
- Because users will likely switch tabs during multi-minute waits (NN/g), a completion notification (tab title or badge) and a "where was I" re-orientation summary on return are warranted.

### Gaps
- No peer-reviewed study was found that specifically measures engagement or abandonment for 30s-3min LLM generation waits, or compares streaming against progress bars for generative output.
- I could not retrieve the full Buell & Norton paper, so boundary conditions are unconfirmed: for example, whether transparency stops helping when waits get very long, when the outcome is poor, or when the displayed effort looks fake.
- Primary sources for ChatGPT, v0, Lovable, and Claude artifacts progress and streaming UIs were not retrieved. Product claims about them here would be unverified.
- The University of Nebraska-Lincoln "3x longer" progress-bar study is cited only via NN/g; the primary paper was not checked.

## 2. Control over AI output without starting over

### Takeaway
Guidelines from Apple, Microsoft HAX, and NN/g converge: keep controls (Edit, Undo, Retry, Adjust) next to the generated content, let users change part of an output without regenerating the whole, offer preset transformations (shorter, simpler, change tone) and variations to compare, never overwrite the original without confirmation, and steer before generation with an approvable plan or outline. NN/g's observed "accordion editing" and "apple picking" behaviors show what goes wrong without scoped controls.

### Cited Findings

**Guidelines**
- Apple: "Make it easy for people to refine or revert generated results, and acknowledge when their corrections take effect." Surface "controls like Edit, Undo, Retry, or Adjust near generated content," and give a clear signal when an adjustment had an effect. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "Keep people in control." Give people "the ability to dismiss new content they don't want, and revert or retry content transformations." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "Consider offering alternate versions of results." Offering choice "can give them a greater sense of control and help bridge the gap between the model's interpretation and what someone actually wants." Example: Image Playground. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Microsoft HAX Guidelines for Human-AI Interaction (Amershi et al., CHI 2019, Honorable Mention) include G7 "Support efficient invocation," G8 "Support efficient dismissal," G9 "Support efficient correction" (make it easy to edit, refine, or recover when the AI is wrong), G12 "Remember recent interactions," G15 "Encourage granular feedback," and G16 "Convey the consequences of user actions." — [HAX Design Library](https://www.microsoft.com/en-us/haxtoolkit/library/); [Microsoft Research publication page](https://www.microsoft.com/en-us/research/publication/guidelines-for-human-ai-interaction/)

**Observed user behavior (NN/g)**
- NN/g ran a qualitative study with 8 participants using ChatGPT-3.5 in 90-minute sessions. It identified "accordion editing," where users repeatedly ask the AI to shrink (forced ranking, word-count cuts) or expand (elaborate, add missing content) an output to reach one goal. — [NN/g, Accordion Editing and Apple Picking](https://www.nngroup.com/articles/accordion-editing-apple-picking/)
- "Apple picking": users reference parts of earlier responses in new prompts by typing or pasting them, which is laborious. Long chat histories caused scrolling, getting lost, and difficulty comparing versions. Most participants finished their work outside the chatbot. — [NN/g, Accordion Editing and Apple Picking](https://www.nngroup.com/articles/accordion-editing-apple-picking/)
- NN/g recommendations: compartmentalization (edit only part of a response and keep the rest), direct inline editing without a new prompt, and point-to-select to target a location. — [NN/g, Accordion Editing and Apple Picking](https://www.nngroup.com/articles/accordion-editing-apple-picking/)
- NN/g defines "prompt controls" as UI components around the input (buttons, toggles, cards, menus) that speed up prompting, clarify ambiguity, and inspire. — [NN/g, Adding UI Controls to Prompting](https://www.nngroup.com/articles/prompt-controls-genai/) (from search excerpt; full article not fetched)

**Pattern library (Shape of AI)**
- Variations comes in three forms. **Branched** variations are a grid of options, often four, from a shared seed (Midjourney, Krea, Canva, Adobe Firefly). **Convergent** variations let the user pick one and merge it into the main content (Copy.ai, GitHub Copilot). **Preset** variations apply set transformations, such as more professional or casual, or more concise or detailed, shown together for comparison (Grammarly, Writer.com). — [Shape of AI, Variations](https://www.shapeof.ai/patterns/variations)
- Variations design considerations: put actions (select, merge, branch) on the variant itself; allow regenerating a new set in place; store the parameters with each variant for traceability; and "never overwrite the original output without confirmation." — [Shape of AI, Variations](https://www.shapeof.ai/patterns/variations)
- Other scoped-control patterns: **Inline action** (ask the AI about content already on the page), **Inpainting** (target specific areas of a result to regenerate or remix), **Regenerate** (reproduce without new input), **Expand**, **Restructure**, **Restyle** (transfer style without changing structure), **Preset styles**, **Voice and tone** (keep outputs consistent with a chosen voice), **Branches** (iterate while keeping visibility of the original), and **Draft mode** (explore cheaply before final). — [Shape of AI pattern index](https://www.shapeof.ai/); e.g. [Inpainting](https://www.shapeof.ai/patterns/inpainting), [Inline action](https://www.shapeof.ai/patterns/inline-action), [Branches](https://www.shapeof.ai/patterns/branches)
- Steering before generation: **Action plan** lets users "edit specific errors in the plan instead of regenerating the whole thing" (Gamma outline confirmation). **Sample response** confirms user intent for complex prompts. — [Shape of AI, Action plan](https://www.shapeof.ai/patterns/action-plan); [Shape of AI index](https://www.shapeof.ai/)

**Real-product examples**
- Notion AI: highlight text, choose "Edit with AI," then use a prompt such as fix grammar, make it shorter, or change the tone, and accept, discard, or retry. Older guides list presets: Improve writing, Make shorter, and Change tone (Professional, Casual, Straightforward, Confident, Friendly). — [Notion Help, Notion AI for docs](https://www.notion.com/help/guides/notion-ai-for-docs); preset list via [eesel.ai (third-party)](https://www.eesel.ai/blog/notion-ai-improve-or-rewrite-content)
- Anecdotal criticism: users report that Notion's "Improve writing" can sound robotic. This comes from one vendor blog. — [eesel.ai](https://www.eesel.ai/blog/notion-ai-improve-or-rewrite-content)
- Gamma: outline confirmation before slide generation, and the generated deck opens in a full editor for reordering and text edits. — [Shape of AI, Action plan](https://www.shapeof.ai/patterns/action-plan); [Gamma guide](https://gamma.app/explore/content/guides/how-do-i-turn-my-outline-into-a-deck-using-ai)
- Academic: "Promptions" (Microsoft Research) automatically generates prompt options and refinement controls from the user's input, which users adjust in real time. — [Microsoft Research, Promptions](https://www.microsoft.com/en-us/research/?p=1157824) (from search excerpt)

### Inferences
- For an eBook, the natural scopes of control are book, chapter, section/paragraph, and selected text. Each scope should offer Regenerate, preset rewrites (Shorter, Simpler, More examples, Change tone), and free-text "Tell AI what to change." This directly removes NN/g's accordion editing and apple picking pain.
- Accept/Reject (or Keep / Try again / Undo) on every AI change, plus never overwriting without confirmation (Shape of AI) and visible acknowledgement that the change applied (Apple), together form the minimal control contract.
- Version history per chapter, or at least "previous version" switching, implements HAX G9 (efficient correction) and the Branches pattern without overwhelming novices.
- Outline approval is the highest-leverage control: it is cheap, it happens before the expensive work, and Shape of AI explicitly lists presentation generation (Gamma, Chronicle) as the canonical case.

### Gaps
- No primary sources were retrieved for Google Docs Gemini ("Help me write" refine options), Canva Magic Write, Grammarly's rewrite UI, or Midjourney's Vary/Upscale buttons. The only confirmation is Shape of AI's brief product mentions for Grammarly, Midjourney, and Canva.
- No quantitative evidence was found that scoped regeneration improves satisfaction or task time versus full regeneration. The support is qualitative (NN/g, n=8) plus guidelines.
- The full NN/g "prompt controls" article was not fetched; only the search excerpt was used.

## 3. Error and unclear-input handling

### Takeaway
Treat ambiguity as a design state, not a failure. Ask brief clarifying questions before compute-heavy work, coach users toward better requests with example prompts, and when something fails, say specifically what happened in plain language, preserve the user's input and work, and offer a concrete next step. Google PAIR adds "context errors," where the AI misreads intent, and stresses giving control back with enough context to proceed.

### Cited Findings

**Clarifying questions / follow-ups**
- The Shape of AI "Follow up" pattern uses prompts, questions, or inline actions to refine the first interaction so the model better understands intent. It is used "before generating" for deep research or other compute-heavy tasks to confirm intent and avoid wasted work, and especially early in the user lifecycle when the AI knows least. — [Shape of AI, Follow up](https://www.shapeof.ai/patterns/follow-up)
- Follow-up design considerations: anchor to what just happened; explain the connection ("You could also ask…"); keep the list short; offer one or two "zoom in" options and one "zoom out"; separate follow-ups visually from the output. Named example: Perplexity. — [Shape of AI, Follow up](https://www.shapeof.ai/patterns/follow-up)
- HAX G10 "Scope services when in doubt": clarify the user's goals or gracefully reduce services when uncertain. — [HAX Design Library](https://www.microsoft.com/en-us/haxtoolkit/library/)
- Apple advises asking people for needed information rather than inferring it, and to "seek clarity before making assumptions" in its inclusion guidance. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Gamma's agent asks about audience, the decision you want, and length before proposing an outline. — [Gamma guide](https://gamma.app/explore/content/guides/how-do-i-turn-my-outline-into-a-deck-using-ai)

**Coaching after blocked or poor results**
- Apple: "Help people improve requests when blocked or undesirable results occur." Coach people to succeed next time and offer "example requests that might lead to better results." For example, Image Playground says "Unable to use that description." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "If something goes wrong, describe what happened in plain language and offer a clear next step." Also test with "requests that are poorly phrased, vague, or ambiguous." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "Ensure a great experience even when generative features aren't available," and consider a non-AI fallback where possible. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)

**Google PAIR: Errors + Graceful Failure**
- PAIR distinguishes three error types. User errors and system errors are the familiar two. **Context errors** occur when the AI makes wrong assumptions about what the user wants. These are often "true positives" in which the system works as designed but its behavior is unexplained. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- **Failstates**, where there is no valid output, should tell users specifically what the system can't do. Input errors: check against expected answers, offer confirmation. Relevance errors: explain why no result appeared, suggest alternatives, and collect feedback. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- Paths forward: offer a reasonable alternative, as a waiter does when a dish is unavailable; "return control to the user" with context and next steps; make failure safe and routine. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- Tone: "be human, not machine." Admit mistakes, explain limits, invite the user to continue, and use error states to explain what inputs the AI needs. New users tolerate irrelevant results more readily than long-term users, and stakes are higher for novices. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- Feedback: offer feedback options in error messages and alongside correct outputs; ask what users expected; prompt for feedback when outputs are repeatedly rejected. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)

**General error-message guidelines (NN/g)**
- Visibility: place the error next to its source; use high-contrast styling and icons, not color alone; match prominence to severity (inline or banner for minor issues, modal only for serious ones). — [NN/g, Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- Communication: use plain language and hide error codes; state the specific problem ("An error occurred" is useless); explain how to fix it; stay non-blaming and avoid "invalid" or "incorrect"; skip humor. — [NN/g, Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
- Efficiency: catch likely mistakes before submission; **preserve the user's input** so they can fix rather than start over; suggest likely fixes users can select. — [NN/g, Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)

**Interruptions and partial failures**
- NN/g: for long operations, give a clearly signposted way to interrupt, and expect users to need reorientation on return. — [NN/g, Response Times](https://www.nngroup.com/articles/response-times-3-important-limits/)
- Shape of AI "Controls" covers pausing or stopping a request mid-stream. — [Shape of AI index](https://www.shapeof.ai/); [Controls](https://www.shapeof.ai/patterns/controls)
- Infrastructure note: reverse proxies such as Nginx and Cloudflare buffer responses by default, which can break streaming. This silent failure makes a request look hung. — [Redis blog, How to improve LLM UX](https://redis.io/blog/how-to-improve-llm-ux-speed-latency-and-caching.md)

### Inferences
- For vague briefs ("a book about money"), use 2-4 tappable clarifying questions (audience, goal, length, tone) with smart-default answers pre-selected. This follows Shape of AI's Follow up, HAX G10, and the Gamma precedent, and it doesn't block users who want to "just go."
- Partial failure: because chapters are generated as independent units, a failed chapter should show an inline error on that chapter card ("Chapter 4 didn't finish. Retry this chapter") while completed chapters stay intact. This applies NN/g's "preserve user input" and PAIR's "return control" at the chapter level.
- Autosave and resume follow from NN/g's reorientation advice and Apple's background-generation advice. The draft and its progress should survive tab close or network loss, with a "Resume generation" state.
- Error copy for AI states should follow NN/g plus Apple: say what happened in plain language, give one primary next step (Retry or Edit brief), and include an example of a better request where input caused the issue.

### Gaps
- No primary-source documentation was found on how specific products (ChatGPT deep research clarifying questions, Lovable or v0 build failures) handle partial failure or resume. The ChatGPT deep research clarifying step is widely reported but was not verified here.
- No quantitative data was found on clarifying questions versus direct generation (e.g., satisfaction, rework rates).

## 4. Trust and onboarding for novices

### Takeaway
Novices face a blank-canvas problem and an unclear mental model. The guidance is consistent: show what the AI can and can't do, provide curated examples, suggestions, and templates, offer a low-stakes "randomize" entry, restate or preview the AI's understanding before committing (sample response or plan), disclose AI involvement and limits (including hallucination risk), and provide lightweight feedback.

### Cited Findings
- Apple: "Set clear expectations about what your AI-powered feature can and can't do." For open-ended prompts, "consider offering curated suggestions that make it easy to get started." If there are known limitations, tell people up front, "show them how to get good results, and explain why inferior results occur." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "Guide people on how to use your generative feature," for example with "diverse, predefined example inputs that hint at what's possible." — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: clearly communicate that "AI-generated content may contain errors." Hallucinations can look convincing, so scope requests and avoid asking for facts the model can't verify. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- Apple: "Let people share feedback on outputs." Keep it voluntary and non-interruptive, for example with thumbs up and down plus an optional detailed path. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)
- HAX G1 "Make clear what the system can do" and G2 "Make clear how well the system can do what it can do." Also G11 "Make clear why the system did what it did." — [HAX Design Library](https://www.microsoft.com/en-us/haxtoolkit/library/)
- Shape of AI "Wayfinders" help users write a first prompt. They include **Example gallery** (sample generations, prompts, and parameters to teach and inspire), **Suggestions** (clues to ease the blank-canvas problem), **Templates** (structured forms the user or AI fills), **Randomize** ("a low bar and fun results"), **Initial CTA** (a large open input), and **Nudges** (point out available actions, especially for new users). — [Shape of AI index](https://www.shapeof.ai/); [Templates](https://www.shapeof.ai/patterns/templates); [Randomize](https://www.shapeof.ai/patterns/randomize); [Suggestions](https://www.shapeof.ai/patterns/suggestions)
- Shape of AI "Sample response" confirms user intent for complex prompts. "Prompt details" shows what happens behind the scenes. Trust builders include **Caveat** (disclose limitations), **Disclosure** (mark AI content), and **Footprints** (trace steps from prompt to result). — [Shape of AI index](https://www.shapeof.ai/)
- Google PAIR: proactive recommendations should come only when the AI is highly confident of the user's context. Stakes are higher for novices. — [Google PAIR, Errors + Graceful Failure](https://pair.withgoogle.com/chapter/errors-failing/)
- Apple: small input changes, or the same input repeated, can produce very different outcomes. This argues for making iteration easy and expected. — [Apple HIG, Generative AI](https://developer.apple.com/design/human-interface-guidelines/generative-ai)

### Inferences
- "Restating intent" can be implemented as a brief summary card before outline generation ("You're making a 10-chapter beginner guide to personal budgeting for young parents, friendly tone"). This combines Sample response, HAX G11, and the Follow up pattern, and it is the cheapest point to catch context errors (PAIR).
- A template or example gallery of finished eBooks (by genre) plus a "Surprise me" topic button lowers the blank-canvas barrier for non-writers (Wayfinders), and smart defaults avoid forcing decisions the novice can't make yet.
- Light caveats ("Check facts before publishing") at the export or review step satisfy Apple's hallucination guidance without undermining confidence during creation.

### Gaps
- No controlled study was found quantifying how much templates, examples, or "surprise me" increase completion or confidence for first-time generative-AI users.
- Google PAIR's "Mental Models" and "Explainability + Trust" chapters were not fetched. Only the Errors chapter was reviewed.
- Specific product onboarding flows (Canva Magic Write starter prompts, Gamma example gallery, ChatGPT starter chips) were not verified against primary sources.
