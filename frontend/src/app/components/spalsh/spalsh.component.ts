import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/interface/auth-data.interface';

@Component({
  selector: 'app-spalsh',
  templateUrl: './spalsh.component.html',
  styleUrls: ['./spalsh.component.scss']
})
export class SpalshComponent implements OnInit{
  

  user!: AuthData | null;

  constructor(private authSrv: AuthService) {}


  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {       // riceve lo user
        this.user = user;  //sa se c'è l'utente
    });
  }

}

