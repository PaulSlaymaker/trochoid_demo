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
ctx.lineWidth=60;
//ctx.lineCap="round";
//ctx.lineJoin="round";
//ctx.globalAlpha=0.5;

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
  let colorCount=4;
  let hue=getRandomInt(0,90,true)+30;
  let colorSeg=Math.round(360/colorCount);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(360/colorCount)*i+getRandomInt(-40,40);
    let sat=70+getRandomInt(0,31);
    let lum=30+getRandomInt(0,11);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

var Point=function() {
  this.x=0;
  this.y=0;
  this.d=false;
}

var LineObject=function(ln,color,idx) {
  this.line=ln;
//  this.color=color;
  this.mi=true;
  this.idx=idx;
  this.rndStart=false;
  this.twistX=0;
  this.twisty=0;
}

var drawLineB=(lineObject,rt)=>{
  let ln=lineObject.line;
  ctx.beginPath();
  let pt1=pts[ln[0][0]][ln[0][1]];
  let pt2=pts[ln[1][0]][ln[1][1]];
//if (pt1==undefined) debugger;
  ctx.moveTo((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);
  for (let p=0; p<ln.length; p++) {
    let a=(p+1)%ln.length;
    let b=(p+2)%ln.length;
    let cx=pts[ln[a][0]][ln[a][1]].x;
    let cy=pts[ln[a][0]][ln[a][1]].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,
      (cx+pts[ln[b][0]][ln[b][1]].x)/2,
      (cy+pts[ln[b][0]][ln[b][1]].y)/2,
    );
  }
  ctx.strokeStyle=colors[lineObject.idx%colors.length];
  ctx.closePath();
  ctx.globalCompositeOperation="source-over";
  ctx.lineWidth=Math.round(2*EDGE/COUNT)-1;
  ctx.stroke();
  ctx.globalCompositeOperation="lighter";
  ctx.lineWidth=Math.round(2*EDGE/(COUNT+3)/6);
  ctx.stroke();

/*
//  ctx.globalCompositeOperation="source-over";
//  ctx.lineWidth=Math.round(6*EDGE/COUNT);
//ctx.globalCompositeOperation="source-over";
ctx.stroke();
//ctx.globalCompositeOperation="lighter";
ctx.fill();
*/
/*
if (!lineObject.mi) {
  ctx.fillStyle=lineObject.color;
ctx.globalCompositeOperation="darken";
  ctx.fill();
}
*/

}

const EDGE=CSIZE;

var pts=[];
var setPoints=()=>{
  pts=[];
  let d=2*EDGE/(COUNT);
  let xs=getSet();
  let ys=getSet();
  for (let i=0; i<COUNT+1; i++) {
    pts[i]=[];
    for (let j=0; j<COUNT+1; j++) {
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(xs[i]);
      pts[i][j].y=Math.round(ys[j]);
if (Math.abs(xs[i])==EDGE || Math.abs(xs[j])==EDGE) pts[i][j].d=true;
    }
  }
}

var lo=[];

var COUNT=getRandomInt(50,90);
var posX=1+Math.round((COUNT-1)*Math.random());
var posY=1+Math.round((COUNT-1)*Math.random());
var zx=getRandomInt(1,12);
var zy=getRandomInt(1,12);
var qrndx=Math.random()<0.5;
var qrndy=Math.random()<0.5;
var rndRC=Math.random()<0.5;

