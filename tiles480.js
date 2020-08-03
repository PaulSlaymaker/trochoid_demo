"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#444";
body.style.margin="20";

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

var D=400;
onresize=function() { 
  D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  ctx.translate(D/2,D/2);
//  ctx.lineWidth=0.8;
  P=D/2; 
  setPoints();
}

function cFrac(frac) {
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Tile=function(p1,p2,p3,p4) {
  this.v=[p1,p2,p3,p4];
  this.v2=[p1,p2,p3,p4];
  this.colorSet;
  this.colorSet2;
  this.shift=()=>{ this.v2.push(this.v2.shift()); }
  this.setColor=(f)=>{
    let h=(this.colorSet.hue+f*(this.colorSet2.hue-this.colorSet.hue+360)%360);
    let s=f*this.colorSet2.sat+(1-f)*this.colorSet.sat;
    let l=f*this.colorSet2.lum+(1-f)*this.colorSet.lum;
    ctx.fillStyle="hsl("+h+","+s+"%,"+l+"%)";
  }
  this.drawC=(frac)=>{
    let f=cFrac(frac);
    let kf=Math.pow(2*frac-1,2)/2+0.5;
    ctx.beginPath();
    let dx=(1-f)*this.v[2].x+f*this.v2[2].x;
    let dy=(1-f)*this.v[2].y+f*this.v2[2].y;
    let fpx=dx*(1-kf);
    let fpy=dy*(1-kf);
    ctx.moveTo(fpx+kf*((1-f)*this.v[0].x+f*this.v2[0].x),fpy+kf*((1-f)*this.v[0].y+f*this.v2[0].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[1].x+f*this.v2[1].x),fpy+kf*((1-f)*this.v[1].y+f*this.v2[1].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[2].x+f*this.v2[2].x),fpy+kf*((1-f)*this.v[2].y+f*this.v2[2].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[3].x+f*this.v2[3].x),fpy+kf*((1-f)*this.v[3].y+f*this.v2[3].y));
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }
  this.drawC2=(frac)=>{
    let f=cFrac(frac);
    ctx.beginPath();
    let dx=(1-f)*this.v[2].x+f*this.v2[2].x;
    let dy=(1-f)*this.v[2].y+f*this.v2[2].y;
    let SI=Math.sin(f*TP/2);
    let CO=Math.cos(f*TP/2);
    //let fpx=0.3*f*dx*Math.sin(f*TP/2);
    //let fpy=0.3*f*dy*Math.sin(f*TP/2);
    let fpx=-0.3*dx*SI;
    let fpy=-0.3*dy*SI;
    ctx.moveTo(fpx+CO*(1-f)*this.v[0].x+f*this.v2[0].x,fpy+CO*(1-f)*this.v[0].y+f*this.v2[0].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[1].x+f*this.v2[1].x,fpy+CO*(1-f)*this.v[1].y+f*this.v2[1].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[2].x+f*this.v2[2].x,fpy+CO*(1-f)*this.v[2].y+f*this.v2[2].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[3].x+f*this.v2[3].x,fpy+CO*(1-f)*this.v[3].y+f*this.v2[3].y);
    //ctx.lineTo(fpx+(1-f)*this.v[2].x+f*this.v2[2].x,fpy+(1-f)*this.v[2].y+f*this.v2[2].y);
    //ctx.lineTo(fpx+(1-f)*this.v[3].x+f*this.v2[3].x,fpy+(1-f)*this.v[3].y+f*this.v2[3].y);
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }

  this.drawZ=(frac)=>{
    let f=cFrac(frac);
    ctx.beginPath();
    ctx.moveTo((1-f)*this.v[0].x+f*this.v2[0].x,(1-f)*this.v[0].y+f*this.v2[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v2[1].x,(1-f)*this.v[1].y+f*this.v2[1].y);
    ctx.lineTo((1-f)*this.v[2].x+f*this.v2[2].x,(1-f)*this.v[2].y+f*this.v2[2].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v2[3].x,(1-f)*this.v[3].y+f*this.v2[3].y);
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }
  this.draw=this.drawZ;
  this.setDraw=(d)=>{
    this.draw=[this.drawZ,this.drawC,this.drawC2][d];
  }
}

var Color=function() {
  this.hue=getRandomInt(0,360);
  this.sat=70+20*Math.random();
  this.lum=70+20*Math.random();
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    //this.sat=70+20*Math.random();
    //this.lum=70+20*Math.random();
    //this.sat=65+25*Math.random();
    //this.lum=65+25*Math.random();
    this.sat=55+30*Math.random();
    this.lum=55+30*Math.random();
  }
}

var shape="B2";
var P=D;
var W=11; // layers+1
var C=48; // radials
var Count=480;
var pts=[]
var tiles=[];
var colorSet=[];
var colorSet2=[];
var transition={"shape":false,"h":0,"count":false,"type":""};

var setShape=()=>{
  let change=false;
  let newShape=(Math.random()<0.4)?["S1","S2","H1","H2","B1","B2","C1","C2"][getRandomInt(0,8)]:shape;
  if (newShape!=shape) {
    if (!shape.startsWith("H") && newShape.startsWith("H")) {
      transition.h=1;
    } else if (shape.startsWith("H") && !newShape.startsWith("H")) {
      transition.h=2;
    } else {
      transition.h=0;
    }
    shape=newShape;
    change=true;
    transition.shape=true;
  } else {
    transition.h=0;
    transition.shape=true;
  }
  return change;
}

var setTilesAndColors=()=>{
  tiles=[];
//  let count=C*(W-1);
  let count=480;
  for (let i=0; i<count; i++) tiles.push(new Tile());	// 480, C=16-80
  colorSet=[];
  colorSet2=[];
  //let cols=2*Count/16;  // 16 is max layer/radial ratio
  let cols=2*count/16;  // 16 is max layer/radial ratio
//if (HEART) cols=count/2;	// heart
  //let cols=48;  // 240
  //let cols=30;  // 120
  //let cols=12;  // 48
  for (let ts=0; ts<cols; ts++) colorSet.push(new Color());	// 480, C=16-80
  for (let ts=0; ts<cols; ts++) colorSet2.push(new Color());	// 480, C=16-80
  //for (let ts=0; ts<48; ts++) tileSets.push(new TileSet());	// 240, C=10-60
}
var csToggle=0;

var bCols={
  480:[24,30,20,32,16,40,48,60,80],
  450:[18,30,50],
  432:[24,36,18,48,54,72],
  400:[20,40,16,50,80],
  384:[24,32,48,64],
  360:[20,18,24,30,36,40,60,72],
  320:[20,16,32,40,64,80],
  300:[20,30,50,60],
  288:[18,16,24,32,36,48,72],
  270:[18,30,54],
  256:[16,32,64],
  240:[16,20,12,24,10,30,40,48,60,80],
  200:[20,40,50],
  192:[16,24,32,48,64],
  180:[18,20,12,30,36,60],
  160:[16,20,10,32,40],
  150:[10,30,50],
  144:[12,16,18,24,36,48,72],
  128:[16,32,64],
  120:[12,24,20,30,40,60],
  100:[10,20,50],
   96:[12,16,24,32,48],
   90:[10,18,30],
   80:[10,16,20,40,80]
}

var cCols={
  480:[60,48,80,40,32,30,24,20,16],  // 8 ratio
  450:[50,30,18],
  432:[54,48,72,36,24,18],
  400:[50,40,80,20,16],
  384:[48,32,64,24],
  360:[60,40,72,36,30,24,20,18],
  320:[40,32,64,20,80,16],
  300:[50,30,60,20],
  288:[48,36,72,32,24,18,16],
  270:[54,30,18],
  256:[64,32,16],
  240:[48,60,40,80,30,24,20,16,12,10], // 5 ratio
  200:[40,50,20],
  192:[48,32,64,24,16],
  180:[36,30,60,20,18,12],
  160:[40,32,20,16,10],  // 4 ratio
  150:[50,30,10],
  144:[36,24,48,18,72,16,12],
  128:[32,16,64],
  120:[30,24,40,20,60,12],
  100:[20,50,10],
   96:[32,24,48,16,12],
   90:[30,18,10],
   80:[40,20,80,16,10]
}

var randomizeFactors=()=>{
//test();
  transition.factors=false;
  if (!transition.count && !transition.shape && Math.random()<0.3) return false;  // shape exclusion esthetic
  let oldC=C;
  if (transition.count && transition.type[0]=="m") {
    let pCount=Count/transition.type[1];
    let cols=(shape.startsWith("B"))?bCols:cCols;
    C=cols[pCount][getRandomInt(0,cols[pCount].length,true)]; // radials
    W=pCount/C+1;
  } else {
    let cols=(shape.startsWith("B"))?bCols:cCols;
    C=cols[Count][getRandomInt(0,cols[Count].length,true)]; // radials
    W=Count/C+1;
  }
  transition.factors=(C!=oldC);
}

var setStarPoints=()=>{
  pts=[];
  let exp=[3,5,1][getRandomInt(0,3,true)];
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    for (let r=0; r<W; r++) {
      let r2=r*P/W;
      let x=r2*Math.pow(Math.sin(o),exp);
      let y=r2*Math.pow(Math.cos(o),exp);
      pts.push({"x":x,"y":y});
    }
  }
}

