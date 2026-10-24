(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.IntuitionAnswer=api;})(typeof window==='undefined'?globalThis:window,()=>{'use strict';
function parse(raw){const s=String(raw).trim().replace(/−/g,'-');if(!/^[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[-+]?\d+)?$/i.test(s))return null;const value=Number(s.replace(',','.'));return Number.isFinite(value)?value:null;}
return {parse};});
