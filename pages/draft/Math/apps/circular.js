// circular -> harmonic motion

function circular (divId) {
  const qm = QuintMachine(divId, 3), [fg, bg] = qm.fbo();
  const [sx, sy, cx_, cy_, x1, x2, y1, y2] = qm.sz();
  const m = qm.m();

  const col_s = 'green';  // color sine
  const col_c = 'red';    // color cosine

  // the smaller one
  let sm = sy, sm2 = sm/2;

  // grid for circle
  bg.grid([x1, y1], [sm, sm], [4, 4]);

  // grid for waves
  let [pgx, pgy] = [x1 + sm + m, y1];   // position
  let [sgx, sgy] = [sx - sm - m, sy]; // size
  bg.grid([pgx, pgy], [sgx, sgy], [12, 4]);

  // centered circle
  let [cx, cy] = cc = [m + sm2, cy_];
  let c = fg.circle(cc, sm2, 'blue');

  // angle arc
  let arc = fg.arc();

  // labels
  let $ = (p, s) => bg.label(p, s + '\u00B0', true), dr = 8;
  $([cx + sm2 - dr, cy], '0');
  $([cx, cy - sm2 + dr], '90');
  $([cx - sm2 + dr, cy], '180');
  $([cx, cy + sm2 - dr], '270');

  $([pgx + sgx/4,   cy], '90');
  $([pgx + sgx/4*2, cy], '180');
  $([pgx + sgx/4*3, cy], '270');

  $ = (p, s) => bg.label(p, s);
  $([pgx, y1+dr], 'cos').fill(col_c);
  $([pgx + sgx/4, y1+dr], 'sin').fill(col_s);

  // lines: sine, cosine, hypotenuse, movable
  $ = (col, w) => fg.line(null, null, col, w);
  let ls0 = $(col_s, 2), ls1 = $(col_s, 2);
  let lc0 = $(col_c, 2), lc1 = $(col_c, 2);
  let lh  = $('black', 2);
  let lm = $('gray'), lms = $(col_s, 3), lmc = $(col_c, 3);

  // waves: sine, cosine
  let ws = fg.wave(col_s).set(1, 0,   [sgx, sgy/2], [pgx, pgy + sgy/2]);
  let wc = fg.wave(col_c).set(1, .25, [sgx, sgy/2], [pgx, pgy + sgy/2]);

  let crank = fg.handle([0, 0], 'yellow');
  crank.movable(function (p) {
    let [x, y] = p = c.closeTo(p);
    let angle = c.atp(p);

    // arc
    arc.set(0, angle, [sm2/3, sm2/3], cc);

    // on circle
    lh.set(p, cc);
    ls0.set([cx, y], cc);
    ls1.set(p, [x,  cy]);
    lc0.set([x, cy], cc);
    lc1.set(p, [cx, y]);

    // on waves
    let lx = angle / 360 * sgx + pgx;
    lm.set([lx, pgy], [lx, pgy + sgy]);
    lms.set([lx-1, pgy + sgy/2], [lx-1, pgy + sgy/2 - sgy/2 * ws.ampl(angle/360)]);
    lmc.set([lx+1, pgy + sgy/2], [lx+1, pgy + sgy/2 - sgy/2 * wc.ampl(angle/360)]);
    return p;
  });

  crank.moveTo(cc);
}

// eof
