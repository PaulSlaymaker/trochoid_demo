"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
//const H=1.118;
//const H=1.154;	// 1/0.866
const H=1/Math.sin(TP/6);

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
ctx.lineCap="round";
ctx.lineWidth=6;
//ctx.globalAlpha=0.5;

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=80+80*Math.random();
    this.GK1=80+80*Math.random();
    this.BK1=80+80*Math.random();
  }
  this.randomize();
}

var colors=[new Color(),new Color(),new Color()];

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,10,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
  let hpath=new Path2D(spath);
  hpath.addPath(spath,dm1);
  hpath.addPath(spath,dm2);
  hpath.addPath(hpath,dmxy);
//  hpath.addPath(hpath,dmx);
//  hpath.addPath(hpath,dmy);
  return hpath;
}

const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
//const dmt=new DOMMatrix([0.5,0.-0.866,-0.866,-0.50,0,0]);
const dmt=new DOMMatrix([-0.5,0.866,0.866,0.5,0,0]);
const dmt2=new DOMMatrix([-0.5,-0.866,-0.866,0.5,0,0]);
const dm2=new DOMMatrix([0.5,0.866,-0.866,0.5,0,0]);
const dma=[dmy,dmt,dmt2,dmy];

const KT=400;

var Hex=function(lid,r,rc,aidx,angle) { 
  this.lid=lid;
  this.aidx=aidx;
  this.r=r;
  this.angle=angle;
  this.rc=rc;
  this.a=aidx*TP/6;
  
  this.getPath2=()=>{
//    this.r+=this.r/KT;
//    this.rc+=this.rc/KT;
    let x=this.rc*Math.cos(this.angle);
    let y=this.rc*Math.sin(this.angle);
    let path=new Path2D();
    path.moveTo(x+this.r,y);
    path.lineTo(x+H*this.r*Math.cos(TP/12),y+H*this.r*Math.sin(TP/12));
    path.addPath(path,dmy);
    path=getHexPath(path);
    return path;
  }
  this.getXY=()=>{	// diag
    //let z=aidx*TP/6;
    let x=this.rc*Math.cos(this.angle);
    let y=this.rc*Math.sin(this.angle);
    return [x,y];
  }
  this.getPath3=()=>{
    let p=new Path2D();
//    this.r+=this.r/KT;	// move to animate;
//    this.rc+=this.rc/KT;
    let x=0; //this.rc;//*Math.cos(this.angle);
    let y=0; //this.rc*Math.sin(this.angle);
    let x2=this.rc*Math.cos(this.angle);
    let y2=this.rc*Math.sin(this.angle);
    p.moveTo(x+this.r,0);
    p.lineTo(x+H*this.r*Math.cos(TP/12),H*this.r*Math.sin(TP/12));
    p.lineTo(x+H*this.r*Math.cos(3*TP/12),H*this.r*Math.sin(3*TP/12));
    p.lineTo(x+H*this.r*Math.cos(5*TP/12),H*this.r*Math.sin(5*TP/12));
    p.lineTo(x+this.r*Math.cos(3*TP/6),this.r*Math.sin(3*TP/6));
    p.addPath(p,dmy);
    let p2=new Path2D();
    //p2.addPath(p,new DOMMatrix([1,0,0,1,x2,y2]));
p2.addPath(p,new DOMMatrix([Math.cos(this.a),Math.sin(this.a),-Math.sin(this.a),Math.cos(this.a),x2,y2]));
    return p2;
  }
  this.getPath=()=>{
    const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
    let path=new Path2D();
    this.r+=this.r/KT;
    this.rc+=this.rc/KT;
    //let z=aidx*TP/6;
    //let x=this.rc*Math.cos(z);
    //let y=this.rc*Math.sin(z);
    let x=this.rc*Math.cos(this.angle);
    let y=this.rc*Math.sin(this.angle);

    path.moveTo(x+this.r*Math.cos(this.a),y+this.r*Math.sin(this.a));
    path.lineTo(x+H*this.r*Math.cos(this.a+TP/12),y+H*this.r*Math.sin(this.a+TP/12));
    path.lineTo(x+H*this.r*Math.cos(this.a+3*TP/12),y+H*this.r*Math.sin(this.a+3*TP/12));
    path.lineTo(x+H*this.r*Math.cos(this.a+5*TP/12),y+H*this.r*Math.sin(this.a+5*TP/12));
    path.lineTo(x+this.r*Math.cos(this.a+3*TP/6),y+this.r*Math.sin(this.a+3*TP/6));
//if (aidx>dma.length-1) debugger;
    path.addPath(path,dma[aidx]);

/*
    path.moveTo(this.r*Math.cos(TP/6),this.r*Math.sin(TP/6));
    path.lineTo(0            ,4*this.r/3*Math.sin(4*TP/12));
    path.lineTo(-this.r      ,4*this.r/3*Math.sin(5*TP/12));
    //path.lineTo(-this.r      ,-2*this.r/3*Math.sin(TP/6));
    path.lineTo(-this.r      ,2*this.r/3*Math.sin(8*TP/12));
    path.lineTo(this.r*Math.cos(4*TP/6),this.r*Math.sin(4*TP/6));
    path.moveTo(this.r*Math.cos(2*TP/6),this.r*Math.sin(2*TP/6));
    path.lineTo(-this.r      ,4*this.r/3*Math.sin(5*TP/12));
    path.lineTo(-this.r,-2*this.r/3*Math.sin(TP/6));
    path.lineTo(0,-4*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r*Math.cos(5*TP/6),this.r*Math.sin(5*TP/6));
    path.moveTo(this.r*Math.cos(TP/2),this.r*Math.sin(TP/2));
    path.lineTo(-this.r,-2*this.r/3*Math.sin(TP/6));
    path.lineTo(0,-4*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r,-2*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r*Math.cos(0),this.r*Math.sin(0));
    path.moveTo(this.r*Math.cos(2*TP/3),this.r*Math.sin(2*TP/3));
    path.lineTo(0,-4*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r,-2*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r,2*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r*Math.cos(TP/6),this.r*Math.sin(TP/6));
    path.moveTo(this.r*Math.cos(5*TP/6),this.r*Math.sin(5*TP/6));
    path.lineTo(this.r,-2*this.r/3*Math.sin(TP/3));
    path.lineTo(this.r,2*this.r/3*Math.sin(TP/3));
    path.lineTo(0,4*this.r/3*Math.sin(TP/3),0);
    path.lineTo(this.r*Math.cos(2*TP/6),this.r*Math.sin(2*TP/6));
*/
    return path;
  }
  this.generate7=()=>{
//if (this.lid>2) return;
//if (ha.length>3) return;

    //if (this.r<40) return;
if (this.r<3) return;
    let x=this.rc*Math.cos(this.angle);
    let y=this.rc*Math.sin(this.angle);
    for (let i=0; i<6; i++) { 
//drawPoint(x,y,"blue");
      let x2=x+2*this.r/3*Math.cos(i*TP/6);
      let y2=y+2*this.r/3*Math.sin(i*TP/6);
//drawPoint(x2,y2);
      let a2=Math.atan2(y2,x2);
//console.log(a2.toFixed(2));
      let rc2=Math.pow(x2*x2+y2*y2,0.5);
      let nh=new Hex(this.lid+1,this.r/3,rc2,i,a2);	// try 2*r/3
      //let nh=new Hex(this.lid+1,this.r/3,rc2,i,i*TP/6);
      //let nh=new Hex(this.lid+1,this.r/3,this.rc+this.r-this.r/3,i,i*TP/6);
      //let nh=new Hex(this.lid+1,this.r/3,this.rc+this.r-this.r/3,i,a2);
      ha.push(nh);
//      nh.generate7();
nh.type=1;
    }
    let a2=Math.atan2(y,x);
    let rc2=Math.pow(x*x+y*y,0.5);
//if (rc2<this.r/3+1.5*CSIZE) {
    //let nh=new Hex(this.lid+1,this.r/3,rc2,0,this.aidx*TP/6);
    let nh=new Hex(this.lid+1,this.r/3,rc2,0,a2);
//drawPoint(x,y,"blue");
    ha.push(nh);
//    nh.generate7();
     nh.type=0;
    if (!hexMap.get(this.lid+1)) hexMap.set(this.lid+1,{"r":this.r/3,"ld":0,"lw":0.1});
     hexMap.maxKey=this.lid+1;
//}
//console.log(this.lid+1,{"r":this.r/3,"ld":0});
//console.log("new level "+(this.lid+1));
this.generate7=()=>{ }
  }
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
var animate=(ts)=>{
  if (stopped) return;
  t++;
  ha.forEach((h)=>{
    h.r+=h.r/KT;
    h.rc+=h.rc/KT;
  });
  hexMap.forEach((hm,key)=>{ 
    hm.r+=hm.r/KT; 
    hm.ld+=hm.r/(KT/6); 
    hm.lw+=0.02;
    if (hm.r>2000) hexMap.delete(key);
  });

let ghex=hexMap.get(hexMap.maxKey);
if (!ghex.gen && ghex.r>36) {
  ha.forEach((h)=>{ 
//     if (h.lid==hexMap.maxKey-1) 
    h.generate7(); 
  });
  ghex.gen=true;
//console.log("new level "+hexMap.maxKey);
}

if (t%24==0) {
  let lenb=ha.length;

  ha=ha.filter((h)=>{ 
    if (h.rc) {
      if (h.rc-1.5*h.r>1.4*CSIZE) return false;
      //if (h.rc>2*H*CSIZE) return false;
      if (h.rc>3*CSIZE) return false;
    }
    return true;
  });
  var deleted=false;
  var dellid;
  ha.forEach((h)=>{	// to filter
    if (h.rc==0 && h.r>CSIZE) {
//dellid=h.lid;
      ha.splice(ha.indexOf(h),1);
      deleted=true;
    }
  });
//  console.log(lenb,ha.length);
}
  //if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

let r=CSIZE*0.866;
/*
var rm=new Map();
var setRadii=()=>{
  r+=r/100;
  for (let i=0; i<4; i++) {
    //r+=Math.pow(t/100,2);
    rm.set(i,r/Math.pow(3,i));
  }
}
setRadii();
*/

//ctx.font="bold 11px sans-serif";
ctx.font="10px sans-serif";
ctx.textAlign="center";
var drawText=()=>{	// diag
  ctx.fillStyle="white";
  for (let i=0; i<ha.length; i++) {
    if (ha[i].rc) {
      let xy=ha[i].getXY(); 
/*
      let os=(ha[i].lid==1)?-50:0;
      ctx.fillText(i,xy[0],xy[1]+os);
*/
      if (ha[i].type) ctx.fillText(i,xy[0],xy[1]);
    }
  }
}

//var hex=new Hex(0,r-16,0,0,getRandomInt(0,6));
var hex=new Hex(0,H*CSIZE,0,0,0);
hex.type=0;
var ha=[hex];
var hexMap=new Map();
hexMap.set(0,{"r":r,"ld":1000,"lw":6});

ctx.fillStyle="#00000010";

var draw=()=>{
  let pa=[new Path2D(),new Path2D()];
  let pm=new Map();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.lineDashOffset=-t;
  for (let i=0; i<ha.length; i++) {
    let lpath=pm.get(ha[i].lid);
    if (!lpath) lpath=pm.set(ha[i].lid,new Path2D()).get(ha[i].lid);

//    ctx.strokeStyle=colors[ha[i].lid%colors.length].getRGB();

    //if (ha[i].type==0) {
    if (ha[i].type==0) {
      //pa[ha[i].lid%2].addPath(ha[i].getPath2());
//lpath.addPath(ha[i].getPath2());
      //ctx.setLineDash([]);
//      ctx.stroke(ha[i].getPath2());
    } else {
      //pa[ha[i].lid%2].addPath(ha[i].getPath3());
lpath.addPath(ha[i].getPath3());
    //ctx.setLineDash([2.333*ha[i].r]);
    //ctx.setLineDash([10,2000]);
//      ctx.stroke(ha[i].getPath3());
    }
  }
/*
  for (let i=0; i<pa.length; i++) {
    ctx.strokeStyle=colors[i].getRGB();
    ctx.stroke(pa[i]);
  }
*/
  pm.forEach((p,key)=>{
    let level=hexMap.get(key);
if (!level) debugger;
    let ld=level.ld;
    if (ld>999) ctx.setLineDash([]);
    else ctx.setLineDash([ld,2000]);
ctx.lineWidth=level.lw;
    ctx.strokeStyle=colors[key%colors.length].getRGB();
    ctx.stroke(p);
  });
}

onresize();

hex.generate7();
hex.gen=true;
ha.forEach((h)=>{ if (h.lid==1) h.generate7(); });
hexMap.get(1).ld=1000;
hexMap.get(1).gen=true;

ha.forEach((h)=>{ if (h.lid==2) h.generate7(); });
hexMap.get(2).ld=1000;
hexMap.get(2).gen=true;

hexMap.get(3).ld=1000;

hexMap.maxKey=hexMap.size-1;
//hexMap.get(3).ld=1000;
console.log(hexMap);

console.log(ha.length);

draw();

/*
let r2=r+20;
let path=new Path2D();
path.moveTo(r2,0);
path.lineTo(r2,2*r2/3*Math.sin(TP/6),0);
path.moveTo(r2,0);
path.lineTo(r2,-2*r2/3*Math.sin(TP/6),0);
ctx.strokeStyle="white";
ctx.stroke(getHexPath(path));
*/

//drawText();
