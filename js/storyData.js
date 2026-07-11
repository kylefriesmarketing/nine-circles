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
  purgatorio:{ name:'The Shore of the Mountain',depth:10 },
  beatrice:  { name:'The Earthly Paradise',     depth:10 },
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
};
const VQ = id => '<span class="verse-quote">' + verses[id].lines.join('<br>') +
  '</span>';

/* ---------------- witness souls (one per circle; the 9th is the Guide) --- */
const souls = {
  s_francesca:{ name:'Francesca da Rimini', circle:'Circle II — Lust',
    absolveLine:`You lift the star’s light and spend a candle of it, and the storm STUTTERS. For one heartbeat the two of them hang in still air — uncarried, unblown, holding — and Francesca looks up as if a window opened in the weather.\n\n<em>“Oh,”</em> she says. Just that. The wind takes them back, because the wind holds the lease. But it takes them <em>gently</em>, this once, and somewhere in the ribbons of the flying dead, a rumor begins that the sky blinked.`,
    punishLine:`The scythe passes through the whirlwind and the whirlwind SCREAMS — a new note, one it did not have before, and the flying dead scatter from it like starlings from a shot.\n\nThe two of them are gone into the black of the storm. You have punished the punished, and Hell — listen — Hell does not object. That is the worst review your arm has ever received.` },
  s_ciacco:   { name:'Ciacco of Florence',  circle:'Circle III — Gluttony',
    absolveLine:`A candle of the star, spent — and over one patch of mud, one body’s length of Hell, the rain STOPS.\n\nCiacco lies in the dry like a man in clean sheets. He does not speak. He breathes — the dead don’t need to, which is how you know it’s a luxury — one long dry breath seven hundred years in arrears. The rain resumes, because rain is the law here. But he looked, for a moment, like a man at a table among friends.`,
    punishLine:`The scythe comes down and the rain comes down harder, as if in applause. What was Ciacco is spread thinner into the mud that was already mostly him.\n\nThe three-headed dog howls approval in a chord. You have made the circle of appetite a little more appetizing, and the rain washes your arm clean with unsettling efficiency.` },
  s_forgotten:{ name:'———, the Forgotten', circle:'Circle IV — Greed',
    absolveLine:`You spend the light, and for one instant — one — his face is not a worn coin. Something surfaces: two syllables, rising through the mud of him like a bubble from the marsh below.\n\nHis mouth shapes the first one. Then it is gone, sunk again, and his face is smooth as ever. But he weeps like a sailor who saw land — no arrival, only the mercy of the sighting — and pushes his little stone on with something almost like posture.`,
    punishLine:`The scythe splits the boulder, not the man — and the man SCREAMS, because the boulder was the last thing that was his.\n\nHe gathers the halves like children and pushes them separately now, twice the laps, half the stone. The wheel does not slow. Around you, hoarders and squanderers nod at the arithmetic: everything down here divides, and nothing subtracts.` },
  s_sullen:   { name:'The Sullen One',      circle:'Circle V — the Marsh',
    absolveLine:`You spend a candle over the black water, and the marsh EXHALES.\n\nEvery bubble she never let rise comes up at once — a lifetime of held mornings, breaking the surface in one long silver rope — and for a moment the Styx sounds like a kitchen at dawn: something rinsing, someone humming, a window with sun in it.\n\nThe mud reseals, because the mud is the sentence. But she goes down lighter. You heard her go down lighter.`,
    punishLine:`The scythe goes into the marsh and the marsh accepts it the way it accepts everything — sullenly.\n\nThe bubbles stop. That is all. The one voice down there that had finally learned to speak goes back to what it knew best, and the silence you have purchased sounds exactly like the silence she made all her life. Hell notes, in its ledger, no change.` },
  s_cavalcante:{name:'Cavalcante, a Father',circle:'Circle VI — Heresy',
    absolveLine:`You spend the light over the burning tomb, and the old man stops sinking.\n\nHe looks at you — through you — at something over your shoulder that is not there, and his face floods with a certainty no evidence has ever supplied: <em>“He lives,”</em> he says. <em>“My son lives. I can feel the light on him from here.”</em>\n\nIt is not true and it is not false; it is absolved. He goes down into the fire the way a man goes down to dinner.`,
    punishLine:`The scythe rings on the tomb’s rim like a bell in an empty church, and the lid — which never closes — grows visibly heavier.\n\nThe old man’s eyes find yours as he sinks, and there is no reproach in them, which is unbearable. He spent his life believing nothing outlasts the body. You have just spent your arm confirming it.` },
  s_pier:     { name:'Pier delle Vigne',    circle:'Circle VII — the Wood',
    absolveLine:`You spend a candle of the star on the bleeding tree, and — slowly, at the tip of one warped branch — a single leaf turns GREEN.\n\nOne leaf. In the whole gray wood, one. The Harpies go silent, staring at it like auditors at an impossible figure. It will not last; nothing here lasts except lasting. But every tree in the forest of the hopeless is leaning toward it, and the lean is the prayer.`,
    punishLine:`You put the scythe into the tree that was the emperor’s right hand, and the wood screams in exactly the voice you have been trying not to imagine.\n\nThe Harpies descend before the sap stops — leaves are food here, and wounds are the menu. What was left of a faithful man feeds the things that lament him. The whispers, wherever they are, add your name to the minutes.` },
  s_ulysses:  { name:'Ulysses',             circle:'Circle VIII — Fraud',
    absolveLine:`You raise the star’s light to the horned flame — and the flame leans away, courteous as a man declining a chair.\n\n<em>“Save the candle, pilgrim,”</em> the voice says, and it is almost fond. <em>“Absolve me and I am only a sailor with no sentence, and a sailor with no sentence SAILS. We would be back here within the year, both of us. Spend your light on the ones who want doors. I never met a door I didn’t take personally.”</em>\n\nThe flame walks its trench. The absolution counts — Heaven scores the offer, not the acceptance — but he has, of course, the last word. He always had the last word.`,
    punishLine:`The scythe passes through the horned flame and the flame divides — and REJOINS, laughing, the way water laughs at swords.\n\n<em>“I burned for eight centuries before you were a rumor,”</em> the voice says, not unkindly. <em>“Fire is not punished by edges. But I will tell the demons you tried; they collect attempts.”</em> Somewhere below, something with tusks writes it down.` },
  s_ugolino:  { name:'Count Ugolino',       circle:'Circle IX — the Ice',
    absolveLine:`You spend the light over the two frozen together, and the frost around Ugolino’s eyes recedes — an inch, a thaw the width of a word.\n\nHe sets the skull down. Sets it down — the first release in seven hundred years — and looks at his hands as if they had returned from a long journey. <em>“One hour,”</em> he says, to no one. <em>“Give a man one hour off from hating and he remembers everything else.”</em> He weeps, and the tears freeze, and he takes the skull back up. But there was an hour in him. You saw it.`,
    punishLine:`The scythe hums against the ice and the ice hums back, louder — and the blade stops a hand’s width from the frozen men, refused.\n\nEven Death’s edge defers to this lake. What is sealed in Cocytus was sentenced by an older court than the one that issued your blade. Ugolino watches the scythe withdraw with professional interest: he too once held an instrument he could not use.` },
  s_virgil:   { name:'Virgil, the Guide',   circle:'Circle I — Limbo' },
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
  text:`They come like doves to the nest, and the storm — this is the unbearable part — the storm <em>waits</em>.\n\nShe speaks; he only weeps. She tells it plainly, the way you’d recite a recipe for the dish that killed you: an afternoon, a book about a knight, a kiss read about and then attempted, her husband’s knife arriving before the next chapter. <em>“Love led us to one death,”</em> she says. <em>“Caïna waits for him who quenched our life.”</em>\n\nThe man weeps on. The storm idles like a hearse.\n\nShe looks at you and waits to hear which kind of visitor you are.`,
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
  text:`One of the sprawled dead sits up — an effort like a continent shrugging — and rain relocates around him.\n\n<em>“You,”</em> he says. <em>“Alive. From the world. Do you know me? I was called Ciacco — ‘the Hog’ — a joke I paid for by becoming it. I knew every table in Florence and none of them knew me back.”</em>\n\nHe leans close. The rain gets into everything, including moments.\n\n<em>“But when thou art again in the sweet world, I pray thee to the mind of others bring me. Say the name. Once a year. At a dinner, even — especially at a dinner. It is all I ask and it is everything.”</em>\n\nThe poet murmurs, beside you: <em>“Three names, {NAME}. A mouth only carries three through this dark. Spend them like your last coins.”</em>`,
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
    { t:'Watch one full rotation of the wheel. Understand it.', go:'n_c4_watch' },
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
  text:`He stops when you stand in his path — the first stopping he has done, perhaps, in centuries. The boulder settles into the mud like a verdict.\n\n<em>“You want the name,”</em> he says, before you ask. <em>“They always start with the name. Listen: I had one. I know I had one. I kept it in the same place I kept everything, locked, safe, safe, safe—”</em> his hands work the air like a man counting phantom coins — <em>“and the lock outlived the key. My mother made that name. Two syllables. I bought things with it. It bought me this stone.”</em>\n\nHe looks up, and his face is a smooth worn place, like a coin handled too long.\n\n<em>“Can you lend me nothing? You, with your pockets full of being alive?”</em>`,
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
    { t:'Skip a stone across the marsh. Someone has to.', go:'n_argenti',
      fx:S=>S.flags.skipped=1 },
  ]},
