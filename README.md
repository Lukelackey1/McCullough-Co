# McCullough & Company — Website (Alpha)

Static marketing site for McCullough & Company, a bookkeeping, tax preparation, and advisory
firm founded by J.D. McCullough, Jr. Content is sourced from the firm's informational sheet,
mailer card, and FAQ document.

## Stack

Plain HTML/CSS/JS — no build step.

## Local preview

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

```
index.html         Single-page site: hero, services, approach, values, about, FAQ, contact
css/styles.css     All styling
js/main.js         Hero flyover reel, mobile nav, accordions, service detail modal
images/            Logo (small + banner), founder headshot, hero still
videos/            Hero flyover clips — see videos/README.md for specs
```

## Deploying

The site is served by **GitHub Pages** from the root of `main`:

**https://lukelackey1.github.io/McCullough-Co/**

No build step and no workflow file — Pages is configured in the repo's GitHub
settings, not in this repo. Any push to `main` goes live within about a minute,
so **`main` is production**. There is no staging environment; preview locally
before pushing.

## Brand palette

Both accents are sampled from the original `images/logo-banner.png` — don't
eyeball them. An earlier version of this site used `#c9b77c`, a yellowed
mis-sample of the sage, which read as muddy gold against the cream sections.

| Token | Value | Use |
| --- | --- | --- |
| `--navy` | `#344a66` | Backgrounds, headings, and every accent on cream/white |
| `--sage` | `#d0db96` | Accents on navy only — hero, nav, buttons, modal header |
| `--sage-deep` | `#b3bd78` | Deeper sage from the logo's phone pill; currently unused |
| `--navy-deep` | `#243347` | Footer only — `--navy` at 21% lightness, same hue |

Sage is the only accent color, and it belongs on navy. On light backgrounds the
accent is navy instead — sage goes muddy on warm light.

## Logo files

`images/logo-lockup.svg` is the live logo, used in both the header and the
footer. It was traced from the original PNGs, so it is resolution-independent
and stays sharp on retina screens where the old raster art went soft. It is
transparent and draws its own white/sage, so it sits on any navy background.

`images/logo-banner.svg` is the full banner lockup (wordmark, phone pill, and
address on a navy plate). Nothing on the site uses it — it is kept as a vector
master for print, email signatures, and social. The two source PNGs are kept as
the colour reference and as a fallback for tools that cannot take SVG.

Neither SVG references a font: the letterforms are outlined paths, so they
render identically everywhere and need no webfont to load.

Sections alternate navy and warm white: hero and the strip below it, Approach,
About, and Contact are
`.section-navy`; Services, Values, and FAQ are plain `.section`. That puts about
60% of the page on navy. `.section-navy` inverts the type but leaves nested cards
alone, since they keep their own light fill. A `.section-alt` class is still
defined for a cream band (`--cream`), but nothing uses it right now.

The footer uses `--navy-deep`. Contact is the one navy section that meets
another navy, so instead of a hard step it carries a vertical gradient: flat
`--navy` through its top 45%, then a ramp down to `--navy-deep` at the bottom
edge, landing exactly on the footer's fill. The footer's old light `border-top`
was dropped with it — against a matching color it was the only visible seam.
The other navy sections stay flat, since they border cream where the hard edge
is the point. Heads up: `--navy-dark` is still defined as an exact duplicate of
`--navy`, so it does not darken anything.

Note that `--white` (`#f5efe0`) is the warm page background *and* the type color
on navy, so cards use `--surface` (`#fdfbf6`) instead — a `--white` card on a
plain section would be invisible against it.

## Outstanding for launch (alpha placeholders)

- **Hero flyover footage** — the hero plays a reel of aerial clips from `videos/`, listed in
  `HERO_CLIPS` at the top of `js/main.js`. No clips are committed yet, so the hero currently
  falls back to the still photo. See [videos/README.md](videos/README.md).
- **Domain** — `mcculloughandco.com` is not connected; the site is still on the default
  `github.io` URL. Pointing a custom domain at Pages takes a `CNAME` file plus DNS records.
  Note GitHub caps individual files at 100MB and Pages sites at 1GB, so if the flyover
  footage is large it should be hosted off-repo and referenced by URL.
- **Contact form** — not built for alpha; the site currently routes visitors to the
  [cal.com booking link](https://cal.com/precisionwithjd), phone, and email instead.
