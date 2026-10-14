(function(root){'use strict';
const pictures={
 abacus:'<path d="M10 6v34m38-34v34M10 13h38M10 24h38M10 35h38"/><path d="M17 9v8m7-8v8m10 3v8m7-8v8m-22 3v8" stroke="var(--coral)" stroke-width="6"/>',
 fraction:'<circle cx="25" cy="24" r="18" fill="var(--yellow)"/><path d="M25 6v18h18"/><path d="M25 24 12 37"/>',
 numberline:'<path d="M3 25h52m-40-5v10m13-10v10m13-10v10m-37-8-3 3 3 3m49-6 3 3-3 3"/><circle cx="15" cy="25" r="5" fill="var(--lilac)"/><circle cx="41" cy="25" r="5" fill="var(--mint)"/>',
 calculator:'<rect x="14" y="4" width="31" height="39" rx="6" fill="var(--mint)"/><path d="M20 12h19M21 23h5m-2-2v5m9-3h5M21 32h5m7-2 5 5m0-5-5 5"/>',
 balance:'<path d="M30 6v34M17 42h26M6 13l46-6M13 12v16m31-19v19"/><path d="M4 28h18a9 9 0 0 1-18 0Z" fill="var(--coral)"/><path d="M35 28h18a9 9 0 0 1-18 0Z" fill="var(--mint)"/>',
 parabola:'<path d="M4 33h49M27 44V3m-3 4 3-4 3 4m19 23 4 3-4 3"/><path d="M8 6Q27 66 47 6" stroke="var(--coral)" stroke-width="3"/>',
 shapes:'<circle cx="37" cy="17" r="12" fill="var(--coral)"/><path d="m6 18 18-7 14 9-18 7Z" fill="var(--lilac)"/><path d="M6 18v20l14 8V27m0 19 18-8V20" fill="var(--lilac)"/>',
 triangle:'<path d="M8 40 28 5l25 35Z" fill="var(--mint)"/><path d="M28 5v35M28 33h7v7"/><circle cx="28" cy="5" r="2" fill="var(--ink)"/>',
 axes:'<path d="M5 38h49M15 44V5m-3 4 3-4 3 4m32 26 4 3-4 3"/><path d="m18 33 11-13 17-9" stroke="var(--coral)" stroke-width="3"/><circle cx="29" cy="20" r="3" fill="var(--coral)"/>',
 bars:'<path d="M7 7v35h48"/><path d="M14 41V29h8v12" fill="var(--mint)"/><path d="M26 41V12h8v29" fill="var(--coral)"/><path d="M38 41V21h8v20" fill="var(--lilac)"/>',
 book:'<path d="M29 11Q16 3 6 8v33q12-5 23 2 11-7 23-2V8q-10-5-23 3Z" fill="var(--yellow)"/><path d="M29 11v32M12 16l11 3m-11 5 11 3m12-8 10-3m-10 11 10-3"/>',
 wave:'<path d="M3 25h52" opacity=".5"/><path d="M3 25C12-2 18-2 27 25S44 52 54 25" stroke="var(--coral)" stroke-width="3"/>',
 vectors:'<path d="M5 39h48M11 44V5" opacity=".5"/><path d="m11 39 31-28m-7 0h7v7" stroke="var(--coral)" stroke-width="3"/><path d="m11 39 36-10m-6-3 6 3-4 5" stroke="var(--path)" stroke-width="3"/>',
 proof:'<rect x="13" y="4" width="33" height="40" rx="4" fill="var(--lilac)"/><path d="M20 12h19M20 19h12m-11 13 5 5 13-12"/>',
 dice:'<rect x="11" y="5" width="37" height="37" rx="8" fill="var(--yellow)"/><g fill="var(--ink)" stroke="none"><circle cx="21" cy="15" r="2.5"/><circle cx="38" cy="15" r="2.5"/><circle cx="29.5" cy="23.5" r="2.5"/><circle cx="21" cy="32" r="2.5"/><circle cx="38" cy="32" r="2.5"/></g>',
 integral:'<path d="M12 39V32Q25 9 48 7V39Z" fill="var(--mint)" stroke="none"/><path d="M6 40h47M12 45V5"/><path d="M12 32Q25 9 48 7" stroke="var(--coral)" stroke-width="3"/>',
 game:'<rect x="9" y="4" width="42" height="40" rx="3"/><path d="M30 4v40M9 24h42"/><circle cx="20" cy="14" r="5" fill="var(--coral)"/><path d="m36 38 5-10 5 10Z" fill="var(--mint)"/>',
 dots:'<g fill="var(--coral)"><circle cx="12" cy="13" r="5"/><circle cx="28" cy="13" r="5"/><circle cx="44" cy="13" r="5"/></g><g fill="var(--mint)"><circle cx="12" cy="31" r="5"/><circle cx="28" cy="31" r="5"/><circle cx="44" cy="31" r="5"/></g>',
 surface:'<path d="M6 31Q19 5 31 21T54 16v14Q42 44 30 28T6 43Z" fill="var(--lilac)"/><path d="M17 15v20m13-14v7m12-7v14" opacity=".6"/>',
 pendulum:'<path d="M8 6h45M30 6v28M30 6 11 29m19-23 19 23"/><path d="M11 29q19 22 38 0" stroke-dasharray="3 4" opacity=".4"/><circle cx="11" cy="29" r="6" fill="var(--lilac)"/><circle cx="30" cy="34" r="6" fill="var(--coral)"/><circle cx="49" cy="29" r="6" fill="var(--mint)"/>',
 circuit:'<path d="M8 17V9h17m11 0h15v29H8V28m17-24v10m6-13v16m0-8h5M3 20h10m-7 5h4"/><path d="m22 38 3-5 4 10 4-10 4 10 3-5" fill="none"/>',
 orbit:'<circle cx="30" cy="24" r="7" fill="var(--coral)"/><ellipse cx="30" cy="24" rx="25" ry="10" transform="rotate(-25 30 24)"/><ellipse cx="30" cy="24" rx="25" ry="10" transform="rotate(45 30 24)"/><circle cx="50" cy="10" r="4" fill="var(--mint)"/>'
};
function icon(name){return `<svg viewBox="0 0 60 48" aria-hidden="true" fill="none" stroke="var(--ink)" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${pictures[name]||pictures.shapes}</svg>`}

const api={icon};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceCartoonArt=api;})(typeof window==='undefined'?globalThis:window);
