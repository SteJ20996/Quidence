// Four introductory lessons for the Coordinate Geometry course page, authored in
// English, Traditional Chinese and Spanish. Each has a draggable graph and a quick check.
// Only the learner's quick-check answers are saved; graph positions last for the visit.
export const T=(en,zh,es)=>({en,'zh-TW':zh,es});
const text=(v,lang)=>typeof v==='string'?v:v?.[lang]||v?.en||'';
const fill=(s,values)=>s.replace(/\{(\w+)\}/g,(_,k)=>values[k]);
export const LESSON_UI={
 heading:T('Start with four short lessons','先上四堂短課','Empieza con cuatro lecciones breves'),
 intro:T('Each lesson has one idea, a graph you can drag and a quick check. Together they prepare both projects.','每堂課有一個重點、一張可拖動的圖和一個小測驗，為兩個專題做準備。','Cada lección tiene una idea, una gráfica que puedes arrastrar y una comprobación rápida. Juntas preparan los dos proyectos.'),
 lessons:T('Lessons','入門課','Lecciones'),overview:T('Course overview','課程總覽','Resumen del curso'),open:T('Open lesson','開始上課','Abrir lección'),lessonOf:T('Lesson {n} of 4','第 {n} 課，共 4 課','Lección {n} de 4'),
 tryIt:T('Try it','動手試試','Pruébalo'),key:T('Key idea','重點','Idea clave'),quick:T('Quick check','小測驗','Comprobación rápida'),check:T('Check my answers','檢查答案','Comprobar mis respuestas'),
 match:T('Matches the reference.','與參考答案一致。','Coincide con la referencia.'),notYet:T('Not yet. Use the graph to check your working.','還不對。用圖形檢查你的計算。','Todavía no. Usa la gráfica para revisar tu trabajo.'),
 blank:T('No answer yet.','還沒有作答。','Aún no hay respuesta.'),unreadable:T('This could not be read. Use a number such as −4, 0.5 or 1/2.','無法讀取。請輸入像 −4、0.5 或 1/2 這樣的數。','No se pudo leer. Usa un número como −4, 0.5 o 1/2.'),
 solution:T('Worked solution','解答','Solución'),checked:T('Quick check done','已完成小測驗','Comprobación hecha'),notChecked:T('Quick check not done yet','尚未完成小測驗','Comprobación pendiente'),
 previous:T('Previous lesson','上一課','Lección anterior'),next:T('Next lesson','下一課','Siguiente lección'),toProject:T('Start Project 1','開始專題 1','Empezar el proyecto 1'),
 dragHint:T('Drag the colored points, or select one with Tab and move it with the arrow keys.','拖動彩色的點，或按 Tab 選取一個點，再用方向鍵移動。','Arrastra los puntos de color, o selecciona uno con Tab y muévelo con las flechas.'),
 plane:T('Coordinate plane with points you can move','可移動點的座標平面','Plano de coordenadas con puntos que puedes mover'),point:T('Point {p} at ({x}, {y}). Arrow keys move it.','點 {p} 在 ({x}, {y})。用方向鍵移動。','Punto {p} en ({x}, {y}). Muévelo con las flechas.'),
 line:T('Line through A and B','通過 A 和 B 的直線','Recta que pasa por A y B'),circle:T('Circle with center C','圓心為 C 的圓','Circunferencia con centro C'),shape:T('Shape','圖形','Figura'),
 yes:T('Yes','是','Sí'),no:T('No','否','No'),
 quadrant:T('quadrant {q}','第{z}象限','cuadrante {q}'),axis:T('on an axis','在座標軸上','en un eje'),
 slope:T('slope','斜率','pendiente'),riseRun:T('rise / run','上升 / 前進','subida / avance'),vertical:T('none (vertical)','沒有（鉛直）','no tiene (vertical)'),
 equation:T('Equation','方程式','Ecuación'),test:T('Test','檢驗','Prueba'),radius:T('Radius r','半徑 r','Radio r'),qGives:T('Q gives','代入 Q','Con Q'),
 onLine:T('Q satisfies the equation, so it is on the line.','Q 滿足方程式，所以在直線上。','Q cumple la ecuación, así que está en la recta.'),
 offLine:T('Q does not satisfy the equation, so it is off the line.','Q 不滿足方程式，所以不在直線上。','Q no cumple la ecuación, así que no está en la recta.'),
 onCircle:T('Q is on the circle: its squared distance from C equals r².','Q 在圓上：它到 C 的距離平方等於 r²。','Q está en la circunferencia: su distancia al cuadrado desde C es igual a r².'),
 inside:T('Q is inside the circle: {q} is less than {r}.','Q 在圓內：{q} 小於 {r}。','Q está dentro de la circunferencia: {q} es menor que {r}.'),
 outside:T('Q is outside the circle: {q} is more than {r}.','Q 在圓外：{q} 大於 {r}。','Q está fuera de la circunferencia: {q} es mayor que {r}.')
};
export const LESSONS=[
 {id:'changes',points:{A:{x:-2,y:-1,tone:'a',drag:true},B:{x:3,y:3,tone:'b',drag:true}},title:T('Points and changes','點與變化量','Puntos y cambios'),
  text:[T('A coordinate pair is an address. In (x, y), the first number says how far right (positive) or left (negative) of the y-axis a point is. The second says how far above or below the x-axis it is.','座標是一個地址。在 (x, y) 中，第一個數表示點在 y 軸右邊（正）或左邊（負）多遠；第二個數表示它在 x 軸上方或下方多遠。','Un par de coordenadas es una dirección. En (x, y), el primer número indica qué tan a la derecha (positivo) o a la izquierda (negativo) del eje y está un punto. El segundo indica qué tan arriba o abajo del eje x está.'),
        T('Going from A to B, the horizontal change is Δx = x_B − x_A and the vertical change is Δy = y_B − y_A. The sign carries the direction: a negative Δy means B is lower than A.','從 A 走到 B，水平變化量是 Δx = x_B − x_A，垂直變化量是 Δy = y_B − y_A。正負號代表方向：Δy 為負，表示 B 比 A 低。','Al ir de A a B, el cambio horizontal es Δx = x_B − x_A y el cambio vertical es Δy = y_B − y_A. El signo indica la dirección: un Δy negativo significa que B está más abajo que A.')],
  formula:T('Δx = x_B − x_A    Δy = y_B − y_A','Δx = x_B − x_A    Δy = y_B − y_A','Δx = x_B − x_A    Δy = y_B − y_A'),
  tryIt:T('Drag B to the left of A and watch Δx turn negative. Then move B straight up or down: which change stays the same?','把 B 拖到 A 的左邊，看看 Δx 怎麼變成負數。再把 B 直直往上或往下移：哪一個變化量保持不變？','Arrastra B a la izquierda de A y observa cómo Δx se vuelve negativo. Luego mueve B solo hacia arriba o hacia abajo: ¿qué cambio se mantiene igual?'),
  key:T('A change is end minus start. Swap A and B and both changes flip sign, while their sizes stay the same.','變化量是「終點減起點」。把 A 和 B 對調，兩個變化量都會變號，但大小不變。','Un cambio es final menos inicio. Si intercambias A y B, ambos cambios cambian de signo, pero su tamaño se mantiene.'),
  check:[['dx',T('From A(−2, 3) to B(4, −1): Δx','從 A(−2, 3) 到 B(4, −1)：Δx','De A(−2, 3) a B(4, −1): Δx'),6],['dy',T('From A(−2, 3) to B(4, −1): Δy','從 A(−2, 3) 到 B(4, −1)：Δy','De A(−2, 3) a B(4, −1): Δy'),-4]],
  solution:T('Δx = 4 − (−2) = 6 and Δy = −1 − 3 = −4. B is 6 units right of A and 4 units lower.','Δx = 4 − (−2) = 6，Δy = −1 − 3 = −4。B 在 A 右邊 6 單位、下方 4 單位。','Δx = 4 − (−2) = 6 y Δy = −1 − 3 = −4. B está 6 unidades a la derecha de A y 4 unidades más abajo.')},
 {id:'distance',points:{A:{x:-3,y:-2,tone:'a',drag:true},B:{x:3,y:2,tone:'b',drag:true}},title:T('Distance from the changes','用變化量求距離','La distancia a partir de los cambios'),
  text:[T('The changes Δx and Δy are the legs of a right triangle, and the segment AB is its hypotenuse. The Pythagorean theorem gives the distance.','變化量 Δx 和 Δy 是一個直角三角形的兩股，線段 AB 是斜邊。用畢氏定理就能求出距離。','Los cambios Δx y Δy son los catetos de un triángulo rectángulo, y el segmento AB es su hipotenusa. El teorema de Pitágoras da la distancia.'),
        T('Squaring removes the signs, so distance never depends on direction. When B is straight across from A, Δy = 0 and the distance is just the size of Δx.','平方會去掉正負號，所以距離與方向無關。當 B 和 A 在同一水平線上時，Δy = 0，距離就是 Δx 的大小。','Elevar al cuadrado elimina los signos, así que la distancia nunca depende de la dirección. Cuando B está a la misma altura que A, Δy = 0 y la distancia es simplemente el tamaño de Δx.')],
  formula:T('AB = √(Δx² + Δy²)','AB = √(Δx² + Δy²)','AB = √(Δx² + Δy²)'),
  tryIt:T('Drag B until the distance is a whole number. Which pairs of changes give whole numbers? Look for 3 and 4, 6 and 8, or 5 and 12.','拖動 B，直到距離是整數。哪些變化量的組合會得到整數？試試 3 和 4、6 和 8，或 5 和 12。','Arrastra B hasta que la distancia sea un número entero. ¿Qué pares de cambios dan números enteros? Busca 3 y 4, 6 y 8, o 5 y 12.'),
  key:T('Distance = √(Δx² + Δy²). It is the same from A to B as from B to A.','距離 = √(Δx² + Δy²)。從 A 到 B 和從 B 到 A 的距離相同。','Distancia = √(Δx² + Δy²). Es la misma de A a B que de B a A.'),
  check:[['d1',T('Distance between (1, 1) and (4, 5)','(1, 1) 與 (4, 5) 的距離','Distancia entre (1, 1) y (4, 5)'),5],['d2',T('Distance between (−2, −1) and (3, 11)','(−2, −1) 與 (3, 11) 的距離','Distancia entre (−2, −1) y (3, 11)'),13]],
  solution:T('First pair: Δx = 3, Δy = 4, so √(9 + 16) = 5. Second pair: Δx = 5, Δy = 12, so √(25 + 144) = 13.','第一組：Δx = 3、Δy = 4，所以 √(9 + 16) = 5。第二組：Δx = 5、Δy = 12，所以 √(25 + 144) = 13。','Primer par: Δx = 3, Δy = 4, así que √(9 + 16) = 5. Segundo par: Δx = 5, Δy = 12, así que √(25 + 144) = 13.')},
 {id:'midpoint',points:{A:{x:-4,y:-2,tone:'a',drag:true},B:{x:4,y:2,tone:'b',drag:true},M:{x:0,y:0,tone:'m',label:'M',passable:true}},title:T('Midpoint and slope','中點與斜率','Punto medio y pendiente'),
  text:[T('The midpoint M of AB averages the coordinates, so it sits the same distance from both ends.','AB 的中點 M 是兩點座標的平均，所以它到兩端的距離相同。','El punto medio M de AB promedia las coordenadas, así que está a la misma distancia de ambos extremos.'),
        T('The slope measures steepness: the rise Δy for each 1 unit of run Δx. A positive slope rises to the right, a negative slope falls, 0 is flat, and a vertical segment (Δx = 0) has no slope.','斜率衡量傾斜程度：水平每前進 1 單位（Δx），垂直上升多少（Δy）。斜率為正表示往右上升，為負表示往右下降，0 表示水平；鉛直線段（Δx = 0）沒有斜率。','La pendiente mide la inclinación: cuánto sube Δy por cada unidad que avanza Δx. Una pendiente positiva sube hacia la derecha, una negativa baja, 0 es horizontal y un segmento vertical (Δx = 0) no tiene pendiente.')],
  formula:T('M = ((x_A + x_B)/2, (y_A + y_B)/2)    slope = Δy / Δx','M = ((x_A + x_B)/2, (y_A + y_B)/2)    斜率 = Δy / Δx','M = ((x_A + x_B)/2, (y_A + y_B)/2)    pendiente = Δy / Δx'),
  tryIt:T('Drag B straight above A one column at a time. What happens to the slope as Δx shrinks toward 0?','把 B 一格一格移向 A 的正上方。當 Δx 縮小到接近 0 時，斜率會怎樣？','Mueve B, columna por columna, hasta quedar justo arriba de A. ¿Qué le pasa a la pendiente cuando Δx se acerca a 0?'),
  key:T('The midpoint uses averages, and the slope is a ratio of changes. Neither depends on which end you call A.','中點用平均，斜率是變化量的比。兩者都與哪一端叫 A 無關。','El punto medio usa promedios y la pendiente es una razón de cambios. Ninguno depende de qué extremo llames A.'),
  check:[['mx',T('Midpoint of (−3, 2) and (5, 6): x','(−3, 2) 與 (5, 6) 的中點：x','Punto medio de (−3, 2) y (5, 6): x'),1],['my',T('Midpoint of (−3, 2) and (5, 6): y','(−3, 2) 與 (5, 6) 的中點：y','Punto medio de (−3, 2) y (5, 6): y'),4],['m',T('Slope from (−3, 2) to (5, 6)','從 (−3, 2) 到 (5, 6) 的斜率','Pendiente de (−3, 2) a (5, 6)'),0.5]],
  solution:T('M = ((−3 + 5)/2, (2 + 6)/2) = (1, 4). The slope is (6 − 2)/(5 − (−3)) = 4/8 = 1/2.','M = ((−3 + 5)/2, (2 + 6)/2) = (1, 4)。斜率是 (6 − 2)/(5 − (−3)) = 4/8 = 1/2。','M = ((−3 + 5)/2, (2 + 6)/2) = (1, 4). La pendiente es (6 − 2)/(5 − (−3)) = 4/8 = 1/2.')},
 {id:'equations',modes:true,title:T('Equations draw shapes','方程式畫出圖形','Las ecuaciones dibujan figuras'),
  text:[T('An equation in x and y picks out every point whose coordinates make it true.','一個含 x 和 y 的方程式，會挑出所有讓它成立的點。','Una ecuación en x e y selecciona todos los puntos cuyas coordenadas la cumplen.'),
        T('Every point on the line through A and B satisfies y = mx + b, where m is the slope and b is where the line crosses the y-axis. A circle with center (h, k) and radius r holds every point at distance r from the center, so the distance formula turns it into an equation.','通過 A 和 B 的直線上，每一點都滿足 y = mx + b，其中 m 是斜率，b 是直線與 y 軸的交點。圓心為 (h, k)、半徑為 r 的圓包含所有與圓心距離為 r 的點，距離公式就把它寫成一個方程式。','Todo punto de la recta que pasa por A y B cumple y = mx + b, donde m es la pendiente y b es donde la recta corta el eje y. Una circunferencia con centro (h, k) y radio r contiene todos los puntos a distancia r del centro, así que la fórmula de la distancia la convierte en una ecuación.')],
  formula:T('y = mx + b    (x − h)² + (y − k)² = r²','y = mx + b    (x − h)² + (y − k)² = r²','y = mx + b    (x − h)² + (y − k)² = r²'),
  tryIt:T('Switch between the line and the circle. Drag Q until it satisfies the equation. How many grid points can you find on a circle of radius 5?','在直線和圓之間切換。拖動 Q，直到它滿足方程式。半徑 5 的圓上，你能找到幾個格點？','Cambia entre la recta y la circunferencia. Arrastra Q hasta que cumpla la ecuación. ¿Cuántos puntos de la cuadrícula encuentras en una circunferencia de radio 5?'),
  key:T('An equation is a test: put in a point’s coordinates and see whether both sides agree.','方程式是一種檢驗：代入一個點的座標，看兩邊是否相等。','Una ecuación es una prueba: sustituye las coordenadas de un punto y comprueba si ambos lados coinciden.'),
  check:[['on',T('Is (3, 4) on x² + y² = 25?','(3, 4) 在 x² + y² = 25 上嗎？','¿Está (3, 4) en x² + y² = 25?'),'yes'],['y',T('On the line through (0, 1) with slope 2, find y when x = 3','通過 (0, 1)、斜率為 2 的直線上，x = 3 時 y 是多少？','En la recta que pasa por (0, 1) con pendiente 2, halla y cuando x = 3'),7],['circle',T('Is (6, 2) on (x − 2)² + (y + 1)² = 25?','(6, 2) 在 (x − 2)² + (y + 1)² = 25 上嗎？','¿Está (6, 2) en (x − 2)² + (y + 1)² = 25?'),'yes']],
  solution:T('9 + 16 = 25, so (3, 4) is on the circle. The line is y = 2x + 1, so x = 3 gives y = 7. For (6, 2): 4² + 3² = 16 + 9 = 25, so it is on the circle.','9 + 16 = 25，所以 (3, 4) 在圓上。直線是 y = 2x + 1，所以 x = 3 時 y = 7。對 (6, 2)：4² + 3² = 16 + 9 = 25，所以它在圓上。','9 + 16 = 25, así que (3, 4) está en la circunferencia. La recta es y = 2x + 1, así que x = 3 da y = 7. Para (6, 2): 4² + 3² = 16 + 9 = 25, así que está en la circunferencia.')}
];

