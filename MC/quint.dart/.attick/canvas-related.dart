part of quint.core;
// container

class CvsContainer extends Container {
  CvsContainer(Element el)
  : super(el,new CanvasElement()) {
    renderer = new CvsRenderer(innerElem);
  }

  CanvasElement get cvsElem => innerElem;
}

// renderers


abstract class Renderer {
  render(Scene);
}

class CvsRenderer extends Renderer {
  CanvasRenderingContext2D _ctx;

  CvsRenderer(Element el) {
    assert(el is CanvasElement);
    _ctx = (el as CanvasElement).context2D;
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = 'black';
  }

  render(Scene s) => renderNode(s, Transform.origin());

  renderNode(Node n, Transform trf) {
    if (n is GroupNode) {
      var tr = trf + n.trf;
      _ctx.translate(tr.dx,tr.dy);
      for (var n_ in n.nodes) renderNode(n_, tr);
      _ctx.stroke();
    } else if (n is LeafNode) {
      n.shape.renderCvs(this);
    }
  }

  lineTo(XY xy) {
    _ctx.lineTo(xy.x, xy.y);
  }

  moveTo(XY xy) {
    _ctx.moveTo(xy.x, xy.y);
  }

  ellipse(XY c, XY r) {
    try {
      // TODO not everyone has ellipse
      _ctx.ellipse(c.x, c.y, r.x, r.y, 0, 0, _2PI, false);
    } catch (e) {
    }
  }

  circle(XY c, num r) {
    _ctx..moveTo(c.x+r, c.y)..arc(c.x, c.y, r, 0, _2PI, false);
  }

  font(String f) {
    _ctx.font = f;
  }

  fillText(XY xy, String s) {
    _ctx.fillText(s, xy.x, xy.y);
  }

  strokePath(List<XY> ps) {
    if (ps.length < 2) return;
    var p = ps.first; _ctx.moveTo(p.x, p.y);
    for (p in ps.skip(1)) _ctx.lineTo(p.x, p.y);
  }

  strokeBezierPath(List<XY> bs) {
    if (bs.length < 4) return;
    assert(1 == bs.length % 3);

    var p = bs.first; _ctx.moveTo(p.x, p.y);
    for (int i=1, l=bs.length; i<l; i+=3) {
      var cp1 = bs[i], cp2 = bs[i+1], p = bs[i+2];
      _ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p.x, p.y);
    }
  }
}

class SvgRenderer extends Renderer {
  SvgRenderer(Element el) {
    assert(el is SvgSvgElement);
    strokeColor(el,'black'); strokeWidth(el,'1'); fill(el,'none');
  }

  render(Scene s) => renderNode(s);

  renderNode(Node n) {
    if (n is GroupNode) {
      if (null == n.el) n.setElem(new GElement());
      setAttr(n.el, 'transform', n.trf.svgString());
      for (var n_ in n.nodes) renderNode(n_);
    } else if (n is LeafNode) {
      if (null == n.el) n.setElem(n.shape.svgElem());
      n.shape.renderSvg(n.el);
    }
    strokeColor(n.el,n._s);
  }

  static String getAttr(SvgElement el, String k) => el.attributes[k];

  static setAttr(SvgElement el, String k, String v) {
    var ea = el.attributes;
    if (null==v || v.isEmpty) ea.remove(k); else ea[k] = v;
  }

  static setAttrs(SvgElement el, Map<String,String> as) {
    var ea = el.attributes;
    as.forEach((k,v) {
      if (null==v || v.isEmpty) ea.remove(k); else ea[k] = v;
    });
  }

  static strokeColor(SvgElement el, String s) => setAttr(el, 'stroke',          s);
  static strokeWidth(SvgElement el, String s) => setAttr(el, 'stroke-width',    s);
  static fill       (SvgElement el, String s) => setAttr(el, 'fill',            s);
  static lineCap    (SvgElement el, String s) => setAttr(el, 'stroke-linecap',  s);
  static lineJoin   (SvgElement el, String s) => setAttr(el, 'stroke-linejoin', s);

  static bool isVisible(SvgElement el)        => getAttr(el, 'visibility') != 'hidden';

  static show(SvgElement el, [bool b = true]) => setAttr(el, 'visibility', b ? '' : 'hidden');
  static hide(SvgElement el)                  => show(false);
}

// shapes

// Line
renderCvs(CvsRenderer c) => c..moveTo(p1)..lineTo(p2);

// Rect
renderCvs(CvsRenderer c) {
  c ..moveTo(tl)
    ..lineTo(tr)
    ..lineTo(br)
    ..lineTo(bl)
    ..lineTo(tl);
}

// Ellipse
renderCvs(CvsRenderer cvs) {
  cvs.ellipse(c, r);
}

// Circle
renderCvs(CvsRenderer cvs) {
  cvs.circle(c, r);
}

// Text
renderCvs(CvsRenderer c) {
  c.font('${size}px $family');
  c.fillText(p, s);
}

// Spline
renderCvs(CvsRenderer c) {
  c.strokeBezierPath(bs);
}

