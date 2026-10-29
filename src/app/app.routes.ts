import { Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'events',
    loadComponent: () => import('./pages/events/events.page').then( m => m.EventsPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin } // sacado de la documentación de AngularFire, para redirigir a login si no está autenticado
  },
  {
    path: 'create-event',
    loadComponent: () => import('./pages/create-event/create-event.page').then( m => m.CreateEventPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin } // sacado de la documentación de AngularFire, para redirigir a login si no está autenticado
  },
  {
    path: 'update-event',
    loadComponent: () => import('./pages/update-event/update-event.page').then( m => m.UpdateEventPage),
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectToLogin } // sacado de la documentación de AngularFire, para redirigir a login si no está autenticado
  },
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
];
