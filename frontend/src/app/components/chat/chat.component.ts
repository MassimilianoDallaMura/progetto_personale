import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from 'src/app/service/request.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  requestId: number | undefined;
  request: any = {};
  markedAsDonated: boolean = false;
  markedAsAdopted: boolean = false;
  userId: number | undefined;
  modalOpen = false;
  customCode: string = '';
  feedbackMessage: string = '';  // Feedback message


  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router, // Inject Router
    private location: Location,
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userId = userId;
    } else {
      console.error('ID utente non disponibile.');
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.requestId = +id;
        this.getRequestDetails(this.requestId);
      } else {
        console.error('Parametro ID non trovato nell\'URL');
      }
    });
  }

  getRequestDetails(requestId: number): void {
    this.requestService.getRequestById(requestId).subscribe(
      (request: any) => {
        this.request = request;
        console.log('Dettagli richiesta:', this.request);
      },
      error => {
        console.error('Errore recupero dettagli richiesta:', error);
        alert('Si è verificato un errore durante il recupero dei dettagli della richiesta.');
      }
    );
  }

  isCurrentUserOwner(): boolean {
    return this.request.product && this.request.product.owner.id === this.userId;
  }

  openModal(isAdoption: boolean): void {
    this.modalOpen = true;
    this.customCode = this.request.customCode;
    if (isAdoption) {
      this.markedAsAdopted = true;
      this.markedAsDonated = false;
    } else {
      this.markedAsDonated = true;
      this.markedAsAdopted = false;
    }
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  showFeedbackMessage(message: string): void {
    this.feedbackMessage = message;
    setTimeout(() => {
      this.feedbackMessage = '';
    }, 3000);
  }

  confirm(): void {
    if (this.requestId && this.customCode) {
      if (this.markedAsAdopted) {
        this.requestService.confirmAdozione(this.requestId, this.customCode).subscribe(
          response => {
            console.log('Conferma adozione avvenuta con successo:', response);
            this.showFeedbackMessage('Adozione confermata con successo');
            this.closeModal(); // Chiude il modale dopo la conferma
            this.router.navigate(['/confirm-request', { type: 'adozione' }]);
          },
          error => {
            console.error('Errore durante la conferma dell\'adozione:', error);
            this.showFeedbackMessage('Errore durante la conferma dell\'adozione');
          }
        );
      } else if (this.markedAsDonated) {
        this.requestService.confirmDonazione(this.requestId, this.customCode).subscribe(
          response => {
            console.log('Conferma donazione avvenuta con successo:', response);
            this.showFeedbackMessage('Donazione confermata con successo');
            this.closeModal(); // Chiude il modale dopo la conferma
            this.router.navigate(['/confirm-request', { type: 'donazione' }]);
          },
          error => {
            console.error('Errore durante la conferma della donazione:', error);
            this.showFeedbackMessage('Errore durante la conferma della donazione');
          }
        );
      }
    }
  }
  
  
  
  rejectRequest(): void {
    // Metodo per rifiutare la richiesta (implementazione omessa per brevità)
  }

  goBack(): void {
    this.location.back(); // Questo metodo naviga alla pagina precedente nella cronologia del browser
  }


}
