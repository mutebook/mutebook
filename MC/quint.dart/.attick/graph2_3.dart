part of graph_qa;

class Controls extends OrthographicTrackballControls {
  Controls(Camera camera, Element element)
  : super(camera, element);

  @override
  mousemove(MouseEvent e) {
    super.mousemove(e);
    update();
  }
}

class Graph2D extends Graph {
  Graph2D(Element container, [int w, int h])
  : super(container, w, h) {
    resize();
  }

  void _updateCamera() {
    var pad = scale(v3([0.06,0.06]));
    camera.left   = minX-pad.x;
    camera.right  = maxX+pad.x;
    camera.top    = maxY+pad.y;
    camera.bottom = minY-pad.y;
    super._updateCamera();
  }
}

class Graph3D extends Graph {
  Controls controls;

  Graph3D(Element container, [int w, int h])
  : super(container, w, h) {
    controls = new Controls(camera, container);
    controls.rotateSpeed = 1.0;
    controls.noZoom = true;
    controls.noPan = true;

    controls.staticMoving = true;
    controls.addEventListener('change', (_) => render());

    resize();
  }

  void _updateCamera() {
    camera.left   = -w/2;
    camera.right  =  w/2;
    camera.top    =  h/2;
    camera.bottom = -h/2;
    super._updateCamera();
  }

  void _updateControls() {
    controls.handleResize();
    controls.update();
  }
}

// eof
/*
    var geometry;
    var material;
    var light;

    // Lines

    material = new LineBasicMaterial(color: 0xff0000);
    geometry = new Geometry();
    geometry.vertices.add(new Vector3(0.0, 0.0, 0.0));
    geometry.vertices.add(new Vector3(100.0, 0.0, 0.0));
    geometry.vertices.add(new Vector3(0.0, 0.0, 0.0));
    geometry.vertices.add(new Vector3(0.0, 100.0, 0.0));
    geometry.vertices.add(new Vector3(0.0, 0.0, 0.0));
    geometry.vertices.add(new Vector3(0.0, 0.0, 100.0));

    var line = new Line(geometry, material);
    scene.add(line);

    // curve

    var curve = new BezierCurve3(new Vector3(-100.0, 0.0, 0.0),
        new Vector3(-5.0, 15.0, 0.0), new Vector3(20.0, 15.0, 0.0),
        new Vector3(10.0, 0.0, 0.0));

    geometry = new Geometry();
    geometry.vertices = curve.getPoints(50);

    material = new LineBasicMaterial(color: 0x00ff00);
    var curveObject = new Line(geometry, material);
    scene.add(curveObject);

 */
/*
import 'dart:html';

import 'package:vector_math/vector_math.dart';
import 'package:three/three.dart';
//import 'package:three/extras/core/curve_utils.dart' as CurveUtils;
import 'package:three/extras/core/shape_utils.dart' as ShapeUtils;

class BezierCurve3 extends Curve3D {
  Vector3 v0, v1, v2, v3;
  BezierCurve3(this.v0, this.v1, this.v2, this.v3) : super();

  Vector3 getPoint(t) {
    var tx, ty, tz;

    tx = ShapeUtils.b3(t, v0.x, v1.x, v2.x, v3.x);
    ty = ShapeUtils.b3(t, v0.y, v1.y, v2.y, v3.y);
    tz = ShapeUtils.b3(t, v0.z, v1.z, v2.z, v3.z);

    return new Vector3(tx, ty, tz);
  }
}

*/
