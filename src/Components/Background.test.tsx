import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GrainOverlay } from "./GrainOverlay";
import { Glow } from "./Glow";
import Home from "@/Pages/Home";

const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

describe("GrainOverlay", () => {
    it("is a decorative layer that cannot be clicked and carries the noise image", () => {
        const { container } = render(<GrainOverlay />);

        const layer = container.firstElementChild as HTMLElement;
        expect(layer).toHaveAttribute("aria-hidden", "true");
        expect(layer.className).toContain("pointer-events-none");
        expect(layer.style.backgroundImage).toContain("data:image/png");
    });
});

describe("Glow", () => {
    it("is hidden from assistive technology and takes its position from the caller", () => {
        const { container } = render(<Glow className="-left-10" />);

        const glow = container.firstElementChild as HTMLElement;
        expect(glow).toHaveAttribute("aria-hidden", "true");
        expect(glow).toHaveClass("glow", "-left-10");
    });
});

describe("Page background", () => {
    it("puts exactly two glows on the page, one in the hero and one in the projects section", () => {
        const { container } = render(<Home />);

        expect(container.querySelectorAll(".glow")).toHaveLength(2);
        expect(document.querySelector("#hero .glow")).not.toBeNull();
        expect(document.querySelector("#projects .glow")).not.toBeNull();
    });

    it("keeps each glow behind its section's content", () => {
        render(<Home />);

        for (const id of ["hero", "projects"]) {
            expect(document.getElementById(id)!.className).toContain("isolate");
        }
    });

    it("follows the accent color instead of a fixed one", () => {
        expect(css).toContain("color-mix(in srgb, var(--primary) var(--glow-strength)");
    });
});
