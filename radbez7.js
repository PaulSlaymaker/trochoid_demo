"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/abVxmjo
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
c.style.outline="0.2px dotted gray";
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
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const getRandomSum=(c,s)=>{
  let ra=new Array(c);
  let sum=0;
  for (let i=0; i<c; i++) {
    ra[i]=Math.random();
    sum+=ra[i];
  }
  let ra2=ra.map((rp)=>{ return Math.round(s/sum*rp); });
  let rr=ra2.reduce((p,n)=>{ return p+n; });
  ra2[0]+=s-rr;
  return ra2;
}

var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,4,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  ctx.lineDashOffset=5*t;
  if (t%8==0) {
    for (let i=0; i<hues.length; i++) hues[i]=(++hues[i])%360;
    setColors();
  }
  setDashes(Math.pow(Math.sin(t/50),2));
  draw();
  requestAnimationFrame(animate);
}

const C=4;
//var F=(TP+10*Math.random())/12;
const F=1.1;
//R=600;
const R=800;

var Line=function(idx) {
  this.a=idx*TP/C+(C/4-1)*TP/C/2;
  this.dp1=new DOMPoint();
  this.dp2=new DOMPoint();
  this.rotate=(z)=>{
    //let dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
    //let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]);
    let dm2=new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),this.mx,this.my]);
    let dm3=dm2.multiply(this.dm1);
    this.dp1=this.dp1.matrixTransform(dm3);
    this.dp2=this.dp2.matrixTransform(dm3);
  }
  this.setLine=()=>{
    let f=F;
    let r=R;
    this.dp1.x=r*Math.cos(this.a-f);
    this.dp1.y=r*Math.sin(this.a-f);
    this.dp2.x=r*Math.cos(this.a+f);
    this.dp2.y=r*Math.sin(this.a+f);
    this.mx=(this.dp1.x+this.dp2.x)/2;
    this.my=(this.dp1.y+this.dp2.y)/2;
    this.dm1=new DOMMatrix([1,0,0,1,-this.mx,-this.my]);
  }
}

// lines.length (always 32) vs C
var lines=new Array(4);
for (let i=0; i<4; i++) lines[i]=new Line(i);

//var skipLevel=2*getRandomInt(0,C/4)+1;
const skipLevel=3;

/*
var clips=new Array(8)
for (let i=0; i<8; i++) {
  clips[i]=new Path2D();
  clips[i].moveTo(0,0);
  let z1=i*TP/8+TP/16;
  let z2=(i+1)*TP/8+TP/16;
  let r=400;
  clips[i].lineTo(r*Math.cos(z1),r*Math.sin(z1));
  clips[i].lineTo(r*Math.cos(z2),r*Math.sin(z2));
  clips[i].lineTo(0,0);
}
*/

var clips2=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
for (let i=0; i<8; i++) {
  let p=new Path2D();
  p.moveTo(0,0);
  let z1=i*TP/8+TP/16;
  let z2=(i+1)*TP/8+TP/16;
  let r=500;
  p.lineTo(r*Math.cos(z1),r*Math.sin(z1));
  p.lineTo(r*Math.cos(z2),r*Math.sin(z2));
  p.lineTo(0,0);
  if (i==0 || i==3) clips2[0].addPath(p);
  if (i==6 || i==1) clips2[1].addPath(p);
  if (i==4 || i==7) clips2[2].addPath(p);
  if (i==2 || i==5) clips2[3].addPath(p);
}

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(-30,30);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
//  for (let i=0; i<h.length; i++) colors[i]="hsl("+h[i]+",100%,50%)";
  return h;
}
hues=getHues();

var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,36%)";
  colors[1]="hsl("+hues[1]+",90%,60%)";
  colors[2]="hsl("+hues[2]+",100%,36%)";
  colors[3]="hsl("+hues[3]+",90%,60%)";
}
setColors();

var paths=[];
var path=new Path2D();

let setPaths=()=>{
  for (let i=0; i<skipLevel*C; i+=skipLevel) {
  let p=new Path2D();
    let i0=(i)%C;
    let i1=(i+skipLevel)%C;
    p.moveTo(lines[i0].mx,lines[i0].my);
    p.bezierCurveTo(lines[i0].dp2.x,lines[i0].dp2.y,lines[i1].dp1.x,lines[i1].dp1.y,lines[i1].mx,lines[i1].my);
//drawPoint2(lines[i0].mx,lines[i0].my,"white");
    path.addPath(p);
    paths.push(p);
  }
}

