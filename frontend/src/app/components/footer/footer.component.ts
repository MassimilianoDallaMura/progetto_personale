import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  activeIcon: string = ''; // Icona attiva

  constructor(private router: Router) {}

  ngOnInit() {
    // Sottoscriversi agli eventi di navigazione per aggiornare l'icona attiva
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateActiveIcon(event.urlAfterRedirects);
      }
    });

    // Impostare l'icona attiva in base all'URL iniziale
    this.updateActiveIcon(this.router.url);
  }

  updateActiveIcon(url: string) {
    if (url.includes('/home')) {
      this.activeIcon = 'home';
    } else if (url.includes('/favorite')) {
      this.activeIcon = 'favorite';
    } else if (url.includes('/addProduct')) {
      this.activeIcon = 'addProduct';
    } else if (url.includes('/request')) {
      this.activeIcon = 'request';
    } else if (url.includes('/profile')) {
      this.activeIcon = 'profile';
    } else {
      this.activeIcon = '';
    }
  }

  toggleColor(icon: string) {
    this.activeIcon = icon;
  }
}
