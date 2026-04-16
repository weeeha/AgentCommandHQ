"use client";

import { useBaseStore } from "@/store/use-base";
import { roomTypeDefs } from "@/data";
import { GridCellTile } from "./grid-cell";
import { RoomTile } from "./room-tile";

export function ShipGrid() {
  const ship = useBaseStore((s) => s.ship);
  const rooms = useBaseStore((s) => s.rooms);
  const selectedCellPos = useBaseStore((s) => s.selectedCellPos);
  const selectedRoomId = useBaseStore((s) => s.selectedRoomId);
  const selectCell = useBaseStore((s) => s.selectCell);
  const selectRoom = useBaseStore((s) => s.selectRoom);
  const openBuildMenu = useBaseStore((s) => s.openBuildMenu);

  const handleEmptyCellClick = (row: number, col: number) => {
    selectCell({ row, col });
    openBuildMenu();
  };

  // Collect anchor cells to render room tiles
  const anchorRooms: Array<{ room: (typeof rooms)[number]; cell: { row: number; col: number } }> = [];
  for (const row of ship.cells) {
    for (const cell of row) {
      if (cell.roomId && cell.isAnchor) {
        const room = rooms.find((r) => r.id === cell.roomId);
        if (room) anchorRooms.push({ room, cell: { row: cell.row, col: cell.col } });
      }
    }
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div
        className="grid gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${ship.cols}, var(--cell-size, 48px))`,
          gridTemplateRows: `repeat(${ship.rows}, var(--cell-size, 48px))`,
        }}
      >
        {/* Render all cells as base layer */}
        {ship.cells.flat().map((cell) => (
          <GridCellTile
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            isSelected={
              selectedCellPos?.row === cell.row &&
              selectedCellPos?.col === cell.col
            }
            onClick={() => handleEmptyCellClick(cell.row, cell.col)}
          />
        ))}

        {/* Render room tiles on top (positioned via grid-column/grid-row) */}
        {anchorRooms.map(({ room }) => (
          <RoomTile
            key={room.id}
            room={room}
            roomType={roomTypeDefs[room.typeKey]}
            isSelected={selectedRoomId === room.id}
            onClick={() => selectRoom(room.id)}
          />
        ))}
      </div>
    </div>
  );
}
