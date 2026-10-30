import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Timeline } from "./Timeline";
import { timeline } from "@/data/timeline";

export const AboutMe = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <SectionHeading lead="About" accent="Me" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    <Reveal className="space-y-6">
                        <p className="text-2xl font-semibold">
                            Passionate about building software that makes a difference.
                            I enjoy creating applications that are not only functional, accessible, user-friendly, and visually appealing,
                            but also follow production-ready best practices. I am a strong advocate for clean code,
                            test-driven development, and continuous learning.
                        </p>
                        <p className="text-muted-foreground">
                            I’m a CS & CITS student at Elms College (B.S., graduating 2027),
                            with an A.S. in Computer Programming from STCC. I interned as a Software Engineer on the product development team,
                            owning work-items end-to-end, and learning the AGILE model & SDLC.
                            Built production ready features for a RAG platform with Next.js, React, TypeScript, Node.js, PostgreSQL, Weaviate
                            and using TDD. (Vitest)
                        </p>

                        <p className="text-muted-foreground">
                            Curiosity is my compass. I treat every problem as a classroom. I write up what I learn, with clear notes and visualizations, so others can learn too.
                            I thrive in collaborative, positive environments, and I take pride in helping my team succeed.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                Get In Touch
                            </a>

                            <a
                                href="/TKirchner_Resume_2027.pdf"
                                download
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                            >
                                Download Résumé (PDF)
                            </a>
                        </div>
                    </Reveal>

                    <Reveal>
                        <h3 className="mb-6 text-2xl font-semibold text-left">Where I'm coming from</h3>
                        <Timeline items={timeline} />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
