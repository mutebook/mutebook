part of quint.ui;

typedef void OnClick();

class UiElement extends WrappedElement {
  UiElement(el_sel): super(el_sel);

  static wrap(Element el) => new UiElement(el);

  void _disable(bool on) {}
  void enable([bool on=true]) => _disable(!on);
  void disable()              => _disable(true);

  UiElement append(UiElement child) {
    el.append(child.el);
    return child;
  }

  Button button([String text,OnClick f])
    => append(new Button(text) ..onClick=f);

  Button2 button2([texts,OnToggle f])
    => append(new Button2(texts) ..onToggle=f);

  Button2Group button2group([OnToggle f])
    => new Button2Group(this) ..onToggle=f;

  ButtonX buttonX(List<String> ls,[OnToggle f])
    => append(new ButtonX(ls) ..onToggle=f);

  Range range(num min, num max, num step, [OnValue f])
    => append(new Range(min,max,step) ..onValue=f);

  Range rangeGain([Gain gain, bool vert=false]) {
    var rg = new RangeGain(gain);
    // http://stackoverflow.com/questions/15935837/how-to-display-a-range-input-slider-vertically
    if (vert) rg.el.setAttribute('orient','vertical');
    return append(rg) as RangeGain ..makeLabel('◁',vert);
  }

  Check check([OnCheck f])
    => append(new Check() ..onCheck=f);

  RadioGroup radioGroup(String group)
    => new RadioGroup(this,group);

  Select select([OnSelect f])
    => append(new Select() ..onSelect=f);

  FileUpload fileUpload([String accept='', OnFile f])
    => append(new FileUpload() ..el.accept = accept ..onFile=f);
}

class UiClickableElement extends UiElement {
  UiClickableElement(el_sel): super(el_sel) {
    el.onClick.listen((e) => _onClick());
  }

  OnClick onClick;
  void _onClick() {
    if (null!=onClick) onClick();
  }

  void click() => el.click();
}

// eof
