import { useState } from "react";
import { cn } from "./lib/utils";

const skills = [{ name: "Html/CSS", level: 90, category: "frontend" },
                { name: "JavaScript", level: 60, category: "frontend" },
                { name: "React", level: 40, category: "frontend" },
                { name: "TypeScript", level: 40, category: "frontend" },
                { name: "TailwindCSS", level: 40, category: "frontend" },
                { name: "Next.js", level: 40, category: "frontend" },

                { name: "Node.js", level: 60, category: "backend" },
                { name: "Express.js", level: 50, category: "backend" },
                { name: "C# + EF Core", level: 70, category: "backend" },
                { name: "Python", level: 70, category: "backend" },
                { name: "Java", level: 30, category: "backend" },
                { name: "C++", level: 30, category: "backend" },
                { name: "MicrosoftSQL", level: 50, category: "backend" },
                { name: "Oracle SQL", level: 30, category: "backend" },
                { name: "SQLite", level: 50, category: "backend" },

                { name: "Git/GitHub", level: 100, category: "tools" },
                { name: "Visual Studio", level: 80, category: "tools" },
                { name: "Visual Studio Code", level: 80, category: "tools" },
                { name: "Tmux", level: 25, category: "tools" },
                { name: "Vim", level: 80, category: "tools" },
                { name: "Mocha", level: 25, category: "tools" },
                { name: "Dev tools", level: 75, category: "tools" },
                { name: "Unity/Unreal/GMS", level: 55, category: "tools" },
                { name: "Blender", level: 20, category: "tools" },
];
const categories = ["all", "frontend", "backend", "tools"];
export const SkillsSection = () => {
    const [activeCategory, setActiveCategory] = useState("all");
    const filteredSkills = skills.filter((skill) => activeCategory === "all" || skill.category === activeCategory)
  return (
    <section id="skills" className="py-24 px-4 relative bg-secondary/30">
        <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                My <span className="text-primary"> Skills</span>
            </h2>

            <div
                role="group"
                aria-label="Filter skills by category"
                className="flex flex-wrap justify-center gap-4 mb-12"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        aria-pressed={activeCategory === category}
                        className={cn("px-5 py-2 rounded-full transition-colors duration-300 capitalize",
                            activeCategory === category ?
                              "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                        )}>
                            {category}
                        </button>
                ))}
            </div>

            <p className="sr-only" role="status">
                Showing {filteredSkills.length} {activeCategory === "all" ? "" : activeCategory + " "}skills
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                    <li key={skill.name} className="bg-card p-6 rounded-lg shadow-xs card-hover">
                        <div className="text-left mb-4">
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                        </div>
                        <div aria-hidden="true" className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-2 rounded-full origin-left animate-grow"
                                style={{ width: skill.level + "%" }}
                            />
                        </div>
                        <div className="text-right mt-1">
                            <span className="text-sm text-muted-foreground">
                                <span className="sr-only">Proficiency: </span>
                                {skill.level}%
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    </section>
  );
};
