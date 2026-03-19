'use strict';

const card     = document.getElementById('card');
const cardHint = document.getElementById('card-hint');

let texts   = [];
let shapes  = [];
let imgEl   = null;
let counter = 0;

const RANGE_SUFFIXES = {
  gradAngle:   '°',
  cardWidth:   'px',
  cardHeight:  'px',
  imgW:        'px',
  imgH:        'px',
  imgRadius:   'px',
  imgX:        'px',
  imgY:        'px',
  imgOpacity:  '%',
  newTextSize: 'px',
  newTextX:    'px',
  newTextY:    'px',
  shapeW:      'px',
  shapeH:      'px',
  shapeRadius: 'px',
  shapeOpacity:'%',
  shapeX:      'px',
  shapeY:      'px'
};

document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const isOpen = btn.classList.contains('open');
    btn.classList.toggle('open', !isOpen);
    target.classList.toggle('open', !isOpen);
  });
});

function syncRangeLabel(input, suffix) {
  const label = input.nextElementSibling;
  if (label && label.classList.contains('range-val')) {
    label.textContent = input.value + suffix;
  }
}

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rangeVal(id) { return parseInt(document.getElementById(id).value, 10); }
function inputVal(id) { return document.getElementById(id).value; }

function updateHint() {
  const hasContent = texts.length > 0 || shapes.length > 0 || imgEl !== null;
  cardHint.style.display = hasContent ? 'none' : 'flex';
}

