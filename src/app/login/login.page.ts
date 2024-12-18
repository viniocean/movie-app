import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = { email: '', password: '' };
  errorMessage: string | null = null; 

  constructor(private router: Router, private afAuth: AngularFireAuth) { }


  async login() {
    try {
      const { email, password } = this.loginData;
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Usuário logado com sucesso:', userCredential);

      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);

      if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'E-mail inválido. Verifique o formato.';
      } else if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'E-mail não encontrado. Verifique se você se registrou.';
      } else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Senha incorreta. Tente novamente.';
      } else {
        this.errorMessage = 'Erro ao fazer login. Tente novamente.';
      }
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      console.log('Usuário logado com o Google:', userCredential);

      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao logar com o Google:', error);
      this.errorMessage = 'Erro ao logar com o Google. Tente novamente.';
    }
  }
}
