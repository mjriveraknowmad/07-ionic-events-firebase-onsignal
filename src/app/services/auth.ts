import { inject, Injectable, signal } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private fbApp = inject(FirebaseApp);
  private auth: Auth = getAuth(this.fbApp);
  public isAuthenticated = signal(this.isLogged());

  checkIsLogged() {
    // onAuthStateChanged salta cada vez que cambia el estado de autenticación, indicando si el usuario está logueado o no
    onAuthStateChanged(this.auth, (user) => {
      console.log('onAuthStateChanged:', user);
      this.isAuthenticated.set(!!user);
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isLogged() {
    return this.auth.currentUser != null;
  }
}
