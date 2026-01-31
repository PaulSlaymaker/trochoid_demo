"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
const TP=2*Math.PI;
const S6=Math.sin(TP/6);
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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  //const CBASE=192;
  const CBASE=112;
  const CT=256-CBASE;
  this.getRGB=(o)=>{
    let red=Math.round(CBASE+CT*Math.cos(o*this.RK3+this.RK2+c/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(o*this.GK3+this.GK2+c/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(o*this.BK3+this.BK2+c/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=200+800*Math.random();
    this.GK1=200+800*Math.random();
    this.BK1=200+800*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
    this.RK3=Math.random();
    this.GK3=Math.random();
    this.BK3=Math.random();
  }
  this.randomize();
}
const color=new Color();
const cola=[new Color(),new Color(),new Color()];

var drawPoint=(x,y,col,r)=>{	// diag
  ctx.beginPath();
  let rad=r?r:3;
  ctx.arc(x,y,rad,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

ctx.font="9px sans-serif";
ctx.textAlign="center";

function Point(i,j,r) {
  const B1=TP/6+0.001; 
  const B2=TP/3-0.001; 
  this.i=i;
  this.j=j;
  if (j%2) this.x=i*r+r/2;
  else this.x=i*r;
if (r%2) this.x+=0.00001;
  this.y=S6*j*r;
  this.key=Math.round(this.x)+","+Math.round(this.y);
  if (j==0) this.b=false;
  else this.b=(Math.atan2(this.y,this.x)>B1 || Math.atan2(this.y,this.x-360)<B2);
  this.tu=false;	// triangle unit
  if (!this.b) {
    switch (j%6) {
      case 1: case 5:
	if (i%3==1) this.tu=true;
	break;
      case 2: case 4:
	if ((2+i)%3==2) this.tu=true;
    }
  }
  this.o=false;
}

var createPointMaps=()=>{
  let ra=[60,40,30,24,20,15,12,10,8]; //,15,12];	// CSIZE/r should be multiple of 3
  let km=[];
  for (let i=0; i<ra.length; i++) {
    let pm=new Map(), fpa=[], tua=[];
    for (let j=0; j<CSIZE/ra[i]+1; j++) {
      for (let k=0; k<CSIZE/(ra[i]*S6); k++) {
        let pt=new Point(j,k,ra[i]);
        pm.set(pt.key,pt);
        if (!pt.b) fpa.push(pt);
        if (pt.tu) tua.push(pt);
      }
    }
    // point map, fpa, triangle unit array
    km.push({"R":ra[i],"count":CSIZE/ra[i]+1,"pm":pm,"fpa":fpa,"tua":tua});
  }
  return km;
}
var ksetm=createPointMaps();

function Shape(pointArray,cpa) {
  this.pointArray=pointArray;
  this.draw=()=>{	// diag
    let p=new Path2D();
    p.moveTo(pointArray[0].x,pointArray[0].y);
    for (let i=1; i<pointArray.length; i++) {
      p.lineTo(pointArray[i].x,pointArray[i].y);
    }
    p.closePath();
ctx.strokeStyle="#FFFF00";
    ctx.stroke(p);
  }
  this.cx=pointArray.reduce((s,pt)=>{ return s+=pt.x; },0)/pointArray.length;
  this.cy=pointArray.reduce((s,pt)=>{ return s+=pt.y; },0)/pointArray.length;
  this.cshpa=new Array(pointArray.length).fill({"x":this.cx,"y":this.cy});
// Array method to extract mean
/*
  this.getCentralArrayShape=()=>{ 
    return new Shape(new Array(pointArray.length).fill({"x":this.cx,"y":this.cy}));
  }
*/
  this.getCptArray=()=>{
    let a=[];
    for (let i=0; i<pointArray.length; i++) {
      //let f=Math.sin(Math.PI*t/DUR)/2;
      let f=(t<this.td)?0:(t>DUR+this.td)?0:Math.sin(Math.PI*(t-this.td)/DUR)/1.7;
      let x=(1-f)*pointArray[i].x+f*this.cx;
      let y=(1-f)*pointArray[i].y+f*this.cy;
      a.push({"x":x,"y":y});
    }
    return a;
  }
  this.td=getRandomInt(0,tdiff);
}

var point;

var drawPoints=()=>{
  let km=KM;
  km.pm.forEach((pt)=>{
    let p=new Path2D();
    p.arc(pt.x,pt.y,3,0,TP);
    if (pt.b) ctx.fillStyle="red";
    else ctx.fillStyle="white";
    if (pt.tu) ctx.fillStyle="blue";
    ctx.fill(p);
    ctx.fillStyle="silver";
    //ctx.fillText(pt.key,pt.x,pt.y-6);
    ctx.fillText(pt.i+","+pt.j,pt.x,pt.y-6);
  });
}

var getNeighborPointsArray3=(fpt,km)=>{
  let ry=S6*km.R;
  let na=[];
  let tri2=[];
  if (fpt.j%6==1 || fpt.j%6==4) {
    let ntx=Math.round(fpt.x+3*km.R);
    if (ntx<=CSIZE) {
      let fpt2=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R));
      if (!fpt2.b && !fpt2.o) {
	let fptd1=km.pm.get(ntx+","+Math.round(fpt.y));
	if (!fptd1.b && !fptd1.o) {
	  let s={"sca":[fpt,fptd1,fpt2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+4.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
	    km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y+2*S6*km.R)),
	    km.pm.get(Math.round(fpt.x)+","+Math.round(fpt.y+2*S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
	  ];
	  na.push(s);
	}
	let fptd2=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+3*ry));
	if (!fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fptd2,fpt2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y+2*S6*km.R)),
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+5*S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
	  ];
	  na.push(s);
	}
	if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+4.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+5*S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
          ];
	  tri2.push(s);
        }
      }
    }
    let fpt2=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R));
    if (!fpt2.b && !fpt2.o) {
      let fptd1=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+3*S6*km.R));
      if (!fptd1.b && !fptd1.o) {
	let s={"sca":[fpt,fptd1,fpt2]};
	s.spa=[
          km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+5*S6*km.R)),
          km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y+2*S6*km.R)),
          km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
          km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
        ];
	na.push(s);
      }	
      let fptd2=km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y));
      if (!fptd2.b && !fptd2.o) {
	let s={"sca":[fpt,fptd2,fpt2]};
	s.spa=[
          km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
          km.pm.get(Math.round(fpt.x)         +","+Math.round(fpt.y+2*S6*km.R)),
          km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y+2*S6*km.R)),
          km.pm.get(Math.round(fpt.x-4.5*km.R)+","+Math.round(fpt.y-1*S6*km.R))
        ];
	na.push(s);
      }
      if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	s.spa=[
          km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R)),
          km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+5*S6*km.R)),
          km.pm.get(Math.round(fpt.x-4.5*km.R)+","+Math.round(fpt.y-S6*km.R))
	];
	tri2.push(s);
      }
    }
    let nty=Math.round(fpt.y-2*S6*km.R);
    if (nty>0) {
      fpt2=km.pm.get(Math.round(fpt.x)+","+nty);
      if (!fpt2.b && !fpt2.o) {
        let fptd1=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-3*S6*km.R));
        if (!fptd1.b && !fptd1.o) {
	  let s={"sca":[fpt,fptd1,fpt2]};
	  s.spa=[
            km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y+2*S6*km.R)),
            km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y-4*S6*km.R)),
            km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-4*S6*km.R)),
            km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
          ];
	  na.push(s);
        }
        let fptd2=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-3*S6*km.R));
        if (!fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fptd2,fpt2]};
	  s.spa=[
            km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-4*S6*km.R)),
            km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y-4*S6*km.R)),
            km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y+2*S6*km.R)),
            km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R))
          ];
	  na.push(s);
        }
	if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	  s.spa=[
            km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y+2*S6*km.R)),
            km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y-4*S6*km.R)),
            km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y-4*S6*km.R)),
	  ];
	  tri2.push(s);
	}
      }
    }
  } else {
    let fpt2=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-S6*km.R));
    if (!fpt2.b && !fpt2.o) {
      let fptd1=km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y));
      if (!fptd1.b && !fptd1.o) {
	let s={"sca":[fpt,fptd1,fpt2]};
	s.spa=[
	  km.pm.get(Math.round(fpt.x+4.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	  km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	  km.pm.get(Math.round(fpt.x)         +","+Math.round(fpt.y-2*S6*km.R)),
	  km.pm.get(Math.round(fpt.x+3*km.R)+  ","+Math.round(fpt.y-2*S6*km.R))
        ];
	na.push(s);
      }
      let nty=Math.round(fpt.y-3*km.R);
      if (nty>0) {
        let fptd2=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-3*S6*km.R));	//first one
        if (!fptd2.b && !fptd2.o) { 
	  let s={"sca":[fpt,fptd2,fpt2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-5*S6*km.R)),
	    km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y-2*S6*km.R)),
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R))
          ];
	  na.push(s);
        }
	if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y-5*S6*km.R)),
	    km.pm.get(Math.round(fpt.x+4.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R))
	  ];
	  tri2.push(s);
        }
      }
    }
    fpt2=km.pm.get(Math.round(fpt.x)+","+Math.round(fpt.y+2*S6*km.R));
    if (!fpt2.b && !fpt2.o) {
      let fptd1=km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+3*S6*km.R));
      if (!fptd1.b && !fptd1.o) { 
	let s={"sca":[fpt,fptd1,fpt2]};
	s.spa=[
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-2*S6*km.R)),
	  km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y+4*S6*km.R)),
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y+4*S6*km.R)),
	  km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R))
        ];
	na.push(s);
      }
      let fptd2=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+3*S6*km.R));
      if (!fptd2.b && !fptd2.o) { 
	let s={"sca":[fpt,fptd2,fpt2]};
	s.spa=[
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-2*S6*km.R)),
	  km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y+4*S6*km.R)),
	  km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y+4*S6*km.R))
        ];
	na.push(s);
      }
      if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	s.spa=[
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-2*S6*km.R)),
	  km.pm.get(Math.round(fpt.x+3*km.R)+","+Math.round(fpt.y+4*S6*km.R)),
	  km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y+4*S6*km.R))
	];
	tri2.push(s);
      }
    }
    fpt2=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-S6*km.R));
    if (!fpt2.b && !fpt2.o) {
      let fptd1=km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y));
      if (!fptd1.b && !fptd1.o) { 
	let s={"sca":[fpt,fptd1,fpt2]};
	s.spa=[
	  km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	  km.pm.get(Math.round(fpt.x-4.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	  km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y-2*S6*km.R)),
	  km.pm.get(Math.round(fpt.x)       +","+Math.round(fpt.y-2*S6*km.R))
	];
	na.push(s);
      }
      let nty=Math.round(fpt.y-3*S6*km.R);
      if (nty>=0) {
	let fptd2=km.pm.get(Math.round(fpt.x-1.5*km.R)+","+nty);
	if (!fptd2.b && !fptd2.o) { 
	  let s={"sca":[fpt,fptd2,fpt2]};
	  s.spa=[
	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-3*km.R)+","+Math.round(fpt.y-2*S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-5*S6*km.R)),
	  ];
	  na.push(s);
	}
        if (!fptd1.b && !fptd1.o && !fptd2.b && !fptd2.o) {
	  let s={"sca":[fpt,fpt2,fptd1,fptd2]};
	  s.spa=[
  	    km.pm.get(Math.round(fpt.x+1.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-4.5*km.R)+","+Math.round(fpt.y+S6*km.R)),
	    km.pm.get(Math.round(fpt.x-1.5*km.R)+","+Math.round(fpt.y-5*S6*km.R)),
	  ];
	  tri2.push(s);
        }
      }
    }
  }
  return {"trc":na,"tri2":tri2};
}

