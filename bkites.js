"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
body.style.background="#444";
body.style.display="grid";
body.style.margin="0";

// these for random float?:
// normalize v
// disperse to radius or random
// square tile? 16?

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

var randomColor=()=>{
  let h=getRandomInt(0,360);
  let s=70+20*Math.random();
  let l=70+20*Math.random();
  return "hsl("+h+","+s+"%,"+l+"%)";
}

var D=400;
onresize=function() { 
  D=Math.min(window.innerWidth,window.innerHeight); 
  ctx.canvas.width=D;
  ctx.canvas.height=D;
  ctx.translate(D/2,D/2);
  ctx.lineWidth=0.4;
  setPoints();
}

var F1=17;
var F2=29;
var Z=1;
var R;
var pts=[]

var TSCP={
  "1,5":20,"1,7":42,"1,9":72,"1,11":110,"1,13":156,"1,15":210,"1,17":272,"1,19":342,"1,21":420,"1,23":506,"1,25":600,"1,27":702,"1,29":812,
  "3,7":12,"3,11":72,"3,13":50,"3,17":182,"3,19":112,"3,23":340,"3,25":198,"3,29":546,
  "5,9":44,"5,11":18,"5,13":56,"5,17":156,"5,19":266,"5,21":80,"5,23":198,"5,27":418,"5,29":648,
  "7,11":20,"7,13":102,"7,15":24,"7,17":170,"7,19":132,"7,23":272,"7,25":162,"7,27":580,"7,29":110,
  "9,13":68,"9,17":184,"9,19":30,"9,23":98,"9,25":240,"9,29":420,
  "11,15":28,"11,17":30,"11,19":152,"11,21":290,"11,23":36,"11,25":182,"11,27":496,"11,29":522,
  "13,17":92,"13,19":162,"13,21":104,"13,23":110,"13,25":420,"13,27":42,"13,29":464,
  "15,19":36,"15,23":40,"15,29":574,
  "17,21":116,"17,23":42,"17,25":296,"17,27":310,"17,29":324,
  "19,23":44,"19,25":222,"19,27":232,
  "21,25":140
};
var TSCN={
  "1,5":6,"1,7":8,"1,9":10,"1,11":12,"1,13":14,"1,15":16,"1,17":18,"1,19":20,"1,21":22,"1,23":24,"1,25":26,"1,27":28,"1,29":30,
  "3,7":30,"3,11":42,"3,13":112,"3,17":100,"3,19":242,"3,23":182,"3,25":420,"3,29":288,
  "5,9":14,"5,11":80,"5,13":90,"5,17":110,"5,19":72,"5,21":338,"5,23":308,"5,27":288,"5,29":170,"7,29":684,
  "7,11":54,"7,13":20,"7,15":154,"7,17":72,"7,19":182,"7,23":210,"7,25":416,"7,27":102,
  "9,13":22,"9,17":26,"9,19":252,"9,23":352,"9,25":306,"9,29":342,
  "11,15":78,"11,17":140,"11,19":90,"11,21":32,"11,23":374,"11,25":324,"11,27":114,"11,29":200,
  "13,17":30,"13,19":32,"13,21":170,"13,23":252,"13,25":38,"13,27":520,"13,29":210,
  "15,19":102,"15,23":266,"15,29":44,
  "17,21":38,"17,23":200,"17,25":42,"17,27":132,"17,29":230,
  "19,23":126,"19,25":44,"19,27":138,
  "21,25":46
};

var nKeys=Object.keys(TSCN);
nKeys.sort((a,b)=>{
  //let rl=Math.abs(2-(F2-Z*F1)/(F2+Z*F1-2));  // opt 2, rl=0
  let e=/(\d*),(\d*)/;
  let ae=e.exec(a);
  let af1=parseInt(ae[1]);
  let af2=parseInt(ae[2]);
  let arl=Math.abs(2-(af2+af1)/(af2-af1-2));  // opt 2, rl=0;
  let be=e.exec(b);
  let bf1=parseInt(be[1]);
  let bf2=parseInt(be[2]);
  let brl=Math.abs(2-(bf2+bf1)/(bf2-bf1-2));  // opt 2, rl=0;
  return arl-brl;
/*
let z=-1;
console.log(af1+" "+af2);
console.log("RL1 "+(2-(af2-z*af1)/(af2+z*af1-2)));
console.log("RL2 "+rl);
debugger;
*/
});
var pKeys=Object.keys(TSCP);

