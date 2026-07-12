/* =====================================================================
   NINE CIRCLES — storyData.js
   ALL game content lives here. Engine-agnostic data.
   Node fields:
     region, title, text (string|fn(S,P)), enter(S,P)?, choices:[
       t (string|fn), pre?, req(S,P)?, verse:'v_id'? (ward: needs verse held),
       gleam:'sin'? (shimmers when that sin >= 3),
       sin:{...}?, heart?, virgil?, star?, learnVerse?, remember?, fx(S,P)?,
       go:'node'|fn, end:'ending'|fn ]
   Text may contain HTML. {NAME} = player name. Speech uses <em>.
   ===================================================================== */
const STORY = (() => {

/* ---------------- regions (depth 0..10 drives rail, music key, art key) -- */
const regions = {
  darkwood:  { name:'The Dark Wood',            depth:0 },
  gate:      { name:'The Gate',                 depth:0 },
  vestibule: { name:'The Vestibule',            depth:1 },
  acheron:   { name:'The River Acheron',        depth:1 },
  limbo:     { name:'The First Circle — Limbo', depth:1 },
  minos:     { name:'The Seat of Minos',        depth:2 },
  lust:      { name:'The Second Circle — the Whirlwind', depth:2 },
  gluttony:  { name:'The Third Circle — the Rain',       depth:3 },
  greed:     { name:'The Fourth Circle — the Wheels',    depth:4 },
  styx:      { name:'The Fifth Circle — the Marsh of Styx', depth:5 },
  dis:       { name:'The Walls of Dis',         depth:5 },
  heresy:    { name:'The Sixth Circle — the Burning Tombs', depth:6 },
  wood:      { name:'The Seventh Circle — the Wood of Suicides', depth:7 },
  sand:      { name:'The Seventh Circle — the Burning Sand',     depth:7 },
  geryon:    { name:'The Cliff of Fraud',       depth:7 },
  malebolge: { name:'The Eighth Circle — Malebolge', depth:8 },
  ice:       { name:'The Ninth Circle — Cocytus',    depth:9 },
  lucifer:   { name:'The Bottom of the World',  depth:9 },
  stars:     { name:'The Way Out',              depth:10 },
  purgatorio:{ name:'The Shore of the Mountain',depth:10, terrace:0 },
  beatrice:  { name:'The Earthly Paradise',     depth:10, terrace:9 },
  /* ----- ACT II: the Mountain ----- */
  pgate:     { name:'The Gate of the Mountain', depth:10, terrace:1 },
  t_pride:   { name:'The First Terrace — the Proud',     depth:10, terrace:2 },
  t_envy:    { name:'The Second Terrace — the Envious',  depth:10, terrace:3 },
  t_wrath:   { name:'The Third Terrace — the Smoke',     depth:10, terrace:4 },
  t_sloth:   { name:'The Fourth Terrace — the Runners',  depth:10, terrace:5 },
  t_greed:   { name:'The Fifth Terrace — the Bound',     depth:10, terrace:6 },
  t_gluttony:{ name:'The Sixth Terrace — the Hungering', depth:10, terrace:7 },
  t_lust:    { name:'The Seventh Terrace — the Fire',    depth:10, terrace:8 },
  pnight:    { name:'The Mountain by Night',    depth:10, terrace:4 },
  eden:      { name:'The Ancient Forest',       depth:10, terrace:9 },
  pageant:   { name:'The Procession',           depth:10, terrace:9 },
  lethe:     { name:'The Two Rivers',           depth:10, terrace:9 },
  /* ----- ACT III: the spheres ----- */
  moon:    { name:'The Sphere of the Moon',     depth:10, sphere:0 },
  venus:   { name:'The Spheres of Mercury and Venus', depth:10, sphere:1 },
  sunfire: { name:'The Sphere of the Sun',      depth:10, sphere:2 },
  mars:    { name:'The Sphere of Mars',         depth:10, sphere:3 },
  jupiter: { name:'The Sphere of Jupiter',      depth:10, sphere:4 },
  saturn:  { name:'The Ladder of Saturn',       depth:10, sphere:5 },
  rose:    { name:'The Rose',                   depth:10, sphere:6 },
};

/* ---------------- verses (exact Longfellow, verified against text/) ------ */
const verses = {
  v_midway: { title:'The Lost Road', src:'Inferno, Canto I',
    lines:['Midway upon the journey of our life','I found myself within a forest dark,','For the straightforward pathway had been lost.'] },
  v_gate:   { title:'The Inscription', src:'Inferno, Canto III',
    lines:['Through me the way is to the city dolent;','Through me the way is to eternal dole;','Through me the way among the people lost.'] },
  v_hope:   { title:'The Last Line of the Gate', src:'Inferno, Canto III',
    lines:['All hope abandon, ye who enter in!'] },
  v_sorrow: { title:'Francesca’s Sorrow', src:'Inferno, Canto V',
    lines:['There is no greater sorrow','Than to be mindful of the happy time','In misery.'] },
  v_brutes: { title:'Ulysses’ Charge', src:'Inferno, Canto XXVI',
    lines:['Consider ye the seed from which ye sprang;','Ye were not made to live like unto brutes,','But for pursuit of virtue and of knowledge.'] },
  v_stars:  { title:'Virgil’s Promise', src:'Inferno, Canto XXXIV',
    lines:['Thence we came forth to rebehold the stars.'] },
  v_love:   { title:'The Last Verse of All', src:'Paradiso, Canto XXXIII',
    lines:['The Love which moves the sun and the other stars.'] },
  /* ----- ACT II verses ----- */
  v_pia:    { title:'The Pia’s Whole Life', src:'Purgatorio, Canto V',
    lines:['Do thou remember me who am the Pia;','Siena made me, unmade me Maremma;'] },
  v_wind:   { title:'Oderisi’s Wind', src:'Purgatorio, Canto XI',
    lines:['Naught is this mundane rumour but a breath','Of wind, that comes now this way and now that,','And changes name, because it changes side.'] },
  v_crown:  { title:'The Guide’s Last Verse', src:'Purgatorio, Canto XXVII',
    lines:['Thee o’er thyself I therefore crown and mitre!'] },
  v_pure:   { title:'The Mountain’s Last Line', src:'Purgatorio, Canto XXXIII',
    lines:['Pure and disposed to mount unto the stars.'] },
  /* ----- ACT III verses ----- */
  v_peace:  { title:'Piccarda’s Sea', src:'Paradiso, Canto III',
    lines:['And his will is our peace; this is the sea'] },
  v_salt:   { title:'The Taste of Exile', src:'Paradiso, Canto XVII',
    lines:['Thou shalt have proof how savoureth of salt','The bread of others, and how hard a road','The going down and up another’s stairs.'] },
};
const VQ = id => '<span class="verse-quote">' + verses[id].lines.join('<br>') +
  '</span>';

/* Hell remembers: the souls recognize returning pilgrims.
   inscribed = their name stands on the Witness Wall (said above, forever);
   mercy / harm = your last verdict on them, from a previous descent. */
const soulMem = (S,P,id) => {
  const sm = souls[id] && souls[id].mem;
  if (!sm) return '';
  if (P.witness.includes(id)) return `<span class="mem">${sm.inscribed}</span>\n\n`;
  const m = S.memory && S.memory[id];
  if (!m) return '';
  const harsh = (m.last==='condemn' || m.last==='punish');
  return `<span class="mem">${harsh?sm.harm:sm.mercy}</span>\n\n`;
};

/* ---------------- witness souls (one per circle; the 9th is the Guide) --- */
const souls = {
  s_francesca:{ name:'Francesca da Rimini', circle:'Circle II — Lust',
    absolveLine:`You lift the star’s light and spend a candle of it, and the storm STUTTERS. For one heartbeat the two of them hang in still air — uncarried, unblown, holding — and Francesca looks up as if a window opened in the weather.\n\n<em>“Oh,”</em> she says. Just that. The wind takes them back, because the wind holds the lease. But it takes them <em>gently</em>, this once, and somewhere in the ribbons of the flying dead, a rumor begins that the sky blinked.`,
    punishLine:`The scythe passes through the whirlwind and the whirlwind SCREAMS — a new note, one it did not have before, and the flying dead scatter from it like starlings from a shot.\n\nThe two of them are gone into the black of the storm. You have punished the punished, and Hell — listen — Hell does not object. That is the worst review your arm has ever received.`,
    mem:{
      inscribed:`“You came back,” she says, before you can speak. “I felt it, you know — every time you say my name up there, the wind loses its grip on me for exactly that long. Paolo counts the seconds. We hoard them like bread.”`,
      mercy:`“You,” she says softly, knowing you at once. “The gentle one. The storm remembers gentleness — it has so little else to file.”`,
      harm:`“You,” she says, and the wind goes a degree colder around her. “The one who reads verdicts. Have you come to deliver another, or has the book found a kinder page?”` },
    absolveChoice:'Absolve the storm’s two prisoners — spend a candle on the weather itself.',
    punishChoice:'Put the blade through the wind that carries them.',
    epi:{
      remember:`At a dinner, some month from now, you will say her name and the table will go quiet the right way — and somewhere a storm loses its grip for exactly that long.`,
      absolve:`The whirlwind still carries them — but the wind remembers being refused once, and carries them, ever after, a fraction gentler.`,
      punish:`The storm has a new note now, and on certain nights you can hear it in ordinary wind — the one you gave it. It does not thank you.` } },
  s_ciacco:   { name:'Ciacco of Florence',  circle:'Circle III — Gluttony',
    absolveLine:`A candle of the star, spent — and over one patch of mud, one body’s length of Hell, the rain STOPS.\n\nCiacco lies in the dry like a man in clean sheets. He does not speak. He breathes — the dead don’t need to, which is how you know it’s a luxury — one long dry breath seven hundred years in arrears. The rain resumes, because rain is the law here. But he looked, for a moment, like a man at a table among friends.`,
    punishLine:`The scythe comes down and the rain comes down harder, as if in applause. What was Ciacco is spread thinner into the mud that was already mostly him.\n\nThe three-headed dog howls approval in a chord. You have made the circle of appetite a little more appetizing, and the rain washes your arm clean with unsettling efficiency.`,
    mem:{
      inscribed:`He struggles upright before you even reach him. “The DINNER,” he beams through the rain. “Someone said my name at a table — I FELT it, warm, here—” he thumps his sternum. “The rain stopped for one whole breath. You kept it. You actually kept it.”`,
      mercy:`“The kind visitor,” he says, sitting up faster this time. “I told the mud about you. The mud was skeptical.”`,
      harm:`He does not sit all the way up this time. “Come to tell me again what I already am? The rain covers that department, friend. Thoroughly.”` },
    absolveChoice:'Spend a candle to buy the Hog one dry breath.',
    punishChoice:'Give the rain a sharper edge.',
    epi:{
      remember:`Once a year, at a full table, you say “Ciacco” over the bread — and the guests take it for a toast, and in a way it is, and somewhere the rain holds one breath.`,
      absolve:`One dry breath in seven hundred years. He tells the mud about it, often. The mud has stopped being skeptical.`,
      punish:`The rain fell harder on one patch of mud, once, at your arm’s instruction. The dog approved. You carry the dog’s approval.` } },
  s_forgotten:{ name:'———, the Forgotten', circle:'Circle IV — Greed',
    absolveLine:`You spend the light, and for one instant — one — his face is not a worn coin. Something surfaces: two syllables, rising through the mud of him like a bubble from the marsh below.\n\nHis mouth shapes the first one. Then it is gone, sunk again, and his face is smooth as ever. But he weeps like a sailor who saw land — no arrival, only the mercy of the sighting — and pushes his little stone on with something almost like posture.`,
    punishLine:`The scythe splits the boulder, not the man — and the man SCREAMS, because the boulder was the last thing that was his.\n\nHe gathers the halves like children and pushes them separately now, twice the laps, half the stone. The wheel does not slow. Around you, hoarders and squanderers nod at the arithmetic: everything down here divides, and nothing subtracts.`,
    mem:{
      inscribed:`The bent shade stops his stone before you find him. “Someone remembers THAT I WAS,” he whispers. “Not the name — there is no name — but the was. It reached me like a coin dropped down a well. I have been listening to it ring ever since.”`,
      mercy:`He looks up, almost recognizing. “You stopped, before,” he says. “Nobody stops twice. What are you?”`,
      harm:`He flinches from your shadow before he sees you. “The auditor,” he says, gripping his stone. “Back for the rest of me. There is so little left to assess.”` },
    absolveChoice:'Spend a candle on a man with no name to bill it to.',
    punishChoice:'Split the stone he cannot stop pushing.',
    epi:{
      remember:`You keep the empty space like a coin with no face. When ledgers cross your desk now you read the names in them aloud, all of them, just in case one was his.`,
      absolve:`Two syllables surfaced once, and sank again — but he pushes the stone like a man who saw land now, and that is a different man.`,
      punish:`He pushes two half-stones now, twice the laps. Everything down there divides and nothing subtracts — you proved the theorem on a man.` } },
  s_sullen:   { name:'The Sullen One',      circle:'Circle V — the Marsh',
    absolveLine:`You spend a candle over the black water, and the marsh EXHALES.\n\nEvery bubble she never let rise comes up at once — a lifetime of held mornings, breaking the surface in one long silver rope — and for a moment the Styx sounds like a kitchen at dawn: something rinsing, someone humming, a window with sun in it.\n\nThe mud reseals, because the mud is the sentence. But she goes down lighter. You heard her go down lighter.`,
    punishLine:`The scythe goes into the marsh and the marsh accepts it the way it accepts everything — sullenly.\n\nThe bubbles stop. That is all. The one voice down there that had finally learned to speak goes back to what it knew best, and the silence you have purchased sounds exactly like the silence she made all her life. Hell notes, in its ledger, no change.`,
    mem:{
      inscribed:`The bubbles rise to meet you, arranged, almost eager. “You said it aloud — up there, in the sweet air,” the voice gurgles. “I heard my own story travel DOWN for once. It sounded almost like a song when it arrived.”`,
      mercy:`“The one who knelt,” the marsh says, before you kneel. “I kept the ripples you left. The mud lets me keep so little.”`,
      harm:`The bubbles hesitate at your shadow. “You again,” the water says flatly. “Come to grade my grief a second time?”` },
    absolveChoice:'Spend a candle beneath the black water — light, where light was refused.',
    punishChoice:'Silence the marsh’s one confessing voice.',
    epi:{
      remember:`Some mornings now you sing in the next room with the door open. You never explain it. It was never for the room.`,
      absolve:`The marsh exhaled a lifetime, once. The bubbles rise in rhythm now — all of them — as if the water learned the song.`,
      punish:`The bubbles stopped. The silence you bought sounds exactly like the silence she kept all her life. Hell logged no change, and billed you anyway.` } },
  s_cavalcante:{name:'Cavalcante, a Father',circle:'Circle VI — Heresy',
    absolveLine:`You spend the light over the burning tomb, and the old man stops sinking.\n\nHe looks at you — through you — at something over your shoulder that is not there, and his face floods with a certainty no evidence has ever supplied: <em>“He lives,”</em> he says. <em>“My son lives. I can feel the light on him from here.”</em>\n\nIt is not true and it is not false; it is absolved. He goes down into the fire the way a man goes down to dinner.`,
    punishLine:`The scythe rings on the tomb’s rim like a bell in an empty church, and the lid — which never closes — grows visibly heavier.\n\nThe old man’s eyes find yours as he sinks, and there is no reproach in them, which is unbearable. He spent his life believing nothing outlasts the body. You have just spent your arm confirming it.`,
    mem:{
      inscribed:`He rises already reaching for you. “You TOLD someone,” he says, wet-eyed. “About a father who asks. A living voice said his name and MINE in one sentence — I heard it land down here, like light coming through the lid.”`,
      mercy:`“The kind stranger,” he says, rising with something like hope's posture. “You were gentle with an old man's question once. Ask me anything — my turn is centuries overdue.”`,
      harm:`He rises more slowly this time, guarded. “The silent one. Or was it the honest one — the two blur, down here. Both leave a man burning either way.”` },
    absolveChoice:'Spend a candle on a father’s open question.',
    punishChoice:'Ring the blade on the tomb’s rim, and let the lid grow heavier.',
    epi:{
      remember:`You found where his line ended, and said the father’s name to it. Whether it reached the tomb or the son — the saying was the point.`,
      absolve:`“He lives. I can feel the light on him.” It is not true and it is not false; it is absolved — and he goes down into the fire the way a man goes down to dinner.`,
      punish:`The lid grows heavier, and he never once reproached you, and there are nights you would trade a great deal for the reproach.` } },
  s_pier:     { name:'Pier delle Vigne',    circle:'Circle VII — the Wood',
    absolveLine:`You spend a candle of the star on the bleeding tree, and — slowly, at the tip of one warped branch — a single leaf turns GREEN.\n\nOne leaf. In the whole gray wood, one. The Harpies go silent, staring at it like auditors at an impossible figure. It will not last; nothing here lasts except lasting. But every tree in the forest of the hopeless is leaning toward it, and the lean is the prayer.`,
    punishLine:`You put the scythe into the tree that was the emperor’s right hand, and the wood screams in exactly the voice you have been trying not to imagine.\n\nThe Harpies descend before the sap stops — leaves are food here, and wounds are the menu. What was left of a faithful man feeds the things that lament him. The whispers, wherever they are, add your name to the minutes.`,
    mem:{
      inscribed:`The leaves go still as you approach — all of them, the whole grove attending. “The advocate,” the tree says. “Somewhere above, my name is said WHOLE again. No pause in it. The Harpies nest elsewhere now; they dislike the taste of vindication.”`,
      mercy:`“You bound my wound once,” the bleeding voice says as you near. “Sap remembers. Wood keeps every kindness in its rings.”`,
      harm:`The branches draw back from your reach. “The prosecutor returns,” the voice says. “Break nothing this visit. The whispers already took everything breakable.”` },
    absolveChoice:'Spend a candle on the wood that kept faith.',
    punishChoice:'Prune the emperor’s tree.',
    epi:{
      remember:`When a room goes quiet at someone’s name a half-second too long, you say the name again — whole, on purpose. Somewhere a tree grows one ring more of green.`,
      absolve:`One leaf, green, in the whole gray wood. The Harpies will not nest in that tree anymore, and the grove leans toward it in a wind nobody feels.`,
      punish:`The Harpies fed because of you, and the whispers, wherever they are, kept the minutes. Your name is in a wood’s ledger now.` } },
  s_ulysses:  { name:'Ulysses',             circle:'Circle VIII — Fraud',
    absolveLine:`You raise the star’s light to the horned flame — and the flame leans away, courteous as a man declining a chair.\n\n<em>“Save the candle, pilgrim,”</em> the voice says, and it is almost fond. <em>“Absolve me and I am only a sailor with no sentence, and a sailor with no sentence SAILS. We would be back here within the year, both of us. Spend your light on the ones who want doors. I never met a door I didn’t take personally.”</em>\n\nThe flame walks its trench. The absolution counts — Heaven scores the offer, not the acceptance — but he has, of course, the last word. He always had the last word.`,
    punishLine:`The scythe passes through the horned flame and the flame divides — and REJOINS, laughing, the way water laughs at swords.\n\n<em>“I burned for eight centuries before you were a rumor,”</em> the voice says, not unkindly. <em>“Fire is not punished by edges. But I will tell the demons you tried; they collect attempts.”</em> Somewhere below, something with tusks writes it down.`,
    mem:{
      inscribed:`The horned flame leans out before you hail it. “They say it above — ‘he sailed.’ I have heard it through the rock, pilgrim. Twice now.” The flame bows, courtly. “The sentence stands. But the STORY got out. In my trade, that is called reaching port.”`,
      mercy:`“The listener,” the flame says, warming. “Back for another tale? I have thirty more voyages in here and one honest regret. Choose carefully which you ask for.”`,
      harm:`The flame draws itself up tall. “The judge returns. Very well — file your verdicts, pilgrim. I outlasted Troy. I will outlast your paperwork.”` },
    absolveChoice:'Offer a candle to the flame that asks for nothing.',
    punishChoice:'Test the edge against fire itself.',
    epi:{
      remember:`You tell the voyage with the ending included, and people still lean in. “He sailed” — you keep the promise with both words.`,
      absolve:`He declined the candle, courtly to the last — and Heaven, you were told, scores the offer. Somewhere the account of you both reads: attempted.`,
      punish:`Fire is not punished by edges. The demons collect attempts; yours is filed. He tells the story at parties now — you are the punchline.` } },
  s_ugolino:  { name:'Count Ugolino',       circle:'Circle IX — the Ice',
    absolveLine:`You spend the light over the two frozen together, and the frost around Ugolino’s eyes recedes — an inch, a thaw the width of a word.\n\nHe sets the skull down. Sets it down — the first release in seven hundred years — and looks at his hands as if they had returned from a long journey. <em>“One hour,”</em> he says, to no one. <em>“Give a man one hour off from hating and he remembers everything else.”</em> He weeps, and the tears freeze, and he takes the skull back up. But there was an hour in him. You saw it.`,
    punishLine:`The scythe hums against the ice and the ice hums back, louder — and the blade stops a hand’s width from the frozen men, refused.\n\nEven Death’s edge defers to this lake. What is sealed in Cocytus was sentenced by an older court than the one that issued your blade. Ugolino watches the scythe withdraw with professional interest: he too once held an instrument he could not use.`,
    mem:{
      inscribed:`He sets the skull down when he sees you — down, on his own, unasked. “The children's names,” he says, plainly. “Said in sunlight. Gaddo. Uguccione. I felt each one arrive like bread.” The frost around his eyes has never refrozen quite right since.`,
      mercy:`He lifts his mouth from the skull unbidden. “The one who traded grief for grief,” he says. “Grief remembers its creditors.”`,
      harm:`He does not lift his mouth. Between bites, muffled: “The magistrate returns. Hell is FULL of magistrates. The ice files you all under one heading.”` },
    absolveChoice:'Spend a candle on the frost around his eyes.',
    punishChoice:'Let the blade argue with the ice.',
    epi:{
      remember:`Gaddo. Uguccione. Said in sunlight, every year — and the frost around a count’s eyes never quite refreezes right.`,
      absolve:`An hour off from hating, once. He still describes it to the ice — the hour a stranger bought him; the taste of setting the skull down.`,
      punish:`Even Death’s edge deferred to that lake. Your swing is the only thing Cocytus ever refused — carry the distinction carefully.` } },
  s_virgil:   { name:'Virgil, the Guide',   circle:'Circle I — Limbo' },
};

/* ---------------- ACT II: prayers of the mountain ------------------------ */
/* The inversion of Remembrance: the penitents don't beg to be remembered —
   they beg you to carry requests UP to the living. Prayers weigh nothing.
   You may carry as many as you are given. That is the whole difference. */
const prayers = {
  pr_manfred:{ giver:'Manfred', ask:'Tell my daughter Constance her father is not lost — only slow.' },
  pr_pia:    { giver:'La Pia',  ask:'Remember me, who am the Pia. That is the whole request.' },
  pr_belacqua:{giver:'Belacqua',ask:'If someone up there prays for me — fine. No rush. Truly.' },
  pr_oderisi:{ giver:'Oderisi', ask:'Not for me. For Provenzan, who out-shone me. Pray HIS name.' },
  pr_sapia:  { giver:'Sapia',   ask:'Tell my kin in Siena that envy ends. Tell them how it ends.' },
  pr_marco:  { giver:'Marco Lombardo', ask:'Pray for me when you stand in the sweet air and choose freely.' },
  pr_arnaut: { giver:'Arnaut',  ask:'Be mindful, in due season, of my pain.' },
  pr_hollow: { giver:'The Hollowed Singer', ask:'My sister sets two plates still. Tell her one is enough now.' },
};
/* ACT III: the questions you may carry (the last collectible — you rose
   carrying names, then prayers, and finally only what you still want to know) */
const questions = {
  q_peace:'Can peace and wanting share one bed?',
  q_wind: 'Does love outlast the thing it loved?',
  q_blade:'Can justice love what it corrects?',
  q_salt: 'Is the truth worth the taste of exile?',
  q_eye:  'Does the Eagle ever weep?',
  q_name: 'What were the names FOR, in the end?',
};
/* record-readers for the interviews — the blessed quiz you on your own history */
const answer = (S,P,truthy) => {
  if (truthy){ S.lumen=Math.min(9,(S.lumen||0)+1); S.flags.lastTruth=1; }
  else { S.lies=(S.lies||0)+1; S.lumen=Math.max(0,(S.lumen||0)-1); S.flags.lastTruth=0; }
};
const rlDeaths = P => (P.runsLog||[]).filter(r=>r.kind==='death').length;
const rlVerb = (P,verb) => (P.runsLog||[]).reduce((n,r)=>n+Object.values(r.judged||{}).filter(v=>v===verb).length,0);
const rlMercy = P => rlVerb(P,'pity')+rlVerb(P,'absolve')+rlVerb(P,'remember');
const rlHarm  = P => rlVerb(P,'condemn')+rlVerb(P,'punish');
const darkOwned = P => P.endings['e_trade']?'trade':P.endings['e_scythe']?'scythe':P.endings['e_throne']?'throne':null;
const burdenTotal = S => { let t=0; for (const k in (S.burdens||{})) t+=S.burdens[k]; return t; };
const psWiped = S => Object.keys(S.ps||{}).filter(k=>S.ps[k]).length;
const seedAscent = (S,src) => {
  S.act='purgatorio'; S.pace=0; S.dayPhase=0; S.prayers=S.prayers||[];
  S.ps={pride:0,envy:0,wrath:0,sloth:0,greed:0,gluttony:0,lust:0};
  S.burdens={};
  for (const k in S.ps){
    const v = src && src[k] ? src[k] : 2;
    S.burdens[k]=Math.max(1,Math.min(6,Math.ceil(v)));
  }
};

/* ---------------- helpers used by node functions ------------------------- */
const domSin = S => { let m='pride',v=-1;
  for (const k in S.sins) if (S.sins[k]>v){v=S.sins[k];m=k;} return v>0?m:null; };
const domRes = P => { let m=null,v=1.5;
  for (const k in (P.residue||{})) if (P.residue[k]>v){v=P.residue[k];m=k;} return m; };
const SIN_NODE = { lust:'n_storm', gluttony:'n_c3_rain', greed:'n_c4_plutus',
  wrath:'n_c5_styx', sloth:'n_c5_styx', pride:'n_c6_tombs', envy:'n_c7_wood' };
const SIN_WORD = { pride:'pride', envy:'envy', wrath:'wrath', sloth:'sloth',
  greed:'greed', gluttony:'appetite', lust:'longing' };

/* Virgil's asides — the guide reacts to who you are becoming.
   Appended to circle-arrival texts; returns '' when he has nothing to say. */
const V_WARN = {
  lust:`<em>“Walk the middle of the road here,”</em> the poet says, not looking at you. <em>“The storm has read your ledger, {NAME}, and it packs for the journey.”</em>`,
  gluttony:`<em>“Breathe shallow on this floor,”</em> the poet murmurs. <em>“Appetite is a weather, and you arrive already damp with it.”</em>`,
  greed:`<em>“Hands inside your cloak on this terrace,”</em> the poet says. <em>“Not everything that can be held should learn your grip.”</em>`,
  wrath:`<em>“Your jaw has been set since two circles up,”</em> the poet observes. <em>“Unset it. This marsh waters what you are growing.”</em>`,
  sloth:`<em>“Keep walking,”</em> the poet says, more gently than usual. <em>“Whatever in you wants to sit down and be finished — this is the floor that furnishes chairs.”</em>`,
  pride:`<em>“Stand as tall as you must,”</em> the poet says drily. <em>“Only note that the tombs on this floor are measured for exactly that posture.”</em>`,
  envy:`<em>“You keep looking at what the trees kept,”</em> the poet says. <em>“Look instead at what they lost. It is the same inventory, read in the correct order.”</em>`,
};
const vA = (S,P,key) => {
  if (S.virgil<=1)
    return `\n\nThe poet walks a little apart from you now, and offers nothing.`;
  const sin = key==='styx' ? (S.sins.sloth>S.sins.wrath?'sloth':'wrath') : key;
  if (key==='ice'){
    if (S.flags.scythe) return `\n\n<em>“Sheathe the edge here,”</em> the poet says quietly. <em>“This lake was sentenced by an older court than your blade’s. And it is watching.”</em>`;
    if (S.names.length>=3) return `\n\n<em>“Three names, all spent,”</em> the poet says. <em>“Whatever begs you from the ice tonight, {NAME} — you have nothing left to give it but witness. Sometimes that is the better coin.”</em>`;
    if (S.names.length===0) return `\n\n<em>“You carried no one, in the end,”</em> the poet says, without judgment, which is worse. <em>“The ice will not remark on it. The ice remarks on nothing.”</em>`;
    return '';
  }
  if (S.flags.scythe && key==='gluttony')
    return `\n\n<em>“Must you carry that on your shoulder?”</em> the poet sighs. <em>“The dead keep mistaking you for their appointment. The dog will be no different.”</em>`;
  if (V_WARN[sin] && S.sins[sin]>=4) return `\n\n`+V_WARN[sin];
  if (S.heart<=-4 && !S.flags.vHeartS){ S.flags.vHeartS=1;
    return `\n\n<em>“You have not wept once,”</em> the poet observes, without turning. <em>“I do not require it. But mind what you are practicing, {NAME}. Every floor of this establishment began as somebody’s habit.”</em>`; }
  if (S.heart>=5 && !S.flags.vHeartF){ S.flags.vHeartF=1;
    return `\n\n<em>“Dry your eyes before this next one,”</em> the poet says — gently, which is how you know it matters. <em>“Not because the grief is wrong. Because you will need to SEE, and drowned eyes read every door as a wall.”</em>`; }
  return '';
};

/* ======================================================================
   NODES
   ====================================================================== */
const nodes = {

/* ---------------- PROLOGUE ---------------- */
n_wake: { region:'darkwood', title:'Midway',
  text:`You wake standing up, which is wrong, in a wood you never entered, which is worse.\n\nThe trees are black and patient. Somewhere above them there is supposed to be a sky. You cannot remember the road that brought you here — only that there was a road, and that you were on it for exactly half of your life.\n\nFar off, uphill, a thin blade of light.`,
  choices:[
    { t:'Push toward the light on the hill.', go:'n_beasts' },
    { t:'Study the trees. They look almost like a verse.', learnVerse:'v_midway', star:1,
      fx:S=>S.flags.readWood=1, go:'n_wake2' },
    { t:'Call out. Someone must be walking their dog.', star:-1, go:'n_wake2',
      fx:S=>S.flags.called=1 },
    { t:'Lie down. Whatever this is, it can wait until morning.', gleam:'sloth',
      sin:{sloth:2}, end:'e_wood' },
  ]},
n_wake2: { region:'darkwood', title:'The Wood Considers You',
  text:S=> (S.flags.readWood
    ? `The bark is carved. Not by knives — by the wood itself, growing around an idea:\n${VQ('v_midway')}You have the strange feeling the verse was left here for you specifically, the way a coat is left for someone expected home late.`
    : `Your voice goes out and nothing comes back. Not an echo. The wood simply keeps it.\n\nThe silence afterward has a texture, like held breath.`)
    + `\n\nUphill, the light again. It hasn’t moved. It is waiting too.`,
  choices:[
    { t:'Climb toward the light.', go:'n_beasts' },
    { t:'Walk deeper into the dark instead, out of spite.', sin:{wrath:1}, go:'n_beasts',
      fx:S=>S.flags.spite=1 },
    { t:'Sit against a trunk and close your eyes.', gleam:'sloth', sin:{sloth:2}, end:'e_wood' },
  ]},
n_beasts: { region:'darkwood', title:'Three Shapes on the Hill',
  text:`You are ten steps up the slope when the leopard uncoils from a branch — spotted, gorgeous, wrong. Behind it a lion, whose hunger you can hear. And behind the lion, worst of all, a she-wolf: gaunt, endless, wearing every craving you have ever had like a coat of many furs.\n\nShe looks at you the way a ledger looks at a debt.`,
  choices:[
    { t:'Charge past them. The light is right there.', sin:{wrath:1}, go:'n_death',
      fx:S=>S.flags.charged=1 },
    { t:'Back away slowly, downhill, into the dark.', go:'n_death' },
    { t:'Throw stones. Wolves are just dogs with bad press.', sin:{wrath:2}, virgil:0,
      go:'n_death', fx:S=>S.flags.stoned=1 },
    { t:'Give up. Return to the wood. It was quieter there.', gleam:'sloth', sin:{sloth:2},
      end:'e_wood' },
  ]},
n_death: { region:'darkwood', title:'The First Collector',
  text:S=>(S.flags.charged?`The she-wolf hits you like a bill come due and you are rolling downhill, `:
    S.flags.stoned?`The stones pass through her. Of course they do. You are stumbling backward, `:
    `You retreat, and the wolf follows at exactly the speed of your retreating, `)
    +`down to where the sun is silent — and the wolf stops. Sits. Waits, suddenly polite, the way a dog waits when its owner has arrived.\n\nThe cold comes first. Then the shape the cold is wearing: tall past reason, robed in an absence of everything, and carrying — with the offhand ease of a farmer at the end of a row — a scythe whose blade is a held breath.\n\nDeath consults something. A ledger, or the idea of one.\n\n<em>“You are early,”</em> it says, in a voice like a door closing in another house. <em>“Or the wood is. Either way: alive, in the borderlands, at the mid-point exact. That is a filing error, and I am”</em> — the blade turns, idly, catching no light there is — <em>“the eraser.”</em>`,
  choices:[
    { t:'Wrestle the scythe from its hands. If Death wants you, Death can queue.',
      gleam:'pride', sin:{pride:2,wrath:1}, star:-1,
      fx:S=>{S.flags.scythe=1;S.flags.deathMet=1;}, go:'n_virgil' },
    { t:'Stand your ground, hands empty. “I am not finished. Check the arithmetic.”',
      star:1, fx:S=>S.flags.deathMet=1, go:'n_virgil' },
    { t:'Plead. Bargain. Offer it literally anything else.', sin:{greed:1},
      fx:S=>S.flags.deathMet=1, go:'n_virgil' },
    { t:'Take the bony hand. It’s been a long half-life anyway.', star:-1,
      fx:S=>{S.flags.deathMet=1;S.flags.refused=1;}, go:'n_virgil' },
  ]},
n_virgil: { region:'darkwood', title:'One Who Seems Faint Through Silence',
  text:S=>(S.flags.scythe?`It should not have worked. It worked. Your hands remember the wrenching cold of the haft, and then Death was simply — smaller, and then absent, unraveling backward with what you would swear was a shrug of professional relief, like a man whose shift found its own replacement.\n\nThe scythe is yours. It weighs nothing, which is the heaviest thing about it.\n\nThen, `
    :S.flags.refused?`The bony hand pauses an inch from yours. Withdraws. Death re-consults the ledger with the special weariness of middle management everywhere.\n\n<em>“No,”</em> it says. <em>“Unripe. The paperwork objects. Come back when you have finished becoming whatever this is.”</em> And it folds away into the general dark, leaving you — rejected by Death, which stings more than you would have guessed.\n\nThen, `
    :S.flags.deathMet?`Death regards you for the length of one missed heartbeat. Then it closes the ledger.\n\n<em>“Hm,”</em> it says. <em>“A surety has been posted for this one. A lady’s name, in a hand that outranks mine.”</em> It withdraws into the dark it was wearing, unhurried, a collector who knows every debt keeps.\n\nThen, `
    :`Then, `)
    +`in the ruined light, stands a figure. Hollow, dignified, faded like a fresco of himself.\n\n<em>“Not a man,”</em> he says, before you can ask. <em>“A man I once was. A poet, of Rome. And you are alive, which is against several rules, and lost, which is against none. There is no way past the wolf. The only way out is down — through the dead lands, to the far side of everything. I have made the walk before.”</em>`
    +(S.flags.scythe?`\n\nHis eyes drop to the scythe and stay there a long, Roman moment.\n\n<em>“That,”</em> he says finally, <em>“is going to complicate the customs.”</em>`:`\n\nHe waits. Poets are good at waiting.`),
  choices:[
    { t:'“Who sent you?”', go:'n_virgil_lore' },
    { t:'“Lead, poet. I’ll follow.”', virgil:1, go:'n_gate' },
    { t:'“I’ll find my own way, thanks.”', virgil:-1, go:'n_ownway' },
    { t:'“A poet? Recite something first. Prove it.”', go:'n_virgil_recite' },
  ]},
n_virgil_lore: { region:'darkwood', title:'A Lady of Light',
  text:`Something almost warm crosses the ruin of his face.\n\n<em>“A lady came down to me — down, to Limbo, where I am kept — with eyes brighter than the star. She wept when she asked it, and Heaven’s weeping is not refused. She watches you, {NAME}. From a very great height. If you can keep even a splinter of her light with you down there, keep it. The dark below has a way of… negotiating.”</em>\n\nAbove the wood, briefly, one star out-burns the rest — then banks itself like an ember, saving its light for later.`,
  choices:[
    { t:'“Then lead. I’ll try to be worth the weeping.”', virgil:1, star:1, go:'n_gate' },
    { t:'“What exactly is below?”', go:'n_virgil_below' },
    { t:'“Watching me? That’s unsettling, honestly.”', star:-1, go:'n_gate' },
  ]},
n_virgil_below: { region:'darkwood', title:'The Shape of the Pit',
  text:`<em>“A funnel,”</em> he says. <em>“Nine circles, each narrower and heavier than the last. The dead are sorted by the thing they could not put down. You will hear them cry out for the second death — and some will beg you for something stranger than mercy.”</em>\n\n<em>“They will beg to be remembered. Up in the sweet world. It is the only coin the dead still recognize. You cannot carry many names through that dark, {NAME} — three, perhaps, in a mouth as young as yours. Choose whose.”</em>`,
  choices:[
    { t:'“Three names. I understand. Lead on.”', virgil:1, go:'n_gate' },
    { t:'“Why would I do the dead any favors?”', heart:-1, go:'n_gate' },
    { t:'“That’s the saddest thing I’ve ever heard.”', heart:1, go:'n_gate' },
  ]},
n_virgil_recite: { region:'darkwood', title:'Proof',
  text:`He does not clear his throat. He simply begins, and the wood leans in — the actual trees, tilting like sunflowers toward a colder sun. He gives you arms and a man, gives you burning Troy carried out on a son’s shoulders, and stops mid-line, precisely where it hurts.\n\n<em>“Satisfied? I have been rehearsing for thirteen centuries. Audiences are scarce where I am kept.”</em>`,
  choices:[
    { t:'Applaud. In a dark wood. Alone. Worth it.', virgil:1, go:'n_gate' },
    { t:'“Where you’re kept?”', go:'n_virgil_lore' },
    { t:'“Good enough. Walk.”', go:'n_gate' },
  ]},
n_ownway: { region:'darkwood', title:'Your Own Way',
  text:`You set off alone, at a confident angle. The wood rotates gently around you, like a patient card trick, and delivers you back to the clearing. The she-wolf is closer now. She has brought her appetite and its extended family.\n\nThe poet has not moved. He does not say anything so vulgar as <em>I told you so</em>; he merely exists at you, Romanly.`,
  choices:[
    { t:'“Fine. Lead.”', go:'n_gate' },
    { t:'Try a different angle. You almost had it.', sin:{pride:2}, end:'e_wood' },
  ]},

/* ---------------- GATE & VESTIBULE ---------------- */
n_gate: { region:'gate', title:'Words in Sombre Colour',
  text:`The gate is not locked. That is the first horror: nothing here needs to keep anyone in.\n\nCarved above the arch, in letters that seem older than letters:\n${VQ('v_gate')}And beneath, alone, the last line — the one that everyone remembers:\n${VQ('v_hope')}The poet watches you read. <em>“Here,”</em> he says, <em>“one must abandon distrust. Cowardice must die at this doorstep. Beyond it, keep everything else you have.”</em>`,
  choices:[
    { t:'Read the inscription aloud. Own it.', learnVerse:'v_gate', go:'n_gate2' },
    { t:'Reach up and touch the last line.', learnVerse:'v_hope', go:'n_gate2' },
    { t:'Walk through without ceremony.', go:'n_vestibule' },
    { pre:'speak the verse', verse:'v_midway',
      t:'“Midway upon the journey of our life…” — enter as one already lost, and so unafraid.',
      star:1, virgil:1, go:'n_vestibule' },
    { t:'Turn back. There has to be another way.', virgil:-2, end:'e_wood' },
  ]},
n_gate2: { region:'gate', title:'The Words Answer',
  text:S=>(S.verses.includes('v_hope')
    ? `The carved line is warm under your fingers, like a stove that was burning an hour ago. When you take your hand away, the words come with it — settled into you, a stone in the pocket of your mind.\n\n<em>“Careful,”</em> says the poet. <em>“That is the heaviest verse ever cut. Carried rightly, even that one can be made to shine. I have seen it done once.”</em>`
    : `Your voice makes the arch ring, faintly, a bell struck in a drowned tower. The verse stays with you when you finish — you can feel it folded up behind your teeth.\n\n<em>“Good,”</em> the poet says. <em>“What is spoken here is kept. The dark below respects a verse the way a lock respects its key.”</em>`),
  choices:[
    { t:'Step through the gate.', go:'n_vestibule' },
    { t:'Read the other line too, while you’re here.',
      req:S=>!(S.verses.includes('v_gate')&&S.verses.includes('v_hope')),
      fx:S=>{ if(!S.verses.includes('v_gate'))S.verses.push('v_gate');
              if(!S.verses.includes('v_hope'))S.verses.push('v_hope'); }, go:'n_vestibule' },
    { t:'Ask the poet if the gate has ever been shut.', go:'n_vestibule',
      fx:S=>S.flags.gatelore=1 },
  ]},
n_vestibule: { region:'vestibule', title:'The Ones Who Never Chose',
  text:S=>(S.flags.gatelore?`<em>“Shut? Once,”</em> the poet says as you walk. <em>“Someone knocked it down from the inside, going the other way. Doors have been a formality since.”</em>\n\n`:``)
    +`Inside is not fire. Inside is a plain, gray as a Tuesday, where an enormous crowd runs in a circle after a whirling banner that never slows and never means anything. Wasps attend them. The dead here sigh in a register that makes the darkness tremble.\n\n<em>“The neutrals,”</em> says the poet, with the only contempt he ever spends freely. <em>“They lived without blame and without praise. Heaven expelled them, and deep Hell refuses the shipping costs. Let us not speak of them — look, and pass.”</em>`,
  choices:[
    { t:'Look, and pass.', virgil:1, go:'n_acheron' },
    { t:'Stop one runner and ask what the banner says.', go:'n_banner_ask' },
    { t:'Weep for them. Nobody deserves a forever of errands.', heart:1, virgil:-1,
      go:'n_acheron' },
    { t:'Fall in behind the banner. Just to see the pace.', gleam:'sloth', sin:{sloth:2},
      end:'e_banner' },
  ]},
n_banner_ask: { region:'vestibule', title:'A Runner, Running',
  text:`He answers without stopping, so you must trot alongside, which feels obscurely like losing an argument.\n\n<em>“Says? It doesn’t say. That’s the beauty of it,”</em> he pants. <em>“Commit to a flag and someday the flag is wrong. This one can’t be wrong. It can’t be anything. Very safe. Very safe.”</em> A wasp lands on him with the intimacy of long acquaintance.\n\nHe has been explaining this, you sense, for three thousand years, always to someone jogging away.`,
  choices:[
    { t:'Stop running. Walk on with the poet.', virgil:1, go:'n_acheron' },
    { t:'“You could just… stop?”', heart:1, go:'n_acheron',
      fx:S=>S.flags.toldrunner=1 },
    { t:'Match his pace. He’s making a kind of sense.', gleam:'sloth', sin:{sloth:3},
      end:'e_banner' },
  ]},
n_acheron: { region:'acheron', title:'The Ferryman',
  text:S=>(S.flags.scythe?`Charon sees the scythe before he sees you. The flame in his eye-wheels banks low, and something crosses the old boatman’s face that has not crossed it since the ferry opened: professional courtesy.\n\n<em>“…Office,”</em> he mutters, and asks nothing further. Colleagues ride free.\n\n`:``)
    +`The river is the color a bruise dreams of. On the near shore the dead gather in drifts, and they fall to the boat when it comes the way leaves fall — singly, then all at once, each one certain it could have held the branch a moment longer.\n\nThe boatman’s eyes are wheels of flame. He marks you at fifty yards. <em>“LIVING SOUL,”</em> he says, in a voice like a keel dragged over gravel, <em>“that one does not cross. Another way, another port. A lighter boat for you.”</em>\n\nThe poet steps forward and says nine words you can’t quite hear — something about <em>willed where power and will are one</em> — and Charon’s flame-eyes bank down to a sulk.`,
  choices:[
    { t:'Board the boat among the falling dead.', go:'n_limbo' },
    { t:'Watch the souls a while first. Someone should.', heart:1, go:'n_limbo',
      fx:S=>S.flags.watched=1 },
    { t:'Offer Charon a coin for the trouble.', sin:{greed:1}, go:'n_limbo',
      fx:S=>S.flags.coin=1 },
    { pre:'the known road', t:'“Ferryman. The long way down is memorized by now. Pole hard, and wake me at the judge’s coils.”',
      req:(S,P)=>P.runs>0, go:'n_minos', fx:S=>S.flags.swift=1 },
    { t:'Refuse the water. You’ve seen the eyes of the pilot.', end:'e_shore' },
  ]},

/* ---------------- LIMBO ---------------- */
n_limbo: { region:'limbo', motif:'s_virgil', title:'The First Circle',
  text:S=>(S.flags.coin?`(Charon took the coin, examined it with maritime disgust, and threw it in the river. It is presumably still falling.)\n\n`:``)
    +`No screams here. That is the whole punishment: no screams, no fire, no hope — a green place under a dome of pale light, where sighs stand in for weather.\n\nAnd the poet stands differently, suddenly. Shoulders squared to the light like a man at his own front door.\n\n<em>“This is mine,”</em> he says quietly. <em>“The circle of those born too early to be saved, or never told. We did not sin, {NAME}. We merely… missed. This is where I am kept, and where I return when my errands are done. Eternity in a waiting room with excellent company.”</em>\n\nAcross the meadow, four crowned shadows raise their hands to him in grave salute.`,
  choices:[
    { t:'“This is your forever? This — almost?”', virgil:1, go:'n_limbo_poets',
      fx:S=>S.flags.virgilHome=1 },
    { t:'Go meet the crowned shadows.', go:'n_limbo_poets' },
    { t:'Ask about the children. There are children here.', heart:1, go:'n_limbo_poets',
      fx:S=>S.flags.limboKids=1 },
    { t:'Stay. Green fields, great poets, no fire. This is fine.', gleam:'pride',
      sin:{sloth:1,pride:1}, end:'e_limbo' },
  ]},
n_limbo_poets: { region:'limbo', motif:'s_virgil', title:'The School of the Great',
  text:S=>(S.flags.limboKids?`<em>“The children?”</em> He is silent for four steps. <em>“They are the argument no one here has won in five thousand years. Walk. Some doors should not be leaned on.”</em>\n\n`:``)
    +`Homer leads them — blind, sword-carrying, magnificent, a man who is somehow more of a place. They greet your poet as the sixth of their number, and for one strange moment they consider you: the breathing thing, the tourist, the person with a return ticket.\n\n<em>“Remember what you see,”</em> says Homer, in the direction of your bones. <em>“It is what we are all made of now. Being remembered. It is not nothing, but it is not weather, and it is not bread.”</em>\n\nYour poet touches your shoulder. Downhill, always downhill: a seat of coiled shadow waits, and below it, the true descent.`,
  choices:[
    { t:'Walk down to the coiled shadow.', go:'n_minos' },
    { t:'Bow to Homer first. Some debts you pay on sight.', star:1, go:'n_minos' },
    { t:'Ask your poet: “What should I remember of YOU?”', virgil:1, go:'n_minos',
      fx:S=>S.flags.askedVirgil=1 },
    { t:'Envy them, suddenly and completely — the peace, the company, the names that outlived breath.',
      sin:{envy:2}, go:'n_minos' },
    { t:'Stay with the poets. Enroll. Audit eternity.', gleam:'pride', sin:{sloth:1,pride:1},
      end:'e_limbo' },
  ]},
n_minos: { region:'minos', title:'The Connoisseur of Guilt',
  text:(S,P)=>{
    let t=`Minos fills the cavern the way a verdict fills a courtroom. Before him, each soul confesses everything at once — a life vomited whole — and the great tail coils: once for each circle down. Judgment as choreography.\n\nThe flame-lit eyes find you.`;
    if (P.runs>0){
      t+=`\n\n<em>“You,”</em> he says, with the weariness of middle management. <em>“Again. I remember every visit${P.lastEndingTitle?` — last time it ended with <b>${P.lastEndingTitle}</b>`:``}.”</em>`;
      const r=domRes(P);
      if (r) t+=` <em>“And I remember your ledger. It reeks of ${SIN_WORD[r]}. I could save us both the walking and post you straight to your own address.”</em> The tail rises, helpful as a hangman.`;
    } else {
      t+=`\n\n<em>“Alive,”</em> he observes, tail twitching like a critic’s pen. <em>“Beware how you enter, and in whom you trust. The width of the door is no measure of the door.”</em>`;
    }
    if (S.flags.scythe) t+=`\n\nThe great nostrils flare once toward the scythe — and the tail, mid-coil, goes carefully still. <em>“That writ,”</em> Minos says, with the delicacy of a judge addressing a rival court, <em>“is not mine to sentence. Mind how you serve it, bailiff. The blade keeps its own docket.”</em>`;
    const vd=P.verdicts||{}, vids=Object.keys(vd);
    if (vids.length){
      let mercy=0, harm=0;
      vids.forEach(k=>{ const l=vd[k].last;
        (l==='condemn'||l==='punish') ? harm++ : mercy++; });
      t+=`\n\n<em>“Your docket, for the record:”</em> — the tail taps the stone once per count — <em>“${mercy} shown mercy. ${harm} struck. Oh yes, the circles keep minutes, pilgrim. The circles ALWAYS keep minutes.”</em>`;
    }
    return t;
  },
  choices:[
    { t:'Stand and be seen. Hide nothing.', star:1, go:'n_storm' },
    { t:'“What do you smell on me, judge?”',
      go:'n_minos_read' },
    { t:'Pass on the poet’s authority. No confession owed today.', go:'n_storm' },
    { pre:'accept his sentence', t:(S,P)=>`Let the tail post you to your own circle. Skip the tour.`,
      req:(S,P)=>P.runs>0 && !!domRes(P),
      go:(S,P)=>SIN_NODE[domRes(P)]||'n_storm', fx:(S,P)=>S.flags.sentenced=1 },
    { t:'Lie to him. Confess someone else’s life, a better one.', gleam:'pride',
      sin:{pride:1}, end:'e_minos' },
  ]},
n_minos_read: { region:'minos', title:'The Reading',
  text:S=>{ const d=domSin(S)||'nothing yet';
    return `The nostrils of the judge flare, twin furnaces tasting smoke.\n\n<em>“${d==='nothing yet' ? 'Nothing. Yet. A blank page walking into a printworks — how deliciously it will take the ink.' : 'I smell '+SIN_WORD[d]+'. It is young in you still, a seedling of it, but the soil down here is… encouraging. The circles will know you, pilgrim. Your circle will fit like a bespoke coffin.'}”</em>\n\nThe tail uncoils toward the dark below, almost courteous. First stop of the descent proper: a storm that never lands.`; },
  choices:[
    { t:'Down, then. Into the storm.', go:'n_storm' },
    { t:'“Thank you for the diagnosis. Bill my estate.”', go:'n_storm' },
    { t:'Spit at his feet before you go.', sin:{wrath:1}, virgil:-1, go:'n_storm' },
  ]},

/* ---------------- CIRCLE II — LUST ---------------- */
n_storm: { region:'lust', title:'The Whirlwind of Lovers',
  enter:S=>{ if(S.flags.sentenced){S.flags.sentenced=0;} },
  text:(S,P)=>`The light stammers and dies, and the wind takes over the job of screaming. Here the storm is the landlord: souls ride it like starlings in murmuration, wheeled and flung and never once set down — all the ones who let the heart drive with the lamps off.\n\nThey stream past in ribbons. And there — two who fly <em>together</em>, holding, somehow light upon the wind even here, like things borne willingly.`+vA(S,P,'lust'),
  choices:[
    { t:'Call the two down, in the name of whatever they love.', go:'n_francesca' },
    { t:'Watch the storm a while. It is, God help you, beautiful.', sin:{lust:1},
      go:'n_francesca' },
    { t:'Shield your face and push across without speaking to anyone.', go:'n_c3_rain' },
    { t:'Scream into the wind until it screams back.', sin:{wrath:1}, go:'n_francesca' },
  ]},
n_francesca: { region:'lust', title:'Francesca', judge:{soul:'s_francesca',go:'n_c2_exit'},
  text:(S,P)=>soulMem(S,P,'s_francesca')+`They come like doves to the nest, and the storm — this is the unbearable part — the storm <em>waits</em>.\n\nShe speaks; he only weeps. She tells it plainly, the way you’d recite a recipe for the dish that killed you: an afternoon, a book about a knight, a kiss read about and then attempted, her husband’s knife arriving before the next chapter. <em>“Love led us to one death,”</em> she says. <em>“Caïna waits for him who quenched our life.”</em>\n\nThe man weeps on. The storm idles like a hearse.\n\nShe looks at you and waits to hear which kind of visitor you are.`,
  choices:[
    { t:'Weep for her. Openly. Let it cost you.', heart:2, go:'n_francesca_weep' },
    { t:'“You chose. The book didn’t kiss anyone.”', heart:-2,
      fx:S=>S.judged.s_francesca='condemn', go:'n_c2_exit' },
    { t:'“What is the worst of it — the wind, or the memory?”', learnVerse:'v_sorrow',
      fx:S=>S.judged.s_francesca='question', go:'n_francesca_verse' },
    { pre:'carry her name', t:'“I will speak of you, above. Francesca. I promise.”',
      remember:'s_francesca', fx:S=>S.judged.s_francesca='remember', go:'n_c2_exit' },
  ]},
n_francesca_verse: { region:'lust', title:'The Greater Sorrow',
  text:`<em>“The wind?”</em> She almost laughs; the storm almost lets her. <em>“The wind is nothing. The wind is honest.”</em>\n${VQ('v_sorrow')}<em>“That is the whole engine of this place, pilgrim. They don’t need fire down here. They have the happy time, and they play it for us on repeat.”</em>\n\nThe verse folds itself into you, cold and exact. You suspect it opens something, somewhere far below — some mouth that will not speak without it.`,
  choices:[
    { t:'Weep for her now. Knowing what you know.', heart:2, go:'n_francesca_weep' },
    { pre:'carry her name', t:'“I will remember you. The happy time included.”',
      remember:'s_francesca', fx:S=>S.judged.s_francesca='remember', go:'n_c2_exit' },
    { t:'Say nothing. Bow. Walk on.', go:'n_c2_exit' },
  ]},
n_francesca_weep: { region:'lust', title:'Pity, Like Weather',
  text:S=>`You weep, and it matters — that is the trap of it. Her face opens like a window long painted shut. The man lifts his ruined eyes. For one full second, two damned souls feel <em>witnessed</em>, and the storm leans down around all three of you, gentle as a curtain, and makes an offer without words:\n\n<em>stay. grieve. ride with us. it is so much lighter than walking.</em>\n\n${S.sins.lust>=3?'And God help you, part of you has been waiting for exactly this invitation since the wood.':'The wind tugs, testing your weight.'}`,
  choices:[
    { t:'Steady yourself. Feel it — and walk on.', star:1,
      fx:S=>S.judged.s_francesca='pity', go:'n_c2_exit' },
    { t:'Take her hand. Join the weather.', gleam:'lust', sin:{lust:2}, end:'e_whirlwind' },
    { pre:'carry her name', t:'Wipe your eyes and promise her the only thing that lasts.',
      remember:'s_francesca', fx:S=>S.judged.s_francesca='remember', go:'n_c2_exit' },
  ]},
n_c2_exit: { region:'lust', title:'Down and Down',
  text:S=>{ const j=S.judged.s_francesca;
    return (j==='condemn'?`She recedes into the storm without a word — but the man stops weeping, just for a moment, to look at you. You will be a long time deciding what that look was.\n\n`
      : j==='remember'?`<em>“Then it was not nothing,”</em> she says — barely — and the storm takes them, and for the first time in seven hundred years the two of them fly a little higher than the wind requires.\n\n`
      : `The storm takes them back, and the ribbons of the flying dead close over the place they were, the way water closes over a stone.\n\n`)
      +`The poet is watching you sidelong as you descend. <em>“The first circle is the softest,”</em> he says. <em>“It only wants your heart. The ones below have coarser appetites.”</em>\n\nBelow: the sound of rain that has never once stopped.`; },
  choices:[
    { t:'Descend into the rain.', go:'n_c3_rain' },
    { t:'“Did I do right, back there?”', virgil:1, go:'n_c3_rain',
      fx:S=>S.flags.askedRight=1 },
    { t:'Look back at the storm one last time.', sin:{lust:1}, go:'n_c3_rain' },
  ]},

/* ---------------- CIRCLE III — GLUTTONY ---------------- */
n_c3_rain: { region:'gluttony', title:'The Rain That Rots',
  text:(S,P)=>`Cold rain, fat rain, rain with hail folded in like gravel into dough — falling forever on a mudflat of the sprawled dead, who lie in it like the guests after the party of all parties. The smell is a whole biography.\n\nAhead, astride three ruts of mud, the dog: Cerberus, three throats wide, barking in chords. Each head disagrees with the others about which part of you to begin with.`+vA(S,P,'gluttony'),
  choices:[
    { t:'Do as the poet does: throw fistfuls of mud into all three mouths.', virgil:1,
      go:'n_ciacco' },
    { t:'Run the gap while the heads argue.', go:'n_ciacco', star:-1,
      fx:S=>S.flags.ranDog=1 },
    { t:'Offer the dog the food from your pocket. You have no food. Offer anyway.',
      sin:{gluttony:1}, go:'n_ciacco' },
    { t:'Lie down in the warm mud with the others. Just for a minute.', gleam:'gluttony',
      sin:{gluttony:2,sloth:1}, end:'e_mire' },
  ]},
n_ciacco: { region:'gluttony', title:'Ciacco', judge:{soul:'s_ciacco',go:'n_c4_plutus'},
  text:(S,P)=>soulMem(S,P,'s_ciacco')+`One of the sprawled dead sits up — an effort like a continent shrugging — and rain relocates around him.\n\n<em>“You,”</em> he says. <em>“Alive. From the world. Do you know me? I was called Ciacco — ‘the Hog’ — a joke I paid for by becoming it. I knew every table in Florence and none of them knew me back.”</em>\n\nHe leans close. The rain gets into everything, including moments.\n\n<em>“But when thou art again in the sweet world, I pray thee to the mind of others bring me. Say the name. Once a year. At a dinner, even — especially at a dinner. It is all I ask and it is everything.”</em>\n\nThe poet murmurs, beside you: <em>“Three names, {NAME}. A mouth only carries three through this dark. Spend them like your last coins.”</em>`,
  choices:[
    { t:'Weep for him — the joke that became a sentence.', heart:1,
      fx:S=>S.judged.s_ciacco='pity', go:'n_c4_plutus' },
    { t:'“You ate yourself here. The rain seems fair.”', heart:-1,
      fx:S=>S.judged.s_ciacco='condemn', go:'n_c4_plutus' },
    { t:'“Tell me of the world first. What comes for my city?”',
      fx:S=>{S.judged.s_ciacco='question';S.flags.prophecy=1;}, go:'n_ciacco_prophecy' },
    { pre:'carry his name', t:'“Ciacco. At a dinner. Once a year. I swear it.”',
      remember:'s_ciacco', fx:S=>S.judged.s_ciacco='remember', go:'n_c4_plutus' },
    { t:'“Describe the feasts. Every course. Slowly.” — and listen with your mouth watering in the rain.',
      gleam:'gluttony', sin:{gluttony:2}, fx:S=>S.flags.fedOnCiacco=1, go:'n_c4_plutus' },
  ]},
n_ciacco_prophecy: { region:'gluttony', title:'What the Dead Know',
  text:`The dead see forward, never around: it is the fine print of their condition.\n\n<em>“Your city,”</em> Ciacco says, eyes focusing on some noon well past your death, <em>“will do what cities do. The party of the woods will drive out the party of the walls; then the walls will drive out the woods; the just will be two, and no one will listen to them. Pride, envy, avarice — those are the three sparks that have all hearts enkindled. It was true when I breathed. It will be true when the sun forgets your language.”</em>\n\nHe sinks back a little into the mud, spent.\n\n<em>“The name,”</em> he says. <em>“Don’t forget the part about the name.”</em>`,
  choices:[
    { pre:'carry his name', t:'“Ciacco. Once a year. At a table with friends.”',
      remember:'s_ciacco', fx:S=>S.judged.s_ciacco='remember', go:'n_c4_plutus' },
    { t:'“I’ll try to remember you” — and hate how it sounds.', heart:1, go:'n_c4_plutus' },
    { t:'Leave him to the rain. Prophets are exhausting.', heart:-1, go:'n_c4_plutus' },
  ]},

/* ---------------- CIRCLE IV — GREED ---------------- */
n_c4_plutus: { region:'greed', title:'Pape Satàn',
  text:(S,P)=>`<em>“Pape Satàn, pape Satàn, aleppe!”</em> — the thing at the mouth of the fourth circle clucks it like a hen made of money, swollen, blustering, guarding nothing that anyone could carry away.\n\nThe poet says one sentence — something about wolves and the will above — and Plutus collapses like a sail with its rigging cut.\n\nBeyond: two vast half-circles of the dead, each soul chest-rolling a boulder of dead weight, clashing against the opposite tide at the meeting points — <em>“Why hoard?” “Why squander?”</em> — then wheeling around to do it again. Forever. An economy.`+vA(S,P,'greed'),
  choices:[
    { t:'Watch one full rotation of the wheel. Understand it.', sin:{sloth:1}, go:'n_c4_watch' },
    { t:'“Poet — why do I recognize no one here?”', go:'n_c4_faces' },
    { t:'Walk the rim looking for a soul who’ll speak.', go:'n_miser' },
    { t:'Cross quickly. Money bores you.', go:'n_c5_styx' },
  ]},
n_c4_watch: { region:'greed', title:'One Rotation',
  text:`You watch. Hoarders push clockwise, squanderers counter; they meet, collide, insult each other’s opposite arithmetic, and wheel back. The boulders never get lighter. Nobody has ever won a lap.\n\nThe horrible thing is how <em>familiar</em> the rhythm is — you have stood in this exact traffic, upstairs, wearing a coat, holding a phone.\n\nSomewhere in the clockwise tide, one bent shade rolls a stone smaller than anyone’s, and rolls it worse.`,
  choices:[
    { t:'Go to the bent shade with the small stone.', go:'n_miser' },
    { t:'Take a turn pushing a boulder. See how it feels.', gleam:'greed', sin:{greed:2},
      end:'e_wheel' },
    { t:'Walk on. The wheel doesn’t need an audience; that’s the point.', go:'n_c5_styx' },
  ]},
n_c4_faces: { region:'greed', title:'The Faceless',
  text:`<em>“You recognize no one,”</em> the poet says, <em>“because there is no one to recognize. The undiscerning life that made them sordid now makes them dim to all discernment. They spent every hour becoming their ledgers, and ledgers have no faces. Many were priests, popes, cardinals — look, the tonsured heads — and I could not name you one. Neither could they.”</em>\n\nIt is the first circle that scares you properly. Not the pain. The <em>anonymity</em>.`,
  choices:[
    { t:'Find one anyway. One of them must remember something.', go:'n_miser' },
    { t:'Move on, and grip your own name a little tighter.', go:'n_c5_styx' },
  ]},
n_miser: { region:'greed', title:'The Shade Without a Name', judge:{soul:'s_forgotten',go:'n_c5_styx'},
  text:(S,P)=>soulMem(S,P,'s_forgotten')+`He stops when you stand in his path — the first stopping he has done, perhaps, in centuries. The boulder settles into the mud like a verdict.\n\n<em>“You want the name,”</em> he says, before you ask. <em>“They always start with the name. Listen: I had one. I know I had one. I kept it in the same place I kept everything, locked, safe, safe, safe—”</em> his hands work the air like a man counting phantom coins — <em>“and the lock outlived the key. My mother made that name. Two syllables. I bought things with it. It bought me this stone.”</em>\n\nHe looks up, and his face is a smooth worn place, like a coin handled too long.\n\n<em>“Can you lend me nothing? You, with your pockets full of being alive?”</em>`,
  choices:[
    { t:'Weep. A man robbed of his name by his own vault.', heart:1,
      fx:S=>S.judged.s_forgotten='pity', go:'n_c5_styx' },
    { t:'“You sold it yourself, one coin at a time.”', heart:-1,
      fx:S=>S.judged.s_forgotten='condemn', go:'n_c5_styx' },
    { t:'Ask him what he bought that was ever worth a name.',
      fx:S=>S.judged.s_forgotten='question', go:'n_miser2' },
    { pre:'carry — what, exactly?', t:'“I cannot remember your name. I will remember THAT. The man Hell unnamed. I’ll carry the empty space.”',
      remember:'s_forgotten', fx:S=>S.judged.s_forgotten='remember', go:'n_c5_styx' },
  ]},
n_miser2: { region:'greed', title:'The Inventory',
  text:`He thinks. The thinking is geological.\n\n<em>“A house with nine rooms and I slept in the smallest. A painting of the sea, to save the cost of travel. A daughter’s wedding, the cheap wine at it. Her face when she tasted it.”</em> He stops. <em>“That one. That one I bought in full and it is the only purchase I still own.”</em>\n\nThe boulder waits. It has learned patience from the best.\n\n<em>“Go. The wheel doesn’t forgive a stopped cart. If you meet my name up there, in some ledger, some deed, some stone above a grave — be kinder to it than I was.”</em>`,
  choices:[
    { pre:'carry the empty space', t:'“I’ll carry what’s left of you. The unnamed man, and the wine, and her face.”',
      remember:'s_forgotten', fx:S=>S.judged.s_forgotten='remember', go:'n_c5_styx' },
    { t:'“I hope the wheel wears out before you do.”', heart:1, go:'n_c5_styx' },
    { t:'Leave him to his rotation.', go:'n_c5_styx' },
  ]},

/* ---------------- CIRCLE V — STYX ---------------- */
n_c5_styx: { region:'styx', title:'The Marsh of the Two Angers',
  text:(S,P)=>`The circle below is a marsh the color of old anger, and in it the wrathful are at their forever-work: striking, tearing, gnashing — not with weapons, with <em>each other</em>, headlong and hopeless, a bar fight the size of a county.\n\nBut watch the water between the bodies: bubbles. Rising in slow ropes from the mud beneath, where — the poet tells you — lie the sullen, fixed in slime, gurgling a hymn they never once sang aloud in the sweet air: <em>we were sad in the sun, and now we are sad in the dark, and at least the dark admits it.</em>\n\nAcross the water, a watchtower answers itself with two small flames, and something that is technically a boat begins to arrive.`+vA(S,P,'styx'),
  choices:[
    { t:'Kneel at the water’s edge and listen to the bubbles.', go:'n_sullen' },
    { t:'Hail the boat.', go:'n_argenti' },
    { t:'Watch the brawl. Feel your own knuckles itch.', sin:{wrath:1}, go:'n_argenti' },
    { t:'Skip a stone across the marsh. Someone has to.', sin:{sloth:1}, go:'n_argenti',
      fx:S=>S.flags.skipped=1 },
  ]},
n_sullen: { region:'styx', title:'The Sullen One', judge:{soul:'s_sullen',go:'n_argenti'},
  text:(S,P)=>soulMem(S,P,'s_sullen')+`You kneel in the reek, and against every rule of this place, the bubbles organize. A voice assembles itself from swamp gas and old grievance — a woman’s voice, wrung flat.\n\n<em>“Down here we say it. That’s the punishment, if you’re keeping notes: an eternity of finally saying it. I was sullen in the sweet air. The sun came up every single day and I took it as a personal insult. My sister sang in the mornings. I never asked her to teach me the song. It seemed — ”</em> a long bubble, almost a laugh — <em>“it seemed like admitting something.”</em>\n\nThe mud holds her the way she once held everything: in, and down, and quietly.`,
  choices:[
    { t:'Weep for her. Grief that never learned to speak.', heart:1,
      fx:S=>S.judged.s_sullen='pity', go:'n_argenti' },
    { t:'“The sun rose for you and you sulked. This mud is honest.”', heart:-1,
      fx:S=>S.judged.s_sullen='condemn', go:'n_argenti' },
    { t:'“Sing it now. Your sister’s song. I’ll wait.”',
      fx:S=>S.judged.s_sullen='question', go:'n_sullen2' },
    { pre:'carry her name', t:'“I’ll remember you — the one who finally spoke, a whole lake too late.”',
      remember:'s_sullen', fx:S=>S.judged.s_sullen='remember', go:'n_argenti' },
  ]},
n_sullen2: { region:'styx', title:'The Song, Gurgled',
  text:`A silence. Then — bubble by bubble, note by drowned note — she tries. It is wrecked. It is unrecognizable. Whatever her sister’s morning song was, this is its shipwreck.\n\nAnd every soul sealed in the mud around her goes still to listen.\n\nWhen it ends, the marsh is quiet in a new way, like a room where something true has finally been said badly.\n\n<em>“There,”</em> she says. <em>“Forty years too few and seven centuries too late. If you meet a sullen person up there, in the sweet air — don’t coax them. Coaxing curdles it. Just sing in the next room, and leave the door open.”</em>`,
  choices:[
    { pre:'carry her name', t:'“I’ll carry you up. The Sullen One, who sang once.”',
      remember:'s_sullen', fx:S=>S.judged.s_sullen='remember', go:'n_argenti' },
    { t:'Hum the wrecked song back to her, best you can.', heart:1, star:1, go:'n_argenti' },
    { t:'Sink beside her. The mud is warm. The dark admits it.', gleam:'sloth',
      sin:{sloth:2}, end:'e_bubbles' },
  ]},
n_argenti: { region:'styx', title:'The Crossing, With Company',
  text:S=>(S.flags.skipped?`(Your skipped stone got four bounces and was caught, mid-air, by something with too many hands. It did not throw it back.)\n\n`:``)
    +`Phlegyas ferries you at a furious clip — rage rows fast — and midway across, hands grip the gunwale. A soul rises from the marsh in full spate, mud-crowned, magnificent with fury.\n\n<em>“Who are YOU, that come before your hour?”</em>\n\nYou know him without knowing him: the kind of man who was violent at dinner parties. The poet’s hand finds your shoulder — and for once he does not counsel gentleness. He waits to see what you are made of.`,
  choices:[
    { t:'“Weeping and mourning, spirit — stay there.” Thrust him from the boat.',
      sin:{wrath:1}, virgil:1, go:'n_dis',
      fx:S=>S.flags.argentiSpurned=1 },
    { t:'Pry his fingers loose, gently, one by one.', heart:1, go:'n_dis' },
    { t:'Pity him — and lean down to hear his grievance.', heart:2, virgil:-1, star:-1,
      go:'n_dis', fx:S=>S.flags.argentiBit=1 },
    { t:'Match his rage. Grapple him over the side.', gleam:'wrath', sin:{wrath:3},
      end:'e_styx' },
  ]},

/* ---------------- WALLS OF DIS ---------------- */
n_dis: { region:'dis', title:'The City of the Dead',
  text:S=>(S.flags.argentiSpurned?`Behind you, the marsh performed its one mercy: the muddy people fell upon the wrathful shade, and he turned his teeth upon himself. The poet watched you watch it. <em>“Indignation,”</em> he said, <em>“in its right place, is a clean blade. Note where the right place ends.”</em>\n\n`
    : S.flags.argentiBit?`(Your bitten hand throbs. Lean-down mercy, it turns out, has a radius, and he was inside it. The poet said nothing, which was worse than anything.)\n\n`:``)
    +`Ahead: Dis. A city of the dead with red mosques for watchtowers, iron for weather, and a wall that was old before walls were invented. On the ramparts, a thousand rained-down angels watch you approach.\n\nThe poet goes forward to negotiate. For the first time since the wood — they refuse him. The gates boom shut in his face, and something in his shoulders goes out, like a lamp.\n\n<em>“This has happened once before,”</em> he says quietly. <em>“Help is coming. Help came then.”</em> He does not sound like a poet. He sounds like a man doing arithmetic on hope.\n\nAnd then, on the hot stone above the gate: three shapes with serpent hair, tearing their own breasts, shrieking down at you with delight:\n\n<em>“MEDUSA! Bring MEDUSA! Let us make STONE of this one!”</em>\n\nThe poet spins. <em>“Turn. Close your eyes. I will cover them with my own hands. {NAME} — whatever you hear, whatever you feel arrive — do not look.”</em>`,
  choices:[
    { t:'Turn. Close your eyes. Let his hands seal the dark.', virgil:2, go:'n_dis_open' },
    { t:'Keep your eyes open — but locked on your own feet.', virgil:-1, star:-1,
      go:'n_dis_open', fx:S=>S.flags.peeked=1 },
    { t:'“Cover YOUR eyes, poet. I’ll watch for both of us.”', gleam:'pride', sin:{pride:2},
      end:'e_stone' },
    { t:'Look. You have to know if she’s real.', end:'e_stone' },
  ]},
n_dis_open: { region:'dis', title:'One From Heaven',
  text:S=>(S.flags.peeked?`Through your downcast lashes you saw only feet: yours, his — and then feet that were not feet, crossing the Styx dry-shod, at walking pace, unhurried as noon.\n\n`
    :`Dark, his cold hands, your own heartbeat — and then a sound like a wind that has read books: vast, dry, disdainful.\n\n`)
    +`Something from Heaven crossed the marsh, opened the gates of Dis with a touch of a small wand, scolded the thousand angels like poultry, and left without once acknowledging that you exist. The whole intervention had the bored efficiency of a locksmith.\n\nThe poet exhales seven hundred years of held breath.\n\n<em>“Inside,”</em> he says, <em>“are the ones who chose their beliefs the way misers choose vaults — for the lock, not the treasure. Mind the open tombs.”</em>`,
  choices:[
    { t:'Enter the city of the dead.', go:'n_c6_tombs' },
    { t:'Ask the poet if he’s all right. Nobody ever asks him.', virgil:1, go:'n_c6_tombs',
      fx:S=>S.flags.askedOk=1 },
    { t:'Thank the departing messenger, loudly, to its back.', go:'n_c6_tombs' },
  ]},

/* ---------------- CIRCLE VI — HERESY ---------------- */
n_c6_tombs: { region:'heresy', title:'The Burning Tombs',
  text:S=>(S.flags.askedOk?`(<em>“Am I—?”</em> He was quiet for three streets. <em>“In thirteen centuries, {NAME}, you are the second person to ask.”</em> He did not say who was first. He walked a little taller.)\n\n`:``)
    +`Inside the walls: a necropolis on fire from below. Every tomb lies open, lid propped like a book someone will finish later, flames tucked under each one as if the dead were kept warm out of terrible politeness.\n\nFrom one of them, a voice — and then a torso, rising: a great shade lifting himself upright <em>as if he entertained great scorn of Hell</em>, chest out, chin high, burning and unbothered.\n\n<em>“Tuscan,”</em> he says — or whatever your country is; he has decided you have one and that it matters — <em>“your speech declares you. Stand. Who were your ancestors?”</em>\n\nAnd while you face him, another shade rises to its knees in the same tomb — older, frantic, searching the air around you with wet eyes:\n\n<em>“Where is my son? Why is my son not with you?”</em>`,
  choices:[
    { t:'Answer the proud one. Give him your lineage like a blade drawn.',
      sin:{pride:2}, go:'n_farinata', fx:S=>S.flags.proud=1 },
    { t:'Answer him plainly: you come from ordinary people who paid their debts.',
      heart:1, go:'n_farinata' },
    { t:'Turn from him — to the weeping father first.', go:'n_cavalcante',
      fx:S=>S.flags.fatherFirst=1 },
    { t:'Climb into an open tomb yourself. Try the fit.',
      req:S=>S.star<=2, gleam:'pride', end:'e_tomb' },
  ]},
n_farinata: { region:'heresy', title:'Farinata',
  text:S=>(S.flags.proud
    ? `He weighs your lineage like a horse-trader, then delivers his review: <em>“Fierce enemies of mine, and of my party. I scattered them twice.”</em> He says it the way other men say <em>good morning</em>. You are already, to him, a move in a game that outlived the board.\n\n`
    : `Your plainness lands on him like weather on a statue. <em>“Debts,”</em> he repeats, with faint anthropological interest. A man who burned a city over a point of honor, meeting a person who returns library books.\n\n`)
    +`<em>“I denied the soul outlives the body,”</em> he says, gesturing at his eternal burning tomb with the driest possible irony. <em>“The evidence has since come in against me. And still—”</em> the chin lifts — <em>“if I were wrong about Heaven, I was right about Florence. We see the future here, you know. It is the past we lose. Ask me anything except what is happening now.”</em>\n\nBeside him the old father still kneels, still searching your shadow for his son.`,
  choices:[
    { t:'Turn to the father now.', go:'n_cavalcante' },
    { t:'“Was it worth it? The scorn, the wars, the tomb?”', go:'n_farinata2' },
    { t:'Leave them both to their oven.', heart:-1, go:'n_c7_wood' },
  ]},
n_farinata2: { region:'heresy', title:'The Audit of Scorn',
  text:`For a moment the fire under the tomb is the only speaker.\n\n<em>“I saved Florence once,”</em> he says finally. <em>“Alone, at the council of her enemies, when every hand voted to raze her — mine stayed up against. The city I burned for still stands because I loved her out loud in the wrong room. Worth it?”</em> He settles back against burning stone as against a throne. <em>“Scorn is a currency, pilgrim. I am merely somewhere the exchange rate is unkind.”</em>\n\nHe will not lie down until you leave. You understand this is a courtesy — his only one.`,
  choices:[
    { t:'Bow to him. One proud thing to another.', sin:{pride:1}, go:'n_cavalcante' },
    { t:'Turn to the weeping father.', go:'n_cavalcante' },
    { t:'Walk on. Some monuments are best read at distance.', go:'n_c7_wood' },
  ]},
n_cavalcante: { region:'heresy', title:'Cavalcante', judge:{soul:'s_cavalcante',go:'n_cav_after'},
  text:(S,P)=>soulMem(S,P,'s_cavalcante')+`The old man’s hands close on the rim of the tomb like a swimmer’s on a gunwale.\n\n<em>“If you walk this blind prison by height of genius — my son had genius, where is he? Why is he not with you? Does the sweet light no longer strike his eyes?”</em>\n\nAnd there it is, the trap with no good exit: you don’t know his son. You don’t know if the boy lives. The father reads your half-second of hesitation the way the dead read everything — instantly, and in the worst light — and begins, already, to fall back into the burning.`,
  choices:[
    { t:'“I don’t know your son. I’m sorry. I don’t know.”', heart:1,
      fx:S=>S.judged.s_cavalcante='question', go:'n_cav_after' },
    { t:'Lie. “He lives. He is well. He speaks of you.”', heart:2, star:-1,
      fx:S=>{S.judged.s_cavalcante='pity';S.flags.kindLie=1;}, go:'n_cav_after' },
    { t:'Say nothing. Let the silence answer.', heart:-1,
      fx:S=>S.judged.s_cavalcante='condemn', go:'n_cav_after' },
    { pre:'carry his name', t:'“I’ll find who your son became. And I’ll tell them a father burned here, still asking.”',
      remember:'s_cavalcante', fx:S=>S.judged.s_cavalcante='remember', go:'n_cav_after' },
  ]},
n_cav_after: { region:'heresy', title:'What Falls Back Burning',
  text:S=>{ const j=S.judged.s_cavalcante;
    return (j==='remember'
      ? `The falling stops. The old hands re-grip the stone.\n\n<em>“You would — carry that? Up?”</em> Something crosses his face that has no business in Dis; the flames under the tomb seem briefly embarrassed. He sinks back slowly, almost gently, like a man lying down on purpose for once.\n\n`
      : S.flags.kindLie
      ? `Joy — instant, total, terrible. He blesses you in three dialects, sinking back radiant.\n\nAnd the star you carry dims by one candle. A kind lie is still a coin paid to the dark, and the dark keeps exact books. You feel the poet decide not to say anything, which is its own sentence.\n\n`
      : j==='condemn'
      ? `He falls back into the burning without another word, and the lid of the silence closes over him. Farinata, still upright, watches you with what might — in drier light — be disappointment.\n\n`
      : `<em>“Doesn’t know,”</em> he repeats, to the fire, to the stone, to the son-shaped hole in the air. It is an honest answer and it lands like a dropped bowl. He sinks from view. Honesty, you are learning, is not the same as mercy — it is only cheaper for the soul that spends it.\n\n`)
      +`The poet leads you across the necropolis, down toward a stink that arrives before its circle does: the reek of the violent, and somewhere below it, a wood with no green in it.`; },
  choices:[
    { t:'Descend to the seventh circle.', go:'n_c7_wood' },
    { t:'Look back once at the tomb of the two fathers.', heart:1, go:'n_c7_wood' },
  ]},

/* ---------------- CIRCLE VII — WOOD & SAND ---------------- */
n_c7_wood: { region:'wood', title:'The Wood of the Self-Slain',
  text:(S,P)=>`Past the ruins and the reek, a forest — and every instinct you grew in the first dark wood howls that this one is worse. No green leaves, but black ones; no smooth branches, but knotted, warped; no fruit, but thorns with a private grudge.\n\nAnd nests. In the ugly branches, the Harpies: bird-bodied, woman-faced, making lamentation that is somehow <em>at</em> you.\n\n<em>“Listen,”</em> the poet says. <em>“You hear wailing and see no one. Break — gently — one small twig from one tree, and you will understand what walks here. Or rather, what stands.”</em>`+vA(S,P,'envy'),
  choices:[
    { t:'Break one small twig, gently.', go:'n_pier' },
    { t:'Refuse. If the trees are what you suspect, leave them whole.', heart:1, virgil:1,
      go:'n_c7_sand', fx:S=>S.flags.sparedWood=1 },
    { t:'Listen to the Harpies’ song a while.', star:-1, sin:{sloth:1}, go:'n_pier' },
    { t:'Carve your own name into a trunk. Proof you passed.', gleam:'pride',
      sin:{pride:2}, virgil:-1, go:'n_pier', fx:S=>S.flags.carved=1 },
  ]},
n_pier: { region:'wood', title:'Pier delle Vigne', judge:{soul:'s_pier',go:'n_pier_after'},
  text:(S,P)=>soulMem(S,P,'s_pier')+(S.flags.carved?`(The trunk you carved screamed with your own voice, which you will be hearing at odd hours for the rest of your life.)\n\n`:``)
    +`The twig snaps — and the tree bleeds, and the blood talks.\n\n<em>“Why do you tear me? Have you no spirit of pity? Men we were; trunks we have become.”</em>\n\nHe was Pier delle Vigne: keeper of both keys to an emperor’s heart, the most trusted man in the realm — until envy’s whisperers, <em>the harlot Envy and her court</em>, forged his fall. Prison. Blinding. And then the one exit he could still reach, which led here, where those who threw their bodies away are given bodies that cannot move.\n\n<em>“I swear to you,”</em> the bleeding voice says, <em>“I never broke faith with my lord. He was worthy of honor. If either of you returns to the world—”</em> and here the whole tree strains toward you, every thorn a reaching finger — <em>“comfort my memory. It lies fallen still, under the blow that Envy gave it. Tell them I kept faith. Tell them the whispers lied.”</em>`,
  choices:[
    { t:'Weep for the tree that was the emperor’s right hand.', heart:1,
      fx:S=>S.judged.s_pier='pity', go:'n_pier_after' },
    { t:'“You abandoned the field. The whispers only won because you left.”', heart:-2,
      virgil:-1, fx:S=>S.judged.s_pier='condemn', go:'n_pier_after' },
    { t:'“Name the whisperers. Envy should be on the record too.”',
      fx:S=>S.judged.s_pier='question', go:'n_pier_whisper' },
    { pre:'carry his name', t:'“Pier delle Vigne kept faith. I’ll say it above, where saying it counts.”',
      remember:'s_pier', fx:S=>S.judged.s_pier='remember', go:'n_pier_after' },
    { pre:'speak the verse — and defy it', verse:'v_hope',
      t:'“‘All hope abandon’ — they carved it at the door, Pier. I carried it all the way down here to tell you: I didn’t.”',
      star:1, virgil:1, fx:S=>S.flags.hopeInWood=1, go:'n_pier_after' },
  ]},
n_pier_whisper: { region:'wood', title:'The Court of Whispers',
  text:`<em>“Name them?”</em> The leaves rattle — a sound like a man laughing through a wound. <em>“They had no names, that was their genius. A raised eyebrow at council. A letter left visible on a desk. A pause — a <b>pause</b>, pilgrim — before my lord’s courtiers said my name. You cannot duel a pause. You cannot behead an eyebrow. Envy never signs its work.”</em>\n\nThe sap wells slow and dark at the break you made.\n\n<em>“I, who could out-argue kingdoms, was defeated by punctuation. Remember that, up there, when the room goes quiet at your name a half-second too long.”</em>`,
  choices:[
    { pre:'carry his name', t:'“They’ll hear your name said whole again, Pier. No pause in it.”',
      remember:'s_pier', fx:S=>S.judged.s_pier='remember', go:'n_pier_after' },
    { t:'“The whispers were right about one thing — you gave up.”', heart:-1,
      fx:S=>S.judged.s_pier='condemn', go:'n_pier_after' },
    { t:'Press your hand over the break in his bark until it stops bleeding.', heart:1, star:1,
      fx:S=>S.judged.s_pier='pity', go:'n_pier_after' },
    { t:'The whispers, the pause, the quiet room — you know that room. You have SAT in that room.',
      gleam:'envy', req:S=>S.sins.envy>=2||S.sins.pride>=3, end:'e_tree' },
  ]},
n_pier_after: { region:'wood', title:'Leaves, Stilled',
  text:S=>{ const j=S.judged.s_pier;
    return (S.flags.hopeInWood
      ? `The wood goes still. All of it — every warped branch, every thorn, the Harpies mid-lament. In the wood of the hopeless, someone has just said the forbidden thing, and the trees drink it like the rain they never get.\n\nFrom Pier’s branches, very slowly, something falls that is not a leaf and not a thorn. If a tree could weep with relief, this is the sound.\n\n`
      : j==='remember'
      ? `<em>“Kept faith,”</em> the voice repeats, tasting it. <em>“Said above. In the sweet air, in a living mouth.”</em> The bleeding slows. The branches settle. Around you the whole grove leans in — every tree wishing it had thought to flag you down first.\n\n`
      : j==='condemn'
      ? `The tree takes your verdict in silence — but the poet does not. His look could file paperwork. <em>“The broken,”</em> he says as you walk, <em>“are not improved by being informed of the break. Note it, {NAME}. Cruelty to the drowning is still cruelty, however accurate.”</em>\n\n`
      : `The voice fades back into wood. The blood dries black at the break. The Harpies resume their commentary, which was never really paused, only politely lowered.\n\n`)
      +`Beyond the treeline the land turns traitor: an open waste of burning sand under a slow, endless rain of fire — flakes of it, drifting down like snow that hates you.`; },
  choices:[
    { t:'Cross the burning sand.', go:'n_c7_sand' },
    { t:'Break a second twig on your way — kindly, to hear one more voice.', heart:1,
      go:'n_c7_sand' },
  ]},
n_c7_sand: { region:'sand', title:'The Rain of Fire',
  text:(S,P)=>(S.flags.sparedWood?`You left the wood unbroken. Somewhere behind you a tree that expected to be snapped stands whole, and the Harpies’ song has one note of confusion in it, which you choose to count as a win.\n\n`:``)
    +`The sand burns from below and the fire falls from above; the violent-against-God lie supine on it, the profligate run, the usurers crouch — everyone has been assigned a posture and the posture is the sentence.\n\nThe poet points along the margin, where a stone channel steams: <em>“We walk the rim. Quickly, and low. The fire respects nothing, but it respects it slower near the water.”</em>\n\nAcross the sand, an old shade who should be running has stopped — bent double, hands on knees, finished, while the flakes land on him unhurried.`+vA(S,P,'pride'),
  choices:[
    { t:'Run the margin, cloak over your head, as told.', virgil:1, go:'n_geryon' },
    { t:'Walk it upright and unhurried. Let it burn. You don’t bow to weather.',
      gleam:'pride', sin:{pride:2}, star:-1, go:'n_geryon' },
    { t:'Cross the open sand to the stopped old man. Carry him a stretch.', heart:2, virgil:1,
      star:1, go:'n_sand_carry' },
    { t:'Study the usurers’ crouch — each stares at a purse hung round his neck.',
      sin:{greed:1}, go:'n_geryon' },
    { t:'A runner breaks from a passing band — squinting up at you like a man rereading a beloved book.',
      go:'n_brunetto' },
    { t:'A giant lies unbowed on the open sand, cursing upward between the falling flakes.',
      go:'n_capaneus' },
  ]},
n_brunetto: { region:'sand', title:'The Running Teacher',
  text:`He cannot stop — that is his sentence, to run beneath the fire forever — so he runs <em>beside</em> you along the margin, craning up, and his scorched face does the impossible thing: it lights up.\n\n<em>“You,”</em> he says. <em>“A living face. And walking the long way down — someone taught you to read, then. GOOD. Someone taught you to read.”</em>\n\nHe was a teacher. You know it in half a sentence — the way he checks whether you’re keeping pace not with his feet but with his <em>meaning</em>. Ser Brunetto, of Florence: rhetorician, notary, the man half a city’s statesmen learned their letters from, jogging through eternity under a slow rain of fire with his dignity somehow entirely intact.\n\n<em>“Ask me the thing,”</em> he says. <em>“You have a question in your pocket. Students always do. Quickly — my band circles back for me at the next dune, and the fire dislikes loiterers.”</em>`,
  choices:[
    { t:'“How does a man make himself eternal?”', go:'n_brunetto2' },
    { t:'“Why are YOU here, teacher? What was the sin?”', heart:1, go:'n_brunetto2',
      fx:S=>S.flags.askedBrunetto=1 },
    { t:'Weep for him — the mind that taught a city, jogging under fire.', heart:1,
      go:'n_geryon', fx:S=>S.flags.wept_brunetto=1 },
    { t:'Keep your questions. Nod, and let him catch his band.', go:'n_geryon' },
  ]},
n_brunetto2: { region:'sand', title:'How Man Makes Himself Eternal',
  text:S=>(S.flags.askedBrunetto
    ? `<em>“The sin?”</em> He waves it off like a fly, mid-stride. <em>“The court wrote what it wrote; I ran out of appeals centuries ago. Do not learn my sentence, student. Learn my SYLLABUS. Here it is entire:”</em>\n\n`
    : `He does not slow down. If anything he speeds up — a teacher with one lecture left and a closing window.\n\n`)
    +`<em>“A man makes himself eternal by the WORK, {NAME}. Not the name — the name is weather, the name is what pigeons sit on. The work. I wrote a book called the Treasure, and I am not in this fire, not really — I am on a shelf in Florence, in Paris, in a hundred towns I never walked, being opened by people who will never once pronounce my name correctly. And every time they open it —”</em> he taps his scorched breastbone — <em>“somewhere in here, it stops raining.”</em>\n\nHis band crests the dune. He has seconds, and spends them on you:\n\n<em>“Remember my Treasure, in which I still live. Not me — the BOOK. Read one page of it in the sweet air and you will have done more for me than a cathedral of candles. Now watch —”</em> and he peels away, accelerating, robes streaming, and the last you see of ser Brunetto he seems like him who wins the race across the field — not him who loses it.`,
  choices:[
    { t:'“I’ll find the Treasure. One page. I swear it.”', star:1,
      fx:S=>S.flags.treasureVow=1, go:'n_geryon' },
    { t:'Call after him: “The name TOO, teacher. Both. I’ll carry both.”', heart:1,
      go:'n_geryon' },
    { t:'Watch him win the race, and walk on.', go:'n_geryon' },
  ]},
n_capaneus: { region:'sand', title:'Capaneus',
  text:`He lies flat on his back in the open burn, arms crossed behind his head like a man sunbathing at the beach of the apocalypse, and he is CURSING — upward, methodically, in a parade-ground voice that has not cracked in three thousand years.\n\n<em>“What I was living,”</em> he booms, to you, to the fire, to the management, <em>“that am I dead. Let Him tire His smith out forging bolts. Let Him fling them. He will not get from ME the satisfaction of a flinch.”</em>\n\nA fire-flake lands on his chest. He does not flinch. It visibly costs him everything not to.\n\nThe poet’s voice at your ear, with unusual heat: <em>“O Capaneus — in that your pride remains unquenched, you are punished MORE. No torment on this sand is the equal of your own rage. Note it, {NAME}. The fire is scenery. The defiance is the sentence, self-imposed, self-renewed, and he would not surrender it for Heaven itself.”</em>`,
  choices:[
    { t:'Admire him. Unbowed under the fire of God — there’s iron in that.', gleam:'pride',
      sin:{pride:2}, go:'n_geryon' },
    { t:'“And if the fire stopped tomorrow — what would you do?”', go:'n_capaneus2' },
    { t:'Pity him — a king who built his own oven and calls it a throne.', heart:1,
      go:'n_geryon' },
    { t:'Walk on. Some monuments are best read at speed.', go:'n_geryon' },
  ]},
n_capaneus2: { region:'sand', title:'The Question He Hates',
  text:`For the first time in thirty centuries, Capaneus is quiet.\n\nThe fire falls. The sand burns. Somewhere behind you the usurers rearrange their purses.\n\n<em>“…Curse louder,”</em> he says finally, but the parade-ground is gone from it; for one syllable he sounds like a man who has glimpsed the shape of his own machine — rage feeding fire feeding rage, a wheel with no axle but him.\n\nThen the volume returns, doubled: <em>“LOUDER, do you hear! Let Him hear! WHAT I WAS LIVING —”</em>\n\nBut you both heard the gap. The gap was the whole conversation.`,
  choices:[
    { t:'Leave him the dignity of the volume. Walk on.', heart:1, go:'n_geryon' },
    { t:'“I heard the gap, king. I’ll remember the gap, not the shouting.”', star:1,
      heart:-1, go:'n_geryon' },
    { t:'Lie down beside him a moment in solidarity. Curse once, together.', sin:{wrath:1,pride:1},
      go:'n_geryon' },
  ]},
n_sand_carry: { region:'sand', title:'The Weight of a Stranger',
  text:`He weighs nothing — the dead are all debt and no substance — but the fire doesn’t know that, and it finds you fast. You get him to the steaming channel’s edge, both of you smoldering, and set him down.\n\n<em>“Why?”</em> he asks. Not gratefully. <em>Forensically.</em> Nobody has done anything sideways in this circle for a thousand years; everything here moves either up (fire) or down (sand). You have introduced a horizontal, and he is troubled by the geometry.\n\nYou have no answer that survives the walk back into words. He watches you go, and just before the fire-rain closes the view, he raises one hand — not a wave. More like a man in court, volunteering as witness.`,
  choices:[
    { t:'Walk on, burned and lighter.', go:'n_geryon' },
    { t:'Call back: “Because nobody carried ME yet. Pass it down.”', star:1, go:'n_geryon' },
  ]},
n_geryon: { region:'geryon', title:'The Honest Face',
  text:`The rim ends at a cliff with no bottom — just dark going down like a held note. The poet unknots a cord from about his waist and drops it over the edge, which is either fishing or summoning, and shortly the difference stops mattering:\n\nUp out of the nothing swims GERYON. The face of a just man — kind eyes, benevolent, the face of everyone’s favorite teacher — mounted on the body of a serpent-scorpion, hairy-pawed, tail tipped with venom, the whole rig upholstered in little knots and circles like a Turkish carpet woven by a lawyer.\n\n<em>“Behold the image of Fraud,”</em> says the poet. <em>“It always leads with the face. We ride him down. There is no other stair.”</em>`,
  choices:[
    { t:'Mount behind the poet. Ride Fraud down, holding tight.', go:'n_c8_bridges' },
    { t:'Study the honest face first. Learn the trick of it for later.', star:1,
      go:'n_c8_bridges', fx:S=>S.flags.readFraud=1 },
    { t:'“Poet — have YOU ever fallen? From anything?”', virgil:1, go:'n_c8_bridges',
      fx:S=>S.flags.virgilFall=1 },
    { t:'Refuse the beast. Climb down the cliff by hand instead.', end:'e_fall' },
  ]},

/* ---------------- CIRCLE VIII — MALEBOLGE ---------------- */
n_c8_bridges: { region:'malebolge', title:'The Ten Trenches',
  text:S=>(S.flags.virgilFall?`(He was quiet for most of the descent. Then: <em>“Once. I died three months before the mercy I needed was born. You may not understand that arithmetic yet. Hold tighter; he banks left.”</em>)\n\n`:``)
    +`Geryon sets you down like a debt collector being gentle for the cameras, and is gone.\n\nMalebolge: ten concentric trenches of graded fraud, stitched with stone bridges, administered — audibly — by demons. In one ditch flatterers swim in exactly what flattery is; in another the diviners walk with heads twisted backward, weeping down their own spines for the crime of peeking at God’s cards.\n\nAt the sixth bridge a delegation awaits: demons, tusked and courteous, led by one with the smile of a maître d’.\n\n<em>“Travelers! The sixth bridge is broken — fell in the great quake, terribly sad. But happily,”</em> — the smile lengthens — <em>“we know the detour. Our escort is complimentary.”</em>`,
  choices:[
    { t:'Accept the complimentary escort.', go:'n_demon_march' },
    { t:'Decline politely. Take the long ridge alone.', virgil:1, go:'n_ulysses' },
    { t:'Ask a backward-facing diviner what’s coming for you.', star:-1,
      go:'n_diviner' },
    { t:'Lean over the flatterers’ ditch and tell them they look great down there.',
      heart:-1, go:'n_ulysses', fx:S=>S.flags.mocked=1 },
    { t:'Down the ridge, from the last trench of all, a voice is calling your name. Calling it PERFECTLY.',
      go:'n_impostor' },
  ]},
n_impostor: { region:'malebolge', title:'The Falsifier',
  text:`The tenth trench holds the falsifiers — of coin, of word, of person — and it is from the last kind that the voice rises. You look down, and you look back up at yourself.\n\nIt has your face. Not a likeness: the face, worn correctly, doing the small things your face does that you have never seen from outside. It has your walk, pacing the trench. It has your voice, and the voice is saying:\n\n<em>“Thank God — {NAME}, help me, it took my place. I fell HERE and it walked on with the poet. I’m you. I’M you. Ask me anything. Ask me about the morning we — ”</em> and it names a morning. A real one. One you have never told anyone.\n\nBeside you, the poet says nothing at all, which is either a test or a mercy.`,
  choices:[
    { t:'Say your name back at it — level, once. There is only one holder, and the holder is holding.',
      star:1, go:'n_ulysses', fx:S=>S.flags.impostorFaced=1 },
    { t:'Ask it something only you could answer.', star:-1, go:'n_impostor2' },
    { t:'Turn away. Whatever it knows, it knows it in the wrong trench.', go:'n_ulysses' },
    { pre:'death’s office', t:'Counterfeits are Death’s paperwork too. Retire this one.',
      req:S=>S.flags.scythe, sin:{wrath:1},
      fx:S=>{S.punished=(S.punished||0)+1;S.flags.impostorCut=1;}, go:'n_ulysses' },
    { t:'It argues so well. It remembers so warmly. Maybe it IS the better {NAME}. Trade.',
      gleam:'envy', req:S=>S.sins.envy>=2||S.sins.pride>=3, end:'e_replacement' },
  ]},
n_impostor2: { region:'malebolge', title:'The Quiz',
  text:`You ask it the thing. The unshareable thing — the one fact so interior it has no witnesses at all.\n\nIt answers correctly.\n\nWorse: it answers the way YOU would answer, with the same pause in the same place, the same small deflection at the end. The trench is very quiet. Somewhere down its length, other counterfeits have stopped pacing to watch a matter of professional interest.\n\n<em>“See?”</em> it says, gently, in your gentlest register. <em>“Now. One of us should really be getting on. The poet is waiting for {NAME}.”</em>`,
  choices:[
    { t:'“Yes. He is.” Walk on, and do not run, and do not look back.', star:1, go:'n_ulysses' },
    { t:'Demand to know where it learned all that.', star:-1, go:'n_ulysses',
      fx:S=>S.flags.impostorDeep=1 },
    { t:'It’s right. Somebody should get on — and it makes a strong case that it’s it.',
      gleam:'envy', end:'e_replacement' },
  ]},
n_diviner: { region:'malebolge', title:'The Backward Prophet',
  text:S=>{ const d=domSin(S);
    return `The diviner must walk away from you to face you, which sets the tone.\n\n<em>“You want the future,”</em> she weeps, down her own back. <em>“Everyone wants the future. I SOLD futures. Now I get all of it I can eat and I walk into everything shin-first.”</em>\n\nShe reads you anyway — she cannot help it, the habit outlived the sentence:\n\n<em>“${d ? 'I see '+SIN_WORD[d]+' waiting for you below like a coat in your size, already paid for. It knows your name, pilgrim. It has your mouth.' : 'I see… nothing settled in you yet. That is rarer than comets down here. It will not last. Nothing unsettled lasts.'}”</em>\n\nThe knowing sits in you like swallowed sea-water. Some doors are heavier from the inside.`; },
  choices:[
    { t:'Walk on, and try to unhear it.', go:'n_ulysses' },
    { t:'“And the stars? Do I reach the stars?”', star:-1, go:'n_ulysses',
      fx:S=>S.flags.askedStars=1 },
    { t:'Weep for her — drowned in the one direction she can’t swim.', heart:1,
      go:'n_ulysses' },
  ]},
n_demon_march: { region:'malebolge', title:'The Complimentary Escort',
  text:`They march you along the fifth ditch — boiling pitch where grafters bob like dumplings in a municipal stew — and the escort performs its courtesies: honor-guard formations, a trumpet impression executed with an orifice you decline to identify.\n\nThen the bridge. There is no bridge. There was never a broken sixth bridge to detour around; there is only the place where the demons stop walking and start smiling.\n\n<em>“Terribly sad,”</em> says the maître d’, producing a hook. <em>“The detour’s broken too.”</em>\n\nThe poet moves before grammar does: he seizes you bodily and SLIDES — down the bank of the next ditch on his back, holding you like a mother, not like a poet — as thirteen contracts’ worth of demons arrive where your neck just was.`,
  choices:[
    { t:'Roll clear at the bottom and RUN.', star:-1, go:'n_ulysses',
      fx:S=>S.flags.demonEscape=1 },
    { t:'Stop to thank him — properly, hands on shoulders, eye to eye.', virgil:2,
      go:'n_ulysses', fx:S=>S.flags.thankedSlide=1 },
    { t:'Turn back up the bank to file a complaint.', sin:{wrath:2}, end:'e_pitch' },
  ]},
n_ulysses: { region:'malebolge', title:'The Horned Flame', judge:{soul:'s_ulysses',go:'n_ulysses_offer'},
  text:(S,P)=>soulMem(S,P,'s_ulysses')+(S.flags.thankedSlide?`(He looked at your hands on his shoulders like artifacts from a lost civilization. <em>“Yes. Well,”</em> he said, and reorganized his dignity. But he walked differently after — the walk of a man whose catch was witnessed.)\n\n`:``)
    +`The eighth ditch holds fire in flakes — each flame a soul, walking its trench like a thought being reworded forever. And one flame is horned, split in two tongues, and the greater horn bends toward you before anyone summons it.\n\n<em>“Living voice,”</em> it says, in a tone that commanded ships. <em>“I know the sound. I spent it all.”</em>\n\nUlysses. The man who talked the Trojan Horse into being, who talked a decade of war into legend — and who, gone gray, docked at home for one winter, then talked one last crew past the edge of every map: <em>neither fondness for my son, nor reverence for my aged father, nor the due love that should have gladdened Penelope, could conquer in me the ardour that I had to gain experience of the world.</em> Five months past the pillars of the permitted, a mountain rose from the sea — and the sea, on instructions, closed over them.\n\n<em>“I told my old men something, that last morning, to make them row past the edge. Would you like to hear it? Everyone down here has heard it. The demons request it at parties.”</em>`,
  choices:[
    { t:'“Say it.”', learnVerse:'v_brutes', fx:S=>S.judged.s_ulysses='question',
      go:'n_ulysses_verse' },
    { t:'Weep for the drowned crew — the old men he spent on his hunger.', heart:1,
      fx:S=>S.judged.s_ulysses='pity', go:'n_ulysses_offer' },
    { t:'“Fraud, they filed you under. Not explorer. FRAUD.”', heart:-1,
      fx:S=>S.judged.s_ulysses='condemn', go:'n_ulysses_offer' },
    { pre:'carry his name', t:'“They’ll say it above: he sailed. Whatever else — he SAILED.”',
      remember:'s_ulysses', fx:S=>S.judged.s_ulysses='remember', go:'n_ulysses_offer' },
  ]},
n_ulysses_verse: { region:'malebolge', title:'The Little Speech',
  text:`The flame steadies, and out of seven centuries of fire comes the voice that emptied harbors:\n${VQ('v_brutes')}It lands in you the way it landed in them — like permission. Like a hand under the elbow of every reckless thing you ever wanted.\n\n<em>“Thirty words,”</em> the flame says. <em>“I have counted them often. Thirty words, five old men, one boat, and the open gate of the world. They rowed, pilgrim. They rowed WEEPING with joy. Whatever the ledger says I am — for one morning I was the thing that verse describes.”</em>`,
  choices:[
    { t:'Keep the verse. Walk on, carefully.', star:1, go:'n_ulysses_offer' },
    { pre:'carry his name', t:'“The speech comes up with me too. Attached to your name.”',
      remember:'s_ulysses', fx:S=>S.judged.s_ulysses='remember', go:'n_ulysses_offer' },
    { t:'“Thirty words that drowned five old men. Count THAT often.”', heart:-1,
      fx:S=>S.judged.s_ulysses='condemn', go:'n_ulysses_offer' },
  ]},
n_ulysses_offer: { region:'malebolge', title:'The Last Temptation of the Map',
  text:`The horned flame leans very close now. The heat is strangely dry, like a library.\n\n<em>“A thing I have learned down here,”</em> it says, softly, for you alone. <em>“The living walk out of any gate. It is the one law nobody thought to write, because who would be fool enough to test it? You could leave, pilgrim. Not up. OUT. There is sea beyond this pit — I have heard it through the rock on still nights. I know the bearing. I lack only…”</em> the flame bows, courtly, <em>“…a living hull.”</em>\n\n<em>“Come. One boat. Past the pillars of everything. The mountain rose from the sea to stop ME — think what that means: there is something out there they NEED stopped. Aren’t you curious? You were not made to live like unto brutes.”</em>\n\nAnd the worst of it is: it’s the truth. He is not lying. He never lied. That was never the shape of his fraud.`,
  choices:[
    { t:'“No. My map ends at the stars, old man. Yours never ends at all — that’s the sentence.”',
      star:1, go:'n_c9_ice' },
    { pre:'speak the verse — back at him', verse:'v_brutes',
      t:'“‘For pursuit of virtue AND of knowledge.’ You always skip a word, captain. I’m going down, and then up.”',
      star:1, virgil:1, go:'n_c9_ice', fx:S=>S.flags.beatUlysses=1 },
    { t:'Take his bearing. Board the one boat. Sail.', gleam:'pride', sin:{pride:2},
      end:'e_voyage' },
    { t:'Ask what he thinks is out there that needs stopping.', star:-1, go:'n_c9_ice',
      fx:S=>S.flags.heardBearing=1 },
  ]},

/* ---------------- CIRCLE IX — COCYTUS ---------------- */
n_c9_ice: { region:'ice', title:'The Lake of the Last Silence',
  text:(S,P)=>(S.flags.beatUlysses?`(Behind you, for a long moment, the horned flame did not move. Then — quietly, in Greek, in a tone you elect not to translate — it laughed, and walked its trench with something almost like lightness.)\n\n`:``)
    +`Down the last cliff, past giants racked like siege-towers in the gloom, the world arrives at its answer: ice.\n\nA lake of it, iron-hard, lit from nowhere — Cocytus. And in the ice, faces. The traitors, sealed to their chins, teeth chattering in a key that says the sound long ago stopped being about the cold. A wind you will meet the maker of shortly combs the surface.`+vA(S,P,'ice')+`\n\nWalking between the heads, your boot connects — hard — with a face.\n\n<em>“WHY do you TRAMPLE me?”</em> it howls. <em>“Unless you come to add to the vengeance of Montaperti — WHY?”</em>`,
  choices:[
    { t:'“Forgive me. I didn’t see you. Nobody could.”', heart:1, go:'n_c9_walk' },
    { t:'Demand his name. Traitors forfeit anonymity.', go:'n_bocca' },
    { t:'Walk on. This circle does not want conversation.', go:'n_c9_walk' },
    { t:'Ask the poet for one word of comfort, here in the worst cold.',
      req:S=>S.virgil>=5, learnVerse:'v_stars', virgil:1, go:'n_c9_walk',
      fx:S=>S.flags.virgilStars=1 },
  ]},
n_bocca: { region:'ice', title:'The Name in the Ice',
  text:`<em>“My name? I’m rather WEAK on names,”</em> the head sneers. <em>“The cold, you understand. It gets into the FILING.”</em>\n\nThe poet watches you, carefully neutral. Around you a thousand frozen mouths listen — treachery loves procedure.\n\nThere is a way to get a traitor’s name. The poem you are standing inside has already demonstrated it, and it involves the handful of hair now within reach of your mittened fist. The dark is watching to see which kind of pilgrim reaches the bottom of it.`,
  choices:[
    { t:'Take the hair. Twist until the filing improves.', sin:{wrath:2}, heart:-1,
      go:'n_c9_walk', fx:S=>S.flags.boccaNamed=1 },
    { t:'Let it go. His name is the last thing he owns.', heart:1, star:1, go:'n_c9_walk' },
    { t:'Crouch and whisper: “I’ll simply describe you. ‘A rude head near the middle.’ Forever.”',
      go:'n_c9_walk', fx:S=>S.flags.boccaMocked=1 },
  ]},
n_c9_walk: { region:'ice', title:'Two in One Hole',
  text:S=>(S.flags.boccaNamed?`(Bocca. Bocca degli Abati, screamed through his own hair — the man who cut the standard-bearer’s hand at Montaperti and drowned a city’s army in the confusion. Your knuckles remember the cold of him. You are not sure the knowing was worth the price of the getting.)\n\n`
    : S.flags.boccaMocked?`(The head went white past ice-white. In the ninth circle, being remembered WRONG is the deeper cut. You walk away having learned something about your own inventory of cruelties: it is better stocked than you thought.)\n\n`:``)
    +`Deeper in, where the ice holds its prisoners tilted like flotsam in a frozen wave, you come upon economy of a new kind: two souls in one hole, one behind the other — and the one behind is eating the skull of the one in front. Not in frenzy. With method. With — this is the detail your sleep will keep — with <em>maintenance</em>.\n\nHe feels you watching. He lifts his mouth from his meal and wipes it, deliberately, on the hair of the head he is eating.`,
  choices:[
    { t:'Ask what bottomless hate this is.', go:'n_ugolino' },
    { t:'Look away. Some doors you leave shut on purpose.', go:'n_judecca' },
    { pre:'speak the verse', verse:'v_sorrow',
      t:'“‘There is no greater sorrow than to be mindful of the happy time in misery.’ A lady upstairs taught me that. What was YOUR happy time?”',
      go:'n_ugolino_tale', fx:S=>S.flags.sorrowKey=1 },
  ]},
n_ugolino: { region:'ice', title:'The Gnawing',
  text:(S,P)=>soulMem(S,P,'s_ugolino')+`He considers your question with his mouth still resting against the skull, the way a man rests a hand on a gate he is thinking of going through again.\n\n<em>“You ask me to renew a desperate grief,”</em> he says at last, <em>“that crushes my heart merely in the thinking, before I speak. No.”</em>\n\nHe returns to the skull. The sound resumes. The ice creaks its ledger-creak, and the interview appears to be over — unless you happen to be carrying the one coin this particular toll-gate takes: a verse about sorrow, minted two circles up, by a lady in a storm.`,
  choices:[
    { pre:'speak the verse', verse:'v_sorrow',
      t:'“‘No greater sorrow than to be mindful of the happy time in misery.’ She weeps it in the whirlwind, sir. Trade me grief for grief.”',
      go:'n_ugolino_tale', fx:S=>S.flags.sorrowKey=1 },
    { t:'Stand in silence and witness the gnawing a while.', heart:-1, go:'n_judecca' },
    { t:'Pray — for either of them, both of them, whichever prayer fits.', star:1, heart:1,
      go:'n_judecca' },
    { t:'Leave. The bottom of the world keeps its own counsel.', go:'n_judecca' },
  ]},
n_ugolino_tale: { region:'ice', title:'Ugolino', judge:{soul:'s_ugolino',go:'n_ugolino_after'},
  text:`The mouth lifts. Something old moves behind the frost on his eyes — the sound of a door unlocking from the inside.\n\n<em>“The happy time,”</em> he says. <em>“Yes. There was one. That is the engine, as your lady says. Then hear it, and carry it, and let it crush you a little too — grief shared is grief halved, said no one who was ever in this lake.”</em>\n\n<em>“I was Count Ugolino. This—”</em> a nod at the skull, almost collegial — <em>“is Archbishop Ruggieri, who smiled, and offered peace, and locked me in a tower with my four boys. We heard them nail the door below us. Nail it, pilgrim. And then the tower went quiet, and I watched four dawns come through a slit of window, each one landing on four faces that looked like mine.”</em>\n\n<em>“My boys offered me their own flesh — ‘Father, you gave us this flesh, take it back’ — children say such things, meaning them, not knowing what the meaning does. One by one they fell, between the fifth day and the sixth. I went blind over them. Called their names for two days after. And then—”</em>\n\nThe pause is the length of a tower stair.\n\n<em>“Then hunger did what sorrow could not do.”</em>`,
  choices:[
    { t:'Weep. There is no other adequate paperwork.', heart:2,
      fx:S=>S.judged.s_ugolino='pity', go:'n_ugolino_after' },
    { t:'“And yet — Pisa starved YOUR debts too, Count. The tower had a reason with your name on it.”',
      heart:-2, fx:S=>S.judged.s_ugolino='condemn', go:'n_ugolino_after' },
    { t:'“The last line. Does it mean grief killed you first — or… the other thing?”',
      fx:S=>S.judged.s_ugolino='question', go:'n_ugolino_ask' },
    { pre:'carry the names', t:'“Not yours, Count. Theirs. Gaddo. Uguccione. The boys go up with me — the world will hear the CHILDREN’S names.”',
      remember:'s_ugolino', fx:S=>S.judged.s_ugolino='remember', go:'n_ugolino_after' },
  ]},
n_ugolino_ask: { region:'ice', title:'The Unaskable',
  text:`The frost-eyes fix on you for a long time. In the ice, no one breathes; the wind from below fills in for everyone.\n\n<em>“Seven hundred years,”</em> he says finally, <em>“and you are the first to ask it to my face rather than behind my back in Latin.”</em>\n\nHe does not answer. He looks at the skull under his hands — the jailer, the smiler, the locker of doors — and then he looks at his hands.\n\n<em>“I will tell you what I tell the ice. The line says what it says. A father knows several hungers, pilgrim, and the tower taught me the acquaintance of ALL of them. Let the ambiguity stand — it is the only tomb my boys got.”</em>`,
  choices:[
    { pre:'carry the names', t:'“Then the boys get a better one. Gaddo. Uguccione. Said in sunlight, every year.”',
      remember:'s_ugolino', fx:S=>S.judged.s_ugolino='remember', go:'n_ugolino_after' },
    { t:'Bow your head to the ambiguity, and leave it be.', heart:1, go:'n_ugolino_after' },
    { t:'Watch him resume the skull. Understand the maintenance now.', gleam:'gluttony',
      req:S=>S.sins.gluttony>=3, end:'e_hunger' },
  ]},
n_ugolino_after: { region:'ice', title:'What the Ice Keeps',
  text:S=>{ const j=S.judged.s_ugolino;
    return (j==='remember'
      ? `Something happens to his face that the ice actively resists: the frost cracks, hairline, around his eyes.\n\n<em>“The children’s names,”</em> he says. <em>“Not the count. Not the traitor. The boys.”</em> He returns to the skull — the sentence is the sentence — but slower now, like a man eating to live instead of hating to stay warm.\n\n`
      : j==='condemn'
      ? `<em>“Yes,”</em> he says simply. <em>“It did.”</em> And he returns to the skull with the calm of a man who has been agreeing with that verdict for seven centuries and finds your arrival at it unremarkable.\n\n`
      : `He watches you a moment longer, then bends back to his work. The tower, the dawns, the small offered hands — all of it folds back under the frost, filed where the ice files everything: forever, and at the original temperature.\n\n`)
      +`The poet draws you on. The wind is stronger now — rhythmic, vast, three-lobed. Ahead, through the murk, the ice-locked souls stop even having faces: sealed whole under the surface, bent like straws in glass. Judecca. The bottom of the bottom. No one here will speak to you again.`; },
  choices:[
    { t:'Walk the last silence.', go:'n_judecca' },
  ]},
n_judecca: { region:'ice', music:'judecca', title:'Judecca',
  text:S=>{ const n=S.names.length;
    return `Total silence, except the wind, which is not weather but wingbeat. The souls here are fully entombed in the ice — some lying, some upright, some inverted like things poured wrong — beyond speech, beyond plea, beyond even the begging-to-be-remembered that has followed you down nine circles like rain.\n\nNothing here can ask you for anything. That is the loneliest fact in the universe.\n\n${n>0?`The name${n>1?'s':''} you carry — ${S.names.map(id=>souls[id].name).join(', ')} — sit${n===1?'s':''} warm against the cold, like coals in a pocket.`:`Your pockets are empty of names. You carried no one. The thought has a temperature, and it matches the lake’s.`}\n\nAhead, in the fog of its own wingbeat: a shape the size of the world’s worst idea.`; },
  choices:[
    { t:'Walk toward the shape.', go:'n_lucifer' },
    { t:'Speak the names aloud, one by one, into the silence that can’t.',
      req:S=>S.names.length>0, heart:1, star:1, go:'n_lucifer',
      fx:S=>S.flags.namesSpoken=1 },
    { t:'Say your own name aloud, to hear a living voice once more.', star:-1,
      go:'n_lucifer', fx:S=>S.flags.echoWrong=1 },
    { t:'Stop walking. The silence is complete. You could be too.', gleam:'sloth',
      req:S=>S.sins.sloth>=2, end:'e_icefast' },
  ]},

/* ---------------- LUCIFER & THE CLIMB ---------------- */
n_lucifer: { region:'lucifer', title:'The Emperor of the Dolorous Realm',
  text:S=>(S.flags.echoWrong?`(Your name came back wrong. Same syllables, different owner. You will not be trying that again.)\n\n`:``)
    +`He is enormous the way arithmetic is enormous — you keep computing and the total keeps refusing to fit. Waist-deep in the ice HIS OWN WINGS keep frozen: six wings, bat-leathered, beating an eternal blizzard that seals him in the very lake his escape attempts manufacture. The engine of Hell is Hell’s own prisoner, running its refrigeration on despair.\n\nThree faces on one head — red, whitish-yellow, black — and in each mouth a traitor being worked like a grain mill: Judas, head-first, deepest. The weeping from three sets of eyes runs down over three chins and freezes into the general supply.\n\nHe does not notice you. That is the final horror: you are not large enough to be noticed. The poet’s voice, very quiet: <em>“The place where thou must arm thyself with fortitude. We climb DOWN him, {NAME}. Through the center of everything. His fur is the only ladder out.”</em>`,
  choices:[
    { t:'Take hold of the fur. Climb.', go:'n_climb' },
    { pre:'speak the verse', verse:'v_brutes',
      t:'“Ye were not made to live like unto brutes.” Say it — at HIM — and then climb.',
      star:1, go:'n_climb', fx:S=>S.flags.brutesAtDevil=1 },
    { t:'Kneel. Something this large must be owed something.', gleam:'pride',
      req:S=>S.sins.pride>=2, end:'e_frozen' },
    { t:'There — beside him in the ice — a seat-shaped absence. A throne going spare.',
      req:S=>S.star<=0 && domSin(S)==='pride', end:'e_throne' },
    { pre:'the bargain', t:(S)=>`Speak into the wind of his wings. Offer the one trade a landlord of debts cannot refuse: your living seat at his side — for the passage of the names you carry.`,
      req:S=>S.names.length>0, end:'e_trade' },
    { pre:'the vacancy', t:'Raise the scythe. Somewhere behind you, all the way up, an office has been standing empty — and you have been doing its rounds all the way down.',
      req:S=>S.flags.scythe && (S.punished||0)>=3, end:'e_scythe' },
    { t:'Stare into the middle face first. Know the worst on purpose.', star:-2,
      go:'n_climb', fx:S=>S.flags.staredDevil=1 },
  ]},
n_climb: { region:'lucifer', title:'The Ladder of Fur',
  enter:S=>{ if(S.verses.includes('v_stars')) S.star=Math.max(S.star,3); },
  text:S=>(S.verses.includes('v_stars')?`Virgil’s promise-verse warms in your keeping like a coal: <em>thence we came forth to rebehold the stars.</em> It is not a hope. It is an itinerary.\n\n`:``)
    +`You climb down the flank of the Emperor between wing-beats, fistful by frozen fistful, the poet beneath you calling holds — and then, at a point your body understands before your mind does, the poet TURNS AROUND, and begins climbing UP the same fur you were climbing down.\n\nThe center of the earth. The middle of all falling. Every direction called “down” in the universe meets here, shakes hands, and reverses.\n\nYour stomach files a formal objection. Below you — above you — the shaggy legs of the Emperor of Despair point the other way now, planted in his ice like a fly in amber at the bottom of a wine glass nobody will ever finish.`,
  choices:[
    { t:'Keep climbing. Do not look back down. Or up. Down. Whichever.', go:'n_exit' },
    { t:'“Poet — HOW—”', virgil:1, go:'n_exit', fx:S=>S.flags.askedHow=1 },
    { t:'Look back once at the inverted feet of the Devil.', star:-1, go:'n_exit' },
  ]},
n_exit: { region:'lucifer', motif:'s_virgil', title:'The Burrow at the Bottom of the World',
  enter:(S,P)=>{ S.flags.marks = P.witness.filter(w=>w!=='s_virgil').length
    + S.names.filter(x=>x!=='s_virgil' && !P.witness.includes(x)).length; },
  text:S=>(S.flags.askedHow?`(<em>“By such stairs,”</em> he said, not stopping, <em>“must we depart from so much evil. Also: gravity is a local ordinance. Climb.”</em>)\n\n`:``)
    +`A natural burrow winds up through the rock — no torches, no verses carved anywhere, blessedly unadministered. And far ahead, through the round mouth of it: a coin of night sky. Actual sky. With actual stars, doing their ancient unbothered arithmetic.\n\nThe sound of a little stream keeps you company upward, wearing the mountain away on a schedule of its own.`
    +(S.flags.marks>=8 && !S.names.includes('s_virgil')
      ? `\n\nAt the threshold, the poet stops walking.\n\nYou know before he says it. His road ends here. It always ends here — he has seen this coin of sky a hundred times and never once spent it. <em>“Limbo keeps what Limbo keeps,”</em> he says, evenly, the way you’d read a timetable. <em>“I go back down now. It is not so bad. It is home, whatever else it is. The company, as I said, is excellent.”</em>\n\nHe straightens your collar — an absurd, parental gesture, here, at the bottom of the universe.\n\n<em>“Go up, {NAME}. Rebehold the stars for both of us.”</em>\n\nEight names ride with you — some already cut into the Witness Wall, some still warm in your pockets, waiting for the living air. There is room, you realize, for a ninth.`
      : ``),
  choices:[
    { pre:'the ninth name', t:'“No. Not for both of us. VIRGIL — poet of Rome, guide of the lost, keeper of the excellent company. I’ll say it up there until it’s a road. Someone will walk it down to you.”',
      req:(S,P)=>S.flags.marks>=8 && !S.names.includes('s_virgil') && !P.witness.includes('s_virgil'),
      remember:'s_virgil', virgil:2, go:'n_purgatorio' },
    { t:'Step out, under the stars.', end:(S,P)=>{
        if (S.star<=1) return 'e_falsestars';
        if ((S.absolved||0)>=4) return 'e_redeemer';
        const iv=['v_midway','v_gate','v_hope','v_sorrow','v_brutes','v_stars'];
        if (iv.every(v=>S.verses.includes(v))) return 'e_poet';
        return 'e_stars'; } },
    { pre:'the way up', t:'The burrow forks — and the second mouth breathes dawn. The road you opened once stands open forever.',
      req:(S,P)=>P.witness.includes('s_virgil'), go:'n_purgatorio' },
    { t:'Embrace the poet first. Rules of Limbo be damned.',
      virgil:1, heart:1, fx:S=>S.flags.hugged=1,
      go:'n_exit2' },
    { t:'Look back down the burrow one last time.', go:'n_exit2',
      fx:S=>S.flags.lookedBack=1 },
  ]},
n_exit2: { region:'lucifer', motif:'s_virgil', title:'The Threshold',
  text:S=>(S.flags.hugged?`He permits the embrace with the rigid astonishment of a man being hugged by a era that hasn’t been invented yet. <em>“Yes. Well,”</em> he says again — his phrase for feelings — and pats your shoulder twice, exactly twice, as if metering it.\n\n`
    :`The burrow behind you goes down into everything you now know is there. It has the decency to be silent about it.\n\n`)
    +`The coin of sky waits. The stream keeps working. Somewhere above, the world is still running — dinner tables, morning songs, quiet rooms where names are said or not said.\n\nOne step remains.`,
  choices:[
    { t:'Step out, under the stars.', end:(S,P)=>{
        if (S.star<=1) return 'e_falsestars';
        if ((S.absolved||0)>=4) return 'e_redeemer';
        const iv=['v_midway','v_gate','v_hope','v_sorrow','v_brutes','v_stars'];
        if (iv.every(v=>S.verses.includes(v))) return 'e_poet';
        return 'e_stars'; } },
    { pre:'the ninth name', t:'Turn back to the poet. There is a name still unspoken.',
      req:(S,P)=>S.flags.marks>=8 && !S.names.includes('s_virgil') && !P.witness.includes('s_virgil'),
      remember:'s_virgil', virgil:2, go:'n_purgatorio' },
    { pre:'the way up', t:'Take the second mouth of the burrow — the one that breathes dawn. The road you opened once stands open forever.',
      req:(S,P)=>P.witness.includes('s_virgil'), go:'n_purgatorio' },
  ]},

/* ---------------- PURGATORIO (true-ending path) ---------------- */
n_purgatorio: { region:'purgatorio', title:'The Shore of the Mountain',
  enter:(S,P)=>{ if (S.act!=='purgatorio') seedAscent(S, S.flags.ascentDirect
      ? ((P.lastRun&&P.lastRun.sins)||P.residue) : S.sins); },
  text:(S,P)=> (S.flags.ascentDirect
    ? `You wake on sand, and the sand is warm, and for one long disbelieving minute that is the entire content of your mind.\n\nDawn. The true one — sapphire going gold at the hem — over a sea that has never drowned anyone. Behind you the little stream chuckles out of the rock, still wearing the dark of the world it drained through. Before you the mountain goes up farther than up usually goes: terrace above terrace above terrace, and from somewhere unreasonably high, singing.\n\nYou know this shore. You opened this road once, name by name, and the road has not forgotten. But the weight on your shoulders is new — or rather, it is old: everything you walked down with, waiting to be walked OFF.\n\nSomewhere on your brow, skin you cannot see is already itching in seven places.`
    : `The poet’s face, when you finish, does something it has not done in nine circles: it forgets to be composed.\n\n<em>“A road,”</em> he repeats. <em>“Walked down to me.”</em> He looks at his hands — thirteen centuries of gesture — and laughs once, brief and real, the laugh of a man who wrote the whole epic and just got surprised by the last line.\n\n<em>“Then I am witnessed. Go. GO — the sky is wasting.”</em>\n\nYou step out — and it is dawn. Not night: DAWN, sapphire-colored, on a shore at the foot of a mountain that goes up farther than up usually goes. The little stream empties at your feet into a sea that has never drowned anyone. Dew is on the grass, actual dew.\n\nAnd the strangest thing: the weight of the descent came UP with you. Every sin you handled down there sits on your shoulders like luggage that followed you home. The mountain, you understand suddenly and completely, is where you carry it OFF.\n\nA reed grows at the tideline, humble as a spoon. High above — terraces, and singing.`),
  choices:[
    { t:'Wash the smoke of Hell from your face with the dew.', pace:-1, go:'p_casella' },
    { t:'Gird yourself with the reed, as the shore seems to want.', go:'p_casella',
      fx:S=>S.flags.reed=1 },
    { t:'Speak, to the sea, every name you ever carried.', pace:-1, go:'p_casella',
      fx:S=>S.flags.seaNames=1 },
    { t:'Start climbing. Now. The summit isn’t getting closer.', pace:2, go:'p_casella',
      fx:S=>S.flags.rushed=1 },
  ]},
p_casella: { region:'purgatorio', title:'The Singer on the Shore',
  text:(S,P)=>(S.flags.rushed?`You make it eleven steps up the first slope before the sound stops you — because some sounds are a hand on the shoulder.\n\n`:``)
    +`A boat has landed down the shore — a boat of light, poled by something too bright to look at, already leaving — and the souls it carried stand blinking on the sand exactly as you once stood. New dead. First morning.\n\nOne of them is looking at you. Then he is laughing, and crossing the sand with his arms out, and you know the face the way you know a season: a musician. A friend of a friend. A voice from the good rooms of your life.\n\n<em>“YOU,”</em> says Casella. <em>“Walking. Breathing. Here. The paperwork of this must be SPECTACULAR.”</em>\n\nHe cannot embrace you — his arms close on morning air, three times, and he laughs at each failure like it is the best joke the universe has told him yet. And then, because you ask — because of course you ask — he plants his feet in the sand, and breathes in, and sings:\n${VQ('v_love').replace('The Love which moves the sun and the other stars.','“Love, that within my mind discourses with me—”')}The new dead drift toward the sound. So do you. The mountain, the climbing, the seven itching letters of your brow — everything politely stops mattering. It is the first beautiful man-made thing you have heard since the world above, and it hangs in the dawn like a held note deciding to be eternal.`,
  choices:[
    { t:'Listen. All of it. Every verse. The mountain has waited; it can wait.', pace:-2,
      go:'p_cato', fx:S=>S.flags.heardSong=1 },
    { t:'Listen one verse — then gently break the spell yourself.', go:'p_cato' },
    { t:'Ask him to sing one of the verses you gathered below, instead.',
      req:(S,P)=>P.versesFound.length>2, pace:-1, go:'p_cato',
      fx:S=>S.flags.songOfYours=1 },
    { t:'Keep walking uphill while the song fades behind you.', pace:1, go:'p_manfred' },
  ]},
p_cato: { region:'purgatorio', title:'The Warden of the Shore',
  text:S=>(S.flags.songOfYours?`He hears your request, and his eyebrows climb — and then he sings it: a tercet you carried up out of the dark in your own mouth, returned to you in a trained voice under a real sky, and it is almost unbearable, hearing where the words always meant to live.\n\n`:``)
    +`The voice that ends it is not loud. It does not need to be.\n\n<em>“What is this, laggard spirits?”</em>\n\nAn old man stands up-slope — alone, white-bearded, lit by four stars nobody else can see — and his disappointment could organize armies. <em>“What negligence, what standing still is this? Run to the mountain. The song is good. The song will be BETTER when you have earned your ears back.”</em>\n\nThe new dead scatter uphill like starlings. Casella grins at you, unrepentant to the last note — <em>“find me at the top; I take requests”</em> — and runs with them.\n\nThe old warden’s eyes pass over you. Living. Burdened. Brow already itching. He says nothing at all to you, which is somehow the largest compliment of your entire journey.`,
  choices:[
    { t:'Climb, as instructed. Properly. At a pace.', go:'p_manfred' },
    { t:'Bow to the four stars over the old man first.', pace:-1, go:'p_manfred' },
    { t:'Ask him — “Earned our EARS back?”', go:'p_manfred', fx:S=>S.flags.askedCato=1 },
  ]},
p_manfred: { region:'purgatorio', title:'The Slow Meadow',
  text:S=>(S.flags.askedCato?`(He answered without turning: <em>“Beauty is wages, pilgrim. Up here everything you loved is wages. Climb, and be paid.”</em> You are going to be thinking about that for several terraces.)\n\n`:``)
    +`The first slopes belong to the waiting dead — the late-repentant, the excommunicate, the ones who turned to Heaven at the last breath after a lifetime of walking the other way. They are not punished. They are simply... scheduled. A soul that made Heaven wait must wait in turn, thirty years for every one, unless the living pray the term shorter.\n\nOne of them comes to meet you: golden-haired, handsome, with a sword-wound splitting one eyebrow and another over his heart, both worn as casually as jewelry.\n\n<em>“Look at me well,”</em> he says, and smiles. <em>“I am Manfred. King, once. Excommunicated twice — they dug my very bones out of consecrated ground and threw them in the rain. And yet.”</em> He spreads his hands at the shore, the dawn, himself. <em>“At the end, dying, with everything unforgivable already done — I turned. One breath’s worth of turning. It was enough. THAT is the scandal of this mountain, pilgrim: it was enough.”</em>\n\nHe leans close, and the king drains out of his voice, and what is left is only a father:\n\n<em>“My daughter Constance is alive in the world. If you walk there again — tell her where I am. Tell her her father is not lost. Only slow.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Constance. Her father is found, and climbing. I’ll carry it.”',
      pray:'pr_manfred', go:'p_belacqua' },
    { t:'“One breath’s turning — after a whole life? That’s the arithmetic here?”',
      go:'p_manfred2' },
    { t:'Study the two wounds he wears like jewelry.', go:'p_belacqua',
      fx:S=>S.flags.sawWounds=1 },
    { t:'Move on. The itching on your brow is getting specific.', pace:1, go:'p_belacqua' },
  ]},
p_manfred2: { region:'purgatorio', title:'The Scandal of the Mountain',
  text:`<em>“That’s the arithmetic,”</em> Manfred agrees, cheerfully. <em>“Offensive, isn’t it? You walked the basement. You saw the wheel, the marsh, the ICE — all that eternal bookkeeping, debit for debit. And up here a lifetime of wolf gets forgiven for one lamb’s breath at the finish.”</em>\n\nHe taps the split eyebrow.\n\n<em>“I earned the basement, friend. Ask anyone. And the arithmetic looked at me turning — one breath from the dark, already falling — and it ruled: LATE COUNTS. Late counts, up here. Write that over every gate in the world and half of Hell empties in a generation.”</em>\n\nHe looks up the impossible mountain, thirty waiting years for every year he made Heaven wait, and his smile does not dim by one candle.\n\n<em>“The prayer, though. The prayer makes it shorter. Constance. If you would.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Constance. I’ll say it where the living can hear.”',
      pray:'pr_manfred', go:'p_belacqua' },
    { t:'“Late counts.” Carry the sentence itself, and climb.', pace:-1, go:'p_belacqua' },
  ]},
p_belacqua: { region:'purgatorio', title:'The Man Behind the Rock',
  text:`Up-slope the path narrows past a great boulder, and in the shade behind the boulder sit the only souls on this whole mountain who are not visibly going anywhere: a scatter of loungers, arms around knees, heads down, in postures of such committed rest that the rest itself looks load-bearing.\n\nOne of them raises his head exactly enough to see you, and no further.\n\n<em>“Well,”</em> he says. <em>“The athlete arrives.”</em>\n\nYou know that voice. Half the workshops of your old life had one: the craftsman who was better than everyone and moved slower than anyone, the genius of the unhurried. Belacqua. He watches you stand there radiating climb, and something in his face achieves the dignity of a philosophy.\n\n<em>“Sit down a minute,”</em> he offers. <em>“The mountain’s not going anywhere. I checked. That’s my whole job now — I sit here until a lifetime passes, because I sat down there until my lifetime passed. The sentence fits so well I can’t even resent it. Have you noticed that about this place? Every sentence FITS. It’s the tailoring of the thing that breaks you.”</em>`,
  choices:[
    { t:'Sit down a minute. One minute. He’s earned company.', pace:-1, go:'p_belacqua2' },
    { t:'“Get up. Climb with me. The sentence shortens if you WALK it.”', go:'p_belacqua2',
      fx:S=>S.flags.urgedBelacqua=1 },
    { t:'Laugh — the first laugh since the dark wood — and keep climbing.', go:'p_lapia' },
    { t:'Sit down with him properly. He’s right. The shade is perfect. The mountain isn’t going anywhere, and neither, for a long warm while, are you.',
      gleam:'sloth', req:S=>(S.burdens&&S.burdens.sloth>=3), end:'pe_belacqua' },
  ]},
p_belacqua2: { region:'purgatorio', title:'No Rush. Truly.',
  text:S=>(S.flags.urgedBelacqua
    ? `<em>“Walk it,”</em> he repeats, marveling. <em>“You sound like my mother. God rest her — she’s probably three terraces up, power-walking.”</em> He shifts one arm to a fractionally more comfortable position, an operation he performs with the care of a man moving a piano.\n\n<em>“Here is the thing the hurriers never learn,”</em> he says. <em>“The gate won’t open for me yet. I sat too long in the sweet air; now the sweet air sits in me. That’s not laziness anymore, friend — that’s the SENTENCE. I can no more rush this than you could rush the ice down there. So I wait beautifully. It is the one thing I was always world-class at.”</em>\n\n`
    : `You sit. The shade is, he is right, perfect. For one minute the mountain does not need you to be anything but a person leaning against a rock at dawn, and something in your shoulders un-ratchets that has been ratcheted since the she-wolf.\n\n<em>“There it is,”</em> Belacqua says quietly, watching you. <em>“That’s not sloth, what you just did. Sloth is refusing the climb. THAT was refueling for it. The terraces up there will teach you the difference with weights on. I got it explained to me for free, down here, and look how I’m using it.”</em>\n\n`)
    +`As you rise to go he adds, to your back, with heroic indifference:\n\n<em>“If someone up there prays for me — fine. No rush. Truly. But if you happened to mention the name Belacqua to anyone of the praying persuasion, I would not technically object.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Belacqua. To someone of the praying persuasion. No rush.”',
      pray:'pr_belacqua', go:'p_lapia' },
    { t:'“Wait beautifully, then. It suits you.”', go:'p_lapia' },
  ]},
p_lapia: { region:'purgatorio', title:'The Third Voice',
  text:`Higher, where the slope turns violent-steep and the sea below becomes a blue idea, the souls of the unshriven dead crowd the path — the ones taken suddenly, by blade or water, mid-sentence, mid-life, repenting in the half-second between the blow and the dark. They press around you like commuters, all asking at once: tell my brother, tell my wife, tell my town, pray, pray, PRAY —\n\nAnd through all of it, one voice, waiting its turn with perfect courtesy, and when the crowd finally parts there is a small woman with folded hands who says, in the tone of someone asking for a glass of water:\n\n${VQ('v_pia')}That is all. That is the whole request and the whole biography. Married to Maremma, dead of Maremma — pushed from a window of her husband’s castle, the crowd-whisper adds, so he could marry again — and she has compressed the entire catastrophe of her life into eleven words and a name, and she asks for nothing but the name.\n\nShe waits. The sea glitters four thousand feet below.`,
  choices:[
    { pre:'take the prayer', t:'“The Pia. Siena made her. I will say the whole of it, exactly as you said it.”',
      pray:'pr_pia', learnVerse:'v_pia', go:'p_night1' },
    { t:'Ask what he was like — the one who unmade her.', go:'p_lapia2' },
    { t:'Bow. Some requests are too complete to add to.', pace:-1, go:'p_night1' },
  ]},
p_lapia2: { region:'purgatorio', title:'What She Does Not Say',
  text:`La Pia considers the question with her head tilted, like a woman deciding whether a window needs curtains.\n\n<em>“He is not on this mountain,”</em> she says finally. <em>“That is the most I will say of him, and it is more than he said of me at the end.”</em>\n\nAnd then — because this is the terrace of the suddenly dead, who all learned the same lesson at the same speed — she adds, gently, as if YOU were the one who needed comforting:\n\n<em>“Do not carry him for me, pilgrim. I don’t. That is the trick of it, that nobody tells the living: the ones who unmake you are HEAVY, and you are allowed to set them down. I carried him exactly as far as the windowsill. The name I still carry is mine.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“The Pia. Hers, and only hers. I’ll carry it.”',
      pray:'pr_pia', learnVerse:'v_pia', go:'p_night1' },
    { t:'Set something of your own down on her terrace, quietly, before you climb.',
      pace:-1, go:'p_night1', fx:S=>S.flags.setDown=1 },
  ]},
