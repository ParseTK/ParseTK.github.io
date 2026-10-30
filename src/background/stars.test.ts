import { describe, expect, it } from "vitest";
import {
    AREA_PER_STAR,
    SKY_HEIGHT_IN_SCREENS,
    TWINKLE_MAX,
    TWINKLE_MIN,
    generateStars,
    starOpacity,
    starY,
} from "./stars";

const sequence = (values: number[]) => {
    let index = 0;
    return () => values[index++ % values.length];
};

describe("generateStars", () => {
    it("makes about one star per 7000 square pixels", () => {
        const stars = generateStars(1000, 700);

        expect(Math.abs(stars.length - (1000 * 700) / AREA_PER_STAR)).toBeLessThanOrEqual(2);
    });

    it("keeps every star inside the sky", () => {
        for (const star of generateStars(400, 800)) {
            expect(star.x).toBeGreaterThanOrEqual(0);
            expect(star.x).toBeLessThanOrEqual(400);
            expect(star.y).toBeGreaterThanOrEqual(0);
            expect(star.y).toBeLessThanOrEqual(800 * SKY_HEIGHT_IN_SCREENS);
        }
    });

    it("makes the bigger stars drift further than the small ones", () => {
        const stars = generateStars(1000, 700);
        const byRadius = [...new Set(stars.map((star) => star.radius))].sort((a, b) => a - b);
        const parallaxOf = (radius: number) => stars.find((star) => star.radius === radius)!.parallax;

        expect(byRadius).toHaveLength(3);
        expect(parallaxOf(byRadius[0])).toBeLessThan(parallaxOf(byRadius[1]));
        expect(parallaxOf(byRadius[1])).toBeLessThan(parallaxOf(byRadius[2]));
    });

    it("is repeatable for a given random source", () => {
        const first = generateStars(500, 500, sequence([0.1, 0.5, 0.9]));
        const second = generateStars(500, 500, sequence([0.1, 0.5, 0.9]));

        expect(first).toEqual(second);
    });
});

describe("starY", () => {
    const star = { x: 0, y: 100, radius: 1, speed: 1, phase: 0, parallax: 0.06 };

    it("does not move at the top of the page", () => {
        expect(starY(star, 800, 0)).toBe(100);
    });

    it("moves up as the page scrolls", () => {
        expect(starY(star, 800, 100)).toBeLessThan(starY(star, 800, 0));
    });

    it("wraps around so the sky never runs out", () => {
        const sky = 800 * SKY_HEIGHT_IN_SCREENS;
        for (const scrollY of [0, 500, 5000, 123456]) {
            const y = starY(star, 800, scrollY);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThan(sky);
        }
    });
});

describe("starOpacity", () => {
    const star = { x: 0, y: 0, radius: 1, speed: 1, phase: 0, parallax: 0.01 };

    const sample = (speed: number, phase: number) =>
        Array.from({ length: 400 }, (_, i) => starOpacity({ ...star, speed, phase }, i / 10, true));

    it("dims and brightens a star without ever letting it go out", () => {
        for (const [speed, phase] of [
            [0.5, 0],
            [1, 2],
            [2, 4.5],
        ]) {
            const values = sample(speed, phase);

            expect(Math.min(...values)).toBeGreaterThanOrEqual(TWINKLE_MIN - 1e-9);
            expect(Math.max(...values)).toBeLessThanOrEqual(TWINKLE_MAX + 1e-9);
        }
    });

    it("keeps even the dimmest moment clearly visible", () => {
        expect(TWINKLE_MIN).toBeGreaterThanOrEqual(0.3);
        expect(Math.min(...sample(1, 0))).toBeGreaterThan(0.3);
    });

    it("uses most of its range, so the twinkle can be seen", () => {
        const values = sample(1, 0);

        expect(Math.max(...values) - Math.min(...values)).toBeGreaterThan((TWINKLE_MAX - TWINKLE_MIN) * 0.9);
        expect(new Set(values.map((value) => value.toFixed(2))).size).toBeGreaterThan(20);
    });

    it("stays at one steady brightness without animation", () => {
        expect(starOpacity(star, 0, false)).toBe(starOpacity(star, 12.3, false));
    });
});
