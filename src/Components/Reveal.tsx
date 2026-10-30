import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "./lib/utils";
import { useMediaQuery } from "./lib/useMediaQuery";

interface RevealProps {
    children: ReactNode;
    className?: string;
}

// Fades its content up once, the first time it comes into view. With no observer support or
// reduced motion it shows straight away, so content can never be left hidden.
export const Reveal = ({ children, className }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const [seen, setSeen] = useState(() => typeof IntersectionObserver === "undefined");
    const shown = seen || reducedMotion;

    useEffect(() => {
        const element = ref.current;
        if (shown || !element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                setSeen(true);
                observer.disconnect();
            },
            { rootMargin: "0px 0px -10% 0px" },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [shown]);

    return (
        <div
            ref={ref}
            className={cn("transition-[opacity,translate] duration-700 ease-out", !shown && "translate-y-6 opacity-0", className)}
        >
            {children}
        </div>
    );
};
