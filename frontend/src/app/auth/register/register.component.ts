import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isRegistered: boolean = false;
  registrationError: string | null = null; // Dichiarazione del tipo come string | null
  hide = true;
  emailAlreadyExists: boolean = false;
  
  constructor(private authSrv: AuthService, private router: Router) {}

  goBack() {
    this.router.navigateByUrl('/'); // Naviga alla pagina precedente
  }

  onSubmit(form: NgForm) {
    this.authSrv.signUp(form.value).subscribe(
      (response: any) => {
        if (response === 1) {
          this.isRegistered = true; // Imposta la variabile isRegistered su true dopo la registrazione
        }
      }, 
      (error: any) => {
        if (error.error.message === "L'indirizzo email è già registrato.") {
          this.emailAlreadyExists = true;
        } else {
          console.error(error);
        }
      }
    );
  }
  
  clickEvent(event: MouseEvent) {
    this.hide = !this.hide;
    event.stopPropagation();
  }
}
