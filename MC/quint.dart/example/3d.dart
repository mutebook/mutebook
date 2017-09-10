import 'package:quint/quint.dart';

main() {
  planets('#app');
}

planets(el_sel) {
  const int sz = 400;
  var q = new QuintMachine(el_sel,xy1(sz));

  var r_sun   = sz/12,    r_earthOrbit = r_sun*4,
      r_earth = r_sun/3,  r_moonOrbit  = r_earth*4,
      r_moon  = r_earth/3;
  var me_omega = -18; // how much faster Moon orbits than Earth

  var ctr = q.sz / 2;
  var fg = q.fg;

  /* var sun   = */ circle(fg,ctr,r_sun,'orange','yellow');
  var earthOrbit  = circle(fg,ctr,r_earthOrbit,'lightgrey');
  var earth       = circle(fg,ctr,r_earth,'green','lightblue');
  var moonOrbit   = circle(fg,ctr,r_moonOrbit,'lightgrey');
  var moon        = circle(fg,ctr,r_moon,'black','grey');

  XY onMoveEarth(XY p,Shape,bool) {
    p = earthOrbit.closeTo(p);
    moonOrbit.moveTo(p);
    moon.moveTo(moonOrbit.atr(me_omega*earthOrbit.atp(p)));
    return p;
  }

  XY onMoveMoon(XY p,Shape,bool) {
    var mo = moonOrbit, eo = earthOrbit;
    p = mo.closeTo(p);
    var a1 = mo.atp(moon.p), a2 = mo.atp(p), da = Math.normPI(a2-a1);
    earth.moveTo(eo.atr(eo.atp(earth.p)+da/me_omega));
    p = mo.closeTo(p);
    return p;
  }

  earth.movable(onMoveEarth);
  moon.movable(onMoveMoon);

  earth.moveTo(ctr);
}

// eof
