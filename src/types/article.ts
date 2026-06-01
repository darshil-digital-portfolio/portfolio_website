export interface Article {
  id: string;
  title: string;
  link: string;
  isoDate: string;
  snippet: string;
  coverImage?: string;
  tags: string[];
  readMinutes: number;
}
