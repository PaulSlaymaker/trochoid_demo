"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
const TC=2*S6/3;
const CSIZE=360;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
//c.style.outline="1px dotted gray";
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
    this.RK1=150+600*Math.random();
    this.GK1=150+600*Math.random();
    this.BK1=150+600*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var COUNT=15;	// odd
//var R=(CSIZE)/(COUNT-1);	// 3
//var R=Math.round((CSIZE)/(S6*(COUNT-1)));
var R=Math.round((CSIZE)/(COUNT-1));
//var R=(CSIZE-24)/(COUNT-1);	// 4

function Node(i,j,x,y) {
  this.i=i;
  this.j=j;
  this.x=x;
  this.y=y;
  this.d="";  	// h,t,o
  this.type="";	// c - circle, l - link
  this.pt=[];	// positive direction paths
  this.nt=[];	// negative direction paths
  this.p=0;
}

//const MAXLENGTH=COUNT; //Math.round(1.5*COUNT);
const MAXLENGTH=Math.round(1.1*COUNT);
//console.log("maxlength",MAXLENGTH);

function DPath() {
  this.col=new Color();
  this.pa=[];
  this.circPath=false;
  this.setStart=()=>{
    let rx=getRandomInt(0,COUNT), ry=getRandomInt(0,COUNT);
    let sp=na[rx][ry];
    while (!sp.d) {
      rx=getRandomInt(0,COUNT);
      ry=getRandomInt(0,COUNT);
      sp=na[rx][ry];
    }
    let dir=[-1,1][getRandomInt(0,2)];
    let ga=(dir==-1)?sp.nt:sp.pt;
    let idx=getRandomInt(0,ga.length);
    //this.pa.push({"node":sp,"dir":dir,"idx":idx});
    this.pa.push({"node":sp,"pth":ga[idx]});
//sp.p=true;
//ga[idx].node.p=true;
  }
  this.generate=()=>{
    let gp=this.pa[this.pa.length-1];
    let gn=(gp.pth.dir==-1)?gp.pth.node.nt:gp.pth.node.pt;
    //let idx=getRandomInt(0,gn.length,true);
    //let idx=getRandomInt(0,gn.length);
    //let idx=gn.length-1-getRandomInt(0,gn.length,true);
    let idx=this.circPath?gn.length-1-getRandomInt(0,gn.length,true):getRandomInt(0,gn.length,true);
    
/*
if (gn[idx].w) {
  testObj(gn[idx]);
drawNodes();
stopped=true;
//  debugger;
}
*/
    this.pa.push({"node":gp.pth.node,"pth":gn[idx]});
    gp.pth.node.p++;
  }
  this.getPath=(start,end)=>{
    let p=new Path2D();
    p.dist=0;
    //p.moveTo(this.pa[0].node.x,this.pa[0].node.y);
    p.moveTo(this.pa[start].node.x,this.pa[start].node.y);
    //for (let i=0; i<this.pa.length; i++) {
    for (let i=start; i<end; i++) {
      let pth=this.pa[i].pth;
      if (this.pa[i].pth.line) {
	p.lineTo(pth.node.x,pth.node.y);
        p.dist+=R;
      } else {
        if (pth.w) {
	  p.arc(pth.cx,pth.cy,2*R*S6,pth.a1,pth.a2,pth.arc);
          p.dist+=TP*R*S6/3;
        } else {
	  p.arc(pth.cx,pth.cy,TC*R,pth.a1,pth.a2,pth.arc);
          p.dist+=R*TP*TC/3;
        }
      }
    }
    return p;
  }
  this.getTail=()=>{
    let p=new Path2D();
    p.moveTo(this.pa[1].node.x,this.pa[1].node.y);
    let pth=this.pa[0].pth;
    if (pth.line) {
      p.lineTo(this.pa[0].node.x,this.pa[0].node.y);
      p.dist=R;
    } else {
      if (pth.w) {
        p.dist=TP*R*S6/3;
        p.arc(pth.cx,pth.cy,2*R*S6,pth.a2,pth.a1,!pth.arc);
      } else {
        p.arc(pth.cx,pth.cy,TC*R,pth.a2,pth.a1,!pth.arc);
	p.dist=R*TP*TC/3;
      }
    }
    return p;
  }
  this.sym=(pth)=>{
    const dmx=new DOMMatrix([-1,0,0,1,0,0]);
    const dmy=new DOMMatrix([1,0,0,-1,0,0]);
    const dmr1=new DOMMatrix([S6,0.5,-0.5,S6,0,0]);
    const dmr2=new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]);
    const dmr3=new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]);
    let p=new Path2D();
    p.addPath(pth,dmr1);
    p.addPath(p,dmx);
