import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { SegmentedControl } from "./segmented-control";

function Harness() {
  const [value, setValue] = useState<"a" | "b" | "c">("a");
  return (
    <SegmentedControl
      label="Période"
      value={value}
      onValueChange={setValue}
      options={[
        { value: "a", label: "1 an" },
        { value: "b", label: "5 ans" },
        { value: "c", label: "10 ans" },
      ]}
    />
  );
}

describe("<SegmentedControl />", () => {
  it("exposes a radio group and selects on click", async () => {
    render(<Harness />);
    expect(screen.getByRole("radiogroup", { name: "Période" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: "5 ans" }));
    expect(screen.getByRole("radio", { name: "5 ans" })).toBeChecked();
  });

  it("moves the selection with arrow keys (roving tabindex)", async () => {
    render(<Harness />);
    screen.getByRole("radio", { name: "1 an" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "5 ans" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "5 ans" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "10 ans" })).toBeChecked();
  });
});
