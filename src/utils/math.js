// @flow strict

export function sign(value: number) {
  return value / Math.abs(value) || 0;
}

// bias 0-1
export function lerp(
  from: number,
  to: number,
  bias: number,
  error: number = 0.01
) {
  const value = (1 - bias) * from + bias * to;
  const match = bias < 0.5 ? from : to;
  return Math.abs(value - match) < error ? match : value;
}

export function modIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function randomInt(min: number = 0, max: number = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloat(min: number = 0, max: number = 1) {
  return Math.random() * (max - min) + min;
}
