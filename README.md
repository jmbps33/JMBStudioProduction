# JMB Studio Production — Extracted Assets

These files were extracted from the uploaded `JMBSTUDPROD.htm`. See the original file for full HTML structure. (source: uploaded file)

## Files included
- `styles.css` — extracted inline CSS from the HTML file. Link it in your HTML head:
```html
<link rel="stylesheet" href="styles.css">
```

- `script.js` — extracted inline JavaScript (all `<script>` blocks without `src` attributes concatenated). Include it before the closing `</body>` tag:
```html
<script src="script.js"></script>
```

- `README.md` — this file.

## Notes & recommendations
- External scripts (those using `src=`) were intentionally left in the HTML and **not** included in `script.js`. Keep those `<script src="...">` tags in your HTML (for example, Tailwind CDN).
- Paths to images in the HTML use local `file:///D:/...` URIs. Update those to relative paths or host them alongside your site (e.g., `assets/jmb.png`) for portability.
- The CSS contains animations and custom variables defined inline; keeping them in `styles.css` will preserve look and feel.
- After replacing inline CSS/JS with these files, remove the original `<style>` and inlined `<script>` blocks from your HTML and add the `<link>` / `<script src="...">` references instead.

## Zip
This package also contains `jmb_assets.zip` with the three files.

If you'd like, I can:
- Replace the inline blocks in `JMBSTUDPROD.htm` with the new external references and give you the updated HTML.
- Minify `styles.css` and `script.js`.
- Organize assets into folders (assets/images, assets/css, assets/js) and update paths.

