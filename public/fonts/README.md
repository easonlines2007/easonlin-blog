# Site typography

## Cross-platform display fonts

The two fixed wordmarks (`Eason's blog` and `Eason Lin`) are SVG outlines made
from the locally installed Michelangelus Italic. They contain no font file and
inherit the text color through `currentColor`, including in dark mode. Their text
labels remain in the document for accessibility and search.

Other display text uses self-hosted **Baskervville Regular** for Latin and
**Noto Serif SC Regular** for Chinese, aiming for the light serif appearance of
the reference Mac's Michelangelus / Songti SC combination. The fonts are served
from `editorial/`; their OFL licenses are included there. Chinese glyphs use
the Google Fonts Unicode-range partitions so browsers fetch only needed parts.
The declarations are in `src/styles/editorial-fonts.css`. Body text retains
the system sans-serif stack.

Sources:

- https://github.com/google/fonts/tree/main/ofl/baskervville
- https://github.com/google/fonts/tree/main/ofl/notoserifsc

## Previous local-font experiment

The previous newspaper experiment used **Michelangelus Regular / Italic** when installed
on the visitor's device. It falls back to Baskerville / Georgia for Latin and
Songti / available CJK serif fonts for Chinese. Download Michelangelus from
<https://www.microsoft.com/en-us/download/details.aspx?id=108856> and install it
locally to see the exact typeface. The supplied EULA grants local installation
and use but no redistribution rights, so this repository does not include or
serve its font files. The CSS only uses `local()` sources.

The original handwritten fonts remain available for reverting the experiment:

- **LXGW Marker Gothic Regular**: the complete font, converted losslessly from
  the official TTF to WOFF2. It retains all 15,288 mapped Unicode characters.
  Source: <https://github.com/lxgw/LxgwMarkerGothic>.
  License: [SIL Open Font License 1.1](LXGW-Marker-Gothic-OFL.txt).
- **Schoolbell Regular**: the complete font, converted losslessly from the
  Google Fonts TTF to WOFF2. It retains all 227 mapped Unicode characters.
  Source: <https://github.com/google/fonts/tree/main/apache/schoolbell>.
  License: [Apache License 2.0](Schoolbell-LICENSE.txt).

The handwritten fonts are served from this website, so typography does not depend on
an external font CDN. Their regular weight is 400; display styles should
use that weight to preserve the original drawn shapes.
