"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/WNXBJgZ
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
const getRandomSum=(c,s)=>{
  let ra=new Array(c);
  let sum=0;
  for (let i=0; i<c; i++) {
    ra[i]=Math.random();
    sum+=ra[i];
  }
  let ra2=ra.map((rp)=>{ return Math.round(s/sum*rp); });
  let rr=ra2.reduce((p,n)=>{ return p+n; });
  ra2[0]+=s-rr;
  return ra2;
}
*/

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

function cFrac(frac) {
  let f1=.2;
  let f2=.8;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
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
var f=0;
var f2=0;
function animate(ts) {
  if (stopped) return;
  t++;
if (t%2) {
  for (let i=0; i<arcs.length; i++) {
    arcs[i].setOffset();
  }
}
  if (t%8==0) { for (let i=0; i<hues.length; i++) hues[i]=(++hues[i])%360; setColors(); }
  let rt=t%230;
  if (rt==0) {
    transit();
if (EM) stopped=true;
  }
  f=cFrac(rt/230);
  let rt2=t%270;
  if (rt2==0) {
    for (let i=0; i<arcs.length; i++) {
      arcs[i].da=arcs[i].da2;
      arcs[i].da2=getRandomSumN(arcs[i].dc);
    }
  }
  f2=cFrac(rt2/270);
  draw();
  requestAnimationFrame(animate);
}

var hues=[];
var colors=new Array(4);
var getHues=()=>{
  let h=[];
  let hueCount=4;
  let hr=Math.round(90/hueCount);
  //let hue=getRandomInt(0,90,true)+30;
  let hue=getRandomInt(-30,30);
  for (let i=0; i<hueCount; i++) {
    let hd=(hue+Math.round(240/hueCount)*i+getRandomInt(-hr,hr))%360;
    h.splice(getRandomInt(0,h.length+1),0,hd);
  }
  return h;
}
hues=getHues();

var setColors=()=>{
  colors[0]="hsl("+hues[0]+",100%,35%)";
  colors[1]="hsl("+hues[1]+",94%,60%)";
  colors[2]="hsl("+hues[2]+",100%,35%)";
  colors[3]="hsl("+hues[3]+",94%,60%)";
}
setColors();

/*
var getRandomDash=()=>{
  let sp=this.dc*(this.width+SPC);
  let s=this.radius*TP-sp;
  let ra=getRandomSum(this.dc,s);
  var dsh=[];
  for (let i=0; i<this.dc; i++) {
    dsh.push(ra[i]); 
    dsh.push(this.width+SPC); 
  }
  return dsh;
}
*/

//var IDX5=6;

var Arc=function(r,w,idx) {
  this.radius=r;
  this.width=w;
  this.dc=getRandomInt(2,3+idx);	// dash count
  this.da=getRandomSumN(this.dc);
  //this.dash=[r*TP/this.dc-w-SPC,w+SPC];
  this.offset=0;
/*
  this.getRandomDash=()=>{
    let sp=this.dc*(this.width+SPC);
    let s=this.radius*TP-sp;
    let ra=getRandomSum(this.dc,s);
    var dsh=[];
    for (let i=0; i<this.dc; i++) {
      dsh.push(ra[i]); 
      dsh.push(this.width+SPC); 
    }
    return dsh;
  }
*/
  this.setOffset=()=>{
    if (idx%2) this.offset+=1;
    else this.offset-=1;
    let radius=(1-f)*this.radius+f*this.radius2;
    if (Math.abs(this.offset%(radius*TP))<1) this.offset=0;
  }
/*
  this.draw=()=>{
    ctx.lineWidth=this.width;
    ctx.setLineDash(this.dash);
    ctx.lineDashOffset=this.offset;
    ctx.beginPath();
    ctx.arc(0,0,this.radius,0,TP);
    ctx.stroke();
  }
*/
  this.drawArcT=()=>{
    ctx.beginPath();
    let width=(1-f)*this.width+f*this.width2;
    ctx.arc(0,0,width,0,TP);
    ctx.fillStyle=colors[0];
    ctx.fill();
  }
  this.drawT=()=>{
    if (idx==0) { this.drawArcT(); return; }
    let width=(1-f)*this.width+f*this.width2;
    let radius=(1-f)*this.radius+f*this.radius2;;
    ctx.lineWidth=width;
    ctx.setLineDash([Math.max(1,radius*TP/this.dc-width-SPC),width+SPC]);
    if (this.da) {
      let dash=[];
      let seg=radius*TP-this.dc*(width+SPC);
      for (let i=0; i<this.da.length; i++) {
        //dash.push(Math.max(1,this.da[i]*seg));
        dash.push(Math.max(1,((1-f2)*this.da[i]+f2*this.da2[i])*seg));
        dash.push(width+SPC);
      }
//console.log(dash);
      ctx.setLineDash(dash);
    }
//if (idx!=IDX5) 
    //ctx.setLineDash([(1-f)*this.dash[0]+f*this.dash2[0],(1-f)*this.dash[1]+f*this.dash2[1]]);
/*
if (idx==5) {
  let dsh=[];
  for (let i=0; i<this.dash.length; i++) {
    dsh[i]=(1-f)*this.dash[i]+f*this.dash2[i],(1-f)*this.dash[1]+f*this.dash2[1]]);
  }
*/
    ctx.lineDashOffset=this.offset;
    ctx.beginPath();
    ctx.arc(0,0,radius,0,TP);
    ctx.stroke();
  }
}

var transit=()=>{
  for (let i=0; i<arcs.length; i++) {
    arcs[i].radius=arcs[i].radius2;
    arcs[i].width=arcs[i].width2;
  }
  randomizeRadii();
}

var R=200;
ctx.lineWidth=80;
var hl=R*TP/2;
ctx.setLineDash([hl-ctx.lineWidth,ctx.lineWidth]);

ctx.strokeStyle=colors[0];
var draw=()=>{
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<arcs.length; i++) {
    //if (i==IDX5) ctx.strokeStyle="white"; else    
    ctx.strokeStyle=colors[i%colors.length];
    arcs[i].drawT();
  }
}

