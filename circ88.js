"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
const CSIZE=360;

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
  const CBASE=176;
  const CT=256-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=100+400*Math.random();
    this.GK1=100+400*Math.random();
    this.BK1=100+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
//const color=new Color();
const cola=[new Color(),new Color(),new Color()];


const roulette=(n)=>{	// roulette function
  let mult=2*n+1;
  let res=4*n*(n+1);
  return {"mult":mult,"res":res};
// 5-24, 7-48, 9-80, 11-120, 13-168, 15-224, 17-288	A-B
}

var roul=10;
var {mult,res}=roulette(roul);

//var res=80;
//var mult=9;
const getRadiusArray=()=>{
  let a=new Array();
  for (let i=0; i<roul+2; i++) {
    let z=i*TP/res;
    let x=CSIZE/2*(Math.cos(z)-Math.cos(mult*z));
    let y=CSIZE/2*(Math.sin(z)-Math.sin(mult*z));
    a[i]=Math.pow(x*x+y*y,0.5);
  }
  return a;
}
var ra=getRadiusArray();
/*
var ra=new Array();	// ?  6=(A+1)/2+1, or n+2
for (let i=0; i<roul+2; i++) {
  let z=i*TP/res;
  let x=CSIZE/2*(Math.cos(z)-Math.cos(mult*z));
  let y=CSIZE/2*(Math.sin(z)-Math.sin(mult*z));
  let r=Math.pow(x*x+y*y,0.5);
  ra[i]=r;
}
*/
var RES2=120;
var ra2=new Array(7);
for (let i=0; i<7; i++) {
  let z=i*TP/RES2;
  let x=CSIZE/2*(Math.cos(z)-Math.cos(11*z));
  let y=CSIZE/2*(Math.sin(z)-Math.sin(11*z));
  let r=Math.pow(x*x+y*y,0.5);
  ra2[i]=r;
}

function Point(i,j) {
  this.l=i+1;
  this.j=j;
  let ac=mult-1;	// angle count
  let hac=2*ac;
  this.a=j*TP/ac+((i%2)?0:TP/hac);
  this.x=ra[i+1]*Math.cos(this.a);
  this.y=ra[i+1]*Math.sin(this.a);
}

function Point2(i,j) {
  this.l=i+1;
  this.j=j;
  this.a=j*TP/10+((i%2)?0:TP/20);	// 10=A-1
  this.x=ra2[i+1]*Math.cos(this.a);
  this.y=ra2[i+1]*Math.sin(this.a);
}

