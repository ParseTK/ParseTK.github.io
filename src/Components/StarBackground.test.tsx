import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StarBackground } from "./StarBackground";
import { setReducedMotion, setScrollY } from "@/test/matchMedia";
import { fakeContext, pendingFrames, runFrame } from "@/test/canvas";
import { setSelection } from "@/style/store";

const positions = () => fakeContext().arcs.map((arc) => `${arc.x.toFixed(2)},${arc.y.toFixed(2)}`);
const alphas = () => fakeContext().arcs.map((arc) => arc.alpha);

const resizeTo = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
    Object.defineProperty(window, "innerHeight", { value: height, configurable: true, writable: true });
    act(() => {
        window.dispatchEvent(new Event("resize"));
    });
};

const renderSky = (width = 1000, height = 700) => {
    resizeTo(width, height);
    const view = render(<StarBackground />);
    act(() => runFrame(1000));
    return view;
};

describe("StarBackground", () => {
    it("is a canvas hidden from assistive technology", () => {
        const { container } = renderSky();

        const canvas = container.querySelector("canvas");
        expect(canvas).not.toBeNull();
        expect(canvas).toHaveAttribute("aria-hidden", "true");
    });

    it("draws stars in proportion to the screen area, in the mode's star color", () => {
        renderSky(1000, 700);

        expect(Math.abs(fakeContext().arcs.length - (1000 * 700) / 7000)).toBeLessThanOrEqual(2);
        expect(fakeContext().arcs[0].fillStyle).toBe("rgb(255, 255, 255)");
    });

    it("caps the canvas sharpness at twice the screen size", () => {
        Object.defineProperty(window, "devicePixelRatio", { value: 3, configurable: true });
        const { container } = renderSky(400, 800);

        expect(container.querySelector("canvas")!.width).toBe(800);
        expect(fakeContext().transform).toEqual([2, 0, 0, 2, 0, 0]);
        Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
    });

    it("keeps every star where it is when only the height changes, like a phone address bar", () => {
        renderSky(400, 800);
        const before = positions();

        resizeTo(400, 700);
        act(() => runFrame(2000));

        expect(positions()).toEqual(before);
    });

    it("draws a new star field when the width changes", () => {
        renderSky(400, 800);
        const before = positions();

        resizeTo(800, 800);
        act(() => runFrame(2000));

        expect(positions()).not.toEqual(before);
    });

    it("keeps twinkling frame after frame", () => {
        renderSky();
        const first = alphas();

        act(() => runFrame(2500));

        expect(alphas()).not.toEqual(first);
        expect(pendingFrames()).toBe(1);
    });

    it("moves the stars with the scroll", () => {
        renderSky();
        const before = positions();

        setScrollY(600);
        act(() => runFrame(1100));

        expect(positions()).not.toEqual(before);
    });

    it("stops animating when the page goes away", () => {
        const { unmount } = renderSky();

        unmount();

        expect(pendingFrames()).toBe(0);
    });

    it("draws one still sky with no animation when reduced motion is on", () => {
        setReducedMotion(true);
        renderSky();
        const before = [positions(), alphas()];

        setScrollY(600);

        expect(pendingFrames()).toBe(0);
        expect(before[0].length).toBeGreaterThan(0);
        expect(new Set<unknown>(before[1]).size).toBe(1);
        expect([positions(), alphas()]).toEqual(before);
    });

    it("switches to a still sky when reduced motion is turned on", () => {
        renderSky();
        expect(pendingFrames()).toBe(1);

        setReducedMotion(true);

        expect(pendingFrames()).toBe(0);
        expect(fakeContext().arcs.length).toBeGreaterThan(0);
    });

    it("shows no stars in a mode without a star color", () => {
        setSelection({ mode: "light" });

        const { container } = renderSky();

        expect(container.querySelector("canvas")).toBeNull();
        expect(pendingFrames()).toBe(0);
    });

    it("brings the stars back when the mode changes to one with stars", () => {
        setSelection({ mode: "light" });
        const { container } = renderSky();

        act(() => setSelection({ mode: "dark" }));

        expect(container.querySelector("canvas")).not.toBeNull();
    });
});

describe("StarBackground cost", () => {
    const draws = () => fakeContext().clears;

    it("redraws about 15 times a second instead of on every frame", () => {
        renderSky();
        const before = draws();

        // One second of 60-per-second frames
        for (let frame = 1; frame <= 60; frame++) act(() => runFrame(1000 + frame * (1000 / 60)));

        const redrawn = draws() - before;
        expect(redrawn).toBeGreaterThanOrEqual(13);
        expect(redrawn).toBeLessThanOrEqual(17);
    });

    it("still keeps asking for the next frame, so the twinkle carries on", () => {
        renderSky();

        act(() => runFrame(1010));

        expect(pendingFrames()).toBe(1);
    });

    it("skips a frame that comes too soon when nothing has changed", () => {
        renderSky();
        const before = draws();

        act(() => runFrame(1010));

        expect(draws()).toBe(before);
    });

    it("redraws at once when the page scrolls, even between the throttled frames", () => {
        renderSky();
        const before = draws();

        setScrollY(300);
        act(() => runFrame(1010));

        expect(draws()).toBe(before + 1);
    });

    it("redraws at once after the width changes, without waiting for the next slot", () => {
        renderSky(400, 800);
        const before = draws();

        resizeTo(500, 800);
        act(() => runFrame(1010));

        expect(draws()).toBe(before + 1);
    });

    it("draws one still sky, not a stream of frames, when motion is reduced", () => {
        setReducedMotion(true);
        renderSky();
        const before = draws();

        for (let frame = 1; frame <= 10; frame++) act(() => runFrame(1000 + frame * 16));

        expect(draws()).toBe(before);
        expect(pendingFrames()).toBe(0);
    });
});

describe("StarBackground canvas size", () => {
    afterEach(() => {
        Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
    });

    const pixels = (container: HTMLElement) => {
        const canvas = container.querySelector("canvas")!;
        return canvas.width * canvas.height;
    };

    it("is held to a few million pixels on a big, sharp screen", () => {
        Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true });
        const { container } = renderSky(1920, 1080);

        expect(pixels(container)).toBeLessThanOrEqual(3_000_000 * 1.01);
        expect(pixels(container)).toBeGreaterThan(1920 * 1080);
    });

    it("is never smaller than the screen it covers, however large the screen", () => {
        const { container } = renderSky(3840, 2160);

        const canvas = container.querySelector("canvas")!;
        expect(canvas.width).toBe(3840);
        expect(canvas.height).toBe(2160);
    });

    it("is left alone on an ordinary phone screen", () => {
        Object.defineProperty(window, "devicePixelRatio", { value: 3, configurable: true });
        const { container } = renderSky(390, 844);

        expect(container.querySelector("canvas")!.width).toBe(780);
    });
});
