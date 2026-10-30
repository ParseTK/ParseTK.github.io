const SIZE = 160;
const MAX_ALPHA = 90;

let cached: string | null | undefined;

// Fine black and white noise; laid over the page at low opacity it hides banding in the glows
export const grainDataUrl = (): string | null => {
    if (cached !== undefined) return cached;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const image = ctx.createImageData(SIZE, SIZE);
    for (let i = 0; i < image.data.length; i += 4) {
        const value = Math.random() < 0.5 ? 0 : 255;
        image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
        image.data[i + 3] = Math.random() * MAX_ALPHA;
    }
    ctx.putImageData(image, 0, 0);

    cached = canvas.toDataURL();
    return cached;
};
