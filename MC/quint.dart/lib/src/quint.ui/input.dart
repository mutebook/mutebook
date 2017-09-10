part of quint.ui;

typedef void OnValue(num);

abstract class UiInputElement extends UiClickableElement {
  UiInputElement(InputElementBase el): super(el);
  InputElementBase get el => super.el;

  void _disable(bool on) { el.disabled = on; }
}

class UiElementGroup {
  List<UiElement> els = [];

  void add(UiElement el) => els.add(el);

  void enable([bool on=true]) {
    for (var el in els) el.enable(on);
  }

  void disable() => enable(false);
}

abstract class UiLabelMixin {
  LabelElement labelEl;

  Element get el; // supplied by the mixed-to class

  void makeLabel(String text,[bool vert=false]) {
    assert(null!=el && null!=el.parent);
    if (null==text) return;

    labelEl = new LabelElement() ..text=text;

    // remove and re-insert in span
    Element span = new SpanElement();
    if (vert) span..classes.add('col');
    el.parent.insertBefore(span,el);
    span ..append(el) ..append(labelEl);
  }

  void align(ALIGN align) {
    assert(null!=labelEl);
    var span = labelEl.parent;
    switch (align) {
      case ALIGN.L:
        span.style.margin='0 auto 0 0';
        break;
      case ALIGN.R:
        span.style.margin='0 0 0 auto';
        break;
      default:
    }
  }

  set labelColor(color) {
    if (null!=labelEl && null!=color) labelEl.style.color = color;
  }
}

class UiRangeElement extends UiInputElement {
  UiRangeElement(RangeInputElementBase el,num min,num max,num step): super(el) {
    el ..min=min.toString() ..max=max.toString() ..step=step.toString();
    el.onInput.listen((e) => _onValue());
  }

  RangeInputElementBase get el => super.el;

  OnValue onValue;
  void _onValue() {
    if (null!=onValue) onValue(el.valueAsNumber);
  }

  num get val         => el.valueAsNumber;
  void setVal(num v)  { el.valueAsNumber = v;   }
  set val(num v)      { setVal(v); _onValue();  }
}

class Number extends UiRangeElement {
  Number(num min,num max,num step): super(new NumberInputElement(),min,max,step);
  NumberInputElement get el => super.el;
}

class Range extends UiRangeElement with UiLabelMixin {
  Range(num min,num max,num step): super(new RangeInputElement(),min,max,step);
  RangeInputElement get el => super.el;
}

typedef void OnCheck(bool checked);

class Check extends UiInputElement with UiLabelMixin {
  Check(): super(new CheckboxInputElement());
  CheckboxInputElement get el => super.el;

  bool get isChecked      => el.checked;
  set isChecked(bool b)   { el.checked = b; }

  OnCheck onCheck;
  void _onClick() {
    super._onClick();
    if (null!=onCheck) onCheck(isChecked);
  }
}

class Radio extends UiInputElement with UiLabelMixin {
  Radio(): super(new RadioButtonInputElement());
  RadioButtonInputElement get el => super.el;
}

typedef void OnRadio(String);
class RadioGroup extends UiElementGroup {
  UiElement parent; String group;
  List<String> _ls = [];

  RadioGroup(this.parent, this.group);

  OnRadio onRadio;

  Radio radio(String label,[value]) {
    if (null==value) value = label;
    var r = new Radio() ..el.name = group ..el.value = value.toString();
    parent.append(r);
    els.add(r); _ls.add(label);
    r.makeLabel(label);
    r.onClick = () {
      if (null!=onRadio) onRadio(r.el.value);
    };
    return r;
  }

  List<Radio> radios(Iterable<String> ls)
    => ls.map((l) => radio(l)).toList();

  void click([what]) {
    if (els.isEmpty) return;
    int i;
    if (null==what)
      i = 0;
    else if (what is int)
      i = what;
    else {
      assert (what is String);
      i = listIndex(_ls, what, 0);
    }
    (els[i] as Radio).click();
  }
}

typedef void OnFile(File);
typedef void OnSelect(int);

class FileUpload extends UiInputElement  {
  OnFile onFile;

  FileUpload(): super(new FileUploadInputElement()) {
    el.onChange.listen((e) {
      if (null!=onFile)
        onFile(el.files.isEmpty ? null : el.files.first);
    });
  }
  FileUploadInputElement get el => super.el;
}

class Select extends UiElement  {
  OnSelect onSelect;

  Select(): super(new SelectElement()) {
    el.onChange.listen((e) {
      if (null!=onSelect)
        onSelect(el.selectedIndex);
    });
  }
  SelectElement get el => super.el;
}

// eof
