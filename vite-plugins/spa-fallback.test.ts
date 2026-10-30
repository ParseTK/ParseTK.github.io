import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { spaFallback } from "./spa-fallback";

type WriteBundle = (options: { dir?: string }) => void;

const dirs: string[] = [];
const outputDir = () => {
    const dir = mkdtempSync(join(tmpdir(), "spa-fallback-"));
    dirs.push(dir);
    return dir;
};
const writeBundle = () => spaFallback().writeBundle as unknown as WriteBundle;

afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("spaFallback", () => {
    it("writes 404.html as an exact copy of the built index.html", () => {
        const dir = outputDir();
        writeFileSync(join(dir, "index.html"), "<!doctype html><title>app</title>");

        writeBundle()({ dir });

        expect(readFileSync(join(dir, "404.html"), "utf8")).toBe(readFileSync(join(dir, "index.html"), "utf8"));
    });

    it("leaves index.html as it was", () => {
        const dir = outputDir();
        writeFileSync(join(dir, "index.html"), "original");

        writeBundle()({ dir });

        expect(readFileSync(join(dir, "index.html"), "utf8")).toBe("original");
    });

    it("fails loudly when the build has no index.html to copy", () => {
        const dir = outputDir();

        expect(() => writeBundle()({ dir })).toThrow();
        expect(existsSync(join(dir, "404.html"))).toBe(false);
    });

    it("fails loudly when it does not know where the build went", () => {
        expect(() => writeBundle()({})).toThrow(/output directory/);
    });

    it("only runs for a production build", () => {
        expect(spaFallback().apply).toBe("build");
    });
});
