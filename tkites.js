"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  d.append(c);
  return c.getContext("2d");
})();

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var randomColor=()=>{
  let h=getRandomInt(0,360);
  let s=70+20*Math.random();
  let l=70+20*Math.random();
  return "hsla("+h+","+s+"%,"+l+"%)";
}

var D=400;
onresize=function() { 
  D=Math.min(window.innerWidth,window.innerHeight); 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  ctx.translate(D/2,D/2);
  ctx.lineWidth=0.4;
  setPoints();
}

var pts=[]

var setPoints9=()=>{
  let R=ctx.canvas.width/4;
  pts=[];
  for (let z=0, counter=0; z<=TP; z+=TP/80, counter++) {
    pts.push({"x":R*(Math.sin(z)+Math.sin(9*z)),"y":R*(Math.cos(z)-Math.cos(9*z))});
  }
  tileSets[0].setTiles(generateTiles([32,31,22,23],0));
  tileSets[1].setTiles(generateTiles([32,31,22,23],1));
  tileSets[2].setTiles(generateTiles([2,3,74,73],0));
  tileSets[3].setTiles(generateTiles([2,3,74,73],1));
  tileSets[4].setTiles(generateTiles([29,28,37,38],0));
  tileSets[5].setTiles(generateTiles([29,28,37,38],1));
}

var setPoints11=()=>{
  let R=ctx.canvas.width/4;
  pts=[];
  for (let z=0, counter=0; z<=TP; z+=TP/120, counter++) {
    pts.push({"x":R*(Math.sin(z)+Math.sin(11*z)),"y":R*(Math.cos(z)-Math.cos(11*z))});
  }
/*
  tileSets[0].setTiles(generateTiles11([0,1,38,39],0));
  tileSets[1].setTiles(generateTiles11([0,1,38,39],1));
  tileSets[2].setTiles(generateTiles11([0,1,38,39],2));
  tileSets[3].setTiles(generateTiles11([0,1,38,39],3));
*/
  tileSets[0].setTiles(generateTiles11([0,1,12,11],0));
  tileSets[1].setTiles(generateTiles11([0,1,12,11],1));
  tileSets[2].setTiles(generateTiles11([0,1,12,11],2));
  tileSets[3].setTiles(generateTiles11([0,1,12,11],3));
  tileSets[4].setTiles(generateTiles11([1,2,13,12],0));
  tileSets[5].setTiles(generateTiles11([1,2,13,12],1));
  tileSets[6].setTiles(generateTiles11([1,2,13,12],2));
  tileSets[7].setTiles(generateTiles11([1,2,13,12],3));
/*
  tileSets[8].setTiles(generateTiles11([3,4,113,112],0));
  tileSets[9].setTiles(generateTiles11([3,4,113,112],1));
  tileSets[10].setTiles(generateTiles11([3,4,113,112],2));
  tileSets[11].setTiles(generateTiles11([3,4,113,112],3));
*/

  tileSets[8].setTiles(generateTiles11([2,3,14,13],0));
  tileSets[9].setTiles(generateTiles11([2,3,14,13],1));
  tileSets[10].setTiles(generateTiles11([2,3,14,13],2));
  tileSets[11].setTiles(generateTiles11([2,3,14,13],3));

  tileSets[12].setTiles(generateTiles11([4,5,114,113],0));
  tileSets[13].setTiles(generateTiles11([4,5,114,113],1));
  tileSets[14].setTiles(generateTiles11([4,5,114,113],2));
  tileSets[15].setTiles(generateTiles11([4,5,114,113],3));
}

var Tile=function(p1,p2,p3,p4) {
  this.v=[p1,p2,p3,p4];
  this.draw=(frac)=>{
    let f=frac/2;
    ctx.beginPath();
    ctx.moveTo(this.v[0].x,this.v[0].y);
    //ctx.lineTo((2-f)/2*this.v[1].x+f/2*this.v[3].x,(2-f)/2*this.v[1].y+f/2*this.v[3].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v[3].x,(1-f)*this.v[1].y+f*this.v[3].y);
    ctx.lineTo(this.v[2].x,this.v[2].y);
    //ctx.lineTo((2-f)/2*this.v[3].x+f/2*this.v[1].x,(2-f)/2*this.v[3].y+f/2*this.v[1].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v[1].x,(1-f)*this.v[3].y+f*this.v[1].y);
    //ctx.lineTo(pts[p1].x,pts[p1].y);
    ctx.closePath();
    ctx.stroke();
  }
  this.shift=()=>{ this.v.push(this.v.shift()); }
}