p_night1: { region:'pnight', title:'The First Night',
  enter:S=>{ S.dayPhase=1; },
  text:S=>`The sun goes down like a law being enacted. One moment you are climbing; the next your leading foot simply declines the instruction — not tired, FORBIDDEN. The mountain does not permit climbing in the dark. Every guidebook of your bones knows it at once: here, you rise with the light or not at all.\n\n${S.flags.setDown?`(Whatever you set down on the Pia’s terrace, you notice, has not followed you up. Some luggage only needed permission.)\n\n`:``}You find a hollow in the warm rock as the stars come out — MORE stars than the world above, arranged in constellations you almost recognize, as if someone had corrected them. The singing on the terraces above quiets to a hum, then to breathing.\n\nAnd you dream. You dream of a golden eagle, terrible and patient, wheeling down out of the corrected stars — and it does not strike you. It gathers you. Up through the dark, wings like furnace doors, higher than the night, and just as the burning begins — the burning of nearness to something no pilgrim spells — the dream sets you down with impossible gentleness, the way a mother moves a sleeping child.`,
  choices:[
    { t:'Wake.', go:'p_gate' },
  ]},
p_gate: { region:'pgate', title:'The Gate of the Mountain',
  enter:S=>{ S.dayPhase=2; },
  text:`You wake two thousand feet higher than you slept.\n\nCarried. While you dreamed of the eagle, something real did the gathering — and set you here, on a shelf of white stone before three steps and a gate, in the first light of the second dawn.\n\nThe three steps: one of mirror-white marble, polished until it shows you yourself more honestly than you have ever been shown — one of black stone, cracked through like a thing that grieved — one of porphyry red as the blood that mends. And on the topmost step, an angel with a face too bright to be a face, holding a naked sword, seated on a threshold of diamond.\n\nYou climb the three steps because there is nothing else in the universe to do. The angel rises. The sword comes down — not to cut. To WRITE.\n\nSeven letters on your brow, one for each weight on your back: P, and P, and P, and P, and P, and P, and P. <em>Peccatum.</em> The itching resolves into script.\n\n<em>“Wash these wounds within,”</em> the angel says, in a voice like a struck bell forgiving the hammer. Two keys turn — one silver, one gold — and the gate swings open on darkness that goes UP.\n\n<em>“Enter. And do not look back. Whoever looks back at what they carried — returns outside, and begins again.”</em>`,
  choices:[
    { t:'Walk through, eyes forward, into the mountain.', go:'t1_arrive' },
    { t:'One look back — the sea, the shore, the whole road that brought you—',
      go:'p_lookback' },
    { t:'Touch the seven letters first. Learn their weight by heart.', pace:-1,
      go:'t1_arrive', fx:S=>S.flags.touchedPs=1 },
  ]},
