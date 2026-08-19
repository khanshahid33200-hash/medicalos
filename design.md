# Clinic OS — Design System
## "Living Glass" — an iOS-native glass aesthetic for a calm, trustworthy clinic experience

---

## 0. Design Philosophy

A clinic waiting room is a place of low-grade anxiety — nobody wants to be there, everybody wants to know how much longer. The interface's job is to lower that anxiety through *clarity you can feel*, not through medical iconography or clinical sterility.

**Living Glass** borrows iOS's frosted-glass material language — translucent surfaces that let a soft, living background breathe through them — because glass reads as *calm and weightless* rather than *institutional*. Nothing on screen looks like a form. Everything looks like it's floating slightly above a gentle, moving field of light, the way an iOS Control Center panel sits above your wallpaper. The one place we allow ourselves real presence and motion is the **queue number** — the single fact every patient in the room actually cares about — which becomes the visual heart of the product: a glass capsule that gently breathes, like a heartbeat, so a live wait number feels alive instead of static.

Everything else — forms, cards, dashboards — stays quiet, legible, and gets out of the way.

---

## 1. Color System

Two coordinated palettes (light / dark), both built around a **clinical teal**, not a medical red-cross blue or sterile hospital white. Teal reads as calm and modern without slipping into either "corporate SaaS blue" or "hospital beige."

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-base` | `#F4F9F9` | `#081416` | Page background, before the mesh gradient |
| `--bg-mesh-a` | `#CFEFEA` | `#0F2E30` | Ambient background gradient stop 1 |
| `--bg-mesh-b` | `#E8F3FF` | `#132430` | Ambient background gradient stop 2 |
| `--glass-fill` | `rgba(255,255,255,0.55)` | `rgba(18,30,32,0.45)` | Glass panel fill, always paired with blur |
| `--glass-border` | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.08)` | 1px hairline on glass edges |
| `--ink-primary` | `#0E2426` | `#EAF6F6` | Primary text |
| `--ink-secondary` | `#4C6B6D` | `#9FC4C6` | Secondary text, captions |
| `--accent-teal` | `#1FA593` | `#3FD9C4` | Primary accent — brand, primary actions, "waiting" state |
| `--accent-coral` | `#FF6B5C` | `#FF8A7D` | Urgency flag, destructive actions only — never decorative |
| `--accent-mint` | `#3FCB86` | `#5FE39C` | Success / "done" state |
| `--accent-amber` | `#F5A623` | `#FFC24D` | "Needs review again" / requeued state |

**Rule:** coral is reserved exclusively for AI urgency flags and destructive actions (cancel, delete). If coral starts showing up on decorative elements, that's a sign the palette is being used wrong — it must stay rare enough that a patient or doctor's eye catches it instantly.

---

## 2. Typography

| Role | Face | Notes |
|---|---|---|
| Display (queue numbers, large titles) | **SF Pro Display** (native iOS) → web fallback: `-apple-system, "SF Pro Display", "General Sans", Inter, sans-serif` | Used at large sizes only, tight tracking, semibold–bold |
| Body (forms, dashboard content) | **SF Pro Text** → web fallback: `-apple-system, "SF Pro Text", Inter, sans-serif` | Regular weight, generous line height (1.5) for anxious/rushed reading |
| Utility (timestamps, queue codes, metadata) | **SF Mono** → web fallback: `"SF Mono", "IBM Plex Mono", ui-monospace` | Tabular figures, used for anything numeric that updates live (queue no., wait time) — monospace prevents layout jitter as digits change |

**Type scale**

```
Display XL   56 / 60   weight 700   — the queue number itself, nothing else uses this size
Display L    34 / 40   weight 600   — screen titles ("You're checked in")
Title        22 / 28   weight 600   — card headers, doctor names
Body         17 / 26   weight 400   — form labels, primary reading text
Caption      13 / 18   weight 500   — timestamps, status labels, uppercase tracking +0.02em
Micro        11 / 14   weight 500   — legal/consent fine print only
```

---

## 3. The Glass Material System

Every elevated surface (cards, sheets, nav bars, the queue capsule) is built from the same three-layer recipe, matching how iOS actually composites its materials — this consistency is what makes the whole app feel like one coherent material rather than "some blurred boxes."

