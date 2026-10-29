import { useEffect, useState } from "react";

interface Star {
    id: number;
    size: number;
    x: number;
    y: number;
    opacity: number;
    animationDuration: number;
}

export const StarBackground = () => {
    const [stars, setStars] = useState<Star[]>([]);

    const generateStars = () => {
        const numOfStars = Math.floor(
            (window.innerWidth * window.innerHeight) / 7000
        );
        const newStars: Star[] = [];
        for (let i = 0; i < numOfStars; i++) {
            newStars.push({
                id: i,
                size: Math.random() * 3 + 1,
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.5,
                animationDuration: Math.random() * 4 + 2,
            });
        }
        setStars(newStars);
    };

    useEffect(() => {
        generateStars();

        // Phones fire resize when the address bar hides while scrolling; only a width change should reshuffle
        let lastWidth = window.innerWidth;
        const handleResize = () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            generateStars();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div aria-hidden="true" className="fixed inset-x-0 top-0 h-lvh overflow-hidden pointer-events-none z-0">
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="star animate-pulse-subtle"
                    style={{
                        width: star.size + "px",
                        height: star.size + "px",
                        left: star.x + "%",
                        top: star.y + "%",
                        opacity: star.opacity,
                        animationDuration: star.animationDuration + "s",
                    }}
                />
            ))}
        </div>
    );
};