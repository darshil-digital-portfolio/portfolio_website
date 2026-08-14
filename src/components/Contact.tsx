import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

// The email address is deliberately not printed — icon and label only.
const LINKS = [
  { label: "Email", href: "mailto:darshilk.1992@gmail.com", Icon: MailIcon, external: false },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/darshil-k-80171159",
    Icon: LinkedInIcon,
    external: true,
  },
  { label: "GitHub", href: "https://github.com/k-darshil", Icon: GitHubIcon, external: true },
];

export default function Contact() {
  return (
    <section className="section veil" id="contact">
      <div className="wrap">
        <div className="sec-head reveal-up">
          <div className="sec-label">06 — Contact</div>
          <p className="contact-cta">
            Let&apos;s build <span className="grad">something.</span>
          </p>

          <div className="contact-row">
            {LINKS.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                className="contact-link"
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                <Icon />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
