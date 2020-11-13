'use strict';
const CSIZE=300;
const ctx=document.querySelector('#cta').getContext('2d');
onresize=function() {
  ctx.canvas.style.maxHeight=window.innerHeight-20+'px';
}
ctx.translate(CSIZE,CSIZE);
ctx.fillStyle='hsl(240,90%,70%)';

function dist(x1,y1,x2,y2) {
  return Math.pow(Math.pow(x2-x1,2)+Math.pow(y2-y1,2),0.5);
}

var OPTA=2.6;
var FADE=true;
//var VMAX=0.13;
//var VMAX=0.06;
var VMAX=0.09;
var REPULSE=7;
//var ATTR=0.06;
//var ATTR=0.027;
var ACUT=1;
var ATTR=0.18;
var EFACTOR=1;
var ADIST=20;
//var PREP=0.2;
var PREP=0;
var LF=function() {
  //this.x=200*(1-2*Math.random());
  //this.y=200*(1-2*Math.random());
  this.x=4-8*Math.random();
  this.y=4-8*Math.random();
  //this.x=0;
  //this.y=0;
  this.vx=VMAX*(1-2*Math.random());
  this.vy=VMAX*(1-2*Math.random());
  this.eccx=0.0005*(1-2*Math.random());
  this.eccy=0.0005*(1-2*Math.random());
  this.hue=240;
  //this.lum=70;
  this.radius=2;
  this.draw=function(td) {
    //let vxd=VMAX-Math.abs(this.vx);
    this.vx+=this.eccx*EFACTOR;
    //let zx=0.0003*Math.pow(dist(this.x,this.y,CSIZE-this.x,CSIZE-this.y),0.0001);
let radius=dist(this.x,this.y,0,0);
if (radius>CSIZE) {
REPULSE+=0.01;
console.log('from rad');
  debugger;
}
    let zz=REPULSE*Math.pow(1/(CSIZE-radius),2);
    //let zz=REPULSE*Math.pow(CSIZE-radius,0.001);
// TODO use x/y ratio, no use radial vector
    let zzx=Math.abs(this.x)/(Math.abs(this.x)+Math.abs(this.y))
    if (this.x<0) {
      this.vx+=zz*zzx;
    } else {
      this.vx-=zz*zzx;
    }
    if (Math.abs(this.vx)>VMAX) {
      this.vx=VMAX*Math.sign(this.vx);
    }
if (Math.abs(this.vx)>VMAX) debugger;
    // y y y y
    //let vyd=VMAX-Math.abs(this.vy);
    this.vy+=this.eccy*EFACTOR;
    //let zy=vyd*Math.pow((this.y/CSIZE),2);
    //let zy=0.02*Math.pow(Math.abs(this.y)/CSIZE,5);
    //let zy=0.0003*Math.pow(dist(this.x,this.y,CSIZE-this.x,CSIZE-this.y),0.0001);
    //let zy=0.0004*Math.pow(CSIZE-dist(this.x,this.y,0,0),0.001);
    if (this.y<0) {
      this.vy+=zz*(1-zzx);
    } else {
      this.vy-=zz*(1-zzx);
    }
    if (Math.abs(this.vy)>VMAX) {
      this.vy=VMAX*Math.sign(this.vy);
    }
if (Math.abs(this.vy)>VMAX) debugger;
    this.x+=td*this.vx;
if (Math.abs(this.x)>CSIZE) {
//REPULSE+=0.01;
//console.log('from x');
debugger;
}
    this.y+=td*this.vy;
if (Math.abs(this.y)>CSIZE) {
//REPULSE+=0.01;
//console.log('from y');
debugger;
}
//if (Math.pow(this.x*this.x+this.y*this.y,0.5)>CSIZE) {
if (dist(this.x,this.y,0,0)>CSIZE) {
REPULSE+=0.01;
console.log('from dist '+dist(this.x,this.y,0,0));
debugger;
}
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fillStyle='hsl('+this.hue+',90%,70%)';
    ctx.fill();
  }
}

var stopped=true;

