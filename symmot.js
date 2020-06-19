"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);

const TP=2*Math.PI;

const ctx=(()=>{
  let d=document.createElement("div");
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  d.append(c);
  body.append(d);
  return c.getContext("2d");
})();

//var ctx=canvas.getContext('2d');

onresize=function() { 
  //canvas.width=window.innerWidth; 
  //canvas.height=window.innerHeight; 
  ctx.canvas.width=ctx.canvas.parentElement.offsetWidth; 
  ctx.canvas.height=ctx.canvas.parentElement.offsetHeight; 
//  ctx.fillStyle="#4444AA";
  ctx.lineWidth=0.2;
//ctx.shadowColor="black";
//ctx.shadowBlur=20;
  //cancelAnimationFrame(AF);
  //stopped=true;
  setPoints();
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var pts=[];
var R=100;
var kf=1;
var O=0;
var C=32;
//var F1=3;
//var F2=9;
//var sType=["A","B"][getRandomInt(0,2)];
var atype=true;

var Shape=function() {
  this.K=R/2;
  this.F1=1;
  this.F2=1;
  this.F3=1;
  this.rf=[-1,1][getRandomInt(0,2)];
  this.rf2=[-1,1][getRandomInt(0,2)];
  this.rf3=[-1,1][getRandomInt(0,2)];
  this.randomizeFactors=()=>{
    this.K=R*(0.6-0.2*Math.random());
    let counter=0;
//    do {
      this.rf=[-1,1][getRandomInt(0,2)];
//this.rf=1;
//this.rf2=1;
      if (atype) {
	this.F1=1;
        if (this.rf==1) {
	  this.F2=1;
          if (this.rf2==1) this.F3=1;
          else this.F3=3;
        } else {
	  this.F2=3;
          if (this.rf2==1) this.F3=1;
          else this.F3=3;
        }
      } else {
	this.F1=3;
        if (this.rf==1) {
	  this.F2=3;
          if (this.rf2==1) this.F3=3;
          else this.F3=1;
        } else {
	  this.F2=1;
          if (this.rf2==1) this.F3=3;
          else this.F3=1;
        }
      }
      this.F1+=4*getRandomInt(0,40);
      this.F2+=4*getRandomInt(0,40);
      this.F3+=4*getRandomInt(0,40);
//let bd=Number.isInteger((this.F1+this.F2)/C);
//if (bd) console.log("blank skip");
    //} while (Number.isInteger((this.F1+this.F2)/C) && counter++<5);
  }
  this.getX=(t)=>{
    return this.K*(Math.sin(this.F1*t)+Math.sin(this.F2*t)+this.rf2*Math.sin(this.F3*t));
  }
  this.getY=(t)=>{
    return this.K*(Math.cos(this.F1*t)+this.rf*Math.cos(this.F2*t)+Math.cos(this.F3*t));
  }
}

var setPoints=()=>{
//  do {
  //R=200+200*Math.random();
  R=ctx.canvas.width/4;  // min/max, 2-300px optimum?
  pts=[];
  for (let x=-R; x<=ctx.canvas.width+R; x+=R) {
    for (let y=-R; y<=ctx.canvas.height+R; y+=R) { pts.push([x,y]); }
  }
//  } while (pts.length%2==0);
}

var draw=(frac)=>{
  ctx.fillStyle=fillStyleb;
  ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  for (let i=0; i<pts.length; i++) {
    let x=pts[i][0];
    let y=pts[i][1];
    let q=(i%2==0)?-1:1;
//    let xn=(1-frac)*s1.getX(q*O)+frac*s2.getX(q*O);
//    let yn=(1-frac)*s1.getY(q*O)+frac*s2.getY(q*O);
    let xn=0.6*((1-frac)*s1.getX(q*O)+s2.getX(q*O)+frac*s3.getX(q*O));
    let yn=0.6*((1-frac)*s1.getY(q*O)+s2.getY(q*O)+frac*s3.getY(q*O));
    ctx.moveTo(x+kf*xn,y+kf*yn);
    for (let j=0; j<=C; j++) {
      let rv=j*TP/C+q*O;
      //let px=(1-frac)*s1.getX(rv)+frac*s2.getX(rv);
      //let py=(1-frac)*s1.getY(rv)+frac*s2.getY(rv);
      let px=0.6*((1-frac)*s1.getX(rv)+s2.getX(rv)+frac*s3.getX(rv));
      let py=0.6*((1-frac)*s1.getY(rv)+s2.getY(rv)+frac*s3.getY(rv));
//(1-frac)*s1.K*(Math.sin(s1.F1*rv)+Math.sin(s1.F2*rv))+frac*s2.K*(Math.sin(s2.F1*rv)+Math.sin(s2.F2*rv));
//let py=(1-frac)*s1.K*(Math.cos(s1.F1*rv)+s1.rf*Math.cos(s1.F2*rv))+frac*s2.K*(Math.cos(s2.F1*rv)+s2.rf*Math.cos(s2.F2*rv));
      ctx.lineTo(x+kf*px,y+kf*py);
    }
  }
  ctx.closePath();
  ctx.fillStyle=fillStyle1;
  ctx.fill();
  ctx.fillStyle=fillStyle2;
  ctx.fill("evenodd");
  ctx.stroke();
}

var time=0;
var stopped=true;
var frac=1;
//var duration=20000;
var duration=5000;
//var duration=2000;
var AF=0;
var state="ST";
var animate=(ts)=>{
  if (stopped) return;
/*
    O+=0.00005;	// TP/C cycle
    kf=1-Math.sin(O)/6;
    draw(1);
    AF=requestAnimationFrame(animate);
*/
  if (!time) { time=ts; }
  let progress=ts-time;
  if (progress<duration) {
    frac=progress/duration;
    if (state=="ST") {
    } else if (state=="TI") {
      //ctx.globalAlpha=Math.pow(1-frac,2);;
      ctx.globalAlpha=1-frac;
    } else if (state=="TO") {
      //ctx.globalAlpha=Math.pow(frac,2);
      ctx.globalAlpha=frac;
    }
    draw(frac);
  } else {

    if (state=="TI") {
      state="TO";
      randomize();
    } else if (state=="TO") {
      ctx.globalAlpha=1;
      state="ST";
    } else if (state=="ST") {
      if (Math.random()<0.3) {
        state="TI";
console.log("transit");
      }
    } 

    s1.F1=s2.F1;
    s1.F2=s2.F2;
    s1.F3=s2.F3;
    s1.rf=s2.rf;
    s1.rf2=s2.rf2;
    s1.K=s2.K;

    s2.F1=s3.F1;
    s2.F2=s3.F2;
    s2.F3=s3.F3;
    s2.rf=s3.rf;
    s2.rf2=s3.rf2;
    s2.K=s3.K;

    //s2.randomizeFactors();
    s3.randomizeFactors();


//if (Math.abs(s1.F1-s1.F2)%C==Math.abs(s2.F1-s2.F2)%C) { console.log(s1.F1+" "+s1.F2+" "+s1.rf+" "+s2.F1+" "+s2.F2+" "+s2.rf); }
    time=0;
    frac=0;
//if (Number.isInteger((s1.F1+s1.F2)/C)) {
//  console.log("blank");
//} else if (Number.isInteger((s1.F1+s1.F2)/(C/2))) {
//} else if (Number.isInteger(Math.abs(s1.F1-s1.rf*s1.F2)/(C/2))) {
//}
  }
  AF=requestAnimationFrame(animate);
}

var fHue1=getRandomInt(0,360);
var fillStyle1="hsl("+fHue1+",80%,40%)";
var strokeStyle1="hsl("+fHue1+",80%,10%)";
var fillStyle2="hsl("+getRandomInt(0,360)+",85%,70%)";
var fillStyleb="hsl("+getRandomInt(0,360)+",90%,50%)";

var randomize=()=>{
  fHue1=getRandomInt(0,360);
  var fillStyle1="hsl("+fHue1+",85%,30%)";
  ctx.strokeStyle="hsl("+fHue1+",85%,10%)";
  fillStyle2="hsl("+getRandomInt(0,360)+",80%,70%)";
  fillStyleb="hsl("+getRandomInt(0,360)+",90%,50%)";
  ctx.fillStyle=fillStyle1;

  C=4*getRandomInt(2,22,true);
  //C=8;

    O=0;

  if (Math.random()<0.3) atype=!atype;

s1.randomizeFactors();
s2.randomizeFactors();
s3.randomizeFactors();
setControls();
}

var start=()=>{
  if (stopped) {
    O=0;
// use frac to set time
  if (frac>0) {
    time=performance.now()-frac*duration;
  } else {
    time=0;
  }
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var s1=new Shape();
var s2=new Shape();
var s3=new Shape();

var controls=[];
body.append(
  (()=>{
    var getStdRange=(min,max,step,name)=>{
      let sr=document.createElement("input");
      sr.type="range";
      sr.min=min;
      sr.max=max;
      sr.step=step;
      sr.style.display="block";
      sr.onmouseover=()=>{ sr.title=sr.value; }
      return sr;
    }
    let d=document.createElement("div");
    d.style.gridColumn="2";
    d.append(
      (()=>{
	let f1=getStdRange(1,120,2);
	f1.value=s1.F1;
	f1.oninput=()=>{
	  s1.F1=parseInt(f1.value);
	  draw(0);
	}
        f1.set=()=>{ f1.value=s1.F1; }
        controls.push(f1);
	return f1;
      })(),
      (()=>{
	let f2=getStdRange(1,120,2);
	f2.value=s1.F2;
	f2.oninput=()=>{
	  s1.F2=parseInt(f2.value);
	  draw(0);
	}
        f2.set=()=>{ f2.value=s1.F2; }
        controls.push(f2);
	return f2;
      })(),
      (()=>{
	let c=getStdRange(4,100,1);
	c.oninput=()=>{
	  C=parseInt(c.value);
	  draw(1);
	}
        c.set=()=>{ c.value=C; }
        controls.push(c);
	return c;
      })(),
/*
      (()=>{
	let k=getStdRange(1,400,0.5);
	k.oninput=()=>{
	  K=parseFloat(k.value);
	  draw(1);
	}
        k.set=()=>{ k.value=K; }
        controls.push(k);
	return k;
      })(),
*/
      (()=>{
	let o=getStdRange(-3,3,0.0001);
	o.value=O;
	o.oninput=()=>{
	  O=parseFloat(o.value);
	  draw(frac);
	}
	return o;
      })(),
    );
    return d;
  })(),
);
var setControls=()=>{
  for (let con of controls) { con.set(); }
}

onresize();
randomize();

//draw(0);
start();