function DPath() {
//  this.color=new Color();
  this.pa=[];
  this.ss=true; //Math.random()<0.5; //getRandomInt(0,4);	// move after sfa
  this.lw=2+6*getRandomInt(0,2,true);
  this.setStart=()=>{
    let idl=7; //getRandomInt(0,na.length); 
    let ida=getRandomInt(0,na[idl].length); 
    let dir=1; //[-1,1][getRandomInt(0,2)];
    this.pa.push({"node":na[idl][ida],"dir":dir});
    let npa=na[idl][ida].getNextPathArray(dir);
    this.pa.push(npa[getRandomInt(0,npa.length)]);
  }
  this.generate=()=>{
    let gn=this.pa[this.pa.length-1];
    let npa=gn.node.getNextPathArray(gn.dir);
    let nextPath=npa[getRandomInt(0,npa.length,Math.random()<0.3)];
    //this.pa.push(npa[getRandomInt(0,npa.length)]);
    this.pa.push(nextPath);
    nextPath.node.o++;
  }
  this.getPath=(i1,i2)=>{
    let p=new Path2D();
    p.dist=0;
    let node=this.pa[i1].node;
    let x=(node.p1.x+node.p2.x)/2;
    let y=(node.p1.y+node.p2.y)/2;
drawPoint(x,y);
    p.moveTo(x,y);
    for (let i=i1+1; i<i2; i++) {
//if (this.pa[i]==undefined) debugger;
      node=this.pa[i].node;
      x=(node.p1.x+node.p2.x)/2;
      y=(node.p1.y+node.p2.y)/2;
      node=this.pa[i-1].node;
      if (this.pa[i-1].dir==-1) {
	p.quadraticCurveTo(node.p1.x,node.p1.y,x,y);
      } else {
	p.quadraticCurveTo(node.p2.x,node.p2.y,x,y);
      }
let dist=da[this.pa[i].dsi];
if (dist==undefined) dist=50;
p.dist+=dist;
    }
    return p;
  }
/*
  this.getHead=()=>{
    let p=new Path2D();
    let dist=da[this.pa[this.pa.length-1].dsi];
    if (dist==undefined) dist=70;
    p.dist=dist;
    let node1=this.pa[this.pa.length-2].node;
    let node2=this.pa[this.pa.length-1].node;
    let x=(node1.p1.x+node1.p2.x)/2;
    let y=(node1.p1.y+node1.p2.y)/2;
    p.moveTo(x,y);
    x=(node2.p1.x+node2.p2.x)/2;
    y=(node2.p1.y+node2.p2.y)/2;
    if (this.pa[this.pa.length-2].dir==-1) {
      p.quadraticCurveTo(node1.p1.x,node1.p1.y,x,y);
    } else {
      //p.quadraticCurveTo(node2.p2.x,node2.p2.y,x,y);
p.quadraticCurveTo(node1.p2.x,node1.p2.y,x,y);
    }
    return p;
  }
*/
  this.getTail=()=>{
    let p=new Path2D();
    let dist=da[this.pa[1].dsi];
    if (dist==undefined) dist=50;
    p.dist=dist;
    let node1=this.pa[1].node;
    let node2=this.pa[0].node;
    let x=(node1.p1.x+node1.p2.x)/2;
    let y=(node1.p1.y+node1.p2.y)/2;
    p.moveTo(x,y);
    x=(node2.p1.x+node2.p2.x)/2;
    y=(node2.p1.y+node2.p2.y)/2;
//console.log(this.pa[0].dir);
    //if (node1.l==node2.l) {
    if (this.pa[0].dir==-1) {
drawPoint(node2.p1.x,node2.p1.y,"blue");
      p.quadraticCurveTo(node2.p1.x,node2.p1.y,x,y);
    } else {
drawPoint(node2.p2.x,node2.p2.y,"blue");
      p.quadraticCurveTo(node2.p2.x,node2.p2.y,x,y);
    }
    return p;
  }
  this.setCompact=()=>{
    if (this.pa[0].node.o>1 && this.pa[this.pa.length-1].node.o>1) {
      if (this.pa[0].node!=this.pa[this.pa.length-1].node) this.compact=true;
      return true;
    }
    this.compact=false;
    return false;
  }
  this.sym=(pth)=>{
    const dmr1=new DOMMatrix([0.5,S6,-S6,0.5,0,0]);
    const dmr2=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
    const dmr3=new DOMMatrix([-1,0,0,-1,0,0]);
    const dmr4=new DOMMatrix([-1,0,0,1,0,0]);
    //const dmr1=new DOMMatrix([S6,0.5,-0.5,S6,0,0]);
    let p=new Path2D(pth);
    p.addPath(pth,dmr1);
    p.addPath(pth,dmr2);
    p.addPath(p,dmr3);
    p.addPath(p,dmr4);
    p.dist=pth.dist;
    return p;
  }
  this.symO=(pth)=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
//    const dmr2=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
//    const dmr3=new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]);
    let p=new Path2D(pth);
    p.addPath(p,dmx);
    p.addPath(p,dmy);
p.dist=pth.dist;
return p;
//let p=new Path2D(pth);
//p.addPath(p,dmy);
/*
    let p2=new Path2D(p);
    p2.addPath(p,dmr2);
    p2.addPath(p,dmr3);
    p2.dist=pth.dist;
    return p2;
*/
  }
  this.setPaths=()=>{
    this.tail=this.getTail();
    //this.head=this.getHead(); //this.getPath(this.pa.length-2,this.pa.length-1);
    this.head=this.getPath(this.pa.length-2,this.pa.length);
    this.body=this.getPath(1,this.pa.length-1);
//if (this.ss) {
    this.tail=this.symO(this.tail);
    this.head=this.symO(this.head);
    this.body=this.symO(this.body);
/*
} else {
    this.tail=this.sym(this.tail);
    this.head=this.sym(this.head);
    this.body=this.sym(this.body);
}
*/
  }
  this.setStart();
  for (let i=0; i<7; i++) this.generate();
//this.path=this.getPath(0,this.pa.length);
  this.setPaths();
}

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var pauseTS=1000;
var pauseCount=0;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
//ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//ctx.setLineDash([1,2000]);
ctx.lineWidth=3;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var DUR=20;
var t=0;
var c=0;
var frac=1;
var frac2=1;

