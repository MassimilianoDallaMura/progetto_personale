import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CityService {

  private apiUrl = 'http://localhost:8080/api/cities';

  constructor(private http: HttpClient, private authService: AuthService)  { }

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  updateCity(userId: number, city: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}/city`;
    return this.http.patch(url, { city });
  }

}