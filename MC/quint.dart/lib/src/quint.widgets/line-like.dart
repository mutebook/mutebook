part of quint.widgets;

abstract class LineWgt extends Widget {
  Line _line; num minVal=0.0, maxVal=1.0, _val = 0.0;

  LineWgt(XY p, XY sz) {
    _line  = line(this,p,p+sz);
  }

  XY get p      => _line.p;
  set p(XY p)   { _line.p = p; }

  XY get sz     => _line.sz;
  set sz(XY sz) { _line.sz = sz; }

  num get range => maxVal - minVal;
  void setRange(num min, num max) {
    minVal = min; maxVal = val;
  }

  bool reverse = false;

  num _from01(num v)  => range2val(v,minVal,maxVal);
  num _to01(num v)    => val2range(v,minVal,maxVal);
  num _p2v(XY p)      => _from01((reverse ? (_line.p2-p) : (p-_line.p1)).lgt()/sz.lgt());
  XY  _v2p(num v)     => (reverse ? _line.p2 : _line.p1) + sz * ((reverse ? -1 : 1) * _to01(v));

  num get val         => _val;
  set val(num v)      { _val = v; }
}

var meterW = 8, meterClr ='lightgrey', gaugeClr = 'red';

class Meter extends LineWgt {
  Line _meter;
  Meter(XY p, XY sz): super(p,sz) {
    _line ..width=meterW ..color=meterClr;
    _meter = add(new Line(p,p))
      ..width=meterW-1 ..color=gaugeClr;
  }

  set val(num v) {
    v = v.clamp(0,1);
    if (_val==v) return;
    super.val = v; _meter.p2 = _v2p(v);
  }

  void split(GroupNode g) {  // nicely visible
    g ..back(_line) ..front(_meter);
  }
}

Meter meter(GroupNode g, XY p1, XY sz)
  => g.add(new Meter(p1,sz));

var sliderW = 6, sliderClr = 'lightgrey';

typedef void OnVal(num);

class Slider extends LineWgt {
  Shape _thumb; OnVal onVal;

  Slider(XY p, XY sz): super(p,sz) {
    _line ..width = sliderW ..color = sliderClr ..p2 = p+sz;
    _thumb = handle(this,_v2p(_val)) ..movable((XY p,Shape,bool) {
      p = _line.closeTo(p);
      if (_thumb.p != p) val = _p2v(p);
      return p;
    });
  }

  set color(clr) { _thumb ..fill = clr; }

  set val(num v) {
    super.val = v; _thumb.moveTo(_v2p(v));
    if (null!=onVal) onVal(val);
  }

  void split(GroupNode g) {  // nicely visible
    g ..back(_line) ..front(_thumb);
  }
}

Slider slider(GroupNode g, XY p1, XY p2)
  => g.add(new Slider(p1,p2));

loadLineLikeHelpers() {
  ExtraMethods.addAll(GroupNode, {
    const Symbol('meter'):  meter,
    const Symbol('slider'): slider,
  });
}

// eof