var getNeighborPointsArray2=(fpt,km)=>{
  let tri1={"spa":[],"sca":[fpt]};
  let arr=[{"spa":[],"sca":[fpt]},{"spa":[],"sca":[fpt]},{"spa":[],"sca":[fpt]}];
  let tri2={"spa":[],"sca":[fpt]};
  let r=S6*2*km.R;
  if (fpt.j%3==1) { // down
    //for (let a of [3*TP/12,7*TP/12,11*TP/12]) {
    for (let i=0; i<6; i++) {
      let a=3*TP/4+i*TP/6;
      let y=fpt.y+r*Math.sin(a);
      if (Math.round(y)<0) { continue; }
      let pt=km.pm.get(Math.round(fpt.x+r*Math.cos(a))+","+Math.round(fpt.y+r*Math.sin(a)));
//let pt=km.pm.get(Math.round(fpt.x+r*Math.cos(a)+0.00001)+","+Math.round(fpt.y+r*Math.sin(a)));
//if (pt==undefined) debugger;
      if (!pt.b && !pt.o) {
	if (i%2) {
	  arr[0].spa.push(pt);
	  arr[1].spa.push(pt);
	  arr[2].spa.push(pt);
	  tri1.spa.push(pt);
	} else {
	  let vpt=km.pm.get(Math.round(fpt.x+2*r*Math.cos(a))+","+Math.round(fpt.y+2*r*Math.sin(a)));
	  arr[i%2/2].spa.push(vpt);
	  arr[i%2/2].sca.push(pt);
	  tri2.spa.push(vpt);
	  tri2.sca.push(pt);
	}
      }
    }
  }
  if (fpt.j%3==2) { 
    for (let i=0; i<6; i++) {
      let a=TP/4+i*TP/6;
      let pt=km.pm.get(Math.round(fpt.x+r*Math.cos(a))+","+Math.round(fpt.y+r*Math.sin(a)));
//let pt=km.pm.get(Math.round(fpt.x+r*Math.cos(a)+0.00001)+","+Math.round(fpt.y+r*Math.sin(a)));
//if (pt==undefined) debugger;
      if (!pt.b && !pt.o) {
	if (i%2) {
	  arr[0].spa.push(pt);
	  arr[1].spa.push(pt);
	  arr[2].spa.push(pt);
	  tri1.spa.push(pt);
        } else {
	  let vpt=km.pm.get(Math.round(fpt.x+2*r*Math.cos(a))+","+Math.round(fpt.y+2*r*Math.sin(a)));
	  arr[i%2/2].spa.push(vpt);
	  arr[i%2/2].sca.push(pt);
	  tri2.spa.push(vpt);
	  tri2.sca.push(pt);
        }
      }
    }
  }
  arr=arr.filter((s)=>{ return s.spa.length==4; });
  tri2=(tri2.spa.length==3)?[tri2]:[];
  return {"tri1":tri1,"dia":arr,"tri2":tri2};
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

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) { parent.postMessage("lf"); return; }
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var DUR=100;
var tdiff=40;
var t=0;
var c=0;

