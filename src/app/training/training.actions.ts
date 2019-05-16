import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_EXERCISES = '[Training] Set Available Exercises';
export const SET_FINISHED_EXERCISES = '[Training] Set Finished Exercises';
export const SET_ACTIVE_TRAINING = '[Training] Set Active Training';
export const STOP_ACTIVE_TRAINING = '[Training] Stop Active Training';

export class SetAvailableExercises implements Action {
  type = SET_AVAILABLE_EXERCISES;

  constructor(public payload: Exercise[]) {}
}

export class SetFinishedExercises implements Action {
  type = SET_FINISHED_EXERCISES;

  constructor(public payload: Exercise[]) {}
}

export class SetActiveTraining implements Action {
  type = SET_ACTIVE_TRAINING;
  constructor(public payload: string) {}
}

export class StopActiveTraining implements Action {
  type = STOP_ACTIVE_TRAINING;

  constructor(public payload?) {}

}

export type TrainingActions = SetAvailableExercises | SetFinishedExercises | SetActiveTraining | StopActiveTraining;
