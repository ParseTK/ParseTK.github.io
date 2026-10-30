import { copyFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

// GitHub Pages answers an unknown address with 404.html. Giving it a copy of the app means the
// router loads and shows its own not-found page, with the real 404 status.
export const spaFallback = (): Plugin => ({
    name: "spa-fallback",
    apply: "build",
    writeBundle(options) {
        if (!options.dir) throw new Error("spa-fallback needs an output directory");
        copyFileSync(join(options.dir, "index.html"), join(options.dir, "404.html"));
    },
});
