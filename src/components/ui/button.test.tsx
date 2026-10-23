import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("<Button />", () => {
  it("fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Enregistrer</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and busy while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Calcul
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Calcul" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders its child when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/dashboard">Dashboard</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
  });
});
