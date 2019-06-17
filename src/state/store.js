import {createStore, combineReducers} from 'redux';
import {scoreReducer, livesReducer} from '@state/reducers';

export default createStore(
  combineReducers({
    score: scoreReducer,
    lives: livesReducer
  })
);
