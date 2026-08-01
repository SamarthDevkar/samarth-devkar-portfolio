# Design System

## Concept

A computational research interface: the visual language of an instrument panel and a research journal rather than a SaaS landing page.

The work this site describes is instrumentation, so the design leans on hairline rules, dense monospace metadata, a strict grid, and a single accent colour used only where it carries meaning. One accent colour is deliberate: sodium amber reads as instrumentation and alerting, and it is specifically not the cybersecurity clichés of neon green or purple gradient. Because there is only one accent, anything wearing it is important by definition.

## Colour tokens

Defined in `src/app/globals.css` as OKLCH custom properties, exposed to Tailwind through `@theme inline`. Always use the semantic token (`bg-surface`, `text-ink-2`), never a raw colour.

### Surfaces

| Token | Role |
| --- | --- |
| `--canvas` / `bg-canvas` | Page background |
| `--surface` / `bg-surface` | Cards, panels, raised blocks |
| `--surface-2` / `bg-surface-2` | Hover and active states |
| `--line` / `border-line` | Default hairline borders |
| `--line-strong` | Emphasised borders, hover |

> The page background token is named `canvas`, not `base`, on purpose. A token named `base` makes Tailwind generate a *colour* utility called `text-base`, which shadows Tailwind's built-in `text-base` font-size utility. Anything written `sm:text-base` then paints its text in the page background colour and disappears. Do not rename it back.

### Text

| Token | Role |
| --- | --- |
| `--ink` / `text-ink` | Headings, primary text |
| `--ink-2` / `text-ink-2` | Body copy |
| `--ink-3` / `text-ink-3` | Metadata, captions, labels |

All three clear WCAG AA (4.5:1) in both themes, verified by axe with webfonts loaded.

> The light theme values are darker than they intuitively need to be. axe derives its contrast threshold from computed font size and weight, so a lighter `--ink-3` that looks fine at body size fails against the 12px monospace metadata it is actually used on. When editing these, verify in **both** themes, and make sure the audit waits for `document.fonts.ready` first, or it will silently skip elements and pass.

### Signal and severity

