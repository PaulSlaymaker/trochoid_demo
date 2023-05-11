"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/YzZddbR
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
body.style.display="grid";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=0.4;

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

/*
var test=()=>{
var ZZ=[0,0,0];
for (let i=0; i<100; i++) {
  ZZ[Math.floor(3*Math.random())]++;
}
console.log(ZZ);
}
*/

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var Tile=function(p1,p2,p3,p4,i) {
  this.v=[p1,p2,p3,p4];
  this.draw=(f)=>{
    ctx.beginPath();
    ctx.moveTo(this.v[0].x,this.v[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v[3].x,(1-f)*this.v[1].y+f*this.v[3].y);
    ctx.lineTo(this.v[2].x,this.v[2].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v[1].x,(1-f)*this.v[3].y+f*this.v[1].y);
    ctx.closePath();
//    ctx.stroke();
  }
}

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  let n=getRandomInt(3,33);
  for (let i=0; i<n; i++) {
    let sat=80+20*Math.random();
    //let lum=60+20*Math.random();
    let lum=50+30*Math.random();
    colors.push("hsl("+((hue+i*hd)%360)+","+sat+"%,"+lum+"%)");
  }
  (()=>{
    let no=[];
    do {
      no.push(colors.splice(getRandomInt(0,colors.length),1)[0]);
    } while (colors.length>0);
    colors=no;
  })();
}

var TileSet=function(idx) {
  this.tiles=[];
  this.sat=80+20*Math.random();
  this.lum=60+20*Math.random();
  this.idx=idx;
  //this.color="hsl("+getRandomInt(0,360)+","+(80+20*Math.random())+"%,"+this.lum+"%)";
  this.color=colors[idx%colors.length];
//  this.os=-20*Math.floor(idx/2);
  //this.rate=[200,400][getRandomInt(0,2)];
  //this.rate=[200,300,400,500][getRandomInt(0,4)];  // 6000
  //this.rate=[200,250,400,500,800][getRandomInt(0,5)]; // 4000
  //this.rate=[210,252,315,420,630][getRandomInt(0,5)]; // 1260
//this.rate=400;
  if (sync) {
      this.os=syncM*Math.floor(idx/2);
      this.rate=400;
    } else {
      this.os=0;
      this.rate=200+400*Math.random();
  }
  this.drawTiles=()=>{
    //ctx.fillStyle="hsl("+this.hue+","+this.sat+"%,"+this.lum+"%)";
    ctx.fillStyle=this.color;
    for (let tile of this.tiles) {
      let f=(1+Math.sin(this.os+TP*t/this.rate))/2;
      tile.draw(f);
      ctx.fill();
    }
  }
}

var W=2; // layers+1
var C=4; // radials
var pts=[]
var tileSets=[];
var setTileSets=()=>{
  tileSets=[];
  for (let ts=0; ts<2*(W-1); ts++) tileSets.push(new TileSet(ts));
}

var randomizeF=()=>{
  let S=[-1,1][getRandomInt(0,2)];
  //C=2*(16+S*getRandomInt(0,15,true)); // radials
  C=2*(16+S*getRandomInt(0,10,true)); // radials
//C=2*(8+S*getRandomInt(0,7,true)); // radials
//C=2*(12+S*getRandomInt(0,11,true)); // radials
  let b=Math.floor(C/3);
  S=[-1,1][getRandomInt(0,2)];
  if (b<3) {
    W==2;
  } else {
    W=b+S*getRandomInt(0,b-2,true);
  }
  W=Math.min(27,W);
}

var setPoints=()=>{
  pts=[];
  let q=1/(2*C);
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    for (let r=-W; r<W; r++) {
      let Z=TP*q*Math.sin(r*TP/4)+o;
      let r2=Math.cos(r*TP/(4*W));
      let x=r2*CSIZE*Math.cos(Z);
      let y=r2*CSIZE*Math.sin(Z);
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

var setTiles=(v)=>{
  setPoints();
  setColors();
  setTileSets();
  let pointCount=2*C*W;
  for (let l=0, i=0; l<W-1; l++) {
    for (let c=0; c<C; c++,i++) {
      let prox=(c+pr[W-2][l])*2*W+l;
      if (prox>=pointCount) prox=prox-pointCount;
      let s1=c*2*W+l+1;
      let s2=(c+1)*2*W+l+1;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=(c+di[W-2][l])*2*W+l+2;
      if (dist>=pointCount) dist=dist-pointCount;
      tileSets[2*l+c%2].tiles.push(new Tile(
        pts[prox],
        pts[1+c*2*W+l],
        pts[dist],
        pts[s2],
        i
      ));
    }
  }
}

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let ts of tileSets) ts.drawTiles();
  ctx.fillStyle="hsla(0,0%,0%,"+O+")";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
}

var sync=true;
var syncM=-10*getRandomInt(1,10);
var transit=()=>{
  randomizeF();
  sync=Math.random()<0.5
  syncM=10*getRandomInt(1,10);
  //setPoints();
  setTiles();
}

var pauseTS=0;
var pauseDuration=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (pauseTS==0) pauseTS=performance.now()+1000
  if (ts<pauseTS) {
    ctx.fillStyle="hsla(0,0%,0%,0.05)";
    ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    requestAnimationFrame(pause);
  } else {
    pauseTS=0;
    requestAnimationFrame(animate);
  }
}

var O=0.05;
var t=0;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  draw();
  if (t<100) {
    O=Math.max(0.05,O-=0.01);
  } else if (t>700) {
    if (EM && t==701) stopped=true;
    O=Math.min(1,O+=0.01);
    if (t==800) {
      transit();
      t=0;
    }
  }
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

onresize();
transit();
if (EM) {
  sync=true;
  setTiles();
  draw();
}
else start();
