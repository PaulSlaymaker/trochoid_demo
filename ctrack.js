"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="black";
const TP=2*Math.PI;
const CSIZE=400;
//const CYCLE=720;
const CYCLE=360;  // must be divisible by number of segments time t increment times 2 and by 12
//const CYCLE=240;

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

var Circle=function(xp,yp,rp,rd,disp,NI) {  // x center, y center, radius, rotation direction, unit x displacement - TODO: calc disp from junction angle
  this.x=xp; // need any members?, (never modified) x,y clash with calced x,y
  this.y=yp;
  this.j=[];
  this.junction=(seg,t2)=>{
    for (let i in this.j) {

if (!seg.sj) {

      if (t2==this.j[i].a) {
//if (NI) debugger;
	if (Math.random()<0.5) {
	  seg.sj=true;
	  seg.p2=seg.p1;
	  seg.p1=this.j[i].p;
	  this.p1=this.p2
	}
        break;
      }
} else {
  //if (t2==(CYCLE/4-TI+CYCLE-this.j[i].a)%CYCLE) {	// 4 segments
  if (t2==(CYCLE/4-TI+this.j[i].a)%CYCLE) {	// 4 segments
    seg.sj=false;
// for debugging
seg.p2=seg.p1;
    break;
  }
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
  this.drawSegment=(o)=>{	// t==0 for reverse circle is at TP/2 from drawing point
//if (NI) debugger;
//if (NI) return;
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
/*
    let dof=rd==-1?TP/2:0;  // reverse:normal flow
if (NI) dof=0;
    let a=dof+rd*TP*t2/CYCLE;
*/
    let a=disp+rd*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
    ctx.arc(xp,yp,rp,a,a-rd*trail,rd==1);
    ctx.stroke();
  }
  this.drawEntry=(o)=>{
//if (NI) debugger;
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
    let a=disp+rd*TP*t2/CYCLE;
    let x=xp+rp*Math.cos(a);
    let y=yp+rp*Math.sin(a);
    ctx.moveTo(x,y);
if (NI) {
    ctx.arc(xp,yp,rp,a,-TP/4,rd==1);
} else {
    ctx.arc(xp,yp,rp,a,disp,rd==1);
}
    ctx.stroke();
  }
  this.drawExit=(o)=>{
if (NI) return;
    let t2=(t+o)%CYCLE;
    ctx.beginPath();
/*
    let dof=rd==-1?TP/2:0;  // reverse:normal flow
    let a=dof+rd*TP*t2/CYCLE;
*/
    let a=disp+rd*TP*t2/CYCLE;
    ctx.moveTo(0,yp);  // junc specific
    ctx.arc(xp,yp,rp,disp,a-rd*trail,rd==1);
    ctx.stroke();
  }
}

// 30 degree tail inset, 24 degree an option
var TI=CYCLE/12;
//var trail=TP/segments.length-TP/12;  // junction checks also depend on segments.length
var trail=TP/4-TP/12;

var Junction=function(p1,p2,angle) {  // angle p1-based, p2 angle=CYCLE-angle
  this.entryAngle1=angle;
  this.entryAngle2=(CYCLE-angle)%CYCLE;
  this.exitAngle1=(CYCLE/4-TI-angle)%CYCLE;	// 1/4 cycle: 4 segments
  this.exitAngle2=(CYCLE/4-TI+CYCLE-angle)%CYCLE;	// 4 segments
  this.checkEntry=(seg)=>{
    let t2=(t+seg.o)%CYCLE;
    if (p1==seg.p1) {
      if (t2==this.entryAngle1) {
        if (Math.random()<0.5) {
      // change segment.junc false->junction, seg.p1/p2 convention?, seg.p2 not needed
      // change segment paths or on exit
        seg.p1=p2;
        seg.p2=p1;	// not needed ?
seg.sj=true;
        return this;
        }
      }
    } else if (p2==seg.p1) {
      //if (t2==(CYCLE-angle)%CYCLE) {	// TODO? precompute
      if (t2==this.entryAngle2) {
        if (Math.random()<0.5) {
          seg.p1=p1;
          seg.p2=p2; // not needed ?
seg.sj=true;
          return this;
        }
      }
    }
    return false;
  }
  this.checkExit=(seg)=>{	// pth==seg.p2/p1?
    let t2=(t+seg.o)%CYCLE;
    if (p1==seg.p1) {
      //if (t2==(CYCLE/4-TI-angle)%CYCLE) {	// 4 segments, TODO, precompute angle
      if (t2==this.exitAngle1) {
seg.sj=false;
        return true;
      }
    } else if (p2==seg.p1) {
      //if (t2==(CYCLE/4-TI+CYCLE-angle)%CYCLE) {	// 4 segments, TODO precompute angle
      if (t2==this.exitAngle2) {
seg.sj=false;
        return true;
      }
    }
    return false;
  }
  // drawEntry(dir)
  // drawExit(dir)
  
}

var R=CSIZE/2.2;
var path=[new Circle(-R,-R,R,1,0), new Circle(R,-R,R,-1,TP/2), new Circle(-R,R,R,-1,0,true)];
//var path=[new Circle(-R,-R,R,1,0), new Circle(0.6*R,-R,0.6*R,-1,TP/2), new Circle(-R,R,R,-1,0,true)];
//var path=[new Circle(-R,0,R,1), new Circle(0.5*R,0,0.5*R,-1)];
//var path=[new Circle(-R,0,R,1), new Circle(-0.6*R,0,0.6*R,1)];

var junctions=[new Junction(path[0],path[1],0)];

path[0].j.push({"p":path[1],"a":0});	// a:cycle units, not normalized?
//path[0].j.push({"p":path[2],"a":CYCLE/4});
path[1].j.push({"p":path[0],"a":0});
path[2].j.push({"p":path[0],"a":CYCLE/4});

var Segment=function(offset,color) {
  this.o=offset*CYCLE;
  this.color=color;
  this.p1=path[0];
  this.p2=path[1];
  this.junc=false;
  this.sj=false;
//  this.sw=0;  // 0:path 0, 1:path 0/1, 2:path 1, 3:path1/0
  this.select=()=>{
    if (this.junc) {
      if (this.junc.checkExit(this)) {
        this.junc=false;
      }
    } else {
      for (let i in junctions) {
        // order not random?
        this.junc=junctions[i].checkEntry(this);
        if (this.junc) break;
      }
    }
  }
  this.selectO=()=>{
    let t2=(t+this.o)%CYCLE;
      this.p1.junction(this,t2);
/*
    if (!this.sj) {
      this.p1.junction(this,t2);
    } else {  // ending switch
      if (t2==CYCLE/4-TI) {	// 4 segments
        this.sj=false;
// for debugging
this.p2=this.p1;
      }
    }
*/
  }
  this.selectO=()=>{
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
  this.draw=()=>{
    let t2=(t+this.o)%CYCLE;
    ctx.strokeStyle=this.color;
    if (this.sj) {
      this.p1.drawEntry(this.o);
//if (this.p2==path[2] || this.p1==path[2]) return;
      this.p2.drawExit(this.o);
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

var DEBUGRED=false;
var DEBUGYELLOW=false;
var DEBUGBLUE=false;
var DEBUGGREEN=false;

var drawX2=()=>{
  segments.forEach((s)=>{ s.select(); });
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  segments.forEach((s)=>{ 
if (s.color=="red" && DEBUGRED) debugger;
if (s.color=="blue" && DEBUGBLUE) debugger;
if (s.color=="green" && DEBUGGREEN) debugger;
if (s.color=="yellow" && DEBUGYELLOW) debugger;
    s.draw(); 
  });
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