var animate=(ts)=>{
  if (stopped) return;
  t++,c++;
  if (t>DUR+tdiff) {
  //if (t>DUR) {
    t=0;
    //KM=ksetm[getRandomInt(2,ksetm.length-1)];
    KM=ksetm[[4,5,3,6,2,7,8][getRandomInt(0,7,true)]];
    sa=sa2;
    sa2=getRandomShapeArray();
    pauseTS=performance.now()+2000;
    drawN2();
    type=[0,0,0,2,1,3][getRandomInt(0,6,true)];
    requestAnimationFrame(pause);
  } else {
    drawN2();
    requestAnimationFrame(animate);
  }
}

function cFrac(frac) {
  let f1=.1;
  let f2=.9;
  let e2=3*frac*Math.pow(1-frac,2)*f1;
  let e3=3*(1-frac)*Math.pow(frac,2)*f2;
  let e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var transformPath=(pth)=>{
  const dmx=new DOMMatrix([-1,0,0,1,0,0]);
  let p=new Path2D();
  p.addPath(pth,new DOMMatrix([S6,0.5,-0.5,S6,0,0]));
  let p2=new Path2D(p);
  p2.addPath(p2,new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]));
  p2.addPath(p2,new DOMMatrix([-0.5,-S6,S6,-0.5,0,0]));
  p2.addPath(p2,dmx);
  return p2;
}