var setHeartPoints=()=>{
  pts=[];
  let os=Math.random()<0.5;
  let a=P/10;
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
if (os && c%2==0) o+=0.03;
    for (let r=0; r<W; r++) {
      let r2=r*P/W;
      let x=r2*Math.pow(Math.sin(o),3);
      let y=r2*(-0.8125*Math.cos(o)+0.3125*Math.cos(2*o)+0.125*Math.cos(3*o)+0.0625*Math.cos(4*o));
      //let y=r2*(-0.8125*Math.cos(o)+0.3125*Math.cos(4*o)+0.125*Math.cos(7*o)+0.0625*Math.cos(10*o));
      pts.push({"x":x,"y":y});
    }
  }
}

var setCyclePoints=()=>{
  pts=[];
  let os=Math.random()<0.5;
  let q=1/(2*C);
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    for (let r=-W; r<W; r++) {
      let Z=TP*q*Math.sin(r*TP/4)+o;
      let r2=Math.cos(r*TP/(4*W));
//if (r%2==0) r2-=W/500;
//if (xr && r%2==0) r2-=r2/20;
if (os && (W-1)%2==0) {
  if (r%2==0) r2-=W/500;
}
//if (xr && r%2==0) r2/=1.03;
      let x=r2*P*Math.cos(Z);
      let y=r2*P*Math.sin(Z);
      //pts.push({"x":x,"y":y,"z":Z});
      pts.push({"x":x,"y":y});
    }
  }
  return os;
}

