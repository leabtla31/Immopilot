import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { SegmentedControl } from "./segmented-control";

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
} satisfies Meta<typeof SegmentedControl>;

export default meta;

export const Period: StoryObj = {
  render: function Render() {
    const [value, setValue] = useState<"1a" | "5a" | "10a" | "max">("10a");
    return (
      <SegmentedControl
        label="Période"
        value={value}
        onValueChange={setValue}
        options={[
          { value: "1a", label: "1 an" },
          { value: "5a", label: "5 ans" },
          { value: "10a", label: "10 ans" },
          { value: "max", label: "Max" },
        ]}
      />
    );
  },
};
