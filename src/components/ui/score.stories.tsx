import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Gauge } from "./gauge";
import { Score } from "./score";

const meta = {
  title: "UI/Score",
  component: Score,
  args: { value: 87, size: "lg", label: "Score IA" },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
  },
} satisfies Meta<typeof Score>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bands: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {[92, 78, 64, 50, 30].map((value) => (
        <Score key={value} value={value} size="md" />
      ))}
    </div>
  ),
};

export const GaugeRing: Story = {
  render: () => (
    <Gauge value={0.083} label="Progression vers le premier million" size={160} thickness={12}>
      <span className="text-2xl font-semibold tabular">8 %</span>
      <span className="text-xs text-muted-foreground">du million</span>
    </Gauge>
  ),
};
