part of quint.core;

class Shape3 {
  M4 mat; Shape _shape;

  Shape3(this.mat);

  Shape get shape => _shape;

  void updateShape();
}

class PolyShape3 {
  List<Shape3> ls = [];

  void add(Shape3 s) {
    ls.add(s);
  }

  void update() {
    ls.forEach((s) => s.updateShape());
  }
}

class Line3 extends Shape3 {
  XYZ _p1, _p2;
  Line3(this._p1,this._p2,M4 mat): super(mat) {
    _shape = new Line(xy0(),xy0()) .._shape3 = this;
    updateShape();
  }

  XYZ get p1     => _p1;
  set p1(XYZ p)  { _p1 = p; }

  XYZ get p2     => _p2;
  set p2(XYZ p)  { _p2 = p; }

  updateShape() {
    var line = _shape as Line;
    line.p1 = p1.project(mat).flatten();
    line.p2 = p2.project(mat).flatten();
  }
}

class Spline3 extends Shape3 {
  List<XYZ> _ps = [];
  Spline3(bool stripEnds,M4 mat): super(mat) {
    _shape = new Spline(stripEnds) .._shape3 = this;
    updateShape();
  }

  void updateShape() {
    var spline = _shape as Spline;
    List<XY> ps2 = [];
    _ps.forEach((XYZ p) {ps2.add(p.project(mat).flatten());});
    spline.ps = ps2;
  }

  void set ps(List<XYZ> ps) {
    _ps = ps;
    updateShape();
  }
}

// eof
