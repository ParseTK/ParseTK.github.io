import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectsSection } from "./ProjectsSection";
import { CARDS_PER_CATEGORY, PROJECT_CATEGORIES } from "@/data/projects";
import { axe } from "@/test/axe";

const panel = () => screen.getByRole("tabpanel");
const cards = () => within(panel()).getAllByRole("article");

describe("ProjectsSection", () => {
    it("shows one tab per category, with Python selected first", () => {
        render(<ProjectsSection />);

        const tabs = screen.getAllByRole("tab");
        expect(tabs.map((tab) => tab.textContent)).toEqual(PROJECT_CATEGORIES.map((category) => category.label));
        expect(screen.getByRole("tab", { name: "Python" })).toHaveAttribute("aria-selected", "true");
    });

    it("shows the real project of the selected tab first, followed by coming-soon cards", () => {
        render(<ProjectsSection />);

        expect(cards()).toHaveLength(CARDS_PER_CATEGORY);
        expect(within(cards()[0]).getByRole("heading", { name: "PaintJob" })).toBeInTheDocument();
        expect(within(cards()[1]).getByRole("heading", { name: "Coming soon" })).toBeInTheDocument();
    });

    it("switches the cards when another tab is chosen", () => {
        render(<ProjectsSection />);

        fireEvent.click(screen.getByRole("tab", { name: "C#" }));

        expect(within(cards()[0]).getByRole("heading", { name: "PhotoDemo" })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "PaintJob" })).toBeNull();
    });

    it("lists the applications under their own tab", () => {
        render(<ProjectsSection />);

        fireEvent.click(screen.getByRole("tab", { name: "Applications" }));

        const titles = cards().map((card) => within(card).getByRole("heading").textContent);
        expect(titles.slice(0, 2)).toEqual(["HomeScreen", "FinTk"]);
    });

    it("gives every tab a full set of cards", () => {
        render(<ProjectsSection />);

        for (const { label } of PROJECT_CATEGORIES) {
            fireEvent.click(screen.getByRole("tab", { name: label }));
            expect(cards(), label).toHaveLength(CARDS_PER_CATEGORY);
        }
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
