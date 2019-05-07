import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  @Output() startTraining = new EventEmitter<void>();

  exercises: Exercise[] = null;

  isLoading = true;

  availableExercisesChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.availableExercisesChangedSubscription = this.trainingService.availableExercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.exercises = exercises;
        this.isLoading = false;
      });
    this.fetchAvailableExercises();
  }

  fetchAvailableExercises() {
    this.isLoading = true;
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
