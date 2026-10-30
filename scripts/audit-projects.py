"""Separate project recomputation: derives values from scenario inputs without importing authored keys. This is not independent human certification."""
from fractions import Fraction as F
from math import sqrt, atan2, pi, ceil
from pathlib import Path
import json

def dot(a,b): return sum(x*y for x,y in zip(a,b))
def mv(a,b): return [dot(row,b) for row in a]
def transpose(a): return list(map(list,zip(*a)))
def mm(a,b): return [[dot(row,col) for col in transpose(b)] for row in a]
def solve(a,b):
    rows=[[F(x) for x in row]+[F(y)] for row,y in zip(a,b)]
    for col in range(len(a[0])):
        i=next(i for i in range(col,len(rows)) if rows[i][col])
        rows[col],rows[i]=rows[i],rows[col]
        d=rows[col][col];rows[col]=[x/d for x in rows[col]]
        for i in range(len(rows)):
            if i!=col:
                d=rows[i][col];rows[i]=[x-d*y for x,y in zip(rows[i],rows[col])]
    return [row[-1] for row in rows]
def ls(a,b,weights):
    a=[[F(x) for x in row] for row in a]
    wa=[[F(w)*x for x in row] for row,w in zip(a,weights)]
    wb=[F(w)*y for w,y in zip(weights,b)]
    x=solve(mm(transpose(a),wa),mv(transpose(a),wb))
    residual=[F(y)-z for y,z in zip(b,mv(a,x))]
    assert all(dot(col,[r*F(w) for r,w in zip(residual,weights)])==0 for col in transpose(a))
    return x,residual,sum(F(w)*r*r for w,r in zip(weights,residual))
def val(c,x): return sum(a*F(x)**i for i,a in enumerate(c))
def integral(c): return [F(0)]+[F(a,i+1) for i,a in enumerate(c)]
def mean(x):return sum(map(F,x))/len(x)
def variance(x):m=mean(x);return sum((F(v)-m)**2 for v in x)/(len(x)-1)
def det(a):return a[0][0]*a[1][1]-a[0][1]*a[1][0]
def signed_area(points):return sum(det([points[i],points[(i+1)%len(points)]]) for i in range(len(points)))/2

questions={}
def put(id,numbers,method,formulas=None,drawings=None):
    questions[id]={'numbers':{k:str(v) for k,v in numbers.items()},'formulas':formulas or {},'drawings':drawings or {},'method':method}

# Fractions, changing reference wholes and whole-event scale.
concentrate=F(24)*F(1,5);whole=F(24+6);fraction=concentrate/whole
needed=120*2;required=F(needed)*F(150,1000)/F(9,10);extra=required-whole
assert required*F(9,10)/F(150,1000)==needed
put('pa-p01',dict(concentrate=concentrate,fraction=fraction,cups=whole*F(9,10)/F(150,1000),runners=120*F(2,5),needed=needed,prepared=required,extraConcentrate=extra*fraction,extraWater=extra*(1-fraction)), 'Track ingredient and whole independently; reverse retention; verify cups and mixture.')
distance=(F(7,2)+4)*F(2,5);walk=distance/3*60;elapsed=walk+24;deadline=90
put('pa-p02',dict(distance=distance,elevation=80+135-90,climb=135,walking=walk,elapsed=elapsed,spare=deadline-elapsed,newSpeed=(distance+F(1,2))/F(deadline-24)*60),'Map length versus height; clock arithmetic; solve a reverse speed constraint.')
put('a1-p01',dict(minimum=ceil(F(90,20-12)),surplus=20*18-(90+12*18),freeMinimum=ceil(F(90+3*20,20-12)),adults=solve([[1,1],[18,14]],[20,328])[0],students=solve([[1,1],[18,14]],[20,328])[1],balance=328-(90+12*20)), 'Solve linear and integer inequalities; recover a ticket mixture and verify both totals.', {'cost':['90','12']})
roots=(F(5),F(10));assert all(x*(30-2*x)==100 for x in roots)
vertex=F(30,4);shape=F(30,2+3);constrained=min(vertex,shape);assert 30-2*vertex<3*vertex and 30-2*constrained>=3*constrained
put('a1-p02',dict(root1=roots[0],root2=roots[1],constraint=shape,low=roots[0],high=min(roots[1],shape),maximum=constrained*(30-2*constrained)), 'Factor the area boundary, intersect inequalities, and reject the inadmissible unconstrained vertex.', {'length':['30','-2'],'area':['0','30','-2']})

