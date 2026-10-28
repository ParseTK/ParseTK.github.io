import { ThemeToggle } from "../Components/ThemeToggle"
import { StarBackground } from "../Components/StarBackground"
import { Navbar } from "../Components/Navbar";
import { HeroSection } from "../Components/HeroSection";
import { AboutMe } from "../Components/AboutSection";
import { SkillsSection } from "../Components/SkillsSection";
import { ProjectsSection } from "../Components/ProjectsSection";
import { ContactSection } from "@/Components/ContactSection";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Lets keyboard and screen-reader users jump past the navigation */}
        <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
            Skip to main content
        </a>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Background Effects */}
        <StarBackground />

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main id="main">
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
