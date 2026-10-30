// Order here is the tab order; the first category is the one shown on load
export const PROJECT_CATEGORIES = [
    { id: "python", label: "Python" },
    { id: "applications", label: "Applications" },
    { id: "javascript", label: "JavaScript" },
    { id: "java", label: "Java" },
    { id: "csharp", label: "C#" },
    { id: "scripts", label: "Scripts" },
    { id: "other", label: "Other" },
] as const;

export type ProjectCategoryId = (typeof PROJECT_CATEGORIES)[number]["id"];

// Each tab is topped up with "coming soon" cards to this many; set to 0 to show only real projects
export const CARDS_PER_CATEGORY = 5;

interface ProjectBase {
    id: string;
    title: string;
    description: string;
    category: ProjectCategoryId;
    image?: { src: string; alt: string };
    videoUrl?: string;
}

export interface LiveProject extends ProjectBase {
    tags: readonly string[];
    githubUrl: string;
    comingSoon?: false;
}

export interface ComingSoonProject extends ProjectBase {
    comingSoon: true;
}

export type Project = LiveProject | ComingSoonProject;

const liveProjects: readonly LiveProject[] = [
    {
        id: "portfolio",
        title: "HomeScreen",
        description: "Portfolio Website",
        category: "applications",
        tags: ["React", "TypeScript", "Tailwind CSS"],
        githubUrl: "https://github.com/ParseTK/ParseTK.github.io",
    },
    {
        id: "fintk",
        title: "FinTk",
        description: "Full-stack Stock trends",
        category: "applications",
        tags: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "C#"],
        githubUrl: "https://github.com/ParseTK/FinTk/tree/main/frontend",
    },
    {
        id: "photodemo",
        title: "PhotoDemo",
        description: "OOP Fundamentals in C#",
        category: "csharp",
        tags: ["C#"],
        githubUrl: "https://github.com/ParseTK/C_Sharp_Projects/blob/main/CSharpExercises/PhotoDemo.cs",
    },
    {
        id: "paintjob",
        title: "PaintJob",
        description: "Calculates paint needed and cost for a job",
        category: "python",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/pythonProjects/blob/main/Paint%20Job.py",
    },
];

const comingSoonFor = (live: readonly LiveProject[]): ComingSoonProject[] =>
    PROJECT_CATEGORIES.flatMap(({ id: category }) => {
        const missing = Math.max(0, CARDS_PER_CATEGORY - live.filter((project) => project.category === category).length);
        return Array.from({ length: missing }, (_, index) => ({
            id: `${category}-coming-soon-${index + 1}`,
            title: "Coming soon",
            description: "A new project is on the way.",
            category,
            comingSoon: true as const,
        }));
    });

export const projects: readonly Project[] = [...liveProjects, ...comingSoonFor(liveProjects)];

export const projectsIn = (category: ProjectCategoryId): Project[] =>
    projects.filter((project) => project.category === category);
