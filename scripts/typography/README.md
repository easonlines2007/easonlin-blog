# Typography assets

Run `swift scripts/typography/export-wordmarks.swift` from the repository root
on a Mac with Michelangelus Italic installed to regenerate the two fixed SVG
wordmarks in `src/assets/wordmarks/`. The exporter uses CoreText shaping and preserves the existing
letter spacing (−0.02em for the brand, −0.025em for the name). Do not distribute
the proprietary font files.

The display web fonts are Baskervville 400 (normal and italic) and Noto Serif SC
400, fetched from Google Fonts and hosted locally. `src/styles/editorial-fonts.css`
retains the upstream Unicode ranges; `public/fonts/editorial/` contains all
referenced WOFF2 files and both OFL licenses. No external font requests are made.
