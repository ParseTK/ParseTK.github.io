import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

const renderLinks = () => {
    render(<Home />);
    return [...document.querySelectorAll<HTMLAnchorElement>("a[href]")];
};

describe("links and images on the page", () => {
    it("has no placeholder or malformed targets", () => {
        for (const link of renderLinks()) {
            const href = link.getAttribute("href") as string;
            expect(href, link.outerHTML).not.toBe("#");
            expect(href, link.outerHTML).not.toMatch(/^#https?:/);
            expect(href, link.outerHTML).not.toMatch(/\s/);
        }
    });

    it("opens every external web link in a new tab safely", () => {
        const external = renderLinks().filter((link) => /^https?:/.test(link.getAttribute("href") as string));

        expect(external.length).toBeGreaterThan(0);
        for (const link of external) {
            expect(link.getAttribute("href"), link.outerHTML).toMatch(/^https:\/\//);
            expect(link.getAttribute("target"), link.outerHTML).toBe("_blank");
            expect(link.getAttribute("rel"), link.outerHTML).toContain("noopener");
            expect(link.getAttribute("rel"), link.outerHTML).toContain("noreferrer");
        }
    });

    it("tells visitors when a link opens a new tab", () => {
        const external = renderLinks().filter((link) => link.getAttribute("target") === "_blank");

        for (const link of external) {
            const name = `${link.getAttribute("aria-label") ?? ""} ${link.textContent ?? ""}`;
            expect(name, link.outerHTML).toContain("opens in a new tab");
        }
    });

    it("gives every link an accessible name", () => {
        for (const link of renderLinks()) {
            const name = `${link.getAttribute("aria-label") ?? ""}${link.textContent ?? ""}`.trim();
            expect(name, link.outerHTML).not.toBe("");
        }
    });

    it("shows no email address and has no mail link", () => {
        const { container } = render(<Home />);

        expect(container.querySelector("a[href^=mailto]")).toBeNull();
        expect(container.textContent).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    });

    it("describes every image", () => {
        render(<Home />);

        for (const image of document.querySelectorAll("img")) {
            expect(image.getAttribute("alt"), image.outerHTML).toBeTruthy();
        }
    });
});
