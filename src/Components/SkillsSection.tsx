import { ChevronDown } from "lucide-react";
import { skillGroups, type SkillGroup } from "@/data/skills";
import { useMediaQuery } from "./lib/useMediaQuery";

const SkillChips = ({ skills }: { skills: SkillGroup["skills"] }) => (
    <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
            <li
                key={skill}
                className="px-3 py-1 text-sm rounded-full border border-border bg-secondary text-secondary-foreground"
            >
                {skill}
            </li>
        ))}
    </ul>
);

export const SkillsSection = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <section id="skills" className="py-24 px-4 relative bg-secondary/30">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    Technical <span className="text-primary">Skills</span>
                </h2>

                <div
                    key={isDesktop ? "desktop" : "mobile"}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {skillGroups.map((group, index) =>
                        isDesktop ? (
                            <div key={group.id} className="bg-card p-6 rounded-lg shadow-xs text-left">
                                <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
                                <SkillChips skills={group.skills} />
                            </div>
                        ) : (
                            <details
                                key={group.id}
                                open={index === 0}
                                className="group bg-card rounded-lg shadow-xs text-left"
                            >
                                <summary className="flex items-center gap-3 p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                    <h3 className="flex-1 font-semibold text-lg">{group.title}</h3>
                                    <span className="text-sm text-muted-foreground">{group.skills.length} skills</span>
                                    <ChevronDown
                                        aria-hidden="true"
                                        className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
                                    />
                                </summary>
                                <div className="px-5 pb-5">
                                    <SkillChips skills={group.skills} />
                                </div>
                            </details>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};
