'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const config=require('../assets/seo-config.js'),root=path.resolve(__dirname,'..');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const digest=file=>createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex').slice(0,12);
function generated(){
  const entries=Object.entries(config.PAGES).filter(([,p])=>p.sitemap).flatMap(([route])=>['en','es'].map(lang=>config.resolve(route+'?lang='+lang)));
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(p=>'  <url>\n    <loc>'+escape(p.canonical)+'</loc>\n'+p.alternates.map(([lang,href])=>'    <xhtml:link rel="alternate" hreflang="'+lang+'" href="'+escape(href)+'" />\n').join('')+'  </url>\n').join('')+'</urlset>\n';
  // noindex pages must remain crawlable so Google can see their meta rule.
  return new Map([['sitemap.xml',xml],['robots.txt','User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: '+config.ORIGIN+'/sitemap.xml\n']]);
}
function buildSEO(check=false){
  const updates=generated();
  for(const file of require('./build-static-release.cjs').files().filter(f=>f.endsWith('.html'))){
    const source=fs.readFileSync(path.join(root,file),'utf8'),route='/'+file.replace(/index\.html$/,''),metadata=config.resolve(route,'en');
    if(!metadata)throw Error('Missing SEO policy: '+file);
    const prefix=path.relative(path.dirname(file),'assets').split(path.sep).join('/')+'/';
    let html=source.replace(/<script\b[^>]*\bsrc="[^"]*\/seo(?:-config)?\.js[^>]*><\/script>\s*/g,'')
      .replace(/<link\b[^>]*\brel="(?:canonical|alternate)"[^>]*>\s*/g,'')
      .replace(/<meta\b[^>]*\bname="robots"[^>]*>\s*/g,'');
    // Query-based language versions share source HTML. Do not emit an English
    // canonical here and then contradict it after the Spanish render.
    html=html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/,'<title data-no-translate>'+escape(metadata.title)+'</title>');
    const description='<meta name="description" data-no-translate content="'+escape(metadata.description)+'">';
    if(/<meta\b[^>]*\bname="description"[^>]*>/.test(html))html=html.replace(/<meta\b[^>]*\bname="description"[^>]*>/,description);
    else html=html.replace('</head>',description+'\n</head>');
    const scripts=['seo-config.js','seo.js'].map(name=>'<script src="'+prefix+name+'?v='+digest('assets/'+name)+'" defer></script>').join('');
    html=html.replace(/<head\b[^>]*>/,tag=>tag+scripts);
    if(config.PAGES[metadata.pathname]?.noindex)html=html.replace('</head>','<meta name="robots" content="noindex, follow">\n</head>');
    html=html.replace(/(<meta\b[^>]*property="og:image"[^>]*content=")[^"]*/, '$1'+config.ORIGIN+'/assets/quidence-share.png');
    updates.set(file,html);
  }
  const changed=[...updates].filter(([file,text])=>!fs.existsSync(path.join(root,file))||fs.readFileSync(path.join(root,file),'utf8')!==text);
  if(check&&changed.length)throw Error('SEO files are stale. Run npm run build:seo: '+changed.map(([f])=>f).join(', '));
  if(!check)for(const [file,text]of changed)fs.writeFileSync(path.join(root,file),text);
  return{changed:changed.length,sitemapURLs:Object.values(config.PAGES).filter(p=>p.sitemap).length*2};
}
if(require.main===module)console.log(JSON.stringify(buildSEO(process.argv.includes('--check'))));
module.exports={generated,buildSEO};
