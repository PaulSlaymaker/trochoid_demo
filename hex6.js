"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const CSIZE=400;
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

/*
const getHexPath=(spath)=>{
  const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
  const dm2=new DOMMatrix([-0.5,0.866,-0.866,-0.50,0,0]);
//  const dmy=new DOMMatrix([1,0,0,-1,0,0]);
  const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
  let hpath=new Path2D(spath);
  hpath.addPath(spath,dm1);
  hpath.addPath(spath,dm2);
  hpath.addPath(hpath,dmxy);
  return hpath;
}
*/

const dmy=new DOMMatrix([1,0,0,-1,0,0]);
//const dm1=new DOMMatrix([0.5,0.866,-0.866,0.50,0,0]);
//const dmt=new DOMMatrix([-0.5,0.866,0.866,0.5,0,0]);

const KT=400;

var Hex=function(lid,r,rc,aidx,angle) { 
  this.lid=lid;
  this.aidx=aidx;
  this.r=r;
  this.angle=angle;
  this.cos=Math.cos(angle);
  this.sin=Math.sin(angle);
  this.rc=rc;
  let a=this.aidx*TP/6;
  this.rot=[Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a)];
 /* 
  this.getPath2=()=>{	diag
    let x=this.rc*this.cos;
    let y=this.rc*this.sin;
    let path=new Path2D();
    path.moveTo(x+this.r,y);
    path.lineTo(x+H*this.r*Math.cos(TP/12),y+H*this.r*Math.sin(TP/12));
    path.addPath(path,dmy);
    path=getHexPath(path);
    return path;
  }
  this.getXY=()=>{	// diag
    let x=this.rc*Math.cos(this.angle);
    let y=this.rc*Math.sin(this.angle);
    return [x,y];
  }
*/
  this.getPath3=()=>{
    let p=new Path2D();
    let x=this.rc*this.cos;
    let y2=this.rc*this.sin;
    p.moveTo(this.r,0);
    p.lineTo(H*this.r*Math.cos(TP/12),H*this.r*Math.sin(TP/12));
    p.lineTo(H*this.r*Math.cos(3*TP/12),H*this.r*Math.sin(3*TP/12));
    p.lineTo(H*this.r*Math.cos(5*TP/12),H*this.r*Math.sin(5*TP/12));
    p.lineTo(this.r*Math.cos(3*TP/6),this.r*Math.sin(3*TP/6));
    p.addPath(p,dmy);
    let p2=new Path2D();
    //p2.addPath(p,new DOMMatrix([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),x,y2]));
    p2.addPath(p,new DOMMatrix(this.rot.concat([x,y2])));
    return p2;
  }
  this.generate7=()=>{
//if (this.lid>2) return;
//if (ha.length>3) return;
//if (this.r<40) return;
    let x=this.rc*this.cos;
    let y=this.rc*this.sin;
    for (let i=0; i<6; i++) { 
      let x2=x+2*this.r/3*Math.cos(i*TP/6);
      let y2=y+2*this.r/3*Math.sin(i*TP/6);
      let rc2=Math.pow(x2*x2+y2*y2,0.5);
      let a2=Math.atan2(y2,x2);
if (rc2-this.r/3>CSIZE) continue;
      let nh=new Hex(this.lid+1,this.r/3,rc2,i,a2);	// try 2*r/3
      //let nh=new Hex(this.lid+1,this.r/3,this.rc+this.r-this.r/3,i,a2);
      ha.push(nh);
      nh.type=1;
    }
    let a2=Math.atan2(y,x);
    let rc2=Math.pow(x*x+y*y,0.5);
if (rc2<CSIZE+this.r) {
    let nh=new Hex(this.lid+1,this.r/3,rc2,0,a2);
    ha.push(nh);
    nh.type=0;
}
    if (!hexMap.has(this.lid+1)) hexMap.set(this.lid+1,{"r":this.r/3,"ld":0,"lw":0.2});
    hexMap.maxKey=this.lid+1;
    hexMap.get(this.lid).gen=true;
    this.generate7=()=>{ }
//if (generated<7) console.log(generated);
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
//    hm.lw+=0.025;
//hm.lw+=0.04;	// for 58 grow r
    hm.lw+=0.06;
    if (hm.r>2000) hexMap.delete(key);
  });

  let growHex=hexMap.get(hexMap.maxKey);
  if (!growHex.gen && growHex.r>58) { ha.forEach((h)=>{ h.generate7(); }); }

if (t%24==0) {
  ha=ha.filter((h)=>{ 
    if (h.rc) {
      //if (h.rc-1.5*h.r>1.4*CSIZE) return false;
    if (h.rc-h.r>1.4*CSIZE) return false;
//      if (h.rc>3*CSIZE) return false;	// failsafe
    } else {
      // not drawn, removed before off-canvas
      if (h.r>CSIZE) return false;
    }
    return true;
  });
}

  //if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

let r=CSIZE*0.866;

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
hexMap.set(0,{"r":r,"ld":1000,"lw":0});

ctx.fillStyle="#00000010";

var draw=()=>{
  let pm=new Map();
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<ha.length; i++) {
    if (ha[i].type==0) continue;
    let lpath=pm.get(ha[i].lid);
    if (!lpath) lpath=pm.set(ha[i].lid,new Path2D()).get(ha[i].lid);
    lpath.addPath(ha[i].getPath3());
  }
  pm.forEach((p,key)=>{
    let level=hexMap.get(key);
if (!level) debugger;
    let ld=level.ld;
    if (ld>999) ctx.setLineDash([]);
    else ctx.setLineDash([ld,2000]);
    ctx.lineWidth=level.lw+4;
    ctx.strokeStyle="#000000DD";
    ctx.stroke(p);
    ctx.lineWidth=level.lw;
    ctx.strokeStyle=colors[key%colors.length].getRGB();
    ctx.stroke(p);
    let ld2=ld-60;
    if (ld2>0) {
	if (ld2>999) ctx.setLineDash([]);
	else ctx.setLineDash([ld2,2000]);
	//ctx.lineWidth=level.lw/3+2;
	//ctx.lineWidth=0.6*level.lw+2;
        ctx.lineWidth=0.6*level.lw;
	ctx.strokeStyle="#000000AA";
	ctx.stroke(p);
    /*
	ctx.strokeStyle=colors[(key+2)%colors.length].getRGB();
	//ctx.lineWidth=level.lw/3;
	ctx.lineWidth=0.6*level.lw;
	ctx.stroke(p);
    */
      let ld3=ld2-60;
      if (ld3>0) {
	if (ld3>999) ctx.setLineDash([]);
	else ctx.setLineDash([ld3,2000]);
	ctx.lineWidth=0.2*level.lw+2;
	ctx.strokeStyle="black";
	ctx.stroke(p);
	ctx.strokeStyle=colors[(key+1)%colors.length].getRGB();
	ctx.lineWidth=0.2*level.lw;
	ctx.stroke(p);
      }
    }
  });
}

onresize();

hex.generate7(true);
hex.gen=true;
ha.forEach((h)=>{ if (h.lid==1) h.generate7(); });
hexMap.get(1).ld=800;
hexMap.get(1).lw=40;

ha.forEach((h)=>{ if (h.lid==2) h.generate7(); });
hexMap.get(2).ld=200;
hexMap.get(2).lw=20;

console.log(hexMap);
console.log(ha.length);

start();
