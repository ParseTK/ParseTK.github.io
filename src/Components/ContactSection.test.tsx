import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactSection } from "./ContactSection";
import { contactEntries } from "@/data/contact";
import { axe } from "@/test/axe";

describe("contact data", () => {
    it("has Email, LinkedIn and GitHub, in that order, and no Discord", () => {
        expect(contactEntries.map((entry) => entry.label)).toEqual(["Email", "LinkedIn", "GitHub"]);
        expect(JSON.stringify(contactEntries)).not.toMatch(/discord|estteekay/i);
    });

    it("uses https for web links and marks only those as external", () => {
        for (const entry of contactEntries) {
            expect(entry.external, entry.id).toBe(/^https:/.test(entry.href));
            if (entry.external) expect(entry.href).not.toMatch(/\s/);
        }
    });
});

describe("ContactSection", () => {
    it("has a level two heading and one entry per contact", () => {
        render(<ContactSection />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Get In Touch");
        expect(screen.getAllByRole("listitem")).toHaveLength(contactEntries.length);
    });

    it("makes the whole entry the link, named by its label and address", () => {
        render(<ContactSection />);

        const email = screen.getByRole("link", { name: /Email/ });
        expect(email).toHaveAttribute("href", "mailto:kirchnertyler@gmail.com");
        expect(email).toHaveAccessibleName("Email kirchnertyler@gmail.com");
        expect(email).not.toHaveAttribute("target");
        expect(within(email).getByText("kirchnertyler@gmail.com")).toBeInTheDocument();
    });

    it("opens LinkedIn and GitHub in a new tab and says so", () => {
        render(<ContactSection />);

        const linkedin = screen.getByRole("link", { name: /LinkedIn/ });
        const github = screen.getByRole("link", { name: /GitHub/ });
        expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/parsetk");
        expect(github).toHaveAttribute("href", "https://github.com/ParseTK");
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
