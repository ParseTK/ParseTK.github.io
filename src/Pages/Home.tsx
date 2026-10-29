import { useState } from "react";
import { ThemeToggle } from "../Components/ThemeToggle"
import { StarBackground } from "../Components/StarBackground"
import { Navbar } from "../Components/Navbar";
import { HeroSection } from "../Components/HeroSection";
import { AboutMe } from "../Components/AboutSection";
import { SkillsSection } from "../Components/SkillsSection";
import { ProjectsSection } from "../Components/ProjectsSection";
import { ContactSection } from "@/Components/ContactSection";

export const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <a
            href="#main"
            inert={isMenuOpen}
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
            Skip to main content
        </a>

        <ThemeToggle />
        <StarBackground />
        <Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} />

        <main id="main" inert={isMenuOpen}>
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
