// sampling theorem

function sampling (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(), m = qm.m();

  // a bit smaller
  sy -= m;

  // guide line
  bg.line([x1, cy], [x2, cy], 'gray').dashedStroke();

  // restored wave
  let wr = bg.wave('green');

  // sampled wave
  let ws = bg.wave(), wsCycles, wsPhase;
  fg.slider([x1, y1], [sx/2-m, 0]).
    val(wsPhase=0).onVal((v) => setWsPhase(-v));
  fg.slider([cx, y1], [sx/2, 0]).min(.05).
    val(wsCycles=1).onVal((v) => setWsCycles(1/v));

  // samples
  let nSamples, ns, gs = null;
  fg.slider([x1, y2], [sx, 0]).min(36).max(1).
    val(nSamples = 12).onVal((v) => setNSamples(v));

  function set() {
    // sampled wave
    ws.set(wsCycles, wsPhase, [sx/wsCycles, sy/2], [x1, cy]);

    // samples
    if (null != gs)
      gs.rem();
    gs = bg.group().p([x1, cy]);
    for (let n = 0; n < nSamples; ++n) {
      let x = n/nSamples * wsCycles, y = -ws.ampl(x) * sy/2,
          xx = x*sx/wsCycles;
      gs.line([xx, 0], [xx, y], 'red', 2);
    }

    // restored wave
    let fr = wsCycles, fn = nSamples / 2;
    let invert = !!(Math.floor(fr / fn) % 2);
    if ((fr = fr % (2*fn)) > fn)
      fr = 2*fn - fr;

    let wrCycles = fr, wrPhase = (invert ? .5 - wsPhase : wsPhase);
    wr.set(wrCycles, wrPhase, [sx/wrCycles, sy/2], [x1, cy]);
  }

  // orig. wave

  function setWsPhase (v) {
    wsPhase = v; set();
  }

  function setWsCycles (v) {
    wsCycles = v; set();
  }

  // samples

  function setNSamples (v) {
    nSamples = v; set();
  }

  set();
}


// eof