var setPoints=()=>{
  if (shape=="B1") {
    randomizeOffsets();
    setBlockPoints();
  } else if (shape=="B2") {
    randomizeOffsets();
    setBlockPoints2();
  } else if (shape.startsWith("H")) {
    setHeartPoints();
  } else if (shape.startsWith("S")) {
    setStarPoints();
  } else {
    setCyclePoints();
  }
}

var randomizeOffsets=()=>{
  xr=Math.random()<0.3;
  xc=Math.random()<0.3;
  yr=Math.random()<0.3;
  yc=Math.random()<0.3;
}

var setBlockPoints=()=>{
  let cos=P/(C+3);
  let wos=P/(W+3);
  let h=[3,4][getRandomInt(0,2)];
  pts=[];
  for (let c=-C; c<=C; c+=2) {
    for (let r=-(W-1); r<=W-1; r+=2) {
      let x=c*cos;
      if (xr && r%h==0) x+=wos;
      if (xc && c%h==0) x+=cos;
      let y=r*wos;
      if (yr && r%h==0) y+=wos;
      if (yc && c%h==0) y+=cos;
      pts.push({"x":x,"y":y});
    }
  }
}

var setBlockPoints2=()=>{
  let cos=P/(C+3);
  let wos=P/(W+3);
  let h=[3,4][getRandomInt(0,2)];
  pts=[];
  for (let c=-C; c<=C; c+=2) {
    for (let r=-(W-1); r<=W-1; r+=2) {
      let y=c*cos;
      if (yr && r%h==0) y+=wos;
      if (yc && c%h==0) y+=cos;
      let x=r*wos;
      if (xr && r%h==0) x+=wos;
      if (xc && c%h==0) x+=cos;
      pts.push({"x":x,"y":y});
    }
  }
}

