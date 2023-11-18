"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/qBgPvYq
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=360;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.globalAlpha=0.7;
//ctx.lineCap="round";

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
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
/*
    let red=Math.round(CBASE+CT*(0.8*Math.cos(this.RK2+t/this.RK1)+0.2*Math.cos(t/this.RK3)));
    let grn=Math.round(CBASE+CT*(0.8*Math.cos(this.GK2+t/this.GK1)+0.2*Math.cos(t/this.GK3)));
    let blu=Math.round(CBASE+CT*(0.8*Math.cos(this.BK2+t/this.BK1)+0.2*Math.cos(t/this.BK3)));
*/
    return "rgb("+red+","+grn+","+blu+")";
    //let alpha=(1+Math.sin(t/this.KA))/2;
    //return "rgba("+red+","+grn+","+blu+","+alpha+")";
  }
  this.randomize=()=>{
    this.RK1=180+180*Math.random();
    this.GK1=180+180*Math.random();
    this.BK1=180+180*Math.random();
/*
    this.RK3=4+4*Math.random();
    this.GK3=4+4*Math.random();
    this.BK3=4+4*Math.random();
*/
//this.KA=1.1+1*Math.random();
  }
  this.randomize();
}

const colors=[new Color(),new Color()];//,new Color()];
//const col2=new Color();

const radius=60;


var hpm=new Map();
var xSet=new Set();
var ySet=new Set();

var Circle=function(x,y) {
  this.x=x;
  this.y=y;
  this.hpts=new Array(6);
  let RF=radius/Math.cos(TP/12);
  for (let i=0; i<6; i++) {
    let z=i*TP/6+TP/12;
    let xz=x+RF*Math.cos(z);
    let yz=y+RF*Math.sin(z);
    let xze=Math.round(xz);
    let yze=Math.round(yz);
    xSet.add(xze);
    ySet.add(yze);
    let hk=[xze,yze].toString();
    if (!hpm.has(hk)) {
      //let hp={"x":xz,"y":yz,"x2":xz,"y2":yz};
      let hp={"x":xz,"y":yz};
      hpm.set(hk,hp);
      this.hpts[i]=hp;
    } else {
      this.hpts[i]=hpm.get(hk);
    }
  }
/*
  this.getHexPath2=()=>{
    let p=new Path2D();
    for (let i=0; i<6; i++) {
      let i1=(i+1)%6;
      p.moveTo((this.hpts[i].x+this.hpts[i1].x)/2,(this.hpts[i].y+this.hpts[i1].y)/2);
      p.lineTo(this.hpts[i].x,this.hpts[i].y);
      p.moveTo((this.hpts[i].x+this.hpts[i1].x)/2,(this.hpts[i].y+this.hpts[i1].y)/2);
      p.lineTo(this.hpts[i1].x,this.hpts[i1].y);
    }
    p.closePath();
//    p.moveTo(this.hpts[0].x+4,this.hpts[0].y);
//    p.arc(this.hpts[0].x,this.hpts[0].y,4,0,TP);
    return p;
  }
*/
  this.getHexPath=()=>{
    let p=new Path2D();
    p.moveTo(this.hpts[0].x,this.hpts[0].y);
    for (let i=1; i<6; i++) p.lineTo(this.hpts[i].x,this.hpts[i].y);
    p.closePath();
//    p.moveTo(this.hpts[0].x+4,this.hpts[0].y);
//    p.arc(this.hpts[0].x,this.hpts[0].y,4,0,TP);
    return p;
  }

}

var cm=new Map();

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  const sin=[0,0.866,0.866,0,-0.866,-0.866];
  const cos=[1,0.5,-0.5,-1,-0.5,0.5];
  let aCount=Math.trunc(CSIZE/2/radius);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0);
  cm.set("0,0",c);
  cm.forEach((c)=>{
    if (cm.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xt=radius*cos[a];
      let yt=radius*sin[a];
      let xc=c.x+2*xt;
      let yc=c.y+2*yt;
      let ckey=[Math.round(xc),Math.round(yc)];
      if (!cm.has(ckey.toString())) {
	cm.set(ckey.toString(),new Circle(xc,yc));
      }
    }
  });
  cm.forEach((c,key)=>{ if (c.x<0 || c.y<0)  cm.delete(key); });
}
generateHexes();

