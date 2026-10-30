import { useEffect, useRef } from "react";
import { useMediaQuery } from "./lib/useMediaQuery";
import { drawStars, generateStars, type Star } from "@/background/stars";
import { MODES, findOption } from "@/style/registry";
import { useStyleSelection } from "@/style/store";

const MAX_PIXEL_RATIO = 2;

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

        const render = (milliseconds: number) => {
            drawStars(ctx, stars, { width, height, color, scrollY: window.scrollY, seconds: milliseconds / 1000, animate });
            if (animate) frame = requestAnimationFrame(render);
        };

        const build = () => {
            const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
            width = window.innerWidth;
            height = canvas.clientHeight || window.innerHeight;
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
            stars = generateStars(width, height);
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
