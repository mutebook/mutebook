part of graph_qa;

class GraphErrorBar extends Graph2D {

  GraphErrorBar(Element container, [int w, int h]) : super(container, w, h);

  void bar(num x, num y, num err, int color) {
    scene.add(line([[x,y-err],[x,y+err]],color));
  }

  void bars(List<num> vals, List<num> errs, int color1, int color2) {
    assert(vals.length==errs.length);
    var ps = [];
    for (int i=0; i<vals.length; ++i) {
      var x = i+1, y = vals[i];
      ps.add([x,y]);
      bar(x,y,errs[i],color1);
    }
    scene.add(line(ps,color2));
  }
}

// eof