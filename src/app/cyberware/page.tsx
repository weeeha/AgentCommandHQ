import { CyberwareScreen } from "@/components/cyberware/cyberware-screen";

export default async function CyberwarePage({
  searchParams,
}: {
  searchParams: Promise<{ agent?: string }>;
}) {
  const { agent } = await searchParams;
  return <CyberwareScreen agentId={agent} />;
}
