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
  ctx.lineWidth=0.8;
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
  this.transit=(p1,p2,p3,p4)=>{
    this.v=this.v2;
    this.v2=[p1,p2,p3,p4];
  }
}

var Color=function() {
  this.hue=getRandomInt(0,360);
  this.sat=70+20*Math.random();
  this.lum=70+20*Math.random();
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    this.sat=70+20*Math.random();
    this.lum=70+20*Math.random();
  }
}

var P=D;
var W=2; // layers+1
var C=4; // radials
var pts=[]
var tiles=[];
//var tileSets=[];
var colorSet=[];
var tileSets2=[];
var setTilesAndColors=()=>{
  tiles=[];
  let count=C*(W-1);
  for (let i=0; i<count; i++) tiles.push(new Tile());	// 480, C=16-80
  colorSet=[];
  tileSets2=[];
  let cols=60;  // 480
  //let cols=48;  // 240
  //let cols=30;  // 120
  //let cols=12;  // 48
  //let cols=2;  // 4 
  //let cols=4;
  //for (let ts=0; ts<2*(W-1); ts++) tileSets.push(new TileSet());
  for (let ts=0; ts<cols; ts++) colorSet.push(new Color());	// 480, C=16-80
  for (let ts=0; ts<cols; ts++) tileSets2.push(new Color());	// 480, C=16-80
  //for (let ts=0; ts<48; ts++) tileSets.push(new TileSet());	// 240, C=10-60
}
var csToggle=0;

var randomizeF=()=>{
  let oldC=C;
  C=[16,20,24,30,32,40,48,60,80][getRandomInt(0,9)]; // radials
  W=480/C+1;
/*
  C=[10,12,16,20,24,30,40,48,60,80][getRandomInt(0,9)]; // radials
  W=240/C+1;
  C=[8,10,12,20,24,30,40,60][getRandomInt(0,8)]; // radials
  W=120/C+1;
  C=[8,12,16,24,48][getRandomInt(0,5)]; // radials
  W=48/C+1;
C=6;W=3;
*/
//C=4;W=[2,3][getRandomInt(0,2)];
//C=4;W=3;
  return C!=oldC;
}

var setCyclePoints=()=>{
  pts=[];
  let q=1/(2*C);
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    for (let r=-W; r<W; r++) {
      let Z=TP*q*Math.sin(r*TP/4)+o;
      let r2=Math.cos(r*TP/(4*W));
      let x=r2*P*Math.cos(Z);
      let y=r2*P*Math.sin(Z);
      //pts.push({"x":x,"y":y,"z":Z});
      pts.push({"x":x,"y":y});
    }
  }
}

var setPoints=()=>{
  if (state=="B") {
    setBlockPoints();
  } else if (state=="B2") {
    setBlockPoints2();
  } else {
    setCyclePoints();
  }
}

var setBlockPoints=()=>{
  pts=[];
  for (let c=-C; c<=C; c+=2) {
    for (let r=-(W-1); r<=W-1; r+=2) {
      let x=c*P/C;
      let y=r*P/W;
      pts.push({"x":x,"y":y});
    }
  }
}