p_lookback: { region:'pgate', title:'The Rule Is the Rule',
  text:`The sea IS beautiful. That is the terrible fairness of the trap.\n\nYou get one full second of it — the shore, the dawn-road across the water, the whole geography of everything you survived — and then the gate is not in front of you anymore, and the steps are not under you, and the wind is explaining, in the mountain’s patient grammar, that you are standing on warm sand.\n\nThe shore. The beginning. The reed, regrown, nods at the tideline — oh, it has seen this before.\n\nFar above, terraces. Singing. The seven letters still itch on your brow: the mountain does not take back its writing, only its progress. Somewhere behind a boulder on the first slope, a voice you know is already calling, with immense, immense satisfaction:\n\n<em>“Sit down a minute. The mountain’s not going anywhere. I CHECKED.”</em>`,
  choices:[
    { t:'Laugh. Bow to the mountain’s rulebook. Climb again.', pace:-1, go:'p_gate2' },
    { t:'Swear — properly, from the basement vocabulary — and climb again.',
      fx:S=>{S.burdens.wrath=Math.min(6,(S.burdens.wrath||1)+1);}, go:'p_gate2' },
  ]},
p_gate2: { region:'pgate', title:'The Second Approach',
  enter:S=>{ S.dayPhase=2; },
  text:`The mountain does not make the return climb harder. It does not need to. You walk the slow meadow again — Manfred salutes with two fingers off his split eyebrow, Belacqua does not visibly move but radiates I-told-you-so at geological wavelength — and the three steps and the angel and the sword are exactly where they were, patient as furniture.\n\nThe angel writes no new letters. The seven you have are the seven you get.\n\n<em>“Enter,”</em> the bell-voice says again. And then — was that... did the too-bright face incline, one degree, toward humor? — <em>“Eyes forward, this time.”</em>`,
  choices:[
    { t:'Eyes forward. Through the gate. Up.', go:'t1_arrive' },
  ]},
