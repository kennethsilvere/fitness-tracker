import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from '../app.reducer';
import { Exercise } from './exercise.model';
import {
  TrainingActions,
  SET_AVAILABLE_EXERCISES,
  SET_FINISHED_EXERCISES,
  SET_ACTIVE_TRAINING,
  STOP_ACTIVE_TRAINING
 } from './training.actions';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

export interface State extends fromRoot.State {
  training: TrainingState;
}

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_EXERCISES:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_EXERCISES:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case SET_ACTIVE_TRAINING:
      return {
        ...state,
        activeTraining: state.availableExercises.find(ex => ex.id === action.payload)
      };
    case STOP_ACTIVE_TRAINING:
      return {
        ...state,
        activeTraining: null
      };
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);
