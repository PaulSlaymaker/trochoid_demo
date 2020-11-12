"use strict"; // Paul Slaymaker, paul25882@gmail.com
const body=document.getElementsByTagName("body").item(0);
const TP=2*Math.PI;

const getRandomInt=(min,max,low)=>{
  if (low) {
    return Math.floor(Math.random()*Math.random()*(max-min))+min;
  } else {
    return Math.floor(Math.random()*(max-min))+min;
  }
}

const PT=function(x,y) { this.x=x; this.y=y; }

const W=6;  // even
const C=60;

var width=window.innerWidth/C;
var height=window.innerHeight/W;
var X0=window.innerWidth/2;
var Y0=window.innerHeight/2;
var D=100;
onresize=()=>{ 
  D=Math.min(0.8*window.innerWidth,0.8*window.innerHeight)/2/W; 
  width=0.8*window.innerWidth/C;
  height=0.8*window.innerHeight/W;
  X0=window.innerWidth/2;
  Y0=window.innerHeight/2;
  twelve.style.bottom=window.innerHeight/2+W*D+"px";
  three.style.top=window.innerHeight/2-three.offsetHeight/2+"px";
  three.style.left=window.innerWidth/2+W*D+16+"px";
  six.style.top=window.innerHeight/2+W*D+"px";
  nine.style.top=window.innerHeight/2-three.offsetHeight/2+"px";
  nine.style.right=window.innerWidth/2+W*D+16+"px";
}

var Color=function(op) {
  this.hx=getRandomInt(0,360);
  this.hue=this.hx;
  if (op) {
    //this.sat=80+20*Math.random();
    //this.lum=60+20*Math.random();
    this.sat=90+10*Math.random();
    this.lum=70+10*Math.random();
  } else {
    this.sat=20*Math.random();
    this.lum=20+20*Math.random();
  }
  this.ff=1+(1-2*Math.random())/5;
  this.transit=()=>{
    let t=performance.now()/40;
    this.hue=this.hx+this.ff*t;
    this.hsl="hsl("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%)";
  }
/*
  this.randomize=()=>{
    //this.hue=(this.hue+getRandomInt(0,180))%360;
    this.hue=getRandomInt(0,360);
    this.sat=40+30*Math.random();
    this.lum=60+30*Math.random();
    return this;
  }
*/
  this.getHSL=()=>{ return this.hsl; }
  this.dark=()=>{
    this.sat=0.8*this.sat;
    this.lum=0.8*this.lum;
    this.hsl="hsl("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%)";
  }
  this.light=()=>{
    this.sat=1.25*this.sat;
    this.lum=1.25*this.lum;
    this.hsl="hsl("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%)";
  }
  this.hsl="hsl("+Math.floor(this.hue)%360+","+this.sat+"%,"+this.lum+"%)";
/*
  this.getBrightHSL=(f)=>{ 
  let s=(1-f)*this.sat+f*100;
  let l=(1-f)*this.lum+f*80;
    return "hsl("+this.hue+","+s+"%,"+l+"%)";
  }
*/
}

var hues=[];
var chues=[];
var setColors=()=>{
  hues=[];
  chues=[];
  for (let i=0; i<W; i++) {
    hues.push(new Color());
    chues.push(new Color(true));
  }
}
setColors();

const cFrac=(frac)=>{
  let f1=.1;
  let f2=.9;
  var e2=3*frac*Math.pow(1-frac,2)*f1;
  var e3=3*(1-frac)*Math.pow(frac,2)*f2;
  var e4=Math.pow(frac,3);
  return e2+e3+e4;
}

