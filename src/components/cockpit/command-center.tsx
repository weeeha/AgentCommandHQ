"use client";

import { ResourceMeterStrip } from "./resource-meter-strip";
import { SquadRoster } from "./squad-roster";
import { OpsGrid } from "./ops-grid";
import { OpsLog } from "./ops-log";
import { AgentDossier } from "@/components/dossier/agent-dossier";

export function CommandCenter() {
  return (
    <div className="flex flex-col gap-4 pt-4 pb-6">
      <ResourceMeterStrip />

      <SquadRoster />

      <OpsGrid />

      <AgentDossier />

      <div className="px-5">
        <OpsLog />
      </div>
    </div>
  );
}
