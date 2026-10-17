# Site typography

The newspaper experiment uses **Michelangelus Regular / Italic** when installed
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
