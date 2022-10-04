"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.lineCap="round";
ctx.lineJoin="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var colors=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  let hue=getRandomInt(180,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(180/colorCount)*i+getRandomInt(-10,10);
    let h=(hue+hd)%360;
    colors.splice(getRandomInt(0,colors.length+1),0,"hsl("+h+",98%,50%)");
  }
}

var drawPoint=(x,y,col,rp)=>{	// diag
  let r=rp?rp:5;
  ctx.beginPath();
  ctx.arc(x,y,r,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var COUNT=12;//getRandomInt(20,42);
var edge=CSIZE-24;	// f(lw)
var R=CSIZE/COUNT;
ctx.lineWidth=Math.round(2*R-4);

function RPath2(initPoint, idx) {
  initPoint.d=true;	// TODO, check if already true
  this.dir=idx%2;
  this.pa=[initPoint];
//if (this.dir) this.ka=[4,3,5];
//else this.ka=[1,0,2];
  if (this.dir) this.ka=[4,3,5];
  else this.ka=[1,2,0];
  this.la=new Array();
this.gr=0;
this.sh=0;
  this.grow=()=>{
    let pt=this.pa[this.pa.length-1];
    for (let ipt of this.ka) {
      let cpt=pt.cpa[ipt];
      if (!cpt) continue;
      if (cpt.d) continue;
      cpt.d=true;
      this.pa.push(cpt);
/*
      let p=new Path2D();
      p.moveTo(pt.x,pt.y);
      p.lineTo(cpt.x,cpt.y);
      this.la.push(p);
*/
this.gr++;
      return true;
    }
    return false;
  }
  this.shrink=()=>{
//this.sh=0;
if (this.pa.length>4) this.sh=1;
else this.sh=0;
    if (this.pa.length<4) return;
    this.pa[0].d=false;
    this.pa.shift();
//if (this.pa.length>2) this.sh=1;
this.sh=1;
    return;
  }
  this.getPath=()=>{
    let p=new Path2D(); 
    if (!this.sh && !this.gr) {
      p.moveTo(this.pa[1].x,this.pa[1].y);
      for (let i=2; i<this.pa.length; i++) {
        p.lineTo(this.pa[i].x,this.pa[i].y);
      }
      return p;
    }
    if (this.sh) {
      p.moveTo((1-frac)*this.pa[0].x+frac*this.pa[1].x,(1-frac)*this.pa[0].y+frac*this.pa[1].y);
    } else p.moveTo(this.pa[0].x,this.pa[0].y);
    for (let i=1; i<this.pa.length-1; i++) {
      p.lineTo(this.pa[i].x,this.pa[i].y);
    }
    let pt2=this.pa[this.pa.length-1];
    if (this.gr) {
      let pt1=this.pa[this.pa.length-2];
//      p.moveTo(pt1.x,pt1.y);
      p.lineTo((1-frac)*pt1.x+frac*pt2.x,(1-frac)*pt1.y+frac*pt2.y);
    } else p.lineTo(pt2.x,pt2.y);
    return p;
  }
  this.getEndPath=()=>{
    let p=new Path2D();
    p.moveTo((1-frac)*this.pa[0].x+frac*this.pa[1].x,(1-frac)*this.pa[0].y+frac*this.pa[1].y);
    p.lineTo(this.pa[1].x,this.pa[1].y);
    return p;
  }
  this.getFrontPath=()=>{
    if (this.gr==0) debugger;
    if (this.gr==1) {
    let p=new Path2D();
    let p1=this.pa[this.pa.length-2];
    let p2=this.pa[this.pa.length-1];
    p.moveTo(p1.x,p1.y);
    p.lineTo((1-frac)*p1.x+frac*p2.x,(1-frac)*p1.y+frac*p2.y);
    return p;
    }
    if (this.gr==2) {
    let p=new Path2D();
    let p1=this.pa[this.pa.length-3];
    let p2=this.pa[this.pa.length-1];
    p.moveTo(p1.x,p1.y);
    p.lineTo((1-frac)*p1.x+frac*p2.x,(1-frac)*p1.y+frac*p2.y);
    return p;
    }
  }
}

/*
var pts=[];
var setPoints=()=>{
  for (let i=0; i<COUNT; i++) {
    pts[i]=[];
    for (let j=0; j<COUNT; j++) {
      pts[i][j]={"x":-edge+i*2*R,"y":-edge+j*2*R,"i":i,"j":j};
//if (Math.abs(i-16)+Math.abs(j-16)>20) pts[i][j].d=true;
if (Math.pow(pts[i][j].x*pts[i][j].x+pts[i][j].y*pts[i][j].y,0.5)>edge) pts[i][j].d=true;
    }
  }
}
*/

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
var t=1;
var frac=0;
var dur=20;
function animate(ts) {
  if (stopped) return;
  t++;
//  for (let i=0; i<rpa.length; i++) { if (t%rpa[i].rt==0) rpa[i].ka.unshift(rpa[i].ka.pop()); }
  //if (t%116==0) {
  if (t==dur) {
    for (let i=0; i<rpa.length; i++) {
rpa[i].gr=0;
      rpa[i].grow();
      if (rpa[i].pa.length<len) rpa[i].grow();
      rpa[i].shrink();
//      if (rpa.length>3) rpa[i].sh=1;
    }
    t=0;
  }
  frac=t/dur;
  draw();
  requestAnimationFrame(animate);
}

onresize();

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);	// TODO, remove, black on shrink
/*
for (let w=0; w<pts2.length; w++) {
  for (let c=0; c<pts2[w].length; c++) {
    drawPoint(pts2[w][c].x,pts2[w][c].y,"gray",3);
  }
}
*/
  let pa=[new Path2D(),new Path2D(),new Path2D(),new Path2D()];
  for (let i=0; i<rpa.length; i++) {
/*
    if (rpa[i].sh) {
      for (let j=1; j<rpa[i].la.length; j++) pa[i%4].addPath(rpa[i].la[j]);
      pa[i%4].addPath(rpa[i].getEndPath());
    } else {
//      for (let j=0; j<rpa[i].la.length; j++) pa[i%4].addPath(rpa[i].la[j]);
      pa[i%4].addPath(rpa[i].getPath());
    }
*/
      pa[i%4].addPath(rpa[i].getPath());
/*
    if (rpa[i].gr==0) {
      for (let j=1; j<rpa[i].la.length-1; j++) {
        p2.addPath(rpa[i].la[j]);
      }
    } else if (rpa[i].gr==1) {
      p2.addPath(rpa[i].getEndPath());
      for (let j=1; j<rpa[i].la.length-1; j++) {
        p2.addPath(rpa[i].la[j]);
      }
      p2.addPath(rpa[i].getFrontPath());
    } else if (rpa[i].gr==2) {
      p2.addPath(rpa[i].getEndPath());
      for (let j=1; j<rpa[i].la.length-2; j++) {
        p2.addPath(rpa[i].la[j]);
      }
      p2.addPath(rpa[i].getFrontPath());
    } else debugger;
*/
  }
  for (let i=0; i<4; i++) {
    ctx.strokeStyle=colors[i%colors.length];
    ctx.stroke(pa[i]);
  }
}

