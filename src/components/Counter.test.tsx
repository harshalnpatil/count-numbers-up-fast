import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Counter from "./Counter";

function installSyncRaf(fps = 33) {
  const frame = 1000 / fps;
  let t = 0;
  vi.spyOn(performance, "now").mockImplementation(() => t);
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    t += frame;
    cb(t);
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", () => {});
}

describe("Counter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders title", () => {
    render(<Counter />);
    expect(screen.getByText(/Let's Count!/i)).toBeInTheDocument();
  });

  it("disables Go when target is empty or zero", () => {
    render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "" },
    });
    expect(screen.getByRole("button", { name: /Go!/i })).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "0" },
    });
    expect(screen.getByRole("button", { name: /Go!/i })).toBeDisabled();
  });

  it("runs to completion and shows Done when target is reached", () => {
    const fps = 33;
    const frame = 1000 / fps;
    let t = 0;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      t += frame;
      cb(t);
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    const { container } = render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));

    expect(container.querySelector(".counter-display")).toHaveTextContent(
      (3).toLocaleString(),
    );
    expect(screen.getByText(/Done!/i)).toBeInTheDocument();
  });

  it("resets count and hides Done after Again", () => {
    installSyncRaf();

    const { container } = render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));
    expect(screen.getByText(/Done!/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Again/i }));
    expect(container.querySelector(".counter-display")).toHaveTextContent(
      (0).toLocaleString(),
    );
    expect(screen.queryByText(/Done!/i)).not.toBeInTheDocument();
  });

  it("pauses and preserves count; resume can reach Done", () => {
    const fps = 33;
    const frame = 1000 / fps;
    let t = 0;
    vi.spyOn(performance, "now").mockImplementation(() => t);

    let rafCalls = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCalls += 1;
      if (rafCalls <= 2) {
        t += frame;
        cb(t);
      }
      return rafCalls;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    const { container } = render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "5" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));

    expect(screen.getByRole("button", { name: /Wait/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Wait/i }));

    const display = container.querySelector(".counter-display");
    expect(display).toHaveTextContent((2).toLocaleString());
    expect(screen.queryByText(/Done!/i)).not.toBeInTheDocument();

    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      t += frame;
      cb(t);
      return 1;
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));

    expect(screen.getByText(/Done!/i)).toBeInTheDocument();
  });

  it("ignores target input that contains non-digits", () => {
    render(<Counter />);
    const input = screen.getByPlaceholderText("100");
    fireEvent.change(input, { target: { value: "50x" } });
    expect(input).toHaveValue("100");
  });

  it("accepts comma-separated digits in target input", () => {
    render(<Counter />);
    const input = screen.getByPlaceholderText("100");
    fireEvent.change(input, { target: { value: "1,234" } });
    expect(input).toHaveValue((1234).toLocaleString());
  });

  it("disables Again when count is zero and not paused", () => {
    render(<Counter />);
    expect(screen.getByRole("button", { name: /Again/i })).toBeDisabled();
  });

  it("disables target input while counting", () => {
    let t = 0;
    const fps = 33;
    const frame = 1000 / fps;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    let rafCalls = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCalls += 1;
      if (rafCalls <= 1) {
        t += frame;
        cb(t);
      }
      return rafCalls;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    render(<Counter />);
    const input = screen.getByPlaceholderText("100");
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));
    expect(input).toBeDisabled();
  });

  it("opens settings and updates fps input", () => {
    render(<Counter />);
    fireEvent.click(screen.getByRole("button", { name: /Settings/i }));
    const fpsInput = screen.getByDisplayValue("33");
    fireEvent.change(fpsInput, { target: { value: "60" } });
    expect(fpsInput).toHaveValue(60);
  });

  it("cancels pending animation on unmount", () => {
    const cancelSpy = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
    let t = 0;
    const fps = 33;
    const frame = 1000 / fps;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    let rafCalls = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCalls += 1;
      if (rafCalls <= 2) {
        t += frame;
        cb(t);
      }
      return rafCalls;
    });

    const { unmount } = render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "99" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it("calls cancelAnimationFrame when resetting during a run", () => {
    const cancelSpy = vi.fn();
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
    let t = 0;
    const fps = 33;
    const frame = 1000 / fps;
    vi.spyOn(performance, "now").mockImplementation(() => t);
    let rafCalls = 0;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCalls += 1;
      if (rafCalls <= 3) {
        t += frame;
        cb(t);
      }
      return rafCalls;
    });

    render(<Counter />);
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Go!/i }));
    fireEvent.click(screen.getByRole("button", { name: /Again/i }));
    expect(cancelSpy).toHaveBeenCalled();
  });
});
