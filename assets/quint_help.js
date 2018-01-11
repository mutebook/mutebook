/* eslint-disable */

QM_proxied_ = {};

class QM_Proxy {
  static $ (self) { // copies prototype methods
    if (self) {
      if (!QM_proxied_[this]) {
        QM_proxied_[this] = true;

        const to = self.__proto__, from = this.prototype;
        for (const prop of Object.getOwnPropertyNames(this.prototype))
          if ('constructor' !== prop)
            to[prop] = from[prop];
      }
    }

    return self;
  }
}

class QM_GroupNode extends QM_Proxy {
  line (p1, p2, color, width) {
    return QM_Line.$(mc.line.$(this, p1, p2, color, width));
  }

  spline (stripEnds, color, fill) {
    return QM_Spline.$(mc.spline.$(this, stripEnds, [], color, fill));
  }

  grid (p, sz, n, l) {
    return QM_GroupNode.$(mc.grid.$(this, p, sz, n, l));
  }
}

class QM_Line extends QM_Proxy {
  set (p1, p2) {
    mc.line.set(this, p1, p2);
  }
}

class QM_Spline extends QM_Proxy {
  set (ps, sc, tr) {
    mc.spline.set(this, ps, sc, tr);
  }

  sc (sc) {
    mc.spline.sc(this, sc);
  }

  tr (tr) {
    mc.spline.tr(this, tr);
  }
}

class QM extends QM_Proxy {
  fbo () {
    const [fg, bg, over] = mc.qm.fbo(this);
    return [QM_GroupNode.$(fg), QM_GroupNode.$(bg), QM_Elem.$(over)];
  }

  sz (m = 0) {
    const [x, y] = mc.qm.sz(this);
    m *= 2;
    return [x + m, y + m];
  }
}

function QuintMachine (divId, whRatio = 2, withOver = true) {
  return QM.$(mc.qm.$(divId, whRatio, withOver));
}

class QM_Elem extends QM_Proxy {
  addChild (type, cls) {
    let child = QM_Elem.$(this.appendChild(document.createElement(type)));
    if (cls)
      child.classList.add(cls);
    return child;
  };

  addLabel (tx) {
    let child = this.addChild('label');
    child.innerText = tx;
    return child;
  };

  addInput (type, cls) {
    let child = this.addChild('input', cls);
    child.type = type;
    return child;
  };

  addRadio (name, label) {
    let child = this.addInput('radio');
    if (name)
      child.name = name;
    if (label)
      this.addLabel(label);
    return child;
  };

  br () {
    this.addChild('br');
    return this;
  };
}

// eof