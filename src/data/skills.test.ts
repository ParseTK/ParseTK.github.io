import { describe, expect, it } from "vitest";
import { skillGroups } from "./skills";

describe("skill data", () => {
    it("has uniquely named, non-empty groups", () => {
        const ids = skillGroups.map((group) => group.id);
        const titles = skillGroups.map((group) => group.title);

        expect(new Set(ids).size).toBe(ids.length);
        expect(new Set(titles).size).toBe(titles.length);
        for (const group of skillGroups) {
            expect(group.title.trim()).not.toBe("");
            expect(group.skills.length).toBeGreaterThan(0);
        }
    });

    it("lists each skill only once across all groups", () => {
        const skills = skillGroups.flatMap((group) => group.skills.map((skill) => skill.toLowerCase()));

        expect(new Set(skills).size).toBe(skills.length);
    });
});
