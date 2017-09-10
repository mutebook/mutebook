part of quint.ui;

class Panel extends UiElement {
  DivElement tgDiv, uiDiv; PanelBox tgBox; PanelRow uiBox;

  Panel._(parent_el_sel)
  : super(new DivElement()) {
    WrappedElement.elSel(parent_el_sel).append(el);
    addClass('quint_panel');
    if (System.isTouch()) {
      addClass('touch');
      _preloadUI();
    }

    tgBox  = new PanelBox._(el) ..addClass('tg');
    uiBox  = new PanelRow._(el);
  }

  static bool _uiLoaded = false;
  static var _idsToLoad = ['load_check_on','load_check_off','load_radio_on','load_radio_off'];

  void _preloadUI() {
    if (_uiLoaded) return; _uiLoaded = true;
    var d = new DivElement(); el.append(d);
    _idsToLoad.forEach((id) => d.append(new DivElement() ..id=id));
  }

  factory Panel(el_sel) {
    return new Panel._(el_sel);
  }

  factory Panel.topLeft(el_sel,[XY pad]) {
    if (null==pad) pad = xy0();
    return new Panel._(el_sel) ..addClass(['top','left'])
      ..el.style.margin = '${pad.y}px 0 0 ${pad.x}px';
  }

  factory Panel.topRight(el_sel,[XY pad]) {
    if (null==pad) pad = xy0();
    return new Panel._(el_sel) ..addClass(['top','right'])
      ..el.style.margin = '${pad.y}px ${pad.x}px 0 0';
  }

  factory Panel.bottomLeft(el_sel,[XY pad]) {
    if (null==pad) pad = xy0();
    return new Panel._(el_sel) ..addClass(['bottom','left'])
      ..el.style.margin = '0 0 ${pad.y}px ${pad.x}px';
  }

  factory Panel.bottomRight(el_sel,[XY pad]) {
    if (null==pad) pad = xy0();
    return new Panel._(el_sel) ..addClass(['bottom','right'])
      ..el.style.margin = '0 ${pad.x}px ${pad.y}px 0';
  }

  void center() { // after it is made
    XY p = (XY.fromWH(el.parent.client) - bsz) / 2;
    el.style ..left = '${p.x}px' ..top = '${p.y}px';
  }

  ButtonX _pull;
  void pull([bool show=false]) {
    if (null==_pull) {
      var ls = ['▶','◀'];
      if (hasClass('right')) ls = ls.reversed.toList(); // TODO somehow to css
      _pull = tgBox.buttonX(ls, (int ln) => uiBox.show(ln > 0))
        ..addClass(['system','square']);
    }
    _pull.toggle(show ? 1 : 0);
  }
}

class PanelBox extends UiElement {
  PanelBox._(Element parent): super(new DivElement()) {
    parent.append(el);
  }

  void _set(bool face, ALIGN pad, [String caption]) {
    addClass('box');
    if (face) addClass('face');
    switch (pad) {
      case ALIGN.H:
        addClass('padH');
        break;
      case ALIGN.V:
        addClass('padV');
        break;
      case ALIGN.A:
        addClass('padA');
        break;
      default:
    }
    if (null!=caption)
      el.append(new DivElement() ..text = caption ..classes.add('caption'));
  }

  PanelBox row() => new PanelRow._(el);
  PanelBox col() => new PanelCol._(el);

  PanelBox box([String caption]) => col() .._set(true,  ALIGN.A, caption);
  PanelBox padH()                => col() .._set(false, ALIGN.H);
  PanelBox padV()                => col() .._set(false, ALIGN.V);
  PanelBox padA()                => col() .._set(false, ALIGN.A);
}

class PanelRow extends PanelBox {
  PanelRow._(Element parent): super._(parent) {
    addClass('row');
  }
}

class PanelCol extends PanelBox {
  PanelCol._(Element parent): super._(parent) {
    addClass('col');
  }
}

// eof
