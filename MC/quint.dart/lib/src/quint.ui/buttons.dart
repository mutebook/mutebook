part of quint.ui;

class Button extends UiClickableElement {
  Button([String s]): super(new ButtonElement()) {
    text = s;
  }

  ButtonElement get el => super.el;

  void _disable(bool on) { el.disabled = on; }

  String get text    => el.text;
  set text(String s) { el.text = s; }
}

typedef void OnToggle(int);

// with a number states
class ButtonX extends Button {
  List<String> labels; int state=0;
  ButtonX([this.labels]) {
    if (null==labels) labels = [''];
    _setText();
  }

  void _setText() { text = labels[state]; }

  void _onClick() {
    super._onClick();
    toggle();
  }

  OnToggle onToggle;

  void setState([int n]) { // no action
    state = (null==n) ? ++state : n;
    if (state >= labels.length) state = 0;
    _setText();
  }

  void toggle([int n]) {
    setState(n);
    if (null!=onToggle) onToggle(state);
  }
}

// with two states
class Button2 extends ButtonX {
  Button2([texts]) {
    if (null==texts) texts = '';
    assert(texts is String || texts is List<String>);
    if (texts is String) labels = [texts,texts];
    else labels = texts;
    _setText();
  }

  bool get isDown => state > 0;

  void setState([int n]) {
    super.setState(n);
    toggleClass('down',isDown);
  }

  void setDown(bool down) => setState(down ? 1 : 0);
}

class Button2Group {
  UiElement parent;
  int state = 0; List<Button2> bs = [];
  Button2Group(this.parent);

  OnToggle onToggle;

  void _onToggle(int bn, int i) {
    for (int i=0; i<bs.length; ++i)
      if (i!=bn) bs[i].setState(0);
    state = (i > 0) ? bn+1 : 0;
    if (null!=onToggle) onToggle(state);
  }

  Button2 button2([texts]) {
    var bn = bs.length;
    var b = new Button2(texts)
      ..onToggle = (i) => _onToggle(bn, i);
    bs.add(b); parent.append(b);
    return b;
  }
}

// eof
