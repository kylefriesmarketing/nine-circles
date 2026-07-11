/* =====================================================================
   NINE CIRCLES — engine.js
   State, rendering, choice resolution, corruption, HUD, persistence,
   galleries, debug (~).
   ===================================================================== */
(() => {
const NODES=STORY.nodes, ENDINGS=STORY.endings, REGIONS=STORY.regions,
      VERSES=STORY.verses, SOULS=STORY.souls;
const SINS=['pride','envy','wrath','sloth','greed','gluttony','lust'];
const K_PERSIST='nc_persist', K_RUN='nc_run';
const $=id=>document.getElementById(id);

/* ---------------- persistent state ---------------- */
function loadP(){
  try{ const p=JSON.parse(localStorage.getItem(K_PERSIST)); if(p) return p; }catch(e){}
  return { runs:0, endings:{}, witness:[], residue:{}, lastEnding:null,
    lastEndingTitle:null, playerName:'', versesFound:[], deepest:0 };
}
function saveP(){ localStorage.setItem(K_PERSIST, JSON.stringify(P)); }
let P = loadP();

/* ---------------- run state ---------------- */
function newRun(name){
  return { name:name||P.playerName||'Pilgrim', node:'n_wake',
    sins:{pride:0,envy:0,wrath:0,sloth:0,greed:0,gluttony:0,lust:0},
    heart:0, virgil:3, star:4, names:[], verses:[], flags:{}, judged:{},
    absolved:0, punished:0 };
}
let S=null;
function saveRun(){ if(S) localStorage.setItem(K_RUN, JSON.stringify(S)); }
function clearRun(){ localStorage.removeItem(K_RUN); }
function loadRun(){ try{ return JSON.parse(localStorage.getItem(K_RUN)); }catch(e){ return null; } }

/* ---------------- helpers ---------------- */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=(t)=> String(typeof t==='function'?t(S,P):t).replace(/\{NAME\}/g, S?S.name:'Pilgrim');
function rngStr(seed){ let h=2166136261;
  for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619);}
  return ()=>{ h=Math.imul(h^h>>>15,2246822507); h=Math.imul(h^h>>>13,3266489909);
    return ((h^=h>>>16)>>>0)/4294967296; }; }

/* Hell lies when the star gutters: visibly corrupt some choice words */
function corruptLabel(text, seed){
  if (!S || S.star>2) return text;
  const p = S.star<=0 ? .24 : S.star===1 ? .16 : .09;
  const r = rngStr(seed);
  return text.split(' ').map(w=>{
    if (w.length<4 || r()>p) return w;
    const chars=w.split(''); const i=1+Math.floor(r()*(chars.length-2));
    const sw={a:'æ',e:'ə',i:'ï',o:'ø',u:'û',s:'ʃ',n:'ɳ',r:'ɾ',t:'ƚ'};
    chars[i]=sw[chars[i].toLowerCase()]||chars[chars.length-2];
    return `<span class="corrupt-word">${chars.join('')}</span>`;
  }).join(' ');
}

/* ---------------- illustrated layers & atmosphere ---------------- */
const IMG_ROOT='assets';
function sceneLayers(container, kind, key, opts={}){
  // container already holds the procedural SVG (fallback); stack art + weather on top
  container.insertAdjacentHTML('beforeend',
    `<img class="scene-img" src="${IMG_ROOT}/${kind}/${key}.jpg" alt="" onerror="this.remove()">`
    +`<div class="atmo"><div class="fogx"></div>${particles(opts.region||key)}</div>`
    +(opts.grade!==false?`<div class="scene-grade"></div>`:''));
}
function particles(region){
  const cold=['ice','lucifer','stars'].includes(region);
  const holy=['beatrice','purgatorio','limbo'].includes(region);
  const col= cold?'#cfe4ee' : holy?'#e8d9a8' : '#e0703a';
  const n= cold?10 : 14;
  let s='';
  for(let i=0;i<n;i++){ const sz=(1+Math.random()*2.4).toFixed(1);
    s+=`<span class="ember" style="left:${(Math.random()*100).toFixed(1)}%;width:${sz}px;height:${sz}px;background:${col};--eo:${(.25+Math.random()*.5).toFixed(2)};--ex:${(Math.random()*90-45).toFixed(0)}px;--eh:${(180+Math.random()*260).toFixed(0)}px;animation-duration:${(6+Math.random()*9).toFixed(1)}s;animation-delay:-${(Math.random()*12).toFixed(1)}s;box-shadow:0 0 ${(3+Math.random()*5).toFixed(0)}px ${col}"></span>`;}
  return s;
}

