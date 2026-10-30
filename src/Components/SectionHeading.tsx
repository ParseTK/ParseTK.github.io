import type { ReactNode } from "react";
import { cn } from "./lib/utils";

interface SectionHeadingProps {
    lead: string;
    accent?: string;
    description?: ReactNode;
}

export const SectionHeading = ({ lead, accent, description }: SectionHeadingProps) => (
    <>
        <h2 className={cn("text-3xl md:text-4xl font-bold text-center", description ? "mb-4" : "mb-12")}>
            {lead}
            {accent && (
                <>
                    {" "}
                    <span className="text-primary">{accent}</span>
                </>
            )}
        </h2>
        {description && <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{description}</p>}
    </>
);
