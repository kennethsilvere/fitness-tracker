import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthService {

  private isAuthenticated = false;

  authChange = new Subject<boolean>();

  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackbar: MatSnackBar,
              private store: Store<fromRoot.State>) {}

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
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.snackbar.open(error.message, null, {
          duration: 4000
        });
      });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.snackbar.open(error.message, null, {
          duration: 4000
        });
      });
  }

  logout() {
    this.fireAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }


}
