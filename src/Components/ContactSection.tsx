import { ExternalLink } from "./ExternalLink";
import { Frame } from "./Frame";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { contactEntries, type ContactEntry } from "@/data/contact";

const EntryContent = ({ entry: { icon: Icon, label, value } }: { entry: ContactEntry }) => (
    <>
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </span>
        <span className="min-w-0 text-left">
            <span className="block font-medium">{label}</span>{" "}
            <span className="block break-words text-sm text-muted-foreground">{value}</span>
        </span>
    </>
);

const ENTRY_CLASS = "flex items-center gap-4 p-5 transition-colors hover:border-primary";

export const ContactSection = () => (
    <section id="contact" className="py-24 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl">
            <SectionHeading
                lead="Get In"
                accent="Touch"
                description="I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!"
            />

            <Reveal>
            <ul className="mx-auto grid max-w-md grid-cols-1 gap-4">
                {contactEntries.map((entry) => (
                    <li key={entry.id}>
                        {entry.external ? (
                            <Frame as={ExternalLink} href={entry.href} className={ENTRY_CLASS}>
                                <EntryContent entry={entry} />
                            </Frame>
                        ) : (
                            <Frame as="a" href={entry.href} className={ENTRY_CLASS}>
                                <EntryContent entry={entry} />
                            </Frame>
                        )}
                    </li>
                ))}
            </ul>
            </Reveal>
        </div>
    </section>
);
