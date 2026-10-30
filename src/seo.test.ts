import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contactEntries } from "@/data/contact";
import { MODES } from "@/style/registry";

const projectFile = (path: string) => resolve(process.cwd(), path);
const read = (path: string) => readFileSync(projectFile(path), "utf8");

const page = new DOMParser().parseFromString(read("index.html"), "text/html");
const meta = (selector: string) => page.head.querySelector(selector)?.getAttribute("content");
const link = (selector: string) => page.head.querySelector(selector)?.getAttribute("href");

const SITE = "https://parsetk.github.io/";

const pngSize = (path: string) => {
    const bytes = readFileSync(projectFile(path));
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
};

describe("page title and description", () => {
    it("has one title and one description of a sensible length", () => {
        expect(page.querySelectorAll("title")).toHaveLength(1);
        expect(page.querySelectorAll("meta[name=description]")).toHaveLength(1);
        const description = meta("meta[name=description]")!;
        expect(description.length).toBeGreaterThan(70);
        expect(description.length).toBeLessThanOrEqual(160);
        expect(page.documentElement.lang).toBe("en");
    });

    it("shares the same title and description with the social previews", () => {
        const title = page.title;
        const description = meta("meta[name=description]");

        expect(meta("meta[property='og:title']")).toBe(title);
        expect(meta("meta[name='twitter:title']")).toBe(title);
        expect(meta("meta[property='og:description']")).toBe(description);
        expect(meta("meta[name='twitter:description']")).toBe(description);
    });
});

describe("addresses", () => {
    it("uses the one site address everywhere", () => {
        const jsonLd = JSON.parse(page.querySelector("script[type='application/ld+json']")!.textContent!);
        const sitemap = new DOMParser().parseFromString(read("public/sitemap.xml"), "text/xml");

        expect(link("link[rel=canonical]")).toBe(SITE);
        expect(meta("meta[property='og:url']")).toBe(SITE);
        expect(jsonLd.url).toBe(SITE);
        expect(sitemap.querySelector("loc")!.textContent).toBe(SITE);
        expect(read("public/robots.txt")).toContain(`Sitemap: ${SITE}sitemap.xml`);
    });

    it("lets search engines in and points them at the sitemap", () => {
        const robots = read("public/robots.txt");

        expect(robots).toMatch(/User-agent: \*\s+Allow: \//);
        expect(robots).not.toMatch(/Disallow:\s*\//);
        expect(page.head.querySelector("meta[name=robots]")).toBeNull();
    });
});

describe("social preview image", () => {
    it("is an absolute address on the same site, for a file that exists", () => {
        const image = meta("meta[property='og:image']")!;

        expect(image).toBe(`${SITE}og-image.png`);
        expect(meta("meta[name='twitter:image']")).toBe(image);
        expect(() => readFileSync(projectFile("public/og-image.png"))).not.toThrow();
    });

    it("declares the real size of the image, 1200 by 630", () => {
        expect(pngSize("public/og-image.png")).toEqual({ width: 1200, height: 630 });
        expect(meta("meta[property='og:image:width']")).toBe("1200");
        expect(meta("meta[property='og:image:height']")).toBe("630");
    });

    it("describes the image and asks for the large card", () => {
        expect(meta("meta[property='og:image:alt']")).toBeTruthy();
        expect(meta("meta[name='twitter:image:alt']")).toBe(meta("meta[property='og:image:alt']"));
        expect(meta("meta[name='twitter:card']")).toBe("summary_large_image");
        expect(meta("meta[property='og:type']")).toBe("website");
    });
});

describe("icons", () => {
    it("links an SVG, an ICO and an Apple touch icon that all exist", () => {
        for (const href of [
            link("link[rel=icon][type='image/svg+xml']"),
            link("link[rel=icon][sizes='48x48']"),
            link("link[rel=apple-touch-icon]"),
        ]) {
            expect(href).toMatch(/^\//);
            expect(() => readFileSync(projectFile(`public${href}`)), href!).not.toThrow();
        }
    });

    it("no longer uses the default Vite logo", () => {
        expect(page.documentElement.innerHTML).not.toContain("vite.svg");
    });

    it("has the right sizes for the PNG icons", () => {
        expect(pngSize("public/apple-touch-icon.png")).toEqual({ width: 180, height: 180 });
        const ico = readFileSync(projectFile("public/favicon.ico"));
        expect([ico[6], ico[7]]).toEqual([48, 48]);
        expect(ico.readUInt16LE(2)).toBe(1);
    });
});

describe("structured data", () => {
    const person = JSON.parse(page.querySelector("script[type='application/ld+json']")!.textContent!);

    it("describes the person with only their name, role and web profiles", () => {
        expect(person["@context"]).toBe("https://schema.org");
        expect(person["@type"]).toBe("Person");
        expect(person.name).toBe("Tyler Kirchner");
        expect(person.jobTitle).toBe("Software Developer");
        expect(Object.keys(person).sort()).toEqual(["@context", "@type", "jobTitle", "name", "sameAs", "url"]);
    });

    it("links the same profiles as the contact section", () => {
        const profiles = contactEntries.filter((entry) => entry.external).map((entry) => entry.href);

        expect(person.sameAs).toEqual(profiles);
    });
});

describe("TK monogram", () => {
    const svg = read("public/favicon.svg");
    const STROKE = 7;
    const stems = [...svg.matchAll(/M([\d.]+) ([\d.]+)v([\d.]+)/g)].map(([, x, y, length]) => ({
        x: Number(x),
        top: Number(y),
        bottom: Number(y) + Number(length),
    }));
    const arms = [...svg.matchAll(/M([\d.]+) ([\d.]+)L/g)].map(([, x, y]) => ({ x: Number(x), y: Number(y) }));

    it("has a T and a K whose stems are the same height", () => {
        expect(stems).toHaveLength(2);
        expect(stems[0].top).toBe(stems[1].top);
        expect(stems[0].bottom).toBe(stems[1].bottom);
    });

    it("grows both arms of the K out of the middle of its stem, so no notch is left where they meet", () => {
        const [, stem] = stems;

        expect(arms).toHaveLength(2);
        expect(arms[0]).toEqual(arms[1]);
        expect(Math.abs(arms[0].x - stem.x)).toBeLessThan(STROKE / 2);
        expect(arms[0].y).toBeGreaterThan(stem.top);
        expect(arms[0].y).toBeLessThan(stem.bottom);
    });

    it("leaves a gap between the T and the K", () => {
        const tBarEnd = Number(/M[\d.]+ [\d.]+h([\d.]+)/.exec(svg)![1]) + Number(/M([\d.]+) [\d.]+h/.exec(svg)![1]);
        const kStemLeftEdge = stems[1].x - STROKE / 2;

        expect(kStemLeftEdge - (tBarEnd + STROKE / 2)).toBeGreaterThanOrEqual(2);
    });
});

describe("browser colour", () => {
    it("starts as the colour of the default mode", () => {
        expect(meta("meta[name=theme-color]")).toBe(MODES[0].themeColor);
    });
});
