import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CARDS_PER_CATEGORY, PROJECT_CATEGORIES, projects, projectsIn, type LiveProject } from "./projects";

const live = projects.filter((project): project is LiveProject => !project.comingSoon);

describe("project categories", () => {
    it("have unique ids and labels", () => {
        expect(new Set(PROJECT_CATEGORIES.map((category) => category.id)).size).toBe(PROJECT_CATEGORIES.length);
        expect(new Set(PROJECT_CATEGORIES.map((category) => category.label)).size).toBe(PROJECT_CATEGORIES.length);
    });

    it("start with Python so it is the tab shown on load", () => {
        expect(PROJECT_CATEGORIES[0].id).toBe("python");
    });

    it("include an Applications tab and no catch-all tab", () => {
        const labels = PROJECT_CATEGORIES.map((category) => category.label);

        expect(labels).toContain("Applications");
        expect(labels).not.toContain("All");
    });
});

describe("projects", () => {
    it("have unique ids", () => {
        expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    });

    it("belong to a known category", () => {
        const known = new Set(PROJECT_CATEGORIES.map((category) => category.id as string));
        for (const project of projects) {
            expect(known.has(project.category), project.id).toBe(true);
        }
    });

    it("give every tab the same number of cards while real projects fit", () => {
        for (const { id } of PROJECT_CATEGORIES) {
            const realCount = live.filter((project) => project.category === id).length;
            expect(projectsIn(id).length, id).toBe(Math.max(realCount, CARDS_PER_CATEGORY));
        }
    });

    it("list real projects before coming-soon ones within a tab", () => {
        for (const { id } of PROJECT_CATEGORIES) {
            const flags = projectsIn(id).map((project) => Boolean(project.comingSoon));
            expect(flags, id).toEqual([...flags].sort());
        }
    });

    it("give real projects a description, technologies and a secure GitHub link", () => {
        for (const project of live) {
            expect(project.title, project.id).not.toBe("");
            expect(project.description, project.id).not.toBe("");
            expect(project.tags.length, project.id).toBeGreaterThan(0);
            expect(project.githubUrl, project.id).toMatch(/^https:\/\/github\.com\//);
            expect(project.githubUrl, project.id).not.toMatch(/\s/);
        }
    });

    it("require alt text for any image and a YouTube address for any video", () => {
        for (const project of projects) {
            if (project.image) expect(project.image.alt.trim(), project.id).not.toBe("");
            if (project.videoUrl)
                expect(project.videoUrl, project.id).toMatch(/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//);
        }
    });

    it("keep coming-soon cards free of links, images and technologies", () => {
        const placeholders = projects.filter((project) => project.comingSoon);

        expect(placeholders.length).toBeGreaterThan(0);
        for (const project of placeholders) {
            expect(project, project.id).not.toHaveProperty("githubUrl");
            expect(project, project.id).not.toHaveProperty("tags");
            expect(project.image, project.id).toBeUndefined();
            expect(project.videoUrl, project.id).toBeUndefined();
        }
    });
});

describe("project media on the site", () => {
    const publicFile = (address: string) => resolve(process.cwd(), "public", address.replace(/^\//, ""));
    const hosted = projects.filter((project) => project.video);
    const MAX_VIDEO_BYTES = 5 * 1024 * 1024;

    it("has at least one video to play", () => {
        expect(hosted.length).toBeGreaterThan(0);
    });

    it("gives every hosted video a still of its own, with alt text, as the card image", () => {
        for (const project of hosted) {
            expect(project.image, project.id).toBeDefined();
            expect(project.image!.alt.trim(), project.id).not.toBe("");
            expect(project.image!.src, project.id).toMatch(/^\/projects\/posters\/[\w-]+\.png$/);
        }
    });

    it("points every video and still at a file that exists", () => {
        for (const project of projects) {
            for (const address of [project.image?.src, project.video?.src]) {
                if (address) expect(existsSync(publicFile(address)), `${project.id}: ${address}`).toBe(true);
            }
        }
    });

    it("keeps each hosted video small enough to start quickly and to keep the repository light", () => {
        for (const project of hosted) {
            expect(project.video!.src, project.id).toMatch(/^\/projects\/videos\/[\w-]+\.mp4$/);
            expect(statSync(publicFile(project.video!.src)).size, project.id).toBeLessThan(MAX_VIDEO_BYTES);
        }
    });

    it("never hosts a video and links one elsewhere on the same card", () => {
        for (const project of projects) expect(Boolean(project.video && project.videoUrl), project.id).toBe(false);
    });
});
