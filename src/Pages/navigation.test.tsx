import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import { SECTIONS } from "@/data/sections";
import { setViewportWidth } from "@/test/matchMedia";

const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

const sectionIdsOnPage = () =>
    [...document.querySelectorAll<HTMLElement>("main > section")].map((section) => section.id);

afterEach(() => {
    vi.restoreAllMocks();
});

describe("section order", () => {
    it("puts the sections on the page in the registry order, after the hero", () => {
        render(<Home />);

        expect(sectionIdsOnPage()).toEqual(["hero", ...SECTIONS.map((section) => section.id)]);
        expect(sectionIdsOnPage().slice(1)).toEqual(["projects", "skills", "about", "contact"]);
    });

    it("lists the same sections, in the same order, in the desktop navigation", () => {
        setViewportWidth(1280);
        render(<Home />);

        const links = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link");
        const sectionLinks = links.slice(1);
        expect(sectionLinks.map((link) => link.getAttribute("href"))).toEqual(
            SECTIONS.map((section) => `#${section.id}`),
        );
        expect(sectionLinks.map((link) => link.textContent)).toEqual(SECTIONS.map((section) => section.label));
    });

    it("lists them in the same order in the mobile menu", () => {
        render(<Home />);

        const links = within(screen.getByRole("navigation", { name: "Mobile", hidden: true })).getAllByRole("link", {
            hidden: true,
        });
        expect(links.map((link) => link.getAttribute("href"))).toEqual(SECTIONS.map((section) => `#${section.id}`));
    });

    it("has no Home link and sends the logo to the top of the page", () => {
        render(<Home />);

        expect(screen.queryByRole("link", { name: "Home", hidden: true })).toBeNull();
        const logo = within(screen.getByRole("navigation", { name: "Primary" })).getAllByRole("link")[0];
        expect(logo).toHaveTextContent("ParseTK");
        expect(logo).toHaveAttribute("href", "#hero");
    });

    it("points every navigation link at a section that exists", () => {
        render(<Home />);

        for (const { id } of SECTIONS) {
            expect(document.getElementById(id), id).not.toBeNull();
        }
    });
});

describe("Scroll cue in the hero", () => {
    it("is a real link to the first section, named for where it goes", () => {
        render(<Home />);

        const cue = screen.getByRole("link", { name: "Scroll to Projects" });
        expect(cue).toHaveAttribute("href", "#projects");
        expect(cue).toHaveTextContent("Scroll");
    });

    it("points down and bounces", () => {
        render(<Home />);

        const arrow = screen.getByRole("link", { name: "Scroll to Projects" }).querySelector("svg")!;
        expect(arrow).toHaveClass("lucide-arrow-down", "animate-bounce");
    });
});

describe("Top button", () => {
    it("is the last thing on the page, after all the sections", () => {
        render(<Home />);

        const top = screen.getByRole("button", { name: "Back to top" });
        const main = screen.getByRole("main");
        expect(main.compareDocumentPosition(top) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        const footer = top.closest("footer")!;
        expect(footer.nextElementSibling).toBeNull();
    });

    it("shows the label Top with an arrow that points up and bounces the mirrored way", () => {
        render(<Home />);

        const top = screen.getByRole("button", { name: "Back to top" });
        expect(top).toHaveTextContent("Top");
        expect(top.querySelector("svg")).toHaveClass("lucide-arrow-up", "animate-bounce-up");
    });

    it("scrolls to the top of the page and moves focus back to the start of it", () => {
        const scrollTo = vi.fn();
        window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
        const { container } = render(<Home />);
        const top = screen.getByRole("button", { name: "Back to top" });
        top.focus();

        fireEvent.click(top);

        expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
        expect(container.firstElementChild).toHaveFocus();
        expect(container.firstElementChild).toHaveAttribute("tabindex", "-1");
    });

    it("lets the smooth scrolling setting decide how it scrolls, so reduced motion jumps", () => {
        const scrollTo = vi.fn();
        window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
        render(<Home />);

        fireEvent.click(screen.getByRole("button", { name: "Back to top" }));

        expect(scrollTo.mock.calls[0][0]).not.toHaveProperty("behavior", "smooth");
        expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*html \{\s*scroll-behavior: smooth;/);
    });

    it("is out of reach while the mobile menu covers the page", () => {
        setViewportWidth(375);
        render(<Home />);

        fireEvent.click(screen.getByRole("button", { name: "Site menu" }));

        expect(screen.getByRole("button", { name: "Back to top" }).closest("footer")).toHaveAttribute("inert");
    });
});

describe("bounce animations in CSS", () => {
    it("has a mirrored bounce for the up arrow", () => {
        expect(css).toContain("--animate-bounce-up: bounce-up");
        const keyframes = /@keyframes bounce-up \{[\s\S]*?\n\}\n/.exec(css)![0];
        expect(keyframes).toContain("translateY(25%)");
        expect(keyframes).toContain("transform: none");
    });
});
