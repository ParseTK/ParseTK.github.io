import { ArrowRight, Github } from "lucide-react";

interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    tags: string[];
    githubUrl: string;
}

const projects: Project[] = [
    {
        id: 1,
        title: "HomeScreen",
        description: "Portfolio Website",
        image: "/projects/HomeScreen.png",
        imageAlt: "Portfolio home screen on a dark starry background with the heading Hello, I'm Tyler Kirchner and a View My Projects button",
        tags: ["React", "TypeScript", "Tailwind CSS"],
        githubUrl: "https://github.com/ParseTK/ParseTK.github.io",
    },
    {
        id: 2,
        title: "FinTk",
        description: "Full-stack Stock trends",
        image: "/projects/FinTk.png",
        imageAlt: "FinTk stock app with a search box containing AAPL, an empty My Portfolio list and an Apple Inc. result with an Add to Portfolio button",
        tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "C#"],
        githubUrl: "https://github.com/ParseTK/FinTk/tree/main/frontend",
    },
    {
        id: 3,
        title: "PhotoDemo",
        description: "OOP Fundamentals in C#",
        image: "/projects/PhotoDemo.png",
        imageAlt: "Code editor showing the PhotoDemo C# assignment next to program output listing Photo, MattedPhoto and FramedPhoto prices",
        tags: ["C#"],
        githubUrl: "https://github.com/ParseTK/C_Sharp_Projects/blob/main/CSharpExercises/PhotoDemo.cs",
    },
    {
        id: 4,
        title: "PaintJob",
        description: "Calculates paint needed and cost for a job",
        image: "/projects/PaintJob.png",
        imageAlt: "Terminal session answering paint job questions and printing paint charges, labor charges, tax and a total cost of $90.30",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/pythonProjects/blob/main/Paint%20Job.py",
    },
];

export const ProjectsSection = () => {
    return (
        <section id="projects" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                    Featured <span className="text-primary">Projects</span>
                </h2>

                <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Here are some of the projects I've worked on.
                    Use the GitHub link on each card to see the code.
                </p>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <li key={project.id} className="group bg-card rounded-lg overflow-hidden shadow-xs card-hover">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.imageAlt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <ul aria-label="Technologies" className="flex flex-wrap justify-center gap-2 mb-4">
                                    {project.tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                                <h3 className="text-xl font-semibold mb-1">
                                    {project.title}
                                </h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    {project.description}
                                </p>
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                                    className="inline-flex p-2 rounded-full text-foreground/80 hover:text-primary transition-colors duration-300"
                                >
                                    <Github size={20} aria-hidden="true" />
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="text-center mt-12">
                    <a
                        className="cosmic-button w-fit flex items-center mx-auto gap-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/parsetk"
                    >
                        Check my GitHub
                        <ArrowRight size={16} aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                    </a>
                </div>
            </div>
        </section>
    )
}
