import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Landmark } from "lucide-react";

import { Badge } from "./badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { IconTile } from "./icon-tile";
import { Trend } from "./trend";

const meta = {
  title: "UI/Card",
  component: Card,
  args: { variant: "glass", interactive: true },
  argTypes: {
    variant: { control: "inline-radio", options: ["glass", "solid", "sunken", "ghost"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Kpi: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <IconTile icon={Landmark} tone="violet" />
        <CardAction>
          <Badge tone="green" dot>
            À jour
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardDescription>Patrimoine net</CardDescription>
        <CardTitle className="text-3xl tracking-tight">83 000 €</CardTitle>
        <Trend value={0.124} />
      </CardContent>
    </Card>
  ),
};
