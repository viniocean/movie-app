import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  validationErrors = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private alertCtrl: AlertController) {}

  // Função para validar e registrar
  validateAndRegister() {
    this.clearValidationErrors();

    // Validação do Nome Completo (não pode ter números)
    const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/;
    if (!nameRegex.test(this.registerData.fullName)) {
      this.validationErrors.fullName = 'O nome completo deve conter apenas letras.';
    }

    // Validação do Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.validationErrors.email = 'Por favor insira um email válido.';
    }

    // Validação da Senha
    if (this.registerData.password.length < 6) {
      this.validationErrors.password = 'A senha tem que ter pelo menos 6 caracteres.';
    }

    // Validação da Confirmação de Senha
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.validationErrors.confirmPassword = 'As senhas devem ser iguais.';
    }

    // Se houver algum erro, interrompe o processo
    if (this.hasValidationErrors()) {
      return;
    }

    // Se tudo estiver correto, prossiga com o registro
    this.register();
  }

  // Limpa os erros de validação
  clearValidationErrors() {
    this.validationErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  // Verifica se há erros de validação
  hasValidationErrors() {
    return Object.values(this.validationErrors).some(error => error !== '');
  }

  // Lógica para registrar o usuário
  async register() {
    console.log('Cadastro bem sucedido.', this.registerData);
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Cadastro bem sucedido.!',
      buttons: ['OK']
    });
    await alert.present();

    // Redirecionar para a página de login após o registro
    this.router.navigate(['/login']);
  }
}
