import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
  ],
});

// Creamos el proyecto en firebase y vamos a la configuración general (https://console.firebase.google.com/project/ionic-events-f0aa8/settings/general)
// Le damos al icono de app web y ponemos nombre ionic-events-web y registramos
// copiamos la configuración (contenido del objeto de firebaseConfig) de Firebase y la pegamos en environment.ts