/* ---------------- screens ---------------- */
function show(id){ ['title-screen','game-screen','ending-screen','name-screen','gallery']
  .forEach(s=>$(s).classList.toggle('hidden', s!==id)); }

/* ---------------- title ---------------- */
function titleScreen(){
  show('title-screen');
  ART.paint($('title-art'),'title','run'+P.runs);
  $('title-art').insertAdjacentHTML('beforeend',
    `<img id="title-hero-img" src="${IMG_ROOT}/ui/title-hero.jpg" alt="" onerror="this.remove()">`
    +`<div class="atmo"><div class="fogx"></div>${particles('gate')}</div>`);
  $('btn-continue').classList.toggle('hidden', !loadRun());
  const res=$('title-residue');
  if (P.runs>0){
    const r=STORY.helpers.domRes(P);
    res.innerHTML = (P.lastEndingTitle?`Minos remembers: last time it ended with “${P.lastEndingTitle}.”`:'Minos remembers you.')
      + (r?`<br>Your ledger still smells of ${STORY.helpers.SIN_WORD[r]}.`:'')
      + (P.witness.length?`<br>${P.witness.length} of 9 names stand on the Witness Wall.`:'');
  } else res.textContent='';
}
$('btn-begin').onclick=()=>{ $('name-input').value=P.playerName||''; show('name-screen');
  $('name-input').focus(); };
$('name-go').onclick=startRun;
$('name-input').addEventListener('keydown',e=>{ if(e.key==='Enter') startRun(); });
function startRun(){
  const nm=($('name-input').value.trim()||'Pilgrim').slice(0,16);
  P.playerName=nm; saveP();
  S=newRun(nm); show('game-screen'); render(S.node);
}
$('btn-continue').onclick=()=>{ const r=loadRun(); if(!r) return titleScreen();
  S=r; show('game-screen'); render(S.node); };

/* ---------------- galleries ---------------- */
function gallery(title, sub, bodyHTML){
  $('gallery-title').textContent=title;
  $('gallery-body').innerHTML=`<div class="gallery-sub">${sub}</div>`+bodyHTML;
  show('gallery');
}
$('gallery-close').onclick=titleScreen;
$('btn-endings').onclick=()=>{
  const ids=Object.keys(ENDINGS);
  const found=ids.filter(i=>P.endings[i]).length;
  gallery('Cantos You Ended', `${found} of ${ids.length} endings witnessed`,
    `<div class="ending-grid">`+ids.map(i=>{
      const e=ENDINGS[i];
      return P.endings[i]
        ? `<div class="ending-cell k-${e.kind}"><span class="ek">${e.kind}</span>${e.title}<span style="opacity:.5;font-size:10px">×${P.endings[i]}</span></div>`
        : `<div class="ending-cell locked">?</div>`;
    }).join('')+`</div>`);
};
$('btn-witness').onclick=()=>{
  const order=['s_virgil','s_francesca','s_ciacco','s_forgotten','s_sullen',
    's_cavalcante','s_pier','s_ulysses','s_ugolino'];
  gallery('The Witness Wall',
    'Nine souls ask to be remembered above. Names inscribe only if you leave alive — three may be carried per descent. Nine inscribed opens the way up.',
    `<div class="witness-wall">`+order.map(id=>{
      const s=SOULS[id], lit=P.witness.includes(id);
      return `<div class="witness-slot ${lit?'lit':'dark'}">${lit?`<img class="medallion" src="${IMG_ROOT}/souls/${id}.jpg" alt="" onerror="this.remove()">`:''}<span class="w-circle">${s.circle}</span>${lit?s.name:'— unspoken —'}</div>`;
    }).join('')+`</div>`);
};
$('btn-verses').onclick=()=>{
  gallery('The Gathered Verses','Longfellow’s tercets, found in the dark. A verse spoken in the right place is a key.',
    `<div class="verse-list">`+Object.keys(VERSES).map(id=>{
      const v=VERSES[id];
      return P.versesFound.includes(id)
        ? `<div class="verse-item">${v.lines.join('<br>')}<span class="v-src">${v.title} — ${v.src}</span></div>`
        : `<div class="verse-item locked">a verse not yet gathered<span class="v-src">— somewhere below —</span></div>`;
    }).join('')+`</div>`);
};

