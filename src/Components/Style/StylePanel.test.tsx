import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/Pages/Home";
import { axe } from "@/test/axe";
import { setViewportWidth } from "@/test/matchMedia";
import { ACCENTS, MODES, TYPEFACES, accentColors } from "@/style/registry";

const MOBILE_WIDTH = 375;
const DESKTOP_WIDTH = 1280;

const setup = (width: number) => {
    setViewportWidth(width);
    render(<Home />);
    const button = screen.getByRole("button", { name: "Style options" });
    const panel = screen.getByRole("dialog", { hidden: true, name: "Style options" });
    return { button, panel };
};

describe("Style panel", () => {
    it("starts closed and out of the tab order", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(panel).toHaveAttribute("inert");
    });

    it("opens on click and moves focus into the panel", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);

        fireEvent.click(button);

        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(panel).not.toHaveAttribute("inert");
        expect(panel).toHaveFocus();
    });

    it("shows every registry option with its own preview", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        for (const option of [...MODES, ...TYPEFACES, ...ACCENTS]) {
            expect(within(panel).getByRole("radio", { name: option.label })).toBeInTheDocument();
        }
        for (const accent of ACCENTS) {
            const swatch = within(panel)
                .getByRole("radio", { name: accent.label })
                .parentElement!.querySelector<HTMLElement>("[style]");
            expect(swatch!.style.backgroundColor).not.toBe("");
        }
        const sample = within(panel)
            .getByRole("radio", { name: "Geometric" })
            .parentElement!.querySelector<HTMLElement>("[style*='Sora']");
        expect(sample).not.toBeNull();
    });

    it("marks the current choice for each group", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        expect(within(panel).getByRole("radio", { name: "Dark" })).toBeChecked();
        expect(within(panel).getByRole("radio", { name: "Grotesk" })).toBeChecked();
        expect(within(panel).getByRole("radio", { name: "Orange" })).toBeChecked();
    });

    it("applies and saves a mode, typeface and accent choice", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        fireEvent.click(within(panel).getByRole("radio", { name: "Light" }));
        fireEvent.click(within(panel).getByRole("radio", { name: "Geometric" }));
        fireEvent.click(within(panel).getByRole("radio", { name: "Mint" }));

        const root = document.documentElement;
        expect(root).toHaveClass("light");
        expect(root.style.getPropertyValue("--style-font-heading")).toContain("Sora");
        expect(root.style.getPropertyValue("--primary")).toBe(accentColors("mint", "light").color);
        expect(JSON.parse(localStorage.getItem("style")!).selection).toEqual({
            mode: "light",
            typeface: "geometric",
            accent: "mint",
        });
    });

    it("shows accent swatches in the colors of the current mode", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        fireEvent.click(within(panel).getByRole("radio", { name: "Light" }));

        const swatch = within(panel)
            .getByRole("radio", { name: "Ice" })
            .parentElement!.querySelector<HTMLElement>("[style]")!;
        expect(swatch.style.backgroundColor).toBe("rgb(3, 105, 161)");
    });

    it("resets to the defaults", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);
        fireEvent.click(within(panel).getByRole("radio", { name: "Light" }));

        fireEvent.click(within(panel).getByRole("button", { name: "Reset to defaults" }));

        expect(document.documentElement).toHaveClass("dark");
        expect(within(panel).getByRole("radio", { name: "Dark" })).toBeChecked();
    });

    it("closes on Escape and returns focus to the button", () => {
        const { button, panel } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        fireEvent.keyDown(window, { key: "Escape" });

        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(panel).toHaveAttribute("inert");
        expect(button).toHaveFocus();
    });

    it("closes when the button is pressed again", () => {
        const { button } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        fireEvent.click(button);

        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on a press outside on desktop and leaves the page usable", () => {
        const { button } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);
        expect(document.getElementById("main")).not.toHaveAttribute("inert");
        expect(document.documentElement.style.overflow).toBe("");

        fireEvent.pointerDown(document.getElementById("main")!);

        expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("is a full-screen sheet on a phone: page inert, scroll locked, restored on close", () => {
        const { button } = setup(MOBILE_WIDTH);

        fireEvent.click(button);

        expect(document.getElementById("main")).toHaveAttribute("inert");
        expect(document.documentElement.style.overflow).toBe("hidden");

        fireEvent.keyDown(window, { key: "Escape" });

        expect(document.getElementById("main")).not.toHaveAttribute("inert");
        expect(document.documentElement.style.overflow).toBe("");
    });

    it("does not close on an outside press on a phone", () => {
        const { button } = setup(MOBILE_WIDTH);
        fireEvent.click(button);

        fireEvent.pointerDown(document.getElementById("main")!);

        expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("never shows the mobile menu and the style panel together", () => {
        setViewportWidth(MOBILE_WIDTH);
        render(<Home />);
        const menuButton = screen.getByRole("button", { name: "Site menu" });
        const styleButton = screen.getByRole("button", { name: "Style options" });

        fireEvent.click(menuButton);
        fireEvent.click(styleButton);

        expect(menuButton).toHaveAttribute("aria-expanded", "false");
        expect(styleButton).toHaveAttribute("aria-expanded", "true");
    });

    it("has no detectable accessibility violations while open", async () => {
        const { button } = setup(DESKTOP_WIDTH);
        fireEvent.click(button);

        expect(await axe(document.body)).toHaveNoViolations();
    });
});
