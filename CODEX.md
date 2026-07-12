# THE CODEX — how to extend NINE CIRCLES without degrading it

This file exists so that any future session, model, or human can add to this
game safely. Read it whole before touching `js/storyData.js`. The game's
quality lives in patterns, not in any one file — this documents the patterns.

---

## 1. Architecture in sixty seconds

Four files, no build step, no dependencies:

- **`js/storyData.js`** — ALL content: regions, verses, souls (+ memory lines,
  rite lines), prayers, ~135 nodes, 35 endings. Returns the `STORY` object.
- **`js/engine.js`** — state, rendering, choice resolution, HUD (Reliquary /
  ascent variant), rails (Funnel / Mountain), persistence, galleries, debug.
- **`js/art.js`** — procedural SVG painter per region (`P.<region>(rng)`), the
  permanent fallback under the illustrated JPGs.
- **`js/audio.js`** — generative score: `REGION_CFG` per region, `MOTIFS` per
  soul (rests are part of the writing), Beatrice bells = star-count notes.

Save keys: `nc_persist` (cross-run) and `nc_run` (autosave every node).
Both self-repair on load (`loadP` / `loadRun` guards) — NEVER remove a field
from `newRun()` without keeping its backfill default there.

## 2. The state objects

Run state `S`: `act` ('inferno'|'purgatorio'), `sins{7}`, `heart` (-6..6,
pity↔stone), `star` (0..6 grace; ≤2 corrupts choice text, ≤1 at exit = Painted
Stars), `virgil` (0..6; 0 in Act I = he leaves), `names[]` (max 3),
`verses[]`, `judged{soulId:verb}`, `absolved/punished`, `memory` (snapshot of
`P.verdicts` at run start — so same-run verdicts don't self-trigger
greetings), and Act II: `pace` (-8..8), `burdens{7}` (0..6), `ps{7}` (wiped
letters), `prayers[]`, `dayPhase` (0..6), `sirenTaken`, `seenT[]`.

Persistent `P`: `witness[]` (the Wall; inscribe ONLY on living exits, plus the
e_trade exception), `verdicts{soul:{last,n}}` (Lethe deletes harsh ones),
`residue{}` (sins ×0.6 each run, drives Minos), `runsLog[]` (Tapestry archive,
cap 40), `versesFound[]`, `endings{}`, `fx{tw,music,sfx}`, `lastRun`.

## 3. Node schema (everything is data)

```js
n_example: { region:'lust',            // or (S,P)=>key — n_rite does this
  music:'judecca',                     // optional region-audio override
  motif:'s_virgil',                    // optional soul-leitmotif override
  judge:{soul:'s_x', go:'n_after'},    // engine injects Absolve/Punish rites
  enter:(S,P)=>{...},                  // runs on render, before choices
  title:'...', text:(S,P)=>`...`,      // string or fn; {NAME} token; HTML ok
  choices:[{
    t:'...',                           // string or fn
    pre:'carry her name',              // small-caps kicker line
    req:(S,P)=>bool,                   // visibility gate
    verse:'v_sorrow',                  // ward: only visible if verse held
    gleam:'lust',                      // shimmers when that sin ≥3
    sin:{lust:1}, heart:1, virgil:-1, star:-1,          // Act I effects
    pace:1, burden:{pride:-2}, pray:'pr_x', wipeP:'pride', // Act II effects
    learnVerse:'v_x', remember:'s_x',  // collectibles (remember: 3-slot cap
                                       //  auto-disables when mouth is full)
    fx:(S,P)=>{...},                   // arbitrary; set S.flags.*
    go:'n_next' | (S,P)=>'n_x',        // end takes precedence over go
    end:'e_id' | (S,P)=>'e_id',
  }]},
```

Ending schema: `{title, kind:'death'|'exit'|'true', art:'regionKey', text}`.
`kind exit/true` inscribes carried names (exceptions hardcoded in `ending()`:
`e_falsestars` never inscribes; `e_trade` inscribes despite being a death).

## 4. THE PROSE STYLE GUIDE (this is the game)

Voice: second person, present tense. Literary but *funny at the edges* — the
horror lands because the narrator has manners. Study these before writing:
n_vestibule (bureaucratic dread), n_miser (grief via inventory), n_ulysses
(temptation that never lies), p_belacqua (comedy that turns out to be
theology), t5_statius2 (the face joke — let the reader arrive first).

Rules that make it feel authored:
1. **Punchline positions are load-bearing.** End paragraphs on the turn, not
   after it. "He makes room." beats any longer sentence.
2. **The damned have office jobs.** Hell is administration — dockets, filing,
   appointments, exchange rates. Metaphors come from paperwork and weather,
   never from gore. If a line could appear in a horror game, cut it.
3. **Nobody monologues without a want.** Every soul speech exists because the
   soul wants something from you THIS beat (a name, a verdict, an audience).
4. **Choices are written in the player's inner voice** — flippant, scared,
   kind, or cruel, but never neutral menu-text. "Call out. Someone must be
   walking their dog." Include one choice per node that's a joke and one that
   costs something.
5. **Quote Longfellow only verbatim and only verified** — grep
   `text/divine-comedy-longfellow.txt` first, always. Paraphrase everything
   you can't verify. Verses go in `VQ()` blocks.
6. Em-dashes with spaces — like this. Curly quotes. `<em>` for speech,
   `\n\n` between paragraphs (renderer splits on it for the unfurl).