$('btn-tapestry').onclick=()=>{
  const r=P.lastRun;
  if (!r) return gallery('The Tapestry','Every descent is sewn into cloth, as a crusader once sewed his sins to his chest.',
    `<p style="color:var(--bone-dim);font-style:italic;margin:30px 0">No descent has been woven yet. The loom waits.</p>`);
  const sinCol={pride:'#b08a3e',envy:'#5a7a4a',wrath:'#a33b3b',sloth:'#6a6a72',
    greed:'#8a6f3e',gluttony:'#7a5a3a',lust:'#8a4a6a'};
  const verbCol={remember:'#c9a35c',pity:'#7d94a8',condemn:'#7e2020',question:'#8a8474',
    absolve:'#e8e2c8',punish:'#c4552a'};
  let svg=`<svg viewBox="0 0 400 540" style="max-width:380px;width:100%">`;
  svg+=`<rect x="30" y="20" width="340" height="460" fill="#100d0a" stroke="#3a332a"/>`;
  SINS.forEach((k,i)=>{ const x=62+i*46, v=r.sins[k]||0;
    svg+=`<line x1="${x}" y1="30" x2="${x}" y2="470" stroke="${sinCol[k]}" stroke-width="${1.5+v*1.1}" opacity="${.2+v*.09}"/>`;
    svg+=`<text x="${x}" y="500" text-anchor="middle" font-size="9" fill="${v>=3?sinCol[k]:'#4a4132'}" font-family="Georgia" letter-spacing="1">${k.toUpperCase()}</text>`;});
  const js=Object.keys(r.judged);
  js.forEach((sid,i)=>{ const y=70+i*44, verb=r.judged[sid], c=verbCol[verb]||'#8a8474';
    svg+=`<rect x="45" y="${y}" width="310" height="5" fill="${c}" opacity=".75"/>`;
    svg+=`<circle cx="200" cy="${y+2.5}" r="7" fill="${c}"/>`;
    svg+=`<text x="52" y="${y-6}" font-size="10.5" fill="#9a917f" font-family="Georgia" font-style="italic">${SOULS[sid].name} — ${verb}</text>`;});
  if (r.scythe) svg+=`<text x="345" y="52" text-anchor="end" font-size="22" fill="#c4552a">⚚</text>`;
  const kindCol=r.kind==='death'?'#7e2020':r.kind==='true'?'#9fb8c8':'#c9a35c';
  svg+=`<circle cx="200" cy="440" r="24" fill="none" stroke="${kindCol}" stroke-width="2"/>`;
  svg+=`<circle cx="200" cy="440" r="${4+Math.min(9,r.names.length*3)}" fill="${kindCol}" opacity=".8"/>`;
  for(let i=0;i<r.verses.length;i++)
    svg+=`<line x1="${170+i*10}" y1="480" x2="${168+i*10}" y2="${506+(i%2)*8}" stroke="#c9a35c" stroke-width="1.5" opacity=".8"/>`;
  svg+=`</svg>`;
  gallery('The Tapestry of '+r.name,
    `The last descent, woven: warp of sins, weft of judgments — ended in “${ENDINGS[r.ending].title}.” `
    +`${r.absolved?r.absolved+' absolved. ':''}${r.punished?r.punished+' punished. ':''}${r.verses.length} verses carried.`,
    `<div style="display:flex;justify-content:center">${svg}</div>`);
};

/* ---------------- depth rail — the Funnel of Hell ---------------- */
const RAIL_COL=['#4a7a6e','#7a8a6a','#8a5a9a','#5a7288','#8a6f3e',
                '#4e6a4a','#c4552a','#7a5a42','#9a6a3a','#b8d4de'];
