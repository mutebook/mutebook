// harmonic motion

function monopole (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(0);

  const rnd = (min, max) => min + Math.random() * (max - min);

  // setup
  let pole = fg.circle([0,0], 0).width(2).color('red');

  const WN = 280;
  let wave = new Array(WN).fill(0);

  const gradientId = 'waves' + divId;

  function setWave () {
    const col1 = '#fff', col2 = '#ccc';
    let stops = ['0%'], colors = [col1];

    let lastW = wave[0], up = false;
    for (let i = 0; i < WN; ++i) {
      const w = wave[i];
      if (w > lastW)
        up = true;
      else {
        if (up) {
          const perc = i/WN * 100;
          stops.push(perc-2 + '%');
          stops.push(perc+1 + '%');
          stops.push(perc+2 + '%');
          colors.push(col1);
          colors.push(col2);
          colors.push(col1);
        }
        up = false;
      }

      lastW = w;
    }

    stops.push('100%'); colors.push(col1);
    qm.radialGradient(gradientId, stops, colors);
  }

  let rD = sx/12, rOff = (sx-sy)/2;
  bg.rect([-rD,-rOff-rD], [sx+rD, sy+rOff+rD], 'white').fill('url(#'+ gradientId + ')');

  let cps = [], cs = [];
  const D = (cx - x1) / 24;
  for (let x = x1; x <= x2; x += D)
    for (let y = y1; y <= y2; y += D) {
      cps.push([x, y]);
      cs.push(bg.circle([0, 0], 1).color('gray'))
    }

  // animate
  let n = 0, degStep = 1; // deg

  function set() {
    const ampl = qm.degSin(n);
    pole.set([cx, cy], 4 + ampl*3);

    for (let i = WN; i-- > 1; )
      wave[i] = wave[i-1];

    wave[0] = ampl;
    setWave();

    for (let i = 0; i < cs.length; ++i) {
      let c = cs[i], [x, y] = cps[i];
      let [dx, dy] = [x-cx, y-cy];
      let d = Math.sqrt(dx*dx + dy*dy);
      let idx = Math.round(d / (sx/2+rD) * WN)
      idx = Math.min(Math.max(1, idx), WN-1);
      let dd = wave[idx] + .2;

      dd *= (d < D/2) ? 0 : D/3;
      let [ux, uy] = [dx/d*dd, dy/d*dd];
      cs[i].moveTo([x + ux, y + uy]);
    }
  }

  function step () {
    set();
    n = (n + degStep) % 360;
  }

  let interval = null;
  function setTick (on) {
    if (on) {
      if (null === interval)
        interval = setInterval(step, 160);
    }
    else {
      if (null !== interval)
        clearInterval(interval);
      interval = null;
    }
  }

  function setDegStep () {
    let v = rge.value();
    degStep = v * 25;
    setTick(0 < v);
  }

  // controls
  let c = over.controls();
  let rge = c.addRange(0, 1, 0, setDegStep);

  rge.setValue(0);
  setDegStep();
  set();
}

// eof
