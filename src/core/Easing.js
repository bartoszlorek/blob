// @flow strict

class Easing {
  duration: number;
  current: number;

  constructor(duration: number) {
    this.duration = duration / 1000;
    this.current = 0;
  }

  getValue(deltaTime: number) {
    const value = this.current / this.duration;

    if (value >= 1) {
      this.current = 0;
      return 1;
    }
    this.current += deltaTime;
    return value;
  }

  linear(deltaTime: number) {
    return linear(this.getValue(deltaTime));
  }

  easeInQuad(deltaTime: number) {
    return easeInQuad(this.getValue(deltaTime));
  }

  easeOutQuad(deltaTime: number) {
    return easeOutQuad(this.getValue(deltaTime));
  }

  easeInOutQuad(deltaTime: number) {
    return easeInOutQuad(this.getValue(deltaTime));
  }

  easeInCubic(deltaTime: number) {
    return easeInCubic(this.getValue(deltaTime));
  }

  easeOutCubic(deltaTime: number) {
    return easeOutCubic(this.getValue(deltaTime));
  }

  easeInOutCubic(deltaTime: number) {
    return easeInOutCubic(this.getValue(deltaTime));
  }

  easeInQuart(deltaTime: number) {
    return easeInQuart(this.getValue(deltaTime));
  }

  easeOutQuart(deltaTime: number) {
    return easeOutQuart(this.getValue(deltaTime));
  }

  easeInOutQuart(deltaTime: number) {
    return easeInOutQuart(this.getValue(deltaTime));
  }

  easeInQuint(deltaTime: number) {
    return easeInQuint(this.getValue(deltaTime));
  }

  easeOutQuint(deltaTime: number) {
    return easeOutQuint(this.getValue(deltaTime));
  }

  easeInOutQuint(deltaTime: number) {
    return easeInOutQuint(this.getValue(deltaTime));
  }

  easeInElastic(deltaTime: number) {
    return easeInElastic(this.getValue(deltaTime));
  }

  easeOutElastic(deltaTime: number) {
    return easeOutElastic(this.getValue(deltaTime));
  }

  easeInOutElastic(deltaTime: number) {
    return easeInOutElastic(this.getValue(deltaTime));
  }
}

// https://gist.github.com/gre/1650294
// no easing, no acceleration
export function linear(t: number) {
  return t;
}

// accelerating from zero velocity
export function easeInQuad(t: number) {
  return t * t;
}

// decelerating to zero velocity
export function easeOutQuad(t: number) {
  return t * (2 - t);
}

// acceleration until halfway, then deceleration
export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// accelerating from zero velocity
export function easeInCubic(t: number) {
  return t * t * t;
}

// decelerating to zero velocity
export function easeOutCubic(t: number) {
  // $FlowFixMe
  return --t * t * t + 1;
}

// acceleration until halfway, then deceleration
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// accelerating from zero velocity
export function easeInQuart(t: number) {
  return t * t * t * t;
}

// decelerating to zero velocity
export function easeOutQuart(t: number) {
  // $FlowFixMe
  return 1 - --t * t * t * t;
}

// acceleration until halfway, then deceleration
export function easeInOutQuart(t: number) {
  // $FlowFixMe
  t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}

// accelerating from zero velocity
export function easeInQuint(t: number) {
  return t * t * t * t * t;
}

// decelerating to zero velocity
export function easeOutQuint(t: number) {
  // $FlowFixMe
  return 1 + --t * t * t * t * t;
}

// acceleration until halfway, then deceleration
export function easeInOutQuint(t: number) {
  // $FlowFixMe
  return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

// elastic bounce effect at the beginning
export function easeInElastic(t: number) {
  return (0.04 - 0.04 / t) * Math.sin(25 * t) + 1;
}

// elastic bounce effect at the end
export function easeOutElastic(t: number) {
  // $FlowFixMe
  return ((0.04 * t) / --t) * Math.sin(25 * t);
}

// elastic bounce effect at the beginning and end
export function easeInOutElastic(t: number) {
  // $FlowFixMe
  return (t -= 0.5) < 0
    ? (0.02 + 0.01 / t) * Math.sin(50 * t)
    : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1;
}

export default Easing;
