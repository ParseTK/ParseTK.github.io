import { ExternalLink } from "./ExternalLink";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { contactEntries } from "@/data/contact";

export const ContactSection = () => (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl">
            <SectionHeading
                kicker="Contact"
                title="Get in touch"
                id="contact-heading"
                description="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!"
            />

            <Reveal>
                <ul className="grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
                    {contactEntries.map(({ id, icon: Icon, label, value, href }) => (
                        <li key={id}>
                            <Frame
                                as={ExternalLink}
                                href={href}
                                className="flex h-full items-center gap-3 p-4 transition-colors hover:border-primary sm:gap-4 sm:p-5"
                            >
                                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 sm:size-12">
                                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block font-medium">{label}</span>{" "}
                                    <span className="block break-words text-[13px] text-muted-foreground sm:text-sm">
                                        {value}
                                    </span>
                                </span>
                            </Frame>
                        </li>
                    ))}
                </ul>
            </Reveal>
        </div>
    </section>
);
