# SCFL website: handover guide

This explains how the site is built, how to publish it, and how to edit it. It is written for someone comfortable with the GitHub website but not necessarily with code.

The site is plain HTML, CSS and a little JavaScript. There is no build step, no framework, no database and nothing to install. Every page works when opened directly by its URL.

---

## 1. What is in the repository

| Path | What it is |
|---|---|
| `index.html` | Home |
| `measurement-problem.html` | The Measurement Problem (includes the interactive "Try it" example) |
| `approach.html` | The SCFL Approach |
| `applications.html` | Applications and Case Studies |
| `case-texas-grid.html` | Case study: Texas grid, February 2021 |
| `case-fukushima.html` | Case study: Fukushima Daiichi, 2011 |
| `measurement-as-a-service.html` | Measurement as a Service (commercial) |
| `research.html` | Research Program, including Evidence Status (`research.html#evidence-status`) |
| `papers.html` | Publications |
| `videos.html` | Videos |
| `collaborate.html` | Collaboration and Contact (contact section is `collaborate.html#contact`) |
| `one-question.html` | One Question Challenge (existing page, restyled) |
| `register.html` | Challenge registration form (existing page, restyled) |
| `404.html` | "Page not found" page. GitHub Pages shows it automatically. |
| `CNAME` | The custom domain setting. **Do not edit or delete** unless you mean to change the domain. |
| `assets/css/site.css` | The one shared stylesheet for every page |
| `assets/js/site.js` | Menus, mobile menu, footer year, registration fallback |
| `assets/js/frustration.js` | The interactive example on the Measurement Problem page only |
| `assets/fonts/` | Self-hosted fonts (IBM Plex Sans, Source Serif 4) and their open licences |
| `assets/img/favicon.svg` | Browser tab icon |
| `assets/video/` | Video files (`.mp4`) and their poster images (`.jpg`) |
| `_tools/` | Optional helper for updating the menu and footer on every page |
| `_docs/` | This guide |

Folders whose names start with `_` are **not published** by GitHub Pages. They are only visible in the repository.

The original page addresses (`index.html`, `one-question.html`, `register.html`, `videos.html`, `papers.html`) are unchanged, so existing links keep working.

---

## 2. Publishing

The repository is `ronbrogdon-del/SCFL`. GitHub Pages is set to deploy from the `main` branch, root folder.

**To publish the new site using the GitHub website:**