var drawN2=(l)=>{
if (!l)  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE)
  let f=cFrac(t/DUR);
  let minsa=Math.min(sa.length,sa2.length); 
  let maxsa=Math.max(sa.length,sa2.length); 
  for (let i=0; i<maxsa; i++) {
    let p=new Path2D();

if (sa[i]==undefined) sa[i]=new Shape(sa2[i].cshpa);
if (sa2[i]==undefined) sa2[i]=new Shape(sa[i].cshpa);
//if (sa[i]==undefined) sa[i]=sa2[i].getCentralArrayShape();
//if (sa2[i]==undefined) sa2[i]=sa[i].getCentralArrayShape();
    let f=(t<sa[i].td)?0:(t>DUR+sa[i].td)?1:cFrac((t-sa[i].td)/DUR);

//    let ptArray1=sa[i].pointArray;
//    let ptArray2=sa2[i].pointArray;
let ptArray1=sa[i].getCptArray();
let ptArray2=sa2[i].getCptArray();

    let x1=(1-f)*ptArray1[0].x+f*ptArray2[0].x;
    let y1=(1-f)*ptArray1[0].y+f*ptArray2[0].y;
    let x2=(1-f)*ptArray1[1].x+f*ptArray2[1].x;
    let y2=(1-f)*ptArray1[1].y+f*ptArray2[1].y;
    let x=(x1+x2)/2;
    let y=(y1+y2)/2;

    p.moveTo(x,y);
    let len=Math.max(ptArray1.length,ptArray2.length);
    //for (let j=1; j<ptArray.length+1; j++) {
    for (let j=1; j<len+1; j++) {
      let jd0=j%ptArray1.length;
      let jd1=(j+1)%ptArray1.length;
      let je0=j%ptArray2.length;
      let je1=(j+1)%ptArray2.length;
//if (jd0>len-1) jd0=len-1; // jd0=0;
//if (jd1>len-1) jd1=len-1;
//if (jd0>len-1) continue;
//if (jd1>len-1) continue;
//if (jd0>len-1) jd0=0;
//if (jd1>len-1) jd1=0
      let x1=(1-f)*ptArray1[jd0].x+f*ptArray2[je0].x;
      let y1=(1-f)*ptArray1[jd0].y+f*ptArray2[je0].y;
//if (ptArray2[jd1]==undefined) debugger;
      let x2=(1-f)*ptArray1[jd1].x+f*ptArray2[je1].x;
      let y2=(1-f)*ptArray1[jd1].y+f*ptArray2[je1].y;

      //p.quadraticCurveTo(p1.x,p1.y,(p1.x+p2.x)/2,(p1.y+p2.y)/2);
      //p.bezierCurveTo(p1.x,p1.y,p1.x,p1.y,(p1.x+p2.x)/2,(p1.y+p2.y)/2);
      p.bezierCurveTo(x1,y1,x1,y1,(x1+x2)/2,(y1+y2)/2);
    }
//p.closePath();
//    p.addPath(p,new DOMMatrix([-0.5,S6,-S6,-0.5,0,0]));

if (!l) p=transformPath(p);

    ctx.strokeStyle="black";
    ctx.lineWidth=1;
    ctx.stroke(p);

if (l) {
  ctx.strokeStyle=color.getRGB(i);
  ctx.lineWidth=3;
  ctx.stroke(p);
} else {
  ctx.fillStyle=cola[i%3].getRGB(0);
  ctx.fill(p);
}

    if (t<5 || t>DUR-10) {
    //if (t<10 || t>DUR+tdiff-20) {
      ctx.strokeStyle="black";
      ctx.lineWidth=0.5;
      ctx.stroke(p);
      ctx.strokeStyle="#00000020";
      ctx.lineWidth=3;
      ctx.stroke(p);
    }
  }
}

