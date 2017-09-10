part of quint.mach;

class QuintMachine extends SvgContainer {
  QuintMachine(el_sel, [XY sz]): super(el_sel,sz) {
    addClass('quint'); if (System.isTouch()) addClass('touch');
  }
}

// eof
