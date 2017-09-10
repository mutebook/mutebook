part of quint.widgets;

abstract class DiscWgt extends Widget {
}

class Spiral extends DiscWgt {
  num minTurn, maxTurn, minRad, maxRad, aOff;
  Spline sp;

  Spiral(this.minTurn,this.maxTurn,this.minRad,this.maxRad,[this.aOff=0]) {
    add(sp = new Spline(true));
    update();
  }

  // (r)an(ge), (st)e(p)
  num get rgeRad  => maxRad - minRad;
  num get stpRad  => rgeRad / (maxTurn - minTurn);
  num get markRad => stpRad / 2.4;

  void update() {
    List<XY> ps = [];
    int div=24, minI = (minTurn*div).floor() - 1,
                maxI = (maxTurn*div).ceil()  + 1;
    for (var i=minI; i<=maxI; ++i) ps.add(t2xy(i/div));
    sp.ps = ps;
  }

  // conversion turns <-> radius, angle, ra, xy
  num t2r(num t)  => scale_val(t,minTurn,maxTurn,minRad,maxRad);
  num t2a(num t)  => Math.PIPI*t + aOff;

  num r2t(num r)  => scale_val(r,minRad,maxRad,minTurn,maxTurn);
  num a2t(num a)  => (a - aOff) / Math.PIPI; // not unique; the smallest one

  RA t2ra(num t)  => ra(t2r(t), t2a(t));
  XY t2xy(num t)  => t2ra(t).toXY();
}

class SpiralMark extends GroupNode {
  Circle c1, c2; Label l;
  SpiralMark(XY p, num r, [color1, color2]) {
    c1 = add(new Circle(xy0(),0)); c2 = add(new Circle(xy0(),0));
    set(p,r,color1,color2);
  }

  void set(XY p, num r, [color1, color2]) {
    var on = r>0; this.p = p;
    c1 ..r = r+1 ..stroke = (null!=color1) ? color1 : 'lightgrey';
    c2 ..r = r   ..stroke = (null!=color2) ? color2 : 'none';
    c1.show(on); c2.show(on);
    if (null!=l) {
      l ..p = _lp ..show(on);
    }
  }

  XY get _lp => xy(c1.r,-c1.r)*.8;

  void setLabel(String s) {
    if (null==l) l = label(this,_lp,s,c1.stroke);
  }
}

class PitchSpiral extends Spiral {
  static num _offPch(Pch ctrPch) {
    return -ctrPch.val.remainder(1) * Math.PIPI - Math.PI2;
  }

  Pch ctrPch;

  PitchSpiral(Pch minPch,Pch ctrPch,Pch maxPch,num minRad,num maxRad)
  : super(minPch.val,maxPch.val,minRad,maxRad,_offPch(ctrPch)) {
    this.ctrPch = ctrPch;
  }

  Pch get minPch  => Tun.pch(minTurn);
  Pch get maxPch  => Tun.pch(maxTurn);

  Cps get minCps  => minPch.toCps();
  Cps get maxCps  => maxPch.toCps();

  // conversions
  num pch2r(Pch pch)  => t2r(pch.val);
  num pch2a(Pch pch)  => t2a(pch.val);

  Pch r2pch(num r)    => Tun.pch(r2t(r));
  Pch a2pch(num a)    => Tun.pch(a2t(a)); // not unique; the lowest

  RA pch2ra(Pch pch)  => (pch<minPch) ? ra0() : t2ra(pch.val);
  XY pch2xy(Pch pch)  => (pch<minPch) ? xy0() : t2xy(pch.val);

  Pch ra2pch(RA ra) {
    if (ra.is0()) return Tun.pch(0);
    // inside out, best match
    num t = a2t(ra.a), md = double.INFINITY, res;
    for (;;) {
      num dr = (t2r(t)-ra.r).abs();
      if (dr>md) break;
      md = dr; res = t++;
    }

    return Tun.pch(res);
  }

  Pch xy2pch(XY xy)   => ra2pch(xy.toRA());

  Pch oldVal = Tun.pch(0);
  Pch lag(Pch pch,[bool init=false]) { // TODO move to Tone (even for noise spiral), then remove SpiralTone._onBeginUserMove
    if (!init) {
      // more stable selection
      var dv = (pch - oldVal).val;
      // TODO better
      if (dv.abs() >= .4) pch = pch - Tun.pch(dv > 0 ? 1 : -1);
    }

    oldVal.val = pch.val;
    return pch;
  }

  Pch snap(Pch pch, Iterable<Pch> snap) {
    var pch0 = pch, minDP = 9999;
    for (Pch p in snap) {
      var dp = (pch0-p).val.abs();
      if (dp < minDP) {
        minDP = dp; pch = p;
      }
    }

    return pch;
  }

  // graphic elements
  SpiralMark mark(GroupNode g, Pch pch, num r, [color1, color2])
    => g.add(new SpiralMark(pch2xy(pch),r,color1,color2));

  setMark(SpiralMark mark, Pch pch, num r, [color1, color2])
    => mark.set(pch2xy(pch),r,color1,color2);

  Label labelPch(GroupNode g, Pch pch, String s, [color='black'])
    => label(g,pch2xy(pch)+xy(-8,4)/*TODO*/,s,color);

  Shape spoke(GroupNode g, Pch pch) {
    var a = pch2a(pch), outR = 7;
    return line(g,ra(minRad-outR,a).toXY(), ra(maxRad+outR,a).toXY());
  }

  GroupNode spokes(GroupNode g, Iterable<Pch> pchs) {
    g = g.group();
    var ps = pchs.toList(); ps.sort();
    for (var p in ps) spoke(g, p);
    return g ..hide();
  }

  markPitch(GroupNode g, Pch pch, colorMark, [colorRad]) {
    if (null!=colorMark)  mark(g,pch,markRad,colorMark);
    if (null!=colorRad)   circle(g,p,pch2r(pch),colorRad);
  }
}

// eof
