// score
export const GAIN_SCORE = 'GAIN_SCORE';
export const LOSE_SCORE = 'LOSE_SCORE';
export const RESET_SCORE = 'RESET_SCORE';

export const gainScore = value => ({type: GAIN_SCORE, value});
export const loseScore = value => ({type: LOSE_SCORE, value});
export const resetScore = () => ({type: RESET_SCORE, value: 0});

// lives
export const GAIN_LIFE = 'GAIN_LIFE';
export const LOSE_LIFE = 'LOSE_LIFE';
export const RESET_LIVES = 'RESET_LIVES';

export const gainLife = () => ({type: GAIN_LIFE});
export const loseLife = () => ({type: LOSE_LIFE});
export const resetLives = () => ({type: RESET_LIVES});
