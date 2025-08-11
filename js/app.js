/* ========== App Logic & UI ========= */
// generate six number inputs dynamically so they can be styled uniformly
(function addDrawInputs() {
  const container = document.getElementById('drawInputs');
  for (let i = 0; i < 6; i++) {
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.min = '1';
    inp.max = '8';
    inp.placeholder = '–';
    container.appendChild(inp); // spacing handled purely by CSS now
  }
})();

/* ---- “Random Hexagram” helper ---------------------------------- */
(function addRandomButtonLogic () {
  const randBtn = document.getElementById('randomBtn');
  const randD8  = () => Math.floor(Math.random() * 8) + 1;   // [1‥8]

  randBtn.addEventListener('click', () => {
    // trigram inputs
    document.getElementById('lower').value = randD8();
    document.getElementById('upper').value = randD8();

    // six moving-line draws
    document.querySelectorAll('#drawInputs input').forEach(inp => {
      inp.value = randD8();
    });
  });
})();

/* ---- Theme group lookup --------------------------------------- */
const THEME_GROUP_MAP = (() => {
  const m = new Map();
  const add = (name, arr) => arr.forEach(n => m.set(n, name));
  add('Groups',                    [7, 8, 13, 31, 32, 37, 45, 48]);
  add('Relationships',             [3, 4, 6, 21, 38, 49, 54, 56]);
  add('Small Advancing',           [10, 18, 23, 33, 36, 44, 47, 62]);
  add('Big Advancing',             [24, 35, 40, 42, 43, 46, 51, 53]);
  add('Obstacles & Limitations',   [5, 9, 26, 27, 29, 39, 41, 60]);
  add('Big in Power',              [14, 16, 17, 19, 20, 28, 34, 55]);
  add('Proper Conduct',            [15, 25, 30, 52, 57, 58, 59, 61]);
  add('Cosmic & Social',           [1, 2, 11, 12, 22, 50, 63, 64]);
  return m;
})();

function getThemeGroup(hex) {
  const n = parseInt(hex.textualNumber, 10);
  return THEME_GROUP_MAP.get(n) || 'Unknown';
}

/* ===== URL param: roles =========================================
   Accepts:
     ?roles=off  → omit per-line role titles
     ?roles=big  → append (Earth/Man/Heaven)
     (default)   → current / normal roles
----------------------------------------------------------------- */
const _params    = new URLSearchParams(window.location.search);
const ROLES_MODE = (_params.get('roles') || 'on').toLowerCase(); // 'on'|'off'|'big'

/** Build the label for a 0-based line index from Hexagram’s static metadata. */
function roleLabelForLine(idxZero) {
  if (ROLES_MODE === 'off') return '';
  const lineNo  = idxZero + 1; // 1..6
  const info    = Hexagram.lineInfo(lineNo);
  if (ROLES_MODE === 'big') return `${info.role} (${info.domain})`;
  return info.role; // default
}

// handle form submission
const form = document.getElementById('hexForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const lowerVal = parseInt(document.getElementById('lower').value, 10);
  const upperVal = parseInt(document.getElementById('upper').value, 10);

  if (!Number.isInteger(lowerVal) || lowerVal < 1 || lowerVal > 8 || !Number.isInteger(upperVal) || upperVal < 1 || upperVal > 8) {
    alert('Each trigram index must be an integer from 1 to 8.');
    return;
  }

  const drawInputs = document.querySelectorAll('#drawInputs input');
  const draws = Array.from(drawInputs)
    .map((inp) => parseInt(inp.value, 10))
    .filter((v) => !isNaN(v));

  if (draws.length !== 0 && draws.length !== 6) {
    alert('Please leave all draw boxes empty or fill in EXACTLY six integers (1 – 8).');
    return;
  }

  let hexagram;
  try {
    hexagram = new Hexagram(new Trigram(lowerVal), new Trigram(upperVal), draws.length === 6 ? draws : null);
  } catch (err) {
    alert(err.message);
    return;
  }

  renderResults(hexagram, draws.length === 6 ? draws : null);
});

