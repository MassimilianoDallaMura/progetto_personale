import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  constructor (private location: Location ) {} 

  goBack(): void {
    this.location.back(); // Questo metodo naviga alla pagina precedente nella cronologia del browser
  }

}
