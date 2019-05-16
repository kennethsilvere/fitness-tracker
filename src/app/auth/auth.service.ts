import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import { SetAuthenticated, SetUnauthenticated } from './auth.actions';

@Injectable()
export class AuthService {

  constructor(private router: Router,
              private fireAuth: AngularFireAuth,
              private trainingService: TrainingService,
              private snackbar: MatSnackBar,
              private store: Store<fromRoot.State>) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe(user => {
      if (user !== null) {
        this.store.dispatch(new SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelFbSubscriptions();
        this.store.dispatch(new SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        console.log(res);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.snackbar.open(error.message, null, {
          duration: 4000
        });
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(res => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        this.store.dispatch(new UI.StopLoading());
        this.snackbar.open(error.message, null, {
          duration: 4000
        });
      });
  }

  logout() {
    this.fireAuth.auth.signOut();
  }
}
