# Folio — video script (≤ 5:00)

Речь — на английском, простыми словами, как будто рассказываете другу. Действия — в [квадратных скобках].
Баланс: **research ~1:15 · demo ~2:00 · process & AI ~1:20**, итого ~4:50. Не читайте слово в слово — это опора, говорите своими словами.

---

## Подготовка (10 минут до записи)

1. Браузер на весь экран, масштаб 100%, лишние вкладки и закладки скрыть.
2. Вкладки по порядку:
   - **Tab 1:** https://borisbelov.com/dev/contrast/#/process
   - **Tab 2:** https://github.com/iborisbelov/contrast/blob/main/reports/AI%20eBook%20creator%20UX%20research.md
   - **Tab 3:** https://borisbelov.com/dev/contrast/ — чистый старт (если там книга: Start over).
   - **Tab 4 (сбой):** в окне инкогнито пройдите пример «Sourdough for busy people» до шага Write и дождитесь, пока глава 5 покажет «didn’t finish». Retry не нажимайте.
   - **Tab 5:** https://github.com/iborisbelov/contrast/blob/main/process/ai-process-log.md
3. Один раз пройдите свою тему в Tab 3, чтобы «прогреть» Groq, затем Start over.
4. Loom: экран + голос (камера по желанию).
5. Если книга пишется дольше, чем вы говорите, — просто продолжайте говорить.

---

## 0:00 – 0:15 · Hi
[Tab 3, первый экран]

> Hi Oran, it’s Boris. This is Folio. It helps people who know a lot about something, but can’t write or design, make a real eBook. I’ll show you what I learned first, then the product, then how I built it with AI.

---

## 0:15 – 1:30 · Research (~1:15)

### Where I looked (0:15 – 0:45)
[Tab 1, «Talking to the client»]

> First I asked you two things: who is it for, and why do people quit tools like this. You said: anyone — a creator, a coach, anybody — and asked me to find out the second part myself. So that became my main question.
> I looked in four places at the same time. Other tools — mostly Designrr, because you worked with them. What real users say in reviews. Known rules for good AI design, from places like Nielsen Norman and Apple. And how good book covers work.

[Tab 2, медленно прокрутить отчёт]

> It’s all in one report, with a source for every claim.
> For the look, I made my own moodboard on Dribbble and Behance — reading and library apps. I didn’t copy any one design. I kept what kept showing up: warm paper, a soft serif font, one accent colour, and real-looking books.

### What I found and what I did about it (0:45 – 1:30)
[Tab 1, таблица «Research → decisions», ведите курсором по строкам]

> Five things changed the design.
> One: people get lost when a tool asks about layout and templates before there’s any content. So Folio asks nothing about design at the start — you just see your book.
> Two: the biggest complaint is “the AI didn’t do what I asked,” or “it said it changed something, but it didn’t.” So every change the AI makes is highlighted, and you can always undo it.
> Three: people are embarrassed when their book sounds like AI wrote it. So I ask for something only they know — and the AI never makes up their story.
> Four: picking a “tone” from a list is confusing if you’re not a writer. So you just read three short examples and pick the one that sounds like you.
> Five: after about ten seconds, a loading spinner makes people nervous. So you see the plan and the cover first, and you can read chapter one while the rest is still being written.
> Let me show you.

---

## 1:30 – 3:30 · Demo (~2:00)

### Questions (1:30 – 2:00)
[Tab 3. Напечатайте **Yoga for runners who sit at a desk all day** → Continue → выберите читателя → на тоне задержитесь → выберите → длина → на «Anything only you know?» нажмите тег «My routine looks like this:» → Continue → Looks right]

> You start with one sentence. Then it’s one question at a time. This is a real AI, so the answers are written for my topic. I pick the voice by reading it, add a tip only I know, and check the summary.

### Title, plan, writing (2:00 – 2:30)
[Смените название — обложка меняется → Next: the plan → Write my book → покажите, как печатается глава 1]

> When I pick a title, the cover changes right away. I can change the chapter list before anything is written. Then it writes — no spinner. Cover first, then chapters one by one, and I can already read the first one.

### Fixing what the AI got wrong (2:30 – 2:55)
[Кликните абзац → Shorter → Try another → Undo. Вкладка Cover: смените композицию и цвет]

> Don’t like a paragraph? Click it and make it shorter, simpler, or warmer. The change is highlighted — keep it, try again, or undo. The cover isn’t a template: it picked a leaf for this topic, and I can change the layout, colours, fonts, or add my own picture.

### When things break (2:55 – 3:10)
[Tab 4 → Retry this chapter]

> Things will break sometimes. Here one chapter failed, but the rest are fine, and I just retry that one. If your idea is too vague, it asks you to pick something clearer. And your book is saved automatically.

### Finish and share (3:10 – 3:30)
[Tab 3 → Finish book → Copy share link → Save to library → откройте книгу на полке, перелистните страницу]

> When you’re done: download a PDF, copy a link anyone can open, or save it to your library and read it like a real book.

---

## 3:30 – 4:50 · How I built it with AI (~1:20)

### My method (3:30 – 3:55)
[Tab 1, «How it evolved» — кликните карточку 1, затем карточку 5]

> I tried things before deciding. Instead of writing long docs, I had AI build three quick clickable versions of the flow — a step-by-step wizard, a chat, and a book that grows as you answer — and I clicked through them. I took the best parts of each. Later I made four versions of one screen side by side, and “one question at a time” won. So I used it everywhere.

### What AI did well, where it failed, what I decided (3:55 – 4:35)
[Tab 1, таблица «How I worked with AI», затем Tab 5 — прокрутите журнал]

> I used AI in every step, not just at the end: research, quick prototypes, checking the design against my references, building the app, and connecting the real AI.
> It was great at doing a lot fast — a hundred sources and three prototypes in the time it takes me to write one brief.
> But it made mistakes I only found by clicking around: an animation that crashed the whole app, an AI model that didn’t exist anymore, and layouts that broke on laptops and phones. I wrote each one down with the fix. And each fix made the app stronger — now it has an error screen, autosave, and a backup when the AI is down.
> The big calls were mine: which version wins, what to cut, and things like keeping the API key on my server, not in the browser.

### Wrap up (4:35 – 4:50)
[Tab 1 → «What I’d do next»]

> Next, I’d test it with five people making their first book, and see how fast they get there and how often they undo the AI. All the links are in my email. Thanks, Oran!

---

### Если не укладываетесь в 5:00
- В демо сократите «Title, plan, writing» до одной фразы и не открывайте ссылку.
- В исследовании назовите три вывода вместо пяти (1, 2, 5).
- Исследование и процесс не сокращайте — это отдельные критерии оценки.
