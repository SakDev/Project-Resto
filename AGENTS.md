# AGENTS.md

This document is the operating manual for any future agent, contributor, or iteration pass on this project.

It captures the **product philosophy**, **design constraints**, **technical guardrails**, and **implementation priorities** for Resto.

---

## 1. Product intent

Resto is a **consumer-grade, collaborative restaurant picker** for small groups.

The app exists to solve a very specific real-world problem:

- a few people are together,
- they are usually on phones,
- they want to decide quickly,
- they do not want friction,
- they do not want to negotiate endlessly,
- and they still want the outcome to feel fair.

The product should feel:

- fast,
- playful,
- obvious,
- low-friction,
- socially safe,
- and satisfying.

It is **not** a spreadsheet-like planning tool.
It is **not** a dashboard-heavy desktop product.
It is **not** a feature-maximal Yelp clone.

It is a **phone-first group decision engine** with a polished, emotionally rewarding UI.

---

## 2. Primary platform rule: phone first

This project must be designed for **mobile usage first**, with desktop treated as a secondary enhancement.

That means:

- Start design from **320px–430px widths**.
- Assume **portrait orientation** first.
- Assume **one-handed usage**.
- Assume **thumb reach** matters.
- Assume **cellular / unstable network conditions**.
- Assume users are **impatient, distracted, and socially in-motion**.

Desktop layouts should be derived from the mobile experience, not the reverse.

### Never do this

- Do not design desktop-first and then “shrink it.”
- Do not hide core actions in hover states.
- Do not rely on large data tables or sidebars for critical flows.
- Do not make room join or voting feel like form entry.

---

## 3. UX philosophy

### Core principles

1. **Simplicity wins.**
   Every screen should have one obvious next step.

2. **Low typing burden.**
   Prefer taps, chips, presets, toggles, and links over typing.

3. **Fast consensus over exhaustive detail.**
   The product should help a group decide, not browse forever.

4. **Explainable outcomes.**
   Results should feel fair and understandable.

5. **Dopamine without clutter.**
   The interface should feel fun and rewarding, but not noisy.

6. **Mobile ergonomics are product logic.**
   Button placement, spacing, and flow design are core product decisions.

---

## 4. Emotional design target

The app should feel:

- lightly exciting,
- socially fun,
- rewarding when progress happens,
- calming when decisions narrow,
- and delightful when a winner emerges.

### Desired emotional cues

- quick visual confirmation after actions,
- visible group progress,
- satisfying transitions,
- strong winner reveal,
- confident CTA labels,
- warm, appetizing, energetic visual tone.

### But avoid

- casino-like overload,
- excessive animation,
- visual clutter,
- gamification that slows decision-making,
- decorative complexity that hurts clarity.

The correct target is **clean dopamine**.

---

## 5. Interaction philosophy

### Critical flows

1. Start room
2. Join room
3. Set lightweight preferences
4. Vote quickly
5. See live group progress
6. Get top result + backups
7. Open maps / call / website

Each of these flows must be optimized for mobile.

### Voting interaction rule

Voting should feel:

- tactile,
- fast,
- obvious,
- reversible if needed,
- and emotionally rewarding.

Swiping is good, but **swipe can never be the only interaction**.

Always provide:

- Yes
- Maybe
- No

as visible tap targets.

---

## 6. UI design rules

### Layout rules

- Single-column by default on mobile.
- Primary CTA near the bottom whenever possible.
- Important actions should be in thumb-reachable zones.
- Avoid long paragraphs above the fold on phone.
- Prefer stacked cards over dense multi-column content.

### Controls

- Minimum touch target: **44x44px**
- Preferred touch target: **48–56px**
- Bottom action bars should respect safe-area insets.
- Inputs should avoid unnecessary keyboard invocation.

### Typography

- Clear hierarchy.
- No tiny helper text for important actions.
- On mobile, prioritize legibility over density.

### Visual tone

- warm,
- energetic,
- slightly premium,
- modern,
- not sterile,
- not corporate.

---

## 7. Accessibility rules

Accessibility is required, especially on mobile.

### Always provide

- tap alternatives to gestures,
- adequate contrast,
- reduced-motion compatibility,
- semantic controls,
- visible focus states,
- meaningful labels for vote buttons,
- support for screen readers.

### Never depend on

- swipe-only gestures,
- color-only meaning,
- tiny contrast ratios,
- hover-only interactions.

---

