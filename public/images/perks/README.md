# Perk images

Drop perk assets here; reference them from `src/lib/maps/kowakujo.ts` by URL.

- `icons/<name>.webp` — the marker icon shown on the map
  → `icon: "/images/perks/icons/<name>.webp"`
- `ingame/<name>.png` — the in-game screenshot shown in the reveal lightbox
  → `revealImage: "/images/perks/ingame/<name>.png"`

The leading `/images/...` path is relative to this `public/` folder.
Files placed here are served as-is (no build step). A missing file just shows
a blank icon — it won't break the build.
