import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interface/auth-data.interface';
import { RequestService } from 'src/app/service/request.service';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for modal usage


interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
      };
      status: string;
    }>;
  }>;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  user: AuthData | null = null;
  product: Product | undefined;
  userId: number | null = null;
  currentImageIndex: number = 0;
  daysSinceUpload: number | null = null;
  ownerId: number | null = null;
  userLocation: google.maps.LatLngLiteral | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private requestService: RequestService,
    private dialog: MatDialog // Inject MatDialog for modal usage

  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.user = user;

      if (user && user.user?.id) {
        this.userId = user.user.id;
      } else {
        this.userId = null;
      }

      this.loadProductDetails();

      // Get user location and update distances
      this.getUserLocation().then(location => {
        this.userLocation = location;
        this.updateProductDistances();
      }).catch(error => {
        console.error('Error getting user location:', error);
      });
    });
  }

  getUserLocation(): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve({ lat, lng });
          },
          (error) => {
            console.error('Error getting user location:', error);
            reject(error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation not supported'));
      }
    });
  }

  loadProductDetails(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      console.error('Product ID is missing from route parameters');
      return;
    }

    this.productService.getProductById(Number(productId)).subscribe(
      (product: Product) => {
        this.product = product;

        if (!this.product || !this.product.latitude || !this.product.longitude) {
          console.error('Product location is not available');
          // Gestire il caso in cui la posizione del prodotto non è disponibile
        } else {
          console.log('Product location:', this.product.latitude, this.product.longitude);
          this.updateProductDistances(); // Chiamare il metodo per aggiornare le distanze solo se la posizione è disponibile
        }

        this.currentImageIndex = 0;
        this.calculateDaysSinceUpload(product.createdDate);

        if (product.owner && product.owner.id) {
          this.ownerId = product.owner.id;
        }
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );
  }

  calculateDaysSinceUpload(createdDate: string): void {
    const uploadDate = new Date(createdDate);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - uploadDate.getTime();
    this.daysSinceUpload = Math.floor(timeDifference / (1000 * 3600 * 24));
  }

  updateProductDistances() {
    console.log('Updating product distances...');
    console.log('User location:', this.userLocation);
    console.log('Product:', this.product);

    if (!this.userLocation || !this.product) {
      console.error('User location or product not available.');
      return;
    }

    const service = new google.maps.DistanceMatrixService();
    const origin = new google.maps.LatLng(this.userLocation.lat, this.userLocation.lng);
    const destination = new google.maps.LatLng(this.product.latitude, this.product.longitude);
    const timeoutMs = 10000;

    const timeoutId = setTimeout(() => {
      console.error('Timeout exceeded while calculating distances.');
      if (this.product) {
        this.product.distance = 'Timeout exceeded';
      }
    }, timeoutMs);

    service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
    }, (response: DistanceMatrixResponse | null, status: google.maps.DistanceMatrixStatus) => {
      clearTimeout(timeoutId);

      if (status === google.maps.DistanceMatrixStatus.OK && response && response.rows.length > 0 && response.rows[0].elements.length > 0) {
        const element = response.rows[0].elements[0];
        if (element.status === 'OK' && element.distance) {
          if (this.product) {
            this.product.distance = element.distance.text;
            console.log(`Distance for product ${this.product.title}: ${element.distance.text}`);
          }
        } else {
          if (this.product) {
            this.product.distance = 'Distance not available';
          }
        }
      } else if (response && response.rows.length > 0 && response.rows[0].elements.length === 0) {
        if (this.product) {
          this.product.distance = 'No route found';
        }
      } else if (status === google.maps.DistanceMatrixStatus.OVER_QUERY_LIMIT) {
        console.error('You have exceeded your daily request quota for the Distance Matrix API.');
        if (this.product) {
          this.product.distance = 'Quota exceeded';
        }
      } else {
        console.error('Error calculating distances:', status);
        if (this.product) {
          this.product.distance = 'Distance calculation error';
        }
      }
    });
  }

  openGoogleMaps(latitude?: number, longitude?: number) {
    if (latitude !== undefined && longitude !== undefined) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      console.error('Latitude and Longitude are required to open Google Maps');
    }
  }

  nextImage(): void {
    if (this.product && this.product.photos && this.product.photos.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.photos.length;
    }
  }

  previousImage(): void {
    if (this.product && this.product.photos && this.product.photos.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.photos.length) % this.product.photos.length;
    }
  }

  deleteProduct(): void {
    if (!this.product) {
      console.error('Product not available for deletion.');
      return;
    }

    this.productService.deleteProductById(this.product.id).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Error deleting product:', error);
      }
    );
  }

  confirmDelete(): void {
    if (!this.product) {
      console.error('Product not available for deletion confirmation.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.deleteProduct();
    }
  }

  handleAction(): void {
    const actionLabel = this.getActionButtonLabel();

    switch (actionLabel) {
      case 'Elimina':
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (confirmDelete) {
          this.deleteProduct();
        }
        break;
      case 'Contatta':
        this.sendContactRequest();
        break;
      case 'Segnala come assente':
      case 'Segnala come presente':
        this.reportMissing();
        break;
      default:
        console.error('Unhandled action:', actionLabel);
        break;
    }
  }

  reportMissing(): void {
    if (!this.product) return;

    const newAvailability = !this.product.available;

    this.productService.updateProductAvailability(this.product.id, newAvailability).subscribe(
      (updatedProduct) => {
        if (updatedProduct) {
          this.product = updatedProduct;
        }
      },
      (error) => {
        console.error('Errore durante l\'aggiornamento della disponibilità:', error);
      }
    );

    // Aggiorna lo stato locale del prodotto immediatamente
    this.product.available = newAvailability;
  }

  sendContactRequest(): void {
    if (!this.product || !this.userId) {
      console.error('Product or userId is not defined.');
      return;
    }

    const userIdString = this.userId.toString();
    const productId = this.product.id;

    this.requestService.sendContactRequest(userIdString, productId);
  }

  getActionButtonLabel(): string {
    if (!this.product) {
      return '';
    }

    const ownerId = this.product.owner ? this.product.owner.id : null;
    const userId = this.userId ? Number(this.userId) : null;
    const productOwned = this.product.owned;

    if (ownerId !== null && userId !== null && productOwned) {
      if (ownerId === userId) {
        return 'Elimina';
      } else {
        return 'Contatta';
      }
    } else {
      return this.product.available ? 'Segnala come assente' : 'Segnala come presente';
    }
  }
}
