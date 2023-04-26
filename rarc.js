"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/oNWLZpN
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

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

onresize=function() { 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}
ctx.translate(CSIZE,CSIZE);
ctx.strokeStyle="silver";
ctx.lineWidth=0.3;

var colors=[];
var setColors=()=>{
  colors=[];
  let hue=getRandomInt(0,360);
  let hd=getRandomInt(90,270);
  for (let i=0; i<W; i++) {
    let sat=80+20*Math.random();
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

var C=[8,16,32][getRandomInt(0,3)];
var CMIN=2;
//var C=16;
var W=[17,19,21][getRandomInt(0,3)];

var r=[];
var r2=[];
for (let i=0; i<W+2; i++) {
  r[i]=Math.min(CSIZE,i*CSIZE/W);
  r2[i]=Math.min(CSIZE,i*CSIZE/W);
}

/*
var setRadii=()=>{
  let rr=[];
  for (let i=0; i<W+1; i++) {	// +1 fixme
    rr.push(getRandomInt(0,CSIZE,getRandomInt(0,2)));
  }
  rr.sort((a,b)=>{ return a-b; });
  rr[W+1]=CSIZE;
  return rr;
}
*/

var setRadiiT=()=>{
  let rr=[];
  for (let i=0; i<W-2; i++) {
    if (i && Math.random()<0.5) rr[i]=rr[i-1];
    else if (Math.random()<0.3) rr[i]=r2[i];
    else if (Math.random()<0.3) rr[i]=r[i];
    else rr[i]=getRandomInt(0,CSIZE,getRandomInt(0,2));
  }
  rr.sort((a,b)=>{ return a-b; });
  rr.unshift(0);
  rr[W-2]=CSIZE;
  rr[W-1]=CSIZE;
  rr[W]=CSIZE;
  rr[W+1]=CSIZE;
  return rr;
}

var setRadiiC=()=>{
  let rr=[];
  for (let i=0; i<W-2; i++) {
    if (i && Math.random()<0.5) rr[i]=rr[i-1];
    else if (Math.random()<0.3) rr[i]=r2[i];
    else if (Math.random()<0.3) rr[i]=r[i];
    else rr[i]=getRandomInt(0,CSIZE,getRandomInt(0,2));
  }
  rr.sort((a,b)=>{ return a-b; });
  rr.unshift(0);
  rr.unshift(0);
  rr.unshift(0);
  rr[W+1]=CSIZE;
  return rr;
}

function Point(x,y) {
  this.x=x;
  this.y=y;
}

var getRadius=(idx)=>{
  return r[idx]*Math.pow(Math.cos(t2/RATE2*TP),2)+r2[idx]*Math.pow(Math.sin(t2/RATE2*TP),2);
}

const RATE=800;
const RATE2=960;

var pts=[];
var setPoints=()=>{
  let Q=(1+Math.cos(t/RATE*TP))/4;
  pts=[];
  for (let j=0; j<W+2; j++) {
    let cr=[];
    let rr=getRadius(j);
    for (let i=0; i<C+1; i++) {
      if (j%2==0) { 
	if (j==0) {
          cr.push(new Point(0,0));
	} else {
	  cr.push(new Point(rr*Math.sin(i*TP/C),rr*Math.cos(i*TP/C)));
	}
      } else {
        let q=((i%2==0)?i-Q:i+Q)-0.5;
        //cr.push(new Point(r[j-1]*Math.sin(q*TP/C),r[j-1]*Math.cos(q*TP/C)));
        cr.push(new Point(rr*Math.sin(q*TP/C),rr*Math.cos(q*TP/C)));
      }
    }
    pts.push(cr);
  }
}

var B=getRandomInt(0,W);

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  setPoints();
  for (let j=W-1; j>=0; j--) {
    if (j==B) continue;
    let p=new Path2D();
    for (let i=0; i<C; i++) {
      if (j%2) {
	p.moveTo(pts[j][i+1].x,pts[j][i+1].y);
	p.lineTo(pts[j+1][i].x,pts[j+1][i].y);
	p.lineTo(pts[j+2][i+1].x,pts[j+2][i+1].y);
      } else {
	p.moveTo(pts[j][i].x,pts[j][i].y);
	p.lineTo(pts[j+1][i].x,pts[j+1][i].y);
	p.lineTo(pts[j+2][i].x,pts[j+2][i].y);
      }
      p.lineTo(pts[j+1][i+1].x,pts[j+1][i+1].y);
      p.closePath();
    }
    ctx.fillStyle=colors[j%colors.length];
    ctx.fill(p);
    ctx.stroke(p);
  }
}

var EXP=true;
var t=0;
var t2=0;
var stopped=true;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  t2++;
  if (t%(RATE/2)==0) {
    t=0;
    if (EXP) {
      if (C==64) {
        t=RATE/2;
        EXP=false;
      } else if (C==CMIN) {
          C*=2;
      } else {
        if (Math.random()<0.5) {
          C*=2;
        } else {
          t=RATE/2;
          EXP=false;
        }
      }
    } else {
      if (C==CMIN) {
        EXP=true;
        if (C==2) setColors(); // only when C==2
      } else {
        if (Math.random()<0.5) {
          EXP=true;
        } else {
          t=RATE/2;
          C/=2;
        }
      }
    }
  }

if (t2%(RATE2/4)==0) {
  if (t2%(RATE2/2)==0) {
    r2=setRadiiC();
    let cr=[];
    for (let i=0; i<C+1; i++) cr.push(new Point(0,0));
    pts.pop();
    pts.unshift(cr);
    colors.unshift(colors.pop());
    pts.pop();
    pts.unshift(cr);
    colors.unshift(colors.pop());
    r.pop(); r.unshift(0);
    r.pop(); r.unshift(0);
B=(B+2)%W;
  } else {
    r=setRadiiT();
//    r=setRadii();
  }
}

  draw();
  requestAnimationFrame(animate);
}

var mode=0;
var start=()=>{
  mode=++mode%3;
  if (mode==0) {
    stopped=true;
  } else if (mode==1) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    setColors();
  }
/*
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
*/
}
ctx.canvas.addEventListener("click", start, false);

onresize();
//draw();
setColors();

r=setRadiiT();
r2=setRadiiC();
start();
