import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Language } from "../models/project.model";


@Injectable({
    providedIn: 'root'
})
export class languageService{
    private apiUrl = 'http://10.12.1.209:8080/languages';

    constructor (private http: HttpClient){}

    // Get all languages
    getAllLanguages(): Observable<Language[]>{
        return this.http.get<Language[]>(`${this.apiUrl}`);
    }

    // Get language ById
    getLanguageById(id: number): Observable<Language> {
        return this.http.get<Language>(`${this.apiUrl}/${id}`);
    }

    getCountryCode(languageCode: string): string {
        switch (languageCode.toLowerCase()) {
          case 'en':
            return 'gb'; 
          case 'fr':
            return 'fr';
          case 'de':
            return 'de';
          case 'zh':
            return 'cn'; 
          case 'ja':
            return 'jp'; 
          case 'es':
            return 'es'; 
          default:
            return 'us'; 
        }
      }
}