function errorField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e57373';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; }, 1600);
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function rgbToHex(rgb) {
  if (!rgb) return null;
  if (/^#/.test(rgb)) return rgb;
  const m = rgb.match(/\d+/g);
  if (!m || m.length < 3) return null;
  return '#' + m.slice(0, 3).map(n => (+n).toString(16).padStart(2, '0')).join('');
}

const THEMES = {
  blank: null,
  birthday: {
    label: '🎂 Aniversário aplicado!',
    bgType: 'gradient',
    grad1: '#ffe066',
    grad2: '#ff6eb4',
    angle: 135,
    texts: [
      { content: 'Feliz Aniversário! 🎉', size: 32, color: '#7b003c', weight: '700', align: 'center', x: 50, y: 120 },
      { content: 'Que este dia seja incrível!', size: 16, color: '#5a003a', weight: '400', align: 'center', x: 60, y: 180 }
    ]
  },
  christmas: {
    label: '🎄 Natal aplicado!',
    bgType: 'gradient',
    grad1: '#1a6b2f',
    grad2: '#b22222',
    angle: 160,
    texts: [
      { content: 'Feliz Natal! 🎄', size: 34, color: '#fffbe6', weight: '700', align: 'center', x: 90, y: 110 },
      { content: 'Paz, amor e alegria!', size: 16, color: '#ffd700', weight: '400', align: 'center', x: 100, y: 175 }
    ]
  },
  easter: {
    label: '🐣 Páscoa aplicada!',
    bgType: 'gradient',
    grad1: '#ffe5f0',
    grad2: '#b5ead7',
    angle: 120,
    texts: [
      { content: 'Feliz Páscoa! 🐣', size: 32, color: '#6b3fa0', weight: '700', align: 'center', x: 90, y: 120 },
      { content: 'Que a alegria renove seu coração!', size: 14, color: '#3d2060', weight: '400', align: 'center', x: 30, y: 185 }
    ]
  },
  wedding: {
    label: '💍 Casamento aplicado!',
    bgType: 'gradient',
    grad1: '#fff8f0',
    grad2: '#f7d6e0',
    angle: 150,
    texts: [
      { content: 'Parabéns aos noivos! 💍', size: 28, color: '#8b1a4a', weight: '700', align: 'center', x: 60, y: 120 },
      { content: 'Que a felicidade seja eterna!', size: 15, color: '#5a0030', weight: '400', align: 'center', x: 65, y: 178 }
    ]
  },
  newyear: {
    label: '🎆 Ano Novo aplicado!',
    bgType: 'gradient',
    grad1: '#0d0d2b',
    grad2: '#1a1a6e',
    angle: 180,
    texts: [
      { content: 'Feliz Ano Novo! 🎆', size: 32, color: '#ffd700', weight: '700', align: 'center', x: 80, y: 110 },
      { content: 'Que 2025 seja extraordinário!', size: 15, color: '#c8c8ff', weight: '400', align: 'center', x: 55, y: 175 }
    ]
  }
};

function applyTheme() {
  const key   = inputVal('cardTheme');
  const theme = THEMES[key];
  const hint  = document.getElementById('theme-hint');

  if (!theme) {
    hint.classList.remove('visible');
    hint.textContent = '';
    return;
  }

  texts.forEach(t => t.el.remove());
  shapes.forEach(s => s.el.remove());
  if (imgEl) { imgEl.remove(); imgEl = null; }
  texts  = [];
  shapes = [];
  buildTextsList();
  buildShapesList();

  const bgTypeEl = document.getElementById('cardBgType');
  bgTypeEl.value = theme.bgType;
  onBgTypeChange();

  if (theme.bgType === 'gradient') {
    document.getElementById('gradColor1').value = theme.grad1;
    document.getElementById('gradColor2').value = theme.grad2;
    const angleEl = document.getElementById('gradAngle');
    angleEl.value = theme.angle;
    syncRangeLabel(angleEl, '°');
    applyBg();
  }

  theme.texts.forEach(t => {
    const el = document.createElement('div');
    el.className = 'card-element card-el-text';
    el.dataset.id = ++counter;
    el.style.left       = t.x + 'px';
    el.style.top        = t.y + 'px';
    el.style.fontFamily = 'Montserrat';
    el.style.fontSize   = t.size + 'px';
    el.style.color      = t.color;
    el.style.textAlign  = t.align;
    el.style.fontWeight = t.weight;
    el.style.lineHeight = '1.35';
    el.innerHTML = escHtml(t.content);
    card.appendChild(el);
    texts.push({ id: counter, el });
  });

  updateHint();
  buildTextsList();

  hint.textContent = theme.label;
  hint.classList.add('visible');
}

function updateCharCount() {
  const ta    = document.getElementById('newTextContent');
  const label = document.getElementById('charCount');
  const len   = ta.value.length;
  label.textContent = len + ' / 200';
  label.classList.toggle('near-limit', len >= 180);
}

function onBgTypeChange() {
  const v = inputVal('cardBgType');
  document.getElementById('bg-solid').style.display    = v === 'solid'    ? 'block' : 'none';
  document.getElementById('bg-gradient').style.display = v === 'gradient' ? 'flex'  : 'none';
  document.getElementById('bg-image').style.display    = v === 'image'    ? 'flex'  : 'none';
  if (v !== 'image') {
    card.style.backgroundImage    = '';
    card.style.backgroundSize     = '';
    card.style.backgroundPosition = '';
  }
  applyBg();
}

function applyBg() {
  const v = inputVal('cardBgType');
  if (v === 'solid') {
    card.style.background = inputVal('cardBgColor');
  } else if (v === 'gradient') {
    const c1 = inputVal('gradColor1');
    const c2 = inputVal('gradColor2');
    const a  = inputVal('gradAngle');
    card.style.background = 'linear-gradient(' + a + 'deg, ' + c1 + ', ' + c2 + ')';
  }
}

function loadBgImage(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    card.style.background         = 'none';
    card.style.backgroundColor    = '#000';
    card.style.backgroundImage    = 'url(' + e.target.result + ')';
    card.style.backgroundSize     = 'cover';
    card.style.backgroundPosition = 'center';
  };
  reader.readAsDataURL(input.files[0]);
}

function resizeCard() {
  card.style.width     = rangeVal('cardWidth')  + 'px';
  card.style.minHeight = rangeVal('cardHeight') + 'px';
  clampAllElements();
}

function onImgFileChange(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    if (imgEl) imgEl.remove();

    imgEl = document.createElement('div');
    imgEl.className = 'card-element card-el-img';

    const img = document.createElement('img');
    img.src = e.target.result;
    img.alt = 'imagem do cartão';
    imgEl.appendChild(img);

    card.appendChild(imgEl);
    applyImg();
    document.getElementById('img-controls').style.display = 'flex';
    updateHint();
  };
  reader.readAsDataURL(input.files[0]);
}

function applyImg() {
  if (!imgEl) return;
  imgEl.style.left         = rangeVal('imgX') + 'px';
  imgEl.style.top          = rangeVal('imgY') + 'px';
  imgEl.style.width        = rangeVal('imgW') + 'px';
  imgEl.style.height       = rangeVal('imgH') + 'px';
  imgEl.style.borderRadius = rangeVal('imgRadius') + 'px';
  imgEl.style.opacity      = rangeVal('imgOpacity') / 100;
}

function removeImg() {
  if (imgEl) { imgEl.remove(); imgEl = null; }
  document.getElementById('imgFile').value               = '';
  document.getElementById('img-controls').style.display = 'none';
  updateHint();
}

