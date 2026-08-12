import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import LandingPage from "@/pages/LandingPage";

function renderLandingPage() {
  return render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>,
  );
}

describe("LandingPage", () => {
  it("renders the hero headline", () => {
    renderLandingPage();
    expect(
      screen.getByRole("heading", { level: 1, name: /lightning-forged/i }),
    ).toBeInTheDocument();
  });

  it("renders the primary call to action", () => {
    renderLandingPage();
    expect(screen.getByRole("link", { name: /create your first alias/i })).toBeInTheDocument();
  });

  it("renders the pricing section with both tiers", () => {
    renderLandingPage();
    expect(screen.getByText("Apprentice")).toBeInTheDocument();
    expect(screen.getByText("Einherjar")).toBeInTheDocument();
  });
});
