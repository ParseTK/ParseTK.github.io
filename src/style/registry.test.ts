import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
    ACCENTS,
    DEFAULT_SELECTION,
    MODES,
    TYPEFACES,
    accentColors,
    findOption,
    normalizeSelection,
    resolveStyle,
} from "./registry";
import { contrastRatio, hexToRgb, hslTripleToRgb, rgbToHex } from "@/test/contrast";

const readProjectFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const css = readProjectFile("src/index.css");
const themeInit = readProjectFile("public/theme-init.js");

// Light tokens live on `:root, .light`, dark tokens on `.dark`
const cssBlock = (selector: string): string => {
    const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
    if (!match) throw new Error(`No CSS block for ${selector}`);
    return match[1];
};

const BLOCK_SELECTORS: Record<string, string> = {
    light: ":root,\\s*\\.light",
    dark: "\\.dark",
};

const token = (modeId: string, name: string): string => {
    const match = cssBlock(BLOCK_SELECTORS[modeId]).match(new RegExp(`${name}:\\s*([^;]+);`));
    if (!match) throw new Error(`No ${name} in ${modeId}`);
    return match[1].trim();
};

describe("style registry", () => {
    it.each([
        ["modes", MODES],
        ["typefaces", TYPEFACES],
        ["accents", ACCENTS],
    ])("has unique ids and labels for %s", (_name, options) => {
        expect(new Set(options.map((option) => option.id)).size).toBe(options.length);
        expect(new Set(options.map((option) => option.label)).size).toBe(options.length);
    });

    it("makes Ice the default accent and lists it first", () => {
        expect(DEFAULT_SELECTION.accent).toBe("ice");
        expect(ACCENTS[0].id).toBe("ice");
    });

    it("has a default that exists in every list", () => {
        expect(findOption(MODES, DEFAULT_SELECTION.mode)).toBeDefined();
        expect(findOption(TYPEFACES, DEFAULT_SELECTION.typeface)).toBeDefined();
        expect(findOption(ACCENTS, DEFAULT_SELECTION.accent)).toBeDefined();
    });

    it("defines every accent for every mode", () => {
        for (const accent of ACCENTS) {
            for (const mode of MODES) {
                expect(accent.colors[mode.id], `${accent.id} in ${mode.id}`).toBeDefined();
            }
        }
    });

    it("keeps accent text readable on the page and cards in every mode", () => {
        for (const accent of ACCENTS) {
            for (const mode of MODES) {
                const { color } = accentColors(accent.id, mode.id);
                for (const surface of ["background", "card"]) {
                    const ratio = contrastRatio(hexToRgb(color), hslTripleToRgb(token(mode.id, `--${surface}`)));
                    expect(ratio, `${accent.id} on ${surface} in ${mode.id}`).toBeGreaterThanOrEqual(4.5);
                }
            }
        }
    });

    it("keeps text on an accent-colored button readable in every mode", () => {
        for (const accent of ACCENTS) {
            for (const mode of MODES) {
                const { color, onColor } = accentColors(accent.id, mode.id);
                expect(
                    contrastRatio(hexToRgb(color), hexToRgb(onColor)),
                    `${accent.id} in ${mode.id}`,
                ).toBeGreaterThanOrEqual(4.5);
            }
        }
    });

    it("resolves a selection to a mode class and CSS variables", () => {
        const resolved = resolveStyle({ mode: "light", typeface: "geometric", accent: "mint" });

        expect(resolved.modeClass).toBe("light");
        expect(resolved.vars["--primary"]).toBe(accentColors("mint", "light").color);
        expect(resolved.vars["--primary-foreground"]).toBe(accentColors("mint", "light").onColor);
        expect(resolved.vars["--style-font-heading"]).toContain("Sora");
        expect(resolved.vars["--style-font-body"]).toContain("DM Sans");
    });

    it("replaces unknown or missing ids with the defaults", () => {
        expect(normalizeSelection({ mode: "sepia", accent: "violet" })).toEqual({
            ...DEFAULT_SELECTION,
            accent: "violet",
        });
        expect(normalizeSelection(null)).toEqual(DEFAULT_SELECTION);
    });
});

describe("defaults written in CSS", () => {
    it("match the default accent in every mode", () => {
        for (const mode of MODES) {
            const { color, onColor } = accentColors(DEFAULT_SELECTION.accent, mode.id);
            expect(token(mode.id, "--primary"), mode.id).toBe(color);
            expect(token(mode.id, "--primary-foreground"), mode.id).toBe(onColor);
        }
    });

    it("match the default typeface", () => {
        const typeface = findOption(TYPEFACES, DEFAULT_SELECTION.typeface)!;

        expect(css).toContain(`--style-font-heading: ${typeface.heading};`);
        expect(css).toContain(`--style-font-body: ${typeface.body};`);
    });

    it("include base colors for every mode in the registry", () => {
        for (const mode of MODES) {
            expect(token(mode.id, "--background")).toBeTruthy();
        }
    });
});

describe("browser colour", () => {
    it("is the page background of each mode, as written in CSS", () => {
        for (const mode of MODES) {
            expect(mode.themeColor, mode.id).toBe(rgbToHex(hslTripleToRgb(token(mode.id, "--background"))));
        }
    });

    it("is part of what a selection resolves to", () => {
        expect(resolveStyle({ mode: "light", typeface: "grotesk", accent: "orange" }).themeColor).toBe("#f8fafc");
    });
});

describe("pre-paint script", () => {
    const run = () => new Function(themeInit)();

    it("falls back to the default mode when nothing is saved", () => {
        run();

        expect(document.documentElement).toHaveClass(resolveStyle(DEFAULT_SELECTION).modeClass);
    });

    it("falls back to the default mode when the saved value is broken", () => {
        localStorage.setItem("style", "{not json");

        run();

        expect(document.documentElement).toHaveClass(resolveStyle(DEFAULT_SELECTION).modeClass);
    });

    it("replays the saved browser colour", () => {
        document.head.insertAdjacentHTML("beforeend", '<meta name="theme-color" content="#05080f">');
        const selection = { mode: "light", typeface: "grotesk", accent: "orange" };
        localStorage.setItem("style", JSON.stringify({ selection, resolved: resolveStyle(selection) }));

        run();

        expect(document.querySelector("meta[name=theme-color]")).toHaveAttribute("content", "#f8fafc");
        document.querySelector("meta[name=theme-color]")!.remove();
    });

    it("keeps the browser colour as it is when the saved style predates it", () => {
        document.head.insertAdjacentHTML("beforeend", '<meta name="theme-color" content="#05080f">');
        const { themeColor, ...older } = resolveStyle({ mode: "dark", typeface: "grotesk", accent: "orange" });
        void themeColor;
        localStorage.setItem("style", JSON.stringify({ selection: {}, resolved: older }));

        run();

        expect(document.querySelector("meta[name=theme-color]")).toHaveAttribute("content", "#05080f");
        document.querySelector("meta[name=theme-color]")!.remove();
    });

    it("replays the saved mode class and variables", () => {
        const selection = { mode: "light", typeface: "geometric", accent: "ice" };
        localStorage.setItem("style", JSON.stringify({ selection, resolved: resolveStyle(selection) }));

        run();

        const root = document.documentElement;
        expect(root).toHaveClass("light");
        expect(root).not.toHaveClass("dark");
        expect(root.style.getPropertyValue("--primary")).toBe(accentColors("ice", "light").color);
        expect(root.style.getPropertyValue("--style-font-heading")).toContain("Sora");
    });
});
