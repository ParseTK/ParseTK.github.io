export interface SkillGroup {
    id: string;
    title: string;
    skills: readonly string[];
}

export const skillGroups: readonly SkillGroup[] = [
    {
        id: "languages",
        title: "Languages",
        skills: ["C#", "TypeScript", "JavaScript", "Python", "Java", "SQL", "HTML/CSS"],
    },
    {
        id: "frameworks",
        title: "Frameworks & Runtimes",
        skills: ["React", "Next.js", "Node.js", "Express", "ASP.NET Core", "Spring Boot", "Tailwind CSS"],
    },
    {
        id: "apis",
        title: "APIs",
        skills: ["REST API design", "OpenAPI/Swagger", "JWT authentication", "Third-party API integration"],
    },
    {
        id: "data",
        title: "Data & Persistence",
        skills: [
            "SQL Server",
            "PostgreSQL",
            "Oracle (PL/SQL)",
            "SQLite",
            "Entity Framework Core",
            "LINQ",
            "Prisma",
            "Weaviate",
        ],
    },
    {
        id: "testing",
        title: "Testing & Delivery",
        skills: ["Vitest", "Playwright", "Mocha", "Docker + Compose", "Git/GitHub"],
    },
    {
        id: "tools",
        title: "Developer Tools",
        skills: ["Visual Studio", "VS Code", "Vim", "Tmux", "Linux CLI", "PowerShell/Bash"],
    },
    {
        id: "game-dev",
        title: "Game Development",
        skills: ["Unity", "Unreal Engine", "GameMaker"],
    },
    {
        id: "practices",
        title: "Practices",
        skills: ["Agile/Scrum", "Test-driven development", "SDLC"],
    },
];
