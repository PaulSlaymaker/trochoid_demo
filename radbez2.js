"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/KKyBwoX
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
  d.append(c);
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

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

var colors=[];
var hues=[];
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<hueCount; i++) {
    let hd=Math.round(240/hueCount)*i+getRandomInt(-hr,hr);
    h.splice(getRandomInt(0,h.length+1),0,(hue+hd)%360);
  }
  return h;
}
hues=getHues();

var drawPoint=(pt,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,10,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}

var pts=[];
var ca=[];
var cb=[];
var r=200;
var cr=400;

var initPoints=()=>{
  let aoc=Math.acos(r/cr);
  for (let i=0; i<4; i++) {
    let z=i*TP/4+TP/8;
    let za=z-aoc;
    let zb=z+aoc;
    pts.push({"x":r*Math.sin(z),"y":r*Math.cos(z)});
    ca.push({"x":cr*Math.sin(za),"y":cr*Math.cos(za)});
    cb.push({"x":cr*Math.sin(zb),"y":cr*Math.cos(zb)});	
  }
}
initPoints();

var C=5;

var mp=CSIZE/2/C*Math.pow(2,0.5);
var setPoints2=()=>{
  //r=mp*(1+Math.cos(t/200));	// 282=CSIZE/4*sqrt(2)
  r=mp*2*(Math.pow(Math.sin(TP*t/(4*duration)),2));	// 282=CSIZE/4*sqrt(2)
  let cr=(4*mp-r);
//let mr=189;
//r=mr*(1+Math.cos(t/100+TP/2));	// 282=100*sqrt(2)
  let aoc=Math.acos(r/cr);
  for (let i=0; i<4; i++) {
    let z=i*TP/4+TP/8;
    let za=z-aoc;
    let zb=z+aoc;
    pts[i].x=r*Math.sin(z);
    pts[i].y=r*Math.cos(z);
    ca[i].x=cr*Math.sin(za);
    ca[i].y=cr*Math.cos(za);
    cb[i].x=cr*Math.sin(zb);
    cb[i].y=cr*Math.cos(zb);
  }
}

var setPoints3=()=>{
  r=2*mp;
  let cr=r*(Math.pow(Math.sin(TP*t/(4*duration)),2));
  for (let i=0; i<4; i++) {
    let z=i*TP/4+TP/8;
    pts[i].x=r*Math.sin(z);
    pts[i].y=r*Math.cos(z);
    ca[i].x=cb[i].x=cr*Math.sin(z);
    ca[i].y=cb[i].y=cr*Math.cos(z);
//    cb[i].x=cr*Math.sin(z);
//    ca[i].x=cr*Math.sin(z);
//    cb[i].y=cr*Math.cos(z);
  }
}

var spType=[setPoints2, setPoints3];

var sq=2*CSIZE/C;

var getImageData=()=>{
  let pixd=ctx.createImageData(sq,sq); 
  let rm=Math.pow(2,getRandomInt(2,7,true));
  let gm=Math.pow(2,getRandomInt(2,7,true));
  let bm=Math.pow(2,getRandomInt(2,7,true));
  let ro=TP/16*getRandomInt(0,16);
  let go=TP/16*getRandomInt(0,16);
  let bo=TP/16*getRandomInt(0,16);
  for (let i=0; i<sq; i++) {
    for (let j=0; j<sq; j++) {
      let x=j-sq/2;
      let y=i-sq/2;
      let r=Math.pow(x*x+y*y,0.5);
      let a=Math.atan2(y,x);
      pixd.data[(i*4*sq)+j*4]  =Math.round(255*Math.sin(TP*r/sq+ro)*Math.cos(rm*a));
      pixd.data[(i*4*sq)+j*4+1]=Math.round(255*Math.sin(TP*r/sq+go)*Math.cos(gm*a));
      pixd.data[(i*4*sq)+j*4+2]=Math.round(255*Math.sin(TP*r/sq+bo)*Math.cos(bm*a));
      pixd.data[(i*4*sq)+j*4+3]=255;
    }
  }
  return pixd;
}

/*
var pixd=ctx.createImageData(sq,sq); 
for (let i=0; i<sq; i++) {
  for (let j=0; j<sq; j++) {
    let x=j-sq/2;
    let y=i-sq/2;
    let r=Math.pow(x*x+y*y,0.5);
    let a=Math.atan2(y,x);
      pixd.data[(i*4*sq)+j*4]  =Math.round(255*Math.sin(TP*r/rf+ro)*Math.cos(rm*a));
      pixd.data[(i*4*sq)+j*4+1]=Math.round(255*Math.sin(TP*r/rf+go)*Math.cos(gm*a));
      pixd.data[(i*4*sq)+j*4+2]=Math.round(255*Math.sin(TP*r/rf+bo)*Math.cos(bm*a));
      pixd.data[(i*4*sq)+j*4+3]=255;
  }
}
*/

