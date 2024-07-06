import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { GeocodingService } from 'src/app/service/geocoding.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapService } from 'src/app/service/map.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) mapContainer: ElementRef | undefined;

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCity: string = '';
  isMapView: boolean = false;
  center: google.maps.LatLngLiteral = { lat: 45.4642, lng: 9.1900 };
  zoom = 12;
  favoriteProducts: Product[] = [];
  searchQuery: string = '';
  private searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private router: Router,
    private productService: ProductService,
    private geocodingService: GeocodingService,
    private authService: AuthService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.selectedCity = localStorage.getItem('selectedCity') || '';
    if (this.selectedCity) {
      this.loadProductsByCity(this.selectedCity);
    }

    const favoriteProducts = localStorage.getItem('favoriteProducts');
    if (favoriteProducts) {
      this.favoriteProducts = JSON.parse(favoriteProducts);
    }

    this.updateFavoriteStatus();

    this.searchSubject.pipe(
      debounceTime(300),      // per ridurre il numero di chiamate alla funzione di ricerca.
      distinctUntilChanged()  //  per ridurre il numero di chiamate alla funzione di ricerca.
    ).subscribe(query => {
      this.filteredProducts = this.filterProducts(query);
    });
  }

  loadProductsByCity(city: string) {
    this.productService.getProductsByCity(city).subscribe(
      (products: Product[]) => {
        this.products = products;
        this.filteredProducts = this.products;
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
      return product.foto;
    } else if (product.foto && typeof product.foto === 'object' && 'url' in product.foto) {
      return (product.foto as { url: string }).url;
    } else if (product.photos && product.photos.length > 0) {
      return product.photos[0];
    } else {
      return 'assets/default-product-image.jpg';
    }
  }

  toggleView(): void {
    this.isMapView = !this.isMapView;
    if (this.isMapView) {
      this.updateMapMarkers();
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  filterProducts(query: string): Product[] {
    return this.products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
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
          this.favoriteProducts.push(product);
          localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
        },
        (error) => {
          console.error('Error adding to favorites:', error);
        }
      );
    }
  }

  updateFavoriteStatus() {
    this.products.forEach(product => {
      product.isFavorite = this.favoriteProducts.some(fp => fp.id === product.id);
    });
  }

  deleteProduct(product: Product): void {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }
}
