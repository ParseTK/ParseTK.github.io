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
    // The still shown on the card; it is also the poster of a video played on the site
    image?: { src: string; alt: string };
    // A video hosted with the site, played in a pop-out
    video?: { src: string };
    // A video hosted elsewhere (YouTube), opened in a new tab
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

const demoVideo = (id: string, title: string) => ({
    image: { src: `/projects/posters/${id}.png`, alt: `A still from the ${title} demo video` },
    video: { src: `/projects/videos/${id}.mp4` },
});

const liveProjects: readonly LiveProject[] = [
    {
        id: "passvalidator",
        title: "Password Validator",
        description:
            "Checks a password against configurable rules and lists every rule it breaks, until the password is valid.",
        category: "python",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/Python2-PasswordValidator",
        ...demoVideo("passvalidator", "Password Validator"),
    },
    {
        id: "planetweights",
        title: "Planetary Weights",
        description: "Converts your weight to every planet, saves a history and keeps rotating backups.",
        category: "python",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/PlanetWeights",
        ...demoVideo("planetweights", "Planetary Weights"),
    },
    {
        id: "realestate",
        title: "Real Estate Analyzer",
        description: "Reads a property-sales file and shows price statistics by city, type and zip code.",
        category: "python",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/RealEstateAnalyzer",
        ...demoVideo("realestate", "Real Estate Analyzer"),
    },
    {
        id: "taxyear",
        title: "Tax Year Validator",
        description: "Uses SQLite to check each employee's yearly earnings against the Social Security minimum.",
        category: "python",
        tags: ["Python", "SQLite"],
        githubUrl: "https://github.com/ParseTK/TaxYearValidator",
        ...demoVideo("taxyear", "Tax Year Validator"),
    },
    {
        id: "numerology",
        title: "Numerology",
        description: "Calculates life path and other numerology numbers from a name and birthday.",
        category: "python",
        tags: ["Python"],
        githubUrl: "https://github.com/ParseTK/NumerologyProject",
        ...demoVideo("numerology", "Numerology"),
    },
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
        const missing = Math.max(
            0,
            CARDS_PER_CATEGORY - live.filter((project) => project.category === category).length,
        );
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
