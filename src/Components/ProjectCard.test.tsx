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
    });

    it("shows a supplied image with its alt text", () => {
        render(<ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />);

        expect(screen.getByRole("img", { name: "Terminal output" })).toHaveAttribute("src", "/thumb.png");
        expect(screen.queryByRole("link", { name: /video/ })).toBeNull();
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

    it("shows a coming-soon card with no link, image or technologies", () => {
        const { container } = render(<ProjectCard project={comingSoon} />);

        expect(screen.getByRole("heading", { name: "Coming soon", level: 3 })).toBeInTheDocument();
        expect(screen.getByText("A new project is on the way.")).toBeInTheDocument();
        expect(container.querySelector("a")).toBeNull();
        expect(container.querySelector("img")).toBeNull();
        expect(screen.queryByRole("list", { name: "Technologies" })).toBeNull();
    });
});
