import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {
  public loadingStateChanged = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(error, action, duration) {
    this.snackbar.open(error, action, {
      duration
    });
  }
}