var generateSlots=(te)=>{
  let a=[], w=[];
  for (let i=0; i<30; i++) { w.unshift(te[i%4]); a.push(w.slice()); }
  return a;
}
var pr=generateSlots([0,0,1,1]);
var di=generateSlots([0,1,1,0]);

var trLists={
  480:[["m",2],["m",3],["m",4],["m",5]],
  450:[["m",5],["m",3]],
  432:[["m",3]],
  400:[["m",5],["m",2],["m",4]],
  384:[["m",2],["m",3]],
  360:[["m",3],["m",2],["m",4]],
  320:[["m",2],["m",4]],
  300:[["m",2],["m",3]],
  288:[["m",3],["m",2]],
  270:[["m",3]],
  256:[["m",2]],
  240:[["s",2],["m",2],["m",3]],
  200:[["s",2]],
  192:[["m",2],["s",2]],
  180:[["s",2]],
  160:[["s",3],["s",2],["m",2]],
  150:[["s",3],["s",2]],
  144:[["s",2],["s",3]],
  128:[["s",3]],
  120:[["s",2],["s",3],["s",4]],
  100:[["s",2],["s",4],["s",3]],
   96:[["s",5],["s",3],["s",2]],
   90:[["s",2],["s",4],["s",5]],
   80:[["s",2],["s",3],["s",4],["s",5]],
};

/*
var trLists={
  480:[["m",3]],
  160:[["s",3]]
};
*/

var setMergeSplit=()=>{
  if (!transition.count) {
    if (Math.random()<0.5) {
      let tc=trLists[Count];
      transition.type=tc[getRandomInt(0,tc.length)];
      if (transition.type[0]=="s") {
        Count=Count*transition.type[1];
      }
      transition.count=true;
    }
  } else {
    if (transition.type[0]=="m") {
      Count=Count/transition.type[1];
    }
    transition.count=false;
  }
//if (Count==128) debugger;
}

var transitTiles=()=>{
  if (transition.count && transition.type[0]=="s") {
    let m=Count/transition.type[1];
    let e=Count-m;
    for (let i=0; i<e; i++) {
      tiles[i+m].v2=tiles[i].v2;
      tiles[i+m].colorSet2=tiles[i].colorSet2;
    }
  }
  if (shape=="C1") {
    transitTilesL();
  } else if (shape.startsWith("B")) {
    transitTilesB();
  } else if (shape=="H1" || shape=="S1") {
    transitTilesH1();
  } else if (shape=="H2" || shape=="S2") {
    transitTilesH2();
  } else {
    transitTilesC();
  }
  if (transition.count && transition.type[0]=="m") {
    let m=Count/transition.type[1];
    let e=Count-m;
    for (let i=0; i<e; i++) {
      tiles[i+m].v=tiles[i+m].v2;
      tiles[i+m].v2=tiles[i].v2;
      tiles[i+m].colorSet=tiles[i+m].colorSet2;
      tiles[i+m].colorSet2=tiles[i].colorSet2;
    }
  }
}

var transitTilesH1=()=>{
  let pointCount=C*W;
  let cSet=csToggle%2;
  for (let c=0, i=0; c<C; c++) {
    for (let l=0; l<W-1; l++,i++) {
      let prox=c*W+l;
      let s2=c*W+l+W;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=c*W+l+W+1;
      if (dist>=pointCount) dist=dist-pointCount;
      tiles[i].v=tiles[i].v2;
      tiles[i].v2=[pts[prox],pts[c*W+l+1],pts[dist],pts[s2]];
      tiles[i].colorSet=tiles[i].colorSet2;
      tiles[i].colorSet2=[colorSet,colorSet2][cSet][2*l+c%2];
    }
  }
}

var transitTilesH2=()=>{
  let pointCount=C*W;
  let cSet=csToggle%2;
  for (let l=0, i=0; l<W-1; l++) {
    for (let c=0; c<C; c++,i++) {
      let s2=c*W+l+W;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=c*W+l+W+1;
      if (dist>=pointCount) dist=dist-pointCount;
      tiles[i].v=tiles[i].v2;
      tiles[i].v2=[pts[c*W+l],pts[c*W+l+1],pts[dist],pts[s2]];
      tiles[i].colorSet=tiles[i].colorSet2;
      tiles[i].colorSet2=[colorSet,colorSet2][cSet][2*l+c%2];
    }
  }
}

