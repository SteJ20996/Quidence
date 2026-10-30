(function(root){
'use strict';
const range=(name,label,min,max,step=1)=>({name,label,min,max,step});
const select=(name,label,values)=>({name,label,options:values.map(v=>[v,String(v)]),numeric:true});
const choice=(name,label,options)=>({name,label,options,wide:true});
const step=(title,text,tryIt)=>({title,text,try:tryIt});
const question=(prompt,labels,explanation)=>({prompt,options:labels.map((label,i)=>({id:String(i),label})),correct:['0'],explanation});
const lesson=(short,title,goal,defaults,controls,steps,questions,next)=>({short,title,goal,defaults,controls,steps,questions,next});
const DATA={
'pre-algebra':[
 lesson('Signed numbers','What does a signed change mean?','Separate the starting value, the change, and the ending value.',{start:-3,change:5},[range('start','Starting value',-4,4),range('change','Signed change',-6,6)],[
 step('Name the starting point.','A signed number locates a point relative to zero. Negative is left of zero on this number line.','Set the starting value to −3 and identify its distance from zero.'),
 step('A sign also describes a change.','Adding a positive change moves right; adding a negative change moves left. The change and the starting value are different quantities.','Compare adding 5 with adding −5 at the same start.'),
 step('Keep the full expression.','Starting at −3 and adding 5 ends at 2. Starting at 3 and adding −5 ends at −2. The magnitude alone does not determine the endpoint.','Find two different starts and changes that end at 0.'),
 step('Check a subtraction by adding its opposite.','Subtracting −4 has the same effect as adding 4. Both undo a leftward change of 4.','Compare −2 − (−4) with −2 + 4 on paper.')
 ],[
 question('A temperature starts at −3°C and rises by 5°C. What is the final temperature?',['2°C','−8°C','8°C'],'−3 + 5 = 2. The increase is a change, not the final temperature.'),
 question('An account starts at 4 and changes by −7. What is the ending value?',['−3','3','11'],'4 + (−7) = −3. The change crosses zero.'),
 question('Evaluate −2 − (−6).',['4','−8','−4'],'Subtracting −6 is adding 6: −2 + 6 = 4.')
 ],'Use a new signed start and change, then explain the endpoint and direction.'),
 lesson('Fractions','What counts as the same whole?','Use equal parts and compare fractions with a shared reference whole.',{numerator:3,denominator:4},[range('numerator','Shaded parts',0,4),select('denominator','Equal parts in one whole',[4,8])],[
 step('Define one whole.','A fraction compares selected equal parts with the number of equal parts in one whole. Changing the reference whole changes what the fraction measures.','Read the denominator before counting the shaded parts.'),
 step('Equivalent fractions keep the amount.','Three of four equal parts and six of eight equal parts cover the same fraction of an unchanged whole. Both numerator and denominator multiply by 2.','Compare 2/4 and 4/8 on paper.'),
 step('Addition needs compatible units.','For the same whole, 1/2 + 1/4 = 2/4 + 1/4 = 3/4. The denominator names the part size; it is not added.','Explain why 2/6 is not the sum of 1/2 and 1/4.'),
 step('Multiplication can describe part of a part.','Half of three quarters is 3/8 of the original whole. Splitting each quarter in half produces eighths.','Describe what 1/2 × 3/4 means before multiplying.')
 ],[
 question('Which fraction equals 3/4 for the same whole?',['6/8','3/8','4/3'],'Multiply numerator and denominator by 2; the share stays unchanged.'),
 question('For the same whole, what is 1/3 + 1/6?',['1/2','2/9','1/9'],'1/3 = 2/6, so the sum is 3/6 = 1/2.'),
 question('What fraction of a whole is half of 2/3?',['1/3','2/6 of a different whole only','3/2'],'1/2 × 2/3 = 2/6 = 1/3 of the original whole.')
 ],'Draw one fixed whole and show equivalent fractions, a sum, and a part of a part.'),
 lesson('Ratios & unit rates','What stays constant in a proportional relationship?','Connect a ratio, a unit rate, and a multiplicative rule.',{rate:3},[range('rate','Price per item ($)',1,8)],[
 step('Keep the two quantities and units.','A unit rate tells how much of one quantity corresponds to one unit of another. Here it is dollars per item.','Read the cost for exactly one item.'),
 step('Scale both quantities together.','At $3 per item, two items cost $6 and five items cost $15. The cost-to-item ratio is unchanged.','Check cost/items in two rows.'),
 step('Percent means per hundred.','25% of 80 means 25/100 × 80 = 20. The percentage names a relative share, while 20 is an amount.','Find 10% of 80, then compare it with 25%.'),
 step('Watch for a fixed starting fee.','A $2 delivery fee plus $3 per item gives cost = 2 + 3n. The total cost per item then changes with n, so total cost is not proportional to item count.','Compare one-item and two-item total cost when a fixed fee is added.')
 ],[
 question('Three notebooks cost $12 with no fixed fee. What is the unit price?',['$4 per notebook','$36 per notebook','$0.25 per notebook'],'12/3 = 4 dollars per notebook.'),
 question('What is 30% of 90?',['27','3','60'],'0.30 × 90 = 27.'),
 question('Which total cost rule is proportional to the number of items n?',['C = 5n','C = 5n + 2','C = n²'],'C/n = 5 stays constant for positive n, and the rule has no fixed fee.')
 ],'Compare a unit-price rule with a rule that includes a fixed fee.'),
 lesson('Expressions','How is an expression different from an equation?','Substitute values, combine like terms, and keep operations in order.',{x:2},[range('x','Input x',-3,5)],[
 step('An expression gives a calculation.','2x + 3 is an expression. Choosing x supplies an input; it does not ask you to solve an equation.','Evaluate it at x = 2.'),
 step('A coefficient means multiplication.','2x means 2 × x. At x = −2, 2x + 3 = −4 + 3 = −1.','Try a negative input and keep its sign.'),
 step('Combine terms with the same variable part.','3x + 2x = 5x, but 3x + 2 cannot be combined as 5x. The constant does not count another x.','Compare 3x + 2x with 3x + 2 at x = 4.'),
 step('Distribute over the entire group.','2(x + 3) = 2x + 6 because both terms inside the parentheses are multiplied by 2.','Use x = 1 to check both forms.')
 ],[
 question('Evaluate 2x + 3 at x = 4.',['11','14','9'],'Multiply first: 2 × 4 + 3 = 11.'),
 question('Which expression equals 4a + 3a − 2 for every a?',['7a − 2','5a','7a² − 2'],'The two variable terms combine to 7a; the constant remains −2.'),
 question('Which expression equals 3(y − 2) for every y?',['3y − 6','3y − 2','y − 6'],'Multiply both terms by 3: 3y − 6.')
 ],'Evaluate two equivalent expressions at a positive and a negative input.')
],
'algebra-1':[
 lesson('Equations','Which operations preserve an equation?','Solve a linear equation and verify the solution in the original.',{x:4},[range('x','Example solution x',-3,6)],[
 step('Equality compares two values.','An equation says two expressions have equal values. A solution is an input that makes this statement true.','Read both sides of the displayed equation.'),
 step('Undo addition on both sides.','For 2x + 3 = 11, subtract 3 from both sides to get 2x = 8. Changing only one side would not preserve equality.','Name the operation applied to both sides.'),
 step('Undo a nonzero coefficient.','Divide both sides of 2x = 8 by 2 to obtain x = 4. Reversible operations preserve the solution set here.','Choose another example solution and follow both steps.'),
 step('Substitute into the original.','At x = 4, 2(4) + 3 = 11. Checking the original helps detect arithmetic or sign errors.','Check your chosen solution before moving on.')
 ],[
 question('Solve 2x + 3 = 11.',['x = 4','x = 7','x = 5.5'],'Subtract 3, then divide by 2; substitution gives 11.'),
 question('Solve 3x − 5 = 10.',['x = 5','x = 5/3','x = 15'],'Add 5 to both sides: 3x = 15; divide by 3.'),
 question('Solve 4(x − 2) = 12.',['x = 5','x = 1','x = 14'],'Divide by 4 to get x − 2 = 3, then add 2.')
 ],'Solve a changed equation by two valid routes and check both results.'),
 lesson('Linear functions','What do slope and intercept tell you?','Connect a rule, a graph, and a constant rate of change.',{m:2,b:1},[range('m','Slope m',-2,2),range('b','Intercept b',-3,3)],[
 step('Read a rule as input and output.','In y = mx + b, each x determines one y. Plotting the pairs makes the relationship visible.','Read the output when x = 0.'),
 step('The intercept is the output at zero.','At x = 0, mx vanishes and y = b. The point (0, b) is the y-intercept.','Change b while keeping m fixed.'),
 step('Slope compares changes.','Slope is change in y divided by change in x. A slope of 2 means y increases by 2 for every increase of 1 in x.','Change m and compare the direction of the line.'),
 step('Zero slope is still a function.','When m = 0, y = b is horizontal. Every input has the same output; the graph is not a vertical line.','Set m = 0, then compare with m = −1.')
 ],[
 question('For y = 3x − 2, what is the y-intercept?',['(0, −2)','(−2, 0)','(0, 3)'],'Set x = 0 to get y = −2.'),
 question('A line passes through (1, 2) and (4, 8). What is its slope?',['2','6','1/2'],'(8 − 2)/(4 − 1) = 6/3 = 2.'),
 question('Which rule has output decreasing by 4 when input increases by 1?',['y = −4x + 7','y = 4x − 7','y = x − 4'],'The coefficient −4 is the constant output change per input unit.')
 ],'Build a line from an intercept and rate, then verify a second point.'),
 lesson('Systems','What does a shared solution mean?','Find and check a pair that satisfies two equations at once.',{b:6},[range('b','Intercept of second line',4,10)],[
 step('Two equations impose two conditions.','A system asks for a pair (x, y) that satisfies both equations. A solution to only one equation is not enough.','Read y = x + 2 and the second rule.'),
 step('The intersection meets both conditions.','At a crossing, the same x gives the same y in both rules. For y = x + 2 and y = −x + 6, x = 2 and y = 4.','Check both rules at the intersection.'),
 step('Substitution compares the outputs.','Set x + 2 = −x + 6, collect 2x = 4, then get x = 2. Substitute to obtain y = 4.','Change the second intercept and find the new pair.'),
 step('A crossing is not guaranteed.','Distinct parallel lines have no common solution. Identical lines have infinitely many common points. A graph window alone may hide an intersection.','Compare y = x + 2 with y = x + 5 on paper.')
 ],[
 question('For y = x + 1 and y = −x + 5, which pair satisfies both?',['(2, 3)','(3, 2)','(0, 1)'],'x + 1 = −x + 5 gives x = 2 and y = 3.'),
 question('Solve x + y = 9 and x − y = 3.',['(6, 3)','(3, 6)','(9, 3)'],'Adding yields 2x = 12; then y = 3. Both original equations hold.'),
 question('How many solutions do y = 2x + 1 and y = 2x − 4 have?',['None','Exactly one','Infinitely many'],'The slopes match but intercepts differ; equating outputs would give 1 = −4.')
 ],'Check a proposed pair in each original equation, including a no-solution example.'),
 lesson('Quadratic roots','Why does a factor reveal a zero?','Use the zero-product rule and distinguish zeros from the vertex.',{r:4},[range('r','Second root',2,5)],[
 step('A zero is an input with output zero.','A graph zero lies on the x-axis. It is an x-value, not necessarily a turning point.','Identify the two crossings.'),
 step('A zero product has a zero factor.','For (x − 1)(x − 4) = 0, at least one factor must be zero: x = 1 or x = 4.','Change the second root and inspect the factors.'),
 step('Keep every possible root.','x² − 9 = (x − 3)(x + 3), so both 3 and −3 are roots. Taking only the positive square root loses one solution.','Substitute both roots into x² − 9.'),
 step('Check the original and distinguish the vertex.','For two distinct roots, the vertex lies midway between their x-values for a quadratic. Its output generally differs from zero.','Compare a crossing with the lowest point of this parabola.')
 ],[
 question('Solve (x − 2)(x − 5) = 0.',['x = 2 or x = 5','x = 7 only','x = 10 only'],'Either factor can be zero; both roots belong in the solution set.'),
 question('Solve x² = 16 over the real numbers.',['x = −4 or x = 4','x = 4 only','x = 8 only'],'Both (−4)² and 4² equal 16.'),
 question('For y = (x + 1)(x − 3), which statement describes the zeros?',['The graph crosses the x-axis at x = −1 and x = 3.','The vertex must be (−1, 3).','The y-intercept is 3.'],'Set each factor to zero. The y-intercept is −3, and the vertex is a different point.')
 ],'Factor a new quadratic, list every root, and verify by substitution.')
],
geometry:[
 lesson('Angles','Which relationships determine an unknown angle?','Use straight-line and vertical-angle relationships with reasons.',{angle:60},[range('angle','One adjacent angle (degrees)',20,160,10)],[
 step('Identify the shared vertex and rays.','An angle describes the turn between two rays with a shared endpoint. Angle measure is independent of how long the drawn rays are.','Identify the vertex before reading the measure.'),
 step('A straight turn is 180 degrees.','Two adjacent angles whose outer rays form a straight line add to 180°. An arbitrary adjacent pair need not do so.','Change one angle and find the other.'),
 step('Vertical angles are equal.','When two straight lines cross, opposite angles are equal. Each is supplementary to the same adjacent angle.','Draw crossed lines and explain why the opposite measures match.'),
 step('State the geometric condition.','A reason such as “they look equal” is weaker than identifying vertical angles or a straight line. Drawings may not be to scale.','Explain which relationship would still hold if the drawing changed.')
 ],[
 question('Two adjacent angles form a straight line. One is 65°. What is the other?',['115°','65°','25°'],'The straight-line condition gives 180 − 65 = 115°.'),
 question('Two straight lines cross. An angle is 38°. What is its vertically opposite angle?',['38°','142°','76°'],'Vertical angles are equal; 142° is the adjacent supplement.'),
 question('Two angles are adjacent, with no other information. Must they sum to 180°?',['No; their outer rays must form a straight line.','Yes; all adjacent angles are supplementary.','No; adjacent angles always sum to 90°.'],'Adjacency alone does not specify a straight turn.')
 ],'For an unknown angle, name the relationship and its geometric conditions.'),
 lesson('Triangles','When does the Pythagorean relationship apply?','Identify a right triangle, its legs, and its hypotenuse.',{a:3},[range('a','Horizontal leg',3,6)],[
 step('Identify the right angle.','The equation a² + b² = c² applies to a right triangle, where c is opposite the 90° angle.','Locate the right-angle marker.'),
 step('Use squares of the lengths.','With legs 3 and 4, c² = 9 + 16 = 25, so c = 5 because a length is positive.','Change a leg and compare c with both legs.'),
 step('A hypotenuse is not another leg.','When a hypotenuse and one leg are known, subtract the known leg square from c². Adding them would find the wrong quantity.','For c = 13 and one leg = 5, compute the other leg.'),
 step('Keep triangle angle relationships separate.','The interior angles of a Euclidean triangle sum to 180°. A right triangle therefore has two acute angles summing to 90°, but their individual values need not be equal.','Give two different acute-angle pairs for right triangles.')
 ],[
 question('A right triangle has legs 6 and 8. What is its hypotenuse?',['10','14','100'],'c = √(36 + 64) = 10.'),
 question('A right triangle has hypotenuse 13 and one leg 5. What is the other leg?',['12','√194','8'],'The unknown leg square is 169 − 25 = 144, so its length is 12.'),
 question('A triangle has angles 47° and 68°. What is the third interior angle?',['65°','115°','21°'],'180 − 47 − 68 = 65°, using the triangle angle sum.')
 ],'Identify the known and unknown triangle quantities before choosing a relationship.'),
 lesson('Similarity','How do lengths and areas scale?','Use corresponding lengths and separate scale factors for length and area.',{k:2},[select('k','Length scale factor',[0.5,1,2,3])],[
 step('Match corresponding parts.','Similar figures have equal corresponding angles and proportional corresponding lengths. Correspondence determines which ratios can be compared.','Read original width and scaled width in the table.'),
 step('Multiply each length by k.','A length scale factor of 2 changes a 3-by-2 rectangle to 6-by-4. Its perimeter also doubles.','Compare all length ratios.'),
 step('Area changes by k squared.','Both width and height multiply by k, so their product multiplies by k². Doubling lengths quadruples area.','Compare k = 2 and k = 0.5.'),
 step('Congruence is stronger than similarity.','Similar figures can differ in size. Congruent figures have matching shape and size; their corresponding lengths agree.','Explain what is special about k = 1.')
 ],[
 question('Similar triangles have corresponding sides 4 and 10. What is the scale factor from the first to the second?',['2.5','0.4','6'],'Second/first = 10/4 = 2.5.'),
 question('Every length of a figure is multiplied by 3. What happens to its area?',['It multiplies by 9.','It multiplies by 3.','It increases by 6 square units.'],'Area has two length dimensions, each scaled by 3.'),
 question('Must two similar triangles be congruent?',['No; their sizes can differ.','Yes; equal angles force equal lengths.','No; similar triangles never have equal angles.'],'Similarity fixes shape and length ratios; congruence also fixes size.')
 ],'Match corresponding sides, then predict length, perimeter, and area changes.'),
 lesson('Measurement','Which quantity does the calculation measure?','Separate area, perimeter, and volume and attach the correct units.',{width:5},[range('width','Rectangle width (units)',2,8)],[
 step('Perimeter measures the boundary.','A rectangle with width w and height h has perimeter 2w + 2h, measured in length units.','Trace all four sides of the rectangle.'),
 step('Area measures the covered surface.','The rectangle area is wh, measured in square units. The same area can accompany different perimeters.','Compare widths 4 and 6 with a fixed height.'),
 step('A triangle uses half a base-height rectangle.','Triangle area is bh/2 when h is perpendicular to the chosen base. A slanted side is not automatically the height.','Draw a perpendicular height for a new triangle.'),
 step('Volume introduces a third length dimension.','A rectangular prism has volume lwh in cubic units. Keeping units visible helps distinguish a boundary, surface, and solid amount.','Find the volume of a 2-by-3-by-4 prism.')
 ],[
 question('A rectangle measures 7 cm by 3 cm. What is its perimeter?',['20 cm','21 cm²','10 cm'],'2(7 + 3) = 20 cm; 21 cm² is its area.'),
 question('A triangle has base 8 m and perpendicular height 5 m. What is its area?',['20 m²','40 m²','13 m'],'8 × 5 / 2 = 20 square meters.'),
 question('A rectangular prism measures 2 cm by 3 cm by 5 cm. What is its volume?',['30 cm³','10 cm²','20 cm'],'Multiply three lengths: 2 × 3 × 5 = 30 cubic centimeters.')
 ],'For a new figure, identify whether the question asks for boundary, surface, or volume.')
],
'algebra-2':[
 lesson('Polynomial factors','What does a polynomial factor tell you?','Connect factors, roots, and the number of distinct zeros.',{r:3},[range('r','Third root',2,4)],[
 step('A factor describes a multiplicative piece.','The product (x + 1)(x − 1)(x − 3) is a cubic polynomial because its highest-power term is x³.','Locate each factor and its zero.'),
 step('Apply the zero-product rule.','The zeros are −1, 1, and 3. Changing one factor changes its corresponding root.','Change the third root while holding the others fixed.'),
 step('Repeated factors do not create new distinct roots.','(x − 2)²(x + 1) has degree 3 but only two distinct real roots: 2 and −1. Multiplicity counts repeats.','List both distinct roots and their multiplicities.'),
 step('Not all roots must be real.','x² + 1 has no real zero because x² is nonnegative for real x. It has complex roots, which this first lesson does not develop.','Explain why a graph with no real crossing need not be a constant function.')
 ],[
 question('What are the distinct real zeros of (x + 2)(x − 1)(x − 4)?',['−2, 1, 4','2, −1, −4','−2, 4 only'],'Set each factor to zero and keep all three roots.'),
 question('How many distinct real zeros does (x − 3)²(x + 1) have?',['Two','Three','One'],'The root 3 repeats, but distinct roots are 3 and −1.'),
 question('Which polynomial has no real zero?',['x² + 4','x² − 4','x(x − 4)'],'For real x, x² + 4 ≥ 4, so it cannot equal zero.')
 ],'Compare a polynomial’s degree, distinct roots, and repeated factors.'),
 lesson('Rational restrictions','What survives after cancellation?','Keep original domain restrictions when simplifying rational expressions.',{k:2},[range('k','Excluded input k',1,4)],[
 step('A denominator cannot be zero.','In (x² − 4)/(x − 2), the original expression is undefined at x = 2.','Check the denominator at the middle table input.'),
 step('Factor before canceling.','x² − 4 = (x − 2)(x + 2). For x ≠ 2, canceling the nonzero common factor leaves x + 2.','Read the simplified rule together with the restriction.'),
 step('An equivalent rule needs its domain.','The unrestricted line y = x + 2 includes (2, 4); the original rational function does not. The simplified formula does not fill the hole.','Compare evaluating the original with evaluating the unrestricted line.'),
 step('Cancel factors rather than individual terms.','In (x + 2)/x, the x is not a common factor of the entire numerator. For nonzero x the rule is 1 + 2/x, not 2.','Test both expressions at x = 2.')
 ],[
 question('Simplify (x² − 9)/(x − 3) on its original domain.',['x + 3, with x ≠ 3','x + 3, including x = 3','x − 3, with x ≠ 3'],'Factor the numerator; cancel only for x ≠ 3, preserving that exclusion.'),
 question('At x = 4, what is the value of (x² − 16)/(x − 4)?',['Undefined','8','0'],'The original denominator is zero at 4, even though x + 4 is the simplified rule elsewhere.'),
 question('For x ≠ 0, which rule equals (x + 5)/x?',['1 + 5/x','5','x + 5'],'Divide both numerator terms by x; there is no common x factor to cancel from x + 5.')
 ],'State original exclusions before simplifying, then check one excluded and one allowed input.'),
 lesson('Exponential models','What makes percentage change multiplicative?','Distinguish a repeated factor from a repeated fixed difference.',{factor:1.2},[select('factor','Factor per period',[0.5,0.8,1.1,1.2,1.25])],[
 step('Name the initial amount.','In y = 100bᵗ, the initial amount at t = 0 is 100 because b⁰ = 1.','Read the graph at time 0.'),
 step('A percentage becomes a factor.','A 20% increase keeps the original 100% and adds 20%, giving factor 1.20. A 20% decrease gives factor 0.80.','Compare the growth and decay settings.'),
 step('Repeat the factor for each period.','After two 20% increases, 100 × 1.2² = 144. Adding a fixed 20 twice gives 140 and describes a different model.','Read the amounts at t = 1 and t = 2.'),
 step('State the model assumptions.','A constant percentage model assumes the same proportional change each period. Real quantities may not follow it indefinitely.','Give a situation in which the rate might change.')
 ],[
 question('An amount of 80 grows by 25% each period. What is it after two periods?',['125','120','100'],'80 × 1.25² = 125.'),
 question('An amount of 200 loses 10% of its current value each hour. What remains after two hours?',['162','160','180'],'200 × 0.9² = 162.'),
 question('Which rule represents an initial amount of 50 growing by 8% per period t?',['y = 50(1.08)ᵗ','y = 50 + 8t','y = 50(0.08)ᵗ'],'1.08 is the multiplicative factor that retains 100% and adds 8%.')
 ],'Write the starting amount and factor before predicting a later amount.'),
 lesson('Logarithms','Which exponent gives this output?','Interpret a logarithm as an inverse question and preserve its domain.',{base:2},[select('base','Base b',[2,3,10])],[
 step('Start with a power question.','2³ = 8 asks for the output of a known exponent. log₂8 = 3 asks for the exponent that gives 8.','Read the power table in both directions.'),
 step('Keep the base fixed.','log₃27 = 3 because 3³ = 27. Changing the base changes the inverse question.','Compare the same exponent in the different base settings.'),
 step('Keep the argument positive.','For real logarithms with base b > 0 and b ≠ 1, the argument must be positive. In log₂(x − 1), this requires x > 1.','Check whether x = 1 is allowed.'),
 step('A product rule does not become a sum rule.','For positive u and v, log_b(uv) = log_b(u) + log_b(v). There is no corresponding rule replacing log_b(u + v) by this sum.','Compare log₂(2 + 2) with log₂2 + log₂2, then try 2 + 6.')
 ],[
 question('What is log₃81?',['4','27','3'],'3⁴ = 81, so the logarithm is 4.'),
 question('What is the real domain of log₂(x − 5)?',['x > 5','x ≥ 5','All real x except 5'],'The argument must be strictly positive: x − 5 > 0.'),
 question('Which identity holds for every positive u and v?',['log₂(uv) = log₂u + log₂v','log₂(u + v) = log₂u + log₂v','log₂(u/v) = log₂u / log₂v'],'The product rule follows by adding exponents. The quotient rule subtracts logarithms.')
 ],'Translate a logarithm to a power equation and check the argument restrictions.')
],
'basic-logic':[
 lesson('Statements','When is a compound statement true?','Tell statements from other sentences, and work out “and”, “or” and “not” with a truth table.',{op:'and'},[choice('op','Connective',[['and','P and Q'],['or','P or Q'],['xor','P or Q, but not both'],['not','not P']])],[
 step('A statement is true or false.','A statement is a sentence that is either true or false, such as “7 is prime”. A question, a command, or “x + 1 = 5” with no value for x is not a statement yet.','Decide whether “Close the door.” and “12 is odd.” are statements.'),
 step('“And” needs both parts.','P and Q is true only when P and Q are both true. A truth table lists all four combinations of truth values for P and Q.','Choose “P and Q” and count its true rows.'),
 step('“Or” in mathematics is inclusive.','P or Q is true when at least one part is true, including when both are. “One or the other, but not both” is a different connective, the exclusive or.','Compare “P or Q” with “P or Q, but not both”.'),
 step('“Not” flips the truth value.','not P is true exactly when P is false. Negating “and” gives “or”: not (P and Q) means (not P) or (not Q). This is De Morgan’s law.','Negate “It is raining and it is cold.”')
 ],[
 question('Which sentence is a statement?',['“15 is a multiple of 4.”','“Is 15 a multiple of 4?”','“Write 15 as a product.”'],'A statement can be judged true or false; this one is false. A question or a command cannot be judged that way.'),
 question('P is true and Q is false. What is the truth value of “P or Q”?',['True','False','It cannot be decided.'],'“Or” needs at least one true part, and P is true.'),
 question('Which statement means the same as “not (it is raining and it is cold)”?',['It is not raining, or it is not cold.','It is not raining, and it is not cold.','It is raining, or it is cold.'],'The compound is false as soon as one part fails, so its negation needs only one part to be false. This is De Morgan’s law.')
 ],'Write a truth table for “P and not Q”, and say in words when it is true.'),
 lesson('Conditionals','When is “if P, then Q” false?','Find the one case that makes a conditional false, and compare it with its converse, inverse and contrapositive.',{form:'converse'},[choice('form','Compare with',[['converse','Converse: if Q, then P'],['inverse','Inverse: if not P, then not Q'],['contrapositive','Contrapositive: if not Q, then not P']])],[
 step('A promise that can be broken once.','“If P, then Q” is false only when P is true and Q is false. Think of a promise: “If you finish, then you may leave” is broken only if you finish and are not allowed to leave.','Find the false row in the table.'),
 step('A false “if” part keeps it true.','When P is false, “if P, then Q” is true whatever Q is, because nothing was promised about that case.','Check the two rows where P is false.'),
 step('The converse is a different statement.','The converse “if Q, then P” can be false while the original is true. “If a number is divisible by 4, then it is even” is true, but “if a number is even, then it is divisible by 4” is false: try 2.','Compare the original column with the converse column.'),
 step('The contrapositive says the same thing.','“If not Q, then not P” has the same truth value as the original in every row, so a proof may use either one. The inverse “if not P, then not Q” matches the converse instead.','Choose the contrapositive and compare the columns.')
 ],[
 question('“If it rains, the game is canceled.” In which case is this statement false?',['It rains and the game is not canceled.','It does not rain and the game is canceled.','It does not rain and the game is not canceled.'],'A conditional is false only when the “if” part is true and the “then” part is false.'),
 question('Which statement is equivalent to “If a shape is a square, then it has four sides”?',['If a shape does not have four sides, then it is not a square.','If a shape has four sides, then it is a square.','If a shape is not a square, then it does not have four sides.'],'This is the contrapositive. The other two are the converse and the inverse, and a rectangle shows that both are false.'),
 question('“If n is odd, then n² is odd” is true. Does that alone make “If n² is odd, then n is odd” true?',['No; the converse needs its own proof, even though it happens to be true.','Yes; a converse always has the same truth value.','No; the converse of a true statement is always false.'],'A converse is a different statement. Here it is true, but that has to be shown separately.')
 ],'Write the converse and the contrapositive of “If x > 3, then x > 1”, and decide which are true.'),
 lesson('Arguments','Valid argument or lucky conclusion?','Test an argument form with a truth table, and recognize two common fallacies.',{form:'mp'},[choice('form','Argument form',[['mp','If P then Q. P. So Q.'],['mt','If P then Q. Not Q. So not P.'],['ac','If P then Q. Q. So P.'],['da','If P then Q. Not P. So not Q.']])],[
 step('Valid means no counterexample row.','An argument is valid when every case that makes all the premises true also makes the conclusion true. Validity is about the form of the argument, not about whether its premises are actually true.','Find the rows where both premises are true.'),
 step('Two valid forms.','“If P then Q; P; so Q” (modus ponens) and “If P then Q; not Q; so not P” (modus tollens) are valid: no row has true premises and a false conclusion.','Choose each form and check the rows marked “Yes”.'),
 step('Affirming the consequent is a fallacy.','“If it rained, the street is wet. The street is wet. So it rained.” The street could be wet for another reason. The row with P false and Q true makes both premises true and the conclusion false.','Choose “If P then Q. Q. So P.” and find the counterexample row.'),
 step('Denying the antecedent is another fallacy.','“If P then Q; not P; so not Q” fails in the same row. Validity and truth are separate questions: a valid argument with a false premise can still reach a false conclusion.','Give an everyday example of denying the antecedent.')
 ],[
 question('“If a number ends in 0, it is divisible by 5. 35 is divisible by 5. So 35 ends in 0.” What is wrong?',['It affirms the consequent, so the form is invalid.','Nothing; the argument is valid.','The first premise is false.'],'Both premises are true and the conclusion is false, so the form cannot be valid. It reasons from Q back to P.'),
 question('Which argument form is valid?',['If P then Q. Not Q. So not P.','If P then Q. Not P. So not Q.','If P then Q. Q. So P.'],'Modus tollens has no row with true premises and a false conclusion. The other two are fallacies.'),
 question('A valid argument has a false premise. What do you know about its conclusion?',['It may be true or false.','It must be false.','It must be true.'],'Validity guarantees a true conclusion only when every premise is true.')
 ],'Decide whether “If P then Q. If Q then R. So if P then R.” is valid, using an eight-row table.'),
 lesson('Quantifiers','All, some, none: what follows?','Read and negate statements with “all”, “some” and “no”, and test syllogisms with a Venn diagram.',{form:'barbara'},[choice('form','Syllogism',[['barbara','All A are B. All B are C. So all A are C.'],['middle','All A are B. All C are B. So all A are C.'],['ferio','No B are C. Some A are B. So some A are not C.']])],[
 step('Read the quantifier.','“All A are B” says every A is a B. “Some A are B” says at least one thing is both. “No A are B” says nothing is both.','Look at the shaded parts of the diagram for “All A are B”.'),
 step('Negate a quantifier carefully.','The negation of “All A are B” is “Some A are not B”, not “No A are B”. The negation of “Some A are B” is “No A are B”.','Negate “All the trains were late.”'),
 step('Valid means the diagram forces the conclusion.','Draw what the premises say. If every diagram that fits the premises also shows the conclusion, the syllogism is valid.','Choose the first syllogism and check the part of A outside C.'),
 step('One counterexample diagram is enough.','“All A are B; all C are B; so all A are C” is invalid: A and C can both sit inside B without overlapping. A single diagram that fits the premises but not the conclusion proves this.','Choose the second syllogism and find the red point.')
 ],[
 question('What is the negation of “All the students passed”?',['Some student did not pass.','No student passed.','All the students failed.'],'The statement becomes false as soon as one student did not pass.'),
 question('All squares are rectangles. All rectangles have four sides. What follows?',['All squares have four sides.','All shapes with four sides are squares.','Some rectangles are not squares.'],'All A are B and all B are C give all A are C. The other statements may be true or false, but they do not follow from these premises.'),
 question('All cats are mammals. All dogs are mammals. Does it follow that all cats are dogs?',['No; both groups can sit inside “mammals” without overlapping.','Yes; they share the middle group.','Only if some cats are dogs.'],'The premises put both groups inside “mammals” but say nothing about how they relate to each other.')
 ],'Test “Some A are B. Some B are C. So some A are C.” with a diagram.')
],
};
const META={
 'pre-algebra':{title:'Pre-Algebra',headline:'Make the numbers\nmake sense.',prerequisite:'Start with arithmetic; explain what each number represents.',scope:'Four introductory lessons on signed change, fractions, proportional reasoning, and expressions. Integers beyond addition, fraction division, and wider middle-school topics are not fully covered.',bridge:{href:'../../modules/aa01/dist/',label:'More visual algebra activities →'}},
 'algebra-1':{title:'Algebra I',headline:'Connect equations\nwith graphs.',prerequisite:'Comfortable with signed numbers and expressions? Start here.',scope:'Four introductory lessons on equations, linear functions, systems, and quadratic roots. Inequalities, full quadratic analysis, and a complete Algebra I syllabus come later.',bridge:{href:'../../modules/aa01/dist/',label:'Continue with visual algebra activities →'}},
 geometry:{title:'Geometry',headline:'See the relationship.\nGive a reason.',prerequisite:'Use arithmetic and simple equations to explain a geometric relationship.',scope:'Four introductory lessons on angles, triangles, similarity, and measurement. Formal proof, transformations, circles, and coordinate geometry come later.',bridge:{href:'../algebra-1/',label:'Review equations in Algebra I →'}},
 'algebra-2':{title:'Algebra II',headline:'Follow the factors.\nKeep the domain.',prerequisite:'Review Algebra I equations, functions, and quadratic roots first.',scope:'Four introductory lessons on polynomial factors, rational restrictions, exponential models, and logarithms. Complex-number methods, sequences, and full function analysis come later.',bridge:{href:'../../modules/af01/dist/',label:'Continue to Pre-calculus →'}},
 'basic-logic':{title:'Basic Logic',headline:'Say it precisely.\nTest the reasoning.',prerequisite:'No algebra is needed beyond reading simple statements about numbers.',scope:'Four introductory lessons on statements, conditionals, arguments, and quantifiers. Formal proof systems, predicate logic, and set theory come later.',bridge:{href:'../discrete-math/',label:'Continue with proof in Discrete Mathematics →'}},
};
function create(id){if(!DATA[id])throw new Error('Unknown course '+id);const m=META[id];return{MODULE:id,TITLE:m.title,VERSION:id+'-beta-0.1',eyebrow:m.title.toUpperCase()+' · INTRODUCTORY LESSONS',headline:m.headline,lead:'Save a first thought, explore an example, then explain your answer to new questions. Your report keeps predictions and later work separate.',prerequisite:m.prerequisite,scope:m.scope,bridge:m.bridge,reportsHref:'../../reports/',LESSONS:DATA[id].map((l,i)=>{const qs=l.questions.map((q,j)=>({...q,id:id+'-'+(i+1)+'-'+j,options:q.options.slice((i+j)%3).concat(q.options.slice(0,(i+j)%3))}));const {questions,...rest}=l;return{...rest,id:id+'-lesson-'+(i+1),predict:qs[0],checks:qs.slice(1)};})};}
const api={create,IDS:Object.keys(DATA)};if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceSchoolCourseContent=api;
})(typeof window==='undefined'?globalThis:window);
