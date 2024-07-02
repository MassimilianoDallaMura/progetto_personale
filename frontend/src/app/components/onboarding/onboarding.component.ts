import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GeocodingService } from 'src/app/service/geocoding.service';
import { CityService } from 'src/app/service/city.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  selectedCity: string = '';
  cityInput: string = '';
  isCityConfirmed: boolean = false;
  errorMessage: string = '';
  center: { lat: number, lng: number } = { lat: 0, lng: 0 };

  @Output() centerChanged = new EventEmitter<{ lat: number, lng: number }>();

  constructor(
    private geocodingService: GeocodingService,
    private router: Router,
    private cityService: CityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  confirmCity(): void {
    if (this.cityInput) {
      this.selectedCity = this.cityInput;
      localStorage.setItem('selectedCity', this.selectedCity);
      this.isCityConfirmed = true;
      this.saveCity(); // Salva la città selezionata
    } else {
      console.warn('Inserire una città valida.');
    }
  }

  saveCity(): void {
    const userId = this.authService.getUserId(); // Ottieni l'ID dell'utente dal AuthService
    if (userId) {
      this.cityService.updateCity(userId, this.selectedCity).subscribe(
        response => {
          console.log('Città aggiornata nel database:', response);
          // Gestisci la risposta come desiderato
        },
        error => {
          console.error('Errore durante l\'aggiornamento della città:', error);
          // Gestisci l'errore in modo appropriato (es. mostrando un messaggio all'utente)
        }
      );
    } else {
      console.error('ID utente non disponibile.');
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  searchCity(): void {
    if (this.cityInput) {
      this.selectedCity = this.cityInput;
      localStorage.setItem('selectedCity', this.selectedCity);
      this.isCityConfirmed = true;
      this.saveCity(); // Salva la città selezionata
    } else {
      console.warn('Inserire una città valida.');
    }
  }

  locateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('User location:', this.center);
          this.geocodeCoordinates(position.coords.latitude, position.coords.longitude);
          // Emit the center coordinates to parent component or service
          this.centerChanged.emit(this.center);
        },
        (error) => {
          console.error('Error getting user location:', error);
          this.errorMessage = 'Error getting user location.';
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.errorMessage = 'Geolocation is not supported by this browser.';
    }
  }

  geocodeCoordinates(lat: number, lng: number): void {
    this.geocodingService.geocodeLatLng(lat, lng)
      .then(({ fullAddress, addressComponents }) => {
        console.log('Geocoded address:', fullAddress);
        console.log('Address components:', addressComponents);
        this.cityInput = this.extractCityFromComponents(addressComponents);
        this.selectedCity = fullAddress;
        // Emit the center coordinates to parent component or service
        this.centerChanged.emit(this.center);
      })
      .catch(error => {
        console.error('Geocoding error:', error);
        this.errorMessage = 'Geocoding error: ' + error;
      });
  }

  extractCityFromComponents(addressComponents: google.maps.GeocoderAddressComponent[]): string {
    for (let component of addressComponents) {
      if (component.types.includes('locality')) {
        return component.long_name;
      }
    }
    // Optionally, you can add more checks for other types such as 'administrative_area_level_3'
    for (let component of addressComponents) {
      if (component.types.includes('administrative_area_level_3')) {
        return component.long_name;
      }
    }
    return '';
  }
}