1. Open the repository on github.com.
2. Click **Add file → Upload files**.
3. Drag in everything from the site folder: all the `.html` files, `CNAME`, `README.md`, and the `assets`, `_tools` and `_docs` folders. (Each video is under 25 MB, which is GitHub's limit for browser uploads.)
4. Write a short commit message, such as "Expanded multi-page site", and click **Commit changes**.
5. Open the **Actions** tab and wait for **pages build and deployment** to show a green tick (usually one to two minutes).
6. Open the live site and check it (see section 9).

To undo, open the repository's commit history and revert the commit.

---

## 3. Editing text on a page

1. Open the page's `.html` file in the repository and click the pencil icon (**Edit this file**).
2. The page's own content is between `<main id="main" tabindex="-1">` and `</main>`. Edit the text there.
3. Commit the change. The site updates in a minute or two.

Notes:

- **Don't edit** between `<!-- site-header:start -->` and `<!-- site-header:end -->`, or between `<!-- site-footer:start -->` and `<!-- site-footer:end -->`. Those blocks are shared by every page (see section 4).
- Each page's **title** (shown in browser tabs and search results) is in `<title>…</title>` near the top. The **description** used by search engines is in `<meta name="description" content="…">`. Update the matching `og:title` and `og:description` lines too.
- Keep one `<h1>` per page.
- Use plain, descriptive link text ("Read the case study", not "click here").

### Evidence labels

Results are labelled with small coloured tags. Copy one of these where needed:

```html
<span class="status status--demo">Demonstrated (synthetic)</span>
<span class="status status--explore">Exploratory</span>
<span class="status status--hypo">Hypothesis</span>
<span class="status status--plan">Planned</span>
<span class="status status--withdrawn">Withdrawn</span>
```

The site's content rules (from the original brief) still apply when you add text: no claims of universal validity, predictive accuracy, portability, commercial adoption, independent validation or endorsements without documented evidence, and nothing implying SCFL replaces established engineering, actuarial, clinical or operational frameworks.

---

## 4. Changing the menu or the footer

The menu (with its dropdowns) and the footer appear on every page. The master copies are:

- `_tools/partials/header.html`
- `_tools/partials/footer.html`

**Option A, with Python (recommended).** Edit the master copy, then, from the repository folder on a computer:

```bash
python3 _tools/update-layout.py
```

This copies the header and footer into every page and marks the current page in the menu automatically. Commit the changed files.

**Option B, without Python.** Make the same edit inside the `site-header` (or `site-footer`) block of every `.html` file. If you add a menu link this way, add `aria-current="page"` to that link only on its own page.

---

## 5. Adding a page

1. Copy the page most like the new one (for example `case-fukushima.html` for a new case study) and save it under a new name: lowercase, words joined by hyphens, ending in `.html` (for example `case-hospital-systems.html`).
2. Change the `<title>`, the description and `og:` lines, the breadcrumb, the `<h1>`, and the content.
3. Add a link to it in `_tools/partials/header.html` (inside the right dropdown), and anywhere else it belongs (for example the case list on `applications.html`).
4. Run `python3 _tools/update-layout.py` (or follow Option B above).
5. Commit, then open the new page directly by its URL to check it.

All links on the site are relative (`papers.html`, `assets/css/site.css`), so they work both on the custom domain and on the GitHub project address. Keep new pages in the top folder so this stays true.

---

## 6. Adding or updating a publication

Open `papers.html` and copy an existing entry:

```html
<li><a class="pub-title" href="https://doi.org/10.5281/zenodo.XXXXXXXX">Exact title of the paper</a><span class="pub-meta">Zenodo. DOI 10.5281/zenodo.XXXXXXXX</span></li>
```

- Always link the DOI as `https://doi.org/…`, not a Zenodo page address, so the link survives if the record moves.
- Copy the title exactly from the Zenodo record.
- Click the link after publishing to confirm it opens the right record.

If the paper belongs on a case or domain page too, add the same DOI link there.

---

## 7. Adding a video

1. Export the video as an `.mp4` (H.264 video, AAC audio), 1920×1080 or smaller. Keep each file under 25 MB if you upload through the GitHub website; GitHub refuses files over 100 MB.
2. Optional but recommended: make it start playing faster and create a poster image. With ffmpeg installed:

   ```bash
   ffmpeg -i input.mp4 -c copy -movflags +faststart assets/video/my-video.mp4
   ffmpeg -ss 3 -i input.mp4 -frames:v 1 -vf scale=1280:-2 -q:v 4 assets/video/my-video.jpg
   ```

3. Copy an existing `<figure class="video">…</figure>` block on `videos.html`, and change the file names, title, length and description.

GitHub Pages sites have a soft limit of 1 GB in total and about 100 GB of traffic a month. If the video library grows large, host videos on YouTube or Vimeo and embed them instead.

**Accessibility:** when written scripts are available, add captions. Save them as a WebVTT file (`my-video.vtt`) in `assets/video/` and add this line inside the `<video>` element:

```html
<track kind="captions" src="assets/video/my-video.vtt" srclang="en" label="English">
```

---

## 8. The registration form

The site has no server, so `register.html` currently works like this: when a visitor presses **Send registration**, their email app opens with the registration already filled in, addressed to measurement@coherencemanagement.org. They then send it.

To collect registrations through a form service instead (for example Formspree, which has a free tier):

1. Create a form with the service and copy its endpoint address (for example `https://formspree.io/f/abcdwxyz`).
2. In `register.html`, change the `<form>` line so `action="…"` is that address, and delete `enctype="text/plain"`.
3. Update the sidebar text that says "Sending opens your email app…".

The script only steps in when the form's action starts with `mailto:`, so nothing else needs changing.

---

## 9. Checking the site after publishing

- Open each page **directly by its URL**, not only through the menu.
- Open the menus with a mouse, then with the keyboard (Tab to a menu, Enter to open, arrow keys to move, Escape to close).
- On a phone, open the **Menu** button and each section.
- Visit a made-up address (for example `/no-such-page`) and confirm the "Page not found" page appears with the normal menu.
- Click every DOI link on `papers.html`.
- Play each video.

---

## 10. Domain

`CNAME` contains `www.coherencemanagement.org`. It was copied unchanged from the existing site. Nothing in this update changes DNS or any other site's domain settings.

If the domain does not yet point to GitHub Pages, the site is still served at the GitHub address. To connect the domain later, follow GitHub's guide "Managing a custom domain for your GitHub Pages site" and set the DNS records at the domain registrar. After the domain works, turn on **Enforce HTTPS** under **Settings → Pages**.

---

## 11. Design reference

All colours, fonts and spacing are set at the top of `assets/css/site.css`, under `:root`. Changing a value there changes it everywhere.

| Token | Value | Used for |
|---|---|---|
| `--ink` | `#0e1b33` | Headings (navy) |
| `--text` | `#233150` | Body text |
| `--muted` | `#55617a` | Secondary text |
| `--cobalt` | `#1c4aa6` | Links and buttons |
| `--tension` | `#b3261e` | Negative relations in diagrams only |
| `--mist` | `#f3f5f8` | Alternate section background |

Fonts: Source Serif 4 for headings, IBM Plex Sans for text. Both are self-hosted under the SIL Open Font License, so the site makes no calls to outside font services.

All text colours meet WCAG AA contrast on their backgrounds. Keep that in mind when changing colours.

---

## 12. Open items before or soon after launch

These need Ron's decision or input:

1. **Definition wording.** The site quotes the paper: "Coherence is the degree to which the relationships within a system *mutually* hold one another in place." The brief and the old site used "…a system's relationships hold one another in place." Pick one and use it everywhere.
2. **Unconfirmed DOIs.** These are copied from the previous site and have not been opened to confirm their titles: 19364489, 21728822, 22974080, 21513174, 21740325, 19488182, 22136130, 22926195, 19116203, 20839076, 20222719, 21983299, and the three Zenodo rate-limited during the build (23247214, 18865667, 20966428). Click each on `papers.html`.
3. **Videos held back:** the hospitals film (`While_It_Still_Stands_04_Hospitals.mp4`). Its Mercy Fort Scott segment shows a building signed "Faith Community Hospital", a different real hospital. It also makes specific claims about hospitals that are still operating (Ben Taub, LAC+USC), which need cited sources. The short 6-second animation is also not used.
4. **Uri film wording.** The on-screen line "Frequency below the trip line for 4 minutes 37 seconds" doesn't match KUT's reporting of ERCOT, which says the grid came *within* 4 minutes 37 seconds of the 9-minute point. The site text follows KUT.
5. **Fukushima film detail.** The narration says Unit 2's suppression chamber breached on 15 March. The World Nuclear Association says later inspection did not support the rupture interpretation. The site text avoids the claim.
6. **Photo rights in the films.** The Uri and 5A films show a control room with "POLIZEI" on staff uniforms, which is not a Texas grid control room. Confirm rights for all stock and press photos used in the films.
7. **Captions** for all videos, once written scripts are available.
8. **Films not yet received:** part 2 (SCFL and Souljourner), sovereign wealth, reinsurance, Surfside.
9. **Previous wording removed** because it conflicted with the brief: the old home page said coherence is "predictive of system resilience" and that measurement "can predict dysfunction". Annotations such as "8.9hr lead" were dropped from the publications list; titles are shown as published.
