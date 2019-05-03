import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;

  seconds = 0;

  progressInterval;

  runningExercise = null;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {
    this.runningExercise = this.trainingService.getRunningExercise();
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    if (this.runningExercise === null) {
      this.runningExercise = this.trainingService.getRunningExercise();
    }

    const step = (this.runningExercise.duration / 100) * 1000;

    this.progressInterval = setInterval(() => {
      this.progress += 1;
      this.seconds += 1;
      if (this.progress === 100) {
        clearInterval(this.progressInterval);
        this.trainingService.completeExercise();
      }
    }, step);
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
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTraining();
      }
    });
  }
}
