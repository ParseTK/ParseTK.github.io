// Just enough PNG handling to shrink a browser screenshot: 8-bit RGB or RGBA, not interlaced
import { crc32, deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const paeth = (left, up, upLeft) => {
    const estimate = left + up - upLeft;
    const toLeft = Math.abs(estimate - left);
    const toUp = Math.abs(estimate - up);
    const toUpLeft = Math.abs(estimate - upLeft);
    if (toLeft <= toUp && toLeft <= toUpLeft) return left;
    return toUp <= toUpLeft ? up : upLeft;
};

export const decodePng = (buffer) => {
    if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error("Not a PNG");

    let header;
    const parts = [];
    for (let offset = 8; offset < buffer.length;) {
        const length = buffer.readUInt32BE(offset);
        const type = buffer.toString("ascii", offset + 4, offset + 8);
        const data = buffer.subarray(offset + 8, offset + 8 + length);
        if (type === "IHDR") header = data;
        if (type === "IDAT") parts.push(data);
        offset += length + 12;
    }
    const width = header.readUInt32BE(0);
    const height = header.readUInt32BE(4);
    const colorType = header[9];
    if (header[8] !== 8 || (colorType !== 2 && colorType !== 6) || header[12] !== 0) {
        throw new Error("Only 8-bit RGB or RGBA PNGs are supported");
    }

    const bytesPerPixel = colorType === 6 ? 4 : 3;
    const stride = width * bytesPerPixel;
    const raw = inflateSync(Buffer.concat(parts));
    const pixels = Buffer.alloc(stride * height);

    for (let row = 0; row < height; row++) {
        const filter = raw[row * (stride + 1)];
        const source = row * (stride + 1) + 1;
        for (let i = 0; i < stride; i++) {
            const left = i >= bytesPerPixel ? pixels[row * stride + i - bytesPerPixel] : 0;
            const up = row > 0 ? pixels[(row - 1) * stride + i] : 0;
            const upLeft = row > 0 && i >= bytesPerPixel ? pixels[(row - 1) * stride + i - bytesPerPixel] : 0;
            const base = raw[source + i];
            const add = [0, left, up, (left + up) >> 1, paeth(left, up, upLeft)][filter];
            pixels[row * stride + i] = (base + add) & 255;
        }
    }
    if (bytesPerPixel === 4) return { width, height, pixels };

    const rgba = Buffer.alloc(width * height * 4, 255);
    for (let i = 0; i < width * height; i++) pixels.copy(rgba, i * 4, i * 3, i * 3 + 3);
    return { width, height, pixels: rgba };
};

// Averages each block of source pixels, weighting colours by their opacity so soft edges stay clean
export const resize = ({ width, height, pixels }, targetWidth, targetHeight) => {
    const out = Buffer.alloc(targetWidth * targetHeight * 4);
    for (let y = 0; y < targetHeight; y++) {
        const y0 = Math.floor((y * height) / targetHeight);
        const y1 = Math.max(y0 + 1, Math.floor(((y + 1) * height) / targetHeight));
        for (let x = 0; x < targetWidth; x++) {
            const x0 = Math.floor((x * width) / targetWidth);
            const x1 = Math.max(x0 + 1, Math.floor(((x + 1) * width) / targetWidth));
            let r = 0,
                g = 0,
                b = 0,
                a = 0,
                count = 0;
            for (let sy = y0; sy < y1; sy++) {
                for (let sx = x0; sx < x1; sx++) {
                    const i = (sy * width + sx) * 4;
                    const alpha = pixels[i + 3];
                    r += pixels[i] * alpha;
                    g += pixels[i + 1] * alpha;
                    b += pixels[i + 2] * alpha;
                    a += alpha;
                    count++;
                }
            }
            const o = (y * targetWidth + x) * 4;
            out[o] = a ? Math.round(r / a) : 0;
            out[o + 1] = a ? Math.round(g / a) : 0;
            out[o + 2] = a ? Math.round(b / a) : 0;
            out[o + 3] = Math.round(a / count);
        }
    }
    return { width: targetWidth, height: targetHeight, pixels: out };
};

const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const out = Buffer.alloc(body.length + 8);
    out.writeUInt32BE(data.length, 0);
    body.copy(out, 4);
    out.writeUInt32BE(crc32(body), body.length + 4);
    return out;
};

export const encodePng = ({ width, height, pixels }) => {
    const header = Buffer.alloc(13);
    header.writeUInt32BE(width, 0);
    header.writeUInt32BE(height, 4);
    header[8] = 8;
    header[9] = 6;

    const stride = width * 4;
    const raw = Buffer.alloc((stride + 1) * height);
    for (let row = 0; row < height; row++) {
        pixels.copy(raw, row * (stride + 1) + 1, row * stride, (row + 1) * stride);
    }
    return Buffer.concat([
        SIGNATURE,
        chunk("IHDR", header),
        chunk("IDAT", deflateSync(raw, { level: 9 })),
        chunk("IEND", Buffer.alloc(0)),
    ]);
};
