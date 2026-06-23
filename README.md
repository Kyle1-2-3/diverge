# 🧭 Diverge

**Step outside your algorithm.**

Diverge is a clickable prototype of a social media app that does the opposite of
most feeds. Instead of maximizing engagement by showing you more of what you
already like, Diverge helps you _notice_ your information bubble and intentionally
encounter different perspectives.

Built as a school research / design project about social media algorithms, the
attention economy, filter bubbles, and individuality. It's a front-end-only
prototype — no backend, no login, no real data.

---

## Run it locally

You need [Node.js](https://nodejs.org) (v18+).

```bash
npm install     # install dependencies (first time only)
npm run dev     # start the dev server
```

Then open the link it prints (usually **http://localhost:5173**).

> 💡 The app is designed as a phone mockup, so it looks best in a normal browser
> window on a laptop. You can also open it on your phone using the Network URL
> (run `npm run dev -- --host`).

Other commands:

```bash
npm run build   # create an optimized production build in /dist
npm run preview # preview that production build locally
```

---

## How it flows

The "research" features are **hidden inside the experience** — you feel them
instead of being told about them.

1. **Landing** → a cinematic "See beyond your feed" opener.
2. **Mood** → _"How do you want to feel today?"_ (a quick, optional vibe pick).
3. **The app** (with a bottom tab bar, like a real app):
   - **Home** → stories + an immersive photo feed that ends calmly (no infinite scroll).
     Tap a post's **···** menu for "Why am I seeing this?".
   - **Explore** → a Lemon8-style discovery grid, quietly seeded with topics
     outside your bubble.
   - **You** → a Spotify-Wrapped-style **recap** ("Your week on Diverge") where
     the diversity score + insights finally surface — as a flex, not a lecture.
     Also holds **Reflect** and **About**.

---

## Most important files

| File | What it does |
| --- | --- |
| `src/App.tsx` | The "brain" — flow (landing → mood → app) + bottom-tab switching. |
| `src/data/posts.ts` | **The feed content + photo URLs. Edit this to change the posts.** |
| `src/data/intentions.ts` | The five moods + their messages and scores. |
| `src/data/stories.ts` | The story bubbles at the top of the feed. |
| `src/data/user.ts` | Your mock profile (name, bio, stats, grid). |
| `src/data/categories.ts` | Category names, emojis, colors, and grouping. |
| `src/lib/feed.ts` | Turns a mood into feed order, diversity score + the recap. |
| `src/components/` | One file per UI piece (PostCard, Feed, ExploreScreen, ProfileScreen, etc.). |
| `src/index.css` | Theme colors, fonts, and animations. |

### A note on photos

Post photos load from **[Lorem Picsum](https://picsum.photos)** — a free,
no-API-key photo service. Each post has a stable seed so the same photo loads
every time. If you're offline (or a photo fails), it gracefully falls back to a
colorful gradient + emoji, so the demo never looks broken.

---

## How to customize

- **Change / add posts** → edit `src/data/posts.ts`. Copy an existing entry,
  change the text/`category`/`image` (any `picsum.photos/seed/...` URL), and pick
  a fallback `gradient` + emoji `visual`. Set `isOutsideBubble: true` to mark it
  as a perspective-widening post.
- **Change the moods** → edit `src/data/intentions.ts` (titles, messages, and
  the `targetScore` that drives the recap's diversity bars).
- **Change colors / fonts** → edit the `@theme` block at the top of
  `src/index.css` (e.g. `--color-brand`).
- **Change wording on a screen** → open the matching file in `src/components/`.

---

## Ideas to add later

- Save reflection answers to `localStorage` so they persist.
- A "bubble over time" chart across multiple sessions.
- A real comment thread on each post.
- Light/dark theme toggle.
- More posts + categories, or AI-generated captions.

---

## Tech

React + Vite + TypeScript + Tailwind CSS v4. No backend, no paid APIs,
no authentication.

_All usernames, posts, and scores are fictional._
