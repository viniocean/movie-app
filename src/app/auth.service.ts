import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {}

  // Método para login
  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  // Método para registro de novo usuário
  register(email: string, password: string): Observable<any> {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password));
  }

  // Método para fazer logout
  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  // Método para verificar se o usuário está logado
  get user(): Observable<any> {
    return this.afAuth.authState;
  }
}
