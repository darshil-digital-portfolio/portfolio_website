import type { Metadata } from "next";
import { Bodoni_Moda, Fira_Code, Lato } from "next/font/google";
import { PrintButton } from "./PrintButton";
import { certifications, CREDLY_PROFILE_URL } from "@/data/certifications";

export const metadata: Metadata = {
  title: "Resume — Darshil Kapadia",
  description: "Darshil Kapadia — Data Scientist & AI Engineer with 10 years at IBM.",
};

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const fira = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-custom",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
});

type ModelGroup = { name: string; examples: string[] };
type ResumeSection = { label: string; groups?: ModelGroup[]; flat?: string[] };

const resumeSections: ResumeSection[] = [
  {
    label: "Generative AI",
    groups: [
      { name: "Autoregressive", examples: ["OpenAI Models", "Claude", "LLaMA 3.3"] },
      { name: "Encoder-only", examples: ["BERT", "RoBERTa"] },
      { name: "Encoder-Decoder", examples: ["T5", "BART"] },
      { name: "Diffusion", examples: ["Stable Diffusion", "DALL-E"] },
    ],
    flat: [
      "LangChain", "LangGraph", "RAG", "GraphRAG",
      "RLHF", "PEFT / LoRA / QLoRA", "Fine-tuning", "Multi-Agent Systems",
      "Prompt Engineering", "DSPy", "Vector DB",
    ],
  },
  {
    label: "ML & Deep Learning",
    groups: [
      { name: "Object Detection", examples: ["YOLO", "R-CNN", "Mask R-CNN"] },
      { name: "Convolutional", examples: ["CNN", "ResNet"] },
      { name: "Sequential", examples: ["RNN", "LSTM", "CRNN"] },
      { name: "Transformers", examples: ["Self-Supervised", "ViT", "CLIP"] },
      { name: "GANs", examples: ["DCGAN", "StyleGAN"] },
      { name: "Graph NNs", examples: ["GCN", "GraphSAGE"] },
      { name: "Reinforcement Learning", examples: ["PPO", "DQN", "A3C"] },
      { name: "Distillation", examples: ["DistilBERT", "TinyBERT"] },
      { name: "Traditional ML", examples: ["XGBoost", "LightGBM", "SVM", "k-NN", "PCA", "K-Means"] },
    ],
    flat: ["TensorFlow", "PyTorch", "Transfer Learning", "MLflow"],
  },
  {
    label: "NLP",
    flat: ["Text Classification", "NER", "Hugging Face", "StarCoder", "CodeLLaMA", "Watson STT"],
  },
  { label: "Languages", flat: ["Python", "C++", "SQL", "Gremlin", "Cypher"] },
  { label: "Python Ecosystem", flat: ["FastAPI", "Pandas", "scikit-learn", "OpenCV", "NetworkX", "Bokeh"] },
  { label: "Databases", flat: ["PostgreSQL", "MongoDB", "CosmosDB", "Neo4j", "Redis", "MySQL", "SQLite"] },
  {
    label: "Cloud & DevOps",
    flat: [
      "Azure ML", "Azure Databricks", "Azure AI Studio", "AKS",
      "Azure AI Search", "Azure Form Recognizer", "Azure Functions",
      "AWS (EC2 · S3 · EKS · SageMaker · Bedrock)",
      "Docker", "Kubernetes", "Terraform", "Azure DevOps", "CI/CD", "OpenTelemetry",
    ],
  },
];

// Client names kept for reference — not rendered in project headings (NDA contracts)
export const clientCompanies = [
  "PepsiCo",
  "MetLife",
  "JSW",
  "NedBank",
  "J&J",
  "ADP",
  "Iffco Tokio General Insurance",
  "C3",
  "Dow Chemical",
  "E.J. Gallo",
  "Mercedes-Benz",
];