/* ===== NOTATION READER (NEW) ===================================== */
(function addNotationReader() {
  const btn = document.getElementById('readBtn');
  const inp = document.getElementById('notationInput');
  if (!btn || !inp) return;

  btn.addEventListener('click', () => {
    const raw = (inp.value || '').trim();
    if (!raw) {
      alert('Please paste or type a hexagram code.');
      return;
    }
    let parsed;
    try {
      parsed = Hexagram.parse(raw, { format: 'auto' }); // auto-detects Binary/Glyph/9876/Hanzi/Strength
    } catch (err) {
      alert('Could not read that code: ' + err.message);
      return;
    }

    // Fill the form fields so users can see/adjust inputs later.
    document.getElementById('lower').value = parsed.lowerTrigram._index; // indices 1..8
    document.getElementById('upper').value = parsed.upperTrigram._index;

    const drawInputs = document.querySelectorAll('#drawInputs input');
    parsed.draws.forEach((d, i) => { drawInputs[i].value = d; });

    // Render using the parsed hexagram + its canonical draws
    renderResults(parsed, parsed.draws);
  });
})();

function renderResults(hex, draws) {
  const targetDiv = document.getElementById('results');
  targetDiv.innerHTML = '';

  const heading = document.createElement('h2');
  heading.innerHTML = `Hexagram ${hex.textualNumber}: ${hex.name} <span class="glyph">${hex.glyph}</span>`;
  targetDiv.appendChild(heading);

  // ====== Compact notation picker (Binary* default) ======
  const pMeta = document.createElement('p');
  pMeta.className = 'notation-toolbar'; // NEW: style the picker row

  const select = document.createElement('select');
  select.id = 'notationSelect';
  [
    { value: 'binary-star', label: 'Binary*' },
    { value: 'binary',      label: 'Binary' },
    { value: '9876',        label: '9876' },
    { value: 'hanzi-star',  label: 'Hanzi*' },
    { value: 'hanzi',       label: 'Hanzi' },
    { value: 'glyph-star',  label: 'Unicode*' },
    { value: 'glyph',       label: 'Unicode' }
  ].forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.label;
    select.appendChild(o);
  });
  select.value = 'binary-star';

  const notationOut = document.createElement('span');
  notationOut.className = 'notation-out'; // NEW: pill styling for the code

  const decLabel = document.createElement('strong');
  decLabel.textContent = 'Decimal:';

  const sep = document.createTextNode(' \u00A0•\u00A0 ');

  pMeta.appendChild(select);
  pMeta.appendChild(document.createTextNode(': '));
  pMeta.appendChild(notationOut);
  pMeta.appendChild(sep);
  pMeta.appendChild(decLabel);
  pMeta.appendChild(document.createTextNode(' ' + hex.decimalBinaryValue));
  targetDiv.appendChild(pMeta);

  function renderNotation(value) {
    const haveMoves = !!draws;
    const allStaticMask = [false, false, false, false, false, false];

    switch (value) {
      case 'binary-star':
        return hex.render('binary', { trigramSeparator: '-', ...(haveMoves ? {} : { movingMask: allStaticMask }) });
      case 'binary':
        return hex.render('binary', { trigramSeparator: '-', movingMask: allStaticMask });
      case '9876':
        return hex.render('9876',   { trigramSeparator: '-' });
      case 'hanzi-star':
        return hex.render('hanzi',  { separator: ', ', ...(haveMoves ? {} : { movingMask: allStaticMask }) });
      case 'hanzi':
        return hex.render('hanzi',  { separator: ', ', movingMask: allStaticMask });
      case 'glyph-star':
        return hex.render('glyph',  { separator: ', ', ...(haveMoves ? {} : { movingMask: allStaticMask }) });
      case 'glyph':
        return hex.render('glyph',  { separator: ', ', movingMask: allStaticMask });
      default:
        return '';
    }
  }

  const updateNotation = () => { notationOut.textContent = renderNotation(select.value); };
  select.addEventListener('change', updateNotation);
  updateNotation();
  // ===== end notation picker =====

  /* ---------- upper / lower trigram read-out ---------- */
  const pTris = document.createElement('p');
  pTris.style.marginTop = '0.8rem';
  pTris.innerHTML =
    `<strong>Upper trigram:</strong> Trigram ${hex.upperTrigram.sequence} ${hex.upperTrigram.glyph} ` +
    `${hex.upperTrigram.binaryRepresentation} (${hex.upperTrigram.decimalBinaryValue}) ${hex.upperTrigram.name}<br>` +
    `<strong>Lower trigram:</strong> Trigram ${hex.lowerTrigram.sequence} ${hex.lowerTrigram.glyph} ` +
    `${hex.lowerTrigram.binaryRepresentation} (${hex.lowerTrigram.decimalBinaryValue}) ${hex.lowerTrigram.name}`;
  targetDiv.appendChild(pTris);

  // ─── graphical line diagram + per-line commentary ───────────────────────
  const diagram = document.createElement('div');
  diagram.className = 'lines-diagram';

  const svgNS = 'http://www.w3.org/2000/svg';

  for (let i = 5; i >= 0; i--) {          // i = 5 (top)…0 (bottom)
    const bit       = hex.lines[i];                 // 0 = yin, 1 = yang
    const moving    = draws ? hex.movingLines[i] : false;
    const targetBit = moving ? 1 - bit : bit;

    const nowStr  = bit       === 1 ? 'Strong' : 'Weak';
    const thenStr = targetBit === 1 ? 'Strong' : 'Weak';
    const arrow   = moving ? ` → ${thenStr}` : '';

    /* row wrapper */
    const row = document.createElement('div');
    row.className = 'line-row';
    if (moving) row.classList.add('moving');

    /* SVG line (full or broken) */
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'line-svg');
    svg.setAttribute('viewBox', '0 0 120 12');
    svg.setAttribute('preserveAspectRatio','none');

    if (bit === 1) {                         // yang ———
      const rect = document.createElementNS(svgNS, 'rect');
      rect.setAttribute('x', 0);
      rect.setAttribute('y', 0);
      rect.setAttribute('width', 120);
      rect.setAttribute('height', 12);
      svg.appendChild(rect);
    } else {                                 // yin — —
      const left  = document.createElementNS(svgNS, 'rect');
      left.setAttribute('x', 0);
      left.setAttribute('y', 0);
      left.setAttribute('width', 50);
      left.setAttribute('height', 12);

      const right = document.createElementNS(svgNS, 'rect');
      right.setAttribute('x', 70);           // 20 px centre gap
      right.setAttribute('y', 0);
      right.setAttribute('width', 50);
      right.setAttribute('height', 12);

      svg.appendChild(left);
      svg.appendChild(right);
    }

    /* text info */
    const roleLbl = roleLabelForLine(i);   // '' if roles=off
    let label = `Line ${i + 1}`;
    if (roleLbl) label += ` – ${roleLbl}`;
    const txt = document.createElement('span');
    txt.className = 'line-info';
    txt.textContent = `${label} – ${nowStr}${arrow}`;

    /* put SVG + text into row, add to diagram */
    row.appendChild(svg);
    row.appendChild(txt);
    diagram.appendChild(row);
  }

  targetDiv.appendChild(diagram);

  /* ----- Theme group line (beneath diagram; styled like basic stats) ----- */
  const pTheme = document.createElement('p');
  pTheme.innerHTML = `<strong>Theme group:</strong> ${getThemeGroup(hex)}`;
  targetDiv.appendChild(pTheme);
  pTheme.className = 'theme-group';

  // ─── Line information section ───────────────────────────────────────────
  const infoDiv = document.createElement('div');
  infoDiv.style.margin = '1rem 0';

  const hInfo = document.createElement('h3');
  hInfo.textContent = 'Line information';
  infoDiv.appendChild(hInfo);

  /* ----- Correctness ----- */
  const pCorr = document.createElement('p');
  pCorr.innerHTML =
    '<strong>Correct lines:</strong> '   +
    (hex.correctLines().join(', ')   || 'None') +
    '<br><strong>Incorrect lines:</strong> ' +
    (hex.incorrectLines().join(', ') || 'None');
  infoDiv.appendChild(pCorr);

  /* ----- Holding together ----- */
  const pHold = document.createElement('p');
  pHold.innerHTML = '<strong>Holding together:</strong><br>' +
    hex.holdingPairs().map(p =>
      `Line ${p.a} ${p.holds ? 'holds together with' : 'does not hold together with'} line ${p.b}`
    ).join('<br>');
  infoDiv.appendChild(pHold);

  /* ----- Correspondence ----- */
  const pCorrsp = document.createElement('p');
  pCorrsp.innerHTML = '<strong>Correspondence:</strong><br>' +
    hex.correspondencePairs().map(p =>
      `Line ${p.a} ${p.corresponds ? 'corresponds with' : 'does not correspond with'} line ${p.b}`
    ).join('<br>');
  infoDiv.appendChild(pCorrsp);

  /* ----- Emblems (plain text) ----- */
  const pEmblems = document.createElement('p');
  pEmblems.innerHTML = '<strong>Emblems (adjacent-line digrams):</strong><br>' +
    hex.emblems().map(em => {
      const from = `${em.from.binary} ${em.from.glyph} ${em.from.name}`;
      // Only show the arrow/“to” when there are draws AND the emblem actually changes
      if (draws && em.changed) {
        const to = `${em.to.binary} ${em.to.glyph} ${em.to.name}`;
        return `Lines ${em.pair[0]} and ${em.pair[1]}: ${from} → ${to}`;
      }
      return `Lines ${em.pair[0]} and ${em.pair[1]}: ${from}`;
    }).join('<br>');
  infoDiv.appendChild(pEmblems);
  
  targetDiv.appendChild(infoDiv);

  // ─── Trigrams (windows over lines 1–6) ─────────────────────────────────────
  // Shows trigrams for lines 1–3 (Lower), 2–4 (Lower Nuclear),
  // 3–5 (Upper Nuclear), and 4–6 (Upper), for Current and (if present) Target.
  (function addTrigramsTable() {
    const triHeading = document.createElement('h3');
    triHeading.textContent = 'Trigrams';
    triHeading.style.marginTop = '1.2rem';
    targetDiv.appendChild(triHeading);

    const triTable = document.createElement('table');
    triTable.style.borderCollapse = 'collapse';
    triTable.style.marginTop = '0.5rem';

    // If draws are present, we have a target hexagram; otherwise only "Current".
    const tgtHex = draws ? hex.target() : null;

    const head = document.createElement('tr');
    ['Lines', 'Part', 'Current'].concat(tgtHex ? ['Target'] : []).forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      th.style.padding = '4px 8px';
      th.style.borderBottom = '1px solid #999';
      th.style.textAlign = 'left';
      head.appendChild(th);
    });
    triTable.appendChild(head);

    const bitsNow  = hex.lines;                // [l1..l6] bottom→top
    const bitsThen = tgtHex ? tgtHex.lines : null;

    // helper: build a Trigram from three 1-based line positions
    const triFrom = (bitList, a, b, c) => {
      const bin = '' + bitList[a - 1] + bitList[b - 1] + bitList[c - 1];
      return new Trigram(parseInt(bin, 2) + 1);
    };

    // helper: format like existing trigram readout
    const triLabel = (t) =>
      `Trigram ${t.sequence} ${t.glyph} ${t.binaryRepresentation} (${t.decimalBinaryValue}) ${t.name}`;

    const WINDOWS = [
      { lines: [1, 2, 3], part: 'Lower' },
      { lines: [2, 3, 4], part: 'Lower Nuclear' },
      { lines: [3, 4, 5], part: 'Upper Nuclear' },
      { lines: [4, 5, 6], part: 'Upper' }
    ];

    WINDOWS.forEach(w => {
      const tr = document.createElement('tr');

      const tdLines = document.createElement('td');
      tdLines.textContent = w.lines.join(',');
      tdLines.style.padding = '3px 8px';
      tr.appendChild(tdLines);

      const tdPart = document.createElement('td');
      tdPart.textContent = w.part;
      tdPart.style.padding = '3px 8px';
      tr.appendChild(tdPart);

      const triCur = triFrom(bitsNow,  w.lines[0], w.lines[1], w.lines[2]);
      const tdCur  = document.createElement('td');
      tdCur.textContent = triLabel(triCur);
      tdCur.style.padding = '3px 8px';
      tr.appendChild(tdCur);

      if (bitsThen) {
        const triTgt = triFrom(bitsThen, w.lines[0], w.lines[1], w.lines[2]);
        const tdTgt  = document.createElement('td');
        tdTgt.textContent = triLabel(triTgt);
        tdTgt.style.padding = '3px 8px';
        tr.appendChild(tdTgt);
      }

      triTable.appendChild(tr);
    });
    triTable.classList.add('trigrams-table');
    targetDiv.appendChild(triTable);
  })();

  // ─── derived hexagrams table ────────────────────────────────────────────────
  const targetHex  = draws ? hex.target() : null;

  const nuclear     = hex.nuclear();
  const secondN     = hex.secondNuclear();
  const thirdN      = hex.thirdNuclear();
  const fourthN     = hex.fourthNuclear();
  const fifthN      = hex.fifthNuclear();

  const derivedArr = [];

  if (targetHex) derivedArr.push(['Target', targetHex, true]);        // true → mark red
  derivedArr.push(
    ['Opposite',                 hex.opposite()],
    ['Inverse',                  hex.inverse()],
    ['Nuclear',                  nuclear],
    ['Second Nuclear',           secondN],
    ['Third Nuclear',            thirdN],
    ['Fourth Nuclear',           fourthN],
    ['Fifth Nuclear',            fifthN],
    ['Double Nuclear',           nuclear.nuclear()],
    ['Double Second Nuclear',    secondN.secondNuclear()],
    ['Double Third Nuclear',     thirdN.thirdNuclear()],
    ['Double Fourth Nuclear',    fourthN.fourthNuclear()],
    ['Double Fifth Nuclear',     fifthN.fifthNuclear()],
    ['Triple Fourth Nuclear',    fourthN.fourthNuclear().fourthNuclear()],
    ['Triple Fifth Nuclear',     fifthN.fifthNuclear().fifthNuclear()]
  );

  const tableHeading = document.createElement('h3');
  tableHeading.textContent = 'Derived Hexagrams';
  tableHeading.style.marginTop = '1.5rem';
  tableHeading.style.marginBottom = '0.5rem';
  targetDiv.appendChild(tableHeading);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '1rem';

  const headerRow = document.createElement('tr');
  ['Relation', 'No.', 'Name', 'Glyph'].forEach(text => {
    const th = document.createElement('th');
    th.textContent  = text;
    th.style.padding = '4px 8px';
    th.style.borderBottom = '1px solid #999';
    th.style.textAlign = 'left';
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  derivedArr.forEach(([label, h, isTarget]) => {
    const tr = document.createElement('tr');
    if (isTarget) {
      tr.style.color = '#c00';
      tr.style.fontWeight = '700';
    }
    [label, h.textualNumber, h.name, h.glyph].forEach((val, col) => {
      const td = document.createElement('td');
      td.textContent = val;
      td.style.padding = '3px 8px';
      if (col === 3) td.style.fontSize = '1.3rem';
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });

  targetDiv.appendChild(table);

  // ─── rotation-cycle table ──────────────────────────────────────────────────
  const cycleArr = hex.cycle();     // [this, …]

  const cycHeading = document.createElement('h3');
  cycHeading.textContent = 'Cycle'; // Rotation Cycle
  cycHeading.style.marginTop = '1.8rem';
  targetDiv.appendChild(cycHeading);

  const cycTable = document.createElement('table');
  cycTable.style.borderCollapse = 'collapse';
  cycTable.style.marginTop = '0.4rem';

  const headRow = document.createElement('tr');
  ['Step', 'No.', 'Name', 'Glyph'].forEach(label => {
    const th = document.createElement('th');
    th.textContent = label;
    th.style.padding = '4px 8px';
    th.style.borderBottom = '1px solid #999';
    th.style.textAlign = 'left';
    headRow.appendChild(th);
  });
  cycTable.appendChild(headRow);

  cycleArr.forEach((h, idx) => {
    const tr = document.createElement('tr');
    [idx + 1, h.textualNumber, h.name, h.glyph].forEach((val, col) => {
      const td = document.createElement('td');
      td.textContent = val;
      td.style.padding = '3px 8px';
      if (col === 3) td.style.fontSize = '1.3rem';
      tr.appendChild(td);
    });
    cycTable.appendChild(tr);
  });

  targetDiv.appendChild(cycTable);

  // ─── flower (antecedents & consequents) ──────────────────────────
  const { antecedents, consequents } = hex.flower();

  function changedLine(orig, variant) {
    const a = orig.lines, b = variant.lines;
    for (let i = 0; i < 6; i++) if (a[i] !== b[i]) return i + 1;
  }

  const petals = [
    ...antecedents.map(h => ({ kind: 'Antecedent', hex: h, line: changedLine(hex, h) })),
    ...consequents.map(h => ({ kind: 'Consequent', hex: h, line: changedLine(hex, h) }))
  ].sort((p, q) => q.line - p.line); // 6 → 1

  const flowerHeader = document.createElement('h3');
  flowerHeader.textContent = 'Flower';
  flowerHeader.style.marginTop = '1.4rem';
  targetDiv.appendChild(flowerHeader);

  const flTable = document.createElement('table');
  flTable.style.borderCollapse = 'collapse';
  flTable.style.marginTop = '0.5rem';

  const flHead = document.createElement('tr');
  ['Type', 'No.', 'Name', 'Glyph'].forEach(text => {
    const th = document.createElement('th');
    th.textContent  = text;
    th.style.padding = '4px 8px';
    th.style.borderBottom = '1px solid #999';
    th.style.textAlign = 'left';
    flHead.appendChild(th);
  });
  flTable.appendChild(flHead);

  petals.forEach(({ kind, hex }) => {
    const tr = document.createElement('tr');
    [kind, hex.textualNumber, hex.name, hex.glyph].forEach((val, col) => {
      const td = document.createElement('td');
      td.textContent = val;
      td.style.padding = '3px 8px';
      if (col === 3) td.style.fontSize = '1.3rem';
      tr.appendChild(td);
    });
    flTable.appendChild(tr);
  });

  targetDiv.appendChild(flTable);

  // ─── story (narrative sequence) ────────────────────────────────────────────
  const storyArr = hex.story();

  const storyHeader = document.createElement('h3');
  storyHeader.textContent = 'Story';
  storyHeader.style.marginTop = '1.4rem';
  targetDiv.appendChild(storyHeader);

  const stTable = document.createElement('table');
  stTable.style.borderCollapse = 'collapse';
  stTable.style.marginTop = '0.5rem';

  const stHead = document.createElement('tr');
  ['Step', 'No.', 'Name', 'Glyph'].forEach(text => {
    const th = document.createElement('th');
    th.textContent  = text;
    th.style.padding = '4px 8px';
    th.style.borderBottom = '1px solid #999';
    th.style.textAlign = 'left';
    stHead.appendChild(th);
  });
  stTable.appendChild(stHead);

  storyArr.forEach((h, idx) => {
    const tr = document.createElement('tr');
    [idx, h.textualNumber, h.name, h.glyph].forEach((val, col) => {
      const td = document.createElement('td');
      td.textContent = val;
      td.style.padding = '3px 8px';
      if (col === 3) td.style.fontSize = '1.3rem';
      tr.appendChild(td);
    });
    stTable.appendChild(tr);
  });

  targetDiv.appendChild(stTable);
}