7. Node length: arrival/setpieces up to ~1,100 chars; reaction beats ~400.
   The five longest nodes in the game are the five biggest moments — keep
   that correlation.

## 5. Recipes

**Add a soul encounter (Act I judgment):**
1. Add to `souls{}`: name, circle, `absolveLine`, `punishLine`, `mem:{inscribed,
   mercy, harm}`, `absolveChoice`, `punishChoice`, `epi:{remember,absolve,punish}`.
2. Write the node with `judge:{soul,go}` + prepend `soulMem(S,P,'s_x')` to its
   text fn. Judgment verbs: pity/condemn/question/remember as data choices
   (each sets `S.judged.s_x` via fx); absolve/punish are engine-injected.
3. If it joins the Witness Wall you must rebalance the whole 9-soul economy —
   don't. The Wall is closed at nine. New souls are "lesser shades" (no
   `remember` choice) unless you're redesigning the true-ending gate.
4. Give it a leitmotif in `audio.js MOTIFS` (write the character as intervals;
   use `null` rests expressively) and a portrait medallion if illustrated.

**Add a terrace/region:** `regions{}` entry (Act II regions need `terrace:0-9`
for the Mountain rail), `art.js` painter (copy a neighbor's structure; use the
shared helpers; seeded rng only), `audio.js REGION_CFG` entry, then nodes.
Terrace pattern: arrival (exempla, work choices that `burden:{sin:-2}`) →
soul (prayer via `pray:`) → angel (wipe gated `req:S=>S.burdens.sin<=1`,
with a work-loop choice and a "climb on anyway" escape).

**Add an ending:** entry in `endings{}` + a reachable `end:` choice + a card
image at `assets/endings/<id>.jpg` (falls back to the region painter until it
exists). Then add it to the QA table (see §6) and re-run.

## 6. QA — never ship without

- In-page harness: `window.__qaRun(table)` (installed by eval during QA runs;
  pattern in git history, commit "QA marathon"). Table rows:
  `[endingId, 'd'|'a', [['j','node'],['s',setupFn],['c',/regex/]]]`.
  **At star ≤2 click by INDEX not regex** — corruption scrambles labels.
- Debug lantern `~`: node jump, stat setters, `give scythe`, `absolved 4 /
  punished 3`, all verses, 8 witness marks, ascent pace/burdens, `ascent
  perfect`, WIPE ALL.
- `?node=n_x&name=Y` boots any scene (used for headless screenshots).
- preview_screenshot times out on this game — use headless Edge:
  `msedge --headless --screenshot=out.png --window-size=1280,800
  --virtual-time-budget=9000 <url>`.
- Full checklist: every new node rendered once (sweep pattern in git history),
  all endings witnessed, 375px viewport, old-save load.

## 7. Art pipeline (exact formula)

- Model `nano_banana_pro`, 16:9, `resolution:'4k'` (4cr/gen).
- **Style anchor**: pass job `2ddf790e-1a28-4eeb-8b67-0a3ec629df82` (the title
  hero) as `medias:[{value, role:'image'}]` with preamble: *"Match the painting
  style, oil-paint brushwork and lighting language of the reference image
  EXACTLY, but do not copy its composition."*
- 2×2 sheets, one complete painting per quadrant, each with an explicit
  per-quadrant palette anchor (anti-sameyness: fire is RATIONED; Act II is
  dawn). Two tiny travelers in Act I scenes; pilgrim alone after eden_gone.
  End every prompt: "No text, no borders, no watermark."
- Slice: `scratchpad slice.ps1 -In sheet.png -Cols 2 -Rows 2 -Names
  "a,b,c,d" -OutDir assets/scenes` (inset 0.02 default; souls used 3×3 @ 0.04,
  MaxW 700). PowerShell 5.1: keep scripts ASCII-only (entities for em-dashes).
- Sources → `assets/raw/` (gitignored, ~600MB, keep locally for re-slicing).

## 8. Business decisions (locked with Kyle, 2026-07-11)

- **itch.io first**: browser free/PWYW + $5 deluxe download (zip + artbook in
  `dist/`, gitignored). Store copy: `docs/itch-page.md`; posts:
  `docs/launch-posts.md`.
- **Steam later**: ONE base app (~$5, Nine Circles + Shelf launcher) + the
  other trilogy games as DLC — OR the "choose your entry" variant via three
  apps with cross-ownership checks (`BIsSubscribedApp`) if Kyle prioritizes
  player choice over consolidated reviews. .exe = Electron/Tauri wrapper over
  these exact files; one codebase forever; updates via steamcmd.
- When Steam launches, web versions likely become demos — Kyle decides before
  the store page goes up, never after.
- THE SHELF hub (kylefriesmarketing.github.io/games) is trilogy-only and is
  ANOTHER session's repo — coordinate, don't edit blind.

## 9. What NOT to do

- Don't add mechanics that don't grow from the text (every system here maps
  to something Dante wrote: contrapasso→gleams, "ricordati di me"→names,
  pietà→heart, l'ombra che non trova posa→corruption).
- Don't open the Witness Wall past nine, don't make prayers scarce, don't
  give the scythe a free lunch (punish costs a candle — tonal invariant).
- Don't trust `preview_screenshot`, don't write PS scripts with smart quotes,
  don't read `assets/raw` or `text/*.txt` into context whole (grep it).
- Don't ship without the QA table run green. The harness is faster than hope.
