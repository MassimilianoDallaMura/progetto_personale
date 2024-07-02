import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/interface/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthData } from 'src/app/interface/auth-data.interface';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})


export class ProfileDetailsComponent implements OnInit {
  userId: number | null = null;
  user: User | null = null; // Aggiungi un campo per l'utente
  imageUrl: string | ArrayBuffer | null = null; // URL o anteprima dell'immagine
  selectedFile: File | null = null; // Il file selezionato dall'utente


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private location: Location,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.getUserDetails();
    }
  }

  getUserDetails(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (user: User) => {
          this.user = user;
        },
        (error) => {
          console.error('Errore nel recuperare i dettagli dell\'utente', error);
        }
      );
    }
  }

  // Gestisce il caricamento del file selezionato
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  // Carica l'immagine del profilo dell'utente sul server
  onUploadProfileImage(): void {
    if (this.selectedFile && this.userId) {
      this.userService.patchFotoUser(this.userId, this.selectedFile).subscribe(response => {
        console.log('Upload successful', response);
        this.getUserDetails(); // Aggiorna i dettagli dell'utente per riflettere la nuova immagine
      }, error => {
        console.error('Upload failed', error);
      });
    }
  }



  public navigateToComponent(event: string) {
    this.router.navigate(['/profileSettings']);
  }

  goBack(): void {
    this.location.back(); // Questo metodo naviga alla pagina precedente nella cronologia del browser
  }

  saveUsername(): void {
    if (this.user && this.userId) {
      this.userService.updateUsername(this.userId, this.user.username).subscribe(
        (response) => {
          console.log('Username aggiornato con successo', response);
          // Aggiorna l'interfaccia utente o mostra un messaggio di successo
        },
        (error) => {
          console.error('Errore nell\'aggiornamento del username', error);
          // Gestisci l'errore: mostra un messaggio all'utente o esegui un'altra azione
          if (error.status === 403) {
            // Esempio: l'utente non è autorizzato
            alert('Non sei autorizzato ad eseguire questa operazione.');
          } else {
            alert('Si è verificato un errore durante l\'aggiornamento del username.');
          }
        }
      );
    }
  }

  deleteProfile(): void {
    if (this.user) {
      const userId = this.user.id;
      this.userService.deleteUser(userId).subscribe(
        (response: any) => {
          console.log(response);
          alert(response); // Mostra il messaggio di successo
          this.router.navigate(['/']); // Esempio: reindirizza alla home dopo l'eliminazione
        },
        (error) => {
          console.error('Errore durante l\'eliminazione del profilo:', error);
          alert('Si è verificato un errore durante l\'eliminazione del profilo.');
        }
      );
    } else {
      console.error('Impossibile eliminare il profilo: utente non definito.');
      alert('Impossibile eliminare il profilo: utente non definito.');
    }
  }

  
}