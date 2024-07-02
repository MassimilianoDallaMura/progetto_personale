import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { AuthService } from 'src/app/auth/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  favoriteProducts: Product[] = [];

  constructor(private router: Router, private productService: ProductService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadFavoriteProducts();
  }
 

  loadFavoriteProducts(): void {
  const userId = this.authService.getUserId();

  if (userId) {
    this.productService.getFavoriteProductsForUser(userId).subscribe(
      (products: Product[]) => {
        this.favoriteProducts = products;
        
        // Aggiorna lo stato isFavorite dei prodotti basato sulla lista dei preferiti ottenuta
        this.favoriteProducts.forEach(fp => fp.isFavorite = true);
        
        console.log(products);
      },
      (error) => {
        console.error('Errore nel recupero dei prodotti preferiti:', error);
      }
    );
  } else {
    console.error('ID utente non disponibile');
  }
}

getProductPhoto(product: Product): string {
  if (typeof product.foto === 'string') {
    return product.foto; // Se 'foto' è una stringa semplice (URL diretto dell'immagine)
  } else if (product.foto && typeof product.foto === 'object' && 'url' in product.foto) {
    // Verifica che 'foto' sia un oggetto e che contenga la proprietà 'url'
    return (product.foto as { url: string }).url; // Restituisci l'URL dell'immagine dall'oggetto 'foto'
  } else if (product.photos && product.photos.length > 0) {
    return product.photos[0]; // Mostra la prima foto nell'array 'photos'
  } else {
    return 'assets/default-product-image.jpg'; // Immagine di default se non ci sono foto disponibili
  }
}

  removeFavorite(product: Product): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.productService.removeFromFavorites(userId, product.id).subscribe(
        (response: string) => {
          console.log(response); // Log della risposta del server
          product.isFavorite = false; // Aggiornamento UI, rimuovi dai preferiti
          this.favoriteProducts = this.favoriteProducts.filter(fp => fp.id !== product.id);
          localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
        },
        (error) => {
          console.error('Errore nella rimozione dai preferiti:', error);
        }
      );
    } else {
      console.error('ID utente non disponibile');
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }
}
