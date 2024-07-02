import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable, map } from 'rxjs';
import { Product } from 'src/app/interface/product.interface'; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}


  getSelectedCity(): Observable<string> {
    // Effettua una chiamata HTTP per recuperare la città selezionata dall'utente
    return this.http.get<string>(`${this.apiUrl}/selected-city`);
  }


  // Metodo per ottenere i prodotti in base alla città
  getProductsByCity(city: string): Observable<Product[]> {
    const endpointUrl = `${this.apiUrl}/products/city/${city}`;
    return this.http.get<Product[]>(endpointUrl);
  }


  // PER PRENDERE LE CATEGORIE
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
  }


  //BY ID

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product/${productId}`);
  }

  

  // ESTRARRE CONDIZIONI
  getProductCondictions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/condictions`);
  }

  
  // AGGIUNGE PRODOTTO

  addProduct(productData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, productData);
  }


  // TUTTI I PRODOTTI

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }



  // Metodo per ottenere i prodotti per userId (===ownerId)
  getProductsByUserId(userId: number): Observable<Product[]> {
    return this.getProducts().pipe(
      map(products => products.filter(product => product.ownerId === userId))
    );
  }



  // AGGIUNGE AI PREFERITI
  addToFavorites(userId: number, productId: number): Observable<string> {
    const endpointUrl = `${this.apiUrl}/users/${userId}/favorites/${productId}`;
    return this.http.post(endpointUrl, null, { responseType: 'text' });
  }


  // ESTRE I PREFE
  getFavoriteProductsForUser(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/users/${userId}/favorites`);
   
  }



  // RIMUOVE DAI PREFE
  removeFromFavorites(userId: number, productId: number): Observable<string> {
    const endpointUrl = `${this.apiUrl}/users/${userId}/favorites/${productId}`;
    return this.http.delete(endpointUrl, { responseType: 'text' });
  }




  // METODO PER OTTENERE I PRODOTTI IN BASE ALL'OWNER ID
  getProductsByOwnerId(ownerId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/owner/${ownerId}`);
  }




  // METODO PER ELIMINARE UN PRODOTTO

  deleteProductById(productId: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/products/${productId}`);
  }




  // METTODO PER CARICARE UN'IMMAGINE
  uploadProductImage(productId: number, image: File): Observable<any> {
    const endpointUrl = `${this.apiUrl}/products/${productId}/images`;

    // Form data per il caricamento delle immagini
    const formData = new FormData();
    formData.append('image', image, image.name);

    // Headers per la richiesta multipart/form-data
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(endpointUrl, formData, { headers });
  }

 // Metodo per aggiornare la disponibilità del prodotto
 updateProductAvailability(productId: number, availability: boolean): Observable<Product> {
  return this.http.patch<Product>(`${this.apiUrl}/products/${productId}/available`, { available: availability });
}
}