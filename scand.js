"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";

const TP=2*Math.PI;

const ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  body.append(c);
  return c.getContext("2d");
})();

onresize=function() { 
  ctx.canvas.width=window.innerWidth; 
  ctx.canvas.height=window.innerHeight; 
  DX=ctx.canvas.width/2;
  DY=ctx.canvas.height/2;
  ctx.translate(DX,DY);
  ROWS=Math.floor(ctx.canvas.height/90);
  COLS=Math.floor(ctx.canvas.width/30);
  //PY=DY/ROWS;
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Shape=function() {
  this.olx=1;
  this.oly=1;
  this.gon=4;
  this.rot=0;
  this.rotAlt=false;
  this.randomize=(even)=>{
    if (even) {
      this.gon=[4,6,8][getRandomInt(0,3)];
    } else {
      this.gon=[4,6,3,8,5][getRandomInt(0,5,true)];
    }
    if (this.gon%2==1) {
      this.olx=1+0.7*Math.random();
      this.oly=1+2.5*Math.random();
    } else {
      this.olx=0.9+0.5*Math.random();
      this.oly=0.9+2.2*Math.random();
    }
    if (this.gon==3) {
      this.rot=TP/2;
    } else if (this.gon==4) {
      this.rot=[0,TP/8][getRandomInt(0,2)];
    } else if (this.gon==5) {
      this.rot=TP/2;
    } else if (this.gon==6) {
      this.rot=[0,TP/12][getRandomInt(0,2)];
    } else {
      this.rot=0;
    }
    if (this.rot>0) {
      if (this.gon%2==1) {
        this.rotAlt=true;
      } else {
        this.rotAlt=Math.random()<0.5?true:false;
      }
    } else {
      this.rotAlt=false;
    }
  }
}

var Pattern=function() {
  this.shapeSet="SSET";
  this.s1=new Shape();
  this.s2=new Shape();
this.shapes=[this.s1,this.s2];
  this.color="";
  this.bkg="";
  this.rows=ROWS;
  this.cols=COLS;
  //nested, repeated, repeat (odd poly) or pattern (1,1,2), clipped
  this.randomize=()=>{
    this.rows=getRandomInt(3,2*ROWS);
    this.cols=getRandomInt(10,2*COLS);
    this.shapeSet=["DSET","ASET","TSET","SSET"][getRandomInt(0,4)];
    //let hue=getRandomInt(0,360);
    let light="hsl("+getRandomInt(0,360)+",70%,70%)";
    let dark="hsl("+getRandomInt(0,360)+",50%,50%)";
    if (Math.random()<0.5) {
      this.color=light;
      this.bkg=dark;
    } else {
      this.color=dark;
      this.bkg=light;
    }
    let egon=this.shapeSet=="SSET"?false:true;
    this.shapes.forEach((s)=>{ s.randomize(egon); });
/*
    this.s1.randomize(egon);
    this.s2.randomize(egon);
*/
  }
  this.randomize();
}

var DX=400;
var DY=400;
var ROWS=10;
var COLS=36;
var M=0;

var draw=()=>{
  ctx.clearRect(-DX,-DY,ctx.canvas.width,ctx.canvas.height);
  let z=DX*(2*(M<0?1+M:M)-1);
  if (M<0) {
    ctx.fillStyle=P1.bkg;
    ctx.fillRect(-DX,-DY,DX+z,ctx.canvas.height);
    ctx.fillStyle=P2.bkg;
    ctx.fillRect(z,-DY,ctx.canvas.width,ctx.canvas.height);
  } else {
    ctx.fillStyle=P2.bkg;
    ctx.fillRect(-DX,-DY,DX+z,ctx.canvas.height);
    ctx.fillStyle=P1.bkg;
    ctx.fillRect(z,-DY,ctx.canvas.width,ctx.canvas.height);
  }

  let PX=DX/COLS*TP/2;

  let cx=0;
  let mx=(2*M-1)*DX;
  ctx.beginPath();
  for (let c=-TP/2-M*TP/4; c<TP/2-M*TP/4; c=c+TP/COLS) {
    if (Math.cos(c)<-0.01) continue;
    //if (Math.cos(c)<0) continue;
    let px=DX/COLS*TP/2*Math.cos(c);
    cx+=px;
    let L=(P1.shapeSet=="DSET"||P1.shapeSet=="TSET")?2:1;
    for (let i=0; i<L; i++) {
      //for (let ry=-DY-PY; ry<=DY+PY; ry+=2*PY) {
      for (let ry=-DY-3*DY/P1.rows, counter=0; ry<=DY+3*DY/P1.rows; ry+=2*DY/P1.rows, counter++) {
        if (P1.shapeSet=="TSET" && counter%2==0 && i==1) continue;
        let j=P1.shapeSet=="ASET"?counter%2:i;
        let fx=P1.shapes[j].olx*px;
        let fy=P1.shapes[j].oly*DY/P1.rows;
	let rot=P1.shapes[j].rot;
	if (P1.shapes[j].rotAlt && counter%2==0) rot=0;
	ctx.moveTo(fx*Math.cos(rot)+cx+mx,fy*Math.sin(rot)+ry);
	for (let t=0; t<=TP; t+=TP/P1.shapes[j].gon) {
	  ctx.lineTo(fx*Math.cos(t+rot)+cx+mx,fy*Math.sin(t+rot)+ry);
	}
      }
    }
    cx+=px;
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle=P1.color;
  ctx.fill("evenodd");

  cx=0;
  let m=M-1;
  if (m<-1) m+=2;
  mx=(2*m-1)*DX;
  ctx.beginPath();
  for (let c=-TP/2-m; c<TP/2-m; c=c+TP/COLS) {
    if (Math.cos(c)<-0.01) continue;
    let px=PX*Math.cos(c);
    cx+=px;

    let L=(P2.shapeSet=="DSET"||P2.shapeSet=="TSET")?2:1;
    for (let i=0; i<L; i++) {
      //for (let ry=-DY-3*DY/P2.rows; ry<=DY+3*DY/P2.rows; ry+=2*DY/P2.rows) {
      for (let ry=-DY-3*DY/P2.rows, counter=0; ry<=DY+3*DY/P2.rows; ry+=2*DY/P2.rows, counter++) {
        if (P2.shapeSet=="TSET" && counter%2==0 && i==1) continue;
        let j=P2.shapeSet=="ASET"?counter%2:i;
        let fx=P2.shapes[j].olx*px;
        let fy=P2.shapes[j].oly*DY/P2.rows;
	let rot=P2.shapes[j].rot;
	if (P2.shapes[j].rotAlt && counter%2==0) rot=0;
	//ctx.moveTo(P2.olx*px+cx-DX+2*m*DX,ry);
	ctx.moveTo(fx*Math.cos(rot)+cx+mx,fy*Math.sin(rot)+ry);
	for (let t=0; t<=TP; t+=TP/P2.shapes[i].gon) {
	  ctx.lineTo(fx*Math.cos(t+rot)+cx+mx,fy*Math.sin(t+rot)+ry);
	}
      }
    }
    cx+=px;
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle=P2.color;
  ctx.fill("evenodd");

  ctx.beginPath();
  ctx.moveTo(z,-DY);
  ctx.lineTo(z,DY);
  ctx.lineWidth=4;
  ctx.closePath();
  ctx.shadowColor="black";
  ctx.shadowBlur=10;
  ctx.stroke();
  ctx.lineWidth=1;
  ctx.shadowColor="rgb(0,0,0,0)";
}

var time=0;
var stopped=true;
var frac=1;
var animate=(ts)=>{
//  frac=ts-time;
//  time=ts;
  if (stopped) return;
  M+=0.004;
  //if (M>1.06) M=-1.06;
  if (M>1) {
    M=-1;
    P1.randomize();
  } else if (Math.abs(M)<0.002) {
    P2.randomize();
  }
  
  draw();
  requestAnimationFrame(animate);
}

var start=()=>{
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

/*
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
	let c=getStdRange(1,80,1);
	c.value=COLS;
	c.oninput=()=>{
	  COLS=parseFloat(c.value);
	  draw();
	}
	return c;
      })(),
      (()=>{
	let m=getStdRange(-1.1,1.1,0.01);
	m.value=M;
	m.oninput=()=>{
	  M=parseFloat(m.value);
	  draw();
	}
	return m;
      })(),
    );
    return d;
  })(),
);
*/

onresize();

const P1=new Pattern();
const P2=new Pattern();

//draw(1);
start();
