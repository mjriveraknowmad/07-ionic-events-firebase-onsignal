import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { AuthService } from './services/auth';
import { Notifications } from './notifications';
import config from 'capacitor.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private platform: Platform = inject(Platform);
  private notificationsService: Notifications =
    inject(Notifications);

  ngOnInit(): void {
    // Comprobamos si estamos logueados
    this.authService.checkIsLogged();

    this.platform.ready().then(() => {
      // Inicializamos las notificaciones
      this.notificationsService.init();
      // Habilitamos CapacitorHttp para que no interfiera con la conexion con firebase
      config.plugins!.CapacitorHttp!.enabled = true;
    });
  }
}
