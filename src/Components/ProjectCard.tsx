import { useEffect, useRef, useState, type ReactNode } from "react";
import { Play } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import { Chip, ChipList } from "./Chip";
import { ExternalLink } from "./ExternalLink";
import { Frame } from "./Frame";
import { Tooltip } from "./Tooltip";
import { VideoDialog } from "./VideoDialog";
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

// The thumbnail is a button that opens the video in a pop-out; nothing of the video loads until then
const PlayableMedia = ({
    title,
    video,
    poster,
    picture,
}: {
    title: string;
    video: { src: string };
    poster: string;
    picture: ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // The dialog is removed from the page when it closes, so the browser cannot return focus by itself. This waits
    // until it is gone: while a modal dialog is still open, everything behind it refuses focus.
    const wasOpen = useRef(false);
    useEffect(() => {
        if (wasOpen.current && !isOpen) buttonRef.current?.focus();
        wasOpen.current = isOpen;
    }, [isOpen]);

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(true)}
                aria-haspopup="dialog"
                aria-label={`Play the ${title} video`}
                className={cn(MEDIA_FRAME, "group/media")}
            >
                {picture}
                <PlayBadge />
            </button>
            {isOpen && <VideoDialog title={title} src={video.src} poster={poster} onClose={() => setIsOpen(false)} />}
        </>
    );
};

const ProjectMedia = ({ project }: { project: Project }) => {
    const { image, video, videoUrl } = project;

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

    const picture = (
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
    );
    if (video) return <PlayableMedia title={project.title} video={video} poster={image.src} picture={picture} />;
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
    <Frame as="article" className="flex h-full flex-col bg-card! text-left">
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
                <Tooltip label="Source code on GitHub" className="mt-auto w-fit">
                    <ExternalLink
                        href={project.githubUrl}
                        label={`${project.title} source code on GitHub`}
                        className="inline-flex rounded-full p-2 text-foreground/80 transition-colors duration-300 hover:text-primary"
                    >
                        <GithubIcon size={20} aria-hidden="true" />
                    </ExternalLink>
                </Tooltip>
            )}
        </div>
    </Frame>
);
