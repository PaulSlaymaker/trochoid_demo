// no leap

var RED=function(dt) {
  this.date=new Date();
  if (Number.isInteger(dt)) {
    this.date.setTime(dt);
  }
}

var Day=function() {
}

var Week=function() {
  this.dates=[];
}

var weeks=[];

let date=new Date();
let nTime=date.getTime();
let nDay=date.getDay();
let DAYMS=86400000;
let WEEKS=30;
let MONS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let g=document.querySelector("#cal");
//g.append((()=>{ 
var indicDiv=(()=>{ 
  let d=document.createElement("div");
  d.className="head";
  d.style.gridColumn=1;
  d.style.gridRow=1;
d.style.fontSize='9px';
  return d;
})();
g.append(indicDiv);

["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(d,i) {
  g.append(
    (()=>{ 
      let hd=document.createElement("div");
      hd.append(d);
      hd.className="head";
      hd.style.gridColumn=i+2;
      hd.style.gridRow=1;
      hd.style.background="#FFFFFF";
      return hd;
    })()
  );
});

g.append((()=>{ 
  let d=document.createElement("div");
  d.className="head";
  d.textContent="headL";
  d.style.gridRow=1;
  return d;
})());

/*
g.append(
  (()=>{ 
    let mobkg=document.createElement("div");
    mobkg.style.background="#FFFFFF";
    mobkg.style.gridColumn=1;
    mobkg.style.gridRowStart=2;
    mobkg.style.gridRowEnd=WEEKS+2;
    return mobkg;
  })()
);
*/

for (let w=0; w<7*WEEKS; w+=7) {
  let week=new Week();
  for (let i=-nDay; i<7-nDay; i++) {
    let label=document.createElement("div");
    date.setTime(nTime+(i+w)*DAYMS);
    if (date.getDay()==0) {
      let m=document.createElement("div");
      if (date.getDate()<9) {
      } else if (date.getDate()<16) {
	m.append(MONS[date.getMonth()]);
	m.classList.add(["monc0","monc1","monc2"][date.getMonth()%3]);
      }
      m.style.gridColumn=1;
      //m.style.gridRow=w/7+2;
      m.classList.add("monl");
      if (w<7) {
	m.classList.add("row1");
        m.style.gridRow=2;
      }
      g.append(m);
      week.label=m;
    }
    label.textContent=date.getDate().toString().padStart(2,"\xA0");
    label.style.gridColumn=i+nDay+2;
    if (w<7) {
      label.classList.add("row1");
      label.style.gridRow=2;
    }
    if (i+nDay<7) {
    }
    if (i<0 && w==0) {
      label.style.color="#888";
    }
    label.classList.add(["mon0","mon1","mon2"][date.getMonth()%3]);
    g.append(label);
    week.dates.push(label);
  }
  weeks.push(week);
}

g.append((()=>{ 
  let d=document.createElement("div");
  d.textContent="headL2";
  d.style.gridRow="2/"+WEEKS;
  d.style.gridColumn=9;
  return d;
})());

g.onmousedown=function() {
  scroll.dStart=event.screenY;
  g.style.cursor="move";
}

g.onmousemove=function() {
//log(event.screenY);
  if (event.buttons==1 && scroll.dStart>0) {
    event.preventDefault();
    scroll.scrollTo(event.screenY);
  }
}

var DUR=600;
var SENSITIVITY=32;

g.onmouseup=function() {
  scroll.dStart=0;
  //scroll.uPosition=0;
  scroll.dPosition=0;
  scroll.bl=0;
  scroll.dur=DUR;
  g.style.cursor="auto";
}


