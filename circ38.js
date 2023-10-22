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
ctx.lineCap="round";
ctx.globalAlpha=0.7;
ctx.fillStyle="white"; // diag

onresize=()=>{ 
  let D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
  if (low) return Math.floor(Math.random()*Math.random()*(max-min))+min;
  else return Math.floor(Math.random()*(max-min))+min;
}

var Circle=function(x,y,xp,yp,radius,pc,aidx) {
  this.x=x;
  this.y=y;
  this.xp=xp;	// entry point
  this.yp=yp;
  this.radius=radius;
  this.pc=pc;
  this.eadx=0;	// exit angle index
  this.hexant=Math.round(Math.atan2(y,x)/TP*12);	// dodecant
  this.draw=(st)=>{	// diag
    ctx.beginPath();
    ctx.moveTo(this.x+this.radius,this.y);
    ctx.arc(this.x,this.y,this.radius,0,TP);
    ctx.stroke();
if (st) {
  ctx.fillText(this.hexant,this.x,this.y-4);
  if (this.iDir!=undefined) ctx.fillText(this.iDir,this.x,this.y+14);
}
  }
}

function Color() {
  const CBASE=160;
  const CT=255-CBASE;
  this.RK2=TP*Math.random();
  this.GK2=TP*Math.random();
  this.BK2=TP*Math.random();
  this.getRGB=(f)=>{
/*
    let red=Math.round(CBASE+CT*Math.cos(this.RK2+f/this.RK1+t/this.RK3));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2+f/this.GK1+t/this.GK3));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2+f/this.BK1+t/this.BK3));
*/
    let red=Math.round(CBASE+CT*Math.cos(this.RK2));
    let grn=Math.round(CBASE+CT*Math.cos(this.GK2));
    let blu=Math.round(CBASE+CT*Math.cos(this.BK2));
return "rgb("+red+","+grn+","+blu+")";
  }
  this.randomize=()=>{
    this.RK1=(0.4+Math.random())/5;
    this.GK1=(0.4+Math.random())/5;
    this.BK1=(0.4+Math.random())/5;
    this.RK3=80+120*Math.random();
    this.GK3=80+120*Math.random();
    this.BK3=80+120*Math.random();
  }
  this.randomize();
}

var color=new Color();
var col1=color.getRGB(0);
var color2=new Color();

var getTrisAngleIdx=(an1,an2)=>{	// an1-an2==2
  if (Math.max(an1,an2)==4) {
    if (Math.min(an1,an2)==0) return 5;
    else return 3;
  } else if (Math.max(an1,an2)==5) {
    if (Math.min(an1,an2)==1) return 0;
    else return 4;
  }
  return 1+Math.min(an1,an2);
}

var CirclePath=function(circ,circ2) {
  if (circ.pc.eadx==circ.eadx) {
    this.addCirclePath=(pth)=>{
      pth.lineTo(circ2.xp,circ2.yp);
    }
    this.len=2*circ.radius;
  } else {
    let aidx1=circ.eadx;
    let aidx2=(circ.pc.eadx+3)%6;
    let aidx3=getTrisAngleIdx(circ.eadx,aidx2);
    let acx=circ.x+2*circ.radius*Math.cos(aidx3*TP/6);
    let acy=circ.y+2*circ.radius*Math.sin(aidx3*TP/6);
    if ((circ.pc.eadx+3)%6==(circ.eadx+2)%6) {
      let a1=((aidx1+3.5)%6)*TP/6;
      let a2=((aidx1+4.5)%6)*TP/6;
      this.addCirclePath=(pth)=>{
	pth.arc(acx,acy,1.732*circ.radius,a1,a2);
      }
    } else if ((circ.pc.eadx+3)%6==(circ.eadx+4)%6) {	// left
      let a1=((aidx1+2.5)%6)*TP/6;
      let a2=((aidx1+1.5)%6)*TP/6;
      this.addCirclePath=(pth)=>{
        pth.arc(acx,acy,1.732*circ.radius,a1,a2,true);
      }
    } else debugger;
    this.len=1.732*circ.radius*TP/6;
  }
}

const STT=20;

