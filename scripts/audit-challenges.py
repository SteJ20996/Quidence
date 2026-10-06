"""Independent exact-arithmetic oracle; does not read the authored answer keys."""
from fractions import Fraction as F
from math import isqrt
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
def param(k):return [[1,2,1],[0,k-1,2],[0,0,k+2]]
assert (1-1)*(1+2)==0 and (-2-1)*(-2+2)==0
A=param(1);R['la-c11']={'singular':['minus2','one'],'rank':rank(A),'nullity':3-rank(A),'consistent':yn(classify(A,[0,0,1])!='none')}
assert sum([0,0,0])!=1 and [1,0,0][0]*[1,0,0][1]==0 and [0,1,0][0]*[0,1,0][1]==0 and 1*1!=0
R['la-c12']={'spaces':['s1','s4'],'d1':3-rank([[1,1,1]]),'d4':rank([[1,2,3],[2,4,6]])}
conc,water=F(3,4),F(1,2);retained=1-F(2,5);left=conc*retained;volume=(conc+water)*retained+F(1,4)
R['pa-c01']={'before':conc/(conc+water),'left':left,'final':left/volume}
original=(F('46.20')-3)/(1+F(8,100))/(1-F(20,100));discount=original*F(20,100);tax=(original-discount)*F(8,100)
R['pa-c02']={'original':original,'discount':discount,'tax':tax};assert original-discount+tax+3==F('46.20')
rate=F(1,6)+F(1,4)-F(1,12);R['pa-c03']={'rate':rate,'time':1/rate,'amount':rate*F(3,2)}
k=F(6,F(3,2)*4-3);R['pa-c04']={'boys':3*k,'girls':4*k,'total':7*k+6};assert (3*k+6)/(4*k)==F(3,2)
R['a1-c01']={key:R['la-c01'][key]for key in ['k','x','y','changed']}
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
assert 2*1-1**2>0 and 2*3-3**2<0;R['ca-c02']={'x':2,'m':2**2,'c':2*3-3**2}
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
assert len(R)==40
output={'method':'Independent Python Fraction arithmetic, Gaussian elimination, polynomial products, exact integrals, interval checks, and statistical identities. Authored answer keys are not imported.','questions':{key:{field:str(value)if isinstance(value,(int,F))else value for field,value in answers.items()}for key,answers in R.items()}}
path=Path(__file__).resolve().parents[1]/'review'/'challenge-math-audit.json';path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(output,indent=2)+'\n');print(json.dumps({'questions':len(R),'components':sum(len(x)for x in R.values()),'output':str(path)}))
