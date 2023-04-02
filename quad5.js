"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/NWvWEZM
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

var COUNT=getRandomInt(40,90);

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

var LineObject=function(start,len,color) {
  this.start=start;
  this.length=len;
  this.color=color;
}

var drawLineB2=(lobj)=>{
  ctx.beginPath();
  let a1=lobj.start;
  let a2=(lobj.start+1)%line.length;
  let pt1=pts[line[a1][0]][line[a1][1]];
  let pt2=pts[line[a2][0]][line[a2][1]];
  ctx.moveTo((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);
  for (let p=0; p<lobj.length-1; p++) {
    let a=(p+1+a1)%line.length;
    let b=(p+2+a1)%line.length;
    let cx=pts[line[a][0]][line[a][1]].x;
    let cy=pts[line[a][0]][line[a][1]].y;
    ctx.bezierCurveTo(cx,cy,cx,cy,
      (cx+pts[line[b][0]][line[b][1]].x)/2,
      (cy+pts[line[b][0]][line[b][1]].y)/2,
    );
  }
  ctx.strokeStyle=lobj.color;
  ctx.globalCompositeOperation="source-over";
  ctx.lineWidth=Math.round(2*EDGE/COUNT)-1;
  ctx.stroke();
  ctx.globalCompositeOperation="lighter";
  //ctx.lineWidth=Math.round(2*EDGE/(COUNT+3)/8);
  ctx.lineWidth=Math.round(2*EDGE/(COUNT+3)/6);
  ctx.stroke();
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

var line=[];
var lo=[];

var initLine=()=>{
  let lidx=getRandomInt(1,COUNT-1);
  let lidy=getRandomInt(1,COUNT-1);
  let line=[];
  line[0]=[lidx,lidy];
  line[1]=[lidx+1,lidy];
  line[2]=[lidx+1,lidy+1];
  line[3]=[lidx,lidy+1];
  pts[lidx][lidy].d=true;
  pts[lidx+1][lidy].d=true;
  pts[lidx+1][lidy+1].d=true;
  pts[lidx][lidy+1].d=true;
  return line;
}

var transit=()=>{
  colors=getColors();
  COUNT=getRandomInt(30,90);
  setPoints();
  line=initLine();
  while (grow(line)); //{ }
  lo=[];
  let len=getRandomInt(10,130);
  let lineCount=Math.round(line.length/len);
  for (let i=0; i<lineCount; i++) {
    lo[i]=new LineObject(i*len,len,colors[i%colors.length]);
  }
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

var grow=(ln)=>{
  if (Math.random()<0.5) ln.reverse();
  let pst=getRandomInt(0,ln.length);
  for (let p=0; p<ln.length; p++) {
    let s1=(pst+p)%ln.length;
    let s2=(s1+1)%ln.length;
    let c=[[-1,1],[1,-1]][getRandomInt(0,2)];
    if (ln[s1][0]==ln[s2][0]) {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]+c[i]][ln[s1][1]];
	let pt2=pts[ln[s2][0]+c[i]][ln[s2][1]];
	if (pt1.d==false && pt2.d==false) {
	  ln.splice(s2,0,
	    [ln[s1][0]+c[i],ln[s1][1]],
	    [ln[s2][0]+c[i],ln[s2][1]]
	  );
	  pt1.d=true;
	  pt2.d=true;
	  return true;
	}
      }
    } else {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]][ln[s1][1]+c[i]];
	let pt2=pts[ln[s2][0]][ln[s2][1]+c[i]];
	if (pt1.d==false && pt2.d==false) {
	  ln.splice(s2,0,
	    [ln[s1][0],ln[s1][1]+c[i]],
	    [ln[s2][0],ln[s2][1]+c[i]]
	  );
	  pt1.d=true;
	  pt2.d=true;
          return true;
	}
      }
    }
  }
  return false;
}

var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<lo.length; i++) drawLineB2(lo[i]);
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

var gtransform=[
  (r)=>{ let d=1-r/300; return "rotateX("+r+"deg) rotateY("+r+"deg) scale("+d+")" }, 
  (r)=>{ let d=1-r/300; return "rotateX(-"+r+"deg) rotateY("+r+"deg) scale("+d+")" }, 
];

var S=0;
var rot=0;
var GT=0;
var step=()=>{
  if (S==0) {
    if (Math.random()<0.0015) {
      S=1;
      GT=getRandomInt(0,2);
    }
  } else if (S==1) {
    rot+=0.6;
    if (rot>90) {
      rot=90;
      transit();
      S=2;
      if (GT==0) GT=1;
      else if (GT==1) GT=0;
    }
    ctx.canvas.style.transform=gtransform[GT](rot);
  } else if (S==2) {
    rot-=0.6;
    if (rot<0) { rot=0; S=0; }
    ctx.canvas.style.transform=gtransform[GT](rot);
  }
}

var time=0;
var pause=false;
const duration=32;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) time=ts;
  step();
  if (ts-time>duration) {
    time=0;
    line.push(line.shift());
    draw();
  }
  requestAnimationFrame(animate);
}

onresize();
transit();

start();
