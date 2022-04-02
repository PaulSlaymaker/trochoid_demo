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
  c.width=c.height=2*CSIZE;
c.style.outline="0.4px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
//ctx.rotate(-TP/4);
ctx.textAlign="center";

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
  let colorCount=getRandomInt(3,7);
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-hr,hr);
    let sat=80+getRandomInt(0,21);
    let lum=40+getRandomInt(0,41);
    //let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}
//colors=getColors();

//var tlc=[];
var ca=[];

var Circle=function(x,y,a,lr) {
  this.x=x;
  this.y=y;
  this.r=0;	// circle radius
  this.a=a;
  this.lr=lr;	// location radius
  this.cca=[];
  this.inc=(Math.random()<0.5?1:-1)*getRandomInt(1800,3000);
  ca.push(this);
/*	
  this.getContainingCircle=(x,y)=>{	// for multilevel
    if (ctx.isPointInPath(this.path,x+CSIZE,y+CSIZE)) {
      for (let i=0; i<this.cca.length; i++) {
        let cc=this.cca[i].getContainingCircle(x,y);
        if (cc) return cc;	// should be only one
      }
      return this;
    }
    return false;
  }
*/
  this.move=()=>{
    this.a+=TP/this.inc;
    this.x=this.lr*Math.cos(this.a);
    this.y=this.lr*Math.sin(this.a);
  }
  this.setPath=()=>{
    this.path=new Path2D();
    this.path.arc(this.x,this.y,this.r,0,TP);
  }
  this.setRadius=(r)=>{
    this.r=r;
    this.path=new Path2D();
    if (r>0) this.path.arc(this.x,this.y,r,0,TP);
  }
//  this.setRadius(r);
}

/*
var getContainingCircle=(x,y)=>{
  for (let i=0; i<tlc.length; i++) {
  }
}
*/

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,2,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

/*
var MINR=0;
var getNewCircle=()=>{
  let x=Math.round(-380+760*Math.random());
  let y=Math.round(-380+760*Math.random());
  let pip=false;
  for (let i=0; i<tlc.length; i++) {
    //if (ctx.isPointInPath(tlc[i].path,x+CSIZE,y+CSIZE)) {
    let cc=tlc[i].getContainingCircle(x,y);
    // recursive pip check:  interior or ext-sib, ext-par
    if (cc) {
      let pd=Math.pow((cc.x-x)*(cc.x-x)+(cc.y-y)*(cc.y-y),0.5);
      let maxr=cc.r-pd;
// scan cc.cca
    for (let j=0; j<cc.cca.length; j++) {
      let pd2=Math.pow((cc.cca[j].x-x)*(cc.cca[j].x-x)+(cc.cca[j].y-y)*(cc.cca[j].y-y),0.5);
      maxr=Math.min(maxr,pd2-cc.cca[j].r);
      // could break on min16
    }
      if (maxr>MINR) { 
        let c=new Circle(x,y,maxr);
        cc.cca.push(c);
        return c;
      } else {
//drawPoint(x,y);
//console.log("small int "+x+" "+y);
        return false;
      }
      // calc r
      // create, add to container, return circle
debugger;
      pip=true;
      break;	// should be unique
    }
  } 
  if (pip) {
debugger;
console.log("linner");
return false;
  } else {
    let maxr=Math.min(380-Math.abs(x),380-Math.abs(y));	//  380 for 1 outer circ +20r
    for (let i=0; i<tlc.length; i++) {
      let pd=Math.pow((tlc[i].x-x)*(tlc[i].x-x)+(tlc[i].y-y)*(tlc[i].y-y),0.5);
//console.log(i);
//console.log(pd-tlc[i].r);
//console.log(maxr);
      maxr=Math.min(maxr,pd-tlc[i].r);
      // could break on min16
    }
    if (maxr>MINR) {
      let c=new Circle(x,y,maxr);
      tlc.push(c);
      return c;
    } else {
//console.log("small ext "+x+" "+y);
//drawPoint(x,y);
      return false;
    }
  }
}
*/

//var initCircles=()=>{ for (let i=0; i<400; i++) getNewCircle(); }

const WID=12;
ctx.lineWidth=WID;
/*
var drawO=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//for (let i=0; i<5; i++) { let c=getNewCircle(); }
  let cp1=new Path2D();
  let cp2=new Path2D();
  let cp3=new Path2D();
  for (let i=0; i<ca.length; i++) {
    if (ca[i].r>60) cp1.addPath(ca[i].path);
    else if (ca[i].r>30) cp2.addPath(ca[i].path);
    else cp3.addPath(ca[i].path);
drawPoint(ca[i].x,ca[i].y);
  }
  ctx.strokeStyle=colors[0];
  ctx.stroke(cp1);
  ctx.strokeStyle=colors[1];
  ctx.stroke(cp2);
  ctx.strokeStyle=colors[2];
  ctx.stroke(cp3);
}
*/

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ca.length; i++) {
    ctx.beginPath();
    let dr=ca[i].r-WID/2;
    if (dr>0) {
    ctx.arc(ca[i].x,ca[i].y,dr,0,TP);
    ctx.strokeStyle="hsl("+(Math.round(360*ca[i].r/200)%360)+",100%,50%)";
    ctx.stroke();
    }
drawPoint(ca[i].x,ca[i].y);
  }
}