```
Layer 1 — Backdrop blur     backdrop-filter: blur(24px) saturate(160%)
Layer 2 — Tint fill         background: var(--glass-fill)
Layer 3 — Edge highlight    border: 1px solid var(--glass-border)
                             + inset top highlight: 
                               box-shadow: inset 0 1px 0 rgba(255,255,255,0.4)
```

**Elevation tiers** (how far a surface sits "above" the background mesh):

| Tier | Blur | Shadow | Use |
|---|---|---|---|
| `glass-0` | 16px | none | Inline chips, tags |
| `glass-1` | 24px | `0 8px 32px rgba(0,0,0,0.08)` | Standard cards |
| `glass-2` | 32px | `0 16px 48px rgba(0,0,0,0.12)` | Modals, sheets, the queue capsule |
| `glass-3` | 40px | `0 24px 64px rgba(0,0,0,0.16)` | The doctor's "active brief" panel — the single most important surface on a doctor's screen at any moment |

**Corner radius:** iOS-style *continuous* (squircle) corners throughout — `border-radius: 28px` on cards using a superellipse, not a plain circular radius, everywhere the platform allows it (native iOS renders this automatically; on web, approximate with a slightly higher radius + `clip-path` superellipse for the signature elements).

---

## 4. Signature Element — The Living Queue Capsule

This is the one thing the product will be remembered by. Every patient's single question is "how much longer" — so that number gets a piece of UI unlike anything else in the app.

```
        ╭─────────────────────────╮
       ╱                           ╲
      │        ·  ·  ·  ·  ·        │   ← thin progress ring, one dot per
      │                             │      patient ahead, fills as they clear
      │            12               │   ← Display XL, monospace tabular
      │        NOW SERVING: 9       │      digits so it never jitters
      │                             │
       ╲     Dr. Mehta · Room 3    ╱
        ╰─────────────────────────╯
```

- Rendered as a `glass-2` capsule, centered on the patient's live tracker screen.
- A **slow breathing animation** — `scale(1.0 → 1.015)` over 3.2s, ease-in-out, infinite — signals "this is live," the way a heartbeat monitor's line moving tells you a patient is stable, without being literal or gimmicky about it.
- When the patient's number is called, the capsule performs a single deliberate pulse + a soft teal-to-mint color wash, then transitions to a "You're up!" state — one orchestrated moment, not a barrage of confetti.
- The dot-ring around the number is the *only* other place progress is shown — no separate progress bar competing for attention.

---

## 5. Layout

**Patient-facing screens** (check-in form, live tracker): single-column, generous whitespace, one primary action per screen. iOS "large title" pattern at the top (title left-aligned, oversized, collapses to a small centered title on scroll).

**Doctor dashboard**: iOS-style split view — a glass sidebar list of the queue (left, `glass-1`) and the active patient's brief as a floating `glass-3` panel (right), so the doctor's eye always lands on the one thing that matters most without hunting.

```
┌───────────────┬─────────────────────────────────┐
│  QUEUE (glass-1)│   ACTIVE BRIEF (glass-3)         │
│  ● 12 Aditi K.   │   Aditi K. · 34 · Fever, cough    │
│  ○ 13 Rohan S.   │   ─────────────────────────────  │
│  ○ 14 Priya M.   │   AI summary · suggested Qs       │
│  ⚠ 15 Karan T.   │   [ Done ] [ Reschedule ] [ Requeue ]│
└───────────────┴─────────────────────────────────┘
```

Bottom tab bar (patient app, mobile) follows native iOS conventions exactly: `glass-2`, floating with margin from the screen edge, blurred content scrolling beneath it, SF Symbols-style line icons at 24px.

---

## 6. Motion

Motion budget is deliberately small and spent on the moments that carry real information:

1. **Queue capsule breathing** — ambient, continuous, low-amplitude (see §4)
2. **Status change transitions** — card color washes (teal→mint on "done", teal→amber on "requeued") over 400ms ease-out
3. **Sheet presentations** — modals slide up with iOS's characteristic spring curve (`cubic-bezier(0.32, 0.72, 0, 1)`), not a linear fade
4. **List reordering** (queue shifting down after a "done") — items animate to their new position over 300ms rather than snapping, so the number change reads as *movement*, not a jarring re-render

