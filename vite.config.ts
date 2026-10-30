import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { contentSecurityPolicy } from "./vite-plugins/content-security-policy";
import { spaFallback } from "./vite-plugins/spa-fallback";

export default defineConfig({
    base: "/",
    plugins: [react(), tailwindcss(), contentSecurityPolicy(), spaFallback()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        css: false,
    },
});
