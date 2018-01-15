// harmonic motion

function acoustic_pressure (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  // size without margins
  let m = 14, [sx, sy] = qm.sz(m);

  // centre
  let cx = m + sx / 2;
  let cy = m + sy * .4;

  // guide lines
  bg.line([cx, m], [cx, m + sy], 'gray').dashedStroke();
  bg.line([m, cy], [m + sx, cy], 'gray').dashedStroke();
  fg.label([m, cy], 'stasis pressure');

  // wave
  let ws = bg.spline(true);

  let cycles = 3;

  // gauge
  let gauge = over.addInput('text');
  gauge.dObj.style.width = '3em';
  gauge.centerAt([cx, m]);

  // sine line
  let ls = fg.line(null, null, 'green', 3);

  const wavePoint = (x, ph) => [x, - qm.degSin(360 * (x - ph))];

  function setPhase (ph) {
    let ps = []; const steps = 12;
    for (let i = -1; i <= steps*cycles + 1; ++i) {
      let x = i / steps;
      ps.push(wavePoint(x, ph));
    }

    const ampl = sy * .2;
    ws.set(ps, [sx/cycles, ampl], [m, cy]);

    const [lx, ly] = wavePoint(360*cycles / 2, ph);
    ls.set([cx, cy], [cx, cy - ly*ampl]);
    gauge.dObj.value = ly.toFixed(2);
  }

  const steps = 360;
  let n = 0;
  function step() {
    setPhase((n / steps) % 1);
    n += 1;
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
  setFreq(.1);
}

// eof