Everything else is static. `prefers-reduced-motion` disables the breathing animation and all spring curves in favor of instant/cross-fade transitions.

---

## 7. Component Notes

- **Buttons:** primary action = solid teal pill, `glass-0` never used for primary CTAs (they need to read as solid, tappable, unambiguous — glass is for containers, not controls a person must act on with certainty).
- **Urgency flag (doctor-only):** a small coral dot + "Flagged" caption on the queue list — never a full coral card background, which would visually shout at a screen the doctor is scanning quickly and dozens of times a day.
- **Form fields:** flat, not glass — inset slightly into the glass card they sit on (`background: rgba(0,0,0,0.03)`), so the eye can distinguish "surface" from "input" instantly.
- **Consent checkbox (AI triage):** intentionally *not* buried in fine print — same Body text size as the rest of the form, own row, clear language per the compliance requirements in the PRD.

---

## 8. Accessibility Floor

- All text meets WCAG AA contrast against its glass surface at both elevation tiers — verify `--ink-primary` against `--glass-fill` specifically, since translucency is the one place glass UIs typically fail contrast checks.
- Every interactive element has a visible focus ring (`2px solid var(--accent-teal)`, offset 2px) — glass surfaces make default browser focus rings nearly invisible, so this is a hard requirement, not a nice-to-have.
- Live queue updates are announced via an `aria-live="polite"` region, so a screen-reader user gets "You are now 3rd in line" without needing to re-read the whole tracker.
- Color is never the only signal: urgency flags, status changes, and queue position changes all pair color with an icon or text label.
- Minimum tap target 44×44pt throughout, per iOS HIG, regardless of visual size.

---

## 9. CSS Custom Properties (implementation reference)

```css
:root {
  /* color */
  --bg-base: #F4F9F9;
  --bg-mesh-a: #CFEFEA;
  --bg-mesh-b: #E8F3FF;
  --glass-fill: rgba(255,255,255,0.55);
  --glass-border: rgba(255,255,255,0.65);
  --ink-primary: #0E2426;
  --ink-secondary: #4C6B6D;
  --accent-teal: #1FA593;
  --accent-coral: #FF6B5C;
  --accent-mint: #3FCB86;
  --accent-amber: #F5A623;

  /* type */
  --font-display: -apple-system, "SF Pro Display", "General Sans", Inter, sans-serif;
  --font-body: -apple-system, "SF Pro Text", Inter, sans-serif;
  --font-mono: "SF Mono", "IBM Plex Mono", ui-monospace, monospace;

  /* glass */
  --blur-1: 24px;
  --blur-2: 32px;
  --blur-3: 40px;
  --radius-card: 28px;
  --radius-capsule: 40px;
}

[data-theme="dark"] {
  --bg-base: #081416;
  --bg-mesh-a: #0F2E30;
  --bg-mesh-b: #132430;
  --glass-fill: rgba(18,30,32,0.45);
  --glass-border: rgba(255,255,255,0.08);
  --ink-primary: #EAF6F6;
  --ink-secondary: #9FC4C6;
  --accent-teal: #3FD9C4;
  --accent-coral: #FF8A7D;
  --accent-mint: #5FE39C;
  --accent-amber: #FFC24D;
}

.glass-1 {
  backdrop-filter: blur(var(--blur-1)) saturate(160%);
  background: var(--glass-fill);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.4);
  border-radius: var(--radius-card);
}

.queue-capsule {
  animation: breathe 3.2s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(1.0); }
  50%      { transform: scale(1.015); }
}
@media (prefers-reduced-motion: reduce) {
  .queue-capsule { animation: none; }
}
```

---

## 10. What This Design Deliberately Avoids

- **No sterile hospital white-and-blue.** Teal + warm neutrals instead — calm without feeling institutional.
- **No red for anything but true urgency.** Coral is rationed so it retains meaning.
- **No decorative motion.** Every animation in §6 carries information; nothing moves just to look alive.
- **No glass on primary buttons.** Translucency is for containers a person reads; solid color is for controls a person must act on without hesitation.
