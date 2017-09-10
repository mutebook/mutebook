part of quint.core;

// scene graph

abstract class SceneNode {
  GroupNode parent; Scene scene; SvgElement el;

  SceneNode();

  void _setScene(Scene s) { scene = s; }

  void setElem(int index,Element e) {
    remElem();
    if (null != (el=e)) {
      parent.el.children.insert(index,el);
    }
  }

  void remElem() {
    if (null != el) el.remove();
  }

  void _attrs() {}

  String getAttr(String k) => el.attributes[k];
  void setAttr(String k, v) {
    v = (null==v) ? '' : v.toString();
    if (v.isEmpty) el.attributes.remove(k);
    else el.attributes[k] = v;
  }

  void setAttrs(Map<String,String> attrs) {
    attrs.forEach((k,v) => setAttr(k,v));
  }

  bool isShown()        => getAttr('display') != 'none';
  void show([bool b = true]) => setAttr('display', b ? '' : 'none');
  void hide()           => show(false);

  set stroke(color)   => setAttr('stroke',color);
  String get stroke   => getAttr('stroke');
  set fill(color)     => setAttr('fill',color);
  String get fill     => getAttr('fill');

  set color(col)      { this ..stroke=col .. fill=col; }

  set width(w)        => setAttr('stroke-width', w);
  set lineCap(cap)    => setAttr('stroke-linecap', cap);
  set lineJoin(join)  => setAttr('stroke-linejoin', join);
  set dashArray(pat)  => setAttr('stroke-dasharray', pat);

  void solidStroke()  { dashArray = null;   }
  void dottedStroke() { dashArray = '1,3';  }
  void dashedStroke() { dashArray = '3,2';  }
}

class GroupNode extends SceneNode {
  List<SceneNode> nodes = []; Trf _trf = trf0();

  GroupNode() {
    el = new GElement();
    _attrs();
  }

  Trf  get trf      => _trf;
  set trf(Trf trf)  { _trf = trf; _attrTR(); }

  XY   get p        => _trf.tr;
  set p(XY p)       { trf = new Trf(p); }
  XY   get gp       => null==parent ? p : parent.p+p; // combined group p

  void _attrTR() {
    setAttr('transform',_trf.svgString());
  }

  void _attrs() {
    super._attrs();
    _attrTR();
  }

  bool isRoot()     => null == parent;
  bool get isEmpty  => nodes.isEmpty;
  GroupNode group() => add(new GroupNode());

  // on demand nested bg - fg
  GroupNode _bg, _fg;

  GroupNode get bg => (null!=_bg) ? _bg : (_bg = back(new GroupNode()));
  GroupNode get fg => (null!=_fg) ? _fg : (_fg = front(new GroupNode()));

  void _setScene(Scene s) {
    super._setScene(s);
    for (var n in nodes) n._setScene(s);
  }

  SceneNode insert(int index,SceneNode n) {
    if (null != n.parent) n.parent.rem(n);
    n.parent = this; n._setScene(scene);
    index = Math.min(index,nodes.length);
    nodes.insert(index,n); n.setElem(index,n.el);
    return n;
  }

  SceneNode add(SceneNode n)    => insert(nodes.length,n);

  void addAll(List<SceneNode> ns) {
    var ns_ = new List<SceneNode>.from(ns);  // add may modify ns
    for (var n in ns_) add(n);
  }

  SceneNode front(SceneNode n)  => add(n);
  SceneNode back(SceneNode n)   => insert(0,n);

  void rem(SceneNode n) {
    assert(nodes.indexOf(n) >= 0);
    nodes.remove(n); n.remElem();
    n.parent = n.scene = null;
  }

  void frontSelf() { parent.front(this); }
  void backSelf()  { parent.back(this);  }
  void remSelf()   { parent.rem(this);   }

  void remAll() {
    while (nodes.length>0)
      rem(nodes.first);
  }

  void noSuchMethod(Invocation inv) {
    try {
      return ExtraMethods.apply(this, GroupNode, inv);
    } catch(e) {
      return super.noSuchMethod(inv);
    }
  }
}

typedef void MoveEvent(XY);
class Scene extends GroupNode {
  static final bool isFirefox = Device.isFirefox;
  Container container;

  Scene(this.container) {
    scene = this; el = container.innerElem;
    _attrs();
  }

  void _attrs() {
    super._attrs();
    stroke = 'black'; width = 1; fill = 'none';
    lineCap = 'round';
  }

  // hooks
  String cursor;

  // moving
  XY _lastPointerPos = xy0(); int offX = 0, offY = 0;

  XY pointerPos(UIEvent e, bool first) {
    /* FIXME
        FF does not have offsetLeft/offsetTop
        FF jerky when moving mouse - sometimes reporting wrong pointer coordinates
     */
    if (first) {
      var dof = System.isFF() ? xy0() : el.documentOffset;
      offX = window.scrollX - dof.x;
      offY = window.scrollY - dof.y;
    }

    var cl;
    if (e is MouseEvent) {
      cl = e.client;
    } else {
      var ts = (e as TouchEvent).targetTouches;
      if (ts.isEmpty) return _lastPointerPos;
      cl = ts.first.client;
    }

    _lastPointerPos = xy(cl.x+offX,cl.y+offY);
    return _lastPointerPos;
  }

  Object onBeginEvent(f(XY)) =>
    System.oneStream(el.onMouseDown,el.onTouchStart).listen((e) {
      e.preventDefault(); f(pointerPos(e,true));
    });

  MoveEvent _onMove, _onEnd;
  var _onPointerMove, _onPointerUp;

  void onMoveBegin(XY p, MoveEvent onBegin, MoveEvent onMove, [MoveEvent onEnd]) {
    if (null!=onBegin) onBegin(p);

    _onMove = onMove;
    _onPointerMove = System.oneStream(document.onMouseMove,document.onTouchMove).listen((e) {
      e.preventDefault();
      onMoveMove(pointerPos(e,false));
    });

    _onEnd = onEnd;
    _onPointerUp = System.oneStream(document.onMouseUp,document.onTouchEnd).listen((e) {
      e.preventDefault();
      onMoveEnd(pointerPos(e,false));
    });
  }

  void onMoveMove(XY p) {
    if (null!=_onMove) _onMove(p);
  }

  void onMoveEnd(XY p) {
    _onPointerMove.cancel(); _onPointerUp.cancel();
    if (null!=_onEnd) _onEnd(p);
    _onMove = _onEnd = null;
  }
}

abstract class LeafNode extends SceneNode {
  LeafNode();
}

// eof