function paintRail(depth, seen){
  seen=seen||[];
  const topY=95, botY=925, out=depth>=10;
  let s=`<svg viewBox="0 0 100 1000" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="railbg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#14100d"/><stop offset=".7" stop-color="#0a0a10"/>
      <stop offset="1" stop-color="#050710"/></linearGradient>
    <radialGradient id="railstar"><stop offset="0" stop-color="#cfe4ee" stop-opacity=".8"/>
      <stop offset="1" stop-color="#cfe4ee" stop-opacity="0"/></radialGradient></defs>
    <rect width="100" height="1000" fill="url(#railbg)"/>`;
  // Beatrice's star waits above the funnel; it lights when you climb out
  s+=`<g transform="translate(50,44)">
    ${out?'<circle r="20" fill="url(#railstar)"/>':''}
    <path d="M0,-13 L2.3,-2.3 L13,0 L2.3,2.3 L0,13 L-2.3,2.3 L-13,0 L-2.3,-2.3 Z"
      fill="${out?'#e8f2f8':'#41525c'}" opacity="${out?1:.55}">
      ${out?'<animate attributeName="opacity" values="1;.65;1" dur="2.6s" repeatCount="indefinite"/>':''}
    </path></g>`;
  // funnel walls converging on the tip
  s+=`<path d="M11,${topY} C22,${topY+380} 41,${botY-140} 50,${botY}" stroke="#2e281f" fill="none" stroke-width="1.2"/>
      <path d="M89,${topY} C78,${topY+380} 59,${botY-140} 50,${botY}" stroke="#2e281f" fill="none" stroke-width="1.2"/>`;
  const rom=['◦','I','II','III','IV','V','VI','VII','VIII','IX'];
  for(let i=0;i<10;i++){
    const t=i/9, y=topY+12+(botY-topY-46)*t, w=37*(1-t*.84)+3.5;
    const vis=seen.includes(i), cur=i===depth, col=RAIL_COL[i];
    s+=`<ellipse cx="50" cy="${y}" rx="${w}" ry="${(6-t*2.2).toFixed(1)}"
      fill="${vis||cur?col:'#0d0b09'}" opacity="${cur?.95:vis?.4:.6}"
      stroke="${cur?'#c9a35c':vis?col:'#241f18'}" stroke-width="${cur?1.6:.8}"/>`;
    s+=`<text x="${50+w+7}" y="${y+4.5}" font-size="13"
      fill="${cur?'#c9a35c':vis?'#8a8474':'#3a3328'}" font-family="Georgia">${rom[i]}</text>`;
    if (cur && !out){
      s+=`<g class="rail-marker" transform="translate(50,${y})">
        <path d="M0,-9 q-3.6,4.5 0,9 q3.6,-4.5 0,-9 z" fill="#e8dfd0"/>
        <circle r="12" fill="none" stroke="#c9a35c" stroke-width="1">
          <animate attributeName="r" values="9;14;9" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values=".7;.15;.7" dur="2.4s" repeatCount="indefinite"/>
        </circle></g>`;
    }
  }
  // embers drifting up inside the funnel
  for(let i=0;i<4;i++){ const x=38+i*8, d=(7+i*2.3).toFixed(1);
    s+=`<circle cx="${x}" cy="0" r="1.1" fill="#c4552a" opacity=".5">
      <animate attributeName="cy" values="${botY-30};${topY+120}" dur="${d}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;.6;0" dur="${d}s" repeatCount="indefinite"/></circle>`;}
  // the Emperor at the tip
  s+=`<g transform="translate(50,${botY+22})" opacity="${depth>=9?.95:.45}">
    <path d="M0,-7 q-9,-5 -15,2 q7,-1 10,4 z M0,-7 q9,-5 15,2 q-7,-1 -10,4 z" fill="#0a0d12"/>
    <path d="M-3,-4 l0,7 M3,-4 l0,7 M0,-6 l0,9" stroke="#0a0d12" stroke-width="3"/>
    <circle cx="-2.6" cy="-2.4" r="1" fill="#c4552a"/><circle cx="2.6" cy="-2.4" r="1" fill="#c4552a"/></g>`;
  if (out) s+=`<g class="rail-marker" transform="translate(50,44)">
    <circle r="17" fill="none" stroke="#cfe4ee" stroke-width="1">
      <animate attributeName="r" values="14;19;14" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".8;.2;.8" dur="2.4s" repeatCount="indefinite"/>
    </circle></g>`;
  $('depth-rail').innerHTML=s+`</svg>`;
}

