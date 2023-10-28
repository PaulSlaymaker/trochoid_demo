"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/BaZeLKN
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");

const TP=2*Math.PI;
const CSIZE=400;

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
ctx.lineWidth=2;
ctx.strokeStyle="black";

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var C=16;//2*getRandomInt(3,8);
var W=getRandomInt(6,12);

var DOWN=true;

var setRadii=()=>{
  let zcount=0;
  for (let i=0; i<W; i++) {
    radii[i+1].setR();
    if (radii[i+1].zero) zcount++;
  }
  if (zcount==W) {
    if (DOWN==false) return true;
    DOWN=false;
    return false;
  } else if (zcount==0) DOWN=true;
  radii[0].r=0;
  radii[W+1].r=CSIZE;
  radii.sort((a,b)=>{ return a.r-b.r; });
  setPoints();
  return true;
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=()=>{
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+t/this.RK1));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+t/this.GK1));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+t/this.BK1));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=300+300*Math.random();
    this.GK1=300+300*Math.random();
    this.BK1=300+300*Math.random();
  }
  this.randomize();
}

var colors;
var setColors=()=>{
  colors=[];
  let cset={
     "6":[2,3,3],"8":[2,4,4],
     "10":[2,5],
     "12":[2,3,4,4,6,6],
     "14":[2],
     "16":[2,4,4]
  };
  let colorCount=cset[C][getRandomInt(0,cset[C].length)];
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
/*
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=48+getRandomInt(0,31);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
*/
    //c.push("rgba("+Math.floor(CBASE+CT*Math.random())+","+Math.floor(CBASE+CT*Math.random())+","+Math.floor(CBASE+CT*Math.random())+",0.4)");
    //c.push("rgb("+Math.floor(CBASE+CT*Math.random())+","+Math.floor(CBASE+CT*Math.random())+","+Math.floor(CBASE+CT*Math.random())+")");
    colors.push(new Color());
  }
}

var Point=function() { this.x=0; this.y=0; }

var Radius=function(zo) {
  this.r=0;
  //this.K1a=100+100*Math.random();
  this.K1a=(1600+1600*Math.random())/TP;
  this.K2a=TP*Math.random();
  this.zero=zo;
  this.setR=()=>{
    //let rad=(i+1)*CSIZE/(W);
    //let rad=CSIZE/2*Math.pow(+Math.cos(this.K2a+t/this.K1a),4);
    let rad=CSIZE/2*(1+(Math.sin(this.K2a+t/this.K1a+Math.sin(this.K2a+3*t/this.K1a))));
    //let rad=CSIZE/2*(1+Math.sin(this.K2a+t/this.K1a));
    if (this.zero) {
      if (!DOWN) {
//        let rad=CSIZE/2*(1+Math.cos(this.K2a+t/this.K1a));	// AAA
        if (rad<1) {
          this.zero=false;
          this.r=rad;
          return;
        } else {
          this.r=0;
          return;
        }
      } else {
        this.r=0;
        return;
      }
    }
    //this.r=CSIZE/2*(1+Math.cos(this.K2a+t/this.K1a));	// AAA
    this.r=rad; //CSIZE/2*(1+Math.cos(this.K2a+t/this.K1a));	// AAA
    if (DOWN && this.r<0.1) this.zero=true;
  }
}

var Quad=function() { 
  this.pts=[new Point(),new Point(),new Point(),new Point()]; 
  this.draw=(p)=>{
    p.moveTo((this.pts[0].x+this.pts[1].x)/2,(this.pts[0].y+this.pts[1].y)/2);
    for (let i=0; i<4; i++) {
      let a=(i+1)%4;
      let b=(i+2)%4;
      let cx=this.pts[a].x;
      let cy=this.pts[a].y;
      p.bezierCurveTo(cx,cy,cx,cy,(cx+this.pts[b].x)/2,(cy+this.pts[b].y)/2);
    }
  }
}

