import { act, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StarBackground } from "./StarBackground";

const starPositions = (container: HTMLElement) =>
    [...container.querySelectorAll<HTMLElement>(".star")].map((star) => `${star.style.left},${star.style.top}`);

const resizeTo = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
    Object.defineProperty(window, "innerHeight", { value: height, configurable: true, writable: true });
    act(() => {
        window.dispatchEvent(new Event("resize"));
    });
};

describe("StarBackground", () => {
    it("is hidden from assistive technology", () => {
        const { container } = render(<StarBackground />);

        expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("draws stars in proportion to the screen area", () => {
        resizeTo(1000, 700);
        const { container } = render(<StarBackground />);

        expect(container.querySelectorAll(".star")).toHaveLength(Math.floor((1000 * 700) / 7000));
    });

    it("keeps every star where it is when only the height changes, like a phone address bar", () => {
        resizeTo(400, 800);
        const { container } = render(<StarBackground />);
        const before = starPositions(container);

        resizeTo(400, 700);

        expect(starPositions(container)).toEqual(before);
    });

    it("draws a new star field when the width changes", () => {
        resizeTo(400, 800);
        const { container } = render(<StarBackground />);
        const before = starPositions(container);

        resizeTo(800, 800);

        expect(starPositions(container)).not.toEqual(before);
    });
});
