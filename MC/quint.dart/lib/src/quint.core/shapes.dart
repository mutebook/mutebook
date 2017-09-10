part of quint.core;

typedef XY OnMoveShape(XY,Shape,bool); // TODO remove bool, split off OnMoveBegin, rename -> Begin/Move/End, as touches
typedef void OnUserBeginMoveShape(XY,Shape);

abstract class Shape extends SceneNode {
  Shape();

  XY get p;
  set p(XY);

  XY get sz => xy0();

  set cursor(String c) => setAttr('cursor',c);
  String get cursor    => getAttr('cursor');

  var _moveStream, _onUserBeginMoveShape, _onMoveShape;

//  Object setupMove([MoveEvent onBegin, MoveEvent onMove, MoveEvent onEnd]) {
//    return scene.setupMove(el, onBegin, onMove, onEnd);
//  }

  Object setupMove([MoveEvent onBegin, MoveEvent onMove, MoveEvent onEnd]) {
    return System.oneStream(el.onMouseDown,el.onTouchStart).listen((e) {
      e.preventDefault();
      scene.onMoveBegin(scene.pointerPos(e,true),onBegin,onMove,onEnd);
    });
  }

  void fixed() { // not movable
    if (null!=_moveStream) _moveStream.cancel();
    cursor = null;
    _onUserBeginMoveShape = _onMoveShape = _moveStream = null;
  }

  void movable([OnMoveShape f, OnUserBeginMoveShape b]) {
    cursor = 'pointer';
    _onUserBeginMoveShape = b; _onMoveShape = f;

    var off;
    _moveStream = setupMove(
      (XY xy) {
        off = p - xy;
        if (null!=_onUserBeginMoveShape) _onUserBeginMoveShape(p,this);
      },
      (XY xy) {
        moveTo(xy + off, true);
      }
    );
  }

  bool _isMoving = false; // prevents recursion
  void moveTo(XY to,[bool byUser=false]) {
    if (!_isMoving) {
      _isMoving = true;
      if (null != _onMoveShape) {
        XY to_ = _onMoveShape(to,this,byUser);
        if (null != to_) to = to_;
      }
      p = to;
      _isMoving = false;
    }
  }
}

abstract class ShapeP0 extends Shape {
  XY _p;
  ShapeP0(this._p);

  void _attrP();

  void _attrs() {
    super._attrs();
    _attrP();
  }

  XY get p    => _p;
  set p(XY p) { _p = p; _attrP(); }
}

abstract class ShapePR extends ShapeP0 {
  num _r;
  ShapePR(XY p0, this._r): super(p0);

  void _attrR();

  void _attrs() {
    super._attrs();
    _attrR();
  }

  num get r     => _r;
  set r(num r)  { _r = r; _attrR(); }
}

abstract class ShapeP12 extends Shape {
  XY _p1, _p2;
  ShapeP12(this._p1,this._p2);

  void _attrP1();
  void _attrP2();

  void _attrs() {
    super._attrs();
    _attrP1(); _attrP2();
  }

  XY get p      => _p1;
  set p(XY p)   { _p2 += p-_p1; _p1 = p; _attrP1(); _attrP2(); }

  XY get p1     => _p1;
  set p1(XY p)  { _p1 = p; _attrP1(); }

  XY get p2     => _p2;
  set p2(XY p)  { _p2 = p; _attrP2(); }

  XY get sz     => _p2 - _p1;
  set sz(XY xy) { p2 = p1 + xy; _attrP2(); }

  void set(XY p1, XY p2) { _p1 = p1; _p2 = p2; _attrP1(); _attrP2(); }

  XY  ctr() => (_p1 + _p2) / 2;
  num lgt() => (_p2 - _p1).lgt();
}

abstract class ShapePS extends Shape {
  List<XY> _ps; XY _sc, _tr;
  ShapePS(this._ps);

  void _attrD();

  void _attrs() {
    super._attrs();
    _attrD();
  }

  XY get p => _ps.isEmpty ? xy0() : _ps.first;

