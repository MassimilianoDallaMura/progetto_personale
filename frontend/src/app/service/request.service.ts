import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment'; // Importa l'URL del backend da environment

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8080/api/productsRequests'; 
  private getApiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  sendContactRequest(userId: string, productId: string): void {
    const payload = {
      userId: userId,
      productId: productId
    };

    this.http.post(this.apiUrl, payload, { responseType: 'text' })
      .subscribe(
        response => {
          console.log('Response:', response);
          alert('Response: ' + response); // Mostra la risposta testuale in un alert o modal
        },
        error => {
          console.error('Error sending contact request:', error);
          alert('An error occurred while sending the contact request.');
        }
      );
  }

  getProductRequestsByUserId(userId: string): Observable<any[]> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.get<any[]>(url);
  }

  getRequestById(requestId: number): Observable<any> {
    const url = `${this.apiUrl}/${requestId}`;
    return this.http.get<any>(url);
  }

  getProductRequestsByOwnerId(ownerId: string): Observable<any[]> {
    const url = `${this.apiUrl}/owners/${ownerId}`;
    return this.http.get<any[]>(url);
  }

  confirmAdozione(requestId: number, customCode: string): Observable<string> {
    const url = `${this.apiUrl}/confirmAdotta`;
    const params = new HttpParams().set('requestId', requestId.toString()).set('customCode', customCode);
    console.log('Chiamata API confirmAdozione:', url, params.toString());
    return this.http.post(url, null, { params, responseType: 'text' }).pipe(
      tap((response: string) => console.log('Risposta da conferma adozione:', response)),
      catchError(error => {
        console.error('Errore durante la conferma dell\'adozione:', error);
        throw error;
      })
    );
  }

  confirmDonazione(requestId: number, customCode: string): Observable<string> {
    const url = `${this.apiUrl}/confirmDona`;
    const params = new HttpParams().set('requestId', requestId.toString()).set('customCode', customCode);
    console.log('Chiamata API confirmDonazione:', url, params.toString());
    return this.http.post(url, null, { params, responseType: 'text' }).pipe(
      tap((response: string) => console.log('Risposta da conferma donazione:', response)),
      catchError(error => {
        console.error('Errore durante la conferma della donazione:', error);
        throw error;
      })
    );
  }

  deleteRequest(requestId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${requestId}`);
  }
}
