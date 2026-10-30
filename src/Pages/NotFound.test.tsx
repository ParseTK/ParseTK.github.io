import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./NotFound";
import { axe } from "@/test/axe";

describe("NotFound", () => {
    it("says the page does not exist and offers a way home", () => {
        render(<NotFound />);

        expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
    });

    it("gives the tab its own title and puts the old one back when it goes away", () => {
        document.title = "Tyler Kirchner | Software Developer Portfolio";
        const { unmount } = render(<NotFound />);

        expect(document.title).toBe("Page not found | Tyler Kirchner");

        unmount();

        expect(document.title).toBe("Tyler Kirchner | Software Developer Portfolio");
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = render(<NotFound />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
