"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const EM=location.href.endsWith("em");
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

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

function Color() {
  const CBASE=144;
  const CT=256-CBASE;
  this.getRGB=(z)=>{
    let red=Math.round(z*(CBASE+CT*Math.cos(this.RK2+t/this.RK1)));
    let grn=Math.round(z*(CBASE+CT*Math.cos(this.GK2+t/this.GK1)));
    let blu=Math.round(z*(CBASE+CT*Math.cos(this.BK2+t/this.BK1)));
    return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=4+16*Math.random();
    this.GK1=4+16*Math.random();
    this.BK1=4+16*Math.random();
    this.RK2=TP*Math.random();
    this.GK2=TP*Math.random();
    this.BK2=TP*Math.random();
  }
  this.randomize();
}

var color=new Color();
//var color2=new Color();

var pauseTS=1000;
var pause=(ts)=>{
  if (EM) stopped=true;
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

//var DUR=CSIZE/SCOUNT*Math.PI/8;
var S=1;
var DUR;//=CSIZE/SCOUNT;
var t=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  S?draw():draw2();
  if (t>=DUR) {	// cycle on x or y >320?
    S=++S%2;
    t=0;
    if (S) {
      reset();
      pauseTS=performance.now()+1000;
      requestAnimationFrame(pause);
      return;
    } else {
//if (EM) stopped=true
ctx.strokeStyle="black";
ctx.setLineDash([2,10000]);
ctx.globalCompositeOperation="source-over";
//DUR=2*CSIZE/SCOUNT;
      pauseTS=performance.now()+5000;
      requestAnimationFrame(pause);
      return;
    }
//    stopped=true	// pause
  }
  requestAnimationFrame(animate);
}

const dmx=new DOMMatrix([-1,0,0,1,0,0]);
const dmy=new DOMMatrix([1,0,0,-1,0,0]);
const dmxy=new DOMMatrix([-1,0,0,-1,0,0]);
const dma=new DOMMatrix([0,1,-1,0,0,0]);

var getRotatedPath=(p,dm)=>{
  let path=new Path2D();
  path.addPath(p,dm);
  return path;
}

const path12=new Path2D();
path12.moveTo(CSIZE,0);
path12.arc(CSIZE,CSIZE,CSIZE,3*TP/4,5*TP/8,true);
path12.moveTo(0,CSIZE);
path12.arc(CSIZE,CSIZE,CSIZE,TP/2,5*TP/8);
const path13=new Path2D();
path13.moveTo(CSIZE,0);
path13.lineTo(0,0);
path13.moveTo(-CSIZE,0);
path13.lineTo(0,0);
const path23=getRotatedPath(path12,dmx);
const path14=getRotatedPath(path12,dmy);
const path34=getRotatedPath(path12,dmxy);
const path24=getRotatedPath(path13,dma);

//ctx.strokeStyle=color.getRGB(1);

var draw=()=>{
  ctx.lineWidth=t;
  let cf=(SCOUNT==7)?7:9;
  let col=1-Math.pow(Math.sin(t/cf),4);
  ctx.strokeStyle=color.getRGB(col);
  ctx.stroke(path);
}

var draw2=()=>{
  ctx.lineDashOffset=1-t/2;
  ctx.stroke(path);
}

var drawPoint=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var generateLines=()=>{		// could be points, lines for easier visualization
  let K=[0.6,0.5,0.7,0.4,0.8,0.3][getRandomInt(0,6,true)];
//console.log("K",K);
  let la=[];
  for (let i=0; i<SCOUNT+1; i++) { 
    la.push([]);
    for (let j=0; j<SCOUNT; j++) {
      if (i==SCOUNT) la[i].push(false);
      else la[i].push(Math.random()<K);
    }
  }
  return la;
}

var SCOUNT;		// square dimension
var hla,vla;

var reset=()=>{
//  console.clear();
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  SCOUNT=[4,5,6,7,8,9,10][getRandomInt(0,7,true)];
//console.log("SCOUNT",SCOUNT);
  hla=generateLines();
  vla=generateLines();
  if (fixSingletons()) {
    if (fixSingletons()) {
//      console.log("sing3",fixSingletons());
    }
  } else {
//    console.log("nosing");
  }
  fill();
  DUR=CSIZE/SCOUNT;
  ctx.globalCompositeOperation="destination-over";
  ctx.setLineDash([]);
  color.randomize();
}

