"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
//const EM=location.href.endsWith("em");
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
    this.RK1=100+400*Math.random();
    this.GK1=100+400*Math.random();
    this.BK1=100+400*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}
const color=new Color();

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:2;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

let ra=[0];
for (let i=1; i<6; i++) {
  let z=i*TP/80;
  let x=CSIZE/2*(Math.cos(z)-Math.cos(9*z));
  let y=CSIZE/2*(Math.sin(z)-Math.sin(9*z));
  ra.push(Math.pow(x*x+y*y,0.5));
}

function Point2(i,l,x,y) {
  this.i=i;
  this.l=l;
  this.x=x;
  this.y=y;
  if (l%2) {
    this.x=ra[l]*Math.cos(i*TP/8+TP/16);
    this.y=ra[l]*Math.sin(i*TP/8+TP/16);
  } else {
    this.x=ra[l]*Math.cos(i*TP/8);
    this.y=ra[l]*Math.sin(i*TP/8);
  }
  this.key=this.i+","+this.l;
}

function Point(idx,x,y) {
  this.idx=idx;
  this.i=(12+idx)%16;
  this.l=[0,1,2,3,4,5,4,3,2,1][idx%10];
  this.x=x;
  this.y=y;
  this.key=this.i; //+","+this.l;
}

function GP2(spt1,spt2,dpt1,dpt2,ch) {	// add dash, dash offset rate?
  this.spt1=spt1;
  this.spt2=spt2;
  this.dpt1=dpt1;
  this.dpt2=dpt2;
  this.ch=ch;
  this.type=Math.round(Math.random()); 
  this.getPath=()=>{
    if (this.type) return this.getPath1();
    else return this.getPath2();
  }
  this.getPath1=()=>{
// set sx,sy before drawing?
    let sx=(this.spt1.x+this.spt2.x)/2;
    let sy=(this.spt1.y+this.spt2.y)/2;
    let p=new Path2D();
    let x=f*(this.dpt1.x+this.dpt2.x)/2+(1-f)*sx;
    let y=f*(this.dpt1.y+this.dpt2.y)/2+(1-f)*sy;
    p.moveTo(x,y);
    p.lineTo(f*this.dpt1.x+(1-f)*sx,f*this.dpt1.y+(1-f)*sy);
    p.lineTo(this.spt1.x,this.spt1.y);
    p.moveTo(x,y);
    p.lineTo(f*this.dpt2.x+(1-f)*sx,f*this.dpt2.y+(1-f)*sy);
    p.lineTo(this.spt2.x,this.spt2.y);
    return p;
  }
  this.getPath2=()=>{
    let sx=(this.spt1.x+this.spt2.x)/2;
    let sy=(this.spt1.y+this.spt2.y)/2;
    let p=new Path2D();
    p.moveTo(this.spt1.x,this.spt1.y);
    p.lineTo(f*this.dpt1.x+(1-f)*sx,f*this.dpt1.y+(1-f)*sy);
    let x=f*(this.dpt1.x+this.dpt2.x)/2+(1-f)*sx;
    let y=f*(this.dpt1.y+this.dpt2.y)/2+(1-f)*sy;
    p.lineTo(x,y);
    p.moveTo(this.spt2.x,this.spt2.y);
    p.lineTo(f*this.dpt2.x+(1-f)*sx,f*this.dpt2.y+(1-f)*sy);
    p.lineTo(x,y);
    return p;
  }
  this.grow=()=>{
    let temp=false;
    if (this.spt1.l==0) {
      if (this.dpt1.i==this.dpt2.i) {	
	this.spt1=this.dpt1;
	this.spt2=this.dpt2;
        this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l+1));
	this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
      } else {
        if (this.spt2.i==this.dpt1.i) {
	  this.spt1=this.dpt1;
	  this.spt2=this.dpt2;
          this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	  this.dpt2=pm.get(((7+this.spt2.i)%8)+this.spt2.i+","+(this.spt2.l+1));
        } else { 
	  this.spt1=this.dpt1;
	  this.spt2=this.dpt2;
          this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	  this.dpt2=pm.get(((7+this.spt2.i)%8)+","+(this.spt2.l+1));
        }
      }
temp=true;
    } else if (this.spt1.l==1) {
      if (this.spt1.l==this.dpt2.l) {	// ax
	if (this.spt2.l>this.dpt1.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt2.i)%8)+","+this.spt2.l);	// special case
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
console.log("fix1a",1,this.ch); 
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((9+this.spt2.i)%8)+","+this.spt2.l);	// special case
	    this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l+1));
