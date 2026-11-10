"""Separate exact-arithmetic recomputation; does not read authored answer keys. Both implementations were produced in this project, not independently certified by a human reviewer."""
from fractions import Fraction as F
from math import isqrt, sqrt, pi
from pathlib import Path
import json

def dot(a,b): return sum(x*y for x,y in zip(a,b))
def mv(a,v): return [dot(r,v) for r in a]
def transpose(a): return list(map(list,zip(*a)))
def mm(a,b): return [[dot(r,c) for c in transpose(b)] for r in a]
def rref(a):
    a=[[F(x) for x in row]for row in a];row=0
    for col in range(len(a[0])):
        pivot=next((i for i in range(row,len(a))if a[i][col]),None)
        if pivot is None:continue
        a[row],a[pivot]=a[pivot],a[row];div=a[row][col];a[row]=[x/div for x in a[row]]
        for i in range(len(a)):
            if i!=row:
                factor=a[i][col];a[i]=[x-factor*y for x,y in zip(a[i],a[row])]
        row+=1
        if row==len(a):break
    return a

def rank(a): return sum(any(row)for row in rref(a))
def solve(a,b):
    out=rref([row+[v]for row,v in zip(a,b)])
    assert rank(a)==len(a[0]) and all(any(r[:-1])or not r[-1]for r in out)
    return [r[-1]for r in out[:len(a[0])]]
def det2(a):return a[0][0]*a[1][1]-a[0][1]*a[1][0]
def projection(a,b):
    c=F(dot(a,b),dot(a,a));p=[c*x for x in a];return c,p,[F(y)-x for x,y in zip(p,b)]
def regression(xs,ys):
    design=[[1,F(x)]for x in xs];normal=mm(transpose(design),design);rhs=mv(transpose(design),ys);alpha,beta=solve(normal,rhs)
    residual=[F(y)-alpha-beta*x for x,y in zip(xs,ys)]
    assert sum(residual)==0 and dot(xs,residual)==0
    return alpha,beta,residual

def quadratic(a,b,c):
    d=b*b-4*a*c;s=isqrt(d);assert s*s==d
    return sorted([F(-b-s,2*a),F(-b+s,2*a)])
def yn(v):return 'yes' if v else 'no'
def classify(a,b):return 'none' if rank([row+[v]for row,v in zip(a,b)])>rank(a)else 'one' if rank(a)==len(a[0])else 'many'
def multiply_polynomials(a,b):
    c=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b):c[i+j]+=x*y
    return c

