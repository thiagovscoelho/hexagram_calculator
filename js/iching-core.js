/* ========== Core I Ching logic ========= */
class Trigram {
  static _data = {
    1: { binary: '000', name: 'Earth',    glyph: '☷', sequence: '2' },
    2: { binary: '001', name: 'Mountain', glyph: '☶', sequence: '7' },
    3: { binary: '010', name: 'Water',    glyph: '☵', sequence: '5' },
    4: { binary: '011', name: 'Wind',     glyph: '☴', sequence: '4' },
    5: { binary: '100', name: 'Thunder',  glyph: '☳', sequence: '3' },
    6: { binary: '101', name: 'Fire',     glyph: '☲', sequence: '6' },
    7: { binary: '110', name: 'Lake',     glyph: '☱', sequence: '8' },
    8: { binary: '111', name: 'Heaven',   glyph: '☰', sequence: '1' }
  };

  constructor(index) {
    if (!Number.isInteger(index) || index < 1 || index > 8) {
      throw new RangeError('Trigram index must be an integer between 1 and 8');
    }
    this._index = index;
    this._info = Trigram._data[index];
  }

  get binaryRepresentation() {
    return this._info.binary;
  }
  get decimalBinaryValue() {
    return parseInt(this._info.binary, 2);
  }
  get name() {
    return this._info.name;
  }
  get glyph() {
    return this._info.glyph;
  }
  get sequence() {
    return this._info.sequence;
  }

  opposite() {
    const flipped = this.binaryRepresentation.replace(/[01]/g, (b) => (b === '0' ? '1' : '0'));
    const newIndex = parseInt(flipped, 2) + 1;
    return new Trigram(newIndex);
  }

  inverse() {
    const reversed = this.binaryRepresentation.split('').reverse().join('');
    const newIndex = parseInt(reversed, 2) + 1;
    return new Trigram(newIndex);
  }
}

