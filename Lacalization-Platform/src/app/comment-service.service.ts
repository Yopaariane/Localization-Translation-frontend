import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Comments{
  id: number;
  comment: string;
  termId: number;
  userId: number;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})

export class CommentServiceService {
  private apiUrl = 'http://10.12.1.209:8080/comments'

  constructor(private http: HttpClient) { }

  createComment(comment: Comments): Observable<Comments> {
    return this.http.post<Comments>(`${this.apiUrl}`, comment);
  }

  updateComment(id: number, comment: Comments): Observable<Comments> {
    return this.http.put<Comments>(`${this.apiUrl}/${id}`, comment);
  }

  deleteComment(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCommentsByTerm(termId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.apiUrl}/term/${termId}`);
  }

  getCommentsByTermIdAndUserId(termId: number, userId: number): Observable<Comments[]> {
    return this.http.get<Comments[]>(`${this.apiUrl}/term/${termId}/user/${userId}`);
  }
}
