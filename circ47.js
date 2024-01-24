"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
const CSO=100;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
//c.style.outline="1px dotted gray";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d", {"willReadFrequently": true});
  //return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
//ctxo.canvas.style.width=ctxo.canvas.style.height=D/4+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+c/this.RK1)+(1-this.fr)*Math.cos(c/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+c/this.GK1)+(1-this.fg)*Math.cos(c/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+c/this.BK1)+(1-this.fb)*Math.cos(c/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),6);
    this.fg=1-Math.pow(0.9*Math.random(),6);
    this.fb=1-Math.pow(0.9*Math.random(),6);
  }
  this.randomize=()=>{
    this.RK1=80+80*Math.random();
    this.GK1=80+80*Math.random();
    this.BK1=80+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.randomizeF();
  }
  this.randomize();
}

var color=new Color();

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
//ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
//setTile(false);
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=getRandomInt(0,300);
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  c++;
  for (let i=0; i<lxa.length; i++) lxa[i].move(); 
  let eidx=lxa.length-1;
  if (lxa[eidx].t==0) {
    lxa.unshift(lxa.splice(eidx,1)[0]);
    xdir=++xdir%2;
  }
  for (let i=0; i<lya.length; i++) lya[i].move(); 
  let eidy=lya.length-1;
  if (lya[eidy].t==0) {
    lya.unshift(lya.splice(eidy,1)[0]);
    ydir=++ydir%2;
  }
  if (t>600) { // 600 arbitrary
    t=0;
    color.randomizeF();
    circ.randomize();
if (EM && t%300==0) stopped=true;
  } 

  draw();
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    //this.r=CSO/2*(1+Math.random());
    //this.r=1.7*CSO/2*(1+Math.random());
    this.r=1.4*CSO*(1+Math.random());
    this.r2=1.7*CSO/2*(1+Math.random());
    let lr=1.7*CSO*Math.random();
    this.x=lr*Math.cos(z);
    this.y=lr*Math.sin(z);
    this.ka=TP*Math.random();		// vary
    //this.ka2=0.005-0.01*Math.pow(Math.random(),5);
this.ka2=0.003*Math.pow([-1,1][getRandomInt(0,2)]*Math.random(),5);
    this.et=(80+160*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+3*Math.random();		// vary
  }
  this.randomize();
/*
  this.rand2=()=>{
    this.ka=TP*Math.random();
    this.et=(100+200*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+2*Math.random();
  }
  this.getRectPathT=()=>{
let f=(1+Math.cos(TP/2+TP*t/1200))/2;
//if (this.t>=this.k) this.t=0;
    let r=f*this.r; //CSO/2*(1+Math.random());
    let r2=f*this.r2;
    let p=new Path2D();
    p.moveTo(this.x-r,this.y-r2);
    p.lineTo(this.x+r,this.y-r2);
    p.lineTo(this.x+r,this.y+r2);
    p.lineTo(this.x-r,this.y+r2);
    p.closePath();
    return p;  
  }
*/
  this.getPath=()=>{
    let p=new Path2D();
    let ko=this.ka+TP*Math.sin(this.ka2*t);
    let f=(1+Math.cos(TP/2+TP*t/1200))/2;
    let r=f*this.r;
    //p.moveTo(this.x+r*Math.cos(this.ka+t/this.et),this.y+r*Math.sin(this.ka+t/this.et));
    //p.ellipse(this.x,this.y,r,r/this.erk,this.ka+t/this.et,0,TP);
    p.moveTo(this.x+r*Math.cos(ko+t/this.et),this.y+r*Math.sin(ko+t/this.et));
    p.ellipse(this.x,this.y,r,r/this.erk,ko+t/this.et,0,TP);
    return p;
  }
}

var Loc=function() { 
  this.k=600+2*getRandomInt(0,300);
  this.t=getRandomInt(0,this.k);
  this.move=()=>{
    this.t++;
    this.f=(1+Math.cos(TP/2+TP*this.t/this.k))/2;
    if (this.t>=this.k) this.t=0;
  }
//  this.move();
}

const circ=new Circle();

ctxo.lineWidth=2;
ctxo.fillStyle="black";
ctxo.fillRect(-CSO,-CSO,2*CSO,2*CSO);