n_sullen: { region:'styx', title:'The Sullen One', judge:{soul:'s_sullen',go:'n_argenti'},
  text:`You kneel in the reek, and against every rule of this place, the bubbles organize. A voice assembles itself from swamp gas and old grievance — a woman’s voice, wrung flat.\n\n<em>“Down here we say it. That’s the punishment, if you’re keeping notes: an eternity of finally saying it. I was sullen in the sweet air. The sun came up every single day and I took it as a personal insult. My sister sang in the mornings. I never asked her to teach me the song. It seemed — ”</em> a long bubble, almost a laugh — <em>“it seemed like admitting something.”</em>\n\nThe mud holds her the way she once held everything: in, and down, and quietly.`,
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
    { t:'Thank the departing messenger, loudly, to its back.', star:1, go:'n_c6_tombs' },
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
  text:`The old man’s hands close on the rim of the tomb like a swimmer’s on a gunwale.\n\n<em>“If you walk this blind prison by height of genius — my son had genius, where is he? Why is he not with you? Does the sweet light no longer strike his eyes?”</em>\n\nAnd there it is, the trap with no good exit: you don’t know his son. You don’t know if the boy lives. The father reads your half-second of hesitation the way the dead read everything — instantly, and in the worst light — and begins, already, to fall back into the burning.`,
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
  text:S=>(S.flags.carved?`(The trunk you carved screamed with your own voice, which you will be hearing at odd hours for the rest of your life.)\n\n`:``)
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
  text:S=>(S.flags.thankedSlide?`(He looked at your hands on his shoulders like artifacts from a lost civilization. <em>“Yes. Well,”</em> he said, and reorganized his dignity. But he walked differently after — the walk of a man whose catch was witnessed.)\n\n`:``)
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
  text:`He considers your question with his mouth still resting against the skull, the way a man rests a hand on a gate he is thinking of going through again.\n\n<em>“You ask me to renew a desperate grief,”</em> he says at last, <em>“that crushes my heart merely in the thinking, before I speak. No.”</em>\n\nHe returns to the skull. The sound resumes. The ice creaks its ledger-creak, and the interview appears to be over — unless you happen to be carrying the one coin this particular toll-gate takes: a verse about sorrow, minted two circles up, by a lady in a storm.`,
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
  enter:(S,P)=>{ S.flags.marks = P.witness.filter(w=>w!=='s_virgil').length; },
  text:S=>(S.flags.askedHow?`(<em>“By such stairs,”</em> he said, not stopping, <em>“must we depart from so much evil. Also: gravity is a local ordinance. Climb.”</em>)\n\n`:``)
    +`A natural burrow winds up through the rock — no torches, no verses carved anywhere, blessedly unadministered. And far ahead, through the round mouth of it: a coin of night sky. Actual sky. With actual stars, doing their ancient unbothered arithmetic.\n\nThe sound of a little stream keeps you company upward, wearing the mountain away on a schedule of its own.`
    +(S.flags.marks>=8 && !S.names.includes('s_virgil')
      ? `\n\nAt the threshold, the poet stops walking.\n\nYou know before he says it. His road ends here. It always ends here — he has seen this coin of sky a hundred times and never once spent it. <em>“Limbo keeps what Limbo keeps,”</em> he says, evenly, the way you’d read a timetable. <em>“I go back down now. It is not so bad. It is home, whatever else it is. The company, as I said, is excellent.”</em>\n\nHe straightens your collar — an absurd, parental gesture, here, at the bottom of the universe.\n\n<em>“Go up, {NAME}. Rebehold the stars for both of us.”</em>\n\nEight names ride warm in your memory, inscribed on your wall of witnesses. There is room, you realize, for a ninth.`
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
  ]},

