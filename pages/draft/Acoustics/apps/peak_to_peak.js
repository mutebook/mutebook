// frequencies - buttons on a spiral

function peak_to_peak (divId) {
  const qm = QuintMachine(divId), [fg, bg] = qm.fbo();
  // size without margins
  let m = 14, [sx, sy] = qm.sz(m);

  // wave
  let ws = bg.spline(true);
  const shift = .1;
  const wavePoint = (x) => [x, - qm.degSin(360 * (x + shift))];

  let cycles = 3;

  {
    let ps = []; const steps = 12;
    for (let i = -1; i <= steps*cycles + 1; ++i) {
      let x = i / steps;
      ps.push(wavePoint(x));
    }

    ws.set(ps, [sx/cycles, sy/2], [m, m+sy/2]);
  }

  // lines
  const y0 = m+sy/2;
  bg.line([m, y0], [m + sx, y0]);
  const yEff = m+sy*(1 - Math.SQRT1_2)/2;
  bg.line([m, yEff], [m + sx, yEff]).dottedStroke();

  // arrows
  let axf = (d) => m + sx/cycles*(d - shift);

  let ax = axf(1/4), dy = sy/60;
  fg.line([ax, y0-dy], [ax, m+dy]).width(2).arrowEnd();
  fg.label([ax+m, y0-m], 'peak pressure').fill('black');

  ax = axf(5/4);
  fg.line([ax, sy+m-dy], [ax, m+dy]).width(2).arrowBeg().arrowEnd();
  fg.label([ax+m, y0-m], 'peak-to-peak pressure').fill('blue');

  ax = axf(9/4);
  fg.line([ax, y0-dy], [ax, yEff+dy]).width(2).arrowEnd();
  fg.label([ax+m, y0-m], 'effective pressure').fill('green');
}

// eof