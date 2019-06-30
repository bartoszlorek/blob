// bias 0-1
export function lerp(from, to, bias, error = 0.01) {
  const value = (1 - bias) * from + bias * to;
  const match = bias < 0.5 ? from : to;
  return Math.abs(value - match) < error ? match : value;
}

export function sign(value) {
  return value / Math.abs(value) || 0;
}

export function modIndex(index, length) {
  return ((index % length) + length) % length;
}
