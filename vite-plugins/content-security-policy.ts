import type { Plugin } from "vite";

// What the built page may load, and nothing else. GitHub Pages cannot send headers, so this goes in a meta tag,
// which means the directives a meta tag does not support (frame-ancestors, report-uri) are left out.
// - script and style: only files from this site, so an injected inline script or style does not run
//   (the page's own style changes go through the CSSOM, which this policy does not block)
// - img: this site plus data: for the grain texture, which is drawn on a canvas and applied as a data URL
// - font, connect: this site only (the fonts are bundled and the page makes no requests of its own)
export const CONTENT_SECURITY_POLICY = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
].join("; ");

// Build only: the dev server injects inline scripts and opens a socket for hot reload, which this policy would block
export const contentSecurityPolicy = (): Plugin => ({
    name: "content-security-policy",
    apply: "build",
    transformIndexHtml: () => [
        {
            tag: "meta",
            attrs: { "http-equiv": "Content-Security-Policy", content: CONTENT_SECURITY_POLICY },
            injectTo: "head-prepend",
        },
    ],
});
