# T-10 Robotics Website

- This is the website for the T-10 Robotics team at Needham High School.
- Made with AI cause I was too lazy to do it
- blame your software manager not me
- unless it is me
- anyway
- try and fix stuff
- don't mess with cloudflare stuff unless needed
- check example page for more info
- comments are everywhere


## Project structure

This site is a static HTML/CSS/JS website. There is no app framework or build step. The Cloudflare Worker serves files from the grouped folders and preserves the existing public URLs.

- `index.html` — home page; kept at the project root
- `pages/` — team, outreach, videos, and contact pages
- `pages/templates/` — starter template for new pages
- `assets/css/` — shared site styling
- `assets/js/` — mobile nav, footer year, image fallbacks, and gallery carousels
- `assets/images/` — logos, favicons, team photos, and gallery folders
- `site/` — `robots.txt`, `sitemap.xml`, and the domain verification file
- `tools/` — scripts used to maintain the site, including gallery manifest generation
- `worker.js` — Cloudflare Worker entrypoint for static asset handling
- `wrangler.jsonc` — Cloudflare Worker configuration
- `package.json` — project metadata and Wrangler dependency
- `.assetsignore` — files excluded from the Cloudflare static asset upload

## How to work on the site

### 1. Edit pages directly in HTML

Most content changes are edits to a page in `pages/`:

- Update text, headings, and section content directly in the HTML files.
- Keep the structure consistent with the other pages.
- For new pages, start from `pages/templates/page-template.html` and save the new HTML file in `pages/`.

A typical page includes:

- the standard `<head>` metadata
- the header/nav
- a hero section
- one or more content sections
- the footer
- the shared `/js/script.js` include at the end of the body

### 2. Use the page template for new pages

When creating a new page:

1. Open `pages/templates/page-template.html`.
2. Copy its structure into a new page file under `pages/`.
3. Replace the title, meta description, nav content, hero copy, and section content.
4. Add the new page to the main navigation if it should be publicly linked.
5. Use the existing root URLs in page markup (for example, `/css/style.css`, `/js/script.js`, and `/images/logo.png`). The Worker maps these URLs to files under `assets/`.

### 3. Keep shared styling in one place

Most visual changes should be made in `assets/css/style.css` instead of editing each page separately.

Good reasons to edit `style.css`:

- colors, spacing, typography, buttons, layout sections
- responsive behavior
- hero/banner visuals
- card, grid, and panel styles
- reusable components used across multiple pages

Only make page-specific tweaks in the HTML file when a section is unique to one page.

### 4. Keep shared behavior in one script

The shared JavaScript in `assets/js/script.js` is used by every page.

It handles:

- mobile menu toggle
- footer year injection
- broken-image fallback blocks
- image carousel behavior for pages with `.carousel` elements

If a change affects navigation, shared page behavior, or galleries across multiple pages, edit this file rather than duplicating logic in each page.

### 5. Manage images and galleries

The `assets/images/` folders contain the site media. Gallery pages rely on a `manifest.json` file in each gallery directory to tell the carousel which images to load.

When creating a new gallery:

- add the images to a dedicated folder under `assets/images/outreach/`
- make sure the folder has a `manifest.json` listing the files to display
- attach the carousel using the existing `.carousel` structure used elsewhere
- use descriptive alt text or labels where relevant

Regenerate every outreach manifest after adding or removing gallery images:

```bash
node tools/generate-manifests.js
```

## Local preview

From the project root, run the Worker locally so the existing page and asset URLs resolve through the same aliases used in deployment:

```bash
npx wrangler dev
```

Open the local URL printed by Wrangler. The Worker skips HTTPS redirection for localhost only.

The preview checks page layout, navigation, assets, and galleries before publishing.

## Deployment

Deploy this site through the Cloudflare project associated with it. Do not treat the repo root as the place to build or publish the site from; the site should be deployed through Cloudflare's project/worker setup instead.

This project uses Cloudflare Wrangler configuration in `wrangler.jsonc`, but the actual publish flow should happen through the Cloudflare project workflow rather than a local root-level build step.

## Common workflow

A typical edit cycle looks like this:

1. Open the relevant HTML file under `pages/`.
2. Update the text or structure for the content you want to change.
3. If the change is design-related, edit `assets/css/style.css`.
4. If the change affects shared interactions, edit `assets/js/script.js`.
5. Run a local preview with `npx wrangler dev`.
6. Check that links, images, and carousels still work.
7. Publish through the Cloudflare project workflow when the update is ready.

## Notes and caution

- Do not mess with Cloudflare stuff unless it is necessary.
- If something breaks in deployment or configuration, verify the worker config and static asset settings before changing anything unrelated.
- Check existing pages and templates before creating a new section, since the site is intentionally built from repeated patterns.
- Keep the contact page as direct `mailto:` links rather than a form-based email flow unless there is a clear reason to change it.

## Quick references

- New page template: `pages/templates/page-template.html`
- Shared styles: `assets/css/style.css`
- Shared logic: `assets/js/script.js`
- Images and galleries: `assets/images/`
- Local preview command: `npx wrangler dev`
- Deploy flow: publish through the Cloudflare project, not from the repo root

in worst worst case scenario or permissions problems you can reach out to me at Erg95@students.needham.k12.ma.us
or if I'm long gone: glasserelliot@gmail.com
