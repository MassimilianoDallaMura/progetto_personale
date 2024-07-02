import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthData } from 'src/app/interface/auth-data.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Output() navigateToComponent = new EventEmitter<string>();
  activeIcon: string = ''; // Icona attiva

  constructor() {}

  toggleColor(icon: string) {
    this.activeIcon = icon;
  }
}
