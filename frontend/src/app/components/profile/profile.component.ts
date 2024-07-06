import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/interface/product.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  products: Product[] = [];
  selectedCity: string = '';
  userId: number | null = null;
  user: User | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.selectedCity = localStorage.getItem('selectedCity') || '';
    this.userId = this.authService.getUserId();

    if (this.userId !== null) {
      this.loadUserById(this.userId);
      this.loadProductsForUser(this.userId);
    }
  }

  loadUserById(userId: number) {
    this.userService.getUserById(userId).subscribe(
      (user: User) => {
        this.user = user;
        console.log(user)
      },
      (error) => {
        console.error('Errore nel recupero dell\'utente:', error);
        if (error.status === 403) {
          console.error('Accesso negato. Assicurati di avere i permessi necessari.');
        }
      }
    );
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/details', productId]);
  }

  loadProductsForUser(userId: number) {
    this.productService.getProducts().subscribe(
      (products: Product[]) => {
        console.log('Prodotti ricevuti:', products);
        this.products = products.filter(product => product.owner && product.owner.id === userId); // Verifica che product.owner esista
        console.log('Prodotti filtrati:', this.products); 
      },
      (error) => {
        console.error('Errore nel recupero dei prodotti:', error);
      }
    );
  }
  


  navigateToComponent(event: string) {
    this.router.navigate(['/settings']);
  }


}
