# Amrapali Makeover — Design System Specification

## Visual Direction: Luxury Indian Bridal / Editorial Beauty
The visual direction captures warmth, prestige, and quiet luxury. It deliberately avoids high-gloss neon gradients, excessive gold bling, cluttered salon layouts, and overused glassmorphism.

---

## 1. Color Palette Tokens

| Token Name | CSS Custom Property | HEX Value | Semantic Usage | Contrast Ratio & WCAG Status |
|---|---|---|---|---|
| **Burgundy** | `--color-burgundy` | `#4B1728` | Primary brand anchor, key CTA buttons, main headings | 13.66:1 on Ivory (AAA), 11.76:1 on Blush (AAA) |
| **Dark Plum** | `--color-plum` | `#2A1420` | High-contrast dark backgrounds, deepest headline text | 16.27:1 on Ivory (AAA) |
| **Warm Ivory** | `--color-ivory` | `#FBF8F4` | Primary canvas/page background, tactile warmth | Canvas Base |
| **Soft Blush** | `--color-blush` | `#F2E5E2` | Secondary background, subtle card fills, soft hover states | Surface Rhythm |
| **Muted Rose** | `--color-rose` | `#C58F91` | Soft accent, icons, border highlights, subtle dividers | 2.57:1 on Ivory (Non-text decorative only) |
| **Champagne Gold** | `--color-gold` | `#B99561` | Restrained metallic accent, focus rings, badge trim | 6.18:1 on Plum (AA/AAA), 2.63:1 on Ivory (Restricted to decorative/accents) |
| **Ink** | `--color-ink` | `#24191B` | Primary body typography, subheadings | 16.13:1 on Ivory (AAA), 13.89:1 on Blush (AAA) |
| **Muted Text (Ivory)** | `--color-ink-soft` | `#74686A` | Secondary descriptions, captions on Ivory surfaces | 5.05:1 on Ivory (AA normal, AAA large) |
| **Muted Text (Blush)** | `--color-ink-muted` | `#524245` | High-contrast secondary text for Soft Blush surfaces | 6.20:1 on Blush (AAA normal & large) |
| **Border Subtle** | `--color-border-subtle` | `#EADBD7` | Standard card and section dividing lines | Non-text structural |
| **Border Warm** | `--color-border-warm` | `#DFC8C2` | Active and input border states | Non-text structural |

*Rules:*
- *Champagne Gold (`#B99561`): Strictly decorative and accent. Never used for normal body copy on light backgrounds.*
- *Soft Blush (`#F2E5E2`): Any normal-sized body or descriptive text placed on Blush backgrounds MUST use `#524245` (6.20:1, AAA) to prevent contrast failure.*

---

## 2. Typography Hierarchy

### Typefaces
- **English Display**: `Cormorant Garamond` (Primary serif for headlines and hero statements)
- **English Sans**: `Plus Jakarta Sans` (Clean, modern sans-serif for body copy, buttons, and form labels)
- **Devanagari Display (Hindi / Marathi)**: `Rozha One` / `Noto Serif Devanagari`
- **Devanagari Body (Hindi / Marathi)**: `Noto Sans Devanagari`

### Scale
- **Display / H1**: 48px / 3.0rem (Tracking -0.02em, line-height 1.15)
- **Section / H2**: 32px / 2.0rem (Tracking -0.01em, line-height 1.25)
- **Subsection / H3**: 24px / 1.5rem (line-height 1.35)
- **Card Title / H4**: 20px / 1.25rem (line-height 1.4)
- **Body Regular**: 16px / 1.0rem (line-height 1.6)
- **Body Small / Captions**: 14px / 0.875rem (line-height 1.5)
- **Labels / Badges**: 12px / 0.75rem (Uppercase, Tracking +0.05em to +0.1em)

---

## 3. UI Primitives

### Button Primitives (`src/components/ui/Button.tsx`)
- **Primary**: Burgundy background (`#4B1728`), Warm Ivory text (`#FBF8F4`), subtle hover lift, focus ring in Champagne Gold (`#B99561`).
- **Secondary**: Transparent background, Burgundy border, Burgundy text, Soft Blush hover fill.
- **Gold Accent**: Champagne Gold background (`#B99561`), Dark Plum text (`#1E0D16`), soft gold glow shadow.
- **Outline**: White/Ivory background, subtle border (`#DFC8C2`), Ink text.
- **Ghost**: Transparent background, text Ink / Burgundy, soft blush hover.
- **Sizes**: `sm`, `md`, `lg`.
- **States**: `default`, `hover`, `active`, `focus-visible`, `disabled`, `isLoading` (with spinner).

### Card Primitives (`src/components/ui/Card.tsx`)
- **Default**: Clean white surface, `#EADBD7` border, subtle elevation.
- **Subtle**: Soft Blush fill (`#F2E5E2`), warm border.
- **Elevated**: White surface with soft editorial shadow (`0 8px 30px -6px rgba(42,20,32,0.08)`).
- **Burgundy**: Rich Burgundy surface (`#4B1728`), warm ivory text, gold accent badge.
- **Plum**: Deep Plum surface (`#2A1420`), warm ivory text.

### Form Primitives (`src/components/ui/Input.tsx`, `Textarea.tsx`, `Select.tsx`)
- Consistent uppercase labels with tracking.
- Accessible ARIA associations (`aria-invalid`, `aria-describedby` linking to error or helper texts).
- 2px Champagne Gold focus rings with 2px offset.
- Clear error states in muted burgundy (`#942938`).

---

## 4. Accessibility & Motion Rules
1. **WCAG AA Compliance**: All text combinations meet or exceed 4.5:1 for body and 3:1 for large display.
2. **Reduced Motion**: Automatically collapses all durations to `0.01ms` when `prefers-reduced-motion: reduce` is active.
3. **No Scroll Hijacking**: Scrolling is native smooth scrolling without forced snapping or delayed momentum.
