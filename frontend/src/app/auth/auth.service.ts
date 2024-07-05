import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../interface/register.interface';
import { environment } from 'src/environments/environment.development';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // tap non fa nulla all'oggetto che lo riceve. lo restituisce e basta
import { Router } from '@angular/router';
import { AuthData } from '../interface/auth-data.interface';
import { JwtHelperService } from '@auth0/angular-jwt'; // Importa JwtHelperService da '@auth0/angular-jwt'
import { Login } from '../interface/login.interface';

@Injectable({
  providedIn: 'root',
})



export class AuthService {


  private apiURL = 'http://localhost:8080/auth'; //process.env.API_URL
    private token: string | null = null;
    private authSub = new BehaviorSubject<AuthData | null>(this.getStoredUser());
    user$ = this.authSub.asObservable();
    private jwtHelper: JwtHelperService; // Dichiara la proprietà jwtHelper di tipo JwtHelperService
    private timeOut: any; // Dichiarazione della proprietà timeOut

    constructor(private http: HttpClient) {
        const storedUser = this.getStoredUser();
        if (storedUser) {
          this.token = storedUser.accessToken; // Imposta il token memorizzato quando l'istanza del servizio è creata
          this.authSub.next(storedUser);
        }
        this.jwtHelper = new JwtHelperService();  // Inizializza jwtHelper
    }

    private getStoredUser(): AuthData | null {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
  }
  


  login(user: Login, selectedCity: string): Observable<string> {
    debugger
  return this.http.post(`${this.apiURL}/login`, user, { responseType: 'text' }).pipe(
    tap((token: string) => {
      // Effettua il parsing del token JWT per recuperare l'ID utente (se necessario)
      const decodedToken = this.jwtHelper.decodeToken(token);
      const userId = decodedToken?.sub; // Supponendo che l'ID utente sia incluso come 'sub' nel token
      this.autoLogout
      const authData: AuthData = {
        accessToken: token,
        user: {
          id: userId,
          email: user.email
        },
        city: selectedCity // Includi la città selezionata
      };

      this.token = token;
      console.log('Token received:', token);
      this.authSub.next(authData);

      localStorage.setItem('user', JSON.stringify(authData));
    }),

    catchError(error => {
      console.error('Login error:', error);
      return throwError(error);
    })
  );
  
}

// Metodo per ottenere i dati dell'utente, inclusi i preferiti, dal backend
getUserData(userId: number): Observable<any> {
  return this.http.get<any>(`${this.apiURL}/users/${userId}`);
}

  
    getToken(): string | null {
      return this.token; // Restituisci il token memorizzato
    }

    signUp(user: Register): Observable<string> {
      return this.http
        .post<string>(`${this.apiURL}/register`, user) //  metodo che scriverà l'utente dentro il json. parte 1 del flusso di registrazione. register è l'endpoint (json documentation vuole così)
        .pipe(catchError(this.errors)); //durante la fase di registrazione verifichiamo se ci sono errori
    }



   logout() {
        this.token = null;
        this.authSub.next(null);
        localStorage.removeItem('user');
    }


      restore() {       // fa sì che se nel local storage c
        const userJson = localStorage.getItem('user');
        if (!userJson) {      // non c'è l'utente, fa partire dall'inizio
          return;
        }
        const user: AuthData = JSON.parse(userJson);      //se è presente riapre il login
        this.authSub.next(user);
        this.autoLogout(user);  // questo metodo restore lo devo chiamare in tutti i componenti ng oninit di tutti i componenti che possono essere visuallizzati quando c'è login
      }

        autoLogout(user: AuthData) {
        // const dateExpiration = this.jwtHelper.getTokenExpirationDate(
        //   user.accessToken
        // ) as Date;
        // const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
        // this.timeOut = setTimeout(() => {
        //   this.logout();
        // }, millisecondsExp); //  devo chiamare in login e in restore
      }

        // Metodo per recuperare l'ID dell'utente loggato
        getUserId(): number | null {
          const storedUser = this.getStoredUser();
          return storedUser ? +storedUser.user.id : null;
        }



  private errors(err: any) {
    switch (err.error) {
      case 'Email already exists':
        return throwError('utente già presente');
        break;

      case 'Incorrect password':
        return throwError('password errata');
        break;

      case 'Cannot find user':
        return throwError('Utente non trovato');
        break;

      default:
        return throwError('Errore nella chiamata');
        break;
    }
  }
}
