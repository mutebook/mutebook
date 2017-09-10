part of quint.widgets;

String labelFont = 'Arial'; num labelFontSize = 12;

class GridNode extends GroupNode {
  GridNode(XY p, XY sz, XY n, [String l]) {
    _make(p, sz, n, l);
  }

  void _make(XY p_, XY sz, XY n, String l) {
    p = p_;

    var d = xy(sz.x/n.x,sz.y/n.y);

    for (int i=0; i<=n.x; ++i) {
      var x = i*d.x;
      line(this,xy(x,0),xy(x,sz.y)) ..dottedStroke();
    }

    for (int i=0; i<=n.y; ++i) {
      var y = i*d.y;
      line(this,xy(0,y),xy(sz.x,y)) ..dottedStroke();
    }

    if (null!=l)
      label(this,xy(4,labelFontSize),l,'none','blue')
        ..font=labelFont ..size=labelFontSize;
  }
}

GroupNode grid(GroupNode g, XY p, XY sz, XY n, [String l]) {
  return g.add(new GridNode(p,sz,n,l));
}

loadGridHelpers() {
  ExtraMethods.addAll(GroupNode, {
    const Symbol('grid'):   grid,
  });
}

// eof
