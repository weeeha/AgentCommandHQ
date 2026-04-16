import { ResourceMeter } from "@/types";

export const mockResources: ResourceMeter[] = [
  {
    key: "credits",
    label: "Credits",
    value: 4280,
    max: 10000,
    fillPercent: 42.8,
    tone: "default",
    trend: "+340 today",
  },
  {
    key: "slots",
    label: "Active Slots",
    value: 3,
    max: 8,
    fillPercent: 37.5,
    tone: "success",
    trend: "5 available",
  },
  {
    key: "tempo",
    label: "Tempo",
    value: 87,
    max: 100,
    fillPercent: 87,
    tone: "info",
    trend: "+12% vs last week",
  },
  {
    key: "weekly-xp",
    label: "Weekly XP",
    value: 2840,
    max: 5000,
    fillPercent: 56.8,
    tone: "warning",
    trend: "2,160 to goal",
  },
];
