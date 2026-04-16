import { MissionBriefing } from "@/components/missions/mission-briefing";

export default async function MissionBriefingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MissionBriefing missionId={id} />;
}
