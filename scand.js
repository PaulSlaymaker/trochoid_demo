"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";

const TP=2*Math.PI;

const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  //document.getElementById("cancont").append(c);
  body.append(c);
  return c;
})();

var ctx=canvas.getContext("2d");
//ctx.fillStyle="#AADDAA";

onresize=function() { 
//  canvas.width=window.innerWidth; 
  ctx.translate(DX,DY);
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Shape=function() {
  this.olx=1;
  this.oly=1;
  this.gon=4;
  this.rot=0;
  this.randomize=()=>{
    this.olx=0.8+0.5*Math.random();
    this.oly=0.8+2.2*Math.random();
  }
}

var Pattern=function() {
  this.s1=new Shape();
  this.olx=1;
  this.oly=1;
  this.color="";
  this.bkg="";
  this.gon=4;
  this.rot=0;
  this.rotAlt=false;
/*
  overlap x,y
  color, bkg
  shape 1,2,?3....  4,6,8 gon or liss
  rotate 1,2 (0 or 90)
  count x,y   f(Dx,Dy)
  nested, repeated, repeat (odd poly) or pattern (1,1,2), clipped
*/
  this.randomize=()=>{
    let light="hsl("+getRandomInt(0,360)+",70%,70%)";
    let dark="hsl("+getRandomInt(0,360)+",50%,50%)";
    if (Math.random()<0.5) {
      this.color=light;
      this.bkg=dark;
    } else {
      this.color=dark;
      this.bkg=light;
    }
    this.gon=[3,4,5,6,8][getRandomInt(0,5)];
    if (this.gon==3) {
      this.rot=TP/2;
    } else if (this.gon==4) {
      this.rot=[0,TP/8][getRandomInt(0,2)];
    } else if (this.gon==5) {
      this.rot=TP/2;
    } else if (this.gon==6) {
      this.rot=[0,TP/12][getRandomInt(0,2)];
    } else {
      this.rot=0;
    }
    if (this.rot>0) {
      if (this.gon%2==1) {
        this.rotAlt=true;
      } else {
        this.rotAlt=Math.random()<0.5?true:false;
      }
    } else {
      this.rotAlt=false;
    }
    if (this.gon%2==1) {
      this.olx=1+0.7*Math.random();
      this.oly=1+2.5*Math.random();
    } else {
      this.olx=0.8+0.5*Math.random();
      this.oly=0.8+2.2*Math.random();
    }
    this.s1.randomize();
  }
  this.randomize();
}

const P1=new Pattern();
const P2=new Pattern();

var DX=400;
var DY=400;
var C=4;
var F1=1;
var ROWS=10;
var COLS=32;
let PY=DY/ROWS;
//let PX=DX/COLS;
let hue=0;
let M=0;

var draw=()=>{
  ctx.clearRect(-DX,-DY,canvas.width,canvas.height);
  let z=DX*(2*(M<0?1+M:M)-1);
  if (M<0) {
    ctx.fillStyle=P1.bkg;
    ctx.fillRect(-DX,-DY,DX+z,ctx.canvas.height);
    ctx.fillStyle=P2.bkg;
    ctx.fillRect(z,-DY,ctx.canvas.width,ctx.canvas.height);
  } else {
    ctx.fillStyle=P2.bkg;
    ctx.fillRect(-DX,-DY,DX+z,ctx.canvas.height);
    ctx.fillStyle=P1.bkg;
    ctx.fillRect(z,-DY,ctx.canvas.width,ctx.canvas.height);
  }

  let PX=DX/COLS*TP/2;

  let cx=0;
  let mx=(2*M-1)*DX;
  let fy=P1.oly*PY;
  ctx.beginPath();
  for (let c=-TP/2-M*TP/4; c<TP/2-M*TP/4; c=c+TP/COLS) {
    if (Math.cos(c)<-0.01) continue;
    //if (Math.cos(c)<0) continue;
    let px=PX*Math.cos(c);
    cx+=px;
    let fx=P1.olx*px;
    let counter=0;
    for (let ry=-DY-PY; ry<=DY+PY; ry+=2*DY/ROWS) {
    let rot=P1.rot;
    if (P1.rotAlt && counter%2==0) rot=0;
      //let x=fx*Math.cos(P1.rot)+cx+mx;
      ctx.moveTo(fx*Math.cos(rot)+cx+mx,fy*Math.sin(rot)+ry);
      for (let t=0; t<=TP; t+=TP/P1.gon) {
	ctx.lineTo(fx*Math.cos(t+rot)+cx+mx,fy*Math.sin(t+rot)+ry);
      }
      counter++;
    }
    cx+=px;
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle=P1.color;
  ctx.fill("evenodd");

  cx=0;
  let m=M-1;
  if (m<-1) m+=2;
  mx=(2*m-1)*DX;
  fy=P2.oly*PY;
  ctx.beginPath();
  for (let c=-TP/2-m; c<TP/2-m; c=c+TP/COLS) {
    if (Math.cos(c)<-0.01) continue;
    let px=PX*Math.cos(c);
    cx+=px;
    let fx=P2.olx*px;
    let counter=0;
    for (let ry=-DY-PY; ry<=DY+PY; ry+=2*DY/ROWS) {
      let rot=P2.rot;
      if (P2.rotAlt && counter%2==0) rot=0;
      //ctx.moveTo(cx+px-DX+4*m*COLS*TP,ry);
      //let x=P2.olx*px*Math.cos(P2.rot)+cx+(2*m-1)*DX;
      //ctx.moveTo(P2.olx*px+cx-DX+2*m*DX,ry);
      ctx.moveTo(fx*Math.cos(rot)+cx+mx,fy*Math.sin(rot)+ry);
      for (let t=0; t<=TP; t+=TP/P2.gon) {
	ctx.lineTo(P2.olx*px*Math.cos(t+rot)+cx+mx,fy*Math.sin(t+rot)+ry);
      }
      counter++;
    }
    cx+=px;
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle=P2.color;
  ctx.fill("evenodd");

  ctx.beginPath();
  ctx.moveTo(z,-DY);
  ctx.lineTo(z,DY);
  ctx.closePath();
  ctx.lineWidth=3;
  ctx.stroke();
  ctx.lineWidth=1;
}

var time=0;
var stopped=true;
var frac=1;
var animate=(ts)=>{
//  frac=ts-time;
//  time=ts;
  if (stopped) return;
  M+=0.004;
  //if (M>1.06) M=-1.06;
  if (M>1) {
    M=-1;
    //P1.olx=1+0.7*Math.random();
    P1.randomize();
  } else if (Math.abs(M)<0.002) {
    P2.randomize();
  }
  
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    //ctx.fillStyle="hsl("+getRandomInt(0,360)+",90%,70%)";
    //ctx.strokeStyle=ctx.fillStyle;
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

//onresize();

var getStdRange=(min,max,step,name)=>{
  let sr=document.createElement("input");
  sr.type="range";
  sr.min=min;
  sr.max=max;
  sr.step=step;
  sr.style.display="block";
  sr.onmouseover=()=>{ sr.title=sr.value; }
  return sr;
}

//document.getElementById("cont").append(
body.append(
  (()=>{
    let d=document.createElement("div");
    d.style.gridColumn="2";
    d.append(
      (()=>{
	let c=getStdRange(1,80,1);
	c.value=COLS;
	c.oninput=()=>{
	  COLS=parseFloat(c.value);
	  draw();
	}
	return c;
      })(),
/*
      (()=>{
	let f1=getStdRange(1,13,2);
	f1.value=F1;
	f1.oninput=()=>{
	  F1=parseFloat(f1.value);
	  draw();
	}
	return f1;
      })(),
*/
      (()=>{
	let m=getStdRange(-1.1,1.1,0.01);
	m.value=M;
	m.oninput=()=>{
	  M=parseFloat(m.value);
	  draw();
	}
	return m;
      })(),

    );
    return d;
  })(),
);

onresize();
//draw(1);
start();
