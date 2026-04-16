import { SkillTreeScreen } from "@/components/cyberware/skill-tree";

export default async function SkillTreePage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;
  return <SkillTreeScreen agentId={agent} />;
}