var scroll={
  position:0,  // 19 for 30 WEEKS, 11 visible @ 400px ht/32=12 + 1 header
  pMax:WEEKS-400/32-1,  // move consts from html
  //uPosition:0,
  dPosition:0,
  dStart:0,
  dEnd:0,
  start:0,
  bl:0,
  dur:DUR,
  scrollTo:function(px) {
    let del=scroll.dPosition-(scroll.dStart-px)/32;
    //let dpos=Math.trunc(del);
    let dpos=scroll.dPosition-Math.trunc((scroll.dStart-px)/SENSITIVITY);
//indicDiv.innerHTML=scroll.dPosition+" <br> "+del+" <br> "+dpos;
indicDiv.innerHTML=scroll.dPosition+" <br> "+dpos;
    if (dpos>0) {
      scroll.up();
    } else if (dpos<0) {
      scroll.down();
    }
  },
/*
  scrollToX:function(px) {
if (px===undefined) {
  console.log("upx");
  return;
}
    let del=scroll.uPosition-(scroll.dStart-px)/32;
    let dpos=Math.trunc(del);
    let dfrac=del-dpos;
indicDiv.innerHTML=del+" <br> "+dpos+" <br> "+dfrac;
    if (dpos<0) {
      for (let i=0; i<dpos; i++) {
        weeks[scroll.position+i].label.style.display='block';
        weeks[scroll.position+i].dates.forEach(function(el) {
          el.style.display='block';
        });
        scroll.position--;
      }
    } else if (dpos>0) {
      for (let i=0; i<dpos; i++) {
        weeks[scroll.position+i].label.style.display='none';
        weeks[scroll.position+i].dates.forEach(function(el) {
          el.style.display='none';
        });
        scroll.position++;
      }
    }
      let mt=0;
      if (dfrac<0) {
        mt=dfrac*32+"px";
      } else {
        mt=(dfrac-1)*32+"px";
      }
if (!mt.startsWith("-")) {
  debugger;
}
      weeks[scroll.position].label.style.marginTop=mt;
      weeks[scroll.position].dates.forEach(function(el) {
        el.style.marginTop=mt;
      });
    scroll.uPosition+=(scroll.dStart-px)/32;
    scroll.dStart=px;
  },
*/
  animateDown:function(ts) {
    if (!scroll.start) {
      scroll.start=ts;
      //scroll.dur=DUR/(Math.abs(scroll.bl)+1);
      scroll.dur=DUR;
    }
    let progress=ts-scroll.start;
    if (progress<scroll.dur) {
      let frac=progress/scroll.dur;
      let mt=1-frac*32+"px";
      weeks[scroll.position].label.style.marginTop=mt;
      weeks[scroll.position].dates.forEach(function(el) {
        el.style.marginTop=mt;
      });
      requestAnimationFrame(scroll.animateDown);
    } else {
      //document.styleSheets[0].cssRules[2].style.display='none';
      weeks[scroll.position].label.style.display='none';
      //weeks[scroll.position].label.parentNode.removeChild(weeks[scroll.position].label);
      weeks[scroll.position].dates.forEach(function(el) {
        el.style.display='none';
      });
      scroll.position++;
scroll.dPosition++;
      scroll.start=0;
/*
      if (scroll.bl>0) {
console.log("BL "+scroll.bl);
        scroll.bl--;
//scroll.dPosition++;
        //requestAnimationFrame(scroll.animateDown);
        scroll.down();
      }
*/
    }
  },
  animateUp:function(ts) {
if (scroll.position==0) {
  return;
}
    if (!scroll.start) {
      scroll.start=ts;
      weeks[scroll.position-1].label.style.display="block";
      weeks[scroll.position-1].dates.forEach(function(el) {
        el.style.display="block";
      });
    }
    let progress=ts-scroll.start;
    if (progress<scroll.dur) {
      let frac=progress/scroll.dur;
      let mt=(frac-1)*32+"px";
      weeks[scroll.position-1].label.style.marginTop=mt;
      weeks[scroll.position-1].dates.forEach(function(el) {
        el.style.marginTop=mt;
      });
      requestAnimationFrame(scroll.animateUp);
    } else {
      let mt="0";
      weeks[scroll.position-1].label.style.marginTop=mt;
      weeks[scroll.position-1].dates.forEach(function(el) {
        el.style.marginTop=mt;
      });
      scroll.position--;
scroll.dPosition--;
      scroll.start=0;
/*
      if (scroll.bl<0) {
        scroll.bl++;
//scroll.dPosition--;
        scroll.up();
      }
*/
    }
  },
  down:function() {
    if (scroll.position>scroll.pMax) return;
    if (scroll.start>0) {
      scroll.bl=Math.min(2,scroll.bl+1);
      return;
    }
    requestAnimationFrame(scroll.animateDown);
  },
  up:function() {
    if (scroll.position<1) return;
    if (scroll.start>0) {
      scroll.bl=Math.max(-2,scroll.bl-1);
      return;
    }
    requestAnimationFrame(scroll.animateUp);
  }
}

var logging=true;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}

//document.styleSheets[0].insertRule("#cal dif.monc3 { color:hsl(320,20%,50%) }",document.styleSheets[0].cssRules.length);
//document.styleSheets[0].cssRules[2].style.marginTop=mt;
