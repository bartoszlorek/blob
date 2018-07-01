import { createStore, combineReducers } from 'redux'
import { scoreReducer, livesReducer } from './reducers'

export default createStore(
    combineReducers({
        score: scoreReducer,
        lives: livesReducer
    })
)
