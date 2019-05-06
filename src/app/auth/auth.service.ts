import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {

  private isAuthenticated = false;

  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private trainingService: TrainingService) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe(user => {
      if (user !== null) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelFbSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.fireAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  }

  login(authData: AuthData) {
    this.fireAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  }

  logout() {
    this.fireAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }


}