/* ---------- Exact arithmetic for readouts ---------- */
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1;};
export const Fr=(n,d=1)=>{if(d<0){n=-n;d=-d;}const g=gcd(n,d);return{n:n/g,d:d/g};};
const fsub=(a,b)=>Fr(a.n*b.d-b.n*a.d,a.d*b.d),fmul=(a,b)=>Fr(a.n*b.n,a.d*b.d),fadd=(a,b)=>Fr(a.n*b.d+b.n*a.d,a.d*b.d);
export const num=v=>(v<0?'−':'')+Math.abs(v);
export const fstr=f=>(f.n<0?'−':'')+(f.d===1?Math.abs(f.n):Math.abs(f.n)+'/'+f.d);
const dec=v=>{const r=Math.round(v*100)/100;return (r<0?'−':'')+Math.abs(r);};
export const root=n=>{const r=Math.round(Math.sqrt(n));return r*r===n?String(r):'√'+n+' ≈ '+dec(Math.sqrt(n));};
export function lineEquation(A,B){
 if(A.x===B.x)return{text:'x = '+num(A.x),test:Q=>Q.x===A.x};
 const m=Fr(B.y-A.y,B.x-A.x),b=fsub(Fr(A.y),fmul(m,Fr(A.x)));
 const mt=m.n===0?'':(m.n===m.d?'':m.n===-m.d?'−':m.d===1?fstr(m):'('+fstr(m)+')')+'x',bt=b.n===0?(mt?'':'0'):(mt?(b.n<0?' − ':' + ')+fstr(Fr(Math.abs(b.n),b.d)):fstr(b));
 return{text:'y = '+mt+bt,m,b,value:x=>fadd(fmul(m,Fr(x)),b),test:Q=>{const v=fadd(fmul(m,Fr(Q.x)),b);return v.d===1&&v.n===Q.y;}};
}
const sq=(v,name)=>v===0?name+'²':'('+name+(v<0?' + '+Math.abs(v):' − '+v)+')²';
export const circleEquation=(C,r2)=>sq(C.x,'x')+' + '+sq(C.y,'y')+' = '+r2;
const quadrant=(p,lang)=>p.x===0||p.y===0?text(LESSON_UI.axis,lang):fill(text(LESSON_UI.quadrant,lang),{q:['I','II','III','IV'][p.x>0?(p.y>0?0:3):(p.y>0?1:2)],z:['一','二','三','四'][p.x>0?(p.y>0?0:3):(p.y>0?1:2)]});

