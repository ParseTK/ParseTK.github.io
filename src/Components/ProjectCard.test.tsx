import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "./ProjectCard";
import type { ComingSoonProject, LiveProject } from "@/data/projects";

const baseProject: LiveProject = {
    id: "sample",
    title: "Sample",
    description: "A sample project",
    category: "python",
    tags: ["Python", "SQL"],
    githubUrl: "https://github.com/example/sample",
};

const comingSoon: ComingSoonProject = {
    id: "later",
    title: "Coming soon",
    description: "A new project is on the way.",
    category: "java",
    comingSoon: true,
};

describe("ProjectCard", () => {
    it("shows the title, description, technologies and a GitHub link that opens a new tab", () => {
        render(<ProjectCard project={baseProject} />);

        expect(screen.getByRole("heading", { name: "Sample", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("A sample project")).toBeInTheDocument();
        expect(screen.getByRole("list", { name: "Technologies" })).toHaveTextContent("PythonSQL");
        const link = screen.getByRole("link", { name: "Sample source code on GitHub (opens in a new tab)" });
        expect(link).toHaveAttribute("href", baseProject.githubUrl);
        expect(link).toHaveAttribute("target", "_blank");
    });

    it("has no image area when no image is supplied", () => {
        const { container } = render(<ProjectCard project={baseProject} />);

        expect(container.querySelector("img")).toBeNull();
        expect(container.querySelector(".aspect-video")).toBeNull();
    });

    it("shows a supplied image with its alt text", () => {
        render(<ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />);

        expect(screen.getByRole("img", { name: "Terminal output" })).toHaveAttribute("src", "/thumb.png");
        expect(screen.queryByRole("link", { name: /video/ })).toBeNull();
    });

    it("keeps a supplied image in a 16:9 frame so a video thumbnail is not cropped", () => {
        const { container } = render(<ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />);

        expect(screen.getByRole("img").closest(".aspect-video")).not.toBeNull();
        expect(container.querySelectorAll(".aspect-video")).toHaveLength(1);
    });

    it("links the image to the video when there is one", () => {
        render(
            <ProjectCard
                project={{
                    ...baseProject,
                    image: { src: "/thumb.png", alt: "Terminal output" },
                    videoUrl: "https://www.youtube.com/watch?v=abc",
                }}
            />,
        );

        const link = screen.getByRole("link", { name: "Watch the Sample video (opens in a new tab)" });
        expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=abc");
        expect(link).toContainElement(screen.getByRole("img", { name: "Terminal output" }));
    });

    it("marks a video thumbnail with a play badge that screen readers skip", () => {
        const { container } = render(
            <ProjectCard
                project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" }, videoUrl: "https://youtu.be/abc" }}
            />,
        );

        const badge = container.querySelector("svg.lucide-play")!.closest("[aria-hidden=true]");
        expect(badge).not.toBeNull();
        expect(screen.getByRole("link", { name: /Watch the Sample video/ })).toContainElement(badge as HTMLElement);
    });

    it("shows no play badge on an image that has no video", () => {
        const { container } = render(<ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />);

        expect(container.querySelector("svg.lucide-play")).toBeNull();
    });

    it("reserves the same 16:9 slot on a coming-soon card so a real thumbnail replaces it without a layout jump", () => {
        const { container } = render(<ProjectCard project={comingSoon} />);

        const slot = container.querySelector(".aspect-video");
        expect(slot).not.toBeNull();
        expect(slot).toHaveAttribute("aria-hidden", "true");
    });

    it("shows a coming-soon card with no link, image or technologies", () => {
        const { container } = render(<ProjectCard project={comingSoon} />);

        expect(screen.getByRole("heading", { name: "Coming soon", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("A new project is on the way.")).toBeInTheDocument();
        expect(container.querySelector("a")).toBeNull();
        expect(container.querySelector("img")).toBeNull();
        expect(screen.queryByRole("list", { name: "Technologies" })).toBeNull();
    });
});
