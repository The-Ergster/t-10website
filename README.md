# T-10 Robotics Website

This is the website for the T-10 Robotics team at Needham High School.

## Project structure

- `index.html` — home page
- `team.html` — team roster
- `outreach.html` — outreach and event gallery
- `videos.html` — videos page
- `contact.html` — contact page with direct email links
- `css/style.css` — shared styling
- `js/script.js` — shared site behavior and image carousels
- `worker.js` — Cloudflare Worker entrypoint for static assets
- `sitemap.xml` — published page URLs for search engines
- `robots.txt` — crawler rules
- `wrangler.jsonc` — Cloudflare Worker configuration
- `package.json` — Wrangler dependency
- `images/` — site images and media

## Local preview

From the project root, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deployment

From the project root:

```bash
npx wrangler deploy
```

## Editing notes

- Update page content directly in the HTML files.
- Shared styling lives in `css/style.css`.
- Shared behavior lives in `js/script.js`.
- Keep the contact page as direct `mailto:` links rather than a form-based email flow.
