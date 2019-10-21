"use strict";
var body=document.getElementsByTagName("body").item(0);
body.append((()=>{
  let ss=document.createElement("style");
  ss.type="text/css";
  ss.title="ss";
    return ss;
})());
var styleSheet=Array.from(document.styleSheets).find((ss)=>{ return ss.title=="ss"; });

//const CELLHEIGHT=32;

[
  "body { margin:0; font-family:sans-serif; font-size:8pt; background:#F6F6FF; }",
  "div.title { text-align:center; width:98%; position:absolute; top:0; left:0; font-weight:bold; font-size:20px; z-index:-1; color:navy; padding:8px; }",
  "#sent { display:flex; flex-wrap:wrap; padding:50px 16px 30px 16px; }",
  "#sent div { margin:4px 2px; font-size:18px; }",
  "#sent > div.words { border:1px solid transparent; white-space:nowrap; }",
  "#sent > div.optword { margin:4px; border:1px solid blue; border-radius:6px; white-space:nowrap; text-align:center; background:#EBEBFF; }",
  "div.optlist { display:grid; grid-template-columns:1; overflow:hidden; position:absolute; pointer-events:none; opacity:0; border:1px solid blue; border-radius:6px; font-size:18px; }",
  "div.optlist.unmask { pointer-events:auto; opacity:1; }",
  "div.optlist div { border:1px solid transparent; background:white; cursor:default; text-align:center; padding:0 8px; }",
  "div.optlist div:hover { background:#CCF; }",

  "#cal { display:grid; grid-template-columns:minmax(max-content,7%) 1fr 1fr 1fr 1fr 1fr 1fr 1fr 18px; grid-gap:1px; overflow:hidden; background:#D0D0DD; border:1px solid #D0D0DD; }",
  "#cal div.head { display:block; min-height:32px; font-size:12pt; font-weight:bold; text-align:center; padding:4px; z-index:2; border-bottom:1px solid #D0D0DD; background:#FEFEFE; }",
  //"#cal > div { display:grid; grid-template-columns:16% auto; min-height:32px; border-radius:2px; }",
  "#cal > div { display:grid; grid-template-columns:max-content auto; min-height:32px; border-radius:2px; padding-left:1px; }",
  "#cal div div { background:transparent; padding:2px; min-height:auto; }",
  "#cal div div:nth-child(1) { padding:1px; }",
  "#cal div div:nth-child(2) { text-align:center; font-size:15px; }",
  //"#cal > div:hover > div:nth-child(1) { color:#AA0000; font-weight:bold; }",
  "#cal > div:hover > div:nth-child(2) { font-size:20px; }",
  "#cal div.mon0 { background:hsl(0,80%,98%); }",
  "#cal div.mon1 { background:hsl(120,80%,98%); }",
  "#cal div.mon2 { background:hsl(240,80%,98%); }",
  "#cal div.monl { grid-column:1; display:block; text-align:center; font-size:12pt; font-weight:bold; margin:-1px 0; }",
  "#cal div.monc0 { color:hsl(0,20%,50%); }",
  "#cal div.monc1 { color:hsl(120,20%,50%); }",
  "#cal div.monc2 { color:hsl(240,20%,50%); }",
  "#cal div.sc { font-size:14px; color:#777; text-align:center; }",
  "#sd::before { content:'\u25B2'; }",
  "#su::before { content:'\u25BC'; }",
].forEach((rule)=>{ styleSheet.insertRule(rule,0); });

body.append((()=>{
  let t=document.createElement("div");
  t.className="title";
  t.textContent="Probability Calendar";
  return t;
})());

var words=(s,d)=>{
  let w=document.createElement("div");
  w.classList.add("words");
  if (d) w.style.display="none";
  w.textContent=s;
  w.setText=(tc)=>{ w.textContent=tc; }
  return w;
}

