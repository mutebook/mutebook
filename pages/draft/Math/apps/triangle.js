// right(-angled) triange

function triangle (divId) {
  const qm = QuintMachine(divId, 3), [fg, bg] = qm.fbo();

  // size without margins (m)
  let m = 24, [sx, sy] = qm.sz(m);

  // sizes of sides (a:b:c = 3:4:5)
  let sa = sy, sb = sa/3*4, sc = sa/3*5;

  // vertices
  let x1 = m + (sx-sb)/2, x2 = x1 + sc, y1 = m, y2 = y1 + sy;
  let A = [x2, y2], B = [x1, y1], C = [x1, y2];

  // sides
  let $ = (p1, p2, col, w) => fg.line(p1, p2);
  let a = $(B, C, 'black', 2);
  let b = $(A, C, 'black', 2);
  let c = $(A, B, 'black', 2);

  // labels
  $ = (p, s) => bg.label(p, s, true), d = 12;
  $([x2+d, y2+d], 'A');
  $([x1-d, y1-d], 'B');
  $([x1-d, y2+d], 'C');

  $([x2-5*d, y2-d],   'α');
  $([x1+d,   y1+3*d], 'β');
  $([x1+d,   y2-d],   'γ');

  $([x1-d,      y1+sa/2],   'a');
  $([x1+sb/2,   y2+d],      'b');
  $([x1+sb/2+d, y1+sa/2-d], 'c');
}

// eof
