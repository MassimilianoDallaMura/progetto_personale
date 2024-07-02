import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment'; // Importa l'URL del backend da environment

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8080/api/productsRequests'; 
  private getApiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  // Metodo per effettuare la chiamata API per ottenere i dettagli di una singola richiesta
  // getRequestDetails(requestId: number): Observable<any> {
  //   const url = `${this.apiUrl}/${requestId}`; // Assicurati che l'API del backend abbia un endpoint per ottenere i dettagli della richiesta per ID
  //   return this.http.get<any>(url);
  // }

  // Metodo per effettuare la chiamata API per inviare una richiesta di contatto
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

  // Metodo per effettuare la chiamata GET per ottenere le richieste dell'utente
  getProductRequestsByUserId(userId: string): Observable<any[]> {
    const url = `${this.apiUrl}/users/${userId}`;
    return this.http.get<any[]>(url);
  }

   //Metodo get per estrarre richieste by requestId
  getRequestById(requestId: number): Observable<any> {
    const url = `${this.apiUrl}/${requestId}`;
    return this.http.get<any[]>(url);
  }

  //Metodo get per estrarre richieste by ownerId
  getProductRequestsByOwnerId(ownerId: string): Observable<any[]> {
    const url = `${this.apiUrl}/owners/${ownerId}`;
    return this.http.get<any[]>(url);
  }


  confirmDonazione(requestId: number, customCode: string): Observable<any> {
    const url = `${this.apiUrl}/confirmDona`;
    const params = { requestId: requestId.toString(), customCode };
    return this.http.post(url, null, { params });
  }

  confirmAdozione(requestId: number, customCode: string): Observable<any> {
    const url = `${this.apiUrl}/confirmAdotta`;
    const params = { requestId: requestId.toString(), customCode };
    return this.http.post(url, null, { params }).pipe(
      tap((response: any) => console.log('Risposta da conferma adozione:', response)),
      catchError(error => {
        console.error('Errore durante la conferma dell\'adozione:', error);
        throw error;
      })
    );
  }
  deleteRequest(requestId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/delete/${requestId}`);
  }

 
}