"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#444";
body.style.margin="20";

const TP=2*Math.PI;

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

var D=400;
onresize=function() { 
  D=Math.min(window.innerWidth,window.innerHeight)-40; 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  ctx.translate(D/2,D/2);
  ctx.lineWidth=2;
  ctx.fillStyle="#89A";
  P=D/2; 
  //setPoints();
}

function cFrac(frac) {
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Tile=function(p1,p2,p3,p4) {
  this.v=[p1,p2,p3,p4];
  this.v2=[p1,p2,p3,p4];
  this.colorSet;
  this.colorSet2;
  this.shift=()=>{ this.v2.push(this.v2.shift()); }
  this.setColor=(f)=>{
    let h=(this.colorSet.hue+f*(this.colorSet2.hue-this.colorSet.hue+360)%360);
    let s=f*this.colorSet2.sat+(1-f)*this.colorSet.sat;
    let l=f*this.colorSet2.lum+(1-f)*this.colorSet.lum;
    ctx.fillStyle="hsl("+h+","+s+"%,"+l+"%)";
  }
  this.drawC=(frac)=>{
    let f=cFrac(frac);
    let kf=Math.pow(2*frac-1,2)/2+0.5;
    ctx.beginPath();
    let dx=(1-f)*this.v[2].x+f*this.v2[2].x;
    let dy=(1-f)*this.v[2].y+f*this.v2[2].y;
    let fpx=dx*(1-kf);
    let fpy=dy*(1-kf);
    ctx.moveTo(fpx+kf*((1-f)*this.v[0].x+f*this.v2[0].x),fpy+kf*((1-f)*this.v[0].y+f*this.v2[0].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[1].x+f*this.v2[1].x),fpy+kf*((1-f)*this.v[1].y+f*this.v2[1].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[2].x+f*this.v2[2].x),fpy+kf*((1-f)*this.v[2].y+f*this.v2[2].y));
    ctx.lineTo(fpx+kf*((1-f)*this.v[3].x+f*this.v2[3].x),fpy+kf*((1-f)*this.v[3].y+f*this.v2[3].y));
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }
  this.drawC2=(frac)=>{
    let f=cFrac(frac);
    ctx.beginPath();
    let dx=(1-f)*this.v[2].x+f*this.v2[2].x;
    let dy=(1-f)*this.v[2].y+f*this.v2[2].y;
    let SI=Math.sin(f*TP/2);
    let CO=Math.cos(f*TP/2);
    //let fpx=0.3*f*dx*Math.sin(f*TP/2);
    //let fpy=0.3*f*dy*Math.sin(f*TP/2);
    let fpx=-0.3*dx*SI;
    let fpy=-0.3*dy*SI;
    ctx.moveTo(fpx+CO*(1-f)*this.v[0].x+f*this.v2[0].x,fpy+CO*(1-f)*this.v[0].y+f*this.v2[0].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[1].x+f*this.v2[1].x,fpy+CO*(1-f)*this.v[1].y+f*this.v2[1].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[2].x+f*this.v2[2].x,fpy+CO*(1-f)*this.v[2].y+f*this.v2[2].y);
    ctx.lineTo(fpx+CO*(1-f)*this.v[3].x+f*this.v2[3].x,fpy+CO*(1-f)*this.v[3].y+f*this.v2[3].y);
    //ctx.lineTo(fpx+(1-f)*this.v[2].x+f*this.v2[2].x,fpy+(1-f)*this.v[2].y+f*this.v2[2].y);
    //ctx.lineTo(fpx+(1-f)*this.v[3].x+f*this.v2[3].x,fpy+(1-f)*this.v[3].y+f*this.v2[3].y);
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }

  this.drawZ=(frac)=>{
    let f=cFrac(frac);
    ctx.beginPath();
    ctx.moveTo((1-f)*this.v[0].x+f*this.v2[0].x,(1-f)*this.v[0].y+f*this.v2[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v2[1].x,(1-f)*this.v[1].y+f*this.v2[1].y);
    ctx.lineTo((1-f)*this.v[2].x+f*this.v2[2].x,(1-f)*this.v[2].y+f*this.v2[2].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v2[3].x,(1-f)*this.v[3].y+f*this.v2[3].y);
    ctx.closePath();
    ctx.stroke();
    this.setColor(f);
    ctx.fill();
  }
  this.draw=this.drawZ;
  this.setDraw=(d)=>{
    this.draw=[this.drawZ,this.drawC,this.drawC2][d];
  }
}

var Color=function() {
  this.hue=getRandomInt(0,360);
  this.sat=70+20*Math.random();
  this.lum=70+20*Math.random();
  this.randomize=()=>{
    this.hue=(this.hue+getRandomInt(0,180))%360;
    //this.sat=70+20*Math.random();
    //this.lum=70+20*Math.random();
    //this.sat=65+25*Math.random();
    //this.lum=65+25*Math.random();
    this.sat=55+30*Math.random();
    this.lum=55+30*Math.random();
  }
}

var shape="B2";
var P=D;
var W=11; // layers+1
var C=48; // radials
var Count=480;
var pts=[]
var tiles=[];
var colorSet=[];
var colorSet2=[];

var setBlockPoints=()=>{
  let cos=P/(C+3);
  let wos=P/(W+3);
  let h=[3,4][getRandomInt(0,2)];
  pts=[];
  for (let c=-C; c<=C; c+=2) {
    for (let r=-(W-1); r<=W-1; r+=2) {
      let x=c*cos;
      if (xr && r%h==0) x+=wos;
      if (xc && c%h==0) x+=cos;
      let y=r*wos;
      if (yr && r%h==0) y+=wos;
      if (yc && c%h==0) y+=cos;
      pts.push({"x":x,"y":y});
    }
  }
}

var R=82;
var C=152;
var drawOctogon=(x,y)=>{
  let xo=R*Math.cos(TP/16);
  let yo=R*Math.sin(TP/16);
  ctx.moveTo(xo+x,yo+y);
  for (let t=3*TP/16; t<17*TP/16; t+=TP/8) {
    xo=R*Math.cos(t);
    yo=R*Math.sin(t);
    ctx.lineTo(xo+x,yo+y);
  }
}

var draw=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  ctx.beginPath();
  for (let x=-2; x<=2; x++) {
    for (let y=-2; y<=2; y++) {
      drawOctogon(C*x,C*y);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill("evenodd");
}

var controls=[];
body.append(
  (()=>{
    var getStdRange=(min,max,step,name)=>{
      let sr=document.createElement("input");
      sr.type="range";
      sr.min=min;
      sr.max=max;
      sr.step=step;
      sr.style.display="block";
      sr.onmouseover=()=>{ sr.title=sr.value; }
      return sr;
    }
    let d=document.createElement("div");
    d.style.gridColumn="2";
    d.append(
      (()=>{
	let f1=getStdRange(10,220,1);
	f1.value=R;
	f1.oninput=()=>{
	  R=parseFloat(f1.value);
	  draw(0);
	}
        f1.set=()=>{ f1.value=R; }
        controls.push(f1);
	return f1;
      })(),
      (()=>{
	let c=getStdRange(10,200,1);
	c.oninput=()=>{
	  C=parseInt(c.value);
	  draw(1);
	}
        c.set=()=>{ c.value=C; }
        controls.push(c);
	return c;
      })(),
    );
    return d;
  })(),
);

var setControls=()=>{
  for (let con of controls) { con.set(); }
}

onresize();
setControls();
ctx.strokeStyle="#FFF";
draw();
