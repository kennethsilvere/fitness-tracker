import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  @Output() startTraining = new EventEmitter<void>();

  exercises: Observable<any>;

  constructor(private trainingService: TrainingService,
              private db: AngularFirestore) { }

  ngOnInit() {
    this.exercises = this.trainingService.availableExercisesChanged;
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(selectedExercise) {
    this.trainingService.setCurrentExercise(selectedExercise);
  }

}
