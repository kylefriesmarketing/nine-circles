/* =====================================================================
   NINE CIRCLES — art.js
   Procedural SVG scene painter. No image assets; every scene is drawn.
   ART.paint(container, regionKey, seedString)
   ===================================================================== */
const ART = (() => {
const W=900, H=500;

/* seeded rng */
function rng(seedStr){ let h=1779033703^String(seedStr).length;
  for(let i=0;i<String(seedStr).length;i++){h=Math.imul(h^String(seedStr).charCodeAt(i),3432918353);h=h<<13|h>>>19;}
  return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);
    return ((h^=h>>>16)>>>0)/4294967296;};}

/* svg string helpers */
const G=(id,stops,x1=0,y1=0,x2=0,y2=1)=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">`+
  stops.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"${s[2]!==undefined?` stop-opacity="${s[2]}"`:''}/>`).join('')+`</linearGradient>`;
const RG=(id,stops)=>`<radialGradient id="${id}">`+
  stops.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"${s[2]!==undefined?` stop-opacity="${s[2]}"`:''}/>`).join('')+`</radialGradient>`;
const rect=(x,y,w,h,f,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const circ=(x,y,r,f,o)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}/>`;
const path=(d,f,o,extra)=>`<path d="${d}" fill="${f}"${o!==undefined?` opacity="${o}"`:''}${extra||''}/>`;

/* two travellers: pilgrim (small) + guide (tall, laureled) */
function figures(x,y,s=1,col='#050403',solo=false){
  let out=`<g transform="translate(${x},${y}) scale(${s})">`;
  out+=path(`M0,0 c-2,-14 -1,-26 2,-34 c1,-6 6,-9 9,-6 c4,3 4,9 3,14 c-1,9 -2,17 -1,26 z`,col); // pilgrim body
  out+=circ(8,-44,5.5,col);
  if(!solo){
    out+=path(`M34,2 c-3,-20 -2,-38 3,-50 c2,-7 9,-10 12,-5 c3,5 2,12 1,19 c-2,13 -2,24 -1,36 z`,col); // guide robed
    out+=circ(44,-60,6,col);
    out+=path(`M37,-64 q7,-5 14,0 q-7,-3 -14,0 z`,col); // laurel hint
  }
  return out+`</g>`;
}
function fog(y,h,c,op,dur=26,amp=40){
  return `<g opacity="${op}"><rect x="-100" y="${y}" width="${W+200}" height="${h}" fill="${c}">`+
    `</rect><animateTransform attributeName="transform" type="translate" values="0,0;${amp},0;0,0" dur="${dur}s" repeatCount="indefinite"/></g>`;
}
function stars(r,n,maxY,c='#e8e2d2'){ let s='';
  for(let i=0;i<n;i++){ const x=r()*W, y=r()*maxY, rad=r()*1.4+.3;
    s+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="${c}" opacity="${.3+r()*.7}">`+
       (r()<.3?`<animate attributeName="opacity" values="1;.2;1" dur="${3+r()*5}s" repeatCount="indefinite"/>`:'')+`</circle>`;}
  return s;}
function tree(x,base,h,r,col='#070605'){
  let d=`M${x},${base} L${x-3-h/40},${base-h}`;
  let s=`<path d="${d}" stroke="${col}" stroke-width="${4+h/28}" fill="none"/>`;
  for(let i=0;i<4;i++){ const ty=base-h*(0.35+r()*0.55), len=18+r()*30, a=(r()<.5?-1:1);
    s+=`<path d="M${x-(base-ty)/40*3},${ty} q${a*len*.6},${-len*.35} ${a*len},${-len*.15}" stroke="${col}" stroke-width="2.5" fill="none"/>`;}
  return s;}
function crowd(r,y,n,c,size=3,spread=W){ let s='';
  for(let i=0;i<n;i++){ const x=r()*spread+(W-spread)/2, yy=y+r()*22-11, h=size+r()*size;
    s+=`<ellipse cx="${x}" cy="${yy}" rx="${h*.42}" ry="${h}" fill="${c}" opacity="${.5+r()*.5}"/>`;}
  return s;}
function flamesRow(r,y,n,spread=W){ let s='';
  for(let i=0;i<n;i++){ const x=r()*spread+(W-spread)/2, h=8+r()*16, yy=y+r()*14-7;
    s+=`<path d="M${x},${yy} q${-h*.3},${-h*.6} 0,${-h} q${h*.3},${h*.4} 0,${h} z" fill="#d96b2b" opacity="${.5+r()*.5}">`+
       `<animate attributeName="opacity" values="${.4+r()*.3};${.8+r()*.2};${.4+r()*.3}" dur="${1.2+r()*2}s" repeatCount="indefinite"/></path>`;}
  return s;}
function rain(r,c='#7d8894',n=70,ang=14){ let s='<g opacity=".55">';
  for(let i=0;i<n;i++){ const x=r()*W,y=r()*H,l=8+r()*14;
    s+=`<line x1="${x}" y1="${y}" x2="${x-ang*l/14}" y2="${y+l}" stroke="${c}" stroke-width="1" opacity="${.25+r()*.5}"/>`;}
  return s+`<animateTransform attributeName="transform" type="translate" values="0,-40;0,40" dur="1.1s" repeatCount="indefinite"/></g>`;}

