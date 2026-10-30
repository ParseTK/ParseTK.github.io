import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillsSection } from "./SkillsSection";
import { skillGroups } from "@/data/skills";
import { setViewportWidth } from "@/test/matchMedia";

describe("SkillsSection", () => {
    it("shows every group, always open, on desktop", () => {
        setViewportWidth(1280);
        const { container } = render(<SkillsSection />);

        expect(container.querySelectorAll("details")).toHaveLength(0);
        for (const group of skillGroups) {
            expect(screen.getByRole("heading", { level: 3, name: group.title })).toBeInTheDocument();
            for (const skill of group.skills) {
                expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
            }
        }
    });

    it("collapses groups into disclosures on a phone with only the first one open", () => {
        setViewportWidth(375);
        const { container } = render(<SkillsSection />);
        const groups = [...container.querySelectorAll("details")];

        expect(groups).toHaveLength(skillGroups.length);
        expect(groups.map((group) => group.hasAttribute("open"))).toEqual(
            skillGroups.map((_, index) => index === 0),
        );
    });

    it("shows how many skills each collapsed group holds", () => {
        setViewportWidth(375);
        render(<SkillsSection />);

        for (const group of skillGroups) {
            expect(screen.getAllByText(`${group.skills.length} skills`).length).toBeGreaterThan(0);
        }
    });
});
