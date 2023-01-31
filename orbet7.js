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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var colors=[];
var hues=[];
var setColors=()=>{
  colors=[];
  let colorCount=4;
  //let h=getRandomInt(180,270);
  let h=getRandomInt(0,360);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(150/colorCount)*i+getRandomInt(-10,10);
    let hue=(h+hd)%360;
    hues.splice(getRandomInt(0,hues.length+1),0,hue);
  }
  for (let i=0; i<colorCount; i++) colors[i]="hsl("+hues[i]+",98%,60%)";
}
setColors();

function Branch(idx) {
  this.reset=()=>{
    this.rxa=20+(count-idx)*(CSIZE-80)/(2*count);
    //this.ra=Math.random();	// growth angle*TP/4
    //this.ra=Math.pow(Math.random(),0.4);	// growth angle*TP/4
    this.ra=0.5+0.5*Math.random();
    this.K1=8-16*(Math.random()+0.2);
    this.kk=TP*Math.random();
    this.kdim=28+14*Math.random();
    this.tf=100+20*getRandomInt(1,13);
    this.ff1=getRandomInt(10,22);
    this.ff2=getRandomInt(4,50);
  }
  this.reset();
}

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var pause=0;
function animate(ts) {
  if (stopped) return;
  t+=2;
  if (t%6==0) {
    for (let i=0; i<hues.length; i++) {
      hues[i]=++hues[i]%360;
      colors[i]="hsl("+hues[i]+",98%,60%)";
    }
  }
  if (pause<100) {
    if (draw()==0) pause++;
  } else if (pause++<200) {
    ctx.canvas.style.opacity=1-(pause-100)/100;
  } else {
    ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
    ctx.canvas.style.opacity=1;
    count=getRandomInt(3,8);
    ba.forEach((b)=>{ b.reset(); }); 
    setColors();
    t=0;
    pause=0;
  }
  requestAnimationFrame(animate);
}

onresize();

const dm1=new DOMMatrix([-1,0,0,1,0,0]);

var count=6;

/*
var ells=()=>{
  ctx.strokeStyle="red";
for (let i=0; i<count; i++) {
  //if (xf<1) ctx.ellipse(xf*rxa[i],CSIZE,rxa[i],rya[i],0,0,5*TP/8,true);
  //else ctx.ellipse(xf*rxa[i],CSIZE,rxa[i],rya[i],0,TP/2,7*TP/8);
  let y0=CSIZE-580*ba[i].rxa/CSIZE*2;
//  if (xf<1) ctx.ellipse(xf*rxa[i],y0,rxa[i],100,0,0,5*TP/8,true);
//  else ctx.ellipse(xf*rxa[i],y0,rxa[i],YR,0,TP/2,7*TP/8);
  let p=new Path2D();
  //p.ellipse(rxa[i],y0,rxa[i],YR,0,TP/2,7*TP/8);
  p.ellipse(ba[i].rxa,y0,ba[i].rxa,YR,0,TP/2,3*TP/4+TP/4*ba[i].ra);
  p.addPath(p,dm1);
//  ctx.strokeStyle=colors[getRandomInt(0,colors.length)];
  ctx.stroke(p);
}
}
*/

var ba=[];
for (let i=0; i<7; i++) ba.push(new Branch(i));

ctx.lineWidth=4;
const YR=200;

