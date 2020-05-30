"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";

/*
const canvas=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  body.append(c);
  return c;
})();
*/
const canvas=document.getElementById("cts");

var ctx=canvas.getContext('2d');
ctx.fillStyle="#4444AA";

var fillContext=(()=>{
  var osc=document.createElement("canvas");
  osc.width=800;
  osc.height=800;
  return osc.getContext("2d");
})();

onresize=function() { 
  let ss=ctx.strokeStyle;
  let D=0.9*Math.min(window.innerWidth,window.innerHeight); 
  canvas.width=D;
  canvas.height=D;
  fillContext.canvas.width=D;
  fillContext.canvas.height=D;
  P=D/2;
  ctx.translate(P,P);
  ctx.strokeStyle=ss;
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var O=0;
var Q=1/16;
var P=400;
var S=100;
var W=2;
var C=2;

var RZ1=323.5;
//RZ=P*Math.cos(n/(2*W))*Math.cos(Math.sin(n/(2*W)))    
// W=5, t=0.1 and 0.2
// W=4, t=0.125, just one radius
// W=3, t=0.1666667, one radius: P/2
var RZ2=123.4;

var getPattern=function() {
  fillContext.fillStyle="hsl("+getRandomInt(0,360)+",70%,50%)";
  fillContext.fillRect(0,0,2*P,2*P);
  //let t=4/W*Math.PI;
  let tx=1/W*Math.PI;
  let RZ=Math.abs(P*Math.cos(tx)*Math.cos(Math.sin(W*tx)));    
  fillContext.beginPath();
  fillContext.arc(P,P,RZ,0,2*Math.PI);
  fillContext.closePath();
  fillContext.fillStyle="hsl("+getRandomInt(0,360)+",70%,50%)";
  fillContext.fill();
  if (W>5) {
    let t=2*tx;
    RZ=Math.abs(P*Math.cos(t)*Math.cos(Math.sin(W*t)));    
    fillContext.beginPath();
    fillContext.arc(P,P,RZ,0,2*Math.PI);
    fillContext.closePath();
    fillContext.fillStyle="hsl("+getRandomInt(0,360)+",70%,50%)";
    fillContext.fill();
  }
  if (W>7) {
    let t=3*tx;
    RZ=Math.abs(P*Math.cos(t)*Math.cos(Math.sin(W*t)));    
    fillContext.beginPath();
    fillContext.arc(P,P,RZ,0,2*Math.PI);
    fillContext.closePath();
    fillContext.fillStyle="hsl("+getRandomInt(0,360)+",70%,50%)";
    fillContext.fill();
  }
  if (W>9) {
    let t=4*tx;
    RZ=Math.abs(P*Math.cos(t)*Math.cos(Math.sin(W*t)));    
    fillContext.beginPath();
    fillContext.arc(P,P,RZ,0,2*Math.PI);
    fillContext.closePath();
    fillContext.fillStyle="hsl("+getRandomInt(0,360)+",70%,50%)";
    fillContext.fill();
  }
  return ctx.createPattern(fillContext.canvas,"no-repeat");
}

var randomizeFill=()=>{
  if (C%2==1 && W>3) {
    return [getPattern(),"black"];
  } else {
    return [
      "hsl("+getRandomInt(0,360)+",90%,70%)",
      "hsl("+getRandomInt(0,360)+",90%,70%)"
    ];
  }
}
var fs=randomizeFill();
var fanFill={
//  let ff=new Object();
//  ff.fs=[];
  type:"bin"
/*
  this.randomize=()=>{
    if (C%2==1 && W>3) {
      this.type="rad";
      fs=[getPattern(),"black"];
    } else {
      fs=[
	"hsl("+getRandomInt(0,360)+",90%,70%)",
	"hsl("+getRandomInt(0,360)+",90%,70%)"
      ];
    }
  }
  return ff;
*/
};

var getFill=(i)=>{
  if (C%2==0) {
    return fs[i%2];
  } else {
    return fs[0];
  }
}

var draw=()=>{
  ctx.clearRect(-P,-P,canvas.width,canvas.height);
  for (let c=1; c<=C; c++) {
    ctx.fillStyle=getFill(c);
    ctx.beginPath();
    //let o=0;
    //let o=c*Math.PI/C; // tiler
    let o=Math.cos(O%Math.PI)*c*Math.PI/C; 
    //let o=O*c*Math.PI/C; 
    //let q=1/(4*C);
    let q=o/(c*4*Math.PI);
    ctx.moveTo(P*Math.sin(o),P*Math.cos(o));
    S=4*W;
    for (let r=0; r<=S; r++) {
      let Z=q*Math.sin(W*r*2*Math.PI/S);
      let r2=Math.cos(2*r*Math.PI/S);
      ctx.lineTo(r2*P*Math.sin(Z*2*Math.PI+o),r2*P*Math.cos(Z*2*Math.PI+o));
    }
    ctx.closePath();
    ctx.stroke();
    if (C%2==1 && W>3) {
      ctx.save();
      ctx.translate(-P,-P);
      ctx.fill("evenodd");
      ctx.restore();
    } else {
      ctx.fill("evenodd");
    }
  }
}

var pauseTS=1200;
var pause=(ts)=>{
  if (stopped) {
    return;
  }
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var time=0;
var stopped=true;
var frac=1;
var animate=(ts)=>{
  if (stopped) return;
  //ctx.clearRect(0,0,canvas.width,canvas.height);
  O+=0.008;
  if (Math.abs(Math.cos(O%Math.PI))<0.01) {
    C=getRandomInt(2,20);
    W=getRandomInt(2,11);
    fs=randomizeFill();
  }
  draw();
  if (Math.abs(Math.sin(O%Math.PI))<0.01) {
    pauseTS=performance.now()+800;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var start=()=>{
  if (stopped) {
    ctx.strokeStyle="hsl("+getRandomInt(0,360)+",90%,70%)";
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
canvas.addEventListener("click", start, false);

var getStdRange=(min,max,step)=>{
  let sr=document.createElement("input");
  sr.type="range";
  sr.min=min;
  sr.max=max;
  sr.step=step;
  sr.style.display="block";
  return sr;
}

var controls=document.getElementById("controls");
controls.append(
  (()=>{
    let q=getStdRange(0.001,0.2,0.001);
    q.value=Q;
    q.oninput=()=>{
      Q=parseFloat(q.value);
      draw();
    }
    return q;
  })(),
  (()=>{
    let w=getStdRange(1,16,1);
    w.value=W;
    w.oninput=()=>{
      W=parseFloat(w.value);
      draw();
    }
    return w;
  })(),
  (()=>{
    let s=getStdRange(4,200,1);
    s.value=S;
    s.oninput=()=>{
      S=s.value;
      draw();
    }
    return s;
  })(),
  (()=>{
    let c=getStdRange(0,40,1);
    c.value=C;
    c.oninput=()=>{
      C=c.value;
      draw();
    }
    return c;
  })(),
  (()=>{
    let o=getStdRange(0,10,0.001);
    o.value=O;
    o.oninput=()=>{
      O=o.value;
      draw();
    }
    return o;
  })(),

/*
  (()=>{
    let r=getStdRange(50,400,0.1);
    r.value=RZ2;
    r.oninput=()=>{
      RZ2=r.value;
      draw();
    }
    return r;
  })(),
*/

);

//draw(1);
onresize();
start();
