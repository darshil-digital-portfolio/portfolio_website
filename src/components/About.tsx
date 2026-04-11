const skillCategories = [
  {
    label: "AI / ML",
    skills: [
      "LangGraph",
      "LangChain",
      "PyTorch",
      "TensorFlow",
      "OpenAI APIs",
      "HuggingFace",
      "RAG",
      "GraphRAG",
      "RLHF",
      "PEFT / LoRA / QLoRA",
      "Computer Vision",
      "NLP",
      "CNN",
      "RNN",
      "CRNN",
      "YOLO",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "C++", "SQL", "Gremlin"],
  },
  {
    label: "Cloud & Infrastructure",
    skills: ["AWS (EC2, S3, VPC)", "Azure", "Docker", "Kubernetes", "DevOps"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "CosmosDB", "Neo4j", "MySQL"],
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-8">
          About
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mb-16">
          I&apos;m an AI Engineer based in India with a decade of experience at IBM, building
          production AI systems for global enterprise clients — PepsiCo, Bacardi, Dow Chemicals,
          JSW, FAA, NedBank, Iffco-Tokio, and more. My work covers the full stack: data pipelines,
          model training and fine-tuning, agentic system design, and cloud deployment on AWS and
          Azure. I hold an M.Tech from IIT Kharagpur and a B.Tech in Electronics &amp; Communication
          Engineering.
        </p>
        <div className="space-y-8">
          {skillCategories.map((cat) => (
            <div key={cat.label}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-3">
                {cat.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
