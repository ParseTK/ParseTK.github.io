import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip, ChipList } from "./Chip";
import { ExternalLink } from "./ExternalLink";
import { Frame } from "./Frame";
import { SectionHeading } from "./SectionHeading";

describe("Frame", () => {
    it("is a div with the frame style by default and keeps extra classes", () => {
        const { container } = render(<Frame className="p-6">content</Frame>);

        const frame = container.firstElementChild as HTMLElement;
        expect(frame.tagName).toBe("DIV");
        expect(frame).toHaveClass("frame", "p-6");
    });

    it("can be any element and passes its props through", () => {
        render(
            <Frame as="a" href="mailto:a@b.co">
                mail
            </Frame>,
        );

        const link = screen.getByRole("link", { name: "mail" });
        expect(link).toHaveClass("frame");
        expect(link).toHaveAttribute("href", "mailto:a@b.co");
    });

    it("can wrap another component, such as the external link", () => {
        render(
            <Frame as={ExternalLink} href="https://example.com/x">
                site
            </Frame>,
        );

        const link = screen.getByRole("link", { name: /site/ });
        expect(link).toHaveClass("frame");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAccessibleName(/^site\s*\(opens in a new tab\)$/);
    });
});

describe("Chip", () => {
    it("lists its chips with an optional label", () => {
        render(
            <ChipList label="Technologies">
                <Chip>React</Chip>
                <Chip>Python</Chip>
            </ChipList>,
        );

        const list = screen.getByRole("list", { name: "Technologies" });
        expect(list).toHaveTextContent("ReactPython");
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
        expect(screen.getByText("React")).toHaveClass("chip");
    });
});

describe("SectionHeading", () => {
    it("is a level two heading with a small label above it", () => {
        render(<SectionHeading kicker="Projects" title="Things I’ve built" />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Things I’ve built");
        const label = screen.getByText("Projects");
        expect(label).toHaveClass("uppercase", "text-primary");
        expect(
            label.compareDocumentPosition(screen.getByRole("heading")) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
    });

    it("is left aligned, like the rest of the section", () => {
        const { container } = render(<SectionHeading kicker="About me" title="A title" description="Words" />);

        const box = container.firstElementChild as HTMLElement;
        expect(box).toHaveClass("text-left");
        expect(box.innerHTML).not.toContain("text-center");
        expect(box.innerHTML).not.toContain("mx-auto");
    });

    it("lets a section name itself after its heading", () => {
        render(<SectionHeading kicker="Contact" title="Get in touch" id="contact-heading" />);

        expect(screen.getByRole("heading")).toHaveAttribute("id", "contact-heading");
    });

    it("shows a description under the title only when there is one", () => {
        const { rerender } = render(<SectionHeading kicker="A" title="B" description="About this section" />);

        expect(screen.getByText("About this section")).toBeInTheDocument();

        rerender(<SectionHeading kicker="A" title="B" />);
        expect(screen.queryByText("About this section")).toBeNull();
    });
});
