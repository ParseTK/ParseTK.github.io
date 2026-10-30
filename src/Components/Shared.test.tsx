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
    it("is a level two heading with the accent word in the accent color and a space before it", () => {
        render(<SectionHeading lead="About" accent="Me" />);

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent("About Me");
        expect(screen.getByText("Me")).toHaveClass("text-primary");
    });

    it("works without an accent word", () => {
        render(<SectionHeading lead="Hello" />);

        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Hello");
    });

    it("shows a description below and leaves less space under the heading when there is one", () => {
        const { rerender } = render(<SectionHeading lead="A" description="About this section" />);

        expect(screen.getByText("About this section")).toBeInTheDocument();
        const withText = screen.getByRole("heading").className;

        rerender(<SectionHeading lead="A" />);
        expect(screen.getByRole("heading").className).not.toBe(withText);
    });
});
