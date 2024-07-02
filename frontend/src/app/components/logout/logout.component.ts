import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(private dialogRef: MatDialogRef<LogoutComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Chiudi la modale e restituisci true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Chiudi la modale e restituisci false
  }
}
