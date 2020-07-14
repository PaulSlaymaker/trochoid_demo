"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#444";
body.style.display="grid";
body.style.margin="0";

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
  D=Math.min(window.innerWidth,window.innerHeight); 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  ctx.translate(D/2,D/2);
  ctx.lineWidth=0.4;
  P=D/2.1; 
  setPoints();
}

var Tile=function(p1,p2,p3,p4,i) {
  this.v=[p1,p2,p3,p4];
  this.i=i;
  this.rx=P*(1-2*Math.random());
  this.ry=P*(1-2*Math.random());
  this.drawX=(frac)=>{
    let f=frac;
    ctx.beginPath();
    let fpx=f*this.rx;
    let fpy=f*this.ry;
    ctx.moveTo(fpx+(1-f)*this.v[0].x,fpy+(1-f)*this.v[0].y);
    ctx.lineTo(fpx+(1-f)*this.v[1].x,fpy+(1-f)*this.v[1].y);
    ctx.lineTo(fpx+(1-f)*this.v[2].x,fpy+(1-f)*this.v[2].y);
    ctx.lineTo(fpx+(1-f)*this.v[3].x,fpy+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
  }
  this.drawR=(frac)=>{
    let f=frac;
    let fpzx=P*f*Math.cos(C/W*this.v[0].z);
    let fpzy=P*f*Math.sin(C/W*this.v[0].z);
    ctx.beginPath();
    ctx.moveTo(fpzx+(1-f)*this.v[0].x,fpzy+(1-f)*this.v[0].y);
    ctx.lineTo(fpzx+(1-f)*this.v[1].x,fpzy+(1-f)*this.v[1].y);
    ctx.lineTo(fpzx+(1-f)*this.v[2].x,fpzy+(1-f)*this.v[2].y);
    ctx.lineTo(fpzx+(1-f)*this.v[3].x,fpzy+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
  }
  this.drawR2=(frac)=>{
    let f=frac;
    let fpzx=-P*f*Math.cos(this.i*W*TP/C);
    let fpzy=P*f*Math.sin(this.i*W*TP/C);
/*
    let fpzx=-P*f*Math.cos(this.i*TP/((W-1)*C));
    let fpzy=P*f*Math.sin(this.i*TP/((W-1)*C));
    let fpzx=-P*f*Math.cos(C/W*this.v[0].z);
    let fpzy=P*f*Math.sin(C/W*this.v[0].z);
*/
    ctx.beginPath();
    ctx.moveTo(fpzx+(1-f)*this.v[0].x,fpzy+(1-f)*this.v[0].y);
    ctx.lineTo(fpzx+(1-f)*this.v[1].x,fpzy+(1-f)*this.v[1].y);
    ctx.lineTo(fpzx+(1-f)*this.v[2].x,fpzy+(1-f)*this.v[2].y);
    ctx.lineTo(fpzx+(1-f)*this.v[3].x,fpzy+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
  }

  this.drawC=(frac)=>{
    let f=frac;
    ctx.beginPath();
    ctx.moveTo(this.v[0].x,this.v[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v[0].x,(1-f)*this.v[1].y+f*this.v[0].y);
    ctx.lineTo((1-f)*this.v[2].x+f*this.v[0].x,(1-f)*this.v[2].y+f*this.v[0].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v[0].x,(1-f)*this.v[3].y+f*this.v[0].y);
    ctx.closePath();
    ctx.stroke();
  }
  this.drawC2=(frac)=>{
    let f=frac;
    ctx.beginPath();
    let fpx=f*this.v[0].x*Math.sin(f*TP/2);
    let fpy=f*this.v[0].y*Math.sin(f*TP/2);
    ctx.moveTo(fpx+(1-f)*this.v[0].x,fpy+(1-f)*this.v[0].y);
    ctx.lineTo(fpx+(1-f)*this.v[1].x,fpy+(1-f)*this.v[1].y);
    ctx.lineTo(fpx+(1-f)*this.v[2].x,fpy+(1-f)*this.v[2].y);
    ctx.lineTo(fpx+(1-f)*this.v[3].x,fpy+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
  }
  this.drawF=(frac)=>{
    let f=frac/2;
    ctx.beginPath();
    ctx.moveTo(this.v[0].x,this.v[0].y);
    ctx.lineTo((1-f)*this.v[1].x+f*this.v[3].x,(1-f)*this.v[1].y+f*this.v[3].y);
    //ctx.lineTo(this.v[1].x,this.v[1].y);
    ctx.lineTo(this.v[2].x,this.v[2].y);
    ctx.lineTo((1-f)*this.v[3].x+f*this.v[1].x,(1-f)*this.v[3].y+f*this.v[1].y);
    //ctx.lineTo(this.v[3].x,this.v[3].y);
    ctx.closePath();
    ctx.strokeStyle="hsla(0,0%,0%,"+(1-frac)+")";
    ctx.stroke();
  }
  this.draw=this.drawX;
  this.setDraw=(d)=>{
    this.draw=[this.drawC,this.drawF,this.drawX,this.drawR,this.drawC2,this.drawR2][d];
    //this.draw=this.drawR;
  }
}

var TileSet=function() {
  this.tiles=[];
  this.hue=0;
  this.hue2=getRandomInt(0,360);
  this.sat=0;
  this.sat2=70+20*Math.random();
  this.lum=0;
  this.lum2=70+20*Math.random();
  this.state=0;
  this.state=0;
  //this.shiftTiles=()=>{ this.tiles.forEach((ti)=>{ ti.shift() }); }
  //this.flipTiles=()=>{ this.tiles.forEach((ti)=>{ ti.shift(); ti.shift; }); }
  this.randomizeTransition=(dt)=>{
    this.tiles.forEach((ti)=>{ ti.setDraw(dt) });
  }
  this.getFrac=()=>{
    if (state%3==1) {
debugger;
      return frac;
    } else if (state%3==2) {
      return frac;
    } else {
      return 1-frac;
    }
  }
  this.drawTiles=()=>{
    if (state%3==1) {
      let h=(this.hue+frac*(this.hue2-this.hue+360)%360);
      let s=frac*this.sat2+(1-frac)*this.sat;
      let l=frac*this.lum2+(1-frac)*this.lum;
      ctx.fillStyle="hsl("+h+","+s+"%,"+l+"%)";
      for (let tile of this.tiles) {
        tile.draw(0);
        ctx.fill();
      }
    } else {
      if (state%3==2) {
        ctx.fillStyle="hsl("+this.hue2+","+this.sat2+"%,"+this.lum2+"%)";
      } else {
        ctx.fillStyle="hsl("+this.hue+","+this.sat+"%,"+this.lum+"%)";
      }
      for (let tile of this.tiles) {
	tile.draw(this.getFrac());
	ctx.fill();
      }
    }
  }
}

var P=D;
var W=2; // layers+1
var C=4; // radials
var pts=[]
var tileSets=[];
var setTileSets=()=>{
  tileSets=[];
  for (let ts=0; ts<2*(W-1); ts++) tileSets.push(new TileSet());
}

var randomizeF=()=>{
  //W=getRandomInt(2,11); // layers+1
  //C=2*getRandomInt(3,28); // radials
  let S=[-1,1][getRandomInt(0,2)];
  C=2*(16+S*getRandomInt(0,15,true)); // radials
  let b=Math.floor(C/3);
  S=[-1,1][getRandomInt(0,2)];
  if (b<3) {
    W==2;
  } else {
    W=b+S*getRandomInt(0,b-2,true);
  }
  W=Math.min(27,W);
}

var setPoints=()=>{
  pts=[];
  let q=1/(2*C);
  for (let c=0; c<C; c++) {
    let o=c*TP/C; 
    for (let r=-W; r<W; r++) {
      let Z=TP*q*Math.sin(r*TP/4)+o;
      let r2=Math.cos(r*TP/(4*W));
      let x=r2*P*Math.cos(Z);
      let y=r2*P*Math.sin(Z);
      pts.push({"x":x,"y":y,"z":Z});
    }
  }
}

var reset=()=>{
  setPoints();
  drawO();
}

var pr=[ //19
[0],
[0,0],
[1,0,0],
[1,1,0,0],
[0,1,1,0,0],
[0,0,1,1,0,0],
[1,0,0,1,1,0,0],
[1,1,0,0,1,1,0,0],
[0,1,1,0,0,1,1,0,0],
[0,0,1,1,0,0,1,1,0,0],
[1,0,0,1,1,0,0,1,1,0,0],
[1,1,0,0,1,1,0,0,1,1,0,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0],
];

var di=[
[0],
[1,0],
[1,1,0],
[0,1,1,0],
[0,0,1,1,0],
[1,0,0,1,1,0],
[1,1,0,0,1,1,0],
[0,1,1,0,0,1,1,0],
[0,0,1,1,0,0,1,1,0],
[1,0,0,1,1,0,0,1,1,0],
[1,1,0,0,1,1,0,0,1,1,0],
[0,1,1,0,0,1,1,0,0,1,1,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
[1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0],
];

var setTiles=(v)=>{
  setTileSets();
  let pointCount=2*C*W;
  for (let l=0, i=0; l<W-1; l++) {
    for (let c=0; c<C; c++,i++) {
      let prox=(c+pr[W-2][l])*2*W+l;
      if (prox>=pointCount) prox=prox-pointCount;
      let s1=c*2*W+l+1;
      let s2=(c+1)*2*W+l+1;
      if (s2>=pointCount) s2=s2-pointCount;
      let dist=(c+di[W-2][l])*2*W+l+2;
      if (dist>=pointCount) dist=dist-pointCount;
      tileSets[2*l+c%2].tiles.push(new Tile(
        pts[prox],
        pts[1+c*2*W+l],
        pts[dist],
        pts[s2],
        i
      ));
    }
  }
}

var drawO=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  ctx.font="18px serif";
  ctx.beginPath();
  for (let i in pts) {
    ctx.lineTo(pts[i].x,pts[i].y);
    ctx.fillText(i,pts[i].x+20-40*Math.random(),pts[i].y+10-20*Math.random());
  }
  ctx.closePath();
  ctx.stroke();
}

var draw=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  for (let ts of tileSets) ts.drawTiles();
//  for (let i=0; i<tileSets.length; i++) { tileSets[i].drawTiles(); }
}

var randomizeTransition=()=>{
  let dt=getRandomInt(0,6);
  for (let tset of tileSets) { tset.randomizeTransition(dt); }
}

var transitColors=()=>{
  for (let tset of tileSets) {
    tset.hue=tset.hue2;
    tset.hue2=(tset.hue+getRandomInt(0,180))%360;
    tset.sat=tset.sat2;
    tset.sat2=70+20*Math.random();
    tset.lum=tset.lum2;
    tset.lum2=70+20*Math.random();
  }
}

var pauseTS=1000;
var pause=(ts)=>{
  if (stopped) return;
  if (ts<pauseTS) {
    requestAnimationFrame(pause);
  } else {
    requestAnimationFrame(animate);
  }
}

var time=0;
var stopped=true;
var frac=0;
var duration=2000;
var state=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  let af=animate;
  if (state%3==1) {
    duration=6000;
  } else {
    duration=2000;
  }
  if (progress<duration) {
    frac=progress/duration;
    draw();
  } else {
    time=0;
    frac=0;
    state++;
    draw();
    if (state%3==1) {
      pauseTS=performance.now()+300;
    } else if (state%3==2) {
      randomizeTransition();
      pauseTS=performance.now()+300;
    } else {
      randomizeF();
      setPoints();
      setTiles();
      transitColors();
      randomizeTransition();
      pauseTS=performance.now()+300;
    }
    af=pause;
  }
  requestAnimationFrame(af);
}

var start=()=>{
  if (stopped) {
    if (frac>0) {
      time=performance.now()-frac*duration;
    } else {
      time=0;
    }
    requestAnimationFrame(animate);
    stopped=false;
  } else {
    stopped=true;
  }
}
ctx.canvas.addEventListener("click", start, false);

/*
body.append(
  (()=>{
    var getStdRange=(min,max,step)=>{
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
	let w=getStdRange(1,16,1);
	w.value=W;
	w.oninput=()=>{
	  W=parseFloat(w.value);
	  reset();
	}
	return w;
      })(),
      (()=>{
	let c=getStdRange(2,40,2);
	c.value=C;
	c.oninput=()=>{
	  C=parseInt(c.value);
	  reset();
	}
	return c;
      })(),
    );
    return d;
  })(),
);
*/

randomizeF();
onresize();
setTiles();
transitColors();
//draw();
start();
