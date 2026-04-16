"use client";

import { useEffect, useRef } from "react";
import { useBaseStore } from "@/store/use-base";
import { useCockpitStore } from "@/store/use-cockpit";
import { CanvasRenderer, buildRenderState } from "@/engine/canvas-renderer";
import { startSimulation } from "@/engine/simulation";
import { onSpriteLoad, preloadSprites } from "@/engine/sprite-loader";
import { centerCameraOn } from "@/engine/camera";
import { MAP_WIDTH_PX, MAP_HEIGHT_PX } from "@/engine/constants";

/** All sprite assets to preload on mount. */
const TILE_SPRITES = [
  "hull",
  "floor-bridge",
  "floor-briefing",
  "floor-workshop",
  "floor-armory",
  "floor-medbay",
  "floor-training",
  "floor-engineering",
  "floor-storage",
  "floor-quarters",
  "floor-memory-vault",
  "floor-financial-center",
  "floor-commons",
].map((name) => `/sprites/tiles/${name}.png`);

const AGENT_SPRITES = [
  "atlas",
  "cipher",
  "forge",
  "echo",
  "mirror",
  "muse",
  "sentinel",
  "nova",
].map((name) => `/sprites/agents/${name}.png`);

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    moved: boolean;
  }>({
    dragging: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    moved: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Preload sprites
    preloadSprites([...TILE_SPRITES, ...AGENT_SPRITES]);

    // Center camera on the ship
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const initCamera = centerCameraOn(
      MAP_WIDTH_PX / 2,
      MAP_HEIGHT_PX / 2,
      cssW,
      cssH,
      1,
    );
    useBaseStore.getState().setCamera(initCamera);

    // Start renderer
    const renderer = new CanvasRenderer(canvas, () =>
      buildRenderState(useCockpitStore.getState().agents),
    );
    rendererRef.current = renderer;
    renderer.start();

    // Invalidate static layer when rooms change
    const unsubRooms = useBaseStore.subscribe((state, prev) => {
      if (state.rooms !== prev.rooms || state.ship !== prev.ship) {
        renderer.invalidateStatic();
      }
    });

    // Re-invalidate when new sprites finish loading
    const unsubSprites = onSpriteLoad(() => renderer.invalidateStatic());

    // Start simulation
    const stopSim = startSimulation({
      getAgents: () => useCockpitStore.getState().agents,
    });

    return () => {
      renderer.stop();
      unsubRooms();
      unsubSprites();
      stopSim();
    };
  }, []);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    dragState.current = {
      dragging: true,
      startX: mx,
      startY: my,
      startPanX: useBaseStore.getState().camera.panX,
      startPanY: useBaseStore.getState().camera.panY,
      moved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const renderer = rendererRef.current;
    if (!renderer) return;

    if (dragState.current.dragging) {
      const dx = mx - dragState.current.startX;
      const dy = my - dragState.current.startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2)
        dragState.current.moved = true;
      useBaseStore.getState().setCamera({
        panX: dragState.current.startPanX + dx,
        panY: dragState.current.startPanY + dy,
      });
    } else {
      // Hover detection
      const hit = renderer.hitTest(mx, my);
      if (hit && hit.type !== "tile") {
        useBaseStore
          .getState()
          .setHoveredEntity({ type: hit.type, id: hit.id });
      } else {
        useBaseStore.getState().setHoveredEntity(null);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const wasMoved = dragState.current.moved;
    dragState.current.dragging = false;
    dragState.current.moved = false;

    if (wasMoved) return; // it was a pan, not a click

    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const renderer = rendererRef.current;
    if (!renderer) return;

    const hit = renderer.hitTest(mx, my);
    if (hit && hit.type !== "tile") {
      useBaseStore.getState().selectEntity({ type: hit.type, id: hit.id });
    } else {
      useBaseStore.getState().closePanel();
    }
  };

  const handleMouseLeave = () => {
    dragState.current.dragging = false;
    useBaseStore.getState().setHoveredEntity(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const delta = -e.deltaY * 0.001;
    useBaseStore.getState().zoomCamera(delta, mx, my);
  };

  const hoveredEntity = useBaseStore((s) => s.hoveredEntity);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{
        imageRendering: "pixelated",
        cursor: dragState.current.dragging
          ? "grabbing"
          : hoveredEntity
            ? "pointer"
            : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onWheel={handleWheel}
    />
  );
}
