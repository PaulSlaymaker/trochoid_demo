"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
const S8=Math.sin(TP/8);
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
  const CBASE=160;
  const CT=256-CBASE;
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=150+600*Math.random();
    this.GK1=150+600*Math.random();
    this.BK1=150+600*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

const QUAD=4,HEX=6;
var SYM=[QUAD,HEX][getRandomInt(0,2)];
var COUNT=2*getRandomInt(3,8)+1;	// always odd
//var R=(CSIZE-16)/(COUNT-1);	// 3
//var R=(CSIZE-24)/(COUNT-1);	// 4
var R=(CSIZE-((SYM==HEX)?132:16))/(COUNT-1);

function Node(i,j,x,y) {
  this.i=i;
  this.j=j;
  this.x=x;
  this.y=y;
  this.d="";  
}

const getRandomDirArray=()=>{
  return [[-1,0,1],[-1,1,0],[0,-1,1],[0,1,-1],[-1,0,1],[-1,1,0]][getRandomInt(0,6)];
}

const MAXLENGTH=Math.round(2.5*COUNT);
const MINLENGTH=3;
function DPath() {
  this.col=new Color();
  this.pa=[];
  this.state=[-1,0,1][getRandomInt(0,3)];
  this.setStart=()=>{
    let rx=getRandomInt(0,COUNT), ry=getRandomInt(0,COUNT);
    let sp=na[rx][ry];
    while (!sp.d) {
      rx=getRandomInt(0,COUNT);
      ry=getRandomInt(0,COUNT);
      sp=na[rx][ry];
    }
    this.pa.push({"node":sp,"dir":[-1,1][getRandomInt(0,2)]});
  }
  this.generate=()=>{
    let gn=this.pa[this.pa.length-1];
    let da=getRandomDirArray();
    if (gn.node.d=="h") {
      for (let k=0; k<3; k++) {
	if (gn.node.j+da[k]<0 || gn.node.j+da[k]+1>COUNT) continue;
        let gn2=na[gn.node.i+gn.dir][gn.node.j+da[k]];
        if (!gn2.d) continue;
        if (da[k]==0 && gn2.d=="v") continue; // no h->v when jdel==0
        this.pa.push({"node":gn2,"dir":da[k]?da[k]:gn.dir});
        return true;
      }
    } else {
      for (let k=0; k<3; k++) {
	if (gn.node.i+da[k]<0 || gn.node.i+da[k]+1>COUNT) continue;
        let gn2=na[gn.node.i+da[k]][gn.node.j+gn.dir];
        if (!gn2.d) continue;
        if (da[k]==0 && gn2.d=="h") continue; // no h->v when jdel==0
        this.pa.push({"node":gn2,"dir":da[k]?da[k]:gn.dir});
        return true;
      }
    }
    return false;
  }
  this.getPath=(start,end)=>{
    let p=new Path2D();
    p.dist=0;
    p.moveTo(this.pa[start].node.x,this.pa[start].node.y);
    for (let i=start; i<end; i++) {
      if (this.pa[i].node.d=="h") {
        if (this.pa[i].node.j==this.pa[i+1].node.j) {
          p.lineTo(this.pa[i+1].node.x,this.pa[i+1].node.y);
          p.dist+=R;
        } else if (this.pa[i+1].node.j-this.pa[i].node.j==1) {
          let cnode=na[this.pa[i].node.i][this.pa[i].node.j+1];
          if (this.pa[i].dir==1) p.arc(cnode.x,cnode.y,R,3*TP/4,0);
          else p.arc(cnode.x,cnode.y,R,3*TP/4,TP/2,true);
          p.dist+=R*Math.PI/2;
        } else if (this.pa[i+1].node.j-this.pa[i].node.j==-1) {
          let cnode=na[this.pa[i].node.i][this.pa[i].node.j-1];
          if (this.pa[i].dir==1) p.arc(cnode.x,cnode.y,R,TP/4,0,true);
          else p.arc(cnode.x,cnode.y,R,TP/4,TP/2);
          p.dist+=R*Math.PI/2;
        } 
      } else {	// vertical
        if (this.pa[i].node.i==this.pa[i+1].node.i) {
          p.lineTo(this.pa[i+1].node.x,this.pa[i+1].node.y);
          p.dist+=R;
        } else if (this.pa[i+1].node.i-this.pa[i].node.i==1) {
          let cnode=na[this.pa[i].node.i+1][this.pa[i].node.j];
          if (this.pa[i].dir==1) p.arc(cnode.x,cnode.y,R,TP/2,TP/4,true);
          else p.arc(cnode.x,cnode.y,R,TP/2,3*TP/4);
          p.dist+=R*Math.PI/2;
        } else if (this.pa[i+1].node.i-this.pa[i].node.i==-1) {
          let cnode=na[this.pa[i].node.i-1][this.pa[i].node.j];
          if (this.pa[i].dir==1) p.arc(cnode.x,cnode.y,R,0,TP/4);
          else p.arc(cnode.x,cnode.y,R,0,3*TP/4,true);
          p.dist+=R*Math.PI/2;
        } 
      } 
    }
    return p;
  }
  this.getTail=()=>{
    let p=new Path2D();
    p.moveTo(this.pa[1].node.x,this.pa[1].node.y);
    if (this.pa[0].node.d=="h") {
      if (this.pa[0].node.j==this.pa[1].node.j) {
	p.lineTo(this.pa[0].node.x,this.pa[0].node.y);
	p.dist=R;
      } else if (this.pa[1].node.j-this.pa[0].node.j==1) {
	let cnode=na[this.pa[0].node.i][this.pa[0].node.j+1];
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,0,3*TP/4,true);
	else p.arc(cnode.x,cnode.y,R,TP/2,3*TP/4);
	p.dist=R*Math.PI/2;
      } else if (this.pa[1].node.j-this.pa[0].node.j==-1) {
	let cnode=na[this.pa[0].node.i][this.pa[0].node.j-1];
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,0,TP/4);
	else p.arc(cnode.x,cnode.y,R,TP/2,TP/4,true);
	p.dist=R*Math.PI/2;
      } 
    } else {	// vertical
      if (this.pa[0].node.i==this.pa[1].node.i) {
	p.lineTo(this.pa[0].node.x,this.pa[0].node.y);
	p.dist=R;
      } else if (this.pa[1].node.i-this.pa[0].node.i==1) {
	let cnode=na[this.pa[0].node.i+1][this.pa[0].node.j];
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,TP/4,TP/2,);
	else p.arc(cnode.x,cnode.y,R,3*TP/4,TP/2,true);
	p.dist=R*Math.PI/2;
      } else if (this.pa[1].node.i-this.pa[0].node.i==-1) {
	let cnode=na[this.pa[0].node.i-1][this.pa[0].node.j];
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,TP/4,0,true);	// v,left,down
	else p.arc(cnode.x,cnode.y,R,3*TP/4,0);
	p.dist=R*Math.PI/2;
      } 
    } 
    return p;
  }

  this.symh=(pth)=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmr=new DOMMatrix([S8,-S8,S8,S8,0,0]);
    const dm1=dmr.multiply(new DOMMatrix([1,Math.tan(TP/24),Math.tan(TP/24),1,0,0]));
    const dm2=new DOMMatrix([0.5,S6,S6,-0.5,0,0]);
    const dm3=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
    let p=new Path2D();
    p.addPath(pth,dm1);
    p.addPath(p,dmx);
    let p2=new Path2D(p);
    p2.addPath(p,dm2);
    p2.addPath(p,dm3);
    p2.dist=pth.dist;
    return p2;
  }
  this.symq=(pth)=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    let p=new Path2D(pth);
    p.addPath(p,dmx);
    p.addPath(p,dmy);
    p.dist=pth.dist;
    return p;
  }
  this.sym=((SYM==HEX)?this.symh:this.symq);
  this.setPaths=()=>{
    this.head=this.getPath(this.pa.length-2,this.pa.length-1);
    this.body=this.getPath(1,this.pa.length-2);
    this.tail=this.getTail();
    this.head=this.sym(this.head);
    this.body=this.sym(this.body);
    this.tail=this.sym(this.tail);
  }
  this.setStart();
  for (let i=0; i<getRandomInt(MINLENGTH,MAXLENGTH); i++) { if (!this.generate()) break; }
  this.setPaths();
}

