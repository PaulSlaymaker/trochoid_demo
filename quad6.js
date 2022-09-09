"use strict"; // Paul Slaymaker, paul25882@gmail.com
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
ctx.lineWidth=60;
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

var colors=[];
var getColors=()=>{
  let c=[];
  let colorCount=4;
  let hue=getRandomInt(90,270);
  for (let i=0; i<colorCount; i++) {
    let hd=Math.round(240/colorCount)*i+getRandomInt(-20,20);
    let sat=70+getRandomInt(0,31);
    let lum=60+getRandomInt(0,11);
    c.splice(getRandomInt(0,c.length+1),0,"hsl("+((hue+hd)%360)+","+sat+"%,"+lum+"%)");
  }
  return c;
}

const getRandomSum=(c,s)=>{
  let ra=[0];
  for (let i=0; i<c-1; i++) ra.push(Math.random());
  ra.push(1);
  ra.sort((a,b)=>{ return a-b; });
  let ra2=new Array(c);
  for (let i=0; i<c; i++) ra2[i]=Math.round(s*(ra[i+1]-ra[i]));
  return ra2;
}

var Point=function() {
  this.x=0;
  this.y=0;
  this.d=false;
}

var segIntensity=getRandomInt(2,20);
var PLine=function(idx,length) {
  this.to=Math.round(length*Math.random());
  this.t=this.to;
  //this.tf=[-1.2,-1,-0.8,0.8,1,1.2][getRandomInt(0,6)];
  this.tf=(0.5+Math.random())*[-1,1][getRandomInt(0,2)];
  this.oo=TP*Math.random();
  this.dash=getRandomSum(2*getRandomInt(1,segIntensity),length);
//  this.lw=10+11*idx;
  this.lw=7+10*idx;
  if (idx%2) this.col="black";
  else this.col=colors[(idx/2)%colors.length];
}

var shape=0;
//var shapesO=[ {"iz":[1,1],"tlength":1519}, {"iz":[2,2],"tlength":1479}, ];

var shapes=[
  {"iz":[5,5],"tlength":2271},	// distinct 2271
  {"iz":[5,4],"tlength":2309},	// distinct 2309
  {"iz":[5,3],"tlength":2283},	// distinct 2283
  {"iz":[3,5],"tlength":2283},	// distinct 2283
  {"iz":[5,2],"tlength":2284},
//  {"iz":[5,1],"tlength":2321},		// ==1,1
//  {"iz":[1,5],"tlength":2321},		// ==1,1
  {"iz":[4,4],"tlength":2271},
  {"iz":[4,3],"tlength":2229},
  {"iz":[3,4],"tlength":2309},
//  {"iz":[4,1],"tlength":2296},	// ==1,2
//  {"iz":[1,4],"tlength":2321},	// ==1,1
  {"iz":[3,3],"tlength":2294},
  {"iz":[3,2],"tlength":2269},
  {"iz":[1,3],"tlength":2307},	
//  {"iz":[3,1],"tlength":2307},	// ==1,3
//  {"iz":[2,1],"tlength":2321},	// ==1,1
  {"iz":[1,2],"tlength":2296},
  {"iz":[1,1],"tlength":2321},
//  {"iz":[2,2],"tlength":1479},
];

var drawLineC=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.setLineDash([]);
  ctx.strokeStyle=colors[0];
  ctx.closePath();
  ctx.lineWidth=2;
  ctx.stroke(path);

  ctx.lineDashOffset=0;  //-t-2300;
  ctx.setLineDash([1,4000]);
  ctx.strokeStyle="white";
  ctx.lineWidth=20;
  ctx.stroke(path);

ctx.setLineDash([1,4000]);
//ctx.setLineDash([1,shapes[shape].tlength]);
ctx.lineDashOffset=-shapes[shape].tlength-2*t;
//  ctx.lineDashOffset=-2*t;
  ctx.lineWidth=18;
  ctx.strokeStyle=colors[0];
  ctx.stroke(path);

}

const EDGE=CSIZE;

var pts=[];
var setPoints=()=>{
  pts=[];
//let xs=[-50,50,160,240,350,450];
let ss=[-33,33,100,167,233,300,367,433];	// for (let i=0; i<8; i++) console.log(Math.round(-400/6/2+i*400/6))
  for (let i=0; i<COUNT+1; i++) {
    pts[i]=[];
    for (let j=0; j<COUNT+1; j++) {
      pts[i][j]=new Point();
      pts[i][j].x=Math.round(ss[i]);
      pts[i][j].y=Math.round(ss[j]);
      if (i==0 || j==0 || i==COUNT || j==COUNT) pts[i][j].d=true;
    }
  }
}

var COUNT=7; //getRandomInt(30,70);
//var lineWidthA=Math.round(2*EDGE/COUNT)-1;