var randomizeF=()=>{
  Z=[-1,1][getRandomInt(0,2,true)];
  //let keys=(Z==1)?pKeys:nKeys;
  let key;
  if (Z==1) {
    key=pKeys[getRandomInt(0,pKeys.length)];
  } else {
    key=nKeys[getRandomInt(0,nKeys.length,true)];
  }
  let a=/(\d*),(\d*)/.exec(key);
  F1=parseInt(a[1]);
  F2=parseInt(a[2]);
}

var setPoints=()=>{
  R=ctx.canvas.width/5;
  pts=[];
  let P=(F2-F1)*(F2+F1);
  for (let z=0; z<=TP; z+=TP/P) {
    pts.push({
      "x":R*(Math.sin(F1*z)+Math.sin(F2*z)),
      "y":R*(Math.cos(F1*z)+Z*Math.cos(F2*z)),
      "z":z
    });
  }
  tileSets=(()=>{
    let tis=[];
    let tsh=(F2+Z*F1-2)/2;
    let key=F1+","+F2;
    let fTable=(Z==1)?TSCP:TSCN;
    let t3=fTable[key];
    if (t3===undefined) t3=10;
    for (let i=0; i<tsh; i++) {
      let pa=[i,i+1,t3+i,t3-1+i];
      //tis.push(new TileSet(generateTiles(pa,0)));
      //tis.push(new TileSet(generateTiles(pa,1)));
      tis.push(new TileSet(pa,0));
      tis.push(new TileSet(pa,1));
    }
    return tis; 
  })();
}

