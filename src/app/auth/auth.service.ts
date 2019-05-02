import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService {

  private user: User;

  authChange = new Subject<boolean>();

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: (Math.round(Math.random() * 1000)).toString()
    };
    this.authSuccess();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: (Math.round(Math.random() * 1000)).toString()
    };
    this.authSuccess();
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  authSuccess() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  isAuth() {
    return this.user != null;
  }


}
