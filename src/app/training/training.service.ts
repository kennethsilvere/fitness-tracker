import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();

  availableExercisesChanged = new Subject();

  finishedExercisesChanged = new Subject<Exercise[]>();

  private currentExercise: Exercise = null;

  private availableExercises: Exercise[];

  private fbSubscriptions: Subscription[] = [];

  constructor(private db: AngularFirestore,
              private uiService: UIService,
              private store: Store<fromRoot.State>) {}

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
        this.availableExercises = res;
        this.availableExercisesChanged.next([...res]);
        this.store.dispatch(new UI.StopLoading());
      },
      () => {
        this.uiService.showSnackBar('Could not fetch exercises, please try again later', null, 4000);
        this.availableExercisesChanged.next(null);
        this.store.dispatch(new UI.StopLoading());
      })
    );
  }

  getExercises() {
    return this.availableExercises.slice();
  }

  setCurrentExercise(selectedExerciseId) {
    this.currentExercise = this.availableExercises.find(ex => {
      return ex.id === selectedExerciseId;
    });
    this.exerciseChanged.next(this.currentExercise);
  }

  getRunningExercise() {
    return { ...this.currentExercise };
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.currentExercise ,
      date: new Date(),
      state: 'completed'
     });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress) {
    this.addDataToDatabase({
      ...this.currentExercise,
      duration: this.currentExercise.duration * (progress / 100),
      calories: this.currentExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchFinishedExercises() {
    this.fbSubscriptions.push(this.db.collection('finishedExercises').valueChanges().subscribe(
      (data: Exercise[]) => {
        this.finishedExercisesChanged.next(data);
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
