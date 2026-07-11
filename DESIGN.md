# NINE CIRCLES — a descent
A branching-storybook game adapted from Dante's Inferno (Longfellow translation, Project
Gutenberg #1004, full text in `text/`). Same engine philosophy as Choose Wisely — vanilla JS,
zero dependencies, all content data-driven in `js/storyData.js` — but a new mechanical identity.

## Fantasy
You wake midway upon the journey of your life, in a dark wood. A dead poet offers to walk you
down through the nine circles and out the far side. Hell is a bureaucracy of appetites: it reads
you, it remembers you, and it will offer you exactly the thing you cannot refuse.

## Core systems (all new vs. Choose Wisely)
1. **Sin Ledger** — 7 sins (pride, envy, wrath, sloth, greed, gluttony, lust) accrued by choice
   weights. Dominant sin drives: Minos' verdict, soul dialogue, and *gleaming choices* — deadly
   temptations that only shimmer awake when the circle matches your ledger.
2. **Heart axis (Pity ↔ Stone)** — one meter, two failure modes. High pity: Hell's grief pulls
   you in (whirlwind, weeping endings). High stone: safe passage, dead soul. The true ending
   demands the clear-eyed middle: feel it and walk on.
3. **Remembrance / Witness Wall** — souls beg to be retold above (Ciacco's canonical plea).
   3 name slots per run; names inscribe permanently ONLY if you exit alive. 9 witness souls
   (one per circle; the 9th is Virgil). All 9 inscribed across runs ⇒ the climb continues past
   the stars into Purgatorio ⇒ Beatrice, tiered by Heart (3 true-ending variants).
4. **Verses as wards** — real Longfellow tercets are collectible items; *speaking* one at the
   right moment unlocks a hidden choice (v_sorrow is the only key to Ugolino's tale; v_brutes
   steadies the Lucifer climb; v_hope, defied, gives light in the suicide wood).
5. **Beatrice's Star** — grace meter. Lies (even kind ones), divination, and cruelty dim it.
   At star ≤ 2 Hell starts lying back: choice labels visibly corrupt. Exit with star ≤ 1 and the
   stars you reach are painted ones (false-victory ending).
6. **Virgil's Regard** — the guide has opinions (canon-accurate: he *praises* righteous disdain,
   scorns cowardice and misplaced pity). At 0 he returns to Limbo without you.
7. **Minos' Memory (cross-run)** — sin residue persists (halved each run). Minos greets
   returnees by their last ending and offers his sentence: fast-travel to your sin's own circle.

## Structure
Dark Wood → Gate → Vestibule → Acheron → Limbo → Minos → C2 Lust (Francesca) → C3 Gluttony
(Cerberus, Ciacco) → C4 Greed (the nameless miser) → C5 Styx (the Sullen One, Filippo Argenti)
→ Walls of Dis (Medusa trust-trial) → C6 Heresy (Farinata / Cavalcante) → C7 Violence (Wood of
Suicides: Pier delle Vigne; burning sand) → Geryon flight → C8 Malebolge (demon escort lie,
Ulysses' voyage temptation) → C9 Cocytus (Bocca, Ugolino) → Lucifer → the climb → stars /
painted stars / Purgatorio → Beatrice.

## Endings (26)
Per-circle claimings (wood, banner, shore, limbo-guest, whirlwind, rain, wheel, marsh, hymn,
stone, tomb, tree, fall, pitch, voyage, hunger, stillness, fourth-mouth), systemic (contempt of
Minos, abandoned by Virgil, secret throne), exits (stars; painted stars = false victory), and
the Purgatorio tier (stone-heart, flood-heart, and the one true ending: The Love That Moves
the Stars).

## Files
- `index.html` — shell
- `css/style.css` — engraved-Doré look: ink, bone, ember; serif; gold hairlines
- `js/storyData.js` — ALL content: regions, verses, souls, nodes, endings
- `js/art.js` — procedural SVG scene painter per region (no image assets)
- `js/audio.js` — WebAudio generative score; root note falls a semitone per depth; Beatrice
  bell-motif intensity tied to the Star; region layers (storm, rain, ice, heartbeat)
- `js/engine.js` — state, rendering, corruption, HUD, persistence, endings gallery, `~` debug

## Run / deploy
Serve repo root: `powershell -ExecutionPolicy Bypass -File serve.ps1` →
http://localhost:8321/nine-circles/. Static, dependency-free; GitHub Pages ready.
