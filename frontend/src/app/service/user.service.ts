import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api'; // URL del tuo backend

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }

  patchFotoUser(userId: number, avatar: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.patch(`${this.apiUrl}/users/${userId}/photo`, formData);
  }


  updateCity(userId: number, city: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('city', city);

    return this.http.patch(`${this.apiUrl}/users/${userId}/city`, formData);
  }

  updateUsername(userId: number, newUsername: string): Observable<any> {
    const formData = new FormData();
    formData.append('username', newUsername);

    return this.http.patch(`${this.apiUrl}/users/${userId}/username`, formData);
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.delete(url, { responseType: 'text' });
  }
}
