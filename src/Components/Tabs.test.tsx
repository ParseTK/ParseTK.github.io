import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./Tabs";
import { axe } from "@/test/axe";

const TABS = [
    { id: "one", label: "One" },
    { id: "two", label: "Two" },
    { id: "three", label: "Three" },
];

const Harness = ({ initial = "one" }: { initial?: string }) => {
    const [selected, setSelected] = useState(initial);
    return (
        <Tabs label="Numbers" tabs={TABS} selectedId={selected} onSelect={setSelected}>
            <p>Content for {selected}</p>
        </Tabs>
    );
};

const tab = (name: string) => screen.getByRole("tab", { name });

describe("Tabs", () => {
    it("is a labelled tablist with one selected tab and a panel named by it", () => {
        render(<Harness />);

        expect(screen.getByRole("tablist", { name: "Numbers" })).toBeInTheDocument();
        expect(tab("One")).toHaveAttribute("aria-selected", "true");
        expect(tab("Two")).toHaveAttribute("aria-selected", "false");
        expect(screen.getByRole("tabpanel", { name: "One" })).toHaveTextContent("Content for one");
        expect(tab("One")).toHaveAttribute("aria-controls", screen.getByRole("tabpanel").id);
    });

    it("keeps only the selected tab in the tab order", () => {
        render(<Harness />);

        expect(tab("One")).toHaveAttribute("tabindex", "0");
        expect(tab("Two")).toHaveAttribute("tabindex", "-1");
        expect(tab("Three")).toHaveAttribute("tabindex", "-1");
    });

    it("selects a tab on click and shows its content", () => {
        render(<Harness />);

        fireEvent.click(tab("Two"));

        expect(tab("Two")).toHaveAttribute("aria-selected", "true");
        expect(tab("One")).toHaveAttribute("aria-selected", "false");
        expect(screen.getByRole("tabpanel", { name: "Two" })).toHaveTextContent("Content for two");
    });

    it("moves with the arrow keys, wraps around and moves focus with the selection", () => {
        render(<Harness />);
        tab("One").focus();

        fireEvent.keyDown(tab("One"), { key: "ArrowRight" });
        expect(tab("Two")).toHaveFocus();
        expect(tab("Two")).toHaveAttribute("aria-selected", "true");

        fireEvent.keyDown(tab("Two"), { key: "ArrowLeft" });
        fireEvent.keyDown(tab("One"), { key: "ArrowLeft" });
        expect(tab("Three")).toHaveFocus();

        fireEvent.keyDown(tab("Three"), { key: "ArrowRight" });
        expect(tab("One")).toHaveFocus();
    });

    it("jumps to the first and last tab with Home and End", () => {
        render(<Harness initial="two" />);

        fireEvent.keyDown(tab("Two"), { key: "End" });
        expect(tab("Three")).toHaveAttribute("aria-selected", "true");

        fireEvent.keyDown(tab("Three"), { key: "Home" });
        expect(tab("One")).toHaveAttribute("aria-selected", "true");
    });

    it("ignores other keys", () => {
        render(<Harness />);

        fireEvent.keyDown(tab("One"), { key: "a" });

        expect(tab("One")).toHaveAttribute("aria-selected", "true");
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = render(<Harness />);

        expect(await axe(container)).toHaveNoViolations();
    });
});

describe("Tabs and page position", () => {
    it("never scrolls anything into view, so choosing a tab cannot move the page sideways", () => {
        const scrollIntoView = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoView;
        render(<Harness />);

        fireEvent.click(tab("Three"));
        fireEvent.keyDown(tab("Three"), { key: "Home" });

        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it("wraps onto more lines on a narrow screen instead of scrolling sideways", () => {
        render(<Harness />);

        const list = screen.getByRole("tablist");
        expect(list).toHaveClass("flex-wrap");
        expect(list.className).not.toMatch(/overflow-x-(auto|scroll)/);
    });

    it("centres the tabs, on every line they wrap onto, to match the centred carousel below", () => {
        render(<Harness />);

        const list = screen.getByRole("tablist");
        expect(list).toHaveClass("justify-center");
        expect(list.className).not.toMatch(/justify-(start|between)/);
    });
});
