# Images guide

Use this folder for all static images. Recommended structure by category and project:

- 3d/{project}/thumb.jpg, 01.jpg..05.jpg
- images/{project}/thumb.jpg, 01.jpg..05.jpg
- industrial/{project}/thumb.jpg, 01.jpg..05.jpg
- gamedev/{project}/thumb.jpg, 01.jpg..05.jpg
- projects/{project}/thumb.jpg, 01.jpg..05.jpg
- qr/telegram.png (QR codes and misc)

Naming rules:
- Use `thumb.jpg` for the grid thumbnail shown on the portfolio.
- Use numbered files `01.jpg`..`05.jpg` for the lightbox sequence.
- Prefer JPG or WebP, optimized for web (try ~200–400 KB each).
- For remote hosting, keep the same folder shape in URLs.

After adding images:
- Update `index.html` `data-images` for each `card` and the thumbnail `img` path.
- Example:
  - data-images="assets/images/3d/drone/01.jpg|assets/images/3d/drone/02.jpg|assets/images/3d/drone/03.jpg"
  - thumbnail src="assets/images/3d/drone/thumb.jpg"
