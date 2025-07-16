/* ========== App Logic & UI ========= */
// generate six number inputs dynamically so they can be styled uniformly
(function addDrawInputs() {
  const container = document.getElementById('drawInputs');
  for (let i = 0; i < 6; i++) {
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.min = '1';
    inp.max = '8';
    inp.placeholder = '–';
    inp.style.marginRight = '0.35rem';
    inp.style.marginBottom = '0.35rem';
    container.appendChild(inp);
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
    alert('Please leave all draw boxes empty or fill in EXACTLY six integers (1 – 8).');
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

function renderResults(hex, draws) {
  const targetDiv = document.getElementById('results');
  targetDiv.innerHTML = '';

  const heading = document.createElement('h2');
  heading.innerHTML = `Hexagram ${hex.textualNumber}: ${hex.name} <span class="glyph">${hex.glyph}</span>`;
  targetDiv.appendChild(heading);

  // basic stats
  const binary = hex.binaryRepresentation;
  const dashedBinary = `${binary.slice(0, 3)}-${binary.slice(3)}`;

  const pMeta = document.createElement('p');
  pMeta.innerHTML =
    `<strong>Binary:</strong> ${dashedBinary} &nbsp; • &nbsp; ` +
    `<strong>Decimal:</strong> ${hex.decimalBinaryValue}`;

  targetDiv.appendChild(pMeta);

  /* ---------- upper / lower trigram read-out ---------- */
  const pTris = document.createElement('p');
  pTris.innerHTML =
    `<strong>Upper trigram:</strong> Trigram ${hex.upperTrigram.sequence} ${hex.upperTrigram.glyph} ` +
    `${hex.upperTrigram.binaryRepresentation} (${hex.upperTrigram.decimalBinaryValue}) ${hex.upperTrigram.name}<br>` +
    `<strong>Lower trigram:</strong> Trigram ${hex.lowerTrigram.sequence} ${hex.lowerTrigram.glyph} ` +
    `${hex.lowerTrigram.binaryRepresentation} (${hex.lowerTrigram.decimalBinaryValue}) ${hex.lowerTrigram.name}`;

  targetDiv.appendChild(pTris);

  // ─── line diagram + per-line commentary ──────────────────────────────────
  const roles   = [
    'Common-man',          // line 1  (bottom)
    'The Great Official',  // line 2
    'Transitional',        // line 3
    'Minister/Advisor',    // line 4
    'The Ruler',           // line 5
    'The Sage'             // line 6  (top)
  ];

  // ─── graphical line diagram + commentary ─────────────────────────────────
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
    const txt = document.createElement('span');
    txt.className = 'line-info';
    txt.textContent = `Line ${i + 1} – ${roles[i]} – ${nowStr}${arrow}`;

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
  hInfo.textContent = 'Line information:';
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

  targetDiv.appendChild(infoDiv);

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

  //heading
  const tableHeading = document.createElement('h3');
  tableHeading.textContent = 'Derived Hexagrams';
  tableHeading.style.marginTop = '1.5rem';
  tableHeading.style.marginBottom = '0.5rem';
  targetDiv.appendChild(tableHeading);

  // build the table
  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginTop = '1rem';

  // header
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

  // rows
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

  // header
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

  // rows
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

  /* 1.  helper → which single line differs?  1 = bottom … 6 = top */
  function changedLine(orig, variant) {
    const a = orig.lines,
          b = variant.lines;
    for (let i = 0; i < 6; i++) if (a[i] !== b[i]) return i + 1;
  }

  /* 2.  tag every petal with its line # and kind,
          then sort so line 6 comes first, line 1 last  */
  const petals = [
    ...antecedents.map(h => ({
        kind: 'Antecedent',
        hex:  h,
        line: changedLine(hex, h)          // 1…6
    })),
    ...consequents.map(h => ({
        kind: 'Consequent',
        hex:  h,
        line: changedLine(hex, h)
    }))
  ].sort((p, q) => q.line - p.line);       // descending ⇒ 6 → 1

  /* 3.  build the table */
  const flowerHeader = document.createElement('h3');
  flowerHeader.textContent = 'Flower';
  flowerHeader.style.marginTop = '1.4rem';
  targetDiv.appendChild(flowerHeader);

  const flTable = document.createElement('table');
  flTable.style.borderCollapse = 'collapse';
  flTable.style.marginTop = '0.5rem';

  /* header row (unchanged) */
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

  /* rows in the new top-to-bottom order */
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
  /* ─── end flower block ─────────────────────────────────────────── */


    
  // ─── story (narrative sequence) ────────────────────────────────────────────
  const storyArr = hex.story();

  // header
  const storyHeader = document.createElement('h3');
  storyHeader.textContent = 'Story';
  storyHeader.style.marginTop = '1.4rem';
  targetDiv.appendChild(storyHeader);

  // build table
  const stTable = document.createElement('table');
  stTable.style.borderCollapse = 'collapse';
  stTable.style.marginTop = '0.5rem';

  // header row
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

  // rows
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