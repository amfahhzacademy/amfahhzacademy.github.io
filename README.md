# AMFAHHZ Cambridge Academy website

Static website built with plain HTML, CSS and JavaScript. No framework and no build step.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `programs.html` | Programs (International, Local boards, Test prep) |
| `faculty.html` | Faculty / departments |
| `contact.html` | Contact + enquiry form |
| `thank-you.html` | Shown after the enquiry form is sent |
| `404.html` | "Page not found" page (GitHub Pages and Netlify use it automatically) |

## Folders

- `assets/css/style.css` holds all styles. Brand colours are at the top under `:root`.
- `assets/js/icons.js` holds the icon set used across the pages.
- `assets/js/main.js` runs the mobile menu, scroll animations and FAQ.
- `assets/img/logo.svg` is the full logo (icon + name). `assets/img/logo-mark.svg` is the icon on its own.
- `assets/img/photos/` holds all the website photos.
- Icons for every device:
  - `favicon.svg`: browser tab icon (Chrome, Edge, Firefox). A simplified, bolder version of the logo so it stays clear at 16px.
  - `favicon.ico`: 16, 32 and 48px versions for older browsers, Safari on Mac and Windows shortcuts.
  - `apple-touch-icon.png`: iPhone and iPad home screen (180px).
  - `site.webmanifest` + `assets/img/icons/`: Android home screen and "Install app" icons, including a "maskable" icon that Android can crop into a circle or rounded square.
  - `_headers` tells Netlify to send the manifest with the right file type.

## Publish free on Netlify

1. Go to https://app.netlify.com/drop and sign in (free account).
2. Drag this whole folder onto the page.
3. Netlify gives you a free address like `your-site.netlify.app`. You can rename it under
   **Site configuration → Change site name** (e.g. `amfahhz-academy.netlify.app`).

## SEO: after you publish

The site address is set to `https://amfahhzacademy.github.io` (GitHub Pages). It is used in the canonical links,
social-share tags, structured data, `sitemap.xml` and `robots.txt`.

1. When the site moves to its final address (Netlify or your own domain), search all files for
   `amfahhzacademy.github.io` and replace it with the new address.
2. Add the site to Google Search Console (https://search.google.com/search-console), then submit
   `https://YOUR-ADDRESS/sitemap.xml` under **Sitemaps**.
3. Test the share preview at https://www.opengraph.xyz and the structured data at
   https://search.google.com/test/rich-results.

SEO files: `robots.txt`, `sitemap.xml`, `assets/img/og-image.jpg` (the picture shown when the link is shared
on WhatsApp, Facebook, etc.), `apple-touch-icon.png` (iPhone home-screen icon) and `favicon.ico`.

## Contact form

**Current setup (GitHub Pages):** the form sends enquiries to a Google Apps Script in the client's Google
account. Each enquiry is added to the "AMFAHHZ Website Enquiries" Google Sheet (tab "Enquiries") and emailed to
amfahhzacademy@gmail.com. The script is in `google-apps-script/Code.gs`, and its web app URL is in
`data-endpoint="..."` on the form in `contact.html`. If you edit the script, redeploy with
Deploy > Manage deployments > Edit > Version: New version so the URL stays the same.

**Netlify alternative:** if the site is hosted on Netlify, you can empty `data-endpoint=""` and the form
falls back to **Netlify Forms** instead:

1. After deploying, open your site in Netlify → **Forms** → enable form detection, then redeploy.
2. Submissions appear under **Forms → enquiry**.
3. To get them by email, go to **Forms → Form notifications → Add notification → Email notification**
   and enter `amfahhzacademy@gmail.com`.

## Contact details used

- WhatsApp / Phone: +92 311 1418064
- Email: amfahhzacademy@gmail.com
- Location: Remote (online classes worldwide)

To change the WhatsApp number, search all files for `923111418064` and replace it.

## Before going live

- The three reviews on the home page are **sample text**. Replace them with real student or parent feedback.
- The four tutor profiles on the home page are **sample people**. Replace the names, qualifications and experience
  with the real tutors. To add a tutor photo, save it in `assets/img/tutors/` and follow the note above the
  tutors section in `index.html`.
- The photos are free Unsplash stock images, saved in `assets/img/photos/`. To swap one, replace the file with
  your own photo using the same file name (e.g. save a new `library.jpg`). Photos shown as `<img>` are linked in
  the HTML; background photos behind the burgundy tint are listed in `assets/css/style.css` under
  "Background photos".
- Check the support hours on `contact.html` match the academy's real hours.