var getNextQuad=()=>{
  let lidx=qrndx?getRandomInt(1,COUNT-1):posX;
  let lidy=qrndy?getRandomInt(1,COUNT-1):posY;
/*
  //let lidx=posX;
  let lidy=posY;
  let lidx=getRandomInt(1,COUNT-1);
  //let lidy=getRandomInt(1,COUNT-1);
*/

  var eligible=(i,j)=>{
      let sx0=(lidx+i)%COUNT;
      let sy0=(lidy+j)%COUNT;
      let sx1=(lidx+i+1)%COUNT;
      let sy1=(lidy+j+1)%COUNT;
      if (pts[sx0][sy0].d || pts[sx1][sy0].d || pts[sx0][sy1].d || pts[sx1][sy1].d) return false;
      return [sx0,sy0];
  }

  for (let i=0; i<COUNT; i+=zx) {
    for (let j=0; j<COUNT; j+=zy) {
      let rndPair=rndRC?eligible(i,j):eligible(j,i);
      if (rndPair) return rndPair;
/*
      let sx0=(lidx+i)%COUNT;
      let sy0=(lidy+j)%COUNT;
      let sx1=(lidx+i+1)%COUNT;
      let sy1=(lidy+j+1)%COUNT;
      if (pts[sx0][sy0].d || pts[sx1][sy0].d || pts[sx0][sy1].d || pts[sx1][sy1].d) continue;
      return [sx0,sy0];
*/
    }
  }
console.log("QQQ "+COUNT/lineCount);
  return [Math.round(COUNT/2),Math.round(COUNT/2)];
}

var initLine=(idx)=>{
  let lidx,lidy;
  [lidx,lidy]=getNextQuad();
  let line=[];
  line[0]=[lidx,lidy];
  line[1]=[lidx+1,lidy];
  line[2]=[lidx+1,lidy+1];
  line[3]=[lidx,lidy+1];

  pts[lidx][lidy].d=true;
  pts[lidx+1][lidy].d=true;
  pts[lidx+1][lidy+1].d=true;
  pts[lidx][lidy+1].d=true;
// TODO randomize line order?
//  line.push(line.shift());
// a.unshift(...a.splice(n));
  return line;
}

var lineCount;	// temp

var reset=()=>{
ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  COUNT=getRandomInt(40,90);
  setPoints();
  lineCount=4*Math.round(COUNT/4/(1.3+2*Math.random()));
  lo=[];
posX=1+Math.round((COUNT-1)*Math.random());
posY=1+Math.round((COUNT-1)*Math.random());
zx=getRandomInt(1,12);
zy=getRandomInt(1,12);
qrndx=Math.random()<0.7;
qrndy=Math.random()<0.7;
rndRC=Math.random()<0.5;
  let randomize=Math.random()<0.2;
  let TY=0;
  let TX=0;
  if (Math.random()<0.4) TY=18-getRandomInt(2,17,true);	
  if (Math.random()<0.4) TX=18-getRandomInt(2,17,true);
console.log(TX+" "+TY+" "+randomize+" "+(COUNT/lineCount).toFixed(2));
  for (let i=0; i<lineCount; i++) {
    lo[i]=new LineObject(initLine(i),colors[i%colors.length],i);
    lo[i].rndStart=randomize;
    lo[i].twistY=TY;
    lo[i].twistX=TX;
  }
  colors=getColors();
}

var getSet=()=>{	// can't use
  let s=[];
  let d=2*EDGE/(COUNT);
  for (let i=0; i<COUNT; i++) {
    s.push(-EDGE+i*d);
  }
  s.push(EDGE);
  return s;
}