function toggleNewTextBg() {
  const cb    = document.getElementById('newTextBgEnabled');
  const color = document.getElementById('newTextBg');
  color.disabled      = !cb.checked;
  color.style.opacity = cb.checked ? '1' : '.35';
}

function addText() {
  const content = document.getElementById('newTextContent').value.trim();
  if (!content) { errorField('newTextContent'); return; }

  const id = ++counter;
  const el = document.createElement('div');
  el.className  = 'card-element card-el-text';
  el.dataset.id = id;

  const font      = inputVal('newTextFont');
  const size      = rangeVal('newTextSize');
  const color     = inputVal('newTextColor');
  const align     = inputVal('newTextAlign');
  const weight    = inputVal('newTextWeight');
  const x         = rangeVal('newTextX');
  const y         = rangeVal('newTextY');
  const bgEnabled = document.getElementById('newTextBgEnabled').checked;
  const bgColor   = bgEnabled ? inputVal('newTextBg') : '';

  el.style.left       = x + 'px';
  el.style.top        = y + 'px';
  el.style.fontFamily = font;
  el.style.fontSize   = size + 'px';
  el.style.color      = color;
  el.style.textAlign  = align;
  el.style.fontWeight = weight;
  el.style.lineHeight = '1.35';
  if (bgColor) {
    el.style.backgroundColor = bgColor;
    el.style.padding         = '4px 8px';
    el.style.borderRadius    = '4px';
  }
  el.innerHTML = escHtml(content).replace(/\n/g, '<br>');

  card.appendChild(el);
  texts.push({ id, el });
  updateHint();
  buildTextsList();
  resetTextForm();
}

function resetTextForm() {
  document.getElementById('newTextContent').value     = '';
  updateCharCount();
  document.getElementById('newTextBgEnabled').checked = false;
  const bgInput = document.getElementById('newTextBg');
  bgInput.disabled      = true;
  bgInput.style.opacity = '.35';
}

function buildTextsList() {
  const list = document.getElementById('texts-list');
  list.innerHTML = '';
  texts.forEach(function (item) {
    const preview = item.el.textContent.replace(/\n/g, ' ').substring(0, 22) || '(texto vazio)';
    list.appendChild(buildItemCard(item.id, '✏️ ' + preview, buildTextEditBody(item.id, item.el), function () { deleteText(item.id); }));
  });
}

function buildTextEditBody(id, el) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:9px;';

  wrap.appendChild(makeField('Conteúdo', makeTextarea('tedit-content-' + id, el.textContent, 200, function (val) {
    el.innerHTML = escHtml(val).replace(/\n/g, '<br>');
    buildTextsList();
  })));

  const fontOpts = [
    ['Montserrat', 'Montserrat'],
    ["'Nunito Sans'", 'Nunito Sans'],
    ["'Work Sans'", 'Work Sans'],
    ['Georgia, serif', 'Georgia (Serif)'],
    ["'Courier New', monospace", 'Courier New (Mono)']
  ];
  wrap.appendChild(makeField('Fonte', makeSelect('tedit-font-' + id, fontOpts, el.style.fontFamily, function (val) {
    el.style.fontFamily = val;
  })));

  wrap.appendChild(makeField('Tamanho', makeRange('tedit-size-' + id, 10, 80, parseInt(el.style.fontSize), 'px', function (val) {
    el.style.fontSize = val + 'px';
  })));

  wrap.appendChild(makeField('Cor do texto', makeColor('tedit-color-' + id, el.style.color, function (val) {
    el.style.color = val;
  })));

  const alignOpts = [['left', 'Esquerda'], ['center', 'Centro'], ['right', 'Direita']];
  wrap.appendChild(makeField('Alinhamento', makeSelect('tedit-align-' + id, alignOpts, el.style.textAlign, function (val) {
    el.style.textAlign = val;
  })));

  const weightOpts = [['400', 'Normal'], ['700', 'Negrito'], ['900', 'Extra-negrito']];
  wrap.appendChild(makeField('Peso', makeSelect('tedit-weight-' + id, weightOpts, el.style.fontWeight, function (val) {
    el.style.fontWeight = val;
  })));

  wrap.appendChild(makeField('Posição X', makeRange('tedit-x-' + id, 0, 560, parseInt(el.style.left), 'px', function (val) {
    el.style.left = val + 'px';
  })));

  wrap.appendChild(makeField('Posição Y', makeRange('tedit-y-' + id, 0, 660, parseInt(el.style.top), 'px', function (val) {
    el.style.top = val + 'px';
  })));

  return wrap;
}

