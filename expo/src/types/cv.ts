export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  level?: string;
}

export interface CV {
  id: string;
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages?: string[];
  publications?: string[];
  fileUrl?: string;
  fileType?: string;
  uploadDate: string;
  tags?: string[];
}

export type CVSearchResult = {
  cv: CV;
  relevanceScore: number;
  matchedFields: string[];
};