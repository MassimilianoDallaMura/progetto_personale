import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: google.maps.Map | undefined; // Aggiungi il tipo di mappa come opzionale
  private markers: google.maps.Marker[] = [];

  constructor() { }

  initMap(mapElement: HTMLElement, lat: number, lng: number, zoom: number): void {
    this.map = new google.maps.Map(mapElement, {
      center: { lat, lng },
      zoom,
    });
  }

  addMarker(lat: number, lng: number, title: string, content: string): void {
    if (!this.map) {
      console.error('Mappa non inizializzata correttamente.');
      return;
    }

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title,
    });

    const infowindow = new google.maps.InfoWindow({
      content,
    });

    marker.addListener('click', () => {
      infowindow.open(this.map!, marker);
    });

    this.markers.push(marker);
  }

  clearMarkers(): void {
    if (!this.map) {
      console.error('Mappa non inizializzata correttamente.');
      return;
    }

    this.markers.forEach(marker => {
      marker.setMap(null); // Rimuovi il marker dalla mappa
    });
    this.markers = []; // Svuota l'array dei marker
  }

  setCenter(lat: number, lng: number): void {
    if (!this.map) {
      console.error('Mappa non inizializzata correttamente.');
      return;
    }

    const newCenter = new google.maps.LatLng(lat, lng);
    this.map.setCenter(newCenter);
  }
}
