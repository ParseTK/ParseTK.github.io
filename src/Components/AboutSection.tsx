import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Timeline } from "./Timeline";
import { timeline } from "@/data/timeline";

export const AboutMe = () => {
    return (
        <section id="about" aria-labelledby="about-heading" className="py-24 px-4 relative">
            <div className="container mx-auto max-w-5xl">
                <SectionHeading kicker="About me" title="The person behind the code" id="about-heading" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
                    <Reveal className="space-y-6">
                        <p className="text-2xl font-semibold">
                            I’m a computer science student at Elms College, graduating in 2027, after an associate
                            degree in computer programming at STCC. I spent a summer as a software engineering intern,
                            where I shipped features for a production product.
                        </p>
                        <p className="text-muted-foreground">
                            I treat every problem as a classroom. I write up what I learn, with clear notes and
                            visualizations, so others can learn too. I thrive in collaborative, positive environments,
                            and I take pride in helping my team succeed. Outside of code, I’m a dad who enjoys video
                            games, sports, and conversations with friends.
                        </p>

                        <div className="pt-4">
                            <a href="#contact" className="cosmic-button">
                                Get In Touch
                            </a>
                        </div>
                    </Reveal>

                    <Reveal>
                        <Timeline items={timeline} label="Education and experience" />
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
