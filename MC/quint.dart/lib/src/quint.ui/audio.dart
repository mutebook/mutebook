part of quint.ui;

initAudio(Element el, then()) {
  void go() {
    Audio.init();
    then();
  }

  if (System.isTouch()) {
    var div = el.append(
        new HeadingElement.h1() ..style.textAlign = 'center'
          ..text='Touch here to begin');
    var ts;
    ts = el.onTouchStart.listen((e) {
      e.preventDefault();
      div.remove();
      if (null!=ts) go(); // prevent multiple
      ts.cancel(); ts = null;
    });
  } else {
    go();
  }
}

class RangeGain extends Range {
  Gain gai;

  RangeGain([Gain gain]): super(0,1,.01) {
    gai = (null==gain) ? new Gain() : gain;
    setVal(amp);
  }

  void _onValue() {
    amp = el.valueAsNumber;
    super._onValue();
  }

  num get amp => gai.amp2;
  set amp(num amp) {
    gai.amp2 = amp;
    setVal(amp);
  }
}

// eof
