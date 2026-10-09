'use strict';
// Rasterize the existing supplied vector; no new artwork or font is needed.
const fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
async function run(){
 const root=path.resolve(__dirname,'..'),browser=await chromium.launch({executablePath:process.env.QUIDENCE_BROWSER_EXECUTABLE});
 try{
  const page=await browser.newPage({deviceScaleFactor:1});
  await page.setViewportSize({width:180,height:180});
  await page.setContent('<style>html,body{margin:0;background:#142236}svg{display:block;width:180px;height:180px}</style>'+fs.readFileSync(path.join(root,'assets/favicon.svg'),'utf8'));
  await page.screenshot({path:path.join(root,'assets/apple-touch-icon.png')});
  await page.setViewportSize({width:1200,height:630});
  await page.setContent('<style>html,body{margin:0;background:#142236}body{width:1200px;height:630px;display:grid;place-items:center;background:radial-gradient(ellipse at 90% 15%,#234b60 0%,#142236 60%)}svg{width:800px;height:auto}</style>'+fs.readFileSync(path.join(root,'assets/quidence-logo-dark.svg'),'utf8'));
  await page.screenshot({path:path.join(root,'assets/quidence-share.png')});
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