n_terraces: { region:'purgatorio', title:'The Mountain That Wants You to Climb It',
  text:S=>(S.flags.reed?`(The reed you plucked has already regrown at the tideline behind you — the first thing in two worlds you have seen come back.)\n\n`:``)
    +`The path spirals up and the light improves as you climb — not brighter exactly, but <em>better</em>, the way bread is better than the idea of bread. And everywhere on the mountain: singing. Not performance. Work-song. The penitents climb with their burdens and they sing the way rowers row.\n\nEverything here rhymes with the pit, deliberately, like an answer key. Souls carry weights — but upward. Faces are bent — over their own feet, watching the next step. There is smoke — from censers. You keep flinching at things that turn out to be kind.\n\nAhead, on the first terrace, a man toils bent double under a boulder easily twice the size of anything on the fourth circle’s wheel. He is the single most burdened creature you have seen since the ice.\n\nHe is humming.`,
  choices:[
    { t:'Approach the humming man under the boulder.', go:'n_terrace_soul' },
    { t:'Join the work-song as you climb. Learn it wrong. Learn it again.', star:1,
      go:'t1_angel' },
    { t:'Climb in silence. Some gratitude has no tune yet.', heart:1, go:'t1_angel' },
    { t:'Look back down — at the sea, and under the sea of cloud, the far smoke of the pit.',
      go:'t1_angel', fx:S=>S.flags.lookedBackUp=1 },
  ]},