/* ------------------------------------------------------------------ */
const P = {

title(r){ return G('t1',[[0,'#040404'],[.62,'#120c08'],[1,'#26140a']])+rect(0,0,W,H,'url(#t1)')
  +stars(r,60,300)
  +[220,180,142,108,78,52,32,17,7].map((rad,i)=>`<circle cx="450" cy="330" r="${rad}" fill="none" stroke="#c9a35c" stroke-width="${i<3?1:0.7}" opacity="${.14+i*.055}"/>`).join('')
  +circ(450,330,3,'#c9a35c',.9)
  +fog(300,200,'#000',.45,30)
  +Array.from({length:14},(_,i)=>tree(30+i*68+r()*30,H+10,120+r()*160,r)).join('')
  +figures(430,470,1.15);},

darkwood(r){ return G('dw',[[0,'#0a0d10'],[.5,'#0b0a08'],[1,'#060504']])+rect(0,0,W,H,'url(#dw)')
  +circ(680,90,46,'#d8cfc0',.06)+circ(680,90,26,'#d8cfc0',.09)
  +Array.from({length:22},(_,i)=>tree(i*44+r()*26,H+8,170+r()*260,r)).join('')
  +fog(330,180,'#11131a',.5,24)+fog(200,120,'#0d0f14',.35,34,-30)
  +figures(400,472,1.1);},

gate(r){ const gl='#3d2f18';
  return G('gt',[[0,'#060608'],[.6,'#0d0a08'],[1,'#181008']])+rect(0,0,W,H,'url(#gt)')
  +path(`M180,500 L180,140 Q450,40 720,140 L720,500 L640,500 L640,190 Q450,110 260,190 L260,500 Z`,'#0b0908')
  +path(`M260,500 L260,190 Q450,110 640,190 L640,500 Z`,'#000')
  +`<text x="450" y="165" text-anchor="middle" font-family="Georgia" font-size="15" fill="#8a6f3e" opacity=".85" letter-spacing="3">PER ME SI VA NELLA CITTÀ DOLENTE</text>`
  +`<text x="450" y="188" text-anchor="middle" font-family="Georgia" font-size="11" fill="${gl}" letter-spacing="4">LASCIATE OGNE SPERANZA VOI CH’INTRATE</text>`
  +fog(380,140,'#1a120a',.5,20)+flamesRow(r,470,8,560)
  +figures(370,478,1.05);},

vestibule(r){ return G('vb',[[0,'#17161a'],[1,'#0a0908']])+rect(0,0,W,H,'url(#vb)')
  +`<g><path d="M120,120 q40,-30 80,0 l-14,44 q-28,-18 -54,0 z" fill="#3a3630" opacity=".8">`+
   `<animateTransform attributeName="transform" type="rotate" values="-6 160 130;7 160 130;-6 160 130" dur="3.5s" repeatCount="indefinite"/></path>`+
   `<line x1="160" y1="140" x2="160" y2="240" stroke="#2c2925" stroke-width="3"/>`+
   `<animateTransform attributeName="transform" type="translate" values="0,0;620,26;0,0" dur="17s" repeatCount="indefinite"/></g>`
  +crowd(r,330,90,'#211f1c',5)+crowd(r,380,70,'#191715',7)
  +Array.from({length:16},()=>circ(r()*W,150+r()*160,1.2,'#6f6a52',.7)).join('')
  +fog(300,200,'#121110',.55,22)+figures(700,470,1);},

acheron(r){ return G('ac',[[0,'#0b0d12'],[.55,'#131017'],[1,'#050507']])+rect(0,0,W,H,'url(#ac)')
  +rect(0,320,W,180,'#0d1017')+`<g opacity=".5">`+Array.from({length:9},(_,i)=>
    `<path d="M0,${340+i*17} q225,${6+r()*8} 450,0 t450,0" stroke="#232b3b" fill="none" stroke-width="1.3"/>`).join('')+`</g>`
  +path(`M540,352 q80,-24 170,-8 l14,26 q-100,-14 -178,6 z`,'#08070a')
  +`<path d="M690,346 l0,-70 M690,276 l-32,54" stroke="#08070a" stroke-width="6" fill="none"/>`
  +circ(688,268,9,'#08070a')+circ(683,271,2.6,'#d96b2b')+circ(694,271,2.6,'#d96b2b')
  +crowd(r,346,60,'#15131a',5,700)
  +Array.from({length:10},()=>{const x=r()*500+80,y=180+r()*120;
    return `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="5" fill="#3c3a42" opacity=".8"><animate attributeName="cy" values="${y};${y+150}" dur="${5+r()*6}s" repeatCount="indefinite"/></ellipse>`;}).join('')
  +fog(300,110,'#0e1016',.6,26)+figures(240,470,1.05);},

limbo(r){ return G('lb',[[0,'#0c0f0c'],[.45,'#171d14'],[1,'#0d120c']])+rect(0,0,W,H,'url(#lb)')
  +RG('ld',[[0,'#e8e2c8',.32],[.55,'#c8c39f',.1],[1,'#000',0]])+circ(450,190,240,'url(#ld)')
  +path(`M110,500 L110,240 L130,240 L130,500 Z M310,500 L310,210 L330,210 L330,500 Z M590,500 L590,210 L610,210 L610,500 Z M780,500 L780,240 L800,240 L800,500 Z`,'#0a0d09')
  +rect(0,430,W,70,'#0f150d')+crowd(r,420,26,'#131711',6)
  +Array.from({length:5},(_,i)=>figures(180+i*120+r()*40,438,.7,'#0b0e0a',true)).join('')
  +fog(360,140,'#121a10',.4,30)+figures(430,470,1.05);},

minos(r){ return G('mn',[[0,'#0a0708'],[1,'#170c0c']])+rect(0,0,W,H,'url(#mn)')
  +path(`M450,470 q-190,-6 -210,-140 q-8,-95 90,-120 q120,-28 170,40 q40,58 -10,96 q-42,32 -84,6 q-30,-20 -12,-52`,
    'none',1,` stroke="#1f1214" stroke-width="46" stroke-linecap="round"`)
  +path(`M450,470 q-190,-6 -210,-140 q-8,-95 90,-120 q120,-28 170,40 q40,58 -10,96 q-42,32 -84,6 q-30,-20 -12,-52`,
    'none',1,` stroke="#2b191b" stroke-width="30" stroke-linecap="round"`)
  +circ(330,180,26,'#251316')+circ(322,174,5,'#d96b2b')+circ(342,174,5,'#d96b2b')
  +flamesRow(r,480,10,700)+crowd(r,468,40,'#120d0e',4)
  +fog(370,130,'#140d0e',.5,18)+figures(640,478,1);},

lust(r){ let sw='';
  for(let i=0;i<3;i++){ const dur=9+i*3;
    sw+=`<g opacity="${.75-i*.18}"><path d="M-80,${140+i*60} q220,${-70-i*22} 460,0 t520,0" stroke="#2b2733" stroke-width="${30-i*7}" fill="none" stroke-linecap="round"/>`+
      `<animateTransform attributeName="transform" type="translate" values="-60,0;60,10;-60,0" dur="${dur}s" repeatCount="indefinite"/></g>`;}
  let birds='';
  for(let i=0;i<46;i++){ const x=r()*W,y=60+r()*230;
    birds+=`<path d="M${x},${y} q4,-4 8,0 q-4,-2 -8,0" fill="#141218" opacity="${.5+r()*.5}">`+
      `<animateTransform attributeName="transform" type="translate" values="0,0;${-30-r()*60},${(r()-.5)*40};0,0" dur="${4+r()*6}s" repeatCount="indefinite"/></path>`;}
  return G('ls',[[0,'#141019'],[.6,'#0e0b12'],[1,'#070609']])+rect(0,0,W,H,'url(#ls)')+sw+birds
  +`<g><path d="M470,150 q5,-6 10,0 q-5,-3 -10,0 z M486,152 q5,-6 10,0 q-5,-3 -10,0 z" fill="#241f2b"/>`+
   `<animateTransform attributeName="transform" type="translate" values="0,0;-40,24;0,0" dur="7s" repeatCount="indefinite"/></g>`
  +rect(0,440,W,60,'#0a090c')+fog(330,170,'#100d14',.5,16,70)+figures(300,478,1.05);},

gluttony(r){ return G('gl',[[0,'#101314'],[1,'#0a0c0a']])+rect(0,0,W,H,'url(#gl)')
  +rect(0,400,W,100,'#11130f')
  +Array.from({length:12},()=>{const x=r()*W,y=408+r()*70;
    return `<ellipse cx="${x}" cy="${y}" rx="${16+r()*22}" ry="${5+r()*4}" fill="#0c0e0a" opacity=".9"/>`;}).join('')
  +path(`M600,420 q-16,-90 60,-104 q30,-40 70,-16 q16,-30 48,-18 q40,12 30,52 q26,10 20,44 q-8,44 -78,46 q-90,4 -150,-4 z`,'#0b0d0b')
  +circ(672,318,7,'#0b0d0b')+circ(668,314,2,'#c4552a')+circ(700,306,2,'#c4552a')+circ(731,300,2,'#c4552a')
  +rain(r)+fog(360,140,'#0d100d',.45,20)+figures(230,462,1.05);},

greed(r){ let stones='';
  for(let i=0;i<9;i++){ const x=60+i*95+r()*30, rad=16+r()*20, dir=i%2?1:-1;
    stones+=`<g><circle cx="${x}" cy="${396-rad*.4}" r="${rad}" fill="#1c1812"/>`+
      `<ellipse cx="${x+dir*rad*.9}" cy="${398}" rx="5" ry="11" fill="#141109"/>`+
      `<animateTransform attributeName="transform" type="translate" values="0,0;${dir*46},0;0,0" dur="${7+r()*4}s" repeatCount="indefinite"/></g>`;}
  return G('gr',[[0,'#0d0b08'],[1,'#151009']])+rect(0,0,W,H,'url(#gr)')
  +rect(0,400,W,100,'#0f0c07')
  +`<circle cx="450" cy="120" r="60" fill="none" stroke="#211a0e" stroke-width="10" opacity=".7"/>`
  +stones+crowd(r,430,40,'#0d0b07',5)
  +fog(330,170,'#0f0d09',.5,24)+figures(450,472,1.02);},

styx(r){ let bub='';
  for(let i=0;i<26;i++){ const x=r()*W,y=350+r()*120;
    bub+=`<circle cx="${x}" cy="${y}" r="${1.5+r()*3}" fill="#39423a" opacity=".8">`+
      `<animate attributeName="cy" values="${y};${y-26}" dur="${2+r()*3}s" repeatCount="indefinite"/>`+
      `<animate attributeName="opacity" values=".8;0" dur="${2+r()*3}s" repeatCount="indefinite"/></circle>`;}
  return G('sx',[[0,'#0b0d0a'],[.5,'#101409'],[1,'#0a0d07']])+rect(0,0,W,H,'url(#sx)')
  +rect(0,330,W,170,'#121608')+bub
  +crowd(r,320,36,'#10130a',6)
  +`<path d="M780,330 l0,-140 l26,0 l0,140 z" fill="#0b0d07"/>`
  +`<path d="M786,190 q7,-16 14,0 z" fill="#d96b2b"><animate attributeName="opacity" values=".6;1;.6" dur="1.6s" repeatCount="indefinite"/></path>`
  +path(`M330,352 q70,-22 150,-6 l12,22 q-88,-12 -156,6 z`,'#0a0b07')
  +fog(300,140,'#0e120a',.55,18)+figures(370,346,.92);},

dis(r){ let towers='';
  for(let i=0;i<7;i++){ const x=60+i*125+r()*30,h=140+r()*130,w=46+r()*26;
    towers+=rect(x,H-160-h,w,h,'#170a08')+path(`M${x-4},${H-160-h} q${w/2+4},-26 ${w+8},0 z`,'#1f0c08')
      +circ(x+w/2,H-150-h,3,'#d96b2b',.9);}
  return G('ds',[[0,'#0d0508'],[.6,'#1c0a0a'],[1,'#240d08']])+rect(0,0,W,H,'url(#ds)')
  +RG('dg',[[0,'#c4552a',.25],[1,'#000',0]])+circ(450,330,300,'url(#dg)')
  +towers+rect(0,H-170,W,170,'#0e0606')
  +Array.from({length:24},()=>circ(r()*W,H-300+r()*120,1.4,'#e0603a',.6)).join('')
  +fog(300,200,'#130708',.5,22)+figures(420,478,1.02);},

heresy(r){ let tombs='';
  for(let i=0;i<8;i++){ const x=40+i*110+r()*24,y=350+((i%2)*46),w=84,h=40;
    tombs+=rect(x,y,w,h,'#151009')+rect(x-5,y-9,w+10,10,'#1c150c')
      +`<path d="M${x+8},${y} q${w/2-8},-20 ${w-16},0 z" fill="#d96b2b" opacity=".5">`+
      `<animate attributeName="opacity" values=".3;.65;.3" dur="${1.6+r()*1.8}s" repeatCount="indefinite"/></path>`;}
  return G('hs',[[0,'#0b0708'],[1,'#170d07']])+rect(0,0,W,H,'url(#hs)')
  +rect(0,380,W,120,'#0d0908')+tombs
  +path(`M470,342 c-2,-26 0,-46 6,-58 c3,-8 12,-10 16,-3 c5,8 3,18 2,28 c-2,12 -2,22 -1,33 z`,'#080505')
  +circ(482,272,8,'#080505')
  +fog(320,180,'#120b08',.45,26)+figures(250,470,1);},

wood(r){ let th='';
  for(let i=0;i<15;i++){ const x=i*62+r()*30,h=150+r()*230;
    th+=`<path d="M${x},${H+10} q${-14-r()*20},${-h*.6} ${6+r()*16},${-h}" stroke="#0d0806" stroke-width="${5+h/40}" fill="none"/>`;
    for(let b=0;b<3;b++){ const ty=H-h*(0.4+r()*0.5),len=20+r()*26,a=r()<.5?-1:1;
      th+=`<path d="M${x},${ty} q${a*len*.7},${-len*.2} ${a*len},${len*.25}" stroke="#0d0806" stroke-width="2.5" fill="none"/>`
        +circ(x+a*len,ty+len*.25,2,'#3a1210',.9);}}
  let harpy=`<g transform="translate(600,150)"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#0e0907"/>`+
    `<circle cx="-14" cy="-6" r="6" fill="#0e0907"/><path d="M6,-4 q14,-14 26,-6 q-12,-2 -20,8 z" fill="#0e0907"/>`+
    `<animateTransform attributeName="transform" type="translate" values="600,150;560,170;600,150" dur="6s" repeatCount="indefinite"/></g>`;
  return G('wd',[[0,'#0a0806'],[1,'#0d0704']])+rect(0,0,W,H,'url(#wd)')+th+harpy
  +fog(340,160,'#0e0a06',.5,24)+figures(330,478,1.02);},

sand(r){ let fire='';
  for(let i=0;i<40;i++){ const x=r()*W,y=r()*H;
    fire+=`<path d="M${x},${y} q-2,-5 0,-8 q2,3 0,8 z" fill="#e0703a" opacity="${.5+r()*.5}">`+
      `<animateTransform attributeName="transform" type="translate" values="0,-60;0,${H}" dur="${5+r()*6}s" repeatCount="indefinite"/></path>`;}
  return G('sn',[[0,'#160b06'],[.6,'#241107'],[1,'#2b1607']])+rect(0,0,W,H,'url(#sn)')
  +rect(0,390,W,110,'#231205')
  +Array.from({length:8},()=>`<ellipse cx="${r()*W}" cy="${400+r()*70}" rx="${10+r()*14}" ry="5" fill="#180c04"/>`).join('')
  +fire+fog(340,160,'#1d0f06',.4,20)+figures(300,462,1.02);},

geryon(r){ return G('gy',[[0,'#0a0a10'],[.55,'#0d0a0d'],[1,'#050406']])+rect(0,0,W,H,'url(#gy)')
  +path(`M0,270 L340,255 L360,500 L0,500 Z`,'#0d0b09')
  +stars(r,26,180,'#8a8474')
  +`<g><path d="M480,300 q60,-46 150,-30 q80,14 96,52 q-40,-12 -96,-16 q-90,-6 -150,-6 z" fill="#181119"/>`+
   `<path d="M710,320 q80,10 100,44 l-36,4 q-40,-30 -84,-34 z" fill="#141019"/>`+
   `<circle cx="512" cy="288" r="14" fill="#c9b8a0"/><circle cx="508" cy="285" r="2" fill="#0a0a10"/><circle cx="517" cy="285" r="2" fill="#0a0a10"/>`+
   `<path d="M504,293 q8,5 16,0" stroke="#0a0a10" stroke-width="1.4" fill="none"/>`+
   `<animateTransform attributeName="transform" type="translate" values="0,0;-16,18;0,0" dur="8s" repeatCount="indefinite"/></g>`
  +fog(360,140,'#0b0a0e',.55,22)+figures(250,268,.95);},

malebolge(r){ let arcs='';
  for(let i=0;i<6;i++){ const y=210+i*52;
    arcs+=`<path d="M-40,${y} q490,${70+i*8} 980,0" stroke="#191008" stroke-width="${22-i*2}" fill="none"/>`
      +`<path d="M-40,${y+8} q490,${70+i*8} 980,0" stroke="#0a0705" stroke-width="6" fill="none"/>`;}
  let imps='';
  for(let i=0;i<7;i++){ const x=120+i*110+r()*40,y=250+r()*140;
    imps+=`<path d="M${x},${y} l4,-10 l4,10 z M${x+1},${y-12} l3,-6 l3,6" fill="#160b06" stroke="#160b06"/>`;}
  return G('mb',[[0,'#0c0806'],[1,'#120a05']])+rect(0,0,W,H,'url(#mb)')+arcs+imps
  +flamesRow(r,200,14,800)
  +path(`M180,470 q40,-90 90,-30 q30,40 -20,50 z`,'#100a05')
  +fog(340,160,'#0f0a06',.5,18)+figures(560,470,1);},

ice(r){ let faces='';
  for(let i=0;i<10;i++){ const x=r()*W,y=400+r()*80;
    faces+=`<ellipse cx="${x}" cy="${y}" rx="9" ry="12" fill="#1b2830" opacity=".8"/>`
      +circ(x-3,y-3,1.3,'#0c141a')+circ(x+3,y-3,1.3,'#0c141a');}
  return G('ic',[[0,'#0a1016'],[.55,'#101c24'],[1,'#16262e']])+rect(0,0,W,H,'url(#ic)')
  +rect(0,380,W,120,'#15242c')
  +Array.from({length:12},()=>`<path d="M${r()*W},${380+r()*110} l${20+r()*60},${(r()-.5)*10}" stroke="#23404c" stroke-width="1"/>`).join('')
  +faces+stars(r,14,140,'#5c6d78')
  +fog(300,160,'#0e1a20',.5,30,-60)
  +`<g opacity=".16"><path d="M430,80 q-90,60 -60,200 M470,80 q90,60 60,200" stroke="#060a0e" stroke-width="40" fill="none">`+
   `<animateTransform attributeName="transform" type="rotate" values="-3 450 200;3 450 200;-3 450 200" dur="5s" repeatCount="indefinite"/></path></g>`
  +figures(300,472,1.02);},

lucifer(r){ return G('lc',[[0,'#05070a'],[.5,'#0a0e14'],[1,'#111c24']])+rect(0,0,W,H,'url(#lc)')
  +`<g opacity=".9"><path d="M450,470 c-110,-10 -150,-120 -130,-230 c12,-70 60,-120 130,-120 c70,0 118,50 130,120 c20,110 -20,220 -130,230 z" fill="#060809"/>`+
   `<circle cx="450" cy="120" r="52" fill="#060809"/>`+
   `<circle cx="398" cy="112" r="30" fill="#0a0708"/><circle cx="502" cy="112" r="30" fill="#0c0a06"/>`+
   `<circle cx="432" cy="112" r="6" fill="#c4552a" opacity=".8"/><circle cx="468" cy="112" r="6" fill="#c4552a" opacity=".8"/>`+
   `<circle cx="390" cy="106" r="4" fill="#8a4a3a" opacity=".7"/><circle cx="510" cy="106" r="4" fill="#8a7a4a" opacity=".7"/>`+
   `<path d="M420,70 l-12,-34 l22,22 z M480,70 l12,-34 l-22,22 z" fill="#060809"/></g>`
  +`<g opacity=".55"><path d="M320,180 q-160,-30 -220,60 q120,-20 200,30 z" fill="#04060a">`+
   `<animateTransform attributeName="transform" type="rotate" values="0 320 200;-10 320 200;0 320 200" dur="3.2s" repeatCount="indefinite"/></path>`+
   `<path d="M580,180 q160,-30 220,60 q-120,-20 -200,30 z" fill="#04060a">`+
   `<animateTransform attributeName="transform" type="rotate" values="0 580 200;10 580 200;0 580 200" dur="3.2s" repeatCount="indefinite"/></path></g>`
  +rect(0,440,W,60,'#152430')
  +Array.from({length:30},()=>circ(r()*W,r()*430,1,'#9fb8c8',.35)).join('')
  +figures(240,470,.95);},

stars(r){ return G('st',[[0,'#04060e'],[.7,'#0a1020'],[1,'#111a2c']])+rect(0,0,W,H,'url(#st)')
  +stars(r,130,380)
  +RG('moon',[[0,'#e8e2d2',.9],[.7,'#e8e2d2',.25],[1,'#000',0]])+circ(700,110,40,'url(#moon)')
  +path(`M0,500 L0,420 Q200,380 420,410 T900,400 L900,500 Z`,'#05070a')
  +path(`M540,410 L640,300 L740,406 Z`,'#070a10')
  +figures(320,438,1.05,'#03040a');},

purgatorio(r){ return G('pg',[[0,'#1a2a44'],[.45,'#3a4a6a'],[.75,'#8a6a58'],[1,'#c08a5a']])+rect(0,0,W,H,'url(#pg)')
  +stars(r,30,140,'#e8e2d2')
  +RG('dawn',[[0,'#e8c890',.8],[1,'#e8c890',0]])+circ(690,330,150,'url(#dawn)')
  +path(`M380,500 L560,60 L740,500 Z`,'#243248',.95)
  +path(`M470,500 L560,220 L650,500 Z`,'#2c3c54',.9)
  +Array.from({length:5},(_,i)=>`<path d="M${505+i*8},${420-i*64} q55,${-14} ${110-i*16},0" stroke="#c8a878" stroke-width="2" fill="none" opacity=".5"/>`).join('')
  +rect(0,440,W,60,'#1c2838')
  +`<path d="M0,452 q225,10 450,0 t450,0 L900,500 L0,500 Z" fill="#31465e" opacity=".8"/>`
  +figures(200,448,1.05,'#141c2c',true);},

beatrice(r){ return G('bt',[[0,'#2a3a5c'],[.5,'#54628a'],[1,'#a88a68']])+rect(0,0,W,H,'url(#bt)')
  +RG('halo',[[0,'#f4ecd4',.95],[.5,'#f0d8a0',.4],[1,'#fff',0]])
  +circ(450,210,190,'url(#halo)')
  +`<g><path d="M450,320 c-4,-40 -2,-72 6,-92 c4,-12 18,-14 24,-2 c6,12 2,28 0,44 c-3,20 -3,34 -2,50 z" fill="#f4ecd4" opacity=".9" transform="translate(-14,-40)"/>`+
   `<circle cx="450" cy="168" r="12" fill="#f4ecd4" opacity=".95"/>`+
   `<animateTransform attributeName="transform" type="translate" values="0,0;0,-8;0,0" dur="5s" repeatCount="indefinite"/></g>`
  +Array.from({length:24},()=>{const x=r()*W,y=r()*300;
    return `<circle cx="${x}" cy="${y}" r="1.5" fill="#fff" opacity=".7"><animate attributeName="opacity" values=".7;.15;.7" dur="${2+r()*4}s" repeatCount="indefinite"/></circle>`;}).join('')
  +rect(0,430,W,70,'#3a3450',.9)
  +figures(300,462,1.05,'#221c30',true);},
/* ================= ACT II painters — the Mountain ================= */
pgate(r){ return G('pg2',[[0,'#2a3a54'],[.6,'#54628a'],[1,'#8a7a88']])+rect(0,0,W,H,'url(#pg2)')
  +stars(r,20,150,'#dfe8f2')
  +path(`M330,500 L330,240 Q450,150 570,240 L570,500 Z`,'#e8e2d8',.92)
  +path(`M380,500 L380,270 Q450,210 520,270 L520,500 Z`,'#12141c')
  +rect(300,455,300,15,'#f4f0e8')+rect(315,425,270,15,'#1a1616')+rect(330,395,240,15,'#7e2020')
  +`<g><circle cx="450" cy="330" r="26" fill="#f4ecd4" opacity=".95"/>
    <path d="M450,304 q-20,26 0,52 q20,-26 0,-52" fill="#fff" opacity=".9"/>
    <path d="M424,330 h52" stroke="#c9a35c" stroke-width="2"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-6;0,0" dur="4s" repeatCount="indefinite"/></g>`
  +fog(360,140,'#3a4258',.4,26)+figures(360,478,1.05,'#1a1c28');},

t_pride(r){ return G('tp',[[0,'#c8c2b4'],[.55,'#a8a294'],[1,'#7a7468']])+rect(0,0,W,H,'url(#tp)')
  +Array.from({length:5},(_,i)=>{const x=60+i*180;
    return `<rect x="${x}" y="120" width="120" height="200" fill="#b8b2a2" stroke="#8a8478"/>`
      +`<path d="M${x+18},${170+r()*60} q30,-26 60,0 q-30,${14+r()*10} -60,0 z" fill="#948e80"/>`;}).join('')
  +Array.from({length:7},(_,i)=>{const x=90+i*115, h=26+r()*14;
    return `<path d="M${x},420 q-14,-${h*.5} 0,-${h} q6,${h*.3} 12,0 q14,${h*.5} 0,${h} q-6,-4 -12,0 z" fill="#5a5448"/>`
      +`<ellipse cx="${x+6}" cy="${400-h}" rx="${16+r()*8}" ry="${9+r()*4}" fill="#6a6458"/>`;}).join('')
  +rect(0,430,W,70,'#8a8478')
  +fog(330,170,'#b8b2a4',.35,30)+figures(430,470,1,'#3a362e');},

t_envy(r){ return G('te',[[0,'#4a5462'],[.6,'#3a4450'],[1,'#2a3038']])+rect(0,0,W,H,'url(#te)')
  +rect(0,400,W,100,'#333a44')
  +Array.from({length:12},(_,i)=>{const x=55+i*72;
    return `<path d="M${x},430 q-3,-42 10,-56 q10,-8 18,2 q8,12 4,54 z" fill="#4e5866"/>`
      +circ(x+13,362,9,'#5a6472')
      +`<path d="M${x+7},360 h12 M${x+7},364 h12" stroke="#2a3038" stroke-width="1.4"/>`;}).join('')
  +`<circle cx="720" cy="110" r="42" fill="#8a94a2" opacity=".25"/>`
  +fog(300,200,'#3a4450',.5,24)+figures(250,472,1,'#181c22');},

t_wrath(r){ let smoke='';
  for(let i=0;i<9;i++){ const x=r()*W, y=120+r()*300, rad=70+r()*90;
    smoke+=`<circle cx="${x}" cy="${y}" r="${rad}" fill="#0c0a0c" opacity="${.5+r()*.35}">`
      +`<animate attributeName="cx" values="${x};${x+(r()-.5)*90};${x}" dur="${9+r()*8}s" repeatCount="indefinite"/></circle>`;}
  return G('tw',[[0,'#1a161c'],[1,'#0a080c']])+rect(0,0,W,H,'url(#tw)')+smoke
  +Array.from({length:5},()=>circ(r()*W,200+r()*200,2,'#c9a35c',.35)).join('')
  +fog(0,H,'#141018',.35,14,80)+figures(420,478,1.02,'#060407');},

t_sloth(r){ let runners='';
  for(let i=0;i<11;i++){ const x=r()*W, y=395+r()*40, s2=.5+r()*.4;
    runners+=`<g transform="translate(${x},${y}) scale(${s2})" opacity="${.6+r()*.4}">
      <path d="M0,0 q4,-16 12,-20 q8,-3 10,4 q2,8 -6,10 q10,2 12,14 l-6,2 q-4,-9 -12,-8 q-8,2 -10,-2 z" fill="#1c1826"/>
      <circle cx="16" cy="-24" r="5" fill="#1c1826"/></g>`;}
  return G('ts',[[0,'#141c34'],[.5,'#1c2440'],[1,'#242038']])+rect(0,0,W,H,'url(#ts)')
  +stars(r,40,240,'#aeb8d2')
  +`<circle cx="200" cy="110" r="34" fill="#dfe8f2" opacity=".9"/><circle cx="188" cy="102" r="30" fill="#141c34"/>`
  +rect(0,430,W,70,'#1a1628')+runners
  +fog(340,160,'#141628',.4,20,60)+figures(700,472,1,'#0a0812');},

t_greed(r){ return G('tg',[[0,'#5a4a3e'],[.6,'#4a3c32'],[1,'#332a22']])+rect(0,0,W,H,'url(#tg)')
  +rect(0,380,W,120,'#403428')
  +Array.from({length:13},(_,i)=>{const x=40+i*66+r()*16;
    return `<path d="M${x},408 q10,-9 22,-6 q14,3 16,10 q-18,5 -38,-4 z" fill="#2a221a"/>`;}).join('')
  +`<circle cx="450" cy="140" r="52" fill="#8a7a5a" opacity=".22"/>`
  +fog(330,170,'#443628',.45,28)+figures(300,468,1,'#1a140e');},

t_gluttony(r){ return G('t6g',[[0,'#3a4436'],[.55,'#2e3a2c'],[1,'#222c20']])+rect(0,0,W,H,'url(#t6g)')
  +rect(0,420,W,80,'#2a3426')
  +`<path d="M450,420 q-30,-90 -12,-160 q-40,26 -70,10 q20,40 -8,58 q36,4 34,40 q26,-16 56,52 z" fill="#1a2418"/>
   <path d="M438,262 q60,-40 120,-6 q-36,10 -44,34 q-24,-20 -76,-28 z" fill="#243020"/>`
  +Array.from({length:9},()=>circ(380+r()*160,230+r()*120,5,'#d4b04a',.9)).join('')
  +Array.from({length:14},(_,i)=>`<line x1="${430+r()*60}" y1="${150+r()*60}" x2="${425+r()*60}" y2="${240+r()*80}" stroke="#8aa4b8" stroke-width="1" opacity=".5"/>`).join('')
  +Array.from({length:8},(_,i)=>{const x=70+i*100;
    return `<path d="M${x},468 q-2,-34 6,-44 q6,-6 10,2 q4,10 2,42 z" fill="#1e281c"/>`;}).join('')
  +fog(340,160,'#2a3626',.4,26)+figures(200,470,1,'#101808');},

t_lust(r){ let fire='';
  for(let i=0;i<16;i++){ const x=i*60+r()*30, h=120+r()*160;
    fire+=`<path d="M${x},430 q-${16+r()*14},-${h*.5} 0,-${h} q${16+r()*14},${h*.5} 0,${h} z" fill="${['#d96b2b','#c4552a','#e8923a'][i%3]}" opacity="${.5+r()*.4}">
      <animate attributeName="opacity" values="${.5+r()*.3};${.85};${.5+r()*.3}" dur="${1.2+r()*1.6}s" repeatCount="indefinite"/></path>`;}
  return G('t7l',[[0,'#2a1410'],[.5,'#3a1c10'],[1,'#1a0c08']])+rect(0,0,W,H,'url(#t7l)')
  +fire+rect(0,430,W,70,'#241209')
  +Array.from({length:4},(_,i)=>{const x=120+i*200;
    return `<path d="M${x},430 c-2,-28 0,-46 6,-56 c3,-7 11,-8 14,-1 c5,9 3,20 2,30 c-2,10 -2,18 -1,27 z" fill="#12080a" opacity=".85"/>`;}).join('')
  +fog(300,200,'#2a120c',.35,18,70)+figures(180,472,1,'#0c0506');},

pnight(r){ return G('pn',[[0,'#0a1020'],[.6,'#101a30'],[1,'#1a1c30']])+rect(0,0,W,H,'url(#pn)')
  +stars(r,90,340,'#dfe8f2')
  +`<circle cx="690" cy="120" r="38" fill="#e8eef6" opacity=".92"/><circle cx="676" cy="110" r="33" fill="#0c1424"/>`
  +path(`M0,500 L0,420 L140,360 L300,430 L460,340 L620,420 L780,350 L900,410 L900,500 Z`,'#141226')
  +path(`M330,420 L450,300 L570,420 Z`,'#1a1830',.9)
  +figures(430,438,.9,'#060810')
  +fog(360,140,'#0e1424',.4,32);},

eden(r){ return G('ed',[[0,'#7aa46a'],[.5,'#5a8a56'],[1,'#3a6440']])+rect(0,0,W,H,'url(#ed)')
  +RG('edsun',[[0,'#f8f0c8',.85],[1,'#f8f0c8',0]])+circ(650,110,150,'url(#edsun)')
  +Array.from({length:9},(_,i)=>{const x=i*110+r()*40,h=200+r()*180;
    return `<path d="M${x},${H} L${x},${H-h*.55}" stroke="#2a4430" stroke-width="${10+r()*8}"/>`
      +`<ellipse cx="${x}" cy="${H-h*.62}" rx="${50+r()*30}" ry="${34+r()*20}" fill="#3e7048" opacity=".9"/>`
      +`<ellipse cx="${x+20}" cy="${H-h*.75}" rx="${36+r()*20}" ry="${24+r()*12}" fill="#4e8858" opacity=".85"/>`;}).join('')
  +Array.from({length:26},()=>circ(r()*W,380+r()*110,2.2,['#e8d4e8','#f0e8b8','#d8ecf0'][Math.floor(r()*3)],.9)).join('')
  +`<path d="M0,470 q225,-14 450,0 t450,0 L900,500 L0,500 Z" fill="#4a90b8" opacity=".7"/>`
  +fog(300,160,'#6a9a66',.25,34)+figures(300,462,1,'#1c3020',true);},

pageant(r){ return G('pgt',[[0,'#e8d8b0'],[.5,'#d4b888'],[1,'#8a9a78']])+rect(0,0,W,H,'url(#pgt)')
  +Array.from({length:7},(_,i)=>{const x=170+i*95;
    return `<line x1="${x}" y1="90" x2="${x}" y2="330" stroke="${['#c44','#d80','#dd4','#4a4','#48c','#84c','#c4c'][i]}" stroke-width="14" opacity=".3"/>`
      +`<circle cx="${x}" cy="86" r="7" fill="#f8f0d0"/>`;}).join('')
  +`<g><path d="M390,392 q60,-56 130,0 l-16,40 q-50,-24 -98,0 z" fill="#f4ecd4"/>
    <path d="M420,362 q16,-40 52,-44 q40,-4 48,30 q-30,-10 -52,6 q-20,-16 -48,8 z" fill="#e8c060"/>
    <circle cx="470" cy="322" r="14" fill="#f8f4e8"/>
    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="4.5s" repeatCount="indefinite"/></g>`
  +Array.from({length:20},(_,i)=>{const x=120+i*34;
    return `<circle cx="${x}" cy="${430+((i%2)*10)}" r="8" fill="#f0e8d4" opacity=".9"/>`;}).join('')
  +Array.from({length:30},()=>circ(r()*W,r()*300,2,'#f8e8c8',.7)).join('')
  +fog(330,170,'#d8c8a0',.3,30)+figures(230,478,1,'#5a4a38',true);},

lethe(r){ return G('lt',[[0,'#b8d4c8'],[.5,'#88b4a8'],[1,'#4a8478']])+rect(0,0,W,H,'url(#lt)')
  +RG('ltsun',[[0,'#fff',.9],[1,'#fff',0]])+circ(450,120,130,'url(#ltsun)')
  +`<path d="M0,340 q225,-30 450,0 t450,0 L900,500 L0,500 Z" fill="#5aa4c4" opacity=".85"/>`
  +Array.from({length:8},(_,i)=>`<path d="M0,${360+i*16} q225,${8+r()*6} 450,0 t450,0" stroke="#8ac4dc" fill="none" opacity=".5"/>`).join('')
  +Array.from({length:7},(_,i)=>{const x=60+i*130;
    return `<path d="M${x},346 q-3,-30 6,-40 q7,-7 11,1 q4,10 1,39 z" fill="#3a6450" opacity=".8"/>`;}).join('')
  +Array.from({length:16},()=>circ(r()*W,300+r()*60,2,'#f0e8c8',.8)).join('')
  +fog(280,140,'#a8ccc0',.3,30)+figures(560,332,.9,'#24443c',true);},
};

/* aliases for regions sharing painters */
P.gluttonyRegion=P.gluttony;

function paint(container, region, seed){
  const painter = P[region] || P.darkwood;
  const r = rng(region + '|' + (seed||''));
  container.innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`+
    painter(r)+
    `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vig)" pointer-events="none"/>`+
    RG('vig',[[0,'#000',0],[.72,'#000',0],[1,'#000',.6]])+
    `</svg>`;
}
return { paint };
})();
