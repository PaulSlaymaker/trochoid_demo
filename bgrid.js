"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=2*CSIZE;
  c.height=2*CSIZE;
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineWidth=8;
ctx.strokeStyle="black";
ctx.lineCap="round";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var corners=[
  //{"x":-CSIZE*Math.random(),"y":-CSIZE*Math.random()},
  //{"x":CSIZE*Math.random(),"y":-CSIZE},
  {"x":-CSIZE,"y":-CSIZE},
  {"x":CSIZE,"y":-CSIZE},
  {"x":CSIZE,"y":CSIZE},
  {"x":-CSIZE,"y":CSIZE},
];

const COUNT=9;

var getLanes=()=>{
  let s=[];
  for (let i=0; i<COUNT-1; i++) {
    if (blocked) {
      let v=block*Math.round(((CSIZE-20)*0.5*[-1,1][getRandomInt(0,2)])/block);
      s.push(v);
    } else s.push(getRandomInt(-CSIZE+20,CSIZE-20));
  }
  s.sort((a,b)=>{ return a-b; });
  s.unshift(-CSIZE+20);
  s.push(CSIZE-20);
  return s;
}

var lanesx=getLanes();
var lanesy=getLanes();

var locType="even";
var blocked=false;
var block=1;

var getSet=(uy)=>{
  let s=[];
  let d=2*(CSIZE-20)/(COUNT-1);
  for (let i=0; i<COUNT-1; i++) {
//if (Math.random()<0.5)
if (locType=="lanes") {
  if (uy) s.push(Math.round(lanesy[i]+(lanesy[i+1]-lanesy[i])*Math.random()));
  else s.push(Math.round(lanesx[i]+(lanesx[i+1]-lanesx[i])*Math.random()));
} else if (locType=="blanes") {
  if (uy) s.push(Math.round(lanesy[i]+(lanesy[i+1]-lanesy[i])*0.5));
  else s.push(Math.round(lanesx[i]+(lanesx[i+1]-lanesx[i])*0.5));
} else if (locType=="even") {
  if (blocked) {
    let v=block*Math.round((-CSIZE+20+i*d+d*0.5)/block);
    s.push(v);
  } else s.push(Math.round(-CSIZE+20+i*d+d*0.5));
  //s.push(Math.round(-CSIZE+20+i*d+d*fa));
  //let fa=[0,0.5,1][getRandomInt(0,3)];
//let fa=[1,10,20,40,80,120][getRandomInt(0,6)];
} else {
  if (blocked) {
    let v=block*Math.round((-CSIZE+20+i*d+d*Math.random())/block);
    s.push(v);
  } else {
    s.push(Math.round(-CSIZE+20+i*d+d*Math.random()));
  }
}
  }
  //for (let i=0; i<COUNT-1; i++) s.push(getRandomInt(-CSIZE+100,CSIZE-100));
  //for (let i=0; i<COUNT-1; i++) s.push(100*getRandomInt(-1,2));
  s.sort((a,b)=>{ return a-b; });
  s.unshift(-CSIZE+20);
  s.push(CSIZE-20);
  return s;
}

var colors=[];
var colors2=[];
var getColors=()=>{
  let c=[];
  let colorCount=getRandomInt(2,COUNT+5,true);
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=48+getRandomInt(0,31);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
    //c.push("hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var Point=function() {
  this.x=0;
  this.y=0;
  this.x2=0;
  this.y2=0;
}

var Quad=function() {
  this.pts=[new Point(),new Point(),new Point(),new Point()];
}
var quads=[];
for (let i=0; i<COUNT*COUNT; i++) quads.push(new Quad());

var qd=[];	// make object with 2 point arrays, getX?, draw fct

var randomizeQuads=()=>{
  //qd=[];
//  for (let i=0; i<COUNT*COUNT; i++) quads.push(new Quad());
  let x=[];
  let y=[];
  for (let i=0; i<COUNT+1; i++) {
    x.push(getSet());
    y.push(getSet(true));
  }
  for (let i=0,c=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++,c++) {
      quads[c].pts[0].x=x[i][j];
      quads[c].pts[1].x=x[i][j+1];
      quads[c].pts[2].x=x[i+1][j+1];
      quads[c].pts[3].x=x[i+1][j];

      quads[c].pts[0].y=y[j][i];
      quads[c].pts[1].y=y[j+1][i];
      quads[c].pts[2].y=y[j+1][i+1];
      quads[c].pts[3].y=y[j][i+1];
    }
  }
}

