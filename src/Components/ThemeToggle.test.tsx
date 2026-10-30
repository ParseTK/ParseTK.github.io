import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
    it("defaults to dark mode", () => {
        render(<ThemeToggle />);

        expect(document.documentElement).toHaveClass("dark");
        expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
    });

    it("switches to light, remembers the choice and leaves no helper class behind", () => {
        render(<ThemeToggle />);

        fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));

        expect(document.documentElement).not.toHaveClass("dark");
        expect(document.documentElement).not.toHaveClass("theme-switching");
        expect(localStorage.getItem("theme")).toBe("light");
        expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
    });

    it("switches back to dark", () => {
        render(<ThemeToggle />);

        fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
        fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));

        expect(document.documentElement).toHaveClass("dark");
        expect(localStorage.getItem("theme")).toBe("dark");
    });

    it("restores a saved light choice on load", () => {
        localStorage.setItem("theme", "light");

        render(<ThemeToggle />);

        expect(document.documentElement).not.toHaveClass("dark");
        expect(screen.getByRole("button", { name: "Switch to dark mode" })).toBeInTheDocument();
    });
});
