/* =====================================================================
   NINE CIRCLES — audio.js  (v2: leitmotifs)
   Generative WebAudio score. No audio files.
   - Root falls one semitone per depth; dawn regions lift an octave.
   - BEATRICE MOTIF: her bells play exactly as many notes as the Star
     holds candles (6 → the full phrase, 0 → nothing), and go flat and
     sour below 3. Grace is audible, and audibly dying.
   - SOUL LEITMOTIFS: each witness soul has a theme, woven in while you
     stand before them (rests are part of the writing — the Forgotten's
     theme is mostly holes).
   - JUDECCA: designed silence — no drone, no wind; a sub-thump and the
     occasional crack of settling ice.
   - Buses: music and sfx are separately mutable (m / n).
   ===================================================================== */
const AUDIO = (() => {
let ctx=null, master=null, musicBus=null, sfxBus=null, lp=null;
let current=null, bellTimer=null, motifTimer=null, pulseTimer=null, birdTimer=null;
let star=4, depth=0, motifKey=null, rootNow=45;
let prefs={music:true,sfx:true};

const REGION_CFG = {
  title:   { noise:'wind', nLvl:.025,drone:[0,7],  pulse:0,  bells:0, theme:1 },
  darkwood:{ noise:'wind', nLvl:.05, drone:[0,7],  pulse:0,  bells:1 },
  gate:    { noise:'wind', nLvl:.04, drone:[0,5],  pulse:14, bells:1 },
  vestibule:{noise:'swarm',nLvl:.06, drone:[0,6],  pulse:0,  bells:0 },
  acheron: { noise:'water',nLvl:.07, drone:[0,7],  pulse:11, bells:1 },
  limbo:   { noise:'wind', nLvl:.02, drone:[0,7,12],pulse:0, bells:1, warm:1 },
  minos:   { noise:'wind', nLvl:.03, drone:[0,6],  pulse:7,  bells:0 },
  lust:    { noise:'storm',nLvl:.12, drone:[0,5],  pulse:0,  bells:1 },
  gluttony:{ noise:'rain', nLvl:.10, drone:[0,3],  pulse:0,  bells:0 },
  greed:   { noise:'wind', nLvl:.04, drone:[0,6],  pulse:5,  bells:0, clank:1 },
  styx:    { noise:'marsh',nLvl:.08, drone:[0,3],  pulse:9,  bells:0 },
  dis:     { noise:'fire', nLvl:.07, drone:[0,1],  pulse:6,  bells:0 },
  heresy:  { noise:'fire', nLvl:.08, drone:[0,4],  pulse:0,  bells:0 },
  wood:    { noise:'wind', nLvl:.06, drone:[0,2],  pulse:0,  bells:0, creak:1 },
  sand:    { noise:'fire', nLvl:.09, drone:[0,5],  pulse:0,  bells:0 },
  geryon:  { noise:'wind', nLvl:.10, drone:[0,4],  pulse:0,  bells:1 },
  malebolge:{noise:'fire', nLvl:.05, drone:[0,1],  pulse:4,  bells:0, clank:1 },
  ice:     { noise:'wind', nLvl:.03, drone:[0,7],  pulse:0,  bells:0, shimmer:1 },
  judecca: { noise:'none', nLvl:0,   drone:[],     pulse:0,  bells:0, silence:1 },
  lucifer: { noise:'wind', nLvl:.05, drone:[0,1],  pulse:0,  bells:0, heart:1 },
  stars:   { noise:'wind', nLvl:.02, drone:[0,7,12],pulse:0, bells:2, warm:1 },
  purgatorio:{noise:'water',nLvl:.04,drone:[0,7,12],pulse:0, bells:2, warm:1 },
  beatrice:{ noise:'wind', nLvl:.01, drone:[0,7,12,16],pulse:0,bells:3, warm:1 },
  /* ----- ACT II: the Mountain ----- */
  pgate:   { noise:'wind', nLvl:.03, drone:[0,7,12], pulse:0,  bells:2, warm:1 },
  t_pride: { noise:'wind', nLvl:.03, drone:[0,5,12], pulse:9,  bells:1, warm:1 },
  t_envy:  { noise:'wind', nLvl:.05, drone:[0,3,10], pulse:0,  bells:1, warm:1 },
  t_wrath: { noise:'marsh',nLvl:.06, drone:[0,3],    pulse:0,  bells:0, warm:1 },
  t_sloth: { noise:'wind', nLvl:.03, drone:[0,7],    pulse:13, bells:1, warm:1 },
  t_greed: { noise:'wind', nLvl:.04, drone:[0,5,10], pulse:6,  bells:1, warm:1 },
  t_gluttony:{noise:'water',nLvl:.05,drone:[0,7,12], pulse:0,  bells:1, warm:1 },
  t_lust:  { noise:'fire', nLvl:.09, drone:[0,7,12], pulse:0,  bells:1, warm:1 },
  pnight:  { noise:'wind', nLvl:.02, drone:[0,7],    pulse:0,  bells:2, warm:1, shimmer:1 },
  eden:    { noise:'water',nLvl:.04, drone:[0,7,12,16],pulse:0,bells:2, warm:1, birds:1 },
  pageant: { noise:'wind', nLvl:.02, drone:[0,7,12,16],pulse:8,bells:3, warm:1 },
  lethe:   { noise:'water',nLvl:.06, drone:[0,7,12,16],pulse:0,bells:3, warm:1, birds:1 },
};

/* her theme — and how much of it grace can still afford */
const BEATRICE_MOTIF = [12,16,19,16,24,19];
/* the title's descent line — the whole poem in eight falling notes */
const TITLE_THEME = [24,22,20,19,17,15,14,12];

/* soul leitmotifs: null = rest (the rests are load-bearing) */
const MOTIFS = {
  s_francesca:{ w:'triangle',oct:12, vol:.065,dur:.85,gap:.4,
    notes:[12,7,8,3,5,null,3,2] },                        // circling, wind-borne
  s_ciacco:   { w:'sine',    oct:0,  vol:.075,dur:.22,gap:.3,
    notes:[0,0,3,0,null,0,-2,0] },                        // rain-drip, unresolved
  s_forgotten:{ w:'sine',    oct:0,  vol:.07, dur:.5, gap:.6,
    notes:[7,null,7,null,5,null,null,null] },             // a theme worn to holes
  s_sullen:   { w:'triangle',oct:-12,vol:.09, dur:1.3,gap:.85,
    notes:[0,3,0,null,3,2,0] },                           // submerged, rising thirds
  s_cavalcante:{w:'triangle',oct:12, vol:.06, dur:.48,gap:.32,
    notes:[0,4,7,11,null,null,11,null] },                 // a question, unanswered
  s_pier:     { w:'triangle',oct:12, vol:.055,dur:.38,gap:.28,
    notes:[7,5,7,10,7,null,5,3] },                        // courtly, gone brittle
  s_ulysses:  { w:'triangle',oct:0,  vol:.075,dur:.5, gap:.34,
    notes:[0,7,12,14,19,null,14,12] },                    // open water, still rising
  s_ugolino:  { w:'sine',    oct:-12,vol:.1,  dur:.65,gap:.45,
    notes:[1,0,1,0,null,1,0,null] },                      // the gnawing semitone
  s_virgil:   { w:'triangle',oct:0,  vol:.075,dur:.7, gap:.45,
    notes:[0,2,3,5,7,5,3,2] },                            // even hexameter, dorian
};
const midiHz = m => 440*Math.pow(2,(m-69)/12);

function ensure(){
  if (ctx) return true;
  try{
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value=.55;
    lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2400;
    musicBus = ctx.createGain(); musicBus.gain.value = prefs.music?.85:0;
    sfxBus   = ctx.createGain(); sfxBus.gain.value   = prefs.sfx?.9:0;
    musicBus.connect(lp); lp.connect(master);
    sfxBus.connect(master); master.connect(ctx.destination);
    document.addEventListener('pointerdown',()=>{ if(ctx&&ctx.state==='suspended') ctx.resume(); });
    return true;
  }catch(e){ return false; }
}
function noiseBuf(){
  const b=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  return b;
}
function stopCurrent(){
  [bellTimer,motifTimer,birdTimer].forEach(t=>t&&clearTimeout(t)); bellTimer=motifTimer=birdTimer=null;
  if (pulseTimer){clearInterval(pulseTimer);pulseTimer=null;}
  if (!current) return;
  const t=ctx.currentTime;
  current.gains.forEach(g=>{try{g.gain.setTargetAtTime(0,t,.6);}catch(e){}});
  const dead=current;
  setTimeout(()=>dead.nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}}),2200);
  current=null;
}
function osc(type,freq,gainVal,dest){
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=type;o.frequency.value=freq;g.gain.value=0;
  g.gain.setTargetAtTime(gainVal,ctx.currentTime,1.5);
  o.connect(g);g.connect(dest);o.start();
  return {o,g};
}
/* one struck voice: bell-ish (sine+partial) or plain tone */
function bell(freq,vol=.14,dur=2.2,dest,detuneRatio=1){
  if (!ctx) return;
  dest=dest||musicBus;
  const t=ctx.currentTime, f=freq*detuneRatio;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type='sine';o.frequency.value=f;
  const o2=ctx.createOscillator(),g2=ctx.createGain();
  o2.type='sine';o2.frequency.value=f*2.76;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.015);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  g2.gain.setValueAtTime(vol*.3,t);g2.gain.exponentialRampToValueAtTime(.0001,t+dur*.4);
  o.connect(g);o2.connect(g2);g.connect(dest);g2.connect(dest);
  o.start(t);o2.start(t);o.stop(t+dur+.1);o2.stop(t+dur+.1);
}
function tone(freq,def,dest){
  if (!ctx) return;
  dest=dest||musicBus;
  const t=ctx.currentTime;
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type=def.w;o.frequency.value=freq;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(def.vol,t+.03);
  g.gain.setTargetAtTime(0,t+def.dur*.7,def.dur*.25);
  o.connect(g);g.connect(dest);o.start(t);o.stop(t+def.dur+.6);
}
function playMotif(def,rootMidi){
  let dly=0;
  def.notes.forEach(n=>{
    if (n!==null){ const at=dly;
      setTimeout(()=>tone(midiHz(rootMidi+def.oct+n),def),at*1000); }
    dly+=def.dur*.62+def.gap;
  });
  return dly;
}
/* Beatrice: as many notes as the star holds; sour below 3 */
function scheduleBells(cfg,root){
  if (bellTimer) clearTimeout(bellTimer);
  const go=()=>{
    if (!current) return;
    if (cfg.theme){
      TITLE_THEME.forEach((n,i)=>setTimeout(()=>bell(midiHz(root+n),.07,3.4),i*1400));
      bellTimer=setTimeout(go,TITLE_THEME.length*1400+6000);
      return;
    }
    const lvl=Math.max(0,Math.min(6,star));
    if (cfg.bells>0 && lvl>0){
      const det = lvl<=2 ? .986 : 1;
      const notes=BEATRICE_MOTIF.slice(0,lvl);
      notes.forEach((n,i)=>setTimeout(()=>bell(midiHz(root+12+n),.045+.012*lvl,2.6,musicBus,det),i*430));
    }
    bellTimer=setTimeout(go,Math.max(4000,10000-lvl*900-cfg.bells*1500+Math.random()*4000));
  };
  bellTimer=setTimeout(go,cfg.theme?900:2200);
}
function scheduleMotif(root){
  if (motifTimer) clearTimeout(motifTimer);
  if (!motifKey || !MOTIFS[motifKey]) return;
  const def=MOTIFS[motifKey];
  const go=()=>{
    if (!current || !motifKey) return;
    const len=playMotif(def,root+12);
    motifTimer=setTimeout(go,len*1000+9000+Math.random()*6000);
  };
  motifTimer=setTimeout(go,2800);
}
function setScene(regionKey,depthLvl,starLvl,motif){
  star=starLvl; motifKey=motif||null;
  if (!ensure()) return;
  if (ctx.state==='suspended') ctx.resume();
  depth=depthLvl;
  const cfg=REGION_CFG[regionKey]||REGION_CFG.darkwood;
  stopCurrent();
  const rootMidi = (regionKey==='stars'||regionKey==='purgatorio'||regionKey==='beatrice')
    ? 57 : regionKey==='title' ? 45 : 45-Math.min(9,depthLvl);
  rootNow=rootMidi;
  lp.frequency.setTargetAtTime(
    cfg.warm?3800:cfg.silence?5000:Math.max(340,2400-depthLvl*210),ctx.currentTime,1.2);
  const nodes=[],gains=[];
  cfg.drone.forEach((iv,ix)=>{
    const f=midiHz(rootMidi+iv);
    const a=osc(cfg.warm?'triangle':'sawtooth',f,(ix===0?.05:.028)*(cfg.warm?1.4:1),musicBus);
    a.o.detune.value=(ix%2?4:-4);nodes.push(a.o);gains.push(a.g);
    if (!cfg.warm){const b=osc('sine',f/2,.04,musicBus);nodes.push(b.o);gains.push(b.g);}
  });
  if (cfg.nLvl>0){
    const src=ctx.createBufferSource();src.buffer=noiseBuf();src.loop=true;
    const f=ctx.createBiquadFilter(),g=ctx.createGain();g.gain.value=0;
    const N={wind:['bandpass',400,.6],storm:['bandpass',700,.4],rain:['highpass',1800,.5],
      water:['lowpass',500,.8],marsh:['lowpass',260,1.2],fire:['bandpass',1300,.7],
      swarm:['bandpass',2400,3]}[cfg.noise]||['bandpass',500,1];
    f.type=N[0];f.frequency.value=N[1];f.Q.value=N[2];
    src.connect(f);f.connect(g);g.connect(musicBus);
    g.gain.setTargetAtTime(cfg.nLvl,ctx.currentTime,2);
    const lfo=ctx.createOscillator(),lg=ctx.createGain();
    lfo.frequency.value=cfg.noise==='storm'?.13:.05;lg.gain.value=N[1]*.5;
    lfo.connect(lg);lg.connect(f.frequency);lfo.start();
    src.start();nodes.push(src,lfo);gains.push(g);
  }
  if (cfg.shimmer){
    const s1=osc('sine',midiHz(rootMidi+36),.015,musicBus);
    const s2=osc('sine',midiHz(rootMidi+36)+2.7,.015,musicBus);
    nodes.push(s1.o,s2.o);gains.push(s1.g,s2.g);
  }
  if (cfg.birds){
    // Eden: brief random birdsong chirps, high and unhurried
    const chirp=()=>{ if(!current) return;
      const base=1800+Math.random()*1400, n=2+Math.floor(Math.random()*3);
      for(let i=0;i<n;i++) setTimeout(()=>{
        const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
        o.type='sine';o.frequency.setValueAtTime(base+Math.random()*300,t);
        o.frequency.exponentialRampToValueAtTime(base*1.3,t+.09);
        g.gain.setValueAtTime(.03,t);g.gain.exponentialRampToValueAtTime(.0001,t+.14);
        o.connect(g);g.connect(musicBus);o.start(t);o.stop(t+.16);
      }, i*140);
      birdTimer=setTimeout(chirp, 3000+Math.random()*7000); };
    birdTimer=setTimeout(chirp, 1500);
  }
  current={nodes,gains};
  if (pulseTimer) clearInterval(pulseTimer);
  if (cfg.silence){
    // Judecca: a sub you feel more than hear, and the ice settling
    pulseTimer=setInterval(()=>{ bell(31,.16,1.6);
      if (Math.random()<.4) setTimeout(()=>bell(2400+Math.random()*900,.018,.4),600+Math.random()*2000);
    },7000);
  } else if (cfg.heart){
    pulseTimer=setInterval(()=>{bell(38,.4,.28);setTimeout(()=>bell(34,.32,.3),300);},2300);
  } else if (cfg.pulse>0){
    pulseTimer=setInterval(()=>bell(midiHz(rootMidi-12),.12,.9),(20-cfg.pulse)*450);
  } else if (cfg.clank){
    pulseTimer=setInterval(()=>bell(midiHz(rootMidi+24+Math.floor(Math.random()*3)*5),.05,.15),2600);
  } else if (cfg.creak){
    pulseTimer=setInterval(()=>bell(midiHz(rootMidi+1),.05,1.8),5200);
  }
  scheduleBells(cfg,rootMidi);
  scheduleMotif(rootMidi);
}
function setStar(s){ star=s; }
/* one-shot accents — routed to the sfx bus */
function sting(kind){
  if (!ctx) return;
  const root=rootNow;
  const B=(f,v,d,dl=0)=>setTimeout(()=>bell(midiHz(f),v,d,sfxBus),dl);
  if (kind==='gleam') B(root+6,.1,1.4);
  else if (kind==='verse'){[0,4,7].forEach((n,i)=>B(root+24+n,.09,1.6,i*120));}
  else if (kind==='remember'){B(root+12,.12,2.4);B(root+19,.1,2.8,260);}
  else if (kind==='death') B(root-10,.3,3.2);
  else if (kind==='pity'){B(root+15,.08,1.8);B(root+12,.07,2.2,300);}
  else if (kind==='condemn'){B(root-5,.14,1.1);}
  else if (kind==='absolve'){[0,7,12,16].forEach((n,i)=>B(root+19+n,.06,2,i*150));}
  else if (kind==='punish'){
    // the blade: a slash of noise and a thud
    const t=ctx.currentTime,src=ctx.createBufferSource();src.buffer=noiseBuf();
    const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=950;f.Q.value=.9;
    const g=ctx.createGain();g.gain.setValueAtTime(.16,t);
    g.gain.exponentialRampToValueAtTime(.0001,t+.28);
    src.connect(f);f.connect(g);g.connect(sfxBus);src.start(t);src.stop(t+.3);
    B(root-14,.26,1.6,180);
  }
  else if (kind==='descend'){
    const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(midiHz(root+12),t);
    o.frequency.exponentialRampToValueAtTime(midiHz(root-10),t+.8);
    g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.0001,t+.9);
    o.connect(g);g.connect(sfxBus);o.start(t);o.stop(t+1);
  }
  else B(root+12,.06,.8);
}
function setPrefs(m,s){ prefs.music=!!m;prefs.sfx=!!s;
  if (ctx){ musicBus.gain.setTargetAtTime(prefs.music?.85:0,ctx.currentTime,.15);
    sfxBus.gain.setTargetAtTime(prefs.sfx?.9:0,ctx.currentTime,.15);} }
function toggleMusic(){ setPrefs(!prefs.music,prefs.sfx); return prefs.music; }
function toggleSfx(){ setPrefs(prefs.music,!prefs.sfx); return prefs.sfx; }
return { setScene,setStar,sting,setPrefs,toggleMusic,toggleSfx,
  get prefs(){return prefs;} };
})();