setColors();

var pts2=[];
var setPoints2=()=>{
  //let wc=(CSIZE-20)/R;
  let wc=(CSIZE-3*R)/R;
  for (let w=0; w<wc; w++) {	// 3pt, dir
    pts2[w]=[];
    let ra=TP*Math.random();
    let cc=Math.round((w+1)*TP);
    for (let c=0; c<cc; c++) {
      let a=ra+TP/cc*c;
      if (a>TP) a-=TP;
      pts2[w][c]={"x":(w+3)*R*Math.cos(a),"y":(w+3)*R*Math.sin(a),"a":a,"w":w,"cpa":[]};
    }
    pts2[w].sort((a,b)=>{ return a.a-b.a; });
  }
}

setPoints2();

for (let w=0; w<pts2.length; w++) {
  for (let c=0; c<pts2[w].length; c++) {
    // +in, +out, -in, -out
    // +in, +even, +out, -out, -even, -in
    pts2[w][c].cpa[1]=pts2[w][(c+1)%pts2[w].length];
    pts2[w][c].cpa[4]=pts2[w][(c+pts2[w].length-1)%pts2[w].length];
    if (w==0) {
      pts2[w][c].cpa[0]=false;
      pts2[w][c].cpa[5]=false;
      for (let i=0; i<pts2[1].length; i++) {
        if (pts2[1][i].a>pts2[0][c].a) {
          pts2[0][c].cpa[2]=pts2[1][i];
          pts2[0][c].cpa[3]=pts2[1][(i+pts2[1].length-1)%pts2[1].length];
          break;
        }
      }
    } else if (w==pts2.length-1) {
      pts2[w][c].cpa[2]=false;
      pts2[w][c].cpa[3]=false;
      let pta=pts2[pts2.length-2];
      for (let i=0; i<pta.length; i++) {
        if (pta[i].a>pts2[w][c].a) {
          pts2[w][c].cpa[0]=pta[i];
          pts2[w][c].cpa[5]=pta[(i+pta.length-1)%pta.length];
//          drawPoint(pts2[w-1][i].x,pts2[w-1][i].y,"yellow",7);
//          drawPoint(pts2[w][c].cpa[5].x,pts2[w][c].cpa[5].y,"red");
          break;
        }
      }
    } else {
      for (let i=0; i<pts2[w-1].length; i++) {
        if (pts2[w-1][i].a>pts2[w][c].a) {
          pts2[w][c].cpa[0]=pts2[w-1][i];
          pts2[w][c].cpa[5]=pts2[w-1][(i+pts2[w-1].length-1)%pts2[w-1].length];
//if (pts2[w][c].cpa[5]==undefined) debugger;
          //drawPoint(pts2[w][c].x,pts2[w][c].y,"white",7);
//          drawPoint(pts2[w-1][i].x,pts2[w-1][i].y,"blue",6);
//          drawPoint(pts2[w][c].cpa[5].x,pts2[w][c].cpa[5].y,"green");
          break;
        }
      }
      for (let i=0; i<pts2[w+1].length; i++) {
        if (pts2[w+1][i].a>pts2[w][c].a) {
          pts2[w][c].cpa[2]=pts2[w+1][i];
          pts2[w][c].cpa[3]=pts2[w+1][(i+pts2[w+1].length-1)%pts2[w+1].length];
          break;
        }
      }
    }
  }
}

var rpa=new Array();

for (let i=0; i<8; i++) {
  let rw=getRandomInt(0,pts2.length);
  let rc=getRandomInt(0,pts2[rw].length);
  let rpt=pts2[rw][rc];
  while (rpt.d) {
    rw=getRandomInt(0,pts2.length);
    rc=getRandomInt(0,pts2[rw].length);
    rpt=pts2[rw][rc];
  }
  let rp=new RPath2(rpt,i);
  rpa.push(rp);//new RPath2(rpt,i));
}

//var len=200;
//var len=Math.round(1.1*pts2[pts2.length-1].length);
//var len=Math.round(pts2[pts2.length-1].length/3);
var len=32;
for (let i=0; i<len; i++) {
  for (let j=0; j<rpa.length; j++) {
    rpa[j].grow();
  }
}

for (let i=0; i<rpa.length; i++) {
  if (rpa[i].pa.length>2) {
    rpa[i].gr=1;
    rpa[i].sh=1;
  }
}

ctx.lineWidth=0.7*R;
ctx.strokeStyle=colors[0];

draw();
