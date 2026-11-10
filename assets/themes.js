/* Load synchronously in the head: restore appearance before styles are painted. */
(function(root, factory) {
  const api = factory(root);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuidenceThemes = api;
})(typeof window === 'object' ? window : globalThis, function(root) {
  'use strict';
  const KEY = 'quidence_ui_theme_v1', DEFAULT = 'studio';
  const THEMES = Object.freeze({
    classic: {page:'#f8f5ec',paper:'#ffffff',ink:'#20383e',muted:'#53666b',line:'#ddd7e6',control:'#6e8588',primary:'#15565b',soft:'#ddf1e8',mist:'#eee9f5',accent:'#b94f3d',radius:'12px',shadow:'none',heading:'system-ui, sans-serif'},
    paper: {page:'#fff9ec', paper:'#fffdf6', ink:'#23463e', muted:'#52665a', line:'#dacdac', control:'#78927b', primary:'#285647', soft:'#e1eacf', mist:'#f4e7be', accent:'#b14d36', radius:'13px', shadow:'0 4px 9px #9e804919', heading:'"Quidence Nunito", ui-rounded, "Trebuchet MS", system-ui, sans-serif'},
    atlas: {page:'#f7f4ee', paper:'#fffefb', ink:'#153e4d', muted:'#526572', line:'#b7c1bf', control:'#7b9197', primary:'#194f5a', soft:'#e7eeea', mist:'#eeecf2', accent:'#925034', radius:'5px', shadow:'none', heading:'"Quidence Atlas Serif", Georgia, "Times New Roman", serif'},
    studio: {page:'#fffcf5', paper:'#ffffff', ink:'#173f42', muted:'#53666a', line:'#c8d7d5', control:'#708889', primary:'#205b5d', soft:'#cce8df', mist:'#e8e1f4', accent:'#ac4938', radius:'24px', shadow:'none', heading:'system-ui, sans-serif'}
  });
  const COPY = {
    en: {label:'Appearance', names:['Classic','Paper Explorer','Learning Atlas','Geometric Studio'], titles:['Classic · original layout','Illustrated · warm paper and soft shapes','Illustrated · learning atlas and editorial type','Illustrated · geometric studio and bold shapes'], saved:'Remembered in this browser', unavailable:'For this visit only — browser saving is unavailable', change:'Change appearance'},
  };
  // A small preview of each appearance: its page colour, card corners, type and signature shapes.
  const PREVIEWS = {
    classic:'<rect width="44" height="32" fill="#f8f5ec"/><rect x="5" y="5" width="34" height="22" rx="3" fill="#fff" stroke="#ddd7e6"/><rect x="5" y="5" width="34" height="6" rx="3" fill="#eee9f5"/><rect x="5" y="9" width="34" height="2" fill="#eee9f5"/><rect x="9" y="14" width="18" height="2.4" rx="1.2" fill="#20383e"/><rect x="9" y="19" width="14" height="4" rx="2" fill="#15565b"/>',
    paper:'<rect width="44" height="32" fill="#fff9ec"/><path d="M6 6h26l6 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z" fill="#fffdf6" stroke="#dacdac"/><path d="M32 6v6h6z" fill="#f4e7be" stroke="#dacdac" stroke-linejoin="round"/><circle cx="14" cy="17" r="4" fill="#88a178"/><path d="M21 15.5c3-2 5 2 8 0M21 20c3-2 5 2 8 0" stroke="#b14d36" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    atlas:'<rect width="44" height="32" fill="#f7f4ee"/><path d="M0 9h44M0 18h44M0 27h44M11 0v32M22 0v32M33 0v32" stroke="#b7c1bf" stroke-width=".8"/><circle cx="33" cy="9" r="5.5" fill="none" stroke="#925034" stroke-width="1.2"/><text x="6" y="25" font-family="Georgia,serif" font-size="15" font-style="italic" fill="#194f5a">Aa</text>',
    studio:'<rect width="44" height="32" fill="#fffcf5"/><circle cx="12" cy="13" r="8" fill="#e9a391"/><path d="M22 28V14a14 14 0 0 1 14 14z" fill="#bbddd2"/><path d="M28 4l10 14H18z" fill="#e8e1f4" stroke="#9386b8" stroke-width=".8" stroke-linejoin="round"/>'
  };
  const preview = name => '<svg viewBox="0 0 44 32" width="40" height="29" focusable="false" aria-hidden="true">' + PREVIEWS[name] + '</svg>';
  const CHECK = '<svg viewBox="0 0 16 16" width="10" height="10" focusable="false" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHEVRON = '<svg viewBox="0 0 12 8" width="12" height="8" focusable="false" aria-hidden="true"><path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const valid = value => Object.hasOwn(THEMES, value);
  let current = DEFAULT, persistent = true, bar;
  function read() { try { const value = root.localStorage.getItem(KEY); persistent = true; return valid(value) ? value : DEFAULT; } catch { persistent = false; return DEFAULT; } }
  function render() {
    if (!bar) return;
    const text = COPY.en;
    bar.querySelector('.q-theme-label').textContent = text.label;
    bar.querySelector('[role="group"]').setAttribute('aria-label', text.label);
    bar.querySelector('.q-theme-note').textContent = persistent ? text.saved : text.unavailable;
    [...bar.querySelectorAll('[data-theme-choice]')].forEach((button, i) => {
      button.querySelector('.q-theme-name').textContent = text.names[i];
      button.title = text.titles[i];
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === current));
    });
    // Phones show one button with the current appearance; it opens the same choices.
    const toggle = bar.querySelector('.q-theme-toggle'), name = text.names[Object.keys(THEMES).indexOf(current)];
    toggle.querySelector('.q-theme-thumb').innerHTML = preview(current);
    toggle.querySelector('.q-theme-current').textContent = name;
    toggle.setAttribute('aria-label', text.label + ': ' + name + '. ' + text.change);
    toggle.setAttribute('aria-expanded', String(bar.dataset.open === 'true'));
  }
  function setOpen(open) {
    if (!bar) return;
    if (open) bar.dataset.open = 'true'; else delete bar.dataset.open;
    bar.querySelector('.q-theme-toggle').setAttribute('aria-expanded', String(open));
  }
  const collapsed = () => !!bar && root.getComputedStyle(bar.querySelector('.q-theme-toggle')).display !== 'none';
  function apply(value, save = false) {
    if (!valid(value)) return false;
    current = value;
    root.document?.documentElement.setAttribute('data-ui-theme', value);
    root.document?.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[value].page);
    if (save) { try { root.localStorage.setItem(KEY, value); persistent = true; } catch { persistent = false; } }
    render();
    if (root.document?.readyState === 'loading') queueLogos(); else updateLogos();
    if(root.document?.dispatchEvent&&root.CustomEvent)root.document.dispatchEvent(new root.CustomEvent('quidence:theme',{detail:{theme:value,illustrated:value!=='classic'}}));
    return true;
  }
  // Each logo has a light and a dark version; the one that contrasts with the header behind it is shown. Until a
  // logo's version is settled it is hidden by themes.css, so it never appears in the wrong color, and it is marked
  // data-logo-ready once the right image has loaded.
  const LOGOS = 'img.q-brand-logo[data-logo-light-src][data-logo-dark-src]';
  function logoSource(logo) {
    const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i],0);
    const contrast = (a,b) => (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
    let surface = logo.parentElement, background = [255,255,255];
    while (surface) {
      const rgba = root.getComputedStyle(surface).backgroundColor.match(/[\d.]+/g)?.map(Number);
      if (rgba?.length >= 3 && (rgba.length === 3 || rgba[3] === 1)) { background = rgba.slice(0,3); break; }
      surface = surface.parentElement;
    }
    const bg = luminance(background), white = luminance([246,247,249]), ink = luminance([20,34,54]);
    return contrast(bg,white) > contrast(bg,ink) ? logo.dataset.logoDarkSrc : logo.dataset.logoLightSrc;
  }
  function showLogo(logo, source) {
    if (logo.getAttribute('src') === source) { logo.setAttribute('data-logo-ready',''); return; }
    // While another image loads, a browser keeps showing the old one, so the logo stays hidden until the new one is in.
    logo.removeAttribute('data-logo-ready');
    const ready = () => { if (logo.getAttribute('src') === source) logo.setAttribute('data-logo-ready',''); };
    logo.addEventListener('load', ready, {once:true}); logo.addEventListener('error', ready, {once:true});
    // Changing src cancels a request that is still loading. A detached image keeps that request alive, so it finishes
    // instead of showing up as a failed request.
    if (!logo.complete && root.Image) { const keep = new root.Image(); keep.src = logo.src; }
    logo.setAttribute('src', source);
  }
  function updateLogos() {
    for (const logo of root.document?.querySelectorAll?.(LOGOS) || []) showLogo(logo, logoSource(logo));
  }
  // A logo can be settled as soon as it is parsed, before anything is painted: every header is light in the illustrated
  // appearances, and Classic's header colors are known once the page's styles have loaded. Otherwise it waits, hidden.
  const stylesPending = () => [...root.document.querySelectorAll('link[rel="stylesheet"]')].some(link => !link.sheet && !link.disabled);
  function settleLogo(logo) {
    if (current !== 'classic') showLogo(logo, logo.dataset.logoLightSrc);
    else if (!stylesPending()) showLogo(logo, logoSource(logo));
  }
  // Only trusted theme values enter the standalone report. No assets or storage needed offline.
  function reportAppearance() {
    const t = THEMES[current];
    return {name:current, css:`@media screen{html{background:${t.page}}body{background:${t.paper};color:${t.ink};border:1px solid ${t.line};border-radius:${t.radius};padding:24px;box-shadow:${t.shadow}}h1,h2,h3{font-family:${t.heading}}.toolbar{border-color:${t.line}}.toolbar button{background:${t.primary};color:white}}@media print{html,body{background:white!important;box-shadow:none!important;border:0!important}}`};
  }
  function mount() {
    if (root.document.querySelector('.q-theme-bar')) return;
    bar = root.document.createElement('div'); bar.className = 'q-theme-bar'; bar.setAttribute('data-no-translate','');
    const label = root.document.createElement('span'); label.className = 'q-theme-label'; bar.append(label);
    const toggle = root.document.createElement('button'); toggle.type = 'button'; toggle.className = 'q-theme-toggle'; toggle.setAttribute('aria-controls','q-theme-choices');
    toggle.innerHTML = '<span class="q-theme-thumb"></span><span class="q-theme-current"></span><span class="q-theme-caret">' + CHEVRON + '</span>';
    toggle.addEventListener('click', () => setOpen(bar.dataset.open !== 'true')); bar.append(toggle);
    const group = root.document.createElement('div'); group.className = 'q-theme-choices'; group.id = 'q-theme-choices'; group.setAttribute('role','group'); bar.append(group);
    for (const name of Object.keys(THEMES)) {
      const button = root.document.createElement('button'); button.type = 'button'; button.dataset.themeChoice = name;
      button.innerHTML = '<span class="q-theme-thumb">' + preview(name) + '</span><span class="q-theme-name"></span><span class="q-theme-check">' + CHECK + '</span>';
      button.addEventListener('click', () => { const menu = collapsed(); apply(name,true); if (menu) { setOpen(false); toggle.focus(); } });
      group.append(button);
    }
    const note = root.document.createElement('span'); note.className = 'q-theme-note'; note.setAttribute('role','status'); bar.append(note);
    bar.addEventListener('keydown', event => { if (event.key === 'Escape' && bar.dataset.open === 'true') { setOpen(false); toggle.focus(); } });
    root.document.addEventListener('click', event => { if (bar.dataset.open === 'true' && !bar.contains(event.target)) setOpen(false); });
    root.document.body.prepend(bar); apply(current);
    root.addEventListener('storage', event => { if (event.key === KEY || event.key === null) apply(read()); });
    root.addEventListener('pageshow', event => { if (event.persisted) apply(read()); });
  }
  // The records banner sits above the appearance bar on pages that keep learning records. It is inserted together
  // with the bar; local-records.js only corrects its text later if browser saving turns out to be unavailable.
  function recordsBanner() {
    const document = root.document, script = document.querySelector?.('script[src*="local-records.js"]');
    if (!script || document.querySelector('aside[data-records-banner]')) return;
    let available = true; try { root.localStorage.getItem(KEY); } catch { available = false; }
    const banner = document.createElement('aside'); banner.dataset.recordsBanner = ''; banner.setAttribute('aria-label','Local record storage');
    banner.style.cssText = 'padding:12px 20px;background:#edf4f2;color:#173c34;font:14px system-ui;display:block';
    banner.append(available ? 'New learning records stay in this browser. ' : 'Browser saving is unavailable; download a report before closing an activity. ');
    const link = document.createElement('a'); link.href = new URL('records/', new URL('../', script.src)).href; link.textContent = 'Save or delete records';
    banner.append(link); document.body.prepend(banner);
  }
  // Both sit above the page, so they go in as soon as <body> exists, before anything is painted. Added later, they
  // pushed the whole page down once or twice while it loaded.
  function whenBody(run) {
    const document = root.document;
    if (document.body) return run();
    if (!root.MutationObserver) { document.addEventListener('DOMContentLoaded', run, {once:true}); return; }
    const watch = new root.MutationObserver(() => { if (document.body) { watch.disconnect(); run(); } });
    watch.observe(document.documentElement, {childList:true});
  }
  // Logos that could not be settled when parsed, and every logo after a change of appearance, are checked in the next
  // frame once the page's styles have loaded.
  let logoFrame = 0, logoWaits = 0;
  function queueLogos() {
    if (logoFrame || !root.requestAnimationFrame) return;
    logoFrame = root.requestAnimationFrame(() => {
      logoFrame = 0;
      if (stylesPending() && logoWaits++ < 120) { queueLogos(); return; }
      logoWaits = 0; updateLogos();
    });
  }
  function watchLogos() {
    if (!root.MutationObserver) return;
    const logosIn = node => node.nodeType !== 1 ? [] : node.matches(LOGOS) ? [node] : [...node.querySelectorAll(LOGOS)];
    // Classic's headers are mostly dark, so its white logo starts loading as soon as a logo is parsed. By the time the
    // color is chosen, it is usually ready, and the logo appears with the page.
    const fetched = new Set();
    const preload = () => { if (current !== 'classic' || !root.Image) return; for (const logo of root.document.querySelectorAll('img.q-brand-logo[data-logo-dark-src]')) { const src = logo.dataset.logoDarkSrc; if (!fetched.has(src)) { fetched.add(src); const image = new root.Image(); image.fetchPriority = 'high'; image.src = src; } } };
    new root.MutationObserver(records => {
      const added = records.flatMap(record => [...record.addedNodes].flatMap(logosIn));
      if (added.length) { preload(); added.forEach(settleLogo); queueLogos(); }
    })
      .observe(root.document.documentElement, {childList:true, subtree:true});
    root.addEventListener('load', queueLogos, {once:true});
  }
  if (root.document) { apply(read()); watchLogos(); whenBody(() => { mount(); recordsBanner(); }); }
  return Object.freeze({KEY,DEFAULT,THEMES,valid,apply,reportAppearance,get current(){return current;}});
});
