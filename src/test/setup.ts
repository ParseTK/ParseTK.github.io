import "@testing-library/jest-dom/vitest";
import "vitest-axe/extend-expect";
import { afterEach, beforeEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as axeMatchers from "vitest-axe/matchers";
import { installMatchMedia, resetViewport } from "./matchMedia";

expect.extend(axeMatchers);

beforeEach(() => {
    resetViewport();
    installMatchMedia();
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true, writable: true });
});

afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.className = "";
    document.documentElement.removeAttribute("style");
});