/* ---------------- PURGATORIO (true-ending path) ---------------- */
n_purgatorio: { region:'purgatorio', title:'The Shore of the Mountain',
  text:`The poet’s face, when you finish, does something it has not done in nine circles: it forgets to be composed.\n\n<em>“A road,”</em> he repeats. <em>“Walked down to me.”</em> He looks at his hands — thirteen centuries of gesture — and laughs once, brief and real, the laugh of a man who wrote the whole epic and just got surprised by the last line.\n\n<em>“Then I am witnessed. Go. GO — the sky is wasting.”</em>\n\nYou step out — and it is dawn. Not night: DAWN, sapphire-colored, on a shore at the foot of a mountain that goes up farther than up usually goes. The little stream you followed empties at your feet into a sea that has never drowned anyone. Dew is on the grass, actual dew, and the first light is doing something to the water that nine circles tried and failed to make you forget was possible.\n\nA reed grows at the tideline, humble as a spoon. High, high above — terraces, and singing.`,
  choices:[
    { t:'Wash the smoke of Hell from your face with the dew.', star:1, go:'n_terraces' },
    { t:'Gird yourself with the reed, as the shore seems to want.', go:'n_terraces',
      fx:S=>S.flags.reed=1 },
    { t:'Speak, to the sea, every name you carried out.', heart:1, star:1,
      go:'n_terraces', fx:S=>S.flags.seaNames=1 },
    { t:'Look up the mountain. All the way up.', go:'n_terraces' },
  ]},
