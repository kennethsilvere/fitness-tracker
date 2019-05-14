import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  @Output() startTraining = new EventEmitter<void>();

  exercises: Exercise[] = null;

  isLoading$: Observable<boolean>;

  availableExercisesChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService,
              private store: Store<fromRoot.State>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.availableExercisesChangedSubscription = this.trainingService.availableExercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
      });
    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(selectedExercise) {
    this.trainingService.setCurrentExercise(selectedExercise);
  }

  ngOnDestroy() {
    if (this.availableExercisesChangedSubscription) {
      this.availableExercisesChangedSubscription.unsubscribe();
    }
  }
}