//let p=new Path2D(pth);
//p.addPath(p,dmy);
    let p2=new Path2D(p);
    p2.addPath(p,dmr2);
    p2.addPath(p,dmr3);
    p2.dist=pth.dist;
    return p2;
  }
  this.setPaths=()=>{
//    this.path=this.getPath(0,this.pa.length-1);
//    this.path=this.sym(this.path);
    this.tail=this.getTail();
    this.head=this.getPath(this.pa.length-2,this.pa.length-1);
    this.body=this.getPath(1,this.pa.length-2);
    this.tail=this.sym(this.tail);
    this.head=this.sym(this.head);
    this.body=this.sym(this.body);
  }
  this.setCompact=()=>{
    if (this.pa[0].node.p>1 && this.pa[this.pa.length-1].node.p>1) {
      if (this.pa[0].node!=this.pa[this.pa.length-1].node) this.compact=true;
      return true;
    }
    this.compact=false;
    return false;
  }
  this.setStart();
for (let i=0; i<MAXLENGTH; i++) this.generate();
  this.setPaths();
}

var generateNodes=()=>{
  const o1=Math.atan2(S6,0.5);
  let arr=[];
  for (let i=0; i<COUNT; i++) {
    arr[i]=[];
    for (let j=0; j<COUNT; j++) {
      let x=i*R+((j%2)?R/2:0);
      let y=j*R*S6;
      arr[i][j]=new Node(i,j,x,y);
      if (i==COUNT-1) continue;	// corner with edge
      if (j==COUNT-1) continue;	// corner
      //if (Math.atan2(y,x)>1.0472) continue;		// Math.atan2(S6,0.5)
      if (Math.atan2(y,x)-o1>0.0001) continue;		// Math.atan2(S6,0.5)
      //else if (Math.atan2(y,x-(COUNT)*R)<2*1.0473) continue;		// Math.atan2(S6,0.5)
      else if (Math.atan2(y,x-(COUNT-1)*R)-2*o1<-0.0001) continue;		// Math.atan2(S6,0.5)
      if (y==0) {
        arr[i][j].type=(i%2)?"c":"l";
        arr[i][j].e=true;	// top edge
        arr[i][j].d="h"; continue;
      }
      if (Math.abs(Math.atan2(y,x)-o1)<0.0001) {
        if (j%2) arr[i][j].type="c";
        else if ((j%4)/2%2) arr[i][j].type=(i%2)?"l":"c";
        else arr[i][j].type=(i%2)?"c":"l";
        arr[i][j].e=true;	// left edge
        arr[i][j].d="t"; continue;
      }
      if (Math.abs(Math.atan2(y,x-(COUNT-1)*R)-2*o1)<0.0001) {
        if (j%2) arr[i][j].type="c";
        else if ((j%4)/2%2) arr[i][j].type=(i%2)?"l":"c";
        else arr[i][j].type=(i%2)?"c":"l";
        arr[i][j].e=true;	// edge
        arr[i][j].d="o"; continue;
      }
      if (j%2) {
        //if ((j%4)/2%2) arr[i][j].type=(i%2)?"l":"c";
        //else arr[i][j].type=(i%2)?"c":"l";
        arr[i][j].type="c";
        if (i%2) {
          if (j%4==1) {
            arr[i][j].d="o"; continue;
          } else {
            arr[i][j].d="t"; continue;
          }
        } else {
          if (j%4==1) {
            arr[i][j].d="t"; continue;
          } else {
            arr[i][j].d="o"; continue;
          }
        }
      } else {
        if ((j%4)/2%2) arr[i][j].type=(i%2)?"l":"c";
        else arr[i][j].type=(i%2)?"c":"l";
        if (arr[i][j].type=="l") {
          arr[i][j].d=["h","o","t"][getRandomInt(0,3)]; continue;
        } else {
          arr[i][j].d="h"; continue;
        }
      }
debugger; 
    }
  }
  arr[0][0].d="";	// corners
  arr[0][0].type="";	// corners
  return arr;
}
var na=generateNodes();

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

