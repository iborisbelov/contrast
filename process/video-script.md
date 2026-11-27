# Folio — video walkthrough script (≤ 5:00)

Речь — на английском (её говорите). Действия на экране — в [квадратных скобках].
Темп ~140 слов в минуту. Баланс: **research ~1:15 · demo ~2:00 · process & AI ~1:20**, итого ~4:50.

---

## Подготовка (до записи, 10 минут)

1. Браузер на весь экран, 1440×900 или больше, масштаб 100%, лишние вкладки и закладки скрыть.
2. Вкладки по порядку:
   - **Tab 1:** https://borisbelov.com/dev/contrast/#/process
   - **Tab 2:** https://github.com/iborisbelov/contrast/blob/main/reports/AI%20eBook%20creator%20UX%20research.md (отчёт исследования)
   - **Tab 3:** https://borisbelov.com/dev/contrast/ — чистый старт (если там книга: Start over).
   - **Tab 4 (заготовка сбоя):** в окне инкогнито пройдите пример «Sourdough for busy people» до шага Write и дождитесь, пока глава 5 покажет «didn’t finish». Не нажимайте Retry.
   - **Tab 5:** https://github.com/iborisbelov/contrast/blob/main/process/ai-process-log.md (журнал работы с AI)
3. Один раз пройдите свою тему в Tab 3 «вхолостую», чтобы прогреть Groq, затем Start over.
4. Запись: Loom (экран + голос, камера в кружке по желанию).
5. Если генерация идёт дольше, чем вы говорите, — продолжайте говорить: ожидание без спиннера и есть демонстрация.

---

## 0:00 – 0:15 · Hook
[Tab 3, первый экран Folio]

> Hi Oran, I’m Boris. This is Folio — a tool that turns what someone knows into a finished, designed eBook, for people with no writing or design background. I’ll start with the research, then the product, then how I worked with AI to get here.

---

## 0:15 – 1:30 · Research (≈1:15)

### What I asked and where I went (0:15 – 0:40)
[Tab 1, секция «Talking to the client»]

> I treated you as the client. I asked who the user is — you said anyone: a creator, a coach, anybody — and why people give up on tools like this. You asked me to research it, so that question became the spine of the research.
> I ran four tracks in parallel: a competitor teardown, with Designrr in depth because it’s one of your case studies; real user reviews from Trustpilot, AppSumo and forums; established AI UX guidance from Nielsen Norman, Apple, Microsoft and Google; and cover and typography practice.

[Tab 2, отчёт — медленно прокрутить заголовки разделов]

> Everything is in one cited report. I kept sourced findings separate from my own inferences, and dropped statistics I couldn’t verify.

### What I learned and what it changed (0:40 – 1:30)
[Tab 1, таблица «Research → decisions» — веди курсором по строкам, пока говоришь]

> Five things changed the design.
> One: novices get lost when a tool asks for format and template before any content exists. So Folio asks nothing about design up front — the book appears on the desk from the first answer.
> Two: after pricing, the loudest complaint is “the AI ignored what I asked”, or “it said it changed something and didn’t.” So every AI change is highlighted, versioned and undoable, and the co-author can only make changes you can see.
> Three: authors are embarrassed when a book sounds like AI. So I ask for something only they know, and the AI never invents their story.
> Four: choosing a “tone” by its name is abstract for non-writers. So you choose by reading sample lines written about your own topic.
> Five: past about ten seconds, a spinner kills confidence, and showing the work raises perceived value. So the outline and cover come first, and chapters stream in while you read.
> Let me show you those decisions in the product.

---

## 1:30 – 3:30 · Product demo (≈2:00)

### Questions (1:30 – 2:00)
[Tab 3. Напечатайте: **Yoga for runners who sit at a desk all day** → Continue → выберите читателя → на тоне задержитесь → выберите → длина → на «Anything only you know?» нажмите тег «My routine looks like this:» → Continue → Looks right]

> One sentence to start. Then one question per screen — this is real AI on Groq, so readers and voice samples are written for my topic. I pick the voice by reading it, add something only I know, confirm a summary.

### Title, plan, writing (2:00 – 2:30)
[Выберите другое название — покажите, как меняется обложка → Next: the plan → Write my book → покажите печать главы 1 и статусы]

> The cover updates as I pick a title; the plan is editable before anything is written. Then no spinner: cover first, chapters stream into a live contents page, and chapter one is readable while the rest is written.

### Control without starting over (2:30 – 2:55)
[Кликните абзац → Shorter → Try another → Undo. Вкладка Cover: смените композицию и палитру]

> Any paragraph can be rewritten — highlighted, kept in history, keep, try another or undo. The cover is a system, not a template: the topic picked this motif, and I can change composition, colour, type, or upload my own image.

### Failure, designed in (2:55 – 3:10)
[Tab 4 → Retry this chapter]

> Failure is local: one chapter didn’t finish, the others are safe, I retry just that one. Unclear ideas get clarifying options, and the book is autosaved.

### Finish and share (3:10 – 3:30)
[Tab 3 → Finish book → Copy share link → Save to library → откройте книгу на полке, перелистните страницу]

> A real PDF, a share link that opens the book for anyone without an account, and a library where you read it like a real book.

---

## 3:30 – 4:50 · Process & how I worked with AI (≈1:20)

### Method (3:30 – 3:55)
[Tab 1, «How it evolved» — кликните карточку 1 (три флоу), закройте, затем карточку 5 (варианты брифа)]

> My method was spike first. Instead of arguing about flows in documents, I had AI build three clickable prototypes in an hour — a wizard, a chat, and a “growing book” — and compared them by feel. I merged the best of each. Later I built four variants of the brief screen side by side; “one question at a time” won, and I made it the rule everywhere.

### Where AI helped, where it fell short, where I decided (3:55 – 4:35)
[Tab 1, таблица «How I worked with AI», затем Tab 5 — журнал, прокрутить]

> AI was in every stage, not a final polish: research agents in parallel, prototypes, a UX audit against my visual references, the React build, and the real AI integration.
> It was fastest at breadth — a hundred sources and three prototypes in the time I’d normally write one brief.
> It fell short in ways I only caught by clicking through: a screen animation that crashed the whole app, a model name that had been retired, layouts that broke at laptop and phone widths. Each one is logged here with the fix — and each crash made the product sturdier: an error screen, autosave, offline fallbacks.
> My judgment took over on direction: which variant wins, what to cut, and decisions like keeping the API key on my server instead of in the browser.

### Close (4:35 – 4:50)
[Tab 1 → «Key decisions and trade-offs» → «What I’d do next»]

> Next, I’d test with five first-time authors and measure time to a first book and how often people undo AI changes. Everything — the prototype, research, design system, code and the full AI log — is linked in my email. Thanks, Oran.

---

### Если не укладываетесь в 5:00
- В демо сократите «Title, plan, writing» до одной фразы и не открывайте ссылку шеринга.
- В исследовании назовите три пункта вместо пяти (1, 2, 5).
- Процесс и исследование не сокращайте: это два отдельных критерия оценки.
