import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SpalshComponent } from './components/spalsh/spalsh.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestComponent } from './components/request/request.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { DetailsComponent } from './components/details/details.component';
import { GoogleMap, GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { SettingsComponent } from './components/settings/settings.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ConfirmProductComponent } from './components/confirm-product/confirm-product.component';
import { ChatComponent } from './components/chat/chat.component';
import { MapComponent } from './components/map/map.component'; 
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ConfirmRequestComponent } from './components/confirm-request/confirm-request.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactConfirmModalComponent } from './components/contact-confirm-modal/contact-confirm-modal.component';
import { LightboxModule } from 'ngx-lightbox';
import { AuthGuard } from './auth/auth.guard';
import { MatListModule } from '@angular/material/list'; // Importa il modulo MatListModule











const routes: Route[] = [
  /* { path: '', component: SpalshComponent }, */
  { path: '', redirectTo: '/splash', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'splash', component: SpalshComponent, },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  { path: 'addProduct', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'favorite', component: FavoriteComponent, canActivate: [AuthGuard] },
  { path: 'request', component: RequestComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuard] },
  { path: 'profile_details', component: ProfileDetailsComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'confirmProduct', component: ConfirmProductComponent, canActivate: [AuthGuard] },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'confirm-product/:id', component: ConfirmProductComponent, canActivate: [AuthGuard] },


  
 
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        UserComponent,
        LoginComponent,
        RegisterComponent,
        OnboardingComponent,
        NavbarComponent,
        FooterComponent,
        SpalshComponent,
        AddProductComponent,
        FavoriteComponent,
        ProfileComponent,
        RequestComponent,
        DetailsComponent,
        SettingsComponent,
        ProfileDetailsComponent,
        NotificationsComponent,
        LogoutComponent,
        ConfirmProductComponent,
        ChatComponent,
        MapComponent,
        ConfirmRequestComponent,
        ContactConfirmModalComponent,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,

        },
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        FlexLayoutModule,
        AppRoutingModule,
        RouterModule.forRoot(routes),
        HttpClientJsonpModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatToolbarModule,
        MatSelectModule,
        MatBadgeModule,
        MatMenuModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatIconModule,
        MatDialogModule,
        GoogleMapsModule,
        MatGridListModule,
        MatExpansionModule,
        MatTabsModule,
        LightboxModule,
        MatListModule

    ]
})
export class AppModule {}
