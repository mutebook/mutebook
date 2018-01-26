// harmonic motion

function monopole (divId) {
  const qm = QuintMachine(divId, 3), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(0);

  const rnd = (min, max) => min + Math.random() * (max - min);

  // setup
  let pole = fg.circle([0,0], 0).width(2).stroke('red');

  let N = 80, cps = [], cs = [];
  for (let i = 0; i < N; ++i) {
    cps.push([rnd(x1, x2), rnd(y1, y2)]);
    cs.push(bg.circle([0, 0], 1).color('gray'))
  }

  // animate
  let n = 0, degStep = 1; // deg

  function set() {
  //   let [cx, cy] = [10*NX/2, 10*NY/2], cycles = 1;

    pole.set([cx, cy], 4*(1.1 + qm.degSin(n)));

    for (let i = 0; i < N; ++i) {
      cs[i].moveTo(cps[i]);
    }

  //   bigC.set([cx, cy], ++bigN);
  //   bigN %= 10*NX/1.8;

  //   for (let ix = 0; ix < nx; ++ix) {
  //     for (let iy = 0; iy < ny; ++iy) {
  //       let c = cs[ix][iy], [x, y] = ps[ix][iy];
  //       let [dx, dy] = [x-cx, y-cy];
  //       let d = Math.sqrt(dx*dx + dy*dy);
  //       let am = - qm.degSin(360*d/3 + n);
  //       am *= ampl;
  //       let [ux, uy] = [dx/d + (Math.random() - .5)*.2, dy/d + (Math.random() - .5)*.2];
  //       c.moveTo([x + am*ux, y + am*uy]);
  //     }
  //   }
  }
  // let N = 14, NX = 3*N + 1, NY = N + 1; // keep odd

  // let g = fg.group().p([x1, y1]).sc([sx/NX/10, sy/NY/10]);

  // let nx = NX+1, ny = NY+1;
  // let cs = [], ps = [];

  // let bigC = g.circle([0,0], 0).width(8).stroke('#ddd');

  // for (let ix = 0; ix < nx; ++ix) {
  //   let csy = [], psy = [];
  //   for (let iy = 0; iy < ny; ++iy) {
  //     let c = g.circle([0, 0], 1).color('gray');
  //     csy.push(c);
  //     psy.push([10*ix + (Math.random() - .5)*1,
  //               10*iy + (Math.random() - .5)*1]);
  //   }
  //   cs.push(csy);
  //   ps.push(psy);
  // }

  // bigN = 0; ampl = 3;

  function step () {
    set();
    n = (n + degStep) % 360;
  }

  let interval;
  function setTick (on) {
    if (on)
      interval = setInterval(step, 80);
    else
      clearInterval(interval);
  }

  function setDegStep () {
    degStep = rge.value() * 25;
  }

  // controls
  let c = over.controls();
  let onOff = c.addCheck('', setTick);
  let rge = c.addRange(0, 1, 0, setDegStep);

  rge.setValue(.8); setDegStep();
  set();
}

// eof
