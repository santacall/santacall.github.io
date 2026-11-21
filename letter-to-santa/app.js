/* Letter to Santa. Everything runs in this page: no network calls, no storage, no cookies.
   The name, the wishes and the typed good deed live in variables and input fields, and nowhere else.
   A copied link carries the picture choices only (#l=6-0-2-4): never the name or typed words. */
(() => {
  'use strict';

  const T = JSON.parse(document.getElementById('strings').textContent);
  const J = T.js;
  const L = J.letter;
  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sheet = $('sheet');
  const steps = Array.from(document.querySelectorAll('.step'));
  const N = steps.length;
  const dots = Array.from($('progress').children);
  const nameInput = $('name');
  const deedInput = $('deed-text');
  const wishInputs = Array.from(document.querySelectorAll('.wish'));
  const nextBtn = $('next');
  const appBlock = $('app');
  const appDefaults = { heading: $('app-h').textContent, button: $('app-button-text').textContent };
  const ages = Array.from(document.querySelectorAll('[data-group="age"] .tile')).map((b) => b.dataset.v);

  const blank = () => ({ name: '', age: null, mood: null, wishes: ['', '', ''], deed: null, deedText: '', ps: null });
  let state = blank();
  let current = 0;
  let locked = false;
  let letterUrl = null;
  let letterBlob = null;
  let blankUrl = null;

  const fill = (s, map) => s.replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
  const clean = (v, max) => v.replace(/\s+/g, ' ').trim().slice(0, max);
  const setStage = (s) => { body.dataset.stage = s; };
  const toSheet = () => {
    const top = sheet.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.3) sheet.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- steps ---------- */
  function press(group, value) {
    document.querySelectorAll(`[data-group="${group}"] .tile`).forEach((b) => {
      b.setAttribute('aria-pressed', value !== null && b.dataset.v === String(value) ? 'true' : 'false');
    });
  }

  function syncIdeas() {
    const have = wishInputs.map((i) => clean(i.value, 40).toLowerCase());
    document.querySelectorAll('[data-group="ideas"] .tile').forEach((b) => {
      b.setAttribute('aria-pressed', have.includes(T.ideas[Number(b.dataset.v)].toLowerCase()) ? 'true' : 'false');
    });
  }

  function pickIdea(i) {
    const text = T.ideas[i];
    const at = wishInputs.findIndex((inp) => clean(inp.value, 40).toLowerCase() === text.toLowerCase());
    if (at >= 0) wishInputs[at].value = '';
    else (wishInputs.find((inp) => !clean(inp.value, 40)) || wishInputs[wishInputs.length - 1]).value = text;
    syncIdeas();
  }

  function readInputs() {
    state.name = clean(nameInput.value, 20);
    state.wishes = wishInputs.map((i) => clean(i.value, 40));
    state.deedText = clean(deedInput.value, 60);
    if (state.deedText) state.deed = null;
  }

  function writeInputs() {
    nameInput.value = state.name;
    wishInputs.forEach((inp, i) => { inp.value = state.wishes[i] || ''; });
    deedInput.value = state.deedText;
    press('age', state.age);
    press('mood', state.mood);
    press('deed', state.deed);
    press('ps', state.ps);
    syncIdeas();
  }

  function show(i, back) {
    current = i;
    steps.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('from-left', k === i && !!back);
    });
    dots.forEach((d, k) => {
      d.classList.toggle('is-done', k < i);
      d.classList.toggle('is-now', k === i);
    });
    nextBtn.textContent = i === N - 1 ? T.finish : T.next;
    steps[i].querySelector('.q-text').focus({ preventScroll: true });
    toSheet();
    locked = false;
  }

  function goNext() {
    if (locked) return;
    readInputs();
    if (current < N - 1) show(current + 1);
    else finish();
  }

  function goBack() {
    if (locked) return;
    readInputs();
    if (current === 0) { setStage('start'); $('start-btn').focus({ preventScroll: true }); return; }
    show(current - 1, true);
  }

  function onTile(btn) {
    if (locked) return;
    const list = btn.closest('.tiles');
    const group = list.dataset.group;
    const v = btn.dataset.v;
    if (group === 'ideas') { pickIdea(Number(v)); return; }
    if (group === 'age') state.age = state.age === v ? null : v;
    else if (group === 'deed') {
      state.deed = state.deed === Number(v) ? null : Number(v);
      if (state.deed !== null) { deedInput.value = ''; state.deedText = ''; }
    } else state[group] = Number(v);
    press(group, state[group]);
    if (list.dataset.auto) {
      locked = true;
      window.setTimeout(() => { locked = false; goNext(); }, reduce ? 0 : 300);
    }
  }

  const code = () => [state.age, state.mood, state.deed, state.ps].map((v) => (v === null ? 'x' : v)).join('-');

  function finish() {
    try { history.replaceState(null, '', '#l=' + code()); } catch (e) { /* file:// in some browsers */ }
    showResult();
  }

  /* ---------- result ---------- */
  function renderTexts() {
    const map = { name: state.name };
    $('result-title').textContent = state.name ? fill(J.title, map) : J.titleAnon;
    $('letter-img').alt = state.name ? fill(J.letterAlt, map) : J.letterAltAnon;
    $('app-h').textContent = state.name ? fill(J.appHeading, map) : J.appHeadingAnon;
    $('app-button-text').textContent = state.name ? fill(J.appButton, map) : appDefaults.button;
  }

  function showResult() {
    $('result').hidden = false;
    $('final').hidden = false;
    $('stamp').classList.remove('is-on');
    renderTexts();
    setStage('result');
    $('app-slot-top').appendChild(appBlock);
    window.scrollTo(0, 0);
    $('result-title').focus({ preventScroll: true });
    renderLetter().then(() => {
      window.setTimeout(() => $('stamp').classList.add('is-on'), reduce ? 0 : 380);
    });
  }

  function leaveResult() {
    $('app-slot-bottom').appendChild(appBlock);
    $('app-h').textContent = appDefaults.heading;
    $('app-button-text').textContent = appDefaults.button;
    $('result').hidden = true;
    $('final').hidden = true;
    body.classList.remove('has-print');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }

  function edit() {
    leaveResult();
    writeInputs();
    setStage('steps');
    show(0, true);
  }

  function restart() {
    leaveResult();
    state = blank();
    writeInputs();
    setStage('start');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    $('start-btn').focus({ preventScroll: true });
  }

  /* ---------- the letter (canvas -> PNG, drawn locally) ---------- */
  const W = 1500;
  const H = 2100;
  const X0 = 152;
  const X1 = W - 152;
  const Y0 = 668;
  const Y1 = H - 150;
  const INK = { paper: '#fbf3e1', paperHi: '#fffaf0', edge: 'rgba(205,176,116,0.30)', green: '#1d4a3f', greenHi: '#2c7a5b', gold: '#c99a2e', goldHi: '#f2c86b', red: '#a51d2a', navy: '#1b2444', night: '#16224a', soft: '#55597a', rule: 'rgba(27,36,68,0.34)', mark: 'rgba(27,36,68,0.7)' };
  // style.css can swap a family for one language (--canvas-* under :lang(uk): the bundled fonts lack its letters)
  const css = window.getComputedStyle(document.documentElement);
  const fam = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  const F = {
    d: fam('--canvas-display', '"Fraunces", Georgia, serif'),
    b: fam('--canvas-body', '"Figtree", Helvetica, Arial, sans-serif'),
    h: fam('--canvas-hand', '"Caveat", "Bradley Hand", cursive'),
  };

  function star(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.46 : r;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx[i ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a));
    }
    ctx.closePath();
  }

  function spaced(ctx, text, x, y, gap) {
    let cx = x;
    Array.from(text).forEach((c) => { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + gap; });
    return cx - gap - x;
  }
  const spacedWidth = (ctx, text, gap) => Array.from(text).reduce((a, c) => a + ctx.measureText(c).width + gap, -gap);

  // text along a circle: top = read clockwise over the top, otherwise left to right under the bottom
  function arcText(ctx, text, cx, cy, r, top, gap) {
    const chars = Array.from(text);
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    const dir = top ? 1 : -1;
    let ang = (top ? -Math.PI / 2 : Math.PI / 2) - (dir * total) / r / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    chars.forEach((c, i) => {
      const a = ang + (dir * widths[i]) / 2 / r;
      ctx.save();
      ctx.translate(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.rotate(a + (dir * Math.PI) / 2);
      ctx.fillText(c, 0, 0);
      ctx.restore();
      ang += (dir * (widths[i] + gap)) / r;
    });
    ctx.restore();
  }

  function wrap(ctx, text, maxW) {
    const out = [];
    let line = '';
    const push = (word) => {
      // a single word wider than the line: break it by characters
      let w = word;
      while (ctx.measureText(w).width > maxW && w.length > 1) {
        let n = w.length - 1;
        while (n > 1 && ctx.measureText(w.slice(0, n)).width > maxW) n--;
        out.push(w.slice(0, n));
        w = w.slice(n);
      }
      return w;
    };
    text.split(' ').forEach((word) => {
      const tryLine = line ? line + ' ' + word : word;
      if (ctx.measureText(tryLine).width <= maxW) { line = tryLine; return; }
      if (line) out.push(line);
      line = push(word);
    });
    if (line) out.push(line);
    return out;
  }

  // Turns blocks into draw operations at hand size s and returns the height they take.
  function layout(ctx, blocks, s, o) {
    const maxW = X1 - X0;
    const lh = s * (o.blank ? 1.62 : 1.2);
    const gap = s * (o.blank ? 0.2 : 0.5);
    const hand = (size, weight) => `${weight || 600} ${size}px ${F.h}`;
    const ops = [];
    let y = 0;
    blocks.forEach((b) => {
      if (b.t === 'p') {
        ctx.font = hand(s);
        wrap(ctx, b.text, maxW).forEach((line) => { ops.push({ k: 'text', text: line, x: 0, y: y + s * 0.82, font: hand(s) }); y += b.blankLine ? lh : s * 1.2; });
        y += b.tight ? gap * 0.25 : gap;
      } else if (b.t === 'list') {
        const indent = s * 0.95;
        b.items.forEach((item) => {
          ctx.font = hand(s);
          const lines = item === null ? [null] : wrap(ctx, item, maxW - indent);
          lines.forEach((line, i) => {
            if (i === 0) ops.push({ k: 'star', x: s * 0.36, y: y + s * 0.56, r: s * 0.3 });
            if (line === null) ops.push({ k: 'rule', x: indent, y: y + s * 0.9, w: maxW - indent });
            else ops.push({ k: 'text', text: line, x: indent, y: y + s * 0.82, font: hand(s) });
            y += item === null ? lh : s * 1.2;
          });
        });
        y += gap;
      } else if (b.t === 'row') {
        // blank template row: text pieces and write-in lines ("_9" = about nine letters wide, "_*" = to the margin)
        ctx.font = hand(s);
        let x = 0;
        b.parts.forEach((part) => {
          if (part[0] === '_') {
            let w = part === '_*' ? maxW - x : Number(part.slice(1)) * s * 0.52;
            if (part === '_*' && w < s * 3) { x = 0; y += lh; w = maxW; }
            if (x + w > maxW) { x = 0; y += lh; }
            ops.push({ k: 'rule', x, y: y + s * 0.9, w: Math.min(w, maxW - x) });
            x += w + s * 0.3;
          } else {
            const w = ctx.measureText(part).width;
            if (x > 0 && x + w > maxW) { x = 0; y += lh; }
            ops.push({ k: 'text', text: part, x, y: y + s * 0.82, font: hand(s) });
            x += w + s * 0.3;
          }
        });
        y += lh + gap;
      } else if (b.t === 'sign') {
        const sx = maxW * 0.5;
        y += s * 0.1;
        ops.push({ k: 'text', text: L.signoff, x: sx, y: y + s * 0.82, font: hand(s) });
        y += s * 1.15;
        const big = s * 1.5;
        if (o.name) {
          let px = big;
          ctx.font = hand(px, 700);
          while (ctx.measureText(o.name).width > maxW - sx - 10 && px > 30) { px -= 2; ctx.font = hand(px, 700); }
          ops.push({ k: 'name', text: o.name, x: sx, y: y + big * 0.8, font: hand(px, 700) });
        } else {
          ops.push({ k: 'rule', x: sx, y: y + big * 0.82, w: Math.min(420, maxW - sx) });
          if (!o.blank) ops.push({ k: 'hint', text: L.signHere, x: sx + 4, y: y + big * 0.82 + 34 });
        }
        y += big * 1.12 + gap * 0.6;
      }
    });
    return { ops, height: y };
  }

  function drawPaper(ctx) {
    ctx.fillStyle = INK.paper;
    ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, H / 2, 500, W / 2, H / 2, 1500);
    g.addColorStop(0, 'rgba(255,250,236,0)');
    g.addColorStop(1, INK.edge);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // candy-stripe air mail border
    const a = 34;
    const t = 30;
    ctx.save();
    ctx.beginPath();
    ctx.rect(a, a, W - a * 2, H - a * 2);
    ctx.rect(a + t, a + t, W - (a + t) * 2, H - (a + t) * 2);
    ctx.clip('evenodd');
    ctx.fillStyle = INK.paperHi;
    ctx.fillRect(0, 0, W, H);
    for (let x = -H, i = 0; x < W; x += 54, i++) {
      ctx.fillStyle = i % 2 ? INK.greenHi : INK.red;
      ctx.beginPath();
      ctx.moveTo(x, 0); ctx.lineTo(x + 27, 0); ctx.lineTo(x + 27 + H, H); ctx.lineTo(x + H, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    ctx.strokeStyle = 'rgba(27,36,68,0.22)';
    ctx.lineWidth = 2;
    ctx.strokeRect(a, a, W - a * 2, H - a * 2);
    ctx.strokeRect(a + t, a + t, W - (a + t) * 2, H - (a + t) * 2);
  }

  const STAMP = { w: 236, h: 296, p: 20 };
  function stampFrame(ctx) {
    ctx.translate(X1 - STAMP.w / 2 - 6, 286);
    ctx.rotate(0.045);
    ctx.translate(-STAMP.w / 2, -STAMP.h / 2);
  }

  function drawStamp(ctx) {
    const { w, h, p } = STAMP;
    ctx.save();
    stampFrame(ctx);
    // perforated sheet
    ctx.shadowColor = 'rgba(27,36,68,0.28)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    ctx.fillStyle = INK.paperHi;
    ctx.fillRect(0, 0, w, h);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = INK.paper;
    for (let x = 14; x < w; x += 26) { ctx.beginPath(); ctx.arc(x, 0, 8, 0, Math.PI * 2); ctx.arc(x, h, 8, 0, Math.PI * 2); ctx.fill(); }
    for (let y = 18; y < h; y += 26) { ctx.beginPath(); ctx.arc(0, y, 8, 0, Math.PI * 2); ctx.arc(w, y, 8, 0, Math.PI * 2); ctx.fill(); }
    // picture
    ctx.fillStyle = INK.night;
    ctx.fillRect(p, p, w - p * 2, h - p * 2);
    ctx.save();
    ctx.beginPath(); ctx.rect(p, p, w - p * 2, h - p * 2); ctx.clip();
    ctx.fillStyle = '#dde5f4';
    ctx.beginPath(); ctx.ellipse(w * 0.3, h - p + 22, 150, 70, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f4f6fb';
    ctx.beginPath(); ctx.ellipse(w * 0.78, h - p + 30, 130, 66, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // pine with a star
    const tx = w * 0.34;
    ctx.fillStyle = '#3b2a24'; ctx.fillRect(tx - 6, 206, 12, 24);
    ctx.fillStyle = INK.greenHi;
    [[94, 30, 132], [122, 40, 172], [156, 50, 212]].forEach(([top, half, bottom]) => {
      ctx.beginPath(); ctx.moveTo(tx, top); ctx.lineTo(tx + half, bottom); ctx.lineTo(tx - half, bottom); ctx.closePath(); ctx.fill();
    });
    ctx.fillStyle = INK.goldHi; star(ctx, tx, 88, 15); ctx.fill();
    ctx.fillStyle = '#eef0f7';
    [[150, 96, 3], [182, 128, 2.4], [56, 70, 2.4], [196, 78, 2], [44, 130, 2], [168, 170, 2.2]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
    // lettering
    ctx.fillStyle = '#fff7e6';
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    let px = 19;
    ctx.font = `700 ${px}px ${F.b}`;
    while (spacedWidth(ctx, L.stampTop, 3) > w - p * 2 - 24 && px > 10) { px -= 1; ctx.font = `700 ${px}px ${F.b}`; }
    spaced(ctx, L.stampTop, (w - spacedWidth(ctx, L.stampTop, 3)) / 2, p + 30, 3);
    ctx.fillStyle = INK.goldHi;
    ctx.textAlign = 'right';
    ctx.font = `700 58px ${F.d}`;
    ctx.fillText(L.stampValue, w - p - 14, 176);
    ctx.font = `700 17px ${F.b}`;
    ctx.fillText(L.stampMonth, w - p - 16, 198);
    ctx.textAlign = 'left';
    ctx.fillStyle = INK.night;
    px = 14;
    ctx.font = `700 ${px}px ${F.b}`;
    while (spacedWidth(ctx, L.stampBottom, 2.5) > w - p * 2 - 20 && px > 8) { px -= 1; ctx.font = `700 ${px}px ${F.b}`; }
    spaced(ctx, L.stampBottom, (w - spacedWidth(ctx, L.stampBottom, 2.5)) / 2, h - p - 12, 2.5);
    ctx.restore();
  }

  function drawPostmark(ctx, o, ink) {
    const cx = X1 - 300;
    const cy = 398;
    const r = 108;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.16);
    ctx.strokeStyle = ink; ctx.fillStyle = ink;
    ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, r - 36, 0, Math.PI * 2); ctx.stroke();
    let px = 19;
    const fits = (text) => { ctx.font = `700 ${px}px ${F.b}`; return spacedWidth(ctx, text, 2.5) < (r - 18) * Math.PI * 0.86; };
    while (!(fits(L.postmarkTop) && fits(L.postmarkBottom)) && px > 9) px -= 1;
    arcText(ctx, L.postmarkTop, 0, 0, r - 18, true, 2.5);
    arcText(ctx, L.postmarkBottom, 0, 0, r - 18, false, 2.5);
    star(ctx, -(r - 18), 0, 7); ctx.fill();
    star(ctx, r - 18, 0, 7); ctx.fill();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    px = 34;
    ctx.font = `800 ${px}px ${F.b}`;
    while (ctx.measureText(o.dayMonth).width > (r - 44) * 2 && px > 14) { px -= 1; ctx.font = `800 ${px}px ${F.b}`; }
    ctx.fillText(o.dayMonth, 0, 4);
    ctx.font = `700 25px ${F.b}`;
    ctx.fillText(String(o.year), 0, 36);
    // cancel waves across the stamp
    ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      for (let x = r + 12; x <= r + 232; x += 4) {
        const y = k * 25 + Math.sin((x - r) / 15) * 6;
        if (x === r + 12) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLetter(ctx, o) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    drawPaper(ctx);

    // who it is for
    ctx.fillStyle = INK.soft;
    ctx.font = `700 24px ${F.b}`;
    spaced(ctx, L.toLabel, X0, 196, 7);
    ctx.fillStyle = INK.navy;
    let px = 78;
    ctx.font = `600 ${px}px ${F.d}`;
    while (ctx.measureText(L.to1).width > 560 && px > 40) { px -= 2; ctx.font = `600 ${px}px ${F.d}`; }
    ctx.fillText(L.to1, X0, 286);
    ctx.fillStyle = INK.soft;
    ctx.font = `500 46px ${F.d}`;
    ctx.fillText(L.to2, X0, 350);
    ctx.strokeStyle = INK.gold; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(X0, 386); ctx.lineTo(X0 + 300, 386); ctx.moveTo(X0, 396); ctx.lineTo(X0 + 190, 396); ctx.stroke();

    drawStamp(ctx);
    drawPostmark(ctx, o, INK.mark);
    // the same ink again in cream where it crosses the dark stamp picture, so the postmark reads on both
    ctx.save();
    stampFrame(ctx);
    ctx.beginPath(); ctx.rect(STAMP.p, STAMP.p, STAMP.w - STAMP.p * 2, STAMP.h - STAMP.p * 2); ctx.clip();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawPostmark(ctx, o, 'rgba(255,247,230,0.82)');
    ctx.restore();

    ctx.fillStyle = INK.red;
    px = 104;
    ctx.font = `700 ${px}px ${F.d}`;
    while (ctx.measureText(L.greeting).width > X1 - X0 && px > 50) { px -= 2; ctx.font = `700 ${px}px ${F.d}`; }
    ctx.fillText(L.greeting, X0, 600);

    // body: the largest hand size that fits the page
    let s = o.blank ? 66 : 82;
    let lay = layout(ctx, o.blocks, s, o);
    while (lay.height > Y1 - Y0 && s > 34) { s -= 2; lay = layout(ctx, o.blocks, s, o); }
    lay.ops.forEach((op) => {
      const x = X0 + op.x;
      const y = Y0 + op.y;
      if (op.k === 'text') { ctx.fillStyle = INK.navy; ctx.font = op.font; ctx.fillText(op.text, x, y); }
      else if (op.k === 'star') { ctx.fillStyle = INK.goldHi; ctx.strokeStyle = INK.gold; ctx.lineWidth = 3; ctx.lineJoin = 'round'; star(ctx, x, y, op.r); ctx.fill(); ctx.stroke(); }
      else if (op.k === 'rule') { ctx.strokeStyle = INK.rule; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + op.w, y); ctx.stroke(); }
      else if (op.k === 'hint') { ctx.fillStyle = INK.soft; ctx.globalAlpha = 0.75; ctx.font = `500 22px ${F.b}`; ctx.fillText(op.text, x, y); ctx.globalAlpha = 1; }
      else if (op.k === 'name') { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.04); ctx.fillStyle = INK.red; ctx.font = op.font; ctx.fillText(op.text, 0, 0); ctx.restore(); }
    });

    // foot
    ctx.textAlign = 'center';
    ctx.fillStyle = INK.soft; ctx.globalAlpha = 0.8;
    ctx.font = `500 23px ${F.b}`;
    ctx.fillText(L.url, W / 2, H - 94);
    ctx.globalAlpha = 1;
    const half = ctx.measureText(L.url).width / 2 + 30;
    ctx.fillStyle = INK.goldHi;
    star(ctx, W / 2 - half, H - 102, 10); ctx.fill();
    star(ctx, W / 2 + half, H - 102, 10); ctx.fill();
    ctx.textAlign = 'left';
  }

  function letterBlocks() {
    // {years}: the word for "years" when it changes with the number (pl: 3 lata, 5 lat; uk: 3 роки, 5 років)
    let years = '';
    if (L.years && state.age) {
      try { years = L.years[new Intl.PluralRules(T.locale).select(Number(state.age))] || L.years.other; } catch (e) { years = L.years.other; }
    }
    const map = { name: state.name, age: state.age, years };
    const blocks = [];
    const intro = state.name && state.age ? fill(L.introBoth, map) : state.name ? fill(L.introName, map) : state.age ? fill(L.introAge, map) : '';
    const mood = state.mood !== null ? T.moods[state.mood] : '';
    const first = [intro, mood].filter(Boolean).join(' ');
    if (first) blocks.push({ t: 'p', text: first });
    let deed = state.deedText || (state.deed !== null ? T.deeds[state.deed] : '');
    if (deed && !/[.!?…]$/.test(deed)) deed += '.';
    if (deed) blocks.push({ t: 'p', text: fill(L.deed, { deed }) });
    const wishes = state.wishes.filter(Boolean);
    if (wishes.length) { blocks.push({ t: 'p', text: L.wishesLead, tight: true }); blocks.push({ t: 'list', items: wishes }); }
    else blocks.push({ t: 'p', text: L.noWishes });
    blocks.push({ t: 'p', text: L.closing });
    blocks.push({ t: 'sign' });
    if (state.ps !== null) blocks.push({ t: 'p', text: fill(L.ps, { line: T.ps[state.ps] }) });
    return blocks;
  }

  function blankBlocks() {
    const rows = L.blankRows.map((parts) => ({ t: 'row', parts }));
    return [
      rows[0], rows[1],
      { t: 'p', text: L.wishesLead, tight: true, blankLine: true },
      { t: 'list', items: [null, null, null] },
      ...rows.slice(2),
      { t: 'p', text: L.closing },
      { t: 'sign' },
      { t: 'row', parts: [L.blankPs, '_*'] },
    ];
  }

  function dateParts() {
    const now = new Date();
    let dayMonth;
    try { dayMonth = new Intl.DateTimeFormat(T.locale, { day: 'numeric', month: 'short' }).format(now).replace(/\./g, '').toUpperCase(); } catch (e) { dayMonth = now.toDateString().slice(4, 10).toUpperCase(); }
    return { dayMonth, year: now.getFullYear() };
  }

  function toPng(data) {
    // the sample text decides which subsets load (latin-ext for Polish, Cyrillic for Ukrainian), so pass the real words
    const words = data.blocks.map((b) => b.text || (b.items || []).join(' ') || (b.parts || []).join(' '));
    const sample = ['A', L.greeting, L.to1, L.to2, L.stampTop, L.stampBottom, L.postmarkTop, L.postmarkBottom, L.signoff, L.signHere, data.name, data.dayMonth].concat(words).join(' ');
    const fonts = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load(`700 100px ${F.d}`, sample), document.fonts.load(`700 100px ${F.h}`, sample), document.fonts.load(`600 100px ${F.h}`, sample), document.fonts.load(`700 30px ${F.b}`, sample)]).catch(() => {})
      : Promise.resolve();
    return fonts.then(() => new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      drawLetter(canvas.getContext('2d'), data);
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    }));
  }

  function renderLetter() {
    return toPng({ ...dateParts(), blocks: letterBlocks(), name: state.name, blank: false }).then((blob) => {
      if (!blob) return;
      if (letterUrl) URL.revokeObjectURL(letterUrl);
      letterBlob = blob;
      letterUrl = URL.createObjectURL(blob);
      $('letter-img').src = letterUrl;
      $('thumb').src = letterUrl;
      $('print-img').src = letterUrl;
      body.classList.add('has-print');
    });
  }

  const loaded = (img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());

  // The print picture stays in place until the next tap or key press, which can only happen once the print dialog
  // is closed. (Not on "afterprint": some browsers fire it before the sheet is laid out.)
  function afterPrint() {
    const restore = () => {
      document.removeEventListener('pointerdown', restore, true);
      document.removeEventListener('keydown', restore, true);
      if (body.dataset.stage === 'result' && letterUrl) $('print-img').src = letterUrl;
      else body.classList.remove('has-print');
    };
    document.addEventListener('pointerdown', restore, true);
    document.addEventListener('keydown', restore, true);
  }

  function printPicture(src) {
    const img = $('print-img');
    if (img.src !== src) img.src = src;
    body.classList.add('has-print');
    loaded(img).then(() => { window.print(); afterPrint(); });
  }

  function printLetter() {
    if (letterUrl) printPicture(letterUrl);
  }

  function printBlank() {
    if (blankUrl) { printPicture(blankUrl); return; }
    toPng({ ...dateParts(), blocks: blankBlocks(), name: '', blank: true }).then((blob) => {
      if (!blob) return;
      blankUrl = URL.createObjectURL(blob);
      printPicture(blankUrl);
    });
  }

  function fileName() {
    const slug = state.name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return J.fileName + (slug ? '-' + slug : '') + '.png';
  }

  function saveLetter() {
    if (!letterBlob) return;
    const file = typeof File === 'function' ? new File([letterBlob], fileName(), { type: 'image/png' }) : null;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(() => {});
      return;
    }
    const a = document.createElement('a');
    a.href = letterUrl;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function copyLink() {
    const url = location.href.split('#')[0] + '#l=' + code();
    const btn = $('share');
    const ok = () => { btn.textContent = J.shared; window.setTimeout(() => { btn.textContent = J.share; }, 2200); };
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = url; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { window.prompt('', url); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, fallback);
    else fallback();
  }

  /* ---------- wiring ---------- */
  steps.forEach((s, i) => { s.querySelector('.q-count-n').textContent = fill(T.count, { n: i + 1, total: N }); });
  document.querySelectorAll('.tiles .tile').forEach((b) => b.addEventListener('click', () => onTile(b)));
  wishInputs.forEach((inp) => inp.addEventListener('input', syncIdeas));
  deedInput.addEventListener('input', () => {
    if (clean(deedInput.value, 60)) { state.deed = null; press('deed', null); }
  });

  $('start-btn').addEventListener('click', () => { setStage('steps'); show(0); });
  $('steps').addEventListener('submit', (e) => { e.preventDefault(); goNext(); });
  $('back').addEventListener('click', goBack);
  $('edit').addEventListener('click', edit);
  $('restart').addEventListener('click', restart);
  $('share').addEventListener('click', copyLink);
  $('save').addEventListener('click', saveLetter);
  $('print').addEventListener('click', printLetter);
  $('blank-print').addEventListener('click', printBlank);
  document.querySelector('.verdict-link').addEventListener('click', (e) => {
    e.preventDefault();
    sheet.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  });

  document.addEventListener('keydown', (e) => {
    if (body.dataset.stage !== 'steps' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowLeft' && !/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) { e.preventDefault(); goBack(); }
  });

  // a copied link carries the picture choices only: #l=<age>-<year>-<deed>-<ps>, "x" where nothing was picked
  const m = /^#l=([0-9x]+)-([0-9x])-([0-9x])-([0-9x])$/.exec(location.hash);
  const pickOf = (v, n) => (v === 'x' ? null : Number(v) < n ? Number(v) : undefined);
  const shared = m && {
    age: m[1] === 'x' ? null : ages.includes(m[1]) ? m[1] : undefined,
    mood: pickOf(m[2], T.moods.length),
    deed: pickOf(m[3], T.deeds.length),
    ps: pickOf(m[4], T.ps.length),
  };
  if (shared && Object.values(shared).every((v) => v !== undefined)) {
    Object.assign(state, shared);
    writeInputs();
    showResult();
  } else {
    setStage('start');
  }
})();
