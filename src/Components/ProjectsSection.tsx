import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Glow } from "./Glow";
import { Reveal } from "./Reveal";
import { ExternalLink } from "./ExternalLink";
import { Carousel } from "./carousel/Carousel";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { Tabs } from "./Tabs";
import { PROJECT_CATEGORIES, projectsIn, type ProjectCategoryId } from "@/data/projects";

export const ProjectsSection = () => {
    const [category, setCategory] = useState<ProjectCategoryId>(PROJECT_CATEGORIES[0].id);

    return (
        <section id="projects" className="py-24 px-4 relative isolate">
            <Glow className="-right-[40vmax] -bottom-[45vmax] [--glow-strength:15%]" />
            <div className="container mx-auto max-w-5xl">
                <SectionHeading
                    lead="Featured"
                    accent="Projects"
                    description="Here are some of the projects I've worked on. Pick a category and swipe through the cards, then use the GitHub link on a card to see the code."
                />

                <Reveal>
                <Tabs
                    label="Project categories"
                    tabs={PROJECT_CATEGORIES}
                    selectedId={category}
                    onSelect={(id) => setCategory(id as ProjectCategoryId)}
                >
                    <Carousel
                        key={category}
                        className="-mx-8 md:mx-0"
                        label="Projects"
                        noun="project"
                        items={projectsIn(category)}
                        getKey={(project) => project.id}
                        getTitle={(project) => project.title}
                        renderItem={(project) => <ProjectCard project={project} />}
                    />
                </Tabs>
                </Reveal>

                <div className="text-center mt-12">
                    <ExternalLink
                        className="cosmic-button w-fit flex items-center mx-auto gap-2"
                        href="https://github.com/parsetk"
                    >
                        Check my GitHub
                        <ArrowRight size={16} aria-hidden="true" />
                    </ExternalLink>
                </div>
            </div>
        </section>
    )
}