/* ---------- Quick checks ---------- */
// parse is the course's numberValue, so lessons accept the same forms as the projects.
export function checkLesson(index,answers,parse){
 const states={};
 for(const [id,,answer]of LESSONS[index].check){
  const raw=String(answers?.[id]??'').trim();
  if(!raw){states[id]='blank';continue;}
  if(typeof answer==='string'){states[id]=raw===answer?'match':'mismatch';continue;}
  const v=parse(raw);states[id]=!Number.isFinite(v)?'unreadable':Math.abs(v-answer)<=1e-9*Math.max(1,Math.abs(answer))?'match':'mismatch';
 }
 return states;
}

/* ---------- Graph models ---------- */
const seg=(a,x1,y1,x2,y2,cls,extra='')=>'<line class="'+cls+'" x1="'+a.sx(x1)+'" y1="'+a.sy(y1)+'" x2="'+a.sx(x2)+'" y2="'+a.sy(y2)+'"'+extra+'/>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label=(a,x,y,t,cls='lp-label',dx=0,dy=0,anchor='middle')=>'<text class="'+cls+'" x="'+(a.sx(x)+dx)+'" y="'+(a.sy(y)+dy)+'" text-anchor="'+anchor+'">'+esc(t)+'</text>';
function changes(a,A,B,names=['Δx','Δy']){
 const dx=B.x-A.x,dy=B.y-A.y,sgn=Math.sign(dy);let s='';
 if(dx)s+=seg(a,A.x,A.y,B.x,A.y,'lp-dx',' marker-end="url(#'+a.id+'-mdx)"')+label(a,(A.x+B.x)/2,A.y,names[0]+' = '+num(dx),'lp-label lp-label-dx',0,dy>0?18:-9);
 // The vertical label goes outside the triangle, but never past the plane's left or right edge.
 const right=B.x<=a.x1-3&&(B.x>A.x||B.x<=a.x0+3);
 if(dy)s+=seg(a,B.x,A.y,B.x,B.y-sgn*.32,'lp-dy',' marker-end="url(#'+a.id+'-mdy)"')+label(a,B.x,(A.y+B.y)/2,names[1]+' = '+num(dy),'lp-label lp-label-dy',right?10:-10,4,right?'start':'end');
 return s;
}
const rightMark=(a,cx,cy,ux,uy,vx,vy)=>{const k=.38;return '<path class="lp-right" d="M'+a.sx(cx+ux*k)+' '+a.sy(cy+uy*k)+'L'+a.sx(cx+ux*k+vx*k)+' '+a.sy(cy+uy*k+vy*k)+'L'+a.sx(cx+vx*k)+' '+a.sy(cy+vy*k)+'"/>';};
// Each model returns what the graph draws under the points, the readout rows and an optional status line.
export function lessonModel(index,mode,lang){
 const L=LESSONS[index],t=k=>text(LESSON_UI[k],lang);
 if(index===0)return{under:a=>changes(a,a.pts.A,a.pts.B),read:({A,B})=>[['A','('+num(A.x)+', '+num(A.y)+')'],['B','('+num(B.x)+', '+num(B.y)+') · '+quadrant(B,lang)],['Δx = x_B − x_A',num(B.x)+' − '+(A.x<0?'('+num(A.x)+')':A.x)+' = '+num(B.x-A.x)],['Δy = y_B − y_A',num(B.y)+' − '+(A.y<0?'('+num(A.y)+')':A.y)+' = '+num(B.y-A.y)]]};
 if(index===1)return{under:a=>{const {A,B}=a.pts,dx=B.x-A.x,dy=B.y-A.y;let s='';
   if(dx&&dy)s+='<polygon class="lp-shape" points="'+a.sx(A.x)+','+a.sy(A.y)+' '+a.sx(B.x)+','+a.sy(A.y)+' '+a.sx(B.x)+','+a.sy(B.y)+'"/>'+rightMark(a,B.x,A.y,-Math.sign(dx),0,0,Math.sign(dy));
   s+=changes(a,A,B)+seg(a,A.x,A.y,B.x,B.y,'lp-segment');const d2=dx*dx+dy*dy;
   if(d2)s+=label(a,(A.x+B.x)/2,(A.y+B.y)/2,'AB = '+root(d2).split(' ≈')[0],'lp-label lp-label-ok',dx*dy>0?-12:12,-8,dx*dy>0?'end':'start');
   return s;},read:({A,B})=>{const dx=B.x-A.x,dy=B.y-A.y,d2=dx*dx+dy*dy;return[['Δx, Δy',num(dx)+', '+num(dy)],['Δx² + Δy²',dx*dx+' + '+dy*dy+' = '+d2],['AB',root(d2)]];}};
 if(index===2)return{under:a=>{const {A,B,M}=a.pts;M.x=(A.x+B.x)/2;M.y=(A.y+B.y)/2;return changes(a,A,B,[t('riseRun').split(' / ')[1],t('riseRun').split(' / ')[0]])+seg(a,A.x,A.y,B.x,B.y,'lp-segment');},
   read:({A,B})=>{const dx=B.x-A.x,dy=B.y-A.y,m=dx?Fr(dy,dx):null;return[['M','('+fstr(Fr(A.x+B.x,2))+', '+fstr(Fr(A.y+B.y,2))+')'],[t('riseRun'),num(dy)+' / '+num(dx)],[t('slope'),m?fstr(m)+(m.d!==1?' ≈ '+dec(dy/dx):''):t('vertical')]];}};
 if(mode==='line')return{points:'line',under:a=>{const {A,B}=a.pts;return A.x===B.x?seg(a,A.x,a.y0,A.x,a.y1,'lp-line'):seg(a,a.x0,A.y+(B.y-A.y)/(B.x-A.x)*(a.x0-A.x),a.x1,A.y+(B.y-A.y)/(B.x-A.x)*(a.x1-A.x),'lp-line');},
   read:({A,B,Q})=>{const eq=lineEquation(A,B);return[[t('equation'),eq.text],['Q','('+num(Q.x)+', '+num(Q.y)+')'],[t('test'),A.x===B.x?'x_Q = '+num(Q.x):'m·x_Q + b = '+fstr(eq.value(Q.x))+', y_Q = '+num(Q.y)]];},
   status:({A,B,Q})=>lineEquation(A,B).test(Q)?[true,t('onLine')]:[false,t('offLine')]};
 return{points:'circle',under:a=>{const {C,R}=a.pts,r=Math.hypot(R.x-C.x,R.y-C.y);return '<circle class="lp-circle" cx="'+a.sx(C.x)+'" cy="'+a.sy(C.y)+'" r="'+r*a.U+'"/>'+seg(a,C.x,C.y,R.x,R.y,'lp-radius');},
  read:({C,R,Q})=>{const r2=(R.x-C.x)**2+(R.y-C.y)**2,q2=(Q.x-C.x)**2+(Q.y-C.y)**2;return[[t('equation'),circleEquation(C,r2)],[t('radius'),root(r2)],[t('qGives'),(Q.x-C.x)**2+' + '+(Q.y-C.y)**2+' = '+q2]];},
  status:({C,R,Q})=>{const r2=(R.x-C.x)**2+(R.y-C.y)**2,q2=(Q.x-C.x)**2+(Q.y-C.y)**2;return q2===r2?[true,t('onCircle')]:[false,fill(t(q2<r2?'inside':'outside'),{q:q2,r:r2})];}};
}
export const startPoints=index=>index<3?structuredClone(LESSONS[index].points):{line:{A:{x:-4,y:-3,tone:'a',drag:true},B:{x:2,y:1,tone:'b',drag:true},Q:{x:5,y:3,tone:'p',drag:true}},circle:{C:{x:0,y:0,tone:'a',drag:true,label:'C'},R:{x:3,y:4,tone:'b',drag:true,label:'R'},Q:{x:-5,y:2,tone:'p',drag:true}}};

