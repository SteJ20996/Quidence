(function(root){
'use strict';
const range=(name,label,min,max,step=1)=>({name,label,min,max,step});
const select=(name,label,values)=>({name,label,options:values.map(v=>[v,String(v)]),numeric:true});
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
microeconomics:[
 lesson('Opportunity cost','What do you give up when you choose?','Identify the next-best alternative and read a resource trade-off.',{meals:2},[range('meals','Meals chosen',0,4)],[
 step('Choices use limited resources.','The example budget supports four meals or eight transport trips, or intermediate combinations. One extra meal uses resources for two trips.','Read two adjacent bundles.'),
 step('Opportunity cost is an alternative forgone.','The opportunity cost of an extra meal is the two trips you give up in this model. It is not a separate extra cash fee.','Increase meals by 1 and compare remaining trips.'),
 step('Use the next-best alternative.','If one hour could be spent tutoring, exercising, or resting, the opportunity cost concerns the best alternative you would otherwise choose, not all three added together.','Name your next-best use of one hour.'),
 step('Keep the model and personal values separate.','The table specifies a resource trade-off. It does not tell which bundle a person prefers; preferences and other constraints matter.','Explain why two people could choose different feasible bundles.')
 ],[
 question('One extra meal leaves two fewer transport trips in this model. What is its opportunity cost?',['Two transport trips','Every possible purchase combined','Zero because no extra fee is listed'],'The marginal trade-off is the two trips forgone.'),
 question('You choose studying. Your next-best alternative is a paid shift worth $40, with no other differences assumed. What is the opportunity cost?',['The forgone $40 shift','All available activities added together','Only the money spent on textbooks'],'Opportunity cost is the value of the next-best alternative not chosen.'),
 question('Does a feasible-bundle table alone determine everyone’s preferred bundle?',['No; preferences and other constraints also matter.','Yes; everyone must choose the most meals.','Yes; everyone must choose equal counts of both goods.'],'A resource constraint describes possibilities, not a universal preference ranking.')
 ],'Describe one choice, its feasible alternatives, and the next-best alternative forgone.'),
 lesson('Supply & demand','What changes when demand shifts?','Find a model equilibrium and distinguish a shift from movement on a curve.',{shift:0},[range('shift','Demand intercept change',-4,4)],[
 step('Read price and quantity on the correct axes.','Here price is vertical and quantity is horizontal. Demand P = 12 − Q slopes down; supply P = Q slopes up.','Identify which curve gives a higher price at a larger quantity.'),
 step('Equilibrium makes planned quantities agree.','With these curves, 12 − Q = Q gives Q = 6 and P = 6. At this price the supplied and demanded quantities match.','Read the marked intersection.'),
 step('A shift changes the whole demand relationship.','Increasing the demand intercept raises willingness to pay at every given quantity in this toy model. With supply fixed, the equilibrium price and quantity both rise.','Increase the demand intercept by 2.'),
 step('A price change is movement along a fixed curve.','Changing the good’s own price on a fixed demand curve changes quantity demanded. It is different from a shift caused by a non-price factor.','Contrast a price change with a change in buyer income, holding other conditions fixed.')
 ],[
 question('For demand P = 10 − Q and supply P = Q, what is equilibrium?',['P = 5, Q = 5','P = 10, Q = 0','P = 0, Q = 10'],'Set 10 − Q = Q, giving Q = 5 and P = 5.'),
 question('Demand shifts outward while an upward-sloping supply curve stays fixed. In this model, what happens to equilibrium?',['Price and quantity both rise.','Price rises and quantity must fall.','Only the curve color changes.'],'At the new intersection, both price and quantity are higher; other conditions are held fixed.'),
 question('On a fixed demand curve, the good’s own price falls. What describes the change?',['Movement along demand to a larger quantity demanded.','An outward demand shift by definition.','A supply shift by definition.'],'An own-price change describes movement along a fixed demand curve, not a demand shift.')
 ],'Use one new pair of curves to compare an own-price movement with a demand shift.'),
 lesson('Elasticity','Why is elasticity different from slope?','Use midpoint percentage changes and keep revenue separate from profit.',{price:6},[select('price','Second price ($)',[5,6,7,8])],[
 step('Use changes relative to the quantities.','Elasticity compares percentage change in quantity with percentage change in price. Raw changes alone depend on measurement units.','Read the two price-quantity points.'),
 step('Use midpoint percentages consistently.','Divide each difference by the average of its starting and ending values. Between P = 4, Q = 80 and P = 6, Q = 60, absolute midpoint elasticity is (20/70)/(2/5) = 5/7.','Check the denominator of each percentage.'),
 step('Classify the magnitude for this interval.','An absolute value below 1 is inelastic for the interval; above 1 is elastic; equal to 1 is unit elastic. A curve can have different elasticities on different intervals.','Change the second price and compare the magnitude.'),
 step('Revenue is price times quantity.','Revenue at P = 6 and Q = 60 is 360. Profit also subtracts costs, which this demand table does not specify.','Compare the two revenues without claiming a profit change.')
 ],[
 question('Price rises from 4 to 6 and quantity falls from 80 to 60. What is absolute midpoint elasticity?',['5/7, about 0.714','10, the raw quantity-to-price change','7/5, about 1.4'],'Quantity percentage magnitude is 20/70 and price percentage is 2/5; their ratio is 5/7.'),
 question('A demand interval has absolute price elasticity 1.5. How is that interval classified?',['Elastic','Inelastic','Unit elastic'],'The magnitude 1.5 exceeds 1.'),
 question('At price $5 and quantity 40, which statement is supported without cost data?',['Revenue is $200; profit is not determined.','Profit must be $200.','Revenue is $8.'],'Revenue = price × quantity = 200. Costs are needed to calculate profit.')
 ],'Calculate midpoint elasticity for a new interval and state what revenue does and does not show.'),
 lesson('Marginal choices','When is one more unit worthwhile?','Compare incremental benefit and cost rather than averages alone.',{units:3},[range('units','Chosen output',0,4)],[
 step('Marginal means the next increment.','Marginal cost is the extra total cost from one more unit. It is different from total cost or average cost per unit.','Read the cost of the third unit.'),
 step('Compare incremental revenue with incremental cost.','At fixed price $7, each additional unit brings $7 of marginal revenue. Unit costs here are 2, 4, 6, and 8.','Identify which units add a positive amount to profit.'),
 step('Check feasible total outcomes.','With no fixed cost here, profits for outputs 0 through 4 are 0, 5, 8, 9, and 8. Three units maximize profit among these available outputs.','Compare output 3 with output 4.'),
 step('Keep the assumptions visible.','This is a discrete, price-taking example with four units available and increasing marginal costs. A continuous interior optimum uses additional assumptions, and strategic pricing belongs in later study.','Explain why the fourth unit lowers profit here.')
 ],[
 question('An extra unit brings $9 of revenue and costs $6, with no other changes. What is its incremental profit?',['$3','−$3','$15'],'Additional profit is additional revenue minus additional cost: 9 − 6 = 3.'),
 question('At price $7, marginal costs of four units are $2, $4, $6, and $8, with no fixed cost. Which available output maximizes profit?',['3 units','4 units','1 unit'],'Profits at outputs 0–4 are 0, 5, 8, 9, 8. The fourth unit costs more than its revenue.'),
 question('Total cost rises from $20 to $27 when output rises from 4 to 5. What is the marginal cost of that fifth unit?',['$7','$5.40','$27'],'The additional cost is 27 − 20 = 7; 27/5 is average cost, not marginal cost.')
 ],'List incremental revenue and cost for a new discrete output choice, then compare total profits.')
]
};
const META={
 'pre-algebra':{title:'Pre-Algebra',headline:'Make the numbers\nmake sense.',prerequisite:'Start with arithmetic; explain what each number represents.',scope:'Four introductory lessons on signed change, fractions, proportional reasoning, and expressions. Integers beyond addition, fraction division, and wider middle-school topics are not fully covered.',bridge:{href:'../../modules/aa01/dist/',label:'More visual algebra activities →'}},
 'algebra-1':{title:'Algebra I',headline:'Connect equations\nwith graphs.',prerequisite:'Comfortable with signed numbers and expressions? Start here.',scope:'Four introductory lessons on equations, linear functions, systems, and quadratic roots. Inequalities, full quadratic analysis, and a complete Algebra I syllabus come later.',bridge:{href:'../../modules/aa01/dist/',label:'Continue with visual algebra activities →'}},
 geometry:{title:'Geometry',headline:'See the relationship.\nGive a reason.',prerequisite:'Use arithmetic and simple equations to explain a geometric relationship.',scope:'Four introductory lessons on angles, triangles, similarity, and measurement. Formal proof, transformations, circles, and coordinate geometry come later.',bridge:{href:'../algebra-1/',label:'Review equations in Algebra I →'}},
 'algebra-2':{title:'Algebra II',headline:'Follow the factors.\nKeep the domain.',prerequisite:'Review Algebra I equations, functions, and quadratic roots first.',scope:'Four introductory lessons on polynomial factors, rational restrictions, exponential models, and logarithms. Complex-number methods, sequences, and full function analysis come later.',bridge:{href:'../../modules/af01/dist/',label:'Continue to Pre-calculus →'}},
 microeconomics:{title:'Microeconomics',headline:'Compare the choices.\nCheck the model.',prerequisite:'Use ratios, percentages, and linear equations; explain the assumptions.',scope:'Four introductory lessons on opportunity cost, supply and demand, elasticity, and discrete marginal choices. Illustrative models, not a complete economics course. Consumer theory, market structure, welfare, and externalities come later.',bridge:{href:'../../modules/ac01/dist/',label:'Explore strategic choices in Game Theory →'}}
};
function create(id){if(!DATA[id])throw new Error('Unknown course '+id);const m=META[id];return{MODULE:id,TITLE:m.title,VERSION:id+'-beta-0.1',eyebrow:m.title.toUpperCase()+' · INTRODUCTORY LESSONS',headline:m.headline,lead:'Save a first thought, explore an example, then explain your answer to new questions. Your report keeps predictions and later work separate.',prerequisite:m.prerequisite,scope:m.scope,bridge:m.bridge,reportsHref:'../../reports/',LESSONS:DATA[id].map((l,i)=>{const qs=l.questions.map((q,j)=>({...q,id:id+'-'+(i+1)+'-'+j,options:q.options.slice((i+j)%3).concat(q.options.slice(0,(i+j)%3))}));const {questions,...rest}=l;return{...rest,id:id+'-lesson-'+(i+1),predict:qs[0],checks:qs.slice(1)};})};}
const api={create,IDS:Object.keys(DATA)};if(typeof module==='object'&&module.exports)module.exports=api;else root.ClueveraSchoolCourseContent=api;
})(typeof window==='undefined'?globalThis:window);
