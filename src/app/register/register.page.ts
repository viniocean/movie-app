import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa o Firebase Auth
import firebase from 'firebase/compat/app'; // Certifique-se de importar firebase corretamente

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

  constructor(private router: Router, private alertCtrl: AlertController, private afAuth: AngularFireAuth) {}

  // Validação e cadastro de usuário com email e senha
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
      this.validationErrors.email = 'Por favor insira um email válido.';
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

  clearValidationErrors() {
    this.validationErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  hasValidationErrors() {
    return Object.values(this.validationErrors).some(error => error !== '');
  }

  // Cadastro com email e senha
  async register() {
    try {
      const { email, password } = this.registerData;
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Cadastro bem sucedido:', userCredential);

      // Após o cadastro, você pode atualizar o perfil do usuário com o nome completo
      await userCredential.user?.updateProfile({
        displayName: this.registerData.fullName,
        photoURL: ''
      });

      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Cadastro realizado com sucesso!',
        buttons: ['OK']
      });
      await alert.present();

      // Redireciona para a página de login
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: 'Erro ao realizar o cadastro. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Cadastro com Google
  async registerWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      console.log('Usuário cadastrado com o Google:', userCredential);

      // Atualize o perfil do usuário com o nome completo e foto
      await userCredential.user?.updateProfile({
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL
      });

      // Redireciona para a página principal após o cadastro bem-sucedido
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Erro ao cadastrar com o Google:', error);
    }
  }
}
