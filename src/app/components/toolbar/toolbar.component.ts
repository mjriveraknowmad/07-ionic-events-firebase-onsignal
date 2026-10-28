import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/services/auth';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonButtons,
    IonButton,
    RouterLink,
  ],
})
export class ToolbarComponent {
  titlePage = input.required<string>();
  private auth = inject(AuthService);
  private router = inject(Router);
  public isAuthenticated = this.auth.isAuthenticated.asReadonly();

  constructor() {
    addIcons({
      logOutOutline,
      logInOutline,
    });
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigateByUrl('login');
    });
  }
}
