"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";

const TP=2*Math.PI;
const HR=1/Math.cos(Math.PI/6);
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
ctx.lineWidth=2;

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
var getColors=()=>{
  let c=[];
  let colorCount=[2,3,6][getRandomInt(0,3)];
  let hr=Math.round(90/colorCount);
  let hue=getRandomInt(0,90,true)+30;
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-hr,hr);
    let sat=70+getRandomInt(0,21);
    let col=(hue+hd)%360;
    let lf=Math.random();
    let lum=Math.round(50+20*Math.pow(Math.sin((col+90)*TP/360),2));
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+col+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var radius=10;

//var axisCount=Math.trunc(CSIZE/2/radius);

var Circle=function(x,y,rd) {
  this.x=x;
  this.y=y;
  this.key=[Math.round(x),Math.round(y)].toString();
  this.er=Math.pow(x*x+y*y,0.5);
//  this.circ=[];
  this.d=false;
  this.gc=[];

  for (let i=0; i<6; i++) {
    let z=i*TP/6;
    let ga=[Math.round(x+2*rd*Math.cos(z)),Math.round(y+2*rd*Math.sin(z))];
    this.gc.push(ga.toString());
  }

  this.draw=()=>{	// diag
    ctx.moveTo(this.x+radius*0.7,this.y);
    ctx.arc(this.x,this.y,radius*0.7,0,TP);
  }

  this.drawPoint=(path)=>{	// diagnostic
    path.moveTo(this.x+1,this.y);
    path.arc(this.x,this.y,1,0,TP);
  }
}

var Path=function(circleArray,idx) {
  this.ca=circleArray;
  this.mi=true;
  this.dir=getRandomInt(0,6);
  this.idx=idx;
}

var grow3=(po)=>{
  let pa=po.ca;
  if (!po.mi) return false;
  //for (let p=0; p<pa.length; p++) {
  for (let i=0; i<pa.length; i++) {
    //let p=po.idx%2?i:pa.length-i-1;
    //let p=i;
    //let p=pa.length-i-1;
    let p=gd<0?i:gd>0?pa.length-i-1:po.idx%2?i:pa.length-i-1;
    let pc1=pa[p%pa.length];
    let pc2=pa[(p+1)%pa.length];
    let c1=(()=>{
      let dy=Math.round(pc2.y-pc1.y);
      let cx=0;
      let cy=0;
      if (pc2.x-pc1.x>0) {
	if (dy==0) {
	  cx=(pc1.x+pc2.x)/2;
	  cy=pc1.y-2*radius/HR;
	} else if (dy>0) {
	  cx=pc1.x+2*radius;
	  cy=pc1.y;
	} else {
	  cx=pc2.x-2*radius;
	  cy=pc2.y;
	}
      } else {
	if (dy==0) {
	  cx=(pc1.x+pc2.x)/2;
	  cy=pc1.y+2*radius/HR;
	} else if (dy>0) {
	  cx=pc2.x+2*radius;
	  cy=pc2.y;
	} else {
	  cx=pc1.x-2*radius;
	  cy=pc1.y;
	}
      }
      return cm.get([Math.round(cx),Math.round(cy)].toString());
    })();
    if (c1 && !c1.d) {
      //drawCircle(c1);
      c1.d=true;
    //for (let i=1; i<12; i++) { let c=cm.get(c1.ckeys[i].toString()); if (c) c.d=true; }
      //pa.splice((pa.length-p)%pa.length,0,c1);
      pa.splice((p+1)%pa.length,0,c1);
    //if (pa.length%po.dir) pa.push(pa.shift());
    if (pa.length%po.dir>po.dir2) pa.push(pa.shift());
    //if (pa.length%po.dir) pa.unshift(pa.pop());
    //if (p%k) pa.push(pa.shift());
    //if (pa.length%k) pa.unshift(pa.pop());
      // nothing, simple swirl
      // pa.unshift(pa.pop());	// decorated swirl
      return true;
    }
  }
  po.mi=false;
  return false;
} // end of grow3

/*
var shrink=(po)=>{
//  if (po.fixed) return false;
  let pa=po.ca;
//  if (!po.mi) return false;
  for (let i=0; i<pa.length+3; i++) {
    let p=i;
    let pc1=pa[p%pa.length];
    let pc2=pa[(p+1)%pa.length];
    let pc3=pa[(p+2)%pa.length];
    let gci1=pc2.gc.indexOf(pc1.key);
    let gci3=pc2.gc.indexOf(pc3.key);
//console.log(pc1.key+" "+gci1);
//console.log(pc3.key+" "+gci3);
let te=Math.abs(gci1-gci3)%4;
if (te==1) {
//console.log(i);
pa.splice((i+1)%pa.length,1);
break;
}
  }
}
*/

var paths=[];

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<paths.length; i++) { drawLineB(paths[i]); }
}

var drawLineB=(po)=>{
  ctx.beginPath();
  let pth=po.ca;
  ctx.moveTo((pth[0].x+pth[1].x)/2,(pth[0].y+pth[1].y)/2);
  for (let p=0; p<pth.length; p++) {
    let a=(p+1)%pth.length;
    let b=(p+2)%pth.length;
    let cx=pth[a].x;
    let cy=pth[a].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,
      (cx+pth[b].x)/2,
      (cy+pth[b].y)/2,
    );
  }
  ctx.strokeStyle=colors[po.idx%colors.length];
  //ctx.strokeStyle=colors[0];
