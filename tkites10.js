"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S8=Math.sin(Math.PI/4);
const CSIZE=400;
const CSO=86;
//const CSO=64;

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
ctx.translate(CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d", {"willReadFrequently": true});
  //return c.getContext("2d");
})();
ctxo.setTransform(1,0,0,1,CSO,CSO);
ctxo.lineCap="round";

/*
ctxo.lineWidth=2;
ctxo.strokeStyle="red";
ctxo.strokeRect(-CSO,-CSO,2*CSO,2*CSO);
*/

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*(this.fr*Math.cos(this.RK2+t/this.RK1)+(1-this.fr)*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(this.fg*Math.cos(this.GK2+t/this.GK1)+(1-this.fg)*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(this.fb*Math.cos(this.BK2+t/this.BK1)+(1-this.fb)*Math.cos(t/this.BK3)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomizeF=()=>{
    this.RK3=1+5*Math.random();
    this.GK3=1+5*Math.random();
    this.BK3=1+5*Math.random();
    this.fr=1-Math.pow(0.9*Math.random(),3);
    this.fg=1-Math.pow(0.9*Math.random(),3);
    this.fb=1-Math.pow(0.9*Math.random(),3);
  }
  this.randomize=()=>{
    this.RK1=40+40*Math.random();
    this.GK1=40+40*Math.random();
    this.BK1=40+40*Math.random();
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
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0; //getRandomInt(0,300);
var animate=(ts)=>{
  if (stopped) return;
  t++;
//if (EM && t%300==0) stopped=true;
  draw();
  if (t==KTD) {
    color.randomize();
    D=4*Math.random();
    D2=2*Math.random();
    circ.randomize();
    t=0;
//stopped=true;
  }
  requestAnimationFrame(animate);
}

var Circle=function() { 
  this.randomize=()=>{
    let z=TP*Math.random();
    let r=0.8*CSO*Math.random();
    this.x=r*Math.cos(z);
    this.y=r*Math.sin(z);
    this.ka=TP*Math.random();
    this.ka2=0.003*Math.pow([-1,1][getRandomInt(0,2)]*Math.random(),5);
    this.et=(160+320*Math.random())*[-1,1][getRandomInt(0,2)];
    this.erk=1+3*Math.random();	
  }
  this.randomize();
  this.getPath=(r)=>{
    let p=new Path2D();
    let ko=this.ka+TP*Math.sin(this.ka2*t);
    //p.moveTo(this.x+r*Math.cos(this.ka+t/this.et),this.y+r*Math.sin(this.ka+t/this.et));
    //p.ellipse(this.x,this.y,r,r/this.erk,this.ka+t/this.et,0,TP);
    p.moveTo(this.x+r*Math.cos(ko+t/this.et),this.y+r*Math.sin(ko+t/this.et));
    p.ellipse(this.x,this.y,r,r/this.erk,ko+t/this.et,0,TP);
    return p;
  }
}

const circ=new Circle();
const KT=3200; 
const KTD=KT/4; 
var D=2+2*Math.random();
var D2=1+Math.random();

var setTile=()=>{
  //let r=circ.erk*2*CSO*(Math.sin(TP*t/KT));
  let r=circ.erk*1.5*CSO*(Math.sin(TP*t/KT));
  let p=circ.getPath(r);
  ctxo.setLineDash([D*r,D2*r]);
  ctxo.lineWidth=Math.min(r,6);
  ctxo.strokeStyle="#00000014";
  ctxo.stroke(p);
  ctxo.lineWidth=Math.min(r,1);
  ctxo.strokeStyle=color.getRGB();
  ctxo.stroke(p);
}

/*
ctx.beginPath();
ctx.moveTo(-CSIZE,0);
ctx.lineTo(CSIZE,0);
ctx.moveTo(0,-CSIZE);
ctx.lineTo(0,CSIZE);
ctx.strokeStyle="gray";
ctx.stroke();
*/

const SC=Math.cos(TP/16);	// 0.924
const SS=Math.sin(TP/16);

var sma= new DOMMatrix([ S8,1-S8,1-S8, S8,0,0]);
var smb= new DOMMatrix([-S8,1-S8,S8-1, S8,0,0]);
const smc= new DOMMatrix([ S8,1-S8,S8-1,-S8,0,0]);
const smd= new DOMMatrix([-S8,1-S8,1-S8,-S8,0,0]);

/*
var sme= new DOMMatrix([ S8,S8-1,S8-1, S8,0,0]);
var smf= new DOMMatrix([-S8,S8-1,1-S8, S8,0,0]);
var smg= new DOMMatrix([ S8,S8-1,1-S8,-S8,0,0]);
var smh= new DOMMatrix([-S8,S8-1,S8-1,-S8,0,0]);
*/

// not geometrically correct, just convenient estimates
const os1=(4-2*SC)*CSO;	// 2.15=4-2*SC
const os2=(4-SC)*CSO;	// 3.076=4-SC
const os3=(8-3*SC)*CSO;	// 5.23=8-3*SC
const os4=(8-4*SC)*CSO;	// 4.304=8-4*C

const xosa=[
[0,-os3,os2,os1,os1,os4,os3,-os3,-os2],		// -6
[0,-os2,-os1,os3,os2,-os1,-os4,-os3,os3],	// 6
[0,0,-os1,os1,-os1,0,os1,-os4,-os1],		// 0
[0,0,-os1,os1,-os1,0,os1,-os4,-os1],		// 0
[0,-os2,-os1,os3,os2,-os1,-os4,-os3,os3],	// 6
[0,-os3,os2,os1,os1,os4,os3,-os3,-os2],		// -6
[0,0,os1,-os1,0,os4,-os1,os1,os1],		// 0 end
[0,0,os1,-os1,0,os4,-os1,os1,os1]		// 6.13 end
];
const yosa=[
[0,-os1,0,os1,os1,os4,os1,-os1,0],		// 0
[0,0,os1,-os1,0,os1,os4,os1,-os1],		// 0
[0,os2,os1,-os3,os1,-os2,-os3,os4,os3],		// -6
[0,-os2,-os1,os3,-os1,os2,os3,-os4,-os3],	// 6
[0,0,-os1,os1,0,-os1,-os4,-os1,os1],		// 0
[0,os1,0,-os1,-os1,-os4,-os1,os1,0],		// 0
[0,-os2,-os1,os3,os2,-os4,os3,-os1,-os3],	// 6.13
[0,os2,os1,-os3,-os2,os4,-os3,os1,os3]		// 0 end
];

/*
var draw=()=>{
  setTile();
  let S6=0.7; //Math.sin(TP/3);
  let dm= new DOMMatrix([S6,1-S6,1-S6,S6,0,0]);
  ctx.setTransform(dm.a,dm.b,dm.c,dm.d,CSIZE,CSIZE);
  ctx.drawImage(ctxo.canvas,0,0);
}
*/

const rma=new Array(8); 	// rotation matrix array
for (let i=0; i<8; i++) {
  let a=(2*i-1)*TP/16;
  let cos=Math.cos(a);
  let sin=Math.sin(a);
  rma[i]=new DOMMatrix([cos,sin,-sin,cos,0,0]);
}

const ta=new Array(8);		// transformation array, 8x10
for (let i=0; i<8; i++) {
  ta[i]=new Array(10);
  let xos=xosa[i];
  let yos=yosa[i];
  let dm1=(i%2)?rma[i].multiply(smb):rma[i].multiply(sma);
  let dm2=(i%2)?rma[i].multiply(smd):rma[i].multiply(smc);
  for (let j=0; j<9; j++) {
    let dm=(j<4)?dm1:dm2;
    ta[i][j]=[dm.a,dm.b,dm.c,dm.d,CSIZE+xos[j],CSIZE+yos[j]];
  }
}

var draw=()=>{
  setTile();
  for (let i=0; i<8; i++) {
    for (let j=0; j<9; j++) {
      ctx.setTransform(ta[i][j][0],ta[i][j][1],ta[i][j][2],ta[i][j][3],ta[i][j][4],ta[i][j][5]);
      ctx.drawImage(ctxo.canvas,0,0);
    }
  }
}

onresize();

start();