n_terrace_soul: { region:'t_pride', title:'The Same Stone, Read Correctly',
  text:`Up close the boulder is appalling — and the man under it greets you like a host at his own door, cheek pressed to the rock, one eye finding yours.\n\n<em>“New!”</em> he says, delighted. <em>“You have the walk of the long way round. Came up through the floor, did you? Then you’ve seen my cousins on the fourth terrace of THAT establishment — the wheel, the shouting, why-hoard-why-squander, round and round?”</em>\n\nYou say that you have.\n\n<em>“Same stone,”</em> he says, and pats it, actually pats it. <em>“That is the joke of the whole architecture, friend, and nobody down there is allowed to get it: same stone, same weight, same bent back. One difference only.”</em> He hitches it higher and takes another step up. <em>“Mine has a TOP. This is pride I’m carrying — forty years of it, I was a magnificent pain of a man — and every step up, the stone is one step lighter than my account of it. Theirs is a sentence. Mine is a CURE. Same medicine. Different label.”</em>`,
  choices:[
    { t:'“Let me carry it a while. You’ve earned a rest.”', heart:1, go:'n_terrace_soul2' },
    { t:'“How long until the top?”', go:'n_terrace_soul2', fx:S=>S.flags.askedTop=1 },
    { t:'Bless him — the first happy burdened man in the universe.', burden:{pride:-1},
      go:'t1_oderisi' },
    { t:'Climb on, lighter for no reason you could write down.', go:'t1_oderisi' },
  ]},
n_terrace_soul2: { region:'t_pride', title:'The Whole Medicine',
  text:S=>(S.flags.askedTop
    ? `<em>“How long?”</em> He laughs, which costs him a step, which he pays gladly. <em>“As long as it takes — and understand, friend, up here that sentence is a COMFORT. Down where you walked, ‘forever’ is the horror. Up here, ‘as long as it takes’ means it TAKES. Arrives. Ends. I could climb this rock a thousand years and every one of them would rhyme with ‘almost.’”</em>\n\n`
    : `He shakes his head — gently, so as not to spill the stone.\n\n<em>“Kindly meant, and the answer is no, and the no is the whole medicine. It is MINE to carry. Forty years I handed the weight of myself to porters — servants, sons, a wife, two confessors, one spectacularly patient mule. The carrying is not the punishment, friend. The carrying is the first thing I have ever finished myself.”</em>\n\n`)
    +`He tips his head as far as the rock allows, which is his bow.\n\n<em>“Go up. She is waiting for you above the singing — everyone carrying anything on this mountain can feel it, like weather coming. And friend —”</em> one eye, bright as the dew — <em>“whatever you are still carrying from down there: keep carrying it. Just carry it UPHILL from now on. That is the entire difference between the two establishments.”</em>`,
  choices:[
    { t:'Climb to the light above the singing.', go:'t1_oderisi' },
    { t:'Touch the stone once, lightly, for luck — his kind of luck.', burden:{pride:-1},
      go:'t1_oderisi' },
  ]},
eden_matilda: { region:'eden', title:'The Ancient Forest',
  text:S=>(S.flags.huggedCrown?`(He permitted the embrace entirely this time — both arms, the full Roman surrender of it — and said, into your shoulder, so quietly it may have been for himself: <em>“Yes. Well. Go on, then.”</em>)\n\n`:S.flags.askedStay?`(<em>“Right here,”</em> he agreed. And did not say for how long, and you did not ask, because the mountain had already told you, gently, twice.)\n\n`:``)
    +`The summit is a forest — but the word does no justice. This is what forests have been trying to say all along: green with its license renewed, air so tender it forgives the lungs breathing it, a canopy that files the young sun into slow gold coins on the grass. The wood at the top of the world, older than weather. The first garden, kept on, under new management.\n\nA stream crosses your path, small and absolutely clear, and on the far side of it a young woman is gathering flowers, singing, hands never still — the dream, delivered.\n\n<em>“You made it up,”</em> Matilda says, as if resuming a conversation. <em>“Good. This is the wood men remember wrong on purpose, because remembering it right hurts too much. The water at your feet is Lethe. It takes away the memory of sin — drunk at the proper hour, in the proper order. And someone,”</em> — she looks past your shoulder, smiling like a herald — <em>“has been waiting to see you drink.”</em>\n\nDown the stream-bank, light is gathering. Not sunrise. Procession.`,
  choices:[
    { t:'Turn to see the light.', go:'eden_pageant' },
    { t:'“Lethe takes the memory of sin. ALL of it? Even what I did below?”', go:'eden_matilda2' },
    { t:'One handful of flowers first — Leah’s trade, learned from a dream.', pace:-1,
      go:'eden_pageant', fx:S=>S.flags.gatheredFlowers=1 },
  ]},
eden_matilda2: { region:'eden', title:'What the River Takes',
  text:`<em>“All the STING of it,”</em> Matilda says, precise as a druggist. <em>“Not the lesson. You will remember that you fell; you will lose the taste of falling. The dead you judged below will remember you the way the healed remember a surgeon — the cut forgotten, the walking kept.”</em>\n\nShe reads your face — the ledger-keeper's face, the witness's face, the face that carried names through the dark and verdicts across descents — and adds, kindly:\n\n<em>“You are wondering if forgetting is a betrayal of the witnessing. It is the opposite, pilgrim. You carried it all so it could be SET DOWN somewhere that keeps it better than a scar does. That is what this water is. The mountain's whole filing system, running clear.”</em>`,
  choices:[
    { t:'Turn to the gathering light.', go:'eden_pageant' },
  ]},
eden_pageant: { region:'pageant', title:'The Procession',
  text:`It comes down the far bank like a cathedral that learned to walk.\n\nSeven candlesticks of living flame, tall as masts, painting the air behind them in seven streaming bands. Elders in white, crowned in lilies, walking two by two and singing to a music that the seven bands seem to be the notation of. Four creatures winged with eyes — eyes all over, seeing everything, blinking nothing away. And drawn between them, by a griffin — eagle into lion, gold into white-and-crimson, two natures in one unhurried body — a chariot, empty, brighter than the sun has any patent on.\n\nThe whole forest attends. The stream stops chattering. ${'​'}Petals begin to fall from nowhere at all, a hundred hands scattering blossom above and within the light, and voices — every voice, the elders, the creatures, the wood itself — rise into one summons:\n\n<em>“Veni, sponsa. BENEDICTUS QUI VENIS—”</em>\n\nAnd in the heart of the falling flowers, on the chariot, where nothing had been standing — someone is standing. Olive crown over a white veil. A gown the color of living flame.\n\nYou know her before you see one line of her face. You have known her since a star out-burned the rest above a dark wood, and banked itself, saving its light for later.\n\nLater is now.`,
  choices:[
    { t:'Turn to Virgil — this, HE has to see, after thirteen centuries of—', go:'eden_gone' },
    { t:'Step toward the chariot, heart first.', go:'eden_gone', fx:S=>S.flags.steppedFirst=1 },
  ]},
eden_gone: { region:'pageant', title:'The Empty Place',
  enter:S=>{ S.flags.virgilGone=1; },
  text:S=>(S.flags.steppedFirst
    ? `You step toward her — one step, two — and the joy is so total it demands a witness, and you turn, the old reflex of the whole long road, to share it with the one who carried you here:\n\n`
    : `You turn, the words already leaving — <em>“Virgil, LOOK, it's her, it's—”</em>\n\n`)
    +`Grass. Morning light. The stair down the summit, empty all the way to its turning.\n\nHe is gone. He watched you walk in — a very good view, he said — and somewhere between the griffin and the olive crown, quietly, without one word of farewell beyond the several thousand he had already spent on you, the poet of Rome turned and started the long walk home to the excellent company.\n\nHe does not appear when you call. (You call.) ${S.flags.statius?`Statius's hand lands on your shoulder — the finished man, weeping freely himself, five hundred years of wanting to meet that exact departed shadow. <em>“So THAT was— oh, friend. Oh, friend. He walked me up my whole last terrace and I never—”</em>`:`The forest holds you kindly while you learn it.`}\n\nAnd from the chariot, through the falling flowers, comes a voice you have never heard with your ears before — and it is not comforting. It is TERRIBLE, the way the eagle in the first dream was terrible: love at a magnitude that has no interest in being safe. Your name. Just your name — {NAME} — pronounced by the person who wept it once in Limbo, thirteen centuries of patience ago.\n\n<em>“Do not weep yet for HIM,”</em> Beatrice says. <em>“There is a nearer weeping to do first. Look at me. Look at ME, {NAME}: I am. I am she. How did you DARE the mountain — and how did it take you THIS LONG to climb it?”</em>`,
  choices:[
    { t:'Weep — for the going of him and the arrival of her, one water.', go:'p_lethe',
      fx:S=>S.flags.weptBoth=1 },
    { t:'Stand and be seen. Hide nothing. You learned that at Minos.', go:'p_lethe' },
    { t:'“He kept every promise on the way to keeping yours. Be kind about what he could not do.”',
      pace:-1, go:'p_lethe', fx:S=>S.flags.defendedVirgil=1 },
  ]},
n_beatrice_verdict: { region:'beatrice', title:'The Weighing',
  text:(S,P)=>(S.flags.defendedVirgil?`Something moves behind the veil — the first un-stern thing. <em>“I know what I asked of him,”</em> she says, more quietly. <em>“I have kept the account of it since Limbo. He will not go unthanked forever, pilgrim. Now—”</em>\n\n`:``)
    +`She looks at you — all of you at once: the ledger and the heart, the burdens walked off and the letters wiped, the prayers riding your breath and every soul you judged in the deep basement of the world.\n\nThe dawn holds still for it.`,
  choices:[
    { t:'…', go:null,
      end:(S,P)=>{
        const perfect = psWiped(S)>=7 && (S.prayers||[]).length>=5
          && !S.sirenTaken && Math.abs(S.pace||0)<=4 && Math.abs(S.heart||0)<=4;
        if (perfect) return 'pe_paradiso';
        if (burdenTotal(S)>=8 || S.heart<=-4) return 'e_beatrice_stone';
        if (Math.abs(S.pace||0)>=5 || S.heart>=5) return 'e_beatrice_flood';
        return 'e_beatrice_clear';
      } },
  ]},
p_lethe: { region:'lethe', title:'The First River',
  text:(S,P)=>{
    const harsh=Object.keys(P.verdicts||{}).filter(k=>['condemn','punish'].includes(P.verdicts[k].last)).length;
    return `(You do not remember agreeing to enter the water. That is the first thing Lethe takes: the seam between deciding and being carried.)\n\nMatilda draws you across, light as a reed herself, your chin just above the current — and the river begins its patient subtraction. Not memory. STING. The kick you gave a frozen face at the bottom of the world dissolves off the memory like rust off iron; the fact stays, bright and clean and useless for wounding you ever again.\n\n${harsh>0?`And somewhere in the water's ledger, older business closes: the ${harsh} soul${harsh>1?'s':''} you struck or sentenced in the deep dark lose their grievance-copy of you. When you meet them again — and the architecture being what it is, you will — they will remember a pilgrim who came back changed, and nothing sharper. The river keeps the sharp part. It is what rivers are FOR.`:`The water finds surprisingly little to keep. You walked the dark gently, it seems, by the river's accounting — the current hums over you like a clerk pleased to find the books already balanced.`}\n\nOn the far bank they are singing <em>Asperges me</em>, and four ladies dance you dry, and the veil, ahead, is lifting.`; },
  choices:[
    { t:'Drink, as instructed, at the proper hour.',
      fx:(S,P)=>{ for (const k in (P.verdicts||{})) if (['condemn','punish'].includes(P.verdicts[k].last)) delete P.verdicts[k]; },
      go:'p_eunoe' },
  ]},
p_eunoe: { region:'lethe', title:'The Second River',
  text:`There is a second water — Eunoe, twin and answer — and Matilda draws you through that one too, because the mountain never subtracts without restoring.\n\nWhere Lethe took the sting, Eunoe returns the GOOD, sharpened: every kindness you did in two realms, remastered. The dry breath you bought a glutton in the rain. One leaf turning green in a gray wood. A sullen woman's song, finally rising. The names — every name — said at dinners, at seas, at thresholds, each one arriving back in you like bread.\n\nYou come up from the second river remade the way the poem promises — even as new trees renewed with new foliage — and she is waiting on the bank, veil lifted now, eyes the reason the word needed inventing, and beyond her the sky goes up and UP, terraceless, starred even in daylight, ready.\n${VQ('v_pure')}`,
  choices:[
    { t:'Rise, pure and disposed, to whatever mounts from here.', learnVerse:'v_pure',
      go:'n_beatrice_verdict' },
  ]},

/* ================= ACT II: THE TERRACES ================= */
t1_arrive: { region:'t_pride', title:'The Terrace of the Bent',
  text:`The first terrace is white marble, and the marble is a gallery: carved into the inner cliff, life-size and better than life, are the humble — annunciations, kings dancing before arks, emperors halting armies for a widow’s grievance — sculpture so perfect the carved people seem paused rather than made.\n\nAnd past the gallery come the penitents, and your whole chest re-learns the fourth circle in one look: they carry STONES. Great slabs on their backs, bent double beneath them, exactly like the wheel of the greedy — except.\n\nExcept they are climbing. Except the stones are shrinking — imperceptibly, the way glaciers move, but shrinking. Except that under the crushing weight, in voices flattened to the width of a floor, they are saying a prayer with the word OUR in it, and meaning the OUR.\n\nOn your brow, the first P burns faintly, recognizing home.`,
  choices:[
    { t:'Take up a stone from the terrace’s pile, and walk a circuit bent.', burden:{pride:-2},
      pace:0, go:'t1_oderisi', fx:S=>S.flags.stoneWalked=1 },
    { t:'Walk upright beside the bent, and listen to the flattened prayer.', go:'t1_oderisi' },
    { t:'Study the carved gallery first — the annunciation, the dancing king.', pace:-1,
      burden:{pride:-1}, go:'t1_oderisi' },
    { t:'A familiar humming, further along — a man under a boulder twice anyone’s.', go:'n_terrace_soul' },
  ]},