const ma=[	// motion array
 [[1,0], [0,1],[-1,1], [-1,0],[-1,-1],[0,-1]],  // j even
 [[1,0], [1,1], [0,1], [-1,0],[0,-1], [1,-1]]	// j odd
];
var dMapPos=new Map();
dMapPos.set("h",new Map().set(0,[ma[0][5],ma[0][0],ma[0][1]]).set(1,[ma[1][5],ma[1][0],ma[1][1]]));
dMapPos.set("t",new Map().set(0,[ma[0][0],ma[0][1],ma[0][2]]).set(1,[ma[1][0],ma[1][1],ma[1][2]]));
dMapPos.set("o",new Map().set(0,[ma[0][4],ma[0][5],ma[0][0]]).set(1,[ma[1][4],ma[1][5],ma[1][0]]));

var dMapNeg=new Map();
dMapNeg.set("h",new Map().set(0,[ma[0][2],ma[0][3],ma[0][4]]).set(1,[ma[1][2],ma[1][3],ma[1][4]]));
dMapNeg.set("t",new Map().set(0,[ma[0][3],ma[0][4],ma[0][5]]).set(1,[ma[1][3],ma[1][4],ma[1][5]]));
dMapNeg.set("o",new Map().set(0,[ma[0][1],ma[0][2],ma[0][3]]).set(1,[ma[1][1],ma[1][2],ma[1][3]]));

var setPositivePathNodes=(node)=>{
  let nd=dMapPos.get(node.d).get(node.j%2);
  for (let i=0; i<3; i++) {
    let idxj=node.j+nd[i][1];
    if (idxj<0) continue;
    let dnode=na[node.i+nd[i][0]][idxj];
    if (dnode) {
      if (node.type=="l") {
	if (i==1 && node.d==dnode.d) node.pt.unshift({"node":dnode,"line":true,"dir":1});
      } else {
        let ptho;
        let nobj={"node":dnode};
	if (dnode.type=="c") {
	  if (node.d=="h") {
	    if (i==0) {
              ptho={"cx":node.x,"cy":node.y-TC*R,"a1":TP/4,"a2":11*TP/12,"arc":true,"dir":-1};
	    } else if (i==2) {
              ptho={"cx":node.x,"cy":node.y+TC*R,"a1":3*TP/4,"a2":TP/12,"arc":false,"dir":-1};
	    }
	  } else if (node.d=="t") {
	    if (i==0) {
              ptho={"cx":(node.x+dnode.x)/2,"cy":node.y-TC*R/2,"a1":5*TP/12,"a2":TP/12,"arc":true,"dir":1}
	    } else if (i==2) {
	      ptho={"cx":dnode.x,"cy":dnode.y-TC*R,"a1":11*TP/12,"a2":TP/4,"arc":false,"dir":-1};
	    }
	  } else if (node.d=="o") {
	    if (i==0) {
              ptho={"cx":dnode.x,"cy":dnode.y+TC*R,"a1":TP/12,"a2":3*TP/4,"arc":true,"dir":-1};
	    } else if (i==2) {
              ptho={"cx":(node.x+dnode.x)/2,"cy":node.y+TC*R/2,
		    "a1":7*TP/12,"a2":11*TP/12,"arc":false,"dir":1};
	    }
	  } else debugger;
	  node.pt.push({...ptho,...nobj});
	} else if (dnode.type=="l") {
if (i!=1) debugger;
	  if (node.d==dnode.d) node.pt.unshift({"node":dnode,"line":true,"dir":1});
	}
      }
    }
  }
}

