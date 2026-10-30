import { describe, expect, it } from "vitest";
import { CONTENT_SECURITY_POLICY, contentSecurityPolicy } from "./content-security-policy";

const directives = Object.fromEntries(
    CONTENT_SECURITY_POLICY.split("; ").map((directive) => {
        const [name, ...sources] = directive.split(" ");
        return [name, sources];
    }),
);

describe("content security policy", () => {
    it("lets scripts and styles come only from this site, with no inline or eval escape hatch", () => {
        expect(directives["script-src"]).toEqual(["'self'"]);
        expect(directives["style-src"]).toEqual(["'self'"]);
        expect(CONTENT_SECURITY_POLICY).not.toMatch(/unsafe-inline|unsafe-eval|\*|https?:/);
    });

    it("blocks plugins, a changed base address and form posts, and allows images only from here or data:", () => {
        expect(directives["object-src"]).toEqual(["'none'"]);
        expect(directives["base-uri"]).toEqual(["'self'"]);
        expect(directives["form-action"]).toEqual(["'none'"]);
        expect(directives["img-src"]).toEqual(["'self'", "data:"]);
    });

    it("leaves out the directives a meta tag ignores", () => {
        expect(directives["frame-ancestors"]).toBeUndefined();
        expect(directives["report-uri"]).toBeUndefined();
    });

    it("adds the policy as the first thing in the head of the built page, and not to the dev server", () => {
        const plugin = contentSecurityPolicy();
        const tags = (plugin.transformIndexHtml as () => unknown[])();

        expect(plugin.apply).toBe("build");
        expect(tags).toEqual([
            {
                tag: "meta",
                attrs: { "http-equiv": "Content-Security-Policy", content: CONTENT_SECURITY_POLICY },
                injectTo: "head-prepend",
            },
        ]);
    });
});
