(function(root){
'use strict';
const GAMES={
  showcase:{name:'The school showcase',story:'Two teams independently choose a display theme. Their points depend on both choices.',rows:['Space','Ocean'],cols:['Space','Ocean'],payoffs:[[[4,3],[0,1]],[[1,0],[3,5]]]},
  packaging:{name:'The packaging choice',story:'Two booths independently choose plain or bright packaging. These fictional points represent each booth’s preference for the outcome.',rows:['Plain','Bright'],cols:['Plain','Bright'],payoffs:[[[3,3],[1,4]],[[5,0],[2,2]]]},
  resource:{name:'The resource game',story:'Two teams each choose Share or Keep, at the same time, for one round. Each knows this table. There is no binding agreement or future round.',rows:['Share','Keep'],cols:['Share','Keep'],payoffs:[[[3,3],[0,5]],[[5,0],[1,1]]]},
  meetup:{name:'The meetup choice',story:'Two friends choose a meeting place independently. Meeting together is better for both, but they prefer different places.',rows:['Library','Café'],cols:['Library','Café'],payoffs:[[[4,3],[0,0]],[[0,0],[3,5]]]},
  transferRead:{name:'A new display',story:'Two clubs choose a display independently. Read the outcome at their chosen row and column.',rows:['Art','Science'],cols:['Art','Science'],payoffs:[[[2,5],[6,1]],[[3,7],[4,2]]]},
  transferBest:{name:'A new booth',story:'Two booths choose a sign independently. Higher points are preferred by each booth.',rows:['Small','Large'],cols:['Small','Large'],payoffs:[[[5,4],[2,7]],[[7,1],[3,3]]]},
  transferDilemma:{name:'A new shared-resource choice',story:'Two groups independently choose Pool or Reserve, once, with no binding agreement. Higher points are preferred by each group.',rows:['Pool','Reserve'],cols:['Pool','Reserve'],payoffs:[[[4,4],[1,6]],[[6,1],[2,2]]]},
  transferNash:{name:'A new route choice',story:'Two teams choose North or South independently. Check each team’s payoff when only that team switches.',rows:['North','South'],cols:['North','South'],payoffs:[[[2,4],[0,1]],[[1,0],[5,3]]]}
};
const option=(id,label)=>({id,label});
const LESSONS=[
 {id:'payoffs',title:'Read a payoff table',short:'Payoffs',goal:'Connect two choices to two separate payoffs.',game:'showcase',start:[1,0],
  steps:[
   {title:'A choice can depend on someone else.',text:'Game theory studies situations where your outcome depends on your own choice and other people’s choices. In these small games, each player makes one choice without seeing the other choice first.'},
   {title:'Two players. Two directions.',text:'Team A chooses a row. Team B chooses a column. Their choices together select one cell. A strategy here is a single action, such as choosing Space. In games with several turns, a strategy can be a complete plan.'},
   {title:'Keep the two payoffs separate.',text:'Each pair is ordered (A, B): the first number is A’s payoff and the second is B’s. A larger number means that player prefers that outcome. A payoff can represent value or satisfaction; it is not automatically money or a class grade.'},
   {title:'Try another pair of choices.',text:'Use the two controls below. If A chooses Ocean and B chooses Space, the outcome is (1, 0). If both choose Ocean, it is (3, 5). These are two different outcomes, not two stages of one turn.'}
  ],
  predict:{id:'p1',prompt:'An outcome is written (2, 5), with A first and B second. Who receives 5?',options:[option('a','Team A'),option('b','Team B'),option('both','Both teams')],correct:['b'],explanation:'The pair is ordered (A, B), so the second number belongs to B.'},
  checks:[
   {id:'c1',game:'transferRead',prompt:'A chooses Science and B chooses Art. Which payoff pair is selected?',options:[option('37','(3, 7)'),option('73','(7, 3)'),option('61','(6, 1)'),option('42','(4, 2)')],correct:['37'],explanation:'Science is A’s second row; Art is B’s first column. Their intersection is (3, 7).'},
   {id:'c2',game:'transferRead',prompt:'At (A: Art, B: Science), whose payoff is larger?',options:[option('a','A’s payoff'),option('b','B’s payoff'),option('equal','The payoffs are equal')],correct:['a'],explanation:'This cell is (6, 1): A receives 6 and B receives 1. Read the selected cell rather than the whole table.'}
  ],next:'Practice naming the row player, the column player, and the owner of each number before comparing outcomes.'},
 {id:'responses',title:'Find a best response',short:'Best responses',goal:'Hold the other choice fixed, then compare your own payoffs.',game:'packaging',start:[0,0],
  steps:[
   {title:'Freeze the other player’s choice.',text:'Suppose B chooses Plain. A compares only the first numbers in that column: Plain gives A 3; Bright gives A 5. Bright is A’s best response to B choosing Plain.'},
   {title:'Now test the other possibility.',text:'If B chooses Bright, A compares 1 with 2. Bright is again better for A. A strictly dominant strategy gives a higher own payoff than every alternative for every possible choice of the other player.'},
   {title:'A best response is conditional.',text:'A best response answers “What is best for me if the other player chooses this?” A strictly dominant strategy passes that comparison for every possible other choice. Some games have no dominant strategy. If payoffs tie, there can be several best responses.'},
   {title:'Give B the same careful comparison.',text:'For B, hold A’s row fixed and compare the second numbers across columns. Do not compare A’s payoff with B’s payoff to decide B’s best response. Use the switch buttons below to see one player change at a time.'}
  ],
  predict:{id:'p2',game:'packaging',prompt:'B chooses Plain. Which choice gives A a higher payoff?',options:[option('plain','Plain'),option('bright','Bright'),option('same','They give A the same payoff')],correct:['bright'],explanation:'With B fixed at Plain, compare A’s payoffs 3 and 5. Bright gives A 5.'},
  checks:[
   {id:'c3',game:'transferBest',prompt:'B chooses Large. What is A’s best response?',options:[option('small','Small'),option('large','Large'),option('both','Both are equally good for A')],correct:['large'],explanation:'In B’s Large column, A gets 2 for Small and 3 for Large, so Large is A’s best response.'},
   {id:'c4',game:'transferBest',prompt:'Does A have a strictly dominant strategy in this game?',options:[option('large','Yes: Large'),option('small','Yes: Small'),option('none','No strictly dominant strategy')],correct:['large'],explanation:'Against B’s Small, A prefers Large: 7 > 5. Against B’s Large, A also prefers Large: 3 > 2.'}
  ],next:'Fix the opponent’s choice and compare only your own numbers. Then repeat the comparison for the other possible choice.'},
 {id:'dilemma',title:'Meet the prisoner’s dilemma',short:'The dilemma',goal:'Distinguish individual incentives from an outcome both players prefer.',game:'resource',start:[0,0],
  steps:[
   {title:'Both sharing looks attractive.',text:'If both teams choose Share, each receives 3. If both choose Keep, each receives 1. Both teams prefer (Share, Share) to (Keep, Keep). This describes the table’s preferences, not a rule about how people must behave.'},
   {title:'Check each person’s incentive.',text:'If B shares, A gets 5 by keeping instead of 3 by sharing. If B keeps, A gets 1 by keeping instead of 0 by sharing. Keep is strictly dominant for A; the same comparisons apply to B.'},
   {title:'That is the dilemma.',text:'Each team’s individually better choice leads to (Keep, Keep), although both would prefer (Share, Share). This pattern is called a prisoner’s dilemma. It is not a zero-sum game: the total payoff varies between cells. “One gains” does not always mean “the other loses the same amount.”'},
   {title:'The rules of the model matter.',text:'This example is one round with no binding agreement. Repeated interaction, enforceable agreements, or different preferences can change the analysis. The table does not predict what every real person will choose. Compare both sharing with both keeping in the explorer.'}
  ],
  predict:{id:'p3',game:'resource',prompt:'B chooses Share. Which choice gives A the higher payoff in this one-round table?',options:[option('share','Share'),option('keep','Keep'),option('same','They give A the same payoff')],correct:['keep'],explanation:'With B at Share, A compares 3 for Share with 5 for Keep. Keep gives A more points in this model.'},
  checks:[
   {id:'c5',game:'transferDilemma',prompt:'Both choose Reserve. Which alternative outcome gives both groups a higher payoff?',options:[option('pool','Both choose Pool'),option('a','Only A changes to Pool'),option('b','Only B changes to Pool'),option('none','No other outcome does')],correct:['pool'],explanation:'Both Reserve gives (2, 2); both Pool gives (4, 4). A one-person switch instead gives (1, 6) or (6, 1), so it does not improve both payoffs.'},
   {id:'c6',game:'transferDilemma',prompt:'Why is this a prisoner’s dilemma?',options:[option('tension','Reserve is strictly dominant for each, but both prefer mutual Pool to mutual Reserve'),option('total','The total payoff is always the same'),option('pool','Pool is strictly dominant for both'),option('morals','The table proves that reserving resources is always wrong')],correct:['tension'],explanation:'Each group gains by choosing Reserve for either choice of the other group: 6 > 4 and 2 > 1. Yet both get more at mutual Pool (4, 4) than mutual Reserve (2, 2).'}
  ],next:'Separate a one-person switch from a two-person change. Name the assumptions before applying this model to real situations.'},
 {id:'equilibrium',title:'Check a Nash equilibrium',short:'Nash equilibrium',goal:'Test whether either player can gain by changing alone.',game:'meetup',start:[0,0],
  steps:[
   {title:'Start with a pair of choices.',text:'A Nash equilibrium is a set of choices where each player is choosing a best response to the others. No player can get a higher payoff by changing only their own choice while everyone else keeps theirs fixed.'},
   {title:'Test A, then test B.',text:'At (Library, Library), A gets 4 and would get 0 by switching alone. B gets 3 and would get 0 by switching alone. Neither gains, so this is a Nash equilibrium. Use the two separate switch comparisons below.'},
   {title:'There may be more than one.',text:'At (Café, Café), A would fall from 3 to 0 by switching; B would fall from 5 to 0. This is another Nash equilibrium. A prefers meeting at the library; B prefers meeting at the café. The equilibrium test does not decide which they will choose.'},
   {title:'Stable does not mean best or fair.',text:'The mutual Keep outcome in the resource game is also a Nash equilibrium, even though both prefer mutual Share. An equilibrium need not maximize total payoff, be fair, or be unique. These lessons test pure strategies: one fixed action per player. Some games have no pure-strategy equilibrium; mixed strategies are a later topic.'}
  ],
  predict:{id:'p4',game:'meetup',prompt:'Both choose Library. If only A switches to Café, does A gain?',options:[option('yes','Yes: A’s payoff increases'),option('no','No: A’s payoff decreases'),option('same','A’s payoff stays the same')],correct:['no'],explanation:'A’s payoff changes from 4 at (Library, Library) to 0 at (Café, Library). B’s choice stays fixed.'},
  checks:[
   {id:'c7',game:'transferNash',prompt:'Select every pure-strategy Nash equilibrium. Test both players at each outcome.',multi:true,options:[option('00','A: North · B: North'),option('01','A: North · B: South'),option('10','A: South · B: North'),option('11','A: South · B: South'),option('none','No pure-strategy equilibrium')],correct:['00','11'],explanation:'At (North, North), A would fall from 2 to 1 and B from 4 to 1. At (South, South), A would fall from 5 to 0 and B from 3 to 0. At either off-diagonal outcome, a player can gain by switching alone.'},
   {id:'c8',prompt:'Which statement correctly describes a Nash equilibrium?',options:[option('alone','No player can improve their own payoff by changing alone, with others fixed'),option('equal','Everyone must receive the same payoff'),option('total','The outcome must have the largest total payoff'),option('unique','There can only be one equilibrium')],correct:['alone'],explanation:'The definition concerns a profitable one-player deviation. Equality, the largest total payoff, and uniqueness are not required.'}
  ],next:'For every candidate cell, test A’s switch and B’s switch separately. Reject the cell if either player can gain.'}
];
const api={VERSION:'ac01_content_1',GAMES,LESSONS};
if(typeof module==='object'&&module.exports)module.exports=api;else root.AC01Content=api;
})(typeof window==='undefined'?globalThis:window);