const pm=new Map();
pm.set("12",[path12]);
pm.set("13",[path13]);
pm.set("14",[path14]);
pm.set("23",[path23]);
pm.set("24",[path24]);
pm.set("34",[path34]);
pm.set("123",[path12,path13,path23]);
pm.set("124",[path12,path14,path24]);
pm.set("134",[path13,path14,path34]);
pm.set("234",[path23,path24,path34]);
var dualSet=[[0,1],[0,2],[1,2],[0,1,2]];

pm.set("1234",[path12,path14,path23,path34,path13,path24]);
var triSet=[
 [0,3],[1,2],
 [0,1,2],[0,1,3],[0,2,3],[1,2,3],
 [0,1,2,3],
 [0,3,4],[0,3,5],[1,2,4],[1,2,5],
 [0,1,2,4],[0,1,2,5],[0,1,3,4],[0,1,3,5],[0,2,3,4],[0,2,3,5],[1,2,3,4],[1,2,3,5],
 [0,1,2,3,4],[0,1,2,3,5],
];

const fixSingletons=()=>{
  let found=0;
  for (let i=0; i<SCOUNT; i++) { 
    for (let j=0; j<SCOUNT; j++) {
      let count=0;
      count+=vla[j+1][i]?1:0;
      count+=hla[i+1][j]?1:0;
      count+=vla[j][i]?1:0;
      count+=hla[i][j]?1:0;
      if (count==1) {
        let pa=[vla[j+1][i],hla[i+1][j],vla[j][i],hla[i][j]];
//        if (i+1!=SCOUNT) pa.push(hla[i+1][j]);
//        if (j+1!=SCOUNT) pa.push(vla[j+1][i]);
        let ridx=getRandomInt(0,pa.length);
        for (let k=0; k<pa.length; k++) {
          let idx=(k+ridx)%pa.length;
          if (!pa[idx]) {
//console.log(vla,hla);
//console.log(pa);
            if (idx==0) {
              if (j+1!=SCOUNT) vla[j+1][i]=true, count++;
            }
            else if (idx==1) {
              if (i+1!=SCOUNT) hla[i+1][j]=true, count++;
            }
            else if (idx==2) vla[j][i]=true, count++;
            else if (idx==3) hla[i][j]=true, count++;
else debugger;
          }
          if (count>1) {
            found++;
            break;
          }
//if (count==1) debugger;
        }
//console.log(i,j,count);
      }
    }
  } 
  return found;
}

var path;
const fill=()=>{
  path=new Path2D();
  for (let i=0; i<SCOUNT; i++) { 
    for (let j=0; j<SCOUNT; j++) {
      let one=vla[j+1][i]?"1":"";
      let two=hla[i+1][j]?"2":"";
      let tre=vla[j][i]?"3":"";
      let tet=hla[i][j]?"4":"";
      let key=one+two+tre+tet;
      let pa=pm.get(key);
      if (pa) {
        let y=CSIZE/SCOUNT/2+i*CSIZE/SCOUNT;
        let x=CSIZE/SCOUNT/2+j*CSIZE/SCOUNT;
        let dm=new DOMMatrix([1/(2*SCOUNT),0,0,1/(2*SCOUNT),x,y]);
        if (pa.length==1) {
          path.addPath(pa[0],dm);
        } else if (pa.length==3) {
          let dsa=dualSet[getRandomInt(0,dualSet.length)];
          for (let k=0; k<dsa.length; k++) {
            path.addPath(pa[dsa[k]],dm);
          }
        } else if (pa.length==6) {
          let tsa=triSet[getRandomInt(0,triSet.length,true)];
          for (let k=0; k<tsa.length; k++) {
            path.addPath(pa[tsa[k]],dm);
          }
        }
      } 
    }
  }
  path.addPath(path,dmx);
  path.addPath(path,dmy);
}

reset();
onresize();

var drawLines=()=>{
  ctx.lineWidth=1;
  ctx.beginPath();
  for (let i=0; i<SCOUNT; i++) {
    ctx.moveTo(0,i*CSIZE/SCOUNT);
    ctx.lineTo(CSIZE,i*CSIZE/SCOUNT);
    ctx.moveTo(i*CSIZE/SCOUNT,0);
    ctx.lineTo(i*CSIZE/SCOUNT,CSIZE);
  }
  ctx.stroke();
}

var drawPoints=()=>{
  for (let i=0; i<SCOUNT+1; i++) {
    for (let j=0; j<SCOUNT; j++) {
      if (hla[i][j]) drawPoint(CSIZE/SCOUNT/2+j*CSIZE/SCOUNT,i*CSIZE/SCOUNT);
      if (vla[i][j]) drawPoint(i*CSIZE/SCOUNT,CSIZE/SCOUNT/2+j*CSIZE/SCOUNT);
    }
  }
}

start();