/* ----------- 64 hexagrams lookup table ----------- */
class Hexagram {
  static _data = {
    '8,8': { textualNumber: '01', name: 'Heaven', glyph: '䷀' },
    '1,1': { textualNumber: '02', name: 'Earth', glyph: '䷁' },
    '5,3': { textualNumber: '03', name: 'Sprouting', glyph: '䷂' },
    '3,2': { textualNumber: '04', name: 'The Young Shoot', glyph: '䷃' },
    '8,3': { textualNumber: '05', name: 'Getting Wet', glyph: '䷄' },
    '3,8': { textualNumber: '06', name: 'Grievance', glyph: '䷅' },
    '3,1': { textualNumber: '07', name: 'An Army', glyph: '䷆' },
    '1,3': { textualNumber: '08', name: 'Alliance', glyph: '䷇' },
    '8,4': { textualNumber: '09', name: 'Small Restraint / Small Accumulation', glyph: '䷈' },
    '7,8': { textualNumber: '10', name: 'Treading', glyph: '䷉' },
    '8,1': { textualNumber: '11', name: 'Peace / Flowing', glyph: '䷊' },
    '1,8': { textualNumber: '12', name: 'Standstill', glyph: '䷋' },
    '6,8': { textualNumber: '13', name: 'Companions', glyph: '䷌' },
    '8,6': { textualNumber: '14', name: 'Great Possessions', glyph: '䷍' },
    '2,1': { textualNumber: '15', name: 'Modesty', glyph: '䷎' },
    '1,5': { textualNumber: '16', name: 'Contentment', glyph: '䷏' },
    '5,7': { textualNumber: '17', name: 'The Chase', glyph: '䷐' },
    '4,2': { textualNumber: '18', name: 'Illness / Decay', glyph: '䷑' },
    '7,1': { textualNumber: '19', name: 'Authority Approaches', glyph: '䷒' },
    '1,4': { textualNumber: '20', name: 'Observing', glyph: '䷓' },
    '5,6': { textualNumber: '21', name: 'Biting Through', glyph: '䷔' },
    '6,2': { textualNumber: '22', name: 'Adornment', glyph: '䷕' },
    '1,2': { textualNumber: '23', name: 'Falling', glyph: '䷖' },
    '5,1': { textualNumber: '24', name: 'Return', glyph: '䷗' },
    '5,8': { textualNumber: '25', name: 'No Error / No Expectations', glyph: '䷘' },
    '8,2': { textualNumber: '26', name: 'Big Restraint', glyph: '䷙' },
    '5,2': { textualNumber: '27', name: 'Bulging Cheeks', glyph: '䷚' },
    '4,7': { textualNumber: '28', name: 'Big in Excess', glyph: '䷛' },
    '3,3': { textualNumber: '29', name: 'Water', glyph: '䷜' },
    '6,6': { textualNumber: '30', name: 'Fire', glyph: '䷝' },
    '2,7': { textualNumber: '31', name: 'Mutual Influence', glyph: '䷞' },
    '4,5': { textualNumber: '32', name: 'Constancy', glyph: '䷟' },
    '2,8': { textualNumber: '33', name: 'The Piglet', glyph: '䷠' },
    '8,5': { textualNumber: '34', name: 'Big Uses Force', glyph: '䷡' },
    '1,6': { textualNumber: '35', name: 'Advance', glyph: '䷢' },
    '6,1': { textualNumber: '36', name: 'The Bright (Calling) Pheasant', glyph: '䷣' },
    '6,4': { textualNumber: '37', name: 'The Family', glyph: '䷤' },
    '7,6': { textualNumber: '38', name: 'Estrangement', glyph: '䷥' },
    '2,3': { textualNumber: '39', name: 'Obstruction', glyph: '䷦' },
    '3,5': { textualNumber: '40', name: 'Obstruction Removed', glyph: '䷧' },
    '7,2': { textualNumber: '41', name: 'Decrease', glyph: '䷨' },
    '5,4': { textualNumber: '42', name: 'Increase', glyph: '䷩' },
    '8,7': { textualNumber: '43', name: 'Decisive', glyph: '䷪' },
    '4,8': { textualNumber: '44', name: 'Meeting / Subjugated', glyph: '䷫' },
    '1,7': { textualNumber: '45', name: 'Gathering Together', glyph: '䷬' },
    '4,1': { textualNumber: '46', name: 'Pushing Upwards', glyph: '䷭' },
    '3,7': { textualNumber: '47', name: 'Burdened / Exhausted', glyph: '䷮' },
    '4,3': { textualNumber: '48', name: 'A Well', glyph: '䷯' },
    '6,7': { textualNumber: '49', name: 'Revolution', glyph: '䷰' },
    '4,6': { textualNumber: '50', name: 'The Ritual Caldron', glyph: '䷱' },
    '5,5': { textualNumber: '51', name: 'Thunder', glyph: '䷲' },
    '2,2': { textualNumber: '52', name: 'Mountain', glyph: '䷳' },
    '2,4': { textualNumber: '53', name: 'Gradual Advance', glyph: '䷴' },
    '7,5': { textualNumber: '54', name: 'A Maiden Marries', glyph: '䷵' },
    '6,5': { textualNumber: '55', name: 'Abundance', glyph: '䷶' },
    '2,6': { textualNumber: '56', name: 'The Traveler', glyph: '䷷' },
    '4,4': { textualNumber: '57', name: 'Wind', glyph: '䷸' },
    '7,7': { textualNumber: '58', name: 'Lake', glyph: '䷹' },
    '3,4': { textualNumber: '59', name: 'Flood / Dispersion', glyph: '䷺' },
    '7,3': { textualNumber: '60', name: 'Restraint (Regulations)', glyph: '䷻' },
    '7,4': { textualNumber: '61', name: 'Inmost Sincerity (Allegiance)', glyph: '䷼' },
    '2,5': { textualNumber: '62', name: 'Small in Excess', glyph: '䷽' },
    '6,3': { textualNumber: '63', name: 'Already Across the River', glyph: '䷾' },
    '3,6': { textualNumber: '64', name: 'Not Yet Across the River', glyph: '䷿' }
  };

  constructor(lowerTrigram, upperTrigram, draws = null) {
    if (!(lowerTrigram instanceof Trigram) || !(upperTrigram instanceof Trigram)) {
      throw new TypeError('Both arguments must be Trigram instances');
    }
    this.lowerTrigram = lowerTrigram;
    this.upperTrigram = upperTrigram;
    const key = `${lowerTrigram._index},${upperTrigram._index}`;
    this._info = Hexagram._data[key];
    if (!this._info) {
      throw new Error(`Unknown hexagram for trigrams ${key}`);
    }
    if (draws !== null) this.setDraws(draws);
  }