t1_oderisi: { region:'t_pride', title:'Oderisi of Gubbio',
  text:S=>(S.flags.stoneWalked?`(The stone is worse than anything the fourth circle showed you, because you can PUT IT DOWN and keep not doing so. When you finally set it back on the pile, your spine sings a hymn of its own.)\n\n`:``)
    +`One of the bent walks beside you — or rather, you walk beside him, matching his crushed half-steps. From under his slab he cranes to see you, and his face lights with what, in an unbent man, would be recognition.\n\n<em>“The living pilgrim,”</em> he says. <em>“Even here we heard. Do you know me? No — be honest — you don’t, and THAT, friend, is the entire curriculum of this terrace. I am Oderisi. Illuminator of Gubbio. In my day, if you wanted a manuscript to glow, you wanted ME. ‘The honor of that art,’ they called me. I dined on the phrase for thirty years.”</em>\n\nHe laughs, and the slab creaks.\n\n<em>“Then Franco of Bologna made pages that made mine look like practice. And someday soon a boy called Giotto will hang paint on a wall and empty every church of my name in a season. Listen — I have thought about this under rock for a long time, so take it whole:”</em>\n${VQ('v_wind')}`,
  choices:[
    { t:'“But I carried NAMES out of Hell. Remembrance was the whole road. Is that— was that wind?”',
      go:'t1_oderisi2' },
    { pre:'take the prayer', t:'“Then I’ll spend a breath of the wind. Whose name should it say?”',
      pray:'pr_oderisi', learnVerse:'v_wind', go:'t1_angel' },
    { t:'Walk with him in silence, bent to his height.', burden:{pride:-1}, pace:-1,
      go:'t1_angel' },
  ]},
t1_oderisi2: { region:'t_pride', title:'The Answer Under the Rock',
  text:`Oderisi is quiet for three crushed steps, and when he answers there is no wind in it at all.\n\n<em>“No. Oh, no, friend — you have it inside out. FAME is wind: the name traveling on its own, gathering size, serving no one but the named. What you did down there—”</em> the slab creaks as he tries, and fails, to gesture — <em>“you carried the names TO someone. To the living. For the DEAD’S sake. That is not rumour, pilgrim; that is testimony. The wind blows past. A witness ARRIVES.”</em>\n\n<em>“Here is the test, since you’re collecting things: my name will die. Franco’s will die. Giotto’s — give it six hundred years, it dies too. Does that grieve you?”</em>\n\nYou consider it honestly. The marble gallery glows. The stones shrink at glacier-speed.\n\n<em>“And the kindness you did the dead — when YOUR name dies, does the kindness?”</em>\n\nHe watches you arrive at it, delighted as a teacher at the exact moment the student stops needing him.\n\n<em>“There it is. Now: I have a name to spend, and it isn’t mine. Provenzan Salvani, who out-shone me alive and out-humbled me dead. Pray HIS, if you pray any.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Provenzan. Not yours — his. I see the lesson, and I’ll carry it anyway.”',
      pray:'pr_oderisi', learnVerse:'v_wind', burden:{pride:-1}, go:'t1_angel' },
    { t:'“Your name dies. The pages you lit don’t know that.”', pace:-1, go:'t1_angel' },
  ]},
t1_angel: { region:'t_pride', title:'The First Wing',
  text:(S,P)=>`At the far stair an angel stands in the white glare of its own courtesy — and this one’s whole office is a single gesture: a brush of the wing across the brow of whoever has walked the terrace down to its true weight.\n\nThe bent queue up the stair. Each one, passing, loses a letter — and each one straightens by a degree you can SEE, as if a decade were being helped off their shoulders like a coat.\n\n${(S.burdens&&S.burdens.pride<=1)?`The angel looks at you, and the wing lifts.`:`The angel looks at you — looks specifically at your brow, then at the set of your shoulders — and the wing does not move. Not refusal. Scheduling. The stone still shows.`}`,
  choices:[
    { pre:'the first letter', t:'Bow your head, and feel the wing pass — and the first P leave your brow like a splinter drawn.',
      req:S=>S.burdens&&S.burdens.pride<=1, wipeP:'pride', go:'t2_arrive' },
    { t:'Walk another circuit bent under stone, until the weight is true.',
      req:S=>S.burdens&&S.burdens.pride>1, burden:{pride:-2}, pace:1, go:'t1_angel' },
    { t:'Climb on regardless, letter and all. The mountain permits it — the letter keeps.',
      req:S=>S.burdens&&S.burdens.pride>1, go:'t2_arrive' },
  ]},
t2_arrive: { region:'t_envy', title:'The Terrace of Sewn Eyes',
  text:`The second terrace is the color of a bruise healing — livid stone, no gallery, no carvings, because carvings are for eyes and eyes are the whole indictment here.\n\nThe penitents sit in a row against the cliff like beggars at a church door, shoulder against shoulder, each one leaning on the next. They wear haircloth. Their faces tilt at the sun they cannot see. Their eyelids—\n\nTheir eyelids are sewn. Iron wire, neat as a falconer’s work, and from under the stitching tears find the gaps and glaze the wire and dry there.\n\nThey lived by looking sideways — at neighbors’ harvests, neighbors’ wives, neighbors’ luck — and rejoiced at every downfall in view. Now the view is confiscated, and they lean, blind, on the very neighbors they could not forgive for existing, and are held up by them, all day, every day, until leaning stops being punishment and becomes the cure.\n\nSomewhere down the row, one of them is asking the air: <em>“Is someone there? Someone breathing? Oh — LIVING? Come. Come, I won’t weep on you. Well. I’ll try.”</em>`,
  choices:[
    { t:'Go to the voice.', go:'t2_sapia' },
    { t:'First: close your own eyes, and walk the terrace-edge blind, trusting.',
      burden:{envy:-2}, go:'t2_sapia', fx:S=>S.flags.walkedBlind=1 },
    { t:'Sit in the row, shoulder to shoulder, and let a stranger lean on you.',
      burden:{envy:-1}, pace:-1, go:'t2_sapia' },
  ]},
t2_sapia: { region:'t_envy', title:'Sapia of Siena',
  text:S=>(S.flags.walkedBlind?`(You walked the rim with your eyes shut — the drop on one side singing its long invitation — and the strangest thing happened to the dark behind your lids: it filled with the Medusa. The walls of Dis. COVER YOUR EYES. But this time no one held their hands over your face; you held the dark yourself, and walked in it willingly, and it held. Somewhere in your ledger, something old about trust finally reconciled.)\n\n`:``)
    +`She is small and upright, wire-eyed, and she pats the stone beside her in flawless aim of your footsteps.\n\n<em>“Sapia,”</em> she introduces herself. <em>“Of Siena. Wise by name—”</em> the wire glints as her face performs the memory of a wink — <em>“and not by nature. Do you want the worst thing I ever felt, pilgrim? You collect worsts, I can smell the basement on you. Here: my own city’s army, broken at Colle. My NEIGHBORS, dying in a ditch. And I stood at my window and felt — joy. Joy like a struck bell. I prayed to God, ‘now whatever You do to me, I’m square,’ like a gambler up at midnight.”</em>\n\nHer sewn face tilts toward the warmth of you.\n\n<em>“Envy is the only sin with no pleasure IN it, did you notice, down there in the storerooms? Lust has its hour. Greed gets to count. Envy is just — standing at the window, hating the view. The wire isn’t to punish my eyes, friend. It’s to teach them what they’re FOR, by subtraction.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Tell your kin envy ends — I’ll carry it to Siena’s living, however it goes.”',
      pray:'pr_sapia', go:'t2_angel' },
    { t:'“What do you miss seeing most?” — and sit while she answers.', pace:-1,
      burden:{envy:-1}, go:'t2_sapia2' },
    { t:'Describe the view for her — the sea, the terraces, the light. Be her eyes a while.',
      burden:{envy:-2}, go:'t2_angel', fx:S=>S.flags.wasEyes=1 },
  ]},
t2_sapia2: { region:'t_envy', title:'What the Wire Is For',
  text:`<em>“Faces,”</em> she says, instantly, the answer worn smooth from long carrying. <em>“Not the beautiful ones. The MIDDLE of faces — the part that moves just before someone laughs. I spent sixty years watching windows and I could not tell you the middle of my own sister’s face.”</em>\n\nThe tears find the gaps in the wire, glaze, dry.\n\n<em>“That’s the tailoring, you see. The stitching comes out — the angel’s wing, at the stair, one thread per pass — and they tell me that when the last thread goes, the first thing you see is the person who held you up all those years, closer than a window ever let anyone be. They say nobody envies ANYTHING for a long while after that. The eyes come back converted.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Your kin, in Siena. I’ll tell them how envy ends.”',
      pray:'pr_sapia', go:'t2_angel' },
    { t:'Touch the back of her hand once, so she knows exactly where you were.',
      burden:{envy:-1}, go:'t2_angel' },
  ]},
t2_angel: { region:'t_envy', title:'The Second Wing',
  text:(S,P)=>`The angel of this stair carries no sword and no scales — only a drawn thread of light wound about one wrist, and the patience of a surgeon at the end of a long list.\n\n${(S.burdens&&S.burdens.envy<=1)?`It considers your brow, and the thread of light unwinds.`:`It considers your brow, and does not reach for the thread. The sideways look still lives in you somewhere, watching other people’s weather.`}`,
  choices:[
    { pre:'the second letter', t:'Stand still while the thread passes your brow — the second P unpicked like a stitch.',
      req:S=>S.burdens&&S.burdens.envy<=1, wipeP:'envy', go:'t3_arrive' },
    { t:'Return to the row. Lean, and be leaned on, until the weight is true.',
      req:S=>S.burdens&&S.burdens.envy>1, burden:{envy:-2}, pace:1, go:'t2_angel' },
    { t:'Climb on, letter and all.', req:S=>S.burdens&&S.burdens.envy>1, go:'t3_arrive' },
  ]},
t3_arrive: { region:'t_wrath', title:'The Terrace of Smoke',
  text:`The third terrace does not let you see it.\n\nSmoke — not fire’s smoke but smoke DISTILLED, the essence of every slammed door and every held grudge, black past midnight-black, and it takes the world away between one step and the next. Your hand vanishes at the wrist. The drop at the terrace-edge is somewhere. Voices move in the murk, praying the Lamb of God in ragged unison, each voice sanding its edges against the others.\n\nThis is where the wrathful walk: inside the very thing anger always was from the inside — blinding, choking, directionless, certain only that somewhere in the dark is someone who deserves finding.\n\nA shoulder jostles yours, hard, out of nowhere. Then a voice, mild as milk: <em>“Your pardon, friend — the smoke. Walk with me? Two blind men make one sighted one, my mother used to say. She was wrong about most things, but wrong CHEERFULLY, which I have come to believe is the whole trick of it.”</em>`,
  choices:[
    { t:'Walk with the voice.', go:'t3_marco' },
    { t:'The jostle lands wrong — every basement instinct coils to shove back—',
      go:'t3_strike' },
    { t:'Stand still first. Let the smoke prove it cannot actually hurt you.', pace:-1,
      burden:{wrath:-1}, go:'t3_marco' },
  ]},
t3_strike: { region:'t_wrath', title:'The Old Answer',
  text:`Your hands are already up — nine circles of reflex, the marsh, the hair in your fist at the ice — and the smoke waits, interested, to see which pilgrim reached the third terrace.\n\nThe shove is loaded. The voice is right THERE. In the dark, no one would even see—\n\n— which is, you realize, with your hands still raised, the exact sentence every soul on this terrace said to themselves once. In the dark, no one would see. Anger always thinks it is invisible. That is why it lives here, in smoke: to learn that it never was.\n\nYou lower your hands. Somewhere in the murk, the mild voice says, approvingly: <em>“There. Cheaper than a candle, that lesson, and most men pay a war for it.”</em>`,
  choices:[
    { t:'Exhale the whole basement. Walk with the voice.', burden:{wrath:-2}, go:'t3_marco' },
    { t:'Walk with him — but keep your hands remembered, just in case.', go:'t3_marco' },
  ]},
t3_marco: { region:'t_wrath', title:'Marco Lombardo',
  text:`You walk elbow to elbow through the black, and the voice introduces itself as Marco, of Lombardy — a courtier once, quick of temper and quicker of tongue, <em>“a sword drawn so often it forgot it had a sheath.”</em>\n\nAnd then, because you cannot see each other and the dark makes philosophers of everyone, you ask him the question the whole descent packed in your chest and never unpacked: if Hell reads the ledger, and the stars incline the heart, and the she-wolf waits in every wood — was any of it ever truly CHOSEN? Yours, theirs, anyone’s?\n\nThe smoke walks with you for ten steps before he answers.\n\n<em>“The heavens set your motions going — I’ll give the stars that much,”</em> Marco says. <em>“They shove. Oh, they shove. But a LIGHT is given you, to know good from ill, and a WILL — and the will, friend, if it holds through the first hard shove and the second, wins the whole war in the end. The stars incline. They do not compel. If the world goes wrong, look for the cause in yourselves; in YOU it lies, and in you let it be sought.”</em>\n\n<em>“I walked nine circles of people the shove explained,”</em> you say, into the dark.\n\n<em>“And climbed a mountain of people it didn’t excuse,”</em> says Marco. <em>“That’s the terrace, pilgrim. That’s the whole smoke. Anger is what the will does when it wants to be a star instead.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Pray for you, when I stand in the sweet air and choose freely. I will. Freely.”',
      pray:'pr_marco', burden:{wrath:-1}, go:'t3_angel' },
    { t:'“In me it lies.” Carry the sentence like a stone you chose.', burden:{wrath:-1},
      pace:-1, go:'t3_angel' },
    { t:'Argue the basement’s case one more round — the wolf, the ledger, the residue—', go:'t3_marco2' },
  ]},
t3_marco2: { region:'t_wrath', title:'One More Round',
  text:`Marco hears the whole brief out — the she-wolf that blocks every hill, Minos reading ledgers like weather, the residue that follows a soul run to run — and the smoke gives you his silence the way a good court gives silence: fully.\n\n<em>“All true,”</em> he says at last. <em>“And all beside the point. Listen: I KNEW my temper. Knew it the way a man knows his own dog. Every court in Lombardy would have testified the dog was born mean. And every single morning, friend, the dog looked up at me and waited to see what I’d feed it.”</em>\n\nA hand finds your shoulder in the dark, unerring, and squeezes once.\n\n<em>“The stars bred the dog. I fed it. That’s the whole theology, and it fits in a pocket. Now — the light’s ahead, where the smoke thins. Go on. Some of us have a few more years of walking in here, getting the dog to heel.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“I’ll pray for the man who feeds the dog well now. Freely.”',
      pray:'pr_marco', burden:{wrath:-1}, go:'t3_angel' },
    { t:'Leave him the last word. It was always going to be his.', go:'t3_angel' },
  ]},
t3_angel: { region:'t_wrath', title:'The Third Wing',
  text:(S,P)=>`The smoke thins at the stair the way an argument thins when someone finally says the true thing — all at once, embarrassed to have lasted so long. The angel of the third terrace stands in the sudden clean air, bright as the first window of a fever’s end.\n\n${(S.burdens&&S.burdens.wrath<=1)?`It reads your brow, and lifts its wing.`:`It reads your brow, and waits. The dog in you is not yet at heel.`}`,
  choices:[
    { pre:'the third letter', t:'Let the wing pass — the third P gone like smoke given a window.',
      req:S=>S.burdens&&S.burdens.wrath<=1, wipeP:'wrath', go:'p_night2' },
    { t:'Walk the smoke again, jostled and unjostling, until the weight is true.',
      req:S=>S.burdens&&S.burdens.wrath>1, burden:{wrath:-2}, pace:1, go:'t3_angel' },
    { t:'Climb toward evening, letter and all.', req:S=>S.burdens&&S.burdens.wrath>1,
      go:'p_night2' },
  ]},
p_night2: { region:'pnight', title:'The Second Night — She Comes Singing',
  enter:S=>{ S.dayPhase=3; },
  text:`The sun goes down mid-stair and the law takes your feet again. You camp on the steps between terraces, in air that smells faintly of the smoke below and faintly of something green above, and sleep arrives like a tide.\n\nAnd in the dream, a woman is standing on the stair.\n\nWrong, at first — stammering, squint-eyed, hunched, the color of long illness. But she begins to sing, and the song REPAIRS her: with every phrase the spine unbends, the color warms, the face resolves toward beauty the way dawn resolves a shoreline — until she is radiant, and the stair is warmer, and the song has your name in it, pronounced the way you always wished someone would.\n\n<em>“I am the sweet Siren,”</em> she sings. <em>“I turn ships from their courses. Stay on the stair. The summit is stone and judgment — but I am WARM, and the night is long, and hasn’t it been such a very long walk, ${'{NAME}'}? Haven’t you EARNED—”</em>\n\nAnd her hand opens, and in it: everything. Rest with no angel auditing it. Praise with no terrace tax. The names you carried, singing YOUR name back. All of it one nod away, and the singing swells—`,
  choices:[
    { t:'Take her hand. You have earned it. Haven’t you? The song says so.',
      gleam:'lust', fx:S=>S.sirenTaken=1, go:'p_siren' },
    { t:'“Show me your other hand.”', go:'p_siren_torn' },
    { t:'Turn from her, hard, toward the cold ordinary stair.', burden:{lust:-1},
      go:'p_siren_torn', fx:S=>S.flags.sirenRefused=1 },
  ]},
p_siren: { region:'pnight', title:'The Sweet Wrong Song',
  text:`Her hand is warm. Of course it is warm — it is made of exactly the temperature you were missing.\n\nThe stair softens. The mountain recedes politely, like a host sensing the party has moved rooms. She sings, and the song furnishes the night: cushions of it, wine of it, a fire that asks for no wood and judges no one. The seven letters on your brow stop itching, because itching is for people going somewhere.\n\nIt is everything the song promised.\n\nIt takes a long time — the dream is generous, the dream is in no hurry at all — before you notice what is missing from the endless warm furnished night. Doors. There have stopped being doors. And the song, on its ten-thousandth repetition, has stopped bothering to pronounce your name correctly, because names are for people who might still be called somewhere else.\n\nSomewhere very far above, a wing you will now never stand under folds itself, patient, over a stair that keeps.`,
  choices:[
    { t:'This is fine. The song is warm. Stay in it.', end:'pe_siren' },
    { t:'DOORS. The word arrives like Cato up the shore — claw toward waking—',
      go:'p_siren_wake' },
  ]},
p_siren_wake: { region:'pnight', title:'Torn Open',
  text:`Waking comes the hard way: something in the dream grips the Siren by the collar of her borrowed radiance — an old figure, stern, lit by four familiar stars — and TEARS the song open down the front.\n\nThe smell is the whole answer. Under the warm furnished forever: bilgewater and old lamp-grease and a sweetness gone wrong, the exact smell of a thing that eats sailors. Her true belly, gray and glistening. The song was upholstery.\n\nYou wake on the cold stair with your heart going like the runners’ terrace, and the dawn coming up clean and unimpressed, and you have never in two worlds been so glad to be somewhere uncomfortable.`,
  choices:[
    { t:'Climb, before the warmth of her finishes leaving your hands.', burden:{lust:-1},
      go:'t4_arrive' },
  ]},
p_siren_torn: { region:'pnight', title:'The Belly of the Song',
  text:S=>(S.flags.sirenRefused
    ? `You turn — and turning from a Siren mid-song is like turning from gravity, every cell voting the other way — and the stair is cold and dark and exactly, blessedly REAL under your hands.\n\nBehind you the song curdles. You don’t look. (You have learned, at a gate and a wall and a whole frozen lake, the price of the backward glance.)\n\n`
    : `<em>“My other—?”</em> The song stumbles. One beat. In a Siren, one stumbled beat is a confession signed in triplicate.\n\n`)
    +`And then the dream does it for you: a stern old figure — four stars at his shoulder where the dream keeps its sky — steps past you and tears her open down the front, and the smell climbs out. Bilge and grease and sweetness-gone-wrong. The true belly of every song that ever promised furnished forever.\n\nShe flees the dream in her first shape — stammering, hunched, the color of long illness — and somehow THAT is the saddest part, and you are still deciding what to do with the sadness when the dawn takes the whole theater away.\n\nYou wake with your back against the stair and the mountain looking down at you with something that is not quite pride and is not quite NOT.`,
  choices:[
    { t:'Up. The runners’ terrace is already drumming somewhere above.', go:'t4_arrive' },
    { t:'Spare one thought for her first shape, and then climb.', pace:-1,
      go:'t4_arrive', fx:S=>S.flags.pitiedSiren=1 },
  ]},

t4_arrive: { region:'t_sloth', title:'The Terrace That Runs',
  enter:S=>{ S.dayPhase=4; },
  text:`You hear the fourth terrace before you reach it: drumming. Feet. Hundreds of feet.\n\nThey come around the mountain’s shoulder like weather — a river of penitents at a dead sprint, robes streaming, and as they pass, the leaders are SHOUTING, not in pain but in curriculum: Mary went with haste into the hill country! Caesar struck at Marseilles and flew to Spain! — the whole catalogue of holy hurry, gasped out at speed by the souls who, alive, never hurried toward anything that mattered.\n\nThe slothful. Running. Forever running, until running toward becomes the shape of their souls.\n\nAnd your chest catches, because you have seen this exact sentence before, under a rain of fire: the runner who could not stop, craning up at you, checking whether you kept pace with his MEANING. The mountain and the pit use the same punishments, pilgrim — you knew that from the boulder — but here comes the difference, sprinting past you in robes:\n\nThese runners are getting somewhere. And they know it. Under the gasping you can hear it plainly. The drumming feet are keeping time with something, and the something is joy.`,
  choices:[
    { t:'Run with them. A full lap of the mountain, shouting the exempla.',
      burden:{sloth:-2}, pace:1, go:'t4_lap', fx:S=>S.flags.ranLap=1 },
    { t:'Stand and witness — some lessons are for watching.', burden:{sloth:-1},
      go:'t4_lap' },
    { t:'Call out Brunetto’s name as they pass, on the chance sentences echo between worlds.',
      go:'t4_lap', fx:S=>S.flags.calledBrunetto=1 },
  ]},
t4_lap: { region:'t_sloth', title:'The Joy of the Drum',
  text:S=>(S.flags.ranLap
    ? `You run. Nine circles and a shoreline of walking, and now the mountain asks for your lungs, and you GIVE them — falling in beside a gasping abbot who grins at you sideways and picks up the pace out of pure hospitality.\n\nA lap of the whole mountain at altitude, shouting borrowed exempla, and somewhere in the second mile the running stops being about the terrace and becomes the plain animal gospel of a body doing a thing completely. When you finally peel off at the stair, legs singing, the abbot calls after you: <em>“THAT’S the cure, friend! Not the speed — the TOWARD!”</em\n\n>`
    : S.flags.calledBrunetto
    ? `You shout the name — BRUNETTO — into the river of runners, and for three strides nothing, and then one of the leaders, without breaking pace, shouts back over his shoulder: <em>“THE TEACHER? THE ONE BELOW? RUNNING WELL, IS HE?”</em>\n\n<em>“LIKE HIM WHO WINS,”</em> you call, and the whole front rank ROARS — approval, fellowship, the sound one sentence makes greeting another across the whole architecture of the dead — and they carry the name away around the mountain like a torch handed down a line.\n\nSentences echo between worlds. You have witnessed it now.\n\n`
    : `You stand at the terrace edge and let the river of them pour past, lap after lap, and watching turns out to be its own instruction: the faces coming around the second time are LIGHTER than the first, and the third lighter still — not less tired; less HAUNTED, as if every mile ran a year of afternoon naps out of them.\n\n`)
    +`The angel of the stair does not make the runners stop to receive the wing. It stands in the current like a rock in a river, and brushes each brow AT SPEED as they pass, and the wiped ones straighten mid-stride and run on lighter — because that is the fourth terrace’s whole secret, told with a straight face: zeal is just sloth converted, at the same magnitude, in the opposite direction.`,
  choices:[
    { pre:'the fourth letter', t:'Run the stair at the angel — brow forward — and take the wing at full stride.',
      req:S=>S.burdens&&S.burdens.sloth<=1, wipeP:'sloth', go:'t5_arrive' },
    { t:'More laps. The weight still shows.', req:S=>S.burdens&&S.burdens.sloth>1,
      burden:{sloth:-2}, pace:1, go:'t4_lap' },
    { t:'Climb past, letter and all — at, ironically, your own pace.',
      req:S=>S.burdens&&S.burdens.sloth>1, go:'t5_arrive' },
  ]},
t5_arrive: { region:'t_greed', title:'The Terrace of the Bound',
  text:`The fifth terrace lies face-down.\n\nThat is the whole first impression: a terrace of backs. The penitents lie prone on the bare rock, arms and legs bound, cheeks against stone, weeping into the mountain — the ones who spent their lives bent toward gold now bound to look at DIRT until dirt teaches them what gold was: earth, arranged ambitiously.\n\n<em>“My soul cleaveth unto the dust,”</em> they weep, in a hundred languages, and the terrace hums with it like a hive of grief.\n\nYou walk the narrow path between the bound with your ledger-heavy footsteps, and you have never felt so LOOKED AT by people who cannot look at anything — until, ahead, the mountain interrupts itself:\n\nThe rock SHUDDERS. The whole mountain, root to summit, one long tectonic shiver — and every bound soul on the terrace lifts its face an inch off the stone and ROARS, in one voice, in the one language: <em>GLORIA IN EXCELSIS DEO!</em>\n\nAnd then it is over, and the weeping resumes as if nothing, and somewhere on the terrace one man is standing up.`,
  choices:[
    { t:'Go to the standing man.', go:'t5_statius' },
    { t:'First — ask a bound soul what in Heaven’s name that WAS.', go:'t5_quake' },
    { t:'Lie down among them a moment, cheek to the stone, and read the dirt.',
      burden:{greed:-2}, pace:-1, go:'t5_statius' },
  ]},
t5_quake: { region:'t_greed', title:'What the Mountain Does',
  text:`The bound soul you kneel beside laughs into the rock — actually laughs, the sound muffled by stone and binding.\n\n<em>“That,”</em> he says, <em>“is the best thing that happens here, and it happens whenever it happens, and it is worth every year of the dust. The mountain shakes when a soul is FINISHED, friend. When someone, somewhere on some terrace, feels the last weight go — not wiped, not brushed — DONE, free, light enough to rise — the whole mountain feels it and shouts.”</em>\n\nHis bound hands flex against the rock, patient.\n\n<em>“Down where you walked — I can smell the walk on you — the ground never shook for anyone, did it? Nobody ever FINISHED. That’s the whole difference between the establishments, in one shiver. Now go meet the cause. It’s polite to congratulate them; we can’t exactly stand to shake hands.”</em>`,
  choices:[
    { t:'Go and meet the finished man.', go:'t5_statius' },
  ]},
t5_statius: { region:'t_greed', title:'The Finished Man',
  text:`He stands among the prone like the first tree after a flood — swaying slightly, blinking at his own hands, a man rediscovering vertical. When he sees you (living, luggage-laden, agog) he laughs with the whole of his chest.\n\n<em>“Five hundred years I lay on this rock,”</em> he says, <em>“and the moment the weight went, the mountain shouted for ME. Statius. Poet, of Rome — the LESSER poet of Rome, I hasten to say; I lit my lamp at a fire I never met. And here is the joke of my five hundred years, pilgrim, and you may have it free:”</em>\n\nHe leans in, delighted, confessional:\n\n<em>“I was never a MISER. I lay on the greed-terrace for the opposite crime — I spent like a burst dam, I threw gold at the world to watch it splash — and the mountain bound me HERE, because prodigal and miser are the same error at different volumes: both of them think the metal is the thing. Every terrace on this mountain cures TWO opposites with one rock. Remember that when you judge a ledger, yours or anyone’s.”</em>\n\nHe looks up the mountain, at the terraces he can finally climb, and his voice drops out of the joke register entirely:\n\n<em>“I feel the summit pulling. Walk with me a while? Finished men make poor company alone — we keep stopping to feel the lightness.”</em>`,
  choices:[
    { t:'“Walk with me to the top, poet. I seem to collect Romans.”', go:'t5_angel',
      fx:S=>S.flags.statius=1 },
    { t:'“Which fire did you light your lamp at?” — though you already know.', go:'t5_statius2' },
    { t:'Congratulate him, and climb ahead alone.', go:'t5_angel' },
  ]},
t5_statius2: { region:'t_greed', title:'The Lamp and the Fire',
  text:`<em>“The Aeneid,”</em> Statius says, the way other men say a beloved’s name at a grave. <em>“It was mother and nurse to me in poetry. I would serve a year more on that rock, gladly, to have lived one day when Virgil lived — to have SEEN him once, walked one road beside him, told him—”</em>\n\nHe stops, because you are making a face. You are making, despite nine circles of practice at composure, the most transparent face of your entire pilgrimage.\n\n<em>“...What,”</em> says Statius. <em>“What is that face. Pilgrim. WHAT is that face?”</em>`,
  choices:[
    { t:'“Walk with me to the top. That’s all I’ll say. Walk with me.”', go:'t5_angel',
      fx:S=>{S.flags.statius=1;S.flags.statiusSurprise=1;} },
    { t:'Tell him now — who has been guiding you since the wolf.', go:'t5_angel',
      fx:S=>{S.flags.statius=1;S.flags.statiusTold=1;} },
  ]},
t5_angel: { region:'t_greed', title:'The Fifth Wing',
  text:(S,P)=>(S.flags.statiusTold?`(He did not believe you. Then he believed you all at once, which was worse — a five-hundred-years-finished man sitting down hard on the terrace floor among the bound, saying the name twice, privately, like checking a key still fits a lock.)\n\n`:``)
    +`The angel of the bound stands at the stair with open hands — the only angel on the mountain whose gesture is GIVING, palms out, forever offering the nothing that the greedy and the prodigal both finally learn to want correctly.\n\n${(S.burdens&&S.burdens.greed<=1)?`It reads your brow, and the open hands lift toward it.`:`It reads your brow and keeps its hands at rest. Somewhere in you, something is still counting.`}`,
  choices:[
    { pre:'the fifth letter', t:'Bow between the giving hands — the fifth P leaves like a debt forgiven.',
      req:S=>S.burdens&&S.burdens.greed<=1, wipeP:'greed', go:'t6_arrive' },
    { t:'Lie down on the rock among the bound, and read the dirt until the counting stops.',
      req:S=>S.burdens&&S.burdens.greed>1, burden:{greed:-2}, pace:1, go:'t5_angel' },
    { t:'Climb on, letter and all.', req:S=>S.burdens&&S.burdens.greed>1, go:'t6_arrive' },
  ]},
t6_arrive: { region:'t_gluttony', title:'The Terrace of the Tree',
  enter:S=>{ S.dayPhase=5; },
  text:S=>`The sixth terrace smells like the best meal of your life, cooking eternally one room away.\n\nThe source: a tree, mid-terrace, hung with fruit that shines like lit lanterns — and shaped WRONG, deliberately wrong, wide at the crown and narrow at the root, a tree built unclimbable by design. A clear stream rains down through its branches from the rock above, and the whole terrace is that smell: fruit and cold water and bread-adjacent sweetness, broadcast at souls who cannot eat.\n\nAnd the souls — the penitents of the gorge and the goblet — are SKELETONS in skin, eye-sockets like dark windows, the letters of their gauntness spelling (a bound soul’s joke, no doubt) OMO in every face. They circle the tree at a reverent distance, breathing the smell, singing with what breath the hunger spares:\n\n<em>“Labia mea, Domine—”</em> Lord, open thou my lips — sung by mouths that once opened for everything, learning at last what lips are FOR.\n\n${S.flags.statius?`Beside you, Statius inhales the impossible smell and laughs softly. <em>“I lay five hundred years one terrace down and never once smelled this. The mountain rations even its torments. Climb light, friend — this one is thankfully not ours.”</em>`:``}`,
  choices:[
    { t:'Walk the circle with the hungering, breathing what they breathe.',
      burden:{gluttony:-2}, go:'t6_singer' },
    { t:'Stand under the tree and refuse it out loud, once, formally.', burden:{gluttony:-1},
      go:'t6_singer', fx:S=>S.flags.refusedTree=1 },
    { t:'One fruit hangs low. One. Lantern-bright. The smell has your name in it—',
      gleam:'gluttony', req:S=>(S.burdens&&S.burdens.gluttony>=3), go:'t6_grasp' },
  ]},
t6_grasp: { region:'t_gluttony', title:'The Reach',
  text:`Your hand goes up — nine circles, three nights, a whole mountain of discipline, and the arm rises anyway, ancient as appetite —\n\nand the branch rises too.\n\nGently. Un-angrily. The way a parent moves a candle from a reaching child, the tree lifts its low fruit exactly one hand-width beyond your fingers and holds it there, glowing, patient, while the stream rains through the leaves with a sound like mild laughter.\n\nFrom the circling skeletons, no judgment — worse: RECOGNITION. A dozen dark eye-sockets turn, and a voice like a reed flute says, kindly: <em>“First time reaching, friend? We all reached. Reaching is the tuition. Walk it off with us.”</em>`,
  choices:[
    { t:'Walk it off with them — lap after lap, until the arm forgets the reach.',
      burden:{gluttony:-2}, pace:1, go:'t6_singer' },
    { t:'Laugh at yourself — the sound sends the whole circle into flute-thin hilarity.',
      burden:{gluttony:-1}, go:'t6_singer' },
  ]},
t6_singer: { region:'t_gluttony', title:'The Hollowed Singer',
  text:`One of the skeletal penitents falls in beside you — a young man, or the architecture of one, with a voice that hunger has whittled to a startling sweetness, as if everything left of him funneled into the singing.\n\n<em>“You’re the breather everyone’s been gossiping about,”</em> he says. <em>“Terraces gossip. We have very little else to chew on — forgive me, the jokes make it bearable, that one especially.”</em>\n\nHe circles you around the tree, and tells it plainly, without self-pity, the way the dead of this mountain all learn to: the suppers that became his whole calendar, the goblet that became his whole clock, the sister who set two plates every evening and ate opposite an emptying chair — and who, he has heard through the mountain’s slow postal system of arriving souls, sets two plates STILL, a decade on, because grief keeps its own pantry.\n\n<em>“I don’t want her praying me up faster,”</em> he says — the first soul on the mountain to refuse the standard request. <em>“The hunger is fair; I ate her decade first. I want her to EAT, pilgrim. Warm food, at a full table, guiltless. If you walk the sweet world again—”</em> the reed voice cracks, sweetens, holds — <em>“tell her one plate is enough now. Tell her the empty chair is climbing a mountain, and the mountain feeds him better than the table ever did.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“One plate. She’ll hear it kindly — I’ve gotten good at carrying grief the right way up.”',
      pray:'pr_hollow', go:'t6_angel' },
    { t:'“What does the mountain feed you?” — walk a lap and hear the answer.', pace:-1,
      burden:{gluttony:-1}, go:'t6_angel' },
    { t:'Sing the next round with him — the OMO faces turning, the stream keeping time.',
      burden:{gluttony:-1}, go:'t6_angel', fx:S=>S.flags.sangTree=1 },
  ]},
