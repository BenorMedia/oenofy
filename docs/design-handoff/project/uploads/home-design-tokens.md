# Design Tokens — Luxury Wine Vendor

> Source: Canva design system screenshots. Values marked "TBD - confirm" were not legible/visible and should not be guessed in build.

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| `color-text-light` | `#fff6e7` | Text over images / dark backgrounds |
| `color-text-dark` | `#393839` | Text over white / light bg images |
| `color-bg-block` | `#eae6db` | Section/block background |
| `color-accent` | `#ceba9a` | Accent text |

---

## Typography

**Font families**
- Primary (titles): `Conso`
- Secondary (body/UI): `Montserrat`

### Home — Hero (Section 1)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Nav links (Conciergerie, Collection, Events, Contact us) | Montserrat | 14px | 400 | Sentence case | 0 | 1.5 | `#fff6e7` |
| Hero Title ("From Quiet Cellar / To Private Hands") | Conso | 56px | 400 (Conso always regular) | Uppercase | 0 | 1.15 | `#fff6e7` |
| Nav center icon (ring/logo mark) | SVG graphic — double ring | — | — | — | — | — | `#F4EFEA` (fill) |

### Home — Intro (Section 2)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Intro paragraph (mixed emphasis text) | Montserrat | 30px | 500 | Uppercase | 0 | 1.5 | `#393839` (single color — de-emphasized run is same color at ~60% opacity, not a separate token) |
| Bottom quote + signature ("To build every collection…", "Benjamin and Anastasiia") | N/A — delivered as image, one-off, not reused elsewhere | — | — | — | — | — | — |

> Bottom quote/signature is a one-off image asset — no font implementation needed, place directly.

### Home — Conciergerie (Section 3)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Title ("La Conciergerie") | Conso | 56px | 400 | Uppercase | 0 | 125% (70px) | `#fff6e7` |
| Subtitle / body copy | Montserrat | 16px | 400 | Sentence case | 0 | 180% (28.8px) | `#fff6e7` |
| Link ("Explore La Conciergerie →") | Montserrat | 14px | 500 | Sentence case | 0 | 1.5 | `#fff6e7` |

### Home — Quote (Section 4)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Quote text ("Alongside collections and private occasions…") | Montserrat | 24px | 500 | Sentence case | 0 | 1.25 | `#393839` |

### Home — Gallery Cards (Section 5)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Center card title ("Collection") | Conso | 56px (same as Hero title) | 400 | Uppercase | 0 | 1.15 | `#393839` |
| Center card link ("Discover →") | Montserrat | 14px | 500 | Sentence case | 0 | 1.5 | `#393839` |

### Home — Slider (Section 6)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Slider section title ("Where Wine Becomes Experience") | Conso | 56px (same as Hero title) | 400 | Uppercase | 0 | 1.15 | `#393839` |
| Slider card title (e.g. "Monaco - YMC") | Montserrat | 34px | 600 | Uppercase | 0 | 1.5 | Flips per card image: `#fff6e7` on dark card backgrounds, `#393839` on light card backgrounds |
| Slider card link ("More information →") | Montserrat | 14px | 500 | Sentence case | 0 | 1.5 | Flips per card image: `#393839` on light card backgrounds, `#fff6e7` on dark card backgrounds — color always paired with title above using matching flip |

> Note: "Yacht Club de Monaco" script wordmark + crossed-flags graphic is partner/client-provided artwork (external logo asset), not part of this site's type system — exclude from font tokens.

### Home — News (Section 7)

| Element | Font | Size | Weight | Case | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|---|---|
| Section title ("News") | Conso | 56px (same as Hero title) | 400 | Uppercase | 0 | 1.15 | `#393839` |
| Card title (e.g. "Discover Cyprus Wine") | Montserrat | 34px | 600 | Uppercase | 0 | 1.5 | `#ceba9a` (accent) |
| Card subtitle (e.g. "Where altitude meets rarity.") | Montserrat | 16px | 600 | Sentence case | 0 | 1.25 | `#393839` |
| Card paragraph | Montserrat | 16px | 400 | Sentence case | 0 | 1.25 | `#393839` |
| Card link ("Discover →") | Montserrat | 14px | 500 | Sentence case | 0 | 1.5 | `#393839` |

