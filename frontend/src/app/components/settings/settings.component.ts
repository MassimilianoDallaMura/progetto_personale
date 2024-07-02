import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/interface/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from '../logout/logout.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  userId: number | null = null;
  user: User | null = null;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private dialog: MatDialog
  ) {}

  public navigateToComponent(componentName: string) {
    switch (componentName) {
      case 'profile_details':
        this.router.navigate(['/profile_details']);
        break;
      case 'notifications':
        this.router.navigate(['/notifications']);
        break;
      default:
        console.warn('Unknown component:', componentName);
    }
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
