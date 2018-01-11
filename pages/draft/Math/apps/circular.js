// circular -> harmonic motion

function circular (divId) {
  const qm = QuintMachine(divId, 3), [fg, bg] = qm.fbo();

  // config
  const m = 8;
  const col_s = 'green';  // color sine
  const col_c = 'red';    // color cosine

  // size without margins
  let [sx, sy] = qm.sz(m);

  // the smaller one
  let sm = Math.min(sx, sy), sm2 = sm/2;

  // grid for circle
  bg.grid([m, m], [sm, sm], [4, 4]);

  // grid for waves
  let [pgx, pgy] = [2*m + sm, m];   // position
  let [sgx, sgy] = [sx - sm - m, sy]; // size
  bg.grid([pgx, pgy], [sgx, sgy], [12, 4]);

  // centered circle
  let [cx, cy] = cc = [m + sm2, sy/2 + m];
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
  $ = (col, w) => fg.line(null, null, col, w);
  let ls0 = $(col_s, 2), ls1 = $(col_s, 2);
  let lc0 = $(col_c, 2), lc1 = $(col_c, 2);
  let lh  = $('black', 2);
  let lm = $('gray'), lms = $(col_s, 3), lmc = $(col_c, 3);

  // waves: sine, cosine
  $ = (col) => fg.spline(true, col);
  let ws = $(col_s), wc = $(col_c);

  function setWave(w, phase) {
    let steps = 12, ps = [];
    for (let i = -1; i <= steps + 1; ++i) {
      let x = i / steps;
      ps.push([x, - mc.degSin(phase + 360 * x)]);
    }

    w.set(ps, [sgx, sgy/2], [pgx, pgy + sgy/2]);
  }

  let crank = mc.handle.$(fg, [0, 0], 'yellow');
  mc.shape.movable(crank, function (p) {
    let [x, y] = p = mc.circle.closeTo(c, p);
    let angle = mc.circle.atp(c, p);

    // on circle
    lh.set(p, cc);
    ls0.set([cx, y], cc);
    ls1.set(p, [x,  cy]);
    lc0.set([x, cy], cc);
    lc1.set(p, [cx, y]);

    // on waves
    let lx = angle / 360 * sgx + pgx;
    lm.set([lx, pgy], [lx, pgy + sgy]);
    lms.set([lx-1, pgy + sgy/2], [lx-1, pgy + sgy/2 - sgy/2 * mc.degSin(angle)]);
    lmc.set([lx+1, pgy + sgy/2], [lx+1, pgy + sgy/2 - sgy/2 * mc.degCos(angle)]);
    return p;
  });

  setWave(ws, 0);
  setWave(wc, 90);

  mc.shape.moveTo(crank, cc);
}

// eof
