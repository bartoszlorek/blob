// bias 0-1
export function lerp(from, to, bias) {
  return (1 - bias) * from + bias * to;
}

export function sign(value) {
  return value / Math.abs(value) || 0;
}

export function modIndex(index, length) {
  return ((index % length) + length) % length;
}
