import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-confirm-modal',
  templateUrl: './contact-confirm-modal.component.html',
  styleUrls: ['./contact-confirm-modal.component.scss']
})
export class ContactConfirmModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}

}
