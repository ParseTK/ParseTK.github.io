type Rgb = [number, number, number];

export const hexToRgb = (hex: string): Rgb => {
    const value = hex.replace("#", "");
    return [0, 2, 4].map((start) => parseInt(value.slice(start, start + 2), 16)) as Rgb;
};

// "222 47% 4%" style triples, as used by the base color tokens
export const hslTripleToRgb = (triple: string): Rgb => {
    const [h, s, l] = triple.split(/\s+/).map((part) => parseFloat(part));
    const sat = s / 100;
    const light = l / 100;
    const chroma = sat * Math.min(light, 1 - light);
    const channel = (offset: number) => {
        const k = (offset + h / 30) % 12;
        return Math.round(255 * (light - chroma * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
    };
    return [channel(0), channel(8), channel(4)];
};

const luminance = ([r, g, b]: Rgb): number => {
    const [lr, lg, lb] = [r, g, b].map((value) => {
        const unit = value / 255;
        return unit <= 0.03928 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

export const contrastRatio = (a: Rgb, b: Rgb): number => {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
};
