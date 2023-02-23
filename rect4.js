"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/JjaXbEJ
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
  d.append(c);
  return c.getContext("2d");
})();
ctx.setTransform(0,-1,1,0,CSIZE,CSIZE);
ctx.lineWidth=16;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function CV() {
  this.rk=TP*Math.random();
  this.tk=600+20*Math.random();
  this.radius=190*(1+Math.sin(this.rk+t/200));
  this.ak=TP*Math.random();
}

var stopped=true;
function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var t=0;
var c=0;
var cfrac=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  if (c%200==0) {
    //ctransit();
    patterns[1]=patterns[0]
    randomize();
    setPattern();
    ctx.fillStyle=patterns[0];
    c=0;
  }
  cfrac=c/200;
  transit();
  draw();
  requestAnimationFrame(animate);
}

onresize();

var R=380;

var ca=new Array();
for (let i=0; i<9; i++) ca.push(new CV());

var ra=new Array();
var rma=new Array();
var aa=new Array();

var transit=()=>{
  for (let i=0; i<ca.length; i++) {
    ra[i]=16+R*(1+Math.sin(ca[i].rk+t/ca[i].tk))/2;
  }
  ra.sort((a,b)=>{ return b-a; });
  for (let i=0; i<ra.length-1; i++) {
    rma[i]=(ra[i]+ra[i+1])/2;
  }
  for (let i=0; i<ra.length-1; i++) {
    let angle=2*(ra[i]-ra[i+1])/(ra[i]+ra[i+1]);
    //aa[i]=angle;
    aa[i]=angle+(TP/28)*(1+Math.sin(ca[i].ak+t/100));
    //aa.push((2+2*Math.random())*(ra[i]-ra[i+1])/(ra[i]+ra[i+1]));
  }
}

var getPath=()=>{
  let p=new Path2D();
  p.arc(0,0,ra[0],aa[0],TP-aa[0]);		// outside
  let x=rma[0]*Math.cos(-aa[0]);
  let y=rma[0]*Math.sin(-aa[0]);
  p.arc(x,y,(ra[0]-ra[1])/2,-aa[0],TP/2-aa[0]);	// cap0
  //p.arc(0,0,ra[1],TP-aa[0],aa[0],true);	// inside

  for (let i=1; i<ra.length-1; i++) {
    if (i%2) {
      p.arc(0,0,ra[i],-aa[i-1],-TP/2+aa[i],true);
      x=rma[i]*Math.cos(aa[i]+TP/2);
      y=rma[i]*Math.sin(aa[i]+TP/2);
      p.arc(x,y,(ra[i]-ra[i+1])/2,aa[i]-TP/2,aa[i],true);
    } else {
      p.arc(0,0,ra[i],TP/2+aa[i-1],-aa[i]);
      x=rma[i]*Math.cos(-aa[i]);
      y=rma[i]*Math.sin(-aa[i]);
      p.arc(x,y,(ra[i]-ra[i+1])/2,-aa[i],TP/2-aa[i]);
    }
  }

/*
  p.arc(0,0,ra[1],-aa[0],-TP/2+aa[1],true);	// inside1
  x=rma[1]*Math.cos(aa[1]+TP/2);
  y=rma[1]*Math.sin(aa[1]+TP/2);
  p.arc(x,y,(ra[1]-ra[2])/2,aa[1]-TP/2,aa[1],true);	// cap1
  //p.arc(0,0,ra[2],TP/2+aa[1],TP/2-aa[1]);	// inside2
  p.arc(0,0,ra[2],TP/2+aa[1],-aa[2]);	// inside2
  x=rma[2]*Math.cos(-aa[2]);
  y=rma[2]*Math.sin(-aa[2]);
  p.arc(x,y,(ra[2]-ra[3])/2,-aa[2],TP/2-aa[2]);	// cap2 
  //p.arc(0,0,ra[3],-aa[2],aa[2],true);	// inside3
  p.arc(0,0,ra[3],-aa[2],TP/2+aa[3],true);	// inside3
  x=rma[3]*Math.cos(aa[3]+TP/2);
  y=rma[3]*Math.sin(aa[3]+TP/2);
  p.arc(x,y,(ra[3]-ra[4])/2,aa[3]-TP/2,aa[3],true);	// cap3 
  //p.arc(0,0,ra[4],TP/2+aa[3],TP/2-aa[3]);	// inside4
  p.arc(0,0,ra[4],TP/2+aa[3],-aa[4]);	// inside4
  x=rma[4]*Math.cos(-aa[4]);
  y=rma[4]*Math.sin(-aa[4]);
  p.arc(x,y,(ra[4]-ra[5])/2,-aa[4],TP/2-aa[4]);	// cap4 
  //p.arc(0,0,ra[5],-aa[4],aa[4],true);	// inside5
  p.arc(0,0,ra[5],-aa[4],TP/2+aa[5],true);	// inside5
  x=rma[5]*Math.cos(aa[5]+TP/2);
  y=rma[5]*Math.sin(aa[5]+TP/2);
  p.arc(x,y,(ra[5]-ra[6])/2,aa[5]-TP/2,aa[5],true);	// cap5 
*/

  p.arc(0,0,ra[ra.length-1],TP/2+aa[ra.length-2],TP/2-aa[ra.length-2]);	// inside

  for (let i=ra.length-2; i>=1; i--) {
    if (i%2) {
      x=rma[i]*Math.cos(-aa[i]+TP/2);
      y=rma[i]*Math.sin(-aa[i]+TP/2);
      p.arc(x,y,(ra[i]-ra[i+1])/2,-aa[i],TP/2-aa[i],true);
      p.arc(0,0,ra[i],TP/2-aa[i],aa[i-1],true);
    } else {
      x=rma[i]*Math.cos(aa[i]);
      y=rma[i]*Math.sin(aa[i]);
      p.arc(x,y,(ra[i]-ra[i+1])/2,TP/2+aa[i],aa[i]);
      p.arc(0,0,ra[i],aa[i],TP/2-aa[i-1]);
    }
  }

/*
  x=rma[5]*Math.cos(-aa[5]+TP/2);
  y=rma[5]*Math.sin(-aa[5]+TP/2);
  p.arc(x,y,(ra[5]-ra[6])/2,-aa[5],TP/2-aa[5],true);	// cap5 
  p.arc(0,0,ra[5],TP/2-aa[5],aa[4],true);	// inside5
  x=rma[4]*Math.cos(aa[4]);
  y=rma[4]*Math.sin(aa[4]);
  p.arc(x,y,(ra[4]-ra[5])/2,TP/2+aa[4],aa[4]);	// cap4 
  p.arc(0,0,ra[4],aa[4],TP/2-aa[3]);	// inside4
  x=rma[3]*Math.cos(-aa[3]+TP/2);
  y=rma[3]*Math.sin(-aa[3]+TP/2);
  p.arc(x,y,(ra[3]-ra[4])/2,-aa[3],TP/2-aa[3],true);	// cap3 
  p.arc(0,0,ra[3],TP/2-aa[3],aa[2],true);	// inside3
  x=rma[2]*Math.cos(aa[2]);
  y=rma[2]*Math.sin(aa[2]);
  p.arc(x,y,(ra[2]-ra[3])/2,TP/2+aa[2],aa[2]);	// cap2 
  p.arc(0,0,ra[2],aa[2],TP/2-aa[1]);	// inside2
  x=rma[1]*Math.cos(-aa[1]+TP/2);
  y=rma[1]*Math.sin(-aa[1]+TP/2);
  p.arc(x,y,(ra[1]-ra[2])/2,-aa[1],TP/2-aa[1],true);	// cap1
  p.arc(0,0,ra[1],TP/2-aa[1],aa[0],true);	// inside1
*/

  x=rma[0]*Math.cos(aa[0]);
  y=rma[0]*Math.sin(aa[0]);
  p.arc(x,y,(ra[0]-ra[1])/2,TP/2+aa[0],aa[0]);	// cap0
  return p;
}

