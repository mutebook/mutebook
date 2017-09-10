part of graph_qa;

enum XYZ {
  x, y, z
}

abstract class Graph {
  final Renderer renderer;

  Scene scene; OrthographicCamera camera;

  Graph(this.container, this.w, this.h)
    : renderer = new WebGLRenderer()
  {
//    if (null == w) w = container.clientWidth;
//    if (null == h) h = container.clientHeight;

    var de = renderer.domElement;
//    de.attributes = ({
//      'style': 'position: relative; left: 1px; top: 1px',
//    });
//    container.append(de);

    scene = new Scene();
    camera = new OrthographicCamera(0.0, 0.0, 0.0, 0.0,
        -double.MAX_FINITE, double.MAX_FINITE);
    camera.position.x = 0.0;
    camera.position.y = 0.0;
    camera.position.z = 0.1;  // some small

    setRange([0,0,0],[1,1,1]);
  }

  void resize([int w_, int h_]) {
    if (null != w_) w = w_;
    if (null != h_) h = h_;

    renderer.setSize(w-2, h-2);
//    container.style.width  = '${w}px';
//    container.style.height = '${h}px';
    container.width  = '${w}px';
    container.height = '${h}px';

    _updateCamera();
    _updateControls();

    render();
  }

  void render() {
    renderer.render(scene, camera);
  }

  Vector3 min, max, range;

  double get minX => min[0];
  double get minY => min[1];
  double get minZ => min[2];
  double get maxX => max[0];
  double get maxY => max[1];
  double get maxZ => max[2];

  void setRange(List<num> min_, List<num> max_) {
    min = v3(min_); max = v3(max_); range = max-min;
    _updateCamera();
  }

  Vector3 scale(Vector3 v) {
    return range.clone().multiply(v);
  }

  void _updateCamera() {
    camera.updateProjectionMatrix();
  }

  void _updateControls() {
  }

  void xAxis(String label, [List<num> ticks]) {
    scene.add(axisLine(XYZ.x, ticks, 0x000000));
  }

  void yAxis(String label, [List<num> ticks]) {
    scene.add(axisLine(XYZ.y, ticks, 0x000000));
  }

  void zAxis(String label, [List<num> ticks]) {
    scene.add(axisLine(XYZ.z, ticks, 0x000000));
  }

  //----------------------------------------------------------------------------

  static var _0 = v3([0,0,0]);

  Line line(List ps, int color, [int type = LineStrip]) {
    var g = new Geometry();
    for (var p in ps) g.vertices.add(v3(p));
    return new Line(g, lineMaterial(color), type);
  }

  Line axisLine(XYZ xyz, [List<num> ticks, int color = 0x000000]) {
    var g = new Geometry();

    var p1, p2;
    switch (xyz) {
      case XYZ.x:
        p1 = v3([minX,0,0]); p2 = v3([maxX,0,0]);
        break;
      case XYZ.y:
        p1 = v3([0,minY,0]); p2 = v3([0,maxY,0]);
        break;
      case XYZ.z:
        p1 = v3([0,0,minZ]); p2 = v3([0,0,maxZ]);
        break;
    }

    g.vertices..add(p1)..add(p2);

    if (null!=ticks) {
      var tz = 5.0, tt;
      switch (xyz) {
        case XYZ.x: tt = [0,tz/h.toDouble(),0];
          break;
        case XYZ.y: tt = [tz/w.toDouble(),0,0];
          break;
        case XYZ.z: tt = [0,0,tz/h.toDouble()]; // TODO
          break;
      }

      var tv = v3(tt).multiply(range);
      var v = (p2-p1).normalize();

      for (var t in ticks) {
        var pv = v * t.toDouble();
        g.vertices..add(pv+tv)..add(pv-tv);
      }
    }
    return new Line(g, lineMaterial(color), LinePieces);
  }

  Line circle(num r,num x, num y, int color) {
    const segments = 16;
    var g = new CircleGeometry(r,segments);
    g.vertices.removeAt(0);
    var c = new Line(g, lineMaterial(color));
    c..translateX(x)..translateY(y);
    scene.add(c);
    return c;
  }
//  geometry.vertices.shift();
//  scene.add( new THREE.Line( geometry, material ) );

  //----------------------------------------------------------------------------

  Map<num,LineBasicMaterial> _cacheLineMaterials = {};

  Material lineMaterial(int color) {
    if (_cacheLineMaterials.containsKey(color)) {
      return _cacheLineMaterials[color];
    } else {
      final mat = new LineBasicMaterial(color: color, linewidth: 2);
      _cacheLineMaterials[color] = mat;
      return mat;
    }
  }
}

