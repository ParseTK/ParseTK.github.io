import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Timeline } from "./Timeline";
import { AboutMe } from "./AboutSection";
import { STATUS_LABEL, timeline, type TimelineItem } from "@/data/timeline";
import { axe } from "@/test/axe";

const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

const sample: TimelineItem[] = [
    { id: "a", title: "First", detail: "In progress now", status: "in-progress" },
    { id: "b", title: "Second", detail: "Done", status: "completed" },
    { id: "c", title: "Third", detail: "Done too", status: "completed" },
];

describe("timeline data", () => {
    it("lists Elms College, then the internship, then STCC", () => {
        expect(timeline.map((item) => item.title)).toEqual(["Elms College", "Software engineering intern", "STCC"]);
    });

    it("has only Elms College in progress", () => {
        expect(timeline.filter((item) => item.status === "in-progress").map((item) => item.id)).toEqual(["elms"]);
    });

    it("has unique ids and a label for every status", () => {
        expect(new Set(timeline.map((item) => item.id)).size).toBe(timeline.length);
        for (const item of timeline) expect(STATUS_LABEL[item.status]).toBeTruthy();
    });
});

describe("Timeline", () => {
    it("is an ordered list with one item per entry, title and detail", () => {
        render(<Timeline items={sample} />);

        const items = within(screen.getByRole("list")).getAllByRole("listitem");
        expect(items).toHaveLength(3);
        expect(within(items[0]).getByRole("heading", { level: 4 })).toHaveTextContent("First");
        expect(items[0]).toHaveTextContent("In progress now");
    });

    it("tells screen readers whether each entry is in progress or completed", () => {
        render(<Timeline items={sample} />);

        expect(screen.getByRole("heading", { name: /^First\s*\(in progress\)$/ })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /^Second\s*\(completed\)$/ })).toBeInTheDocument();
    });

    it("hides the markers from assistive technology", () => {
        const { container } = render(<Timeline items={sample} />);

        for (const marker of container.querySelectorAll("[data-marker]")) {
            expect(marker.closest("[aria-hidden=true]")).not.toBeNull();
        }
    });

    it("marks only the in-progress entry as animated and the others as filled", () => {
        const { container } = render(<Timeline items={sample} />);

        const states = [...container.querySelectorAll("[data-status]")].map((fill) => fill.getAttribute("data-status"));
        expect(states).toEqual(["in-progress", "completed", "completed"]);
    });

    it("draws a connecting line between entries but none after the last", () => {
        const { container } = render(<Timeline items={sample} />);

        expect(container.querySelectorAll("[data-line]")).toHaveLength(2);
        const lastItem = container.querySelectorAll("li")[2];
        expect(lastItem.querySelector("[data-line]")).toBeNull();
    });

    it("centres every marker and every line on the middle of the same column", () => {
        const { container } = render(<Timeline items={sample} />);

        for (const item of container.querySelectorAll("li")) {
            const column = item.querySelector("[data-marker]")!.parentElement!;
            const line = item.querySelector("[data-line]");
            for (const part of [item.querySelector("[data-marker]")!, ...(line ? [line] : [])]) {
                expect(part.parentElement).toBe(column);
                expect(part).toHaveClass("left-1/2", "-translate-x-1/2");
            }
        }
    });

    it("has no detectable accessibility violations", async () => {
        const { container } = render(<Timeline items={sample} />);

        expect(await axe(container)).toHaveNoViolations();
    });
});

describe("marker animation in CSS", () => {
    const block = /@utility marker-fill \{[\s\S]*?\n\}\n/.exec(css)![0];

    it("fills from the bottom to the top and drains back, looping", () => {
        expect(block).toMatch(/animation: marker-level [\d.]+s ease-in-out infinite/);
        const keyframes = /@keyframes marker-level \{[\s\S]*?\n\}\n/.exec(css)![0];
        expect(keyframes).toContain("inset(100% 0 0 0)");
        expect(keyframes).toContain("inset(0)");
    });

    it("rests half full instead of animating when motion is reduced", () => {
        const reduced = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\}\s*\}\s*\}/.exec(block)![1];

        expect(reduced).toContain("animation: none");
        expect(reduced).toContain("inset(50% 0 0 0)");
    });
});

describe("About section", () => {
    it("shows the timeline instead of the three generic cards", () => {
        render(<AboutMe />);

        expect(screen.getByRole("heading", { level: 3, name: "Where I'm coming from" })).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(timeline.length);
        for (const removed of ["Full-Stack Development", "UI:UX", "Project management"]) {
            expect(screen.queryByText(removed)).toBeNull();
        }
    });

    it("keeps the contact shortcut and the résumé download", () => {
        render(<AboutMe />);

        expect(screen.getByRole("link", { name: "Get In Touch" })).toHaveAttribute("href", "#contact");
        expect(screen.getByRole("link", { name: "Download Résumé (PDF)" })).toHaveAttribute(
            "href",
            "/TKirchner_Resume_2027.pdf",
        );
    });
});