const experience = [
  {
    project: "CockpitGPT",
    role: "Data Scientist – AI Engineer",
    period: "May 2024 – Mar 2026",
    description:
      "Enterprise BI platform enabling the FP&A team to query complex financial data through natural language. Built on a distributed microservices architecture (FastAPI) with a 16-step query pipeline and a LangGraph multi-agent system (Router, Data, Formatter, Narrative, Dimensional Mapping agents). Data layer: Azure Databricks, Cosmos DB/Gremlin for knowledge graph, MongoDB, Redis. Real-time WebSocket streaming, AKS deployment, Azure DevOps CI/CD, OpenTelemetry observability.",
  },
  {
    project: "C3",
    role: "Data Scientist",
    period: "Jun 2018 – Dec 2018",
    description:
      "Digitised and categorised aviation training documents — PDFs, image files, and videos — using OCR and NLP. Segmented videos into topic-based sections, detected on-screen text via OCR, and integrated Watson Speech-to-Text (customised for German) alongside Google Speech API for multilingual transcription. Automated the full topic-classification pipeline and improved NLP module accuracy.",
  },
  {
    project: "Automated Car Insurance Claim Assessment",
    role: "Data Scientist",
    period: "Feb 2019 – May 2019",
    description:
      "Computer vision system for automated motor insurance claim assessment. Classified car models from photographs, identified outer body parts and their colours, and detected damage types to determine repair-vs-replace decisions. Trained classification models from scratch and applied transfer learning on Mask R-CNN (pre-trained on COCO) for object detection. Deployed as a GPU-backed REST API.",
  },
  {
    project: "Export Automation — Digitization of Letter of Credit",
    role: "Data Scientist / DevOps Engineer",
    period: "Oct 2021 – Oct 2022",
    description:
      "Automated document preparation for steel export — commercial invoices, bills of lading, mill test certificates, and more — by extracting structured data from Letter of Credit (LC) documents issued by banks. Built the orchestrator, integrated multiple ML models for image cleaning and document classification, and managed deployment and source code.",
  },
];

