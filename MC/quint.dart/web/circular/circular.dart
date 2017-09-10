import 'package:quint/quint.mach.dart';
import 'package:quint/quint.widgets.dart';

import 'dart:math' as math;

main() {
  circular('#app');
}

circular(el_sel) {
  var app = new WrappedResizableElement('#app');
  XY wh = app.availableRectangle();

  const num minRat = 3; // keep rectangular

  if (wh.x >= wh.y) {
    if (wh.x/wh.y < minRat) wh.y = wh.x~/minRat;
  } else {
    if (wh.y/wh.x < minRat) wh.x = wh.y~/minRat;
  }

  var q = new QuintMachine(app,wh);
  wh = q.sz;

  int w = wh.x, h = wh.y, m = wh.min;

  var pad = 6, clr1 = 'blue', clr2 = 'green', clr3 = 'red', clrh = 'yellow';

// grid - circle
  XY gcp = xy1(pad), gcsz = xy1(m-2*pad), gctr = gcp + gcsz/2;

  grid(q.bg,gcp,gcsz,xy(4,4));

// circle

  var c  = circle(q.fg,gctr,gcsz.x/2,clr1);
  var sl = line(q.fg,xy0(),xy0(),clr2) ..width=2;
  var cl = line(q.fg,xy0(),xy0(),clr3) ..width=2;
  var ll = line(q.fg,xy0(),xy0(),clr1) ..width=2;

// grid - waves

  XY gwp, gwsz;
  if (w>h) {
    gwp = xy(gcsz.x+2*pad,pad); gwsz = xy(w-gcsz.x-3*pad,gcsz.y);
  } else {
    gwp = xy(pad,gcsz.y+2*pad); gwsz = xy(gcsz.x, h-gcsz.y-3*pad);
  }
  grid(q.bg,gwp,gwsz,xy(12,4));

// waves

  var sw = spline(q.fg, true,[],clr2);
  var cw = spline(q.fg, true,[],clr3);

  setWave(Spline w,num a) {
    int steps = 12; List<XY> ps = [];
    for (var i=-1; i<=steps+1; ++i) {
      var x = i/steps;
      ps.add(xy(x, math.sin(a + Math.PIPI*x)));
    }
    w.set(ps,xy(gwsz.x,gwsz.y/2),xy(gwp.x,(gwp + gwsz/2).y));
  }

  var crank = handle(q.fg,xy0(),clrh) ..movable((XY p,Shape,bool) {
    p = c.closeTo(p);
    ll.set(p,gctr);
    sl.set(p,xy(p.x,gctr.y));
    cl.set(p,xy(gctr.x,p.y));
    var a = c.atp(p);
    setWave(sw,-a);
    setWave(cw,-Math.PI2-a);
    return p;
  });

  crank.moveTo(gctr);
}

// eof
