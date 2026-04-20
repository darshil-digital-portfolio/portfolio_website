export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuedDate: string;
  imageUrl: string;
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
    id: "gcp-deploy-evaluate-model-garden",
    name: "Deploy and Evaluate Model Garden Models",
    issuer: "Google Cloud",
    issuedDate: "2025-11",
    imageUrl:
      "https://images.credly.com/images/b8828c64-a038-469c-9347-b961fb0fe505/blob",
    featured: true,
  },
  {
    id: "gcp-deploy-agent-adk",
    name: "Deploy an Agent with Agent Development Kit (ADK)",
    issuer: "Google Cloud",
    issuedDate: "2025-10",
    imageUrl:
      "https://images.credly.com/images/e9c45e2a-a48e-4686-99df-7de0ccd6dae7/blob",
    featured: true,
  },
  {
    id: "gcp-rag-firestore",
    name: "Deploy a RAG Application with Vector Search in Firestore",
    issuer: "Google Cloud",
    issuedDate: "2025-10",
    imageUrl:
      "https://images.credly.com/images/7a5cf6ef-6f98-4752-b299-45e373c29bf4/blob",
    featured: true,
  },
];

export function getFeaturedCertifications(): Certification[] {
  return certifications.filter((c) => c.featured);
}
