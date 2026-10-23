import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus, Sparkles } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Enregistrer", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "accent", "soft", "ghost", "outline", "danger", "link"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "icon", "icon-sm"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: (
      <>
        <Plus /> Ajouter un bien
      </>
    ),
  },
};
export const Accent: Story = {
  args: {
    variant: "accent",
    children: (
      <>
        <Sparkles /> Demander à l&apos;IA
      </>
    ),
  },
};
export const Loading: Story = { args: { loading: true, children: "Calcul…" } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["primary", "secondary", "accent", "soft", "ghost", "outline", "danger"] as const).map(
        (variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
};