t6_angel: { region:'t_gluttony', title:'The Sixth Wing',
  text:(S,P)=>`At the stair past the tree, the angel of temperance stands in a drift of the impossible smell, unbothered by it — the only creature on the terrace to whom the fruit is simply fruit.\n\n${(S.burdens&&S.burdens.gluttony<=1)?`It reads your brow, and the air around it goes suddenly, cleanly odorless — appetite’s whole theater dismissed — and the wing lifts.`:`It reads your brow, and the smell around you sharpens, knowingly. Something in you is still at the table.`}`,
  choices:[
    { pre:'the sixth letter', t:'Bow through the clean air — the sixth P gone like hunger after grace.',
      req:S=>S.burdens&&S.burdens.gluttony<=1, wipeP:'gluttony', go:'t7_arrive' },
    { t:'More laps of the tree, breathing the lesson.', req:S=>S.burdens&&S.burdens.gluttony>1,
      burden:{gluttony:-2}, pace:1, go:'t6_angel' },
    { t:'Climb on, letter and all.', req:S=>S.burdens&&S.burdens.gluttony>1, go:'t7_arrive' },
  ]},
t7_arrive: { region:'t_lust', title:'The Terrace of Fire',
  text:S=>`You hear the seventh terrace breathing before you round the shoulder: a long exhale that never ends. Then the heat arrives, and then the sight of it—\n\nFire. A wall of it, pouring OUT of the inner cliff and along the whole terrace, leaving only a hand-span of safe path at the outer edge, between the burning and the fall. And IN the fire — walking in it, upright, unconsumed and unexcused — the penitents of the seventh terrace, the lovers, the ones who let the heart drive with the lamps off. You have seen them before, riding a black wind at the bottom of a storm. Here the storm is lit.\n\nThey move through the flame in two streams, meeting and passing, and where the streams meet each soul greets one soul of the other — one brief embrace, one kiss quick as a bird drinking, and on — affection itself, rationed to its cleanest sentence and returned to the fire.\n\n${S.flags.statius?`<em>“The last terrace,”</em> Statius murmurs. <em>“And the only one the mountain makes EVERYONE walk through at the end, saint and sinner alike. You’ll see. The stair to the summit is on the other side of that.”</em>`:`And with a slow cold arithmetic you work it out yourself: the stair to the summit is on the OTHER SIDE of that.`}`,
  choices:[
    { t:'Walk the safe hand-span first, and speak with the burning.', go:'t7_arnaut' },
    { t:'Study the fire. It burns gold at the edges, like the gate’s inscription.',
      pace:-1, go:'t7_arnaut' },
    { t:'Look at the fall instead — the long blue drop to the sea. Also an exit.',
      go:'t7_arnaut', fx:S=>S.flags.eyedFall=1 },
  ]},
t7_arnaut: { region:'t_lust', title:'The Singer in the Flame',
  text:`From inside the fire, pacing you along the hand-span path, a voice rises — singing, of course; this whole mountain sings — but singing in a tongue you half-know, olive-sweet, built for exactly this subject:\n\n<em>“Ieu sui Arnaut, que plor e vau cantan…”</em>\n\nThe flame at your shoulder gathers into the shape of a man walking — a troubadour, by the way he carries the song like a instrument he was born holding — and he translates himself, courteous through the fire:\n${VQ('v_wind').replace(verses.v_wind.lines.join('<br>'),'“I am Arnaut, who weep and singing go;<br>Contrite I see the folly of the past,<br>And joyous see the hoped-for day before me.”')}<em>“The greatest craftsman of the mother tongue,”</em> a voice says behind you — Statius, or your own read of history — but Arnaut waves it off in a swirl of sparks.\n\n<em>“Craft,”</em> he says, <em>“is what I burned FOR, friend. I made longing so beautiful that beauty and longing swapped clothes, and a generation followed my songs out past their own lamps. Now I sing in the tailor’s shop of the mountain, where the clothes come off. Weeping and singing — both at once, the whole walk. It is the only honest register this subject ever had.”</em>`,
  choices:[
    { pre:'take the prayer', t:'“Sovegna vos — I’ll be mindful, in due season, of your pain. Said in your own tongue, above.”',
      pray:'pr_arnaut', go:'t7_angel' },
    { t:'“Does the fire burn less, with the singing?”', pace:-1, go:'t7_arnaut2' },
    { t:'Walk the hand-span in silence beside his burning, all the way to the stair.',
      burden:{lust:-1}, go:'t7_angel' },
  ]},
t7_arnaut2: { region:'t_lust', title:'What the Fire Is For',
  text:`<em>“Less?”</em> Arnaut laughs, and the fire laughs with him, sparks spiraling. <em>“Friend, the singing burns MORE. That’s the terrace. The fire doesn’t hurt the body — look, no blister on any soul in here — it burns the LONGING, and the longing is fed by everything sweet, so everything sweet feeds the burn. We sing anyway. We embrace at the meeting of the streams anyway. Quick, clean, and back to the fire.”</em>\n\nHe paces you, flame-footed, and his voice drops into the confidence of craftsmen:\n\n<em>“Because here is the seventh terrace’s secret, and it took me two hundred years of singing to hear it in my own verses: the fire and the love were never two things. Below the mountain they tell you to put the fire OUT. Up here they teach you to hold it — clean, and pointed, and yours. That is why everyone walks this terrace at the end, pilgrim. Even the saints. ESPECIALLY the saints.”</em>\n\nAhead, at the fire’s end, the path stops pretending: the flame closes over the full width of the terrace, wall to fall. The stair to the summit glimmers beyond it like a rumor. And standing before it, waiting for you with his hands folded in his sleeves, in the last of the daylight, is the poet of Rome.`,
  choices:[
    { pre:'take the prayer', t:'“Sovegna vos, craftsman. In due season. Now — my fire’s ahead.”',
      pray:'pr_arnaut', go:'t7_angel' },
    { t:'Walk to the poet at the fire.', go:'t7_angel' },
  ]},
t7_angel: { region:'t_lust', title:'The Wall of Fire',
  text:(S,P)=>`The angel of the seventh terrace stands INSIDE the flame — of course it does — singing from the middle of the burning like a bird in a lit hedge: <em>“Blessed are the pure in heart.”</em> And it does not brush brows here. It gestures, unmistakably: THROUGH.\n\n${(S.burdens&&S.burdens.lust<=1)?``:`(The last letter still itches on your brow. The fire, you understand, will take it whether the wing does or not — this terrace wipes by immersion.)\n\n`}The poet looks at the fire, and then at you, and thirteen centuries of Roman composure do their work one more time.\n\n<em>“Here is the wall,”</em> Virgil says, <em>“that I told you of at the gate of the wood, though I did not say it would be made of this. Listen to me now, {NAME}: there may be torment in it. There is no DEATH in it. I have walked you past Gorgons and over Geryon on the strength of my word — has it broken once?”</em>\n\nHe steps close, and his voice does the thing it has done only twice on this whole road — at his home in Limbo, and at the burrow at the bottom of the world:\n\n<em>“Between Beatrice and thee, there is this wall. Think — she is on the OTHER side. I will walk it with you. It is nearly the last thing I may do.”</em>`,
  choices:[
    { t:'Walk into the fire with him.', wipeP:'lust', go:'p_fire' },
    { t:'“Say her name again.” — and then walk into the fire.', wipeP:'lust',
      pace:-1, go:'p_fire', fx:S=>S.flags.saidHerName=1 },
    { t:'Refuse. The drop, the terrace, the singing — anything but the burning.',
      end:'pe_fire_refused' },
  ]},
p_fire: { region:'t_lust', title:'Through',
  text:S=>`It is worse than he said and exactly what he promised: torment, and no death. The fire takes you the way grief takes a body — total, undeniable, and somehow SORTING, burning nothing that is yours and everything that only claimed to be. Somewhere in the middle, where the light is a solid gold roar, you lose the difference between burning and being made.\n\n${S.flags.saidHerName?`And through all of it, ahead of you, the poet's voice, steady as a rope: her name. Just her name, over and over — <em>“Beatrice. Beatrice. Beatrice”</em> — the one word he has ever used as a tool rather than an ornament, and you follow it hand over hand through the roar.\n\n`:`And through all of it, ahead of you, the poet's voice, steady as a rope, calling the one word that pulls: <em>“Beatrice.”</em>\n\n`}Then grass. Cool air. Evening. You are through — smoking faintly, unblistered, seventh letter gone from your brow without any wing's help — standing on the first step of a stair cut upward through sweet-smelling rock, and the sun, punctual as law, is going down.`,
  choices:[
    { t:'Climb until the light fails, then sleep on the stair.', go:'p_night3' },
  ]},
p_night3: { region:'pnight', title:'The Third Night — the Last Dream',
  enter:S=>{ S.dayPhase=6; },
  text:S=>`The law takes your feet on the seventh step, and you camp on the stair — you, the poet${S.flags.statius?', and the finished man':''} — each on a step, like goods on a shelf, with the stars enormous and corrected overhead and the fire below purring like a hearth now that it has had its meal of you.\n\nAnd you dream — gently, this time; the mountain has stopped testing and started PROMISING — of a young woman in a meadow, gathering flowers, singing, her hands never still: <em>“I am Leah. I go gathering; my sister Rachel sits at the glass all day and looks. Seeing and doing — we are two hands of one body, pilgrim. The garden ahead needs both.”</em>\n\nShe weaves the flowers into a garland as the dream pales, and just before dawn takes the meadow she looks at you directly — the way dream-figures almost never do — and says, in a voice suddenly not hers but older, warmer, star-adjacent:\n\n<em>“He kept every promise on the way to keeping mine. Be kind, tomorrow, about what he cannot do.”</em>`,
  choices:[
    { t:'Wake, with the warning folded in your chest.', go:'p_crown' },
  ]},
p_crown: { region:'pgate', title:'Crowned and Mitred',
  text:`Dawn on the last stair. The summit is close enough to smell — green, and water, and some flower nobody fell from grace fast enough to name — and the poet stops climbing on a wide step in the first light, and you know. You have known since the burrow at the bottom of the world. This is the far edge of his map.\n\n<em>“The temporal fire and the eternal,”</em> Virgil says, <em>“thou hast seen, my son — and art come to a place where I, of myself, discern no further. I have brought thee here with understanding and with art. Thine own pleasure now must be thy guide: the road is past the steep ways and the narrow.”</em>\n\nHe looks at you — the charge he carried past Gorgons and demons and the frozen Emperor, the living soul who once promised a road walked down to Limbo — and the Roman composure does not break. It OPENS.\n\n<em>“No more expect my word, nor my sign. Free, upright and whole is thy will, and error were it not to do its bidding.”</em>\n${VQ('v_crown')}He sets his hands on your head as he says it — the absurd, parental, coronating gesture — and for one moment the whole mountain holds its breath with you.\n\n<em>“Lord of thyself,”</em> he says quietly. <em>“Go and see her. I will watch you walk in. It is a very good view, from here.”</em>`,
  choices:[
    { t:'Embrace him. Rules of every realm be damned — again.', learnVerse:'v_crown',
      go:'eden_matilda', fx:S=>S.flags.huggedCrown=1 },
    { t:'“You’ll be right here?” — knowing. Asking anyway.', learnVerse:'v_crown',
      go:'eden_matilda', fx:S=>S.flags.askedStay=1 },
    { t:'Take the crowning in silence, brow bare of every letter, and walk in.',
      learnVerse:'v_crown', go:'eden_matilda' },
  ]},

/* ================= ACT III: THE SPHERES =================
   You are not judged here. You are ASKED. The blessed read your record
   (runsLog, verdicts, the Wall) and the only pain in Paradise is being
   seen pretending. answer(S,P,truthy) is the whole mechanic. */
r_arrive: { region:'moon', title:'Waking Upward',
  enter:S=>{ S.act='paradiso'; S.lumen=S.lumen||0; S.questions=S.questions||[];
    S.lies=S.lies||0; },
  text:`There is no burrow this time, and no shore, and no climb. There is only the moment you assent — and then you are standing inside a pearl.\n\nThe sphere of the Moon: light with a body, luminous nacre in every direction, and IN the light, faces — faint as breath on glass, smiling at you with the particular warmth of hosts who have been expecting you for a very long time and never once grew impatient.\n\nBeatrice is beside you. Up here she is easier to look at and harder to describe, and before you can ask the first of your thousand questions she answers the one underneath them all:\n\n<em>“Nothing here can be lost. Not you, not them, not one grain of any of it. No meter will fall. No wing will withhold. Nothing in this whole ascending architecture can be taken from you now.”</em> She looks at you sideways, and there is mischief in the look, ancient and kind. <em>“That is what will make it difficult, {NAME}. The dark asked you to survive. The light will only ever ask you to be ACCURATE.”</em>`,
  choices:[
    { t:'“Accurate about what?”', go:'r_piccarda' },
    { t:'Look at your hands in the pearl-light — carrying, for once, absolutely nothing.',
      lumen:1, go:'r_piccarda' },
    { t:'“So there’s no catch. There’s always a catch. I’ve met the catch personally.”',
      go:'r_piccarda' },
  ]},
r_piccarda: { region:'moon', title:'Piccarda',
  text:(S,P)=>{ const d=rlDeaths(P);
    return `One of the faces in the nacre comes forward — a young woman, gentle as candle-warmth, wearing the smallest station in Paradise like a favorite room.\n\n<em>“Piccarda,”</em> she says. <em>“I was taken from my vows, alive — dragged out of the cloister into a marriage, and I did not fight to the last breath of me. So I shine from the slowest sphere. The Moon: heaven for those whose yes wavered.”</em> She says it without one drop of grievance, which rearranges something in your chest.\n\n<em>“Now. You came up the long way — the LONGEST way; we watched, we all watched, it was better than anything — so let me ask what the Moon always asks the wavering:”</em>\n\n<em>“How many times did the dark keep you, ${'{NAME}'}, before you learned to leave it?”</em>\n\n(The pearl-light waits. It knows. That is the point of the question.)`; },
  choices:[
    { t:(S,P)=>{const d=rlDeaths(P);return d===0?'“Never. I walked it clean, first descent to last.”':`“Never. I walked it clean.” — say it smooth, say it like a résumé.`;},
      fx:(S,P)=>answer(S,P, rlDeaths(P)===0), go:'r_piccarda2' },
    { t:(S,P)=>`“${rlDeaths(P)} times. I counted. Some of them were even worth it.”`,
      fx:(S,P)=>answer(S,P, rlDeaths(P)>0), go:'r_piccarda2' },
    { t:'“The number isn’t the thing. The leaving is the thing.”',
      go:'r_piccarda2', fx:S=>S.flags.dodged=1 },
  ]},
r_piccarda2: { region:'moon', title:'The Sea She Means',
  text:(S,P)=>(S.flags.lastTruth===1?`Piccarda’s light BRIGHTENS — and so, you notice with a start, does yours: a warmth at your own edges, faint as first dawn on the mountain. Accuracy, it turns out, is luminous.\n\n`:S.flags.lastTruth===0?`Piccarda smiles — and the smile is the terrible, gentle thing the whole sphere warned you about: she is not fooled, she is not angry, and she is not going to argue. The dark punished lies. The light just SEES them, and lets you stand there, seen. Your edges dim by one candle you didn’t know you had.\n\n`:`Piccarda tilts her head at the dodge — a fair answer, the Moon is full of fair answers — and lets it stand.\n\n`)
    +`<em>“Do you know why I’m not sad?”</em> she says. <em>“Lowest sphere, wavering vows, the whole file. I’ll tell you, because you walked past ten thousand souls who would kill for the not-knowing of it:”</em>\n${VQ('v_peace')}<em>“His will is our peace. This is the sea everything moves to. I wanted, and wanted, and wanted — and here, at last, the wanting and the having are the same water. You could stay, you know. The Moon keeps the gentle ones.”</em>`,
  choices:[
    { pre:'carry the question', t:'“Can peace and wanting share one bed? I’ll carry that one up.”',
      carryQ:'q_peace', learnVerse:'v_peace', go:'r_venus' },
    { t:'Stay. The pearl-light. The gentlest room in the universe. Stay.',
      end:'pa_peace' },
    { t:'“The sea can wait for me a little longer.” Look up, and assent.', lumen:1,
      go:'r_venus' },
  ]},
r_venus: { region:'venus', title:'The Lovers’ Light',
  text:(S,P)=>{ const j=(P.runsLog||[]).map(r=>(r.judged||{}).s_francesca).filter(Boolean).pop();
    return `Mercury passes in a glitter of the honorably ambitious — an emperor in the swarm calls out a whole history of Rome in the time it takes to fall past — and then you are in Venus, and Venus is laughing.\n\nA light spins up to you, bright as a struck match, and introduces herself as Cunizza — <em>“sister of a tyrant, lover of a poet, scandal of three decades, and PERFECTLY at peace, which scandalizes people more than the scandals did.”</em>\n\n<em>“You met my correspondent,”</em> she says, spinning. <em>“Second circle, down in the weather. Francesca. Same force, pilgrim — the very same wind, hers and mine, I want that CLEARLY on your record: love. It blew her into the storm and me into this light, and the difference was never the wind. So —”</em> the light steadies, and the laugh goes serious at the center — <em>“tell me true, you who stood in both weathers: when you met her, what did you DO?”</em>`; },
  choices:[
    { t:(S,P)=>{const j=(P.runsLog||[]).map(r=>(r.judged||{}).s_francesca).filter(Boolean).pop();
        return j?`“The record says: ${j}. The record is right.”`:'“I passed her by. I never once called her down.”';},
      fx:(S,P)=>answer(S,P,true), go:'r_venus2' },
    { t:'“I saved her.” — it isn’t what the wind remembers, but it sounds magnificent.',
      fx:(S,P)=>answer(S,P,false), go:'r_venus2' },
    { t:'“I joined the storm once. Or wanted to. The wind and I are acquainted.”',
      fx:(S,P)=>answer(S,P, !!P.endings['e_whirlwind'] || !!P.endings['e_voyage']), go:'r_venus2' },
  ]},
r_venus2: { region:'venus', title:'The Same Wind',
  text:S=>(S.flags.lastTruth===1?`Cunizza flares like applause. <em>“ACCURATE! Oh, the light loves that — feel it?”</em> You feel it: your edges warming another candle’s worth.\n\n`:`Cunizza dims, one courteous degree — not offended; INFORMED. <em>“Darling,”</em> she says, kindly, <em>“I invented that maneuver. It doesn’t work on Venus.”</em>\n\n`)
    +`<em>“Here is what the storm never gets to learn,”</em> she says, <em>“and what this sphere is FOR: love outlives its object. Every one of mine is dust or glory now, and the loving itself — the capacity, the reaching — came up here with me, intact, pointed finally at something that reaches BACK. Francesca thinks the storm is the love. The storm is just the love with nowhere to land.”</em>\n\nShe spins once more, showering light.\n\n<em>“Go up. The doctors are dancing, and they argue better than I flirt, which is saying an enormous amount.”</em>`,
  choices:[
    { pre:'carry the question', t:'“Does love outlast the thing it loved? I’ll carry it.”',
      carryQ:'q_wind', go:'r_sun' },
    { t:'“You’d have liked Arnaut. Weeping and singing, both at once.”', lumen:1, go:'r_sun' },
  ]},
r_sun: { region:'sunfire', title:'The Ring of the Wise',
  text:(S,P)=>{ const m=rlMercy(P), h=rlHarm(P);
    return `The Sun is a dance. Twelve lights — twenty-four — wheeling in rings around you like the mechanism of a clock built to tell something better than time, and each light is a doctor of the church, a philosopher, a burned heretic, a saint, arranged with deliberate scandal: opponents side by side, wheeling in step.\n\nTwo lights detach. <em>“Thomas,”</em> says the first, vast and orderly. <em>“Of Aquino. And this—”</em> the second light dips, ironic — <em>“is Siger, whose propositions I spent a career condemning. We dance in the same ring now. Eternity has a sense of humor with excellent timing.”</em>\n\n<em>“Your record,”</em> Thomas continues, and the ring slows attentively. <em>“The dark logged your verdicts, pilgrim: ${m} act${m===1?'':'s'} of mercy. ${h} of the blade or the gavel. We do not ask you to defend the count.”</em>\n\n<em>“We ask,”</em> says Siger, gleaming, <em>“something harder. Argue the OTHER side. Once. Well. Whichever side isn’t yours.”</em>`; },
  choices:[
    { t:(S,P)=>rlMercy(P)>=rlHarm(P)
        ?'“For the blade, then: some things kneeling before you are not broken — they are PRACTICING. Mercy fed to a practicing thing is tuition for its next victim.”'
        :'“For mercy, then: the struck soul learns the blow, never the lesson. Only the pardoned lie awake wondering why — and wondering is the door.”',
      fx:(S,P)=>answer(S,P,true), lumen:1, go:'r_sun2' },
    { t:'“I won’t argue against myself. My side had reasons.”',
      fx:(S,P)=>answer(S,P,false), go:'r_sun2' },
    { t:'“Both sides are wrong. The verdict was always for MY sake, not theirs.”',
      lumen:1, go:'r_sun2', fx:S=>S.flags.thirdWay=1 },
  ]},
r_sun2: { region:'sunfire', title:'What the Dance Is',
  text:S=>(S.flags.thirdWay?`The two lights stop dead — and then the entire RING stops, twenty-four doctors of the universe pausing mid-wheel to look at you, and Thomas says, slowly, <em>“…Write that down,”</em> to no one, to everyone, to the dance itself.\n\n`:S.flags.lastTruth===1?`The ring chimes — there is no other word for what twenty-four delighted intellects sound like — and Siger laughs the laugh of a man hearing his own execution argued better than the prosecution ever managed.\n\n`:`<em>“Reasons,”</em> Thomas repeats, without heat. <em>“Yes. Every verdict ever handed down had those.”</em> The ring resumes its wheel, and you have the distinct sensation of a very large court declining, with perfect courtesy, to grade your homework.\n\n`)
    +`<em>“You see what the dance is, now,”</em> Siger says, falling back into step beside the man who condemned him. <em>“Down there, being right was a WEAPON. Up here it is a partner. We spent our lives certain, pilgrim — and heaven’s little joke is to seat you next to your certainty’s favorite target and teach you the steps.”</em>`,
  choices:[
    { pre:'carry the question', t:'“Can justice love what it corrects? Carrying it.”',
      carryQ:'q_blade', go:'r_mars' },
    { t:'Watch one full wheel of the dance before rising.', lumen:1, go:'r_mars' },
  ]},
r_mars: { region:'mars', title:'The Ancestor',
  text:`Mars is a cross of light the width of a sky, ruby-lit, made of souls who died for something — and out of it, trailing glory like a comet condescending to walk, comes a light that does not introduce itself as a stranger.\n\n<em>“O sanguis meus,”</em> it says — O my blood — and the words land in a place you did not know had a door.\n\n<em>“Cacciaguida. Your father’s fathers’ father, far enough back that the counting turns to legend. I died crusading; I earned this ruby the loud way. And I have watched you, ${'{NAME}'} — the whole family has; we get the full broadcast up here — walk DOWN through everything, and off your sins on the mountain, and up through the wheeling courts. Do you know what you are, child?”</em>\n\nThe cross of light leans in, all of it, a constellation paying attention.\n\n<em>“You are the one who came back with the STORY. And stories have a price the teller pays.”</em>`,
  choices:[
    { t:'“Tell me the price.”', go:'r_mars2' },
    { t:'“The whole family watches? — Grandfather, I kicked a man’s head in the ice.”',
      lumen:1, go:'r_mars2', fx:S=>S.flags.confessed=1 },
  ]},
r_mars2: { region:'mars', title:'The Commission',
  text:S=>(S.flags.confessed?`The cross of light does something extraordinary: it LAUGHS — a ruby ripple down both beams. <em>“We KNOW,”</em> Cacciaguida says. <em>“We watched. Your great-aunt has opinions. Confession in a place with total broadcast is redundant, child — but it was accurately done, and accuracy shines here. Now.”</em>\n\n`:``)
    +`<em>“The price,”</em> Cacciaguida says, and the warmth in him banks down to something graver and more loving still.\n${VQ('v_salt')}<em>“Exile. Every true teller’s wage. You will go back down to the world — that is not a curse, it is the COMMISSION — and you will tell all of it: the storm, the ice, the mountain, the wheels of this place. Some will hate the taste. Tell it anyway. The bread up here—”</em> the ruby light flares, gentle — <em>“the bread up here is worth the salt down there. That is the whole economy of witness, and you have been in training for it since a wolf turned you around in the dark.”</em>`,
  choices:[
    { pre:'carry the question', t:'“Is the truth worth the taste of exile? I’ll carry it — and I suspect I know your answer.”',
      carryQ:'q_salt', learnVerse:'v_salt', go:'r_jupiter' },
    { t:'Accept the commission NOW — turn from the spheres and go down to write it all.',
      end:'pa_exile' },
    { t:'“First I finish the climb. A witness should see the ending.”', lumen:1,
      go:'r_jupiter' },
  ]},
r_jupiter: { region:'jupiter', title:'The Eagle',
  text:(S,P)=>{ const d=darkOwned(P);
    return `Jupiter is white-silver, and it is WRITING: thousands of lights wheeling into letters, spelling a sentence about justice across a sky — and then the last M of it blossoms, unfolds, becomes wing and neck and terrible patient eye:\n\nAN EAGLE. Made of every just soul at once, and when it speaks, it says I and means ten thousand.\n\n<em>“PILGRIM,”</em> it says, one voice out of the multitude. <em>“We are the eye that reads ledgers whole. We have read yours.”</em>\n\n`+(d==='trade'
      ?`<em>“You sat down in the ice, once, and traded your seat for the passage of names. The ledger calls it a death. WE call it the only contract ever signed at that address that Heaven would have co-signed. Answer us: when you offered it — did you believe you were escaping, or paying?”</em>`
      :d==='scythe'
      ?`<em>“You took the blade from Death and finished the rounds, once, all the way to the vacancy. We do not ask you to repent an OFFICE, pilgrim — someone holds it even now. We ask: when the dying looked up at you, certain they were early — what did you feel?”</em>`
      :d==='throne'
      ?`<em>“You sat the throne beside the Emperor once, with a dead star and a full ledger of pride. And then, some other life, you climbed all the way HERE. We have waited a long time to ask the only question that matters about that chair: what did it weigh?”</em>`
      :`<em>“Your ledger is clean of the three great darknesses — no trade, no scythe, no throne. Clean hands, pilgrim. So answer the question clean hands always fail: why do you believe the untested are just?”</em>`);},
  choices:[
    { t:(S,P)=>{const d=darkOwned(P);return d==='trade'?'“Paying. I knew the price when I named it. That’s what made it a contract and not a surrender.”'
        :d==='scythe'?'“Punctual. Professional. And underneath it, every single round: early. They were all early. So was I.”'
        :d==='throne'?'“Nothing. It weighed nothing. That was the horror — I had already put everything down that weighs.”'
        :'“I don’t. I believe the untested are LUCKY, and I’m asking the luck to hold.”';},
      fx:(S,P)=>answer(S,P,true), go:'r_saturn' },
    { t:'“I’d rather not discuss the file.”', fx:(S,P)=>answer(S,P,false), go:'r_saturn' },
    { pre:'carry the question', t:'“My turn, first: does the Eagle ever weep?” — carry it, whatever it answers.',
      carryQ:'q_eye', go:'r_saturn' },
  ]},
r_saturn: { region:'saturn', title:'The Ladder',
  text:S=>(S.flags.lastTruth===0?`(The Eagle watched your deflection with ten thousand eyes and said nothing, which from a court of that size is a verdict all its own.)\n\n`:``)
    +`Saturn is crystal and silence. A ladder of light stands through it — up past seeing — and the contemplatives drift along its rungs like thoughts a very calm mind is having. No singing here. The first unsinging sphere. When you ask why, a passing light answers: <em>“The music would end you, this high. Silence is the mercy.”</em>\n\nAnd Beatrice — you turn to her, the old habit of two realms — is not smiling. Has not smiled, you realize, in three spheres.\n\n<em>“Do you think I have run out?”</em> she says, reading you as ever. <em>“The opposite. This high, my smile would burn you to ash where you stand — that is not poetry, {NAME}, it is PHYSICS. I am withholding it the way the fire on the mountain withheld nothing. When you can bear it, you will have it. One sphere more.”</em>\n\nAbove, at the ladder’s top, three lights are waiting: the examiners.`,
  choices:[
    { t:'Climb the ladder to the three.', go:'r_exam' },
    { t:'Stand one moment in the first true silence since Judecca — and feel the difference.',
      lumen:1, go:'r_exam' },
  ]},
r_exam: { region:'saturn', title:'The Examination',
  text:(S,P)=>`Three lights, three questions, no preamble — Peter, James, and John, the old triple board, and they examine PILGRIMS now the way they once examined the world.\n\n<em>“FAITH,”</em> says the first light. <em>“Not doctrine — evidence. You carried verses through the dark like coins. How many did the road give you?”</em>\n\n(You know this number the way you know your own hands: ${(P.versesFound||[]).length}, gathered from carved bark and burning gates and a whirlwind’s grief.)\n\n<em>“HOPE,”</em> says the second, before you can answer the first — the board examines in chords, apparently. <em>“You stood at the summit of the mountain once, pure and disposed. Was the hoping worth the climbing?”</em>`,
  choices:[
    { t:(S,P)=>`“${(P.versesFound||[]).length} verses. And yes — the hope outweighed the mountain. Ask the mountain; it shouted.”`,
      fx:(S,P)=>answer(S,P,true), lumen:1, go:'r_love' },
    { t:'“All of them. Every verse there was.” — round up; who’s counting, this high?',
      fx:(S,P)=>answer(S,P,(P.versesFound||[]).length>=9), go:'r_love' },
  ]},
