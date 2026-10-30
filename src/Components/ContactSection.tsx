import { Headphones, Linkedin, Mail } from "lucide-react"
import { ExternalLink } from "./ExternalLink"

const linkClass =
    "text-muted-foreground underline underline-offset-4 hover:text-primary transition-colors"

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-4 bg-secondary/10">
        <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                I'm always open to discussing new projects,
                creative ideas,
                or opportunities to be part of your visions.
                Feel free to reach out!
            </p>

            <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-6 text-left">
                    Contact Information
                </h3>

                <ul className="space-y-6">
                    <li className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <h4 className="font-medium text-left">Email</h4>
                            <a href="mailto:kirchnertyler@gmail.com" className={linkClass}>
                                kirchnertyler@gmail.com
                            </a>
                        </div>
                    </li>
                    <li className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Linkedin className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <h4 className="font-medium text-left">LinkedIn</h4>
                            <ExternalLink href="https://www.linkedin.com/in/parsetk" className={linkClass}>
                                ParseTK
                            </ExternalLink>
                        </div>
                    </li>
                    <li className="flex items-start space-x-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Headphones className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <h4 className="font-medium text-left">Discord</h4>
                            <ExternalLink href="https://discordapp.com/users/estteekay#7458" className={linkClass}>
                                estteekay
                            </ExternalLink>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
  )
}
