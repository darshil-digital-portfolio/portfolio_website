const links = [
  {
    label: "Email",
    value: "darshilk.1992@gmail.com",
    href: "mailto:darshilk.1992@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "darshil-k-80171159",
    href: "https://www.linkedin.com/in/darshil-k-80171159",
  },
  {
    label: "GitHub",
    value: "k-darshil",
    href: "https://github.com/k-darshil",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
          Contact
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-10">
          Open to full-time AI engineering roles in India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="flex flex-col gap-1 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                {link.label}
              </span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {link.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
