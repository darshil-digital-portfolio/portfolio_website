export interface SubSkillGroup {
  label: string;
  items: string[];
}

export interface ExpandableSkill {
  name: string;
  description: string;
  subSkills?: string[];
  subSkillGroups?: SubSkillGroup[];
}

/** A skill is either a plain chip (string) or an expandable chip with a detail panel. */
export type SkillItem = string | ExpandableSkill;

export interface SkillCategory {
  label: string;
  skills: SkillItem[];
}

export const isExpandable = (s: SkillItem): s is ExpandableSkill => typeof s === "object";

export const skillCategories: SkillCategory[] = [
  {
    label: "Generative AI",
    skills: [
      {
        name: "Autoregressive Models",
        description:
          "Decoder-only transformers trained on next-token prediction. State of the art for open-ended generation, reasoning, and instruction following.",
        subSkills: ["OpenAI Models", "Claude", "LLaMA 3.3", "LLaMA 3.1"],
      },
      {
        name: "Encoder-only Models",
        description:
          "Bidirectional transformers that produce rich contextual embeddings. Best suited for classification, NER, and semantic similarity.",
        subSkills: ["BERT", "RoBERTa", "DistilBERT"],
      },
      {
        name: "Encoder-Decoder Models",
        description:
          "Seq2seq architecture mapping input sequences to output sequences. Used for summarisation, translation, and question answering.",
        subSkills: ["T5", "BART", "mT5"],
      },
      {
        name: "Diffusion Models",
        description:
          "Generative models that learn to reverse a noise process. State of the art for high-fidelity image and media synthesis.",
        subSkills: ["Stable Diffusion", "DALL-E", "Imagen"],
      },
      "LangGraph",
      "LangChain",
      "OpenAI Agents SDK",
      "RAG",
      "GraphRAG",
      "RLHF",
      "PEFT / LoRA / QLoRA",
      "Fine-tuning",
      "Multi-Agent Systems",
      "Prompt Engineering",
      "DSPy",
      "Vector DB",
      "Automated Prompt Generation",
    ],
  },
  {
    label: "ML & Deep Learning",
    skills: [
      {
        name: "Object Detection",
        description:
          "Region-based and anchor-free detectors for localising and classifying objects in images. Applied in insurance claim assessment and industrial inspection.",
        subSkills: ["YOLO", "R-CNN", "Faster R-CNN", "Mask R-CNN"],
      },
      {
        name: "Convolutional Models",
        description:
          "Hierarchical spatial feature extractors. Backbone of most computer vision pipelines for classification and representation learning.",
        subSkills: ["CNN", "ResNet", "VGG", "EfficientNet"],
      },
      {
        name: "Sequential Models",
        description:
          "Recurrent architectures that model temporal and sequential dependencies. Applied in OCR, time-series analysis, and sequence labelling.",
        subSkills: ["RNN", "LSTM", "CRNN", "GRU"],
      },
      {
        name: "Transformer Architecture",
        description:
          "Attention-based architecture that unified NLP and vision. Trained via self-supervised objectives before task-specific fine-tuning.",
        subSkills: [
          "Self-Supervised Learning",
          "Masked LM",
          "Contrastive Learning",
          "Multi-Head Attention",
          "ViT",
          "CLIP",
        ],
      },
      {
        name: "Generative Adversarial Networks",
        description:
          "Adversarial generator–discriminator framework for producing realistic synthetic data and high-quality image generation.",
        subSkills: ["GAN", "DCGAN", "StyleGAN", "CycleGAN"],
      },
      {
        name: "Graph Neural Networks",
        description:
          "Message-passing networks that learn on graph-structured data — knowledge graphs, recommendation systems, and molecular modelling.",
        subSkills: ["GCN", "GraphSAGE", "GAT", "Graph Transformer"],
      },
      {
        name: "Reinforcement Learning",
        description:
          "Policy optimisation through environment interaction. Underpins LLM alignment (RLHF) and sequential decision-making agents.",
        subSkills: ["PPO", "DQN", "A3C"],
      },
      {
        name: "Model Distillation",
        description:
          "Compressing large teacher models into faster, smaller student models while preserving accuracy — critical for production deployment.",
        subSkills: ["Knowledge Distillation", "DistilBERT", "TinyBERT", "Quantisation"],
      },
      {
        name: "Traditional ML",
        description:
          "Classical algorithms for structured and tabular data. Fast to train, interpretable, and often the right tool before reaching for deep learning.",
        subSkillGroups: [
          {
            label: "Supervised",
            items: [
              "XGBoost",
              "LightGBM",
              "Random Forest",
              "AdaBoost",
              "SVM",
              "Decision Trees",
              "k-NN",
              "Logistic Regression",
            ],
          },
          {
            label: "Unsupervised",
            items: ["PCA", "K-Means", "DBSCAN", "t-SNE", "UMAP", "Isolation Forest"],
          },
        ],
      },
      "TensorFlow",
      "PyTorch",
      "Transfer Learning",
      "Computer Vision",
      "MLflow",
    ],
  },
  {
    label: "NLP",
    skills: [
      "Hugging Face",
      "Text Classification",
      "NER",
      "StarCoder",
      "CodeLLaMA",
      "Watson Speech-to-Text",
      "Watson Visual Recognition",
    ],
  },
  {
    label: "Languages",
    skills: ["Python", "C++", "SQL", "Gremlin", "Cypher"],
  },
  {
    label: "Python Ecosystem",
    skills: ["FastAPI", "Pandas", "scikit-learn", "OpenCV", "NetworkX", "Bokeh"],
  },
  {
    label: "Cloud & Infrastructure",
    skills: [
      {
        name: "AWS",
        description:
          "Hands-on experience with core AWS services for data engineering, ML workloads, and application infrastructure.",
        subSkills: [
          "EC2",
          "S3",
          "RDS",
          "VPC",
          "DynamoDB",
          "SageMaker",
          "Bedrock",
          "Lambda",
          "EKS",
          "Fargate",
          "IAM",
        ],
      },
      {
        name: "Azure",
        description:
          "Deep production experience across the Azure ecosystem — from ML pipelines and vector search to DevOps and real-time compute.",
        subSkills: [
          "Azure ML",
          "Azure Databricks",
          "Azure AI Studio",
          "Azure AI Search",
          "CosmosDB",
          "Azure Functions",
          "Azure Form Recognizer",
          "AKS",
          "Azure DevOps",
        ],
      },
      "Docker",
      "Kubernetes",
      "Terraform",
      "CI/CD",
      "OpenTelemetry",
      "WebSockets",
    ],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MongoDB", "CosmosDB", "Neo4j", "Redis", "MySQL", "SQLite"],
  },
];

/** First category containing an expandable skill — used to anchor the auto-hint animation. */
const firstExpandableCategory = skillCategories.find((c) => c.skills.some(isExpandable));

/** Label of the category holding the first expandable skill. */
export const firstExpandableCategoryLabel: string | null = firstExpandableCategory?.label ?? null;

/** First expandable skill across all categories — used for the auto-hint animation. */
export const firstExpandableName: string | null =
  firstExpandableCategory?.skills.find(isExpandable)?.name ?? null;
