// @flow strict

import Spriteset from '@core/structure/Spriteset';
import UserInterface from '@core/gui/UserInterface';
import Text from '@core/gui/Text';
import Timer from '@core/gui/Timer';

class Header extends UserInterface {
  score: Text;
  scoreValue: number;
  scoreLimit: number;
  time: Text;
  timer: Timer;

  constructor(rootSelector: string) {
    super(document.querySelector(rootSelector));
    this.score = new Text('score');
    this.scoreValue = 0;
    this.scoreLimit = 0;
    this.time = new Text('time');
    this.timer = new Timer();
  }

  render(spriteset?: Spriteset) {
    this.scoreLimit = this.getScoreLimit(spriteset);
    this.setup(this.time.node, this.score.node);
    this.updateTimer(0);
    this.clearScore();
  }

  incrementScore() {
    this.scoreValue += 1;
    this.updateScore();
  }

  clearScore() {
    this.scoreValue = 0;
    this.updateScore();
  }

  isCompletedScore() {
    return this.scoreValue >= this.scoreLimit;
  }

  updateScore() {
    this.score.value = `score ${this.scoreValue}-${this.scoreLimit}`;
  }

  updateTimer(deltaTime: number) {
    this.timer.update(deltaTime);
    this.time.value = `time ${this.timer.toTime()}`;
  }

  getScoreLimit(spriteset?: Spriteset) {
    const {gems} = spriteset?.layers || {};

    if (gems.type !== 'spriteLayer') {
      return 0;
    }
    return gems.sprites.length;
  }
}

export default Header;
