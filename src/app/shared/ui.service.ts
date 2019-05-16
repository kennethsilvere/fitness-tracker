import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService {

  constructor(private snackbar: MatSnackBar) {}

  showSnackBar(error, action, duration) {
    this.snackbar.open(error, action, {
      duration
    });
  }
}