var initLine=()=>{
  let lidx=shapes[shape].iz[0];
  let lidy=shapes[shape].iz[1];
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

var reset=()=>{
  setPoints();
  shape=getRandomInt(0,shapes.length);
  let line=initLine();
  while (grow(line));
  colors=getColors();
  segIntensity=getRandomInt(2,14,true);
//console.log("seg "+segIntensity);
  setDashes();
  path=generatePath(line);
  drawPane();
}

var grow=(ln)=>{
//if (lineObject.rndStart) ln.unshift(...ln.splice(getRandomInt(1,ln.length-1)));
//ln.push(...ln.splice(ln.length-1));
  for (let p=0; p<ln.length; p++) {
    let s1=p;
    let s2=(s1+1)%ln.length;
    let c=[-1,1];
    if (ln[s1][0]==ln[s2][0]) {
      for (let i=0; i<2; i++) {
	let pt1=pts[ln[s1][0]+c[i]][ln[s1][1]];
	let pt2=pts[ln[s2][0]+c[i]][ln[s2][1]];
	if (pt1.d==false && pt2.d==false) {
	  ln.splice(s2,0,[ln[s1][0]+c[i],ln[s1][1]],[ln[s2][0]+c[i],ln[s2][1]]);
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
	  ln.splice(s2,0, [ln[s1][0],ln[s1][1]+c[i]], [ln[s2][0],ln[s2][1]+c[i]],);
	  pt1.d=true;
	  pt2.d=true;
	  return true;
	}
      }
    }
  }
  return false;
}

const pane=new Path2D();
pane.moveTo(0,-CSIZE);
pane.lineTo(0,CSIZE);
pane.moveTo(-CSIZE,0);
pane.lineTo(CSIZE,0);

var drawPane=()=>{
  ctx.globalAlpha=1;
ctx.setLineDash([]);
ctx.strokeStyle=colors[0];
ctx.lineWidth=2;
ctx.stroke(pane);
ctx.globalAlpha=0.7;
}

var draw=()=>{
  //ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
for (let i=0; i<p.length; i++) {
  ctx.setLineDash(p[i].dash);
  ctx.lineDashOffset=Math.sin(p[i].oo+t/400)*p[i].to-1.4*t*p[i].tf;
  ctx.lineWidth=p[i].lw;
  ctx.strokeStyle=p[i].col;
  ctx.stroke(path);
}
//  drawLineC();
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

var t=0;
var s=0;
var animate=(ts)=>{
  if (stopped) return;
  t++;
  if (s++>1200) {
    if (s==1240) {
      ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
      reset();
      t=0;
      ctx.canvas.style.opacity=1;
    }
    if (s-1200<40) {
      ctx.canvas.style.opacity=(1240-s)/40;
    } else {
      ctx.canvas.style.opacity=(s-1240)/40;
    }
    if (s==1280) { ctx.canvas.style.opacity=1; s=0; }
  }
if (EM && t%200==0) stopped=true;
  draw();
  requestAnimationFrame(animate);
}

onresize();

var p=[];
var setDashes=()=>{
  p=[];
  for (let i=0; i<7; i++) {
    p[i]=new PLine(i,shapes[shape].tlength);
  }
  p.reverse();
p[0].dash=[1,shapes[shape].tlength];
p[0].to=0;
p[0].tf=1;
}

var generatePath=(ln)=>{
  var pathX=new Path2D();
  let pt1=pts[ln[0][0]][ln[0][1]];
  let pt2=pts[ln[1][0]][ln[1][1]];
  pathX.moveTo((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2);
  for (let p=0; p<ln.length; p++) {
    let a=(p+1)%ln.length;
    let b=(p+2)%ln.length;
    let cx=pts[ln[a][0]][ln[a][1]].x;
    let cy=pts[ln[a][0]][ln[a][1]].y;
    pathX.bezierCurveTo(cx,cy,cx,cy,
      (cx+pts[ln[b][0]][ln[b][1]].x)/2,
      (cy+pts[ln[b][0]][ln[b][1]].y)/2,
    );
  }
  const dma=[
    new DOMMatrix([1,0,0,1,0,0]),
    //new DOMMatrix([0,1,1,0,0,0]),
    //new DOMMatrix([0,-1,1,0,0,CSIZE]),
    //new DOMMatrix([0,-1,-1,0,CSIZE,CSIZE]),
    //new DOMMatrix([0,1,-1,0,CSIZE,0]),
    new DOMMatrix([0,1,-1,0,CSIZE,0]),
    new DOMMatrix([-1,0,0,-1,CSIZE,CSIZE]),
    new DOMMatrix([0,-1,1,0,0,CSIZE]),
  ];
  var path=new Path2D();
  let q=getRandomInt(0,4);
//console.log("rot "+q);
  path.addPath(pathX, dma[q]);

  path.addPath(path,new DOMMatrix([-1,0,0,1,0,0]));
  path.addPath(path,new DOMMatrix([-1,0,0,-1,0,0]));
  return path;
}

var path;
reset();

//draw();
start();
