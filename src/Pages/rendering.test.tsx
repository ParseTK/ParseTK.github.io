import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "./Home";
import { setViewportWidth } from "@/test/matchMedia";

// Stand-ins that count how many times React draws them, to see whether a change on the page redraws them
const renders = vi.hoisted(() => ({ contact: 0, skills: 0 }));

vi.mock("@/Components/ContactSection", async () => {
    const { createElement } = await import("react");
    return {
        ContactSection: () => {
            renders.contact += 1;
            return createElement("section", { id: "contact" });
        },
    };
});

vi.mock("@/Components/SkillsSection", async () => {
    const { createElement } = await import("react");
    return {
        SkillsSection: () => {
            renders.skills += 1;
            return createElement("section", { id: "skills" });
        },
    };
});

describe("what a panel opening costs", () => {
    it("does not draw the page's sections again when the style panel opens and closes", () => {
        render(<Home />);
        const afterFirstDraw = { ...renders };
        expect(afterFirstDraw.contact).toBeGreaterThan(0);

        const button = screen.getByRole("button", { name: "Style options" });
        fireEvent.click(button);
        fireEvent.click(button);

        expect(renders).toEqual(afterFirstDraw);
    });

    it("does not draw them again when the phone menu opens and closes", () => {
        setViewportWidth(375);
        render(<Home />);
        const afterFirstDraw = { ...renders };

        const button = screen.getByRole("button", { name: "Site menu" });
        fireEvent.click(button);
        fireEvent.click(button);

        expect(renders).toEqual(afterFirstDraw);
    });

    it("does not draw them again when the window is resized across the desktop breakpoint", () => {
        render(<Home />);
        const afterFirstDraw = { ...renders };

        setViewportWidth(375);
        setViewportWidth(1280);

        expect(renders).toEqual(afterFirstDraw);
    });
});
