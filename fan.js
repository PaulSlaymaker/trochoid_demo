"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
body.style.margin="20";

const ctx=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="center";
  body.append(d);
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  d.append(c);
  return c.getContext("2d");
})();

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var randomColor=()=>{
  let hue=getRandomInt(0,360);
  let sat=getRandomInt(70,90);
  let lum=getRandomInt(50,70);
  return "hsl("+getRandomInt(0,360)+","+sat+"%,"+lum+"%)";
}

var fillContext=(()=>{
  var osc=document.createElement("canvas");
  osc.width=800;
  osc.height=800;
  let fctx=osc.getContext("2d");
  fctx.setBackground=()=>{ 
    fctx.fillStyle=randomColor();
    fctx.fillRect(0,0,2*P,2*P);
  }
  fctx.setCircle=(tx)=>{ 
    let RZ=Math.abs(P*Math.cos(tx)*Math.cos(Math.sin(W*tx)));    
    fctx.beginPath();
    fctx.arc(P,P,RZ,0,2*Math.PI);
    fctx.closePath();
    fctx.fillStyle=randomColor();
    fctx.fill();
  }
  return fctx;
})();

onresize=function() { 
  let D=0.9*Math.min(window.innerWidth,window.innerHeight); 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  fillContext.canvas.width=D;
  fillContext.canvas.height=D;
  P=D/2;
  ctx.translate(P,P);
}

var O=0;
var Q=1/16;
var P=400;
var S=100;
var W=2;
var C=2;

//var RZ1=323.5;
//var RZ2=123.4;
//RZ=P*Math.cos(n/(2*W))*Math.cos(Math.sin(n/(2*W)))    
// W=5, t=0.1 and 0.2
// W=4, t=0.125, just one radius
// W=3, t=0.1666667, one radius: P/2

var getPattern=function() {
  fillContext.setBackground();
  let tx=1/W*Math.PI;
  fillContext.setCircle(tx);
  if (W>5) fillContext.setCircle(2*tx);
  if (W>7) fillContext.setCircle(3*tx);
  if (W>9) fillContext.setCircle(4*tx);
  return ctx.createPattern(fillContext.canvas,"no-repeat");
}

var fanFill={
  fs:[],
  ss:"black",
  type:"bin",
  randColors:(count)=>{
    let c=[];
    for (let i=0; i<count; i++) c.push(randomColor());
    return c;
  },
  randomize:()=>{
    if (C%2==1) {
        fanFill.type="rad";
        fanFill.fs=[getPattern(),"black"];
    } else {
      if (C==12) {
        fanFill.type="ter";
        fanFill.fs=fanFill.randColors(3);
      } else {
        fanFill.type="bin";
        fanFill.fs=fanFill.randColors(2);
      }
    }
  },
  getFill:(i)=>{
    if (fanFill.type=="rad") {
      return fanFill.fs[0];
    } else if (fanFill.type=="ter") {
      return fanFill.fs[Math.abs((i-6))%3];
    } else {
      if (W==3) {
        return fanFill.fs[0];
      } else {
        return fanFill.fs[i%2];
      }
    }
  },
}
var fanColor=fanFill;

let fsx1=randomColor();
//let fsx2=randomColor();
var draw=()=>{
  ctx.clearRect(-P,-P,ctx.canvas.width,ctx.canvas.height);
  for (let c=1; c<=C; c++) {
    let pts=[];
    let o=Math.cos(O%Math.PI)*c*Math.PI/C; 
    let q=o/(c*4*Math.PI);
    pts.push([P*Math.sin(o),P*Math.cos(o)]);
    S=4*W;
    for (let r=0; r<=S; r++) {
      let Z=q*Math.sin(W*r*2*Math.PI/S);
      let r2=Math.cos(2*r*Math.PI/S);
      pts.push([r2*P*Math.sin(Z*2*Math.PI+o),r2*P*Math.cos(Z*2*Math.PI+o)]);
    }
    if (W%2==1) {
      ctx.fillStyle=fsx1;
      ctx.strokeStyle=fsx1;
      ctx.beginPath();
      ctx.moveTo(pts[2][0],pts[2][1]);
      ctx.lineTo(pts[S/2][0],pts[S/2][1]);
      ctx.lineTo(pts[S/2+2][0],pts[S/2+2][1]);
      ctx.lineTo(pts[S][0],pts[S][1]);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

/*
if (c%2==0) {
  ctx.fillStyle=fsx1;
  ctx.strokeStyle=fsx1;
} else {
  ctx.fillStyle=fsx2;
  ctx.strokeStyle=fsx2;
}
*/
//  S=12; //S=4*W;

/*
if (c%2==0) {
  ctx.fillStyle=fsx2;
  ctx.strokeStyle=fsx2;
} else {
  ctx.fillStyle=fsx1;
  ctx.strokeStyle=fsx1;
}
*/

  } else {
    ctx.fillStyle=fsx1;
    ctx.strokeStyle=fsx1;
    ctx.beginPath();
    ctx.moveTo(pts[2][0],pts[2][1]);
    ctx.lineTo(pts[S/2+2][0],pts[S/2+2][1]);
    ctx.lineTo(pts[S/2][0],pts[S/2][1]);
    ctx.lineTo(pts[S][0],pts[S][1]);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
//ctx.arc(pts[S][0],pts[S/2+2][1],20,0,2*Math.PI);
//ctx.fill();

  }
    ctx.beginPath();
    ctx.moveTo(pts[0][0],pts[0][1]);
    for (let i=1; i<pts.length; i++) {
      ctx.lineTo(pts[i][0],pts[i][1]);
    }
    ctx.closePath();
    ctx.strokeStyle="#555";
    ctx.stroke();
    ctx.fillStyle=fanFill.getFill(c);
    if (fanFill.type=="rad") {
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
  O+=0.01;
  if (Math.abs(Math.cos(O%Math.PI))<0.01) {
    C=getRandomInt(2,20);
    W=getRandomInt(2,Math.min(11,2*C));
    fanFill.randomize();
    fsx1=randomColor();
  }
  draw();
  if (Math.abs(Math.sin(O%Math.PI))<0.01) {
    pauseTS=performance.now()+400;
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var start=()=>{
  if (stopped) {
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

/*
body.style.display="grid";
body.append((()=>{
  let d=document.createElement("div");
  var getStdRange=(min,max,step)=>{
    let sr=document.createElement("input");
    sr.type="range";
    sr.min=min;
    sr.max=max;
    sr.step=step;
    sr.style.display="block";
    return sr;
  }
  d.style.gridColumn="2";
  d.append(
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
fanFill.randomize();
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
/*
    );
    return d;
  })()
);
*/

onresize();
fanFill.randomize();
start();