var draw=()=>{
  let s=0;
  for (let i=0; i<count; i++) {
    let y0=CSIZE-580*ba[i].rxa/CSIZE*2;
    let dt1=580*ba[i].rxa/CSIZE*2;
    ctx.strokeStyle=colors[i%colors.length];
    //let q=(ba[i].ra+0.25)*TP*(YR+ba[i].rxa)/2.3;	// 2->2.3 empirical
    let dt2=(ba[i].ra+0.25)*TP*(YR+ba[i].rxa)/2.3;	// 2->2.3 empirical
    //var dim=2+40*(1-t/(dt1+dt2));
    //var dim=3+40*Math.pow(1-t/(dt1+dt2),0.9);
    let dim=3+ba[i].kdim*Math.pow(1-t/(dt1+dt2),0.9);
//let q=(3*TP/4+TP/4*ra[1]-TP/2)*(300+rxa[1])/2;
//let q=300; //(3*TP/4+TP/4*ra[i]-TP/2)*(YR+rxa[i])/1.2;	// 2->1.2 empirical
    let dz=ba[i].kk+ba[i].K1*t/600;
    let dx1=dim*Math.cos(dz);//ba[i].kk+ba[i].K1*t/600);
    let dy=dim*Math.sin(dz);//ba[i].kk+ba[i].K1*t/600);
    //if (t<CSIZE-y0) {
    if (t<dt1) {
      let pd=new Path2D();
      pd.arc(0,CSIZE-t,dim+2,0,TP);
ctx.fillStyle="#00000003";
      ctx.fill(pd);
/*
      let p1=new Path2D();
      p1.arc(0,CSIZE-t,dim,0,TP);
      ctx.fillStyle=colors[i%colors.length];
      ctx.fill(p1);
*/
      let p1=new Path2D();
      p1.moveTo(-dx1,CSIZE-t-dy);
      p1.lineTo(dx1,CSIZE-t+dy);
      p1.addPath(p1,dm1);
      ctx.stroke(p1);
      s++;
    } else if (t-dt1<dt2) {
      let z1=t-dt1;
      let z=TP/2+z1*(TP/4+TP/4*ba[i].ra)/dt2;
      //let z=TP/2+z1*(3*TP/4+TP/4*ra[1]-TP/2)/200;
      //let z=TP/2+z1*TP/q;
      let x=ba[i].rxa+ba[i].rxa*Math.cos(z);
      //let y=y0+YR*Math.sin(z);
      let y=CSIZE-dt1+YR*Math.sin(z);
      let pd=new Path2D();
      pd.arc(x,y,dim+2,0,TP);
      pd.addPath(pd,dm1);
      ctx.fillStyle="#00000008";
      ctx.fill(pd);
      let p=new Path2D();
      p.moveTo(x-dx1,y-dy);
      p.lineTo(x+dx1,y+dy);
      p.addPath(p,dm1);
      ctx.stroke(p);
      let p2=new Path2D();
      p2.moveTo(x-dx1/8,y-dy/8);
      p2.lineTo(x+dx1/8,y+dy/8);
      p2.addPath(p2,dm1);
      ctx.strokeStyle=colors[(i+1)%colors.length];
      ctx.stroke(p2);
      ba[i].x0=x;
      ba[i].y0=y;
      s++;
    } else if (t-dt1-dt2<ba[i].tf) {
      let r=2+ba[i].ff1*Math.pow((t-dt1-dt2)/ba[i].tf,2);
      let r2=2+ba[i].ff2*Math.pow((t-dt1-dt2)/ba[i].tf,2);
      let p1=new Path2D();
      let y=ba[i].y0+(t-dt1-dt2)/3;
      //p1.arc(ba[i].x0,y-2,r,0,TP);
      p1.ellipse(ba[i].x0,y-2,r,r2,0,0,TP);
      p1.addPath(p1,dm1);
      ctx.fillStyle=colors[i%colors.length];
      ctx.fill(p1);
      let pd=new Path2D();
//      pd.arc(ba[i].x0,y+4,r-2,0,TP);
      pd.ellipse(ba[i].x0,y+4,r,r2,0,0,TP);
      pd.addPath(pd,dm1);
      ctx.fillStyle=colors[(i+1)%colors.length];
      ctx.fill(pd);
      ctx.strokeStyle="#00000088";
      ctx.stroke(pd);
      s++;
    }
  }
  return s;
}

do { t+=2; draw(); } while (t<800);
start();