var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  if (t>=DUR) {
    t=0;
    for (let i=0; i<dpa.length; i++) {
      dpa[i].pa[0].node.o--;
      dpa[i].pa.shift();
 //     dpa[i].setCompact();
    }
    for (let i=0; i<dpa.length; i++) { dpa[i].generate(); dpa[i].setPaths(); }
  }
  draw();
/*
  if (dpa[0].compact && dpa[1].compact && dpa[2].compact) {
console.log("paused");
    pauseCount++;
    //dpa.forEach((dp)=>{ dp.compact=false; pa.circPath=(pauseCount%8<2); });
    dpa.forEach((dp)=>{ dp.compact=false; });
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
    return;
  }
*/
  requestAnimationFrame(animate);
}

var draw=()=>{
  let f=t/DUR;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  for (let i=0; i<dpa.length; i++) {
//ctx.lineWidth=2+i/2;
//if (dpa[i].lw==2) {
ctx.lineWidth=dpa[i].lw+4;
ctx.strokeStyle="black";
    ctx.setLineDash([dpa[i].head.dist*f,1000]);
    ctx.stroke(dpa[i].head);
    ctx.setLineDash([dpa[i].tail.dist*(1-f),1000]);
    ctx.stroke(dpa[i].tail);
    ctx.setLineDash([]);
    ctx.stroke(dpa[i].body);
//}
ctx.lineWidth=dpa[i].lw;
    ctx.strokeStyle=cola[i%3].getRGB();
    ctx.setLineDash([dpa[i].head.dist*f,1000]);
    ctx.stroke(dpa[i].head);
    ctx.setLineDash([dpa[i].tail.dist*(1-f),1000]);
    ctx.stroke(dpa[i].tail);
    ctx.setLineDash([]);
    ctx.stroke(dpa[i].body);
  }
}

onresize();

var pta=[];
for (let i=0; i<ra.length-1; i++) {	// 5=ra.length-1 (<ra since point0 excluded)
  pta[i]=[];
  for (let j=0; j<mult-1; j++) {	// 8=A-1
    pta[i].push(new Point(i,j));
  }
}
const point0=new Point();
point0.l=0;
point0.a=0;
point0.x=0;
point0.y=0;