n_terraces: { region:'purgatorio', title:'The Mountain That Wants You to Climb It',
  text:S=>(S.flags.reed?`(The reed you plucked has already regrown at the tideline behind you — the first thing in two worlds you have seen come back.)\n\n`:``)
    +`The path spirals up and the light improves as you climb — not brighter exactly, but <em>better</em>, the way bread is better than the idea of bread. And everywhere on the mountain: singing. Not performance. Work-song. The penitents climb with their burdens and they sing the way rowers row.\n\nEverything here rhymes with the pit, deliberately, like an answer key. Souls carry weights — but upward. Faces are bent — over their own feet, watching the next step. There is smoke — from censers. You keep flinching at things that turn out to be kind.\n\nAhead, on the first terrace, a man toils bent double under a boulder easily twice the size of anything on the fourth circle’s wheel. He is the single most burdened creature you have seen since the ice.\n\nHe is humming.`,
  choices:[
    { t:'Approach the humming man under the boulder.', go:'n_terrace_soul' },
    { t:'Join the work-song as you climb. Learn it wrong. Learn it again.', star:1,
      go:'n_beatrice_gate' },
    { t:'Climb in silence. Some gratitude has no tune yet.', heart:1, go:'n_beatrice_gate' },
    { t:'Look back down — at the sea, and under the sea of cloud, the far smoke of the pit.',
      go:'n_beatrice_gate', fx:S=>S.flags.lookedBackUp=1 },
  ]},
