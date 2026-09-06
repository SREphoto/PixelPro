# PixelForge Studio

An all-in-one **game asset studio** for creating and developing the visual side of a game with real graphics — pixel sprites, sprite sheets, tilesets, auto-tiled terrain, level maps, and a Graphics Lab that turns HD art / photos into cohesive retro art.

Everything runs **100% client-side** in the browser, and can also run as a **desktop app** via Electron.

---

## Quick start

### Browser (zero install)
Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

Three pages:
- **`index.html`** — home / dashboard (jump into any tool)
- **`studio.html`** — the full studio (sprites, tileset, levels, lab, library)
- **`game.html`** — the playable **Village Quest** demo built from the bundled assets

### Desktop app (Electron)

```bash
npm install     # installs Electron (devDependency)
npm start       # launches the studio as a native window
```

In desktop mode the header shows **📂 Open…**, **💾 Save** writes a `.pixelforge.json` to disk, and **Export Game Pack** / **Tiled export** write files into a folder you pick (instead of triggering downloads). Autosave keeps an in-app backup even before you choose a save location.

---

## What's inside

| Panel | What it does |
| --- | --- |
| 🎨 **Sprites** | Pixel editor with animation frames, onion skinning, symmetry, zoom, selection (copy/paste/nudge/move), reference-image tracing, brushes (pencil, eraser, fill, line, rect, circle, picker, spray, dither, lighten/darken), pixel FX (outline, dither, invert, black→alpha, retro-16, AA-smooth, gradient wash), animation tags, tweening, frame reversal, and undo/redo. |
| 🧱 **Tileset** | 8×8 tile set of 16px tiles with hand-editable tile painter. Generate fantasy / dungeon / desert / snow / water / stone / space sets, or import a PNG tilesheet. |
| 🗺️ **Levels** | Multi-layer map editor (ground, deco, collision, entities) plus **auto-tiling terrain brushes** (grass, water, sand, stone, rock, wall) that build seamless edges automatically. Export PNG, JSON, or Tiled `.tmx` + `.tsx`. |
| ✨ **Graphics Lab** | Import HD art / photos → pixelate, saturation/contrast/hue, scanlines, vignette, outline, and **palette-match quantization with ordered or Floyd–Steinberg dithering** for true console-style color. Send straight to the sprite editor. |
| 📚 **Library** | Sprite-sheet slicer (with auto grid detection + background keying), a premade animation vault, your bundled Knight/Pawn/building strips, and a curated list of CC0 asset packs on itch.io. |
| 🕹️ **Village Quest** (`game.html`) | A real playable demo — fight slimes (chase AI + combat), smash barrels, collect 10 gold, bless the Monastery. Repeatable sword swings (hold Space to chain), guard (Shift), health, and a win/lose loop. |

## The demo game

`game.html` fixes the earlier prototype's issues:
- **No more floating** — every strip and building is measured at load time and anchored feet-on-ground (the art's transparent padding is trimmed, not the canvas).
- **Repeatable attacks** — hold Space to chain sword swings; each swing has a hit window that damages slimes and barrels.
- **Real enemies** — 4 slimes that wander, chase you within range, and deal contact damage (guard with Shift).
- **Visible objectives** — barrels are drawn with a pulsing highlight, an objective HUD tracks gold / monastery / slimes / barrels, and a progress bar runs along the bottom.

### Palettes
Built-in classic palettes (DB16, DB32, PICO-8, GameBoy, Sweetie16, Endesga32) plus a custom palette. Import/export `.hex` and GIMP `.gpl` files, and quantize any sprite down to the active palette.

### Shortcuts (press `?` in-app)
`B E F I U S` tools • `[ ]` frames • `Space` play • `Ctrl+Z/Y` undo/redo • `Ctrl+C/X/V/A` selection • arrows nudge • `G D C E T` level layers • `- / +` zoom

---

## Export targets

- **Sprites** → horizontal PNG sheet + JSON with frame size and animation tags (works with Phaser `load.spritesheet`, Godot `SpriteFrames`, Unity Sprite Editor).
- **Levels** → PNG render, JSON, and **Tiled** `.tmx` + `.tsx` (open in [Tiled](https://www.mapeditor.org/), then import into Godot/Unity/Löve etc.).
- **Game Pack** → one click bundles `project.json`, `spritesheet.png`, `tileset.png`, `level.png`, `level.tmx`, `tileset.tsx`, and a `README.txt`.

---

## Project structure

```
index.html          Home dashboard (links into every tool + the game)
studio.html         The whole studio (HTML + CSS + JS, no build step)
game.html           Village Quest — playable demo (slimes, barrels, gold, monastery)
village-quest.html  Older minimal demo (kept for reference)
electron/main.js    Desktop shell: window + native open/save/export dialogs
electron/preload.js Safe bridge exposing window.pixelForgeDesktop
package.json        Electron launcher
assets/             Bundled character/building strips (Warrior, Pawns, buildings)
uploads/            Mirrored copies of uploaded strips
dark-knight.png     Reference boss sheet (© Sega — reference/placeholder only)
Tilemaps/Tilesets/  Tiled example maps & .tsx tilesets
```

> **Licensing note:** `dark-knight.png` ("Shining in the Darkness") is © Sega and is bundled as a **reference/placeholder only** — don't ship it commercially. The itch.io packs linked in the Library tab are CC0 (commercial-safe), but always verify each pack's license before shipping.

## Development

```bash
node --check <(extract script)   # JS is embedded in index.html
```
The app has no build step; all logic lives in the single `<script>` block of `index.html`.
