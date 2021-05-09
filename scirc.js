"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=600;

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  let co=document.createElement("div");
  co.style.textAlign="center";
  co.append(c);
  body.append(co);
  return c.getContext("2d");
})();

ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=3;

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var cbLoc=(p1,p2,frac)=>{
  const f1=.2;
  const f2=.8;
  let e1=Math.pow(1-frac,3)*p1;
  let e2=3*frac*Math.pow(1-frac,2)*(p1+(p2-p1)*f1);
  let e3=3*(1-frac)*Math.pow(frac,2)*(p1+(p2-p1)*f2);
  let e4=Math.pow(frac,3)*p2;
  return e1+e2+e3+e4;
}

const D=120;

var circle=(()=>{
  let p=new Path2D();
  p.moveTo(D,0);
  p.arc(0,0,D,0,TP);
  return p
})();

var diamond=(()=>{ 
  let p=new Path2D(); 
  p.moveTo(-D,0);
  let K=40;
  for (let i=0; i<K; i++) {
    p.lineTo(
      -D*(0.9*Math.cos(i*TP/K)+0.1*Math.cos(3*i*TP/K)),
      D*(0.9*Math.sin(i*TP/K)-0.1*Math.sin(3*i*TP/K)),
    );
  }
  p.closePath();
  return p; 
})();

var cross=(()=>{ 
  let p=new Path2D(); 
  p.moveTo(-D,0);
  let K=80;
  for (let i=0; i<K; i++) {
    p.lineTo(-D/2*(Math.cos(i*TP/K)+Math.cos(3*i*TP/K)),D/2*(Math.sin(i*TP/K)-Math.sin(3*i*TP/K)));
  }
  p.closePath();
  return p; 
})();

var randomColor=()=>{ return "hsl("+getRandomInt(0,360)+",100%,40%)"; }
var randomPath=()=>{ return [diamond,cross,circle][getRandomInt(0,3,true)]; }

function Shape() {
  this.path=randomPath();
  this.color=randomColor();
  this.randomize=()=>{
    this.path=randomPath();
    this.color=randomColor();
  }
}

var shapes=[new Shape(),new Shape(),new Shape(),new Shape()];

function MSet(sn0,sn1) {
  this.metric1=0;
  this.metric2=0;
  this.time=0;
  this.frac=0;
  this.duration=1000+getRandomInt(0,3000);
  this.transit=()=>{
    if (this.metric1==0)  shapes[sn0].randomize();
    else if (this.metric1==1)  shapes[sn1].randomize();
    this.metric2=this.metric1;
    if (Math.random()<0.3) this.metric1=[0,1][getRandomInt(0,2)];
    else this.metric1=Math.random();
    this.duration=1000+getRandomInt(0,3000);
  }
}

var sets=[
  new MSet(0,1),	// ax1,ax2
  new MSet(2,3),	// bx1,bx2
  new MSet(0,2),	// ay1,ay2
  new MSet(1,3)		// by1,by2
];

ctx.strokeStyle="#444";
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let dp=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
  for (let i=0; i<9; i++) {
      let x=-4*D+D*i;
    for (let j=0; j<9; j++) {
      let y=-4*D+D*j;
      let zx1=[sets[j%2].metric1,1-sets[j%2].metric1][i%2];
      let zx2=[sets[j%2].metric2,1-sets[j%2].metric2][i%2];
      let zy1=[sets[2+i%2].metric1,1-sets[2+i%2].metric1][j%2];
      let zy2=[sets[2+i%2].metric2,1-sets[2+i%2].metric2][j%2];
      let xfrac=sets[j%2].frac;
      let yfrac=sets[2+i%2].frac;
      let mx=cbLoc(zx2,zx1,xfrac);
      let my=cbLoc(zy2,zy1,yfrac);
      let p=i%2+2*(j%2);
      dp[p].addPath(shapes[p].path, new DOMMatrix([mx,0,0,my,x,y]));
    }
  }
  for (let i=0; i<4; i++) {
    ctx.fillStyle=shapes[i].color;
    ctx.fill(dp[i]); 
    ctx.stroke(dp[i]); 
  }
}

var stopped=true;
var start=()=>{
  if (stopped) {
    stopped=false;
    sets.forEach((s)=>{ s.time=performance.now()-s.frac*s.duration; });
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var animate=(ts)=>{
  if (stopped) return;
  for (let i=0; i<4; i++) {
    if (!sets[i].time) sets[i].time=ts;
    let progress=ts-sets[i].time;
    if (progress<sets[i].duration) {
      sets[i].frac=progress/sets[i].duration;
    } else {
      sets[i].transit();
      sets[i].time=0;
      sets[i].frac=0;
    }
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
sets.forEach((s)=>{ s.transit(); s.transit(); });
start();
