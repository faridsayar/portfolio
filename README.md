# Designer Portfolio (Single Page)

A fast, responsive single-page portfolio for showcasing 3D models, images, industrial design, game dev, and projects — with a simple contact form that emails you via FormSubmit.

## What’s included
- Intro/hero with CTA
- Selected Work with category filters (All, 3D, Images, Industrial, Game Dev, Projects)
- About section with highlights
- Contact form (emails you via FormSubmit)
- Lightweight JS for filters and a success toast
- Clean dark UI, responsive layout

## Quick start
1. Open `index.html` in your browser to preview locally.
2. Replace placeholders in `index.html`:
   - `Farid` (brand and footer)
   - Social links in the footer
   - Portfolio images and titles in the Work grid
3. Update contact form email:
   - In `index.html`, change the form action to your email:
     ```html
     <form action="https://formsubmit.co/youremail@example.com" method="POST">
     ```
   - Submit the form once to verify with FormSubmit. Check for a confirmation email. After you confirm, future submissions will be delivered.

## Customization
- Sections live in `index.html`. Styles are in `styles.css`. Interactions are in `script.js`.
- Replace demo images (Picsum URLs) with your own file paths or hosted URLs.
- Update the categories by changing each card’s `data-category` attribute and the filter buttons’ `data-filter` values.
- Adjust colors in `styles.css` under the `:root` CSS variables.

## Contact form settings (FormSubmit)
Preconfigured hidden fields:
- `_subject`: email subject line
- `_template`: table formatting for the email
- `_captcha`: disabled (set to `true` to enable)
- `_honey`: honeypot for bots
- `_next`: dynamically set to redirect back to `#success` and show a toast

Docs: `https://formsubmit.co/`

## Deploy
- GitHub Pages: push this folder to a repo, enable Pages (Settings → Pages → Deploy from branch → `main` → `/root`).
- Netlify: drag-and-drop the folder to the Netlify app or `netlify deploy`.
- Vercel: `vercel` in this folder or drag-and-drop in the dashboard.

## File overview
- `index.html`: structure and content
- `styles.css`: styles and layout
- `script.js`: filters, success toast, `_next` handling

## Images structure
Put images under `assets/images` following this pattern:

```
assets/
  images/
    3d/
      drone/
        thumb.jpg
        01.jpg
        02.jpg
        03.jpg
      car/
        thumb.jpg
        01.jpg
        02.jpg
    images/
      editorial/
        thumb.jpg
        01.jpg
        02.jpg
      arch/
        thumb.jpg
        01.jpg
        02.jpg
    industrial/
      chair/
        thumb.jpg
        01.jpg
        02.jpg
      lamp/
        thumb.jpg
        01.jpg
        02.jpg
    gamedev/
      forest/
        thumb.jpg
        01.jpg
        02.jpg
      character/
        thumb.jpg
        01.jpg
        02.jpg
    projects/
      brand/
        thumb.jpg
        01.jpg
        02.jpg
      website/
        thumb.jpg
        01.jpg
        02.jpg
  qr/
    telegram.png
```

Update each `card`'s `data-images` and thumbnail `img` paths accordingly when you host remotely (keep the same folder shape).

## Notes
- All assets are static. No build step required.
- Tested on modern browsers. For best quality images, use optimized JPG/PNG or WebP.
- Feel free to rename categories or add/remove cards. The filter will adapt if values match.
