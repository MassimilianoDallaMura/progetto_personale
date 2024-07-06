import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/auth.service';
import { RequestService } from 'src/app/service/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  userRequests: any[] = [];
  ownerRequests: any[] = []; 
  markAsAdoptedrequest: any;
  showUserRequests = false;
  selectedTabIndex = 0; 
  private touchStartX = 0;
  private touchCurrentX = 0;
  private isDragging = false;

  constructor(private requestService: RequestService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.getUserRequests(userId.toString());
      this.getOwnerRequests(userId.toString()); 
    } else {
      console.error('User ID is null.');
    }
  }

  getUserRequests(userId: string) {
    this.requestService.getProductRequestsByUserId(userId).subscribe(
      requests => {
        console.log('Richieste utente:', requests);
        this.userRequests = requests;
      },
      error => {
        console.error('Errore recupero richieste utente:', error);
        alert('Si è verificato un errore durante il recupero delle richieste utente.');
      }
    );
  }

  getOwnerRequests(ownerId: string) {
    this.requestService.getProductRequestsByOwnerId(ownerId).subscribe(
      requests => {
        console.log('Richieste owner:', requests);
        this.ownerRequests = requests;
      },
      error => {
        console.error('Errore recupero richieste owner:', error);
        alert('Si è verificato un errore durante il recupero delle richieste owner.');
      }
    );
  }

  getTimeElapsed(createdDate: string): string {
    const now = moment();
    const created = moment(createdDate);
    const duration = moment.duration(now.diff(created));

    const hours = duration.asHours();
    if (hours < 24) {
      return `${Math.floor(hours)} ore fa`;
    } else {
      const days = duration.asDays();
      return `${Math.floor(days)} giorni fa`;
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-request pending';
      case 'approved':
        return 'status-request approved';
      case 'rejected':
        return 'status-request rejected';
      default:
        return 'status-request';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'IN ATTESA';
      case 'approved':
        return 'ACCETTATA';
      case 'rejected':
        return 'RIFIUTATA';
      default:
        console.warn(`Stato sconosciuto: ${status}`);
        return 'Stato sconosciuto';
    }
  }

  viewChat(requestId: number, status: string): void {
    if (status.toLowerCase() === 'rejected') {
      console.log('Impossibile aprire la chat per richieste con stato "rejected".');
      return;
    }

    const userId = this.authService.getUserId();
    this.router.navigate(['/chat', requestId], { state: { user: userId } }).then(
      () => console.log('Navigation successful'),
      error => console.error('Navigation error:', error)
    );
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isDragging = false;
  }

  onTouchMove(event: TouchEvent) {
    this.touchCurrentX = event.touches[0].clientX;
    const touchDeltaX = this.touchCurrentX - this.touchStartX;
    this.isDragging = Math.abs(touchDeltaX) > 10;
  }

  onTouchEnd(event: TouchEvent, request: any) {
    if (!this.isDragging) {
      this.viewChat(request.id, request.statusRequest);
    }
  }
}