var setBlockPoints2=()=>{
  pts=[];
  for (let c=-C; c<=C; c+=2) {
    for (let r=-(W-1); r<=W-1; r+=2) {
      let y=c*P/C;
      let x=r*P/W;
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

var transitTiles=()=>{
  if (state=="L") {
    transitTilesL();
  } else if (state=="B" || state=="B2") {
    transitTilesB();
  } else {
    transitTilesC();
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
      tiles[i].colorSet2=[colorSet,tileSets2][cSet][2*l+c%2];
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
      tiles[i].colorSet2=[colorSet,tileSets2][cSet][2*l+c%2];
    }
  }
}

var transitTilesB=()=>{
  for (let i=0, k=0; i<tiles.length; i++) {
    if (i%(W-1)==0) k++;
    let j=k-1;
//    if (i%(W-1)==1) j++;
    //if (i%W==1) j++;
//    let j=i%W;
    tiles[i].v=tiles[i].v2;
/*
//let p1=(i+i%(W-1))*C/2;
//let p1=i+j*W;
    let p1=i+j;
//console.log("i="+i+" j="+j);
//tiles[i].p1=p1;
if (pts[p1]==undefined) {
  debugger;
  p1=0;
}
//let p2=i*C/2+C/2+i*(W-1);
//let p2=i*C/2+C/2;
let p2=i+W+j;
//tiles[i].p2=p2;
if (pts[p2]==undefined) {
  debugger;
  p2=0;
}
//let p3=i*C/2+C/2+i*(W-1)+1;
//let p3=(i+i%(W-1))*C/2+C/2+1;
let p3=i+W+j+1;
//tiles[i].p3=p3;
if (pts[p3]==undefined) {
  debugger;
  p3=0;
}
//let p4=i*C/2+i*W+1;
//let p4=(i+i%(W-1))*C/2+1;
let p4=i+j+1;
//tiles[i].p4=p4;
if (pts[p4]==undefined) {
  debugger;
  p4=0;
}
*/
      tiles[i].v2=[pts[i+j],pts[i+W+j],pts[i+W+j+1],pts[i+j+1]];
      tiles[i].colorSet=tiles[i].colorSet2;
      tiles[i].colorSet2=[colorSet,tileSets2][csToggle%2][i%W];
  }
}

var shiftTiles=()=>{
  let st=[];
  let h=C*(W-1)/2;
  for (let i=0; i<tiles.length; i++) {
    st.push(tiles[(i+h)%tiles.length]);
  }
  tiles=st;
}

var shiftTiles2=()=>{
  tiles.sort((a,b)=>{ return (a.y-b.y); });
}

var shiftVertices=(n)=>{
  if (n==0) return;
  tiles.forEach((ti)=>{ ti.shift(); if (n==2) ti.shift(); });
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
  ctx.clearRect(-D/2,-D/2,D,D);
  for (let t of tiles) {
    t.draw(frac);
  }
}

var transitColors=()=>{
[colorSet,tileSets2][++csToggle%2].forEach((ts)=>{
  ts.randomize();
});
/*
  if (Math.random()<0.5) {
    let sHue=tileSets[tileSets.length-1].hue2;
    let sSat=tileSets[tileSets.length-1].sat2;
    let sLum=tileSets[tileSets.length-1].lum2;
    for (let i=tileSets.length-1; i>0; i--) {
      tileSets[i].hue=tileSets[i].hue2;
      tileSets[i].hue2=tileSets[i-1].hue2;
      tileSets[i].sat=tileSets[i].sat2;
      tileSets[i].sat2=tileSets[i-1].sat2;
      tileSets[i].lum=tileSets[i].lum2;
      tileSets[i].lum2=tileSets[i-1].lum2;
    }
    tileSets[0].hue=tileSets[0].hue2;
    tileSets[0].hue2=sHue;
    tileSets[0].sat=tileSets[0].sat2;
    tileSets[0].sat2=sSat;
    tileSets[0].lum=tileSets[0].lum2;
    tileSets[0].lum2=sLum;
  } else {
    for (let tset of tileSets) {
      tset.hue=tset.hue2;
      tset.hue2=(tset.hue+getRandomInt(0,180))%360;
      tset.sat=tset.sat2;
      tset.sat2=70+20*Math.random();
      tset.lum=tset.lum2;
      tset.lum2=70+20*Math.random();
    }
  }
*/
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
var duration=7000;
var state="B2";
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  let af=animate;
  if (progress<duration) {
    frac=progress/duration;
    draw();
  } else {
    let rearrange=randomizeF();
    let nState=(Math.random()<0.4)?["B2","B","L","C"][getRandomInt(0,4)]:state;
    //let nState=(Math.random()<0.4)?["L","C"][getRandomInt(0,2)]:state;
    if (nState!=state) {
//      shuffle();
      state=nState;
    }
//state="B";
    setPoints();
    transitColors();
let R=false;
let S=false;
let sf=-1;
    if (state=="L") {
sf=getRandomInt(0,3);
shiftVertices([0,1,2][sf]);
      //shiftVertices([0,1,2][getRandomInt(0,3)]);
      if (Math.random()<0.5) shiftTiles();
    } else if (state=="B" || state=="B2") {
sf=getRandomInt(0,2);
shiftVertices([0,1][sf]);
      //shiftVertices([0,1,2][getRandomInt(0,3)]);
//      if (Math.random()<0.7) {
        if (Math.random()<0.3) {
          tiles.reverse();
R=true;
        }
        if (Math.random()<0.3) {
          shiftTiles();
S=true;
        }
//      }
    } else {
sf=getRandomInt(0,3);
shiftVertices([0,1,2][sf]);
//      shiftVertices([0,1,2][getRandomInt(0,3)]);
      if (Math.random()<0.7) {
        if (Math.random()<0.7) {
          tiles.reverse();
R=true;
        }
        if (Math.random()<0.3) {
          shiftTiles();
S=true;
        }
      }
    }
    transitTiles();
    let D=randomizeTransition();
console.log("F:"+rearrange+" V:"+sf+" R:"+R+" S:"+S+" D:"+D);
    pauseTS=performance.now()+1000;
    time=0;
    frac=0;
    af=pause;
    draw();
  }
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    if (frac>0) {
      time=performance.now()-frac*duration;
    } else {
      time=0;
    }
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
randomizeF();
setTilesAndColors();
setPoints();
transitColors();
transitTiles();
randomizeF();
tiles.reverse();
//shiftTiles();
shiftVertices(1);
setPoints();
transitColors();
transitTiles();
//draw();
start();
