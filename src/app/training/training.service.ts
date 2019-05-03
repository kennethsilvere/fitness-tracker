import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {

  exerciseChanged = new Subject<Exercise>();

  currentExercise: Exercise = null;

  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];

  private pastExercises = [];

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
    this.pastExercises.push({
      ...this.currentExercise ,
      date: new Date(),
      state: 'Completed'
     });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress) {
    this.pastExercises.push({
      ...this.currentExercise,
      duration: this.currentExercise.duration * (progress / 100),
      calories: this.currentExercise.calories * (progress / 100),
      date: new Date(),
      state: 'Cancelled'
    });
    this.currentExercise = null;
    this.exerciseChanged.next(null);
  }

  getPastExercises() {
    return this.pastExercises.slice();
  }
}
