// microphone polar patterns

function polar_patterns (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  const [sx, sy, cx, cy] = qm.sz();

  // full radius, unit radius
  let r = sy/2, r1 = r * .9;
  // polar grid
  let g = bg.polarGrid([cx, cy], r, r1, true);

  // mic pattern
  let mic = fg.spline(true, 'red');
  mic.width('3');

  function setPattern(mixVal) {
    let steps = 48, ps = [];
    for (let i = -1; i <= steps + 1; ++i) {
      let a = i / steps * 360;
      let mo = 1 - mixVal, mb = mixVal;
      let r = Math.abs(r1*mo + r1*qm.degCos(a)*mb);
      let [x, y] = g.toXY(r, a); // omni
      ps.push([x, y]);
    }

    mic.set(ps, null, [cx, cy]);

    mix.setValue(mixVal);
    if (mixVal >= .8)
      rio6.check();
    else if (mixVal >= .7)
      rio5.check();
    else if (mixVal >= .6)
      rio4.check();
    else if (mixVal >= .4)
      rio3.check();
    else if (mixVal >= .2)
      rio2.check();
    else
      rio1.check();
  }

  // controls
  let c = over.controls();

  let rio1 = c.br().addRadio('pat', 'Omni-directional',
    () => setPattern(0));
  let rio2 = c.br().addRadio('pat', 'Subcardioid (wide cardioid)',
    () => setPattern(.35));
  let rio3 = c.br().addRadio('pat', 'Cardioid',
    () => setPattern(.5));
  let rio4 = c.br().addRadio('pat', 'Supercardioid',
    () => setPattern(.65));
  let rio5 = c.br().addRadio('pat', 'Hypercardioid',
    () => setPattern(.75));
  let rio6 = c.br().addRadio('pat', 'Bidirectional (Figure-8)',
    () => setPattern(1));

  let mix = c.br().addRange(0, 1, .05, () => setPattern(mix.value()));

  setPattern(0);
}

// eof
