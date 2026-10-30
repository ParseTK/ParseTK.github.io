import { useEffect, useRef } from "react";
import { grainDataUrl } from "@/background/grain";

export const GrainOverlay = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const url = grainDataUrl();
        if (url && ref.current) ref.current.style.backgroundImage = `url(${url})`;
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="fixed inset-x-0 top-0 h-lvh z-60 pointer-events-none opacity-[0.06] bg-size-[160px_160px]"
        />
    );
};
