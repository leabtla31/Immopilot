import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Landmark, Sunrise } from "lucide-react";

import { Badge } from "./badge";
import { MetricCard } from "./metric-card";
import { Progress } from "./progress";

const meta = {
  title: "UI/MetricCard",
  component: MetricCard,
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  args: {
    icon: Landmark,
    tone: "violet",
    label: "Capacité d'emprunt",
    value: 432_700,
    footer: "Mensualité max 2 240 € · 25 ans à 3,35 %",
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Currency: Story = {};

export const WithProgress: Story = {
  args: {
    icon: Sunrise,
    tone: "amber",
    label: "Liberté financière",
    value: "2056",
    badge: <Badge>Objectif 2040</Badge>,
    footer: <Progress value={0.08} tone="amber" size="sm" label="Dépenses couvertes" />,
  },
};