var Curve=function() {
  let ar=TP*Math.random();
  this.car=[new Circle((CSIZE-rad2)*Math.cos(ar),(CSIZE-rad2)*Math.sin(ar),0,0,rad2,0,0)];
  this.gr=true;
  this.sh=true;
this.gt=0;	// growth tries
  this.shrink=()=>{
    if (this.car.length<4) {
      this.sh=false;
      return;
    } else if (this.car.length<STT) {
if (this.gr) {
      this.car.shift();
      this.sh=true;
      return;
} else {
      this.sh=false;
      return;
}
    } else if (this.car.length==STT) {
if (this.sh==false) {
      this.car.shift();
      this.sh=true;
      return;
} else {
      this.car.shift();
      this.sh=false;
console.log("what?");
      return;
}
    }

/*
if (this.sh==false) {
      this.sh=true;
      return;
} else {
}
*/
/*
if (this.gr) {
      this.car.shift();
      this.sh=true;
      return;
} else {
      this.sh=false;
      return;
}
    } else if (this.car.length==STT) {
      this.car.shift();
      this.sh=false;
      return;
    }
*/
    this.car.shift();
    this.sh=true;
  }
  this.grow=()=>{
    let c=this.car[this.car.length-1];
    for (let i=0; i<40; i++) {
      //let rad2=30+8*getRandomInt(0,7);
      let minr=[36,28,20,12,4][Math.floor(i/8)];
//let minr=[46,38,30,22,14][Math.floor(i/8)];
      let rad2=minr+3*getRandomInt(0,14);
      let aidx=getRandomInt(0,6);
      if (c.pc) { 
	aidx=[c.pc.eadx,(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,3)]; 
if (Math.pow(c.x*c.x,0.5)>140) {
  if (c.hexant==0) {
    if      ([-2,-1,0,1   ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-4,-5,-6,6,5].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    //else if (c.pc.iDir==-3) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
    else if (-3==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==1) {
    if      ([-3,-2,-1,0].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-5,-6,6,5,4].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (-4==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==2) {
    if      ([-4,-3,-2,-1].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-6,6,5,4,3 ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (-5==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==3) {
    if      ([-5,-4,-3,-2].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([5,4,3,2    ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if ([-6,6       ].includes(c.pc.iDir)) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==4) {
    if      ([6,-6,-5,-4,-3].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([4,3,2,1     ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (5==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==5) {
    if      ([5,6,-6,-5,-4].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([3,2,1,0     ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (4==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==6 || c.hexant==-6) {
    if      ([4,5,6,-6,-5 ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([2,1,0,-1    ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (3==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==-5) {
    if      ([3,4,5,6,-6  ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([1,0,-1,-2   ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (2==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==-4) {
    if      ([2,3,4,5     ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([0,-1,-2,-3  ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (1==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==-3) {
    if      ([1,2,3,4     ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-1,-2,-3,-4 ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (0==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==-2) {
    if      ([0,1,2,3     ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-2,-3,-4,-5 ].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (-1==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  } else if (c.hexant==-1) {
    if      ([-1,0,1,2    ].includes(c.pc.iDir)) aidx=(c.pc.eadx+5)%6;
    else if ([-3,-4,-5,-6,6].includes(c.pc.iDir)) aidx=(c.pc.eadx+1)%6;
    else if (-2==c.pc.iDir) aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
  }
}
	//aidx=[(c.pc.eadx+1)%6,(c.pc.eadx+5)%6][getRandomInt(0,2)]; 
      }
      let a=TP*aidx/6;
      let x=c.x+(c.radius+rad2)*Math.cos(a);
      let y=c.y+(c.radius+rad2)*Math.sin(a);
      if (cvalN(x,y,rad2)) {
        c.eadx=aidx;
	let xp=c.x+c.radius*Math.cos(a);
	let yp=c.y+c.radius*Math.sin(a);
        c.iDir=Math.round(Math.atan2(c.xp-xp,c.yp-yp)/TP*12);
	let circle=new Circle(x,y,xp,yp,rad2,c);
//        c.cc=circle;
        this.car.push(circle);
if (c.pc) {
c.cp=new CirclePath(c,circle);
}
//console.log("tries "+i);
        this.gr=true;
        return true;
      }
    }
    this.gr=false;
    return false;
  }
  this.setPathD=()=>{
    this.len=0;
    this.pathd=new Path2D();
    this.pathd.moveTo(this.car[1].xp,this.car[1].yp);
    for (let i=1; i<this.car.length-1; i++) {
      this.car[i].cp.addCirclePath(this.pathd);
      this.len+=this.car[i].cp.len;
    }
  }
  this.setPathT=()=>{
    this.len=0;
    this.patht=new Path2D();
    this.patht.moveTo(this.car[1].xp,this.car[1].yp);
    for (let i=1; i<this.car.length-1; i++) {
      if (this.car[i-1].eadx==this.car[i].eadx) {
      }
    }
  }
  this.setPath=()=>{
debugger;
    this.path=new Path2D();
    this.path.moveTo(this.car[2].xp,this.car[2].yp);	// 0 not draws, drawn back 2->1
let CC=(this.gr)?this.car.length-2:this.car.length-1;
    for (let i=2; i<CC; i++) {
    //for (let i=2; i<this.car.length-2; i++) {
      //this.len+=2*this.car[i].radius;
      if (this.car[i-1].eadx==this.car[i].eadx) {
	this.path.lineTo(this.car[i+1].xp,this.car[i+1].yp);
      } else {
	let aidx1=this.car[i].eadx;
	let aidx2=(this.car[i-1].eadx+3)%6;
	let aidx3=getTrisAngleIdx(this.car[i].eadx,aidx2);
	let acx=this.car[i].x+2*this.car[i].radius*Math.cos(aidx3*TP/6);
	let acy=this.car[i].y+2*this.car[i].radius*Math.sin(aidx3*TP/6);
        if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+2)%6) {
	  let a1=((aidx1+3.5)%6)*TP/6;
	  let a2=((aidx1+4.5)%6)*TP/6;
	  this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2);
	} else if ((this.car[i-1].eadx+3)%6==(this.car[i].eadx+4)%6) {	// left
	  let a1=((aidx1+2.5)%6)*TP/6;
	  let a2=((aidx1+1.5)%6)*TP/6;
	  this.path.arc(acx,acy,1.732*this.car[i].radius,a1,a2,true);
	} else debugger;
      }
    }

    let aidx1=this.car[1].eadx;
    let aidx2=(this.car[0].eadx+3)%6;
    let aidx3=getTrisAngleIdx(aidx1,aidx2);
    if (this.car[0].eadx==this.car[1].eadx) {
	// empty straight
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+2)%6) {	// right
      //this.path2.moveTo(this.car[2].xp,this.car[2].yp);	// front will use car[length-2]?
//console.log(aidx1,aidx2);

//this.path2.arc(acx,acy,1.732*this.car[1].radius,a2,a1+f*(a2-a1),true);	// a1->a2
//this.path2.arc(p3x,p3y,1.732*this.car[1].radius,a2,a1+0.2,true);

      this.endArcCx=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);	// arc center x
      this.endArcCy=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
      this.endA1=((aidx1+3.5)%6)*TP/6;
      this.endA2=((aidx1+4.5)%6)*TP/6;
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
      this.endArcCx=this.car[1].x+2*this.car[1].radius*Math.cos(aidx3*TP/6);
      this.endArcCy=this.car[1].y+2*this.car[1].radius*Math.sin(aidx3*TP/6);
      this.endA1=((aidx1+2.5)%6)*TP/6;
      this.endA2=((aidx1+1.5)%6)*TP/6;
    } else debugger;

    aidx1=this.car[this.car.length-2].eadx;
    aidx2=(this.car[this.car.length-3].eadx+3)%6;
    aidx3=getTrisAngleIdx(aidx1,aidx2);

    if (this.car[this.car.length-3].eadx==this.car[this.car.length-2].eadx) {
	// straight, empty
    } else {
      this.frontArcCx=this.car[this.car.length-2].x+2*this.car[this.car.length-2].radius*Math.cos(aidx3*TP/6);
      this.frontArcCy=this.car[this.car.length-2].y+2*this.car[this.car.length-2].radius*Math.sin(aidx3*TP/6);
      if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+2)%6) {// right
	this.frontA1=((aidx1+3.5)%6)*TP/6;
	this.frontA2=((aidx1+4.5)%6)*TP/6;
      } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+4)%6) {// left
	this.frontA1=((aidx1+2.5)%6)*TP/6;
	this.frontA2=((aidx1+1.5)%6)*TP/6;
      } else debugger;
    }
  }
  this.drawFront=()=>{
    let p=new Path2D();
    let c1=this.car[this.car.length-2];
    let c2=this.car[this.car.length-1];
    p.moveTo(c1.xp,c1.yp);
    if (this.car[this.car.length-3].eadx==this.car[this.car.length-2].eadx) {
      p.lineTo(c1.xp+f*(c2.xp-c1.xp),c1.yp+f*(c2.yp-c1.yp));
    } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+2)%6) {// right
      p.arc(this.frontArcCx,this.frontArcCy,1.732*c1.radius,this.frontA1,this.frontA1+f*TP/6);
    } else if ((this.car[this.car.length-3].eadx+3)%6==(this.car[this.car.length-2].eadx+4)%6) {// left
      p.arc(this.frontArcCx,this.frontArcCy,1.732*c1.radius,this.frontA1,this.frontA1-f*TP/6,true);
    }
    ctx.stroke(p);
/*
let TTT=Math.atan2(this.car[this.car.length-2].xp-this.car[this.car.length-1].xp,this.car[this.car.length-2].yp-this.car[this.car.length-1].yp);
TTT=TTT/TP*12;
ctx.fillText(TTT.toFixed(2),this.car[this.car.length-2].x,this.car[this.car.length-2].y+8);
//ctx.fillText(this.iDir,this.car[this.car.length-2].x,this.car[this.car.length-2].y+20);
*/
  }
  this.drawEnd=()=>{
    // punch clear
    let p=new Path2D();
    p.moveTo(this.car[2].xp,this.car[2].yp);
    if (this.car[0].eadx==this.car[1].eadx) {
      p.lineTo(this.car[1].xp+f*(this.car[2].xp-this.car[1].xp),
               this.car[1].yp+f*(this.car[2].yp-this.car[1].yp));
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+2)%6) {
      p.arc(this.endArcCx,this.endArcCy,1.732*this.car[1].radius,this.endA2,this.endA1+f*TP/6,true);
    } else if ((this.car[0].eadx+3)%6==(this.car[1].eadx+4)%6) {	// left
      p.arc(this.endArcCx,this.endArcCy,1.732*this.car[1].radius,this.endA2,this.endA1-f*TP/6);
    }
    ctx.stroke(p);
  }
  this.drawCurve=()=>{
/*
    ctx.lineWidth=16;	// 4 less than minr*2
    ctx.strokeStyle=col1;
    ctx.stroke(this.path);
    this.drawEnd();
    if (this.gr) this.drawFront();
*/

    if (this.gr && this.sh) {
      //ctx.setLineDash([this.len-(1-f)*this.car[this.car.length-2].cp.len,20000]);
      ctx.setLineDash([this.len-(1-f)*this.car[this.car.length-2].cp.len-f*this.car[1].cp.len,20000]);
ctx.lineDashOffset=-f*this.car[1].cp.len;
    } else if (this.gr) {
      ctx.setLineDash([this.len-(1-f)*this.car[this.car.length-2].cp.len,20000]);
ctx.lineDashOffset=0;
    } else if (this.sh) {
      ctx.setLineDash([this.len-f*this.car[1].cp.len,20000]);
ctx.lineDashOffset=-f*this.car[1].cp.len;
    } else {
      //debugger;
      ctx.setLineDash([]);
ctx.lineDashOffset=0;
    }
//ctx.lineDashOffset=-f*this.car[1].cp.len;
//console.log(this.len-this.car[this.car.length-2].cp.len);
//debugger;
    ctx.lineWidth=18;	// variable f(mean radius)
    ctx.strokeStyle=col1;
    ctx.stroke(this.pathd);
ctx.setLineDash([]);
ctx.lineDashOffset=0;
  }
}

var cvalN=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let j=0; j<curves.length; j++) {
    for (let i=0; i<curves[j].car.length; i++) {
      let rt=rad+curves[j].car[i].radius;
      let xd=curves[j].car[i].x-x;
      if (Math.abs(xd)>rt) continue;
      let yd=curves[j].car[i].y-y;
      if (Math.abs(yd)>rt) continue;
      if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
	return false;
      }
    }
  }
  return true;
}

var cval=(x,y,rad)=>{
  if (Math.pow(x*x+y*y,0.5)>CSIZE-rad) return false;
  for (let i=0; i<ca.length; i++) {
    let rt=rad+ca[i].radius;
    let xd=ca[i].x-x;
    if (Math.abs(xd)>rt) continue;
    let yd=ca[i].y-y;
    if (Math.abs(yd)>rt) continue;
    if (Math.pow(xd*xd+yd*yd,0.5)+1<rt) {
      return false;
    }
  }
  return true;
}

var rad2=50+10*getRandomInt(0,5);

var drawCurveSet=(cuixd, col)=>{	// diag
  ctx.save();
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="white";
  ctx.lineWidth=1;
  ctx.setLineDash([]);
  for (let i=0; i<curves.length; i++) {
    ctx.stroke(curves[i].path);
  }
  ctx.restore();
}

const annulus=new Path2D();
annulus.arc(0,0,CSIZE,0,TP);
var draw=()=>{
//ctx.fillStyle="#00000020";
//ctx.fillRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
  for (let i=0; i<curves.length; i++) curves[i].drawCurve();

ctx.lineWidth=1;
ctx.stroke(annulus);
}

var transit=()=>{
  for (let i=0; i<curves.length; i++) {
    //curves[i].sh=false;
    curves[i].shrink();
    curves[i].gr=false;
    curves[i].grow();
//if (curves[i].car.length>=STT) curves[i].sh=true;
//else curves[i].sh=false;
//  curves[0].setPath();
    curves[i].setPathD();
    if (curves[i].car.length<STT) {	// distinguish permanent and temp
      this.gt++;
//      if (this.gt>5) {
	//stopped=true;
//console.log("transit stop "+performance.now());
//debugger;
//      }
    }
  }
}

var stopped=true;
var start=()=>{
  if (stopped) { 
    stopped=false;
    requestAnimationFrame(animate);
  } else stopped=true;
}
body.addEventListener("click", start, false);

var f=0;
var t=0;
var dur=40;
//var dur=4;
var animate=()=>{
  if (stopped) return;
  t++;
  f=t/dur;
  draw();
  if (!(t<dur-1)) {
    t=0;
    //stopped=true;
    transit();
//dur=curves[0].car[1].cp.len;
  }
//drawCircles2();
  requestAnimationFrame(animate);
}

ctx.font="bold 14px sans-serif";
ctx.textAlign="center";
var drawCircles=(col,lw)=>{	// diag
  ctx.save();
  ctx.lineWidth=lw?lw:1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="silver";
  for (let i=0; i<curves[0].car.length; i++) {
    curves[0].car[i].draw();
  }
  ctx.restore();
}

var drawCircles2=(col)=>{	// diag
  ctx.save();
  ctx.lineWidth=1;
  if (col) ctx.strokeStyle=col;
  else ctx.strokeStyle="silver";
for (let j=0; j<curves.length; j++) {
  for (let i=0; i<curves[j].car.length; i++) {
    curves[j].car[i].draw(true);
  }
  drawPoint(curves[j].car[0].x,curves[j].car[0].y,"white");
}
  ctx.restore();
}

var drawPoint=(x,y,col)=>{
  ctx.beginPath();
  ctx.moveTo(x+3,y);
  ctx.arc(x,y,3,0,TP);
  if (col==undefined) ctx.fillStyle="red";
  else ctx.fillStyle=col;
  ctx.fill();
}

const CC=1;
//var curves=[new Curve(), new Curve()];	// check for overlap
var curves=new Array(CC);
for (let i=0; i<CC; i++) curves[i]=new Curve();

var initCurves=()=>{
  //let ccount=4;
  let ccount=STT;
for (let k=0; k<CC; k++) {
//  curves[k]=new Curve();
//for (let j=0; j<20; j++) {
  for (let i=0; i<ccount; i++) if (!curves[k].grow()) break;
  if (curves[k].car.length<STT) {
    debugger;	// fixme
//    if (j>1) debugger;
//if (curves[i].car.length<ccount) {
  }
//}
}
//  curves[0].setPath();
for (let i=0; i<curves.length; i++) {
  curves[i].setPathD();
  if (curves[i].car.length<ccount) {
  } else curves[i].gr=true;
console.log("car.len "+curves[i].car.length);
}
  //             
}

onresize();

initCurves();
draw();
drawCircles2();
ctx.moveTo(-CSIZE,0);
ctx.lineTo(CSIZE,0);
ctx.moveTo(-CSIZE*0.866,-CSIZE/2);
ctx.lineTo(CSIZE*0.866,CSIZE/2);
ctx.moveTo(-CSIZE/2,-CSIZE*0.866);
ctx.lineTo(CSIZE/2,CSIZE*0.866);
ctx.stroke();

var test=(n)=>{
  ctx.save();
  let p=new Path2D();
  p.arc(curves[0].car[n].x,ca[n].y,ca[1].radius,0,TP);
ctx.clip(p);
  ctx.clearRect(ca[1].x-ca[1].radius,ca[1].y-ca[1].radius,2*ca[1].radius,2*ca[1].radius);
  ctx.restore();
}
