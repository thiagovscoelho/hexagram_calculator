# I Ching Hexagram Calculator

A tiny, dependency‑free [web app](https://thiagovscoelho.github.io/hexagram_calculator/) for computing I Ching (Yijing) hexagrams and a rich set of derived relationships. The app is designed around **integers in \[1…8]** so you can:

* roll your own **d8** (physical) for trigrams and moving lines,
* **replicate the yarrow‑stalk probabilities** for line changes (yang→yin much more likely than yin→yang), and
* serialize/restore hexagrams via compact **notation strings**.

> **License:** Public domain (CC0). Edward A. Hacker’s *I Ching Handbook* is credited for names, theme groups, the “flower” and “story” concepts, and terminology.

---

## Contents

* [Demo & setup](#demo--setup)
* [Why d8 + yarrow distribution](#why-d8--yarrow-distribution)
* [How it works](#how-it-works)
* [Using the app](#using-the-app)

  * [Inputs](#inputs)
  * [Reading / writing codes](#reading--writing-codes)
  * [Results pane](#results-pane)
* [Line relations (definitions)](#line-relations-definitions)
* [Theme groups](#theme-groups)
* [Binary trigram order (design choice)](#binary-trigram-order-design-choice)
* [Developer API (core classes)](#developer-api-core-classes)
* [Project layout](#project-layout)
* [Attribution & license](#attribution--license)

---

## Demo & setup

This is a static site. Clone and open `index.html` in any modern browser—no build step.

```text
hexagram_calculator/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    └── iching-core.js
```

Optionally serve with any static server (e.g., `python -m http.server`) if you prefer `file:`-free origins.

---

## Why d8 + yarrow distribution

The app works with **integers 1–8** so you can reproduce the **yarrow‑stalk** change likelihoods while still rolling by hand.

* If a line is **yang (1)**, a draw of **1–3** marks it **moving** (probability **3/8**), otherwise it’s static.
* If a line is **yin (0)**, a draw of **8** marks it **moving** (probability **1/8**), otherwise it’s static.

This encodes the traditional asymmetry: **yang→yin** changes are much more frequent than **yin→yang** changes—unlike the even change rate you get with the common three‑coins method.

> Internally, the app stores canonical draw values for compactness: static yang→`4`, moving yang→`3`; static yin→`7`, moving yin→`8`.

---

## How it works

### Trigrams (1…8)

By default the project follows the **binary eight‑trigram ordering** (bottom→top bits):

| Index | Binary | Name     | Glyph |
| ----: | :----: | -------- | :---: |
|     1 |  `000` | Earth    |   ☷   |
|     2 |  `001` | Mountain |   ☶   |
|     3 |  `010` | Water    |   ☵   |
|     4 |  `011` | Wind     |   ☴   |
|     5 |  `100` | Thunder  |   ☳   |
|     6 |  `101` | Fire     |   ☲   |
|     7 |  `110` | Lake     |   ☱   |
|     8 |  `111` | Heaven   |   ☰   |

By default the project follows the binary eight‑trigram ordering (Earth ☷, Mountain ☶, Water ☵, Wind ☴, Thunder ☳, Fire ☲, Lake ☱, Heaven ☰). That is, we represent the trigram in binary (bottom → top convention), and add 1 to get its corresponding dice roll (since 3-bit numbers are 0–7, whereas d8 dice are usually labeled 1–8), and convert to decimal.

Although this does not match the textual sequence from the Eighth Wing (☰ Heaven, ☷ Earth, ☳ Thunder, ☴ Wind, ☵ Water, ☲ Fire, ☶ Mountain, ☱ Lake), it is more intuitive because higher dice values are more yang. The binary order is not wholly untraditional, since the Earlier Heaven circular arrangement is closely related to the binary order (see Hacker’s *Handbook*, p. 37), and after all the binary order of hexagrams is attributed to Fu Hsi, who is traditionally held to be an ancient king even earlier than King Wen, although modern scholarship considers him legendary and traces the binary order no further back than the Sung Dynasty (960–1279 A.D.). (Hacker, *Handbook*, p. 104)

### Hexagrams

A hexagram is the pair **(lower trigram, upper trigram)**. The table in `Hexagram._data` maps every pair to its **King Wen textual number** (as 2‑digit string), **name** (Hacker’s selection), and **Unicode glyph**.

---

## Using the app

### Inputs

* **Lower trigram (1–8)** and **Upper trigram (1–8)**
* **Optional draws (six numbers 1–8, bottom→top)**: leave all blank for a static reading; fill **exactly six** for a kinetic reading (moving lines).
* **Random Hexagram** button fills both trigrams and all six draws with d8 values.

### Reading / writing codes

The app can **render** and **parse** a hexagram’s six lines (bottom→top) in several formats. A trailing `*` marks a **moving** line.

**Renderer options (toolbar):**

* **Binary\*** (default) — e.g., `1*0*0-010` (`-` separates trigrams)
* **Binary** — forces all lines static in the printout
* **9876** — `9`=moving yang, `7`=static yang, `6`=moving yin, `8`=static yin; e.g., `968-878`
* **Hanzi\*** — `阳`/`阴` with optional `*`; e.g., `阳*, 阴*, 阴, 阴, 阳, 阴`
* **Hanzi** — forces static in the printout
* **Unicode\*** — `⚊`/`⚋` with optional `*`; e.g., `⚊*, ⚋*, ⚋, ⚋, ⚊, ⚋`
* **Unicode** — forces static in the printout

**Notation reader (input field):** accepts all of the above (auto‑detected). It also understands two strength‑word formats:

* **shortStrength**: `Strong`, `Strong*`, `Weak`, `Weak*`
* **longStrength**: `Strong→Weak`, `Weak→Strong`, `Strong`, `Weak`

Paste a code and click **Read Hexagram** to populate the form and see results.

### Results pane

* **Header**: `Hexagram NN: Name` + Unicode glyph
* **Notation toolbar**: pick a format and copy the code; shows the **decimal binary value** too
* **Trigram read‑out**: for each trigram → sequence index, glyph, binary, decimal, and name
* **Line diagram**: six SVG bars (solid = yang, broken = yin); moving lines are highlighted; optional role labels
* **Theme group**: a topical category. Each hexagram is sorted into one of Hacker’s eight thematic clusters (e.g., *Groups*, *Big in Power*, *Proper Conduct*). The mapping is given in page 68 of Hacker’s *Handbook* and defended in pages 69–72. There are exactly eight hexagrams per cluster.
* **Line information**:

  * **Correctness**: which lines are “correct”. A line is correct if it is yang (1) in position 1, 3, or 5 or if it is yin (0) in position 2, 4, or 6. All lines in 63 ䷾ 101-010 *Already Across the River* are correct; all lines in 64 ䷿ 010-101 *Not Yet Across the River* are incorrect.
  * **Holding together**: whether each adjacent pair (1–2 … 5–6) holds together. This is a relation which is only defined between successive lines (1 and 2, or 2 and 3, or 3 and 4, or 4 and 5, or 5 and 6). Successive lines are said to hold together if they are opposites, i.e., one of them is yin (0) and the other yang (1).
  * **Correspondence**: whether (1–4), (2–5), (3–6) correspond. This is a relation which is only defined between line 1 and 4, line 2 and 5, and line 3 and 6. If the lines within one of these pairs are opposites of each other, then they correspond to each other.
  * **Emblems**: the four adjacent‑line digrams (`⚌`, `⚍`, `⚎`, `⚏`), with before→after if moving
* **Trigrams (windows)**: Lower (1–3), **Lower Nuclear** (2–4), **Upper Nuclear** (3–5), Upper (4–6) for **Current** (and **Target** if moving)
* **Derived Hexagrams** (table):

  * **Target** (if moving), **Opposite** (flip all six lines, yang↔yin), **Inverse** (turn the hexagram upside‑down, so lines are in reverse order)
  * **Nuclear** plus **Second/Third/Fourth/Fifth Nuclear** and their **Double/Triple** variants (see chapter 6 of Hacker’s *Handbook*, generally). The hexagrams may be divided into four equal groups according to their double nuclear trigram, as Edward Hacker did in the *Handbook*, pp. 80–87, since applying the nuclear trigram operation twice sends all hexagrams to either 01 ䷀ or 02 ䷁ (which are their own nuclear hexagram) or 63 ䷾ or 64 ䷿ (which are each other’s nuclear hexagram, in a loop). The second and third nuclear trigram operations also hit rock bottom after two applications. The fourth and fifth operations take three applications to hit rock bottom, which is why a “triple” operation is provided only for those.
* **Cycle**: barber‑pole rotation (`move line 6 → bottom` and shift up); shows the cycle until it repeats (length 1, 2, 3, or 6)
* **Flower**: all **Antecedents** (flip one line yin→yang) and **Consequents** (flip one line yang→yin)
* **Story**: narrative sequence starting at the original, then flipping cumulative lines 1…k, then k…6, and returning to the original

> **Roles UI tweak:** append `?roles=off` to the URL to hide per‑line titles, or `?roles=big` to append the Earth/Man/Heaven domain.

---

## Developer API (core classes)

Everything lives in **`js/iching-core.js`**.

### `class Trigram`

* `new Trigram(index: 1…8)` — binary‑indexed trigram (bottom→top bits + 1)
* Properties: `binaryRepresentation`, `decimalBinaryValue`, `name`, `glyph`, `sequence`
* Transforms: `.opposite()`, `.inverse()`

### `class Hexagram`

* `new Hexagram(lower: Trigram, upper: Trigram, draws?: number[6])`
* Properties: `textualNumber`, `name`, `glyph`, `binaryRepresentation`, `decimalBinaryValue`, `lines`
* Moving lines: `setDraws([1…8 ×6])`, `movingLines` (bool\[6]), `.target()`
* Rendering: `.render(fmt, opts)` where `fmt ∈ {binary, glyph, 9876, hanzi, shortStrength, longStrength}`
* Parsing: `Hexagram.parse(str, { format: 'auto' | fmt })`
* Roles/domains: `Hexagram.lineInfo(lineNo)`, instance helpers `.lineRole(n)`, `.lineDomain(n)`, arrays `.lineRoles`, `.lineDomains`
* Relations: `.correctLines()`, `.incorrectLines()`, `.holdingPairs()`, `.correspondencePairs()`
* Emblems (adjacent digrams): `.emblemAt(i)`, `.emblems()`, `.renderEmblems()`
* Nuclears: `.nuclear()`, `.secondNuclear()`, `.thirdNuclear()`, `.fourthNuclear()`, `.fifthNuclear()` and their “double/triple” chaining
* Opposites: `.opposite()`, `.inverse()`
* Flower & Story: `.flower()` → `{ antecedents, consequents }`, `.story()` → `Hexagram[]`
* Rotation: `.rotate()`, `.cycle()`
* Builder: `Hexagram.combine(lower, upper, draws?)`

> **Indexing conventions**: lines are stored bottom→top (1…6). When flipping by line number, helpers map the human‑oriented line index to the appropriate bit position.

---

## Project layout

* **`index.html`** — UI, form, and result container. Includes webfonts (Inter, Noto Serif).
* **`js/app.js`** — DOM wiring, notation reader/renderer, tables, and visual SVG line diagram. URL param `?roles=off|big` controls role labels.
* **`js/iching-core.js`** — pure logic: trigrams/hexagrams, parsing/rendering, relations, nuclears, cycles, flower/story.
* **`css/styles.css`** — modern, responsive styling; red accent for moving lines; tables auto‑scroll on small screens.

---

## Attribution & license

* **Names, theme groups, “flower,” “story,” and terminology**: Edward A. Hacker, *I Ching Handbook*.
* **Code**: Public domain under **CC0**. Hacker’s book is not public domain; only the short hexagram names (which themselves come from various translators) are copied.

Enjoy rolling real dice with a modern, exact, and inspectable I Ching tool.