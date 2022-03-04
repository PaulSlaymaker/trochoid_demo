"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
//ctx.filter="saturate(3)";


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

var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(2,7);
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    c.splice(getRandomInt(0,c.length+1),0,"black");
    let hd=Math.round(240/colorCount)*i+getRandomInt(-hr,hr);
    let sat=70+getRandomInt(0,31);
    let lum=40+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}
colors=getColors();

var getMatrixArray=(n)=>{
  let ua=[];
  for (let i=0; i<n; i++) {
    let z=i*TP/n;
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),-Math.sin(z),Math.cos(z),0,0]));
    ua.push(new DOMMatrix([Math.cos(z),Math.sin(z),Math.sin(z),-Math.cos(z),0,0]));
  }
  return ua;
}

const m4=getMatrixArray(4);
const m5=getMatrixArray(5);
const m6=getMatrixArray(6);
const m8=getMatrixArray(8);
const m9=getMatrixArray(9);
const m10=getMatrixArray(10);
const m12=getMatrixArray(12);
const m15=getMatrixArray(15);
const m16=getMatrixArray(16);
const m18=getMatrixArray(18);
const m20=getMatrixArray(20);

const symArrays=[
  [m4,m8,m16],
  [m4,m12],
  [m12,m6],	// not currently selecting lower index?
  [m6,m18],
  [m9,m18],
  [m4,m20],
  [m5,m10,m20],
  [m5,m15],
];

const arr4=[[4,0,0,0],[3,1,0,0],[2,2,1,0],[2,1,1,0],[1,1,1,1]];	// enhance single-symmetry sets
const arr3=[[3,0,0],[2,1,0],[1,1,1]];	// enhance single-symmetry sets
const arr2=[[2,0],[1,1]];

var syms=[];
var symType=0;
var setSymmetries=()=>{
  let ss=syms.reduce((a,aa)=>{ return a+aa.length; },0);
  if (symType==1) {
    if (ss==16) {
      if (Math.random()<0.5) symType=0;
      else symType=5;
    } else if (ss==48) {
      symType=2;
    }
  } else if (symType==2) {
    if (ss==24) {
      symType=3;
    } else if (ss==48) {
      symType=1;
    }
  } else if (symType==3) {
    if (ss==24) {
      symType=2;
    } else if (ss==72) { // [m6,m18];
      symType=4;
    }
  } else if (symType==4) { // [m9,m18],
    if (ss==72) {
      symType=3;
    }
  } else if (symType==5) { // [m4,m20],
    if (ss==16) {
      if (Math.random()<0.5) symType=0;
      else symType=1;
    } else if (ss==80) {
      symType=6;
    }
  } else if (symType==6) { // [m5,m10,m20],
    if (ss==120) {
      symType=5;
    } else if (ss==30) {
      symType=7;
    }
  } else if (symType==7) { // [m5,m15],
    if (ss==20) {
      symType=6;
    }
  } else {
    if (ss==24) {
      if (Math.random()<0.5) symType=1;
      else symType=5;
    }
  }
  syms=[];
//  [setSymmetriesD,setSymmetriesH,setSymmetriesN][symType]();
//console.log(symType);
  let arr=(symArrays[symType].length==3)?arr3:arr2;
  let at=arr[getRandomInt(0,arr.length,true)];	// favor single symmetry
  let sa=[];
  // randomize high to low symmetries
  for (let i=0; i<at.length; i++) sa.splice(getRandomInt(0,sa.length+1),0,at[i]);
  // create array to use over brushes
  for (let i=0; i<symArrays[symType].length; i++) {
    for (let j=0; j<sa[i]; j++) syms.push(symArrays[symType][i]);
  }
}

const brushCount=16;
const duration=240;	// make z tables of 240 length?
var Brush=function(idx) {
  this.idx=idx;
  this.col=idx;
  //this.duration=240;
  //this.time=-Math.round(duration*Math.random());
  this.time=-duration/16*idx;
  this.color=colors[this.col%colors.length];
  this.randomize=()=>{
    this.x=Math.round(340*Math.random()*Math.random());
    this.y=Math.round(340*Math.random()*Math.random());
    this.radius=getRandomInt(40,360-Math.round(Math.max(Math.abs(this.x),Math.abs(this.y))));
    this.rwidth=getRandomInt(9,15);
    this.rangle=TP*Math.random();
    this.d=[-1,1][getRandomInt(0,2)];
    this.sym=syms[idx%syms.length];
  }
  this.randomize();
  this.shift=()=>{
    this.time++;
    if (this.time==duration) {
      this.time=0;
      this.randomize();
      this.col++;
      this.color=colors[this.col%colors.length];
    }
  }
  this.getMetrics=()=>{
    let z=this.time*TP/duration/2;
    let f2=Math.pow(Math.sin(z),2);
    let pp=new Path2D();
    pp.arc(this.x+this.radius*Math.cos(this.d*z+this.rangle),
           this.y+this.radius*Math.sin(this.d*z+this.rangle),
           f2*this.rwidth,0,TP);
    let p2=new Path2D();
    for (let i=0; i<this.sym.length; i++) p2.addPath(pp,this.sym[i]);
    let alpha=1-Math.pow(Math.abs(Math.cos(z)),0.1);
    return {"path":p2,"alpha":alpha};
  }
}

var draw=()=>{
  brushes.forEach((b)=>{ 
    let brushMetrics=b.getMetrics();
    //ctx.globalAlpha=b.getAlpha();;
    ctx.globalAlpha=brushMetrics.alpha;
    //ctx.fillStyle=colors[b.col%colors.length];
    ctx.fillStyle=b.color;
//    ctx.fill(b.getPath());
    ctx.fill(brushMetrics.path);
  });
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
var colorDuration=800;
//var symDuration=1600;
function animate(ts) {
  if (stopped) return;
  brushes.forEach((b)=>{ b.shift(); });
  t++;
  if (t==colorDuration) {
    t=0;
    colors=getColors();
    setSymmetries();
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();

setSymmetries();

var brushes=[];
for (let i=0; i<16; i++) brushes.push(new Brush(i));

start();
