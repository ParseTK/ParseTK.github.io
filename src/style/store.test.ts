import { describe, expect, it } from "vitest";
import { DEFAULT_SELECTION, accentColors } from "./registry";
import { STORAGE_KEY, getSelection, initStyle, setSelection } from "./store";

describe("style store", () => {
    it("starts from the defaults when nothing is saved", () => {
        expect(getSelection()).toEqual(DEFAULT_SELECTION);
    });

    it("applies a choice to the page, saves it and leaves no helper class behind", () => {
        setSelection({ mode: "light", accent: "violet" });

        const root = document.documentElement;
        expect(root).toHaveClass("light");
        expect(root).not.toHaveClass("dark");
        expect(root).not.toHaveClass("theme-switching");
        expect(root.style.getPropertyValue("--primary")).toBe(accentColors("violet", "light").color);
        expect(getSelection()).toMatchObject({ mode: "light", accent: "violet" });
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).resolved.modeClass).toBe("light");
    });

    it("keeps the accent but switches its color when the mode changes", () => {
        setSelection({ accent: "mint" });
        setSelection({ mode: "light" });

        expect(document.documentElement.style.getPropertyValue("--primary")).toBe(accentColors("mint", "light").color);
    });

    it("restores a saved choice on load", () => {
        setSelection({ mode: "light", typeface: "geometric" });
        document.documentElement.className = "";
        document.documentElement.removeAttribute("style");

        initStyle();

        expect(document.documentElement).toHaveClass("light");
        expect(document.documentElement.style.getPropertyValue("--style-font-heading")).toContain("Sora");
    });

    it("ignores saved values that are no longer in the registry", () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ selection: { mode: "sepia", typeface: "serif", accent: "mint" } }),
        );

        expect(getSelection()).toEqual({ ...DEFAULT_SELECTION, accent: "mint" });
    });

    it("ignores a corrupted saved value", () => {
        localStorage.setItem(STORAGE_KEY, "{broken");

        expect(getSelection()).toEqual(DEFAULT_SELECTION);
    });

    it("still applies a choice when storage is unavailable", () => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = () => {
            throw new Error("blocked");
        };
        try {
            expect(() => setSelection({ mode: "light" })).not.toThrow();
            expect(document.documentElement).toHaveClass("light");
        } finally {
            Storage.prototype.setItem = original;
        }
    });
});