onresize();

var type=0;

var getRandomShape=(km)=>{
  let oa=km.tua.filter((a)=>{ return a.o==false; });
  point=oa[getRandomInt(0,oa.length)];	// random control point
  if (point==undefined) return false;
  let soa=getNeighborPointsArray2(point,km);
  let lsa=[soa.tri1];

  if (type==1) {
    if (soa.dia.length) lsa=soa.dia;
  } else if (type==2) {
    let soa2=getNeighborPointsArray3(point,km);
    let tri2=soa.tri2.concat(soa2.tri2);
    if (tri2.length) lsa=tri2;
  } else if (type==3) {
    let soa2=getNeighborPointsArray3(point,km);
    if (soa2.trc.length) lsa=soa2.trc;
  } else {
    lsa=lsa.concat(soa.dia);
    lsa=lsa.concat(soa.tri2);
    let soa2=getNeighborPointsArray3(point,km);
    lsa=lsa.concat(soa2.trc);
    lsa=lsa.concat(soa2.tri2);
  }

//if (lsa.length==0) debugger;
//lsa.reverse();
//lsa.sort((a,b)=>{ return b.spa.length-a.spa.length; });
//let shape=lsa[getRandomInt(0,lsa.length,true)];
  let shape=lsa[getRandomInt(0,lsa.length)];

/*
if (shape.spa.length<3) {  // up,down?
drawPoint(tp.x,tp.y,"white",7);
  console.log(tp);
  console.log(lsa);
  console.log(shape);
  debugger;
}
*/

  for (let i=0; i<shape.sca.length; i++) shape.sca[i].o=true;
  return new Shape(shape.spa);
}

