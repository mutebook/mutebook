part of graph_qa;

class GraphCurve2 extends Graph2D {

  GraphCurve2(Element container, [int w, int h]) : super(container, w, h);

  void curve2(List<num> xs, List<num> ys, int color) {
    assert(xs.length==ys.length);
    var ps = [];
    for (int i=0; i<xs.length; ++i) {
      ps.add([xs[i],ys[i]]);
    }
    scene.add(line(ps,color));
  }
}

class GraphCurve3 extends Graph3D {

  GraphCurve3(Element container, [int w, int h]) : super(container, w, h);

  void curve3(List<num> xs, List<num> ys, List<num> zs, int color) {
    assert(xs.length==ys.length && ys.length==zs.length);
    var ps = [];
    for (int i=0; i<xs.length; ++i) {
      ps.add([xs[i],ys[i],zs[i]]);
    }
    scene.add(line(ps,color));
  }
}

// eof