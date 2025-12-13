"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+c/this.RK1+c/this.RK3));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+c/this.GK1+c/this.GK3));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+c/this.BK1+c/this.BK3));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=20+80*Math.random();
    this.GK1=20+80*Math.random();
    this.BK1=20+80*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RK3=Math.random()<0.2?0.1+0.4*Math.random():200;
    this.GK3=Math.random()<0.2?0.1+0.4*Math.random():200;
    this.BK3=Math.random()<0.2?0.1+0.4*Math.random():200;
  }
  this.randomize();
}
const color=new Color();

const roulette=(n)=>{	// roulette function
  let mult=2*n+1;
  let res=4*n*(n+1);
  return {"mult":mult,"res":res};
// 5-24, 7-48, 9-80, 11-120, 13-168, 15-224, 17-288	A-B
}

var roul=12;
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

function Point(i,j) {
  this.l=i+1;
  this.j=j;
  let ac=mult-1;	// angle count
  let hac=2*ac;
  this.a=j*TP/ac+((i%2)?0:TP/hac);
  this.x=ra[i+1]*Math.cos(this.a);
  this.y=ra[i+1]*Math.sin(this.a);
}

var MINLEN=3; //4;	// >4 unstable
var MAXLEN=20;
var SYM=4;

function DPath(st) {
  this.pa=[];
  this.lw=2+6*getRandomInt(0,2,true);
  this.startDist=0;

/*
  this.setStartN=()=>{
    let idl=getRandomInt(0,na.length);
    for (let i=0; i<na.length; i++) {
      let idxl=(idl+i)%na.length;
      let ida=getRandomInt(0,na[idxl].length);
      let idxa=(ida+j)%na[idxl].length;
      for (let j=0; j<na[idxl].length; j++) {
      }
    }
    return false;
  }
*/

  this.setStart=()=>{
    let idl=0; //getRandomInt(0,na.length); // cycle through na
    let ida=getRandomInt(0,24/SYM);
    //let ida=getRandomInt(0,na[idl].length); 
    let dir=[-1,1][getRandomInt(0,2)];
    //let dsi=(dir==-1)?0:1;
    let dist=(dir==-1)?da[0]:da[1];
    this.pa.push({"node":na[idl][ida],"dir":dir,"dist":dist});
    na[idl][ida].o=1;
  }
  this.draw=()=>{	// diag
    ctx.strokeStyle="red";
    ctx.stroke(this.getPath(0,this.pa.length));
  }
  this.generate=()=>{		// pass gn?
    let gn=this.pa[this.pa.length-1];
//if (isNaN(gn.dist)) debugger;
    let npa=gn.node.getNextPathArray(gn.dir);
    if (npa.length==0) return false;
    //let nextPath=npa[getRandomInt(0,npa.length,Math.random()<0.3)];
    let nextPath=npa[getRandomInt(0,npa.length)];
    //let nextPath=npa[npa.length-1-getRandomInt(0,npa.length,true)];
if (nextPath==undefined) debugger;
    this.pa.push(nextPath);
    nextPath.node.o++;
//    nextPath.dist=da[nextPath.dsi]+gn.dist;
nextPath.dist=nextPath.dist+gn.dist;
    return true;
  }
/*
  this.getDistance=(i1,i2)=>{
    let dist=0;
    for (let i=i1; i<i2; i++) {
      dist+=da[this.pa[i].dsi];
    }
    return dist;
  }
*/
  this.getPath=(i1,i2)=>{
    let p=new Path2D();
    let node=this.pa[i1].node;
//    if (node.p1==point0) { }  //special case
    //let x=(node.p1.x+node.p2.x)/2; let y=(node.p1.y+node.p2.y)/2;
//drawPoint(node.x,node.y,"yellow",4);
    p.moveTo(node.x,node.y);
    for (let i=i1+1; i<i2; i++) {
//if (this.pa[i]==undefined) debugger;
      node=this.pa[i].node;
      let nodeb=this.pa[i-1].node;
      if (this.pa[i-1].dir==-1) {
	p.quadraticCurveTo(nodeb.p1.x,nodeb.p1.y,node.x,node.y);
      } else {
	p.quadraticCurveTo(nodeb.p2.x,nodeb.p2.y,node.x,node.y);
      }
    }
    return p;
  }
  this.setPaths=()=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    const dmr3=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
    const dmr4=new DOMMatrix([0,1,-1,0,0,0]);
    this.tpath=this.getPath(0,this.pa.length);
    if (SYM==1) {
       this.path=new Path2D(this.tpath);
    } else if (SYM==4) {
      this.path=new Path2D(this.tpath);
      this.path.addPath(this.path,dmx);
      this.path.addPath(this.path,dmy);
    } else if (SYM==6) {
      let p=new Path2D();
      p.addPath(this.tpath,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));
      p.addPath(p,dmx);
      this.path=new Path2D(p);
      this.path.addPath(p,dmr3);
      this.path.addPath(p,new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]));
    } else if (SYM==8) {
      this.path=new Path2D(this.tpath);
      this.path.addPath(this.path,dmx);
      this.path.addPath(this.path,dmy);
      this.path.addPath(this.path,dmr4);
    } else {
      this.path=new Path2D(this.tpath);
      this.path.addPath(this.tpath,new DOMMatrix([0.5,S6,-S6,0.5,0,0]));
      this.path.addPath(this.tpath,dmr3);
      this.path.addPath(this.path,dmx);
      this.path.addPath(this.path,dmy);
    }
  }
  if (st) {
    this.setStart();
    for (let i=0; i<MAXLEN; i++) {
      if (!this.generate()) break;
    }
    this.setPaths();
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

var DUR=4000;
var t=0;
var c=0;
var mode=0;

var animate=(ts)=>{
  if (stopped) return;
  t+=3,c++;
//  if (t>=maxDist) {
  let dur=mode?111:maxDist+600;
  if (t>=dur) {
    t=0;
    mode=++mode%2;
    if (mode) {
      ctx.globalCompositeOperation="source-over";
      ctx.setLineDash([6,111]);
      maxDist=111;
    }
    if (mode==0) reset();
  }
  if (mode) erase();
  else draw();
  requestAnimationFrame(animate);
}

var erase=()=>{
  ctx.lineWidth=LW+2;
  ctx.strokeStyle="#00000060";
  for (let i=0; i<dpa.length; i++) {
    //ctx.lineDashOffset=-t;
    ctx.lineDashOffset=-t+dpa[i].startDist;
    ctx.stroke(dpa[i].path);
  }
}

var LW=24;
var draw=()=>{
  if (t>maxDist) return;
//  let f=t/DUR;
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
//ctx.lineWidth=10;
  for (let i=0; i<dpa.length; i++) {
    //ctx.lineDashOffset=-t;
    ctx.lineDashOffset=-t+dpa[i].startDist;

/*
    ctx.strokeStyle="#FFFFFF";
    ctx.lineWidth=12;
    ctx.stroke(dpa[i].path);
*/

//let lw=24;//t<200
let lwf=Math.sin(Math.PI*t/maxDist);
//let lwf=Math.pow(Math.sin(TP*t/maxDist),2);
//let lf=Math.sin(Math.PI*(t-dpa[i].startDist)/(dpa[i].dist-dpa[i].startDist));
/*
let lf=(t-dpa[i].startDist)/(dpa[i].dist-dpa[i].startDist);
let lvls=(1-lf)*dpa[i].startLevel+lf*dpa[i].endLevel;
let lwf2=Math.sin(Math.PI*lvls/maxLevel);
*/
    ctx.strokeStyle=color.getRGB();
ctx.lineWidth=LW*lwf+0.01;
//if (t>dpa[i].dist-30) { ctx.lineWidth=0.1+(LW*lwf)*(dpa[i].dist-t)/30; }
    ctx.stroke(dpa[i].path);

    ctx.strokeStyle="#00000028";
    ctx.lineWidth=1.4*LW*lwf;
    ctx.stroke(dpa[i].path);

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
  this.x=(this.p1.x+this.p2.x)/2;
  this.y=(this.p1.y+this.p2.y)/2;
  this.stripOccupied=(arr)=>{
    return arr.filter((a)=> a.node.o==0);
  }
  this.getNextPathArray=(dir)=>{
    let l=p1.l;
    let ac=mult-1;
    let hac=2*ac;
    let arr=[];
    if (dir==-1) {
      if (l==0) {
        let idx1=(ac-1+(this.ia))%ac;
        let idx2=(this.ia+1)%ac;
        arr=[{"node":na[l][idx1],"dist":da[0],"dir":1},{"node":na[l][idx2],"dist":da[0],"dir":1}];
      } else if (l==1) {
        if (this.ia%2) {
          arr=[{"node":na[l-1][(this.ia-1)/2],"dist":da[1],"dir":-1},
               {"node":na[l][this.ia-1],"dist":da[3],"dir":1}];
        } else {
          arr=[{"node":na[l-1][(this.ia)/2],"dist":da[1],"dir":-1},
               {"node":na[l][this.ia+1],"dist":da[3],"dir":1}];
        }
      } else if (l==roul) {	// roul even
        arr=[{"node":na[l-1][this.ia],"dist":da[da.length-2],"dir":-1}];
      } else if (l%2==0) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          arr=[{"node":na[l-1][this.ia],"dist":da[3*l-2],"dir":-1},
               {"node":na[l][idx],"dist":da[3*l],"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          arr=[{"node":na[l-1][this.ia],"dist":da[3*l-2],"dir":-1},
               {"node":na[l][idx],"dist":da[3*l],"dir":1}];
        }
      } else if (l%2) {
        if (this.ia%2) {
          arr=[{"node":na[l-1][this.ia],"dist":da[3*l-2],"dir":-1},
               {"node":na[l][this.ia-1],"dist":da[3*l],"dir":1}];
        } else {
          arr=[{"node":na[l-1][this.ia],"dist":da[3*l-2],"dir":-1},
               {"node":na[l][this.ia+1],"dist":da[3*l],"dir":1}];
        }
      } 
    } else {
      if (l==0) {
        arr=[{"node":na[l+1][2*this.ia],"dsi":1,"dist":da[1],"dir":1},
             {"node":na[l+1][2*this.ia+1],"dsi":1,"dist":da[1],"dir":1}];
      } else if (l==roul) {	// max l=n, roul(n)
        if (this.ia%2) arr=[{"node":na[l][this.ia-1],"dsi":da.length-1,"dist":da[da.length-1],"dir":-1}];
        else arr=[{"node":na[l][this.ia+1],"dsi":da.length-1,"dist":da[da.length-1],"dir":-1}];
      } else if (l%2==0) {
        if (this.ia%2) {
          arr=[
            {"node":na[l][this.ia-1],"dsi":3*l-1,"dist":da[3*l-1],"dir":-1},
            {"node":na[l+1][this.ia],"dsi":3*l+1,"dist":da[3*l+1],"dir":1}];
        } else {
          arr=[
            {"node":na[l][this.ia+1],"dsi":3*l-1,"dist":da[3*l-1],"dir":-1},
            {"node":na[l+1][this.ia],"dsi":3*l+1,"dist":da[3*l+1],"dir":1}];
        }
      } else if (l%2) {
        if (this.ia%2) {
          let idx=(this.ia+1)%hac;
          arr=[{"node":na[l][idx],"dsi":3*l-1,"dist":da[3*l-1],"dir":-1},
               {"node":na[l+1][this.ia],"dsi":3*l+1,"dist":da[3*l+1],"dir":1}];
        } else {
          let idx=(hac-1+(this.ia))%hac;
          arr=[{"node":na[l][idx],"dsi":3*l-1,"dist":da[3*l-1],"dir":-1},
               {"node":na[l+1][this.ia],"dsi":3*l+1,"dist":da[3*l+1],"dir":1}];
        }
      } 
    }
    return this.stripOccupied(arr);
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
for (let i=0; i<na.length; i++) for (let j=0; j<na[i].length; j++) { na[i][j].ia=j; }

//var maxLevel=roul-3;
var maxLevel=roul-2;
var setNodes=()=>{
  for (let i=0; i<na.length; i++) for (let j=0; j<na[i].length; j++) {
    if (i>maxLevel) { na[i][j].o=1; continue; }
    if (SYM==1) {
      na[i][j].o=0; 
    } else if (SYM==4) {
      if (i==0) { if (j>5) na[i][j].o=1; else na[i][j].o=0; } // quarter
      else { if (j>11) na[i][j].o=1; else na[i][j].o=0; }
    } else if (SYM==6) {
      if (i==0) { if (j>3) na[i][j].o=1; else na[i][j].o=0; }  // 1/6
      else { if (j>7) na[i][j].o=1; else na[i][j].o=0; }
    } else if (SYM==12) {
      if (i==0) { if (j>1) na[i][j].o=1; else na[i][j].o=0; }  // 1/12
      else { if (j>3) na[i][j].o=1; else na[i][j].o=0; }
    } else {
      if (i==0) { if (j>2) na[i][j].o=1; else na[i][j].o=0; }  // 1/8
      else { if (j>5) na[i][j].o=1; else na[i][j].o=0; }
    }
  }
}
setNodes();

const setRandomBranchPath=()=>{
  let ridx=getRandomInt(0,dpa.length);
  for (let c=0; c<dpa.length; c++) {
    let idx=(ridx+c)%dpa.length;
    let npa=[];
    let p0;
    let pidx=getRandomInt(0,dpa[idx].pa.length);
    for (let i=1; i<dpa[idx].pa.length; i++) {
      if (i==dpa[idx].pa.length-1) continue;
      let idx2=(pidx+i)%dpa[idx].pa.length;
      p0=dpa[idx].pa[idx2];
      npa=dpa[idx].pa[idx2].node.getNextPathArray(dpa[idx].pa[idx2].dir);
      if (npa.length>0) {

    let np=npa[getRandomInt(0,npa.length)];
    let dpath=new DPath();
    dpath.pa.push(p0);
    dpath.pa.push(np);
//console.log(np.dist);
//console.log(p0.dist,dpath.getDistance(0,2));
//if (isNaN(p0.dist)) debugger;
    dpath.startDist=p0.dist-20;
//np.dist=p0.dist+dpath.getDistance(0,2);		// pre-existing?
np.dist+=p0.dist;
    for (let i=0; i<MAXLEN; i++) { 
      if (!dpath.generate()) {
	dpath.pa.pop();
	break; 
      }
    }
    if (dpath.pa.length<MINLEN) {
//console.log(dpath.pa.length,"dropping generated nodes");
      continue;
    }
/*
for (let q=0; q<dpath.pa.length; q++) {
  console.log(q,dpath.pa[q].node.o);
}
debugger;
*/
    dpath.pa[1].node.o=1;	// non-generated path element
    dpath.setPaths();
    dpa.push(dpath);
    return true;
//        break;
      }
    }
  }
  return false;
}

ctx.font="10px sans-serif";
ctx.textAlign="center";
ctx.fillStyle="white";
var drawNodes=(occ)=>{ 	// diag
  ctx.save();
  let p=new Path2D();
  for (let i=0; i<na.length; i++) {
    for (let j=0; j<na[i].length; j++) {
if (occ && na[i][j].o==0) continue;
      p.moveTo(na[i][j].p1.x,na[i][j].p1.y);
      p.lineTo(na[i][j].p2.x,na[i][j].p2.y);
      if (i==roul) {
      //let x=(na[i][j].p1.x+na[i][j].p2.x)/2; let y=(na[i][j].p1.y+na[i][j].p2.y)/2;
        ctx.fillText(j,na[i][j].x,na[i][j].y);
      //ctx.fillText(na[i][j].p2.j,x,y+10);
      }
    }
  }
  ctx.strokeStyle="silver";
  if (occ) ctx.strokeStyle="red";
  ctx.lineWidth=1;
  ctx.setLineDash([]);
  ctx.stroke(p);
  ctx.restore();
}

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
const da=[27.2,50.9,27.3,30.4,50.0,30.6,34.4,48.4,34.6,38.5,46.3,38.3,47.7,43.9,42.9,46.3,  // roul==10
          42.9,46.6,49.7,38.0,50.0,52.5,34.8,52.7,54.6,31.8,54.7,55.9,29.3,55.8];
*/
const da=[22.5,43.2,22.7,24.7,42.6,22.7,27.4,41.7,27.5,30.2,40.3,30.1,33.0,38.7,33.3,35.8,36.8,36.0,
//	    0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17
          38.6,34.8,38.7,41.0,32.6,41.1,43.1,30.0,43.2,44.8,28.0,44.9,46.0,25.9,46.0,46.8,24.3,46.8];
//	   18   19   20   21   22   23   24   25   26   27   28   29   30   31   32   33   34
//28.0,46.0,25.9,46.1,46.8,24.3];

var dpa;
var maxDist=0;
const setPathArray=()=>{
  dpa=[new DPath(true)];
  let rnd=getRandomInt(6,40);
  for (let i=0; i<rnd; i++) { if (!setRandomBranchPath()) break; }
console.log("rnd",rnd,"dpa",dpa.length);
  for (let i=0; i<dpa.length; i++) {
    dpa[i].dist=dpa[i].pa[dpa[i].pa.length-1].dist;
    maxDist=Math.max(maxDist,dpa[i].dist);
  }
}

var reset=()=>{
  //MAXLEN=getRandomInt(6,100,true);
  SYM=[8,4,12,6,1][getRandomInt(0,5,true)];
  MAXLEN=[6,100][getRandomInt(0,2)];
  color.randomize();
  setNodes();
  setPathArray();
  ctx.globalCompositeOperation="destination-over";
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.setLineDash([1,10000]);
  LW=[18,20,16,22,14,24,12,26,8,32][getRandomInt(0,10,true)];
}
reset();

var test=(d)=>{
  ctx.lineWidth=12;
  ctx.setLineDash([1,1000]);
  ctx.strokeStyle="#FFFFFFAA";	
  ctx.lineDashOffset=-d;
  ctx.stroke(dp.tail);
  ctx.lineWidth=8;
  ctx.strokeStyle="blue";	
  ctx.lineDashOffset=-d+0.1;
  ctx.stroke(dp.tail);
}

//drawNodes(true);
start();

// cl code
// dists, dsi out
// level array
// maxlength
// git
// half-segment terminal