export default function ResumePage() {
  return (
    <div
      className={`${bodoni.variable} ${fira.variable} ${lato.variable} min-h-screen bg-stone-100 py-12 px-4 print:bg-white print:p-0 print:m-0`}
    >
      <style>{`
        @media print {
          /* margin:0 removes the browser-injected title/URL headers & footers */
          @page { margin: 0; size: A4; }
          html, body { margin: 0; padding: 0; background: white; }
          .resume-card { box-shadow: none !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; }
          .no-print { display: none !important; }
        }
        .font-display  { font-family: var(--font-display,  Georgia, serif); }
        .font-mono-res { font-family: var(--font-mono-custom, monospace); }
        .font-body-res { font-family: var(--font-body, sans-serif); }
      `}</style>

      {/* Floating print button */}
      <div className="no-print flex justify-center mb-8">
        <PrintButton />
      </div>

      {/* Resume card */}
      <div className="resume-card w-[210mm] h-[297mm] overflow-hidden mx-auto bg-white shadow-2xl flex flex-col">
        {/* ── HEADER ── */}
        <header className="px-10 pt-4 pb-3 border-b-[3px] border-stone-900">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-[42px] leading-[1] font-bold tracking-tight text-stone-900">
                Darshil
                <span className="italic font-normal"> Kapadia</span>
              </h1>
              <p className="font-mono-res text-[10px] text-stone-500 mt-2 tracking-[0.22em] uppercase">
                Data Scientist · Cognitive Computing · AI Engineer
              </p>
            </div>
            <div className="text-right font-mono-res text-[10px] text-stone-500 space-y-0.5 pb-1 shrink-0">
              <p>IBM · Since Aug 2016</p>
              <p>IIT Kharagpur · M.Tech 2016</p>
              <p>darshil_kapadia@outlook.com</p>
              <p>darshil-ai.com</p>
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <aside className="w-[220px] shrink-0 bg-stone-50 border-r border-stone-200 px-5 py-3 space-y-3 overflow-hidden">
            {/* Education */}
            <section>
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-2">
                Education
              </h2>
              <p className="font-body-res text-[12px] font-bold text-stone-900 leading-tight">
                IIT Kharagpur
              </p>
              <p className="font-body-res text-[10px] text-stone-500 mt-0.5">
                M.Tech · Telecom Systems Engg · 2016
              </p>
              <div className="mt-2 pt-2 border-t border-stone-200">
                <p className="font-body-res text-[10px] text-stone-600">
                  B.Tech · Electronics &amp; Communication Engg
                </p>
              </div>
            </section>

            {/* Clients */}
            <section>
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-2">
                Clients
              </h2>
              <p className="font-body-res text-[10px] text-stone-600 leading-relaxed">
                {clientCompanies.join(" · ")}
              </p>
            </section>

            {/* Skills */}
            <section>
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-2">
                Technical Skills
              </h2>
              <div className="space-y-2">
                {resumeSections.map((sec) => (
                  <div key={sec.label}>
                    <p className="font-body-res text-[8px] font-bold text-stone-900 uppercase tracking-wide mb-1">
                      {sec.label}
                    </p>
                    {sec.groups && (
                      <div className="space-y-0.5 mb-1">
                        {sec.groups.map((g) => (
                          <div key={g.name} className="flex items-baseline gap-1 flex-wrap">
                            <span className="font-mono-res text-[6.5px] bg-orange-100 text-orange-800 px-1 py-0.5 rounded-sm font-medium whitespace-nowrap">
                              {g.name}
                            </span>
                            <span className="font-body-res text-[7px] text-stone-500 leading-tight">
                              {g.examples.join(" · ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {sec.flat && (
                      <div className="flex flex-wrap gap-0.5">
                        {sec.flat.map((s) => (
                          <span
                            key={s}
                            className="font-mono-res text-[7.5px] bg-stone-200 text-stone-700 px-1 py-0.5 rounded-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* Main content */}
          <main className="flex-1 px-8 py-3 flex flex-col gap-3 overflow-hidden">
            {/* About */}
            <section>
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-2">
                About
              </h2>
              <p className="font-body-res text-[11.5px] text-stone-700 leading-snug">
                Data Scientist at IBM since August 2016, with core expertise in image processing,
                NLP, and deep learning. Proficient in TensorFlow and Microsoft Azure. Hands-on
                in Generative AI — fine-tuning LLMs (GPT-4o, LLaMA), prompt engineering,
                multi-agent systems (LangGraph/LangChain), and RAG pipelines. Experienced in
                distributed microservices, graph databases, and real-time WebSocket communication.
                Led Data Scientist teams across multiple engagements; MLOps for model deployment
                and lifecycle management. 2nd runner-up, Azure Insighthon 2.0 hackathon.
              </p>
            </section>

            {/* Experience */}
            <section>
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((job) => (
                  <div key={job.project} className="relative pl-3 border-l-2 border-stone-200">
                    <div className="flex items-start justify-between gap-3 mb-0.5">
                      <span className="font-display font-bold text-[14px] text-stone-900">
                        {job.project}
                      </span>
                      <span className="font-mono-res text-[9px] text-orange-700 whitespace-nowrap">
                        {job.period}
                      </span>
                    </div>
                    <p className="font-mono-res text-[8px] text-stone-500 uppercase tracking-wide mb-1">
                      {job.role}
                    </p>
                    <p className="font-body-res text-[11px] text-stone-600 leading-snug">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            <section className="mt-auto">
              <h2 className="font-mono-res text-[9px] tracking-[0.25em] uppercase text-orange-700 font-medium mb-2">
                Certifications
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {certifications.map((cert) => (
                  <div key={cert.id} className="pl-3 border-l-2 border-stone-200">
                    <p className="font-body-res text-[9px] font-bold text-stone-800 leading-tight">
                      {cert.name}
                    </p>
                    <p className="font-mono-res text-[7.5px] text-stone-500">
                      {cert.issuer} · {cert.issuedDate}
                    </p>
                  </div>
                ))}
              </div>
              <p className="font-mono-res text-[7.5px] text-stone-400 mt-2">
                All badges & certifications: {CREDLY_PROFILE_URL}
              </p>
            </section>

          </main>
        </div>

        {/* Footer accent — always at the very bottom */}
        <div
          className="h-1.5 shrink-0"
          style={{
            background: "linear-gradient(to right, #b45309, #f59e0b, #b45309)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        />
      </div>
    </div>
  );
}
