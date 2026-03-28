import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("shows 404 and home link", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Return to Home/i })).toHaveAttribute(
      "href",
      "/",
    );
    err.mockRestore();
  });

  it("logs attempted path on mount", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/missing-route"]}>
        <NotFound />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(err).toHaveBeenCalledWith(
        "404 Error: User attempted to access non-existent route:",
        "/missing-route",
      );
    });

    err.mockRestore();
  });
});
