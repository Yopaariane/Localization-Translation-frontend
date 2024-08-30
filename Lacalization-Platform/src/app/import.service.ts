import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  private apiUrl = 'http://10.12.1.209:8080/import/upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File, projectId: number, languageId: number, creatorId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());
    formData.append('languageId', languageId.toString());
    formData.append('creatorId', creatorId.toString());

    return this.http.post(this.apiUrl, formData).pipe(
      catchError(error => {
        console.error('File upload failed:', error);
        throw error;
      })
    );
  }
}