onresize();

//var LC=12;
var LC=12;
const raSet=[];
for (let i=1; i<36; i++) raSet.push(i/36);	// 42 for LC=12
const SPC=16;

var randomizeRadii=()=>{
  let raset=raSet.slice();
  let er=[0];	// edge radii
  //for (let i=0; i<LC-1; i++) er.push(CSIZE*(raset.splice(getRandomInt(0,raset.length,true),1)[0]));
  for (let i=0; i<LC-1; i++) er.push(CSIZE*(raset.splice(getRandomInt(0,raset.length),1)[0]));
  er.sort((a,b)=>{ return a-b; });
  er.push(CSIZE);
  for (let i=0; i<LC; i++) {
    let rad=(er[i]+er[i+1])/2;
    let width=2*(rad-er[i]);
    arcs[i].radius2=rad;
    arcs[i].width2=width;
//    arcs[i].da2=getRandomSumN(arcs[i].dc);
  }
}

let raset=raSet.slice();

var RA=[0];
for (let i=0; i<LC-1; i++) {
//  RA.push(CSIZE*Math.random());	
  // get 16-separated radii, 400/16=25 possible or 0.04 random interval
  //RA.push(CSIZE*Math.round(25*Math.random())/25;
  RA.push(CSIZE*(raset.splice(getRandomInt(0,raset.length,true),1)[0]));
}
RA.sort((a,b)=>{ return a-b; });
RA.push(CSIZE);

var arcs=[];
for (let i=0; i<LC; i++) arcs.push(new Arc(0,0,i));

var sumArray=(a)=>{ return a.reduce((p,n)=>{ return p+n; }); } 	// diag

randomizeRadii();
for (let i=0; i<arcs.length; i++) arcs[i].da2=getRandomSumN(arcs[i].dc);
transit();

start();
