<p align="center">
  <strong style="font-size: 2rem;">Flix<span style="color:#e50914">Pick</span></strong>
</p>

<p align="center">
  <strong>Stop scrolling. Start watching.</strong><br />
  Premium movie & TV recommendations tailored to your mood — powered by TMDB.
</p>

<p align="center">
  <a href="#features">Features</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a>
</p>

---

## Overview

**FlixPick** helps you decide what to watch next — without endless scrolling. Pick your mood, choose your streaming platforms, spin the roulette, and get a cinematic recommendation in seconds. Save titles to your personal list, track what you're watching, and build a profile that reflects your taste.

![FlixPick Homepage — mood picker, platform selector & cinematic hero](./public/screenshots/Flixpick%20home.png)
![FlixPick Roulette](./public/screenshots/Flixpick%20%20roulette.png)
![FlixPick Details movies](./public/screenshots/Flixpick%20details%20movies%20and%20tvshow.png)
![FlixPick Browse](./public/screenshots/Flixpick%20%20Browse.png)
![FlixPick watching](./public/screenshots/Flixpick%20%20watching.png)
![FlixPick My list](./public/screenshots/Flixpick%20%20my%20list.png)


---

## Features

### Mood-based discovery
- Choose how you feel tonight — Action, Comedy, Mind-Bending, Romance, and more
- Filter by **Movies**, **TV Shows**, or **Both**
- Select your streaming platforms (Netflix, Max, Disney+, Prime, etc.)
- **Find My Movie** roulette picks a high-rated title matched to your mood

### Cinematic homepage
- Full-screen hero with rotating TMDB backdrops
- Trending carousel with platform badges
- **Editor's Picks** — curated top-rated titles (8.0+ rating)
- Roulette result card with backdrop, trailer, and where-to-watch links

### Browse & details
- Browse by platform, genre, and sort order
- Rich detail pages — cast, videos, technical info, similar titles
- Direct links to stream via JustWatch / platform deep links

### Your account
- **Sign in** with email/password or Google OAuth (Supabase Auth)
- **My List** — save any title with one tap (bookmark)
- **Watch Status** — track separately: Want to Watch · Currently Watching · Watched · Loved
- **Watching page** — see in-progress titles with progress indicators
- **Profile** — stats, favorite genres, edit display name

### Premium design
- Dark cinematic UI with Netflix-inspired accents
- **Syne** display font + **DM Sans** body text
- Fully responsive from 375px mobile to desktop
- Touch-friendly 44px targets, hamburger nav on mobile

---

## Screenshots

| Homepage | My List & Profile |
|----------|-------------------|
| Mood pills, platform selector, roulette | Personal library with status tracking |

> Screenshots live in [`public/screenshots/`](./public/screenshots/).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth & DB | [Supabase](https://supabase.com/) (Auth + PostgreSQL) |
| Movie data | [TMDB API](https://www.themoviedb.org/documentation/api) |
| Fonts | Syne, DM Sans (Google Fonts) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 20+
- [TMDB API key](https://www.themoviedb.org/settings/api)
- [Supabase project](https://supabase.com/dashboard)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/flixpick.git
cd flixpick
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
# TMDB
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional — auto-create watchlist table
# SUPABASE_DB_PASSWORD=your_database_password
```

### 3. Database setup

Run the SQL in [`supabase/migrations/user_lists.sql`](./supabase/migrations/user_lists.sql) inside the **Supabase SQL Editor**, or add `SUPABASE_DB_PASSWORD` and visit any list page to use auto-setup.

### 4. Google OAuth (optional)

In Supabase → **Authentication → Providers → Google**, add redirect URL:

```
http://localhost:3000/auth/callback
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  page.tsx              # Homepage — hero, roulette, trending
  auth/                 # Login, signup, OAuth callback
  my-list/              # Saved titles + status tabs
  watching/             # Currently watching
  profile/              # User stats & genres
  browse/               # Platform & genre browse
  movie/ · tv/          # Detail pages
components/shared/
  MovieCard.tsx         # Poster cards with watch links
  ListButton.tsx        # Save to My List (bookmark)
  WatchStatusButton.tsx # Watch progress status
actions/
  listActions.ts        # Server actions for user_lists
lib/
  tmdb.ts               # TMDB API helpers
  supabase-*.ts         # Supabase clients
```

---

## User Flow

```
Homepage → Pick mood + platforms → Spin roulette → Get recommendation
     ↓
Bookmark (My List)          Watch Status (separate)
     ↓                              ↓
/my-list — all saved titles    /watching — in progress
/profile — stats & genres      Detail page — both buttons
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

---

## License

Private project — all rights reserved.

---

<p align="center">
  Built with care for people who love movies but hate deciding.<br />
  <strong>FlixPick</strong> — your next great watch is one spin away.
</p>
