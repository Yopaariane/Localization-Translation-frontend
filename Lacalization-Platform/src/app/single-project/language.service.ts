import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface Language{
    id: number;
    code: string;
    name: string;
}

@Injectable({
    providedIn: 'root'
})
export class languageService{
    private apiUrl = 'http://localhost:8080/languages';

    constructor (private http: HttpClient){}

    // Get all languages
    getAllLanguages(): Observable<Language[]>{
        return this.http.get<Language[]>(`${this.apiUrl}`);
    }

    // Get language ById
    getLanguageById(id: number): Observable<Language> {
        return this.http.get<Language>(`${this.apiUrl}/${id}`);
    }
}