"use strict"; // Paul Slaymaker, paul25882@gmail.com, https://codepen.io/aymak/pen/ZErXxpo
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
var CSIZE=400;

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

var getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
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

var F=0;
var t=[5,66,127,188,249,310,371,432,493,554,615,676,737,798,859,920,981];
var cidx=0;
var animate=(ts)=>{
  if (stopped) return;
  for (let i=0; i<t.length; i++) t[i]++;
  if (t[t.length-1]>1000) t.pop();
  if (t[0]>80) t.unshift(0);
  huex+=0.5;
  //ctx.lineWidth=3*Math.pow(Math.cos(TP*cidx++/4000),2);
//  ctx.lineWidth=Math.round(3*Math.pow(Math.cos(TP*cidx++/4000),2));
  //if (cidx%2000==1000) F++;
  if (cidx++%2000==1000) F++;
  draw();
  requestAnimationFrame(animate);
}

const func=[
  (d1,d2,d3,d4)=>{
    let path=new Path2D();
    path.ellipse((d1+d2)/2,(d3+d4)/2,(d2-d1)/2,(d4-d3)/2,0,0,TP);
    return path;
  },
  (d1,d2,d3,d4)=>{
    let path=new Path2D();
    path.moveTo(d1,d3);
    path.lineTo(d2,d4);
    path.moveTo(d3,d2);
    path.lineTo(d4,d1);
    return path;
  },
  (d1,d2,d3,d4)=>{
    let path=new Path2D();
    path.moveTo(d1,d3);
    path.lineTo(d2,d3);
    path.moveTo(d3,d1);
    path.lineTo(d3,d2);
    return path;
  }
];

const dm1=new DOMMatrix([1,0,0,-1,0,0]);
const dm2=new DOMMatrix([-1,0,0,1,0,0]);
var huex=getRandomInt(0,360);
//ctx.fillStyle="white";

var draw=()=>{
ctx.fillStyle="#00000010";
  ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
/*
  ctx.beginPath();
  ctx.arc(0,0,6,0,TP);
  ctx.closePath();
ctx.fillStyle="white";
  ctx.fill();
*/
  let d=[];
  for (let i=0; i<t.length; i++) d.push(Math.pow(t[i]/200,4));
  for (let i=0; i<d.length-1; i++) {

//    ctx.moveTo(d[i+1],d[i]+(d[i+1]-d[i])/2);
//    ctx.ellipse((d[i]+d[i+1])/2,(d[i]+d[i+1])/2,(d[i+1]-d[i])/2,(d[i+1]-d[i])/2,0,0,TP);
//    ctx.moveTo(d[i+1],-d[i]-(d[i+1]-d[i])/2);
//    ctx.ellipse((d[i]+d[i+1])/2,-(d[i]+d[i+1])/2,(d[i+1]-d[i])/2,(d[i+1]-d[i])/2,0,0,TP);
    for (let j=0; j<d.length-1; j++) {
/*
//      path.moveTo(d[j+1],d[i]+(d[i+1]-d[i])/2);
      path.ellipse((d[i]+d[i+1])/2,(d[j]+d[j+1])/2,(d[i+1]-d[i])/2,(d[j+1]-d[j])/2,0,0,TP);
*/

      let path=func[F%3](d[i],d[i+1],d[j],d[j+1]);

/*
      path.moveTo((d[i]+d[i+1])/2,d[j]);
      path.lineTo(d[i],(d[j]+d[j+1])/2);
      path.lineTo((d[i]+d[i+1])/2,d[j+1]);
      path.lineTo(d[i+1],(d[j]+d[j+1])/2);
      path.closePath();
*/

/*
      let path=new Path2D();
      path.moveTo(d[i],d[j]);
      path.lineTo(d[i+1],d[j+1]);
      path.moveTo(d[j],d[i+1]);
      path.lineTo(d[j+1],d[i]);
*/

/*
      let path=new Path2D();
      path.moveTo(d[i],d[j]);
      path.lineTo(d[i+1],d[j]);
      path.moveTo(d[j],d[i]);
      path.lineTo(d[j],d[i+1]);
*/

      path.addPath(path,dm1);
      path.addPath(path,dm2);
//let c=Math.round((d[j+1]-d[j])*(d[i+1]-d[i])/20);
      let c=2*Math.round((d[j+1]-d[j])+(d[i+1]-d[i]));
      ctx.strokeStyle="hsl("+((c+huex)%360)+",100%,50%)";
      ctx.stroke(path);
    }
  }
}

onresize();
start();
