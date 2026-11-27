# Folio — video walkthrough script (≤ 5:00)

Речь — на английском (её говорите). Действия на экране — в [квадратных скобках].
Темп: ~140 слов в минуту, текст рассчитан на ~4:40, остаётся запас.

---

## Подготовка (до записи, 10 минут)

1. Браузер на весь экран, 1440×900 или больше, масштаб 100%, закладки и лишние вкладки скрыть.
2. Открыть вкладки по порядку:
   - **Tab 1:** https://borisbelov.com/dev/contrast/#/process
   - **Tab 2:** https://borisbelov.com/dev/contrast/ — чистый старт (если там старая книга: Start over).
   - **Tab 3 (заготовка сбоя):** в окне инкогнито пройдите пример «Sourdough for busy people» до шага Write и подождите, пока глава 5 «Fixing Flat, Dense and Sour Loaves» покажет «didn’t finish». Не нажимайте Retry.
   - **Tab 4:** https://github.com/iborisbelov/contrast
3. Заранее один раз пройдите свою тему в Tab 2 «на холостую», чтобы прогреть Groq, затем Start over.
4. Запись: Loom (экран + голос, камеру можно в кружке). Микрофон проверить.
5. Если генерация идёт дольше, чем говорите, — продолжайте говорить, это нормально: она и есть демонстрация «не спиннер».

---

## 0:00 – 0:20 · Hook

[Tab 2, первый экран Folio]

> Hi Oran, I’m Boris. This is Folio — a tool that turns what someone knows into a finished, designed eBook in about five minutes, for people with no writing or design background. I’ll show you the product, then the research and the process behind it.

---

## 0:20 – 1:05 · The problem and what research told me

[Tab 1, #/process — секция «Talking to the client», затем медленно прокрутить до таблицы «Research → decisions»]

> You told me the user could be anyone — a creator, a coach, anybody — and asked me to research why people give up on tools like this.
> I ran four research tracks in parallel with AI: competitors, with Designrr in depth, real user reviews, AI UX patterns, and cover design.
> Three findings shaped everything. Novices get lost when a tool asks design questions before any content exists. The loudest complaint is “the AI ignored me” or “it said it changed something and didn’t.” And people are embarrassed when a book sounds like AI.
> Every row here is a finding and the decision it led to. Let me show you those decisions in the product.

---

## 1:05 – 3:20 · Product demo

### Start and questions (1:05 – 1:40)
[Tab 2. Наведите на карточку вступления. Напечатайте: **Yoga for runners who sit at a desk all day** → Continue]

> One sentence to start — it’s labelled as the idea, not the title, because in testing I mistook it for the title myself.
> Then one question per screen. This is real AI on Groq: the reader groups were written for my topic.

[Выберите читателя → на вопросе тона задержитесь]

> For the voice, you don’t pick a word like “tone” — you read three opening lines and choose the one that sounds like you.

[Выберите тон → длину → на вопросе «Anything only you know?» нажмите тег «My routine looks like this:» и допишите пару слов → Continue → на сводке покажите ссылки Change → Looks right]

> Here I ask for something only the author knows, with starters to help. The AI never invents the author’s story. Then a summary where anything can be changed.

### Title and plan (1:40 – 2:00)
[Покажите, как обложка меняется при выборе названия → Next: the plan → перетащите одну главу]

> The book has been on the desk since the first answer. Pick a title and the cover updates. The plan is editable before anything is written, so changes are free.

### Writing — not a spinner (2:00 – 2:25)
[Write my book. Покажите, как глава 1 печатается, статусы в оглавлении меняются]

> Generation takes time, so you never stare at a spinner. The cover appears first, chapters stream into a live contents page, and chapter one is readable while the rest is still being written.

### Control without starting over (2:25 – 2:50)
[Кликните абзац → Shorter → дождитесь подсветки → Try another → Undo. Затем вкладка Cover: смените композицию и палитру]

> Click any paragraph to rewrite it. Every AI change is highlighted, kept in history, and you can keep it, try another, or undo — that’s the direct answer to “it ignored me.” The cover is a system, not a template: the topic picked this motif, and you can change composition, colour and type, or upload your own image.

### Failure, designed in (2:50 – 3:05)
[Переключитесь на **Tab 3** с упавшей главой → Retry this chapter]

> Things will fail, so failure is local. Here one chapter didn’t finish; the others are safe, and I retry just that one. Unclear input gets clarifying options, and the book is autosaved.

### Finish and share (3:05 – 3:20)
[Вернитесь в Tab 2 → Finish book → Copy share link (откройте ссылку в новой вкладке на 2 секунды) → Save to library → откройте книгу на полке, перелистните страницу]

> To finish: a real PDF, or a share link that opens the book for anyone — no account needed. And you can save it to your library and read it like a real book.

---

## 3:20 – 4:15 · How I worked with AI

[Tab 1, секция «How I worked with AI» — таблица, затем «How it evolved»: кликните 1–2 карточки прототипов]

> I used Claude Code as a pair from the first hour — researcher, prototyper and builder — not as a final polish step.
> The method was spike first: instead of describing three flows, I had AI build all three as clickable prototypes — a wizard, a chat, and a growing book — and compared them by feel. I merged the best of each. Then four variants of the brief screen, and “one question at a time” won and became the rule everywhere.
> AI was fastest at breadth: research and prototypes in minutes. It fell short in ways I had to catch by clicking through: an animation that crashed the app, a model name that was retired, layouts that broke at laptop width. Each one is logged with my fix.
> My judgment took over on direction: what to cut, which variant wins, and keeping the API key on the server instead of the browser.

---

## 4:15 – 4:45 · Decisions, cuts, next

[Tab 1, «Key decisions and trade-offs» → затем #/system на 3 секунды → Tab 4 GitHub]

> Key trade-offs: one question at a time is slower for experts, so there’s “skip, use your best guess.” The co-author is scoped — it can only make changes you can see and undo. I cut accounts, EPUB and image generation to keep the core solid.
> The design system — type, colour, spacing, components and the cover system — is documented here, and the code, research and full AI log are in the repo.
> Next, I’d test with five first-time authors and measure time to first book and how often people undo AI changes.

---

## 4:45 – 4:55 · Close

[Tab 2, книга на столе]

> That’s Folio. Thanks for watching — I’d love to hear what you think.

---

### Если не укладываетесь в 5:00
- Сократите блок «Title and plan» до одной фразы.
- В «How I worked with AI» уберите предложение про четыре варианта brief screen.
- Шаринг: покажите только Copy share link, без открытия ссылки.
