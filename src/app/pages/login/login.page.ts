import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth';
import { Toast } from 'src/app/services/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonButton,
    RouterLink,
  ],
})
export class LoginPage {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(Toast);
  private router = inject(Router);

  public formLogin: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  login() {
    const user: User = this.formLogin.value;
    this.authService.login(user.email, user.password).then((res) => {
      console.log('Login successful', res);
      this.toast.showToast('Logueado con éxito');
      this.router.navigateByUrl('create-event');
    }).catch((err) => {
      this.toast.showToast('El usuario o la contraseña son incorrectos');
    });
  }
}