| Token | Role |
| --- | --- |
| `--signal` | The single accent: primary actions, active states, emphasis |
| `--signal-dim` | Muted accent |
| `--signal-contrast` | Text on an accent-filled surface |
| `--sev-info` to `--sev-critical` | Severity ramp, used only where triage semantics are real (the hero visualisation's severity lanes). Never decorative. |
| `--focus` | Focus ring, distinct from `--signal` so focus is never confused with emphasis |

## Themes

Dark is the default and is the designed state. It applies from `:root` with no JavaScript, so a visitor with scripts disabled gets the intended design rather than a fallback.

`.light` overrides the token set. A pre-paint inline script in `layout.tsx` adds `light` or `dark` to `<html>` from `localStorage`, falling back to the OS preference, before first paint, so there is no flash.

The light theme is a warm paper white rather than an inverted dark theme.

## Typography

| Role | Face | Use |
| --- | --- | --- |
| Display | Geist Sans, semibold | Page titles, section headings, project names |
| Body | Geist Sans, regular | All prose and UI |
| Mono | Geist Mono | Metadata, labels, tags, dates, stack chips, pipeline stages |

Two families rather than three. Hierarchy comes from weight and tracking rather than a change of family, which keeps the page coherent and cuts font payload, the largest single contributor to LCP.

Loaded via `next/font/google` with `display: swap` and automatic fallback metric adjustment, so font swap costs zero CLS (measured: 0 on every audited route).

### Scale

Fluid, `clamp()`-based, so there are no breakpoint jumps.

| Token | Range | Use |
| --- | --- | --- |
| `text-display` | 2.5 to 5.5rem | Home hero only |
| `text-h1` | 2 to 3.5rem | Page titles |
| `text-h2` | 1.5 to 2.25rem | Section headings |
| `text-h3` | 1.15 to 1.4rem | Card and entry titles |
| `text-lead` | 1.05 to 1.25rem | Introductory paragraphs |
| `text-meta` | 0.75rem, uppercase, 0.08em tracking | The `label` utility |

A geometric sans at display size needs negative tracking to avoid looking loose, hence the tighter letter-spacing on the larger steps.

`text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

## Layout

- Container: `max-width: 1800px`, padding from `1.25rem` up to `5rem` at `xl`. Content runs close to the viewport edges rather than sitting in a narrow centred column.
- Prose blocks keep their own narrower cap for readable line length. Wide layout does not mean wide paragraphs.
- Sticky asides on case-study and about pages at `lg` and above, offset to clear the fixed header.
- `scroll-padding-top: 6rem` so anchor targets clear the header.

Breakpoints are Tailwind defaults. The primary nav switches to a dialog menu below `lg`.

## Radii, borders, shadows

Radii are tight (2/4/6/10/14px) because instruments have tight corners. Structure comes from hairline borders, not shadows. The only shadow on the site is on the copy-confirmation toast, where elevation is genuinely the message.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | UI state changes |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals and entrances |

Durations: 140ms for hover and colour, 220ms for UI, 620ms for reveals, 3.2s for the hero's continuous flow loop.

### Rules

1. **Motion never gates content.** `Reveal` renders visible by default; the hidden state is scoped to `.js`, applied by the pre-paint script. No JavaScript, failed hydration, or a dead observer all degrade to fully visible content. A 1.6s timeout is a further backstop. Do not simplify this into a plain `opacity: 0` initial state; that regression left an entire section invisible once already.
2. **Everything degrades under `prefers-reduced-motion`.** A global rule collapses animation and transition durations, and `Reveal` opts out of hiding entirely.
3. **Transform and opacity only.** Nothing animates a property that triggers layout.
4. **Off-screen work stops.** The hero visualisation pauses via `animation-play-state` when scrolled out of view or when the tab is hidden.
5. **No scroll hijacking**, and no scroll-linked narrative that blocks navigation.
6. **Numbers are stated plainly, never animated.**

## Signature visualisation

`src/components/signature-visual.tsx` draws the honeypot triage pipeline: concurrent attacker sessions on the left, the enrichment stage in the middle, risk lanes on the right.

Constraints it satisfies:

- **Purposeful.** It depicts the real architecture, not decoration.
- **Honest.** No counts, no fabricated events, nothing implying live traffic. The caption states outright that it is architecture rather than a data feed.
- **Cheap.** Pure SVG and CSS, one `stroke-dashoffset` animation. No canvas, no WebGL, no particle system, no rAF loop.
- **Accessible.** Marked `aria-hidden`, because every fact it depicts is also rendered as text beside it. It needs no interaction, so it works without a mouse.
- **Degradable.** Reduced motion leaves a complete, readable static diagram.

## Components

| Component | Notes |
| --- | --- |
| `SiteHeader` | Fixed, backdrop blur, scroll progress, active nav via `aria-current` |
| `CommandPalette` | Native `<dialog>`, combobox and listbox pattern; an accelerator, never the only path |
| `ScrollProgress` | rAF-coalesced passive listener writing `transform` directly, so React never re-renders on scroll |
| `Reveal` | CSS-first scroll reveal, visible by default |
| `SignatureVisual` | See above |
| `PipelineDiagram` | Architecture drawn from typed stage data, used instead of fabricated screenshots |
| `ProjectCard` | Stretched-link card; `headingLevel` prop keeps heading order valid per context |
| `Tag`, `SectionHeading`, `PageHeader`, `Container`, `Section` | Layout and typographic primitives |

## Accessibility rules

- Focus is always visible: a 2px `--focus` outline with 2px offset, never removed.
- Native `<dialog>` for all modals, so focus trapping, Escape and focus restoration come from the platform.
- Headings never skip levels.
- Icon-only buttons carry `sr-only` text; decorative icons are `aria-hidden`.
- External links get `rel="noopener noreferrer"` and an `sr-only` note that they open in a new tab.
- Touch targets are at least 40 by 40px.
- No information is conveyed by colour alone. Severity lanes carry text labels.

## House style

No em dashes in visitor-facing copy. En dashes are fine in numeric ranges such as `Sep 2025 – Jun 2026`. Enforced by `e2e/content.spec.ts`, which walks rendered text on every route.

## Anti-patterns

Do not introduce: purple gradients, generic SaaS landing layouts, matrix rain, neon green, glitch effects, fake terminal output, skill percentage bars, large blurred blobs, heavy glassmorphism, floating icon clouds, gratuitous 3D, particle systems, stock cybersecurity photography, animations that delay navigation, scroll hijacking, custom cursors that harm usability, hover-only information, or fabricated live data, counters and activity feeds.
