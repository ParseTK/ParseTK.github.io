import { GithubIcon, LinkedinIcon, type IconComponent } from "@/Components/BrandIcons";

export interface ContactEntry {
    id: string;
    label: string;
    value: string;
    href: string;
    icon: IconComponent;
}

// Web profiles only: there is deliberately no email address on the page
export const contactEntries: readonly ContactEntry[] = [
    {
        id: "linkedin",
        label: "LinkedIn",
        value: "www.linkedin.com/in/parsetk",
        href: "https://www.linkedin.com/in/parsetk",
        icon: LinkedinIcon,
    },
    {
        id: "github",
        label: "GitHub",
        value: "github.com/ParseTK",
        href: "https://github.com/ParseTK",
        icon: GithubIcon,
    },
];
