// @flow strict

export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints;
}
