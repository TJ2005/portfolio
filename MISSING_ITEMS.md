# Missing Items Checklist

## 1) Sections still missing in the page flow

- [ ] Add an `about` section in `src/routes/+page.svelte`.
  - The menu includes `about` in `src/lib/landingIndexAnim.svelte`, but no matching `<section id="about">` exists yet.
- [ ] Add a `contact` section in `src/routes/+page.svelte`.
  - The menu includes `contact` in `src/lib/landingIndexAnim.svelte`, but no matching `<section id="contact">` exists yet.
- [ ] Decide what to do with `footer` in the `slides` array.
  - `footer` exists in slide metadata, but no matching section is implemented.

## 2) Content still placeholder/incomplete

- [ ] Replace project visual placeholders in `src/lib/ProjectsPanel.svelte`.
  - Cards currently render an empty `.card-visual` gradient block.
  - Add screenshots, thumbnails, logos, or media for each project card.

## 3) Data coverage from resume still pending (optional but useful)

- [ ] Add your resume `Summary` text to the future About section.
- [ ] Add `Skills` list (Languages, Frameworks, Tools, Databases) to About or a dedicated Skills section.
- [ ] Add `College Clubs` (Cyber Chakravyuh, FOSS MPSTME United) to About/Extras when ready.
- [ ] Add links/CTAs for projects where applicable (Live/Internal/NPM) in project cards.

## 4) Current code issues to fix

- [ ] Fix TypeScript typing around `snapContainer` in `src/routes/+page.svelte`.
  - Current diagnostics show nullability/type narrowing issues around scroll listener setup.
- [ ] Fix Promise resolver typing in image preload block in `src/routes/+page.svelte`.
  - `resolve()` currently reports missing argument due to inferred Promise type.
- [ ] Remove unused `.content-wrapper` CSS selector in `src/routes/+page.svelte` (or use it).

## 5) Dev run issue observed

- [ ] Use a valid host flag when starting dev server.
  - Last command used `pnpm run dev --host 127.0.0/1` (invalid host format).
  - Use `pnpm run dev --host 127.0.0.1` or just `pnpm run dev`.
