import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactSection } from "./ContactSection";
import { contactEntries } from "@/data/contact";
import { axe } from "@/test/axe";

describe("contact data", () => {
    it("has LinkedIn and GitHub, in that order, and no email or Discord", () => {
        expect(contactEntries.map((entry) => entry.label)).toEqual(["LinkedIn", "GitHub"]);
        expect(JSON.stringify(contactEntries)).not.toMatch(/discord|estteekay|mailto|@gmail|email/i);
    });

    it("uses secure web addresses", () => {
        for (const entry of contactEntries) {
            expect(entry.href, entry.id).toMatch(/^https:\/\//);
            expect(entry.href).not.toMatch(/\s/);
        }
    });
});

describe("ContactSection", () => {
    it("has a left-aligned level two heading with its label and one entry per contact", () => {
        render(<ContactSection />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Get in touch");
        expect(screen.getByText("Contact", { selector: "p" })).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(contactEntries.length);
    });

    it("is named by its heading", () => {
        render(<ContactSection />);

        expect(screen.getByRole("region", { name: "Get in touch" })).toBeInTheDocument();
    });

    it("has no email address or mail link", () => {
        const { container } = render(<ContactSection />);

        expect(container.querySelector("a[href^=mailto]")).toBeNull();
        expect(container.textContent).not.toMatch(/@/);
    });

    it("puts the entries side by side from small screens up and stacks them on a narrow phone", () => {
        render(<ContactSection />);

        const list = screen.getByRole("list");
        expect(list).toHaveClass("grid", "grid-cols-1", "sm:grid-cols-2");
        expect(list.className).not.toContain("mx-auto");
    });

    it("makes the whole entry the link, named by its label, address and the new tab notice", () => {
        render(<ContactSection />);

        const linkedin = screen.getByRole("link", { name: /LinkedIn/ });
        const github = screen.getByRole("link", { name: /GitHub/ });
        expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/parsetk");
        expect(github).toHaveAttribute("href", "https://github.com/ParseTK");
        expect(linkedin).toHaveTextContent("www.linkedin.com/in/parsetk");
        for (const link of [linkedin, github]) {
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
            expect(link).toHaveAccessibleName(/opens in a new tab/);
        }
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = render(<ContactSection />);

        expect(await axe(container)).toHaveNoViolations();
    });
});
