import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserRole } from '../models/user-role.model';


export interface UserResponse {
  id: number;
  name: string;
  email: string;
}
export interface Role{
  id: number;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://10.12.1.209:8080/api'; 

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

  // Assign a role to a user
  assignRoleToUser(userRole: UserRole): Observable<UserRole> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserRole>(`${this.apiUrl}/userRoles`, userRole, { headers });
  }

  // Get roles by user ID
  getRolesByUserId(userId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/userRoles/user/${userId}`);
  }

  // Get roles by project ID
  getRolesByProjectId(projectId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/userRoles/project/${projectId}`);
  }

  // Delete a user role by ID
  deleteUserRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/userRoles/${id}`);
  }

  // get user by id
  getUserById(userId: number): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/${userId}`);
  }

  // get user by email
  getUserByEmail(email: string): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/email/${email}`);
  }

  // get role by id
  getRoleById(roleId: number): Observable<Role>{
    return this.http.get<Role>(`${this.apiUrl}/role/${roleId}`);
  }

  // get all roles
  getAllRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.apiUrl}/role`);
  }
}


