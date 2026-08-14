# McCullough & Company — Website (Alpha)

Static marketing site for McCullough & Company, a bookkeeping, tax preparation, and advisory
firm founded by J.D. McCullough, Jr. Content is sourced from the firm's informational sheet,
mailer card, and FAQ document.

## Stack

Plain HTML/CSS/JS — no build step. Easy to preview locally and deploy to GitHub Pages.

## Local preview

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

```
index.html        Single-page site: hero, services, approach, values, about, FAQ, contact
css/styles.css     All styling
js/main.js         Mobile nav + FAQ accordion behavior
```

## Outstanding for launch (alpha placeholders)

- **Logo / brand graphics** — site currently uses a text wordmark; swap in the real logo file.
- **Founder photo** — `about-photo` is a placeholder initial; replace with J.D.'s headshot.
- **Domain** — not yet connected; deploy target (GitHub Pages / custom domain) TBD.
- **Contact form** — not built for alpha; the site currently routes visitors to the
  [cal.com booking link](https://cal.com/precisionwithjd), phone, and email instead.
