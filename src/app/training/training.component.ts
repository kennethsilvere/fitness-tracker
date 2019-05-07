import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  trainingStarted = false;

  exerciseChangedSubscription = new Subscription();

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseChangedSubscription = this.trainingService.exerciseChanged.subscribe(ex => {
      if (ex == null || ex === undefined) {
        this.trainingStarted = false;
      } else {
        this.trainingStarted = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.exerciseChangedSubscription) {
      this.exerciseChangedSubscription.unsubscribe();
    }
  }

}