var transitTilesC=()=>{
  let pointCount=2*C*W;
  let cSet=csToggle%2;
  for (let l=0, i=0; l<W-1; l++) {
    for (let c=0; c<C; c++,i++) {
      let prox=(c+pr[W-2][l])*2*W+l;
      if (prox>=pointCount) prox=prox-pointCount;
      let s2=(c+1)*2*W+l+1;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=(c+di[W-2][l])*2*W+l+2;
      if (dist>=pointCount) dist=dist-pointCount;
      tiles[i].v=tiles[i].v2;
      tiles[i].v2=[pts[prox],pts[1+c*2*W+l],pts[dist],pts[s2]];
      tiles[i].colorSet=tiles[i].colorSet2;
      tiles[i].colorSet2=[colorSet,colorSet2][cSet][2*l+c%2];
    }
  }
}

var transitTilesL=()=>{
  let pointCount=2*C*W;
  let cSet=csToggle%2;
  for (let c=0, i=0; c<C; c++) {
    for (let l=0; l<W-1; l++,i++) {
      let prox=(c+pr[W-2][l])*2*W+l;
      if (prox>=pointCount) prox=prox-pointCount;
      let s2=(c+1)*2*W+l+1;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=(c+di[W-2][l])*2*W+l+2;
      if (dist>=pointCount) dist=dist-pointCount;
      tiles[i].v=tiles[i].v2;
      tiles[i].v2=[pts[prox],pts[1+c*2*W+l],pts[dist],pts[s2]];
      tiles[i].colorSet=tiles[i].colorSet2;
      tiles[i].colorSet2=[colorSet,colorSet2][cSet][2*l+c%2];
    }
  }
}

var transitTilesB=()=>{
  let cSet=csToggle%2;
  let tCount=(W-1)*C;
  for (let i=0, k=0; i<tCount; i++) {
    if (i%(W-1)==0) k++;
    let j=k-1;
    tiles[i].v=tiles[i].v2;
    tiles[i].v2=[pts[i+j],pts[i+W+j],pts[i+W+j+1],pts[i+j+1]];
    tiles[i].colorSet=tiles[i].colorSet2;
    tiles[i].colorSet2=[colorSet,colorSet2][cSet][i%W];
  }
}

var shiftTiles=()=>{
  let dst=1;
  if (shape.startsWith("B")) {
    if (Math.random()<0.5) {
      dst=0; // or start 0
    }
  } else {
    if (Math.random()<0.5) {
      dst=0;
    } else if (Math.random()<0.7) {
      dst=2;
    }
  }
  if (dst) {
    let st=[];
    let h=C*(W-1)/2;
    if (dst==2) {
       h=C*getRandomInt(1,6);;
    }
    for (let i=0; i<Count; i++) {
      st.push(tiles[(i+h)%Count]);
    }
    for (let i=0; i<Count; i++) { tiles[i]=st[i]; }
  }
  LOG.set({"s":dst});
  return dst;
}

/*
var shiftTiles2=()=>{
  tiles.sort((a,b)=>{ return (a.y-b.y); });
}
*/

var shiftVertices=()=>{
  let nv=0;
  if (shape.startsWith("B")) {
    nv=getRandomInt(0,2);
    if (nv>0) {
      tiles.forEach((ti)=>{ ti.shift(); });
    } 
  } else {
    if (transition.factors) {
      nv=getRandomInt(0,3);
    } else {
      nv=getRandomInt(0,2);
    }
    if (nv>0) {
      tiles.forEach((ti)=>{ ti.shift(); if (nv==2) ti.shift(); });
    }
  }
  LOG.set({"v":nv});
  return nv;
}

var reverseTiles=()=>{
  let rvs=false;
  if (shape=="C2") {
    rvs=Math.random()<0.7;
  } else if (shape=="C1") {
    rvs=Math.random()<0.2;
  } else {
    rvs=Math.random()<0.3;
  }
  if (rvs) {
    if (Count==tiles.length) {
      tiles.reverse();
    } else {
      let rt=tiles.slice(0,Count);
      rt.reverse();
      for (let i=0; i<Count; i++) {
	tiles[i]=rt[i];
      }
    }
  }
  LOG.set({"reverse":rvs?"T":"F"});
return rvs;
}