  setDraws(draws) {
    if (!Array.isArray(draws) || draws.length !== 6 || !draws.every((d) => Number.isInteger(d) && d >= 1 && d <= 8)) {
      throw new RangeError('Draws must be an array of six integers from 1 to 8');
    }
    this.draws = draws;
  }

  get binaryRepresentation() {
    return this.lowerTrigram.binaryRepresentation + this.upperTrigram.binaryRepresentation;
  }
  get decimalBinaryValue() {
    return parseInt(this.binaryRepresentation, 2);
  }
  get textualNumber() {
    return this._info.textualNumber;
  }
  get name() {
    return this._info.name;
  }
  get glyph() {
    return this._info.glyph;
  }

  /** @returns {number[]} six bits [line 1 … line 6] where
   *  index 0 = bottom line, index 5 = top line
   */
  get lines() {
    const lo = this.lowerTrigram.binaryRepresentation; // dataset is bottom→top
    const up = this.upperTrigram.binaryRepresentation;
    return [
      Number(lo[0]), Number(lo[1]), Number(lo[2]),   // lower trigram
      Number(up[0]), Number(up[1]), Number(up[2])    // upper trigram
    ];
  }

  get movingLines() {
    if (!this.draws) {
      throw new Error('Draws not set; call setDraws() first');
    }
    return this.lines.map((bit, i) => {
      const draw = this.draws[i];
      return (bit === 1 && draw <= 3) || (bit === 0 && draw === 8);
    });
  }

