// harmonic motion

function acoustic_pressure (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();

  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz();
  cy -= sy / 8; // a bit higher

  // guide lines
  bg.line([x1, cy], [x2, cy], 'gray').dashedStroke();
  bg.line([cx, y1], [cx, y2], 'gray').dashedStroke();
  fg.label([x1, cy], 'stasis pressure');

  // wave
  let ws = bg.spline(true);

  let cycles = 3;

  // gauge
  let gauge = over.addInput('text');
  gauge.dObj.style.width = '3em';
  gauge.centerAt([cx, y1]);

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
    ws.set(ps, [sx/cycles, ampl], [x1, cy]);

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
