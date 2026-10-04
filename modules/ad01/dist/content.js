(function(root){
'use strict';
const option=(id,label)=>({id,label});
const LESSONS=[
 {id:'limits',short:'Limits',title:'What happens near a point?',goal:'Separate a nearby trend from the value at the point.',
  steps:[
   {title:'Move toward the point.',text:'A limit describes the value that f(x) approaches as x gets close to a target. Move the distance slider toward zero. The moving point gets closer to the target without landing on it.',try:'Use both approach directions. What y-value does the moving point approach?'},
   {title:'A filled dot answers a different question.',text:'Here f(x) = (x² − 1)/(x − 1) = x + 1 when x ≠ 1, and f(1) is defined separately as 4. Nearby outputs approach 2. The filled dot at (1, 4) gives the function value; the open circle at (1, 2) marks the missing point on the line.',try:'Compare the nearby y-value with f(1). They need not match.'},
   {title:'Check both sides.',text:'A two-sided limit must agree from the left and from the right. Switch to the jump example: outputs approach −1 from the left and 1 from the right at x = 0. Because those values differ, there is no two-sided limit there.',try:'Choose the jump example, then switch the approach direction.'},
   {title:'Connect the picture to notation.',text:'For the hole example, limₓ→₁ f(x) = 2, even though f(1) = 4. A graph and a finite list of nearby values suggest a pattern. The expression x + 1 justifies the exact limit; a slider alone is not a proof.',try:'Return to the hole example and use the smallest distance. Explain the distinction in one sentence.'}
  ],
  predict:{id:'p1',graph:'limit-predict',prompt:'The open circle is at (1, 2), and the filled dot is at (1, 4). As x approaches 1 from both sides, what does f(x) approach?',options:[option('2','2'),option('4','4'),option('none','No two-sided limit')],correct:['2'],explanation:'The nearby line approaches y = 2 on both sides. The filled dot instead says f(1) = 4.'},
  checks:[
   {id:'c1',graph:'limit-transfer',prompt:'In this new graph, the open circle is at (2, 4), and f(2) = 1. Which statement is correct?',options:[option('limit4','The limit at 2 is 4, while f(2) = 1.'),option('limit1','The limit at 2 is 1, while f(2) = 4.'),option('none','The limit cannot exist because there is an open circle.')],correct:['limit4'],explanation:'For x ≠ 2, this graph follows x + 2. Nearby outputs approach 4, while the separate filled dot gives f(2) = 1.'},
   {id:'c2',graph:'jump-transfer',prompt:'At x = 0, this graph approaches 0 from the left and 3 from the right. What is the two-sided limit?',options:[option('0','0'),option('3','3'),option('none','It does not exist.')],correct:['none'],explanation:'The one-sided limits are different: 0 and 3. Neither the value at the point nor their average creates a two-sided limit.'}
  ],next:'Describe the left-hand limit, right-hand limit, and function value separately for a new graph.'
 },
 {id:'derivatives',short:'Derivatives',title:'How fast is it changing right here?',goal:'Connect a secant slope, a tangent slope, and instantaneous change.',
  steps:[
   {title:'Start with two points.',text:'A secant line joins P = (a, f(a)) and Q = (a + h, f(a + h)). Its slope is Δy/Δx = [f(a + h) − f(a)]/h. This is the average change per unit of x over that interval.',try:'Move a, then change the distance |h|. Watch the triangle and the secant slope.'},
   {title:'Bring the second point closer.',text:'When h approaches zero from both sides and the slopes approach one value, that limit is f′(a), the derivative at a. For f(x) = x², the secant slope is 2a + h, so the tangent slope is exactly 2a.',try:'Keep a fixed. Make |h| small and compare the secant and tangent slopes.'},
   {title:'Read the sign, not just the steepness.',text:'A positive derivative means the function is increasing locally; a negative derivative means it is decreasing locally. For x² at a = −1, f′(a) = −2. The function value is 1, but the slope is −2. A horizontal tangent has slope zero.',try:'Compare a = −1, 0, and 1. Optionally show the derivative graph f′(x) = 2x.'},
   {title:'A corner can break the limit.',text:'Switch to |x| and set a = 0. Secants from the left have slope −1; secants from the right have slope 1. There is no single derivative at the corner. Continuity by itself does not guarantee a derivative.',try:'Compare both directions at the corner. A tangent is not drawn when the derivative is undefined.'}
  ],
  predict:{id:'p2',graph:'derivative-predict',prompt:'The graph f(x) = x² is decreasing as it passes through x = −1. What is the sign of its tangent slope there?',options:[option('negative','Negative'),option('zero','Zero'),option('positive','Positive')],correct:['negative'],explanation:'The tangent slopes downward from left to right. Its slope is f′(−1) = 2(−1) = −2, even though f(−1) = 1.'},
  checks:[
   {id:'c3',graph:'derivative-transfer',prompt:'A tangent to f(x) = x³ at x = −1 rises 3 units for a run of 1 unit. What is f′(−1)?',options:[option('3','3'),option('negative1','−1'),option('0','0')],correct:['3'],explanation:'The derivative is the tangent slope, 3/1 = 3. The function value f(−1) = −1 answers a different question. Algebra confirms f′(x) = 3x².'},
   {id:'c4',graph:'corner-transfer',prompt:'For f(x) = |x| at x = 0, slopes approach −1 from the left and 1 from the right. Does f′(0) exist?',options:[option('none','No: the two slope limits differ.'),option('0','Yes: it is their average, 0.'),option('1','Yes: the right-hand slope is 1.')],correct:['none'],explanation:'The derivative requires the same finite slope limit from both sides. At the corner of |x| those limits differ, so f′(0) does not exist.'}
  ],next:'Sketch where a curve has positive, negative, zero, or undefined derivative, then explain your choices.'
 },
 {id:'integrals',short:'Integrals',title:'What do small changes add up to?',goal:'Connect rectangle sums to a definite integral and distinguish signed accumulation from total area.',
  steps:[
   {title:'One rectangle, one small contribution.',text:'A rectangle uses a sample height f(xᵢ) and a width Δx. Their product estimates the contribution over that small interval. If the graph is velocity in meters per second and x is time in seconds, the rectangle has units of meters.',try:'Choose the positive curve and use a small number of rectangles.'},
   {title:'Add the pieces.',text:'The sum Σ f(xᵢ)Δx estimates the definite integral. Left, right, and midpoint rules use different sample points. As all widths approach zero, these sums converge for the continuous curves here. A finer partition need not reduce every possible approximation error on every step.',try:'Change the sampling rule, then increase n. Compare each sum with the exact integral.'},
   {title:'Below the axis counts negatively.',text:'The definite integral adds signed contributions. For f(x) = x on [−2, 2], the negative and positive parts cancel, giving 0. The total geometric area is 4. With velocity, the integral is displacement; integrating the absolute value gives distance traveled.',try:'Choose the signed example. Compare the signed integral with total area.'},
   {title:'A limit gives the exact accumulation.',text:'The integral ∫ₐᵇ f(x) dx is the limit of the rectangle sums here. For x² from 0 to 2, the exact value is 8/3. More rectangles illustrate convergence; the exact formula comes from mathematics, not from a finite picture.',try:'Try all three sampling rules at n = 64. Which differences remain?'}
  ],
  predict:{id:'p3',graph:'integral-predict',prompt:'For f(x) = x on [−2, 2], equal-sized regions lie below and above the axis. What is the signed integral?',options:[option('0','0'),option('4','4'),option('negative4','−4')],correct:['0'],explanation:'The negative contribution is −2 and the positive contribution is 2. The signed integral is 0; total area is 4.'},
  checks:[
   {id:'c5',graph:'constant-transfer',prompt:'A constant velocity is 3 m/s from t = 0 to t = 4 s. What displacement does the area represent?',options:[option('12','12 m'),option('3','3 m'),option('7','7 m')],correct:['12'],explanation:'Height × width = (3 m/s)(4 s) = 12 m. A definite integral of velocity gives signed displacement.'},
   {id:'c6',graph:'signed-transfer',prompt:'The velocity v(t) = t − 2 on [0, 4] has a negative contribution of −2 m and a positive contribution of 2 m. Which pair is correct?',options:[option('0and4','Displacement: 0 m; distance traveled: 4 m.'),option('4and0','Displacement: 4 m; distance traveled: 0 m.'),option('0and0','Both are 0 m.')],correct:['0and4'],explanation:'Displacement adds −2 + 2 = 0 m. Distance adds their magnitudes, 2 + 2 = 4 m.'}
  ],next:'Explain what the height, width, product, and sign mean before calculating an integral.'
 },
 {id:'connection',short:'The connection',title:'Watch accumulation become a new curve.',goal:'See why the slope of an accumulation function equals the original continuous function.',
  steps:[
   {title:'Let the endpoint move.',text:'Define A(x) = ∫₀ˣ f(t) dt. Now every endpoint x gives a signed accumulated value. The first graph shows f(t) = t² − 1. The second shows A(x) = x³/3 − x. For negative x, the integral reverses the orientation from 0 to x.',try:'Move x. Compare the shaded contribution in the first graph with A(x) in the second.'},
   {title:'A thin slice changes the accumulation.',text:'When x moves by a small h, the change A(x + h) − A(x) is the signed contribution of the new interval. Dividing by h gives the average value of f over that oriented interval.',try:'Keep x fixed and shrink |h|. Compare ΔA/h with f(x).'},
   {title:'The slope matches the original height.',text:'The Fundamental Theorem of Calculus says A′(x) = f(x) where f is continuous. At x = 0, f(x) = −1, so A is decreasing there. At x = ±1, f(x) = 0, so A has a horizontal tangent. Above the axis, f makes A increase.',try:'Move x across −1, 0, and 1. Match the height of f to the slope of A.'},
   {title:'Two views of the same relationship.',text:'Derivatives describe local change; integrals describe signed accumulation. If F′ = f and f is continuous on [a, b], then ∫ₐᵇ f(x) dx = F(b) − F(a). Changing the accumulation starting point adds a constant and does not change its derivative.',try:'Explain why A can be decreasing even when its value is positive.'}
  ],
  predict:{id:'p4',graph:'connection-predict',prompt:'A(x) = ∫₀ˣ f(t) dt, with continuous f. At a point where f(x) = −1, what happens to A locally?',options:[option('decrease','A is decreasing; its slope is −1.'),option('increase','A is increasing; integrals always increase.'),option('zero','A must have value zero.')],correct:['decrease'],explanation:'A′(x) = f(x) = −1. This fixes the slope of A at the point, not the value of A.'},
  checks:[
   {id:'c7',graph:'connection-transfer',prompt:'B(x) = ∫₁ˣ 2t dt = x² − 1. At x = 1.5, what is the tangent slope B′(1.5)?',options:[option('3','3'),option('1.25','1.25'),option('1','1')],correct:['3'],explanation:'B′(x) = 2x, so B′(1.5) = 3. The value B(1.5) = 1.25 is the accumulation, not the slope.'},
   {id:'c8',graph:'connection-sign',prompt:'For A(x) = ∫₀ˣ (t² − 1) dt, on which open interval is A decreasing?',options:[option('middle','−1 < x < 1'),option('right','1 < x < 2'),option('all','Everywhere from −2 to 2')],correct:['middle'],explanation:'A′(x) = x² − 1 is negative precisely when −1 < x < 1. The sign of A itself does not decide whether A is increasing or decreasing.'}
  ],next:'Use the sign of f to predict where its accumulation function rises, falls, and has horizontal tangents.'
 }
];
const api={VERSION:'ad01-beta-0.1',LESSONS};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AD01Content=api;
})(typeof window==='undefined'?globalThis:window);
