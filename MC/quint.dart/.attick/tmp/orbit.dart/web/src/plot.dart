import 'dart:html';

abstract class Plot {
  final Element container, canvas;
  int w, h;

  Plot(this.container, this.w, this.h) {
    if (null == w) w = container.clientWidth;
    if (null == h) h = container.clientHeight;
  }

  void setCanvas(Element canvas) {
    container.append(canvas);
    resize();
  }

  void resize([int w_, int h_]) {
    if (null != w_) w = w_;
    if (null != h_) h = h_;
    resize_();
    render();
  }
}