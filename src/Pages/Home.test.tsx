import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";
import { axe } from "@/test/axe";
import { setScrollY, setViewportWidth } from "@/test/matchMedia";

const MOBILE_WIDTH = 375;
const DESKTOP_WIDTH = 1280;

describe("Home page structure", () => {
    it("renders the skip link, the main landmark and every section", () => {
        render(<Home />);

        expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main");
        expect(screen.getByRole("main")).toHaveAttribute("id", "main");
        for (const id of ["hero", "about", "skills", "projects", "contact"]) {
            expect(document.getElementById(id), `section #${id}`).not.toBeNull();
        }
    });

    it("has one level one heading with a real space between the names", () => {
        render(<Home />);

        const headings = screen.getAllByRole("heading", { level: 1 });
        expect(headings).toHaveLength(1);
        expect(headings[0].textContent).toContain("Tyler Kirchner");
    });

    it("has no detectable accessibility violations on desktop", async () => {
        setViewportWidth(DESKTOP_WIDTH);
        const { container } = render(<Home />);

        expect(await axe(container)).toHaveNoViolations();
    });

    it("has no detectable accessibility violations on a phone", async () => {
        setViewportWidth(MOBILE_WIDTH);
        const { container } = render(<Home />);

        expect(await axe(container)).toHaveNoViolations();
    });
});

describe("Mobile menu", () => {
    const openMenu = () => {
        setViewportWidth(MOBILE_WIDTH);
        render(<Home />);
        const button = screen.getByRole("button", { name: "Site menu" });
        const menu = document.getElementById("mobile-menu") as HTMLElement;
        return { button, menu };
    };

    it("starts closed and out of the tab order", () => {
        const { button, menu } = openMenu();

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(menu).toHaveAttribute("inert");
    });

    it("opens, makes the page inert and locks scrolling", () => {
        const { button, menu } = openMenu();

        fireEvent.click(button);

        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(menu).not.toHaveAttribute("inert");
        expect(document.getElementById("main")).toHaveAttribute("inert");
        expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("inert");
        expect(document.documentElement.style.overflow).toBe("hidden");
    });

    it("closes on Escape, returns focus to the button and restores the page", () => {
        const { button, menu } = openMenu();
        fireEvent.click(button);

        fireEvent.keyDown(window, { key: "Escape" });

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(menu).toHaveAttribute("inert");
        expect(document.getElementById("main")).not.toHaveAttribute("inert");
        expect(document.documentElement.style.overflow).toBe("");
        expect(button).toHaveFocus();
    });

    it("closes when a menu link is chosen", () => {
        const { button, menu } = openMenu();
        fireEvent.click(button);

        const [firstLink] = menu.querySelectorAll("a");
        fireEvent.click(firstLink);

        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("closes and unlocks scrolling when the window grows to desktop size", () => {
        const { button } = openMenu();
        fireEvent.click(button);

        setViewportWidth(DESKTOP_WIDTH);

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(document.documentElement.style.overflow).toBe("");
    });
});

describe("Scroll behaviour", () => {
    it("gives the navbar its glass background only after scrolling past 10px", () => {
        render(<Home />);
        const nav = screen.getByRole("navigation", { name: "Primary" });

        expect(nav.className).not.toContain("backdrop-blur");

        setScrollY(50);
        expect(nav.className).toContain("backdrop-blur");

        setScrollY(0);
        expect(nav.className).not.toContain("backdrop-blur");
    });

    it("hides the scroll hint after 40px of scrolling and brings it back at the top", () => {
        render(<Home />);
        const hint = screen.getByText("Scroll").parentElement as HTMLElement;

        expect(hint.className).not.toContain("opacity-0");

        setScrollY(20);
        expect(hint.className).not.toContain("opacity-0");

        setScrollY(60);
        expect(hint.className).toContain("opacity-0");

        setScrollY(0);
        expect(hint.className).not.toContain("opacity-0");
    });
});
