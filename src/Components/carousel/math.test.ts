import { describe, expect, it } from "vitest";
import { cardStyle, dragPosition, isJump, offsetAt, snapTarget, velocityOf, wrapIndex } from "./math";

describe("wrapIndex", () => {
    it("loops in both directions", () => {
        expect(wrapIndex(5, 5)).toBe(0);
        expect(wrapIndex(-1, 5)).toBe(4);
        expect(wrapIndex(-6, 5)).toBe(4);
        expect(wrapIndex(2, 5)).toBe(2);
    });
});

describe("offsetAt", () => {
    it("puts the previous card on the left and the next on the right in a loop of five", () => {
        expect(offsetAt(0, 0, 5)).toBe(0);
        expect(offsetAt(1, 0, 5)).toBe(1);
        expect(offsetAt(4, 0, 5)).toBe(-1);
        expect(offsetAt(2, 0, 5)).toBe(2);
        expect(offsetAt(3, 0, 5)).toBe(-2);
    });

    it("follows a position between two cards", () => {
        expect(offsetAt(1, 0.5, 5)).toBeCloseTo(0.5);
        expect(offsetAt(0, 0.5, 5)).toBeCloseTo(-0.5);
    });

    it("keeps two cards in plain order instead of looping", () => {
        expect(offsetAt(0, 0, 2)).toBe(0);
        expect(offsetAt(1, 0, 2)).toBe(1);
        expect(offsetAt(0, 1, 2)).toBe(-1);
    });
});

describe("isJump", () => {
    it("is true for a card that crosses the whole loop and false for a normal step", () => {
        expect(isJump(2, 0, 3, 5)).toBe(true);
        expect(isJump(1, 0, 1, 5)).toBe(false);
        expect(isJump(0, 0, 1, 5)).toBe(false);
    });
});

describe("cardStyle", () => {
    it("shows the centre card square on, fully visible and on top", () => {
        const style = cardStyle(0, false);

        expect(style.opacity).toBe(1);
        expect(style.zIndex).toBe(10);
        expect(style.transform).toContain("rotateY(0deg)");
        expect(style.transform).toContain("scale(1)");
    });

    it("turns a right-hand neighbour away and sets it back and smaller", () => {
        const style = cardStyle(1, false);

        expect(style.transform).toBe("translateX(58%) translateZ(-150px) rotateY(-34deg) scale(0.95)");
        expect(style.opacity).toBeCloseTo(0.7);
        expect(style.zIndex).toBe(9);
    });

    it("mirrors for the left-hand side", () => {
        expect(cardStyle(-1, false).transform).toContain("translateX(-58%)");
        expect(cardStyle(-1, false).transform).toContain("rotateY(34deg)");
    });

    it("fades cards that are far away out completely", () => {
        expect(cardStyle(2.5, false).opacity).toBe(0);
        expect(cardStyle(-3, false).opacity).toBe(0);
    });

    it("lays cards flat in a row, with no tilt, when motion is reduced", () => {
        const centre = cardStyle(0, true);
        const side = cardStyle(1, true);

        expect(centre.transform).toBe("translateX(0%)");
        expect(side.transform).toBe("translateX(108%)");
        expect(side.transform).not.toContain("rotateY");
        expect(centre.opacity).toBe(1);
        expect(side.opacity).toBeCloseTo(0.35);
    });
});

describe("dragPosition", () => {
    it("moves the carousel opposite to the drag", () => {
        expect(dragPosition(0, -100, 100, 5)).toBe(1);
        expect(dragPosition(2, 50, 100, 5)).toBe(1.5);
    });

    it("resists dragging past either end of a two-card carousel", () => {
        expect(dragPosition(0, 200, 100, 2)).toBeCloseTo(-0.7);
        expect(dragPosition(1, -200, 100, 2)).toBeCloseTo(1.7);
        expect(dragPosition(0, -50, 100, 2)).toBe(0.5);
    });
});

describe("velocityOf", () => {
    it("is the distance over time between the first and last points", () => {
        expect(velocityOf([{ time: 0, x: 0 }, { time: 100, x: -50 }])).toBeCloseTo(-0.5);
    });

    it("is zero without movement over time", () => {
        expect(velocityOf([])).toBe(0);
        expect(velocityOf([{ time: 5, x: 10 }])).toBe(0);
        expect(velocityOf([{ time: 5, x: 10 }, { time: 5, x: 90 }])).toBe(0);
    });

    it("looks only at the last few points", () => {
        const points = Array.from({ length: 10 }, (_, index) => ({ time: index * 10, x: index < 5 ? 0 : (index - 4) * 10 }));

        expect(velocityOf(points)).toBeCloseTo(1);
    });
});

describe("snapTarget", () => {
    const base = { startIndex: 0, velocity: 0, step: 200, count: 5 };

    it("settles on the nearest card for a slow drag", () => {
        expect(snapTarget({ ...base, position: 0.4 })).toBe(0);
        expect(snapTarget({ ...base, position: 0.6 })).toBe(1);
        expect(snapTarget({ ...base, position: -0.6 })).toBe(-1);
    });

    it("lets a quick flick carry a short drag to the next card", () => {
        expect(snapTarget({ ...base, position: 0.3, velocity: -1 })).toBe(1);
        expect(snapTarget({ ...base, position: -0.3, velocity: 1 })).toBe(-1);
    });

    it("never throws more than three quarters of a card, however hard the flick", () => {
        expect(snapTarget({ ...base, position: 0.2, velocity: -50 })).toBe(1);
        expect(snapTarget({ ...base, position: 0.2, velocity: -0.0001 })).toBe(0);
    });

    it("never moves more than two cards from where the drag began", () => {
        expect(snapTarget({ ...base, position: 4.4 })).toBe(2);
        expect(snapTarget({ ...base, position: -4.4 })).toBe(-2);
        expect(snapTarget({ ...base, startIndex: 3, position: 9 })).toBe(5);
    });

    it("keeps a two-card carousel between its two cards", () => {
        expect(snapTarget({ ...base, count: 2, position: -0.8 })).toBe(0);
        expect(snapTarget({ ...base, count: 2, position: 1.9 })).toBe(1);
    });
});