var grow=(lineObject)=>{
  if (!lineObject.mi) return false;
  let ln=lineObject.line;
//  if (Math.random()<0.5) ln.reverse();
//  if (true) ln.reverse();
//  let pst=getRandomInt(0,ln.length);
//ln.unshift(ln.pop());
//ln.unshift(ln.pop());
if (lineObject.rndStart) ln.unshift(...ln.splice(getRandomInt(1,ln.length-1)));
//ln.unshift(...ln.splice(2));
//ln.push(...ln.splice(ln.length-1));
//  let pst=0;
//ln.push(ln.shift());
//  let pst=getRandomInt(0,3);
//  let pst=(lineObject.idx%2)?0:getRandomInt(0,ln.length);
//  let pst=(lineObject.idx%2)?0:getRandomInt(0,ln.length);
/*
  let movex=(s1,s2,c)=>{
    for (let i=0; i<2; i++) {
      let pt1=pts[ln[s1][0]+c[i]][ln[s1][1]];
      let pt2=pts[ln[s2][0]+c[i]][ln[s2][1]];
      if (pt1.d==false && pt2.d==false) {
	ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
	//if (ln.length%3) ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
	//else ln.splice(s2,0,[ln[s2][0]+c[i],ln[s2][1]],[ln[s1][0]+c[i],ln[s1][1]]);
	pt1.d=true;
	pt2.d=true;
//if (!lineObject.idx%4) { ln.unshift(ln.pop()); } 
//if (ln.length%2) ln.push(ln.shift());
//ln.push(ln.shift());
//ln.unshift(ln.pop());
//ln.unshift(ln.pop());
	return true;
      }
    }
  }
*/
  for (let p=0; p<ln.length; p++) {
    //let s1=(pst+p)%ln.length;
    let s1=p;
    let s2=(s1+1)%ln.length;
//    let c=[[-1,1],[1,-1]][getRandomInt(0,2)];
//    let c=(lineObject.idx%2)?[-1,-1]:[1,1];
    let c=[-1,1];
    if (ln[s1][0]==ln[s2][0]) {
    //if (ln[s1][1]==ln[s2][1]) {
//      if (movex(s1,s2,c)) return true;
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]+c[i]][ln[s1][1]];
	let pt2=pts[ln[s2][0]+c[i]][ln[s2][1]];
	if (pt1.d==false && pt2.d==false) {
          if (lineObject.twistX) {
	    if (ln.length%lineObject.twistX) 
              ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
	    else ln.splice(s2,0,[ln[s2][0]+c[i],ln[s2][1]],[ln[s1][0]+c[i],ln[s1][1]]);
          } else {
	    ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
          }
	  pt1.d=true;
	  pt2.d=true;
  //if (!lineObject.idx%4) { ln.unshift(ln.pop()); } 
  //if (ln.length%2) ln.push(ln.shift());
  //ln.push(ln.shift());
  //ln.unshift(ln.pop());
	  return true;
	}
      }
    } else {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]][ln[s1][1]+c[i]];
	let pt2=pts[ln[s2][0]][ln[s2][1]+c[i]];
	if (pt1.d==false && pt2.d==false) {
          if (lineObject.twistY) {
	    if (ln.length%lineObject.twistY) 
              ln.splice(s2,0,[ln[s1][0],ln[s1][1]+c[i]],[ln[s2][0],ln[s2][1]+c[i]]);
	    else ln.splice(s2,0,[ln[s2][0],ln[s2][1]+c[i]],[ln[s1][0],ln[s1][1]+c[i]]);
          } else {
	    ln.splice(s2,0, [ln[s1][0],ln[s1][1]+c[i]], [ln[s2][0],ln[s2][1]+c[i]],);
          }
	  pt1.d=true;
	  pt2.d=true;
  //ln.push(ln.shift());
  //if (!lineObject.idx%4) { ln.push(ln.shift()); }
  //else ln.unshift(ln.pop());
  //ln.push(ln.shift());
//  ln.unshift(ln.pop());
	  return true;
	}
      }
    }
  }
  lineObject.mi=false;  // remove wrapper
  return false;
}

//ctx.fillStyle="hsla(0,0%,0%,0.2)";
var draw=()=>{
  //ctx.globalCompositeOperation="source-over";
  //ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<lo.length; i++) {
    //ctx.strokeStyle=colors[i%colors.length];
    drawLineB(lo[i]);
  }
}

var frac=1;
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

var pidx=0;
var step=0;
var time=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  if (step==0) {
    if (ts-time>60) {
      if (pidx>lo.length-1) {
        step=1;
        pidx=0;
      } else {
        drawLineB(lo[pidx++]);
      }
      time=0;
    }
  } else if (step==2) {
    if (ts-time>1600) {
      time=0;
      step=3;
//      step=0;
//      reset();
    }
  } else if (step==3) {
    if (ts-time>1000) {
      time=0;
      step=0;
      ctx.canvas.style.opacity=1;
      reset();
    } else {
      let frac=1-(ts-time)/1000;
      ctx.canvas.style.opacity=frac;
    }
  } else {
    if (ts-time>8) {  // ?how often true
      frac=0;
      time=0;
      let moved=false;
      for (let i=0; i<lo.length; i++) {
	moved=grow(lo[i]) || moved;
      }
      if (!moved) {
	step=2;
      }
      draw();
    } else {
  //    frac=(ts-time)/duration;
    }
  }
  requestAnimationFrame(animate);
}

onresize();

reset();

//draw();
start();