  /**
   * Return the hexagram obtained after all moving lines flip.
   * Requires six draws to have been set.
   */
  target() {
    if (!this.draws) {
      throw new Error('Draws not set; call setDraws() first');
    }

    // flip every line that is “moving”
    const flipped = this.lines.map((bit, i) =>
      this.movingLines[i] ? 1 - bit : bit
    ); // bottom → top

    /* rebuild each trigram’s 3-bit string
       — dataset stores bits bottom→top                              */
    const lowerBits = '' + flipped[0] + flipped[1] + flipped[2];
    const upperBits = '' + flipped[3] + flipped[4] + flipped[5];

    const lowerIdx = parseInt(lowerBits, 2) + 1;
    const upperIdx = parseInt(upperBits, 2) + 1;

    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx));
  }

  _nuclearFromPattern(pattern) {
    const origLines = this.lines;
    const newBits = pattern
      .map((i) => origLines[i - 1])
      .slice()
      .reverse()
      .join('');
    const loIndex = parseInt(newBits.slice(0, 3), 2) + 1;
    const hiIndex = parseInt(newBits.slice(3), 2) + 1;
    return Hexagram.combine(new Trigram(loIndex), new Trigram(hiIndex));
  }

  nuclear() {
    return this._nuclearFromPattern([2, 3, 4, 3, 4, 5]);
  }
  secondNuclear() {
    return this._nuclearFromPattern([1, 2, 3, 2, 3, 4]);
  }
  thirdNuclear() {
    return this._nuclearFromPattern([3, 4, 5, 4, 5, 6]);
  }
  fourthNuclear() {
    return this._nuclearFromPattern([1, 2, 3, 3, 4, 5]);
  }
  fifthNuclear() {
    return this._nuclearFromPattern([2, 3, 4, 4, 5, 6]);
  }

  /* ───── line-level helpers ───────────────────────────── */

  /** Return `true` if the given 1-based line number is “correct”. */
  isCorrect(lineNo) {
    const bit = this.lines[lineNo - 1];                 // 0 = yin, 1 = yang
    return (lineNo % 2 === 1) ? bit === 1               // 1,3,5 ⇒ yang
                              : bit === 0;              // 2,4,6 ⇒ yin
  }

  /** Lines whose current state is correct.  */
  correctLines()   { return [1,2,3,4,5,6].filter(n => this.isCorrect(n)); }

  /** Lines whose current state is *not* correct. */
  incorrectLines() { return [1,2,3,4,5,6].filter(n => !this.isCorrect(n)); }

  /** Successive-line pairs and whether they “hold together”.       */
  holdingPairs() {
    return Array.from({ length: 5 }, (_, i) => {
      const a = i + 1, b = i + 2;
      return { a, b, holds: this.lines[i] !== this.lines[i + 1] };
    });
  }

  /** (1,4) (2,5) (3,6) pairs and whether they correspond.          */
  correspondencePairs() {
    return [0,1,2].map(i => {
      const a = i + 1, b = i + 4;
      return { a, b, corresponds: this.lines[i] !== this.lines[i + 3] };
    });
  }


  /**
   * Barber-pole rotation (new rule)
   * – Move line 6 (the top line) to line 1 (the bottom line),
   *   and shift every other line up by one position.
   *
   *   Example 111010 → 011101
   */
  rotate() {
    // bits[0] = line 1 (bottom) … bits[5] = line 6 (top)
    const bits = this.binaryRepresentation.split('').map(b => +b);

    // Move the top line to the bottom.
    const shifted = [bits[5], ...bits.slice(0, 5)];

    // Re-create the 6-bit string, still in bottom→top order.
    const newBin = shifted.join('');

    // Re-build the two trigrams.
    const lowerIdx = parseInt(newBin.slice(0, 3), 2) + 1; // +1 because indices run 1-8
    const upperIdx = parseInt(newBin.slice(3), 2) + 1;

    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx));
  }

  
  /** Return the rotation-cycle until we’re back at this hexagram */
  cycle() {
    const cycle = [this];
    let next = this.rotate();
    while (next.decimalBinaryValue !== this.decimalBinaryValue) {
      cycle.push(next);
      next = next.rotate();
    }
    return cycle;          // e.g. length 1, 2, 3 or 6
  }

  opposite() {
    const flipped = this.binaryRepresentation.replace(/[01]/g, (b) => (b === '0' ? '1' : '0'));
    const lowerIdx = parseInt(flipped.slice(0, 3), 2) + 1;
    const upperIdx = parseInt(flipped.slice(3), 2) + 1;
    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx));
  }

  inverse() {
    const reversed = this.binaryRepresentation.split('').reverse().join('');
    const lowerIdx = parseInt(reversed.slice(0, 3), 2) + 1;
    const upperIdx = parseInt(reversed.slice(3), 2) + 1;
    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx));
  }

  /**
   * Flip the given 1-based line positions (1 = bottom, 6 = top)
   * and return the new Hexagram.
   * @param {number[]} indices
   * @private
   */
  _flipLines(indices) {
    // bits[0] is bottom-most binary bit, bits[5] is top-most
    const bits = this.binaryRepresentation.split('').map(b => (b === '1' ? 1 : 0));
    indices.forEach(i => {
      const bitIdx = 6 - i;            // map line position → bit index
      bits[bitIdx] ^= 1;               // flip 0↔1
    });
    const newBin   = bits.join('');
    const lowerIdx = parseInt(newBin.slice(0, 3), 2) + 1;
    const upperIdx = parseInt(newBin.slice(3),    2) + 1;
    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx));
  }

  /**
   * “Flower” : hexagrams obtained by flipping each single line.
   * – antecedents: flip a 0→1 (yin→yang) line
   * – consequents: flip a 1→0 (yang→yin) line
   * @returns {{ antecedents: Hexagram[], consequents: Hexagram[] }}
   */
  flower() {
    const antecedents = [];
    const consequents = [];
    // this.lines is [line1…line6]  (1 = bottom)
    this.lines.forEach((bit, idx) => {
      const petal = this._flipLines([idx + 1]);   // flip just this line
      if (bit === 0) {
        antecedents.push(petal);   // was yin → became yang
      } else {
        consequents.push(petal);   // was yang → became yin
      }
    });
    return { antecedents, consequents };
  }
  
  /**
   * “Story” sequence:
   *   0: original
   *   1‒6: flip lines 1…k
   *   7‒11: flip lines k…6  (k = 2…6)
   *   12: back to original
   * @returns {Hexagram[]}
   */
  story() {
    const seq = [this];

    // forward: flip [1..k]
    for (let k = 1; k <= 6; k++) {
      seq.push(this._flipLines(Array.from({ length: k }, (_, i) => i + 1)));
    }

    // backward: flip [k..6]
    for (let k = 2; k <= 6; k++) {
      const len = 7 - k;          // so k … 6 inclusive
      seq.push(this._flipLines(Array.from({ length: len }, (_, i) => k + i)));
    }

    // close the loop
    seq.push(this);
    return seq;
  }
  
  static combine(lower, upper, draws = null) {
    return new Hexagram(lower, upper, draws);
  }
}