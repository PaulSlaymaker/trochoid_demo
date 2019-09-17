// no leap

onresize=function() {
  //console.log(window.innerHeight);
}

let body=document.getElementsByTagName("body").item(0);

body.append(
  (()=>{
    let ss=document.createElement("style");
    ss.type="text/css";
    ss.title="ss";
    return ss;
  })()
);
var styleSheet=Array.from(document.styleSheets).find(function(ss) { return ss.title=="ss"; });

[
  "body { margin:0; font-family:sans-serif; font-size:9pt;",
  "#cal div.head { min-height:32px; font-size:12pt; font-weight:bold; text-align:center; padding:4px; z-index:2; border-bottom:1px solid #DDD; }",
  "#cal div { background:#FFFFFF; min-height:28px; padding:2px; }",
  "#cal div.mon0 { background:hsl(0,80%,98%); }",
  "#cal div.mon1 { background:hsl(120,80%,98%); }",
  "#cal div.mon2 { background:hsl(240,80%,98%); }",
  "#cal div.monl { text-align:center; font-weight:bold; margin:-1px 0; }",
  "#cal div.monc0 { font-size:12pt; color:hsl(0,20%,50%); }",
  "#cal div.monc1 { font-size:12pt; color:hsl(120,20%,50%); }",
  "#cal div.monc2 { font-size:12pt; color:hsl(240,20%,50%); }", 
  "#cal div.sc { font-size:14px; color:#777; text-align:center; }",
].forEach(function(rule) { styleSheet.insertRule(rule); });

var CALHT=window.innerHeight-4;

var g=(()=>{ 
  let grid=document.createElement("div");
  grid.id="cal";
  grid.draggable=true;
  //g.style.height="400px";
  grid.style.height=CALHT+"px";
  grid.style.display="grid";
  grid.style.gridTemplateColumns="minmax(max-content,7%) auto auto auto auto auto auto auto 18px";
  grid.style.gridGap="1px";
  grid.style.border="1px solid #DDDDDD";
  grid.style.background="#DDDDDD";
  grid.style.overflow="hidden";
  return grid;
})();
body.append(g);

//g.append((()=>{ 
var yearDiv=(()=>{ 
  let d=document.createElement("div");
  d.className="head";
  d.style.gridColumn=1;
  d.style.gridRow=1;
//d.style.fontSize='11px';
  return d;
})();
g.append(yearDiv);
yearDiv.set=(yr)=>{
  yearDiv.textContent=yr;
}

["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(d,i) {
  g.append(
    (()=>{ 
      let hd=document.createElement("div");
      hd.append(d);
      hd.className="head";
      hd.style.gridColumn=i+2;
      hd.style.gridRow=1;
      return hd;
    })()
  );
});

g.append((()=>{ // top right corner
  let d=document.createElement("div");
  d.className="head";
  d.style.gridRow=1;
  d.style.width="18px";
  //d.style.padding="0";
  return d;
})());

let DAYMS=86400000;
let WEEKS=30;
let date=new Date();
var nTime=date.getTime();
var nDay=date.getDay();

var Week=function() {
  this.els=[];
  this.dcount=[];
}

var weeks=[];

for (let w=0; w<7*WEEKS; w+=7) {
  let week=new Week();
  for (let i=-nDay; i<7-nDay; i++) {
    let label=document.createElement("div");
    let tm=nTime+(i+w)*DAYMS;
    date.setTime(tm);
    week.dcount.push(i+w);
    if (i==0 && w==0) {
      yearDiv.textContent=date.getFullYear();
    }
    if (date.getDay()==0) {
      let m=document.createElement("div");
      if (date.getDate()<9) {
      } else if (date.getDate()<16) {
	m.append(
          ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
          [date.getMonth()]
        );
	m.classList.add(["monc0","monc1","monc2"][date.getMonth()%3]);
      }
      m.style.gridColumn=1;
      //m.style.gridRow=w/7+2;
      m.classList.add("monl");
      if (w<7) {
        m.style.gridRow=2;
      }
      g.append(m);
      week.label=m;
    }
    label.textContent=date.getDate().toString().padStart(2,"\xA0");
    label.style.gridColumn=i+nDay+2;
    if (w<7) {
      label.style.gridRow=2;
    }
/*
    if (i+nDay<7) {
    }
*/
    if (i<0 && w==0) {
      label.style.color="#999";
    }
    label.classList.add(["mon0","mon1","mon2"][date.getMonth()%3]);
    g.append(label);
    week.els.push(label);
  }
  weeks.push(week);
}

