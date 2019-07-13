export function matrix3Merge(out, mat) {
  out[0] = mat[0] || out[0];
  out[1] = mat[1] || out[1];
  out[2] = mat[2] || out[2];
  out[3] = mat[3] || out[3];
  out[4] = mat[4] || out[4];
  out[5] = mat[5] || out[5];
  out[6] = mat[6] || out[6];
  out[7] = mat[7] || out[7];
  out[8] = mat[8] || out[8];
  return out;
}

export function matrix3Fill(out, value) {
  out[0] = value;
  out[1] = value;
  out[2] = value;
  out[3] = value;
  out[4] = value;
  out[5] = value;
  out[6] = value;
  out[7] = value;
  out[8] = value;
  return out;
}
