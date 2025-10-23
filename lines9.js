"use strict"; // Paul Slaymaker, paul25882@gmail.com
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

var COUNT=2*getRandomInt(3,8)+1;	// always odd
var R=(CSIZE-16)/(COUNT-1);	// 3
//var R=(CSIZE-24)/(COUNT-1);	// 4

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

//const MAXLENGTH=30;	// fct of COUNT?
const MAXLENGTH=Math.round(2.5*COUNT);
console.log("maxlength",MAXLENGTH);
const MINLENGTH=3;
function DPath() {
  this.col=new Color();
  this.pa=[];
  this.state=[-1,0,1][getRandomInt(0,3)];
  this.setStart=()=>{
    // create usable na array
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
      //let ix=gn.node.i+gn.dir;
//if (ix<0 || ix+1>COUNT) debugger;
      for (let k=0; k<3; k++) {
	if (gn.node.j+da[k]<0 || gn.node.j+da[k]+1>COUNT) continue;
        let gn2=na[gn.node.i+gn.dir][gn.node.j+da[k]];
        if (!gn2.d) continue;
        if (da[k]==0 && gn2.d=="v") continue; // no h->v when jdel==0
        this.pa.push({"node":gn2,"dir":da[k]?da[k]:gn.dir});
        return true;
      }
    } else {
      //let iy=gn.node.j+gn.dir;
//if (iy<0 || iy+1>COUNT) debugger;
      for (let k=0; k<3; k++) {
	if (gn.node.i+da[k]<0 || gn.node.i+da[k]+1>COUNT) continue;
        let gn2=na[gn.node.i+da[k]][gn.node.j+gn.dir];
        if (!gn2.d) continue;
        if (da[k]==0 && gn2.d=="h") continue; // no h->v when jdel==0
        this.pa.push({"node":gn2,"dir":da[k]?da[k]:gn.dir});
        return true;
      }
    }
debugger;
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
        } else debugger;
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
        } //else debugger;
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
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,0,3*TP/4,true); // move to outside?
	else p.arc(cnode.x,cnode.y,R,TP/2,3*TP/4);
	p.dist=R*Math.PI/2;
      } else if (this.pa[1].node.j-this.pa[0].node.j==-1) {
	let cnode=na[this.pa[0].node.i][this.pa[0].node.j-1];
	if (this.pa[0].dir==1) p.arc(cnode.x,cnode.y,R,0,TP/4);
	else p.arc(cnode.x,cnode.y,R,TP/2,TP/4,true);
	p.dist=R*Math.PI/2;
      } //else debugger;
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
      } //else debugger;
    } 
    return p;
  }
  this.sym=(pth)=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    let p=new Path2D(pth);
    p.addPath(p,dmx);
    p.addPath(p,dmy);
    p.dist=pth.dist;
    return p;
  }
  this.setPaths=()=>{
    //this.path=this.getPath(0,this.pa.length-1);
    this.head=this.getPath(this.pa.length-2,this.pa.length-1);
    this.body=this.getPath(1,this.pa.length-2);
    //this.tail=this.getPath(0,1);
    this.tail=this.getTail();
//if (isNaN(this.tail.dist)) debugger;
    this.head=this.sym(this.head);
    this.body=this.sym(this.body);
    this.tail=this.sym(this.tail);
    this.fpath=new Path2D(this.tail);
    this.fpath.addPath(this.body);
    this.fpath.addPath(this.head);
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
            if (j!=0 && j!=COUNT-1) {
              arr[i][j].d=Math.random()<0.5?"v":"h";
            } else {
              arr[i][j].d="h";
            }
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

//const states=[[0,1],[-1,1],[0,-1]];
//const states=[[-1,-1],[-1,-1],[1,1]];
var DUR=R/3;
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
//console.log("midshift",i,"state",dpath.state);
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
  }
  draw();
  requestAnimationFrame(animate);
}

var draw=()=>{
  let f=t/DUR;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  //let lw=[34,20,6];
  let lw=[32,18,4];
  //let lw=[46,32,18,4];
  for (let i=0; i<pArray.length; i++) {
    for (let j=i?0:1; j<3; j++) {
      //ctx.strokeStyle=["#000000C0",pArray[i].col.getRGB()][j];
      //ctx.strokeStyle=[pArray[i].col.getRGB(),"#000000C0"][j];
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

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

onresize();

var drawNodes=()=>{	// diag
  for (let i=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++) {
      let col="";
      if (na[i][j].d=="h") col="green";
      else if (na[i][j].d=="v") col="yellow";
//else if (na[i][j].d=="q") col="blue";
//else if (na[i][j].d=="p") col="cyan";
//else if (na[i][j].d=="p2") col="magenta";
      drawPoint(na[i][j].x,na[i][j].y,col,4);
    }
  }
}

var pArray=[new DPath(),new DPath(),new DPath()];

var showPoints=()=>{	// diag
  drawNodes();
/*
for (let i=0; i<path1.pa.length; i++) {
  let col=(i==0)?"blue":"magenta";
  drawPoint(path1.pa[i].node.x,path1.pa[i].node.y,col,2);
//  drawPoint(path1.pa[0].node.x,path1.pa[0].node.y,"blue",2);
}
*/

  for (let i=0; i<pArray.length; i++) {
    //let path=pArray[i].getPath(0,pArray[i].pa.length-1);
    ctx.lineWidth=3;
    ctx.strokeStyle="#FFFFFF80";
    ctx.stroke(pArray[i].head);
    ctx.stroke(pArray[i].body);
    ctx.stroke(pArray[i].tail);
//let col=(i==0)?"blue":"magenta";
//drawPoint(path1.pa[i].node.x,path1.pa[i].node.y,col,2);
drawPoint(pArray[i].pa[0].node.x,pArray[i].pa[0].node.y,"blue",2);
console.log("pcount",pArray[i].pa.length);
  }
}

//showPoints();
start();

// cl code
// triangles, hexes, mixed
// offset lines, (connections), shift to points
// unequal squares, (half/whole for ex., and random, (half min?))
// in/out trend (not for continuous generation)
