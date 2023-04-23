"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const S60=Math.sin(Math.PI/3);
const CSIZE=400;
const CSO=80;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
c.style.border="6px solid #555";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

const ctxo=(()=>{
  let c=document.createElement("canvas");
  c.width=c.height=2*CSO;
  return c.getContext("2d");
})();
ctxo.translate(CSO,CSO);
//ctxo.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  if (r) ctx.arc(x,y,r,0,TP);
  else ctx.arc(x,y,3,0,TP);
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

const CBASE=159;
const CT=255-CBASE;
var color="white"; //"rgb(159,159,159)";
var color2="rgb(159,159,159)";
//ctx.setLineDash([10,20,1000]);
var dash=[CSO/2,CSO/2];

var stopped=true;
var t=getRandomInt(0,100);
//var dur=300;
function animate(ts) {
  if (stopped) return;
  t++;

/*
  let dl1=CSO/8+CSO/4*Math.pow(Math.sin(t/130),2);
  let dl2=CSO/8+CSO/4*Math.pow(Math.sin(t/70),2);
  dash=[dl1,20,dl2,20];
*/

  //let red=Math.round(CBASE+CT*Math.cos(c/10));
  let red=Math.round(CBASE+CT*Math.cos(t/10+14*Math.cos(t/200)));
  //let grn=Math.round(CBASE+CT*Math.cos(c/25));
  let grn=Math.round(CBASE+CT*Math.cos(t/25+14*Math.cos(t/210)));
  //let blu=Math.round(CBASE+CT*Math.cos(c/20));
  let blu=Math.round(CBASE+CT*Math.cos(t/20+14*Math.cos(t/220)));
  color="rgb("+red+","+grn+","+blu+")";

/*
  //red=Math.round(CBASE+CT*Math.cos(c/12));
  red=Math.round(CBASE+CT*Math.cos(t/12+14*Math.cos(t/190)));
  grn=Math.round(CBASE+CT*Math.cos(t/23));
  blu=Math.round(CBASE+CT*Math.cos(t/19));
  color2="rgb("+red+","+grn+","+blu+")";
*/

  if (lineflip) {
    if (Math.random()<0.001) lineflip=false;
  } else {
    if (Math.random()<0.0005) lineflip=true;
  }
  if (linerot) {
    if (Math.random()<0.001) linerot=false;
  } else {
    if (Math.random()<0.0005) linerot=true;
  }

//if (Math.random()<0.0005) lineflip=!lineflip;
//if (Math.random()<0.0005) linerot=!linerot;

  draw();
  requestAnimationFrame(animate);
}

onresize();

const S=120;
const d=S*Math.tan(TP/12);

var oclip=new Path2D();
oclip.moveTo(CSO,0);
oclip.lineTo(CSO-2*CSO*S60,CSO);
oclip.lineTo(CSO-2*CSO*S60,-CSO);
oclip.closePath();
ctxo.clip(oclip);

//var F1=([-1,1][getRandomInt(0,2)])*(0.8+0.4*Math.random());
//var F2=([-1,1][getRandomInt(0,2)])*(0.8+0.4*Math.random());
var F1=0.6+0.8*Math.random();
var F2=0.6+0.8*Math.random();
var F3=0.6+0.8*Math.random();
var F4=0.6+0.8*Math.random();

//const OS=-2*(CSO-S60*CSO);
const RAD=2*Math.tan(TP/12)*CSO;
const RAD2=S60*2*CSO-CSO
//const OS=(CSO-RAD)/2;
const OS=CSO-RAD;
var linerot=false;
var lineflip=false;

var setLine=()=>{
//if (!pub) ctxo.clearRect(-CSO,-CSO,2*CSO,2*CSO);
//ctxo.fillStyle="#00000005";
//ctxo.fillRect(-CSO,-CSO,2*CSO,2*CSO);
  let z=t/90;
  let p=new Path2D();
  ctxo.beginPath();
  //p.moveTo(CSO*Math.cos(z),CSO*Math.sin(z));
  //p.lineTo(CSO*Math.cos(z+Math.PI),CSO*Math.sin(z+Math.PI));
  p.moveTo(OS+RAD*Math.cos(F1*z),RAD*Math.sin(F2*z));
  p.lineTo(OS+RAD*Math.cos(F3*z+Math.PI),RAD*Math.sin(F4*z+Math.PI));
if (lineflip) p.addPath(p,new DOMMatrix([1,0,0,-1,0,0]));
//var p2=new Path2D();
//p2.addPath(p,new DOMMatrix([Math.cos(c/200),0,0,Math.cos(c/190),0,0]));
if (linerot) p.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));
  //p.addPath(p,new DOMMatrix([0.5,S60,-S60,0.5,0,0]));
  ctxo.setLineDash([]);
  ctxo.lineWidth=10;
  ctxo.strokeStyle="#0000000A";
  ctxo.stroke(p);
//ctxo.setLineDash(dash);
//ctxo.lineDashOffset=0;
  ctxo.lineWidth=2;
  ctxo.strokeStyle=color;
  ctxo.stroke(p);
