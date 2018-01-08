// circular -> harmonic motion

function circular (divId) {
  const qm = mc.qm.$(divId, 3), [fg, bg] = mc.qm.fb(qm);

  // config
  const pad = 6;
  const col_s = 'green';  // color sine
  const col_c = 'red';    // color cosine

  // size without margins
  let [sx, sy] = mc.qm.sz(qm);
  sx -= 2*pad; sy -= 2*pad;

  // the smaller one
  let sm = Math.min(sx, sy), sm2 = sm/2;

  // grid for circle
  mc.grid.$(bg, [pad, pad], [sm, sm], [4, 4]);

  // grid for waves
  let [pgx, pgy] = [2*pad + sm, pad];   // position
  let [sgx, sgy] = [sx - sm - pad, sm]; // size
  mc.grid.$(bg, [pgx, pgy], [sgx, sgy], [12, 4]);

  // centered circle
  let [cx, cy] = cc = [pad + sm2, sy/2 + pad];
  let c = mc.circle.$(fg, cc, sm2, 'blue');

  // labels
  let $ = (p, s) => mc.label.$(bg, p, s + '\u00B0', true), dr = 8;
  $([cx + sm2 - dr, cy], '0');
  $([cx, cy - sm2 + dr], '90');
  $([cx - sm2 + dr, cy], '180');
  $([cx, cy + sm2 - dr], '270');

  $([pgx + sgx/4,   cy], '90');
  $([pgx + sgx/4*2, cy], '180');
  $([pgx + sgx/4*3, cy], '270');

  // lines: sine, cosine, hypotenuse, movable
  $ = (col, w) => mc.line.$(fg, null, null, col, w);
  let ls0 = $(col_s, 2), ls1 = $(col_s, 2);
  let lc0 = $(col_c, 2), lc1 = $(col_c, 2);
  let lh  = $('black', 2);
  let lm = $('gray'), lms = $(col_s, 3), lmc = $(col_c, 3);

  // waves: sine, cosine
  $ = (col) => mc.spline.$(fg, true, [], col);
  let ws = $(col_s), wc = $(col_c);

  function setWave(w, phase) {
    let steps = 12, ps = [];
    for (let i = -1; i <= steps + 1; ++i) {
      let x = i / steps;
      ps.push([x, - mc.degSin(phase + 360 * x)]);
    }

    mc.spline.set(w, ps, [sgx, sgy/2], [pgx, pgy + sgy/2]);
  }

  let crank = mc.handle.$(fg, [0, 0], 'yellow');
  mc.shape.movable(crank, function (p) {
    let [x, y] = p = mc.circle.closeTo(c, p);
    let angle = mc.circle.atp(c, p);

    let _ = mc.line.set;

    // on circle
    _(lh,  p, cc);
    _(ls0, [cx, y], cc);
    _(ls1, p, [x,  cy]);
    _(lc0, [x, cy], cc);
    _(lc1, p, [cx, y]);

    // on waves
    let lx = angle / 360 * sgx + pgx;
    _(lm,  [lx, pgy], [lx, pgy + sgy]);
    _(lms, [lx-1, pgy + sgy/2], [lx-1, pgy + sgy/2 - sgy/2 * mc.degSin(angle)]);
    _(lmc, [lx+1, pgy + sgy/2], [lx+1, pgy + sgy/2 - sgy/2 * mc.degCos(angle)]);
    return p;
  });

  setWave(ws, 0);
  setWave(wc, 90);

  mc.shape.moveTo(crank, cc);
}

// eof
