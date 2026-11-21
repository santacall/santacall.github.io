/* Naughty or Nice Test. Everything runs in this page: no network calls, no storage, no cookies.
   The child's name lives in a variable and in the two inputs, and nowhere else. */
(() => {
  'use strict';

  const T = JSON.parse(document.getElementById('strings').textContent);
  const J = T.js;
  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sheet = $('sheet');
  const questions = Array.from(document.querySelectorAll('.question'));
  const N = questions.length;
  const bulbs = Array.from($('progress').children);
  const nameInput = $('name');
  const certName = $('cert-name');
  const appBlock = $('app');
  const appDefaults = { heading: $('app-h').textContent, button: $('app-button-text').textContent };

  let answers = new Array(N).fill(null);
  let current = 0;
  let name = '';
  let locked = false;
  let certUrl = null;
  let certBlob = null;
  let certTimer = 0;
  let raf = 0;

  const fill = (s, map) => s.replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
  const cleanName = (v) => v.replace(/\s+/g, ' ').trim().slice(0, 24);
  const setStage = (s) => { body.dataset.stage = s; };
  const toSheet = () => {
    const top = sheet.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.35) sheet.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- quiz ---------- */
  function show(i, back) {
    current = i;
    questions.forEach((q, k) => {
      q.classList.toggle('is-active', k === i);
      q.classList.toggle('from-left', k === i && !!back);
      if (k === i) q.querySelectorAll('.answer').forEach((b) => b.classList.toggle('is-picked', answers[k] !== null && Number(b.dataset.v) === answers[k]));
    });
    bulbs.forEach((b, k) => {
      b.classList.toggle('is-done', answers[k] !== null && k !== i);
      b.classList.toggle('is-now', k === i);
    });
    questions[i].querySelector('.q-text').focus({ preventScroll: true });
    locked = false;
  }

  function pick(btn) {
    if (locked) return;
    locked = true;
    const q = questions[current];
    q.querySelectorAll('.answer').forEach((b) => b.classList.toggle('is-picked', b === btn));
    answers[current] = Number(btn.dataset.v);
    window.setTimeout(() => {
      if (current < N - 1) show(current + 1);
      else finish();
    }, reduce ? 0 : 280);
  }

  function goBack() {
    if (locked) return;
    if (current === 0) { setStage('start'); nameInput.focus({ preventScroll: true }); return; }
    show(current - 1, true);
  }

  function finish() {
    try { history.replaceState(null, '', '#a=' + answers.join('')); } catch (e) { /* file:// in some browsers */ }
    showResult();
  }

  /* ---------- result ---------- */
  function score() {
    const sum = answers.reduce((a, b) => a + b, 0);
    const pct = 60 + Math.round((sum / (N * 2)) * 40);
    const tier = pct >= 90 ? 'top' : pct >= 75 ? 'mid' : 'low';
    return { pct, tier };
  }

  function renderTexts() {
    const { pct, tier } = score();
    const t = J.tiers[tier];
    const map = { name, pct };
    $('stamp-text').textContent = t.stamp;
    $('result-title').textContent = name ? fill(t.title, map) : t.titleAnon;
    $('result-note').textContent = name ? fill(t.note, map) : t.noteAnon;
    $('cert-h').textContent = tier === 'low' ? J.certHeadingLow : J.certHeading;
    $('cert-img').alt = name ? fill(J.certAlt, map) : fill(J.certAltAnon, map);
    $('app-h').textContent = name ? fill(J.appHeading, map) : J.appHeadingResult;
    $('app-button-text').textContent = name ? fill(J.appButton, map) : appDefaults.button;
  }

  function renderTasks() {
    const { tier } = score();
    const box = $('tasks');
    const list = $('tasks-list');
    list.textContent = '';
    if (tier === 'top') { box.hidden = true; return; }
    let idx = answers.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
    if (tier === 'low' && idx.length < 2) idx = idx.concat(answers.map((v, i) => (v === 1 ? i : -1)).filter((i) => i >= 0));
    idx = idx.slice(0, 2);
    box.hidden = idx.length === 0;
    idx.forEach((i) => {
      const li = document.createElement('li');
      li.textContent = T.tasks[i];
      list.appendChild(li);
    });
  }

  function setMeter(v) {
    $('needle').setAttribute('transform', `rotate(${-90 + v * 1.8} 160 166)`);
    $('meter-nice').setAttribute('stroke-dasharray', `${Math.max(0, Math.min(100, v))} 100`);
    $('meter-nice').style.visibility = v < 0.5 ? 'hidden' : 'visible';
  }

  function runMeter(pct, done) {
    const pctEl = $('pct');
    const label = (v) => { pctEl.textContent = fill(J.pctLabel, { pct: v }); };
    cancelAnimationFrame(raf);
    if (reduce) { setMeter(pct); label(pct); done(); return; }
    const dur = 1900;
    let start = 0;
    const step = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / dur);
      // damped swing: the needle overshoots a little, then settles
      const swing = 1 - Math.exp(-7 * t) * Math.cos(7 * t);
      setMeter(Math.min(101.5, pct * swing));
      label(Math.round(pct * (1 - Math.pow(1 - Math.min(1, t * 1.25), 3))));
      if (t < 1) raf = requestAnimationFrame(step);
      else { setMeter(pct); label(pct); done(); }
    };
    setMeter(0); label(0);
    raf = requestAnimationFrame(step);
  }

  function showResult() {
    const { pct } = score();
    $('result').hidden = false;
    $('final').hidden = false;
    $('stamp').classList.remove('is-on');
    certName.value = name;
    renderTexts();
    renderTasks();
    setStage('result');
    $('app-slot-top').appendChild(appBlock);
    window.scrollTo(0, 0);
    renderCert();
    $('result-title').focus({ preventScroll: true });
    runMeter(pct, () => { $('stamp').classList.add('is-on'); });
  }

  function reset() {
    cancelAnimationFrame(raf);
    answers = new Array(N).fill(null);
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    $('app-slot-bottom').appendChild(appBlock);
    $('app-h').textContent = appDefaults.heading;
    $('app-button-text').textContent = appDefaults.button;
    $('result').hidden = true;
    $('final').hidden = true;
    body.classList.remove('has-cert');
    nameInput.value = name;
    setStage('start');
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    nameInput.focus({ preventScroll: true });
  }

  /* ---------- certificate (canvas -> PNG, drawn locally) ---------- */
  const CW = 2100;
  const CH = 1500;
  const INK = { paper: '#fbf3e1', edge: 'rgba(205,176,116,0.34)', green: '#1d4a3f', gold: '#c99a2e', goldHi: '#f2c86b', red: '#a51d2a', redDeep: '#7c1320', navy: '#16224a', soft: '#55597a', cream: '#fff7e6' };
  // a dictionary can swap the families (js.certFonts) when the bundled fonts lack its letters (pl, uk)
  const F = Object.assign({ d: '"Fraunces", Georgia, serif', b: '"Figtree", Helvetica, Arial, sans-serif', h: '"Caveat", "Bradley Hand", cursive' }, J.certFonts || {});

  function spaced(ctx, text, cx, y, gap) {
    const chars = Array.from(text);
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1);
    let x = cx - total / 2;
    ctx.textAlign = 'left';
    chars.forEach((c, i) => { ctx.fillText(c, x, y); x += widths[i] + gap; });
    ctx.textAlign = 'center';
    return total;
  }

  // shrink a line until it fits: other languages run longer than English
  function fit(ctx, text, weight, size, family, maxW) {
    let px = size;
    ctx.font = `${weight} ${px}px ${family}`;
    while (ctx.measureText(text).width > maxW && px > 18) { px -= 2; ctx.font = `${weight} ${px}px ${family}`; }
    return px;
  }
  function fitSpaced(ctx, text, weight, size, family, gap, maxW) {
    let px = size;
    const width = () => Array.from(text).reduce((a, c) => a + ctx.measureText(c).width, 0) + gap * (Array.from(text).length - 1);
    ctx.font = `${weight} ${px}px ${family}`;
    while (width() > maxW && px > 10) { px -= 1; ctx.font = `${weight} ${px}px ${family}`; }
  }

  function star(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 ? r * 0.44 : r;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      ctx[i ? 'lineTo' : 'moveTo'](cx + rad * Math.cos(a), cy + rad * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawCert(ctx, o) {
    const C = J.cert;
    const low = o.tier === 'low';
    const mid = CW / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = INK.paper;
    ctx.fillRect(0, 0, CW, CH);
    const g = ctx.createRadialGradient(mid, CH / 2, 420, mid, CH / 2, 1320);
    g.addColorStop(0, 'rgba(255,250,236,0)');
    g.addColorStop(1, INK.edge);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CW, CH);

    // frame
    ctx.strokeStyle = INK.green; ctx.lineWidth = 16; ctx.strokeRect(48, 48, CW - 96, CH - 96);
    ctx.strokeStyle = INK.gold; ctx.lineWidth = 5; ctx.strokeRect(78, 78, CW - 156, CH - 156);
    ctx.strokeStyle = INK.green; ctx.lineWidth = 2; ctx.strokeRect(94, 94, CW - 188, CH - 188);
    [[86, 86], [CW - 86, 86], [86, CH - 86], [CW - 86, CH - 86]].forEach(([x, y]) => {
      ctx.fillStyle = INK.paper; ctx.beginPath(); ctx.arc(x, y, 44, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = INK.gold; star(ctx, x, y, 32);
    });

    // head
    ctx.fillStyle = INK.gold; star(ctx, mid, 172, 26); star(ctx, mid - 70, 180, 14); star(ctx, mid + 70, 180, 14);
    ctx.fillStyle = INK.green; fitSpaced(ctx, C.office, 600, 30, F.b, 7, 1500);
    spaced(ctx, C.office, mid, 262, 7);

    ctx.fillStyle = INK.red;
    const titlePx = fit(ctx, low ? C.titleLow : C.title, 700, 158, F.d, 1640);
    ctx.fillText(low ? C.titleLow : C.title, mid, 432 - (158 - titlePx) * 0.28);
    ctx.fillStyle = INK.navy; fitSpaced(ctx, C.sub, 700, 34, F.b, 18, 1100);
    const subW = spaced(ctx, C.sub, mid, 506, 18);
    ctx.strokeStyle = INK.gold; ctx.lineWidth = 3;
    [[Math.max(200, mid - subW / 2 - 250), mid - subW / 2 - 36], [mid + subW / 2 + 36, Math.min(CW - 200, mid + subW / 2 + 250)]].forEach(([a, b]) => {
      ctx.beginPath(); ctx.moveTo(a, 494); ctx.lineTo(b, 494); ctx.stroke();
    });

    ctx.fillStyle = INK.soft; fit(ctx, C.lead, 400, 46, F.d, 1400);
    ctx.fillText(C.lead, mid, 622);

    // name
    if (o.name) {
      let size = 184;
      do { ctx.font = `600 ${size}px ${F.d}`; size -= 6; } while (ctx.measureText(o.name).width > 1380 && size > 60);
      ctx.fillStyle = INK.navy;
      ctx.fillText(o.name, mid, 806);
    } else {
      ctx.fillStyle = INK.soft; ctx.font = `600 34px ${F.h}`;
      ctx.globalAlpha = 0.75; ctx.fillText(C.blank, mid, 896); ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = INK.gold; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(mid - 560, 850); ctx.lineTo(mid - 22, 850); ctx.moveTo(mid + 22, 850); ctx.lineTo(mid + 560, 850); ctx.stroke();
    ctx.fillStyle = INK.gold; ctx.save(); ctx.translate(mid, 850); ctx.rotate(Math.PI / 4); ctx.fillRect(-9, -9, 18, 18); ctx.restore();

    ctx.fillStyle = INK.navy;
    const y1 = o.name ? 940 : 968;
    const b1 = low ? C.body1Low : C.body1;
    const b2 = fill(low ? C.body2Low : C.body2, { year: o.year });
    const bodyPx = Math.min(fit(ctx, b1, 400, 48, F.d, 1500), fit(ctx, b2, 400, 48, F.d, 1500));
    ctx.font = `400 ${bodyPx}px ${F.d}`;
    ctx.fillText(b1, mid, y1);
    ctx.fillText(b2, mid, y1 + 68);

    // signature
    const sx = 500;
    ctx.save(); ctx.translate(sx, 1236); ctx.rotate(-0.06);
    ctx.fillStyle = INK.navy; fit(ctx, C.signature, 700, 132, F.h, 560); ctx.fillText(C.signature, 0, 0); ctx.restore();
    ctx.strokeStyle = INK.navy; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 250, 1272); ctx.lineTo(sx + 250, 1272); ctx.stroke();
    ctx.fillStyle = INK.soft; fitSpaced(ctx, C.sigCaption, 600, 22, F.b, 5, 520);
    spaced(ctx, C.sigCaption, sx, 1312, 5);

    // date + address
    ctx.fillStyle = INK.soft; fit(ctx, fill(C.date, { date: o.date }), 500, 30, F.b, 560);
    ctx.fillText(fill(C.date, { date: o.date }), mid + 20, 1272);
    fit(ctx, C.url, 500, 24, F.b, 640); ctx.globalAlpha = 0.8;
    ctx.fillText(C.url, mid + 20, 1362); ctx.globalAlpha = 1;

    // seal
    const zx = 1610; const zy = 1178;
    ctx.fillStyle = INK.redDeep;
    [[-1, 0.42], [1, -0.42]].forEach(([dir, rot]) => {
      ctx.save(); ctx.translate(zx + dir * 34, zy + 60); ctx.rotate(rot * 0.5);
      ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(36, 0); ctx.lineTo(36, 150); ctx.lineTo(0, 122); ctx.lineTo(-36, 150); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
    ctx.fillStyle = INK.red;
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      ctx.beginPath(); ctx.arc(zx + 136 * Math.cos(a), zy + 136 * Math.sin(a), 18, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(zx, zy, 138, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = INK.goldHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(zx, zy, 120, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = INK.cream; fitSpaced(ctx, C.sealTop, 700, 17, F.b, 3, 176);
    spaced(ctx, C.sealTop, zx, zy - 58, 3);
    ctx.font = `700 92px ${F.d}`;
    ctx.fillText(o.pct + '%', zx, zy + 32);
    ctx.fillStyle = INK.goldHi; fitSpaced(ctx, low ? C.sealBottomLow : C.sealBottom, 700, 19, F.b, 4, 176);
    spaced(ctx, low ? C.sealBottomLow : C.sealBottom, zx, zy + 74, 4);
  }

  function certData() {
    const { pct, tier } = score();
    const now = new Date();
    let date;
    try { date = new Intl.DateTimeFormat(T.locale, { dateStyle: 'long' }).format(now); } catch (e) { date = now.toDateString(); }
    return { name, pct, tier, year: now.getFullYear(), date };
  }

  function renderCert() {
    const data = certData();
    const fonts = document.fonts && document.fonts.load
      ? Promise.all([document.fonts.load(`700 100px ${F.d}`, 'A'), document.fonts.load(`700 100px ${F.h}`, 'A'), document.fonts.load(`600 30px ${F.b}`, 'A')]).catch(() => {})
      : Promise.resolve();
    return fonts.then(() => new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = CW; canvas.height = CH;
      drawCert(canvas.getContext('2d'), data);
      canvas.toBlob((blob) => {
        if (!blob) { resolve(); return; }
        if (certUrl) URL.revokeObjectURL(certUrl);
        certBlob = blob;
        certUrl = URL.createObjectURL(blob);
        $('cert-img').src = certUrl;
        $('print-img').src = certUrl;
        body.classList.add('has-cert');
        resolve();
      }, 'image/png');
    }));
  }

  function fileName() {
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return J.fileName + (slug ? '-' + slug : '') + '.png';
  }

  function saveCert() {
    if (!certBlob) return;
    const file = typeof File === 'function' ? new File([certBlob], fileName(), { type: 'image/png' }) : null;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    if (touch && file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] }).catch(() => {});
      return;
    }
    const a = document.createElement('a');
    a.href = certUrl;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function copyLink() {
    const url = location.href.split('#')[0] + '#a=' + answers.join('');
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
  questions.forEach((q, i) => {
    q.querySelector('.q-count-n').textContent = fill(T.quiz.count, { n: i + 1, total: N });
    q.querySelectorAll('.answer').forEach((b) => b.addEventListener('click', () => pick(b)));
  });

  const ticks = $('meter-ticks');
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI - (i / 10) * Math.PI;
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const r1 = i % 5 === 0 ? 100 : 108;
    l.setAttribute('x1', 160 + r1 * Math.cos(a)); l.setAttribute('y1', 166 - r1 * Math.sin(a));
    l.setAttribute('x2', 160 + 116 * Math.cos(a)); l.setAttribute('y2', 166 - 116 * Math.sin(a));
    ticks.appendChild(l);
  }
    $('note-sign').textContent = J.noteSign;
  document.querySelector('.verdict-link').addEventListener('click', (e) => {
    e.preventDefault();
    sheet.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  });
  $('tasks-h').textContent = J.tasksHeading;
  $('cert-name-label').textContent = J.certNameLabel;
  $('save').textContent = J.save;
  $('print').textContent = J.print;
  $('print-hint').textContent = J.printHint;
  $('share').textContent = J.share;
  $('share-hint').textContent = J.shareHint;
  $('retake').textContent = J.retake;

  $('start').addEventListener('submit', (e) => {
    e.preventDefault();
    name = cleanName(nameInput.value);
    answers = new Array(N).fill(null);
    setStage('quiz');
    show(0);
    toSheet();
  });
  $('back').addEventListener('click', goBack);
  $('retake').addEventListener('click', reset);
  $('share').addEventListener('click', copyLink);
  $('save').addEventListener('click', saveCert);
  $('print').addEventListener('click', () => window.print());

  certName.addEventListener('input', () => {
    name = cleanName(certName.value);
    renderTexts();
    window.clearTimeout(certTimer);
    certTimer = window.setTimeout(renderCert, 160);
  });

  document.addEventListener('keydown', (e) => {
    if (body.dataset.stage !== 'quiz' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key >= '1' && e.key <= '3') {
      const btn = questions[current].querySelectorAll('.answer')[Number(e.key) - 1];
      if (btn) { e.preventDefault(); pick(btn); }
    } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
      e.preventDefault();
      goBack();
    }
  });

  // a shared link carries the answers only: #a=21201221
  const m = new RegExp('^#a=([0-2]{' + N + '})$').exec(location.hash);
  if (m) {
    answers = m[1].split('').map(Number);
    showResult();
  } else {
    setStage('start');
  }
})();
