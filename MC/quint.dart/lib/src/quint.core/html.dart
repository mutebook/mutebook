part of quint.core;

// extending html

class WrappedElement {
  Element _el;
  WrappedElement(el_sel): _el = elSel(el_sel);

  static Element elSel(el_sel) { // Element or selector
    var el =
      (el_sel is Element)         ? el_sel :
      (el_sel is WrappedElement)  ? el_sel.el :
      querySelector(el_sel);
    assert(el is Element);
    return el;
  }

  Element get el => _el;

  bool isShown()             => !hasClass('hidden');
  void show([bool b = true]) { toggleClass('hidden',!b); }
  void hide()                => show(false);

  set width(int w)  { el.style.width  = '${w}px'; }
  set height(int h) { el.style.height = '${h}px'; }

  set color(c)      { el.style.color = c;      }
  set background(b) { el.style.background = b; }

  void addClass(cls) {
    assert(cls is String || cls is Iterable<String>);
    if (cls is Iterable) el.classes.addAll(cls);
    else el.classes.add(cls);
  }

  bool remClass(String cls)
    => el.classes.remove(cls);

  bool hasClass(String cls)
    => el.classes.contains(cls);

  bool toggleClass(String cls,[bool add])
    => el.classes.toggle(cls,add);

  XY  get sz => XY.fromWH(el.client);
  set sz(XY xy) {
    _el.style
      ..width = '${xy.x}px' ..height = '${xy.y}px';
  }

  XY get bsz {
    var r = el.getBoundingClientRect();
    return xy(r.width,r.height);
  }
}

WrappedElement wrapElement(el_sel) => new WrappedElement(el_sel);

typedef void OnWindowSize(int w, int h);

class WrappedResizableElement extends WrappedElement {
  int w, h;

  WrappedResizableElement(el_sel, [XY sz]): super(el_sel) {
    w = ((null!=sz && null!=sz.x) ? sz.x : el.clientWidth).round();
    h = ((null!=sz && null!=sz.y) ? sz.y : el.clientHeight).round();

    window.onResize.listen((e) => _callOnWindowSize());
  }

  OnWindowSize _onWindowSize;
  void _callOnWindowSize() {
    if (null!=_onWindowSize) _onWindowSize(window.innerWidth, window.innerHeight);
  }

  set onWindowSize(OnWindowSize f) {
    _onWindowSize = f;
    _callOnWindowSize();
  }

  int get minSize => 0;
  void resize([int w, int h]) {
    if (null == w) w = this.w;
    this.w = w = Math.max(w,minSize);
    if (null == h) h = this.h;
    this.h = h = Math.max(h,minSize);

    sz = xy(w,h);
  }

  void innerSquare() {
    int d = sz.max;
    resize(d,d);
  }

  XY availableRectangle([int minX=0,int minY=0,int maxX,int maxY]) {
    Element p = el.parent; assert(null!=p);
    num pw = p.clientWidth, ph = p.clientHeight;

    // TODO hack
    if (768>=pw) ph = pw;

    if (null==maxX) maxX = pw;
    if (null==maxY) maxY = ph;

    return xy(pw.clamp(minX,maxX),ph.clamp(minY,maxY));
  }

  XY availableSquare() => xy1(availableRectangle().min);
}

// eof
