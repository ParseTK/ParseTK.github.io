import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";

export interface ContactEntry {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: LucideIcon;
    external: boolean;
}

export const contactEntries: readonly ContactEntry[] = [
    {
        id: "email",
        label: "Email",
        value: "kirchnertyler@gmail.com",
        href: "mailto:kirchnertyler@gmail.com",
        icon: Mail,
        external: false,
    },
    {
        id: "linkedin",
        label: "LinkedIn",
        value: "www.linkedin.com/in/parsetk",
        href: "https://www.linkedin.com/in/parsetk",
        icon: Linkedin,
        external: true,
    },
    {
        id: "github",
        label: "GitHub",
        value: "github.com/ParseTK",
        href: "https://github.com/ParseTK",
        icon: Github,
        external: true,
    },
];
