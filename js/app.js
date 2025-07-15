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
  const pMeta = document.createElement('p');
  pMeta.innerHTML = `<strong>Binary:</strong> ${hex.binaryRepresentation} &nbsp; • &nbsp; <strong>Decimal:</strong> ${hex.decimalBinaryValue}`;
  targetDiv.appendChild(pMeta);

  const pTris = document.createElement('p');
  pTris.innerHTML = `<strong>Lower:</strong> ${hex.lowerTrigram.name} ${hex.lowerTrigram.glyph} (${hex.lowerTrigram.binaryRepresentation}) &nbsp; • &nbsp; <strong>Upper:</strong> ${hex.upperTrigram.name} ${hex.upperTrigram.glyph} (${hex.upperTrigram.binaryRepresentation})`;
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
  cycHeading.textContent = 'Rotation Cycle';
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
    if (idx === 0) {           // the starting hexagram
      tr.style.fontWeight = '700';
    }
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
  
  // ─── flower (antecedents & consequents) ─────────────────────────────────────
  const { antecedents, consequents } = hex.flower();

  // header
  const flowerHeader = document.createElement('h3');
  flowerHeader.textContent = 'Flower';
  flowerHeader.style.marginTop = '1.4rem';
  targetDiv.appendChild(flowerHeader);

  // build flower table
  const flTable = document.createElement('table');
  flTable.style.borderCollapse = 'collapse';
  flTable.style.marginTop = '0.5rem';

  // header row
  const flHead = document.createElement('tr');
  ['Type', 'No.', 'Name', 'Glyph'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.padding = '4px 8px';
    th.style.borderBottom = '1px solid #999';
    th.style.textAlign = 'left';
    flHead.appendChild(th);
  });
  flTable.appendChild(flHead);

  // helper to add rows
  function addPetalRows(list, kind) {
    list.forEach(h => {
      const tr = document.createElement('tr');
      [kind, h.textualNumber, h.name, h.glyph].forEach((val, col) => {
        const td = document.createElement('td');
        td.textContent = val;
        td.style.padding = '3px 8px';
        if (col === 3) td.style.fontSize = '1.3rem';
        tr.appendChild(td);
      });
      flTable.appendChild(tr);
    });
  }

  addPetalRows(antecedents, 'Antecedent');
  addPetalRows(consequents, 'Consequent');

  targetDiv.appendChild(flTable);
    
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