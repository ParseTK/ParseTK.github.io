import { cn } from "./lib/utils";
import { Glow } from "./Glow";
import { ScrollCue } from "./ScrollCue";
import { useScrolledPast } from "./lib/useScrolledPast";
import { RESUME } from "@/data/resume";
import { SECTIONS } from "@/data/sections";

const [firstSection] = SECTIONS;

export const HeroSection = () => {
    const hasScrolled = useScrolledPast(40);

    // The padding keeps the heading below the fixed nav and the content clear of the scroll cue,
    // so on a short screen (a phone on its side) the hero grows instead of overlapping
    return (
        <section
            id="hero"
            className="relative isolate min-h-svh flex flex-col items-center justify-center px-4 pb-28 pt-28"
        >
            <Glow className="-left-[35vmax] -top-[40vmax]" />
            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="opacity-0 animate-fade-in">Hello, I'm </span>
                        <span className="text-primary opacity-0 animate-fade-in-delay-2">Tyler</span>{" "}
                        <span className="text-gradient opacity-0 animate-fade-in-delay-3">Kirchner</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-4">
                        I'm a software developer who enjoys building fintech applications, developing scripts to
                        simplify tasks, exploring game development, and learning new technologies. This is a snapshot of
                        my journey so far!
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4 opacity-0 animate-fade-in-delay-4">
                        <a href="#projects" className="cosmic-button">
                            View My Projects
                        </a>
                        <a
                            href={RESUME.href}
                            download
                            className="rounded-full border border-primary px-6 py-2 text-primary transition-colors duration-300 hover:bg-primary/10"
                        >
                            {RESUME.label}
                        </a>
                    </div>
                </div>
            </div>
            <div
                inert={hasScrolled}
                className={cn(
                    "absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300",
                    hasScrolled && "opacity-0",
                )}
            >
                <ScrollCue
                    direction="down"
                    href={`#${firstSection.id}`}
                    label="Scroll"
                    accessibleName={`Scroll to ${firstSection.label}`}
                />
            </div>
        </section>
    );
};
