/* ========== Core I Ching logic ========= */
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
    '3,2': { textualNumber: '04', name: 'The Young Shoot', glyph: '䷃' },
    '8,3': { textualNumber: '05', name: 'Getting Wet', glyph: '䷄' },
    '3,8': { textualNumber: '06', name: 'Grievance', glyph: '䷅' },
    '3,1': { textualNumber: '07', name: 'An Army', glyph: '䷆' },
    '1,3': { textualNumber: '08', name: 'Alliance', glyph: '䷇' },
    '8,4': { textualNumber: '09', name: 'Small Restraint / Small Accumulation', glyph: '䷈' },
    '7,8': { textualNumber: '10', name: 'Treading', glyph: '䷉' },
    '8,1': { textualNumber: '11', name: 'Peace / Flowing', glyph: '䷊' },
    '1,8': { textualNumber: '12', name: 'Standstill', glyph: '䷋' },
    '6,8': { textualNumber: '13', name: 'Companions', glyph: '䷌' },
    '8,6': { textualNumber: '14', name: 'Great Possessions', glyph: '䷍' },
    '2,1': { textualNumber: '15', name: 'Modesty', glyph: '䷎' },
    '1,5': { textualNumber: '16', name: 'Contentment', glyph: '䷏' },
    '5,7': { textualNumber: '17', name: 'The Chase', glyph: '䷐' },
    '4,2': { textualNumber: '18', name: 'Illness / Decay', glyph: '䷑' },
    '7,1': { textualNumber: '19', name: 'Authority Approaches', glyph: '䷒' },
    '1,4': { textualNumber: '20', name: 'Observing', glyph: '䷓' },
    '5,6': { textualNumber: '21', name: 'Biting Through', glyph: '䷔' },
    '6,2': { textualNumber: '22', name: 'Adornment', glyph: '䷕' },
    '1,2': { textualNumber: '23', name: 'Falling', glyph: '䷖' },
    '5,1': { textualNumber: '24', name: 'Return', glyph: '䷗' },
    '5,8': { textualNumber: '25', name: 'No Error / No Expectations', glyph: '䷘' },
    '8,2': { textualNumber: '26', name: 'Big Restraint', glyph: '䷙' },
    '5,2': { textualNumber: '27', name: 'Bulging Cheeks', glyph: '䷚' },
    '4,7': { textualNumber: '28', name: 'Big in Excess', glyph: '䷛' },
    '3,3': { textualNumber: '29', name: 'Water', glyph: '䷜' },
    '6,6': { textualNumber: '30', name: 'Fire', glyph: '䷝' },
    '2,7': { textualNumber: '31', name: 'Mutual Influence', glyph: '䷞' },
    '4,5': { textualNumber: '32', name: 'Constancy', glyph: '䷟' },
    '2,8': { textualNumber: '33', name: 'The Piglet', glyph: '䷠' },
    '8,5': { textualNumber: '34', name: 'Big Uses Force', glyph: '䷡' },
    '1,6': { textualNumber: '35', name: 'Advance', glyph: '䷢' },
    '6,1': { textualNumber: '36', name: 'The Bright (Calling) Pheasant', glyph: '䷣' },
    '6,4': { textualNumber: '37', name: 'The Family', glyph: '䷤' },
    '7,6': { textualNumber: '38', name: 'Estrangement', glyph: '䷥' },
    '2,3': { textualNumber: '39', name: 'Obstruction', glyph: '䷦' },
    '3,5': { textualNumber: '40', name: 'Obstruction Removed', glyph: '䷧' },
    '7,2': { textualNumber: '41', name: 'Decrease', glyph: '䷨' },
    '5,4': { textualNumber: '42', name: 'Increase', glyph: '䷩' },
    '8,7': { textualNumber: '43', name: 'Decisive', glyph: '䷪' },
    '4,8': { textualNumber: '44', name: 'Meeting / Subjugated', glyph: '䷫' },
    '1,7': { textualNumber: '45', name: 'Gathering Together', glyph: '䷬' },
    '4,1': { textualNumber: '46', name: 'Pushing Upwards', glyph: '䷭' },
    '3,7': { textualNumber: '47', name: 'Burdened / Exhausted', glyph: '䷮' },
    '4,3': { textualNumber: '48', name: 'A Well', glyph: '䷯' },
    '6,7': { textualNumber: '49', name: 'Revolution', glyph: '䷰' },
    '4,6': { textualNumber: '50', name: 'The Ritual Caldron', glyph: '䷱' },
    '5,5': { textualNumber: '51', name: 'Thunder', glyph: '䷲' },
    '2,2': { textualNumber: '52', name: 'Mountain', glyph: '䷳' },
    '2,4': { textualNumber: '53', name: 'Gradual Advance', glyph: '䷴' },
    '7,5': { textualNumber: '54', name: 'A Maiden Marries', glyph: '䷵' },
    '6,5': { textualNumber: '55', name: 'Abundance', glyph: '䷶' },
    '2,6': { textualNumber: '56', name: 'The Traveler', glyph: '䷷' },
    '4,4': { textualNumber: '57', name: 'Wind', glyph: '䷸' },
    '7,7': { textualNumber: '58', name: 'Lake', glyph: '䷹' },
    '3,4': { textualNumber: '59', name: 'Flood / Dispersion', glyph: '䷺' },
    '7,3': { textualNumber: '60', name: 'Restraint (Regulations)', glyph: '䷻' },
    '7,4': { textualNumber: '61', name: 'Inmost Sincerity (Allegiance)', glyph: '䷼' },
    '2,5': { textualNumber: '62', name: 'Small in Excess', glyph: '䷽' },
    '6,3': { textualNumber: '63', name: 'Already Across the River', glyph: '䷾' },
    '3,6': { textualNumber: '64', name: 'Not Yet Across the River', glyph: '䷿' }
  };
  
  /* ----------- Line roles & domains (1 = bottom … 6 = top) ----------- */
  static _lineInfo = Object.freeze({
    1: { role: 'Common-man',         domain: 'Earth'  },
    2: { role: 'The Great Official', domain: 'Earth'  },
    3: { role: 'Transitional',       domain: 'Man'    },
    4: { role: 'Minister/Advisor',   domain: 'Man'    },
    5: { role: 'The Ruler',          domain: 'Heaven' },
    6: { role: 'The Sage',           domain: 'Heaven' }
  });

  /** Get the role/domain metadata for a specific 1-based line number. */
  static lineInfo(lineNo) {
    if (!Number.isInteger(lineNo) || lineNo < 1 || lineNo > 6) {
      throw new RangeError('Line number must be 1..6');
    }
    return Hexagram._lineInfo[lineNo];
  }

  /** Instance helpers (convenient when you already have a hexagram). */
  lineRole(lineNo)   { return Hexagram.lineInfo(lineNo).role; }
  lineDomain(lineNo) { return Hexagram.lineInfo(lineNo).domain; }

  /** Arrays bottom→top, aligned with this.lines */
  get lineRoles()   { return [1,2,3,4,5,6].map(n => Hexagram._lineInfo[n].role); }
  get lineDomains() { return [1,2,3,4,5,6].map(n => Hexagram._lineInfo[n].domain); }

  /* ----------- Emblems (adjacent-line digrams) ----------- */
  static _EMBLEMS = Object.freeze({
    '11': { glyph: '⚌', name: 'Great Yang (Old Yang)' },
    '10': { glyph: '⚍', name: 'Little Yang (Young Yang)' },
    '00': { glyph: '⚏', name: 'Great Yin (Old Yin)' },
    '01': { glyph: '⚎', name: 'Little Yin (Young Yin)' }
  });

  static _emblemFromBits(b1, b2) {
    const key = '' + b1 + b2;         // e.g. '10'
    const e = Hexagram._EMBLEMS[key];
    if (!e) throw new Error(`Invalid emblem bits: ${key}`);
    // include binary so callers can compare quickly
    return { binary: key, glyph: e.glyph, name: e.name };
  }

  /**
   * Emblem for lines (i, i+1) where i = 1..5 (1 = bottom line).
   * Returns { pair:[i,i+1], from:{binary,glyph,name}, to?:{...}, changed?:boolean }.
   * If kinetic info exists (this.draws set), includes the target emblem (“moving toward …”).
   */
  emblemAt(i) {
    if (!Number.isInteger(i) || i < 1 || i > 5) {
      throw new RangeError('emblemAt(i): i must be 1..5');
    }
    const bits = this.lines; // bottom→top: [l1..l6] as 0/1
    const from = Hexagram._emblemFromBits(bits[i - 1], bits[i]);
    const out = { pair: [i, i + 1], from };

    if (this.draws) {
      const tgtBits = this.target().lines;
      const to = Hexagram._emblemFromBits(tgtBits[i - 1], tgtBits[i]);
      out.to = to;
      out.changed = (from.binary !== to.binary);
    }
    return out;
  }

  /**
   * All five emblems, from (1,2) through (5,6).
   * Each item: { pair:[i,i+1], from:{binary,glyph,name}, [to], [changed] }
   */
  emblems() {
    const bits = this.lines;
    const haveTarget = !!this.draws;
    const tgtBits = haveTarget ? this.target().lines : null;

    const res = [];
    for (let i = 1; i <= 5; i++) {
      const from = Hexagram._emblemFromBits(bits[i - 1], bits[i]);
      const item = { pair: [i, i + 1], from };
      if (haveTarget) {
        const to = Hexagram._emblemFromBits(tgtBits[i - 1], tgtBits[i]);
        item.to = to;
        item.changed = (from.binary !== to.binary);
      }
      res.push(item);
    }
    return res;
  }

  /** Convenience: render the five emblems as strings. format='glyph'|'binary'|'name' */
  renderEmblems(format = 'glyph', { separator = ' | ', arrow = ' → ' } = {}) {
    const pick = (e) => (format === 'binary' ? e.binary : format === 'name' ? e.name : e.glyph);
    return this.emblems().map((em) => {
      if (em.to) return `${pick(em.from)}${arrow}${pick(em.to)}`;
      return pick(em.from);
    }).join(separator);
  }
  
  /* ----------- Notation formatting & parsing (bottom→top = lines 1..6) ----------- */

  // State index order: 0=Static Yang, 1=Moving Yang, 2=Static Yin, 3=Moving Yin
  static _FORMAT_DEFS = Object.freeze({
    binary: {
      encode: ['1', '1*', '0', '0*'],
      // token is like "1", "1*", "0", "0*"
      decodeToken(tok) {
        if (tok === '1' || tok === '1*') return { bit: 1, moving: tok.length === 2 };
        if (tok === '0' || tok === '0*') return { bit: 0, moving: tok.length === 2 };
        throw new Error(`Invalid binary token: ${tok}`);
      },
      contiguous: true
    },
    glyph: {
      encode: ['⚊', '⚊*', '⚋', '⚋*'],
      decodeToken(tok) {
        if (tok === '⚊' || tok === '⚊*') return { bit: 1, moving: tok.length === 2 };
        if (tok === '⚋' || tok === '⚋*') return { bit: 0, moving: tok.length === 2 };
        throw new Error(`Invalid glyph token: ${tok}`);
      },
      contiguous: true
    },
    '9876': {
      encode: ['7', '9', '8', '6'],          // 7=yang, 9=moving yang, 8=yin, 6=moving yin
      decodeToken(tok) {
        if (tok === '7') return { bit: 1, moving: false };
        if (tok === '9') return { bit: 1, moving: true  };
        if (tok === '8') return { bit: 0, moving: false };
        if (tok === '6') return { bit: 0, moving: true  };
        throw new Error(`Invalid 9876 token: ${tok}`);
      },
      contiguous: true
    },
    hanzi: {
      encode: ['阳', '阳*', '阴', '阴*'],
      decodeToken(tok) {
        if (tok === '阳' || tok === '阳*') return { bit: 1, moving: tok.length === 2 };
        if (tok === '阴' || tok === '阴*') return { bit: 0, moving: tok.length === 2 };
        throw new Error(`Invalid hanzi token: ${tok}`);
      },
      contiguous: true
    },
    shortStrength: {
      encode: ['Strong', 'Strong*', 'Weak', 'Weak*'],
      decodeToken(tok) {
        if (tok === 'Strong' || tok === 'Strong*') return { bit: 1, moving: tok.endsWith('*') };
        if (tok === 'Weak'   || tok === 'Weak*')   return { bit: 0, moving: tok.endsWith('*') };
        throw new Error(`Invalid shortStrength token: ${tok}`);
      },
      // allows contiguous like "Strong*WeakWeakStrong..."
      pattern: /(Strong\*?|Weak\*?)/g,
      contiguous: true
    },
    longStrength: {
      encode: ['Strong', 'Strong→Weak', 'Weak', 'Weak→Strong'],
      decodeToken(tok) {
        if (tok === 'Strong')          return { bit: 1, moving: false };
        if (tok === 'Strong→Weak')     return { bit: 1, moving: true  };
        if (tok === 'Weak')            return { bit: 0, moving: false };
        if (tok === 'Weak→Strong')     return { bit: 0, moving: true  };
        throw new Error(`Invalid longStrength token: ${tok}`);
      },
      pattern: /(Strong→Weak|Weak→Strong|Strong|Weak)/g,
      contiguous: true
    }
  });

  /** Utility: from (bit,moving) → 0..3 state index in StaticYang,MovingYang,StaticYin,MovingYin order */
  static _stateIndex(bit, moving) { return bit === 1 ? (moving ? 1 : 0) : (moving ? 3 : 2); }

  /** Utility: build draws array from bits & moving flags (canonical values: 4/7 static, 3/8 moving) */
  static _drawFor(bit, moving) {
    if (bit === 1) return moving ? 3 : 4; // yang: moving→3, static→4
    return moving ? 8 : 7;                // yin : moving→8, static→7
  }

  /**
   * Create a new Hexagram with the same trigrams but with moving lines set by a boolean mask.
   * @param {boolean[]} mask six booleans (index 0=bottom line)
   */
  withKinetics(mask) {
    if (!Array.isArray(mask) || mask.length !== 6 || !mask.every(v => typeof v === 'boolean')) {
      throw new RangeError('withKinetics(mask): mask must be an array of 6 booleans');
    }
    const bits = this.lines; // [0/1 x6]
    const draws = bits.map((b, i) => Hexagram._drawFor(b, mask[i]));
    return Hexagram.combine(this.lowerTrigram, this.upperTrigram, draws);
  }

  /**
   * Render this hexagram in a given format.
   * @param {'binary'|'glyph'|'9876'|'hanzi'|'shortStrength'|'longStrength'} format
   * @param {{separator?: string, trigramSeparator?: string, movingMask?: boolean[]}} opts
   */
  render(format = 'binary', opts = {}) {
    const def = Hexagram._FORMAT_DEFS[format];
    if (!def) throw new Error(`Unknown format: ${format}`);

    const { separator = '', trigramSeparator = '', movingMask = null } = opts;
    const bits = this.lines; // bottom→top
    const moves = movingMask
      ? movingMask
      : (this.draws ? this.movingLines : [false, false, false, false, false, false]);

    const tokens = bits.map((bit, i) => {
      const idx = Hexagram._stateIndex(bit, !!moves[i]);
      return def.encode[idx];
    });

    if (trigramSeparator) tokens.splice(3, 0, trigramSeparator);
    return separator ? tokens.join(separator) : tokens.join('');
  }

  /**
   * Parse a string into a Hexagram. If moving info not present, lines are assumed static.
   * Returns a Hexagram with canonical draws set to reflect moving/static states.
   * @param {string} input
   * @param {{format?: 'auto'|'binary'|'glyph'|'9876'|'hanzi'|'shortStrength'|'longStrength'}} opts
   */
  static parse(input, opts = {}) {
    const format = (opts.format || 'auto');
    const trimmed = String(input).trim();

    // Auto-detect simple cases
    const resolvedFmt = format === 'auto' ? (() => {
      if (/^[01*\s,._\-–—/|\\]+$/.test(trimmed)) return 'binary';
      if (/^[6789\s,._\-–—/|\\]+$/.test(trimmed)) return '9876';
      if (/[⚊⚋]/.test(trimmed))                  return 'glyph';
      if (/[阴阳]/.test(trimmed))                 return 'hanzi';
      if (/Strong→Weak|Weak→Strong/.test(trimmed))return 'longStrength';
      if (/Strong|Weak/.test(trimmed))            return 'shortStrength';
      throw new Error('Unable to auto-detect format.');
    })() : format;

    const def = Hexagram._FORMAT_DEFS[resolvedFmt];
    if (!def) throw new Error(`Unknown format: ${resolvedFmt}`);

    // Tokenize:
    let tokens = [];
    if (def.contiguous) {
      if (def.pattern) {
        tokens = (trimmed.match(def.pattern) || []);
      } else if (resolvedFmt === '9876') {
        tokens = trimmed.replace(/[^\d]/g, '').split('');
      } else if (resolvedFmt === 'glyph') {
        // collect glyphs, allow optional trailing * and ignore separators
        tokens = [];
        for (let i = 0; i < trimmed.length; i++) {
          const ch = trimmed[i];
          if (ch === '⚊' || ch === '⚋') {
            let tok = ch;
            if (trimmed[i + 1] === '*') { tok += '*'; i++; }
            tokens.push(tok);
          } // else ignore separators
        }
      } else if (resolvedFmt === 'hanzi') {
        tokens = [];
        for (let i = 0; i < trimmed.length; i++) {
          const ch = trimmed[i];
          if (ch === '阳' || ch === '阴') {
            let tok = ch;
            if (trimmed[i + 1] === '*') { tok += '*'; i++; }
            tokens.push(tok);
          }
        }
      } else if (resolvedFmt === 'binary') {
        tokens = [];
        for (let i = 0; i < trimmed.length; i++) {
          const ch = trimmed[i];
          if (ch === '0' || ch === '1') {
            let tok = ch;
            if (trimmed[i + 1] === '*') { tok += '*'; i++; }
            tokens.push(tok);
          } // else ignore separators
        }
      }
    }

    // If splitting didn’t find anything, try generic split on separators
    if (tokens.length === 0) {
      tokens = trimmed.split(/[,\s|/_\-–—]+/).filter(Boolean);
    }

    if (tokens.length !== 6) {
      throw new Error(`Expected 6 line tokens, got ${tokens.length}`);
    }

    // Decode tokens → bits & moving flags
    const bits   = new Array(6);
    const moving = new Array(6);
    for (let i = 0; i < 6; i++) {
      const { bit, moving: mv } = def.decodeToken(tokens[i]);
      bits[i] = bit;
      moving[i] = !!mv;
    }

    // Build trigrams & canonical draws
    const lowerIdx = parseInt(`${bits[0]}${bits[1]}${bits[2]}`, 2) + 1;
    const upperIdx = parseInt(`${bits[3]}${bits[4]}${bits[5]}`, 2) + 1;

    const draws = bits.map((b, i) => Hexagram._drawFor(b, moving[i]));
    return Hexagram.combine(new Trigram(lowerIdx), new Trigram(upperIdx), draws);
  }
  
  // End of notation code -------------------------------------------------------------------
  
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