var setTile=()=>{
  let p=circ.getPath();
  ctxo.lineWidth=8;
  ctxo.strokeStyle="#0000000C";
  ctxo.stroke(p);
  ctxo.lineWidth=2;
  ctxo.strokeStyle=color.getRGB();
  ctxo.stroke(p);
}

onresize();
const XTO=20+getRandomInt(0,240);
const YTO=20+getRandomInt(0,240);
//console.log(XTO,YTO);

var lxa=[new Loc(),new Loc(),new Loc(),new Loc(),new Loc(),new Loc()];
var lya=[new Loc(),new Loc(),new Loc(),new Loc(),new Loc(),new Loc()];
/*
var lxa=[];
var lya=[];
for (let i=0; i<16; i++) {
  lxa.push(new Loc());
  lya.push(new Loc());
}
*/
for (let i=0; i<lxa.length; i++) {
  lxa[i].t=i*XTO;
  lxa[i].k=1900;
  lxa[i].move();
  lya[i].t=i*YTO;
  lya[i].k=1600;
  lya[i].move();
}

var setNormalInterval=(a)=>{
  let sum=0;
  for (let i=0; i<a.length; i++) {
    sum+=a[i];
  }
  for (let i=0; i<a.length; i++) {
    a[i]=a[i]/sum;
  }
}

var xa;		// redundant
var ya;
var xdir=0;
var ydir=0;
var draw=()=>{
//ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);	// remove
  setTile();
  xa=[], ya=[];
  for (let i=0; i<lxa.length; i++) {
    xa.push(lxa[i].f);
    ya.push(lya[i].f);
  }
  setNormalInterval(xa);
  setNormalInterval(ya);

  let sxa=[0],sya=[0];
  for (let i=0; i<xa.length; i++) { sxa.push(xa[i]+sxa[i]); }
  for (let i=0; i<ya.length; i++) { sya.push(ya[i]+sya[i]); }
  for (let xr of [1,-1]) for (let yr of [1,-1]) { 	// quadrant reflections
    if (xdir) {	// 4 tile flip states
      if (ydir) {
	for (let i=0; i<xa.length; i++) {
	  for (let j=0; j<ya.length; j++) {
	    ctx.setTransform(xr*[-2,2][i%2]*xa[i],0,0,yr*[-2,2][j%2]*ya[j],
			     CSIZE+xr*sxa[(i+1)%2+i]*CSIZE,CSIZE+yr*sya[(j+1)%2+j]*CSIZE);
	    ctx.drawImage(ctxo.canvas,0,0);
	  }
	}
      } else {
	for (let i=0; i<xa.length; i++) {
	  for (let j=0; j<ya.length; j++) {
	    ctx.setTransform(xr*[-2,2][i%2]*xa[i],0,0,yr*[2,-2][j%2]*ya[j],
			     CSIZE+xr*sxa[(i+1)%2+i]*CSIZE,CSIZE+yr*sya[j%2+j]*CSIZE);
	    ctx.drawImage(ctxo.canvas,0,0);
	  }
	}
      }
    } else {
      if (ydir) {
	for (let i=0; i<xa.length; i++) {
	  for (let j=0; j<ya.length; j++) {
	    ctx.setTransform(xr*[2,-2][i%2]*xa[i],0,0,yr*[-2,2][j%2]*ya[j],
			     CSIZE+xr*sxa[i%2+i]*CSIZE,CSIZE+yr*sya[(j+1)%2+j]*CSIZE);
	    ctx.drawImage(ctxo.canvas,0,0);
	  }
	}
      } else {
	for (let i=0; i<xa.length; i++) {
	  for (let j=0; j<ya.length; j++) {
	    ctx.setTransform(xr*[2,-2][i%2]*xa[i],0,0,yr*[2,-2][j%2]*ya[j],
			     CSIZE+xr*sxa[i%2+i]*CSIZE,CSIZE+yr*sya[j%2+j]*CSIZE);
	    ctx.drawImage(ctxo.canvas,0,0);
	  }
	}
      }
    }
  }
}

start();

var test=()=>{
  for (let i=0; i<5; i++) {
    console.log(i,i%2+i,(i+1)%2+i);		// 1,1,3,3,5
//    console.log(i,i%2+i);		// 0,2,2,4,4
  }
}
