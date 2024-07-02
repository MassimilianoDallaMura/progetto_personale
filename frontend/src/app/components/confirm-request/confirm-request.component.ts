import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss']
})
export class ConfirmRequestComponent {
  type: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.type = this.route.snapshot.paramMap.get('type');
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
