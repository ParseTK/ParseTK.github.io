import { useEffect, useState } from "react";

export const useScrolledPast = (offset: number): boolean => {
    const [isPast, setIsPast] = useState(() => window.scrollY > offset);

    useEffect(() => {
        const update = () => setIsPast(window.scrollY > offset);
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [offset]);

    return isPast;
};
