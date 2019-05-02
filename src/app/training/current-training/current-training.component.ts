import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;

  seconds = 0;

  progressInterval;

  @Output() finishTraining = new EventEmitter<void>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    this.progressInterval = setInterval(() => {
      this.progress += 10;
      this.seconds += 1;
      if (this.progress === 100) {
        clearInterval(this.progressInterval);
        this.finishTraining.emit();
      }
    }, 1000);
  }

  stopTraining() {
    clearInterval(this.progressInterval);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.finishTraining.emit();
      } else {
        this.startOrResumeTraining();
      }
    });
  }
}