var setNegativePathNodes=(node)=>{
  let nd=dMapNeg.get(node.d).get(node.j%2);
  for (let i=0; i<3; i++) {
    let idxi=node.i+nd[i][0];
    if (idxi<0) continue;
    let idxj=node.j+nd[i][1];
    if (idxj<0) continue;
    let dnode=na[idxi][idxj];
    if (dnode) {
      if (node.type=="l") {
	if (i==1 && node.d==dnode.d) node.nt.unshift({"node":dnode,"line":true,"dir":-1});
      } else {
        let ptho;
        let nobj={"node":dnode};
	if (dnode.type=="c") {
	  if (node.d=="h") {
	    if (i==0) {
	       ptho={"cx":node.x,"cy":node.y+TC*R,"a1":3*TP/4,"a2":5*TP/12,"arc":true,"dir":1};
	    } else if (i==2) {
              ptho={"cx":node.x,"cy":node.y-TC*R,"a1":TP/4,"a2":7*TP/12,"arc":false,"dir":1};
	    }
	  } else if (node.d=="t") {
	    if (i==0) {
              ptho={"cx":(node.x+dnode.x)/2,"cy":node.y+TC*R/2,
		    "a1":11*TP/12,"a2":7*TP/12,"arc":true,"dir":-1};
	    } else if (i==2) {
	      ptho={"cx":dnode.x,"cy":dnode.y+TC*R,"a1":5*TP/12,"a2":3*TP/4,"arc":false,"dir":1};
	    }
	  } else if (node.d=="o") {
	    if (i==0) {
              ptho={"cx":dnode.x,"cy":dnode.y-TC*R,"a1":7*TP/12,"a2":TP/4,"arc":true,"dir":1};
	    } else if (i==2) {
              ptho={"cx":(node.x+dnode.x)/2,"cy":node.y-TC*R/2,
		    "a1":TP/12,"a2":5*TP/12,"arc":false,"dir":-1,};
	    }
	  }
	  node.nt.push({...ptho,...nobj});
	} else if (dnode.type=="l") {
if (i!=1) debugger;
	  if (node.d==dnode.d) node.nt.unshift({"node":dnode,"line":true,"dir":-1});
	}
      }
    }
  }
}

var testObj=(po)=>{	// diag
console.log(po);
  let p=new Path2D();
  p.arc(po.cx,po.cy,2*R*S6,po.a1,po.a2,po.arc);
  ctx.strokeStyle="red";
  ctx.stroke(p);
}

var reversePathArc=(pto)=>{ return {"a1":pto.a2,"a2":pto.a1,"arc":!pto.arc,"dir":-1*pto.dir}; }

var reversePathArc2=(pto)=>{ return {"a1":pto.a2,"a2":pto.a1,"arc":!pto.arc,"dir":pto.dir}; }

const setWideConnections=(node)=>{
  let dobj={"w":true};
  if (node.type!="l") return;
  if (node.d=="h") {
    // ok for edge (j==0)
    let o1={"a1":3*TP/4,"a2":11*TP/12,"arc":false,"dir":1};
    let o2={"a1":3*TP/4,"a2":7*TP/12,"arc":true,"dir":-1};
    let nc=[[[-1,0],[0,1],[-1,2],1],[[1,0],[-1,1],[1,2],-1]][getRandomInt(0,2)]; 
    let n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
    let n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
    let cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
    if (nc[3]==-1) {
      n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
      n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o2),...dobj});
    } else {
      n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
      n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o1),...dobj});
    }
    if (!node.e) {
      o1={"a1":TP/4,"a2":TP/12,"arc":true,"dir":1};
      o2={"a1":TP/4,"a2":5*TP/12,"arc":false,"dir":-1};
      nc=[[[-1,0],[0,-1],[-1,-2],1],[[1,0],[-1,-1],[1,-2],-1]][getRandomInt(0,2)];
      n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
      n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
      cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
/*
drawPoint(n1.x,n1.y);
drawPoint(n2.x,n2.y);
drawPoint(cn.x,cn.y,"blue");
let po={...{"cx":cn.x,"cy":cn.y},...nc[3],...dobj};
testObj(po);
*/
      if (nc[3]==-1) {
	n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
	n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o2),...dobj});
      } else {
	n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
	n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o1),...dobj});
      }
    }
  } else if (node.d=="t") {
    let o1={"a1":5*TP/12,"a2":TP/4,"arc":true,"dir":1};
    //let o2={"a1":5*TP/12,"a2":7*TP/12,"arc":true,"dir":1};
    let o2={"a1":5*TP/12,"a2":7*TP/12,"arc":false,"dir":1};
    let nc=[[[-1,-1],[1,0],[1,-2],1],[[0,1],[0,-1],[2,0],-1]][getRandomInt(0,2)]; // centers (1,-2) (2,0)
    let n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
    let n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
    let cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
    if (nc[3]==-1) {
      n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
      //n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc2(nc[3]),...dobj});
      n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc2(o2),...dobj});
    } else {
      n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
      n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o1),...dobj});
    }