var rf=200+200*Math.random();
var gf=200+200*Math.random();
var bf=200+200*Math.random();
var ro=TP*Math.random();
var go=TP*Math.random();
var bo=TP*Math.random();

var randomize=()=>{
  rf=200+200*Math.random();
  gf=200+200*Math.random();
  bf=200+200*Math.random();
  ro=TP*Math.random();
  go=TP*Math.random();
  bo=TP*Math.random();
}

var octx=new OffscreenCanvas(2*CSIZE,2*CSIZE).getContext("2d");

var cpix=ctx.createImageData(2*CSIZE,2*CSIZE); 
var drawEM=()=>{
  for (let i=0; i<2*CSIZE; i++) {
    for (let j=0; j<2*CSIZE; j++) {
      let x=j-400;
      let y=i-400;
      let r=Math.pow(x*x+y*y,0.5);
      let a=Math.atan2(y,x)+TP/4;
      cpix.data[(i*3200)+j*4]=  Math.round((144+111*Math.sin(TP*r/rf+ro)*Math.cos(a)));
      cpix.data[(i*3200)+j*4+1]=Math.round((144+111*Math.sin(TP*r/gf+go)*Math.cos(a)));
      cpix.data[(i*3200)+j*4+2]=Math.round((144+111*Math.sin(TP*r/bf+bo)*Math.cos(a)));
      cpix.data[(i*3200)+j*4+3]=255;
    }
  }
//  ctx.putImageData(cpix,0,0);
  octx.putImageData(cpix,0,0);
}

ctx.strokeStyle="#00000030";

var patterns=new Array();
var setPattern=()=>{
  const dmp=new DOMMatrix([0,1,1,0,-CSIZE,-CSIZE]);
/*
  createImageBitmap(cpix).then((ib)=>{ 
    let pattern=ctx.createPattern(ib,"no-repeat");
    pattern.setTransform(new DOMMatrix([0,1,1,0,-CSIZE,-CSIZE]));
    ctx.fillStyle=pattern;
  });
*/
//  drawEM();
//  let pattern=ctx.createPattern(octx.canvas,"no-repeat");
  drawEM();
  patterns[0]=ctx.createPattern(octx.canvas,"no-repeat");
  patterns[0].setTransform(dmp);
}

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=getPath();
  ctx.fillStyle=patterns[0];
  ctx.globalAlpha=cfrac;
  ctx.fill(p);
  ctx.fillStyle=patterns[1];
  ctx.globalAlpha=1-cfrac;
  ctx.fill(p);
  ctx.globalAlpha=1;
  ctx.stroke(p);
}

setPattern();
patterns[1]=patterns[0];
setPattern();
ctx.fillStyle=patterns[0];
transit();

start();
