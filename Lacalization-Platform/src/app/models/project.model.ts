export interface Language {
  id: number;
  code: string;
  name: string;
}
export interface Project {
    id: number;
  name: string;
  description: string;
  ownerId: number;
  strings: number;
  languages: Language[];
  progress: number;
}
