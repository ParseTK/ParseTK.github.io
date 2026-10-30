import { fireEvent, render, screen } from "@testing-library/react";
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

    it("keeps an empty 16:9 slot, with no image, until a thumbnail is supplied", () => {
        const { container } = render(<ProjectCard project={baseProject} />);

        expect(container.querySelector("img")).toBeNull();
        const slot = container.querySelector(".aspect-video");
        expect(slot).not.toBeNull();
        expect(slot).toHaveAttribute("aria-hidden", "true");
    });

    it("gives a real project and a coming-soon card the same frame and the same slot", () => {
        const real = render(<ProjectCard project={baseProject} />).container;
        const later = render(<ProjectCard project={comingSoon} />).container;

        const frameOf = (container: HTMLElement) => container.querySelector("article")!.className;
        const slotOf = (container: HTMLElement) => container.querySelector(".aspect-video")!.className;
        expect(frameOf(real)).toBe(frameOf(later));
        expect(slotOf(real)).toBe(slotOf(later));
    });

    it("has no dotted border on any card", () => {
        for (const project of [baseProject, comingSoon]) {
            const { container } = render(<ProjectCard project={project} />);

            expect(container.innerHTML).not.toMatch(/dashed|dotted/);
        }
    });

    it("shows a supplied image with its alt text", () => {
        render(<ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />);

        expect(screen.getByRole("img", { name: "Terminal output" })).toHaveAttribute("src", "/thumb.png");
        expect(screen.queryByRole("link", { name: /video/ })).toBeNull();
    });

    it("keeps a supplied image in a 16:9 frame so a video thumbnail is not cropped", () => {
        const { container } = render(
            <ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />,
        );

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
                project={{
                    ...baseProject,
                    image: { src: "/thumb.png", alt: "Terminal output" },
                    videoUrl: "https://youtu.be/abc",
                }}
            />,
        );

        const badge = container.querySelector("svg.lucide-play")!.closest("[aria-hidden=true]");
        expect(badge).not.toBeNull();
        expect(screen.getByRole("link", { name: /Watch the Sample video/ })).toContainElement(badge as HTMLElement);
    });

    it("shows no play badge on an image that has no video", () => {
        const { container } = render(
            <ProjectCard project={{ ...baseProject, image: { src: "/thumb.png", alt: "Terminal output" } }} />,
        );

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

describe("ProjectCard tooltip", () => {
    it("labels the GitHub icon on a real project", () => {
        const { container } = render(<ProjectCard project={baseProject} />);

        const tip = container.querySelector("[data-tooltip]")!;
        expect(tip).toHaveTextContent("Source code on GitHub");
        expect(tip.parentElement).toContainElement(
            screen.getByRole("link", { name: "Sample source code on GitHub (opens in a new tab)" }),
        );
    });

    it("has none on a coming-soon card, which has no icon", () => {
        const { container } = render(<ProjectCard project={comingSoon} />);

        expect(container.querySelector("[data-tooltip]")).toBeNull();
    });
});

describe("ProjectCard video pop-out", () => {
    const withVideo: LiveProject = {
        ...baseProject,
        image: { src: "/poster.png", alt: "A still from the Sample demo video" },
        video: { src: "/clip.mp4" },
    };
    const openIt = () => {
        render(<ProjectCard project={withVideo} />);
        fireEvent.click(screen.getByRole("button", { name: "Play the Sample video" }));
    };

    it("turns the thumbnail into a button that announces a dialog, with the play badge on it", () => {
        const { container } = render(<ProjectCard project={withVideo} />);

        const button = screen.getByRole("button", { name: "Play the Sample video" });
        expect(button).toHaveAttribute("aria-haspopup", "dialog");
        expect(button).toContainElement(screen.getByRole("img", { name: "A still from the Sample demo video" }));
        expect(button).toContainElement(container.querySelector("svg.lucide-play") as HTMLElement);
        expect(screen.queryByRole("link", { name: /video/ })).toBeNull();
    });

    it("loads nothing of the video until it is opened", () => {
        const { container } = render(<ProjectCard project={withVideo} />);

        expect(screen.queryByRole("dialog")).toBeNull();
        expect(container.querySelector("video")).toBeNull();
        expect(document.querySelector("video, source")).toBeNull();
    });

    it("opens a dialog named after the project, with a playable video that starts from the thumbnail", () => {
        openIt();

        const dialog = screen.getByRole("dialog", { name: "Sample" });
        const video = dialog.querySelector("video") as HTMLVideoElement;
        expect(video).toHaveAttribute("controls");
        expect(video).toHaveAttribute("poster", "/poster.png");
        expect(video.querySelector("source")).toHaveAttribute("src", "/clip.mp4");
        expect(video.querySelector("source")).toHaveAttribute("type", "video/mp4");
    });

    it("closes from the close button, and the video leaves the page with it", () => {
        openIt();

        fireEvent.click(screen.getByRole("button", { name: "Close video" }));

        expect(screen.queryByRole("dialog")).toBeNull();
        expect(document.querySelector("video")).toBeNull();
    });

    it("closes on Escape", () => {
        openIt();

        fireEvent.keyDown(window, { key: "Escape" });

        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("closes when the dimmed page around it is pressed, but not when the video is", () => {
        openIt();
        const dialog = screen.getByRole("dialog");

        fireEvent.click(dialog.querySelector("video") as HTMLVideoElement);
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        fireEvent.click(dialog);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("locks page scrolling while it is open and restores it afterwards", () => {
        openIt();
        expect(document.documentElement.style.overflow).toBe("hidden");

        fireEvent.click(screen.getByRole("button", { name: "Close video" }));

        expect(document.documentElement.style.overflow).toBe("");
    });

    it("can be reopened after closing", () => {
        openIt();
        fireEvent.click(screen.getByRole("button", { name: "Close video" }));

        fireEvent.click(screen.getByRole("button", { name: "Play the Sample video" }));

        expect(screen.getByRole("dialog", { name: "Sample" })).toBeInTheDocument();
    });

    it("still links out for a video hosted elsewhere", () => {
        render(<ProjectCard project={{ ...withVideo, video: undefined, videoUrl: "https://youtu.be/abc" }} />);

        expect(screen.getByRole("link", { name: "Watch the Sample video (opens in a new tab)" })).toHaveAttribute(
            "href",
            "https://youtu.be/abc",
        );
        expect(screen.queryByRole("button", { name: /Play the/ })).toBeNull();
    });
});

describe("ProjectCard background", () => {
    it("is solid, so the card behind it in the carousel cannot show through its text", () => {
        const { container } = render(<ProjectCard project={baseProject} />);

        expect(container.querySelector("article")).toHaveClass("bg-card!");
    });
});

describe("ProjectCard video pop-out focus", () => {
    const withVideo: LiveProject = {
        ...baseProject,
        image: { src: "/poster.png", alt: "A still from the Sample demo video" },
        video: { src: "/clip.mp4" },
    };

    it.each([
        ["the close button", () => fireEvent.click(screen.getByRole("button", { name: "Close video" }))],
        ["Escape", () => fireEvent.keyDown(window, { key: "Escape" })],
        ["a press on the dimmed page", () => fireEvent.click(screen.getByRole("dialog"))],
    ])("goes back to the thumbnail button after closing with %s", (_how, close) => {
        render(<ProjectCard project={withVideo} />);
        const button = screen.getByRole("button", { name: "Play the Sample video" });
        fireEvent.click(button);

        close();

        expect(screen.queryByRole("dialog")).toBeNull();
        expect(button).toHaveFocus();
    });
});