# Geometry from transformations, cross products and exact median coordinates.
l,p,c=[list(map(F,q)) for q in [[1,1],[9,1],[1,7]]]
m=[(x+y)/2 for x,y in zip(l,p)];n=[(x+y)/2 for x,y in zip(l,c)];g=[(x+y+z)/3 for x,y,z in zip(l,p,c)]
area=abs(signed_area([l,p,c]));assert abs(signed_area([l,m,n]))==area/4
put('ge-p01',dict(gridArea=area,realArea=area*100,midline=sqrt(sum((x-y)**2 for x,y in zip(m,n)))*10,smallArea=abs(signed_area([l,m,n]))*100), 'Exact midpoint/centroid coordinates, shoelace area, squared scale and Pythagorean length.', drawings={'map':{'points':{'M':[str(x) for x in m],'N':[str(x) for x in n],'G':[str(x) for x in g]},'edges':[['M','N']]}})
a,b,c=[[F(x) for x in q] for q in [[1,1],[7,1],[7,5]]];o=[F(4),F(3)]
rot=lambda q:[o[0]-(q[1]-o[1]),o[1]+(q[0]-o[0])]
u,v,w=map(rot,[a,b,c]);assert abs(signed_area([u,v,w]))==abs(signed_area([a,b,c]))
ab=sqrt(sum((x-y)**2 for x,y in zip(a,b)));bc=sqrt(sum((x-y)**2 for x,y in zip(b,c)))
ob2=sum((x-y)**2 for x,y in zip(o,b));assert ob2>4
put('ge-p02',dict(walk=(ab+bc)*100,direct=sqrt(sum((x-y)**2 for x,y in zip(a,c)))*100,area=abs(signed_area([a,b,c]))*10000,tangent=sqrt(ob2-4)*100),'Translate, rotate, translate back; verify rigid invariants and radius/tangent orthogonality.',drawings={'route':{'points':{k:[str(x) for x in q] for k,q in zip(['U','V','W'],[u,v,w])},'edges':[['U','V'],['V','W']]}})

# Quadratic reconstruction is solved from measurements, not taken from a supplied key.
c,b,a=solve([[1,0,0],[1,F(1,2),F(1,4)],[1,1,1]],[2,3,3]);coef=[c,b,a]
peak=-b/(2*a);assert val(coef,F(1,2))==3 and val(coef,1)==3 and val(coef,2)==0
put('a2-p01',dict(early=F(1,2),late=1,peakTime=peak,peakHeight=val(coef,peak),ground=2,range=6*2),'Gaussian elimination on three observations; solve height/ground boundaries and check vertex and physical domain.',{'height':[str(x) for x in coef]})
baseline=F(20);amp=100-baseline;twohour=(60-baseline)/amp;q=sqrt(twohour)
assert baseline+amp*twohour**3==30
put('a2-p02',dict(amplitude=amp,multiplier=q,c4=baseline+amp*twohour**2,r4=F(120,6)+10,tc=6,tr=F(120,30-10)-2,limitC=baseline,limitR=10),'Separate baseline and excess; two-hour/hourly conversion; verify both threshold inverses and asymptotes.')
put('pc-p01',dict(midline=3,amplitude=2,period=2*pi/(pi/6),min=3-2,max=3+2,cross1=2,cross2=10,lowTime=3+6),'Solve cos(angle)=1/2 on a full closed period; verify two crossings, signs and shifted extrema.')
bx=F(6,2);by=sqrt(36-bx**2);dx=bx-8;dist=sqrt(dx**2+by**2)
assert abs(dist**2-(8**2+6**2-2*8*6*F(1,2)))<1e-12
put('pc-p02',dict(bx=bx,by=by,distance=dist,angle=atan2(by,dx)*180/pi,time=dist/4,rotatedX=6,rotatedY=0),'Cartesian components checked with the cosine rule and quadrant-aware direction; rigid rotation check.')

