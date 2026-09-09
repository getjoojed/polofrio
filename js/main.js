(() => {
'use strict';
/* =====================================================================
   CONFIG — edite aqui: contatos, mídias, números, marcas.
   Caminhos de mídia são relativos ao index.html. Se um arquivo não
   existir, a página esconde o bloco ou usa o fallback visual.
   ===================================================================== */
const CONFIG = {
  nome: 'Ana Schmidt',
  base: 'Itajaí · SC',
  instagram: 'anaaschmiidt',
  site: 'https://anaschmidtvideomaker.com',
  whatsapp: '',                 // somente dígitos com DDI, ex: '5547999999999'
  email: '',                    // ex: 'contato@anaschmidtvideomaker.com'
  media: {
    heroVideo: 'assets/hero.mp4',        // vídeo de fundo do hero (mudo, em loop)
    heroPoster: 'assets/hero.jpg',       // imagem exibida antes/no lugar do vídeo
    retrato: 'assets/retrato.jpg',       // foto 4:5 da seção Perfil
    retratoCredito: ''                    // ex: 'Foto: @fotografa'
  },
  numeros: [
    { valor: 394, sufixo: ' mil', label: 'plays nos reels' },
    { valor: 321, sufixo: ' mil', label: 'plays no reel mais visto' },
    { valor: 1.3, sufixo: ' mil', label: 'comentários no perfil' },
    { valor: 29, sufixo: '', label: 'cidades e lugares' }
    // { valor: 0, sufixo: ' mil', label: 'seguidores' }  <- preencha quando tiver o número
  ],
  numerosNota: 'Dados públicos do perfil · 100 publicações · mai 2024 – ago 2026',
  marcas: [
    ['Intermezzo Assessoria Musical', 'Casamentos · cobertura em tempo real'],
    ['Estúdio Black 108', 'Parceria de um ano · vídeos e ensaio'],
    ['Marcia Lima Interiores', 'Projeto de interiores'],
    ['CASACOR Floripa', 'Arquitetura e design'],
    ['Dubai Bungalows Bombinhas', 'Hospedagem'],
    ['LG Moto', 'Vídeo de produto'],
    ['Riviera Business Mall', 'Cobertura de palestra'],
    ['Viva Park Porto Belo', 'Gravações']
  ]
};

/* Reels exibidos em "Em cena" (shortcode do Instagram, capa em assets/reels/<code>.jpg) */
const REELS = [
  { code: 'DPzxdXNjIW3', titulo: 'Casamento em Trancoso', loc: 'Trancoso · BA', plays: '321 mil', dur: 90 },
  { code: 'DKub-E3uWM1', titulo: 'Dubai Bungalows', loc: 'Bombinhas · SC', plays: '5,8 mil', dur: 43 },
  { code: 'DcKFLWAh-uO', titulo: 'Mergulhar no universo do cliente', loc: 'Itajaí · SC', plays: '4,9 mil', dur: 42 },
  { code: 'DZTfqLvhIhG', titulo: 'O olhar vale mais que a câmera', loc: 'Itajaí · SC', plays: '4,6 mil', dur: 68 },
  { code: 'DLOVCVEuz1O', titulo: 'Fragmentos: Renata & Felipe', loc: 'Bombinhas · SC', plays: '3,8 mil', dur: 23 },
  { code: 'DAPLIOPyJYv', titulo: 'Take cinematográfico no celular', loc: 'Itajaí · SC', plays: '2,3 mil', dur: 16 },
  { code: 'DR-MupKjv91', titulo: 'Da câmera para o palco', loc: 'Balneário Camboriú · SC', plays: '1,9 mil', dur: 38 },
  { code: 'DcuD3RbxF6P', titulo: 'LG Moto: antes e depois', loc: 'Luiz Alves · SC', plays: '1,8 mil', dur: 41 }
];

/* Galeria "Fragmentos" (arquivo em assets/, legenda, largura, altura) */
const GALERIA = [
  ['fotos/DbW3DaInIpm-00.jpg', 'Em ação · Itajaí', 1050, 1400],
  ['fotos/DAQuLc8u7K2-00.jpg', 'Interiores · Marcia Lima', 1120, 1400],
  ['fotos/DaL6W4gnBWg-01.jpg', 'Cobertura em tempo real', 1050, 1400],
  ['fotos/DPzxdXNjIW3-capa.jpg', 'Casamento em Trancoso', 788, 1400],
  ['fotos/DBXZsLsNV0K-03.jpg', 'CASACOR Floripa', 1120, 1400],
  ['fotos/DHHfbtRuO6f-02.jpg', 'Estúdio Black 108', 1120, 1400],
  ['fotos/DY8f2J-HE-n-00.jpg', 'Conexão Social Media · SP', 1050, 1400],
  ['fotos/DJnJuh4u49f-00.jpg', 'Série Fragmentos', 1080, 1350],
  ['fotos/DanjoLtB2h4.jpg', 'Viva Park · Porto Belo', 1050, 1400],
  ['fotos/DBWMzpIuElf-01.jpg', 'CASACOR · ambientes', 1120, 1400],
  ['fotos/DUMXFv1DkAC-05.jpg', 'Bastidores · setup', 1050, 1400],
  ['fotos/DbEfj39HPop-02.jpg', 'Visita técnica · pedreira', 1050, 1400],
  ['fotos/DAQwqMzuUz8-08.jpg', 'Detalhes do projeto', 1120, 1400],
  ['fotos/DZ3T-LmnIGf-03.jpg', 'Bastidores · gravação', 1050, 1400],
  ['fotos/DJPZiYNO5MM-07.jpg', 'Storymaker · evento', 1120, 1400],
  ['fotos/DbYj5qhBEqy.jpg', 'Cenário · Haras Rio do Ouro', 1050, 1400]
];

/* ===================================================================== */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad = n => String(n).padStart(2, '0');
const mmss = s => `${Math.floor(s / 60)}:${pad(s % 60)}`;
const igUrl = code => `https://www.instagram.com/p/${code}/`;

/* ---------- aplica CONFIG ---------- */
function applyConfig() {
  $$('[data-text="base"]').forEach(el => el.textContent = CONFIG.base);
  const ig = `https://www.instagram.com/${CONFIG.instagram}`;
  $$('[data-link="instagram"]').forEach(a => a.href = ig);
  $$('[data-link="site"]').forEach(a => a.href = CONFIG.site);
  $$('[data-link="whatsapp"]').forEach(a => { if (CONFIG.whatsapp) a.href = `https://wa.me/${CONFIG.whatsapp}`; else a.hidden = true; });
  $$('[data-link="email"]').forEach(a => { if (CONFIG.email) a.href = `mailto:${CONFIG.email}`; else a.hidden = true; });
  $('#year').textContent = new Date().getFullYear();

  // hero: vídeo > poster > fallback
  const media = $('#heroMedia');
  if (CONFIG.media.heroVideo && !reduced) {
    const v = document.createElement('video');
    Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'metadata' });
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    if (CONFIG.media.heroPoster) v.poster = CONFIG.media.heroPoster;
    v.src = CONFIG.media.heroVideo;
    v.addEventListener('error', () => { v.remove(); heroPoster(media); });
    v.addEventListener('canplay', () => v.play().catch(() => {}));
    v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
    if (CONFIG.media.heroPoster) heroPoster(media);
    media.appendChild(v);
  } else heroPoster(media);

  // retrato
  if (CONFIG.media.retrato) {
    const img = new Image();
    img.alt = `${CONFIG.nome}, videomaker, em ação`;
    img.onload = () => { $('#aboutPlaceholder').replaceWith(img); const c = $('#aboutCredit'); if (c && CONFIG.media.retratoCredito) { c.textContent = CONFIG.media.retratoCredito; c.hidden = false; } };
    img.src = CONFIG.media.retrato;
  }

  // números
  if (CONFIG.numeros.length) {
    const wrap = $('#stats');
    wrap.innerHTML = CONFIG.numeros.map(n => `<div class="stat"><div class="stat__val"><span data-count="${n.valor}">0</span><i>${n.sufixo}</i></div><div class="stat__label">${n.label}</div></div>`).join('');
    $('#numeros').hidden = false;
    const note = $('#statsNote'); if (note) note.textContent = CONFIG.numerosNota || '';
  }

  // marcas
  const b = $('#brands');
  if (b && CONFIG.marcas.length) b.innerHTML = CONFIG.marcas.map(([n, t], i) => `<li class="brand" data-reveal style="--d:${i * 60}ms"><span class="brand__name">${n}</span><span class="brand__tag">${t}</span></li>`).join('');
}
function heroPoster(media) {
  if (!CONFIG.media.heroPoster) return;
  const img = new Image(); img.alt = ''; img.decoding = 'async';
  img.onload = () => media.appendChild(img);
  img.src = CONFIG.media.heroPoster;
}

