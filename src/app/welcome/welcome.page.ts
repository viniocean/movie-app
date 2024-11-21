import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage {

  constructor(private router: Router) {}

  enterAsGuest() {
    // Ação para entrar como convidado
    console.log('Entrando como convidado');
    // Redireciona para a página inicial (Home)
    this.router.navigate(['/home']);
  }
}
