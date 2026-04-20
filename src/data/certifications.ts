export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  imageUrl: string;
  url?: string;
  featured: boolean;
}

export const CREDLY_PROFILE_URL = "https://www.credly.com/users/darshil-kapadia";
export const CREDLY_TOTAL_COUNT = 17;

export const certifications: Certification[] = [
  {
    id: "ibm-gen-agentic-ai-expert",
    name: "IBM Generative & Agentic AI Expert — Data Scientist",
    issuer: "IBM",
    issuedDate: "2025-09",
    imageUrl:
      "https://images.credly.com/images/48b7d588-9ddc-4a71-bdf1-68bef1d509b9/IBM-Generative-Agentic-AI-Expert---Data-Scientist.png",
    featured: true,
  },
  {
    id: "aws-agentic-ai-essentials",
    name: "AWS Partner: Agentic AI Essentials",
    issuer: "Amazon Web Services",
    issuedDate: "2025-11",
    imageUrl:
      "https://images.credly.com/images/cb620644-88e4-4ee7-83a2-d33a6181e4b8/blob",
    featured: true,
  },
  {
    id: "aws-gen-ai-essentials",
    name: "AWS Partner: Generative AI Essentials",
    issuer: "Amazon Web Services",
    issuedDate: "2025-10",
    imageUrl:
      "https://images.credly.com/images/4b547104-5ce9-43d5-8708-a7abb4b0c7ec/blob",
    featured: true,
  },
  {
    id: "deep-learning-specialization",
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    issuedDate: "2020-09",
    imageUrl: "/certs/deeplearning-ai.png",
    url: "http://coursera.org/verify/specialization/72MP2AL67VKB",
    featured: true,
  },
  {
    id: "genai-with-llms",
    name: "Generative AI with Large Language Models",
    issuer: "DeepLearning.AI",
    issuedDate: "2024-01",
    imageUrl: "/certs/deeplearning-ai.png",
    url: "https://coursera.org/verify/Z96FB53LBHL8",
    featured: true,
  },
  {
    id: "databricks-single-agent-apps",
    name: "Building Single-Agent Applications on Databricks",
    issuer: "Databricks",
    issuedDate: "2026-04",
    imageUrl: "/certs/databricks.png",
    url: "https://credentials.databricks.com/68d6a2b9-d699-4179-9c34-63095b159baa",
    featured: true,
  },
];

export function getFeaturedCertifications(): Certification[] {
  return certifications.filter((c) => c.featured);
}
