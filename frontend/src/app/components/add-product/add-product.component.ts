import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { GeocodingService } from 'src/app/service/geocoding.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  owned: boolean | null = null;
  ownerId: number | null = null;
  companyProperty: boolean = false; // Inizializzato a false di default
  toBeWithdrawn: boolean | null = null;
  showSecondSection: boolean = false;
  categories: string[] = [];
  productCondictions: string[] = [];
  disposalCode: string = '';
  productImages: { url: string }[] = [{ url: '' }, { url: '' }, { url: '' }];
  selectedFiles: File[] = [];
  formData: FormData = new FormData();

  product: Product = {
    title: '',
    description: '',
    category: '',
    latitude: 0,
    longitude: 0,
    foto: '',
    city: '',
    disposalCode: null,
    productCondictions: '',
    owned: false,
    toBeWithdrawn: false,
    companyProperty: false,
    adopterId: null,
    donorId: null,
    companyCode: null,
    available: false,
    ownerId: null,
    isFavorite: false,
    id: undefined,
    createdDate: '',
    owner: null,
    photos: [],
    fullAddress: ''
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient,
    private geocodingService: GeocodingService,
    private authService: AuthService // Added AuthService for user authentication
  ) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe(categories => this.categories = categories);
    this.productService.getProductCondictions().subscribe(condictions => this.productCondictions = condictions);
  }

  onSubmit(form: NgForm) {
    // Aggiungi i dati del form al FormData
    this.formData.append('title', this.product.title);
    this.formData.append('description', this.product.description);
    this.formData.append('category', this.product.category);
    this.formData.append('productCondictions', this.product.productCondictions);
    this.formData.append('latitude', this.product.latitude.toString());
    this.formData.append('longitude', this.product.longitude.toString());
    this.formData.append('fullAddress', this.product.fullAddress);
    this.formData.append('city', this.product.city);
  
    this.formData.append('owned', this.product.owned ? 'true' : 'false');
    if (this.product.ownerId != null) {
      this.formData.append('ownerId', this.product.ownerId.toString());
    }
    this.formData.append('toBeWithdrawn', this.product.toBeWithdrawn ? 'true' : 'false');
    this.formData.append('companyProperty', this.product.companyProperty ? 'true' : 'false');
    
    // Aggiungi disposalCode solo se è stato inserito dall'utente e companyProperty è true
    if (this.product.companyProperty && this.disposalCode.trim() !== '') {
      this.formData.append('disposalCode', this.disposalCode);
    }
  
    // Aggiungi i file selezionati al FormData
    this.selectedFiles.forEach((file, index) => {
      this.formData.append(`photos[${index}]`, file, file.name);
    });
  
    // Chiama productService per aggiungere il prodotto
    this.productService.addProduct(this.formData).subscribe(
      (response: any) => {
        console.log('Prodotto aggiunto con successo:', response);
        // Reindirizza alla pagina dei dettagli del prodotto
        this.router.navigate(['/confirmProduct']);
      },
      (error) => {
        console.error('Errore durante l\'aggiunta del prodotto:', error);
        // Gestisci gli errori, mostra un messaggio all'utente, ecc.
      }
    );
  }

  

  // Function to handle image upload for a specific index
  uploadProductImage(index: number) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', (event: any) => {
      this.onProductImageSelected(event, index);
    });
    fileInput.click();
  }


  // Function called when an image is selected for upload
  onProductImageSelected(event: any, index: number) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFiles[index] = file;

      // Update productImages for image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.productImages[index].url = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Append selected file to FormData
      this.formData.append('photos', file, file.name);
    }
  }

  onOwnedChange() {
    if (this.owned) {
      this.product.owned = true;
      this.product.ownerId = this.authService.getUserId();
      this.showSecondSection = true;
    } else {
      this.product.owned = false;
      this.showSecondSection = false;
      this.toBeWithdrawn = false;
      this.product.ownerId = null;
    }
    this.companyProperty = false;
    console.log('Owned:', this.product.owned);
    console.log('OwnerId:', this.product.ownerId);
  }


  
// Gestisce il cambio di proprietà "companyProperty"
onCompanyPropertyChanged() {
  this.product.companyProperty = this.companyProperty; // Imposta companyProperty in base alla selezione

  if (!this.product.companyProperty) {
    this.product.disposalCode = null; // Resetta disposalCode se companyProperty è false
  }

  console.log('companyProperty:', this.product.companyProperty);
  console.log('disposalCode:', this.product.disposalCode);
}




  // Handle change in the "toBeWithdrawn" property
  onToBeWithdrawnChange(value: boolean) {
    this.product.toBeWithdrawn = value;
  }

  // Close the component and navigate to the home page
  close() {
    this.router.navigate(['/home']);
  }

  // Use geocoding service to get address from latitude and longitude
  locateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.product.latitude = lat;
          this.product.longitude = lng;
          this.geocodeCoordinates(lat, lng);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  

  // Geocode coordinates to get full address
  geocodeCoordinates(lat: number, lng: number): void {
    this.geocodingService.geocodeLatLng(lat, lng)
      .then(({ fullAddress, addressComponents }) => {
        console.log('Geocoded address:', fullAddress);
        console.log('Address components:', addressComponents);
        this.product.city = this.extractCityFromComponents(addressComponents);
        this.product.fullAddress = fullAddress;
      })
      .catch(error => {
        console.error('Geocoding error:', error);
      });
  }

  // Extract city name from geocoded address components
  extractCityFromComponents(addressComponents: google.maps.GeocoderAddressComponent[]): string {
    for (let component of addressComponents) {
      if (component.types.includes('locality')) {
        return component.long_name;
      }
    }
    return '';
  }
}
