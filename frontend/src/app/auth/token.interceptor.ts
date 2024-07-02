import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // per verificare se l'utente c'è e quindi se c'è il token
import { switchMap, take } from 'rxjs/operators';  // l'operatore take emette il primo valore count che sta tra () e quindi gli diremo take 1 in modo che per ogni client che entra va a leggere il signolo local storage
                                                    // switchmap emette il valore dalla partenza all'arrivo pendendo sempre l'utlimo valore


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authSrv: AuthService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {      // quando entriamo nell'obesrvable con il metodo intercept
        return this.authSrv.user$.pipe(    // prendiamo l'observ che sta nell'authser (che dopo il login ha ricevuto un valore dal padre (behasubj, che si aggiorna in continuazione))
            take(1),                        //  lo incanaliamo nel flusso take 1
            switchMap(user => {
                console.log(user)
                if (user) {     // se user esiste (e non è uguale a null)
                    const newReq = request.clone({
                        headers: request.headers.append('Authorization', `Bearer ${user.accessToken}`)
                    });
                    console.log(newReq);
                    return next.handle(newReq);
                } else {
                    return next.handle(request);  // se l'user non esiste parte la chiamata vecchia, senza token, e verrà fermata.   in un'api vera se l'utente ha fatto login gli diamo la kay e lui può lavorare l'api altrimenti la richiesta sarà bad request non hai il token
                }
            })  //per usare il token, in app module lo importiamo e lo aggiungiamo come provider (sempre allo stesso modo)
        );
    }
}