var nodes=[];	// nodes are used for drawing, only?

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
  transit();
  requestAnimationFrame(animate);
}

onresize();

var pmap=new Map();
var getRandomPoint=()=>{
  let r=18*(1-Math.pow(Math.random(),2));
  let a=TP*Math.random();
  return {"x":20*Math.round(r*Math.cos(a)),"y":20*Math.round(r*Math.sin(a)),"r":20*r,"a":a};
}

var getRandomPoint2=()=>{
  let a=TP*Math.random();
  let a2=TP*Math.random();
  let r=360*Math.pow(Math.sin(a2),2);
  return {"x":Math.round(r*Math.cos(a)),"y":Math.round(r*Math.sin(a)),"r":r,"a":a,"a2":a2};
}

var pa=[];
for (let i=0; i<12; i++) {
  let pt=getRandomPoint2();
//  pmap.set(pt.x+","+pt.y,pt);
//drawPoint(pt.x,pt.y);
//  if (pmap.size==160) break;
  pa.push(getRandomPoint2());
}

//var pa=Array.from(pmap.values());

for (let i=0; i<pa.length; i++) {
  //let maxr=380-pa[i].r;
  let maxr=Math.min(190,380-pa[i].r);
/*
  for (let j=0; j<ca.length; j++) {	// could be redundant for setCircleRadii
    let pd=Math.pow((ca[j].x-pa[i].x)*(ca[j].x-pa[i].x)+(ca[j].y-pa[i].y)*(ca[j].y-pa[i].y),0.5);
    maxr=Math.min(maxr,pd-ca[j].r);
  }
*/
  new Circle(pa[i].x,pa[i].y,pa[i].a,pa[i].r);
}
//ca[0].r=Math.min(60,ca[0].r);
//ca[0].r=Math.min(120,ca[0].r);
//ca[0].r=pa[0].r;
console.log("ca "+ca.length);

var setCircleRadii=()=>{
  ca[0].cca=[];
  //ca[0].r=380-Math.pow(ca[0].x*ca[0].x+ca[0].y*ca[0].y,0.5);
  ca[0].r=Math.min(190,380-Math.pow(ca[0].x*ca[0].x+ca[0].y*ca[0].y,0.5));
  ca[0].setPath();
  for (let i=1; i<ca.length; i++) {
    ca[i].cca=[];
    //let maxr=190-ca[i].r;
//let maxr=190-Math.abs(ca[i].r);
    let maxr=380-Math.pow(ca[i].x*ca[i].x+ca[i].y*ca[i].y,0.5);
    //maxr=Math.min(120,maxr);	// may remove for multi-level
maxr=Math.min(220,maxr);	// may remove for multi-level
    for (let j=i-1; j>=0; j--) {
//if (i==j) debugger;
      if (ctx.isPointInPath(ca[j].path,ca[i].x+CSIZE,ca[i].y+CSIZE)) { 
        let pd=Math.pow((ca[j].x-ca[i].x)*(ca[j].x-ca[i].x)+(ca[j].y-ca[i].y)*(ca[j].y-ca[i].y),0.5);
// set maxr
        //maxr=Math.max(0,ca[j].r-WID); 
        maxr=Math.max(0,ca[j].r-WID-pd);
        if (maxr==0) break;
        for (let k=0; k<ca[j].cca.length; k++) {
          let pd=Math.pow(
            (ca[j].cca[k].x-ca[i].x)*(ca[j].cca[k].x-ca[i].x)+
            (ca[j].cca[k].y-ca[i].y)*(ca[j].cca[k].y-ca[i].y),
            0.5);
            maxr=Math.min(maxr,pd-ca[j].cca[k].r);
            //maxr=Math.min(maxr,pd);
// pd test for k members with ca[i]
//console.log(maxr);
        }
//        maxr=0;
        ca[j].cca.push(ca[i]);
        break; 
      }	else {
        let pd=Math.pow((ca[j].x-ca[i].x)*(ca[j].x-ca[i].x)+(ca[j].y-ca[i].y)*(ca[j].y-ca[i].y),0.5);
        maxr=Math.min(maxr,pd-ca[j].r);
      }
    }
    ca[i].setRadius(maxr);
  }
}

var markCircles=()=>{
  /*
  ctx.strokeStyle="white";
  ctx.stroke(ca[0].path);
  drawPoint(ca[1].x,ca[1].y,"yellow");
  */
  drawPoint(ca[0].x,ca[0].y,"green");
  drawPoint(ca[1].x,ca[1].y,"white");
  ctx.beginPath();
  ctx.arc(0,0,380+WID/2,0,TP);
  ctx.strokeStyle="gray";
  ctx.stroke();
}

setCircleRadii();
draw();

markCircles();

var transit=()=>{
//  ca[0].move();
//  ca[0].setPath();
  for (let i=0; i<ca.length; i++) { ca[i].move(); }
  setCircleRadii();
  draw();
markCircles();
}

