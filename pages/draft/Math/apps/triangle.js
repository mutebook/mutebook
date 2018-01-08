// circular -> harmonic motion

function triangle (divId) {
  const qm = mc.qm.$(divId, 3), [fg, bg] = mc.qm.fb(qm);

  // size without margins
  let [sx, sy] = mc.qm.sz(qm), pad = Math.min(sx, sy) / 12;
  sx -= 2*pad; sy -= 2*pad;

  // the smaller one
  let sm = Math.min(sx, sy), sm2 = sm/2;

  // vertices
  let B = [pad, pad], C = [pad, pad + sm], A = [pad + 2*sm, pad + sm];

  // sides
  $ = (p1, p2, col, w) => mc.line.$(fg, p1, p2);
  let a = $(B, C, 'black', 2);
  let b = $(A, C, 'black', 2);
  let c = $(A, B, 'black', 2);
}

// eof
