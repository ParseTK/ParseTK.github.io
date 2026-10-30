import { Github, Linkedin, type LucideIcon } from "lucide-react";

export interface ContactEntry {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: LucideIcon;
}

// Web profiles only: there is deliberately no email address on the page
export const contactEntries: readonly ContactEntry[] = [
    {
        id: "linkedin",
        label: "LinkedIn",
        value: "www.linkedin.com/in/parsetk",
        href: "https://www.linkedin.com/in/parsetk",
        icon: Linkedin,
    },
    {
        id: "github",
        label: "GitHub",
        value: "github.com/ParseTK",
        href: "https://github.com/ParseTK",
        icon: Github,
    },
];