n_terrace_soul: { region:'purgatorio', title:'The Same Stone, Read Correctly',
  text:`Up close the boulder is appalling — and the man under it greets you like a host at his own door, cheek pressed to the rock, one eye finding yours.\n\n<em>“New!”</em> he says, delighted. <em>“You have the walk of the long way round. Came up through the floor, did you? Then you’ve seen my cousins on the fourth terrace of THAT establishment — the wheel, the shouting, why-hoard-why-squander, round and round?”</em>\n\nYou say that you have.\n\n<em>“Same stone,”</em> he says, and pats it, actually pats it. <em>“That is the joke of the whole architecture, friend, and nobody down there is allowed to get it: same stone, same weight, same bent back. One difference only.”</em> He hitches it higher and takes another step up. <em>“Mine has a TOP. This is pride I’m carrying — forty years of it, I was a magnificent pain of a man — and every step up, the stone is one step lighter than my account of it. Theirs is a sentence. Mine is a CURE. Same medicine. Different label.”</em>`,
  choices:[
    { t:'“Let me carry it a while. You’ve earned a rest.”', heart:1, go:'n_terrace_soul2' },
    { t:'“How long until the top?”', go:'n_terrace_soul2', fx:S=>S.flags.askedTop=1 },
    { t:'Bless him — the first happy burdened man in the universe.', star:1,
      go:'n_beatrice_gate' },
    { t:'Climb on, lighter for no reason you could write down.', go:'n_beatrice_gate' },
  ]},
n_terrace_soul2: { region:'purgatorio', title:'The Whole Medicine',
  text:S=>(S.flags.askedTop
    ? `<em>“How long?”</em> He laughs, which costs him a step, which he pays gladly. <em>“As long as it takes — and understand, friend, up here that sentence is a COMFORT. Down where you walked, ‘forever’ is the horror. Up here, ‘as long as it takes’ means it TAKES. Arrives. Ends. I could climb this rock a thousand years and every one of them would rhyme with ‘almost.’”</em>\n\n`
    : `He shakes his head — gently, so as not to spill the stone.\n\n<em>“Kindly meant, and the answer is no, and the no is the whole medicine. It is MINE to carry. Forty years I handed the weight of myself to porters — servants, sons, a wife, two confessors, one spectacularly patient mule. The carrying is not the punishment, friend. The carrying is the first thing I have ever finished myself.”</em>\n\n`)
    +`He tips his head as far as the rock allows, which is his bow.\n\n<em>“Go up. She is waiting for you above the singing — everyone carrying anything on this mountain can feel it, like weather coming. And friend —”</em> one eye, bright as the dew — <em>“whatever you are still carrying from down there: keep carrying it. Just carry it UPHILL from now on. That is the entire difference between the two establishments.”</em>`,
  choices:[
    { t:'Climb to the light above the singing.', go:'n_beatrice_gate' },
    { t:'Touch the stone once, lightly, for luck — his kind of luck.', star:1,
      go:'n_beatrice_gate' },
  ]},
