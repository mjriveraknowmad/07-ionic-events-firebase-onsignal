import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), // fireStore permite paginar, fireDatabase sería realtime tipo mongo, pero no deja paginar.
  ],
});

// Creamos el proyecto en firebase y vamos a la configuración general (https://console.firebase.google.com/project/ionic-events-f0aa8/settings/general)
// Le damos al icono de app web y ponemos nombre ionic-events-web y registramos
// copiamos la configuración (contenido del objeto de firebaseConfig) de Firebase y la pegamos en environment.ts
