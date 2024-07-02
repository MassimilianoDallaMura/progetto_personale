import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;
  
  constructor(private authSrv: AuthService, private router: Router) {}


  goBack() {
    this.router.navigateByUrl('/'); // Naviga alla pagina precedente
  }

  onSubmit(form: NgForm) {
    try {
      const selectedCity = localStorage.getItem('city') || ''; // Recupera la città selezionata dal localStorage
      this.authSrv.login(form.value, selectedCity).subscribe(
        () => {
          // Login avvenuto con successo, reindirizzamento all'onboarding'
          this.router.navigate(['/onboarding']);
        },
        (error) => {
          // Gestione degli errori durante il login
          console.error('Login error:', error);
        }
      );
    } catch (error) {
      console.error(error);
    } 
  }
  

  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}
