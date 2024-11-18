import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Importar AngularFire e Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Coloque sua configuração do Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyDUzXowvvWCh9zlJ5iayUknvIDPuMN2I7Y",
  authDomain: "movie-fcfa9.firebaseapp.com",
  projectId: "movie-fcfa9",
  storageBucket: "movie-fcfa9.firebasestorage.app",
  messagingSenderId: "892298164182",
  appId: "1:892298164182:web:1aac7eef31a893b8d39677",
  measurementId: "G-TMT3GQFKDT"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),  // Inicialize o Firebase
    AngularFireAuthModule, // Adicione o módulo de autenticação
    AngularFirestoreModule, // Adicione o módulo do Firestore
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
