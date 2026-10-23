import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Search } from "lucide-react";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  args: { placeholder: "172 000" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithUnit: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label htmlFor="price">Prix du bien</Label>
      <Input id="price" inputMode="numeric" endAdornment="€" {...args} />
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    placeholder: "Rechercher un quartier",
    startAdornment: <Search />,
    "aria-label": "Rechercher",
  },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "-5", "aria-label": "Apport" },
};
