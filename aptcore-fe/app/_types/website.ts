export interface Website {
  id: string;
  title: string | null;
  domain: string | null;
  theme: string | null;
  favicon: string | null;
  logo: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  apiKey: string | null;
  active: boolean;
  createdBy: string | null;
  deletedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface WebsiteIndexResponse {
  meta: object;
  data: Website[];
}