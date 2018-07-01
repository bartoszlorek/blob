import {
    GAIN_SCORE,
    LOSE_SCORE,
    RESET_SCORE,
    GAIN_LIFE,
    LOSE_LIFE,
    RESET_LIVES
} from './actions'

const INITIAL_SCORE = 0
const INITIAL_LIVES = 3

const DEFAULT_SCORE_VALUE = 100

export const scoreReducer = (state = INITIAL_SCORE, action) => {
    switch (action.type) {
        case GAIN_SCORE:
            return state + action.value || DEFAULT_SCORE_VALUE
        case LOSE_SCORE:
            return state - action.value || DEFAULT_SCORE_VALUE
        case RESET_SCORE:
            return INITIAL_SCORE
        default:
            return state
    }
}

export const livesReducer = (state = INITIAL_LIVES, action) => {
    switch (action.type) {
        case GAIN_LIFE:
            return state + 1
        case LOSE_LIFE:
            return state - 1
        case RESET_LIVES:
            return INITIAL_LIVES
        default:
            return state
    }
}
