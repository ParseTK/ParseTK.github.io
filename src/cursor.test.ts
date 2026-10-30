import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

describe("pointer cursor", () => {
    it("is given to every enabled button, so a button looks pressable like a link does", () => {
        const rule = css.match(/button:not\(:disabled\)[^{]*\{([^}]*)\}/);

        expect(rule, "a base rule for enabled buttons").not.toBeNull();
        expect(rule![1]).toContain("cursor: pointer");
    });
});
