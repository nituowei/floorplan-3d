const fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const code=src.slice(src.indexOf('function addOpening('),src.indexOf('function wallFields('));
const ctx={WALLS:[],WINS:[],DOORS:[],SLIDES:[],BAYS:[],ROOMS:[],state:{demolished:[]},ui:{sel:null},DEFAULT_PLAN:{wins:[]},tr:a=>a,mutate:fn=>fn(),toast:()=>{},validRect:r=>Array.isArray(r)&&r.length>=4&&r.slice(0,4).every(Number.isFinite)&&r[2]>r[0]&&r[3]>r[1],uid:(()=>{let n=0;return ()=>'id'+(++n)})(),planRect:(a,b)=>[Math.min(a.x,b.x),Math.min(a.y,b.y),Math.max(a.x,b.x),Math.max(a.y,b.y)]};
vm.createContext(ctx);vm.runInContext(code,ctx);
vm.runInContext(src.slice(src.indexOf('function validPlan('),src.indexOf('function load(')),ctx);
function check(js){vm.runInContext(js,ctx);}
check(`const old={walls:[],wins:[[0,0,1000,100]],doors:[],slides:[],rooms:[]};
if(!validPlan(old))throw Error('old plan without bays was rejected');
if(!validPlan({...old,bays:[{rect:[0,0,1000,100],projection:600,side:-1,sill:450,height:1500}]}))throw Error('bay plan was rejected');`);
check(`
WALLS.push([0,0,2000,240,'e',2800,'h'],[1760,0,2000,2000,'e',2800,'v']);
WINS.push([500,0,2000,240,.45,1500],[1760,0,2000,1300,.45,1500]);
setOpeningCuts('win',0,cutOpeningFromWalls(openingRect('win',0)));
setOpeningCuts('win',1,cutOpeningFromWalls(openingRect('win',1)));
if(connectedWindows(0).length!==2)throw Error('L windows did not connect');
mergeAdjacentWindows(0);
if(!WINS[0][7]||WINS[0][7]!==WINS[1][7])throw Error('group id missing');
const initial=windowGroupMembers(0).map(i=>WINS[i].slice(0,4));
for(let n=0;n<12;n++)moveWindowGroup([0,1],initial,0,300+n);
if(WALLS.length>24)throw Error('wall pieces grew: '+WALLS.length);
if(WINS[0][1]!==initial[0][1]+311||WINS[1][1]!==initial[1][1]+311)throw Error('group motion failed');
restoreWindowGroup([0,1]);WINS.splice(0,2);
if(!WALLS.some(w=>w[0]<=1000&&w[2]>1000&&w[1]<=100&&w[3]>100))throw Error('old horizontal wall not restored');
`);
check(`
WALLS.splice(0,WALLS.length,[10000,600,11130,760,'e',2800,'h'],[11030,760,11130,2650,'e',2800,'v'],[10000,2650,11130,2800,'e',2800,'h']);
state.demolished=[];WINS.splice(0,WINS.length,[10510,660,11130,760],[11030,760,11130,2650],[10510,2650,11130,2750]);
DEFAULT_PLAN.wins=Array.from({length:6},()=>[0,0,1,1]).concat(WINS.map(w=>[...w]));
for(let i=0;i<3;i++)setOpeningCuts('win',i,cutOpeningFromWalls(openingRect('win',i)));
mergeAdjacentWindows(0);
if(windowGroupMembers(0).length!==3)throw Error('three-sided bay group failed');
if(WINS.some(w=>windowSill(w)!==.45||windowHeight(w)!==1950))throw Error('legacy bay elevations lost');
if(!windowsTouch(WINS[0],WINS[1])||!windowsTouch(WINS[1],WINS[2]))throw Error('glass centerlines did not join');
`);
check(`
WALLS.splice(0,WALLS.length,[0,3000,1000,3240,'n',2800,'h'],[1000,3000,2200,3240,'n',2800,'h']);
state.demolished=[];ui.sel={kind:'wall',index:0};mergeAdjacentWalls(0);
if(WALLS.length!==1||WALLS[0][2]!==2200||ui.sel.index!==0)throw Error('wall merge failed');
WALLS.push([2200,3000,2440,4500,'n',2800,'v'],[2200,3000,3000,3240,'e',2800,'h']);
mergeAdjacentWalls(0);
if(WALLS.length!==3)throw Error('wall merge crossed a corner or changed type');
`);
check(`
WALLS.splice(0,WALLS.length,[0,0,1000,240,'n',2800,'h'],[1150,15,2200,255,'n',2800,'h']);
state.demolished=[];DOORS.push({rect:[1000,0,1150,240]});
mergeAdjacentWalls(0);
if(WALLS.length!==2)throw Error('wall merge filled a door opening');
DOORS.pop();mergeAdjacentWalls(0);
if(WALLS.length!==1||WALLS[0][0]!==0||WALLS[0][2]!==2200||WALLS[0][1]!==0||WALLS[0][3]!==240)
  throw Error('near-collinear wall merge failed');
WALLS.splice(0,WALLS.length,[0,0,1000,240,'n',2800,'h'],[1000,0,1150,240,'b',2800,'h'],[1150,0,2200,240,'n',2800,'h']);
mergeAdjacentWalls(0);
if(WALLS.length!==3)throw Error('wall merge overwrote an incompatible wall');
`);
check(`
WALLS.splice(0,WALLS.length,[0,0,3000,240,'e',2800,'h']);state.demolished=[];
ROOMS.push({poly:[[0,240],[3000,240],[3000,2500],[0,2500]]});
addOpening('bay',{x:500,y:120},{x:2000,y:120},[500,0,2000,240]);
if(BAYS.length!==1||BAYS[0].side!==-1||BAYS[0].projection!==600)throw Error('bay creation or side failed');
const footprint=bayFootprintRect(BAYS[0]);if(footprint[1]!==-600||footprint[3]!==240)throw Error('bay footprint failed');
if(!BAYS[0].cuts.length)throw Error('bay did not cut wall');
restoreOpeningWall('bay',0);BAYS.splice(0,1);
if(!WALLS.some(w=>w[0]<=1000&&w[2]>1000&&w[1]<=100&&w[3]>100))throw Error('bay wall not restored');
`);
check(`
WALLS.splice(0,WALLS.length,[0,0,3000,240,'e',2800,'h']);state.demolished=[];BAYS.splice(0,BAYS.length);
addOpening('bay',{x:500,y:120},{x:1800,y:120},[500,0,1800,240]);
setOpeningRect('bay',0,[1000,0,2300,240],null);
if(BAYS[0].rect[0]!==1000||!BAYS[0].cuts.length)throw Error('bay resize did not cut new wall');
if(!WALLS.some(w=>w[0]<=500&&w[2]>500&&w[1]<=100&&w[3]>100))throw Error('bay resize did not restore old wall');
`);
console.log('Old/new plan validation, window groups, repeated move/repair, wall merge, bay footprint/cut/resize: passed');