console.log("fix1b",this.ch); 
          }
temp=true;
        } else {
//console.log(this.spt1.i,this.dpt1.i,this.spt2.i,this.dpt2.i,this.ch);
//console.log(this.spt1.l,this.dpt1.l,this.spt2.l,this.dpt2.l);
	  //if (this.spt1.i==this.spt2.i) {
	  if (this.spt1.i==this.dpt1.i) {	// spt2.l==0, don't use spt2.i
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l+1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
console.log("fix1c",0,this.ch); 
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));	// 1
	    this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l+1));
console.log("fix1d",1,this.ch); 
          }
temp=true;
        }
      } else {
	if (this.spt1.l>this.dpt2.l) {
	  if (this.spt1.i==this.spt2.i) {
console.log("fix1e",this.ch); 
          } else {
console.log("fix1f",this.ch); 
          }
        } else {
	  if (this.dpt1.i==this.dpt2.i) {	// no spt1.i
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l+1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
console.log("fix1g",1,this.ch); 
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l+1));
console.log("fix1h",0,this.ch); 
          }
temp=true;
        }
      }
    } else if (this.spt1.l==2) {
      if (this.spt1.l==this.dpt2.l) {	// ax
	if (this.spt2.l>this.dpt1.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l-1));
            this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
console.log("fix2a",0,this.ch);
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
            this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l-1));
	    this.dpt2=pm.get(((7+this.spt2.i)%8)+","+(this.spt2.l-1));
console.log("fix2b",1,this.ch);
          }
temp=true;
        } else {
//console.log(this.spt1.i,this.dpt1.i,this.spt2.i,this.dpt2.i,this.ch);
//console.log(this.spt1.l,this.dpt1.l,this.spt2.l,this.dpt2.l);
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l+1));
            this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
console.log("fix2c",this.ch);
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
            this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((7+this.spt2.i)%8)+","+(this.spt2.l+1));
console.log("fix2d",0,this.ch);
          }
temp=true;
        }
      } else {
	if (this.spt1.l>this.dpt2.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
            this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((6+this.spt2.i)%8)+","+(this.spt2.l+1));	// reflect
console.log("fix2e",0,this.ch);
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((10+this.spt2.i)%8)+","+(this.spt2.l+1));	// reflect
console.log("fix2f",1,this.ch);
          }
temp=true;
        } else {
	  if (this.dpt1.i==this.dpt2.i) {	// no spt1.i
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l+1));
            this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
console.log("fix2g",0,this.ch);
          } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
            this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((7+this.spt2.i)%8)+","+(this.spt2.l+1));
console.log("fix2h",1,this.ch);
          }
temp=true;
        }
      }
    } else if (this.spt1.l==3) {	// diagonal tests
      if (this.spt1.l==this.dpt2.l) {	// ax
	if (this.spt2.l>this.dpt1.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l-1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
	  } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l-1));
	    this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l-1));
	  }
	} else {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l+1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l+1));
	  } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l+1));
	    this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l+1));
	  }
	}