function deleteText(id) {
  const idx = texts.findIndex(function (t) { return t.id === id; });
  if (idx === -1) return;
  texts[idx].el.remove();
  texts.splice(idx, 1);
  updateHint();
  buildTextsList();
}

function addShape() {
  const id = ++counter;
  const el = document.createElement('div');
  el.className  = 'card-element card-el-shape';
  el.dataset.id = id;

  const color   = inputVal('shapeColor');
  const w       = rangeVal('shapeW');
  const h       = rangeVal('shapeH');
  const radius  = rangeVal('shapeRadius');
  const opacity = rangeVal('shapeOpacity');
  const x       = rangeVal('shapeX');
  const y       = rangeVal('shapeY');

  el.style.left            = x + 'px';
  el.style.top             = y + 'px';
  el.style.width           = w + 'px';
  el.style.height          = h + 'px';
  el.style.backgroundColor = color;
  el.style.borderRadius    = radius + 'px';
  el.style.opacity         = opacity / 100;

  card.appendChild(el);
  shapes.push({ id, el });
  updateHint();
  buildShapesList();
}

function buildShapesList() {
  const list = document.getElementById('shapes-list');
  list.innerHTML = '';
  shapes.forEach(function (item) {
    list.appendChild(buildItemCard(item.id, '▭ Forma #' + item.id, buildShapeEditBody(item.id, item.el), function () { deleteShape(item.id); }));
  });
}

function buildShapeEditBody(id, el) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:9px;';

  wrap.appendChild(makeField('Cor de fundo', makeColor('sedit-color-' + id, el.style.backgroundColor, function (val) {
    el.style.backgroundColor = val;
  })));
  wrap.appendChild(makeField('Largura', makeRange('sedit-w-' + id, 10, 580, parseInt(el.style.width), 'px', function (val) {
    el.style.width = val + 'px';
  })));
  wrap.appendChild(makeField('Altura', makeRange('sedit-h-' + id, 10, 680, parseInt(el.style.height), 'px', function (val) {
    el.style.height = val + 'px';
  })));
  wrap.appendChild(makeField('Arredondamento', makeRange('sedit-r-' + id, 0, 300, parseInt(el.style.borderRadius), 'px', function (val) {
    el.style.borderRadius = val + 'px';
  })));
  wrap.appendChild(makeField('Opacidade', makeRange('sedit-op-' + id, 5, 100, Math.round(parseFloat(el.style.opacity || '1') * 100), '%', function (val) {
    el.style.opacity = val / 100;
  })));
  wrap.appendChild(makeField('Posição X', makeRange('sedit-x-' + id, 0, 560, parseInt(el.style.left), 'px', function (val) {
    el.style.left = val + 'px';
  })));
  wrap.appendChild(makeField('Posição Y', makeRange('sedit-y-' + id, 0, 660, parseInt(el.style.top), 'px', function (val) {
    el.style.top = val + 'px';
  })));

  return wrap;
}

function deleteShape(id) {
  const idx = shapes.findIndex(function (s) { return s.id === id; });
  if (idx === -1) return;
  shapes[idx].el.remove();
  shapes.splice(idx, 1);
  updateHint();
  buildShapesList();
}

function resetAll() {
  texts.forEach(function (t) { t.el.remove(); });
  shapes.forEach(function (s) { s.el.remove(); });
  if (imgEl) { imgEl.remove(); imgEl = null; }

  texts   = [];
  shapes  = [];
  counter = 0;

  card.style.background         = '#ffffff';
  card.style.backgroundImage    = '';
  card.style.backgroundSize     = '';
  card.style.backgroundPosition = '';
  card.style.width              = '500px';
  card.style.minHeight          = '350px';

  document.getElementById('cardBgColor').value = '#ffffff';
  document.getElementById('cardBgType').value  = 'solid';
  document.getElementById('cardTheme').value   = 'blank';
  document.getElementById('theme-hint').classList.remove('visible');
  document.getElementById('theme-hint').textContent = '';
  onBgTypeChange();

  document.getElementById('imgFile').value               = '';
  document.getElementById('img-controls').style.display = 'none';

  // reset ranges usando a tabela de sufixos — sem adivinhar
  Object.keys(RANGE_SUFFIXES).forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = el.defaultValue;
    const label = el.nextElementSibling;
    if (label && label.classList.contains('range-val')) {
      label.textContent = el.defaultValue + RANGE_SUFFIXES[id];
    }
  });

  resetTextForm();
  buildTextsList();
  buildShapesList();
  updateHint();
}