/*
if (test) {
var p2=new Path2D(p);
//p2.addPath(p,new DOMMatrix([1,0,0,-1,0,0]));
//p2.addPath(p,new DOMMatrix([Math.sin(c/200),0,0,Math.sin(c/190),0,0]));
//p2.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));	// f(t)
//p2.addPath(p,new DOMMatrix([0.5,S60,-S60,0.5,0,0]));
ctxo.setLineDash([]);
ctxo.lineWidth=10;
ctxo.strokeStyle="#00000008";
ctxo.stroke(p2);
ctxo.setLineDash(dash);
ctxo.lineDashOffset=CSO;
ctxo.lineWidth=2;	// f(t)
ctxo.strokeStyle=color2;
ctxo.stroke(p2);
}
*/
//if (stopped) {
/*
if (!pub) {
  ctxo.lineWidth=1;
  ctxo.strokeStyle="red";
  ctxo.stroke(oclip);
}
*/
/*
  ctxo.strokeRect(-CSO,-CSO,2*CSO,2*CSO);
  ctxo.beginPath();
  ctxo.arc(0,0,4,0,TP);
  ctxo.fillStyle="blue";
  ctxo.fill();
let os=-2*(CSO-S60*CSO);
  ctxo.beginPath();
  ctxo.arc(os,0,4,0,TP);
  ctxo.fillStyle="yellow";
  ctxo.fill();
*/
//}

}

var test=false;
//var pub=false;

var draw=()=>{
  setLine();

/*
if (!pub) {
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);
ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
}
*/

ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 5, 1 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,5*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 1, 2 of 6
ctx.drawImage(ctxo.canvas,(8*S60-2)*CSO,-1*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 1, 3 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 1, 4 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 1, 5 of 6
ctx.drawImage(ctxo.canvas,(8*S60-2)*CSO,-1*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 1, 6 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,5*CSO);

ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 2, 1 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,5*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 2, 2 of 6
ctx.drawImage(ctxo.canvas,-(4*S60+2)*CSO,-CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 2, 3 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,2*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 2, 4 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,2*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 2, 5 of 6
ctx.drawImage(ctxo.canvas,-(4*S60+2)*CSO,-CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 2, 6 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,5*CSO);

ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 3, 1 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 3, 2 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,-4*CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 3, 3 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 3, 4 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 3, 5 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,-4*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 3, 6 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);

ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 4, 1 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 4, 2 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 4, 3 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-1*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 4, 4 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-1*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 4, 5 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 4, 6 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);

ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 5, 1 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,-4*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 5, 2 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 5, 3 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 5, 4 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 5, 5 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 5, 6 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,-4*CSO);

ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 6, 1 of 6
ctx.drawImage(ctxo.canvas,-(4*S60+2)*CSO,-CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 6. 1 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 6, 1 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 6. 2 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 6, 4 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 6. 1 of 6
ctx.drawImage(ctxo.canvas,-(4*S60+2)*CSO,-CSO);

ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 7, 1 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,2*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 7, 2 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 7, 3 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 7, 4 of 6
ctx.drawImage(ctxo.canvas,-2*CSO,-CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 7, 5 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 7, 6 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,2*CSO);

ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 8, 1 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 8, 1 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 8, 2 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 8, 3 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 8, 4 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,-4*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 8, 6 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);

ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 9, 1 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 9, 2 of 6
ctx.drawImage(ctxo.canvas,-(2*S60+2)*CSO,2*CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 9, 3 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 9, 4 of 6
ctx.drawImage(ctxo.canvas,(2*S60-2)*CSO,2*CSO);
ctx.setTransform(-1,0,0,1,CSIZE,CSIZE);			// row 9, 5 of 6
ctx.drawImage(ctxo.canvas,(-2*S60-2)*CSO,2*CSO);
ctx.setTransform(1,0,0,1,CSIZE,CSIZE);			// row 9, 6 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,2*CSO);

ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 10, 3 of 6
ctx.drawImage(ctxo.canvas,(0*S60-2)*CSO,-7*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 10, 2 of 6
ctx.drawImage(ctxo.canvas,(-4*S60-2)*CSO,-1*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 10, 3 of 6
ctx.drawImage(ctxo.canvas,(-2*S60-2)*CSO,-4*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 10, 4 of 6
ctx.drawImage(ctxo.canvas,(-2*S60-2)*CSO,-4*CSO);
ctx.setTransform(-0.5,-S60,S60,-0.5,CSIZE,CSIZE);	// row 10, 5 of 6
ctx.drawImage(ctxo.canvas,(-4*S60-2)*CSO,-1*CSO);
ctx.setTransform(0.5,-S60,-S60,-0.5,CSIZE,CSIZE);	// row 10, 2 of 6
ctx.drawImage(ctxo.canvas,(0*S60-2)*CSO,-7*CSO);

ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 11, 1 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-7*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 11, 2 of 6
ctx.drawImage(ctxo.canvas,(8*S60-2)*CSO,-1*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 11, 3 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 11, 4 of 6
ctx.drawImage(ctxo.canvas,(6*S60-2)*CSO,-4*CSO);
ctx.setTransform(0.5,S60,S60,-0.5,CSIZE,CSIZE);		// row 11, 5 of 6
ctx.drawImage(ctxo.canvas,(8*S60-2)*CSO,-1*CSO);
ctx.setTransform(-0.5,S60,-S60,-0.5,CSIZE,CSIZE);	// row 11, 6 of 6
ctx.drawImage(ctxo.canvas,(4*S60-2)*CSO,-7*CSO);

//ctx.strokeStyle="white";
//ctx.strokeRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//drawPoint(0,0);

}

start();