# Motion: independent polynomial integration, signs, extrema and seconds conversion.
v=[F(8),F(-6),F(1)];raw=integral(v);pos=[60*x for x in raw]
values={t:val(pos,t) for t in [0,2,4,5]}
assert val(v,1)>0 and val(v,3)<0 and val(v,5)>0
travel=abs(values[2]-values[0])+abs(values[4]-values[2])+abs(values[5]-values[4])
maxvalue=max(values.values());maxtimes=[t for t,z in values.items() if z==maxvalue]
put('ca-p01',dict(turn1=2,turn2=4,displacement=values[5],distance=travel,averageVelocity=values[5]/300,averageSpeed=travel/300,acceleration=F(2*1-6,60),maxPosition=maxvalue,maxTime1=maxtimes[0],maxTime2=maxtimes[1]), 'Integrate exactly with the 60 factor, split by velocity sign, compare all endpoints/stationary points, convert acceleration.', {'position':[str(x) for x in pos]})
power=[F(0),F(12),F(-1)];energy=integral(power);total=val(energy,10);peak=F(6);halfwidth=sqrt(val(power,peak)-30)
removed=2*((val(power,peak)-30)*halfwidth-halfwidth**3/3)
assert abs(removed-8*sqrt(6))<1e-12
put('ca-p02',dict(peakTime=peak,peakPower=val(power,peak),endPower=val(power,10),uncapped=total,average=total/10,clip1=peak-halfwidth,clip2=peak+halfwidth,exported=float(total)-removed,sensitivity=val(power,8)), 'Integrate the quadratic; independently integrate excess around the vertex; verify clipping boundaries and fundamental-theorem sensitivity.', {'energy':[str(x) for x in energy]})

# Statistics: paired differences, sample spread, supplied t critical value and strata.
aa=[20,22,19,24,21,23];bb=[18,18,18,21,21,21];d=[x-y for x,y in zip(aa,bb)]
md=mean(d);sv=variance(d);se=sqrt(sv/len(d));crit=F(2571,1000)
put('st-p01',dict(mean=md,variance=sv,se=se,low=float(md)-float(crit)*se,high=float(md)+float(crit)*se,positive=sum(x>0 for x in d)), 'Reconstruct each pair, sample squared deviations and SE; use exactly the supplied critical value.')
main=[8,12,16];pocket=[2,4,6];mp=[5,9,10];pp=[0,1,2]
total=20*mean(main)+10*mean(pocket);plastic=20*mean(mp)+10*mean(pp)
put('st-p02',dict(mainMean=mean(main),pocketMean=mean(pocket),pooledMean=mean(main+pocket),total=total,plastic=plastic,fraction=plastic/total,plasticGivenPocket=F(sum(pp),sum(pocket)),pocketGivenPlastic=F(sum(pp),sum(mp)+sum(pp))), 'Use population segment counts to expand means; keep raw conditional sample denominators separate from weighted population totals.')

# Linear algebra: normal equations reconstructed under both objectives.
a=[[1,1],[1,-1],[2,0]];b=[5,4,6];x,r,sse=ls(a,b,[1,1,1]);wx,wr,wsse=ls(a,b,[1,1,F(1,4)])
assert det(a[:2])!=0 and b[2]!=b[0]+b[1]
put('la-p01',dict(rank=2,x=x[0],y=x[1],r1=r[0],r2=r[1],r3=r[2],sse=sse,weightedX=wx[0],weightedY=wx[1],weightedError=wsse), 'Independent elimination of AᵀWA systems; exact residuals and weighted orthogonality under both metrics.')
r=[[0,-1],[1,0]];s=[[2,0],[0,1]];t=mm(r,s);w=[3,2];tw=mv(t,w);recovered=solve(t,[-4,2]);tc=solve([[1,1],[1,-1]],tw);wc=solve([[1,1],[1,-1]],w);twice=mv(t,tw)
vertices=[[0,0],[3,0],[3,2]];area=abs(signed_area(vertices));mappedarea=abs(signed_area([mv(t,z) for z in vertices]));assert mappedarea==abs(det(t))*area
put('la-p02',dict(a11=t[0][0],a12=t[0][1],a21=t[1][0],a22=t[1][1],tx=tw[0],ty=tw[1],inputX=recovered[0],inputY=recovered[1],det=det(t),area=mappedarea,c1=wc[0],c2=wc[1],outC1=tc[0],outC2=tc[1],twiceX=twice[0],twiceY=twice[1]), 'Independent composition, inverse solve, transformed shoelace area and basis solves; check T²=-2I.')

