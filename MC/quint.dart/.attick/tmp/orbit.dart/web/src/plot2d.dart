import 'dart:html';
import 'plot.dart';

class Plot2D extends Plot {
  final Element container;
  final CanvasRenderingContext2D context;

  final List yData;

  Plot2D(Element container, [int w, int h]): super(container, w, h);
}
