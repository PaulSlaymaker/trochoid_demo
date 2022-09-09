"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/ZExpZYg
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function cFrac(frac) {
  var e2=3*frac*Math.pow(1-frac,2)*0.2;
  var e3=3*(1-frac)*Math.pow(frac,2)*0.8;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=3;
  //let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(-10,10);
  let hue=getRandomInt(0,200);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-10,10))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}

var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,80%)";
  colors[1]="hsl("+hues[1]+",100%,80%)";
  colors[2]="hsl("+hues[2]+",100%,80%)";
}

var Axis=function(idx) {
  this.pts=new Array(PC);
  this.pts2=new Array(PC);
  this.dof=TP*Math.random();
  this.dof2=TP*Math.random();
  this.setPoints=()=>{
    for (let i=0; i<PC; i++) {
      let r=CSIZE*i/(PC-1);
      let ri=Math.trunc(idx*axFactors[i].length/lineCount);
      let xf=axFactors[i][ri].x;
      let yf=axFactors[i][ri].y;
      this.pts[i]={"x":xf*r,"y":yf*r,"c1x":xf*(r-CD),"c1y":yf*(r-CD),"c2x":xf*(r+CD),"c2y":yf*(r+CD)};
      let xf2=axFactors2[i][ri].x;
      let yf2=axFactors2[i][ri].y;
      this.pts2[i]={"x":xf2*r,"y":yf2*r,"c1x":xf2*(r-CD),"c1y":yf2*(r-CD),"c2x":xf2*(r+CD),"c2y":yf2*(r+CD)};
    }
  }
  this.setPoints();

  this.getPath=()=>{
    let p=new Path2D();
    p.moveTo(this.pts[0].x,this.pts[0].y);
    for (let i=0; i<this.pts.length-1; i++) {
        let x2=(1-frac)*this.pts[i+1].x+frac*this.pts2[i+1].x;
        let y2=(1-frac)*this.pts[i+1].y+frac*this.pts2[i+1].y;
        let c1x=(1-frac)*this.pts[i].c2x+frac*this.pts2[i].c2x;
        let c1y=(1-frac)*this.pts[i].c2y+frac*this.pts2[i].c2y;
        let c2x=(1-frac)*this.pts[i+1].c1x+frac*this.pts2[i+1].c1x;
        let c2y=(1-frac)*this.pts[i+1].c1y+frac*this.pts2[i+1].c1y;
/*
	p.bezierCurveTo(
	  this.pts[i].c2x,this.pts[i].c2y,this.pts[i+1].c1x,this.pts[i+1].c1y,
	  this.pts[i+1].x,this.pts[i+1].y
	);
*/
	p.bezierCurveTo(c1x,c1y,c2x,c2y,x2,y2);
    }
    return p;
  }
}

function start() {
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var dt=0;
var frac=0;
var dur=300;
function animate(ts) {
  if (stopped) return;
  t++;
  dt++;
  if (t==dur) {
    axFactors=getRandomAxialFactors();
    for (let i=0; i<lineCount; i++) aa[i].setPoints();
    frac=1;
if (EM) stopped=true;
  } else if (t==2*dur) {
    axFactors2=getRandomAxialFactors();
    for (let i=0; i<lineCount; i++) aa[i].setPoints();
    t=0;
    frac=0;
  } else if (t<dur) {
    //frac=t/dur;
    frac=cFrac(t/dur);
  } else {
    //frac=(2*dur-t)/dur;
    frac=cFrac((2*dur-t)/dur);
  }
  if (dt%2==0) {
    hues[0]=++hues[0]%360;
    hues[1]=++hues[1]%360;
    hues[2]=++hues[2]%360;
    setColors();
  }
  draw();
  requestAnimationFrame(animate);
}

/*
var drawPoint=(x,y,col)=>{
  ctx.beginPath();
  ctx.moveTo(x+6,y);
  ctx.arc(x,y,6,0,TP);
  if (col==undefined) ctx.fillStyle="red";
  else ctx.fillStyle=col;
  ctx.fill();
}
*/

const PC=5;	// number of points/radii on each axis
//const CD=CSIZE/2/PC;
const CD=CSIZE/1.5/PC;

var lineCount=8;

var getAxialFactorArray=(n,rad)=>{
  let fa=new Array(n);
  for (let i=0; i<n-1; i++) {
    //let z=TP/4/n*i;
    //let z=TP/4*Math.random();
//let rf=0.95;
let rf=0.30;
if (rad==PC-1) rf=0;
let z=Math.random()<rf?TP/4/n*i:TP/4*Math.random();
    fa[i]={"x":Math.cos(z),"y":Math.sin(z),"z":z};
  }
  fa[n-1]={"x":Math.cos(TP/4),"y":Math.sin(TP/4),"z":TP/4};
  fa.sort((a,b)=>{ return a.z-b.z; });
  return fa;
}

var getRandomAxialFactors=()=>{
  let af=new Array(PC);
  for (let i=0; i<PC; i++) {
    let fc=Math.max(2,Math.round(2*i*lineCount/(PC)));
    af[i]=getAxialFactorArray(fc,i);
  }
  return af;
}
var axFactors=getRandomAxialFactors();
var axFactors2=getRandomAxialFactors();

var aa=new Array(lineCount);	// axis array
for (let i=0; i<lineCount; i++) {
  aa[i]=new Axis(i);
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);

ctx.globalAlpha=0.4;
  const dm1=new DOMMatrix([1,0,0,-1,0,0]);
  const dm2=new DOMMatrix([-1,0,0,1,0,0]);
  let opath=new Path2D();
  let spath=new Array(lineCount);
  for (let i=0; i<lineCount; i++) {
    let pth=aa[i].getPath();
    pth.addPath(pth,dm1);
    pth.addPath(pth,dm2);
    spath[i]=pth;
    opath.addPath(pth);
  }

  ctx.lineDashOffset=0;
  ctx.lineWidth=34;
  for (let i=0; i<lineCount; i++) {
    let ldo=320+60*Math.sin(dt/40+aa[i].dof);
    if (i==lineCount-1) ldo=240+100*Math.sin(dt/80+aa[i].dof);
    ctx.setLineDash([ldo,100000]);
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(spath[i]);
  }

  ctx.lineWidth=10;
  for (let i=0; i<lineCount; i++) {
    let ldo=440+80*Math.sin(dt/40+aa[i].dof2);
    if (i==lineCount-1) ldo=240+100*Math.sin(dt/80+aa[i].dof2);
    ctx.setLineDash([ldo,100000]);
    ctx.strokeStyle="white";
    ctx.stroke(spath[i]);
  }

  ctx.setLineDash([2,7]);
  ctx.lineWidth=4;
  ctx.strokeStyle="#2A2A2A";
  ctx.lineDashOffset=-t/3;
  ctx.globalAlpha=0.8;
  ctx.stroke(opath);

}

onresize();

hues=getHues();
setColors();

start();