n_beatrice_gate: { region:'beatrice', title:'She Comes Down',
  text:S=>{ const n=S.names.map(id=>souls[id].name);
    return (S.flags.seaNames?`You say the names to the water — ${n.join(', ')} — and the sea, which has heard every name ever wept over it, takes them without swallowing them. Somewhere up the terraces, the singing changes key, as if making room.\n\n`:``)
      +`She does not descend the mountain. The mountain, as far as you can tell, descends slightly toward HER.\n\nBeatrice. The lady of the light the poet spoke of in the first dark — the one who wept her way down to Limbo to hire a poet for a lost soul she had never stopped watching. Her eyes are the reason the word “star” needed inventing.\n\nShe looks at you — all of you at once, the ledger and the heart and the names in your pockets — and the look is not a greeting. It is an ACCOUNTING. The whole journey stands in the scale: every soul you judged, every tear you spent or hoarded, every name you carried or let fall.`; },
  choices:[
    { t:'Stand and be weighed. Hide nothing. You learned that at Minos.', go:'n_beatrice_verdict' },
    { t:'Kneel first.', star:1, go:'n_beatrice_verdict' },
    { t:'“Before anything — thank you for the poet. Someone should thank you for the poet.”',
      heart:1, go:'n_beatrice_verdict' },
  ]},
n_beatrice_verdict: { region:'beatrice', title:'The Weighing',
  text:`The dawn holds still for it.`,
  choices:[
    { t:'…', go:null,
      end:S=> S.heart<=-3 ? 'e_beatrice_stone' : S.heart>=4 ? 'e_beatrice_flood' : 'e_beatrice_clear' },
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
e_beatrice_stone: { title:'The Ice in You', kind:'true', art:'beatrice',
  text:`She weighs you, and the scale comes back reading STONE.\n\n"You walked through the house of weeping," she says — not unkindly; diagnosis is its own kindness — "and learned its architecture, and forgot to leave. Nine circles passed through you and nothing spilled. Pilgrim: the ice at the bottom is not the punishment. It is the CONDITION. You have carried a sample out."\n\nShe sets you on the mountain’s first terrace anyway — the mountain refuses no one who arrives — but you climb it as you crossed the pit: correctly, efficiently, dry-eyed among the singing penitents.\n\nIt is a long mountain. There is time. That is what the mountain is FOR, she would tell you, if you ever once asked.` },
e_beatrice_flood: { title:'Drowned in Feeling', kind:'true', art:'beatrice',
  text:`She weighs you, and the scale overflows.\n\n"You wept at the whirlwind," she says, steadying you with a look, "and the rain, and the wood, and the ice — you gave a full cup to every beggar in the cellar of the universe, and arrive at the mountain EMPTY. Pilgrim: pity that spends everything is only despair wearing its coat. The dead did not need your drowning. They asked to be CARRIED — a drier job entirely."\n\nShe sets you on the mountain’s first terrace, where the air itself is a kind of convalescence.\n\n"Climb slowly. Refill as you go. The top of this mountain," — and here, for one measureless moment, she smiles — "is not reached by the heaviest heart. It is reached by the heart that learned its own weight."` },
e_beatrice_clear: { title:'The Love That Moves the Stars', kind:'true', art:'beatrice',
  text:`She weighs you a long time. The dawn holds its breath. Nine circles, three names, one guide witnessed home — the whole descent stands in the scale.\n\n"You wept," she says at last, "and walked on. Both. In the correct order, at every station of the dark. Do you know how rare that is, pilgrim? The pit is FULL of the ones who could only do one."\n\nShe turns, and the mountain makes way, terrace upon terrace of singing rising into light that improves as it climbs — and at the top of everything, briefly, you see it whole: the turning, the engine, the thing the whole tour was arranged to show you—\n\nThe Love which moves the sun and the other stars.\n\nYou will spend the rest of your life failing to describe it at dinners, keeping your promises, saying the names. Beginning with a poet’s. It is, as the lady says, not nothing. It is not even close to nothing.\n\nIt is the whole of the arithmetic, and it balances.` },
};

return { regions, verses, souls, nodes, endings, VQ,
  helpers:{ domSin, domRes, SIN_NODE, SIN_WORD } };
})();
