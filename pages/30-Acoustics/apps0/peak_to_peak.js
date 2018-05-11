// frequencies - buttons on a spiral

function peak_to_peak (divId) {
  const qm = QuintMachine(divId), [fg, bg] = qm.fbo();
  const [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz();

  // wave
  const cycles = 3, phase = .1;
  let ws = bg.wave().set(cycles, phase, [sx/cycles, sy/2], [x1, cy]);

  // lines
  bg.line([x1, cy], [x2, cy]);
  const yEff = cy - sy*Math.SQRT1_2/2;
  bg.line([x1, yEff], [x2, yEff]).dottedStroke();

  // arrows
  let axf = (d) => x1 + sx/cycles*(d - phase);

  let ax = axf(1/4), dt = 8, dy = sy/60;
  fg.line([ax, cy-dy], [ax, y1+dy]).width(2).arrowEnd();
  fg.label([ax+dt, cy-dt], 'peak pressure').fill('black');

  ax = axf(5/4);
  fg.line([ax, y2-dy], [ax, y1+dy]).width(2).arrowBeg().arrowEnd();
  fg.label([ax+dt, cy-dt], 'peak-to-peak pressure').fill('blue');

  ax = axf(9/4);
  fg.line([ax, cy-dy], [ax, yEff+dy]).width(2).arrowEnd();
  fg.label([ax+dt, cy-dt], 'effective pressure').fill('green');
}

// eof