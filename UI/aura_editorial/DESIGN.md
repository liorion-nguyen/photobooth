---
name: Aura Editorial
colors:
  surface: '#fef7ff'
  surface-dim: '#ded7e4'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f1fe'
  surface-container: '#f3ebf8'
  surface-container-high: '#ede5f3'
  surface-container-highest: '#e7e0ed'
  on-surface: '#1d1a23'
  on-surface-variant: '#494454'
  inverse-surface: '#322f39'
  inverse-on-surface: '#f5eefb'
  outline: '#7b7486'
  outline-variant: '#cbc3d7'
  surface-tint: '#6d3bd7'
  primary: '#6b38d4'
  on-primary: '#ffffff'
  primary-container: '#8455ef'
  on-primary-container: '#fffbff'
  inverse-primary: '#d0bcff'
  secondary: '#7a580f'
  on-secondary: '#ffffff'
  secondary-container: '#ffd07d'
  on-secondary-container: '#79570e'
  tertiary: '#b10e6b'
  on-tertiary: '#ffffff'
  tertiary-container: '#d23284'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#ffdea8'
  secondary-fixed-dim: '#edc06e'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#fef7ff'
  on-background: '#1d1a23'
  surface-variant: '#e7e0ed'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-desktop: 64px
  margin-mobile: 24px
  stack-lg: 80px
  stack-md: 48px
  stack-sm: 24px
---

## Brand & Style

This design system is built for a premium AI Photobooth platform that positions technology as an art form. It blends the high-end editorial feel of a fashion magazine with the precision of modern software aesthetics (Apple, Framer, Linear). 

The visual narrative is "Technological Elegance"—where advanced AI features are presented through a lens of sophisticated minimalism and tactile luxury. 

**Core Principles:**
- **Curated Spacing:** Emphasize generous whitespace to let content breathe and feel expensive.
- **Precision Glassmorphism:** Use subtle backdrop blurs and micro-borders to create depth without clutter.
- **Editorial Contrast:** High-contrast typography pairings (Serif for emotion, Sans-serif for utility) to guide the user's eye through a narrative flow.
- **Soft Tactility:** High-radius corners and organic shadow casting to make digital elements feel like physical objects in a studio.

## Colors

The palette is anchored by a warm, paper-like off-white foundation (`#FAF9F7`) that avoids the sterile coldness of pure white. 

- **Primary & Accent:** The AI energy is represented by a vibrant Purple-to-Pink gradient. This is used sparingly for high-impact actions and "AI-active" states.
- **Soft Gold:** Used as a tertiary highlight for premium status indicators, "Pro" features, or refined celebratory moments.
- **Neutrals:** Text remains deep and legible with a primary black (`#111111`) and a muted secondary grey (`#666666`) for metadata and descriptions. 
- **Borders:** Extremely thin, low-opacity borders ensure a "frameless" look, relying on subtle tonal shifts rather than harsh lines.

## Typography

This design system utilizes a high-contrast typographic pairing to achieve its editorial tone.

- **Playfair Display:** Employed for large-scale headers and evocative titles. It should be used to tell the "story" of the photo. Ensure large headings use the tighter letter-spacing defined in the tokens.
- **Inter:** Used for all functional UI, body copy, and data. It provides a grounded, modern counterweight to the serif’s classicism.
- **Hierarchy:** Use the `label-caps` style for section overlines or small categories to provide an organized, "cataloged" feel.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid hybrid grid**. Content is contained within a 1280px max-width container for readability, while background elements and glass containers can bleed to the edges of the viewport in some contexts.

- **Grid:** 12-column desktop grid with wide 32px gutters to maintain the airy, magazine-like feel.
- **Vertical Rhythm:** Sections are separated by significant "stack" spacing (`80px+`) to prevent the UI from feeling crowded.
- **Mobile:** On mobile, margins reduce to 24px and the grid collapses to a single column, but the generous vertical padding remains to keep the premium feel intact.

## Elevation & Depth

Hierarchy is established through "The Glass Stack"—a combination of tonal layering and soft backdrop blurs.

- **Surface Levels:** 
  1. **Base:** `#FAF9F7` (Background).
  2. **Raised:** `#F4F1EC` (Secondary containers with no shadow).
  3. **Floating:** Glass containers (White at 60-80% opacity) with a `20px` backdrop blur and a very soft, large-radius shadow (Color: `#000`, Opacity: `0.03`, Blur: `40px`).
- **Interaction:** On hover, floating elements should subtly lift (shadow opacity increases to `0.06`) and scale by `1.02x` to mimic a physical object being picked up.

## Shapes

The design system uses exaggerated rounded corners to soften the high-tech AI nature of the product.

- **Cards & Primary Containers:** Use a large `32px` radius to create a friendly, modern "frame" for photos.
- **Interactive Elements:** Buttons use a more precise `12px` radius, providing a clear distinction between "containers" and "actions."
- **Image Masks:** AI-generated portraits should always inherit the container's `32px` radius or be perfectly circular for avatars.

## Components

### Buttons
- **Primary:** Purple-to-Pink gradient background, white Inter medium text. Subtle glow effect on hover.
- **Secondary:** Off-white background, `#111111` text, subtle `1px` border of `rgba(0,0,0,0.06)`.
- **Ghost:** No background, Inter medium text with an arrow icon that slides `4px` on hover.

### Cards (The "Editorial Frame")
- Glassmorphic style with a `32px` corner radius. 
- Includes a subtle `1px` inner highlight border (white, 40% opacity) on the top edge to simulate light catching the glass.

### Input Fields
- Background: `#F4F1EC`. 
- Focus state: Border transitions to the Purple accent, and the background remains warm white to ensure the text is legible.

### Chips & Badges
- Used for "AI Styles" or "Categories." 
- Pill-shaped with a light Purple tint background (`#F5F3FF`) and Purple text. 

### AI Interaction States
- Elements currently being processed by AI should feature a "shimmer" gradient animation using the accent colors, moving across the surface of the component.