const sp={
  b:(()=>{
	   let a=[];
	   for (let i=0; i<120; i++) {
	     a.push(new LF());
	   }
	   return a;
	 })(),
  aStart:0,
  aDuration:2000,
  //this.dFrac=1;
  nnSet:function() {
    let pd=0;
    for (let i=0; i<sp.b.length; i++) {
      let o1=sp.b[i];
      for (let j=i+1; j<sp.b.length; j++) {
        let o2=sp.b[j];
        let dx=Math.abs(o2.x-o1.x);
        let dy=Math.abs(o2.y-o1.y);
        if (dx<ADIST && dy<ADIST) {
          //let nnDist=dist(o1.x,o1.y,o2.x,o2.y);
	  let dx=o2.x-o1.x;
	  o1.vx-=PREP*Math.pow(1/dx,3);
	  //o1.vx+=ATTR/(o2.x-o1.x);
	  o1.vx+=Math.sign(dx)*ATTR*Math.pow(1/dx,2);
	  o1.vy-=PREP*Math.pow(1/(o2.y-o1.y),3);
	  let dy=o2.y-o1.y;
	  o1.vy+=Math.sign(dy)*ATTR*Math.pow(1/dy,2);
	  //o1.vy+=ATTR/(o2.y-o1.y);
	  if (dx<ACUT && dy<ACUT) {
//            if (dx<0.5 && dy<0.5) {
              o1.hue=Math.max(0,--o1.hue);
              o2.hue=Math.max(0,--o2.hue);
 //           }
            pd++;
            o1.radius=Math.max(o1.radius-.01,2);
            o2.radius=Math.max(o2.radius-.01,2);
//o1.lum=Math.min(100,o1.lum+0.001);
//o2.lum=Math.min(100,o2.lum+0.001);
	  }
        }
      } 
      o1.hue=Math.min(240,o1.hue+2);
      o1.radius=Math.min(o1.radius+.02,8);
//o1.lum=Math.max(70,o1.lum-0.001);
    }
    sp.pd=pd;
  },
  lastTS:0,
  adjust:function() {
    let cDist=sp.pd/sp.b.length;
    if (cDist<OPTA) {
      ATTR=Math.min(1, ATTR+(OPTA-cDist)/20*Math.random());
VMAX=Math.max(0.05,VMAX-0.01);
    } else {
      ATTR=Math.max(0.01, ATTR-(cDist-OPTA)/20*Math.random());
VMAX=Math.min(0.13,VMAX+0.01);
    }
  },
  animate:function(ts) {
    if (stopped) return;
    let td=ts-sp.lastTS;
    sp.lastTS=ts;
    if (td<100) { // prevent jumps
      sp.nnSet();
      if (!FADE) {
        ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      }
      for (let o of sp.b) {
	o.draw(td);
      }
    }
    if (!sp.aStart) {
      sp.aStart=ts;
    }
    let progress=ts-sp.aStart;
    if (progress<sp.aDuration) {
      //cSelf.dFrac=dProg/(cSelf.dDuration);
      //cSelf.draw();
    } else {
      sp.aStart=0;
      sp.adjust();
setTable();
      //cSelf.dFrac=0;
    }
    requestAnimationFrame(sp.animate);
  }
}

function start() {
  if (stopped) {
    stopped=false;
    sp.lastTS=performance.now();
    requestAnimationFrame(sp.animate);
    if (FADE) {
      requestAnimationFrame(fade.animate);
    }
  } else {
    stopped=true;
  }
}

var fade={
  start:0,
  animate:function(ts) {
    if (stopped) {
      return;
    }
    if (!fade.start) {
      fade.start=ts;
    }
    if (ts-fade.start>60) {
      let z=
      ctx.fillStyle='hsla(0,0%,0%,.05)';
      ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      fade.start=0;
    }
    requestAnimationFrame(fade.animate);
  }
}

function init() {
  ctx.canvas.addEventListener("click", start, false);
  start();
}

var SR=function(obj) {
  let row=document.createElement('tr');
  let label=document.createElement('td');
  label.textContent=obj.label;
  row.appendChild(label);
  document.querySelector('#reptable').appendChild(row);
  this.tds=[
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    },
    {
      from:row.appendChild(document.createElement('td')),
      to:row.appendChild(document.createElement('td'))
    }
  ];
  if (obj.hasOwnProperty('text1')) {
    for (let i=0; i<this.tds.length; i++) {
      this.tds[i].from.textContent=obj.text1;
    }
  }
  if (obj.hasOwnProperty('text2')) {
    for (let i=0; i<this.tds.length; i++) {
      this.tds[i].to.textContent=obj.text2;
    }
  }
  let sself=this;
  if (obj.hasOwnProperty('oc')) {
    this.report=function() {
      obj.oc(sself.tds);
    }
  } 
}

var srs=[
  new SR({
    label:'cDist',
    oc:function(tds) {
      tds[0].from.textContent=(sp.pd/sp.b.length).toFixed(1);
    }
  }),
];
function setTable() {
  for (let sr of srs) {
    sr.report();
  }
}

onresize();

init();

//function log(e) { console.log(Date().substring(16,25)+e); }
