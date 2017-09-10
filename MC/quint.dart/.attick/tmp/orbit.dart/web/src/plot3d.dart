import 'dart:html';
import 'plot.dart';

import 'package:vector_math/vector_math.dart';
import 'package:three/three.dart';
import 'package:three/extras/controls/orthographic_trackball_controls.dart';
//import 'package:three/extras/core/curve_utils.dart' as CurveUtils;
import 'package:three/extras/core/shape_utils.dart' as ShapeUtils;

class Controls extends OrthographicTrackballControls {
  Controls(Camera camera, Element element) : super(camera, element);

  @override
  mousemove(MouseEvent e) {
    super.mousemove(e);
    update();
  }
}

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

class Plot3D extends Plot {
  Camera camera;
  Scene scene;
  Renderer renderer;
  Controls controls;

  Plot3D(Element container, [int w, int h]): super(container, w, h);

  void init() {
    camera = new OrthographicCamera(0.0, 0.0, 0.0, 0.0, -2000.0, 1000.0);
    camera.position.x = 200.0;
    camera.position.y = 100.0;
    camera.position.z = 200.0;

    controls = new Controls(camera, container);
    controls.rotateSpeed = 1.0;
    controls.noZoom = true;
    controls.noPan = true;

    controls.staticMoving = true;
    controls.addEventListener('change', (_) => render());

    scene = new Scene();

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

    //

    renderer = new WebGLRenderer();

    setCanvas(renderer.domElement);
  }

  resize_() {
    camera.left = -w / 2;
    camera.right = w / 2;
    camera.top = h / 2;
    camera.bottom = -h / 2;

    camera.updateProjectionMatrix();

    renderer.setSize(w - 2, h - 2);

    controls.handleResize();
    controls.update();
  }

  void render() {
    renderer.render(scene, camera);
  }
}

