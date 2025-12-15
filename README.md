# Auto Parts (FalParts) Frontend

Modern multilingual e-commerce frontend for FalParts, an auto parts retailer. Built with Next.js App Router, TypeScript, Tailwind CSS, Redux Toolkit, and React Query, featuring rich SEO metadata, localization, and checkout flows.

## Features

- Next.js 15 App Router with server components where useful.
- Arabic/English localization with i18next and direction-aware layouts.
- Product, category, brand, offer, and wishlist experiences plus checkout and order tracking.
- Redux Toolkit store with persistence and React Query for server data.
- Auth flows including Google One Tap plus OTP-based login/registration.
- Google Maps-based location picker and Leaflet map display.
- SEO-friendly metadata, OG images, and social sharing defaults.

## Tech Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS 4, Radix UI primitives
- Redux Toolkit + redux-persist, React Query
- i18next / react-i18next
- Swiper, Framer Motion
- Axios, Zod, React Hook Form

## Getting Started

1. Prerequisites

   - Node.js 20+ (recommended)
   - npm (comes with Node)

2. Install dependencies

   - `npm install`

3. Environment variables  
   Create a `.env.local` in the repo root:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api
   NEXT_PUBLIC_API_BASE_HOSTNAME=api.example.com
   NEXT_PUBLIC_API_BASE_IMAGE=https://api.example.com
   NEXT_PUBLIC_SITE_URL=https://falparts.sa
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
   GOOGLE_SITE_VERIFICATION=your-google-code
   YANDEX_VERIFICATION=your-yandex-code
   YAHOO_VERIFICATION=your-yahoo-code
   ```

4. Run the app
   - Dev server: `npm run dev` (defaults to http://localhost:3000)
   - Type check & lint: `npm run lint`
   - Production build: `npm run build` then `npm start`

## Project Structure (high level)

- `src/app` – App Router routes, layouts, and metadata.
- `src/components` – UI components (checkout, auth, profile, etc.).
- `src/lib` – SEO config, API helpers, axios client, i18n utilities.
- `src/services` – Typed API clients (auth, notifications, base API).
- `src/store` – Redux store setup and providers.
- `public` – Static assets (logos, offers, products, OG images).

## Localization

- Supported locales: Arabic (`ar`, default) and English (`en`).
- Locale-aware routing via `[locale]` segments and direction switching.

## SEO & Social

- Centralized SEO config in `src/lib/seo/config.ts`.
- Dynamic OG generation helpers and per-locale metadata defaults.

## Scripts

- `npm run dev` – Start development server.
- `npm run build` – Create production build.
- `npm run start` – Start built app.
- `npm run lint` – Lint and type-check.

## Notes

- API calls expect the backend at `NEXT_PUBLIC_API_BASE_URL`; update envs to match your API host.
- Remote image domains must match `NEXT_PUBLIC_API_BASE_HOSTNAME` (see `next.config.ts`).
