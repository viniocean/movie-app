import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginData = { email: '', password: '' };

  constructor(public router: Router) {}

  login() {
    console.log('Login data', this.loginData);
    // Aqui você pode adicionar a lógica de autenticação com backend
    // Temporário: redirecionar após o login
    this.router.navigate(['/home']);
  }
}