/* ---------------- HUD — the Reliquary ---------------- */
function paintHUD(){
  const sinCol={pride:'#b08a3e',envy:'#5a7a4a',wrath:'#a33b3b',sloth:'#6a6a72',
    greed:'#8a6f3e',gluttony:'#7a5a3a',lust:'#8a4a6a'};
  const st=S.star, vg=S.virgil;
  const stS=(.62+st*.075).toFixed(2), stO=(.2+st*.13).toFixed(2);
  const star=`<div class="relic ${st<=2?'flicker':''}"
    title="Beatrice’s Star — grace (${st}/6). When it gutters, Hell starts lying to you.">
    <svg viewBox="0 0 26 26" width="22" height="22">
      <circle cx="13" cy="13" r="11" fill="url(#hgStar)" opacity="${st>=3?.8:.2}"/>
      <g transform="translate(13,13) scale(${stS})" opacity="${stO}">
        <path d="M0,-10 L1.8,-1.8 L10,0 L1.8,1.8 L0,10 L-1.8,1.8 L-10,0 L-1.8,-1.8 Z" fill="#cfe4ee"/>
        <path d="M0,-6 L1.1,-1.1 L6,0 L1.1,1.1 L0,6 L-1.1,1.1 L-6,0 L-1.1,-1.1 Z" fill="#f4fbff" transform="rotate(45)"/>
      </g></svg></div>`;
  const virgil=`<div class="relic"
    title="Virgil’s Regard (${vg}/6) — lose your guide’s faith and he goes home without you.">
    <svg viewBox="0 0 26 26" width="22" height="22" style="opacity:${(.15+vg*.14).toFixed(2)}">
      <path d="M8,23 q-1.5,-7 2,-10.5 q-2.5,-3 -.5,-6.5 q2,-3.5 5.5,-2.5 q4.5,1 4.5,5 q0,3 -2,4.8 q3.5,3.2 3.5,9.7 z" fill="#d8cfc0"/>
      <path d="M6.5,9 q3,-6.5 9.5,-5.5 M7.5,7 l-1.8,-1.1 M9.6,5.2 l-1.3,-1.7 M12.4,4.2 l-.6,-2"
        stroke="${vg>=5?'#c9a35c':'#8a8474'}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    </svg></div>`;
  const ang=(S.heart*2.2).toFixed(1);
  const heart=`<div class="relic"
    title="The Heart — the weighing (${S.heart>0?'+':''}${S.heart}). Stone sinks one pan, pity the other. The way through is level.">
    <svg viewBox="0 0 44 27" width="38" height="23">
      <path d="M22,20 l-4.5,5 h9 z" fill="#8a6f3e"/>
      <line x1="22" y1="7" x2="22" y2="20" stroke="#8a6f3e" stroke-width="1.5"/>
      <g style="transform:rotate(${ang}deg);transform-origin:22px 7px;transition:transform .7s">
        <line x1="5" y1="7" x2="39" y2="7" stroke="#c9a35c" stroke-width="1.6"/>
        <path d="M2,9 q3,4.5 6,0" fill="none" stroke="#9a917f" stroke-width="1"/>
        <line x1="5" y1="7" x2="5" y2="9.5" stroke="#9a917f" stroke-width=".8"/>
        <circle cx="5" cy="11" r="2" fill="#8b8375"/>
        <path d="M36,9 q3,4.5 6,0" fill="none" stroke="#9a917f" stroke-width="1"/>
        <line x1="39" y1="7" x2="39" y2="9.5" stroke="#9a917f" stroke-width=".8"/>
        <path d="M39,9.4 q-1.6,2.2 0,3.8 q1.6,-1.6 0,-3.8" fill="#7d94a8"/>
      </g></svg></div>`;
  const sins=`<div class="relic" title="The Sin Ledger — seven braziers. Hell reads the lit ones.">`
    +SINS.map(k=>{ const v=S.sins[k], h=3.5+v*1.15, lit=v>=3;
      return `<svg viewBox="0 0 8 17" width="7" height="15" class="${lit?'sin-lit':''}" style="overflow:visible">
        <title>${k}: ${v}</title>
        <path d="M4,${(16-h).toFixed(1)} q-2.5,${(h*.55).toFixed(1)} 0,${h.toFixed(1)} q2.5,-${(h*.45).toFixed(1)} 0,-${h.toFixed(1)} z"
          fill="${v===0?'#33261d':sinCol[k]}" opacity="${(.45+v*.06).toFixed(2)}">
          ${lit?`<animate attributeName="opacity" values=".7;1;.7" dur="1.4s" repeatCount="indefinite"/>`:''}
        </path>
        <rect x="1.4" y="14.6" width="5.2" height="2" fill="#453a2b"/></svg>`;
    }).join('')+`</div>`;
  const names=`<div class="relic" title="Names you carry — three at most; they inscribe only if you leave alive.">`
    +[0,1,2].map(i=>{ const id=S.names[i];
      return `<svg viewBox="0 0 12 16" width="11" height="15">
        <title>${id?SOULS[id].name:'an empty slot for a name'}</title>
        <path d="M1.5,15.5 L1.5,6 Q1.5,1.5 6,1.5 Q10.5,1.5 10.5,6 L10.5,15.5 Z"
          fill="${id?'#8a6f3e':'#241f18'}" stroke="${id?'#c9a35c':'#453a2b'}" stroke-width="1"/>
        ${id?'<path d="M4,7 h4 M4,9.8 h4 M4,12.6 h2.5" stroke="#f0e2c0" stroke-width="1"/>':''}
      </svg>`;
    }).join('')
    +(S.flags.scythe?`<svg viewBox="0 0 16 18" width="15" height="17" class="scythe-svg">
        <title>Death’s Scythe — wrestled from the First Collector. The blade keeps its own docket.</title>
        <path d="M4.5,17.5 L11.5,2.5" stroke="#6a5a48" stroke-width="1.6"/>
        <path d="M11.5,2.5 q-7.5,-2.2 -10.5,4.3 q5.5,-3.2 9.9,-1.3 z" fill="#c9ccd4"/>
      </svg>`:'')+`</div>`;
  $('hud').innerHTML=`<svg width="0" height="0" style="position:absolute"><defs>
    <radialGradient id="hgStar"><stop offset="0" stop-color="#cfe4ee" stop-opacity=".85"/>
    <stop offset="1" stop-color="#cfe4ee" stop-opacity="0"/></radialGradient></defs></svg>`
    +star+virgil+heart+sins+names;
}