var randomizePolyX=()=>{
  qd=[];
  for (let i=0; i<COUNT*COUNT; i++) qd.push([new Point(),new Point(),new Point(),new Point()]);
  let x=[];
  let y=[];
  for (let i=0; i<COUNT+1; i++) {
    x.push(getSet());
    y.push(getSet());
  }

/*
var y=[
  [-CSIZE,getRandomInt(-CSIZE,CSIZE),CSIZE],
  [-CSIZE,getRandomInt(-CSIZE,CSIZE),CSIZE],
  [-CSIZE,getRandomInt(-CSIZE,CSIZE),CSIZE],
];
*/

  for (let i=0,c=0; i<COUNT; i++) {
    for (let j=0; j<COUNT; j++,c++) {
      qd[c][0].x=x[i][j];
      qd[c][1].x=x[i][j+1];
      qd[c][2].x=x[i+1][j+1];
      qd[c][3].x=x[i+1][j];

      qd[c][0].y=y[j][i];
      qd[c][1].y=y[j+1][i];
      qd[c][2].y=y[j+1][i+1];
      qd[c][3].y=y[j][i+1];
    }
  }


/*
    qd[0][0].x=x[0][0];
    qd[0][1].x=x[0][1];
    qd[0][2].x=x[1][1];
    qd[0][3].x=x[1][0];
    qd[0][0].y=y[0][0];
    qd[0][1].y=y[1][0];
    qd[0][2].y=y[1][1];
    qd[0][3].y=y[0][1];
    qd[1][0].x=x[0][1];
    qd[1][1].x=x[0][2];
    qd[1][2].x=x[1][2];
    qd[1][3].x=x[1][1];
    qd[1][0].y=y[1][0];
    qd[1][1].y=y[2][0];
    qd[1][2].y=y[2][1];
    qd[1][3].y=y[1][1];
    qd[2][0].x=x[1][0];
    qd[2][1].x=x[1][1];
    qd[2][2].x=x[2][1];
    qd[2][3].x=x[2][0];
    qd[2][0].y=y[0][1];
    qd[2][1].y=y[1][1];
    qd[2][2].y=y[1][2];
    qd[2][3].y=y[0][2];
    qd[3][0].x=x[1][1];
    qd[3][1].x=x[1][2];
    qd[3][2].x=x[2][2];
    qd[3][3].x=x[2][1];
    qd[3][0].y=y[1][1];
    qd[3][1].y=y[2][1];
    qd[3][2].y=y[2][2];
    qd[3][3].y=y[1][2];
*/

}

var randomizeX=()=>{
  //randomizePoly();
  randomizeQuads();
  setColors();

/*
  let XT=getRandomInt(-CSIZE,CSIZE);
  let XM=getRandomInt(-CSIZE,CSIZE);
  let XB=getRandomInt(-CSIZE,CSIZE);
  let YR=getRandomInt(-CSIZE,CSIZE);
  let YM=getRandomInt(-CSIZE,CSIZE);
  let YL=getRandomInt(-CSIZE,CSIZE);

  corners[0].x=-CSIZE;
  corners[0].y=-CSIZE;
  corners[1].x=XT;
  corners[2].x=XM
  corners[2].y=YM;
  corners[3].x=-CSIZE;
  corners[3].y=YL;

  corners2[0].x=XT;
  corners2[0].y=-CSIZE;
  corners2[1].x=CSIZE;
  corners2[1].y=-CSIZE;
  corners2[2].x=CSIZE;
  corners2[2].y=YR;
  corners2[3].x=XM;
  corners2[3].y=YM;

  corners3[0].x=XM;
  corners3[0].y=YM;
  corners3[1].x=CSIZE;
  corners3[1].y=YR;
  corners3[2].x=CSIZE;
  corners3[2].y=CSIZE;
  corners3[3].x=XB;
  corners3[3].y=CSIZE;

  corners4[0].x=-CSIZE;
  corners4[0].y=YL;
  corners4[1].x=XM;
  corners4[1].y=YM;
  corners4[2].x=XB;
  corners4[2].y=CSIZE;
  corners4[3].x=-CSIZE;
  corners4[3].y=CSIZE;
*/

//getSet();
}