//var ib;
var pattern;
var pattern2;
var createPattern=(pc)=>{
  let pixd=getImageData();
  createImageBitmap(pixd).then((ib)=>{ 
    if (pc) pattern2=ctx.createPattern(ib,"repeat");
    else pattern=ctx.createPattern(ib,"repeat");
  });
}
createPattern();
//createPattern(true);
//const b=createImageBitmap(pixd, {ColorSpaceConversion:"none"})
//const b=createImageBitmap(pixd, {"premultiplyAlpha":"none"})
/*
var pixd=getImageData();
createImageBitmap(pixd).then((ib)=>{ 
  pattern=ctx.createPattern(ib,"repeat");
});
*/

//var pattern2; createImageBitmap(pixd).then((ib)=>{ pattern=ctx.createPattern(ib,"repeat"); });

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else stopped=true;
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
var c=0;
var S=0;
var calc=0;
var duration=600;
function animate(ts) {
  if (stopped) return;
  t++; 
  c++;
  if (S==0) {
    if (t==60) { S=1; t=0; }
  } else if (S==1) {
    spType[calc]();
    //setPoints2();
    if (t==duration) { S=2; t=0; }
  } else if (S==2) {
    bezWidth=(1-t/100)*40;
    if (t==100) { S=3; t=0; 
      createPattern();
      calc=(++calc)%2;
      duration=calc?300:600;
    }
  } else if (S==3) {
    bezWidth=(t/100)*40;
    if (t==100) { S=4; t=duration; }
  } else if (S==4) {
    spType[calc]();
    if (t==2*duration) { S=0; t=0; }
//    bezWidth=(t/80)*20;
//    if (t==80) { S=1; t=0; }
  }
  for (let i=0; i<hues.length; i++) {
    colors[i]="hsl("+Math.round((hues[i]+c/(9+i))%360)+",100%,50%)";
  }
if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

//ctx.setLineDash([5,10]);	// need each bez on own path
//ctx.lineDashOffset=100;
//ctx.globalCompositeOperation="destination-over";
var bezWidth=40;

var draw=()=>{
ctx.fillStyle="#00000005";
//ctx.fillStyle="#FF0000";
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);	// need only fill center
  ctx.fillRect(-CSIZE+2*sq,-CSIZE+2*sq,sq,sq);
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.beginPath();
  ctx.moveTo(pts[0].x,pts[0].y);
  for (let i=0; i<ca.length; i++) {
    let i1=(i+1)%ca.length;
    //let i1=(i+3)%ca.length;
    ctx.bezierCurveTo(ca[i].x,ca[i].y,cb[i1].x,cb[i1].y,pts[i1].x,pts[i1].y);
    //ctx.bezierCurveTo(ca[i1].x,ca[i1].y,cb[i].x,cb[i].y,pts[i].x,pts[i].y);
  }
/*
  ctx.bezierCurveTo(ca[0].x,ca[0].y,cb[1].x,cb[1].y,pts[1].x,pts[1].y);
  ctx.bezierCurveTo(ca[1].x,ca[1].y,cb[2].x,cb[2].y,pts[2].x,pts[2].y);
  ctx.bezierCurveTo(ca[2].x,ca[2].y,cb[0].x,cb[0].y,pts[0].x,pts[0].y);
*/

/*
  ctx.bezierCurveTo(cb[0].x,cb[0].y,ca[1].x,ca[1].y,pts[1].x,pts[1].y);
  ctx.bezierCurveTo(cb[1].x,cb[1].y,ca[2].x,ca[2].y,pts[2].x,pts[2].y);
  ctx.bezierCurveTo(cb[2].x,cb[2].y,ca[0].x,ca[0].y,pts[0].x,pts[0].y);
*/
//ctx.fillStyle="#0000FF03";
ctx.fillStyle="hsla("+hues[2]+",100%,50%,0.02)";
//ctx.fillStyle="#000020";
  ctx.fill("evenodd");
  ctx.lineWidth=bezWidth;
//  ctx.strokeStyle=colors[0];
ctx.strokeStyle=pattern;
  ctx.stroke();
  ctx.lineWidth=5;
  ctx.strokeStyle=colors[3];
  ctx.stroke();

  let ppath=new Path2D();
  for (let i=0; i<4; i++) {
    //ppath.arc(pts[i].x,pts[i].y,20,0,TP);
ppath.arc(pts[i].x,pts[i].y,12,0,TP);
    ppath.closePath();
  }
ctx.fillStyle=colors[1];
//ctx.fillStyle=pattern2;
ctx.fill(ppath);

  for (let i=0; i<C; i++) {
    for (let j=0; j<C; j++) {
    if (i==2 && j==2) continue;	// (C-1)/2
      ctx.clearRect(-CSIZE+i*sq,-CSIZE+j*sq,sq,sq);
	// img source parms not transformed, 4 is (C-1)?
      ctx.drawImage(ctx.canvas,4*CSIZE/C,4*CSIZE/C,sq,sq,-CSIZE+i*sq,-CSIZE+j*sq,sq,sq);	
    }
  }
}

onresize();

spType[calc]();
//setPoints2();
//draw();
start();
