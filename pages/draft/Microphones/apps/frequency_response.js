// microphone frequency response

function frequency_response (divId) {
  const qm = mc.qm.$(divId, 2, true), [fg, bg, over] = mc.qm.fb(qm);
  elemHelpers(over);

  // size without margins
  let m = 18, [sx, sy] = mc.qm.sz(qm);
  sx -= 2*m; sy -= 2*m;

  // log-lin grid
  let llg = mc.loglinGrid;
  let g = llg.$(bg, [m, m], [sx, sy], 10, 28000, -14, 6, true, true);
  llg.xLegend(g, 'Frequency (Hz)');
  llg.yLegend(g, 'Output (dB)');

  // mic pattern
  let mic = mc.spline.$(g, false, [], 'red');
  mc.node.width(mic, '3');

  function setResponse(response, mul) {
    let ps = [];
    for (var fdb of response) {
      let [freq, dB] = fdb;
      let [x, y] = llg.toXY(g, freq, dB * mul);
      ps.push([x, y]);
    }

    mc.spline.set(mic, ps);
    flat.value = mul;
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
  let c = over.addChild('div', 'controls');
  c.br().addLabel('flat');
  let flat = c.addInput('range');

  flat.min  = 0;
  flat.max  = 1;
  flat.step = .05;

  flat.onchange = function () {
    setResponse(response1, this.value);
  };

  flat.onmousemove = function () {
    setResponse(response1, this.value);
  };

  setResponse(response1, .1);
}

// eof