/* ---------- reels ---------- */
function renderReels() {
  const track = $('#reels'); if (!track) return;
  track.innerHTML = REELS.map((r, i) => `
    <article class="reel" data-reveal style="--d:${(i % 4) * 70}ms">
      <div class="reel__screen" data-cursor="play" data-code="${r.code}" role="button" tabindex="0" aria-label="Assistir: ${r.titulo}">
        <img src="assets/reels/${r.code}.jpg" alt="${r.titulo}" loading="lazy" decoding="async" width="640" height="1136">
        <div class="reel__shade"></div>
        <span class="reel__badge">${r.plays} plays</span>
        <span class="reel__badge reel__badge--r">${mmss(r.dur)}</span>
        <span class="reel__play" aria-hidden="true"></span>
        <p class="reel__cap">${r.titulo}</p>
      </div>
      <div class="reel__meta"><span>${r.loc || 'Reel'}</span><a href="${igUrl(r.code)}" target="_blank" rel="noopener">Instagram</a></div>
    </article>`).join('');
  const open = screen => {
    if (screen.dataset.open) return;
    screen.dataset.open = '1';
    const f = document.createElement('iframe');
    f.src = `https://www.instagram.com/p/${screen.dataset.code}/embed/`;
    f.title = screen.getAttribute('aria-label');
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.loading = 'eager';
    screen.appendChild(f);
  };
  track.addEventListener('click', e => { const s = e.target.closest('.reel__screen'); if (s) open(s); });
  track.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('reel__screen')) { e.preventDefault(); open(e.target); } });
}