var KM=ksetm[4];

var getRandomShapeArray=()=>{
  let km=KM;
  for (let i=0; i<km.tua.length; i++) km.tua[i].o=false;
  let sar=[];
  for (let i=0; i<km.tua.length; i++) {	// max ks.tua.length, certain to fill tiles?
//  for (let i=0; i<1; i++) {
    let randShape=getRandomShape(km);
    if (!randShape) break;
    sar.push(randShape);
  }
  sar.sort((a,b)=>{ return a.pointArray.length-b.pointArray.length; });
  return sar;
}

var sa=getRandomShapeArray();
var sa2=getRandomShapeArray();

//drawPoints();

/*
//let pt0=KM.pm.get("180,104");
//let pt0=KM.pm.get("135,130"); // up
let pt0=KM.pm.get("225,130"); // up
//console.log(pt0);
for (let i=0; i<6; i++) {
  let a=i*TP/6;
  let pt=KM.pm.get(Math.round(pt0.x+3*KM.R*Math.cos(a))+","+Math.round(pt0.y+3*KM.R*Math.sin(a)));
  if (pt.b) continue;
  drawPoint(pt.x,pt.y,"magenta");
}
*/

start();

// sa sorts: pa.length (to smooth), shape area, location (radius/angle) (shorten transit)
// cl code: old prog, ks
// hex shape
// two 3,4 pointArray groups for transit (sort?, permanent state?)
// tri draw, vane,line,circ,fill
// variable/skewed triangle drawing durations, ?size-based, ?distance-based
// radial switch?, sa sorts?
// add 3 lines to large triangle?
