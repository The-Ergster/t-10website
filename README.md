# T-10 Website

> Hello,<br>
> I made this site<br>
> I am probably long gone<br>
> I made AI write a readme cause I'm too lazy to write and I don't know .md formatting<br>
> figure out stuff<br>
> If not, well uhhh, google

## T-10 Robotics Website

This is the website for the T-10 Robotics team. It is a simple static site built with plain HTML, CSS, and JavaScript.

## Quick start

1. Open the project folder in VS Code.
2. Edit the HTML pages in the root folder, the styling in `css/style.css`, and the shared behavior in `js/script.js`.
3. Preview the site locally with a basic web server.

### Local preview

From the project root, run:

thingy for the thingy in the run menu in vs code<br>
just google it if you don't know<br>
you can also use a browser<br>
then open:

```text
http://localhost:8000
```

## Project structure

- `index.html` — home page
- `team.html` — team roster
- `outreach.html` — outreach and event gallery
- `videos.html` — videos page
- `contact.html` — contact form page
- `templates/page-template.html` — starting point for a new page; it is not deployed
- `css/style.css` — shared styling
- `js/script.js` — shared site behavior, nav toggle, form handling, and image carousels
- `worker.js` — Cloudflare Worker entrypoint for static assets and the contact API
- `functions/api/contact.js` — contact form email handler
- `wrangler.jsonc` — Worker and static asset configuration
- `package.json` — Resend SDK and Wrangler dependencies
- `images/` — site images and outreach media

## How to edit the site

### HTML pages

Each page is a standalone HTML file. If you want to add or edit text, find the section in the page and change the content between the tags.

Example:

```html
<h1>Our team</h1>
<p>Some text here.</p>
```

### Add a new page

1. Copy `templates/page-template.html` into the project root and give it a new name, such as `events.html`.
2. Change the `<title>`, hero eyebrow, heading, intro, and the content in the main section.
3. Add images under `images/` if the page needs them. Use paths such as `images/events/photo.jpg`.
4. Add the new page to the `nav-links` list in every root-level HTML page if it should appear in the navigation. Keep the link text and URL the same everywhere.
5. Preview the new page locally, then deploy with the normal Cloudflare command.

The template lives in `templates/`, which Wrangler excludes from the deployed assets. It is intended to be copied into the project root. If you want the template itself online, remove `"templates/**"` from the `exclude` list in `wrangler.jsonc`, then deploy again.

### Add a YouTube video

1. Open the YouTube video and copy its video ID. For `https://www.youtube.com/watch?v=VIDEO_ID`, the ID is the value after `v=`.
2. Open `videos.html` and copy an existing `video-card` block.
3. Replace the heading and the iframe `title` with the video title.
4. Replace the iframe `src` with `https://www.youtube-nocookie.com/embed/VIDEO_ID`.
5. Update the video number and category if needed. Remove a matching “Coming soon” card when the new video fills that slot.

Example:

```html
<div class="video-thumb">
	<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
		title="Video title" loading="lazy"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
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

## Contact form and deployment

The contact form is handled by `functions/api/contact.js` through the Cloudflare Worker. Email configuration is not documented here yet; do not commit email credentials or API keys to the repository.

For the Git deployment settings shown in the dashboard, use the repository root as the root directory, set the build command to `npm install`, and set the deploy command to:

```text
npx wrangler deploy
```

For local Worker testing, use `npx wrangler dev`, or deploy to Cloudflare and test there.

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
