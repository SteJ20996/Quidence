'use strict';
// Original, synthetic mathematical illustrations. No student data or copied artwork.
module.exports = function advancedCovers({svg,text,line,dot,vector,colors}) {
  let p=text(12,21,'Eigenvectors &amp; transformations',colors.linear);
  for(const d of [-52,-26,0,26,52]) p+=line(28,92+d,144,92+d,'#e2e8ef')+line(86+d,36,86+d,148,'#e2e8ef');
  p+=line(26,92,150,92)+line(86,148,86,32);
  // A=[[1.5,.5],[.5,1.5]]. Equal axis scales; apply A to each unit-circle point.
  const points=Array.from({length:121},(_,k)=>{const t=2*Math.PI*k/120,x=Math.cos(t),y=Math.sin(t);return`${(86+26*(1.5*x+.5*y)).toFixed(3)},${(92-26*(.5*x+1.5*y)).toFixed(3)}`;});
  p+=`<polygon points="${points.join(' ')}" fill="#e2f3ed" fill-opacity=".65" stroke="${colors.linear}" stroke-width="2.4"/>`;
  p+='<circle cx="86" cy="92" r="26" fill="none" stroke="#7e8da0" stroke-width="1.5" stroke-dasharray="4 3"/>';
  const r=26/Math.sqrt(2);
  p+=vector(86,92,2*r,-2*r,colors.linear)+vector(86,92,r,r,colors.curve);
  // The arrows are the transformed unit vectors Au and Av, not the input u and v.
  p+=text(132,48,'Au',colors.linear)+text(112,127,'Av',colors.curve)+text(151,102,'x')+text(76,39,'y');
  p+=text(178,63,'A =');
  for(const [x,y,value] of [[238,55,'1.5'],[286,55,'0.5'],[238,78,'0.5'],[286,78,'1.5']])p+=text(x,y,value,colors.ink,'middle');
  p+='<path d="M223 36H218V84H223M303 36H308V84H303" stroke="#354961" stroke-width="1.5" fill="none"/>';
  p+=text(185,111,'Au = 2u',colors.linear)+text(185,138,'Av = v',colors.curve);
  const ab01=svg('linear','Eigenvectors of a linear transformation','The matrix A=[1.5,0.5;0.5,1.5] transforms the dashed unit circle into an ellipse. For unit vectors u=(1,1)/sqrt(2) and v=(1,-1)/sqrt(2), the arrows show Au=2u and Av=v. The x and y axes use the same scale.',p);
  // Residuals are orthogonal to both 1 and x: the displayed line is the exact OLS fit.
  const residuals=[.7,-.9,.3,.8,-.6,-.2,-.5,.4].map((e,i)=>e+(i+1-4.5)/28),X=x=>32+20*x,Y=y=>137-12*y;
  p=text(12,21,'Regression &amp; residuals',colors.statistics);
  for(const y of [2,4,6,8])p+=line(32,Y(y),204,Y(y),'#e2e8ef');
  p+=line(32,137,205,137)+line(32,137,32,35)+line(X(0),Y(2),X(8.5),Y(7.1),colors.statistics,2.7);
  residuals.forEach((e,i)=>{const x=i+1,y=2+.6*x+e;p+=line(X(x),Y(y),X(x),Y(2+.6*x),'#a84324',1.7)+dot(X(x),Y(y),colors.statistics,3.2);});
  p+=text(27,39,'y',colors.ink,'end')+text(206,151,'x')+text(50,57,'ŷ = 2 + 0.6x',colors.statistics);
  for(const x of [2,4,8])p+=line(X(x),137,X(x),141)+text(X(x),157,x,colors.ink,'middle');
  for(const y of [2,6])p+=text(26,Y(y)+5,y,colors.ink,'end');
  p+=text(226,45,'Residuals','#a84324')+line(229,54,229,126)+line(229,90,310,90);
  residuals.forEach((e,i)=>{const x=239+i*9,y=90-34*e;p+=line(x,90,x,y,'#a84324',1.4)+dot(x,y,'#a84324',2.7);});
  p+=text(224,96,'0',colors.ink,'end')+text(297,143,'x');
  const ae01=svg('statistics','Least-squares regression and residuals','Eight synthetic observations have exact least-squares line y-hat=2+0.6x. Orange vertical segments show residuals e=y-y-hat, also plotted about zero on the right. Residuals vary in sign and magnitude, and both panels use the same x order. No confidence interval or real-world dataset is implied.',p);
  return {ab01,ae01};
};
