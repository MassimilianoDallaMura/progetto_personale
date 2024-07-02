import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/interface/product.interface';
import { MapService } from 'src/app/service/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() center: { lat: number, lng: number } = { lat: 45.4642, lng: 9.1900 };
  @Input() zoom: number = 12;
  @Input() products: Product[] = [];

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['center'] && !changes['center'].firstChange) {
      this.updateMapCenter();
    }
    if (changes['products']) {
      this.updateMarkers();
    }
  }

  private initializeMap(): void {
    const mapElement = document.getElementById('map') as HTMLElement;
    this.mapService.initMap(mapElement, this.center.lat, this.center.lng, this.zoom);
    this.updateMarkers();
  }

  private updateMarkers(): void {
    this.mapService.clearMarkers();
    this.products.forEach(product => {
      const latitude = Number(product.latitude);
      const longitude = Number(product.longitude);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        const title = product.title;
        const content = `
          <div>
            <h4>${product.title}</h4>
            <p>${product.description}</p>
          </div>
        `;
        this.mapService.addMarker(latitude, longitude, title, content);
      }
    });
  }

  private updateMapCenter(): void {
    this.mapService.setCenter(this.center.lat, this.center.lng);
  }


  locateUser(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log('UpdateMapCenter - Center:', this.center);
          this.updateMapCenter(); // Assicurati di chiamare questa funzione dopo aver aggiornato this.center
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
