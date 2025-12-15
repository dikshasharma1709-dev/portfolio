export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface Skill {
  name: string;
  category: 'core' | 'tech' | 'tool';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  contact: ContactInfo;
  experience: ExperienceItem[];
  skills: Skill[];
  certifications: Certification[];
}