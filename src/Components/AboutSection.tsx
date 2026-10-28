import { Briefcase, Code, User } from "lucide-react";

export const AboutMe = () => {
    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
                    About <span className="text-primary">Me</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-2xl font-semibold">
                            I am a passionate learner, educator, and tech enthusiast who loves
                            exploring new technologies and sharing knowledge with others.
                        </p>
                        <p className="text-muted-foreground">
                            Currently a college student building practical experience across
                            web, backend, and game development. I've shipped front-end work with
                            REACT, TypeScript, and TailwindCSS
                            and exercised with test driven tools in the MOCHA Framework.
                            On the backend I write C# with EF Core and LINQ with solid
                            foundational database best practices.
                            I also have strong foundational skills in python
                            as well as game development with c++, GML, and c#, in unreal,
                            Game Maker Studios and Unity.
                        </p>

                        <p className="text-muted-foreground">
                            Curiosity is my compass. I treat every problem as a classroom, experimenting, failing fast and documenting what matters
                            so others can follow the same path without getting lost.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <a href="#contact" className="cosmic-button">
                                Get In Touch
                            </a>

                            <a
                                href="/cv.pdf"
                                download
                                className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10 transition-colors duration-300"
                            >
                                Download CV (PDF)
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">

                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Code className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">
                                        Full-Stack Development
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Creating user-friendly applications using modern technologies and frameworks
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <User className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">
                                        UI:UX
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Developing intuitive user interfaces and seamless user experiences
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="gradient-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Briefcase className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">
                                        Project management
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Manage and complete tasks from concept to deployment
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
