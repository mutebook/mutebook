// microphone polar patterns

function polar_patterns (divId) {
  const qm = mc.qm.$(divId, 2, true), [fg, bg, over] = mc.qm.fb(qm);
  elemHelpers(over);

  // size without margins
  let m = 14, [sx, sy] = mc.qm.sz(qm);
  sx -= 2*m; sy -= 2*m;

  // centre
  let [cx, cy] = [m + sx/2, m + sy/2];
  // full radius, unit radius
  let r = sy/2, r1 = r * .9;
  // polar grid
  let g = mc.polarGrid.$(bg, [cx, cy], r, r1, true);

  // mic pattern
  let mic = mc.spline.$(fg, true, [], 'red');
  mc.node.width(mic, '2');

  function setPattern(mixVal) {
    let steps = 48, ps = [];
    for (let i = -1; i <= steps + 1; ++i) {
      let a = i / steps * 360;
      let mo = 1 - mixVal, mb = mixVal;
      let r = Math.abs(r1*mo + r1*mc.degCos(a)*mb);
      let [x, y] = mc.polarGrid.toXY(g, r, a); // omni
      ps.push([x, y]);
    }

    mc.spline.set(mic, ps, null, [cx, cy]);

    mix.value = mixVal;
    if (mixVal >= .8)
      rio6.checked = true;
    else if (mixVal >= .7)
      rio5.checked = true;
    else if (mixVal >= .6)
      rio4.checked = true;
    else if (mixVal >= .4)
      rio3.checked = true;
    else if (mixVal >= .2)
      rio2.checked = true;
    else
      rio1.checked = true;
    }

  // controls
  let c = over.addChild('div', 'controls');

  let rio1 = c.br().addRadio('pat', 'Omni-directional');
  let rio2 = c.br().addRadio('pat', 'Subcardioid (wide cardioid)');
  let rio3 = c.br().addRadio('pat', 'Cardioid');
  let rio4 = c.br().addRadio('pat', 'Supercardioid');
  let rio5 = c.br().addRadio('pat', 'Hypercardioid');
  let rio6 = c.br().addRadio('pat', 'Bidirectional (Figure-8)');

  rio1.onclick = () => setPattern(0);
  rio2.onclick = () => setPattern(.35);
  rio3.onclick = () => setPattern(.5);
  rio4.onclick = () => setPattern(.65);
  rio5.onclick = () => setPattern(.75);
  rio6.onclick = () => setPattern(1);

  let mix = c.br().addInput('range');

  mix.min  = 0;
  mix.max  = 1;
  mix.step = .05;

  mix.onchange = function () {
    setPattern(this.value);
  };

  mix.onmousemove = function () {
    setPattern(this.value);
  };

  setPattern(0);
}

// eof
