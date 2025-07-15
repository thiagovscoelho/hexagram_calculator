# I Ching Hexagram Calculator

A tiny, self-contained web app that lets you **cast and explore I Ching hexagrams** with nothing more than your browser and a couple of _d8_ (eight-sided dice).  
Enter the two trigram rolls (lower and upper) and—if you wish—the six individual line rolls to see:

* The primary hexagram, its glyph, binary/decimal value, and trigram makeup  
* Per-line breakdown (yin/yang, role, correctness, holding-together, correspondence)  
* The moving-line “target” hexagram (if any)  
* A full suite of derived hexagrams: opposites, inverses, five kinds of nuclears, doubles/triples, etc.  
* Rotation cycle, flower (antecedent & consequent petals), and 12-step story sequence  

All output is rendered client-side; no network calls, builds, or dependencies required.

## Quick-start

```bash
git clone https://github.com/thiagovscoelho/hexagram_calculator
cd hexagram_calculator
# No build step – just open the page
````

1. double-click **`index.html`** (or serve the folder with your favourite dev-server)
2. roll two *d8* – the first for the **lower** trigram, the second for the **upper**
3. optionally roll six more *d8* (bottom → top) to mark **moving lines**
4. hit **Compute Hexagram** and dive into the results

> **Tip**
> On touch devices you can ignore the dice and simply type 1-8 in each box.

## Rolling the dice

| Roll | 1           | 2              | 3           | 4          | 5             | 6          | 7          | 8            |
| ---- | ----------- | -------------- | ----------- | ---------- | ------------- | ---------- | ---------- | ------------ |
| Map  | **Earth** ☷ | **Mountain** ☶ | **Water** ☵ | **Wind** ☴ | **Thunder** ☳ | **Fire** ☲ | **Lake** ☱ | **Heaven** ☰ |

* **Lower + Upper trigrams** → primary hexagram (64 possibilities)
* **Per-line rolls**

  * A **yang** line (solid, value `1`) **moves** when the roll is **1-3**
  * A **yin** line (broken, value `0`) **moves** only on a roll of **8**
  * Any other value leaves the line static

If you leave every line roll blank the app assumes a fixed hexagram.

## Features

| Category              | Details                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hexagram core**     | Classes `Trigram` and `Hexagram` model the canonical 8 trigrams & 64 hexagrams with names, glyphs, binary, decimal, and King Wen numbering. |
| **Moving-line logic** | Supports dynamic flipping of moving lines to compute the **target hexagram**.                                                               |
| **Derived sets**      | Opposite / inverse, five nuclears (plus doubles & triples), rotation cycle, flower petals, and 12-step story sequence.                      |
| **Per-line analysis** | Correct vs. incorrect, holding-together pairs, correspondence pairs, and role names (Common-man → Sage).                                    |
| **Pure front-end**    | No frameworks, no build step – just vanilla HTML + CSS + ES2020.                                                                            |
| **Unicode glyphs**    | Uses the standard trigrams (☰ … ☷) and hexagrams (䷀ … ䷿); falls back gracefully if a font is missing.                                       |

## How it works

1. **Core model (`iching-core.js`)**

   * `Trigram` – stores binary/yin-yang pattern, glyph, name, helpers (opposite, inverse)
   * `Hexagram` – built from two `Trigram`s; exposes rich methods:

     * `lines`, `movingLines()`, `target()`
     * `nuclear()`, `secondNuclear()`, … `flower()`, `story()`, `cycle()`
     * plus correctness, holding-together, correspondence checks
2. **UI layer (`app.js`)**

   * Generates six optional draw inputs at load time
   * Validates form, instantiates `Hexagram`, and calls `renderResults()`
   * Renders headings, line diagram, analysis blocks, and several HTML tables
3. **Styling** (`css/styles.css`) – still pretty simple for now.

Because the logic and UI are decoupled, you can embed the **core** classes in other projects (Node/deno scripts, React apps, etc.) with no changes.

## Development & customization

* **Live reload**

  ```bash
  npx serve .
  # or
  npx live-server
  ```
* **Change the trigram order / naming** – edit the static `_data` map in `Trigram`.
* **Add commentaries or translations** – extend the `_data` map in `Hexagram` with additional fields (e.g. `wilhelm` or `pinyin`) and surface them in `renderResults()`.
* **Styling tweaks** – all colours and spacing live in `css/styles.css`. No CSS pre-processor needed.
* **Unit tests** – (not included) but the pure-function nature of `iching-core.js` makes it easy to drop into any test runner of your choice.

---

## Credits & license

The code is public domain (CC0).

The hexagram names, as well as the concept of hexagram stories and hexagram flowers, are due to Edward Hacker’s *I Ching Handbook*.
