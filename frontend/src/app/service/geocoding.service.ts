import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private geocoder: google.maps.Geocoder;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  geocodeLatLng(lat: number, lng: number): Promise<{ fullAddress: string, addressComponents: google.maps.GeocoderAddressComponent[] }> {
    return new Promise((resolve, reject) => {
      const latlng = { lat, lng };
      this.geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results && results.length > 0) {
            const fullAddress = results[0].formatted_address;
            const addressComponents = results[0].address_components;
            resolve({ fullAddress, addressComponents });
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
  }
}
