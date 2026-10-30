import { Github, Play } from "lucide-react";
import { Chip, ChipList } from "./Chip";
import { ExternalLink } from "./ExternalLink";
import { Frame } from "./Frame";
import { cn } from "./lib/utils";
import type { Project } from "@/data/projects";

// Thumbnails are 16:9, so the frame keeps that shape instead of cropping them
const MEDIA_FRAME = "relative block aspect-video w-full overflow-hidden";

const PlayBadge = () => (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="grid h-10 w-14 place-items-center rounded-lg border border-border bg-background/70 text-foreground backdrop-blur-sm transition-colors group-hover/media:bg-primary group-hover/media:text-primary-foreground group-focus-visible/media:bg-primary group-focus-visible/media:text-primary-foreground">
            <Play size={18} fill="currentColor" />
        </span>
    </span>
);

const ProjectMedia = ({ project }: { project: Project }) => {
    const { image, videoUrl } = project;

    // A card with no thumbnail yet keeps the same 16:9 slot, so every card has the same shape
    if (project.comingSoon || !image) {
        return (
            <div
                aria-hidden="true"
                className={cn(
                    MEDIA_FRAME,
                    "grid place-items-center border-b border-border bg-secondary/40 text-muted-foreground",
                )}
            >
                <Play size={22} />
            </div>
        );
    }

    const picture = <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />;
    if (!videoUrl) return <div className={MEDIA_FRAME}>{picture}</div>;

    return (
        <ExternalLink
            href={videoUrl}
            label={`Watch the ${project.title} video`}
            className={cn(MEDIA_FRAME, "group/media")}
        >
            {picture}
            <PlayBadge />
        </ExternalLink>
    );
};

export const ProjectCard = ({ project }: { project: Project }) => (
    <Frame as="article" className="flex h-full flex-col text-left">
        <ProjectMedia project={project} />
        <div className="flex flex-1 flex-col p-6">
            {!project.comingSoon && (
                <ChipList label="Technologies" className="mb-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <Chip key={tag}>{tag}</Chip>
                    ))}
                </ChipList>
            )}
            <h3 className={cn("mb-1 text-xl font-semibold", project.comingSoon && "text-muted-foreground")}>
                {project.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
            {!project.comingSoon && (
                <ExternalLink
                    href={project.githubUrl}
                    label={`${project.title} source code on GitHub`}
                    className="mt-auto inline-flex w-fit rounded-full p-2 text-foreground/80 transition-colors duration-300 hover:text-primary"
                >
                    <Github size={20} aria-hidden="true" />
                </ExternalLink>
            )}
        </div>
    </Frame>
);
