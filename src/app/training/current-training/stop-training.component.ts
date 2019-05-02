import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-stop-training',
  template: `<h1 mat-dialog-title>Are you sure you want to stop training?</h1>
             <mat-dialog-content>
              You already got {{ passedData.progress }}%
             </mat-dialog-content>
             <mat-dialog-actions>
                <button
                  mat-raised-button
                  [mat-dialog-close]="true">Yes</button>
              <button
                  mat-raised-button
                  [mat-dialog-close]="false">No</button>
             </mat-dialog-actions> `

})
export class StopTrainingComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public passedData) {}
}
