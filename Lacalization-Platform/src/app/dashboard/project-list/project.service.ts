import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProjectLanguage {
  id: number;
  projectId: number;
  languageId: number;
}

interface Language {
  id: number;
  code: string;
  name: string;
}
interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  strings: number;
  languages: Language[];
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://10.12.1.209:8080/api/projects'; //backend URL

  constructor(private http: HttpClient) {}

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}`, project);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}`);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUserProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/user/${userId}`);
  }
}