function Node(p1,p2) {
  this.p1=p1;
  this.p2=p2;
  this.l=p1.l;
  this.o=0;
  this.getNextPathArray=(dir)=>{
    let l=p1.l;
    let ac=mult-1;
    let hac=2*ac;
    if (dir==-1) {
      if (l==0) {
        let idx1=(ac-1+(this.ia))%ac;
        let idx2=(this.ia+1)%ac;
        return [{"node":na[l][idx1],"dsi":0,"dir":1},{"node":na[l][idx2],"dsi":0,"dir":1}];
      } else if (l==1) {
        if (this.ia%2) {
          return [
            {"node":na[l-1][(this.ia-1)/2],"dsi":1,"dir":-1},{"node":na[l][this.ia-1],"dsi":3,"dir":1}];
        } else {
          return [
            {"node":na[l-1][(this.ia)/2],"dsi":1,"dir":-1},{"node":na[l][this.ia+1],"dsi":3,"dir":1}];
        }
      } else if (l==roul) {	// roul even
        return [{"node":na[l-1][this.ia],"dsi":da.length-2,"dir":-1}];
/*
      } else if (l==2) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l-1][this.ia],"dsi":4,"dir":-1},{"node":na[l][idx],"dsi":6,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l-1][this.ia],"dsi":4,"dir":-1},{"node":na[l][idx],"dsi":6,"dir":1}];
        }
      } else if (l==3) {
        if (this.ia%2) {
          return [{"node":na[l-1][this.ia],"dsi":7,"dir":-1},{"node":na[l][this.ia-1],"dsi":9,"dir":1}];
        } else {
          return [{"node":na[l-1][this.ia],"dsi":7,"dir":-1},{"node":na[l][this.ia+1],"dsi":9,"dir":1}];
        }
*/
      //} else if (l==4) {
      } else if (l%2==0) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l-1][this.ia],"dsi":3*l-2,"dir":-1},{"node":na[l][idx],"dsi":3*l,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l-1][this.ia],"dsi":3*l-2,"dir":-1},{"node":na[l][idx],"dsi":3*l,"dir":1}];
        }
      //} else if (l==5) {
      } else if (l%2) {
        if (this.ia%2) {
          return [
            {"node":na[l-1][this.ia],"dsi":3*l-2,"dir":-1},{"node":na[l][this.ia-1],"dsi":3*l,"dir":1}];
        } else {
          return [
            {"node":na[l-1][this.ia],"dsi":3*l-2,"dir":-1},{"node":na[l][this.ia+1],"dsi":3*l,"dir":1}];
        }
      } else debugger;
    } else {
      if (l==0) {
        return [{"node":na[l+1][2*this.ia],"dsi":1,"dir":1},{"node":na[l+1][2*this.ia+1],"dsi":1,"dir":1}];
      } else if (l==roul) {	// max l=n, roul(n)
        if (this.ia%2) return [{"node":na[l][this.ia-1],"dsi":da.length-1,"dir":-1}];
        else return [{"node":na[l][this.ia+1],"dsi":da.length-1,"dir":-1}];
/*
      } else if (l==1) {	// l==1 and l==3 equivalent
      //} else if (l==1 || l==3) {	// l==1 and l==3 equivalent
      //} else if (l%2) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l][idx],"dsi":2,"dir":-1},{"node":na[l+1][this.ia],"dsi":4,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l][idx],"dsi":2,"dir":-1},{"node":na[l+1][this.ia],"dsi":4,"dir":1}];
        }
      } else if (l==2) {
        if (this.ia%2) {
          return [{"node":na[l][this.ia-1],"dsi":5,"dir":-1},{"node":na[l+1][this.ia],"dsi":7,"dir":1}];
        } else {
          return [{"node":na[l][this.ia+1],"dsi":5,"dir":-1},{"node":na[l+1][this.ia],"dsi":7,"dir":1}];
        }
      } else if (l==3) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l][idx],"dsi":8,"dir":-1},{"node":na[l+1][this.ia],"dsi":10,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l][idx],"dsi":8,"dir":-1},{"node":na[l+1][this.ia],"dsi":10,"dir":1}];
        }
      } else if (l==4) {
        if (this.ia%2) {
          return [
            {"node":na[l][this.ia-1],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        } else {
          return [
            {"node":na[l][this.ia+1],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        }
      } else if (l==5) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l][idx],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l][idx],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        }
*/
      } else if (l%2==0) {
        if (this.ia%2) {
          return [
            {"node":na[l][this.ia-1],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        } else {
          return [
            {"node":na[l][this.ia+1],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        }
      } else if (l%2) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          return [{"node":na[l][idx],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          return [{"node":na[l][idx],"dsi":3*l-1,"dir":-1},{"node":na[l+1][this.ia],"dsi":3*l+1,"dir":1}];
        }
      } else debugger;
debugger;
    }
  }
}

var na=new Array();
for (let i=0; i<pta.length; i++) {
  na[i]=[];
  for (let j=0; j<pta[i].length; j++) {
    if (i==0) {
      na[i][j]=new Node(point0,pta[0][j]);
    } else {
      if (i%2) {
	na[i].push(new Node(pta[i-1][j],pta[i][j]));
//na[i][j]=new Node(i,pta[i-1][j],pta[i][j]);
	let ja=(j==pta[i].length-1)?0:j+1;
	na[i].push(new Node(pta[i-1][j],pta[i][ja]));
//na[i][ja]=new Node(i,pta[i-1][j],pta[i][ja]);
      } else {
	let ja=(j==0)?pta[i].length-1:j-1;
	na[i].push(new Node(pta[i-1][j],pta[i][ja]));
	na[i].push(new Node(pta[i-1][j],pta[i][j]));
//na[i][ja]=new Node(pta[i-1][j],pta[i][ja]);
//na[i][j]=new Node(pta[i-1][j],pta[i][j]);
      }
    }
  }
  if (i>0 && i%2==0) na[i].push(na[i].shift());
}
for (let i=0; i<na.length; i++) for (let j=0; j<na[i].length; j++) na[i][j].ia=j;

ctx.font="14px sans-serif";
ctx.textAlign="center";
ctx.fillStyle="white";
var drawNodes=()=>{ 
  let p=new Path2D();
  for (let i=0; i<na.length; i++) {
    for (let j=0; j<na[i].length; j++) {
//if (na[i][j].p2==undefined) continue;
      p.moveTo(na[i][j].p1.x,na[i][j].p1.y);
      p.lineTo(na[i][j].p2.x,na[i][j].p2.y);
  let x=(na[i][j].p1.x+na[i][j].p2.x)/2;
  let y=(na[i][j].p1.y+na[i][j].p2.y)/2;
  ctx.fillText(j,x,y);
  //ctx.fillText(na[i][j].p2.j,x,y+10);
    }
  }
  ctx.strokeStyle="yellow";
  ctx.lineWidth=1;
  ctx.stroke(p);
}
drawNodes();

var drawT=(n)=>{
  let {mult,res}=roulette(n);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
//  ctx.font="18px sans-serif";
//  ctx.textAlign="center";
  ctx.strokeStyle="yellow";
  ctx.fillStyle="white";
  let p=new Path2D();
  let x=CSIZE/2*(Math.cos(0)-Math.cos(0));
  let y=CSIZE/2*(Math.sin(0)-Math.sin(0));
  p.moveTo(x,y);
  for (let i=1; i<res; i++) {
    let z=i*TP/res;
    x=CSIZE/2*(Math.cos(z)-Math.cos(mult*z));
    y=CSIZE/2*(Math.sin(z)-Math.sin(mult*z));
    p.lineTo(x,y);
//    ctx.fillText(i,x,y+16-i);
    if (i<mult) ctx.fillText(i,x,y-6);
  //  if (i>72) ctx.fillText(i,x,y-6);
  }
  p.closePath();
  ctx.stroke(p);
}

/*
for (let i=0; i<pta.length; i++) {
  for (let j=0; j<pta[i].length; j++) {
    drawPoint(pta[i][j].x,pta[i][j].y);
  }
}
*/

var drawNode=(l,i)=>{	// diag
  let p=new Path2D();
  p.moveTo(na[l][i].p1.x,na[l][i].p1.y);
  p.lineTo(na[l][i].p2.x,na[l][i].p2.y);
  ctx.strokeStyle="green";
  ctx.stroke(p); 
}

/*
//const da=[69.7,108.6,72.1,93.8,100.9,97.0,116.2,89.5,119.0,131.8,76.8,133.4];	// roul==4
//const da=[46.5,79.0,46.2,56.0,75.8,57.0,67.3,70.7,68.4,77.7,64.1,78.7,85.9,56.9,86.7,91.3,50.2,91.6];
const da=[34.0,62.0,34.2,39.4,60.3,39.8,45.8,57.7,46.3,52.3,54.2,52.8,58.0,	// roul==8
          54.2,58.5,63.1,45.5,63.5,67.0,41.0,67.3,69.4,37.1,69.6];
*/
const da=[27.2,50.9,27.3,30.4,50.0,30.6,34.4,48.4,34.6,38.5,46.3,38.3,47.7,43.9,42.9,46.3,
//	    0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15 
          42.9,46.6,49.7,38.0,50.0,52.5,34.8,52.7,54.6,31.8,54.7,55.9,29.3,55.8];
//	   16   17   18   19   20   21   22   23   24   25   26   27   28   29
const dpa=[new DPath()];
//const dpa=[new DPath(),new DPath(),new DPath()];
for (let i=0; i<7; i++) dpa.push(new DPath());
dpa.sort((a,b)=>{ return b.lw-a.lw; });

let dp=dpa[0];
//let dp2=new DPath();
ctx.strokeStyle="red";
ctx.lineWidth=2;
ctx.stroke(dp.getPath(0,dp.pa.length));

/*
ctx.strokeStyle="green";
ctx.setLineDash([60,10000]);
ctx.stroke(dp.getTail());
*/

//var test=(n1,n2,d)=>{
var test=(d)=>{
  ctx.lineWidth=12;
  ctx.setLineDash([1,1000]);
  //let p=dp.getPath(n1,n2);
  ctx.strokeStyle="#FFFFFFAA";	
  ctx.lineDashOffset=-d;
  ctx.stroke(dp.tail);
  ctx.lineWidth=8;
  ctx.strokeStyle="blue";	
  ctx.lineDashOffset=-d+0.1;
  ctx.stroke(dp.tail);
}

// rnd sym, pa length
// end connect test
// rationalize next
// multi-sym
// 1-dash stroke
// git
