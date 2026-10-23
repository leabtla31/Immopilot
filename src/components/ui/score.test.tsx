import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Score, scoreBand } from "./score";

describe("scoreBand", () => {
  it.each([
    [92, "Excellent"],
    [80, "Très bon"],
    [65, "Correct"],
    [50, "Moyen"],
    [20, "Faible"],
  ])("%d → %s", (value, label) => {
    expect(scoreBand(value).label).toBe(label);
  });
});

describe("<Score />", () => {
  it("is exposed as an accessible meter", () => {
    render(<Score value={87} label="Score IA" />);
    const meter = screen.getByRole("meter", { name: /Score IA : 87 sur 100, excellent/ });
    expect(meter).toHaveAttribute("aria-valuenow", "87");
  });
});