/* ---------- galeria ---------- */
let galCols = 0;
function renderGallery() {
  const gal = $('#gallery'); if (!gal) return;
  const cols = innerWidth >= 1280 ? 4 : innerWidth >= 768 ? 3 : 2;
  if (cols === galCols) return; galCols = cols;
  const speeds = [-70, 50, -35, 30];
  gal.innerHTML = Array.from({ length: cols }, (_, c) => `<div class="gal__col" style="--speed:${speeds[c]}px"></div>`).join('');
  const colEls = $$('.gal__col', gal);
  GALERIA.forEach(([file, cap, w, h], i) => {
    const fig = document.createElement('figure');
    fig.className = 'gal__item'; fig.dataset.reveal = ''; fig.style.setProperty('--d', `${(i % cols) * 80}ms`);
    fig.innerHTML = `<img src="assets/${file}" alt="${cap}" loading="lazy" decoding="async" width="${w}" height="${h}"><figcaption>${cap}</figcaption>`;
    const img = $('img', fig);
    img.onload = () => img.classList.add('loaded');
    img.onerror = () => fig.remove();
    colEls[i % cols].appendChild(fig);
  });
  observeReveals();
}

/* ---------- split do título ---------- */
function splitTitle() {
  let i = 0;
  $$('[data-split]').forEach(line => {
    const italic = line.hasAttribute('data-italic');
    line.innerHTML = Array.from(line.dataset.split).map(ch => `<span class="c" style="--i:${i++}">${italic ? `<i>${ch}</i>` : ch}</span>`).join('');
  });
}

/* ---------- loader ---------- */
let loaderStarted = false;
function runLoader() {
  if (loaderStarted) return; loaderStarted = true;
  const loader = $('#loader'), count = $('#loaderCount'), tc = $('#loaderTc');
  const finish = () => {
    loader.classList.add('is-done');
    document.body.classList.add('is-ready');
    $('#nav').classList.add('is-in');
    setTimeout(() => loader.remove(), 1300);
  };
  if (reduced) return finish();
  const t0 = performance.now(), dur = 1500;
  const tick = now => {
    const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 4);
    count.textContent = pad(Math.round(e * 100));
    const f = Math.round(e * 24 * 2.5);
    tc.textContent = `TC 00:00:${pad(Math.floor(f / 24))}:${pad(f % 24)}`;
    if (p < 1) requestAnimationFrame(tick); else setTimeout(finish, 200);
  };
  requestAnimationFrame(tick);
}

