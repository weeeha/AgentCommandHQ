import type { CameraState } from "@/types";
import { TILE_SIZE } from "./constants";

/**
 * Camera utilities: convert between screen, world, and tile coordinates.
 * Screen space = canvas pixel coords. World space = map pixel coords.
 */

export function screenToWorld(
  camera: CameraState,
  screenX: number,
  screenY: number,
): { worldX: number; worldY: number } {
  return {
    worldX: (screenX - camera.panX) / camera.zoom,
    worldY: (screenY - camera.panY) / camera.zoom,
  };
}

export function worldToScreen(
  camera: CameraState,
  worldX: number,
  worldY: number,
): { screenX: number; screenY: number } {
  return {
    screenX: worldX * camera.zoom + camera.panX,
    screenY: worldY * camera.zoom + camera.panY,
  };
}

export function worldToTile(
  worldX: number,
  worldY: number,
): { col: number; row: number } {
  return {
    col: Math.floor(worldX / TILE_SIZE),
    row: Math.floor(worldY / TILE_SIZE),
  };
}

export function screenToTile(
  camera: CameraState,
  screenX: number,
  screenY: number,
): { col: number; row: number } {
  const { worldX, worldY } = screenToWorld(camera, screenX, screenY);
  return worldToTile(worldX, worldY);
}

/** Center the camera on a given world point for a canvas of (w, h). */
export function centerCameraOn(
  worldX: number,
  worldY: number,
  canvasWidth: number,
  canvasHeight: number,
  zoom: number,
): CameraState {
  return {
    panX: canvasWidth / 2 - worldX * zoom,
    panY: canvasHeight / 2 - worldY * zoom,
    zoom,
  };
}