var generateNodes=()=>{
  let arr=[];
  for (let i=0; i<COUNT; i++) {
    arr[i]=[];
    for (let j=0; j<COUNT; j++) {
      arr[i][j]=new Node(i,j,i*R,j*R);
      if (j%2) {
        if (i%2); // square centers
        else arr[i][j].d="v";
      } else {
        if (i%2) {
          arr[i][j].d="h";
        } else {
          if (i!=0 && i!=COUNT-1) {
            if (j!=0 && j!=COUNT-1) arr[i][j].d=Math.random()<0.5?"v":"h";
            else arr[i][j].d="h";
          } else {
            if (j!=0 && j!=COUNT-1) {
              arr[i][j].d="v";
            } else { 
              // corners 
            }
          }
        }
      }
    }
  }
  return arr;
}

var na=generateNodes();

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

var DUR=R/((SYM==HEX)?2:3);
//var DUR=R;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  if (t>=DUR) {	
    t=0;
    for (let i=0; i<pArray.length; i++) {
      let dpath=pArray[i];
      if (dpath.pa.length>=MAXLENGTH) { 
        if (dpath.state==1) {
          dpath.state=-1; 
        } else {
          dpath.pa.shift();
        }
      } else if (dpath.pa.length<=MINLENGTH) { 
        if (dpath.state==-1) {
          dpath.state=1; 
          dpath.pa.shift();
        } else { }
        dpath.generate();
      } else {
	if (Math.random()<[0.05,0.01,0.05][dpath.state+1]) {
	  if (dpath.state==-1) {
	    dpath.state=[0,1][getRandomInt(0,2)];
	    dpath.pa.shift();
	    dpath.generate();
	  } else if (dpath.state==1) {
	    dpath.state=[-1,0][getRandomInt(0,2)];
	    if (dpath.state==0) dpath.generate();
	  } else {
	    dpath.state=[-1,1][getRandomInt(0,2)];
	    dpath.pa.shift();
	    if (dpath.state==1) dpath.generate();
	  }
	} else {
	  if (dpath.state<1) dpath.pa.shift();
	  if (dpath.state>-1) dpath.generate();
	}
      }
      dpath.setPaths();
    }
    if (EM) {
      stopped=true;
      parent.postMessage("lf");
   }
  }
  draw();
  requestAnimationFrame(animate);
}

var draw=()=>{
  const lw=[32,18,4];
  let f=t/DUR;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  for (let i=0; i<pArray.length; i++) {
    for (let j=i?0:1; j<3; j++) {
      ctx.strokeStyle=["#000000",pArray[i].col.getRGB(),"#000000"][j];
      let lineWidth=[lw[i]+7,lw[i],lw[i]-10][j];
      if (lineWidth<1) break;
      ctx.lineWidth=lineWidth;
      ctx.setLineDash((pArray[i].state<0)?[]:[pArray[i].head.dist*f,1000]);
      ctx.stroke(pArray[i].head);
      ctx.setLineDash((pArray[i].state>0)?[]:[pArray[i].tail.dist*(1-f),1000]);
      ctx.stroke(pArray[i].tail);
      ctx.setLineDash([]);
      ctx.stroke(pArray[i].body);
    }
  }
}

onresize();

var pArray=[new DPath(),new DPath(),new DPath()];

start();