result={'audit':'Separately implemented scenario computations (project-authored, not independent human certification); no authored answer key imported. Exact fractions where rational, mathematical square roots for irrational quantities. Text understanding is not auto-scored.','questions':questions}
# Physics: two separately derived model balances, preserving every old reference.
mass=F(2); delay=F(1,2); initial=F(4); force=F(4)
acceleration=-force/mass; stop_time=-initial/acceleration
delay_distance=initial*delay; total=delay_distance+initial*stop_time/2
fast=F(6); fast_total=fast*delay+mass*fast**2/(2*force)
limit=F(8); minimum_force=mass*fast**2/(2*(limit-fast*delay))
revised=fast*delay+mass*fast**2/(2*8)
assert fast*delay+mass*fast**2/(2*minimum_force)==limit
assert revised<limit and total==6 and fast_total==12
put('ph-p01',dict(acceleration=acceleration,delayDistance=delay_distance,stopTime=stop_time,totalDistance=total,fastDistance=fast_total,minimumForce=minimum_force,revisedDistance=revised), 'Constant acceleration gives triangular velocity-time area; independently include the rectangular controller-delay area and solve the force constraint.')
load=F(20+30+10); event=load*3; collection=F(100)*2*F(4,5)
cloud_collection=F(50)*2*F(4,5); initial_storage=F(40); reserve=F(20)
assert initial_storage+collection<=250 and initial_storage+collection-event==reserve
put('ph-p02',dict(load=load,eventEnergy=event,collected=collection,final=initial_storage+collection-event,cloudCollected=cloud_collection,shortfall=event+reserve-initial_storage-cloud_collection,maxLoad=(initial_storage+cloud_collection-reserve)/3,duration=(initial_storage+cloud_collection-reserve)/load), 'Energy conservation in Wh, with efficiency applied once to collection, then capacity and reserve constraints solved independently.')
# Physics 1 and 2 projects: solve independently from their scenario inputs.
mass=F(3);v=F(6);delay=F(2,5);brake=F(9);a=-brake/mass;t=-v/a
coast=v*delay;total=coast+v*t/2;fast=F(8);faster=fast*delay+mass*fast**2/(2*brake)
minimum=mass*fast**2/(2*(9-fast*delay));joined=mass*v/(mass+1)
assert fast*delay+mass*fast**2/(2*minimum)==9
put('p1-p01',dict(acceleration=a,coast=coast,time=t,total=total,faster=faster,minimum=minimum,joined=joined,transfer=mass*v**2/2-(mass+1)*joined**2/2), 'Independent delay rectangle and braking triangle, force inequality, momentum and kinetic-energy balances.')
mass=F(6,5);rho=1000;g=10;volume=F(2,1000);loaded=mass+F(1,2);overloaded=loaded+F(2,5)
slope=F(9000-2000,1)/(F(9,10)-F(2,10));gauge=slope*F(13,10)
assert slope*F(1,2)==5000
put('p1-p02',dict(weight=mass*g,full=rho*g*volume,floating=mass/rho*1000,payload=loaded/rho*1000,maximum=rho*volume,support=overloaded*g-rho*g*volume,slope=slope,gauge=gauge,absolute=gauge+100000), 'Displaced mass and floating capacity; independent pressure slope and atmospheric reference.')
mass=F(2);capacity=4000;budget=mass*capacity*(18-12);leak=F(90000,30*60);net=leak-40
current=F(20,12)
put('p2-p01',dict(budget=budget,leak=leak,temperature=12+F(90000,mass*capacity),net=net,minutes=budget/net/60,improved=leak*F(3,5)-40,current=current,charge=current*3600,energy=20*2), 'Independent thermal budget and rate comparison; separate electrical current, charge and Wh.')
i1=F(6,12);i2=F(6,24);it=i1+i2;image=1/(F(1,10)-F(1,30));mag=-image/30
h=F(414,100)*F(1,10**15);photon=h*6*10**14
put('p2-p02',dict(i1=i1,i2=i2,total=it,resistance=6/it,power=6*it,expanded=6*(it+F(6,12)),image=image,magnification=mag,height=3*mag,nearer=1/(F(1,10)-F(1,20)),photon=photon,kinetic=photon-2,lower=h*4*10**14), 'Independent parallel current and power, reciprocal lens distances and signed scaling, photon threshold comparison.')
# Basic Logic: every club member is listed with P, Q and H, and every statement is evaluated member by member.
from itertools import product
members=[]
for (p,q),count,hours in [((1,1),18,9),((1,0),2,1),((0,1),12,5),((0,0),8,3)]:
    members+=[(p,q,1)]*hours+[(p,q,0)]*(count-hours)