var pts;
var generatePoints=()=>{
  pts=new Array(C+2);
  for (let i=0; i<C+2; i++) {
    pts[i]=new Array(W+2);
    for (let j=0; j<W+2; j++) {
      pts[i][j]=new Point();
    }
  }
}

var radii;
var generateRadii=(zo)=>{
  radii=new Array(W+2);
  for (let i=0; i<W+2; i++) radii[i]=new Radius(zo);
  // need a zero K2a for quick start, use smallest K1a?
  if (zo) radii[1].K2a=(radii[1].K1a*3*TP-4*(t%TP))/(4*radii[1].K1a);
}

var SKF=[6,8,Infinity,4][getRandomInt(0,4,true)];
var SK=new Array(W+2);
var setSK=()=>{
  SK=new Array(W+2);
  for (let j=0; j<W+2; j++) { 
    SK[j]=TP/(500+500*Math.random()); 
  }
  SKF=[6,8,Infinity,4][getRandomInt(0,4,true)];
}

var setPoints=()=>{
  for (let i=0; i<C+2; i++) {
    for (let j=0; j<W+2; j++) {
      //let r=radii[j];	// AAA
      let r=radii[j].r;	// AAA
      //let r=j*CSIZE/(W+2);
      //let z=i*TP/C+j*(TP/C/2);
let z=i*TP/C+j*(TP/C/2);
//let KR=TP/C/4*Math.sin(t/200);
//if (j<W+1) {
//let KR=TP/C/4*Math.sin(t*SK[j]);
let KR=TP/C/SKF*Math.sin(t*SK[j]);
z+=KR;
//} 
      pts[i][j].x=r*Math.cos(z);
      pts[i][j].y=r*Math.sin(z);
    }
  }
}

var drawPoint=(x,y,col)=>{	// diag
ctx.beginPath();
ctx.arc(x,y,6,0,TP);
if (col) ctx.fillStyle=col;
else ctx.fillStyle="red";
ctx.fill();
}
var drawPoints=()=>{		// diag
  for (let i=0; i<C+2; i++) {
    for (let j=0; j<W+2; j++) {
drawPoint(pts[i][j].x,pts[i][j].y);
    }
  }
}

var reset=()=>{
  C=2*getRandomInt(3,9);
  //W=getRandomInt(3,9);
  W=getRandomInt(6,12);
  generatePoints();
  generateRadii(true);
  setQuads();
  setSK();
  setColors();
  CS=getRandomInt(1,5);
//console.log(" W:"+W+" C:"+C+" col:"+colors.length+" CS:"+CS,SKF);
}

var quads=[];
var setQuads=()=>{
  quads=[];
  for (let j=0; j<W; j++) {
    quads[j]=[];
    for (let i=0; i<C; i++) {
      quads[j][i]=new Quad();
      quads[j][i].pts[0]=pts[i+1][j];
      quads[j][i].pts[1]=pts[i][j+1];
      quads[j][i].pts[2]=pts[i][j+2];
      quads[j][i].pts[3]=pts[i+1][j+1];
    }
  }
}

var draw=()=>{
//  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let p=new Array(colors.length);
  for (let i=0; i<colors.length; i++) p[i]=new Path2D();
  for (let i=0; i<C; i++) {
    for (let j=0; j<W; j++) {
      quads[j][i].draw(p[(j+CS*i)%colors.length]);
    }
  }
  for (let i=0; i<colors.length; i++) {
    ctx.fillStyle=colors[i].getRGB();;
    ctx.fill(p[i]);
    ctx.stroke(p[i]);
  }
}

var CS=getRandomInt(1,5);

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

var t=0;
var animate=(ts)=>{
  if (stopped) return;
    t++;
  if (!setRadii()) reset();
  draw();
  if (EM && t%200==0) stopped=true;
  requestAnimationFrame(animate);
}

onresize();

generatePoints();
generateRadii(false);
setSK();
setRadii();
setQuads();
setColors();
//console.log(" W:"+W+" C:"+C+" col:"+colors.length+" CS:"+CS,SKF);

if (EM) draw();
else start();
//draw();
