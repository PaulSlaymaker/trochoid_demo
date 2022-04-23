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
  c.width=c.height=2*CSIZE;
//c.style.outline="0.2px dotted gray";
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

/*
var drawPoint2=(x,y,col)=>{	// diag
  ctx.beginPath();
  ctx.arc(x,y,3,0,TP);
  ctx.closePath();
  if (col) ctx.fillStyle=col;
  else ctx.fillStyle="red";
  ctx.fill();
}
*/

var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=60+getRandomInt(0,31);
    let lum=40+getRandomInt(0,21);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var reset=()=>{ }

function start() {
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

var numberShown=1;
var S=0;
var stopped=true;
var t=0;
var rot=[-0.003,0.003][getRandomInt(0,2)];
function animate(ts) {
  if (stopped) return;
  a+=inc;
  ctx.rotate(rot);
  t++;
  if (S==0) {
    if (t%6==0) {
      numberShown++;
      if (numberShown==rings.length) {
        S=1;
        t=0;
      }
    }
  } else if (S==1) {
    if (t%600==0) S=2;
  } else if (S==2) {
    if (t%6==0) {
      rings.splice(rings.length-1,1);
      numberShown=rings.length;;
      if (rings.length==0) {
        initRings();
        generateGears();
        colors=getColors();
        t=0;
        S=0;
      }
    }
  }
  draw(numberShown);
  requestAnimationFrame(animate);
}

const dash=[8,40];
const dashLength=48;	// for gear teeth
const wid=16;		// gear teeth line width
const spokeDash=[[],[15,35],[5,70],[0,94]];
const spokeRadius=[0,200/TP,300/TP,380/TP];	// 4-spoke radii, 4*(sum of dash)/TP
const spokeLineWidth=[0,wid,3*wid,4.4*wid];
const rings=[];
const AF=4;

var radii=(()=>{
  let ri=[];
  for (let i=AF, i2=0; i<17; i+=AF,i2++) {
    let r=i*dashLength/TP;
    //ri.push({"r":r,"tc":i,"sp":getSpokePath(r)});
    ri.push({"r":r,"tc":i,"sd":spokeDash[i2],"sr":spokeRadius[i2],"slw":spokeLineWidth[i2]})
  }
  return ri;
})();

const Ring=function(x,y,rad,angleFraction,dir) {
  this.x=x;
  this.y=y;
  this.rad=rad;
  this.oa=[0,1,2,3];
  this.oa.splice(this.oa.indexOf((angleFraction+2)%AF),1);
  this.dir=dir;
  this.radius=rad.tc*dashLength/TP;	// 60=24+36 dash
  this.angleFraction=angleFraction;
  this.angle=TP*angleFraction/AF;
  this.f=tc1/rad.tc;
  this.aa=TP/this.rad.tc/2;	// angle adjusted for reflected motion
  this.draw=()=>{	// move calcs upstream
    let path=new Path2D();
    if (dir) {
      //path.arc(x,y,this.radius,TP-f*(this.angle+a),-f*(this.angle+a),dir);
      path.arc(x,y,this.radius,this.aa+this.angle+TP-this.f*a,this.aa+this.angle-this.f*a,dir);
      //path2.arc(x,y,this.radius,this.angle+TP-this.f*a,this.angle-this.f*a,dir);
    } else {
      path.arc(x,y,this.radius,-this.angle+this.f*a,TP+-this.angle+this.f*a,dir);
      //path2.arc(x,y,this.radius,aa-this.angle+this.f*a,TP+aa-this.angle+this.f*a,dir);
    }
    ctx.save();
    ctx.globalCompositeOperation="destination-over";
    ctx.clip(path);
    // gap
    ctx.setLineDash(dash);
    //ctx.lineDashOffset=this.radius*TP/this.rad.tc/2;
    ctx.lineDashOffset=dashLength/2;
    ctx.strokeStyle="#000000";
    ctx.stroke(path);
    // spoke
    let spath=new Path2D();
    //spath.addPath(radii[1].sp,new DOMMatrix([1,0,0,1,this.x,this.y]));
    spath.arc(this.x,this.y,6,0,TP);
    ctx.fill(spath);
    if (this.rad.tc>4) {
  /*
  //    let rs=200/TP;		// put in radius
      if (this.rad.tc==8) {
	//ctx.setLineDash([15,35]);	// 4*50=200
  //      ctx.setLineDash(this.rad.sd);
  //      rs=200/TP;		// put in radius
	ctx.lineWidth=wid;
      } else if (this.rad.tc==12) {
	//ctx.setLineDash([5,70]);	// 4*75=300
  //      ctx.setLineDash(this.rad.sd);
  //      rs=300/TP;	// 4*75
	ctx.lineWidth=3*wid;
      } else if (this.rad.tc==16) {
	//ctx.setLineDash([0,94]);	// 4*75=300
  //      ctx.setLineDash(this.rad.sd);
  //      rs=380/TP;
	ctx.lineWidth=4.4*wid;
      }
  */
      let spath2=new Path2D();
      if (dir) spath2.arc(this.x,this.y,this.rad.sr,TP-this.f*a,-this.f*a,dir);
      else spath2.arc(this.x,this.y,this.rad.sr,this.f*a,TP+this.f*a,dir);
      ctx.setLineDash(this.rad.sd);
      ctx.lineWidth=this.rad.slw;
      ctx.stroke(spath2);
    }
    ctx.setLineDash([]);
    //  spath.addPath(radii[1].sp,new DOMMatrix([1,0,0,1,this.x,this.y]));
    let color=colors[(this.rad.tc/AF)%colors.length];
    //ctx.fillStyle=colors[(this.rad.tc/AF)%colors.length];
    ctx.fillStyle=color;
    ctx.fill(path);
    ctx.restore();

    // teeth
    ctx.setLineDash(dash);
    ctx.strokeStyle=color;
    ctx.stroke(path);
  }
  rings.push(this);
}

var a=0;	// control angle
ctx.lineWidth=wid;
let rri=getRandomInt(0,radii.length);
var tc1=radii[rri].tc;
var inc=0.1/radii[rri].tc;

var initRings=()=>{
  rri=getRandomInt(0,radii.length);
  tc1=radii[rri].tc;
  inc=0.1/radii[rri].tc;
//  if (rings.length>0) debugger;
  new Ring(0,0,radii[rri],0,getRandomInt(0,2));
  rings[0].oa=[0,1,2,3];
  rot=[-0.003,0.003][getRandomInt(0,2)];
}

var getRandomOpenRingIndex=()=>{
  let ridx=getRandomInt(0,rings.length);
  for (let i=0; i<rings.length; i++) {
    let idx=(i+ridx)%rings.length;
    if (rings[idx].oa.length==0) continue;
    return idx;
  }
  return -1;
}

var generateGears=()=>{
  let gri=getRandomOpenRingIndex();
  while (gri>-1) {
    nextRing(gri);
    gri=getRandomOpenRingIndex();
  }
}

var nextRing=(growthRingIndex)=>{
  let gr=rings[growthRingIndex];
  //let anx=[TP/4,3*TP/4][getRandomInt(0,2)];
  //let af=getRandomInt(0,AF);
  let af=gr.oa.splice(getRandomInt(0,gr.oa.length),1)[0];
  //let af=gr.oa[getRandomInt(0,gr.oa.length)];
  let anx=TP*af/AF;
  //let anx=TP/8*getRandomInt(0,8);
  let iset=new Set();
  for (let i=0; i<radii.length; i++) {
    let tr=gr.radius+radii[i].r;
    let tx=gr.x+tr*Math.cos(anx);
    let ty=gr.y+tr*Math.sin(anx);
    let tt=Math.pow(tx*tx+ty*ty,0.5);	// keep inside circle
    if (tt+1.3*radii[i].r>CSIZE) continue;
    let radOK=true;
    for (let j=0; j<rings.length; j++) {
      if (j==growthRingIndex) continue;
      let rt=Math.pow(Math.pow(tx-rings[j].x,2)+Math.pow(ty-rings[j].y,2),0.5);
      if (rt<(rings[j].radius+radii[i].r+wid)) {
        if (i==0) {
//console.log("none from ring "+growthRingIndex+", angle "+anx);
          return false;
        }
        radOK=false;
        break;
      }
    }
    if (radOK) iset.add(i);	// don't add i if broken from j loop
//if (stopped) drawPoint2(tx,ty);
  }
  if (iset.size==0) {
    return false;
  } else {
    let ia=Array.from(iset).reverse();
    let ic=ia[getRandomInt(0,ia.length,true)];
    let x=gr.x+(gr.radius+radii[ic].r)*Math.cos(anx);
    let y=gr.y+(gr.radius+radii[ic].r)*Math.sin(anx);
    return new Ring(x,y,radii[ic],af,(gr.dir+1)%2);
  }
}

var draw=(n)=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<n; i++) rings[i].draw();
}

onresize();

colors=getColors();
initRings();
generateGears();
//draw();
start();
