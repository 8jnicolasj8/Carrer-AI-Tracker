# Landing page (`docs/`)

Static, single-page landing for **Career AI Tracker**, published with GitHub
Pages from the `main` branch and the `/docs` folder. HTML, CSS and JavaScript
only: **no dependencies and no build step**. English and Spanish with a
switcher.

## Files

| Path | What it is |
|---|---|
| `index.html` | The page. Semantic HTML, all text referenced by `data-i18n` keys. |
| `config.js` | The only source of `REPO_URL`, `RELEASE_AVAILABLE` and `VERSION`. |
| `assets/css/styles.css` | Design tokens (colors, spacing, type) and all styles. |
| `assets/js/i18n.js` | Every string, in English and Spanish. |
| `assets/js/main.js` | Language switcher, config wiring, mobile menu, reveal. |
| `assets/img/` | Own SVG/CSS artwork, favicon and the social image. |
| `404.html` | Not-found page. |
| `robots.txt`, `.nojekyll` | GitHub Pages helpers. |

## Publish on GitHub Pages

1. Push the repo to GitHub.
2. In the repo: **Settings > Pages**.
3. **Source**: *Deploy from a branch*. **Branch**: `main`, **folder**: `/docs`.
4. Save. The site goes live at
   `https://<user>.github.io/<repo>/` (may take a minute).

## Configure

Open `docs/config.js` and edit:

- **`REPO_URL`**: replace the example
  (`https://github.com/your-username/career-ai-tracker`) with the real
  repository URL. Every "GitHub", "Issues", "MIT license" and "Build from
  source" link uses it.
- **`RELEASE_AVAILABLE`**: leave `false` until there is a build in GitHub
  Releases. While it is `false`, the primary button says **"Coming soon"** and
  points to the repository. Set it to `true` once a release exists; the button
  then says **"Download for Windows"** and points to
  `REPO_URL/releases/latest`.
- **`VERSION`**: the string shown in the footer.

Also update the placeholder absolute URLs after you know the final domain:

- `docs/robots.txt` (sitemap URL, if you add one).
- The `og:image` / `twitter:image` meta tags in `index.html` if you want
  absolute URLs for social cards.

## Replace the concept previews

The hero and the "Screenshots" section use **concept previews** built with a
fictional club (*Atlético Meridian*) and fictional players. They are labeled
"Concept preview" on purpose: the product does not have real captures yet.
When you have real screenshots (with fictional data), replace the files in
`docs/assets/img/` keeping the same names, or update the `src` attributes in
`index.html`, and remove the "Concept preview" label from `assets/js/i18n.js`
(the `shots.tag` key).

## Design tokens

The colors, spacing and type scale live as CSS variables in `:root` inside
`assets/css/styles.css`. They are meant to be shared with the desktop app so
both stay visually consistent. To change the accent color, edit `--accent` and
`--accent-strong` in that one place.

## Notes

- Double-clicking `index.html` works (no server needed). Scripts are classic
  (not ES modules) so `file://` is supported.
- No external requests: no fonts, images, analytics or trackers from other
  domains.
- No real club crests, player names or EA/FIFA logos are used.
