import { useEffect, useRef } from "react";
import { useMediaQuery } from "./lib/useMediaQuery";
import { drawStars, generateStars, type Star } from "@/background/stars";
import { MODES, findOption } from "@/style/registry";
import { useStyleSelection } from "@/style/store";

const MAX_PIXEL_RATIO = 2;

// A full-screen canvas costs graphics time every time it changes. Stars fade slowly, so redrawing about 15 times a
// second looks the same as 60 for a quarter of the work. Scrolling still redraws at once, so the drift stays smooth.
const TWINKLE_FRAME_MS = 66;

// A very large or very sharp screen gets a slightly coarser canvas instead of an enormous one
const MAX_CANVAS_PIXELS = 3_000_000;

const StarCanvas = ({ color }: { color: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const animate = !reducedMotion;
        let width = 0;
        let height = 0;
        let stars: Star[] = [];
        let frame = 0;
        let lastDrawn = -Infinity;
        let lastScrollY = -1;

        const render = (milliseconds: number) => {
            if (animate) frame = requestAnimationFrame(render);

            const scrollY = window.scrollY;
            if (milliseconds - lastDrawn < TWINKLE_FRAME_MS && scrollY === lastScrollY) return;
            lastDrawn = milliseconds;
            lastScrollY = scrollY;

            drawStars(ctx, stars, { width, height, color, scrollY, seconds: milliseconds / 1000, animate });
        };

        const build = () => {
            width = window.innerWidth;
            height = canvas.clientHeight || window.innerHeight;
            const sharpest = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
            const ratio = Math.max(1, Math.min(sharpest, Math.sqrt(MAX_CANVAS_PIXELS / (width * height))));
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            stars = generateStars(width, height);
            lastDrawn = -Infinity;
        };

        build();
        if (animate) frame = requestAnimationFrame(render);
        else render(0);

        // Height-only resizes (a phone address bar sliding) must not reshuffle the sky
        let lastWidth = window.innerWidth;
        const handleResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            build();
            if (!animate) render(0);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", handleResize);
        };
    }, [color, reducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-x-0 top-0 h-lvh w-full pointer-events-none z-0"
        />
    );
};

export const StarBackground = () => {
    const [{ mode }] = useStyleSelection();
    const starColor = findOption(MODES, mode)?.starColor;

    return starColor ? <StarCanvas color={starColor} /> : null;
};