/* ---------------- render node ---------------- */
function render(nodeId){
  const n=NODES[nodeId];
  if(!n){ console.error('missing node',nodeId); return titleScreen(); }
  S.node=nodeId;
  if (n.enter) n.enter(S,P);
  const regKey = typeof n.region==='function' ? n.region(S,P) : n.region;
  const reg=REGIONS[regKey];
  P.deepest=Math.max(P.deepest,reg.depth);
  ART.paint($('scene-art'), regKey, nodeId+P.runs);
  sceneLayers($('scene-art'),'scenes',regKey,{region:regKey});
  AUDIO.setScene(regKey, reg.depth, S.star);
  S.seen=S.seen||[];
  if (reg.depth<10 && !S.seen.includes(reg.depth)) S.seen.push(reg.depth);
  paintRail(reg.depth, S.seen); paintHUD();
  $('region-name').textContent=reg.name;
  $('node-title').textContent=fmt(n.title);
  const txt=$('node-text');
  const body=fmt(n.text);
  txt.innerHTML=(n.judge?`<img class="soul-medallion" src="${IMG_ROOT}/souls/${n.judge.soul}.jpg" alt="" onerror="this.remove()">`:'')+body;
  txt.classList.toggle('dropcap', /^[A-Za-z]/.test(body));
  const box=$('choices'); box.innerHTML='';
  n.choices.forEach((c,ix)=>{
    if (c.req && !c.req(S,P)) return;
    if (c.verse && !S.verses.includes(c.verse)) return;
    const full = c.remember && S.names.length>=3 && !S.names.includes(c.remember);
    const b=document.createElement('button');
    b.className='choice';
    if (c.verse) b.classList.add('verse-ward');
    const gleaming = c.gleam && S.sins[c.gleam]>=3;
    if (gleaming) b.classList.add('gleam');
    if (S.star<=2) b.classList.add('corrupt');
    let pre = c.pre ? `<span class="c-pre">${c.pre}</span>` : '';
    if (gleaming && !c.pre) pre=`<span class="c-pre">it gleams for you</span>`;
    if (full) { b.style.opacity=.45; b.style.cursor='not-allowed';
      pre=`<span class="c-pre">your mouth is full of names</span>`; }
    b.innerHTML = pre + corruptLabel(fmt(c.t), nodeId+ix);
    b.onclick=()=>{ if(full){ b.style.transform='translateX(0)'; return; } choose(c); };
    box.appendChild(b);
  });
  // injected rites: Absolve (spend the star) / Punish (Death's scythe)
  if (n.judge && !S.judged[n.judge.soul]){
    const jid=n.judge.soul, jgo=n.judge.go;
    const rite=(verb)=>{ S.judged[jid]=verb;
      S.flags.rite={soul:jid,verb,go:jgo,region:regKey};
      if (verb==='absolve'){ S.absolved=(S.absolved||0)+1;
        S.star=clamp(S.star-1,0,6); AUDIO.setStar(S.star); AUDIO.sting('verse'); }
      else { S.punished=(S.punished||0)+1;
        S.sins.wrath=clamp(S.sins.wrath+1,0,9); AUDIO.sting('death'); }
      render('n_rite'); };
    if (S.star>=4){
      const b=document.createElement('button'); b.className='choice holy';
      b.innerHTML=`<span class="c-pre">spend a candle of the star</span>Absolve them. Let one knot of Hell come undone, and pay the light it costs.`;
      b.onclick=()=>rite('absolve'); box.appendChild(b);
    }
    if (S.flags.scythe){
      const b=document.createElement('button'); b.className='choice grim';
      b.innerHTML=`<span class="c-pre">death’s office</span>Let the scythe do what it was forged for.`;
      b.onclick=()=>rite('punish'); box.appendChild(b);
    }
  }
  const gs=$('game-screen'); gs.classList.remove('fade-in'); void gs.offsetWidth;
  gs.classList.add('fade-in');
  $('text-panel').scrollTop=0;
  saveRun();
}

