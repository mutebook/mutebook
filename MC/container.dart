part of quint.core;

abstract class Container extends WrappedResizableElement {
  Element innerElem; Scene scene;

  Container(el_sel, this.innerElem, [XY sz])
  : super(el_sel,sz) {
    el.style.position = 'relative';
    el.append(innerElem);
    innerElem.style
      ..position = 'absolute'
      ..width    = '100%' ..height='100%';
    resize(w,h);

    scene = new Scene(this);
  }

  int get minSize => 32;

  GroupNode get bg => scene.bg;
  GroupNode get fg => scene.fg;

  bool isMouseDown = false;
  void setMouseRotate(void move(XY)) {
    el.onMouseDown.listen((MouseEvent e) { isMouseDown = true; });
    el.onMouseUp.listen((MouseEvent e)   { isMouseDown = false; });
    el.onMouseMove.listen((MouseEvent e) {
      if (isMouseDown) move(XY.fromXY(e.movement));
    });
  }
}

class SvgContainer extends Container {
  SvgContainer(el_sel, [XY sz])
  : super(el_sel, new SvgSvgElement(), sz);

  SvgSvgElement get svgElem => innerElem;
}

// eof
