// sampling theorem

// TODO: audio, check "enhance singularities"

function sampling (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(), m = qm.m();

  // a bit smaller
  sy -= 3*m;

  // guide line
  bg.line([x1, cy], [x2, cy], 'darkgray').dashedStroke();

  // sampled wave
  let ws = bg.wave('blue').width(1.7), wsCycles, wsPhase;

  function setWsPhase (v) {
    wsPhase = v; set();
  }

  function setWsCycles (v) {
    wsCycles = v; set();
  }

  bg.label([x1, y1+16], 'wave phase');
  bg.slider([x1, y1], [sx/2-m, 0]).
    val(-(wsPhase=-0)).onVal((v) => setWsPhase(-v));

  bg.label([cx, y1+16], 'wave period (1/f)');
  bg.slider([cx, y1], [sx/2, 0]).min(.05).
    val(1/(wsCycles=3)).onVal((v) => setWsCycles(1/v));

    // restored wave
  let wr = bg.wave('green').width(2), wrCycles, wrPhase;

  // samples
  let gs = bg.group().p([x1, cy]), nSamples;
  bg.label([cx, y2-8], 'sampling period (1/f)');
  bg.slider([cx, y2], [sx/2, 0]).min(36).max(1).
    val(nSamples = 6.1).onVal((v) => setNSamples(v));

  function setNSamples (v) {
    nSamples = v; set();
  }

  let near = (v1, v2) => Math.abs(v1 - v2) < .04;

  let enhance = false;

  // put all together
  function set() {
    let wsc = wsCycles, ns = nSamples, ws0 = ws.ampl(0);

    // near nyq, samples near 0? -> flat line 0
    let nearNyq = enhance && near(wsc*2/ns, 1) && near(ws0, 0);

    // near nyq/2 -> flat line
    let nearNyq2 = enhance && !nearNyq && near(wsc/ns, 1);

    let wscy = cy, wrcy = cy;

    if (nearNyq)
      wsc = ns / 2;
    else if (nearNyq2)
      wsc = ns;

    // sampled wave
    ws.set(wsc, wsPhase, [sx/wsc, sy/2], [x1, wscy]);

    // draw samples
    gs.clear();
    for (let n = 0; n < ns; ++n) {
      let x = n/ns * wsc;
      let y = nearNyq ? 0 : -ws.ampl(x) * sy/2,
          xx = x*sx/wsc;
      gs.line([xx, 0], [xx, y], 'red');
      gs.circle([xx, y], 2).color('red');
    }

    // restored wave
    let invert = !!Math.floor(wsc*2 / (ns) % 2);
    if (nearNyq || nearNyq2)
      wrCycles = wsc;
    else if ((wrCycles = wsc % ns) > (ns/2))
      wrCycles = ns - wrCycles;

    wr.steady_ = nearNyq ? 0 : nearNyq2 ? ws0 : null;
    wrPhase = (invert ? .5 - wsPhase : wsPhase);

    wr.set(wrCycles, wrPhase, [sx/wrCycles, sy/2-1.7], [x1, wrcy]);
  }

  // controls
  let c = over.controls();
  c.addCheck('enhance singularities', (on) => {
    enhance = on; set();
  });

  c.br().addRange(0, 1, 0, () => {
  });

  // go
  set();
}


// eof