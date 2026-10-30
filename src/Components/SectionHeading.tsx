import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
    // The small label above the title, e.g. "Projects"
    kicker: string;
    title: string;
    // Lets the section name itself after its heading
    id?: string;
    description?: ReactNode;
}

export const SectionHeading = ({ kicker, title, id, description }: SectionHeadingProps) => (
    <Reveal className="mb-12 text-left">
        <p className="mb-3 font-mono text-[13px] uppercase tracking-[0.18em] text-primary">{kicker}</p>
        <h2 id={id} className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight">
            {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>}
    </Reveal>
);
