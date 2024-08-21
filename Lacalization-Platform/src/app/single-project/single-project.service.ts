import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface ProjectLanguage{
    id: number;
    projectId: number;
    languageId: number;
}

@Injectable({
    providedIn: 'root'
})
export class SingleProjectService {
    private apiUrl = 'http://10.12.1.209:8080/projectLanguages';

    constructor (private http: HttpClient){}

    // Assign language to a project
    assignLanguageToProject(projectLanguages: ProjectLanguage): Observable<ProjectLanguage>{
        return this.http.post<ProjectLanguage>(`${this.apiUrl}`, projectLanguages);
    }

    // Get languages by project ID
    getLanguageByProjectId(projectId: number): Observable<ProjectLanguage[]> {
        return this.http.get<ProjectLanguage[]>(`${this.apiUrl}/project/${projectId}`);
    }

    // get projectLanguage by id
    getProjectLanguageById(id: number): Observable<ProjectLanguage>{
        return this.http.get<ProjectLanguage>(`${this.apiUrl}/${id}`);
    }

    // Delete a project language by ID
    deleteProjectLanguage(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}