import { ChevronDown } from "lucide-react";
import { skillGroups, type SkillGroup } from "@/data/skills";
import { useMediaQuery } from "./lib/useMediaQuery";
import { Chip, ChipList } from "./Chip";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const SkillChips = ({ skills }: { skills: SkillGroup["skills"] }) => (
    <ChipList>
        {skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
        ))}
    </ChipList>
);

export const SkillsSection = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <section id="skills" aria-labelledby="skills-heading" className="py-24 px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">
                <SectionHeading
                    kicker="Technical skills"
                    title="What I work with"
                    id="skills-heading"
                    description="Passionate about building software that makes a difference. I enjoy creating applications that are not only functional, accessible, user-friendly, and visually appealing, but also follow production-ready best practices. I am a strong advocate for clean code, test-driven development, and continuous learning."
                />

                <Reveal>
                    <div key={isDesktop ? "desktop" : "mobile"} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skillGroups.map((group, index) =>
                            isDesktop ? (
                                <Frame key={group.id} className="p-6 text-left">
                                    <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
                                    <SkillChips skills={group.skills} />
                                </Frame>
                            ) : (
                                <Frame as="details" key={group.id} open={index === 0} className="group text-left">
                                    <summary className="flex items-center gap-3 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                        <h3 className="flex-1 font-semibold text-lg">{group.title}</h3>
                                        <span className="text-sm text-muted-foreground">
                                            {group.skills.length} skills
                                        </span>
                                        <ChevronDown
                                            aria-hidden="true"
                                            className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                                        />
                                    </summary>
                                    <div className="px-5 pb-5">
                                        <SkillChips skills={group.skills} />
                                    </div>
                                </Frame>
                            ),
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};
