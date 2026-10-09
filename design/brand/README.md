# Quidence logo

Stephen supplied `quidence-logo-source.svg` on October 8, 2026 and identified it as his creative design, drawing and vector conversion. This file preserves the supplied vector unchanged. It is the source of the display assets; the letter shapes have not been redrawn or substituted with a font.

Run `node scripts/build-brand-assets.cjs` to regenerate the transparent wordmarks, inline report vectors and magnifying-glass Q favicon. The source's navy group represents the background and counters; the display variants retain its white and mint foreground paths, including the letter holes, magnifying glass and graduation cap. A tighter viewBox removes outer whitespace without clipping the artwork.

Dark surfaces use the supplied off-white and mint. Light surfaces use the site's navy and darker teal to keep the small accent visible. Reports embed the light-surface SVG, so downloaded HTML and PDF previews display the logo offline. The site's English and Spanish interfaces share the same brand name and artwork.
