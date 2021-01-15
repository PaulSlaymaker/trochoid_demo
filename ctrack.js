"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;
//const CYCLE=360;  // must be divisible by number of segments time t increment times 2 and by 12
const CYCLE=240;

var trackCtx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
trackCtx.translate(CSIZE,CSIZE);

var ctx=(()=>{
  let c=document.createElement("canvas");
  c.width="800";
  c.height="800";
  c.style.position="absolute";
  c.style.top="0px";
  c.style.left="0px";
  return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);
ctx.lineCap="round";

var container=(()=>{
  let co=document.createElement("div");
  co.style.position="relative";
  co.style.margin="0 auto";
  co.append(trackCtx.canvas);
  co.append(ctx.canvas);
  body.append(co);
  return co;
})();

onresize=function() {
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  container.style.width=D+"px";
  container.style.height=D+"px";
  ctx.canvas.style.width=D+"px";
  ctx.canvas.style.height=D+"px";
  trackCtx.canvas.style.width=D+"px";
  trackCtx.canvas.style.height=D+"px";
}

var getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

var Circle=function(xp,yp,rp,d) {
  this.x=xp; // need any members?, (never modified) x,y clash with calced x,y
  this.y=yp;
  this.r=rp;
  this.j=[];
  this.junction=(seg,t2)=>{

      if (t2==this.j[0].a) {
	if (Math.random()<0.5) {
	  seg.sj=true;
	  seg.p2=seg.p1;
          seg.p1=this.j[0].p; // rework w/o path index
          this.p1=this.p2
	}
      }

  }
  this.drawTrack=(width,color)=>{
    trackCtx.lineWidth=width;
    trackCtx.strokeStyle=color;
    trackCtx.beginPath();
    trackCtx.moveTo(this.x+rp,this.y);
    trackCtx.arc(this.x,this.y,rp,0,TP);
    trackCtx.closePath();
    trackCtx.stroke();
  }
  this.drawSegment=(offset)=>{	// t==0 for reverse circle is at TP/2 from drawing point
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,yp,rp,a,a-d*trail,d==1);
    ctx.stroke();
  }
  this.drawEntry=(offset)=>{
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,yp,rp,a,dof,d==1);
    ctx.stroke();
  }
  this.drawExit=(offset)=>{
    let t2=(t+offset)%CYCLE;
    ctx.beginPath();
    let dof=d==-1?TP/2:0;  // reverse:normal flow
    let a=dof+d*TP*t2/CYCLE;
    ctx.moveTo(0,yp);  // junc specific
    ctx.arc(xp,yp,rp,dof,a-d*trail,d==1);
    ctx.stroke();
  }
}

/*
var Junction=function(circle1,angle1,circle2,angle2) {
  this.select=(os)=>{
    let t2=(t+os)%CYCLE;
    if (t2%CYCLE==angle1) {
      if (Math.random()<0.5) {
        return [circle2,angle2];
      } else {
        return [];
      }
    }
  }
}
*/

var R=CSIZE/2.2;
var path=[new Circle(-R,-R,R,1), new Circle(R,-R,R,-1), new Circle(-R,R,R,-1)];
//var path=[new Circle(-R,0,R,1), new Circle(0.5*R,0,0.5*R,-1)];
//var path=[new Circle(-R,0,R,1), new Circle(-0.6*R,0,0.6*R,1)];

path[0].j.push({"p":path[1],"a":0});	// a:cycle units, not normalized?
path[1].j.push({"p":path[0],"a":0});

var Segment=function(offset,color) {
  this.o=offset*CYCLE;
  this.color=color;
  this.p1=path[0];
  this.p2=path[1];
  this.sj=false;
  this.sw=0;  // 0:path 0, 1:path 0/1, 2:path 1, 3:path1/0
  this.selectN=()=>{
    let t2=(t+this.o)%CYCLE;
    if (!this.sj) {
      this.p1.junction(this,t2);
    } else {  // ending switch
      if (t2==CYCLE/4-TI) {	// 4 segments
        this.sj=false;
      }
    }
  }
  this.select=()=>{
    let t2=(t+this.o)%CYCLE;
    if (!this.sj) {  // test to switch paths
      // path[this.p1].junction(this.o);  return new path or pass segment?
      if (t2==0) {
	if (Math.random()<0.5) {
	  this.sj=true;
          // determined from junction call, just reverse for now
          let rev=this.p1;
          this.p1=this.p2
	  this.p2=rev;
	}
      }
    } else {  // ending switch
      if (t2==CYCLE/4-TI) {	// 4 segments
        this.sj=false;
      }
    }
  }
  this.junctionO=()=>{  // should be standalone?
    let t2=(t+this.o)%CYCLE;
    if (t2%CYCLE==0) {
      if (this.sw==0) {
        if (Math.random()<0.5) {
          this.sw=1;
          this.sj=true;
          this.p1=path[1];
          this.p2=path[0];
        }
      } else if (this.sw==2) {
        if (Math.random()<0.5) {
          this.sw=3;
          this.sj=true;
          this.p1=0;
          this.p2=1;
        }
      }
    //} else if (t2%CYCLE==CYCLE/2-TI) {
    //} else if (t2%CYCLE==CYCLE/3-TI) {	// 3 segments
    } else if (t2%CYCLE==CYCLE/4-TI) {	// 4 segments
      if (this.sw==1) {
        this.sw=2;
        this.sj=false;
      }
      if (this.sw==3) {
        this.sw=0;
        this.sj=false;
      }
    }
  }
  this.draw=()=>{
    let t2=(t+this.o)%CYCLE;
    ctx.strokeStyle=this.color;
    if (this.sj) {
      this.p2.drawExit(this.o);
      this.p1.drawEntry(this.o);
    } else {
      this.p1.drawSegment(this.o);
    }

/*
    if (this.sw==0) {
      path[0].drawSegment(this.o);
    } else if (this.sw==1) { 
      path[0].drawExit(this.o);
      path[1].drawEntry(this.o);
    } else if (this.sw==2) {
      path[1].drawSegment(this.o);
    } else if (this.sw==3) {
      path[1].drawExit(this.o);
      path[0].drawEntry(this.o);
    } else {
debugger;
    }
*/
  }
}

var segments=[new Segment(0,"red"), new Segment(1/4,"blue"), new Segment(1/2,"green"), new Segment(3/4,"yellow")];
//var segments=[new Segment(0,"red"), new Segment(1/3,"blue"), new Segment(2/3,"yellow")];
//var segments=[new Segment(0,"red"), new Segment(1/2,"blue")];
//var segments=[new Segment(0,"red")];

// 30 degree tail inset, 24 degree an option
var TI=CYCLE/12;
var trail=TP/segments.length-TP/12;  // junction checks also depend on segments.length
//var trail=TP/3-TP/12;

var t=0;

var W=54;
ctx.lineWidth=W-8;

path[0].drawTrack(W,"#EEE");
path[1].drawTrack(W,"#EEE");
path[2].drawTrack(W,"#EEE");
path[0].drawTrack(W-8,"black");
path[1].drawTrack(W-8,"black");
path[2].drawTrack(W-8,"black");

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

var drawX2=()=>{
  segments.forEach((s)=>{ s.select(); });
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  segments.forEach((s)=>{ s.draw(); });
}

var animate=(ts)=>{
  if (stopped) return;
  //t=++t%CYCLE;
  //t++;
  t+=1;
  drawX2();
  requestAnimationFrame(animate);
}

onresize();
start();
