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
    es: {label:'Apariencia', names:['Clásica','Paper Explorer','Learning Atlas','Geometric Studio'], titles:['Clásica · diseño original','Ilustrada · papel cálido y formas suaves','Ilustrada · atlas y tipografía editorial','Ilustrada · estudio geométrico y formas definidas'], saved:'Se recuerda en este navegador', unavailable:'Solo en esta visita: el navegador no permite guardar', change:'Cambiar apariencia'}
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
    const text = COPY[root.QuidenceI18n?.locale === 'es' ? 'es' : 'en'];
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
    updateLogos();
    if(root.document?.dispatchEvent&&root.CustomEvent)root.document.dispatchEvent(new root.CustomEvent('quidence:theme',{detail:{theme:value,illustrated:value!=='classic'}}));
    return true;
  }
  function updateLogos() {
    const luminance = rgb => rgb.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum,v,i) => sum + v * [.2126,.7152,.0722][i],0);
    const contrast = (a,b) => (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
    for (const logo of root.document?.querySelectorAll?.('.q-brand-logo[data-logo-light-src][data-logo-dark-src]') || []) {
      let surface = logo.parentElement, background = [255,255,255];
      while (surface) {
        const rgba = root.getComputedStyle(surface).backgroundColor.match(/[\d.]+/g)?.map(Number);
        if (rgba?.length >= 3 && (rgba.length === 3 || rgba[3] === 1)) { background = rgba.slice(0,3); break; }
        surface = surface.parentElement;
      }
      const bg = luminance(background), white = luminance([246,247,249]), ink = luminance([20,34,54]);
      const source = contrast(bg,white) > contrast(bg,ink) ? logo.dataset.logoDarkSrc : logo.dataset.logoLightSrc;
      if (logo.getAttribute('src') !== source) logo.setAttribute('src',source);
    }
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
    root.document.addEventListener('quidence:language',render);
    root.addEventListener('storage', event => { if (event.key === KEY || event.key === null) apply(read()); });
    root.addEventListener('pageshow', event => { if (event.persisted) apply(read()); });
  }
  if (root.document) { apply(read()); if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount(); }
  return Object.freeze({KEY,DEFAULT,THEMES,valid,apply,reportAppearance,get current(){return current;}});
});