/* ---------- timecode do hero ---------- */
function heroTimecode() {
  const el = $('#heroTc'), hero = $('#hero');
  if (!el || reduced) return;
  let visible = true, start = performance.now(), last = -1;
  new IntersectionObserver(([e]) => visible = e.isIntersecting, { threshold: 0 }).observe(hero);
  const loop = now => {
    if (visible) {
      const f = Math.floor((now - start) / 1000 * 24);
      if (f !== last) { last = f; const s = Math.floor(f / 24); el.textContent = `TC ${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`; }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* ---------- reveal ---------- */
let revealIO;
function observeReveals() {
  if (!revealIO) {
    revealIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        revealIO.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  }
  $$('[data-reveal]:not(.in)').forEach(el => revealIO.observe(el));
}
function countUp(el) {
  if (el.dataset.done) return; el.dataset.done = '1';
  const target = parseFloat(el.dataset.count), dec = (String(el.dataset.count).split('.')[1] || '').length;
  if (reduced || isNaN(target)) { el.textContent = String(target).replace('.', ','); return; }
  const t0 = performance.now(), dur = 1600;
  const tick = now => {
    const p = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * e).toFixed(dec).replace('.', ',');
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- scroll: parallax, manifesto, timeline, galeria ---------- */
function setupScroll() {
  const heroMedia = $('#heroMedia'), hero = $('#hero');
  const man = $('#manifesto');
  if (man) {
    const words = man.innerHTML.trim().split(/\s+/);
    man.innerHTML = words.map((w, i) => `<span class="w${/^<em>/.test(w) ? ' em' : ''}" style="--i:${i}">${w.replace(/<\/?em>/g, '')}</span>`).join(' ');
    man.style.setProperty('--n', words.length);
  }
  const tl = $('#timeline'), steps = $$('.step', tl || document);
  const gal = $('#gallery');
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    if (heroMedia && y < hero.offsetHeight) heroMedia.style.transform = `translate3d(0,${y * 0.22}px,0)`;
    if (man) {
      const r = man.getBoundingClientRect();
      man.style.setProperty('--p', clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1).toFixed(3));
    }
    if (tl) {
      const r = tl.getBoundingClientRect();
      tl.style.setProperty('--p', clamp((vh * 0.7 - r.top) / r.height, 0, 1).toFixed(3));
      steps.forEach(s => s.classList.toggle('lit', s.getBoundingClientRect().top < vh * 0.7));
    }
    if (gal) {
      const r = gal.getBoundingClientRect();
      gal.style.setProperty('--p', clamp(((r.top + r.height / 2) - vh / 2) / (vh + r.height) * 2, -1, 1).toFixed(3));
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  if (!reduced) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); }
  update();
}

/* ---------- nav / menu ---------- */
function setupMenu() {
  const btn = $('#menuBtn'), menu = $('#menu'), label = $('#menuLabel');
  const set = open => {
    btn.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    label.textContent = open ? 'Fechar' : 'Menu';
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  $$('.menu__link', menu).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}

/* ---------- acordeão de serviços ---------- */
function setupServices() {
  const items = $$('.svc');
  items.forEach(item => {
    $('.svc__btn', item).addEventListener('click', () => {
      const open = !item.classList.contains('is-open');
      items.forEach(i => { i.classList.remove('is-open'); $('.svc__btn', i).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('is-open'); $('.svc__btn', item).setAttribute('aria-expanded', 'true'); }
    });
  });
}

/* ---------- trilhos horizontais (desktop: roda do mouse e arrastar) ---------- */
function setupTracks() {
  $$('.formats__track, .reels').forEach(track => {
    if (!fine) return;
    track.addEventListener('wheel', e => {
      if (getComputedStyle(track).overflowX !== 'auto') return;
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      const going = e.deltaY > 0 ? track.scrollLeft < max - 1 : track.scrollLeft > 1;
      if (going) { e.preventDefault(); track.scrollLeft += e.deltaY; }
    }, { passive: false });
    let down = false, sx = 0, sl = 0;
    track.addEventListener('pointerdown', e => { down = true; sx = e.clientX; sl = track.scrollLeft; });
    addEventListener('pointermove', e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
    addEventListener('pointerup', () => down = false);
  });
}

/* ---------- cursor + magnetismo (desktop) ---------- */
function setupCursor() {
  const cur = $('.cursor'); if (!cur || !fine || reduced) return;
  cur.classList.add('is-hidden');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, moved = false;
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; if (!moved) { moved = true; cx = x; cy = y; cur.classList.remove('is-hidden'); } });
  document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => moved && cur.classList.remove('is-hidden'));
  const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
  loop();
  addEventListener('pointerover', e => {
    cur.classList.toggle('is-play', !!e.target.closest('[data-cursor="play"]'));
    cur.classList.toggle('is-link', !!e.target.closest('a,button,[role="button"]') && !e.target.closest('[data-cursor="play"]'));
  });
  $$('[data-magnet]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'; el.style.transform = ''; setTimeout(() => el.style.transition = '', 600); });
  });
}

/* ---------- marquee ---------- */
function setupMarquee() { const t = $('#marqueeTrack'); if (t) t.innerHTML += t.innerHTML; }

/* ---------- init ---------- */
splitTitle(); applyConfig(); renderReels(); renderGallery(); setupMarquee(); setupMenu(); setupServices(); setupTracks(); setupCursor(); setupScroll(); heroTimecode(); observeReveals();
addEventListener('resize', () => { renderGallery(); });
const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([ready, new Promise(r => setTimeout(r, 2200))]).then(() => { if (document.readyState === 'complete') runLoader(); else addEventListener('load', runLoader, { once: true }); });
setTimeout(runLoader, 3500);
})();