var drawPolyFrac=(vertArray)=>{
  ctx.beginPath();
  ctx.moveTo(
    ( 
      frac*vertArray[0].x+(1-frac)*vertArray[0].x2+   
      frac*vertArray[1].x+(1-frac)*vertArray[1].x2   
    )/2,
    (
      frac*vertArray[0].y+(1-frac)*vertArray[0].y2+   
      frac*vertArray[1].y+(1-frac)*vertArray[1].y2   
    )/2
  );
  for (let i=0; i<4; i++) {
    let a=(i+1)%4;
    let b=(i+2)%4;
//    let x=(vertArray[a].x+vertArray[b].x)/2;
//    let y=(vertArray[a].y+vertArray[b].y)/2;
    ctx.bezierCurveTo(
      frac*vertArray[a].x+(1-frac)*vertArray[a].x2,
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2,
      frac*vertArray[a].x+(1-frac)*vertArray[a].x2,
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2,
      ( 
	frac*vertArray[a].x+(1-frac)*vertArray[a].x2+   
	frac*vertArray[b].x+(1-frac)*vertArray[b].x2   
      )/2,
    (
      frac*vertArray[a].y+(1-frac)*vertArray[a].y2+   
      frac*vertArray[b].y+(1-frac)*vertArray[b].y2   
    )/2
    );
  }
}

var drawPoly=(vertArray)=>{
//  let box=new Path2D();
  ctx.beginPath();
//  box.moveTo(vertArray[0].x,vertArray[0].y);
  ctx.moveTo(
    (vertArray[0].x+vertArray[1].x)/2,
    (vertArray[0].y+vertArray[1].y)/2
  );
  for (let i=0; i<4; i++) {
    let a=(i+1)%4;
//    box.lineTo(vertArray[a].x,vertArray[a].y);
    let b=(i+2)%4;
// frac here
    let x=(vertArray[a].x+vertArray[b].x)/2;
    let y=(vertArray[a].y+vertArray[b].y)/2;

    ctx.bezierCurveTo(
      vertArray[a].x,
      vertArray[a].y, 

      vertArray[a].x,
      vertArray[a].y, 
      (vertArray[a].x+vertArray[b].x)/2,
      y
    );
  }
  ctx.fill();
  ctx.stroke();

//ctx.strokeStyle="red";
//ctx.lineWidth=2;
//ctx.stroke(box);
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<COUNT*COUNT; i++) {
    //ctx.fillStyle=colors[i%colors.length];
    //drawPoly(qd[i]);
    drawPolyFrac(quads[i].pts);
ctx.globalAlpha=1-frac;
  ctx.fillStyle=colors2[i%colors2.length];
  ctx.fill();
ctx.globalAlpha=frac;
  ctx.fillStyle=colors[i%colors.length];
  ctx.fill();
ctx.globalAlpha=1;
  ctx.stroke();
  }
}

var transit=()=>{
  quads.forEach((q)=>{ 
    q.pts.forEach((p)=>{
      p.x2=p.x;
      p.y2=p.y;
    });
  });
  if (Math.random()<0.5) {
    blocked=true;
    block=[10,20,40,80,120][getRandomInt(0,5)];
  } else blocked=false;
if (Math.random()<0.5) {
  if (Math.random()<0.2) {
    locType=["lanes","blanes"][getRandomInt(0,2)];
  } else if (Math.random()<0.3) {
    locType="even";
  } else locType="eqr";
}
  if (locType=="lanes" || locType=="blanes") {
    lanesx=getLanes();
    lanesy=getLanes();
  }
  randomizeQuads();
  colors2=colors;
  colors=getColors();
}

var frac=1;
var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    if (frac>0) time=performance.now()-frac*duration;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
  }
}
//body.addEventListener("click", ()=>{ randomize(); draw(); }, false);
body.addEventListener("click", start, false);

var time=0;
const duration=4000;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (ts-time>duration) {
    frac=0;
    time=0;
    transit();
  } else {
    frac=Math.pow(Math.sin(TP/4*(ts-time)/duration),4);
  }
  draw();
  requestAnimationFrame(animate);
}

onresize();
//randomizePoly();
transit();
transit();
colors=getColors();
//draw();
start();