//let po={...{"cx":cn.x,"cy":cn.y},...reversePathArc(nc[3]),...dobj};
//testObj(po);
    if (!node.e) {	// outside
      o1={"a1":11*TP/12,"a2":TP/12,"arc":false,"dir":-1};
      o2={"a1":11*TP/12,"a2":3*TP/4,"arc":true,"dir":-1};
      nc=[[[-1,-1],[-1,1],[-2,0],1],[[0,1],[-1,0],[-1,2],-1]][getRandomInt(0,2)];
      n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
      n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
      cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
      if (nc[3]==-1) {
	n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
	n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o2),...dobj});
      } else {
	n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
	n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc2(o1),...dobj});
      }
    }
//let po={...{"cx":cn.x,"cy":cn.y},...nc[3],...dobj};
//testObj(po);
  } else if (node.d=="o") {
    let o1={"a1":TP/12,"a2":TP/4,"arc":false,"dir":-1};
    let o2={"a1":TP/12,"a2":11*TP/12,"arc":true,"dir":-1};
    let nc=[[[0,-1],[-1,0],[-1,-2],-1],[[-1,1],[-1,-1],[-2,0],1]][getRandomInt(0,2)];  // inside
    let n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
    let n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
    let cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
    if (nc[3]==-1) {
      n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
      n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o1),...dobj});
    } else {
      n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
      n2.pt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc2(o2),...dobj});
    }
    if (!node.e) { // outside
      o1={"a1":7*TP/12,"a2":5*TP/12,"arc":true,"dir":1};
      o2={"a1":7*TP/12,"a2":3*TP/4,"arc":false,"dir":1};
      nc=[[[0,-1],[0,1],[2,0],-1],[[-1,1],[1,0],[1,2],1]][getRandomInt(0,2)];   // outside
      n1=na[node.i+nc[0][0]][node.j+nc[0][1]];
      n2=na[node.i+nc[1][0]][node.j+nc[1][1]];
      cn=na[node.i+nc[2][0]][node.j+nc[2][1]];
      if (nc[3]==-1) {
	n1.nt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o1,...dobj});
        n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc2(o1),...dobj});
      } else {
	n1.pt.unshift({...{"node":n2,"cx":cn.x,"cy":cn.y},...o2,...dobj});
	n2.nt.unshift({...{"node":n1,"cx":cn.x,"cy":cn.y},...reversePathArc(o2),...dobj});
      }
/*
drawPoint(n1.x,n1.y);
drawPoint(n2.x,n2.y);
drawPoint(cn.x,cn.y,"blue");
let po={...{"cx":cn.x,"cy":cn.y},...nc[3],...dobj};
testObj(po);
debugger;
*/
    }
  }
}

const generatePathTables=()=>{
  for (let i=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++) {
      let node=na[i][j];
      if (!node.type) continue;
      setNegativePathNodes(node);
      setPositivePathNodes(node);
      setWideConnections(node);
    }
  }
}

generatePathTables();

var pauseTS=1000;
var pauseCount=0;
var pause=(ts)=>{
  if (EM) {
    stopped=true;
    parent.postMessage("lf");
  }
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
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
body.addEventListener("click", start, false);

var DUR=R/3;
//var DUR=R;
var t=0;
var c=0;
var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  let pauseDraw=false;
  if (t>=DUR) {	
    t=0;
    for (let i=0; i<pArray.length; i++) {
      let dpath=pArray[i];
      dpath.pa[0].node.p--;
      dpath.pa.shift();
      dpath.setCompact();
    }
    for (let i=0; i<pArray.length; i++) { pArray[i].generate(); pArray[i].setPaths(); }
  }
  draw();

//if (pArray[0].compact && pArray[1].compact) { 
  if (pArray[0].compact && pArray[1].compact && pArray[2].compact) { 
    pauseCount++;
    pArray.forEach((pa)=>{ 
      pa.compact=false; 
      pa.circPath=(pauseCount%8<2);
    });
    pauseTS=performance.now()+2000;
    requestAnimationFrame(pause);
/*
drawNodesC();
drawPoint(pArray[0].pa[18].node.x,pArray[0].pa[18].node.y,"blue",7);
drawPoint(pArray[0].pa[0].node.x,pArray[0].pa[0].node.y,"white",7);
*/
    return;
  }
  requestAnimationFrame(animate);
}