var Div=function(pt1,pt2,pt3,pt4,w,c) {
  this.time=0;
  this.pt1=pt1;
  this.pt2=pt2;
  this.pt3=pt3;
  this.pt4=pt4;
  this.w=w;
  this.el=document.createElement("div");
  body.append(this.el);
  this.setTime=()=>{
    let d=new Date();
/*
    if (w==0) {
      if (d.getSeconds()==(c+15)%60) this.setClock();
      else this.setBackground();
    } else if (w==1) {

    } else if (w==1) {
      if (d.getSeconds()==(c+14)%60) this.setClock(); 
      else if (d.getSeconds()==(c+15)%60) this.setClock();
      else this.setBackground();
*/
    if (w==0) {
      if (d.getSeconds()==(c+15)%60) {
        this.setClock();
//        secondDiv.set(X0+D*(this.pt2.x+this.pt4.x)/2,Y0+D*(this.pt2.y+pt4.y)/2,d.getSeconds());
     }
      else this.setBackground();
    } else if (w==1) {
      if (d.getMinutes()==(c+14)%60) this.setClock();
      else if (d.getMinutes()==(c+15)%60) this.setClock();
      else this.setBackground();
    } else if (w==2) {
      if (d.getMinutes()==(c+15)%60) this.setClock();
      else this.setBackground();
    } else if (w==3) {
      if (d.getHours()%12*5+Math.floor(d.getMinutes()/12)==(c+14)%60) this.setClock();
      else if (d.getHours()%12*5+Math.floor(d.getMinutes()/12)==(c+15)%60) this.setClock();
      else this.setBackground();
    } else if (w==4) {
      if (d.getHours()%12*5+Math.floor(d.getMinutes()/12)==(c+15)%60) this.setClock();
      else this.setBackground();
    }
  }
  this.set=()=>{
    let minx=Infinity;
    let maxx=-Infinity;
    let miny=Infinity;
    let maxy=-Infinity;
    for (let i=0,p=[this.pt1,this.pt2,this.pt3,this.pt4]; i<4; i++) {
      if (minx>p[i].x) minx=p[i].x;
      if (maxx<p[i].x) maxx=p[i].x;
      if (miny>p[i].y) miny=p[i].y;
      if (maxy<p[i].y) maxy=p[i].y;
    }
    let diffx=maxx-minx;
    let diffy=maxy-miny;
    this.el.style.top=Y0+D*miny+"px";
    this.el.style.left=X0+D*minx+"px";
    this.el.style.width=D*(diffx)+"px";
    this.el.style.height=D*(diffy)+"px";
    let poly="polygon("
      poly+=100*((this.pt1.x-minx)/diffx)+"% "+100*((this.pt1.y-miny)/diffy)+"%,"
           +100*((this.pt2.x-minx)/diffx)+"% "+100*((this.pt2.y-miny)/diffy)+"%,"
           +100*((this.pt3.x-minx)/diffx)+"% "+100*((this.pt3.y-miny)/diffy)+"%,"
           +100*((this.pt4.x-minx)/diffx)+"% "+100*((this.pt4.y-miny)/diffy)+"%)"
    this.el.style.clipPath=poly;
    this.setTime();
  }
  this.setBackground=()=>{ this.el.style.background=hues[w].getHSL(); }
  this.setClock=()=>{ this.el.style.background=chues[w].getHSL(); }
}

/*
const secondDiv=(()=>{
  let d=document.createElement("div");
  d.style.color="black";
  //d.style.border="1px solid white";
  d.style.borderRadius="50%";
  d.style.padding="12px";
//  d.style.width="3vh";
//  d.style.height="3vh";
  d.style.letterSpacing="3px";
  d.style.zIndex=2;
  body.append(d);
  return {
    "el":d,
    "set":(x,y,s)=>{
      d.style.left=x-d.offsetWidth/2+"px";
      d.style.top=y-d.offsetHeight/2+"px";
      d.style.background=chues[0].getHSL();
      d.textContent=s;
      if (s<10) d.style.letterSpacing="5px";
      d.style.letterSpacing="normal";
      //d.style.left=x+"px";
      //d.style.top=y+"px";
    }
  };
})();
*/

const twelve=(()=>{
  let d=document.createElement("div");
  d.style.width="100%";
  d.style.textAlign="center";
  d.classList.add("dial");
  d.textContent="12";
  body.append(d);
  return d;
})();

const three=(()=>{
  let d=document.createElement("div");
  d.classList.add("dial");
  d.textContent="3";
  body.append(d);
  return d;
})();

const six=(()=>{
  let d=document.createElement("div");
  d.style.width="100%";
  d.style.textAlign="center";
  d.classList.add("dial");
  d.textContent="6";
  body.append(d);
  return d;
})();

