import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ShopComponent } from './shop/shop.component';
import { PagesComponent } from './pages/pages.component';
import { ElementsComponent } from './elements/elements.component';

// 1. Import the libs you need
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';

import 'hammerjs';
import 'mousetrap';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    PagesComponent,
    ElementsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: false,
      enableHtml: true,
    }),
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    // 3. Initialize
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    SharedModule,
    AppRoutingModule,
    // Specify the ngx-auth-firebaseui library as an import
    NgxAuthFirebaseUIModule.forRoot({
      apiKey: 'AIzaSyBHwNPjrvdVfZ64CzmGKAld0DJ2ZG0AU14',
      authDomain: 'drippy-shop-7d116.firebaseapp.com',
      databaseURL: 'https://drippy-shop-7d116.firebaseio.com',
      projectId: 'drippy-shop-7d116',
      storageBucket: 'drippy-shop-7d116.appspot.com',
      messagingSenderId: '595285150564',
      appId: '1:595285150564:web:ba49fd4412b22d39864871',
      measurementId: 'G-8H083ZZ37C'
    },
        () => 'Drippy shop',
    {
      enableFirestoreSync: true, // enable/disable autosync users with firestore
      // authGuardFallbackURL: '/loggedout', // url for unauthenticated users - to use in combination with canActivate feature on a route
      // authGuardLoggedInURL: '/loggedin', // url for authenticated users - to use in combination with canActivate feature on a route
      passwordMaxLength: 60, // `min/max` input parameters in components should be within this range.
      passwordMinLength: 8, // Password length min/max in forms independently of each componenet min/max.
      // Same as password but for the name
      nameMaxLength: 50,
      nameMinLength: 2,
      // If set, sign-in/up form is not available until email has been verified.
      // Plus protected routes are still protected even though user is connected.
      guardProtectedRoutesUntilEmailIsVerified: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
