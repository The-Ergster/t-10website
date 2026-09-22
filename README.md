# T-10 Website

Hello,
I made this site
I am probably long gone
I made AI write a readme cause I'm too lazy to write and I don't know .md formatting
figure out stuff
If not, well uhhh, google




# T-10 Robotics Website

This is the website for the T-10 Robotics team. It is a simple static site built with plain HTML, CSS, and JavaScript.

## Quick start

1. Open the project folder in VS Code.
2. Edit the HTML pages in the root folder, the styling in `css/style.css`, and the shared behavior in `js/script.js`.
3. Preview the site locally with a basic web server.

### Local preview

From the project root, run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Project structure

- `index.html` — home page
- `team.html` — team roster
- `outreach.html` — outreach and event gallery
- `videos.html` — videos page
- `contact.html` — contact form page
- `css/style.css` — shared styling
- `js/script.js` — shared site behavior, nav toggle, form handling, and image carousels
- `functions/api/contact.js` — server-side contact form endpoint
- `images/` — site images and outreach media

## How to edit the site

### HTML pages

Each page is a standalone HTML file. If you want to add or edit text, find the section in the page and change the content between the tags.

Example:

```html
<h1>Our team</h1>
<p>Some text here.</p>
```

### CSS

Most styling lives in `css/style.css`. If you want to change colors, spacing, typography, layout, or button styles, edit that file.

### JavaScript

Shared behavior is handled in `js/script.js`. This file controls:

- mobile nav menu toggle
- dynamic footer year
- broken image fallback
- contact form submission
- image carousel behavior

If something is happening on every page, it is probably here.

## Contact form

The contact form posts to the serverless endpoint in `functions/api/contact.js`.

If you are testing the form locally, use a local hosting method that supports Cloudflare Pages functions, or deploy to your hosting environment and test there.

## Tips for future editors

- Keep changes small and focused.
- If a section appears on multiple pages, check whether it is in shared CSS or JS before duplicating code.
- Use existing class names instead of inventing totally new ones unless you also add matching styles.
- Preview changes in the browser before calling it done.
- If an image fails to load, the site will swap in a fallback block automatically.

## Common commands

```bash
# from the project root
python3 -m http.server 8000
```

## If you get stuck

Look at the existing files first. This project is intentionally simple, and most edits are just HTML/CSS/JS changes in one of the main files listed above.

If something is broken, check:

- the page file you changed
- `css/style.css`
- `js/script.js`
- the browser console for errors

That’s usually enough to fix most problems.