  set p(XY p)  {
    if (_ps.isEmpty) return;
    var off = p - _ps.first;
    _ps = _ps.map((p) => p+off); _attrD();
  }

  List<XY> get ps     => _ps;
  set ps(List<XY> ps) { _ps = ps; _attrD(); }

  XY get sc           => _sc;
  set sc(XY sc)       { _sc = sc; _attrD(); }

  XY get tr           => _tr;
  set tr(XY tr)       { _tr = tr; _attrD(); }

  void set(List<XY> ps, XY sc, XY tr) {
    _ps = ps; _sc = sc; _tr = tr; _attrD();
  }

  List<XY> get trans {
    var ps = _ps;
    if (null!=_sc) ps = ps.map((p) => p.mul(_sc));
    if (null!=_tr) ps = ps.map((p) => p + _tr);
    return ps.toList();
  }
}

class Line extends ShapeP12 {
  Line(XY p1, XY p2): super(p1,p2) {
    el = new LineElement();
    _attrs();
  }

  void _attrP1() {
    setAttr('x1',_p1.x); setAttr('y1',_p1.y);
  }

  void _attrP2() {
    setAttr('x2',_p2.x); setAttr('y2',_p2.y);
  }

  // the point closest to p
  XY closeTo(XY p) {
    XY d = _p2 - _p1, e = p - _p1;
    num f = d.dot(e), t = (f/d.mag()).clamp(0,1);
    return _p1 + d*t;
  }
}

Line line(GroupNode g, XY p1, XY p2, [stroke, fill])
  => g.add(new Line(p1,p2) ..stroke=stroke ..fill=fill);

class Rect extends ShapeP12 {
  num _r; // r - round corners
  Rect(XY p1, XY p2): super(p1,p2) {
    el = new RectElement();
    _attrs();
  }

  void _attrP1() {
    setAttr('x',_p1.x); setAttr('y',_p1.y);
    setAttr('width',sz.x); setAttr('height',sz.y);
  }

  void _attrP2() {
    setAttr('width',sz.x); setAttr('height',sz.y);
  }

  void _attrR() {
    setAttr('rx',_r); setAttr('ry',_r);
  }

  void _attrs() {
    super._attrs();
    _attrR();
  }

  XY get tl => _p1;
  XY get tr => xy(_p2.x, _p1.y);
  XY get bl => xy(_p1.x, _p2.y);
  XY get br => _p2;
}

Rect rect(GroupNode g, XY p1, XY p2, [stroke, fill])
  => g.add(new Rect(p1,p2) ..stroke=stroke ..fill=fill);

class Ellipse extends ShapeP0 {
  XY _r;
  Ellipse(XY p0, this._r): super(p0) {
    el = new EllipseElement();
    _attrs();
  }

  XY get sz => _r * 2;

  void _attrP() {
    setAttr('cx',_p.x); setAttr('cy',_p.y);
  }

  void _attrR() {
    setAttr('rx',_r.x); setAttr('ry',_r.y);
  }

  void _attrs() {
    super._attrs();
    _attrR();
  }
}

Ellipse ellipse(GroupNode g, XY p, XY r, [stroke, fill])
  => g.add(new Ellipse(p,r) ..stroke=stroke ..fill=fill);

class Circle extends ShapePR {
  Circle(XY p, num r): super(p,r) {
    el = new CircleElement();
    _attrs();
  }

  XY get sz => xy1(_r * 2);

  void _attrP() {
    setAttr('cx',_p.x); setAttr('cy',_p.y);
  }

  void _attrR() {
    setAttr('r',_r);
  }

  // the point on the perimeter closest to xy
  XY closeTo(XY p) => _p + (p -= _p).unit() * _r;

  // the point on the perimeter at angle a (rad)
  XY atr(a) => xy(_p.x + _r * math.cos(a),_p.y - _r * math.sin(a));

