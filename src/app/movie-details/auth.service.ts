import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.onAuthStateChanged(user => {
      this.userSubject.next(user);
    });
  }

  // Métodos para login, logout etc.
  async login(email: string, password: string) {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.afAuth.signOut();
  }

  getUser() {
    return this.userSubject.value;
  }
}