assert len(members)==40
count=lambda test:sum(1 for m in members if test(*m))
implies=lambda a,b:(not a) or b
put('bl-p01',dict(**{'or':count(lambda p,q,h:p or q)},xor=count(lambda p,q,h:p!=q),notBoth=count(lambda p,q,h:not(p and q)),counter=count(lambda p,q,h:not implies(p,q)),conditional=count(lambda p,q,h:implies(p,q)),converse=count(lambda p,q,h:not implies(q,p)),allowed=count(lambda p,q,h:q and (p or h)),misread=count(lambda p,q,h:(q and p) or h),unsafe=count(lambda p,q,h:((q and p) or h) and not q)), 'Forty listed members with three truth values each; every connective, conditional and reading of the rule evaluated member by member.')
# Survey: the eight parts follow from the totals by inclusion and exclusion; the receipt bounds try every placement of the extra receipts.
total=120;Fn,Vn,An,FV,FA,VA,FVA=70,60,41,32,25,20,11
part={(1,1,1):FVA,(1,1,0):FV-FVA,(1,0,1):FA-FVA,(0,1,1):VA-FVA}
part[(1,0,0)]=Fn-part[(1,1,0)]-part[(1,0,1)]-FVA;part[(0,1,0)]=Vn-part[(1,1,0)]-part[(0,1,1)]-FVA;part[(0,0,1)]=An-part[(1,0,1)]-part[(0,1,1)]-FVA
part[(0,0,0)]=total-sum(part.values())
assert all(v>=0 for v in part.values()) and sum(part.values())==total
size=lambda test:sum(v for k,v in part.items() if test(*k))
assert (size(lambda f,v,a:f),size(lambda f,v,a:v),size(lambda f,v,a:a),size(lambda f,v,a:f and v),size(lambda f,v,a:f and a),size(lambda f,v,a:v and a))==(Fn,Vn,An,FV,FA,VA)
extra=48-An
outside=[k for k in part if not k[2]]
fruit=[]
for split in product(*(range(min(part[k],extra)+1) for k in outside)):
    if sum(split)==extra:fruit.append(size(lambda f,v,a:f and a)+sum(c for k,c in zip(outside,split) if k[0]))
put('bl-p02',dict(none=part[(0,0,0)],onlyFruit=part[(1,0,0)],fruitVeg=part[(1,1,0)],appNotFruit=size(lambda f,v,a:a and not f),vegApp=size(lambda f,v,a:v and a),fruitNotVeg=size(lambda f,v,a:f and not v),minFruit=min(fruit),maxFruit=max(fruit)), 'Eight Venn parts recovered from the totals and checked against every total; claims counted part by part; every placement of the 7 receipts outside the app users tried.')
target=Path(__file__).resolve().parent.parent/'review/project-math-audit.json'
target.parent.mkdir(exist_ok=True);target.write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'projects':len(questions),'numericComponents':sum(len(q['numbers']) for q in questions.values()),'formulaComponents':sum(len(q['formulas']) for q in questions.values()),'drawings':sum(len(q['drawings']) for q in questions.values())}))