var Tile=function(p1,p2,p3,p4) {
  this.v=[p1,p2,p3,p4];
  this.rx=R*(1-2*Math.random());
  this.ry=R*(1-2*Math.random());
  this.drawX=(frac)=>{
    let f=frac;
    ctx.beginPath();
    //let fpx=f*((Math.pow(this.v[2].x,2)*this.v[2].y)%R);
    //let fpy=f*((Math.pow(this.v[2].y,3)*this.v[2].x)%R);
    let fpx=f*this.rx;
    let fpy=f*this.ry;
    ctx.moveTo(fpx+(1-f)*this.v[0].x,fpy+(1-f)*this.v[0].y);
    ctx.lineTo(fpx+(1-f)*this.v[1].x,fpy+(1-f)*this.v[1].y);
    ctx.lineTo(fpx+(1-f)*this.v[2].x,fpy+(1-f)*this.v[2].y);
    ctx.lineTo(fpx+(1-f)*this.v[3].x,fpy+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
    // random, set it pts or (x*x*y)%R,(x*y*y)%R, etc.
  }
  this.drawR=(frac)=>{
    //let f=Math.pow(frac,0.8);
    let f=frac;
    let r=R;
    let fpzx=R*f*Math.cos(F2*this.v[0].z)
// +-Z
    ctx.beginPath();
    ctx.moveTo(fpzx+(1-f)*this.v[0].x,Z*r*f*Math.sin(F1*this.v[0].z)+(1-f)*this.v[0].y);
    ctx.lineTo(fpzx+(1-f)*this.v[1].x,Z*r*f*Math.sin(F1*this.v[0].z)+(1-f)*this.v[1].y);
    ctx.lineTo(fpzx+(1-f)*this.v[2].x,Z*r*f*Math.sin(F1*this.v[0].z)+(1-f)*this.v[2].y);
    ctx.lineTo(fpzx+(1-f)*this.v[3].x,Z*r*f*Math.sin(F1*this.v[0].z)+(1-f)*this.v[3].y);
    ctx.closePath();
    ctx.stroke();
  }

  this.drawC=(frac)=>{
    let f=frac;
    //let f=Math.pow(frac,0.8)/1.2;
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
    //let f=(Math.pow(frac,1.3)+Math.pow(frac,0.9))/3.97;
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
  //this.draw=[this.drawC,this.drawF][dt];
  this.draw=this.drawX;
  this.shift=()=>{ this.v.push(this.v.shift()); }
  this.setDraw=(d)=>{
    //this.draw=[this.drawC,this.drawF][d];
    this.draw=[this.drawC,this.drawF,this.drawX,this.drawR,this.drawC2][d];
    //this.draw=this.drawR;
  }
}

//var TileSet=function(tp) {
var TileSet=function(c,alt) {
  //this.tiles=tp;
  this.tiles=[];
//  this.color2="red";
//  this.color=randomColor();
  this.hue=0;
  this.hue2=getRandomInt(0,360);
  this.sat=0;
  this.sat2=70+20*Math.random();
  this.lum=0;
  this.lum2=70+20*Math.random();
  this.state=0;
  this.generateTiles=(c,alt)=>{
    let P=(F2-F1)*(F2+F1);
    let radials=F2-Z*F1;
    let os=F2+Z*F1
    for (let i=0; i<radials; i++) {
      if (i%2==alt) continue;
      this.tiles.push(new Tile(
	pts[(i*os+c[0])%P],
	pts[(i*os+c[1])%P],
	pts[(i*os+c[2])%P],
	pts[(i*os+c[3])%P]
      ));
    }
  }
  this.shiftTiles=()=>{ this.tiles.forEach((ti)=>{ ti.shift() }); }
  this.flipTiles=()=>{ this.tiles.forEach((ti)=>{ ti.shift(); ti.shift; }); }
  this.randomizeFlip=()=>{
    if (Math.random()<0.5) {
      this.tiles.forEach((ti)=>{ ti.shift() });
    }
  }
  this.randomizeTransition=(dt)=>{
    //let dt=getRandomInt(0,4);
    this.tiles.forEach((ti)=>{ ti.setDraw(dt) });
  }
/*
  this.getFrac=()=>{
    if (state==0) {
      return 0;
    } else if (state==1) {
      return frac;
    } else if (state==-1) {
      return 1-frac;
    } else {
      debugger;
    }
  }
*/
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
  this.transit=()=>{
debugger;
    if (this.state==1) {
      this.color=this.color2;
      this.state=-1;
      return 1;
    } else if (this.state==-1) {
      this.state=0;
      return 0;
    } else {
      return 0;
    }
  }
  this.drawTiles=()=>{
    if (state%3==1) {
    //if (false) {
      //let h=frac*this.hue2+(1-frac)*this.hue;
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
      //ctx.fillStyle=this.color;
      for (let tile of this.tiles) {
	tile.draw(this.getFrac());
	ctx.fill();
      }
    }
  }
  this.generateTiles(c,alt);
}

var generateTiles=(c,alt)=>{
  let P=(F2-F1)*(F2+F1);
  let radials=F2-Z*F1;
  let os=F2+Z*F1
  let t=[];
  for (let i=0; i<radials; i++) {
    if (i%2==alt) continue;
    t.push(new Tile(
      pts[(i*os+c[0])%P],
      pts[(i*os+c[1])%P],
      pts[(i*os+c[2])%P],
      pts[(i*os+c[3])%P]
    ));
  }
  return t;
}

var tileSets=[];

/*
var ct=[];
var randomizePattern=()=>{
  ct=[
    // 2 color
    [[0,0],[1,1],[0,0]],  
    // 3 color
    [[0,0],[1,1],[0,2]],
    [[0,0],[1,1],[2,2]],
    [[0,0],[1,2],[0,0]],
    [[0,1],[2,2],[0,1]],
    [[0,1],[2,2],[1,0]],
    [[0,1],[2,2],[0,0]],
    //[[0,1],[2,2],[1,1]],
    // 4 color
    [[0,0],[1,1],[2,3]],
    [[0,0],[1,2],[3,3]],
    [[0,1],[2,2],[3,3]],
//    [[0,1],[2,3],[1,1]],
//    [[0,1],[2,3],[0,1]],
//    [[0,1],[2,3],[1,0]],
  ][getRandomInt(0,10)];
}
*/

var draw=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  for (let ts of tileSets) ts.drawTiles();
/*
  for (let i=tileSets.length-1; i>=0; i--) {
    tileSets[i].drawTiles();
  }
*/
}

var drawO=()=>{
  ctx.clearRect(-D/2,-D/2,D,D);
  ctx.font="16px serif";
  ctx.fillText("0",pts[0].x+20-40*Math.random(),pts[0].y);
  ctx.beginPath();
  ctx.moveTo(pts[0].x,pts[0].y);
  for (let i=1; i<pts.length; i++) {
    ctx.lineTo(pts[i].x,pts[i].y);
    ctx.fillText(i,pts[i].x+20-40*Math.random(),pts[i].y+10-20*Math.random());
  }
  ctx.closePath();
  ctx.stroke();
}

var randomizeTransition=()=>{
  let dt=getRandomInt(0,5);
  for (let tset of tileSets) { tset.randomizeTransition(dt); }
}

var transitColors=()=>{
  for (let tset of tileSets) {
    tset.hue=tset.hue2;
    tset.hue2=getRandomInt(0,360);
    tset.sat=tset.sat2;
    tset.sat2=70+20*Math.random();
    tset.lum=tset.lum2;
    tset.lum2=70+20*Math.random();
  }
/*
  for (let tset of tileSets) {
    tset.color=tset.color2;
//    tset.randomizeFlip();
  }
*/
/*
  let fillColor=[];
  for (let i=0; i<4; i++) fillColor.push(randomColor());
  for (let i=0; i<tileSets.length; i++) { 
    tileSets[i].color2=fillColor[ct[((i-i%2)/2)%3][i%2]]; 
  }
*/
}

var order=[0,1,2,3,4,5];
var shuffle=()=>{
  let no=[];
  do {
    no.push(order.splice(getRandomInt(0,order.length),1)[0]);
  } while (order.length>0);
  order=no;
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
var setCount=0;
var state=0;
var animate=(ts)=>{
  if (stopped) return;
  if (!time) { time=ts; }
  let progress=ts-time;
  let af=animate;
  if (state%3==1) {
    duration=8000;
  } else {
    duration=2000;
  }
  if (progress<duration) {
    frac=progress/duration;
    draw();
  } else {
    time=0;
    frac=0;
    let active=0;
    state++;
  /* 
    if (active==0) {
      //setCount=(++setCount)%tileSets.length;
      setCount++;
      if (setCount==tileSets.length) {
        setCount=0;
        randomizePattern();
        transitColors();
        shuffle();
        pauseTS=performance.now()+1000;
        af=pause;
      }
    }
*/
    draw();

    //if (state==1) {
    if (state%3==1) {
      pauseTS=performance.now()+800;
//console.log("RL "+2*(F2-Z*F1)/(F2+Z*F1-2));
    } else if (state%3==2) {
      pauseTS=performance.now()+800;
    } else {
      randomizeF();
      setPoints();
      transitColors();
    //for (let tset of tileSets) { tset.shiftTiles(); }
	    //randomizePattern();
      pauseTS=performance.now()+300;
    }
    af=pause;
    randomizeTransition();
  }
  //draw();
  requestAnimationFrame(af);
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
	let f=getStdRange(0,1,0.005);
	f.value=frac;
	f.oninput=()=>{
	  frac=parseFloat(f.value);
	  draw();
	}
	return f;
      })(),
      (()=>{
	let r=getStdRange(0,7,0.01);
	r.value=R;
	r.oninput=()=>{
	  R=parseFloat(r.value);
	  draw();
	}
	return r;
      })(),
    );
    return d;
  })(),
);

onresize();

//randomizePattern();
transitColors();
//for (let tset of tileSets) { tset.shiftTiles(); tset.shiftTiles(); }
//for (let tset of tileSets) { tset.shiftTiles(); }
shuffle();
//draw(0);
console.log("RL "+2*(F2-Z*F1)/(F2+Z*F1-2));
start();