/*
var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,6,0,TP);
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
var drawCircles=()=>{ // diag
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.x+radius,c.y);
    p.arc(c.x,c.y,radius,0,TP);
  });
  ctx.lineWidth=1;
  ctx.strokeStyle="yellow";
  ctx.stroke(p);
}
var drawHexes=()=>{  // diag
  let p=new Path2D();
  cm.forEach((c)=>{
    p.moveTo(c.hpts[0].x,c.hpts[0].y);
    for (let i=1; i<6; i++) {
      p.lineTo(c.hpts[i].x,c.hpts[i].y);
    }
    p.closePath();
  });
  ctx.lineWidth=3;
  ctx.strokeStyle="black";
  ctx.stroke(p);
}
*/

const DMX=new DOMMatrix([-1,0,0,1,0,0]);
const DMY=new DOMMatrix([1,0,0,-1,0,0]);

var draw=()=>{
  setPoints();
  let counter=0;
  cm.forEach((c)=>{
//    if (c.x>=0 && c.y>=0) {
//      let p=c.getHexPath();
      let p=new Path2D(c.getHexPath());
      if (c.x==0 && c.y==0) {
      } else if (c.x==0) {
        p.addPath(p,DMY);
      } else if (c.y==0) {
        p.addPath(p,DMX);
      } else {
        p.addPath(p,DMY);
        p.addPath(p,DMX);
//        dpath.addPath(p,dmxy);
      }

//ctx.setLineDash([]);
//ctx.globalAlpha=1;
      ctx.lineWidth=6;
      ctx.strokeStyle="#00000010";
      ctx.stroke(p);

/*
if (counter%2) ctx.globalAlpha=(1+Math.sin(t/4))/2;
else ctx.globalAlpha=(1+Math.sin(t/5))/2;
*/

      ctx.lineWidth=4;
      ctx.strokeStyle=colors[counter++%colors.length].getRGB();
      ctx.stroke(p);

/*
//      ctx.lineWidth=5;
ctx.setLineDash([6-6*Math.cos(t/4),10000]);
//ctx.strokeStyle=col2.getRGB(); //"white"; //colors[counter++%colors.length].getRGB();
      ctx.strokeStyle=colors[counter%colors.length].getRGB();
      ctx.stroke(dpath);
*/

//    }
  });
/*
let path=new Path2D();
hpm.forEach((h)=>{
  //path.rect(h.x-2,h.y-2,4,4);
  path.moveTo(h.x+2,h.y);
  path.arc(h.x,h.y,2,0,TP);
});
ctx.fillStyle="#00000055";
ctx.fill(path);
*/
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var t=0;
var animate=()=>{
  if (stopped) return;
  t++;
  draw();
////
  if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

let xpa=Array.from(xSet).sort((a,b)=>{ return a-b; });
let ypa=Array.from(ySet).sort((a,b)=>{ return a-b; });

var Kxa=new Array((xSet.size-1)/2);
var Kxb=new Array((xSet.size-1)/2);
for (let i=0; i<Kxa.length; i++) {
  Kxa[i]=320+320*Math.random();
  Kxb[i]=TP*Math.random();
}

var Kya=new Array(ySet.size/2);
var Kyb=new Array(ySet.size/2);
for (let i=0; i<Kya.length; i++) {
  Kya[i]=320+320*Math.random();
  Kyb[i]=TP*Math.random();
}

var setPoints=()=>{
  let xpr=[0];
  for (let i=0; i<(xSet.size-1)/2; i++) {
    let rand=CSIZE/2*(1+Math.sin(Kxb[i]+t/Kxa[i]));
    //let rand=CSIZE/4*(2+Math.sin(Kxb[i]+t/Kxa[i])+Math.sin(3*t/Kxa[i]));
    xpr.push(rand);
    xpr.push(-rand);
  }
  xpr.sort((a,b)=>{ return a-b; });
  let ypr=[];
  for (let i=0; i<ySet.size/2; i++) {
    let rand=CSIZE/2*(1+Math.sin(Kyb[i]+t/Kya[i]));
    ypr.push(rand);
    ypr.push(-rand);
  }
  ypr.sort((a,b)=>{ return a-b; });
  for (let i=0; i<xpa.length; i++) {
    for (let j=0; j<ypa.length; j++) {
      let hex=hpm.get([xpa[i],ypa[j]].toString());
      if (hex) {
	hex.x=xpr[i];
	hex.y=ypr[j];
      }
    }
  }
/* cm.forEach((c)=>{ // generate mean x,y } */
/* cm.forEach((c)=>{ // generate cm.r min } */
}

onresize();

start();
