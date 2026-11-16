(function(root){
'use strict';
// Integrated Science 6–10 "Test your understanding" problems. Served through challenge-bank.js;
// once published, a task is never edited in place: a revision needs a new bank version.
// Each problem uses the course's own models and states every value it needs.
const VERSION='integrated-science-items-1';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const groups=['Energy and matter','Living things and Earth systems'];
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Write out each quantity with its unit and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which model or evidence decides it.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'integrated-science',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const CHALLENGES={'integrated-science':{
 title:'Integrated Science 6–10',course:'../courses/integrated-science/',
 scope:'Heating and melting, moles and mass in burning, inheritance with Punnett squares, and climate feedbacks with the pH scale, as the course’s lessons 2, 16, 19, 23 and 24 model them',
 prerequisite:'Metric units, rates, averages and powers of ten, reading tables and graphs, fair tests, and grade 5 science about matter, energy, food chains and Earth’s water. The foundation check covers these.',
 groups,
 notChecked:['Designing and carrying out investigations, collecting real data, and arguing from evidence in writing; the explanations are kept for review, not graded'],
 suppliedInformation:[
  {task:'is-c01',note:'The specific heats, the energy to melt ice and the steady heating rate are supplied, so a match checks using the model, not recalling the values.'},
  {task:'is-c02',note:'The balanced equation and rounded molar masses are supplied.'}],
 tasks:[
  t('is-c01',0,'medium','Steady heat, then a pause',
   'A 200 g pile of crushed ice starts at −15 °C and is stirred as it warms. Heat reaches it at a steady 250 J every second, and none escapes. Ice needs 2.09 J to warm 1 g by 1 °C; melting needs 334 J for each gram; liquid water needs 4.18 J to warm 1 g by 1 °C. How many joules warm the ice to 0 °C? Once it reaches 0 °C, how many seconds does it take to melt completely, to the nearest second? After it has melted, how many joules warm the water from 0 °C to 20 °C? Then choose why the temperature stays at 0 °C while the ice melts.',
   [n('warmIce','Joules to warm the ice from −15 °C to 0 °C',6270,'Using mass × specific heat × temperature change'),
    n('meltSeconds','Seconds to melt all the ice at 250 J per second, to the nearest second',267,'Turning the energy to melt into a time'),
    n('warmWater','Joules to warm the water from 0 °C to 20 °C',16720,'Using the specific heat of liquid water'),
    c('why','While the ice melts, the temperature stays at 0 °C because…',[['arrangement','the energy goes into breaking the solid’s arrangement of particles, not into making them move faster'],['escapes','the heat stops reaching the ice until it has melted'],['cold','ice is too cold to warm until the room warms it']],'arrangement','Explaining a flat part of a heating curve')],
   'Show each energy with its unit, and explain the flat part of the graph with particles.',
   'Warming the ice takes 200 × 2.09 × 15 = 6,270 J, about 25 seconds at 250 J per second. Melting takes 200 × 334 = 66,800 J, and 66,800 ÷ 250 = 267.2, so about 267 seconds: nearly four and a half minutes at 0 °C. Warming the water to 20 °C takes 200 × 4.18 × 20 = 16,720 J. Heat keeps arriving during the flat part, but it goes into separating the particles from the solid’s fixed arrangement rather than into faster motion, so the temperature, which measures the average energy of motion of the particles, does not rise until all the ice has melted.',
   'How long would 400 g of ice at 0 °C take to melt with the same heater? Explain why the answer is not the same as for 200 g.'),
  t('is-c02',0,'challenging','Where does the mass come from?',
   'Methane burns as CH₄ + 2 O₂ → CO₂ + 2 H₂O. Use molar masses of 12 g for C, 1 g for H and 16 g for O in each mole of atoms. A stove burns 48 g of methane completely. How many moles of methane is that? How many grams of oxygen does it use? How many grams of carbon dioxide does it make? Then choose why the carbon dioxide weighs more than the methane burned.',
   [n('moles','Moles of methane',3,'Converting mass to moles'),
    n('oxygen','Grams of oxygen used',192,'Using the mole ratio of the balanced equation',['moles']),
    n('carbon','Grams of carbon dioxide made',132,'Using the mole ratio and the molar mass of the product',['moles']),
    c('heavier','The carbon dioxide weighs more than the methane because…',[['oxygen','each carbon atom from the fuel joins two oxygen atoms taken from the air'],['created','burning creates new matter from the energy released'],['hydrogen','the hydrogen atoms of the fuel turn into carbon']],'oxygen','Explaining mass with atoms that are conserved')],
   'Show the moles of each substance, and check that the mass going in equals the mass coming out.',
   'A mole of CH₄ is 12 + 4 × 1 = 16 g, so 48 g is 48 ÷ 16 = 3 moles. The equation needs 2 moles of O₂ for each mole of methane: 6 moles × 32 g = 192 g. Each mole of methane makes 1 mole of CO₂: 3 × 44 = 132 g. The water is 6 × 18 = 108 g, and 48 + 192 = 240 = 132 + 108, so mass is conserved. The carbon dioxide is heavier than the fuel because most of its mass is oxygen from the air: in 44 g of CO₂, 32 g is oxygen.',
   'How many grams of water does burning 48 g of methane make? Check the total mass.'),
  t('is-c03',1,'medium','A trait that skips a generation',
   'In pea plants, the allele P for purple flowers is dominant over p for white flowers. Two purple plants, both Pp, are crossed and have 400 offspring. About how many of the offspring are expected to be white? Among the purple offspring, what fraction are expected to be Pp? A white offspring is then crossed with a Pp plant: what percent of their offspring are expected to be white? Then choose how two purple parents can have a white offspring.',
   [n('white','Expected white offspring out of 400',100,'Using a Punnett square for Pp × Pp'),
    n('carriers','Fraction of the purple offspring expected to be Pp',2/3,'Counting only the purple boxes of the square'),
    n('testCross','Percent of offspring expected to be white from pp × Pp (%)',50,'Using a Punnett square for a test cross'),
    c('how','Two purple parents can have a white offspring because…',[['hidden','each parent carries a hidden p allele, and the offspring got a p from both'],['mutation','white flowers can only come from a new mutation'],['blend','the parents’ purple faded as it was passed on']],'hidden','Explaining a recessive trait with alleles')],
   'Draw the Punnett squares and explain what each box stands for.',
   'Pp × Pp gives PP, Pp, pP and pp with equal chances, so a quarter of the offspring, about 100 of 400, are expected to be white. Three boxes are purple, and two of those three are Pp, so 2/3 of the purple offspring carry p. pp × Pp gives Pp or pp with equal chances: 50% white. A recessive allele can be passed on hidden in purple plants and show again when an offspring gets it from both parents. Real counts vary: Mendel counted 705 purple and 224 white, close to 3 to 1 but not exact.',
   'A purple plant of unknown alleles is crossed with a white plant and all 20 offspring are purple. What are its alleles most likely to be, and how sure can you be?'),
  t('is-c04',1,'challenging','Feedbacks and the pH scale',
   'Extra energy kept by Earth would warm it by 1.2 °C if nothing else changed. Suppose feedbacks make each round of warming add 0.6 of the round before: 1.2 °C, then 0.72 °C, and so on. What is the warming after the first round and one round of feedback? What total do the rounds approach if they continue without end? On the pH scale, pH = −log₁₀[H⁺]. How many times as many hydrogen ions, in the same volume, does lake water at pH 6 have as seawater at pH 8? Then choose why a fall in seawater pH from 8.2 to 8.1 matters even though the water is still basic.',
   [n('twoRounds','Warming after the first round and one round of feedback, in °C',1.92,'Adding the rounds of a feedback loop'),
    n('total','Total the rounds approach, in °C',3,'Summing the rounds: first warming ÷ (1 − f)'),
    n('ions','How many times as many hydrogen ions at pH 6 as at pH 8',100,'Reading the pH scale as powers of ten'),
    c('matters','A fall from pH 8.2 to 8.1 matters because…',[['carbonate','the extra hydrogen ions combine with carbonate ions, which shell-building animals need'],['acidic','the seawater becomes acidic, with a pH below 7'],['warmer','a lower pH makes the ocean warmer']],'carbonate','Linking pH to the carbonate equilibrium')],
   'Explain why the rounds stop growing, and why one step on the pH scale is a factor of ten.',
   'After one round of feedback the warming is 1.2 + 0.6 × 1.2 = 1.92 °C. The rounds 1.2, 0.72, 0.432, … shrink because each is 0.6 of the one before, and they add up to 1.2 ÷ (1 − 0.6) = 3 °C. Each step of 1 on the pH scale is a factor of 10 in hydrogen ions, so pH 6 has 10 × 10 = 100 times as many as pH 8. A fall of 0.1 means about 26% more hydrogen ions; they combine with carbonate ions (H⁺ + CO₃²⁻ → HCO₃⁻), leaving fewer for the calcium carbonate shells of oysters, corals and pteropods. The water stays basic, above pH 7.',
   'If each round added 0.5 of the round before, what would the total warming be? What if it added 1.0?')
 ]}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceChallenges=api;
})(typeof window==='undefined'?globalThis:window);