// scrollbar
g.append((()=>{ 
  let d=document.createElement("div");
  d.style.gridRow="2/"+WEEKS;
  d.style.gridColumn=9;
  d.style.width="18px";
  d.style.padding="0";
  d.style.height=(CALHT-32-8-1)+"px";  // 32ht 8pad 1bord
  d.style.display="grid";
//d.style.gridAutoRows="20px"
  d.style.gridTemplateRows="24px auto 24px";
  d.append((()=>{ 
    let s=document.createElement("div");
    s.id="sd";
    s.classList.add("sc");
    s.style.borderBottom="1px solid #DDDDDD";
    s.style.minHeight="initial";
    s.innerHTML="&#9650;";
    return s;
  })());
  d.append((()=>{ 
    let s=document.createElement("div");
    s.id="tc";
//s.style.background="url(14x18.png)";
    s.style.backgroundImage="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAIAAAAyZ5t7AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4yMfEgaZUAAAAXSURBVDhPYygnGjAQrbJ8VOloCIyGAAAHXIaIgZAi6AAAAABJRU5ErkJggg==)";
    s.style.backgroundPosition="2px 2px";
    s.style.backgroundRepeat="no-repeat";
    return s;
  })());

  d.append((()=>{ 
    let s=document.createElement("div");
    s.id="su";
    s.classList.add("sc");
    s.style.borderTop="1px solid #DDDDDD";
    s.innerHTML="&#9660;";
    return s;
  })());
  return d;
})());

g.onmousedown=function() {
  scroll.source=event;
  if (event.target.id=="") {
    if (event.target.classList.contains("head")) {
      //event.stopPropagation();
      return;
    }
    g.style.cursor="move";
    scroll.drag=true;
  } else if (event.target.id=="sd") {
    event.stopPropagation();
    scroll.auto=true;
    scroll.up();
    return;
  } else if (event.target.id=="su") {
    event.stopPropagation();
    scroll.auto=true;
    scroll.down();
    return;
/*
  } else if (event.target.id=="st") {
    scroll.thumb=true;
    //event.stopPropagation();
    return;
*/
  } else if (event.target.id=="tc") {
//    let pos=Math.max(2,event.offsetY-10);  // move to after animation
//    event.target.style.backgroundPositionY=pos+"px";
    event.stopPropagation();
    scroll.thumb=true;
    scroll.auto=true;
    scroll.scrollTo(thumb.getTargetPos(event.offsetY));
    return;
  }
/*
scroll.source.target.id="drag";
  g.style.cursor="move";
  scroll.drag=true;
*/
}

g.onmousemove=function() {
  if (event.buttons==1) {
    if (event.target.classList.contains("head")) {
// turn off auto ?
      return;
    } else if (event.target.classList.contains("sc")) {
// turn off auto ?
      return;
    }
    scroll.source=event;
    if (scroll.drag) {
      event.preventDefault();
      if (scroll.start==0) {
	scroll.scrollDrag(event.screenY);
      }
    } else if (scroll.thumb) {
      event.preventDefault();
      scroll.scrollTo(thumb.getTargetPos(event.offsetY));
    }
  }
}

var DUR=120;
//var SENSITIVITY=32;

g.onmouseup=function() {
/*
  scroll.dStart=0;
  scroll.dEnd=0;
  scroll.dur=DUR;
  scroll.drag=false;
  scroll.thumb=false;
  scroll.auto=false;
*/
  scroll.reset();
  g.style.cursor="auto";
}

g.onmouseout=function() {
  if (event.buttons==1) {
    if (!scroll.drag) {
      scroll.reset();
      g.style.cursor="auto";
    }
  }
}