//  ctx.closePath();
  ctx.globalCompositeOperation="source-over";
  ctx.lineWidth=Math.round(1.5*radius);
  ctx.stroke();
  ctx.globalCompositeOperation="lighter";
  ctx.lineWidth=2;
  ctx.stroke();
}

var drawCircle=(c,col)=>{  // diagnostic
  ctx.beginPath();
if (c==undefined) debugger;
if (typeof c.draw != "function") debugger;
  c.draw();
  if (col) {
    ctx.strokeStyle=col;
  } else {
    ctx.strokeStyle="yellow";
  }
  ctx.lineWidth=5;
  ctx.stroke();
}

var drawLine=(x1,y1,x2,y2)=>{  // diagnostic
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle="yellow";
  ctx.lineWidth=5;
  ctx.stroke();
}

var fibo=(f,n)=>{
  if (n==0) return f;
  return fibo(f+=n,n-1);
}

var generateHexes=()=>{
  let map=new Map();
  let ra=radius;
  let aCount=Math.trunc(CSIZE/2/ra);
  let cCount=1+6*fibo(0, aCount-1);
  let c=new Circle(0,0,ra);
  c.d=true;
  map.set("0,0",c);
  map.forEach((c)=>{
    if (map.size>=cCount) return;
    for (let a=0; a<6; a++) {
      let xc=c.x+2*ra*Math.cos(a*TP/6);
      let yc=c.y+2*ra*Math.sin(a*TP/6);
      let ca=[Math.round(xc),Math.round(yc)];
	if (!map.has(ca.toString())) {
	  //let nc=new Circle(xc,yc,c.level+1);
	  let nc=new Circle(xc,yc,ra);
	  map.set(ca.toString(),nc);
	}
    }
  });
  return map;
}
var cm=generateHexes();

let ks=[getRandomInt(1,12,true),getRandomInt(1,12,true),getRandomInt(1,12,true)];
let ks2=[];
let kl=getRandomInt(0,3,true);

var cks=Array.from(cm.keys());

var randomHexad=()=>{
  let h=[];
  let cks=Array.from(cm.keys());
  //cks=cks.filter((k)=>{ return Math.round(cm.get(k).y)!=0; });
  cks=cks.filter((k)=>{ return cm.get(k).er>3*radius; });
  let rndCircle=cm.get(cks.splice(getRandomInt(0,cks.length-1),1)[0]);
  let angle=Math.atan(rndCircle.y/rndCircle.x);
  for (let a=0; a<6; a++) {
    let cx=rndCircle.er*Math.cos(angle+a*TP/6);
    let cy=rndCircle.er*Math.sin(angle+a*TP/6);
    let nCircle=cm.get([Math.round(cx),Math.round(cy)].toString());
    let circleArray=[];
    for (let i=a; i<a+6; i++) {
      let c1=cm.get(nCircle.gc[i%6]);
      if (c1 && !c1.d) {
	let c2=cm.get(nCircle.gc[(i+1)%6]);
	if (c2 && !c2.d) {
	   nCircle.d=true;
	   c1.d=true;
	   c2.d=true;
	   circleArray.push(nCircle,c1,c2);
	   cks.splice(cks.indexOf(c1.key),1);
	   cks.splice(cks.indexOf(c2.key),1);
           let path=new Path(circleArray,a);
           path.dir=ks[a%kl];
           path.dir2=ks2[a%kl];
/*
if (gd==0) {
if (a%2==0) path.dir=ks[(6-a)%kl];
else path.dir=ks[a%kl];
}
*/
//path.dir=5;
console.log(path.dir+" "+path.dir2);
           h.push(path);
	   break;
	}
      }
    }
  }
  return h;
}

var gd=0;
var reset=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  cm.forEach((c)=>{ c.d=false; });
  cm.get("0,0").d=true;
  ks=[getRandomInt(1,12,true),getRandomInt(1,12,true),getRandomInt(1,12,true)];
  ks2=[
    getRandomInt(0,Math.round(2*ks[0]/3)),
    getRandomInt(0,Math.round(2*ks[1]/3)),
    getRandomInt(0,Math.round(2*ks[2]/3))
  ];
  kl=getRandomInt(1,4,true);
  gd=getRandomInt(-2,3);
console.log("gd  "+gd);
console.log("ks  "+ks.toString());
console.log("ks2 "+ks2.toString());
console.log("kl "+kl);
  colors=getColors();
  paths=randomHexad();
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
//body.addEventListener("click", ()=>{ reset(); start(); }, false);

var step=0;
var time=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (step==2) {
    if (ts-time>1000) {
      time=0;
      step=0;
      reset();
      ctx.canvas.style.opacity=1;
    } else {
      ctx.canvas.style.opacity=1-(ts-time)/1000;
    }
  } else if (step==1) {
    if (ts-time>1600) {
      time=0;
      step=2;
    }
  } else {
    if (ts-time>10) {
      time=0;
      let drawn=false;
      for (let i=0; i<paths.length; i++) {
        drawn=grow3(paths[i]) || drawn;
      }
      if (drawn) {
        draw();
      } else {
        step=1;
      }
    }
  }
  requestAnimationFrame(animate);
}

onresize();

reset();
start();

/*
var test2=()=>{
  paths.forEach((pth)=>{
    shrink(pth);
  });
  draw();
}
*/
