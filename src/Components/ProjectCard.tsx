import { Github } from "lucide-react";
import { ExternalLink } from "./ExternalLink";
import { cn } from "./lib/utils";
import type { Project } from "@/data/projects";

export const ProjectCard = ({ project }: { project: Project }) => {
    const { image, videoUrl } = project;

    const picture = image && (
        <img src={image.src} alt={image.alt} className="h-48 w-full object-cover" />
    );

    return (
        <article
            className={cn(
                "flex h-full flex-col overflow-hidden rounded-lg bg-card text-left",
                project.comingSoon ? "border border-dashed border-input" : "shadow-xs card-hover"
            )}
        >
            {picture && (
                <div className="overflow-hidden">
                    {videoUrl ? (
                        <ExternalLink href={videoUrl} label={`Watch the ${project.title} video`}>
                            {picture}
                        </ExternalLink>
                    ) : (
                        picture
                    )}
                </div>
            )}
            <div className="flex flex-1 flex-col p-6">
                {!project.comingSoon && (
                    <ul aria-label="Technologies" className="mb-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
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
        </article>
    );
};
