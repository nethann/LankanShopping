# Lankan Shopping

A React + TypeScript app for showcasing Sri Lankan products to international users.

## What It Does (So Far)

- Home page with promo cards and category highlights
- Category pages:
  - Groceries
  - Electronics
- Product cards with:
  - Images (multiple image dots)
  - Weight label
  - Currency-formatted pricing
- Cart support for signed-in users (saved in Firestore)
- Google sign-in with Firebase Auth
- Admin panel for product management:
  - Add/edit/delete products
  - Upload up to 2 images per product
  - Image previews and remove-before-save
- Settings page for currency preference
- Auto currency detection + conversion pipeline with fallback logic
- Dedicated promo pages for each home card CTA (simple centered title)

## Tech Stack

- React
- TypeScript
- Vite
- Firebase Auth
- Firestore

## Run Locally

1. Install dependencies
   - `npm install`
2. Start dev server
   - `npm run dev`
3. Build
   - `npm run build`

## Project Notes

- Firebase config is currently set in `src/lib/firebase.ts`.
- Admin access is controlled by email list in `src/lib/firebase.ts` (`ADMIN_EMAILS`).
