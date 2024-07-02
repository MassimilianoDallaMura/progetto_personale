import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-product',
  templateUrl: './confirm-product.component.html',
  styleUrls: ['./confirm-product.component.scss']
})
export class ConfirmProductComponent {

  constructor(private router: Router) { }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
