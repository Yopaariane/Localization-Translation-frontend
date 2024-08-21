import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Timestamp } from 'rxjs';

interface Translations{
  id: number;
  translationText: string;
  termId: number;
  languageId: number;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationListService {
  private apiUrl = 'http://10.12.1.209:8080/translation';

  constructor(private http: HttpClient) { }

  // create translation
  createTranslation(translation: Translations): Observable<Translations>{
    return this.http.post<Translations>(`${this.apiUrl}`, translation);
  }

  // update translation
  updateTranslation(id: number, translation: Translations): Observable<Translations>{
    return this.http.put<Translations>(`${this.apiUrl}/${id}`, translation);
  }

  // delete Translation
  deleteTranslation(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // get translation by term id
  getTranslationsByTermId(itermId: number): Observable<Translations[]>{
    return this.http.get<Translations[]>(`${this.apiUrl}/item/${itermId}`);
  }
  
  // get tanslations by language id
  getTranslationsByLanguageId(languageId: number): Observable<Translations[]>{
    return this.http.get<Translations[]>(`${this.apiUrl}/language/${languageId}`);
  }

  // get translation count by projectId
  countTranslationsByProjectId(projectId: number): Observable<Translations>{
    return this.http.get<Translations>(`${this.apiUrl}/count/${projectId}`);
  }

  // get Translation Progress For Term
  getTranslationProgressForTerm(termId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/${termId}/progress`);
  }

  // get Translation Progress For Language
  getTranslationProgressForLanguage(languageId: number, projectId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/progress/${languageId}/${projectId}`);
  }

  // get Overall Translation Progress For Project
  getOverallTranslationProgressForProject(projectId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/progress/${projectId}`);
  }
}
