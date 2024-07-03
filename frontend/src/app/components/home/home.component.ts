import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { NgForm } from '@angular/forms';
import { GeocodingService } from 'src/app/service/geocoding.service';
import { AuthService } from 'src/app/auth/auth.service'; 
import { MapService } from 'src/app/service/map.service'; 



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef | undefined;

  products: Product[] = [];
  selectedCity: string = '';
  isMapView: boolean = false;
  center: google.maps.LatLngLiteral = { lat: 45.4642, lng: 9.1900 };
  zoom = 12;
  favoriteProducts: Product[] = [];

  constructor(
    private router: Router,
    private productService: ProductService,
    private geocodingService: GeocodingService,
    private authService: AuthService ,
    private mapService: MapService
  ) {}
 
  ngOnInit() {
    this.selectedCity = localStorage.getItem('selectedCity') || '';
    if (this.selectedCity) {
      this.loadProductsByCity(this.selectedCity);
    }

    // Carica i prodotti preferiti salvati nel localStorage
    const favoriteProducts = localStorage.getItem('favoriteProducts');
    if (favoriteProducts) {
      this.favoriteProducts = JSON.parse(favoriteProducts);
    }

    // Aggiorna lo stato 'isFavorite' per i prodotti inizialmente caricati
    this.updateFavoriteStatus();
  }

  // ngAfterViewInit() {
  //   if (this.isMapView && this.mapContainer) {
  //     this.mapService.initMap(this.mapContainer.nativeElement, this.center.lat, this.center.lng, this.zoom);
  //   }
  // }



  loadProductsByCity(city: string) {
    this.productService.getProductsByCity(city).subscribe(
      (products: Product[]) => {
        this.products = products;
        // Aggiorna lo stato 'isFavorite' per i prodotti caricati
        this.updateFavoriteStatus();
  
        if (this.isMapView) {
          this.updateMapMarkers();
        }
      },
      (error) => {
        console.error('Error fetching products by city:', error);
      }
    );
  }
  
  updateMapMarkers() {
    if (!this.mapService) {
      console.error('MapService is not initialized.');
      return;
    }
  
    // // Pulisce tutti i marcatori esistenti
    // this.mapService.clearMarkers();
  
    // Aggiunge un nuovo marcatore per ciascun prodotto
    this.products.forEach(product => {
      const latitude = product.latitude;
      const longitude = product.longitude;
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const markerContent = `
          <div>
            <h4>${product.title}</h4>
            <img src="${product.photos}" style="max-width: 100px; height: auto;">
          </div>
        `;
        this.mapService.addMarker(latitude, longitude, product.title, markerContent);
      }
    });
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
  
  toggleView(): void {
    this.isMapView = !this.isMapView;
    if (this.isMapView) {
      this.updateMapMarkers();
    }
  }



  handleNavigation(action: { icon: string, route: string }) {
    this.router.navigate([action.route]);
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }

  onSearch(form: NgForm): void {
    // logica di ricerca ancora da implementare
  }

  addToFavorites(product: Product) {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User ID not found.');
      return;
    }
  
    if (product.isFavorite) {
      this.productService.removeFromFavorites(userId, product.id).subscribe(
        (response: string) => {
          console.log(response);
          product.isFavorite = false;
  
          // Rimuovi il prodotto dai preferiti nel localStorage
          this.favoriteProducts = this.favoriteProducts.filter(fp => fp.id !== product.id);
          localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
        },
        (error) => {
          console.error('Error removing from favorites:', error);
        }
      );
    } else {
      this.productService.addToFavorites(userId, product.id).subscribe(
        (response: string) => {
          console.log(response);
          product.isFavorite = true;
  
          // Aggiungi il prodotto ai preferiti nel localStorage
          this.favoriteProducts.push(product);
          localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
        },
        (error) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }
  

  updateFavoriteProductsLocalStorage() {
    const favoriteProducts = this.products.filter(product => product.isFavorite);
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
  }

  updateFavoriteStatus() {
    // Aggiorna lo stato 'isFavorite' per ciascun prodotto
    this.products.forEach(product => {
      if (this.favoriteProducts.some(fp => fp.id === product.id)) {
        product.isFavorite = true;
      } else {
        product.isFavorite = false;
      }
    });
  }


  
  deleteProduct(product: Product): void {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1); // Rimuovi il prodotto dalla lista
      // Aggiorna anche il localStorage se necessario
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }
}
