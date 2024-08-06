import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface UserResponse {
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://10.12.1.209:8080/api'; // backend URL

  private authenticated = false;

  constructor(private http: HttpClient) { }

  signup(user: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(() => this.authenticated = true)
    );
  }

  login(credentials: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(() => this.authenticated = true)
    );
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isLoggedIn(): boolean {
    return this.authenticated; 
  }
}


