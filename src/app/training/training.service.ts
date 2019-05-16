import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import * as UI from '../shared/ui.actions';

@Injectable()
export class TrainingService {

  private fbSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromTraining.State>) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubscriptions.push(this.db.collection('availableExercises').snapshotChanges().pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data()
        };
      });
    }))
    .subscribe((res: any) => {
        this.store.dispatch(new Training.SetAvailableExercises([...res]));
        this.store.dispatch(new UI.StopLoading());
      },
      () => {
        this.uiService.showSnackBar('Could not fetch exercises, please try again later', null, 4000);
        this.store.dispatch(new Training.SetAvailableExercises(null));
        this.store.dispatch(new UI.StopLoading());
      })
    );
  }

  setCurrentExercise(selectedExerciseId: string) {
    this.store.dispatch(new Training.SetActiveTraining(selectedExerciseId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex ,
          date: new Date(),
          state: 'completed'
         });
        this.store.dispatch(new Training.StopActiveTraining());
      }
    );
  }

  cancelExercise(progress) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(
      ex => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'cancelled'
        });
        this.store.dispatch(new Training.StopActiveTraining());
      }
    );
  }

  fetchFinishedExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe(
      (data: Exercise[]) => {
        this.store.dispatch(new Training.SetFinishedExercises(data));
      }
    ));
  }

  addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelFbSubscriptions() {
    this.fbSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
