# Kowakujo Interactive Map

An interactive fan-made guide map for the Kowakujo Zombies map. It provides a zoomable floor map, filterable markers, Easter egg routes, step-by-step objective details, and screenshot lightboxes for important locations.

## Features

- Pan and zoom the full map image.
- Floor switcher for ground and upper-level areas.
- Grouped filters for map labels, perk machines, map markers, and quest steps.
- Easter egg stage browser with selectable steps and sub-steps.
- Dotted quest routes, numbered objective markers, and custom step icons.
- Lightbox screenshots with captions, galleries, thumbnails, and previous/next step navigation.
- Optional developer coordinate overlay and drawing helper for plotting new markers.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

- `src/lib/maps/kowakujo.ts` - map data, markers, areas, Easter egg steps, routes, and screenshots.
- `src/lib/maps/types.ts` - shared data model for maps and objectives.
- `src/app/components/InteractiveMap.tsx` - zoomable map, markers, routes, and click handling.
- `src/app/components/MapSidebar.tsx` - filters, legend, floor switcher, and Easter egg navigation.
- `src/app/components/RevealModal.tsx` - screenshot lightbox, gallery thumbnails, and formatted descriptions.
- `public/` - map images, perk icons, Easter egg icons, and in-game screenshots.

## Editing Map Data

Coordinates are stored as percentages of the source image dimensions:

```ts
position: { x: 52.3, y: 10.1 }
```

Set `NEXT_PUBLIC_SHOW_COORDS=true` in `.env.local` to show the live cursor coordinate overlay while placing markers.

For multi-image or multi-position objectives, use:

```ts
positions: [
  { x: 84.6, y: 72.2 },
  { x: 87.6, y: 78 },
],
positionLabels: ["1", "2"],
positionImageIndices: [0, 1],
revealImages: [
  "/images/example-a.jpg",
  "/images/example-b.jpg",
],
```

Lightbox descriptions support simple formatting:

- `**bold text**`
- Blank lines for paragraph spacing
- Lines starting with `- ` for bullet lists

## Deployment

This app is a static client-facing guide and is suitable for deployment on Vercel as a standard Next.js project.

Environment files are ignored by git. Use `.env.example` for public configuration examples and keep `.env.local` private.

## Disclaimer

This is a fan-made guide project. Game names, screenshots, icons, and related assets belong to their respective owners. This project is not affiliated with or endorsed by Activision, Treyarch, or Call of Duty.