var TileSet=function(tp) {
  this.tiles=tp;
  this.color="red";
  this.color2=randomColor();
  this.state=0;
  this.setTiles=(tis)=>{
    this.tiles=tis;
  }
  this.randomizeFlip=()=>{
    if (Math.random()<0.5) {
      this.tiles.forEach((ti)=>{ ti.shift() });
    }
  }
  this.getFrac=()=>{
    if (this.state==0) {
      return 0;
    } else if (this.state==1) {
      return frac;
    } else if (this.state==-1) {
      return 1-frac;
    } else {
      debugger;
    }
  }
  this.transit=()=>{
    if (this.state==1) {
      this.color=this.color2;
      this.state=-1;
      return 1;
    } else if (this.state==-1) {
      this.state=0;
      return 0;
    } else {
      return 0;
    }
  }
  this.drawTiles=()=>{
    ctx.fillStyle=this.color;
    for (let tile of this.tiles) {

if (this.getFrac()!=0) {
  tile.draw(0);
  ctx.fillStyle="silver";
  ctx.fill();
  ctx.fillStyle=this.color;
}

       tile.draw(this.getFrac());
       ctx.fill();
    }
  }
}

var generateTiles9=(c,alt)=>{
  let t=[];
  for (let i=0; i<10; i++) {
    if (i%2==alt) continue;
    t.push(new Tile(
      pts[(i*8+c[0])%80],
      pts[(i*8+c[1])%80],
      pts[(i*8+c[2])%80],
      pts[(i*8+c[3])%80],
    ));
  }
  return t;
}

var generateTiles11=(c,alt)=>{
  let t=[];
  for (let i=0; i<12; i++) {
    if (i%4==alt) {
      t.push(new Tile(
	pts[(i*10+c[0])%120],
	pts[(i*10+c[1])%120],
	pts[(i*10+c[2])%120],
	pts[(i*10+c[3])%120],
      ));
    }
  }
  return t;
}

var tileSets9=[
  new TileSet(),
  new TileSet(),
  new TileSet(),
  new TileSet(),
  new TileSet(),
  new TileSet(),
];

var tileSets11=(()=>{ let ti=[]; for (let i=0; i<16; i++) ti.push(new TileSet()); return ti; })();

/*
var tdraw=(p1,p2,p3,p4)=>{
  ctx.beginPath();
  ctx.moveTo(pts[p1].x,pts[p1].y);
  ctx.lineTo(pts[p2].x,pts[p2].y);
  ctx.lineTo(pts[p3].x,pts[p3].y);
  ctx.lineTo(pts[p4].x,pts[p4].y);
  ctx.lineTo(pts[p1].x,pts[p1].y);
  ctx.closePath();
  ctx.stroke();
}
*/

