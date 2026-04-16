import { ActiveOperations } from "./active-operations";
import { MissionBoard } from "./mission-board";

export function OpsGrid() {
  return (
    <div className="grid grid-cols-[1.4fr_1fr] gap-3 px-5 max-md:grid-cols-1">
      <ActiveOperations />
      <MissionBoard />
    </div>
  );
}