temp=true;
      } else {
	if (this.spt1.l>this.dpt2.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l-1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
	  } else {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l-1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
	  }
temp=true;
	} else {
          this.state=1;		// this.ch,  0 and 1
        }
      }
    } else if (this.spt1.l==4) {
      if (this.spt1.l==this.dpt2.l) {	// ax
	if (this.spt2.l>this.dpt1.l) {
	  if (this.spt1.i==this.spt2.i) {
	    this.spt1=this.dpt1;
	    this.spt2=this.dpt2;
	    this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l-1));
	    this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
temp=true;
console.log("fix4a",this.ch);
          } else {
console.log("fix4b",this.ch);
          }
        } else {
	  if (this.spt1.i==this.spt2.i) {
            this.state=1;
console.log("fix4c",this.ch);
          } else {
            this.state=1;
console.log("fix4d",this.ch);
          }
        }
      } else {
	if (this.spt1.l>this.dpt2.l) {
	  if (this.spt1.i==this.spt2.i) {
	  this.spt1=this.dpt1;
	  this.spt2=this.dpt2;
	  this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l-1));
	  this.dpt2=pm.get(((7+this.spt2.i)%8)+","+(this.spt2.l-1));
console.log("fix4e",this.ch);
          } else {
	  this.spt1=this.dpt1;
	  this.spt2=this.dpt2;
	  this.dpt1=pm.get(((9+this.spt1.i)%8)+","+(this.spt1.l-1));
	  this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
console.log("fix4f",this.ch);
          }
temp=true;
        } else {
console.log("fix4g",this.ch);
        }
      }
    } else if (this.spt1.l==5) {	// 2 dir
      if (this.spt1.l==this.dpt2.l) {	// ax
	if (this.spt2.l>this.dpt1.l) {
	  if (this.spt1.i==this.spt2.i) {
console.log("fix5a",this.ch);
          } else {
console.log("fix5b",this.ch);
          }
        } else {
	  if (this.spt1.i==this.spt2.i) {
console.log("fix5a",this.ch);
          } else {
console.log("fix5c",this.ch);
          }
        }
      } else {
	if (this.spt1.l>this.dpt2.l) {
	  if (this.spt1.i==this.spt2.i) {
//here
console.log("fix5d",this.ch);	// 1
          } else {
console.log("fix5e",this.ch);	// 0
          }
        } else {
	  if (this.spt1.i==this.spt2.i) {
console.log("fix5f",this.ch);
          } else {
console.log("fix5g",this.ch);
          }
        }
      }
      if (this.spt1.i==this.spt2.i) {	// cw
	this.spt1=this.dpt1;
	this.spt2=this.dpt2;
	this.dpt1=pm.get(this.spt1.i+","+(this.spt1.l-1));
	this.dpt2=pm.get(((9+this.spt2.i)%8)+","+(this.spt2.l-1));
      } else {
        this.spt1=this.dpt1;
        this.spt2=this.dpt2;
        this.dpt1=pm.get(((7+this.spt1.i)%8)+","+(this.spt1.l-1));
        this.dpt2=pm.get(this.spt2.i+","+(this.spt2.l-1));
      }
temp=true;
    }
if (!this.dpt1) debugger;
if (!this.dpt2) debugger;
return temp;
  }
  this.show=()=>{	// diag
    drawPoint(this.spt1.x,this.spt1.y,"green",4);
if (!spt2) { console.log("mp",this); return false; }
    drawPoint(this.spt2.x,this.spt2.y,"cyan",4);
if (!dpt1) { console.log("mp",this); return false; }
    drawPoint(this.dpt1.x,this.dpt1.y,"magenta",4);
if (!dpt2) { console.log("mp",this); return false; }
    drawPoint(this.dpt2.x,this.dpt2.y,"white",4);
  }
if (!dpt2) {
 console.log(this);
debugger;
}
//return true;
}

var createPoints=()=>{
  //let ra=[180,120,90,72];
  let ra=[180,120,90];
  let ka=[];
  for (let i=0; i<ra.length; i++) {
    let pm=new Map(), pa=[];
    for (let j=0; j<=CSIZE/ra[i]; j++) {
      for (let k=0; k<=CSIZE/ra[i]; k++) {
        let pt=new Point(j,k,ra[i]);
        pa.push(pt);
        pm.set(pt.key,pt);
      }
    }
    ka.push({"R":ra[i],"nmax":CSIZE/ra[i],"pa":pa,"pm":pm});
  }
  return ka;
}
var kseta=createPoints();

