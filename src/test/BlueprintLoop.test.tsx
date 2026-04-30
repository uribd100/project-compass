import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BlueprintLoop } from "@/components/BlueprintLoop";

describe("BlueprintLoop", () => {
  it("renders without crashing", () => {
    const { container } = render(<BlueprintLoop />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("is hidden from assistive tech (decorative background)", () => {
    const { container } = render(<BlueprintLoop />);
    const root = container.querySelector(".blueprint-loop");
    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("renders Hebrew room labels", () => {
    const { getByText } = render(<BlueprintLoop />);
    expect(getByText("סלון")).toBeInTheDocument();
    expect(getByText("מטבח")).toBeInTheDocument();
    expect(getByText("חדר שינה")).toBeInTheDocument();
  });

  it("renders ghost UI overlays by default", () => {
    const { getByText } = render(<BlueprintLoop />);
    expect(getByText("פרויקט פעיל")).toBeInTheDocument();
    expect(getByText("קומה בבנייה")).toBeInTheDocument();
    expect(getByText("התקדמות")).toBeInTheDocument();
    expect(getByText("משימות פתוחות")).toBeInTheDocument();
  });

  it("hides overlays when hideOverlays is true", () => {
    const { queryByText } = render(<BlueprintLoop hideOverlays />);
    expect(queryByText("פרויקט פעיל")).not.toBeInTheDocument();
  });

  it("applies dimmed class when dimmed prop is true", () => {
    const { container } = render(<BlueprintLoop dimmed />);
    expect(container.querySelector(".blueprint-loop")).toHaveClass("opacity-60");
  });

  it("applies a custom className", () => {
    const { container } = render(<BlueprintLoop className="my-custom-class" />);
    expect(container.querySelector(".blueprint-loop")).toHaveClass(
      "my-custom-class"
    );
  });

  it("includes both blueprint and isometric building SVG layers", () => {
    const { container } = render(<BlueprintLoop />);
    expect(container.querySelector(".bp-phase-blueprint")).toBeInTheDocument();
    expect(container.querySelector(".bp-phase-building")).toBeInTheDocument();
  });
});
