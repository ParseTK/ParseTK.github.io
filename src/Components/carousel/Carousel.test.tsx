import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Carousel } from "./Carousel";
import { axe } from "@/test/axe";
import { setReducedMotion } from "@/test/matchMedia";

interface Item {
    id: string;
    title: string;
}

const makeItems = (count: number): Item[] =>
    Array.from({ length: count }, (_, index) => ({ id: `item-${index + 1}`, title: `Item ${index + 1}` }));

const renderCarousel = (count = 5, onLink = vi.fn()) => {
    const view = render(
        <Carousel
            label="Things"
            noun="thing"
            items={makeItems(count)}
            getKey={(item) => item.id}
            getTitle={(item) => item.title}
            renderItem={(item) => (
                <a href={`#${item.id}`} onClick={onLink}>
                    Open {item.title}
                </a>
            )}
        />,
    );
    const stage = screen.getByRole("region", { name: "Things" });
    const slides = () => [...stage.querySelectorAll<HTMLElement>("[data-slide]")];
    const current = () => slides().findIndex((slide) => !slide.hasAttribute("aria-hidden")) + 1;
    return { ...view, stage, slides, current, onLink };
};

// Real pointer events, with timestamps we control so flicks and slow drags are exact
const pointer = (target: Element, type: string, x: number, time: number, y = 0) => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y });
    Object.defineProperties(event, {
        pointerId: { value: 1 },
        pointerType: { value: "touch" },
        timeStamp: { value: time },
    });
    act(() => {
        target.dispatchEvent(event);
    });
    return event;
};

const drag = (target: Element, from: number, to: number, duration: number, steps = 6) => {
    pointer(target, "pointerdown", from, 0);
    for (let step = 1; step <= steps; step++) {
        pointer(target, "pointermove", from + ((to - from) * step) / steps, (duration * step) / steps);
    }
    pointer(target, "pointerup", to, duration);
};

describe("Carousel structure", () => {
    it("is a labelled carousel whose slides say where they are", () => {
        const { stage, slides } = renderCarousel();

        expect(stage).toHaveAttribute("aria-roledescription", "carousel");
        expect(slides()).toHaveLength(5);
        expect(slides()[0]).toHaveAttribute("aria-label", "Item 1, 1 of 5");
        expect(slides()[0]).toHaveAttribute("role", "group");
        expect(slides()[0]).toHaveAttribute("aria-roledescription", "slide");
    });

    it("exposes only the centred card to assistive technology and the keyboard", () => {
        const { slides } = renderCarousel();

        expect(slides()[0]).not.toHaveAttribute("aria-hidden");
        expect(slides()[0].firstElementChild).not.toHaveAttribute("inert");
        for (const slide of slides().slice(1)) {
            expect(slide).toHaveAttribute("aria-hidden", "true");
            expect(slide.firstElementChild).toHaveAttribute("inert");
        }
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });

    it("announces the position in a status message and shows it as text and dots", () => {
        renderCarousel();

        expect(screen.getByRole("status")).toHaveTextContent("Item 1, thing 1 of 5");
        expect(screen.getByText("1 of 5")).toBeInTheDocument();
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = renderCarousel();

        expect(await axe(container)).toHaveNoViolations();
    });
});

describe("Carousel arrows and keys", () => {
    it("moves to the next card and loops from the last back to the first", () => {
        const { current } = renderCarousel();

        fireEvent.click(screen.getByRole("button", { name: "Next thing" }));
        expect(current()).toBe(2);

        for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole("button", { name: "Next thing" }));
        expect(current()).toBe(5);

        fireEvent.click(screen.getByRole("button", { name: "Next thing" }));
        expect(current()).toBe(1);
    });

    it("loops backwards from the first card to the last", () => {
        const { current } = renderCarousel();

        fireEvent.click(screen.getByRole("button", { name: "Previous thing" }));

        expect(current()).toBe(5);
        expect(screen.getByRole("status")).toHaveTextContent("Item 5, thing 5 of 5");
    });

    it("moves with the left and right arrow keys", () => {
        const { stage, current } = renderCarousel();

        fireEvent.keyDown(stage, { key: "ArrowRight" });
        expect(current()).toBe(2);
        fireEvent.keyDown(stage, { key: "ArrowLeft" });
        fireEvent.keyDown(stage, { key: "ArrowLeft" });
        expect(current()).toBe(5);
    });

    it("ignores other keys", () => {
        const { stage, current } = renderCarousel();

        fireEvent.keyDown(stage, { key: "ArrowDown" });

        expect(current()).toBe(1);
    });

    it("keeps keyboard focus on the carousel when an arrow key is used from a link inside a card", () => {
        const { stage } = renderCarousel();
        const link = screen.getByRole("link");
        link.focus();

        fireEvent.keyDown(link, { key: "ArrowRight" });

        expect(stage).toHaveFocus();
    });

    it("brings a side card to the centre when it is clicked", () => {
        const { slides, current, onLink } = renderCarousel();

        fireEvent.click(slides()[1]);

        expect(current()).toBe(2);
        expect(onLink).not.toHaveBeenCalled();
    });

    it("can be reached by keyboard", () => {
        const { stage } = renderCarousel();

        expect(stage).toHaveAttribute("tabindex", "0");
    });
});