var draw=()=>{
  let f=t/DUR;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  for (let i=0; i<pArray.length; i++) {
    ctx.lineWidth=2*(1+i);
    let curve=pArray[i];
    ctx.strokeStyle=curve.col.getRGB();
    ctx.setLineDash([curve.head.dist*f,1000]);
    ctx.stroke(curve.head);
    ctx.setLineDash([curve.tail.dist*(1-f),1000]);
    ctx.stroke(curve.tail);
    ctx.setLineDash([]);
    ctx.stroke(curve.body);
  }
}

onresize();

var drawNodes=()=>{	// diag
  for (let i=0; i<na.length; i++) {
    for (let j=0; j<na[i].length; j++) {
      let col="";
      if (na[i][j].d) {
        if (na[i][j].d=="h") col="green";
        else if (na[i][j].d=="t") col="cyan";
        else if (na[i][j].d=="o") col="yellow";
        else col="white";
      }
      let r=2;
      if (na[i][j].type=="l") r=6;
      else if (na[i][j].type=="c") r=4;
      drawPoint(na[i][j].x,na[i][j].y,col,r);
    }
  }
}

var drawNodesC=(n)=>{	// diag
  if (!n) n=0;
  for (let i=0; i<na.length; i++) {
    for (let j=0; j<na[i].length; j++) {
      if (na[i][j].p>n) drawPoint(na[i][j].x,na[i][j].y);
    }
  }
}

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

drawNodes();
//start();

var drawCircles=()=>{
  let path=new Path2D();
  ctx.strokeStyle="white";
  for (let i=1; i<na.length; i++) {
    for (let j=0; j<na.length; j++) {
      if (na[i][j].d!="h") continue;
      let s=j%4;
      if (s%2) continue;
      if (s/2%2) {
        if (i%2) {
        } else {
	  let p=new Path2D();
	  p.arc(na[i][j].x,na[i][j].y+TC*R,TC*R,0,TP);
	  path.addPath(p);
	  let p2=new Path2D();
	  p2.arc(na[i][j].x,na[i][j].y-TC*R,TC*R,0,TP);
	  path.addPath(p2);
        }
} else {
        if (i%2) {
	  let p=new Path2D();
	  p.arc(na[i][j].x,na[i][j].y+TC*R,TC*R,0,TP);
	  path.addPath(p);
	  if (j>0) {
	    let p2=new Path2D();
	    p2.arc(na[i][j].x,na[i][j].y-TC*R,TC*R,0,TP);
	    path.addPath(p2);
	  }
        }
      }
    }
  }
  ctx.stroke(path);
}
//drawCircles();

/*
var test=()=>{
  let testi=getRandomInt(0,COUNT), testj=getRandomInt(0,COUNT);
  let testNode=na[testi][testj];
  let testDir=[-1,1][getRandomInt(0,2)];
  console.log(testNode);
  console.log(testDir);
  drawPoint(testNode.x,testNode.y,"white");
  let p=new Path2D();
  if (testDir==-1) {
    let tp=testNode.nt[getRandomInt(0,testNode.nt.length)];
    if (tp.line) {
    } else {
    }
  } else {
    let tp=testNode.pt[getRandomInt(0,testNode.pt.length)];
  }
}
*/

var pArray=[new DPath(),new DPath(),new DPath()];

var drawPath=()=>{
  let path=new Path2D();
  let pta=pArray[0].pa;
  path.moveTo(pta[0].node.x,pta[0].node.y);
  for (let i=0; i<pta.length; i++) {
    let pth=pta[i].pth;
    if (pta[i].pth.line) {
      path.lineTo(pth.node.x,pth.node.y);
    } else {
      if (pth.w) {
	path.arc(pth.cx,pth.cy,2*R*S6,pth.a1,pth.a2,pth.arc);
      } else {
	path.arc(pth.cx,pth.cy,TC*R,pth.a1,pth.a2,pth.arc);
      }
    }
  }
  ctx.lineWidth=2;
  ctx.strokeStyle="yellow";
  ctx.stroke(path);
  drawPoint(pta[0].node.x,pta[0].node.y,"black",2);
  drawPoint(pta[1].node.x,pta[1].node.y,"red",2);
}

//drawPath();
start();

