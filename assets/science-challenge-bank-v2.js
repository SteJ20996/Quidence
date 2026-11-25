(function(root){
'use strict';
// Integrated Science 6–10 "Test your understanding", second version. The four published problems of
// science-challenge-bank.js are carried over unchanged, with their own version; four problems for grades 7 and 8
// are added. Once published, a task is never edited in place: a revision needs a new bank version.
// Each problem uses the course's own models and states every value it needs.
const first=typeof module==='object'&&module.exports?require('./science-challenge-bank.js'):root.QuidenceScienceChallenges;
const VERSION='integrated-science-items-2';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const before=first.CHALLENGES['integrated-science'],groups=before.groups;
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Write out each quantity with its unit and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which model or evidence decides it.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'integrated-science',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const published=Object.fromEntries(before.tasks.map(task=>[task.id,task]));
const added={
 'is-c05':t('is-c05',0,'medium','Fast molecules, rearranged atoms',
   'Molecules of every gas at the same temperature have the same average energy of motion, ½ × mass × speed². Use molecular masses of 2 for hydrogen gas, H₂, and 32 for oxygen gas, O₂. In a mixture of the two at one temperature, how many times as fast as an oxygen molecule does a hydrogen molecule typically move? Cellular respiration in a runner’s muscles uses glucose: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O. With atomic masses of 12 for C, 1 for H and 16 for O, one glucose molecule has mass 180 and uses six oxygen molecules of mass 32 each, so grams of glucose and oxygen react in the same ratio as 180 to 6 × 32. How many grams of oxygen gas, O₂, does 90 g of glucose use? How many grams of carbon dioxide and water does it make in all? Then choose what happens to the atoms of the glucose.',
   [n('speed','How many times as fast as an oxygen molecule a hydrogen molecule moves',4,'Comparing speeds at equal energy of motion'),
    n('oxygen','Grams of oxygen gas used by 90 g of glucose',96,'Using the ratio of masses in the balanced equation'),
    n('products','Grams of carbon dioxide and water made in all',186,'Using conservation of mass',['oxygen']),
    c('atoms','The atoms of the glucose…',[['leave','end up in carbon dioxide and water, rearranged but not destroyed'],['energy','are changed into the energy that the runner’s muscles then use up'],['stay','stay in the muscles, since the air breathed out is only unused air']],'leave','Tracing atoms through respiration')],
   'Show the masses behind the speeds, the ratio of masses in the reaction, and where each kind of atom goes.',
   'Equal energy of motion means ½ × 2 × (hydrogen speed)² = ½ × 32 × (oxygen speed)², so the hydrogen speed squared is 16 times as large and hydrogen moves 4 times as fast: about 1,930 m/s against about 480 m/s at 25 °C. A glucose molecule has mass 6 × 12 + 12 × 1 + 6 × 16 = 180, and its six oxygen molecules 6 × 32 = 192. 90 g of glucose is half of 180, so it uses half of 192 g: 96 g of oxygen. It makes half of 6 × 44 = 264 g of carbon dioxide, 132 g, and half of 6 × 18 = 108 g of water, 54 g. The products weigh 132 + 54 = 186 g, the same as the 90 + 96 = 186 g that went in. Every carbon atom of the glucose leaves in carbon dioxide that is breathed out, and every hydrogen atom in water. The energy released comes from rearranging the atoms into new molecules, not from destroying matter.',
   'What share of the 186 g of products is carbon dioxide? Trace one of its carbon atoms back: where was it before a plant made the glucose?'),
 'is-c06':t('is-c06',1,'challenging','Rates on the seafloor and on an island',
   'Rock on the seafloor 150 km from a mid-ocean ridge is 6 million years old. Assume each plate moves away from the ridge at a steady speed. How many centimeters a year does that side move? Two instruments are fixed to the seafloor, one on each side of the ridge. If the plates on both sides move at that speed, how many centimeters farther apart are the instruments after 10 years? On an island, a fox population follows the course’s model: each year the foxes add 0.3 × n × (1 − n ÷ 1,500) to their number n, and eagles take 10% of the foxes. At what number of foxes, above zero, do the foxes added each year exactly balance the foxes the eagles take? Then choose why the population levels off there and not at 1,500.',
   [n('rate','Speed of that side, in centimeters per year',2.5,'Turning a distance and an age into a speed'),
    n('apart','Centimeters farther apart after 10 years',50,'Adding the motion of both plates',['rate']),
    n('balance','Number of foxes at which the additions balance the eagles',1000,'Finding where additions equal losses'),
    c('level','The population levels off at that number, not at 1,500, because…',[['balance','at that size, the foxes added each year equal the foxes the eagles take'],['capacity','the island now has less food than before, so it can only feed 1,000 foxes'],['learn','the foxes that are left learn to hide, and the eagles stop hunting them']],'balance','Telling a predator’s effect from a shortage of resources')],
   'Show the speed with its unit, explain why the two sides add, and write the balance as an equation.',
   '150 km in 6 million years is 25 km per million years. A plate moving 1 cm a year travels 10 km in a million years, so this side moves 2.5 cm a year. The plates on both sides move away from the ridge, so the instruments separate at 2 × 2.5 = 5 cm a year: 50 cm in 10 years. The foxes balance when 0.3 × n × (1 − n ÷ 1,500) = 0.1 × n. Dividing both sides by 0.3 × n gives 1 − n ÷ 1,500 = 1/3, so n = 1,000. Below 1,000, more foxes are added than taken and the number rises; above it, more are taken than added and it falls. The island has as much food as before, enough for 1,500 foxes: the eagles’ toll, not a shortage of food, holds the population lower. Real populations also rise and fall by chance from year to year, which this model leaves out.',
   'If the eagles took 20% of the foxes each year, where would the population level off? What happens in the model if they take 30% or more?'),
 'is-c07':t('is-c07',0,'medium','Energy, stopping and echoes',
   'A 1,200 kg car moves at 20 m/s (72 km/h). Kinetic energy = ½ × mass × speed² gives joules (J) when the mass is in kg and the speed in m/s; 1 kJ = 1,000 J. How many kilojoules of kinetic energy does it have? On a wet road, the car brakes to a stop from 10 m/s in 12.5 m, and braking distance grows with the square of the speed. How many meters does it need to brake from 20 m/s on the same road? An echo sounder in a research ship’s hull sends a sound pulse straight down through seawater, where sound travels at 1,500 m/s, and detects the echo from the seafloor 0.6 seconds later. How deep is the water, in meters? Then choose how a crumple zone protects the people in a car.',
   [n('energy','Kinetic energy at 20 m/s, in kJ',240,'Using kinetic energy = ½ × mass × speed²'),
    n('braking','Braking distance from 20 m/s, in meters',50,'Scaling a distance with the square of the speed'),
    n('depth','Depth of the water, in meters',450,'Using an echo’s time down and back'),
    c('crumple','A crumple zone protects the people inside because…',[['longer','it makes the stop take longer, so a smaller force slows the people'],['shorter','it makes the stop shorter, so the crash is over before the force grows'],['lighter','it makes the car lighter, so it carries less kinetic energy into a crash']],'longer','Linking the time of a stop to the force')],
   'Show each calculation with units, and explain why the echo’s time is halved.',
   '½ × 1,200 × 20² = 240,000 J = 240 kJ. Twice the speed needs 2² = 4 times the braking distance: 4 × 12.5 = 50 m. (In the course’s model a wet road slows a car by 4 m/s every second, and 10² ÷ (2 × 4) = 12.5 m.) The pulse travels down and back up in 0.6 s, so it goes 1,500 × 0.6 = 900 m in all, and the seafloor is 450 m down. A crumple zone folds in a planned way, so the car and the people in it take longer to stop: the same change in speed spread over a longer time needs a smaller force. It also takes up some of the kinetic energy as it bends.',
   'Find the car’s kinetic energy at 30 m/s and its braking distance from 30 m/s. How many times as large is each as at 20 m/s? Explain why the two match.'),
 'is-c08':t('is-c08',1,'challenging','A spreading color and the Moon’s clock',
   'On a dark lava flow, rock pocket mice start at 1 dark mouse for every 8 light ones. Owls catch more of the light mice, and the ratio of dark to light mice doubles every 15 generations. After how many generations are half the mice dark? What percent of the mice are dark after 75 generations? The Moon goes through its phases in about 29.5 days. A first-quarter moon, a quarter of the way through the cycle, rises around noon. To the nearest hour, how many hours later in the day does a full moon, halfway through the cycle, rise? Then choose the phase of a thin Moon that an observer in the Northern Hemisphere sees low in the east just before sunrise, lit on its left side.',
   [n('half','Generations until half the mice are dark',45,'Counting doublings of a ratio'),
    n('percent','Percent of the mice that are dark after 75 generations (%)',80,'Turning a ratio into a percent'),
    n('rise','How many hours later a full moon rises than a first-quarter moon, to the nearest hour',6,'Turning a part of the cycle into a rising time'),
    c('phase','The thin Moon seen before sunrise, lit on its left, is…',[['waning','a waning crescent, a few days before the next new moon'],['waxing','a waxing crescent, a few days after the last new moon'],['new','a new moon, which is always thin when it is near the Sun']],'waning','Using the lit side and the time of day to name a phase')],
   'Show the ratio after each doubling, and explain the rising times with the view from above.',
   'The ratio of dark to light mice goes 1:8, 2:8, 4:8, 8:8 at 0, 15, 30 and 45 generations, so half the mice are dark after 45 generations. After 75 generations it is 32:8, or 4:1, so 4 of every 5 mice, 80%, are dark. In the course’s model, a 5% advantage doubles the ratio about every 14 generations (1.05¹⁴ ≈ 1.98). From first quarter to full moon, the Moon goes a quarter of the way around its orbit, so it rises about a quarter of a day, 6 hours, later: around 6 p.m., near sunset, because a full moon is opposite the Sun. The rule of about 50 minutes later each day agrees: 7.4 days × 50 minutes is about 6 hours. From the Northern Hemisphere, a waning Moon is lit on the left, and a crescent low in the east before sunrise is a few days before new moon, rising a few hours ahead of the Sun. A waxing crescent is seen in the west after sunset, and a new moon cannot be seen at all.',
   'If the lava flow were later buried by pale sand, which mice would the owls catch more often, and what would happen to the ratio? Ten days after new moon, about what time does the Moon rise, and where would you look for it at sunset?')
};
const CHALLENGES={'integrated-science':{
 ...before,
 scope:'Heating and melting, particle speeds and atoms in respiration, seafloor spreading and a population with a predator, kinetic energy, stopping and echoes, the Moon’s phases and natural selection, moles and mass in burning, inheritance with Punnett squares, and climate feedbacks with the pH scale, as the course’s lessons 2, 5–12, 16, 19, 23 and 24 model them',
 notChecked:[...before.notChecked,'Watching the real Moon over a month, and the chance that a small population dies out by bad luck, which the fox model leaves out'],
 suppliedInformation:[...before.suppliedInformation,
  {task:'is-c05',note:'The molecular masses, the balanced equation and rounded molar masses are supplied.'},
  {task:'is-c06',note:'The model’s rule for adding foxes is supplied, so a match checks reasoning with the model, not recalling it.'},
  {task:'is-c07',note:'The braking distance at one speed and the speed of sound in seawater are supplied.'},
  {task:'is-c08',note:'A doubling time is supplied instead of the model’s 5% advantage, so the answer needs no logarithms.'}],
 // In the order of the course’s lessons: grade 6, grade 7, grade 8, then high school.
 tasks:[published['is-c01'],added['is-c05'],added['is-c06'],added['is-c07'],added['is-c08'],published['is-c02'],published['is-c03'],published['is-c04']]
}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceChallengesV2=api;
})(typeof window==='undefined'?globalThis:window);
