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
    atlas: {page:'#f7f4ee', paper:'#fffefb', ink:'#203b40', muted:'#58636d', line:'#d4d1db', control:'#79858c', primary:'#235761', soft:'#e1ece7', mist:'#eeebf5', accent:'#925034', radius:'6px', shadow:'0 5px 20px #203b4009', heading:'Georgia, "Times New Roman", serif'},
    studio: {page:'#fffcf5', paper:'#ffffff', ink:'#173f42', muted:'#53666a', line:'#c8d7d5', control:'#708889', primary:'#205b5d', soft:'#cce8df', mist:'#e8e1f4', accent:'#ac4938', radius:'24px', shadow:'none', heading:'system-ui, sans-serif'}
  });
  const COPY = {
    en: {label:'Appearance', names:['Classic','Paper Explorer','Learning Atlas','Geometric Studio'], titles:['Classic · original layout','Illustrated · warm paper and soft shapes','Illustrated · learning atlas and editorial type','Illustrated · geometric studio and bold shapes'], saved:'Remembered in this browser', unavailable:'For this visit only — browser saving is unavailable'},
    es: {label:'Apariencia', names:['Clásica','Paper Explorer','Learning Atlas','Geometric Studio'], titles:['Clásica · diseño original','Ilustrada · papel cálido y formas suaves','Ilustrada · atlas y tipografía editorial','Ilustrada · estudio geométrico y formas definidas'], saved:'Se recuerda en este navegador', unavailable:'Solo en esta visita: el navegador no permite guardar'}
  };
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
  }
  function apply(value, save = false) {
    if (!valid(value)) return false;
    current = value;
    root.document?.documentElement.setAttribute('data-ui-theme', value);
    root.document?.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEMES[value].page);
    if (save) { try { root.localStorage.setItem(KEY, value); persistent = true; } catch { persistent = false; } }
    render();
    if(root.document?.dispatchEvent&&root.CustomEvent)root.document.dispatchEvent(new root.CustomEvent('quidence:theme',{detail:{theme:value,illustrated:value!=='classic'}}));
    return true;
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
    const group = root.document.createElement('div'); group.className = 'q-theme-choices'; group.setAttribute('role','group'); bar.append(group);
    for (const name of Object.keys(THEMES)) {
      const button = root.document.createElement('button'); button.type = 'button'; button.dataset.themeChoice = name;
      const swatch = root.document.createElement('span'); swatch.className = 'q-theme-swatch'; swatch.setAttribute('aria-hidden','true');
      const title = root.document.createElement('span'); title.className = 'q-theme-name';
      button.append(swatch,title); button.addEventListener('click', () => apply(name,true)); group.append(button);
    }
    const note = root.document.createElement('span'); note.className = 'q-theme-note'; note.setAttribute('role','status'); bar.append(note);
    root.document.body.prepend(bar); apply(current);
    root.document.addEventListener('quidence:language',render);
    root.addEventListener('storage', event => { if (event.key === KEY || event.key === null) apply(read()); });
    root.addEventListener('pageshow', event => { if (event.persisted) apply(read()); });
  }
  if (root.document) { apply(read()); if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount(); }
  return Object.freeze({KEY,DEFAULT,THEMES,valid,apply,reportAppearance,get current(){return current;}});
});
