import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "./ProjectsSection";
import { CARDS_PER_CATEGORY, PROJECT_CATEGORIES } from "@/data/projects";
import { axe } from "@/test/axe";

const panel = () => screen.getByRole("tabpanel");
const slides = () => [...panel().querySelectorAll<HTMLElement>("[data-slide]")];
// Side cards are hidden from assistive technology on purpose, so look at all of them directly
const titles = () => slides().map((slide) => slide.querySelector("h3")!.textContent);

describe("ProjectsSection", () => {
    it("shows one tab per category, with Python selected first", () => {
        render(<ProjectsSection />);

        const tabs = screen.getAllByRole("tab");
        expect(tabs.map((tab) => tab.textContent)).toEqual(PROJECT_CATEGORIES.map((category) => category.label));
        expect(screen.getByRole("tab", { name: "Python" })).toHaveAttribute("aria-selected", "true");
    });

    it("puts the selected tab's cards in a carousel, real project first, then coming-soon cards", () => {
        render(<ProjectsSection />);

        expect(within(panel()).getByRole("region", { name: "Projects" })).toHaveAttribute(
            "aria-roledescription",
            "carousel",
        );
        expect(slides()).toHaveLength(CARDS_PER_CATEGORY);
        expect(titles()[0]).toBe("PaintJob");
        expect(titles()[1]).toBe("Coming soon");
        expect(within(slides()[0]).getByRole("heading", { name: "PaintJob" })).toBeInTheDocument();
    });

    it("switches the cards when another tab is chosen", () => {
        render(<ProjectsSection />);

        fireEvent.click(screen.getByRole("tab", { name: "C#" }));

        expect(titles()[0]).toBe("PhotoDemo");
        expect(titles()).not.toContain("PaintJob");
    });

    it("starts a tab on its first card, even after browsing another", () => {
        render(<ProjectsSection />);
        fireEvent.click(screen.getByRole("button", { name: "Next project" }));
        expect(screen.getByRole("status")).toHaveTextContent("project 2 of 5");

        fireEvent.click(screen.getByRole("tab", { name: "Applications" }));

        expect(screen.getByRole("status")).toHaveTextContent("HomeScreen, project 1 of 5");
    });

    it("lists the applications under their own tab", () => {
        render(<ProjectsSection />);

        fireEvent.click(screen.getByRole("tab", { name: "Applications" }));

        expect(titles().slice(0, 2)).toEqual(["HomeScreen", "FinTk"]);
    });

    it("gives every tab a full set of cards", () => {
        render(<ProjectsSection />);

        for (const { label } of PROJECT_CATEGORIES) {
            fireEvent.click(screen.getByRole("tab", { name: label }));
            expect(slides(), label).toHaveLength(CARDS_PER_CATEGORY);
        }
    });

    it("only lets keyboard users reach the links of the centred card", () => {
        render(<ProjectsSection />);
        fireEvent.click(screen.getByRole("tab", { name: "Applications" }));

        const links = within(panel()).getAllByRole("link");
        expect(links).toHaveLength(1);
        expect(links[0]).toHaveAccessibleName("HomeScreen source code on GitHub (opens in a new tab)");

        fireEvent.click(screen.getByRole("button", { name: "Next project" }));

        expect(within(panel()).getByRole("link")).toHaveAccessibleName(
            "FinTk source code on GitHub (opens in a new tab)",
        );
    });

    it("shows no images until some are supplied", () => {
        const { container } = render(<ProjectsSection />);

        for (const { label } of PROJECT_CATEGORIES) {
            fireEvent.click(screen.getByRole("tab", { name: label }));
            expect(container.querySelector("img"), label).toBeNull();
        }
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = render(<ProjectsSection />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
