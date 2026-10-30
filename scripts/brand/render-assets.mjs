// Renders the share image and the favicon files in public/ from the sources in this folder.
// Needs Microsoft Edge or Chrome (set BROWSER_PATH to use another one). Run: npm run brand
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { decodePng, encodePng, resize } from "./png.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "../../public");

const candidates = [
    process.env.BROWSER_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
].filter(Boolean);
const browser = candidates.find((path) => existsSync(path));
if (!browser) throw new Error("No Edge or Chrome found; set BROWSER_PATH");

// Browsers will not open a headless window smaller than this, so icons are drawn this big and shrunk
const ICON_SOURCE_SIZE = 512;

const work = mkdtempSync(join(tmpdir(), "brand-"));

const screenshot = (page, output, width, height) =>
    execFileSync(browser, [
        "--headless=new",
        "--disable-gpu",
        // A profile of its own, so a running Edge cannot take the request over
        `--user-data-dir=${join(work, "profile")}`,
        "--no-first-run",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--default-background-color=00000000",
        `--window-size=${width},${height}`,
        `--screenshot=${output}`,
        pathToFileURL(page).href,
    ]);

// A page holding only the favicon, filling the whole window
const iconPage = (name, svg) => {
    const path = join(work, `${name}.html`);
    writeFileSync(
        path,
        `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block;width:100vw;height:100vh}</style>${svg}`,
    );
    return path;
};

// An ICO file can hold a PNG as it is: a small header followed by the image
const pngToIco = (png, size) => {
    const header = Buffer.alloc(22);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(1, 4);
    header.writeUInt8(size, 6);
    header.writeUInt8(size, 7);
    header.writeUInt16LE(1, 10);
    header.writeUInt16LE(32, 12);
    header.writeUInt32LE(png.length, 14);
    header.writeUInt32LE(22, 18);
    return Buffer.concat([header, png]);
};

try {
    const favicon = readFileSync(join(publicDir, "favicon.svg"), "utf8");
    // The PNG and ICO files are full squares: iOS rounds its icon itself, and a screenshot has no transparent corners
    const square = favicon.replace(' rx="14"', "");

    screenshot(resolve(here, "share-card.html"), join(publicDir, "og-image.png"), 1200, 630);

    const shrunk = (svg, name, size) => {
        const big = join(work, `${name}.png`);
        screenshot(iconPage(name, svg), big, ICON_SOURCE_SIZE, ICON_SOURCE_SIZE);
        return encodePng(resize(decodePng(readFileSync(big)), size, size));
    };

    writeFileSync(join(publicDir, "apple-touch-icon.png"), shrunk(square, "apple", 180));
    writeFileSync(join(publicDir, "favicon.ico"), pngToIco(shrunk(square, "small", 48), 48));
    console.log("Wrote og-image.png, apple-touch-icon.png and favicon.ico in public/");
} finally {
    rmSync(work, { recursive: true, force: true });
}