var options=(opts,sel,selCall)=>{
  let w=document.createElement("div");
  w.classList.add("optword");
  w.textContent=opts[sel];
  let s=document.createElement("div");
  s.classList.add("optlist");
  opts.forEach((txt,idx)=>{
    s.append((()=>{
      let b=document.createElement("div");
      b.textContent=txt;
      b.dataIdx=idx;
      return b;
    })());
  });
  body.append(s);
  w.ops=s;
  w.dataIdx=sel;
  s.onclick=(event)=>{
    if (w.dataIdx!=event.target.dataIdx) {
      w.textContent=event.target.textContent;
      w.setSelection(event.target.dataIdx);
      w.setOffset();
      s.classList.remove("unmask");
    }
  }

  w.setOffset=()=>{
    s.style.top=w.offsetTop-1-w.dataIdx*s.children[0].offsetHeight+"px";
    s.style.left=w.offsetLeft+"px";
  }

  w.setSelection=(idx)=>{
    w.dataIdx=idx;
    if (selCall instanceof Function) {
      selCall(w);
    }
  }
/*
  w.start=0;
  w.show=(ts)=>{
    if (!w.start) {
      w.start=ts;
    }
    let progress=ts-w.start;
    if (progress<100) {
      let frac=progress/100;
      s.style.opacity=frac;
      requestAnimationFrame(w.show);
    } else {
      s.classList.add("unmask");
      s.style.opacity=1;
      w.start=0;
    }
  }
*/
  return w;
}

var sentence=(()=>{ 
  let s=document.createElement("div");
  s.id="sent";
  body.append(s);
  s.append(
    words("Each date shows probability of"),
    options(
      //["one","two","three"],
      //["none","at least one","just one","more than one"],
      ["none","at least one","just one"],1,
      (a)=>{ 
	if (a.dataIdx==0) {
	  a.textContent="no";
	  //s.children[2].setText("occurrences");
	} else {
	  //s.children[2].setText("occurrence");
	}
        calcProbabilities();
      }
    ),
    words("occurrence by that date at an incidence of"),
    options(
      ["0.1","0.01","0.001"],1,
      (a)=>{ calcProbabilities(); }
    ),
    words("per day using"),
    options(
      ["probability formula","Monte Carlo method"],0,
      (a)=>{ 
	if (a.dataIdx==0) {
	  [6,7,8].forEach((i)=>{ s.children[i].style.display="none"; });
	} else {
	  [6,7,8].forEach((i)=>{ s.children[i].style.display="block"; });
	}
        calcProbabilities();
      }
    ),
    words("with",true),
    words("0",true),
    words("trials",true),
    words("for estimation.")
  );
  s.iCount=s.children[1];
  s.getProbability=()=>{ return parseFloat(s.children[3].textContent); }
  s.method=s.children[5];
  s.trials=s.children[7];
  return s;
})();

var hideOptions=()=>{
  let hopts=document.querySelectorAll(".optword");
  hopts.forEach((optPlace)=>{ 
    optPlace.ops.classList.remove("unmask");
  });
}

sentence.onmouseover=(event)=>{
  if (event.target.classList.contains("optword")) {
    event.target.setOffset();
    event.target.ops.classList.add("unmask");
  } else {
    hideOptions();
  }
}

const DAYMS=86400000;
// no leap
const MDAYS=[31,29,31,30,31,30,31,31,30,31,30,31];
var WEEKS=30;

let date=new Date();
var nDay=date.getDay();
var nTime=date.getTime();
var PROBABILITY=0.01;

var getCalc=(dt,prob,ic)=>{
  // dt=1,2,....
  if (ic==0) {
    var p=Math.pow(1-prob,dt).toFixed(3);
  } else if (ic==2) {
    // just one
    var p=(dt*prob*Math.pow(1-prob,dt-1)).toFixed(3);
    //var p=(dt*(dt-1)/2*Math.pow(PROBABILITY,2)*Math.pow(1-PROBABILITY,dt-2)).toFixed(3);
  } else {
    var p=(1-Math.pow(1-prob,dt)).toFixed(3);
  }
  if (p=="0.000") {
    return "<0.001";
  }
  if (p=="1.000") {
    return ">0.999";
  }
  return p;
}

