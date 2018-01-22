// sampling theorem

function sampling (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(), m = qm.m();

  // a bit smaller
  sy -= m;

  // guide line
  bg.line([x1, cy], [x2, cy], 'gray').dashedStroke();

  // wave sampled
  let ws = bg.wave();
  let cycles = 1, phase = 0;

  fg.slider([x1, y1], [sx/2-m, 0]).onVal((v) =>
    setPhase(-v));
  fg.slider([cx, y1], [sx/2, 0]).val(1).onVal((v) =>
    setCycles(1/Math.max(v,.05)));

  // wave restored
  let wr = bg.wave('green');
  let rcycles, rphase, rampl;

  // samples
  let nSamples = 12, ns, gs = null;
  fg.slider([x1, y2], [sx/2, 0]).val(.5).onVal((v) =>
    setNSamples(24*(1-v)));

  function set() {
    ws.set(cycles, phase, [sx/cycles, sy/2], [x1, cy]);
    if (null != gs)
      gs.rem();
    gs = bg.group().p([x1, cy]);
    for (let n = 0; n < nSamples; ++n) {
      let x = n/nSamples * cycles, y = -ws.ampl(x) * sy/2,
          xx = x*sx/cycles;
      gs.line([xx, 0], [xx, y], 'red', 2);
    }

    let f = cycles, nf = nSamples / 2;
    let nc = nSamples/cycles;
    if (2.1 <= nc) {
      rcycles = cycles; rphase = phase; rampl = 1;
    } else if (nc <= 1.9) { // under
      rcycles = 2; rphase = .3; rampl = .1;
    } else { // nyq
      rcycles = 2; rphase = .3; rampl = .1;
    }
    wr.set(rcycles, rphase, [sx/rcycles, rampl*sy/2], [x1, cy]);
  }

  // orig. wave

  function setPhase (ph) {
    phase = ph; set();
  }

  function setCycles (cs) {
    cycles = cs; set();
  }

  // samples

  function setNSamples (n) {
    nSamples = n; set();
  }

  set();
}


// eof