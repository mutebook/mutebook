// microphone frequency response

function frequency_response (divId) {
  const qm = QuintMachine(divId), [fg, bg, over] = qm.fbo();
  let [sx, sy, cx, cy, x1, x2, y1, y2] = qm.sz();
  sy *= .92; // space on bottom

  // log-lin grid
  let g = bg.loglinGrid([x1, y1], [sx, sy], 10, 28000, -14, 6, true, true);
  g.xLegend('Frequency (Hz)');
  g.yLegend('Output (dB)');

  // mic pattern
  let mic = g.spline(false, 'red');
  mic.width('3');

  function setResponse(response, mul) {
    let ps = [];
    for (var fdb of response) {
      let [freq, dB] = fdb;
      let [x, y] = g.toXY(freq, dB * mul);
      ps.push([x, y]);
    }

    mic.setPath(ps);
    flat.setValue(mul);
  }

  var response1 = [
    [18, -6], // [f, dB]
    [40, -2],
    [70, -1],
    [100, -.5],
    [300, 0],
    [1000, .3],
    [1100, .3],
    [1200, .4],
    [2000, 1],
    [4000, 3],
    [4500, 3.1],
    [5100, 3],
    [6000, 2],
    [8000, 1],
    [16000, 0],
    [18000, -.6],
  ];

  // controls
  let c = over.controls();
  let flat = c.addRange(0, 1, .05, () => setResponse(response1, flat.value()));

  setResponse(response1, .1);
}

// eof
