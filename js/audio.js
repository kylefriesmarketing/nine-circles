/* =====================================================================
   NINE CIRCLES — audio.js
   Generative WebAudio score. No audio files.
   - Root note falls one semitone per depth level (A2 at the wood).
   - Region layers: drone, slow pulse, shaped noise (storm/rain/marsh/fire),
     ice shimmer, Lucifer heartbeat.
   - The Beatrice motif (small bells) plays only while the Star is lit;
     brighter star = more often, purer.
   ===================================================================== */
const AUDIO = (() => {
let ctx=null, master=null, lp=null, current=null, muted=false;
let star=4, depth=0, bellTimer=null, pulseTimer=null;

const REGION_CFG = {
  darkwood:{ noise:'wind', nLvl:.05, drone:[0,7],  pulse:0,    bells:1 },
  gate:    { noise:'wind', nLvl:.04, drone:[0,5],  pulse:14,   bells:1 },
  vestibule:{noise:'swarm',nLvl:.06, drone:[0,6],  pulse:0,    bells:0 },
  acheron: { noise:'water',nLvl:.07, drone:[0,7],  pulse:11,   bells:1 },
  limbo:   { noise:'wind', nLvl:.02, drone:[0,7,12],pulse:0,   bells:1, warm:1 },
  minos:   { noise:'wind', nLvl:.03, drone:[0,6],  pulse:7,    bells:0 },
  lust:    { noise:'storm',nLvl:.12, drone:[0,5],  pulse:0,    bells:1 },
  gluttony:{ noise:'rain', nLvl:.10, drone:[0,3],  pulse:0,    bells:0 },
  greed:   { noise:'wind', nLvl:.04, drone:[0,6],  pulse:5,    bells:0, clank:1 },
  styx:    { noise:'marsh',nLvl:.08, drone:[0,3],  pulse:9,    bells:0 },
  dis:     { noise:'fire', nLvl:.07, drone:[0,1],  pulse:6,    bells:0 },
  heresy:  { noise:'fire', nLvl:.08, drone:[0,4],  pulse:0,    bells:0 },
  wood:    { noise:'wind', nLvl:.06, drone:[0,2],  pulse:0,    bells:0, creak:1 },
  sand:    { noise:'fire', nLvl:.09, drone:[0,5],  pulse:0,    bells:0 },
  geryon:  { noise:'wind', nLvl:.10, drone:[0,4],  pulse:0,    bells:1 },
  malebolge:{noise:'fire', nLvl:.05, drone:[0,1],  pulse:4,    bells:0, clank:1 },
  ice:     { noise:'wind', nLvl:.03, drone:[0,7],  pulse:0,    bells:0, shimmer:1 },
  lucifer: { noise:'wind', nLvl:.05, drone:[0,1],  pulse:0,    bells:0, heart:1 },
  stars:   { noise:'wind', nLvl:.02, drone:[0,7,12],pulse:0,   bells:2, warm:1 },
  purgatorio:{noise:'water',nLvl:.04,drone:[0,7,12],pulse:0,   bells:2, warm:1 },
  beatrice:{ noise:'wind', nLvl:.01, drone:[0,7,12,16],pulse:0,bells:3, warm:1 },
};
const BEATRICE_MOTIF = [12,16,19,16,24,19];  // semitones above root — her theme
const midiHz = m => 440*Math.pow(2,(m-69)/12);

function ensure(){
  if (ctx) return true;
  try{
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = muted?0:.5;
    lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2400;
    lp.connect(master); master.connect(ctx.destination);
    return true;
  }catch(e){ return false; }
}
function noiseBuf(){
  const b = ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
  const d = b.getChannelData(0);
  for (let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
  return b;
}
function stopCurrent(){
  if (bellTimer){clearTimeout(bellTimer);bellTimer=null;}
  if (pulseTimer){clearInterval(pulseTimer);pulseTimer=null;}
  if (!current) return;
  const t = ctx.currentTime;
  current.gains.forEach(g=>{ try{g.gain.setTargetAtTime(0,t,.6);}catch(e){} });
  const dead = current;
  setTimeout(()=>dead.nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}}),2200);
  current=null;
}
function osc(type,freq,gainVal,dest){
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type=type; o.frequency.value=freq; g.gain.value=0;
  g.gain.setTargetAtTime(gainVal, ctx.currentTime, 1.5);
  o.connect(g); g.connect(dest); o.start();
  return {o,g};
}
function bell(freq, vol=.14, dur=2.2){
  if (!ctx || muted) return;
  const o=ctx.createOscillator(), g=ctx.createGain(), t=ctx.currentTime;
  o.type='sine'; o.frequency.value=freq;
  const o2=ctx.createOscillator(), g2=ctx.createGain();
  o2.type='sine'; o2.frequency.value=freq*2.76; g2.gain.value=vol*.25;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.015);
  g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  g2.gain.setValueAtTime(vol*.3,t); g2.gain.exponentialRampToValueAtTime(.0001,t+dur*.4);
  o.connect(g); o2.connect(g2); g.connect(lp); g2.connect(lp);
  o.start(t); o2.start(t); o.stop(t+dur+.1); o2.stop(t+dur+.1);
}
function scheduleBells(cfg, root){
  if (bellTimer) clearTimeout(bellTimer);
  const go=()=>{
    if (!current) return;
    const lvl = Math.max(0, star);
    if (cfg.bells>0 && lvl>=2){
      // play a fragment of the Beatrice motif; more of it the brighter the star
      const notes = BEATRICE_MOTIF.slice(0, 2+Math.min(4,lvl-1)+ (cfg.bells>=2?1:0));
      notes.forEach((n,i)=> setTimeout(()=>bell(midiHz(root+12+n), .05+.012*lvl, 2.6), i*430));
    }
    const wait = 9000 - lvl*900 - cfg.bells*1500 + Math.random()*4000;
    bellTimer = setTimeout(go, Math.max(3500, wait));
  };
  bellTimer = setTimeout(go, 1800);
}
function setScene(regionKey, depthLvl, starLvl){
  star = starLvl;
  if (!ensure()) return;
  if (ctx.state==='suspended') ctx.resume();
  depth = depthLvl;
  const cfg = REGION_CFG[regionKey] || REGION_CFG.darkwood;
  stopCurrent();
  const rootMidi = (regionKey==='stars'||regionKey==='purgatorio'||regionKey==='beatrice')
    ? 57 : 45 - Math.min(9,depthLvl);           // A2 falling a semitone per circle; dawn lifts an octave
  lp.frequency.setTargetAtTime(
    cfg.warm ? 3800 : Math.max(340, 2400-depthLvl*210), ctx.currentTime, 1.2);

  const nodes=[], gains=[];
  // drone
  cfg.drone.forEach((iv,ix)=>{
    const f=midiHz(rootMidi+iv);
    const a=osc(cfg.warm?'triangle':'sawtooth', f, (ix===0?.05:.028)*(cfg.warm?1.4:1), lp);
    a.o.detune.value=(ix%2?4:-4); nodes.push(a.o); gains.push(a.g);
    if (!cfg.warm){ const b=osc('sine', f/2, .04, lp); nodes.push(b.o); gains.push(b.g); }
  });
  // shaped noise
  if (cfg.nLvl>0){
    const src=ctx.createBufferSource(); src.buffer=noiseBuf(); src.loop=true;
    const f=ctx.createBiquadFilter(), g=ctx.createGain(); g.gain.value=0;
    const N={ wind:['bandpass',400,.6], storm:['bandpass',700,.4], rain:['highpass',1800,.5],
      water:['lowpass',500,.8], marsh:['lowpass',260,1.2], fire:['bandpass',1300,.7],
      swarm:['bandpass',2400,3] }[cfg.noise]||['bandpass',500,1];
    f.type=N[0]; f.frequency.value=N[1]; f.Q.value=N[2];
    src.connect(f); f.connect(g); g.connect(lp);
    g.gain.setTargetAtTime(cfg.nLvl, ctx.currentTime, 2);
    // slow LFO on the filter for weather movement
    const lfo=ctx.createOscillator(), lg=ctx.createGain();
    lfo.frequency.value = cfg.noise==='storm'?.13:.05; lg.gain.value=N[1]*.5;
    lfo.connect(lg); lg.connect(f.frequency); lfo.start();
    src.start(); nodes.push(src,lfo); gains.push(g);
  }
  // ice shimmer: detuned high sine pair
  if (cfg.shimmer){
    const s1=osc('sine', midiHz(rootMidi+36), .015, lp);
    const s2=osc('sine', midiHz(rootMidi+36)+2.7, .015, lp);
    nodes.push(s1.o,s2.o); gains.push(s1.g,s2.g);
  }
  current={nodes,gains};
  // pulse / heartbeat / clank / creak
  if (pulseTimer) clearInterval(pulseTimer);
  if (cfg.heart){
    pulseTimer=setInterval(()=>{ if(muted)return;
      bell(38,.4,.28); setTimeout(()=>bell(34,.32,.3),300); }, 2300);
  } else if (cfg.pulse>0){
    pulseTimer=setInterval(()=>{ if(muted)return;
      bell(midiHz(rootMidi-12),.12,.9); },(20-cfg.pulse)*450);
  } else if (cfg.clank){
    pulseTimer=setInterval(()=>{ if(muted)return;
      bell(midiHz(rootMidi+24+Math.floor(Math.random()*3)*5),.05,.15);},2600);
  } else if (cfg.creak){
    pulseTimer=setInterval(()=>{ if(muted)return;
      bell(midiHz(rootMidi+1),.05,1.8);},5200);
  }
  scheduleBells(cfg, rootMidi);
}
function setStar(s){ star=s; }
function sting(kind){           // one-shot accents on choices
  if (!ctx || muted) return;
  const root = 45-Math.min(9,depth);
  if (kind==='gleam') { bell(midiHz(root+6),.1,1.4); }        // tritone — temptation
  else if (kind==='verse') { [0,4,7].forEach((n,i)=>setTimeout(()=>bell(midiHz(root+24+n),.09,1.6),i*120)); }
  else if (kind==='remember') { bell(midiHz(root+12),.12,2.4); setTimeout(()=>bell(midiHz(root+19),.1,2.8),260); }
  else if (kind==='death') { bell(midiHz(root-10),.3,3.2); }
  else bell(midiHz(root+12),.06,.8);
}
function toggleMute(){ muted=!muted;
  if (master) master.gain.setTargetAtTime(muted?0:.5, ctx.currentTime, .2);
  return muted; }
return { setScene, setStar, sting, toggleMute, get muted(){return muted;} };
})();