var cal=(()=>{
  let grid=document.createElement("div");
  grid.id="cal";
  grid.draggable=true;
  //grid.style.height=CALHT+"px";
  ////grid.style.gridTemplateColumns="minmax(max-content,7%) auto auto auto auto auto auto 18px";
  //grid.style.gridTemplateColumns="minmax(max-content,7%) 1fr 1fr 1fr 1fr 1fr 1fr 1fr 18px";
  body.append(grid);
  grid.weeks=[];
  grid.append((()=>{
    let yd=document.createElement("div");
    yd.className="head";
    yd.style.gridColumn=1;
    yd.style.gridRow=1;
    grid.setYear=(yr)=>{
      yd.textContent=yr;
    }
    return yd;
  })());
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach((d,i)=>{
    grid.append(
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
  grid.append((()=>{ // top right corner
    let d=document.createElement("div");
    d.className="head";
    d.style.gridRow=1;
    d.style.width="18px";
    grid.tlCorner=d;
    return d;
  })());
  for (let w=0; w<7*WEEKS; w+=7) {  // date cells
    let week={ cells:[] };
    let prob=sentence.getProbability();
    for (let i=-nDay; i<7-nDay; i++) {
      let tm=nTime+(i+w)*DAYMS;
      date.setTime(tm);
      if (i==0 && w==0) {
	grid.setYear(date.getFullYear());
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
	m.classList.add("monl");
	m.classList.add(["mon0","mon1","mon2"][date.getMonth()%3]);
	if (date.getDate()>MDAYS[date.getMonth()]-7) {
	  m.style.marginBottom=0;
	}
	if (date.getDate()<7) {
	  m.style.marginTop=0;
	}
	grid.append(m);
	week.label=m;
      }
      grid.append((()=>{ 
	let cell=document.createElement("div");
	cell.append((()=>{ 
	  let d=document.createElement("div");
	  d.textContent=date.getDate().toString().padStart(2,"\xA0");
	  return d;
	})());
	cell.append((()=>{ 
	  let d=document.createElement("div");
	  if (w==0) { 
	    if (i<0) {
	    } else if (i==0) {
	      d.textContent="today";
              d.style.fontStyle="italic";
	    } else {
	      d.textContent=getCalc(i+w,prob);
	    }
	  } else {
	    d.textContent=getCalc(i+w,prob);
	  }
	  return d;
	})());
	if (w==0 && i<0) {
	  cell.style.color="#AAA";
	}
	cell.classList.add(["mon0","mon1","mon2"][date.getMonth()%3]);
	cell.dcount=i+w;
	week.cells.push(cell);
	return cell;
      })());
    }
    grid.weeks.push(week);
  }
  return grid;
})();

// scrollbar
cal.append((()=>{ 
  let d=document.createElement("div");
  d.style.gridRow="2/"+WEEKS;
  d.style.gridColumn=9;
  d.style.width="18px";
  d.style.padding="0";
  //d.style.height=(CALHT-32-8-1)+"px";  // 32ht 8pad 1bord
  //d.style.height=CALHT-document.querySelector("#cal > div:nth-child(9)").offsetHeight+"px";
  //d.style.display="grid";
  d.style.gridTemplateRows="24px auto 24px";
  d.style.gridTemplateColumns="auto";
  d.style.background="white";
  d.append((()=>{ 
    let s=document.createElement("div");
    s.id="sd";
    s.classList.add("sc");
    s.style.borderBottom="1px solid #D0D0DD";
    s.style.minHeight="initial";
    //s.textContent="\u25B2";
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
    s.style.borderTop="1px solid #D0D0DD";
    //s.textContent="\u25BC";
    return s;
  })());
  cal.scrollbar=d;
  d.resetHeight=(ht)=>{
    d.style.height=ht-cal.tlCorner.offsetHeight+"px";
  }
  return d;
})());

cal.onmousedown=(event)=>{
  scroll.source=event;
  if (event.target.id=="") {
    if (event.target.classList.contains("head")) {
      //event.stopPropagation();
      return;
    }
    cal.style.cursor="move";
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
  cal.style.cursor="move";
  scroll.drag=true;
*/
}

cal.onmousemove=(event)=>{
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

var DUR=200;
//var SENSITIVITY=32;

cal.onmouseup=()=>{
  scroll.reset();
  cal.style.cursor="auto";
}

cal.onmouseout=(event)=>{
  if (event.buttons==1) {
    if (!scroll.drag) {
      scroll.reset();
      cal.style.cursor="auto";
    }
  }
}

var scroll={
  position:0,  // 19 for 30 WEEKS, 11 visible @ 400px ht/32=12 + 1 header
  //pMax:WEEKS-CALHT/32-1,
  //pMax:Math.trunc(WEEKS-CALHT/32)+1,
  //pMax:Math.ceil(WEEKS-CALHT/33+1),  // 32 + 1 grid-gapi = 33
  pMax:0,
  drag:false,
  thumb:false,
  source:null,	// event
  dStart:0,
  dEnd:0,
  start:0,
  dur:DUR,
  setpMax:()=>{
    scroll.pMax=Math.ceil(WEEKS-cal.offsetHeight/33+1);  // 32 + 1 grid-gapi = 33
  },
  reset:()=>{
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
      let mt=-frac*32+"px";
      cal.weeks[scroll.position].label.style.marginTop=mt;
      cal.weeks[scroll.position].cells.forEach(function(el) {
        el.style.marginTop=mt;
      });
      thumb.setPosition(scroll.position+frac);
      requestAnimationFrame(scroll.animateDown);
    } else {
      cal.weeks[scroll.position].label.style.display='none';
      cal.weeks[scroll.position].cells.forEach(function(el) {
        el.style.display='none';
      });
      scroll.position++;
      thumb.setPosition(scroll.position);
      cal.setYear(new Date(cal.weeks[scroll.position].cells[0].dcount*DAYMS+nTime).getFullYear());
      scroll.start=0;
      scroll.dStart=0;
      scroll.dEnd=0;
      if (scroll.auto) {
	scroll.dur=0.02*DUR+0.7*scroll.dur;
	scroll.down();
      } else {
	scroll.dur=DUR;
      }
    }
  },
  animateUp:function(ts) {
    if (scroll.position==0) {
      return;
    }
    if (!scroll.start) {
      scroll.start=ts;
      cal.weeks[scroll.position-1].label.style.display="block";
      cal.weeks[scroll.position-1].cells.forEach(function(el) {
        el.style.display="grid";
      });
    }
    let progress=ts-scroll.start;
    if (progress<scroll.dur) {
      let frac=progress/scroll.dur;
      let mt=(frac-1)*32+"px";
      cal.weeks[scroll.position-1].label.style.marginTop=mt;
      cal.weeks[scroll.position-1].cells.forEach(function(el) {
        el.style.marginTop=mt;
      });
thumb.setPosition(scroll.position-frac);
      requestAnimationFrame(scroll.animateUp);
    } else {
      let mt="0";
      cal.weeks[scroll.position-1].label.style.marginTop=mt;
      cal.weeks[scroll.position-1].cells.forEach(function(el) {
        el.style.marginTop=mt;
      });
      scroll.position--;
      thumb.setPosition(scroll.position);
      //cal.setYear(new Date(cal.weeks[scroll.position].dcount[0]*DAYMS+nTime).getFullYear());
      cal.setYear(new Date(cal.weeks[scroll.position].cells[0].dcount*DAYMS+nTime).getFullYear());
      scroll.start=0;
      scroll.dStart=0;
      scroll.dEnd=0;
      if (scroll.auto) {
	scroll.dur=0.02*DUR+0.7*scroll.dur;
	scroll.up();
      } else {
	scroll.dur=DUR;
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
  //delta:18,
  //cHeight:document.getElementById("tc").clientHeight,
  set:function() {
    thumb.cHeight=thumb.scroller.clientHeight;
    thumb.range=thumb.cHeight-2*2-thumb.tHeight;
    //thumb.delta=(thumb.range-2)/scroll.pMax;
  },
  setPosition:function(pos) {
    thumb.bgPos=2+(thumb.range-2)/scroll.pMax*pos;
//if (thumb.bgPos>thumb.range) { debugger; }
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
//thumb.set();

var mcar={
  p:sentence.getProbability(),
  count:0,
  days:WEEKS*7-nDay-1,
  type:0,
  bkt:new Array(WEEKS*7-nDay).fill(0),
  bkt2:new Array(WEEKS*7-nDay).fill(0),

  runTrials:()=>{
    for (let t=0; t<50; t++) {
      let ct=0;
      for (let i=0; i<mcar.days; i++) {
	if (Math.random()<mcar.p) {
          ct++;
          if (ct==1) { // one or more
            mcar.bkt[i]++;
          }
          if (ct==2) { // two or more
            mcar.bkt2[i]++;
            break;
          }
        }
      }
      mcar.count++;
    }
  },
/*
  runTrialsO:()=>{
    for (let t=0; t<50; t++) {
      let ct=0;
      for (let i=0; i<mcar.days; i++) {
	if (Math.random()<mcar.p) {
          ct++;
          if (ct>1) {
            mcar.bkt2[i]++;
          }
          mcar.bkt[i]++;
        }
      }
      mcar.count++;
    }
  },
*/
  step:Infinity,
  calculate:(ts)=>{
    if (ts>mcar.step) {
      mcar.step+=1000;
      setMonteCarlo();
    }
    requestAnimationFrame(mcar.calculate);
  },
  reset:()=>{
    mcar.p=sentence.getProbability();
    mcar.step=Infinity;
    mcar.count=0;
    mcar.bkt.fill(0);
    mcar.bkt2.fill(0);
  }
}

var calcProbabilities=()=>{
  mcar.reset();
  if (sentence.method.dataIdx==1) {
    mcar.type=sentence.iCount.dataIdx;
    mcar.step=performance.now();
    requestAnimationFrame(mcar.calculate);
  } else {
    setCalc();
  }
}

var setCalc=()=>{
  let iCount=sentence.iCount.dataIdx;
  let prob=sentence.getProbability();
  cal.weeks.forEach((w)=>{
    w.cells.forEach((c,i)=>{
      if (c.dcount>0) {
        c.children[1].textContent=getCalc(c.dcount,prob,iCount);
      }
    });
  });
}

var setMonteCarlo=()=>{
  mcar.runTrials();
  let accum1=0;
  let accum2=0;
  cal.weeks.forEach((w)=>{
    w.cells.forEach((c,i)=>{
      if (c.dcount>0) {
        if (mcar.type==0) {
          c.children[1].textContent=(1-accum1/mcar.count).toFixed(3);
        } else if (mcar.type==1) {
          c.children[1].textContent=(accum1/mcar.count).toFixed(3);
        } else {
          c.children[1].textContent=((accum1-accum2)/mcar.count).toFixed(3);
        }
      }
      if (c.dcount>=0) {
        accum1+=mcar.bkt[c.dcount];
        accum2+=mcar.bkt2[c.dcount];
      }
    });
  });
  sentence.trials.setText(mcar.count);
}

var mObserver=new MutationObserver((nodes)=>{ 
  let oss=document.querySelectorAll(".optword");
  oss.forEach((optPlace)=>{ 
    optPlace.setOffset(); 
    optPlace.style.width=optPlace.ops.offsetWidth-2+"px";  // 2 border
    mObserver.disconnect();
  });
});
mObserver.observe(body,{ childList:true });

onresize=()=>{
  let ht=window.innerHeight-4-document.querySelector("#sent").offsetHeight;
  cal.style.height=ht+"px";
  cal.scrollbar.resetHeight(ht);
  scroll.setpMax();
  thumb.set();
}
onresize();
