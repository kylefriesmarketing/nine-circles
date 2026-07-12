# PARADISO — Act III blueprint (design-complete, unbuilt)

*Written at full strength so a later hand can build it without inventing
anything. Read CODEX.md first. Everything here extends the existing engine —
no new architecture, one new act flag.*

## The problem Act III must solve

Inferno judged you. Purgatorio weighed you. A third act that keeps
judging/weighing is a worse rerun. Dante's own solution is the design:
in Paradise **nothing is at stake for YOU anymore** — you are safe, welcomed,
already saved — and the poem stays gripping because the blessed *ask you
questions you cannot dodge*. Every sphere is an examination not of your
virtue but of your **understanding**. So:

> **Act I: you are read. Act II: you are weighed. Act III: you are ASKED.**

The player who button-mashed the first two acts hits a wall here that is made
entirely of their own journey.

## The third inversion (mechanics)

- **No meters go down. Nothing can hurt you.** Remove all failure anxiety in
  the first five minutes — explicitly, in text: "Nothing here can be lost.
  That is what will make it difficult."
- **LUMEN replaces star/sun**: light you *emit*, not receive. It rises only
  when you answer the blessed **truly** — where "truly" = consistently with
  your own recorded history (`P.verdicts`, `P.runsLog`, Wall, endings seen).
  The engine literally quizzes you on your own playthroughs.
- **The Interview system** (new, one mechanic, reused every sphere): a
  blessed soul asks a question about your journey with 3–4 answers. There is
  no "correct" answer — there is *your* answer, and the game knows if it's a
  lie. Answer against your own record and the soul smiles, unfooled, and your
  lumen dims: **the only pain in Paradise is being seen pretending.**
  Implementation: `interview:{q, opts:[{t, truth:(S,P)=>bool|null}]}` sugar on
  nodes, or plain choices with fx comparing P — no engine change strictly
  needed.
- **No inventory at all.** Names, prayers, verses — all spent. The Act III
  collectible is **QUESTIONS**: each sphere leaves you one question you may
  choose to carry (max grows the Rose). Inversion complete: you descended
  carrying the dead's names, climbed carrying their prayers, and rise
  carrying only what you still want to know.
- **Movement is assent.** No walking. You rise between spheres by *agreeing
  to*: each transition is one choice, "Look up," and refusing simply holds
  you — Paradise never pushes (contrast: the wood pushed, the mountain
  scheduled).

## Structure: nine spheres compressed to seven beats (~35 nodes)

| Beat | Sphere(s) | Interviewer | The question under the question |
|---|---|---|---|
| 1 | Moon | **Piccarda** (broken vows) | "You carried three names at a time. Who did you NOT carry — and have you forgiven yourself?" Her line is the act's thesis: *"E 'n la sua volontade è nostra pace"* — in His will is our peace (grep Longfellow: "And His will is our peace"). |
| 2 | Mercury/Venus | **Justinian**, then **Cunizza** | Fame and love, re-examined from above — direct callbacks to Oderisi's wind and Francesca's storm. Cunizza *laughs* about the same passion that damned Francesca: same force, different ending. The player who met both feels the whole architecture snap into focus. |
| 3 | Sun | **Aquinas + Siger** (opponents, side by side, dancing) | An interview about your punish/absolve record — held by two men who fought all their lives and are now in the same ring of light. "You struck N of the damned. Argue the other side, once, well." |
| 4 | Mars | **Cacciaguida** (the ancestor) | The personal center, as in the poem: he addresses the player by {NAME} as *family*, prophesies the cost of telling the truth ("you shall taste how salt the bread of others is" — verify via grep), and gives the commission: TELL IT ALL. This is where the game admits the player will close the tab and points at it: the exile is the ending of every game — you get sent back to the world. |
| 5 | Jupiter | **The Eagle** (justice, speaking as one voice from thousands) | The hardest interview: it asks about e_trade/e_scythe/e_throne if you ever earned them — or, if you never once fell, asks why you think that makes you just. |
| 6 | Saturn + Fixed Stars | **The Ladder + the triple exam** — Peter (faith), James (hope), John (love) | Three rapid interviews keyed to acts: faith = descent evidence, hope = mountain evidence, love = what you did with names. Beatrice's smile is withheld through Saturn (canonically it would destroy you) — mechanize: her presence dims HERE so the finale lands. |
| 7 | Primum Mobile + **the Rose** | Bernard arrives (the third guide handoff — Virgil→Beatrice→Bernard, each loss a lesson), Beatrice takes her seat IN the Rose | Finale below. |

