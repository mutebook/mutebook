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
  let ws = bg.wave();

  // gauge
  let gauge = over.addInput('text');
  gauge.dObj.style.width = '3em';
  gauge.centerAt([cx, y1]);

  // sine line
  let ls = fg.line(null, null, 'green', 3);

  function setPhase (ph) {
    const cycles = 3, ampl = sy * .2;
    ws.set(cycles, ph, [sx/cycles, ampl], [x1, cy]);

    const ly = ws.ampl(cycles / 2, ph);
    ls.set([cx, cy], [cx, cy - ly*ampl]);
    gauge.dObj.value = ly.toFixed(2);
  }

  let n = 0; const steps = 360; // degree by degree
  function step() {
    setPhase(- (n++ / steps));
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
  setFreq(.1);
}

// eof