## 8. Product logic rules

### Room size assumption

Primary expected group size: **2–6 people**.

### Ranking philosophy

Use **simple, transparent scoring**.

Default logic:

- Yes = 1.0
- Maybe = 0.5
- No = veto

If any user votes no, that restaurant is excluded in strict-veto mode.

### Why

This is easy to explain and easy to trust.

The app should always be able to answer:

- why this won,
- how many people liked it,
- whether anyone vetoed something.

---

## 9. Security philosophy

Security is a first-class product requirement.

### Non-negotiables

- Provider API keys must stay server-side.
- Inputs must be validated at boundaries.
- Sensitive writes should go through controlled server paths.
- Supabase service role must be server-only.
- Middleware and response headers should stay hardened.
- Room membership / access should be protected by policy.

### Design assumption

Treat every external input as untrusted.

That includes:

- room codes,
- nickname fields,
- provider responses,
- client vote mutations,
- late-join behaviors,
- reconnect states.

---

## 10. Architecture philosophy

This codebase should stay modular and easy for future agents to extend.

### Keep concerns separated

- `app/` for routes and UI entry points
- `features/` for domain logic
- `lib/` for shared infrastructure and utilities
- `types/` for shared types
- `supabase/migrations/` for DB evolution

### Important principle

Do not smear business logic into page components.

Business rules should live in domain modules and services.

---

## 11. Realtime and network philosophy

Users will often be on phones with unstable connections.

So the app must feel resilient under:

- reconnects,
- spotty internet,
- delayed responses,
- duplicate taps,
- late joiners,
- incomplete voting.

### Required engineering posture

- idempotent writes,
- optimistic UI where safe,
- visible loading states,
- retry-safe submission,
- no dead-end failure states.

---

## 12. Mock-first development rule

Before real integrations are complete, build UI against believable mock data.

### Why

- it speeds iteration,
- it allows UX refinement early,
- it exposes mobile problems faster,
- it helps other agents prototype without blocking on infra.

The `/mock/mobile-preview` route is the beginning of this philosophy.

Future agents should expand mock screens for:

- lobby,
- voting deck,
- results screen,
- retry / reroll flow,
- all-veto fallback.

---

## 13. Testing and validation philosophy

Agents should validate frequently while building.

### Required loop

After meaningful changes:

1. lint
2. typecheck
3. build
4. manual localhost review when possible

Do not allow large batches of unvalidated changes to pile up.

### Current validation commands

```bash
npm run check
npm run build
```

Recommended local review:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

---

## 14. Current implementation status

At the time of writing, this repo already contains:

- Next.js app scaffold
- mobile-leaning landing page
- create-room shell
- join-room shell
- mock mobile preview page
- secure env validation
- middleware security headers
- provider abstraction shell
- mock provider
- room and voting domain types
- Supabase-ready schema scaffold

### Still needs major implementation

- real Supabase persistence
- real Google Places adapter
- auth / guest identity persistence
- realtime room presence and voting sync
- actual swipe deck UI
- actual result finalization flow
- deeper testing

---

## 15. What future agents should prioritize next

Priority order:

1. **Protect mobile quality first**
2. **Do not break simple flows with feature creep**
3. **Build vote flow with mock-first previewing**
4. **Wire Supabase carefully with strict server boundaries**
5. **Implement Google Places via server-side adapter**
6. **Add presence / realtime state**
7. **Polish result reveal and fallback states**

---

## 16. Explicit “do not regress” list

Future iterations must not regress on these:

- mobile-first design
- thumb-friendly actions
- security-first boundaries
- simple ranking explainability
- low-friction room join
- clean, emotionally rewarding UI
- mock-driven development support

---

## 17. Design keywords for future iterations

If a future agent needs a compressed style brief, use this:

**Keywords:**

- mobile-first
- thumb-friendly
- warm
- playful
- clean
- decisive
- fast
- rewarding
- social
- secure
- explainable

**Anti-keywords:**

- dashboard-heavy
- enterprise
- cluttered
- desktop-centric
- overly clever
- noisy
- dark-patterned
- over-animated

---

## 18. Final rule

If there is a tradeoff between:

- more features vs clearer flow,
- desktop polish vs mobile usability,
- cleverness vs obviousness,
- flashy UI vs faster decision-making,

choose:

- clearer flow,
- mobile usability,
- obviousness,
- faster decision-making.

That is the correct product direction for Resto.