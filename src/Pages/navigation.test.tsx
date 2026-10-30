import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import { SECTIONS } from "@/data/sections";
import { setViewportWidth } from "@/test/matchMedia";

const projectFile = (path: string) => resolve(process.cwd(), path);
const css = readFileSync(projectFile("src/index.css"), "utf8");

const sectionIdsOnPage = () =>
    [...document.querySelectorAll<HTMLElement>("main > section")].map((section) => section.id);

afterEach(() => {
    vi.restoreAllMocks();
});

describe("section order", () => {
    it("puts the sections on the page in the registry order, after the hero", () => {
        render(<Home />);

        expect(sectionIdsOnPage()).toEqual(["hero", ...SECTIONS.map((section) => section.id)]);
        expect(sectionIdsOnPage().slice(1)).toEqual(["about", "projects", "skills", "contact"]);
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

        const cue = screen.getByRole("link", { name: "Scroll to About" });
        expect(cue).toHaveAttribute("href", "#about");
        expect(cue).toHaveTextContent("Scroll");
    });

    it("points down and bounces", () => {
        render(<Home />);

        const arrow = screen.getByRole("link", { name: "Scroll to About" }).querySelector("svg")!;
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

describe("Hero", () => {
    it("has the résumé download next to View My Projects, and only there", () => {
        render(<Home />);

        const resume = screen.getByRole("link", { name: "Download Résumé (PDF)" });
        const projects = screen.getByRole("link", { name: "View My Projects" });
        expect(screen.getAllByRole("link", { name: /résumé/i })).toHaveLength(1);
        expect(resume).toHaveAttribute("href", "/TKirchner_Resume_2027.pdf");
        expect(resume).toHaveAttribute("download");
        expect(resume.parentElement).toBe(projects.parentElement);
        expect(resume.closest("#hero")).not.toBeNull();
    });

    it("points at a résumé file that exists", () => {
        expect(existsSync(projectFile("public/TKirchner_Resume_2027.pdf"))).toBe(true);
    });

    it("is padded so the heading clears the fixed nav and the content clears the scroll cue", () => {
        render(<Home />);

        expect(document.getElementById("hero")).toHaveClass("pt-28", "pb-28", "min-h-svh");
    });

    it("lets the buttons wrap onto a second line on a narrow screen", () => {
        render(<Home />);

        const row = screen.getByRole("link", { name: "View My Projects" }).parentElement!;
        expect(row).toHaveClass("flex-wrap", "justify-center");
    });
});

describe("Scroll and Top controls", () => {
    it("keep the whole bounce of the arrow inside the control that can be pressed", () => {
        render(<Home />);

        // Tailwind steps are 4px: h-5 is a 20px arrow, and the bounce moves it by a quarter of its height
        const pixels = (className: string, prefix: string) =>
            Number(new RegExp(`\\b${prefix}-(\\d+)\\b`).exec(className)![1]) * 4;
        for (const control of [
            screen.getByRole("link", { name: /^Scroll to / }),
            screen.getByRole("button", { name: "Back to top" }),
        ]) {
            const arrow = control.querySelector("svg")!;
            const bounce = pixels(arrow.getAttribute("class")!, "h") / 4;

            expect(pixels(control.className, "py"), control.textContent!).toBeGreaterThan(bounce);
        }
    });
});

describe("Style button tooltip", () => {
    it("labels the palette button, below it and lined up with the screen's right edge", () => {
        render(<Home />);

        const button = screen.getByRole("button", { name: "Style options" });
        const tip = button.parentElement!.querySelector("[data-tooltip]")!;
        expect(tip).toHaveTextContent("Style options");
        expect(tip).toHaveClass("top-full", "right-0");
    });
});
