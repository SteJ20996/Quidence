(function(root){
  'use strict';
  // Calculations behind the Discrete Mathematics labs. Answer checking uses NTCore from the Number Theory course.
  const EXAMS=['A','B','C','D','E','F'],CLASHES=[['A','B'],['B','C'],['C','D'],['D','E'],['E','A'],['F','A'],['F','C']];
  function clashes(slots){return CLASHES.filter(([a,b])=>slots[a]&&slots[a]===slots[b]);}
  function pathCounts(width,height,closed){
    const grid=Array.from({length:width+1},()=>Array(height+1).fill(0));
    for(let x=0;x<=width;x++)for(let y=0;y<=height;y++){
      if(closed&&closed[0]===x&&closed[1]===y){grid[x][y]=0;continue;}
      grid[x][y]=x===0&&y===0?1:(x>0?grid[x-1][y]:0)+(y>0?grid[x][y-1]:0);
    }
    return grid;
  }
  function hanoiStart(n){return [Array.from({length:n},(_,i)=>n-i),[],[]];}
  function hanoiMove(pegs,from,to){
    if(from===to||!pegs[from].length)return null;const disc=pegs[from][pegs[from].length-1],top=pegs[to][pegs[to].length-1];
    if(top!==undefined&&top<disc)return null;const next=pegs.map(p=>p.slice());next[from].pop();next[to].push(disc);return next;
  }
  // Covers a 2ⁿ × 2ⁿ board missing one square with L-trominoes, by the quadrant split used in the proof.
  function tromino(n,missing){
    const size=2**n,grid=Array.from({length:size},()=>Array(size).fill(0));let id=0;
    grid[missing[0]][missing[1]]=-1;
    function tile(top,left,s,hole){
      if(s===1)return;const half=s/2,piece=++id,cr=top+half,cc=left+half;
      const quads=[[top,left],[top,cc],[cr,left],[cr,cc]],centre=[[cr-1,cc-1],[cr-1,cc],[cr,cc-1],[cr,cc]];
      // The central tromino takes the centre corner of every quadrant that does not hold the hole.
      const holes=quads.map(([r,c],i)=>{const inside=hole[0]>=r&&hole[0]<r+half&&hole[1]>=c&&hole[1]<c+half;if(!inside)grid[centre[i][0]][centre[i][1]]=piece;return inside?hole:centre[i];});
      quads.forEach(([r,c],i)=>tile(r,c,half,holes[i]));
    }
    tile(0,0,size,missing);
    return {grid,count:id};
  }
  // Every covering of a 2 × n strip, written left to right: V is one vertical domino, H is a stacked horizontal pair.
  function stripTilings(n){if(n===0)return [''];if(n<0)return [];return [...stripTilings(n-1).map(t=>'V'+t),...stripTilings(n-2).map(t=>'H'+t)];}
  function permutations(n){const out=[];(function go(prefix,rest){if(!rest.length){out.push(prefix);return;}rest.forEach((x,i)=>go([...prefix,x],[...rest.slice(0,i),...rest.slice(i+1)]));})([],Array.from({length:n},(_,i)=>i+1));return out;}
  function derangement(p){return p.every((x,i)=>x!==i+1);}
  const CABLES=[['A','B',4],['A','C',3],['B','C',2],['B','D',5],['C','D',7],['C','E',8],['D','E',6],['D','F',9],['E','F',1]];
  function kruskal(cables){
    const parent={};const find=x=>{while(parent[x]!==undefined&&parent[x]!==x)x=parent[x];return x;};
    for(const [a,b] of cables){parent[a]??=a;parent[b]??=b;}
    let total=0;return cables.slice().sort((x,y)=>x[2]-y[2]).map(([a,b,w])=>{const ra=find(a),rb=find(b),accepted=ra!==rb;if(accepted){parent[ra]=rb;total+=w;}return {a,b,w,accepted,total};});
  }
  const BRIDGES=[['A','B'],['A','B'],['A','C'],['A','C'],['A','D'],['B','D'],['C','D']];
  function degrees(extra){const d={A:0,B:0,C:0,D:0};for(const [a,b] of [...BRIDGES,...extra]){d[a]++;d[b]++;}return d;}
  const api={EXAMS,CLASHES,clashes,pathCounts,hanoiStart,hanoiMove,tromino,stripTilings,permutations,derangement,CABLES,kruskal,BRIDGES,degrees};root.DMCore=api;
  if(typeof module==='object'&&module.exports)module.exports=api;
})(globalThis);
