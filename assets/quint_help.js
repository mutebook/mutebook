/* eslint-disable */

QM_proxied_ = {};

class QM_Proxy {
  constructor (dObj) {
    this.dObj = dObj;
  }

  static $ (self) { // copies prototype methods
    if (self)
      self = new this(self);
    return self;
  }
}

class QM_GroupNode extends QM_Proxy {
  label (p, s, center) {
    return QM_Label.$(mc.label.$(this.dObj, p, s, center));
  }

  line (p1, p2, color, width) {
    return QM_Line.$(mc.line.$(this.dObj, p1, p2, color, width));
  }

  spline (stripEnds, color, fill) {
    return QM_Spline.$(mc.spline.$(this.dObj, stripEnds, [], color, fill));
  }

  circle (p, r, color) {
    return QM_Circle.$(mc.circle.$(this.dObj, p, r, color));
  }

  handle (p, color) {
    return QM_Circle.$(mc.handle.$(this.dObj, p, color));
  }

  grid (p, sz, n, l) {
    return QM_GridNode.$(mc.grid.$(this.dObj, p, sz, n, l));
  }

  polarGrid (p, r, r1, withLabels) {
    return QM_PolarGridNode.$(mc.polarGrid.$(this.dObj, p, r, r1, withLabels));
  }

  loglinGrid (p, sz, minX, maxX, minY, maxY, labelsX, labelsY) {
    return QM_LoglinGridNode.$(mc.loglinGrid.$(this.dObj, p, sz, minX, maxX, minY, maxY, labelsX, labelsY));
  }

  spiral (p, minRad, maxRad, minTurn, maxTurn, aOff) {
    return QM_Spiral.$(mc.spiral.$(this.dObj, p, minRad, maxRad, minTurn, maxTurn, aOff));
  }

  pitchSpiral (p, minRad, maxRad, minPch, ctrPch, maxPch) {
    return QM_PitchSpiral.$(mc.pitchSpiral.$(this.dObj, p, minRad, maxRad, minPch, ctrPch, maxPch));
  }
}

class QM_LabelledGroupNode extends QM_GroupNode {
}

class QM_GridNode extends QM_LabelledGroupNode {
}

class QM_PolarGridNode extends QM_GridNode {
  toXY (r, deg) {
    return mc.polarGrid.toXY(this.dObj, r, deg);
  }
}

class QM_LoglinGridNode extends QM_GridNode {
  toXY (x, y) {
    return mc.loglinGrid.toXY(this.dObj, x, y);
  }

  fromXY (x, y) {
    return mc.loglinGrid.fromXY(this.dObj, x, y);
  }

  xLegend (s) {
    return mc.loglinGrid.xLegend(this.dObj, s);
  }

  yLegend (s) {
    return mc.loglinGrid.yLegend(this.dObj, s);
  }
}

class QM_SceneNode extends QM_Proxy {
  stroke (color) {
    mc.node.stroke(this.dObj, color);
  }

  fill (color) {
    mc.node.fill(this.dObj, color);
  }

  color (color) {
    mc.node.color(this.dObj, color);
  }

  width (width) {
    mc.node.width(this.dObj, width);
  }
}

class QM_Shape extends QM_SceneNode {
  movable (onMove) {
    mc.shape.movable(this.dObj, onMove);
  }

  moveTo (p) {
    mc.shape.moveTo(this.dObj, p);
  }
}

class QM_Label extends QM_Shape {
  center () {
    mc.abel.center();
  }

  leftCenter () {
    mc.abel.leftCenter();
  }
}

class QM_Line extends QM_Shape {
  set (p1, p2) {
    mc.line.set(this.dObj, p1, p2);
  }
}

class QM_Circle extends QM_Shape {
  closeTo (p) {
    return mc.circle.closeTo(this.dObj, p);
  }

  atr (r) {
    return mc.circle.atr(this.dObj, r);
  }

  atp (p) {
    return mc.circle.atp(this.dObj, p);
  }
}

class QM_Path extends QM_SceneNode {
  set (ps, sc, tr) {
    mc.spline.set(this.dObj, ps, sc, tr);
  }

  sc (sc) {
    mc.spline.sc(this.dObj, sc);
  }

  tr (tr) {
    mc.spline.tr(this.dObj, tr);
  }
}

class QM_Spline extends QM_Path {
}

class QM_Widget extends QM_GroupNode {
}

class QM_DiscWgt extends QM_Widget {
}

class QM_Spiral extends QM_DiscWgt {
}

class QM_PitchSpiral extends QM_Spiral {
  markPitch (pch, colorMark, colorRad) {
    mc.pitchSpiral.markPitch(this.dObj, pch, colorMark, colorRad);
  }

  toXY (pch) {
    return mc.pitchSpiral.toXY(this.dObj, pch);
  }
}

class QM extends QM_Proxy {
  fbo () {
    const [fg, bg, over] = mc.qm.fbo(this.dObj);
    return [QM_GroupNode.$(fg), QM_GroupNode.$(bg), QM_Elem.$(over)];
  }

  sz (m = 0) {
    const [x, y] = mc.qm.sz(this.dObj);
    m *= 2;
    return [x - m, y - m];
  }
}

function QuintMachine (divId, whRatio = 2, withOver = true) {
  return QM.$(mc.qm.$(divId, whRatio, withOver));
}

class QM_Elem extends QM_Proxy {
  controls () {
    return this.qmControls || (this.qmControls = this.addChild('div', 'controls'));
  }

  addChild (type, cls) {
    let child = QM_Elem.$(this.dObj.appendChild(document.createElement(type)));
    if (cls)
      child.dObj.classList.add(cls);
    return child;
  };

  addLabel (tx) {
    let child = this.addChild('label');
    child.dObj.innerText = tx;
    return child;
  };

  addInput (type) {
    let child = this.addChild('input', type);
    child.dObj.type = type;
    return child;
  };

  addButton (tx, toggle = false, on) {
    const btn = this.addChild('button'), d = btn.dObj;
    d.innerText = tx;
    if (toggle)
      d.classList.add('toggle');
    d.onclick = on;
    btn.toggle = () => d.classList.toggle('down');
    btn.centerAt = function (p) {
      const [x, y] = p;
      let style = d.style;
      style.position = 'absolute';
      style.left = (x - d.clientWidth/2) + 'px';
      style.top  = (y - d.clientHeight/2) + 'px';
    };
    return btn;
  };

  addRange (min, max, step, on) {
    const rge = this.addInput('range'), d = rge.dObj;
    d.min = min; d.max = max; d.step = step;
    d.onchange = d.onmousemove = on;

    rge.value = () => rge.dObj.value;
    rge.setValue = (value) => rge.dObj.value = value;

    return rge;
  };

  addRadio (name, label, on) {
    let rio = this.addInput('radio');
    if (name)
      rio.dObj.name = name;
    if (label)
      this.addLabel(label);
    if (on)
      rio.onclick = on;
    rio.check = () => rio.dObj.checked = true;
    return rio;
  };

  br () {
    this.addChild('br');
    return this;
  };
}

// eof