/* ---------------- choice resolution ---------------- */
function choose(c){
  if (c.sin) for(const k in c.sin) S.sins[k]=clamp(S.sins[k]+c.sin[k],0,9);
  if (c.heart) S.heart=clamp(S.heart+c.heart,-6,6);
  if (c.virgil) S.virgil=clamp(S.virgil+c.virgil,0,6);
  if (c.star){ S.star=clamp(S.star+c.star,0,6); AUDIO.setStar(S.star); }
  if (c.learnVerse){ if(!S.verses.includes(c.learnVerse)) S.verses.push(c.learnVerse);
    if(!P.versesFound.includes(c.learnVerse)){ P.versesFound.push(c.learnVerse); saveP(); }
    AUDIO.sting('verse'); }
  if (c.remember && !S.names.includes(c.remember) && S.names.length<3){
    S.names.push(c.remember); AUDIO.sting('remember'); }
  if (c.fx) c.fx(S,P);
  if (c.gleam && S.sins[c.gleam]>=3) AUDIO.sting('gleam');

  const endId = typeof c.end==='function' ? c.end(S,P) : c.end;
  if (endId) return ending(endId);
  // Virgil walks: if his regard is spent before the climb, he goes home
  let next = typeof c.go==='function' ? c.go(S,P) : c.go;
  if (S.virgil<=0 && next && !['n_climb','n_exit','n_exit2','n_purgatorio','n_beatrice_gate',
      'n_beatrice_verdict','n_abandoned'].includes(next))
    next='n_abandoned';
  if (next) render(next);
}

/* ---------------- endings ---------------- */
function ending(id){
  const e=ENDINGS[id];
  if(!e){ console.error('missing ending',id); return titleScreen(); }
  P.runs++; P.endings[id]=(P.endings[id]||0)+1;
  P.lastEnding=id; P.lastEndingTitle=e.title;
  P.residue={}; for(const k of SINS){ const v=Math.floor(S.sins[k]*.6); if(v>0) P.residue[k]=v; }
  P.lastRun={ name:S.name, ending:id, kind:e.kind, sins:{...S.sins},
    judged:{...S.judged}, names:[...S.names], verses:[...S.verses],
    scythe:!!S.flags.scythe, absolved:S.absolved||0, punished:S.punished||0,
    heart:S.heart, star:S.star };
  let inscribeMsg='';
  // e_trade: the one contract Hell honors — names inscribe even though you stay
  const escaped = ((e.kind==='exit'||e.kind==='true') && id!=='e_falsestars') || id==='e_trade';
  if (escaped && S.names.length){
    const newly=S.names.filter(n=>!P.witness.includes(n));
    newly.forEach(n=>P.witness.push(n));
    if (id==='e_beatrice_clear' && !P.versesFound.includes('v_love')) P.versesFound.push('v_love');
    inscribeMsg = newly.length
      ? `Inscribed on the Witness Wall: ${newly.map(n=>SOULS[n].name).join(' · ')} — ${P.witness.length} of 9.`
      : `The Wall already keeps every name you carried. ${P.witness.length} of 9.`;
  } else if (id==='e_falsestars' && S.names.length){
    inscribeMsg='The names you carried turn to smoke in your mouth. Nothing is inscribed under painted stars.';
  } else if (!escaped && S.names.length){
    inscribeMsg=`The name${S.names.length>1?'s':''} you carried — ${S.names.map(n=>SOULS[n].name).join(', ')} — die${S.names.length===1?'s':''} with you, unspoken above.`;
  }
  saveP(); clearRun();
  AUDIO.sting(e.kind==='death'?'death':'remember');
  ART.paint($('ending-art'), e.art, id+P.runs);
  sceneLayers($('ending-art'),'endings',id,{region:e.art,grade:false});
  const eimg=$('ending-art').querySelector('.scene-img');
  if (eimg) eimg.onerror=function(){ this.onerror=null;
    this.src=`${IMG_ROOT}/scenes/${e.art}.jpg`;
    this.onerror=function(){this.remove();}; };
  const reg = e.kind==='true' ? 'beatrice' : e.art;
  AUDIO.setScene(reg, REGIONS[reg]?REGIONS[reg].depth:9, e.kind==='death'?0:6);
  $('ending-kind').textContent = e.kind==='death'?'a canto ends':(e.kind==='true'?'the comedy is divine':'an exit');
  $('ending-kind').className='k-'+e.kind;
  $('ending-title').textContent=e.title;
  $('ending-text').textContent=e.text;
  $('ending-inscribe').textContent=inscribeMsg;
  show('ending-screen');
}
$('btn-again').onclick=titleScreen;