var shuffle=()=>{
  let no=[];
  do {
    no.push(tiles.splice(getRandomInt(0,tiles.length),1)[0]);
  } while (tiles.length>0);
  tiles=no;
}

var randomizeTransition=()=>{
  let dt=getRandomInt(0,3,true);
  for (let t of tiles) { t.setDraw(dt); }
  LOG.set({"dt":dt});
  return dt;
}

var drawO=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  ctx.font="18px serif";
  ctx.beginPath();
  for (let i in pts) {
    ctx.lineTo(pts[i].x,pts[i].y);
    ctx.fillText(i,pts[i].x+20-40*Math.random(),pts[i].y+10-20*Math.random());
  }
  ctx.closePath();
  ctx.stroke();
}

var draw=()=>{
  let ss=30;
  if (transition.h==1) {
    ss=frac*50+25;
    ctx.strokeStyle="hsl(0,0%,"+ss+"%)";
  } else if (transition.h==2) {
    ss=(1-frac)*50+25;
    ctx.strokeStyle="hsl(0,0%,"+ss+"%)";
  } else if (shape.startsWith("H")) {
    ctx.strokeStyle="hsl(0,0%,75%)";
  } else {
    ctx.strokeStyle="hsl(0,0%,25%)";
  }
  ctx.clearRect(-D/2,-D/2,D,D);
  for (let i=0; i<Count; i++) {
    tiles[i].draw(frac);
  }
}

var transitColors=()=>{
  csToggle++;
  let cs=[colorSet,colorSet2][csToggle%2];
  let cf=(shape.startsWith("H"))?0.7:0.3;
  if (Math.random()<cf) {
    cs.sort((a,b)=>{ return a.hue-b.hue; });
    let ca=[];
    let h=getRandomInt(1,59);
    for (let i=0; i<cs.length; i++) { ca.push(cs[(i+h)%cs.length]); }
    for (let i in cs) { cs[i]=ca[i]; }
  } else {
    cs.forEach((ts)=>{ ts.randomize(); });
  }
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

var time=0;
var stopped=true;
var frac=0;
var duration=6000;
var logSet1={"v":0,"s":0,"dt":0},logSet2={"v":0,"s":0,"dt":0};
var xc=false, yc=false;
var xr=false, yr=false;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  let af=animate;
  if (progress<duration) {
    frac=progress/duration;
    draw();
  } else {
    setMergeSplit();
    setShape();
    randomizeFactors();
    setPoints();
    transitColors();
    shiftVertices();
    if (!transition.count) {
	reverseTiles();
	shiftTiles();
    //shuffle();
    }
    transitTiles();
    let D=randomizeTransition();
LOG.log(false,"");

//console.log(xr+" "+xc+" "+yr+" "+yc);
    pauseTS=performance.now()+1400;
    time=0;
    frac=0;
    af=pause;
    draw();
  }
  requestAnimationFrame(af);
}

var LOG={
  ls1:logSet1,
  set:(lo)=>{
    let ks=Object.keys(lo);
    let ls=[logSet1,logSet2][csToggle%2];
    for (let k of ks) {
      ls[k]=lo[k];
    }
    // lsx[key]=val;
    // lsx.key=val;
  },
  log:(h,a)=>{
    if (h || csToggle%8==0) console.log("sh  C W-1 V R S D");
    //console.log(`${C}  ${(W-1).toString().padStart(2)}`+a);
    let ls=[logSet1,logSet2][csToggle%2];
    console.log(
      shape
      +C.toString().padStart(3)
      +(W-1).toString().padStart(4)
      //+` ${[logSet1,logSet2][csToggle%2].v} `
      +` ${ls.v}`
      +` ${ls.reverse}`
      +` ${ls.s}`
      +` ${ls.dt}`
//      +a
    );
  }
}

var start=()=>{
  if (stopped) {
    if (frac>0) {
      time=performance.now()-frac*duration;
    } else {
      time=0;
    }
    requestAnimationFrame(pause);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
randomizeFactors();

reverseTiles();

setTilesAndColors();
setPoints();
transitColors();
transitTiles();
randomizeFactors();
reverseTiles();
randomizeOffsets();
shiftVertices(1);
setPoints();
transitColors();
transitTiles();
draw();
LOG.log(true,"");
start();
