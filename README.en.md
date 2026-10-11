# Floor Plan Interior Designer

[中文](README.md) | English

A pure front-end tool for interior design on a floor plan: draw rooms and walls, place furniture, and take measurements on a 2D plan, then switch to a Three.js 3D scene with one click. The whole app is a single `index.html`: no build step, just open it.

## Features

**2D Floor Plan**
- Draw walls, rooms, doors, and windows in Edit Plan mode; the side panel shows wall length and thickness live while drawing, then selects the finished wall for precise numeric editing
- Click a wall in the 3D orbit view to edit its individual height (100–6000 mm); older plans retain their default wall heights
- Move walls and room vertices with the mouse
- Displays the original floor plan at 1:60 / 1:100 scale, dimensions in mm
- Drag 60+ furniture and appliance items from the library on the left (bedroom, living room, dining & kitchen, bathroom, appliances, study & leisure)
- Move, rotate (hold Shift for free angle), and resize items, with automatic snapping to walls
- Measuring tool (snaps to nearby walls; hold Shift to lock horizontal / vertical)
- Remove or modify non-load-bearing walls; load-bearing walls are marked separately
- Layer toggles: dimensions, room names, furniture, grid, load-bearing walls

**3D Scene**
- Bird's-eye, oblique, and top-down views; click a room in the list to fly to it
- Walkthrough mode: WASD + mouse on desktop, virtual joystick on touch devices; click doors to open / close them
- Toggle between full-height and cut-away walls, time-of-day sunlight slider, night lighting
- Detailed furniture models: cabinet door gaps and handles, upholstered headboards, metal and ceramic materials with environment reflections, and more
- Select and drag furniture in 3D as well, kept in sync with the 2D plan in real time

**Plans & Statistics**
- Automatic calculation of room areas and net usable floor area
- Change the floor material of each room (wood, tiles, marble, terrazzo, carpet, etc.), with cost estimates based on area plus 5% wastage
- Undo / redo; plans are auto-saved in the browser's local storage
- Chinese / English UI toggle (button on the right of the top bar; defaults to Chinese and remembers your choice)
- Export to PNG, export / import plans as JSON

## Quick Start

```bash
git clone <repository-url>
cd <repository-directory>
```

Then simply open `index.html` in your browser. Alternatively, start a local static server:

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

> Three.js is loaded from the jsDelivr CDN, so an internet connection is required the first time you open the 3D scene.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `T` | Toggle 2D / 3D |
| `M` / `L` / `PL` | Select and drag plan walls / draw wall / draw room polygon |
| `DR` / `WI` / `SL` | Draw door / window / sliding door (app-specific aliases) |
| `DI` / `DE` | Measure distance / demolish non-bearing walls (`DE` is app-specific) |
| `E` / `Delete` / `Backspace` | Erase selected plan object or furniture |
| `CO` / `RO` | Copy / rotate selected furniture (`Shift+RO` reverses rotation) |
| `V` | Leave plan editing and select furniture |
| `Enter` | Finish a room polygon while drawing |
| `Ctrl/⌘ + D` | Duplicate selected furniture |
| `Ctrl/⌘ + Z`, `Ctrl/⌘ + Shift + Z` | Undo, redo |
| `ZE` / `F` | Fit to window |
| `+` / `-` | Zoom in / out |
| `[` / `]` | Show / hide the furniture library (left) and the side panel (right) |
| `Shift + F` | Fullscreen |
| `Esc` | Cancel the current action; return to the select tool while editing a plan |
| Walkthrough: `WASD` / arrow keys, `Shift`, `E` | Move, walk faster, open / close doors |

Type two-letter commands in sequence (for example `P` then `L`), without pressing Enter. A blue hint shows the pending letter. Common aliases follow AutoCAD conventions; opening and demolition aliases are specific to this app.

## Tech Stack

- Vanilla HTML / CSS / JavaScript — no framework, no build step
- 2D floor plan rendered with SVG
- 3D scene built with [Three.js](https://threejs.org/) r160 (OrbitControls, PointerLockControls, RoundedBoxGeometry, RoomEnvironment, CSS2DRenderer)
- Data stored in `localStorage`

## Customizing the Floor Plan

Click **Edit Plan** in the 2D toolbar and choose a drawing tool in the right panel. Clear the sample plan to start from scratch (undoable); export a JSON backup first if needed. Drag to draw horizontal or vertical walls and openings. Click room vertices, then press Enter or double-click to finish; rename the new room in the right panel. Use Select to move walls, resize them with the white handles, reshape rooms by dragging vertices, or delete selected geometry. Rooms and walls are separate shapes and must be aligned from your measurements. Drawing a door or window on a single aligned wall segment cuts an opening in it; for complex intersections, draw the wall segments around the opening.

Geometry is saved with furniture in browser local storage and in exported plan JSON. GitHub Pages hosts the app files, not visitor plans. Older furniture-only JSON plans can still be imported with the built-in geometry.

To change the built-in plan shown on a fresh browser, edit the defaults in `index.html`:

The floor plan data lives in `index.html`:

- `ROOMS`: room polygons, names, and default floor materials
- `WALLS` / `WINS`: walls and window openings
- `MATS`: floor material names and unit prices
- `LIB`: furniture library (type, name, default size, color)
- `buildFurniture()`: 3D models for each furniture type

Edit this data to use your own floor plan.

## Social Media

- X (Twitter): [@akokoi1](https://x.com/akokoi1)

## License

[MIT](LICENSE)