/* ---------------- debug (~) & mute (m) ---------------- */
function debugPanel(){
  const d=$('debug-panel'); d.classList.toggle('hidden');
  if (d.classList.contains('hidden')) return;
  const opts=Object.keys(NODES).map(k=>`<option ${S&&S.node===k?'selected':''}>${k}</option>`).join('');
  d.innerHTML=`<b>~ debug lantern</b>
  <div class="dbg-row">node <select id="dbg-node">${opts}</select> <button id="dbg-go">go</button></div>
  <div class="dbg-row">star <input id="dbg-star" size="1" value="${S?S.star:4}"> virgil <input id="dbg-vg" size="1" value="${S?S.virgil:3}"> heart <input id="dbg-ht" size="2" value="${S?S.heart:0}"></div>
  <div class="dbg-row">${SINS.map(k=>`${k.slice(0,4)} <input id="dbg-${k}" size="1" value="${S?S.sins[k]:0}">`).join(' ')}</div>
  <div class="dbg-row"><button id="dbg-apply">apply stats</button> <button id="dbg-verses">all verses</button></div>
  <div class="dbg-row"><button id="dbg-marks">8 witness marks</button> <button id="dbg-wipe">WIPE ALL</button></div>
  <div class="dbg-row"><button id="dbg-scythe">give scythe</button> <button id="dbg-rites">absolved 4 / punished 3</button></div>
  <div class="dbg-row">P: runs ${P.runs} · witness ${P.witness.length}/9 · endings ${Object.keys(P.endings).length}/${Object.keys(ENDINGS).length}</div>`;
  $('dbg-go').onclick=()=>{ if(!S){S=newRun(P.playerName);show('game-screen');}
    render($('dbg-node').value); };
  $('dbg-apply').onclick=()=>{ if(!S)return;
    S.star=clamp(+$('dbg-star').value||0,0,6); S.virgil=clamp(+$('dbg-vg').value||0,0,6);
    S.heart=clamp(+$('dbg-ht').value||0,-6,6);
    SINS.forEach(k=>S.sins[k]=clamp(+$('dbg-'+k).value||0,0,9));
    render(S.node); };
  $('dbg-verses').onclick=()=>{ if(!S)return;
    S.verses=Object.keys(VERSES); P.versesFound=Object.keys(VERSES); saveP(); render(S.node); };
  $('dbg-marks').onclick=()=>{ P.witness=['s_francesca','s_ciacco','s_forgotten','s_sullen',
    's_cavalcante','s_pier','s_ulysses','s_ugolino']; saveP(); if(S)render(S.node); };
  $('dbg-wipe').onclick=()=>{ localStorage.removeItem(K_PERSIST); localStorage.removeItem(K_RUN);
    P=loadP(); S=null; d.classList.add('hidden'); titleScreen(); };
  $('dbg-scythe').onclick=()=>{ if(!S)return; S.flags.scythe=1; render(S.node); };
  $('dbg-rites').onclick=()=>{ if(!S)return; S.absolved=4; S.punished=3; render(S.node); };
}
document.addEventListener('keydown',e=>{
  if (e.key==='`'||e.key==='~') debugPanel();
  else if (e.key==='m'&&!e.target.matches('input')) AUDIO.toggleMute();
});

/* ---------------- boot ---------------- */
const Q=new URLSearchParams(location.search);
if (Q.get('node') && NODES[Q.get('node')]){
  S=newRun(Q.get('name')||P.playerName||'Pilgrim');
  show('game-screen'); render(Q.get('node'));
} else titleScreen();
})();