describe("Carousel dragging", () => {
    it("follows the pointer while dragging and snaps to the nearest card on a slow release", () => {
        const { stage, slides, current } = renderCarousel();
        const before = slides()[0].style.transform;

        pointer(stage, "pointerdown", 300, 0);
        pointer(stage, "pointermove", 200, 400);
        pointer(stage, "pointermove", 150, 800);
        expect(slides()[0].style.transform).not.toBe(before);
        expect(current()).toBe(1);

        pointer(stage, "pointermove", 0, 1200);
        pointer(stage, "pointerup", 0, 1200);

        expect(current()).toBe(2);
        expect(slides()[1].style.transform).toContain("translateX(0%)");
    });

    it("stays on the same card when a slow drag is too short", () => {
        const { stage, current } = renderCarousel();

        drag(stage, 300, 260, 800);

        expect(current()).toBe(1);
    });

    it("moves one card on a quick flick even when the drag is short", () => {
        const { stage, current } = renderCarousel();

        drag(stage, 300, 240, 40);

        expect(current()).toBe(2);
    });

    it("never moves more than one card on a flick, however hard", () => {
        const { stage, current } = renderCarousel();

        drag(stage, 300, 200, 5);

        expect(current()).toBe(2);
    });

    it("loops backwards when dragged to the right from the first card", () => {
        const { stage, current } = renderCarousel();

        drag(stage, 100, 400, 1000);

        expect(current()).toBe(5);
    });

    it("ignores a mostly vertical movement so the page can scroll", () => {
        const { stage, current } = renderCarousel();
        pointer(stage, "pointerdown", 300, 0, 300);
        pointer(stage, "pointermove", 280, 100, 100);
        pointer(stage, "pointerup", 280, 200, 100);

        expect(current()).toBe(1);
    });

    it("does not open the link under the pointer when a drag ends", async () => {
        const { stage, onLink } = renderCarousel();
        drag(stage, 300, 100, 600);

        const link = screen.getByRole("link");
        fireEvent.click(link);
        expect(onLink).not.toHaveBeenCalled();

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5));
        });
        fireEvent.click(link);
        expect(onLink).toHaveBeenCalledTimes(1);
    });

    it("lets a plain tap through to the link", () => {
        const { onLink } = renderCarousel();

        fireEvent.click(screen.getByRole("link"));

        expect(onLink).toHaveBeenCalledTimes(1);
    });
});

describe("Carousel with few cards", () => {
    it("shows a single card with no arrows, dots or dragging", () => {
        const { stage, current } = renderCarousel(1);

        expect(screen.queryByRole("button")).toBeNull();
        expect(screen.queryByText("1 of 1")).toBeNull();
        drag(stage, 300, 100, 600);
        expect(current()).toBe(1);
    });

    it("shows no cards and no controls when the list is empty", () => {
        const { slides } = renderCarousel(0);

        expect(slides()).toHaveLength(0);
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("keeps two cards in order and does not drag past either end", () => {
        const { stage, current } = renderCarousel(2);

        drag(stage, 100, 500, 1000);
        expect(current()).toBe(1);

        drag(stage, 300, 100, 800);
        expect(current()).toBe(2);

        drag(stage, 300, 100, 800);
        expect(current()).toBe(2);
    });

    it("toggles between two cards with the arrows", () => {
        const { current } = renderCarousel(2);

        fireEvent.click(screen.getByRole("button", { name: "Next thing" }));
        expect(current()).toBe(2);
        fireEvent.click(screen.getByRole("button", { name: "Next thing" }));
        expect(current()).toBe(1);
    });
});

describe("Carousel and reduced motion", () => {
    it("lays the cards flat in a row instead of tilting them", () => {
        setReducedMotion(true);
        const { slides } = renderCarousel();

        expect(slides()[1].style.transform).toBe("translateX(108%)");
        expect(slides().every((slide) => !slide.style.transform.includes("rotateY"))).toBe(true);
    });

    it("tilts them in 3D otherwise", () => {
        const { slides } = renderCarousel();

        expect(slides()[1].style.transform).toContain("rotateY(-34deg)");
    });
});