/* ---------- Draggable plane (browser only) ---------- */
let planeSeq=0;
export function mountPlane(host,o){
 const x0=-6,x1=6,y0=-6,y1=6,U=30,P=22,W=(x1-x0)*U+2*P,H=(y1-y0)*U+2*P,id='lp'+(++planeSeq),pts=o.points;
 const sx=x=>P+(x-x0)*U,sy=y=>P+(y1-y)*U;
 host.innerHTML='<svg class="lesson-plane" viewBox="0 0 '+W+' '+H+'" role="group" aria-label="'+esc(o.label)+'"></svg>';
 const svg=host.firstElementChild;let drag=null;
 const api={id,pts,sx,sy,U,x0,x1,y0,y1,render};
 function grid(){
  let g='';
  for(let x=x0;x<=x1;x++)if(x)g+='<line class="lp-grid" x1="'+sx(x)+'" y1="'+sy(y0)+'" x2="'+sx(x)+'" y2="'+sy(y1)+'"/>';
  for(let y=y0;y<=y1;y++)if(y)g+='<line class="lp-grid" x1="'+sx(x0)+'" y1="'+sy(y)+'" x2="'+sx(x1)+'" y2="'+sy(y)+'"/>';
  g+='<line class="lp-axis" x1="'+sx(x0)+'" y1="'+sy(0)+'" x2="'+sx(x1)+'" y2="'+sy(0)+'"/><line class="lp-axis" x1="'+sx(0)+'" y1="'+sy(y0)+'" x2="'+sx(0)+'" y2="'+sy(y1)+'"/>';
  for(let x=x0;x<=x1;x++)if(x&&x%2===0)g+='<text class="lp-tick" x="'+sx(x)+'" y="'+(sy(0)+14)+'" text-anchor="middle">'+num(x)+'</text>';
  for(let y=y0;y<=y1;y++)if(y&&y%2===0)g+='<text class="lp-tick" x="'+(sx(0)-6)+'" y="'+(sy(y)+3.5)+'" text-anchor="end">'+num(y)+'</text>';
  return g+'<text class="lp-axis-name" x="'+(sx(x1)-4)+'" y="'+(sy(0)-7)+'" text-anchor="end">x</text><text class="lp-axis-name" x="'+(sx(0)+8)+'" y="'+(sy(y1)+12)+'">y</text>';
 }
 function render(){
  const focused=document.activeElement?.closest?.('[data-lp]')?.dataset.lp;
  let s='<defs><clipPath id="'+id+'-clip"><rect x="'+sx(x0)+'" y="'+sy(y1)+'" width="'+(x1-x0)*U+'" height="'+(y1-y0)*U+'"/></clipPath>'
   +'<marker id="'+id+'-mdx" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="lp-mark-dx" d="M0 0L10 5L0 10z"/></marker>'
   +'<marker id="'+id+'-mdy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="lp-mark-dy" d="M0 0L10 5L0 10z"/></marker></defs>'
   +grid()+'<g clip-path="url(#'+id+'-clip)">'+o.under(api)+'</g>';
  for(const [k,p]of Object.entries(pts)){
   const lx=p.x>=x1-1?-12:12,anchor=p.x>=x1-1?'end':'start',ly=p.y>=y1-1?20:-11,name=p.label??k;
   s+='<g class="lp-point lp-'+(p.tone||'a')+(p.drag?' lp-drag':'')+'" data-lp="'+k+'"'+(p.drag?' tabindex="0" aria-label="'+esc(fill(o.pointLabel,{p:name,x:num(p.x),y:num(p.y)}))+'"':'')+' transform="translate('+sx(p.x)+' '+sy(p.y)+')">'+(p.drag?'<circle class="lp-hit" r="18"/>':'')+'<circle class="lp-dot" r="'+(p.drag?7.5:6)+'"/><text class="lp-label" x="'+lx+'" y="'+ly+'" text-anchor="'+anchor+'">'+esc(name)+'</text></g>';
  }
  svg.innerHTML=s;
  if(focused)svg.querySelector('[data-lp="'+focused+'"]')?.focus();
 }
 function set(k,x,y){
  x=Math.max(x0,Math.min(x1,x));y=Math.max(y0,Math.min(y1,y));const p=pts[k];
  if(p.x===x&&p.y===y)return;
  if(Object.entries(pts).some(([j,q])=>j!==k&&!q.passable&&q.x===x&&q.y===y))return;
  p.x=x;p.y=y;render();o.onChange?.(api);
 }
 function move(e){const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(svg.getScreenCTM().inverse());set(drag,Math.round(x0+(q.x-P)/U),Math.round(y1-(q.y-P)/U));}
 svg.addEventListener('pointerdown',e=>{const g=e.target.closest('[data-lp]');if(!g||!pts[g.dataset.lp].drag)return;drag=g.dataset.lp;svg.setPointerCapture(e.pointerId);e.preventDefault();g.focus?.({preventScroll:true});});
 svg.addEventListener('pointermove',e=>{if(drag)move(e);});
 const end=()=>{drag=null;};svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
 svg.addEventListener('keydown',e=>{const g=e.target.closest('[data-lp]');if(!g)return;const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!d)return;e.preventDefault();const p=pts[g.dataset.lp];set(g.dataset.lp,p.x+d[0],p.y+d[1]);});
 render();o.onChange?.(api);
 return api;
}
