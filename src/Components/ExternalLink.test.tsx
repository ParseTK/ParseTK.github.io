import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "./ExternalLink";

describe("ExternalLink", () => {
    it("opens in a new tab without giving the new page access to this one", () => {
        render(<ExternalLink href="https://example.com">Example</ExternalLink>);

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("adds a screen reader notice after visible text", () => {
        render(<ExternalLink href="https://example.com">Example</ExternalLink>);

        expect(screen.getByRole("link", { name: /^Example\s*\(opens in a new tab\)$/ })).toBeInTheDocument();
    });

    it("builds the accessible name from a label for icon-only links", () => {
        render(
            <ExternalLink href="https://example.com" label="Example source code">
                <svg aria-hidden="true" />
            </ExternalLink>,
        );

        const link = screen.getByRole("link", { name: "Example source code (opens in a new tab)" });
        expect(link).toHaveAttribute("aria-label", "Example source code (opens in a new tab)");
        expect(link.textContent).toBe("");
    });

    it("passes styling and other attributes through but cannot be given a different target", () => {
        render(
            // @ts-expect-error target is fixed by the component
            <ExternalLink href="https://example.com" className="underline" target="_self">
                Example
            </ExternalLink>,
        );

        const link = screen.getByRole("link");
        expect(link).toHaveClass("underline");
        expect(link).toHaveAttribute("target", "_blank");
    });
});
