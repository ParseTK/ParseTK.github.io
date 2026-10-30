export interface Star {
    x: number;
    y: number;
    radius: number;
    speed: number;
    phase: number;
    parallax: number;
}

export interface DrawOptions {
    width: number;
    height: number;
    color: string;
    scrollY: number;
    seconds: number;
    animate: boolean;
}

export const AREA_PER_STAR = 7000;

// The sky is this many screens tall and wraps, so scrolling never runs out of stars
export const SKY_HEIGHT_IN_SCREENS = 1.5;

const SCROLL_FACTOR = 5;
const STILL_OPACITY = 0.7;

// Near stars are bigger and drift further than far stars when the page scrolls
const LAYERS = [
    { share: 0.56, radius: 0.6, parallax: 0.012 },
    { share: 0.31, radius: 1.1, parallax: 0.03 },
    { share: 0.13, radius: 1.8, parallax: 0.06 },
];

export const generateStars = (width: number, height: number, random: () => number = Math.random): Star[] => {
    const total = Math.floor((width * height) / AREA_PER_STAR);
    return LAYERS.flatMap(({ share, radius, parallax }) =>
        Array.from({ length: Math.round(total * share) }, () => ({
            x: random() * width,
            y: random() * height * SKY_HEIGHT_IN_SCREENS,
            radius,
            speed: 0.5 + random() * 1.5,
            phase: random() * Math.PI * 2,
            parallax,
        })),
    );
};

export const starY = (star: Star, height: number, scrollY: number): number => {
    const sky = height * SKY_HEIGHT_IN_SCREENS;
    return (((star.y - scrollY * star.parallax * SCROLL_FACTOR) % sky) + sky) % sky;
};

// A canvas ignores negative alpha and keeps the previous value, so the dip is clamped at invisible
export const starOpacity = (star: Star, seconds: number, animate: boolean): number =>
    animate ? Math.max(0, 0.4 + 0.5 * Math.sin(seconds * star.speed + star.phase)) : STILL_OPACITY;

export const drawStars = (ctx: CanvasRenderingContext2D, stars: Star[], options: DrawOptions) => {
    const { width, height, color, scrollY, seconds, animate } = options;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgb(${color})`;
    for (const star of stars) {
        ctx.globalAlpha = starOpacity(star, seconds, animate);
        ctx.beginPath();
        ctx.arc(star.x, starY(star, height, animate ? scrollY : 0), star.radius, 0, Math.PI * 2);
        ctx.fill();
    }
};