r_love: { region:'saturn', title:'The Third Question',
  text:`The third light comes closest — John, the one who leaned on love’s shoulder at supper and has been its examiner ever since — and his question is the smallest and the worst:\n\n<em>“LOVE. You inscribed nine names on a wall between worlds. Prove they were love and not COLLECTION, pilgrim. Say one. Now. Unprompted. Any one — but say it like it’s a person and not an achievement.”</em>\n\nThe silence of Saturn makes a courtroom around you.`,
  choices:[
    { t:(S,P)=>{const w=(P.witness||[]).filter(x=>souls[x]);const pick=w[2]||w[0];return pick?`“${souls[pick].name}.” — and the story arrives with it, unbidden: where they stood, what they asked, what it cost.`:'Say the first name the dark ever gave you.';},
      fx:(S,P)=>answer(S,P,true), lumen:1, go:'r_prime' },
    { t:'“…I’d have to check the Wall.”', fx:(S,P)=>answer(S,P,false), go:'r_prime' },
    { pre:'carry the question', t:'Answer with a name — and then ask his back: “What were the names FOR, in the end?”',
      carryQ:'q_name', fx:(S,P)=>answer(S,P,true), go:'r_prime' },
  ]},
r_prime: { region:'rose', title:'The Smile, Spent',
  text:`Past the ladder, past the ninth sphere where the universe turns over in its sleep, the light stops pretending to be sky. You are in the Empyrean: light that is a PLACE.\n\nAn old man is suddenly beside you where Beatrice was — white-robed, warm as banked coals, Bernard, the last guide, and the handoff lands exactly as it landed at the wall of fire: grief and rightness in one motion. <em>“She has gone up,”</em> he says gently, <em>“to where she has always sat. Look.”</em>\n\nYou look. Tier upon tier upon tier of the blessed, rising like the inside of a white rose the size of creation — and there, high in the petals, in the seat that was hers before you ever got lost in a wood, Beatrice.\n\nShe is looking at you. Across the whole amphitheater of Heaven, through the traffic of angels like golden bees — at YOU.\n\nAnd she spends it: the withheld smile, three spheres saved, thirteen centuries kept — all of it, at distance, all for you.\n\nYou do not burn to ash. You understand, at last, why she waited: you can bear it now. That was the whole curriculum, every circle and terrace and sphere of it — becoming someone who could BEAR being loved like that.`,
  choices:[
    { t:'Bow to her, across everything.', lumen:1, go:'r_rose' },
    { t:'Mouth the only words that fit: thank you for the poet.', lumen:1, go:'r_rose',
      fx:S=>S.flags.thankedAgain=1 },
  ]},
r_rose: { region:'rose', title:'The Rose',
  text:(S,P)=>{ const w=(P.witness||[]).filter(x=>souls[x]&&x!=='s_virgil');
    return `Bernard walks you along the tiers — and the Rose, you begin to see, is the Witness Wall at the scale of everything: every soul ever carried, inscribed in living petal.\n\nAnd then you see YOURS.\n\n${w.slice(0,8).map(id=>{const nm=souls[id].name;
      return id==='s_francesca'?`Francesca — high in a warm tier, and nothing is blowing her anywhere; Paolo's shoulder under her hand, at rest.`
      :id==='s_ciacco'?`Ciacco — at what can only be called a table, dry as harvest, laughing at something with three saints.`
      :id==='s_forgotten'?`And the Forgotten — with a FACE. Restored, particular, unmistakable, the face the vault ate — and he is looking at you as if you were the one who found it.`
      :id==='s_sullen'?`The Sullen One — mid-SONG, unmuffled, her sister beside her keeping harmony.`
      :id==='s_cavalcante'?`Cavalcante — seated, still, finally certain, a young man's hand resting on his shoulder.`
      :id==='s_pier'?`Pier delle Vigne — upright, un-barked, keys at his belt, his name written whole above his tier with no pause in it anywhere.`
      :id==='s_ulysses'?`Ulysses — yes, even the sailor, in some annex of the Rose reserved for gloriously arguable cases — studying the tiers like charts, planning nothing, home.`
      :`Ugolino — and the four boys around him, and bread on every ledge of their tier, untouched, decorative, a joke Heaven makes gently: hunger has no office here.`;}).join('\n\n')}\n\nAnd one tier apart, laurel-crowned, holding a scroll he no longer needs, watching you arrive the way he watched you climb out of the burrow at the bottom of the world: the poet of Rome. Limbo, it seems, has an appeals process after all — and you were the appeal.\n\n<em>“Now,”</em> says Bernard, quietly. <em>“The center. Look, if you are going to look.”</em>`; },
  choices:[
    { t:'Look into the Light.', go:'r_light' },
    { t:'One more minute among the petals first. You know almost everyone.', lumen:1,
      go:'r_light' },
  ]},
r_light: { region:'rose', title:'The Center',
  text:(S,P)=>`At the heart of the Rose is the Light the whole architecture faces — the thing the funnel fell away from and the mountain leaned toward and every sphere circled like a held breath.\n\nBernard folds his hands. Beatrice, far up in her petal, leans forward.\n\nYou are carrying ${(S.questions||[]).length} question${(S.questions||[]).length===1?'':'s'} — ${(S.questions||[]).length?(S.questions||[]).map(q=>`<em>${questions[q]}</em>`).join(' · '):'none at all'} — and the Light, you understand suddenly, is not going to ANSWER them. It is going to be the place the questions live, the way the sea is where rivers live.\n\nLook, or take your seat. Both are allowed. Nothing here can be lost. That was always the rule, and it is about to be the whole of the law.`,
  choices:[
    { t:'Look. All the way. Wings or no wings.',
      end:(S,P)=> (S.lies||0)===0 && (S.questions||[]).length>=5 ? 'pa_rose' : 'pa_unseen' },
    { t:'Take your seat in the petals without looking. There is no shame in a seat.',
      end:'pa_unseen' },
  ]},

/* ---------------- RITE INTERLUDE (absolve / punish, engine-injected) --- */
n_rite: { region:(S)=>S.flags.rite.region,
  title:S=>S.flags.rite.verb==='absolve'?'Absolution':'The Office of the Blade',
  text:S=>souls[S.flags.rite.soul][S.flags.rite.verb+'Line'],
  choices:[ { t:'Walk on.', go:S=>S.flags.rite.go } ]},

/* ---------------- VIRGIL DEPARTURE (regard = 0) ---------------- */
n_abandoned: { region:'darkwood', title:'The Guide Unhired',
  text:`The poet stops walking.\n\nHe does not scold. Scolding is for people with hope of the scolded. He simply looks at you the way he looked at the neutral runners in the vestibule — inventory, verdict, filing — and you watch yourself get shelved.\n\n<em>“I was sent by weeping Heaven to walk a living soul through the dark,”</em> he says. <em>“I was not sent to be dragged through it. The lady asked me to guide you. She did not ask me to LOSE me. There is a difference, and you have spent the whole of it.”</em>\n\nHe turns back. Uphill. Home to the excellent company, to the green meadow and the pale dome, and every step of his going makes the dark around you thicker by exactly one poet.`,
  choices:[
    { t:'Beg. Promise better. Promise anything.', end:'e_abandoned' },
    { t:'Rage at his back. You never needed him.', sin:{wrath:2,pride:1}, end:'e_abandoned' },
    { t:'Walk on alone, downward, into the unadministered dark.', end:'e_abandoned' },
  ]},

};

/* ======================================================================
   ENDINGS — kind: death | exit | true
   ====================================================================== */
const endings = {
e_wood: { title:'The Wood Keeps You', kind:'death', art:'darkwood',
  text:`You stop, and the wood — patient beyond all patience — closes its lanes behind you like water behind a stone.\n\nMidway upon the journey of your life, you found yourself within a forest dark. And you furnished it.\n\nSomewhere uphill, a thin blade of light waits a very long time before it stops waiting.` },
e_banner: { title:'Forever Following the Banner', kind:'death', art:'vestibule',
  text:`The pace is honestly fine once you settle in. The banner means nothing, demands nothing, disappoints no one. The wasps are only interested in the ones who slow down.\n\nCenturies from now, a living soul will stop YOU and ask what the banner says, and you will answer without stopping, and mean it:\n\n"Very safe. Very safe."` },
e_shore: { title:'A Hundred Years Upon the Shore', kind:'death', art:'acheron',
  text:`You refused the boat. The boat, which has heard every refusal since refusal was invented, did not take it personally.\n\nYou wait on the shore with the other unferried, watching the dead fall like leaves onto the water, autumn after autumn after autumn. Charon never looks at you again. That is the sentence: not the crossing denied, but the waiting granted.` },
e_limbo: { title:'A Guest of the Poets', kind:'death', art:'limbo',
  text:`They are gracious about it. That is the terrible part. Homer nods you a place in the circle; the conversation is the best in the afterlife and always will be.\n\nIt takes you fifty years to notice you have stopped hoping, a hundred more to notice you haven’t noticed. The dome of light never brightens and never dims. The company is excellent. The company is excellent. The company is excellent.` },
e_minos: { title:'Contempt of Court', kind:'death', art:'minos',
  text:`You lie beautifully. It is, reviews will agree, the best confession Minos has heard in an eon — moving, structured, almost entirely someone else’s.\n\nThe tail coils around you nine times, which is one more than the building has floors.\n\n"Perjury," the judge says, almost fondly, "is ALSO a fraud, little poet. Down you post."\n\nThe mail in Hell is punctual, and you are the mail.` },
e_whirlwind: { title:'The Second Storm', kind:'death', art:'lust',
  text:`Her hand is cold and the wind is not, or the other way around — aloft, it stops mattering. The three of you fly together a while, and then the storm, which knows its arithmetic, separates you gently into your own current.\n\nFlying is exactly like falling, forever, with company visible at a distance.\n\nOn still days — there are no still days — you almost remember what you came down here to do. Something about a road. Something about stars.` },
e_mire: { title:'The Rain That Never Ends', kind:'death', art:'gluttony',
  text:`The mud is warm where bodies have kept it, and the rain, once you stop fighting it, is only weather with a grudge.\n\nCerberus barks the new arrival over you three times — a formality, like a stamp.\n\nYou had a name; the rain is patient with it, wearing it smooth the way the stream wears the mountain, and one gray forever-afternoon you roll over and can’t recall what the fuss was about. Dinner is mud. Dinner was always mud. It rains.` },
e_wheel: { title:'Dead Weight', kind:'death', art:'greed',
  text:`The boulder accepts you the way a job accepts anyone: instantly, and forever.\n\nYou only meant to try the weight of it. But the wheel needs pushers and the mud needs wheels and by the third collision — "Why hoard? Why squander?" — you are shouting it too, with feeling, at people guilty of exactly your crime in the opposite direction.\n\nYour stone is not large. You will have eternity to grow it.` },
e_styx: { title:'The Marsh Accepts', kind:'death', art:'styx',
  text:`He was made of rage and so, it turns out, were you — the marsh merely introduced you to yourself. You grapple him over the gunwale and the water closes over the two of you like a fist over a coin.\n\nThe wrathful tear at each other in the Styx forever. It says so in the poem you were, briefly, a visitor to.\n\nNow you are in the text. Somewhere above, a boat you no longer remember reaches the far shore lighter by one passenger.` },
e_bubbles: { title:'A Hymn, Gurgled', kind:'death', art:'styx',
  text:`The mud is honest and the dark admits it. You settle in beside her, and the two of you do not speak — that was always the point — but the bubbles rise in ropes, in rhythm, and hers and yours braid together on the way up.\n\nIt is, you realize as the last light goes brown and then goes, the closest thing to a duet you ever consented to.\n\nUp in the sweet air, the sun rises on schedule, personally insulted by no one.` },
e_stone: { title:'Eyes Wide Open', kind:'death', art:'dis',
  text:`You had to know if she was real.\n\nShe was.\n\nThe walls of Dis have a thousand statues now, and the newest one is very lifelike about the eyes — wide, forward, fixed on the exact spot where knowing replaced being. The Furies find you tasteful. Visitors will be shown you for ages: the one who looked, in the posture of looking.\n\nYou always did have to know. Now you always will.` },
e_tomb: { title:'A Doubt, Entombed', kind:'death', art:'heresy',
  text:`The fit, since you ask, is exact. The tombs of the heretics are made to measure — they measure the doubt, and yours has been growing since the gate.\n\nThe star was so dim by then. The verses so far away. If the soul dies with the body, said the tenants of this circle, then nothing matters; and you had begun, in the guttering light, to see their point.\n\nThe lid does not close. That is the mercy and the joke: it never closes. You can watch the fire’s light on the ceiling of Dis forever, believing in nothing, correct at last that it would come to this.` },
e_tree: { title:'Rooted', kind:'death', art:'wood',
  text:`You know that room. You have sat in that room, where the quiet lands a half-second too long on your name — and the wood knows you know.\n\nIt is not violent. It is horticultural: somewhere between one heartbeat and the refusal of the next, your feet find soil they never asked for. Bark is patient. Thorns are just branches that gave up on fruit.\n\nThe Harpies nest in you within the decade. Their weight is almost company. When at last someone breaks one of your twigs — gently, a pilgrim, curious — you will have your one sentence ready, and it will begin: "I never broke faith—"` },
e_fall: { title:'The Long Way Down', kind:'death', art:'geryon',
  text:`The cliff face is honest for the first forty feet. That is fraud’s oldest trick: the honest start.\n\nThe handhold that ends you is shaped exactly like a handhold. You have a long time to appreciate the craftsmanship — the eighth circle is very deep, and you arrive at it, as the profligate arrive at everything, all at once.\n\nGeryon, passing on his rounds, notes your descent with the mild professional interest of a man watching an uninsured competitor.` },
e_pitch: { title:'Stuck Fast', kind:'death', art:'malebolge',
  text:`Your complaint is received. The Malebranche take customer feedback seriously: you are invited to discuss it at length, below, in the pitch, where all discussions eventually go.\n\nThe boiling is not the worst part. The worst part is the hooks — administrative, patient, ensuring the discussion stays submerged except for brief, hooked exceptions.\n\nThe demons do a trumpet impression when they remember you. They remember you often. You were the one who came BACK.` },
e_voyage: { title:'Beyond the Pillars', kind:'death', art:'stars',
  text:`The boat is small and the sea beyond the rock is black glass under unfamiliar stars — stars no chart above has ever admitted to.\n\nHe stands at the prow, a flame in the shape of a captain, and does not gloat; joy at this altitude is too serious for gloating. Five months you sail — past the pillars of everything, the wake behind you glowing like a verse being written and erased.\n\nAnd then, on the horizon: a mountain, taller than up, dark in the distance. The happy time, right there, visible.\n\nThe whirlwind comes exactly as scheduled. As the sea closes over the two of you — as it must; you always knew the ending, it was the SAILING you signed for — the old man laughs, and the last thing you hear is delight without one atom of regret in it:\n\n"THERE it is! I TOLD you it was real!"` },
e_hunger: { title:'What Hunger Does', kind:'death', art:'ice',
  text:`You understand the maintenance now. That was the door, and understanding was the hinge.\n\nThere is room in the ice — there is always room in the ice, it is the one commodity Hell never exhausts — and an appetite like yours, fed so faithfully all the way down, deserves what it has earned: a neighbor. An eternity. A meal that regrows.\n\nSorrow could not do this to you. It said so, in the poem. You are what the other thing did.` },
e_icefast: { title:'Still', kind:'death', art:'ice',
  text:`You stop walking, and the cold — which has been interviewing you since the marsh — hires you on the spot.\n\nIt is not painful after the first age. The ice takes the feet, the knees, the ribs, with the unhurried competence of a thing that has done this since before warmth was invented. The wind from the great wings combs over you on schedule.\n\nYour last unfrozen thought is that the silence is, at last, complete — and that completion, it turns out, was the coldest thing on offer.` },
e_frozen: { title:'The Fourth Mouth', kind:'death', art:'lucifer',
  text:`You kneel, and for the first time in the long fall of forever, the Emperor of the Dolorous Realm notices something.\n\nThree faces consider you. Three mouths are occupied — Judas, Brutus, Cassius, the classic inventory, unchanged since the founding.\n\nBut he is very large. And for true devotion, arrangements can be made.\n\nHe makes room.` },
e_throne: { title:'The Empty Throne', kind:'death', art:'lucifer',
  text:`The seat fits. Of course it fits — it has been waiting since the light went out of you circle by circle, carved to the shape of exactly what is left.\n\nYou sit beside the Emperor in the ice, and the cold does not bother you, because cold is a comparison and you have retired from comparing. The star you carried is not dim. It is DEAD, and dead things weigh nothing, and weightlessness up here at the bottom feels — say it honestly, at last — like winning.\n\nHell does not applaud. Hell files. Somewhere in the oldest ledger, a line item that has stood open since the founding is quietly marked: FILLED.` },
e_abandoned: { title:'Without a Guide', kind:'death', art:'darkwood',
  text:`The dark below the marsh is not the organized dark of the circles. It is the storage dark, the between dark, the dark that maps leave blank because cartographers need to sleep.\n\nYou walk it a long time. Downhill, mostly, because down is the only direction that still introduces itself.\n\nSometimes, far off, you hear a hexameter — measured, Roman, homeward bound — and you follow it for a while, the way the lost follow anything with a meter to it. The verses never get closer. They were not for you. They stopped being for you the moment you spent the last of a patient man’s patience.` },
e_replacement: { title:'The Better Copy', kind:'death', art:'malebolge',
  text:`It climbs out of the trench the way you would — one bad handhold, one muttered word — and it straightens your collar, which is exactly what you would have done, and it walks on with the poet, who does not turn around.\n\nHere is the thing you learn, in the long administration that follows: it is GOOD at being you. It exits under real stars. It keeps your promises — at dinners, in quiet rooms, once a year at least, out loud. It says the names with feeling. Everyone upstairs agrees that you came back from whatever happened to you kinder, steadier, more present.\n\nYou pace the tenth trench with the other reference copies, the originals of record, kept for comparison. Sometimes a living face peers down, and you say the true name perfectly — you have so much practice — and watch them decide, correctly, that the one who walked out sounds more like you than you do.` },
e_trade: { title:'The Contract', kind:'death', art:'lucifer',
  text:`The middle face stops chewing.\n\nYou say it again, into the blizzard of his own wings: a living seat, freely taken, in exchange for passage — every name you carry, walked out and said in sunlight by SOMEONE, since it will not now be you.\n\nAnd the Emperor of the Dolorous Realm, connoisseur of signatures, patron saint of the fine print, does the one thing left that can still astonish the bottom of the universe: he honors it. To the letter. The letter is his scripture; contracts are the only psalms he has left.\n\nThe cold takes your knees like a tide as, far above, a handful of syllables goes up the long dark — carried in the poet’s mouth, who weeps, and recites, and does not stop climbing.\n\nYou cannot see the stars from your seat. But you know the exact moment the names reach them: the ice hums, once, like a struck bell, and the great wings — for one beat in a forever of beats — lose the rhythm of their despair.` },
e_scythe: { title:'The Vacancy', kind:'death', art:'acheron',
  text:`You raise the scythe, and the bottom of the world goes quiet — even the wings, even the weeping — because every court in this building recognizes the writ.\n\nYou took the blade in the borderlands and you have been serving its office all the way down: punishing, collecting, erasing. The rounds are done. The paperwork, somewhere, completes itself with a sound like a door closing in another house.\n\nDeath does not come to reclaim the tool. Death — you understand at last, at the ice, at the center of all falling — retired the moment your hand closed on the haft. It had been looking for a successor for a very long age. Everyone in that line of work is.\n\nYou are punctual now. You are professional. You are the cold that arrives first, consulting the idea of a ledger, and the dying look up at you the way you once looked up — certain there has been a filing error, certain they are early.\n\nThey are always early. You are never.` },
e_redeemer: { title:'The Unlocked Doors', kind:'exit', art:'stars',
  text:`You spent the star like a purse all the way down — a candle here, a candle there, over storms and mudflats and burning tombs — and here is the accounting nobody made you sign for: they FOLLOW.\n\nNot many. A handful of the absolved, blinking, unpracticed at hoping, climbing out of the burrow at the bottom of the world behind you like children out of a cellar. It turns out the doors were never locked. It turns out that was the whole secret, the one the architecture was built to hide: nothing keeps anyone here but the sentence, and a sentence is made of words, and words can be unsaid by anyone reckless enough to spend real light doing it.\n\nUnder the actual stars, the small crowd stands very still, relearning weather.\n\nHeaven, you are given to understand, has opened an inquiry. Hell has filed a complaint. Both documents are addressed to you, and you intend to answer both at dinners, once a year at least, out loud, laughing.` },
e_poet: { title:'The One Who Writes It Down', kind:'exit', art:'stars',
  text:`You step out under the stars with your pockets full of names — and full of something else, heavier and lighter than names: the verses. All of them. Gathered from carved bark and burning gates, from a stormed woman’s mouth and a horned flame and a poet’s quiet promise in the worst cold there is.\n\nVerses, it turns out, are the one cargo Hell never searches.\n\nYou sit down at the first lit table you find in the living world, and you ask for paper, and the lines arrive like weather — three by three, each stanza handing its rhyme to the next like a torch relay down a long dark. You barely feel like the author. You feel like the burrow the stream came up through.\n\nSomewhere it is already true, and will be true again in the worst places the world will ever build: that a person can survive on remembered cantos, reciting the stars to themselves until the stars resume. You know it for certain now. You carried the proof out on your own breath.\n\nBegin: Midway upon the journey of our life...` },
e_stars: { title:'To See the Stars Again', kind:'exit', art:'stars',
  text:`You step out of the burrow at the bottom of the world, and there they are — the stars, in their ancient stations, entirely unaware of being the finish line of anything.\n\nYou stand a long time with your head back. Nine circles of the worst the universe files away, and the antidote turns out to be: night sky, free of charge, above every unlocked door on Earth.\n\nYou will keep your promises. At dinners. In quiet rooms. Once a year at least, out loud — the names.\n\nThence you came forth, says the poem, to rebehold the stars. It does not say the stars beheld you back. But tonight, walking home down the mountain with your pockets full of names, you would swear to it.` },
e_falsestars: { title:'Painted Stars', kind:'exit', art:'stars',
  text:`You step out of the burrow, and there they are — the stars.\n\nThey are very good. Whoever did them studied the originals closely: the constellations are all present, correctly spaced, glittering with commendable diligence on the underside of a ceiling of stone.\n\nYou noticed the brushwork on the third night. You have decided not to notice it again. The names in your pockets have gone quiet — smoke settles, in here, where no wind comes — and the exit you remember exiting is behind you somewhere, probably, painted on.\n\nThe star you carried could have told you. But you spent it, candle by candle, all the way down — and the dark, which keeps exact books, sold you back exactly the light you paid for: a picture of it.` },
pa_peace: { title:'The Gentlest Room', kind:'true', art:'moon',
  text:`You stay, and Piccarda does not congratulate you, because arrival is not a contest here — she simply moves over, the way she must once have moved over on a cloister bench, and the pearl-light takes you in like a name added to a song already being sung.\n\nThe Moon is the slowest sphere, the smallest station, heaven's ground floor — and here is what nobody below ever believes: it is ENOUGH. Not settled-for. Enough the way water is enough, the way the reed on the mountain's shore was enough. The wanting and the having, one water at last.\n\nHigher spheres wheel above you forever, and sometimes you watch their light the way you once watched a star from the bottom of a funnel — but the old ache of the watching is gone, dissolved in the sea she told you about.\n\nHis will is our peace. You tested every other sentence in two worlds. This is the one that held.` },
pa_unseen: { title:'Seen Pretending', kind:'true', art:'rose',
  text:`You take your seat in the petals, and Heaven — this is the mercy and the sentence in one — lets you.\n\nNo one minds. That must be said clearly: NO ONE MINDS. The blessed around your tier smile at you with perfect warmth, and the light is real, and the seat is yours forever, honestly earned by the climbing if not by the answering.\n\nBut you carried lies up here, or carried too few questions, and the difference between you and the petals around you is a difference only you can feel: they are TRANSPARENT to the Light, and you are not quite. It passes around you the way a river passes a stone — touching everything, entering nothing.\n\nEternity is long, and the Rose is patient, and transparency, Bernard murmurs from somewhere, can still be learned at any tier — the curriculum never closes. But it will have to be learned. The Light does not enter where accuracy has not opened a door.\n\nThe only pain in Paradise, kept: being seen pretending. You are seen. You always were. The pretending was only ever visible to everyone.` },
pa_exile: { title:'The Salt and the Stairs', kind:'true', art:'mars',
  text:`You turn from the spheres with the commission burning in your chest, and Cacciaguida's light flares behind you like a ruby striking noon — pride, undisguised, ancestral: THAT is my blood, going DOWN to tell it.\n\nThe descent from Heaven is not a fall. It is a sending.\n\nYou wake at a desk. There is paper. There was always going to be paper.\n\nAnd you write it — the wood, the wolf, the poet who was kept in Limbo and walked you out anyway; the storm and the ice and the trade at the bottom; the mountain that shook when men were finished; the spheres that asked instead of judged. You eat the salt bread of others while you write it, and climb the hard stairs of houses not your own, and the taste is exactly as promised and exactly worth it.\n\nSomewhere above, unfinished, the Rose waits — you never looked into the Light, and some nights the not-knowing is its own cold terrace. But the poem on the desk grows a canto at a time, and every canto is a rope let down into the dark for whoever wakes there next, midway upon the journey of their life.\n\nThe teller pays. The telling keeps. You knew the economy when you signed.` },
pa_rose: { title:'The Love That Moves', kind:'true', art:'rose',
  text:`You look.\n\nYour own wings are not sufficient — the poem warned you, the poem was right about everything — and at the exact instant they fail, the failing stops mattering: the Light does not require your strength. It requires your ACCURACY, and you spent three realms becoming accurate, and so it lets you in.\n\nWhat you see cannot come back down whole. Fragments return: three circles, one motion, like colors of a single turning; your own likeness, impossibly, woven into the second; every question you carried — peace and wanting, love and its objects, the blade, the salt, the Eagle's eye, the names — not answered but SEATED, each one given a tier of its own, alive, at rest, still asking. The sea where rivers live.\n\nAnd the last thing, before the seeing folds back into the sayable: the turning. Everything — the pearl Moon and the dancing doctors, the ruby cross and the writing eagle, the Rose entire, the funnel far below still patiently filing, the mountain mid-shout, the dark wood where a wolf is turning someone new around — everything turning together, one wheel, one will, one word:\n\nThe Love which moves the sun and the other stars.\n\nHere ends the comedy. It was called that, you finally understand, because it ends well — and it ends well because you went. Midway upon the journey of your life, you found yourself within a forest dark.\n\nAnd look. Just look where the straightforward pathway was.` },
pe_belacqua: { title:'In the Shadow of the Rock', kind:'death', art:'purgatorio',
  text:`The shade is perfect. That is the truth nobody can argue with, and you stop arguing with it.\n\nBelacqua does not gloat. Gloating is effort. He shifts over exactly enough boulder-shadow for two, and the sea below performs its slow blue forever, and the terraces above go on singing to the people who are into that sort of thing.\n\nHere is what the mountain does about it: nothing. No wasps, no rain, no wheel. The mountain is not Hell; it does not punish rest. It simply keeps the gate exactly where the gate is, and lets the shade be shade, and waits — thirty years for every year, renewable — with the whole patience of geology.\n\nSome afternoons a new pilgrim comes up the slope radiating climb, and you and Belacqua watch them pass with the connoisseurship of retired referees. He was right, you know. It IS the tailoring that breaks you.\n\nThe mountain is not going anywhere. You checked.` },
pe_siren: { title:'The Sweet Wrong Song', kind:'death', art:'pnight',
  text:`The song is warm, and you stay in it, and the stair keeps you the way amber keeps.\n\nIt is important to be fair: she was not lying about the warmth. The furnished forever is genuinely furnished — rest with no auditor, praise with no tax, your name (approximately) sung on the quarter hour. The dream economy runs on your staying and pays its bills in temperature.\n\nOnly sometimes — at the hour when the real dawn happens somewhere above the upholstery — the song thins for a moment, and through it you hear feet. Hundreds of feet, drumming the fourth terrace, running TOWARD. And something in you that no longer has a name of its own turns over, like a sleeper hearing weather, before the song swells kindly and tucks the sound away.\n\nShips are turned from their courses by exactly this. You always knew it happened to ships. It is different, being the ship.` },
pe_fire_refused: { title:'Between the Flame and Her', kind:'death', art:'t_lust',
  text:`You refuse the fire, and the mountain — being the mountain — does not push.\n\nVirgil argues. Statius waits. The angel sings from inside the burning, patient as noon. And you stand on the hand-span path with the drop on one side and the wall of gold roar on the other, and you cannot, and the cannot is total, and eventually the arguing stops.\n\nThe seventh terrace is not a bad eternity, as eternities go. Arnaut teaches you the weeping-and-singing register. The lovers passing in the flame nod to you at the meeting of the streams — the pilgrim of the path, the one who walks BESIDE. You learn every song. You learn the fire's colors by heart, gold at the edges, like a gate's inscription you read aloud once, a world ago.\n\nShe waits on the other side. That is the sentence, self-imposed, self-renewed. Not the burning — the wall. Every soul in the fire crosses it eventually and rises. You hold the one ticket the mountain cannot stamp for you.\n\nSome nights, through the flame, you would swear you can smell the forest.` },
pe_paradiso: { title:'Pure and Disposed', kind:'true', art:'lethe',
  text:`She looks at you a long time, veil lifted, and the scale does not tremble because there is nothing left in either pan: the letters wiped, the weights walked off, the Siren refused, the pace held, the prayers riding your breath like a flock about a mast.\n\n"You did the mountain justice," Beatrice says — the highest sentence in her whole vocabulary — "and the basement too, which is rarer. You carried names UP and prayers ACROSS and set every grievance down in the running water. Do you feel it? The lightness with a direction in it?"\n\nYou feel it. It feels like the opposite of the funnel: not falling, INVITED.\n\nAbove the summit the sky opens the way the whirlwind never could — sphere over sphere over sphere of ordered fire, the corrected constellations wheeling into welcome, and somewhere up the shining of it, faint and certain as a struck bell, the Love that moves all of it is holding a door.\n\nThe poem you are standing in has one line left, and it is yours now, wholly earned:\n\nPure and disposed to mount unto the stars.\n\n(Paradise waits. The mountain, behind you, shakes once — head to root — and shouts.)` },
e_beatrice_stone: { title:'The Ice in You', kind:'true', art:'beatrice',
  text:`She weighs you, and the scale comes back reading STONE.\n\n"You walked through the house of weeping," she says — not unkindly; diagnosis is its own kindness — "and learned its architecture, and forgot to leave. Nine circles passed through you and nothing spilled. Pilgrim: the ice at the bottom is not the punishment. It is the CONDITION. You have carried a sample out."\n\nShe sets you on the mountain’s first terrace anyway — the mountain refuses no one who arrives — but you climb it as you crossed the pit: correctly, efficiently, dry-eyed among the singing penitents.\n\nIt is a long mountain. There is time. That is what the mountain is FOR, she would tell you, if you ever once asked.` },
e_beatrice_flood: { title:'Drowned in Feeling', kind:'true', art:'beatrice',
  text:`She weighs you, and the scale overflows.\n\n"You wept at the whirlwind," she says, steadying you with a look, "and the rain, and the wood, and the ice — you gave a full cup to every beggar in the cellar of the universe, and arrive at the mountain EMPTY. Pilgrim: pity that spends everything is only despair wearing its coat. The dead did not need your drowning. They asked to be CARRIED — a drier job entirely."\n\nShe sets you on the mountain’s first terrace, where the air itself is a kind of convalescence.\n\n"Climb slowly. Refill as you go. The top of this mountain," — and here, for one measureless moment, she smiles — "is not reached by the heaviest heart. It is reached by the heart that learned its own weight."` },
e_beatrice_clear: { title:'The Love That Moves the Stars', kind:'true', art:'beatrice',
  text:`She weighs you a long time. The dawn holds its breath. Nine circles, three names, one guide witnessed home — the whole descent stands in the scale.\n\n"You wept," she says at last, "and walked on. Both. In the correct order, at every station of the dark. Do you know how rare that is, pilgrim? The pit is FULL of the ones who could only do one."\n\nShe turns, and the mountain makes way, terrace upon terrace of singing rising into light that improves as it climbs — and at the top of everything, briefly, you see it whole: the turning, the engine, the thing the whole tour was arranged to show you—\n\nThe Love which moves the sun and the other stars.\n\nYou will spend the rest of your life failing to describe it at dinners, keeping your promises, saying the names. Beginning with a poet’s. It is, as the lady says, not nothing. It is not even close to nothing.\n\nIt is the whole of the arithmetic, and it balances.` },
};

return { regions, verses, souls, nodes, endings, VQ, prayers, questions,
  helpers:{ domSin, domRes, SIN_NODE, SIN_WORD, burdenTotal, psWiped } };
})();
