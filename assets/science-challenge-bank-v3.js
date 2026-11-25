(function(root){
'use strict';
// Integrated Science 6–10 "Test your understanding", third version. The eight published problems of
// science-challenge-bank-v2.js are carried over unchanged, with their own versions; six problems cover the eleven
// lessons that had none, and the check comes in two parts, each with its own report. Once published, a task is
// never edited in place: a revision needs a new bank version. Each problem states every value it needs.
const second=typeof module==='object'&&module.exports?require('./science-challenge-bank-v2.js'):root.QuidenceScienceChallengesV2;
const VERSION='integrated-science-items-3';
const provenance='Composed for Quidence; source clearance has not been independently verified.';
const before=second.CHALLENGES['integrated-science'],groups=before.groups;
const phrase=skill=>skill[0].toLowerCase()+skill.slice(1);
const n=(id,label,answer,skill,dependsOn=[])=>({id,label,kind:'number',answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Write out each quantity with its unit and compare it with the reference.',dependsOn});
const c=(id,label,options,answer,skill,dependsOn=[])=>({id,label,kind:'choice',options:options.map(([value,label])=>({value,label})),answer,skill,onMismatch:'Recheck '+phrase(skill)+'. Explain which model or evidence decides it.',dependsOn});
const t=(id,group,difficulty,title,prompt,fields,reason,solution,next)=>({module:'integrated-science',id,group,groupName:groups[group],version:VERSION,provenance,difficulty,title,prompt,fields,reason,solution,next});
const published=Object.fromEntries(before.tasks.map(task=>[task.id,task]));
const added={
 'is-c09':t('is-c09',1,'medium','Why cells stay small',
   'Model a cell as a cube. Its surface area is 6 × side², and its volume is side³. For a cube-shaped cell with sides of 4 µm, what is its surface area divided by its volume, in square micrometers for each cubic micrometer? If the side is tripled to 12 µm, how many times as large does the volume become? A 12 µm cube is cut into 4 µm cubes: how many times as much surface area do all the small cubes have together as the one large cube? Then choose how an elephant’s cells compare with a mouse’s.',
   [n('ratio','Surface area ÷ volume for the 4 µm cube (per µm)',1.5,'Computing a surface-area-to-volume ratio'),
    n('volume','How many times as large the volume becomes when the side triples',27,'Scaling volume with the cube of the side'),
    n('surface','How many times as much surface area the small cubes have together',3,'Comparing total surface after dividing a volume',['ratio']),
    c('elephant','Compared with a mouse, an elephant has…',[['more','far more cells, most about the same size as a mouse’s cells'],['larger','cells that are much larger, to match its much larger body'],['stretched','about as many cells, each one stretched to a larger size']],'more','Explaining body size with cell number, not cell size')],
   'Show the surface area and the volume with their units, and explain what the ratio means for what a cell can take in.',
   'The 4 µm cube has surface area 6 × 4² = 96 µm² and volume 4³ = 64 µm³, so the ratio is 96 ÷ 64 = 1.5 per µm. Tripling the side multiplies the volume by 3³ = 27 but the surface area only by 3² = 9, so the ratio falls to a third. Cutting the 12 µm cube into 27 cubes of 4 µm keeps the volume but gives 27 × 96 = 2,592 µm² of surface, 3 times the large cube’s 6 × 12² = 864 µm². What a cell needs grows with its volume, while what can cross grows with its surface, so a large body is built from many small cells. Most cells of an elephant and a mouse are of similar size; the elephant has far more of them. (Some cells, such as long nerve cells, are exceptions.)',
   'A cell is flattened into a slab 12 µm by 12 µm by 3 µm. Is its surface-area-to-volume ratio larger or smaller than the 12 µm cube’s? Name a part of the body that uses flat or folded shapes.'),
 'is-c10':t('is-c10',1,'challenging','Over the mountains, and a warmer planet',
   'Use the course’s model of air crossing a range: air without clouds cools 10 °C for each kilometer it rises and warms 10 °C for each kilometer it sinks; the cloud base is 125 m above the coast for each degree the coastal temperature is above its dew point; inside the cloud the air cools only 5 °C per kilometer. Air at 20 °C with a dew point of 12 °C, on a coast at sea level, crosses a 3 km range. All the cloud’s water falls on the windward side, so the air sinks to sea level on the far side with no cloud. At what height, in meters, does the cloud form? What is the air’s temperature at sea level on the far side? Doubling carbon dioxide is estimated to warm Earth eventually by about 3 °C, and each further doubling adds about the same. About how much eventual warming would carbon dioxide rising from 278 ppm to 1,112 ppm bring? Then choose how more carbon dioxide warms Earth.',
   [n('cloudBase','Height of the cloud base (m)',1000,'Finding the cloud base from the temperature and the dew point'),
    n('far','Temperature at sea level on the far side (°C)',30,'Following the air up and down the range',['cloudBase']),
    n('warming','Eventual warming from 278 ppm to 1,112 ppm (°C)',6,'Counting doublings of carbon dioxide'),
    c('how','More carbon dioxide warms Earth mainly because…',[['infrared','it absorbs infrared from the ground and sends part back down'],['ozone','it thins the ozone layer, so more of the Sun’s rays get in'],['fuel','it traps the heat given off when fuels are burned on Earth']],'infrared','Explaining the greenhouse effect')],
   'Follow the air step by step, with the temperature at each height, and show how you counted the doublings.',
   'The coastal air is 20 − 12 = 8 °C above its dew point, so the cloud forms 8 × 125 = 1,000 m up, at 20 − 10 = 10 °C. In the cloud it rises 2 km more and cools 2 × 5 = 10 °C, reaching the crest at 0 °C. Sinking 3 km with no cloud left, it warms 3 × 10 = 30 °C and, in this model, arrives at 30 °C: 10 °C warmer than it started, and drier, because it left water on the windward slope. 1,112 ppm is 4 times 278 ppm, two doublings, so about 2 × 3 = 6 °C; counting each 278 ppm as one step would wrongly give 9 °C. Carbon dioxide absorbs infrared from the surface and sends part back down, so less energy escapes at the same temperature. The ozone layer is a different problem: it blocks ultraviolet light and is thinned by other gases. The heat given off by burning fuel is tiny next to the extra energy that the added carbon dioxide holds back.',
   'If the coastal dew point were 20 °C, so that the air were saturated, what would the far-side temperature be? Explain why the far side is warmer whenever a cloud forms on the way up.'),
 'is-c11':t('is-c11',1,'medium','Energy up a food chain, carbon in the air',
   'The plants of a meadow capture 200,000 units of energy in a year, and each level of a food chain passes on 10% of the energy it receives to the level above. How many units reach the fourth level, the larger meat-eaters, three steps above the plants? If each level passed on 20% instead, how many times as much energy would reach that level? At Mauna Loa, carbon dioxide measured about 417 ppm at its May peak in 2020. Apart from the yearly ups and downs, it rises about 2.5 ppm each year. If that rise continues, about what peak do you expect in May 2030, in ppm? Then choose why the air’s carbon dioxide falls from May to September in the Northern Hemisphere.',
   [n('top','Units of energy reaching the fourth level',200,'Multiplying the share passed on at each step'),
    n('times','How many times as much energy reaches the fourth level at 20% as at 10%',8,'Comparing efficiencies over several steps',['top']),
    n('peak','Expected May peak in 2030 (ppm)',442,'Projecting a steady rise'),
    c('fall','Carbon dioxide falls from May to September because…',[['plants','growing plants take in more of it than living things give off'],['fuel','people burn far less fuel for heating in the summer months'],['ocean','warm summer seas dissolve more of it and pull it out of the air']],'plants','Linking the yearly swing to photosynthesis')],
   'Show the energy at each level, and explain the yearly swing with photosynthesis and respiration.',
   'Each step keeps a tenth: 200,000 → 20,000 → 2,000 → 200 units at the fourth level. At 20%, the fourth level gets 200,000 × 0.2³ = 1,600 units, 8 times as much, because the factor of 2 is multiplied at each of the three steps (2³ = 8), not added. Ten years at 2.5 ppm a year adds 25 ppm, so the May 2030 peak would be about 417 + 25 = 442 ppm. From May to September, plants across the land-rich Northern Hemisphere take in carbon dioxide by photosynthesis faster than respiration and decay return it; from October to April, decay and respiration win. Burning less fuel in summer would only slow the rise: it still adds carbon dioxide, so it cannot make the level fall. And warmer seawater holds less carbon dioxide, not more.',
   'At Utqiaġvik in Alaska the yearly swing is about 18 ppm, and at the South Pole about 1 ppm. Explain the difference with where land plants grow.'),
 'is-c12':t('is-c12',1,'challenging','DNA clocks and shrinking ranges',
   'In a stretch of 1,000 DNA positions, each lineage changes about 1% of the positions every 10 million years. Two species split from a common ancestor 6 million years ago, and each lineage has changed since. About how many of the 1,000 positions are expected to differ between them? Another pair of species, whose lineages change at the same rate, differs at 30 of the same 1,000 positions; about how many million years ago did they split? On a mountain whose summit is at 3,400 m, a species lives between 2,600 m and 3,000 m. Air cools about 6.5 °C for each kilometer of height. With 2.6 °C of warming, how many meters uphill does its band of suitable temperature move? Then choose what is most likely to happen to the species with more warming.',
   [n('differences','Expected differences between the first pair, out of 1,000',12,'Using a molecular clock with two lineages'),
    n('split','Millions of years since the second pair split',15,'Reading a split time from a molecular clock'),
    n('shift','How far uphill the band moves (m)',400,'Turning warming into a shift in elevation'),
    c('next','With more warming, the species will most likely…',[['summit','run out of mountain, as its band moves past the summit and shrinks'],['adapt','evolve to bear the heat within a few years and stay where it is'],['cool','find the summit itself cooling down while the lowlands warm up']],'summit','Explaining range shifts on a mountain')],
   'Show how the differences add up in both lineages, and how far each degree moves a temperature uphill.',
   'Each lineage changes 1% of 1,000 positions, 10 positions, every 10 million years, so 6 positions in 6 million years. Both lineages change, so the two species differ at about 2 × 6 = 12 positions; counting only one lineage would give 6. Differences build up at 2 positions per million years, so 30 differences mean about 30 ÷ 2 = 15 million years. Over long times some positions change twice, so real clocks need corrections. Each degree moves a temperature about 1 ÷ 6.5 km, about 154 m, uphill, so 2.6 °C moves it 2.6 ÷ 6.5 = 0.4 km = 400 m: the band now runs from 3,000 m to the 3,400 m summit. A cone-shaped mountain is narrower near the top, so the band covers less ground, and more warming leaves the species nowhere higher to go. Individuals can adjust only within limits, and lasting change takes many generations and suitable inherited variation, so a few years is far too short.',
   'Human and chimpanzee DNA differ at about 1.2% of positions, and fossils suggest they split 6 to 7 million years ago. Use the same reasoning to find the rate at which each lineage changed.'),
 'is-c13':t('is-c13',0,'medium','Heat flow and a steady body',
   'In an insulated cup, 200 g of water at 80 °C is mixed with 600 g of water at 20 °C. Water needs 4.18 J to warm 1 g by 1 °C. What is the final temperature, in °C? How many joules does the hot water give off? Iron needs only 0.45 J to warm 1 g by 1 °C. If 200 g of iron at 80 °C is dropped into 600 g of water at 20 °C instead, what is the final temperature, to the nearest degree? Then choose what the body does when exercise on a hot day raises its core temperature to 38 °C.',
   [n('final','Final temperature of the mixed water (°C)',35,'Balancing energy lost and gained'),
    n('energy','Joules the hot water gives off',37620,'Using Q = m × c × ΔT',['final']),
    n('iron','Final temperature with the iron, to the nearest degree (°C)',22,'Comparing specific heats'),
    c('response','When the core reaches 38 °C, the body…',[['sweat','sweats and widens skin blood vessels, losing heat toward 37 °C'],['reset','raises its set point so that 38 °C becomes its new normal'],['shiver','starts shivering, which uses up the extra heat in the muscles']],'sweat','Explaining negative feedback')],
   'Write the energy the hot sample loses and the cold sample gains, and explain which way each body response moves the temperature.',
   'The hot water loses as much energy as the cold water gains: 200 × 4.18 × (80 − T) = 600 × 4.18 × (T − 20), so 200 × (80 − T) = 600 × (T − 20) and T = 35 °C, nearer the larger cold mass. The hot water gives off 200 × 4.18 × 45 = 37,620 J. With iron: 200 × 0.45 × (80 − T) = 600 × 4.18 × (T − 20), so T = (7,200 + 50,160) ÷ (90 + 2,508) ≈ 22.1 °C. Iron gives off so little energy for each degree that the water barely warms. A core above the set point triggers sweating and wider skin blood vessels, which lose heat and push the temperature back toward 37 °C: negative feedback. The set point rises in a fever, not in exercise, and shivering makes heat rather than using it up.',
   'Why does the final temperature with iron depend so little on the iron’s starting temperature? Try 200 g of iron at 100 °C.'),
 'is-c14':t('is-c14',0,'challenging','Ions in balance, reactions in a hurry',
   'Aluminum atoms lose 3 electrons to become Al³⁺ ions, and sulfur atoms gain 2 to become S²⁻ ions. In aluminum sulfide, how many sulfide ions are there for every 2 aluminum ions? A reaction’s rate doubles for every 10 °C its temperature rises. How many times as fast does it run at 50 °C as at 20 °C? In this reaction, the rate is also proportional to the concentration of one reactant, A. How many times as fast does it run at 50 °C with twice the concentration of A, compared with 20 °C and the original concentration? Then choose why heating speeds up a reaction so much.',
   [n('sulfide','Sulfide ions for every 2 aluminum ions',3,'Balancing ionic charges'),
    n('heat','How many times as fast at 50 °C as at 20 °C',8,'Applying a doubling rule for temperature'),
    n('both','How many times as fast with heating and twice the concentration',16,'Combining factors that multiply',['heat']),
    c('why','Heating speeds up a reaction mainly because…',[['share','a larger share of collisions has the energy the reaction needs'],['often','the particles collide more often, and that is the main reason'],['bonds','the heat breaks all the bonds, so atoms can join in any way']],'share','Explaining reaction rates with collision energy')],
   'Show how the charges cancel, and show each factor that multiplies the rate.',
   'Two Al³⁺ ions carry +6, and three S²⁻ ions carry −6, so aluminum sulfide is Al₂S₃: 3 sulfide ions for every 2 aluminum ions, the same pattern as Al₂O₃, because sulfur is below oxygen in the same column. From 20 °C to 50 °C is three steps of 10 °C, so the rate doubles three times: 2 × 2 × 2 = 8. Twice the concentration doubles it again: 8 × 2 = 16. The doubling rule is only a rough guide: in the lab’s model, a reaction with a 50 kJ/mol barrier runs about 6.7 times as fast at 50 °C as at 20 °C. Heating does make collisions a little more frequent, but the main effect is that a much larger share of collisions has at least the activation energy, and only those can react.',
   'A catalyst lowers the activation energy. Explain why that speeds up a reaction without heating it, and name one kind of catalyst in your body.')
};
// Two parts: the middle-school lessons and the high-school lessons, each in the order of the course.
const parts=[
 {id:'grades-6-8',title:'Grades 6–8',scope:'Cells, heating and melting, rain shadows and the greenhouse effect, particles and atoms, plates, populations, crashes, the Moon, natural selection and waves, as the course’s lessons 1–12 model them',tasks:['is-c09','is-c01','is-c10','is-c05','is-c06','is-c07','is-c08']},
 {id:'high-school',title:'High school',scope:'Food chains and the carbon cycle, DNA and inheritance, homeostasis and range shifts, combustion, heat flow, ions, reaction rates, climate feedbacks and the pH scale, as the course’s lessons 13–24 model them',tasks:['is-c11','is-c12','is-c03','is-c13','is-c02','is-c14','is-c04']}
];
const all={...published,...added};
const CHALLENGES={'integrated-science':{
 ...before,
 scope:'All 24 lessons of the course, in two parts: grades 6–8 (lessons 1–12) and high school (lessons 13–24)',
 parts,
 notChecked:before.notChecked,
 suppliedInformation:[...before.suppliedInformation,
  {task:'is-c09',note:'The formulas for a cube’s surface area and volume are supplied.'},
  {task:'is-c10',note:'The course’s rates of cooling and the cloud-base rule are supplied, as is the warming for each doubling of carbon dioxide.'},
  {task:'is-c11',note:'The share of energy passed on, the 2020 peak and the yearly rise are supplied.'},
  {task:'is-c12',note:'The rate of DNA change and how fast air cools with height are supplied.'},
  {task:'is-c13',note:'The specific heats of water and iron are supplied.'},
  {task:'is-c14',note:'The ions’ charges and a doubling rule for temperature are supplied; the course’s own model of rates is not a doubling rule.'}],
 tasks:parts.flatMap(p=>p.tasks.map(id=>all[id]))
}};
const api={VERSION,CHALLENGES};
if(typeof module==='object'&&module.exports)module.exports=api;else root.QuidenceScienceChallengesV3=api;
})(typeof window==='undefined'?globalThis:window);
