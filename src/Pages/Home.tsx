import { useState } from "react";
import { StarBackground } from "../Components/StarBackground"
import { GrainOverlay } from "../Components/GrainOverlay";
import { Navbar, type OverlayName } from "../Components/Navbar";
import { useIsDesktop } from "../Components/lib/useIsDesktop";
import { HeroSection } from "../Components/HeroSection";
import { AboutMe } from "../Components/AboutSection";
import { SkillsSection } from "../Components/SkillsSection";
import { ProjectsSection } from "../Components/ProjectsSection";
import { ContactSection } from "@/Components/ContactSection";

export const Home = () => {
  const [openOverlay, setOpenOverlay] = useState<OverlayName | null>(null);
  const isDesktop = useIsDesktop();
  const isPageBlocked = openOverlay === "menu" || (openOverlay === "style" && !isDesktop);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
          <AboutMe />
          <SkillsSection />
          <ProjectsSection />
          <ContactSection />
        </main>
    </div>
  )
}

export default Home
