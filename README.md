# I Ching Hexagram Calculator

A lightweight, browser‑only I Ching workbench (live [here](https://thiagovscoelho.github.io/hexagram_calculator/)) that lets you roll **d8** dice to select trigrams, assemble a hexagram, and (optionally) determine moving lines using a probability rule tuned to the traditional **yarrow‑stalk** method as analyzed by Edward Hacker.

---

## Contents

- [Why this project?](#why-this-project)
- [Quick start](#quick-start)
- [Rolling the dice](#rolling-the-dice)

  * [Step 1: Base hexagram via 2d8](#step-1-base-hexagram-via-2d8)
  * [Step 2 (optional): Moving lines via 6d8](#step-2-optional-moving-lines-via-6d8)
  * [Moving‑line probability rule (Hacker‑style)](#movingline-probability-rule-hackerstyle)
  * [Worked example](#worked-example)
- [Entering data in the UI](#entering-data-in-the-ui)
- [Understanding the results display](#understanding-the-results-display)

  * [Basic stats](#basic-stats)
  * [Line diagram & roles](#line-diagram--roles)
  * [Theme group (Hacker)](#theme-group-hacker)
  * [Line relations: correctness, holding together, correspondence](#line-relations-correctness-holding-together-correspondence)
  * [Derived hexagrams](#derived-hexagrams)
  * [Cycle](#cycle)
  * [Flower (antecedents & consequents)](#flower-antecedents--consequents)
  * [Story (twelve‑step narrative)](#story-twelvestep-narrative)
- [URL parameters](#url-parameters)
- [Developer notes & architecture](#developer-notes--architecture)

  * [File layout](#file-layout)
  * [Core data model API sketch](#core-data-model-api-sketch)
- [Probability background](#probability-background)
- [Accessibility, responsiveness, and mobile tips](#accessibility-responsiveness-and-mobile-tips)
- [License](#license)
- [Attribution & use of Hacker materials](#attribution--use-of-hacker-materials)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)

---

## Why this project?

Many people who consult the *I Ching* prefer physical methods of generating hexagrams. The traditional **yarrow‑stalk** method yields an *asymmetric* probability distribution for changing ("moving") lines: some lines are more likely to change than others, and yang⇢yin changes are more common than yin⇢yang. Because the full yarrow procedure is slow and fiddly, the common substitute is the **three‑coin** toss—convenient, but it *does not* reproduce the yarrow probabilities.

**I Ching Hexagram Calculator** offers a middle way: use familiar **octahedral (d8) dice** to quickly generate the same probability asymmetry Hacker computed for the yarrow method, while also enjoying the tactile satisfaction of rolling physical dice. Enter your rolls in a simple web form (or click *Random Hexagram* to experiment), and the app renders the hexagram, moving lines (if any), and a rich set of derived relationships inspired largely by Edward Hacker’s *I Ching Handbook*.

The project is **100% client‑side**—no build step, no backend, works offline once loaded.

---

## Quick start

1. **Clone or download** this repository.
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge, mobile OK).
3. Roll **two d8s**: one gives the lower trigram index (1‑8), the other the upper trigram index (1‑8). Enter them.
4. (Optional) Roll **six more d8s**, *bottom line to top line*, and enter them in the six draw boxes. Leave them blank if you don’t want to specify moving lines.
5. Click **Compute Hexagram**. Your result appears below the form.
6. To simply explore, click **Random Hexagram**—the app fills all fields with random 1‑8 values and displays the result.

---

## Rolling the dice

### Step 1: Base hexagram via 2d8

- Roll one d8 for the **lower trigram** (index 1‑8).
- Roll one d8 for the **upper trigram** (index 1‑8).
- The pair of trigrams determines one of the 64 hexagrams.

**Which trigram is which number?** By default the project follows the binary eight‑trigram ordering (Earth ☷, Mountain ☶, Water ☵, Wind ☴, Thunder ☳, Fire ☲, Lake ☱, Heaven ☰). That is, we represent the trigram in binary (bottom → top convention) and add 1 to get its corresponding dice roll (since 3-bit numbers are 0–7, whereas d8 dice are usually labeled 1–8).

Although this does not match the textual sequence from the Eighth Wing (☰ Heaven, ☷ Earth, ☳ Thunder, ☴ Wind, ☵ Water, ☲ Fire, ☶ Mountain, ☱ Lake), it is more intuitive because higher dice values are more yang. The binary order is not wholly untraditional, since the Earlier Heaven circular arrangement is closely related to the binary order (see Hacker’s *Handbook*, p. 37), and after all the binary order of hexagrams is attributed to Fu Hsi, who is traditionally held to be an ancient king even earlier than King Wen, although modern scholarship considers him legendary and traces the binary order no further back than the Sung Dynasty (960–1279 A.D.). (Hacker, *Handbook*, p. 104)

The precise mapping is encoded in `js/iching-core.js` and is echoed back to you in the results panel whenever you compute a hexagram, so you can double‑check your rolls there. If you customize the mapping, the UI will faithfully report your new order.

### Step 2 (optional): Moving lines via 6d8

If you want to model kinetic (changing or unchanging) lines—roughly matching the yarrow‑stalk probabilities—roll **six** d8s, one for each line **starting at the bottom (line 1) and moving upward to the top (line 6)**. Enter each roll in the corresponding draw box.

> **Important:** Either leave *all* six boxes blank (no moving lines) **or** fill in *all* six with integers 1‑8. Partial entry is rejected to prevent accidental misreads.

### Moving‑line probability rule (Hacker‑style)

Each line in the base hexagram is already yin (broken) or yang (solid). To decide whether that line *moves* (flips) when you apply your 6d8 draws, we use this rule:

| Current line | d8 draw  | Result              | P(move)     |
| ------------ | -------- | ------------------- | ----------- |
| **Yang**     | 1‑3      | *Moving* (yang⇢yin) | 3/8 = 37.5% |
| **Yin**      | 8        | *Moving* (yin⇢yang) | 1/8 = 12.5% |
| otherwise    | *Static* | —                   |             |

Thus **yang lines are three times as likely to change** (down to yin) as yin lines are to change (up to yang), reflecting the asymmetry observed in analyses of the yarrow‑stalk method. This asymmetry also motivates the labeling of *antecedents* vs *consequents* in the app’s *flower* view (see below).

### Worked example

Suppose you rolled:

- Lower trigram roll: **5** (Wind)
- Upper trigram roll: **2** (Lake)
- 6d8 draws bottom→top: `2, 8, 5, 1, 3, 7`

Enter these and click **Compute Hexagram**. Internally the app will:

1. Build the base hexagram from (lower=5, upper=2).
2. For each line *i* (1=bottom):

   * Look at whether the base line is yin/yang.
   * Compare the corresponding draw.
   * Flag as **moving** if it meets the rule above.
3. Flip every moving line to produce the **target** (changed) hexagram, shown in the *Derived Hexagrams* table in red.

---

## Entering data in the UI

The form at the top of the page has:

- **Lower trigram (1‑8)** and **Upper trigram (1‑8)** numeric fields (required).
- **Optional draws** fieldset containing six number boxes (generated at runtime) for the 6d8 line draws, labeled *bottom → top* in the legend to remind you of input order.
- **Compute Hexagram** button.
- **Random Hexagram** button that fills all eight numeric fields with random integers in `[1,8]` and immediately lets you compute.

Validation rules:

- Trigram values must be integers 1‑8.
- Draw boxes must be *all blank* or *exactly six valid integers* 1‑8.

---

## Understanding the results display

After a successful submission, the results panel renders the following sections.

### Basic stats

- **Heading**: `Hexagram N: Name` plus the Unicode hexagram glyph.
- **Binary**: Six‑bit binary string (`000111`, etc., where left-to-right ↔ lower-to-upper) with a dash after the first three bits to enhance readability and highlight lower/upper trigrams.
- **Decimal**: The integer value of the 6‑bit binary (0‑63) used internally.
- **Upper / Lower trigram read‑out**: Sequence number, glyph, binary, decimal, and name for each constituent trigram.

### Line diagram & roles

An SVG diagram shows each of the six lines (top displayed first).

- **Solid bar** = yang; **broken bar** = yin.
- Moving lines (if draws were supplied and rule matched) are highlighted in **red** and annotated with an arrow to their post‑change strength (Strong/Weak).
- Lines are numbered **1 (bottom) → 6 (top)**. Role labels ("Common‑man", "The Ruler", etc.) appear or are suppressed depending on the `roles` URL parameter (see below). A *big* mode appends Earth/Man/Heaven domains.

### Theme group (Hacker)

Each hexagram is sorted into one of Hacker’s eight thematic clusters (e.g., *Groups*, *Big in Power*, *Proper Conduct*). The mapping is given in page 68 of Hacker’s *Handbook* and defended in pages 69–72. There are exactly eight hexagrams per cluster.

### Line relations: correctness, holding together, correspondence

These per‑line diagnostics are classic interpretive aids (Hacker, *Handbook*, pp. 13–14):

- **Correctness**: A line is correct if it is yang (1) in position 1, 3, or 5 or if it is yin (0) in position 2, 4, or 6. All lines in 63 ䷾ 101-010 *Already Across the River* are correct; all lines in 64 ䷿ 010-101 *Not Yet Across the River* are incorrect.
- **Holding together**: This is a relation which is only defined between successive lines (1 and 2, or 2 and 3, or 3 and 4, or 4 and 5, or 5 and 6). Successive lines are said to hold together if they are opposites, i.e., one of them is yin (0) and the other yang (1).
- **Correspondence**: This is a relation which is only defined between line 1 and 4, line 2 and 5, and line 3 and 6. If the lines within one of these pairs are opposites of each other, then they correspond to each other.

### Derived hexagrams

Displayed in a table beneath the line information. For the computed base hexagram the app lists:

- **Target** (if moving lines were provided): the post‑change hexagram, styled in red.
- **Opposite**: Flip all six lines (yang↔yin).
- **Inverse**: Turn the hexagram upside‑down (read lines in reverse order).
- **Nuclear** and iterative **Second/Third/Fourth/Fifth Nuclear**: successive extractions of inner trigrams to form a new hexagram (see chapter 6 of Hacker’s *Handbook*, generally).
- **Double** and **Triple** variants: applying the same nuclear operation multiple times. The hexagrams may be divided into four equal groups according to their double nuclear trigram, as Edward Hacker did in the *Handbook*, pp. 80–87, since applying the nuclear trigram operation twice sends all hexagrams to either 01 ䷀ or 02 ䷁ (which are their own nuclear hexagram) or 63 ䷾ or 64 ䷿ (which are each other’s nuclear hexagram, in a loop). The second and third nuclear trigram operations also hit rock bottom after two applications. The fourth and fifth operations take three applications to hit rock bottom, which is why a “triple” operation is provided only for those.

### Cycle

Internally also called a *rotation cycle* or *line rotation cycle*, this is made by repeatedly moving the **top line to the bottom**, shifting all others up, until the starting pattern reappears. (Hacker, *Handbook*, p. 93) Lists each intermediate hexagram; step 1 is the starting figure.

### Flower (antecedents & consequents)

Hacker’s evocative *hexagram flower* imagines your chosen hexagram at the center of six petals—each petal obtained by **flipping exactly one line**. (*Handbook*, pp. 94–96)

Because yang→yin changes are **much more probable** than yin→yang under the dice/yarrow rule, the petals are labeled directionally:

- **Antecedent**: The petal hexagram has **yang where yours has yin**. Statistically, that petal is more likely to *precede* yours (your hexagram could arise if that line changed to yin).
- **Consequent**: The petal hexagram has **yin where yours has yang**. Statistically more likely to *follow* from yours when that line changes.

Petals are sorted top‑line (6) to bottom‑line (1) for quick scanning.

### Story (twelve‑step narrative)

A *hexagram story* walks the figure through a complete polarity reversal and back again:

1. Starting hexagram.
2. Flip one line; record the new hexagram.
3. Continue flipping additional lines one at a time until you reach the full **opposite**.
4. Then flip back, stepwise, to return to the original.

The resulting sequence (original + 12 interior transitions + return) can be read imaginatively as a narrative arc. (Hacker, *Handbook*, pp. 96–98) The exact flip order follows the implementation in `iching-core.js` (generally proceeding linewise but see code comments). Steps are enumerated in the results table.

---

## URL parameters

You can tweak the interface by adding simple query parameters to the page URL:

| Param   | Values           | Effect                                                          |
| ------- | ---------------- | --------------------------------------------------------------- |
| `roles` | `on` *(default)* | Show standard line role titles (Common‑man, Great Official, …). |
|         | `off`            | Suppress role labels (useful on very small screens).            |
|         | `big`            | Expand roles to include Earth / Man / Heaven domains.           |

Example usage (assuming you are viewing the file locally):

```
index.html?roles=big
```

---

## Developer notes & architecture

### File layout

```
hexagram_calculator/
├─ index.html              # Entry point / markup skeleton
├─ css/
│   └─ styles.css          # Layout, typography, color; red highlight for moving lines
├─ js/
│   ├─ iching-core.js      # Data & logic: Trigram & Hexagram classes, lookups, operations
│   └─ app.js              # DOM / event glue; builds inputs; renders results
└─ LICENSE                 # Public domain dedication
```

No build system is required. Everything runs in the browser as ES5‑ish vanilla JS.

### Core data model API sketch

Below is an *informal* sketch of the methods used by the UI. Inspect `js/iching-core.js` for authoritative definitions.

```js
// Construct a trigram by sequence number 1‑8
const t = new Trigram(1);  // e.g., Heaven
console.log(t.binaryRepresentation, t.name, t.glyph, t.decimalBinaryValue);

// Build a hexagram from lower & upper trigrams. Optional draws array length 6.
const h = new Hexagram(new Trigram(1), new Trigram(8), [2,8,5,1,3,7]);

console.log(h.textualNumber, h.name, h.glyph);
console.log('Lines (bottom→top):', h.lines);          // [0|1] per line
console.log('Moving lines:', h.movingLines);           // [bool]
console.log('Target hexagram:', h.target());

// Relationships
h.opposite();
h.inverse();
h.nuclear();           // and secondNuclear(), thirdNuclear(), ...
h.correctLines();      // -> [line numbers]
h.incorrectLines();
h.holdingPairs();      // -> [{a:1,b:4,holds:true}, ...]
h.correspondencePairs();
h.cycle();             // -> array of hexagrams (rotation cycle)
h.flower();            // -> {antecedents:[...], consequents:[...]}
h.story();             // -> ordered array of story hexagrams
```

## Probability background

The 6d8 moving‑line rule in this project was chosen to **exactly match the line‑change probability distribution of the traditional yarrow‑stalk method** as computed and tabulated by Edward Hacker. (*Handbook*, p. 138) In broad strokes:

- When generating a line by yarrow stalks you obtain one of four numeric outcomes (often mapped to 6, 7, 8, 9). Two of these represent *moving* lines; the other two are *static*.
- The relative frequencies are *not* even; in particular, the event corresponding to yang→yin occurs markedly more often than yin→yang.
- By *conditioning* on the already‑known state of each line in your base hexagram (you rolled the trigrams first), you can emulate this asymmetry with a **single d8 draw per line**.

The resulting conditional probabilities implemented here are:

- **P(move | yang) = 3/8 = 37.5%** (draw 1‑3 ⇒ yang flips to yin).
- **P(move | yin) = 1/8 = 12.5%** (draw 8 ⇒ yin flips to yang).

These give a **3:1 ratio** favoring yang→yin transitions, echoing the traditional method’s bias. Exact equivalence is not claimed; the rule is intentionally *simple, easy to remember at the table,* and directionally faithful to Hacker’s analysis. If you prefer a different mapping, it is straightforward to modify the conditional checks in `iching-core.js`.

---

## Accessibility, responsiveness, and mobile tips

- Layout is responsive; tested down to narrow phone widths.
- Role labels can crowd the diagram on small screens. Use `?roles=off` to hide, or `?roles=big` if you actually want *more* mnemonic context (Earth/Man/Heaven suffixes).
- All numeric inputs are plain `<input type="number">` elements—mobile keyboards show numeric pads.
- High‑contrast red is used to call out moving lines; adjust in CSS if you need alternate color profiles.

---

## License

All **original code**, the **d8 probability method**, and *this documentation* are released into the **public domain** via the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) dedication. In jurisdictions where CC0 cannot waive all rights, you are granted a perpetual, royalty‑free, irrevocable license to use, modify, redistribute, and relicense the work for any purpose without attribution.

To make reuse easy, include (or leave in place) the `LICENSE` file in redistributions.

---

## Attribution & use of Hacker materials

This project draws heavily on Edward A. Hacker’s *I Ching Handbook* for:

- Hexagram **names** (Hacker’s comparative, cross‑translation choices).
- **Theme groups**.
- Conceptual framing for **hexagram flower** and **hexagram story**.
- Terminology such as **opposite** (full yin/yang flip) and **inverse** (upside‑down / reversed order).

Only *short identifying labels* derived from Hacker are included in the codebase; no copyrighted translation passages are distributed here. Please consult and support the original work for authoritative commentary and scholarship.

---

## Contributing

Pull requests welcome! Ideas:

- Additional probability schemes (coin method, 16‑token draw, true yarrow simulator).
- Option for alternate trigram orderings / mapping tables.
- Translations in other languages.
- Accessibility improvements and dark‑mode themes.
- Automated testing of relationship logic.

When contributing, please do **not** include large passages from copyrighted textual translations without permission. Currently, only James Legge’s translation of the *I Ching* to English is public domain; other translations (Wilhelm/Baynes, Greg Whincup, Thomas Cleary, Alfred Huang, Kerson Huang, Titus Yu, John Blofeld) are still copyrighted.

---

## Acknowledgments

- **Edward A. Hacker** for decades of meticulous comparative scholarship on the *I Ching*, whose ideas inspired many of this app’s features.
- The maintainers of the Unicode standard for providing glyphs for trigrams and hexagrams, making clean text rendering possible without images.
- Everyone who uses Platonic solids for divination, which is to say, rolls RPG dice.

---

**Enjoy exploring the *I Ching* with dice!** If you discover a bug or have an idea, open an issue or start a discussion.