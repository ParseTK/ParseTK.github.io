import { useState, type ComponentType } from "react";
import { StarBackground } from "../Components/StarBackground";
import { GrainOverlay } from "../Components/GrainOverlay";
import { Navbar, type OverlayName } from "../Components/Navbar";
import { ScrollCue } from "../Components/ScrollCue";
import { useIsDesktop } from "../Components/lib/useIsDesktop";
import { HeroSection } from "../Components/HeroSection";
import { AboutMe } from "../Components/AboutSection";
import { SkillsSection } from "../Components/SkillsSection";
import { ProjectsSection } from "../Components/ProjectsSection";
import { ContactSection } from "@/Components/ContactSection";
import { SECTIONS, type SectionId } from "@/data/sections";

const SECTION_VIEWS: Record<SectionId, ComponentType> = {
    projects: ProjectsSection,
    skills: SkillsSection,
    about: AboutMe,
    contact: ContactSection,
};

const TOP_ID = "top";

const goToTop = () => {
    window.scrollTo({ top: 0 });
    document.getElementById(TOP_ID)?.focus({ preventScroll: true });
};

export const Home = () => {
    const [openOverlay, setOpenOverlay] = useState<OverlayName | null>(null);
    const isDesktop = useIsDesktop();
    const isPageBlocked = openOverlay === "menu" || (openOverlay === "style" && !isDesktop);

    return (
        <div
            id={TOP_ID}
            tabIndex={-1}
            className="min-h-screen bg-background text-foreground overflow-x-hidden outline-none"
        >
            <a
                href="#main"
                inert={isPageBlocked}
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
            >
                Skip to main content
            </a>

            <StarBackground />
            <GrainOverlay />
            <Navbar openOverlay={openOverlay} onOpenOverlayChange={setOpenOverlay} />

            <main id="main" inert={isPageBlocked}>
                <HeroSection />
                {SECTIONS.map(({ id }) => {
                    const View = SECTION_VIEWS[id];
                    return <View key={id} />;
                })}
            </main>

            <footer inert={isPageBlocked} className="relative flex justify-center pb-10 pt-4">
                <ScrollCue direction="up" label="Top" accessibleName="Back to top" onClick={goToTop} />
            </footer>
        </div>
    );
};

export default Home;