---

## Spacing

> Section-by-section — spacing varies per section, no single global scale confirmed yet.

| Token | Value |
|---|---|
| Base unit / default fallback | Every section has a custom spacing value; where not otherwise specified, default to `30px` |
| Nav padding | `24px 120px` |
| Nav gap between items | `120px` (flex `justify-between`, roughly even; 120px min gap) |
| Nav position | `fixed` to top |
| Hero height | `100vh` |
| Hero title alignment | centered |
| Hero background | video (not static image) |
| Intro padding-top | `160px` |
| Intro padding-bottom | `60px` |
| Conciergerie section height | `100vh` |
| Conciergerie content position | bottom-left aligned |
| Conciergerie padding-bottom | `220px` |
| Conciergerie padding-left | `120px` |
| Conciergerie background | video, dark overlay |
| Quote section height | `100vh` |
| Quote content alignment | top-left |
| Quote background | static image |
| Gallery cards padding (top/bottom) | `105px` |
| Gallery cards padding (left/right) | `10px` |
| Gallery cards gap | `15px` |
| Gallery center card padding-bottom | `150px` |
| Slider section padding (top/bottom) | `130px` |
| Slider card padding | `70px` |
| News section padding | `120px` |

---

## Components

### Navigation (Home Hero)
- Layout: 5-item horizontal bar — 2 links left, center circular icon mark, 2 links right
- Background: transparent, sits over hero video
- Padding: `24px 120px`
- Position: `fixed` top
- Icon mark: SVG, double concentric ring, fill `#F4EFEA`, 53×53 viewBox

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="53" height="53" viewBox="0 0 53 53" fill="none">
  <path d="M26.4598 0C14.6367 0 5.01855 11.8637 5.01855 26.46C5.01855 41.0563 14.6367 52.92 26.4598 52.92C38.2829 52.92 47.901 41.0428 47.901 26.46C47.901 11.8772 38.2829 0 26.4598 0ZM45.7502 26.4465C45.7502 39.8523 37.0925 50.7556 26.4598 50.7556C15.8271 50.7556 7.16944 39.8523 7.16944 26.4465C7.16944 13.0406 15.8271 2.13736 26.4598 2.13736C37.0925 2.13736 45.7502 13.0406 45.7502 26.4465Z" fill="#F4EFEA"/>
  <path d="M26.46 5.01855C11.8637 5.01855 0 14.6367 0 26.4598C0 38.2829 11.8773 47.9011 26.46 47.9011C41.0428 47.9011 52.92 38.2829 52.92 26.4598C52.92 14.6367 41.0563 5.01855 26.46 5.01855ZM50.7691 26.4463C50.7691 37.079 39.8659 45.7366 26.46 45.7366C13.0542 45.7366 2.15093 37.079 2.15093 26.4463C2.15093 15.8136 13.0542 7.15592 26.46 7.15592C39.8659 7.15592 50.7691 15.8136 50.7691 26.4463Z" fill="#F4EFEA"/>
</svg>
```

### Link Component (text + arrow)
> Reusable pattern — used for e.g. "Explore La Conciergerie →"
- Font: Montserrat
- Font size: `14px`
- Font weight: `500`
- Line-height: `1.5`
- Arrow: implemented as text character (`→`) where possible, not an icon/SVG

### Buttons
- Confirmed: **no buttons** in this design system

### Cards
3 card styles total in the design system:

1. **Gallery card** (3-up layout, Home)
   - Left & right cards: image only, no text
   - Center card: solid content, text + link, bottom-aligned with `150px` bottom padding
   - Gap between cards: `15px`

2. **Slider card**
   - Outer background: `#eae6db`
   - Outer padding: `70px`
   - Inner box: image background, text overlaid
     - Title: top-left
     - Link: bottom-left

3. **News card** (horizontal layout)
   - Image: left, size at implementer's discretion
   - Text: right — title, subtitle, paragraph, link stacked
   - No animation on this card

### Borders / Radius
- Confirmed: **no border-radius** used in this design system

---

*This file will be updated as additional section screenshots are provided.*
