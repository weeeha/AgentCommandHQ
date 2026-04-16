/**
 * Core constants for the canvas game engine.
 */

export const TILE_SIZE = 48;
export const MAP_COLS = 24;
export const MAP_ROWS = 18;

export const MAP_WIDTH_PX = MAP_COLS * TILE_SIZE;
export const MAP_HEIGHT_PX = MAP_ROWS * TILE_SIZE;

// Agent sprite frame settings
export const AGENT_SPRITE_SIZE = 48;
export const AGENT_ANIM_FRAMES = 4;
export const AGENT_FRAME_MS = 220;

// Agent movement speed (pixels per second at 1x sim speed)
export const AGENT_WALK_SPEED = 44;

// Simulation tick rate (ms per tick at speed=1)
export const SIM_TICK_MS = 1000;

// Zoom bounds
export const ZOOM_MIN = 0.4;
export const ZOOM_MAX = 2.5;

// Visual palette (used for placeholder rendering when sprites unavailable)
export const ROOM_FLOOR_COLORS: Record<string, string> = {
  bridge: "#2a1f4a",
  briefing: "#1f2a4a",
  workshop: "#3a2418",
  armory: "#3a1818",
  medbay: "#143a3a",
  training: "#3a3018",
  engineering: "#2d2d18",
  storage: "#2a2a2a",
  quarters: "#35224a",
  "memory-vault": "#182a3a",
  "financial-center": "#243a2d",
  commons: "#3a2d24",
};

export const ROOM_ACCENT_COLORS: Record<string, string> = {
  bridge: "#b84aff",
  briefing: "#4a8fff",
  workshop: "#ff8a3a",
  armory: "#ff4a4a",
  medbay: "#3affcc",
  training: "#ffcc3a",
  engineering: "#eaff3a",
  storage: "#888888",
  quarters: "#c04aff",
  "memory-vault": "#3aa8ff",
  "financial-center": "#3affa8",
  commons: "#ff9a3a",
};

export const STATUS_COLORS = {
  ready: "#3affcc",
  deployed: "#4aa8ff",
  critical: "#ff4a4a",
  cooldown: "#aaaaaa",
} as const;
