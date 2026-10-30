import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";
import { setReducedMotion } from "@/test/matchMedia";

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callbacks: Callback[] = [];
let disconnects = 0;

const installObserver = () => {
    callbacks = [];
    disconnects = 0;
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            constructor(callback: Callback) {
                callbacks.push(callback);
            }
            observe() {}
            disconnect() {
                disconnects += 1;
            }
        },
    );
};

const enter = (isIntersecting: boolean) => act(() => callbacks.forEach((callback) => callback([{ isIntersecting }])));

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("Reveal", () => {
    it("starts hidden and lowered, then fades up the first time it is seen", () => {
        installObserver();
        render(<Reveal>content</Reveal>);
        const box = screen.getByText("content");

        expect(box).toHaveClass("opacity-0", "translate-y-6");

        enter(false);
        expect(box).toHaveClass("opacity-0");

        enter(true);
        expect(box).not.toHaveClass("opacity-0");
        expect(box).not.toHaveClass("translate-y-6");
    });

    it("stops watching once it has been shown, and never hides again", () => {
        installObserver();
        render(<Reveal>content</Reveal>);

        enter(true);

        expect(disconnects).toBeGreaterThan(0);
        enter(false);
        expect(screen.getByText("content")).not.toHaveClass("opacity-0");
    });

    it("keeps its content in the page and readable by assistive technology while hidden", () => {
        installObserver();
        render(
            <Reveal>
                <button type="button">Press</button>
            </Reveal>,
        );

        expect(screen.getByRole("button", { name: "Press" })).toBeInTheDocument();
    });

    it("shows straight away when reduced motion is on", () => {
        installObserver();
        setReducedMotion(true);
        render(<Reveal>content</Reveal>);

        expect(screen.getByText("content")).not.toHaveClass("opacity-0");
        expect(callbacks).toHaveLength(0);
    });

    it("shows when reduced motion is turned on while it is still hidden", () => {
        installObserver();
        render(<Reveal>content</Reveal>);
        expect(screen.getByText("content")).toHaveClass("opacity-0");

        setReducedMotion(true);

        expect(screen.getByText("content")).not.toHaveClass("opacity-0");
    });

    it("shows straight away when the browser has no way to watch for scrolling", () => {
        vi.stubGlobal("IntersectionObserver", undefined);
        render(<Reveal>content</Reveal>);

        expect(screen.getByText("content")).not.toHaveClass("opacity-0");
    });

    it("passes extra classes to its box", () => {
        installObserver();
        render(<Reveal className="space-y-6">content</Reveal>);

        expect(screen.getByText("content")).toHaveClass("space-y-6");
    });
});