  // the angle (rad) from centre to xy
  num atp(XY p) {
    p = (closeTo(p) - _p) / _r; // unit vector
    var rad = -math.asin(p.y);
    if (p.x<0) rad =  Math.PI-rad; if (rad<0) rad += Math.PIPI;
    return rad;
  }
}

Circle circle(GroupNode g, XY p, num r, [stroke, fill])
  => g.add(new Circle(p,r) ..stroke=stroke ..fill=fill);

var _handleR = System.isTouch() ? 9 : 6, _handleFill = 'yellow';

Circle handle(GroupNode g, XY p, [color])
  => circle(g, p, _handleR, null, null!=color ? color : _handleFill);

class Label extends ShapeP0 {
  String _s, _font; num _size;
  Label(XY p0, this._s, [num size, String family]): super(p0) {
    el = new TextElement();
    _attrs();
  }

  String get s          => _s;
  set s(String s)       { _s = s; _attrText(); }

  String get font       => _font;
  set font(String font) { _font = font; _attrFont(); }

  num get size          => _size;
  set size(num size)    { _size = size; _attrSize(); }

  void _attrP()         { setAttr('x',_p.x); setAttr('y',_p.y); }
  void _attrFont()      { setAttr('font-family',_font); }
  void _attrSize()      { setAttr('font-size',_size);   }
  void _attrText()      { el.text = _s;                 }

  void _attrs() {
    super._attrs();
    _attrP();
    _attrFont(); _attrSize(); _attrText();
  }
}

Label label(GroupNode g, XY p, String s, [fill='black', stroke='none'])
  => g.add(new Label(p,s) ..fill=fill ..stroke=stroke);

class Path extends ShapePS {
  Path([List<XY> ps]): super(null==ps ? [] : ps) {
    el = new PathElement();
    _attrs();
  }

  String _seg(XY p) => p.x.toStringAsFixed(1) + ',' + p.y.toStringAsFixed(1) + ' ';

  String _d() {
    String d = '';
    if (_ps.length > 0) {
      var ps = trans;
      d += 'M' + _seg(ps.first);
      for (var p in ps.skip(1)) d += 'L' + _seg(p);
    }
    return d;
  }

  void _attrD() {
    setAttr('d',_d());
  }

  void _attrs() {
    super._attrs();
    _attrD();
  }
}

Path path(GroupNode g, List<XY> ps, [stroke, fill])
  => g.add(new Path(ps) ..stroke=stroke ..fill=fill);

class Spline extends Path {
  bool _stripEnds;
  Spline(this._stripEnds,[List<XY> ps]): super(ps);

  String _bezier() {
    // Cubic Bezier spline through points (Catmull-Rom to Bezier)
    // http://processingjs.nihongoresources.com/code%20repository/?get=Catmull-Rom-to-Bezier
    int o = _stripEnds ? 1 : 0, l = _ps.length;
    if (l < 3+2*o) return '';

    var ps = trans;
    XY pT = ps[0], p1 = ps[0+o], p2 = ps[1+o], p3 = ps[2+o];

    String d = 'M' + _seg(p1);

    for (int cmr=6, i=2+o; ;) {
      XY d1 = (p2 - pT)/cmr, d2 = (p3 - p1)/cmr;
      d += 'C' + _seg(p1+d1) + _seg(p2-d2) + _seg(p2);
      if (++i>l-o) break;
      pT = p1; p1 = p2; p2 = p3; p3 = ps[(i<l)?i:i-1];
    }

    return d;
  }

  String _d() => _bezier();
}

Spline spline(GroupNode g, bool stripEnds,[List<XY> ps, stroke, fill])
  => g.add(new Spline(stripEnds,ps) ..stroke=stroke ..fill=fill);

loadShapeHelpers() {
  ExtraMethods.addAll(GroupNode, {
    const Symbol('line'):     line,
    const Symbol('rect'):     rect,
    const Symbol('ellipse'):  ellipse,
    const Symbol('circle'):   circle,
    const Symbol('handle'):   handle,
    const Symbol('label'):    label,
    const Symbol('path'):     path,
    const Symbol('spline'):   spline,
  });
}

// eof
