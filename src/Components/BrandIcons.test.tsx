import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

describe.each([
    ["GitHub", GithubIcon],
    ["LinkedIn", LinkedinIcon],
])("%s icon", (_name, Icon) => {
    it("draws a filled 24px mark that takes the text colour and the size it is given", () => {
        const { container } = render(<Icon size={20} aria-hidden="true" className="text-primary" />);
        const svg = container.querySelector("svg") as SVGSVGElement;

        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
        expect(svg).toHaveAttribute("width", "20");
        expect(svg).toHaveAttribute("fill", "currentColor");
        expect(svg).toHaveAttribute("aria-hidden", "true");
        expect(svg).toHaveClass("text-primary");
        expect(svg.querySelector("path")?.getAttribute("d")).toBeTruthy();
    });
});
