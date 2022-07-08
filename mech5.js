"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/xxYbZbY
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width=c.height=2*CSIZE;
  c.style.border="3px solid #444";
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
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

const getRandomSumN=(c)=>{
  let ra=[0];
  for (let i=0; i<c-1; i++) {
    ra.push(Math.random());
  }
  ra.push(1);
  ra.sort((a,b)=>{ return a-b; });
  let ra2=new Array(c);
  for (let i=0; i<c; i++) {
    ra2[i]=ra[i+1]-ra[i];
  }
  return ra2;
}

var getImageData=()=>{
  let pixd=ctx.createImageData(1,2*CSIZE); 
  let ro=TP/16*getRandomInt(0,16);
  let go=TP/16*getRandomInt(0,16);
  let bo=TP/16*getRandomInt(0,16);
  let te=getRandomSumN(3);
  let re=159+96*te[0];
  let ge=159+96*te[1];
  let be=159+96*te[2];
  for (let i=0; i<2*CSIZE; i++) {
    let ca=i*Math.PI/CSIZE;
      pixd.data[i*4]=Math.round(re*(2+Math.sin(ca+ro))/3);
      pixd.data[i*4+1]=Math.round(ge*(2+Math.sin(ca+go))/3);
      pixd.data[i*4+2]=Math.round(be*(2+Math.sin(ca+bo))/3);
      pixd.data[i*4+3]=255;
  }
  return pixd;
}

//var drawPattern=(p)=>{	//diag ctx.fillStyle=p; ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE); }

var patterns=[];
var createPatterns=(pf)=>{
  patterns=[];
  let pixd=getImageData();
  createImageBitmap(getImageData()).then((ib)=>{ 
    patterns.push(ctx.createPattern(ib,"repeat"));
    createImageBitmap(getImageData()).then((ib)=>{ 
      patterns.push(ctx.createPattern(ib,"repeat"));
      createImageBitmap(getImageData()).then((ib)=>{ 
        patterns.push(ctx.createPattern(ib,"repeat"));
	createImageBitmap(getImageData()).then((ib)=>{ 
          patterns.push(ctx.createPattern(ib,"repeat"));
          pf();
        });
      });
    });
  });
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

var dm=new DOMMatrix([1,0,0,1,0,0]);
var stopped=true;
var t=0;
function animate(ts) {
  if (stopped) return;
  t++;
  dm.f=-t/2;
  patterns[0].setTransform(dm);
  patterns[3].setTransform(dm);
  dm.f=t/2;
  patterns[1].setTransform(dm)
  patterns[2].setTransform(dm);
  draw();
  if (t%2000==0) createPatterns(()=>{}); 
  requestAnimationFrame(animate);
}

const dash=[16,80];
const dashLength=96;	// for gear teeth
const wid=22;		// gear teeth line width

/*
var radii=(()=>{
  let ri=[];
  //for (let i=AF, i2=0; i<17; i+=AF,i2++) {
  for (let i=2, i2=0; i<10; i++,i2++) {
    let r=i*dashLength/TP;
    ri.push({"r":r,"tc":i})
  }
  return ri;
})();
*/

ctx.lineWidth=wid;

//let RAD=0;
const radius=2*dashLength/TP;
var pathx=new Path2D();
//let r=radii[RAD].r;
//let r=radius;
for (let i=-7; i<8; i++) {
  pathx.arc(0,i*2*radius,radius,-Math.PI/2,Math.PI/2,i%2);
}
var pathr=new Path2D();
//pathr.addPath(pathx,new DOMMatrix([1,0,0,-1,0,0]));	// hor
pathr.addPath(pathx,new DOMMatrix([-1,0,0,1,0,0]));

var pa=[];

for (let i=0; i<13; i++) {
  let p1=new Path2D();
  //p1.addPath(pathx,new DOMMatrix([1,0,0,1,0,-CSIZE+r+i*2*r]));
  p1.addPath(pathx,new DOMMatrix([1,0,0,1,-CSIZE+radius+i*2*radius,0]));
  let p2=new Path2D();
  //p2.addPath(pathr,new DOMMatrix([1,0,0,1,0,-CSIZE+r+i*2*r]));
  p2.addPath(pathr,new DOMMatrix([1,0,0,1,-CSIZE+radius+i*2*radius,0]));
  pa.push(p1,p2);
}

//let TEST=35;
const aa=3/4*dashLength*0.95;
const ldo=[0,aa,aa/4,3*aa/4];

ctx.setLineDash(dash);
//ctx.setLineDash([]);
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  let m=0.7*t;
  for (let i=0; i<pa.length; i++) {
    //let mv=(i+1)%4<2?t/2:-t/2;
    let mv=(i+1)%4<2?m:-m;
    ctx.lineDashOffset=mv+ldo[i%4];
    ctx.strokeStyle=patterns[i%patterns.length];
    ctx.stroke(pa[i]);
  }
}

onresize();

//draw();
createPatterns(start);