var scroll={
  position:0,  // 19 for 30 WEEKS, 11 visible @ 400px ht/32=12 + 1 header
  //pMax:WEEKS-CALHT/32-1,
  //pMax:Math.trunc(WEEKS-CALHT/32)+1,
  pMax:Math.ceil(WEEKS-CALHT/33+1),  // 32 + 1 grid-gapi = 33
  drag:false,
  thumb:false,
  source:null,	// event
  dStart:0,
  dEnd:0,
  start:0,
  dur:DUR,
  reset:function() {
    scroll.dStart=0;
    scroll.dEnd=0;
    scroll.dur=DUR;
    scroll.drag=false;
    scroll.thumb=false;
    scroll.auto=false;
  },
  scrollTo:function(pos) {
    scroll.dur=40;
    if (pos<scroll.position) {
      scroll.auto=true;
      scroll.up();
    } else if (pos>scroll.position) {
      scroll.auto=true;
      scroll.down();
    }
  },
  scrollDrag:function(px) {
    if (scroll.dStart==0) {
      scroll.dStart=px;
      return;
    } else {
      scroll.dEnd=px;
    }
    let stroke=(scroll.dEnd-scroll.dStart)/16;
//yearDiv.textContent=del;
    scroll.dStart=0;
    scroll.dEnd=0;
    if (stroke>0) {
      scroll.up();
    } else if (stroke<0) {
      scroll.down();
    }
  },
  animateDown:function(ts) {
    if (scroll.position>=scroll.pMax) {
      return;
    }
    if (!scroll.start) {
      scroll.start=ts;
    }
    let progress=ts-scroll.start;
    if (progress<scroll.dur) {
      let frac=progress/scroll.dur;
      let mt=1-frac*32+"px";
      weeks[scroll.position].label.style.marginTop=mt;
      weeks[scroll.position].els.forEach(function(el) {
        el.style.marginTop=mt;
      });
      thumb.setPosition(scroll.position+frac);
      requestAnimationFrame(scroll.animateDown);
    } else {
      weeks[scroll.position].label.style.display='none';
      weeks[scroll.position].els.forEach(function(el) {
        el.style.display='none';
      });
      scroll.position++;
      thumb.setPosition(scroll.position);
yearDiv.textContent=new Date(weeks[scroll.position].dcount[0]*DAYMS+nTime).getFullYear();
      scroll.start=0;
      dStart=0;
      dEnd=0;
      if (scroll.auto) {
	scroll.down();
      }
    }
  },
  animateUp:function(ts) {
    if (scroll.position==0) {
      return;
    }
    if (!scroll.start) {
      scroll.start=ts;
      weeks[scroll.position-1].label.style.display="block";
      weeks[scroll.position-1].els.forEach(function(el) {
        el.style.display="block";
      });
    }
    let progress=ts-scroll.start;
    if (progress<scroll.dur) {
      let frac=progress/scroll.dur;
      let mt=(frac-1)*32+"px";
      weeks[scroll.position-1].label.style.marginTop=mt;
      weeks[scroll.position-1].els.forEach(function(el) {
        el.style.marginTop=mt;
      });
thumb.setPosition(scroll.position-frac);
      requestAnimationFrame(scroll.animateUp);
    } else {
      let mt="0";
      weeks[scroll.position-1].label.style.marginTop=mt;
      weeks[scroll.position-1].els.forEach(function(el) {
        el.style.marginTop=mt;
      });
      scroll.position--;
      thumb.setPosition(scroll.position);
yearDiv.textContent=new Date(weeks[scroll.position].dcount[0]*DAYMS+nTime).getFullYear();
      scroll.start=0;
      dStart=0;
      dEnd=0;
      if (scroll.auto) {
	scroll.up();
      }
    }
  },
  down:function() {
    if (scroll.source.target.id=="tc") {
      if (scroll.position>=thumb.getTargetPos(scroll.source.offsetY)) {
	scroll.auto=false;
	return;
      }
    } else {
      if (scroll.position>=scroll.pMax) {
	scroll.auto=false;
	return;
      }
    }
    if (scroll.start>0) {
      return;
    }
    requestAnimationFrame(scroll.animateDown);
  },
  up:function() {
    if (scroll.position<1) {
      scroll.auto=false;
      return;
    }
    if (scroll.source.target.id=="tc") {
      if (scroll.position<=thumb.getTargetPos(scroll.source.offsetY)) {
	scroll.auto=false;
	return;
      }
    }
    if (scroll.start>0) {
      return;
    }
    requestAnimationFrame(scroll.animateUp);
  }
}

var thumb={
  tHeight:18,
  scroller:document.getElementById("tc"),
  bgPos:0,
  delta:18,
  //cHeight:document.getElementById("tc").clientHeight,
  set:function() {
    thumb.cHeight=thumb.scroller.clientHeight;
    thumb.range=thumb.cHeight-2*2-thumb.tHeight;
    thumb.delta=(thumb.range-2)/scroll.pMax;
  },
  setPosition:function(pos) {
    thumb.bgPos=2+(thumb.range-2)/scroll.pMax*pos;
if (thumb.bgPos>thumb.range) { debugger; }
//////////////////
/*
    let sy=pos/scroll.pMax*(thumb.cHeight-12);
    sy-=10;
    if (sy<2) sy=2;
    if (sy>thumb.range) sy=thumb.range;
*/
//////////////////
    thumb.scroller.style.backgroundPosition="2px "+thumb.bgPos+"px";
  },
  getTargetPos:function(offsetY) {
    // where is min(12 test?
    offsetY=Math.max(12,offsetY);
    return Math.round(scroll.pMax*(offsetY-12)/(thumb.cHeight-24));
  }
}
thumb.set();

var logging=true;	// publish @ false
function log(e) {
  if (logging) {
    console.log(Date().substring(16,25)+e);
  }
}