## The finale: the Rose

The Empyrean is the Witness Wall's answer at cosmic scale: an amphitheater
of every soul, tier on tier — and the render includes YOUR wall: the nine
inscribed souls visible in the petals (Francesca in the storm-tier no
longer blown; Ciacco dry; the Forgotten with a FACE now — one devastating
render each, 1 line, art optional). Beatrice leaves mid-scene — upward this
time, to her seat — and smiles once, at distance: the withheld smile, spent.

Then the last interview. Bernard asks the player the game's real question,
with the carried QUESTIONS as the options — whatever you chose to carry up
becomes the menu of your own ending. Final node: the attempt to look at the
Light directly; text admits the failure the poem admits ("my own wings were
not sufficient") — and then the game does the one thing left: it shows the
first line of Act I and the last line of Act III on one screen.
*Midway upon the journey of our life* → *The Love which moves the sun and
the other stars* (v_love finally EARNED in-fiction, not just unlocked).

## Endings (4)

- **pa_peace** — stay in the Moon with Piccarda (the gentlest refusal ever
  written; Paradise's e_limbo, except she warns you kindly and means it).
- **pa_unseen** — lie in every interview: the light never dims around you,
  only IN you; you reach the Rose emitting nothing; the blessed all know;
  nobody minds; that's the horror. "The only pain in Paradise, kept."
- **pa_exile** — accept Cacciaguida's commission early and choose to go back
  down without the Rose: the writer's ending, pairs with e_poet.
- **pa_rose** — the true-true: consistent answers, ≥5 questions carried,
  the look into the Light. Unlocks a permanent title-screen state (the
  funnel/mountain/rose triptych) — the game's platinum.

## Gating & entry

`Begin the Rose` on the title requires `pe_paradiso` witnessed (the mountain's
perfect ending) — the trilogy's acts gate in sequence. Entry seeds nothing:
Act III reads history, it doesn't inherit meters. `S.act='paradiso'`,
`S.lumen` 0..9, `S.questions[]`.

## Presentation

- **Art** (~5 sheets, 20cr): anchor as ever, but palette leaves the earth —
  each sphere is one color of LIGHT on near-white (the inversion of the
  descent's blacks): moon-pearl, mercury-silver, venus-rose, sun-gold,
  mars-ruby, jupiter-white, saturn-crystal, and the Rose (one full sheet,
  the game's most expensive single image — worth 4K solo).
- **Audio**: everything major-mode; the Beatrice motif finally plays COMPLETE
  and in tune at all times (it was star-gated for two acts — its constancy
  here IS the storytelling); each sphere adds one voice to a building choir
  (layered detuned triangles); the Rose = every soul motif from Act I played
  simultaneously, resolved to the major — Ugolino's gnawing semitone becomes
  the choir's suspension. Do this. It will wreck people.
- **HUD**: one element — your lumen, as a growing halo around the pilgrim
  marker. The rail is a vertical line of nine lights with the Rose at top.
- **Corruption inverted**: at high lumen, choice text gains *illumination* —
  first letters gilding (CSS), the reader's reward for honesty.

## Effort estimate

~35 nodes but interview-dense (more branching-on-history than prose volume):
one strong session for systems+writing, half a session for art+audio+QA.
The interviews are the only hard part — they must read your actual record
(`P.runsLog`, `P.verdicts`, `P.endings`) or the whole act is a fraud.

*Build it when the trilogy has players. Paradise is a reward, and rewards
need someone to have earned them.*
