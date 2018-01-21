// sampling theorem

function sampling (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz(), m = qm.m();

  sy *= .8; cy = m + sy / 2;
  // a bit higher

  // guide lines
  bg.line([x1, cy], [x2, cy], 'gray').dashedStroke();

  // wave sampled
  let ws = bg.wave();

  let cycles = 1, phase = 0;
  function set() {
    ws.set(cycles, phase, [sx/cycles, sy/2], [x1, cy]);
  }

  let nyq = .1, nyqPh = 0, np;
  function setN() {
    np = [];

    set();
  }

  // controls
  let c = over.controls();
  let wsCs = c.addRange(1, 6, 0, () => setCycles(wsCs.value()));
  let wsPh = c.br().addRange(0, 1, 0, () => setPhase(wsPh.value()));
  let smNyq = c.br().addRange(.1, 10, 0, () => setNyq(smNyq.value()));
  let smPh = c.br().addRange(0, 1, 0, () => setNyqPh(smPh.value()));

  function setPhase(ph) {
    phase = ph; set();
  }

  function setCycles(cs) {
    cycles = cs; set();
  }

  function setNyq(cs) {
    nyq = cs; setN();
  }

  function setNyqPh(cs) {
    nyqPh = cs; setN();
  }

  setNyq();
}


// eof