// harmonic motion

function harmonic_motion (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  const [sx, sy] = qm.sz(), m = qm.m();

  const col_s = 'green';  // color sine

  // weight on a spring
  const ww = sx / 4;  // width
  bg.line([m, 0], [ww, 0], 'black', 3); // beam

  const spring = bg.spline(true, 'gray');
  {
    let ps = []; const segments = 28;
    for (let i = -1; i <= segments + 1; ++i) {
      ps.push([qm.degSin(i*90), 1 / segments * i]);
    }

    spring.setPath(ps, null, [ww/2, 0]);
  }

  const wr = m * .8;
  const weight = bg.circle([0,0], wr, 'green');
  weight.fill('green');

  // grid for wave
  const [pgx, pgy] = [2*m + ww, m];     // position
  const [sgx, sgy] = [sx - ww - m, sy]; // size
  const gw = bg.grid([pgx, pgy], [sgx, sgy], [12, 4]);

  // wave
  let ws = gw.wave(col_s).set(1, 0, [sgx, sgy/2], [0, sgy/2]);
  // sine line
  let ls = gw.line(null, null, col_s, 3);

  function setPhase (ph) {
    const [x, y] = [ph, -ws.ampl(ph)];
    ls.set([x*sgx, (y + 1) * sgy/2], [x*sgx, sgy/2]);
    spring.sc([wr*2/3, (y + 1) * sgy/2 - wr + m]);
    weight.moveTo([ww/2, m + (y + 1) * sgy/2]);
  }

  let n = 0; const steps = 360;
  function step() {
    setPhase(n++ / steps);
    n %= steps;
  }

  let interval;
  function setFreq (Hz) {
    freq.setValue(Hz);
    clearInterval(interval);
    if (Hz > 0)
      interval = setInterval(step, 1000 / (Hz*steps));
  }

  // controls
  let c = over.controls();
  let freq = c.addRange(0, 1, .02, () => setFreq(freq.value()));

  step();
  setFreq(0);
}

// eof
