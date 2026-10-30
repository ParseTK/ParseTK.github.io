import { cn } from "./lib/utils";
import { Glow } from "./Glow";
import { ScrollCue } from "./ScrollCue";
import { useScrolledPast } from "./lib/useScrolledPast";
import { SECTIONS } from "@/data/sections";

const [firstSection] = SECTIONS;

export const HeroSection = () => {
    const hasScrolled = useScrolledPast(40);

    return (
        <section
            id="hero"
            className="relative isolate min-h-svh flex flex-col items-center justify-center px-4"
        >
            <Glow className="-left-[35vmax] -top-[40vmax]" />
            <div className="container max-w-4xl mx-auto text-center z-10">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="opacity-0 animate-fade-in">Hello, I'm </span>
                        <span className="text-primary opacity-0 animate-fade-in-delay-2">Tyler</span>
                        {" "}
                        <span className="text-gradient opacity-0 animate-fade-in-delay-3">Kirchner</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in-delay-4">
                        I'm a software developer who enjoys building fintech applications,
                        developing scripts to simplify tasks,
                        exploring game development,
                        and learning new technologies.
                        This is a snapshot of my journey so far!
                    </p>
                    <div className="pt-4 opacity-0 animate-fade-in-delay-4">
                        <a
                            href="#projects"
                            className="cosmic-button"
                        >
                            View My Projects
                        </a>
                    </div>
                </div>
            </div>
            <div
                inert={hasScrolled}
                className={cn(
                    "absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-300",
                    hasScrolled && "opacity-0"
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
}