function clampAllElements() {
  const cw = card.offsetWidth;
  const ch = card.offsetHeight;
  texts.concat(shapes).forEach(function (item) {
    let x = parseInt(item.el.style.left) || 0;
    let y = parseInt(item.el.style.top)  || 0;
    const w = item.el.offsetWidth  || 0;
    const h = item.el.offsetHeight || 0;
    item.el.style.left = Math.max(0, Math.min(x, cw - w)) + 'px';
    item.el.style.top  = Math.max(0, Math.min(y, ch - h)) + 'px';
  });
  if (imgEl) {
    let x = parseInt(imgEl.style.left) || 0;
    let y = parseInt(imgEl.style.top)  || 0;
    imgEl.style.left = Math.max(0, Math.min(x, cw - imgEl.offsetWidth))  + 'px';
    imgEl.style.top  = Math.max(0, Math.min(y, ch - imgEl.offsetHeight)) + 'px';
  }
}

function makeField(labelText, control) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const lbl = document.createElement('label');
  lbl.style.cssText = 'font-size:11px;font-weight:700;color:#4a6e60;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px;';
  lbl.textContent = labelText;
  wrap.appendChild(lbl);
  wrap.appendChild(control);
  return wrap;
}

function makeRange(id, min, max, value, suffix, onChange) {
  const row   = document.createElement('div');
  row.className = 'range-row';
  const input = document.createElement('input');
  input.type  = 'range';
  input.id    = id;
  input.min   = min;
  input.max   = max;
  input.value = clamp(value, min, max);
  input.style.cssText = 'flex:1;accent-color:var(--color-btn);height:4px;';
  const span  = document.createElement('span');
  span.className   = 'range-val';
  span.textContent = input.value + suffix;
  input.addEventListener('input', function () {
    span.textContent = input.value + suffix;
    onChange(parseInt(input.value, 10));
  });
  row.appendChild(input);
  row.appendChild(span);
  return row;
}

function makeColor(id, currentVal, onChange) {
  const input = document.createElement('input');
  input.type  = 'color';
  input.id    = id;
  input.style.cssText = 'height:32px;border:1px solid #b0d9c8;border-radius:6px;padding:2px 4px;background:#f4fbf8;cursor:pointer;width:100%;';
  input.value = rgbToHex(currentVal) || '#000000';
  input.addEventListener('input', function () { onChange(input.value); });
  return input;
}

function makeSelect(id, options, currentVal, onChange) {
  const sel = document.createElement('select');
  sel.id    = id;
  sel.style.cssText = 'border:1px solid #b0d9c8;border-radius:6px;padding:7px 10px;font-family:inherit;font-size:13px;background:#f4fbf8;color:#1a3a2a;width:100%;';
  options.forEach(function (pair) {
    const opt = document.createElement('option');
    opt.value = pair[0];
    opt.textContent = pair[1];
    if (pair[0] === currentVal || pair[0].replace(/['"]/g, '').trim() === currentVal.replace(/['"]/g, '').trim()) {
      opt.selected = true;
    }
    sel.appendChild(opt);
  });
  sel.addEventListener('change', function () { onChange(sel.value); });
  return sel;
}

function makeTextarea(id, currentVal, maxLen, onChange) {
  const ta = document.createElement('textarea');
  ta.id       = id;
  ta.maxLength = maxLen;
  ta.rows     = 3;
  ta.value    = currentVal;
  ta.style.cssText = 'border:1px solid #b0d9c8;border-radius:6px;padding:7px 10px;font-family:inherit;font-size:13px;background:#f4fbf8;color:#1a3a2a;width:100%;resize:vertical;min-height:60px;max-height:130px;';
  ta.addEventListener('input', function () { onChange(ta.value); });
  return ta;
}

function buildItemCard(id, labelText, body, onDelete) {
  const itemCard = document.createElement('div');
  itemCard.className = 'item-card';

  const header = document.createElement('div');
  header.className = 'item-card-header';

  const label = document.createElement('span');
  label.className   = 'item-card-label';
  label.textContent = labelText;

  const del = document.createElement('button');
  del.className   = 'item-card-del';
  del.title       = 'Remover';
  del.textContent = '✕';
  del.addEventListener('click', function (e) { e.stopPropagation(); onDelete(); });

  header.appendChild(label);
  header.appendChild(del);

  const bodyWrap = document.createElement('div');
  bodyWrap.className = 'item-card-body';
  bodyWrap.appendChild(body);

  header.addEventListener('click', function () { bodyWrap.classList.toggle('open'); });

  itemCard.appendChild(header);
  itemCard.appendChild(bodyWrap);
  return itemCard;
}