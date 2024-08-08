export interface Project {
    id: number;
  name: string;
  description: string;
  ownerId: number;
  strings: number;
  languages: string[];
  progress: number;
}