var oldct=[];
var ct=[];
var randomizePattern9=()=>{
  let ctl=[
    // 2 color
    [[0,0],[1,1],[0,0]],  
    // 3 color
    [[0,0],[1,1],[0,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[1,2],[0,0]],
    [[0,1],[2,2],[0,1]],
    [[0,1],[2,2],[1,0]],
    [[0,1],[2,2],[0,0]],
    // 4 color
    [[0,0],[1,1],[2,3]],
    [[0,0],[1,2],[3,3]],
    [[0,1],[2,2],[3,3]],
    // 5 color
    [[0,1],[2,2],[3,4]],
  ][getRandomInt(0,11)];
}

var randomizePattern11=()=>{
  let ctl=[
/*
    // 2 color
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[1,1,1,1]],  
    // 3 color
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[2,2,2,2]],  
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[1,2,1,2]],  
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[1,2,2,1]],  
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[1,2,2,2]],  
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[1,1,1,2]],  

    [[0,0,0,0],[1,1,1,1],[0,0,0,2],[1,1,1,1]],  
    [[0,0,0,0],[1,1,1,1],[0,2,0,2],[1,1,1,1]],  
    [[0,0,0,0],[1,1,1,1],[0,2,2,0],[1,1,1,1]],  
    [[0,0,0,0],[1,1,1,1],[0,2,2,2],[1,1,1,1]],  

    [[0,0,0,0],[1,1,1,2],[0,0,0,0],[1,2,1,1]],
    [[0,0,0,0],[1,1,1,2],[0,0,0,0],[1,1,1,2]],
    [[0,0,0,0],[1,1,1,2],[0,0,0,0],[2,1,2,2]],
    [[0,0,0,0],[1,1,1,2],[0,0,0,0],[2,2,2,1]],

    [[0,0,0,0],[1,2,1,2],[0,0,0,0],[1,1,1,1]],
    [[0,0,0,0],[1,2,1,2],[0,0,0,0],[1,2,1,2]],
    [[0,0,0,0],[1,2,1,2],[0,0,0,0],[2,1,2,1]],
    [[0,0,0,0],[1,2,1,2],[0,0,0,0],[1,1,1,2]],
    [[0,0,0,0],[1,2,1,2],[0,0,0,0],[1,2,2,2]],  

    [[0,0,0,0],[1,2,2,1],[0,0,0,0],[1,1,1,1]],
    [[0,0,0,0],[1,2,2,1],[0,0,0,0],[2,1,1,2]],
    [[0,0,0,0],[1,2,2,1],[0,0,0,0],[1,2,2,1]],

    [[1,0,0,0],[2,2,2,2],[0,0,0,0],[1,1,1,1]],  
    [[1,0,0,0],[2,2,2,2],[0,0,0,0],[2,2,2,2]],  
    [[1,0,0,0],[2,2,2,2],[0,0,0,0],[1,2,2,1]],
    [[1,0,0,0],[2,2,2,2],[0,0,0,0],[2,1,1,2]],  
    [[0,0,1,0],[2,2,2,2],[0,0,0,0],[1,1,1,1]],  
    [[0,0,1,0],[2,2,2,2],[0,0,0,0],[2,2,2,2]],  
    [[0,0,1,0],[2,2,2,2],[0,0,0,0],[1,2,2,1]],
    [[0,0,1,0],[2,2,2,2],[0,0,0,0],[2,1,1,2]],  
    [[1,0,0,0],[2,2,2,2],[0,1,0,0],[2,2,2,2]],  
    [[1,0,0,0],[2,2,2,2],[0,0,0,1],[2,2,2,2]],  
    [[1,0,0,0],[2,2,2,2],[0,1,0,1],[2,2,2,2]],  
    [[1,0,0,0],[2,2,2,2],[1,0,1,0],[2,2,2,2]],  
    [[0,0,1,0],[2,2,2,2],[0,1,0,0],[2,2,2,2]],  
    [[0,0,1,0],[2,2,2,2],[0,0,0,1],[2,2,2,2]],  
    [[0,0,1,0],[2,2,2,2],[0,1,0,1],[2,2,2,2]],  
    [[0,0,1,0],[2,2,2,2],[1,0,1,0],[2,2,2,2]],  

    [[0,1,0,1],[2,2,2,2],[0,0,0,0],[1,1,1,1]],  
    [[0,1,0,1],[2,2,2,2],[0,1,0,1],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[0,1,0,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[0,0,0,1],[2,2,2,2]],  
    [[0,1,1,0],[2,2,2,2],[0,0,0,0],[1,1,1,1]],  
    [[0,1,1,0],[2,2,2,2],[0,0,0,0],[2,2,2,2]],  
    [[0,1,1,0],[2,2,2,2],[0,0,1,1],[2,2,2,2]],  
    [[0,1,1,0],[2,2,2,2],[1,1,0,0],[2,2,2,2]],  
    [[0,1,1,0],[2,2,2,2],[0,0,0,0],[2,1,2,2]],  
    [[0,1,1,0],[2,2,2,2],[0,0,0,0],[1,2,1,1]],  

    // 4 color

    [[0,1,2,1],[3,3,3,3],[0,0,0,0],[1,1,1,1]],  
    [[0,1,2,1],[3,3,3,3],[2,2,2,2],[1,1,1,1]],  
    [[0,1,2,1],[3,3,3,3],[0,0,0,0],[2,2,2,2]],  

    [[0,1,2,1],[3,3,3,3],[2,0,2,1],[3,3,3,3]],  
    [[0,1,2,1],[3,3,3,3],[1,0,1,2],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[0,1,0,1],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[0,2,0,2],[3,3,3,3]],  
    [[0,1,2,1],[3,3,3,3],[2,0,2,0],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,0,2,1],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,0,2,2],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,1,2,0],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,1,2,1],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,1,2,2],[3,3,3,3]],
    [[0,1,2,1],[3,3,3,3],[2,2,2,0],[3,3,3,3]],

    [[1,0,1,0],[2,3,3,2],[0,0,0,0],[1,1,1,1]],  
    [[1,0,1,0],[2,3,3,2],[0,0,0,0],[2,2,2,2]],  
    [[1,0,1,0],[2,3,3,2],[0,0,0,0],[3,3,3,3]],  
    [[1,0,1,0],[2,3,3,2],[1,0,1,0],[2,2,2,2]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[1,1,1,1]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[2,2,2,2]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[3,3,3,3]],  
    [[0,0,1,1],[2,3,3,3],[0,1,1,0],[2,3,3,3]],  
    [[0,0,1,1],[2,3,3,3],[0,1,1,0],[3,3,3,3]],  
    [[0,0,1,1],[2,3,3,3],[0,1,1,0],[2,2,2,2]],  
    [[0,0,1,1],[2,2,2,2],[0,1,1,0],[2,2,2,2]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[1,1,2,1]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[2,2,1,2]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[3,3,1,3]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[1,1,3,1]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[3,3,2,3]],  
    [[0,0,1,1],[2,3,3,3],[0,0,0,0],[2,2,3,2]],  
    [[0,0,1,1],[2,3,2,3],[0,0,0,0],[1,1,1,1]],  
    [[0,0,1,1],[2,3,2,3],[0,0,0,0],[2,2,2,2]],  
    [[0,0,1,1],[2,3,2,3],[0,1,1,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,0],[3,3,3,3]],  
    [[0,1,0,1],[2,2,2,2],[0,1,0,1],[3,3,3,3]],  

    [[0,1,0,1],[2,2,2,2],[0,1,0,0],[3,3,3,3]],  
    [[0,1,0,1],[2,2,2,2],[0,1,0,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[0,3,0,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,3],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,1],[3,3,3,3]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,1],[2,2,2,2]],  

    [[0,0,0,1],[2,3,3,2],[0,0,0,0],[1,1,1,1]],  

    [[0,0,0,0],[1,2,3,2],[0,0,0,0],[1,1,1,1]],  
    [[0,0,0,0],[1,2,3,2],[0,0,0,0],[2,2,2,2]],  
    [[0,0,0,0],[1,2,3,2],[0,0,0,0],[1,2,2,2]],  
    [[0,0,0,0],[1,2,3,2],[0,0,0,0],[1,2,1,2]],  
    [[0,0,0,0],[1,2,3,2],[0,0,0,0],[1,2,3,2]],  
*/

    [[0,0,0,1],[2,3,3,2],[0,0,1,0],[2,2,2,2]],  
    [[0,1,0,1],[2,2,2,2],[1,0,1,1],[2,2,3,3]],  
    [[0,1,0,1],[2,2,2,2],[1,0,0,1],[3,3,3,3]],  

  ]
  ct=ctl[getRandomInt(0,ctl.length)];
}

var T=true;

var draw=()=>{
  ctx.clearRect(-400,-400,800,800);
  for (let ts of tileSets) ts.drawTiles();
}

/*
var drawO=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  ctx.font="18px serif";
  ctx.beginPath();
  ctx.moveTo(pts[0].x,pts[0].y);
  for (let i=1; i<pts.length; i++) {
    ctx.lineTo(pts[i].x,pts[i].y);
    ctx.fillText(i,pts[i].x+30-60*Math.random(),pts[i].y);
  }
  ctx.closePath();
  ctx.stroke();
}
*/

var transitColors9=()=>{
  for (let tset of tileSets) {
    tset.color=tset.color2;
    tset.randomizeFlip();
  }
  let fillColor=[];
  for (let i=0; i<5; i++) fillColor.push(randomColor());
  //randomizePattern();
  tileSets[0].color2=fillColor[ct[0][0]]; 
  tileSets[1].color2=fillColor[ct[0][1]]; 
  tileSets[2].color2=fillColor[ct[1][0]]; 
  tileSets[3].color2=fillColor[ct[1][1]]; 
  tileSets[4].color2=fillColor[ct[2][0]]; 
  tileSets[5].color2=fillColor[ct[2][1]]; 
}

var transitColors11=()=>{
  for (let tset of tileSets) {
    tset.color=tset.color2;
    tset.randomizeFlip();
  }
  let fillColor=[];
  for (let i=0; i<4; i++) fillColor.push(randomColor());
  tileSets[0].color2=fillColor[ct[0][0]]; 
  tileSets[1].color2=fillColor[ct[0][1]]; 
  tileSets[2].color2=fillColor[ct[0][2]]; 
  tileSets[3].color2=fillColor[ct[0][3]]; 
  tileSets[4].color2=fillColor[ct[1][0]]; 
  tileSets[5].color2=fillColor[ct[1][1]]; 
  tileSets[6].color2=fillColor[ct[1][2]]; 
  tileSets[7].color2=fillColor[ct[1][3]]; 
  tileSets[8].color2=fillColor[ct[2][0]]; 
  tileSets[9].color2=fillColor[ct[2][1]]; 
  tileSets[10].color2=fillColor[ct[2][2]]; 
  tileSets[11].color2=fillColor[ct[2][3]]; 
  tileSets[12].color2=fillColor[ct[3][0]]; 
  tileSets[13].color2=fillColor[ct[3][1]]; 
  tileSets[14].color2=fillColor[ct[3][2]]; 
  tileSets[15].color2=fillColor[ct[3][3]]; 
}

var randomizeColors=()=>{
  for (let tset of tileSets) {
    tset.color=tset.color2;
    tset.color2=randomColor();
    tset.randomizeFlip();
  }
}

var order9=[0,1,2,3,4,5];
var order11=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var shuffle=()=>{
  let no=[];
  do {
    no.push(order.splice(getRandomInt(0,order.length),1)[0]);
  } while (order.length>0);
  order=no;
}

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var addFlips=()=>{
  if (setCount<tileSets.length-2) {
    if (Math.random()<0.4) {
      tileSets[order[setCount++]].state=1;
      addFlips();
    }
  }
}

var time=0;
var stopped=true;
var frac=1;
//var duration=400;
var duration=300;
var setCount=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  let af=animate;
  if (progress<duration) {
    frac=progress/duration;
  } else {
    time=0;
    frac=0;
    let active=0;
    for (let tset of tileSets) {
      active+=tset.transit();
    }
    if (active==0) {
      //setCount=(++setCount)%tileSets.length;
      setCount++;
      if (setCount==tileSets.length) {
        setCount=0;
//T=!T;
if (T) {
oldct=ct;
        randomizePattern();
        transitColors();
        shuffle();
} else {
  randomizeColors();
//        pauseTS=performance.now()+2000;
//        af=pause;
}
        pauseTS=performance.now()+2000;
        af=pause;
      }
/*
      if (setCount<tileSets.length-2) {
	if (Math.random()<0.3) tileSets[order[setCount++]].state=1;
      }
*/
      addFlips();
      tileSets[order[setCount]].state=1;
    }
  }
  draw();
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var tileSets=tileSets11;
var setPoints=setPoints11;
var generateTiles=generateTiles11;
var randomizePattern=randomizePattern11;
var transitColors=transitColors11;
var order=order11;
/*
var tileSets=tileSets9;
var setPoints=setPoints9;
var generateTiles=generateTiles9;
var randomizePattern=randomizePattern9;
var transitColors=transitColors9;
var order=order9;
*/

onresize();

randomizePattern();
//transitColors();
transitColors();
shuffle();
tileSets[order[0]].state=1;
//draw(1);
start();
