export function lerp(from, to, bias) {
  return (1 - bias) * from + bias * to;
}

export function sign(value) {
  return value / Math.abs(value) || 0;
}