const nine=(()=>{
  let d=document.createElement("div");
  d.style.textAlign="right";
  d.classList.add("dial");
  d.textContent="9";
  body.append(d);
  return d;
})();

const secDiv=(()=>{
  let to={};
  to.el=document.createElement("div");
  return to;
})();

var Offset=function(w) {
  if (w>=W) {
    this.range=1;
    this.o=1;
  } else {
    this.range=Math.pow(Math.sin(w/(W-1)*TP),2);
    this.o=1-this.range*(0.4-0.8*Math.random());
  }
  this.ff=1+(1-2*Math.random())/10;
  this.transit=()=>{
    let t=performance.now()/4000;
    this.o=1-this.range*(0.3*Math.sin(this.ff*t));
  }
}
var offsets=[];
for (let w=0; w<=W; w++) {
  offsets.push(new Offset(w));
}

var points=(()=>{
  let a=[];
  for (let w=0; w<=W; w++) {
    a[w]=[];
    for (let c=0; c<=C; c++) {
      a[w].push(new PT(0,0));
    }
  }
  return a;
})();

var setPoints=()=>{
  //let sk=[TP/C/4,-TP/C/4];
  let sk=[0,-TP/C/2];
  //const sk=[TP/C/2,0];
  for (let w=0; w<=W; w++) {
    for (let c=0; c<=C; c++) {
      let z=c*TP/C+sk[w%2];
      let x=(w*offsets[w].o)*Math.cos(z);
      let y=(w*offsets[w].o)*Math.sin(z);
      points[w][c].x=x;
      points[w][c].y=y;
    }
  }
}
setPoints();

const divs=[];
for (let w=0; w<W-1; w++) {
  for (let c=0; c<C; c++) {
    if (w%2==0) {
      divs.push(new Div(points[w][c],points[w+1][c+1],points[w+2][c],points[w+1][c],w,c));
    } else {
      divs.push(new Div(points[w][c],points[w+1][c],points[w+2][c],points[w+1][(C+c-1)%C],w,c));
    }
  }
}

/*
var SF=()=>{
  let h1=getRandomInt(0,360);
  let h2=getRandomInt(0,360);
//  let h1=70;
//  let h2=258;
  let hdiff=h2-h1;
  if (hdiff<-180) { hdiff=-(360+hdiff)%360; }
  else if (hdiff>180) hdiff=-(360-hdiff)%360;
console.log(hdiff);
  let hx1=Math.floor(0.9*h1+0.1*h2);
  let hx2=Math.floor(h1+0.1*hdiff);
  console.log(h1+" "+h2+" "+hx1+" "+hx2);
}

var getColor=(f,c1,c2)=>{
  let hdiff=c2.hue-c1.hue;
  if (hdiff<-180) { hdiff=-(360+hdiff)%360; }
  else if (hdiff>180) hdiff=-(360-hdiff)%360;
  let h=Math.floor(c1.hue+f*hdiff);
  let s=(1-f)*c1.sat+f*c2.sat;
  let l=(1-f)*c1.lum+f*c2.lum;
  return "hsl("+h+","+s+"%,"+l+"%)";
}
*/

var transit=()=>{
  for (let i=0; i<W; i++) {
    offsets[i].transit();
  }
  for (let i=0; i<W; i++) {
    hues[i].transit();
    chues[i].transit();
  }
  setPoints();
  draw();
}

var draw=()=>{ 
  for (let i=0; i<divs.length; i++) { divs[i].set(); } 
}

var stopped=false;
var frac=0;
var time=0;
var duration=2400;
var animate=(ts)=>{
  if (stopped) return;
  transit();
  requestAnimationFrame(animate);
}

var invert=11;
var start=()=>{
/*
  if (stopped) {
    stopped=false;
    requestAnimationFrame(animate);
  } else {
    stopped=true;
    invert=!invert;
  }
*/
    //invert=!invert;
  if (invert++%12<6) {
    for (let i=0; i<W; i++) { chues[i].dark(); hues[i].light(); }
  } else {
    for (let i=0; i<W; i++) { chues[i].light(); hues[i].dark(); }
  }
  
}
body.addEventListener("click", start, false);

onresize();

//draw();
requestAnimationFrame(animate);
//start();