var pa=[];
var pm=new Map();
for (let i=0; i<8; i++) {
  for (let j=0; j<6; j++) {
    let ro=(j%2)?TP/16:0;
    let x=ra[j]*Math.cos(i*TP/8+ro);
    let y=ra[j]*Math.sin(i*TP/8+ro);
    let pt=new Point2(i,j,x,y);
    pa.push(pt);
    pm.set(pt.key,pt);
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var tshow=false;	// for animate
var start2=()=>{
  stopped=true;
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  tshow=true;
  t=0;
  c=0;
  gpa=[generateGrowthPoint2(0)];
  gpa.push(generateGrowthPoint2(3));
//  gpa.push(generateGrowthPoint2(2));
//  gpa.push(generateGrowthPoint2(4));
ctx.setLineDash([90,90]);
//ctx.setLineDash([1,12]);
}
body.addEventListener("dblclick", start2, false);

var pauseTS=1000;
var pause=(ts)=>{
  //if (EM) { parent.postMessage("lf"); return; }
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var DUR=160;
var f=0;
var t=0;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  //for (let i=0; i<gpa.length; i++) {
  //  gpa[i].t++;
  //}
  t++,c++;
  if (t>DUR) {
    t=0;
    for (let i=0; i<gpa.length; i++) {
      let gt=gpa[i].grow();
if (!gt && ! gpa[i].state) debugger;
//      if (tshow && !gt) { gpa[i]=generateGrowthPoint2(0) }
      if (gpa[i].state) {
        gpa[i]=generateGrowthPoint2(0); 
      } 
      //gpa[i].type=Math.round(Math.random());
    }
    //cf=(1+2*Math.random())/2;
//    df=0.5+1.5*Math.random();
//    df2=0.5+1.5*Math.random();
/*
      if (tshow) { 
      pauseTS=performance.now()+100;
      requestAnimationFrame(pause);
      return; 
      }
*/
/*
    if (Math.random()<0.1) { 
      pauseTS=performance.now()+4000;
      requestAnimationFrame(pause);
      return; 
    }
*/
  }
  f=t/DUR;
  //f=Math.pow(Math.sin(TP/4*t/DUR),0.9);
//  f=Math.pow(t/DUR,0.1);
  draw();
  requestAnimationFrame(animate);
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dm2=new DOMMatrix([0,1,-1,0,0,0]);
var transformPath=(pth)=>{
if (tshow) {
  let p=new Path2D(pth);
  p.addPath(p,dmx);
  p.addPath(p,dmy);
  p.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));
  return p;
} else {
  return(pth);
}
/*
  let p=new Path2D(pth);
  p.addPath(p,dmx);
  p.addPath(p,dmy);
p.addPath(p,new DOMMatrix([0,1,-1,0,0,0]));
  return p;
*/
}

var cf=(1+Math.random())/2;
console.log("cf",cf);
var draw=()=>{
  let p=transformPath(gpa[0].getPath());
  for (let i=1; i<gpa.length; i++) { p.addPath(transformPath(gpa[i].getPath())); }
//  ctx.setLineDash([df2*KA.R,df*KA.R]);
  ctx.lineDashOffset=-c*cf;
  ctx.lineWidth=9;
  ctx.strokeStyle="#0000000A";
  ctx.stroke(p);
  ctx.lineWidth=2;
  ctx.strokeStyle=color.getRGB();
  ctx.stroke(p);
}

onresize();

var getKey=(point,da)=>{
  let key=",";
  if (da[0]==-1) key=(7+point.i)%8+key;
  else if (da[0]==1) key=(9+point.i)%8+key;
  else key=point.i+key;
  return key+(point.l+da[1]);
}

// 0                [0,1],[1,1]
// inner,inner,outer,outer clockwise
// 0                [-1,1],[0,1]
// 1        [0,-1], [0,1],[1,1]
// 2 [0,-1],[-1,-1],[-1,1],[0,1]
// 3 [1,-1],[0,-1], [0,1],[1,1]
// 4 [0,-1],[-1,-1],[-1,1],[0,1]
// 5 [1,-1],[0,-1]

const ka=[
  [1,-1],[0,-1], [0,1],[1,1],	// l%2
  [0,-1],[-1,-1],[-1,1],[0,1]
];

var generateGrowthPoint2=(init)=>{
  var point=init?pa[0]:pa[getRandomInt(0,pa.length)];
  //var point=Number.isInteger(init)?pm.get(getRandomInt(0,8)+","+init):pa[getRandomInt(0,pa.length)];
  //var point=pm.get(getRandomInt(0,8)+",3");
//var point=pm.get("3,3");
  if (point.l==0) {
    let pt1=pm.get(getKey(point,[-1,1]));
    let pt2=pm.get(getKey(point,[0,1]));
    let pt3=pm.get(point.i+",2");
    if (Math.random()<0.5) return new GP2(point,pt2,pt1,pt3,1);
    else return new GP2(point,pt1,pt2,pt3,0);
  } else if (point.l==1) {
    let idx=getRandomInt(0,3);
    if (idx==0) {
      let pt1=pm.get(getKey(point,[0,-1]));
      let pt2=pm.get(getKey(point,[0,1]));
      let pt3=pm.get(((7+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==1) {
      let pt1=pm.get(getKey(point,[0,1]));
      let pt2=pm.get(getKey(point,[1,1]));
      let pt3=pm.get(point.i+","+(point.l+2));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==2) {
      let pt1=pm.get(getKey(point,[1,1]));
      let pt2=pm.get(getKey(point,[1,-1]));
      let pt3=pm.get(((9+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    }
  } else if (point.l==2) {
//[0,-1],[-1,-1],[-1,1],[0,1]
//[0,-2],[-1,0],[0,2],[1,0]
    let idx=getRandomInt(0,4);
    if (idx==0) {
      let pt1=pm.get(getKey(point,[0,-1])); 
      let pt2=pm.get(getKey(point,[-1,-1]));
      let pt3=pm.get(point.i+","+(point.l-2));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==1) {
      let pt1=pm.get(getKey(point,[-1,-1]));
      let pt2=pm.get(getKey(point,[-1,1]));
      let pt3=pm.get(((7+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==2) {
      let pt1=pm.get(((7+point.i)%8)+","+(point.l+1));
      let pt2=pm.get(point.i+","+(point.l+1));
      let pt3=pm.get(point.i+","+(point.l+2));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==3) {
      let pt1=pm.get(point.i+","+(point.l+1));
      let pt2=pm.get(point.i+","+(point.l-1));
      let pt3=pm.get(((9+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    }
  } else if (point.l==3) {
//[1,-1],[0,-1],[0,1],[1,1]	// inner,inner,outer,outer clockwise
//[0,-2],[-1,0],[0,2],[1,0]	// pt3,0
//[0,-2],[1,0],[0,2],[-1,0]	// pt3,1
    let idx=getRandomInt(0,4);
    if (idx==0) {	// reverse
      let pt1=pm.get(getKey(point,[0,-1])); 
      let pt2=pm.get(getKey(point,[1,-1]));
      let pt3=pm.get(getKey(point,[0,-2]));
      return new GP2(point,pt1,pt2,pt3,1);
    } else if (idx==1) {
      let pt1=pm.get(getKey(point,[1,-1]));
      let pt2=pm.get(getKey(point,[1,1]));
      let pt3=pm.get(getKey(point,[1,0]));
      return new GP2(point,pt1,pt2,pt3,1);
    } else if (idx==2) {
      let pt1=pm.get(getKey(point,[1,1]));
      let pt2=pm.get(getKey(point,[0,1]));
      let pt3=pm.get(point.i+","+(point.l+2));
      return new GP2(point,pt1,pt2,pt3,1);
    } else if (idx==3) {
      let pt1=pm.get(getKey(point,[0,1]));
      let pt2=pm.get(getKey(point,[0,-1]));
      let pt3=pm.get(getKey(point,[-1,0]));
      return new GP2(point,pt1,pt2,pt3,1);
    }
/*
    if (idx==0) {	// normal
      let pt1=pm.get(getKey(point,[1,-1]));
      let pt2=pm.get(getKey(point,[0,-1])); 
      let pt3=pm.get(getKey(point,[0,-2]));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==1) {
      let pt1=pm.get(getKey(point,[0,-1]));
      let pt2=pm.get(getKey(point,[0,1]));
      let pt3=pm.get(getKey(point,[-1,0]));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==2) {
      let pt1=pm.get(getKey(point,[0,1]));
      let pt2=pm.get(getKey(point,[1,1]));
      let pt3=pm.get(point.i+","+(point.l+2));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==3) {
      let pt1=pm.get(getKey(point,[1,1]));
      let pt2=pm.get(getKey(point,[1,-1]));
      let pt3=pm.get(((9+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    }
*/
  } else if (point.l==4) {
//[0,-1],[-1,-1],[-1,1],[0,1] // 2 arrays of 3?
    let idx=getRandomInt(0,3);
    if (idx==0) {	// deprecate to array index
      let pt1=pm.get(point.i+","+(point.l-1));
      let pt2=pm.get(((7+point.i)%8)+","+(point.l-1));
      let pt3=pm.get(point.i+","+(point.l-2));
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==1) {
      let pt1=pm.get(((7+point.i)%8)+","+(point.l-1));
      let pt2=pm.get(((7+point.i)%8)+","+(point.l+1));
      let pt3=pm.get(((7+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    } else if (idx==2) {
      let pt1=pm.get(point.i+","+(point.l+1));
      let pt2=pm.get(point.i+","+(point.l-1));
      let pt3=pm.get(((9+point.i)%8)+","+point.l);
      return new GP2(point,pt1,pt2,pt3,0);
    }
  } else if (point.l==5) {
    let pt1=pm.get(((9+point.i)%8)+","+(point.l-1));
    let pt2=pm.get(point.i+","+(point.l-1));
    let pt3=pm.get(point.i+","+(point.l-2));
    if (Math.random()<0.5) return new GP2(point,pt2,pt1,pt3,1);
    return new GP2(point,pt1,pt2,pt3,0);
  } 
  return false;
}

let df=0.5+1.5*Math.random();
let df2=0.5+1.5*Math.random();

let gp=generateGrowthPoint2(0);
var gpa=[gp];

//start();

var showFrame=()=>{
}

let RES=80;
ctx.font="14px sans-serif";
ctx.textAlign="center";
ctx.fillStyle="white";
let p=new Path2D();
p.moveTo(0,0);
for (let i=1; i<RES; i++) {
  let z=i*TP/RES;
  let x=CSIZE/2*(Math.cos(z)-Math.cos(9*z));
  let y=CSIZE/2*(Math.sin(z)-Math.sin(9*z));
  p.lineTo(x,y);
  //if (i<17) ctx.fillText(i,x-4,y-6);
}
p.closePath();
ctx.strokeStyle="#666666";
ctx.stroke(p);

var drawKeys=()=>{
for (let i=0; i<pa.length; i++) {
  drawPoint(pa[i].x,pa[i].y);
  ctx.fillText(pa[i].key,pa[i].x-4,pa[i].y-6);
}
}
drawKeys();

gpa.forEach((gp)=>{ gp.show(); });

// generateGrowthPoint2 rationalize, reverse arrays 
// GP time offsets or pause
// vary dash
// level 2/3 turnable?