const qlen=667;
const space1=74;
//const dash=[539,667];
//const dash=[603,731];
const dash=[qlen-space1,qlen+space1];
//const dash=[633,64];	//697
//const dash=[635,699];	//697
//let k=603/13;
//var dash2=[k,k,k,k,k,k,k,k,k,k,k,k,k,731];	// 500
//var dash2=[43,50,43,50,43,50,43,50,43,50,43,50,43,731];	// 667
//var dash2=[1,50,28,50,38,50,69,50,97,50,36,50,34,731];
//const dash2=dash;

//var dashx=440.5;

var getRandomDash=(n,si)=>{
//let c=[5,7][getRandomInt(0,2)];
let c=n;
//let sp=4*28;  // (c-1)*lw/2
let sp=(c-1)*48;  // 48 arbitrary
let s=qlen-space1-sp;
let ra=getRandomSum(c,s);
if (si) ra.sort((a,b)=>{ return a-b; });
else ra.sort((a,b)=>{ return b-a; });
var dsh=[];
for (let i=0; i<c; i++) {
  dsh.push(ra[i]); 
  dsh.push(48); 
}
//console.log(dash2);
  dsh.splice(dsh.length-1,1,qlen+space1);
  return dsh;
}

const dash2c=getRandomDash(5,true);
const dash3c=getRandomDash(5);

var dash2=dash2c.slice();
var dash3=dash3c.slice();

var setDashes=(f)=>{
  for (let i=0; i<5; i++) {
    dash2[2*i]=(1-f)*dash2c[2*i]+f*dash3c[2*i];
    dash3[2*i]=(1-f)*dash3c[2*i]+f*dash2c[2*i];
  }
}
//setDashes(0);

var drawPath2=(p,width,col,dsh)=>{
  ctx.strokeStyle=col;
  ctx.lineWidth=width;
  ctx.setLineDash(dsh);
  ctx.stroke(p);
}

const W0=72;
const W1=26;

ctx.shadowColor="black";
ctx.shadowBlur=8;
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  drawPath2(path,W0,colors[0],dash);
  drawPath2(path,W1,colors[1],dash2);
  ctx.lineDashOffset-=qlen;
  drawPath2(path,W0,colors[2],dash);
  drawPath2(path,W1,colors[3],dash3);
  ctx.lineDashOffset+=qlen;

/*
ctx.globalCompositeOperation="lighter";
drawPath2(path,1,colors[1],dash2);
ctx.lineDashOffset-=qlen;
drawPath2(path,1,colors[3],dash2);
ctx.lineDashOffset+=qlen;
ctx.globalCompositeOperation="source-over";
*/

  for (let i=0; i<4; i++) {
    ctx.save();
    ctx.clip(clips2[i]);
    drawPath2(paths[i],W0,colors[0],dash);
    drawPath2(paths[i],W1,colors[1],dash2);
/*
    ctx.globalCompositeOperation="lighter";
    drawPath2(paths[i],1,colors[1],dash2);
    ctx.globalCompositeOperation="source-over";
*/
    ctx.restore();
  }

ctx.lineDashOffset-=qlen;
  for (let i=0; i<4; i++) {
    ctx.save();
    ctx.clip(clips2[i]);
    drawPath2(paths[i],W0,colors[2],dash);
    drawPath2(paths[i],W1,colors[3],dash3);
/*
    ctx.globalCompositeOperation="lighter";
    drawPath2(paths[i],1,colors[3],dash2);
    ctx.globalCompositeOperation="source-over";
*/
    ctx.restore();
  }
ctx.lineDashOffset+=qlen;

/*
  ctx.setLineDash([]);
  ctx.lineWidth=0.4;
  ctx.strokeStyle="white";
  ctx.stroke(clips[0]);
  ctx.stroke(clips[1]);
  ctx.stroke(clips[2]);
  ctx.stroke(clips[3]);
  ctx.stroke(clips[4]);
*/

}

onresize();

for (let i=0; i<C; i++) { lines[i].setLine(); }

setPaths();

//drawPath2(paths[0],1,"silver",[]);
start();
