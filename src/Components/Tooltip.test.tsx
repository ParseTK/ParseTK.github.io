import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";
import { axe } from "@/test/axe";

const renderTip = (props: Partial<React.ComponentProps<typeof Tooltip>> = {}) => {
    const view = render(
        <Tooltip label="Do the thing" {...props}>
            <button type="button" aria-label="Do the thing">
                icon
            </button>
        </Tooltip>,
    );
    const button = screen.getByRole("button", { name: "Do the thing" });
    const tip = view.container.querySelector<HTMLElement>("[data-tooltip]")!;
    return { ...view, button, tip };
};

// Answers the keyboard-focus question as the test says and everything else as normal, so other lookups still work
const stubFocusVisible = (answer: boolean) => {
    const original = Element.prototype.matches;
    vi.spyOn(Element.prototype, "matches").mockImplementation(function (this: Element, selector: string) {
        return selector === ":focus-visible" ? answer : original.call(this, selector);
    });
};

const isShown = (tip: HTMLElement) => tip.classList.contains("visible") && tip.classList.contains("opacity-100");

// React works out "pointer entered" from over and out events, so send those, with the kind of pointer
const pointer = (target: Element, type: "pointerover" | "pointerout", pointerType: string) => {
    const event = new MouseEvent(type, { bubbles: true, relatedTarget: type === "pointerout" ? document.body : null });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    act(() => {
        target.dispatchEvent(event);
    });
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe("Tooltip", () => {
    it("starts hidden and holds the label", () => {
        const { tip } = renderTip();

        expect(tip).toHaveTextContent("Do the thing");
        expect(isShown(tip)).toBe(false);
        expect(tip).toHaveClass("invisible", "opacity-0");
    });

    it("is only for the eye: hidden from assistive technology, so the name is not read twice", () => {
        const { tip, button } = renderTip();

        expect(tip).toHaveAttribute("aria-hidden", "true");
        expect(button).toHaveAccessibleName("Do the thing");
        expect(button).not.toHaveAttribute("aria-describedby");
    });

    it("shows while a mouse is over the control and hides when it leaves", () => {
        const { tip, button } = renderTip();

        pointer(button, "pointerover", "mouse");
        expect(isShown(tip)).toBe(true);

        pointer(button, "pointerout", "mouse");
        expect(isShown(tip)).toBe(false);
    });

    it("does not show for a finger or a pen, which cannot hover", () => {
        const { tip, button } = renderTip();

        pointer(button, "pointerover", "touch");
        expect(isShown(tip)).toBe(false);
        pointer(button, "pointerover", "pen");
        expect(isShown(tip)).toBe(false);
    });

    it("stays open while the pointer moves from the control onto the label", () => {
        const { tip } = renderTip({ placement: "top" });

        // The label's own box touches the control (its padding bridges the gap), and it is inside the same hover area
        expect(tip).toHaveClass("pb-2");
        expect(tip.closest("span")!.parentElement).toBe(tip.parentElement);
        expect(tip.querySelector("span")!.parentElement).toBe(tip);
    });

    it("shows on keyboard focus and hides on blur", () => {
        stubFocusVisible(true);
        const { tip, button } = renderTip();

        act(() => button.focus());
        expect(isShown(tip)).toBe(true);

        act(() => button.blur());
        expect(isShown(tip)).toBe(false);
    });

    it("does not show when focus came from a mouse click", () => {
        stubFocusVisible(false);
        const { tip, button } = renderTip();

        act(() => button.focus());

        expect(isShown(tip)).toBe(false);
    });

    it("hides on Escape without letting that same Escape reach the page, so it does not also close a panel", () => {
        const onWindowKey = vi.fn();
        window.addEventListener("keydown", onWindowKey);
        const { tip, button } = renderTip();
        pointer(button, "pointerover", "mouse");
        expect(isShown(tip)).toBe(true);

        fireEvent.keyDown(button, { key: "Escape" });

        expect(isShown(tip)).toBe(false);
        expect(onWindowKey).not.toHaveBeenCalled();
        window.removeEventListener("keydown", onWindowKey);
    });

    it("hides on Escape even when the label was opened by the mouse and focus is somewhere else", () => {
        const onWindowKey = vi.fn();
        window.addEventListener("keydown", onWindowKey);
        const { tip, button } = renderTip();
        pointer(button, "pointerover", "mouse");
        expect(button).not.toHaveFocus();

        fireEvent.keyDown(document.body, { key: "Escape" });

        expect(isShown(tip)).toBe(false);
        expect(onWindowKey).not.toHaveBeenCalled();
        window.removeEventListener("keydown", onWindowKey);
    });

    it("ignores other keys while showing, and stops listening once hidden", () => {
        const onWindowKey = vi.fn();
        window.addEventListener("keydown", onWindowKey);
        const { tip, button } = renderTip();
        pointer(button, "pointerover", "mouse");

        fireEvent.keyDown(document.body, { key: "a" });
        expect(isShown(tip)).toBe(true);

        fireEvent.keyDown(document.body, { key: "Escape" });
        fireEvent.keyDown(document.body, { key: "Escape" });
        expect(onWindowKey).toHaveBeenCalledTimes(2);
        window.removeEventListener("keydown", onWindowKey);
    });

    it("lets Escape through when no label is showing", () => {
        const onWindowKey = vi.fn();
        window.addEventListener("keydown", onWindowKey);
        const { button } = renderTip();

        fireEvent.keyDown(button, { key: "Escape" });

        expect(onWindowKey).toHaveBeenCalledTimes(1);
        window.removeEventListener("keydown", onWindowKey);
    });

    it("sits above or below the control, and at the middle or the end of it", () => {
        const above = renderTip();
        expect(above.tip).toHaveClass("bottom-full", "left-1/2");
        above.unmount();

        const below = renderTip({ placement: "bottom", align: "end" });
        expect(below.tip).toHaveClass("top-full", "pt-2", "right-0");
        expect(below.tip.className).not.toContain("left-1/2");
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = renderTip();

        expect(await axe(container)).toHaveNoViolations();
    });
});