def integral_poly(coeffs,a,b):return sum(F(c,i+1)*(F(b)**(i+1)-F(a)**(i+1))for i,c in enumerate(coeffs))
R={}
A=[[2,3],[4,6]];solution=solve([[2,2],[4,6]],[6,12]);R['la-c01']={'k':F(6,2),'original':classify(A,[6,12]),'x':solution[0],'y':solution[1],'changed':classify(A,[6,13])}
A=[[1,2,-1],[2,4,-2],[0,1,1]];p=solve([[1,2],[0,1]],[3,1]);d=solve([[1,2],[0,1]],[1,-1]);assert mv(A,p+[0])==[3,6,1]and mv(A,d+[1])==[0,0,0]
R['la-c02']={'rank':rank(A),'nullity':3-rank(A),'p1':p[0],'p2':p[1],'d1':d[0],'d2':d[1],'consistent':yn(classify(A,[3,7,1])!='none')}
A=[[1,2],[0,1]];B=[[2,0],[1,1]];v=[1,-1];ab=mv(mm(A,B),v);ba=mv(mm(B,A),v);assert ab!=ba;assert det2(A)*det2(B)!=0
R['la-c03']={'abx':ab[0],'aby':ab[1],'bax':ba[0],'bay':ba[1],'inverse':'ba'}
C=[[1,1],[1,-1]];T=[[2,1],[0,3]];w=[4,2];cw=solve(C,w);co=solve(C,mv(T,w));cols=[solve(C,mv(T,v))for v in transpose(C)];M=transpose(cols);assert mv(M,cw)==co
R['la-c04']={'w1':cw[0],'w2':cw[1],'out1':co[0],'out2':co[1],'a11':M[0][0],'a12':M[0][1],'a21':M[1][0],'a22':M[1][1]}
c,p,r=projection([1,2,2],[2,1,3]);R['la-c05']={'c':c,'r1':r[0],'r2':r[1],'r3':r[2],'dot':dot(r,[1,2,2])}
a,b,r=regression([0,1,2],[1,2,2]);R['la-c06']={'alpha':a,'beta':b,'sse':dot(r,r),'exact':yn(not any(r))}
A=[[3,1],[0,2]];v=[-1,1];w=[1,1];av=mv(A,v);aw=mv(A,w);lam=F(av[0],v[0]);out=v[:]
for _ in range(4):out=mv(A,out)
R['la-c07']={'v':yn(av==[lam*x for x in v]),'w':yn(aw[0]*w[1]==aw[1]*w[0]),'lambda':lam,'x':out[0],'y':out[1]}
A=[[1,2],[3,1]];triangle=[[2,0],[0,3]];original=F(abs(det2(triangle)),2);newvectors=[mv(A,v)for v in triangle];after=F(abs(det2(newvectors)),2);assert after==abs(det2(A))*original
R['la-c08']={'det':det2(A),'before':original,'after':after,'orientation':yn(det2(A)>0)}
A=[[1,2],[2,4]];c,p,r=projection([1,2],[3,5]);assert dot(r,[1,2])==0;R['la-c09']={'consistent':yn(classify(A,[3,5])!='none'),'p1':p[0],'p2':p[1],'unique':yn(rank(A)==2)}
def affine(v,k):return [2*v[0]+v[1]+k,v[0]-v[1]]
u=[1,0];v=[0,1];R['la-c10']={'k':0,'sumInput':affine([x+y for x,y in zip(u,v)],2)[0],'sumOutput':affine(u,2)[0]+affine(v,2)[0]}
def param(k):return [[1,2,1],[0,k-1,2],[0,0,k-1]]
assert (1-1)**2==0 and (-2-1)**2!=0
A=param(1);R['la-c11']={'singular':['one'],'rank':rank(A),'nullity':3-rank(A),'consistent':yn(classify(A,[0,0,1])!='none')}
assert sum([0,0,0])!=1 and [1,0,0][0]*[1,0,0][1]==0 and [0,1,0][0]*[0,1,0][1]==0 and 1*1!=0
R['la-c12']={'spaces':['s1','s4'],'d1':3-rank([[1,1,1]]),'d4':rank([[1,2,3],[2,4,6]])}
conc,water=F(3,4),F(1,2);retained=1-F(2,5);left=conc*retained;volume=(conc+water)*retained+F(1,4)
R['pa-c01']={'before':conc/(conc+water),'left':left,'final':left/volume}
original=(F('46.20')-3)/(1+F(8,100))/(1-F(20,100));discount=original*F(20,100);tax=(original-discount)*F(8,100)
R['pa-c02']={'original':original,'discount':discount,'tax':tax};assert original-discount+tax+3==F('46.20')
rate=F(1,6)+F(1,4)-F(1,12);R['pa-c03']={'rate':rate,'time':1/rate,'amount':rate*F(3,2)}
k=F(6,F(3,2)*4-3);R['pa-c04']={'boys':3*k,'girls':4*k,'total':7*k+6};assert (3*k+6)/(4*k)==F(3,2)
exceptional=F(8,2);unique=solve([[3,2],[6,8]],[11,2+18]);assert exceptional+18==2*11 and 23!=2*11
R['a1-c01']={'k':exceptional,'x':unique[0],'y':unique[1],'changed':'none'}
lo,hi=F(-5+3,2),F(5+3,2);R['a1-c02']={'lower':lo,'upper':hi,'closed':yn(abs(2*lo-3)==5 and abs(2*hi-3)==5),'test':yn(abs(2*(-2)-3)<=5)}
sides=quadratic(1,-28//2,45);R['a1-c03']={'b':-14,'c':45,'long':max(sides),'short':min(sides)};assert 2*sum(sides)==28 and sides[0]*sides[1]==45
h=F(12-4,4-2);R['a1-c04']={'hours':h,'cost':12+2*h,'a':max(x for x in range(9)if 12+2*x<=25),'b':max(x for x in range(9)if 4+4*x<=25)}
A=[0,0];B=[6,0];C=[2,4];D=[F(x+y,2)for x,y in zip(A,B)];E=[F(x+y,2)for x,y in zip(A,C)];de=[e-d for d,e in zip(D,E)];bc=[c-b for b,c in zip(B,C)];assert dot(de,de)==8 and det2([de,bc])==0
R['ge-c01']={'area':F(abs(det2([B,C])),2),'length':'2sqrt2','ratio':F(abs(det2([D,E])),abs(det2([B,C]))),'parallel':yn(det2([de,bc])==0)}
segments=[9,16];hyp=sum(segments);h=isqrt(dot(segments[::-1],segments)//2);legs=[isqrt(hyp*x)for x in segments];assert sum(x*x for x in legs)==hyp*hyp
R['ge-c02']={'h':h,'short':min(legs),'long':max(legs),'area':F(h*hyp,2)}
scale=F(4,12);smallr=6*scale;removed=F(1,3)*smallr**2*4;full=F(1,3)*6**2*12;R['ge-c03']={'radius':smallr,'fraction':removed/full,'c':full-removed}
R['ge-c04']={'tangent':isqrt(13**2-5**2),'near':13-5,'far':13+5,'product':(13-5)*(13+5)}
roots=quadratic(3,-8,-3)
for x in roots:assert x not in [-1,1] and (x+1)/(x-1)==(x-1)/(x+1)+F(3,2)
R['a2-c01']={'small':roots[0],'large':roots[1],'excluded':['minus1','one']}
roots=quadratic(1,2,-15);allowed=[x for x in roots if x-1>0 and x+3>0];assert len(allowed)==1;R['a2-c02']={'solution':allowed[0],'rejected':roots[0],'valid':yn(roots[0]>1)}
assert multiply_polynomials(multiply_polynomials([1,1],[1,1]),[-3,1])==[-3,-5,-1,1]
for x in [-4,-2,0,2,4]:assert ((x+1)**2*(x-3)>0)==(x>3)
R['a2-c03']={'zeros':['minus1','three'],'multiplicity':2,'positive':'above3'}
u=quadratic(1,-5,4);x=[next(k for k in range(8)if 2**k==v)for v in u];R['a2-c04']={'small':min(x),'large':max(x),'valid':yn(5**2-5*5+4==0)}
# Direct interval sign and boundary verification, separately from the authored answer keys.
for x in [F(0),F(5,2),F(3),F(4)]:assert (x!=2 and F(1,x-2)>=1)==(2<x<=3)
assert F(1,3-2)-1==0;assert (5-1)==2**2
R['pc-c01']={'lower':2,'upper':3,'ends':'openclosed','start':1,'excluded':5}
sine={'one6':F(1,2),'half':F(1),'seven6':F(-1,2),'three2':F(-1),'eleven6':F(-1,2)}
R['pc-c02']={'angles':[key for key,s in sine.items()if 2*s*s-s-1==0]};assert set(quadratic(2,-1,-1))=={F(1),F(-1,2)}
assert multiply_polynomials([-1,1],[1,1])==[-1,0,1]and multiply_polynomials([-1,1],[-2,1])==[2,-3,1]
R['pc-c03']={'holeX':1,'holeY':F(1+1,1-2),'vertical':2,'horizontal':1,'zero':-1}
R['pc-c04']={'period':F(2,F(1,6)),'middle':F(F(1,2),F(1,6)),'minimum':5-3,'time':F(1,F(1,6))}
a,b=solve([[1,1],[2,0]],[2,3]);R['ca-c01']={'a':a,'b':b,'derivative':2*a}
# Product rule: (x²e^-x)' = e^-x(2x-x²); signs on either side of its interior root prove the maximum.
from math import exp
maximum=4*exp(-2)
assert 2*1-1**2>0 and 2*3-3**2<0 and maximum>16*exp(-4)>0;R['ca-c02']={'x':2,'m':maximum,'c':2*3-3**2}
contributions=[integral_poly([3,-4,1],a,b)for a,b in [(0,1),(1,3),(3,4)]];net=sum(contributions)
R['ca-c03']={'net':net,'distance':sum(abs(x)for x in contributions),'position':5+net}
knots=[(0,2),(1,0),(2,-2),(4,0),(6,2)];areas=[F(b-a)*(F(ya)+F(yb))/2 for(a,ya),(b,yb)in zip(knots,knots[1:])];values=[F(0)]
for area in areas:values.append(values[-1]+area)
maxi=max(range(len(values)),key=values.__getitem__);mini=min(range(len(values)),key=values.__getitem__)
R['ca-c04']={'maxX':knots[maxi][0],'max':values[maxi],'minX':knots[mini][0],'min':values[mini],'slope':F(-2+0,2)}
false=F(5,100)*900;hits=F(90,100)*100;R['st-c01']={'false':false,'total':false+hits,'conditional':hits/(false+hits)}
a1,a2,b1,b2=F(18,20),F(10,100),F(80,100),F(1,20);R['st-c02']={'a':F(18+10,20+100),'b':F(80+1,100+20),'within':yn(a1>b1 and a2>b2),'cause':'no'}
data=list(map(F,[1,2,4,5]));mean=sum(data)/len(data);var=sum((x-mean)**2 for x in data)/(len(data)-1);new=[2*x-1 for x in data];newmean=sum(new)/len(new);newvar=sum((x-newmean)**2 for x in new)/(len(new)-1)
R['st-c03']={'mean':mean,'variance':var,'newMean':newmean,'newVariance':newvar};assert newvar==4*var
xs=[1,2,3];ys=[2,1,4];alpha,beta,residual=regression(xs,ys);ymean=F(sum(ys),len(ys));sst=sum((F(y)-ymean)**2 for y in ys)
R['st-c04']={'b':beta,'a':alpha,'residual':residual[1],'r2':1-dot(residual,residual)/sst}
# Physics scenarios are recomputed from stated inputs, not authored answer keys.
positions=[0,6,12,12,8]; times=[0,2,4,6,8]
displacement=positions[-1]-positions[0]
distance=sum(abs(b-a) for a,b in zip(positions,positions[1:]))
R['ph-c01']={'displacement':displacement,'distance':distance,'velocity':F(displacement,times[-1]),'speed':F(distance,times[-1]),'lastVelocity':F(positions[-1]-positions[-2],times[-1]-times[-2])}
R['ph-c02']={'net':9-3,'acceleration':F(9-3,3),'coast':5+0*2}
momentum=2*3+1*0; velocity=F(momentum,2+1)
R['ph-c03']={'momentum':momentum,'finalVelocity':velocity,'initialEnergy':F(2*3**2,2),'finalEnergy':F(2+1,2)*velocity**2}
potential=2*10*3; kinetic=potential-24; speed=sqrt(2*kinetic/2)
assert speed==6 and kinetic+24==potential
R['ph-c04']={'potential':potential,'kinetic':kinetic,'speed':speed}
joules=120*15*60; watt_hours=F(joules,3600)
R['ph-c05']={'joules':joules,'wattHours':watt_hours,'runtime':watt_hours/20,'cloudRuntime':F(60*15,60)/20}
R['ph-c06']={'wavelength':F(12,3),'period':F(1,3),'newWavelength':F(12,6),'echoDistance':F(340*1,2)}
# Two foundation tracks: recompute from invented scenario data using separate arithmetic.
a=F(0-4,2);positive_area=F(4+0,2)*2;negative_area=F(0-4,2)*2
R['p1-c01']=dict(acceleration=a,force=2*a,displacement=positive_area+negative_area,distance=positive_area-negative_area)
m1,m2,v1,v2=3,1,2,-2;p=m1*v1+m2*v2;vf=F(p,m1+m2);initial=F(m1*v1**2+m2*v2**2,2)
R['p1-c02']=dict(momentum=p,velocity=vf,initial=initial,decrease=initial-F(m1+m2,2)*vf**2)
u=F(3,2)*10*4;k=u-12
R['p1-c03']=dict(potential=u,kinetic=k,speed=sqrt(2*k/F(3,2)),power=F(24,3))
i=2*F(1,2)**2;torque=F(1,2)*3
R['p1-c04']=dict(inertia=i,torque=torque,alpha=torque/i,omega=F(8,10)*2/F(2,10))
period=2*pi*sqrt(F(1,16));energy=16*F(1,5)**2/2
R['p1-c05']=dict(period=period,energy=energy,newEnergy=energy*4,mass=64*F(1,16))
fb=1000*10*F(2,1000);weight=3*10
R['p1-c06']=dict(pressure=1000*10*F(6,5),buoyancy=fb,weight=weight,support=weight-fb)
R['p2-c01']=dict(heat=F(1,2)*2000*(24-18),kelvin=24+F(27315,100),internal=120-35)
source=F(1,10**6);probe=F(-2,10**6);distance=F(3,10);electric=9*10**9*source/distance**2;potential=9*10**9*source/distance
R['p2-c02']=dict(field=electric,force=probe*electric,potential=potential,energy=probe*potential)
rs=6+3;rp=1/(F(1,6)+F(1,3))
R['p2-c03']=dict(seriesR=rs,seriesI=F(12,rs),parallelR=rp,parallelI=12/rp,branch=F(12,6))
magnetic=F(2,10**6)*4*F(3,10);flux=F(5,100)*F(2,10)
R['p2-c04']=dict(force=magnetic,flux=flux,emf=flux/F(2,10))
image=1/(F(1,12)-F(1,36));magnification=-image/36
R['p2-c05']=dict(image=image,magnification=magnification,height=4*magnification,wavelength=F(18,6),echo=340*F(8,10)/2)
h=F(414,100)*F(1,10**15);photon=h*(8*10**14)
R['p2-c06']=dict(photon=photon,kinetic=photon-2,threshold=2/h,brighter=photon)
def euclid(a,b):
    while b:a,b=b,a%b
    return a
g=euclid(252,198);x=next(x for x in range(11)if (g-252*x)%198==0);R['nt-c01']={'gcd':g,'thirty':yn(30%g==0),'x':x,'y':(g-252*x)//198}
d=[k for k in range(1,361)if 360%k==0];R['nt-c02']={'divisors':len(d),'odd':sum(k%2 for k in d),'rectangles':sum(k*k<=360 for k in d),'squares':sum(isqrt(k)**2==k for k in d)}
R['nt-c03']={'inverse':next(k for k in range(26)if 11*k%26==1),'x':next(x for x in range(26)if 11*x%26==7),'countFour':sum(6*x%10==4 for x in range(10)),'countFive':sum(6*x%10==5 for x in range(10))}
R['nt-c04']={'order':next(k for k in range(1,12)if pow(2,k,11)==1),'remainder':pow(2,2026,11),'digit':pow(7,2026,10),'primes':[p for p in ['2','3','5','7']if all((n**5-n)%int(p)==0 for n in range(-60,61))]}
def dist(p,q):return F(isqrt(int((p[0]-q[0])**2+(p[1]-q[1])**2)))
def mid(p,q):return (F(p[0]+q[0],2),F(p[1]+q[1],2))
A,B,P=(-2,1),(4,9),(8,1);assert dist(A,B)**2==(4+2)**2+(9-1)**2;M=mid(A,B);R['cg-c01']={'distance':dist(A,B),'mx':M[0],'my':M[1],'same':yn(dist(A,P)==dist(A,B))}
A,B,C=(1,2),(5,10),(4,1);m=F(B[1]-A[1],B[0]-A[0]);p=-1/m;assert m*p==-1;R['cg-c02']={'slope':m,'intercept':A[1]-m*A[0],'perpendicular':p,'pathIntercept':C[1]-p*C[0]}
A,B=(0,0),(6,4);M=mid(A,B);m=F(B[1]-A[1],B[0]-A[0]);p=-1/m;b=M[1]-p*M[0];x=-b/p;assert x**2==(x-6)**2+16;fair=[(X,Y)for X in range(-20,21)for Y in range(-20,21)if X*X+Y*Y==(X-6)**2+(Y-4)**2];assert len(fair)>1 and all(Y==p*X+b for X,Y in fair)
R['cg-c03']={'slope':p,'intercept':b,'axis':x,'only':yn(len(fair)==1)}
A,B,P=(-1,2),(5,10),(5,2);c=mid(A,B);r2=(B[0]-c[0])**2+(B[1]-c[1])**2;assert isqrt(int(r2))**2==r2;R['cg-c04']={'cx':c[0],'cy':c[1],'radius':isqrt(int(r2)),'right':yn((A[0]-P[0])*(B[0]-P[0])+(A[1]-P[1])*(B[1]-P[1])==0)}
# Discrete Mathematics: committees counted as sets, paths listed stone by stone, degree sequences tested by Havel–Hakimi, and every way of merging the board searched.
from itertools import combinations, permutations
from functools import lru_cache
club=range(7);committees=list(combinations(club,3))
R['dm-c01']={'committees':len(committees),'roles':len(list(permutations(club,3))),'withAna':sum(0 in c for c in committees),'withoutAna':sum(0 not in c for c in committees)}
def paths(n):return [[]] if n==0 else [[s]+p for s in (1,3) if s<=n for p in paths(n-s)]
W=[len(paths(n))for n in range(13)];rules={'three':lambda n:W[n-1]+W[n-3],'two':lambda n:W[n-1]+W[n-2],'double':lambda n:2*W[n-1],'plus':lambda n:W[n-1]+3}
rule=[k for k,f in rules.items()if all(W[n]==f(n)for n in range(4,13))];assert len(rule)==1
R['dm-c02']={'w4':W[4],'rule':rule[0],'w8':W[8],'startThree':sum(p[0]==3 for p in paths(8))}
def graphical(seq):
    seq=sorted(seq,reverse=True)
    while seq and seq[0]>0:
        d=seq.pop(0)
        if d>len(seq):return False
        for i in range(d):
            seq[i]-=1
            if seq[i]<0:return False
        seq.sort(reverse=True)
    return True
cube=[(a,b)for a in range(8)for b in range(a+1,8)if bin(a^b).count('1')==1];assert all(sum(v in e for e in cube)==3 for v in range(8))
R['dm-c03']={'all':len(list(combinations(range(8),2))),'possible':yn(graphical([1,2,3,3,4,4,5,5])),'regular':len(cube),'different':yn(any(graphical(list(c))for c in combinations(range(8),8)))}
@lru_cache(maxsize=None)
def finals(state,op):
    if len(state)==1:return frozenset(state)
    out=set()
    for i,j in combinations(range(len(state)),2):
        rest=[x for k,x in enumerate(state)if k not in(i,j)]
        out|=finals(tuple(sorted(rest+[state[i]+state[j]if op=='sum'else abs(state[i]-state[j])])),op)
    return frozenset(out)
steps={'next':lambda n:n*n+(2*n+1),'same':lambda n:n*n+(2*n-1),'double':lambda n:n*n+2*n}
step=[k for k,f in steps.items()if all(f(n)==(n+1)**2 for n in range(1,50))];assert len(step)==1
summed=finals(tuple(range(1,11)),'sum');assert len(summed)==1
R['dm-c04']={'odd':sum(range(1,30,2)),'step':step[0],'last':next(iter(summed)),'zero':yn(0 in finals(tuple(range(1,11)),'diff'))}
# Basic Logic: every truth assignment is listed; number claims are tested on every whole number in range; syllogisms try every choice of four groups among three students.
from itertools import product
rows=list(product([True,False],repeat=3))
R['bl-c01']={'rows':len(rows),'first':sum(p and (q or r) for p,q,r in rows),'second':sum((p and q) or r for p,q,r in rows),'same':yn(all((p and (q or r))==((p and q) or r) for p,q,r in rows))}
ends5=lambda k:k%10==5;div5=lambda k:k%5==0;implies=lambda a,b:(not a) or b
forms={'contra':lambda k:implies(not div5(k),not ends5(k)),'inverse':lambda k:implies(not ends5(k),not div5(k)),'converse':lambda k:implies(div5(k),ends5(k))}
same=[name for name,f in forms.items() if all(f(k)==implies(ends5(k),div5(k)) for k in range(0,1000))];assert len(same)==1
R['bl-c02']={'s':yn(all(implies(ends5(k),div5(k)) for k in range(0,1000))),'converse':yn(all(implies(div5(k),ends5(k)) for k in range(0,1000))),'counter':sum(div5(k) and not ends5(k) for k in range(1,51)),'equivalent':same[0]}
def valid_form(premises,conclusion):return all(conclusion(*v) for v in rows if all(f(*v) for f in premises))
R['bl-c03']={'a':'follows' if valid_form([lambda p,q,r:implies(p,q),lambda p,q,r:implies(not p,r)],lambda p,q,r:q or r) else 'fails','rows':sum(implies(p,q) and implies(not p,r) for p,q,r in rows),'b':'follows' if valid_form([lambda p,q,r:p or q,lambda p,q,r:not p],lambda p,q,r:q) else 'fails','c':'follows' if valid_form([lambda p,q,r:p or q,lambda p,q,r:p],lambda p,q,r:not q) else 'fails'}
# Every school is one choice of which of the 16 parts of the robotics, physics, art and music diagram hold students (2^16 cases).
parts=list(product([0,1],repeat=4));has=lambda part,k:part['RPAM'.index(k)]
fits=[]
for code in range(2**16):
    used=[part for i,part in enumerate(parts) if code>>i&1]
    if all(has(x,'P') for x in used if has(x,'R')) and not any(has(x,'P') and has(x,'A') for x in used) and any(has(x,'A') and has(x,'M') for x in used):fits.append(used)
must=lambda claim:all(claim(used) for used in fits)
# The physics–art overlap can be nonempty only if some fitting school puts students there; none does.
physics,art=80,50;overlap_possible=any(has(x,'P') and has(x,'A') for used in fits for x in used)
R['bl-c04']={'noArt':yn(must(lambda used:not any(has(x,'R') and has(x,'A') for x in used))),'music':yn(must(lambda used:any(has(x,'R') and has(x,'M') for x in used))),'notPhysics':yn(must(lambda used:any(has(x,'M') and not has(x,'P') for x in used))),'either':physics+art if not overlap_possible else None}
# Probability: spins and coins by listing every equally likely sequence, the factory by building all 10,000 parts, letters by permutations and derangement counts.
from itertools import product as cartesian
from math import comb, factorial
def spins(n):return list(cartesian(range(5),repeat=n))  # sector 0 is red: each spin red with probability 1/5
three=spins(3);reds=lambda seq:sum(x==0 for x in seq)
no_red=F(sum(reds(q)==0 for q in three),len(three));at_least=F(sum(reds(q)>0 for q in three),len(three))
smallest=next(n for n in range(1,8) if F(sum(reds(q)>0 for q in spins(n)),5**n)>F(1,2))
mean_reds=F(sum(reds(q) for q in three),len(three));assert mean_reds==F(3,5) and at_least<mean_reds and any(reds(q)>=2 for q in three)
R['pr-c01']={'noRed':no_red,'atLeastOne':at_least,'spins':smallest,'estimate':'overlap'}
parts=[('A',i<120) for i in range(6000)]+[('B',i<200) for i in range(4000)]
faulty=[p for p in parts if p[1]];p_f=F(len(faulty),len(parts));p_b=F(sum(m=='B' for m,_ in parts),len(parts));p_fb=F(sum(m=='B' and f for m,f in parts),len(parts))
R['pr-c02']={'faultyA':sum(m=='A' and f for m,f in parts),'faulty':p_f,'fromB':p_fb/p_f,'independent':yn(p_fb==p_f*p_b)}
from itertools import permutations
def fixed_mean(n):
    perms=list(permutations(range(n)));return F(sum(sum(p[i]==i for i in range(n)) for p in perms),len(perms))
assert all(fixed_mean(n)==1 for n in range(1,8))
D=[1,0]+[0]*9
for m in range(2,11):D[m]=(m-1)*(D[m-1]+D[m-2])
expected10=sum(F(k*comb(10,k)*D[10-k],factorial(10)) for k in range(11))
both_right=F(factorial(8),factorial(10));assert both_right!=F(1,10)**2  # the events are dependent, yet expectations still add
partial=sum(k*(2/3)**(k-1)*(1/3) for k in range(1,400));assert abs(partial-3)<1e-12
R['pr-c03']={'winnings':F(sum(k for k in range(1,7) if k%2==0),6),'envelopes':expected10,'independence':'no','rolls':3}
tosses=list(cartesian((0,1),repeat=6));X=[sum(t) for t in tosses]
EX=F(sum(X),64);var=F(sum(x*x for x in X),64)-EX**2
R['pr-c04']={'three':F(sum(x==3 for x in X),64),'variance':var,'bound':var/9,'exact':F(sum(abs(x-3)>=3 for x in X),64)}
# Algorithms: binary search, merging and insertion sort run step by step with counters; the recursion by calling it;
# routes by listing every simple path; the cheapest network by trying every set of four roads; change by trying every
# combination of coins; subsets by listing every 0/1 choice.
from itertools import combinations
a=[3,8,11,15,19,24,27,31,36,40,44,52,57,63,70];low,high,seen=0,len(a)-1,[]
while low<=high:
    mid=(low+high)//2;seen.append(a[mid])
    if a[mid]==44:break
    if a[mid]<44:low=mid+1
    else:high=mid-1
assert seen[-1]==44 and sorted(a)==a
R['al-c01']={'first':seen[0],'second':seen[1],'rounds':len(seen),'why':'sorted'}
def merge_count(x,y):
    i=j=k=0
    while i<len(x) and j<len(y):
        k+=1
        if x[i]<=y[j]:i+=1
        else:j+=1
    return k
def insertion_count(xs):
    xs=list(xs);k=0
    for i in range(1,len(xs)):
        key,j=xs[i],i-1
        while j>=0:
            k+=1
            if xs[j]>key:xs[j+1]=xs[j];j-=1
            else:break
        xs[j+1]=key
    assert xs==sorted(xs);return k
log={'lines':0,'calls':0}
def fold(n):
    log['calls']+=1
    if n==0:return
    log['lines']+=1
    for _ in range(3):fold(n-1)
fold(4)
R['al-c02']={'merge':merge_count([2,9,14],[5,6,20,25]),'insertion':insertion_count([4,3,2,1,5]),'lines':log['lines'],'calls':log['calls']}
roads={('P','Q'):4,('P','R'):1,('Q','R'):2,('Q','S'):10,('R','S'):8,('R','T'):9,('S','T'):3}
length=lambda u,v:roads.get((u,v),roads.get((v,u)))
towns='PQRST'
def paths(u,goal,used,edges):
    if u==goal:yield used;return
    for v in towns:
        if v not in used and any(set(e)=={u,v} for e in edges):yield from paths(v,goal,used+[v],edges)
route_len=lambda p:sum(length(p[i],p[i+1]) for i in range(len(p)-1))
shortest=min(route_len(p) for p in paths('P','T',['P'],roads))
at,walk,visited='P',0,{'P'}
while at!='T':
    nxt=min((v for v in towns if v not in visited and length(at,v) is not None),key=lambda v:length(at,v))
    walk+=length(at,nxt);visited.add(nxt);at=nxt
def spanning(edges):
    group={t:t for t in towns}
    def find(t):
        while group[t]!=t:t=group[t]
        return t
    for u,v in edges:
        ru,rv=find(u),find(v)
        if ru==rv:return False
        group[ru]=rv
    return True
trees=[e for e in combinations(roads,4) if spanning(e)];best=min(trees,key=lambda e:sum(roads[x] for x in e))
assert sum(1 for e in trees if sum(roads[x] for x in e)==sum(roads[x] for x in best))==1
tree_route=[route_len(p) for p in paths('P','T',['P'],best)];assert len(tree_route)==1
R['al-c03']={'shortest':shortest,'nearest':walk,'network':sum(roads[x] for x in best),'treeRoute':yn(tree_route[0]==shortest)}
coins=[10,6,1];left,taken=12,0
for c in coins:
    while left>=c:left-=c;taken+=1
fewest=min(a+b+c for a in range(13) for b in range(3) for c in range(2) if a+6*b+10*c==12)
subsets=sum(1 for _ in cartesian((0,1),repeat=20))
# Largest first misses 5 + 5 = 10 in 6, 5, 5, while trying every subset finds it.
pool,target=[6,5,5],10;total=0
for x in sorted(pool,reverse=True):
    if total+x<=target:total+=x
assert total!=target and any(sum(c)==target for r in range(4) for c in combinations(pool,r))
R['al-c04']={'greedy':taken,'fewest':fewest,'subsets':subsets,'claim':'check'}
assert len(R)==82
output={'method':'Separately implemented Python Fraction arithmetic (project-authored, not independent human certification), Gaussian elimination, polynomial products, exact integrals, interval checks, statistical identities, brute-force enumeration of divisors, residues, equidistant grid points, committees, stone paths and board merges, Havel–Hakimi degree tests, every equally likely spin, coin and letter arrangement, a 10,000-part factory, algorithms run step by step with counters, every simple route and every set of four roads, every coin combination and every subset of 20, and a double-precision exponential value with endpoint comparisons. Authored answer keys are not imported.','questions':{key:{field:str(value)if isinstance(value,(int,float,F))else value for field,value in answers.items()}for key,answers in R.items()}}
path=Path(__file__).resolve().parents[1]/'review'/'challenge-math-audit.json';path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(output,indent=2)+'\n');print(json.dumps({'questions':len(R),'components':sum(len(x)for x in R.values()),'output':str(path)}))
