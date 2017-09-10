library helmex;

import '../applets/tuningspiral.dart';

class Ex extends TuningSpiralApplet {
  Ex(el,sz): super(el,sz) {
    exUi();
  }

  var bs = new UiElementGroup();

  exUi() {
  }

  actPch(SpiralTone tone, Pch pch) {
    tone.pch = pch;
  }

  actSlide(SpiralTone tone, Pch p1, Pch p2, num sec) {
    num grain = .01, steps = (sec/grain).truncate(), step = (p2-p1).val / steps;
    Async.periodic(grain, (i) {
      if (i >= steps) return false;
      tone.pch = p1 + Tun.pch(i*step);
    });
  }

  reset() {
    for(var t in tones) t.pch = Tun.pchLow();
  }

  disableButtons() => bs.disable();
  enableButtons()  => bs.enable();

  allOn() {
    disableButtons();
    reset();
    volume.amp = Gain.loud;
  }

  allOff() {
//    volume.amp = 0;
    reset();
    enableButtons();
  }

  void run(List ls) {
    List l = []; num delay = .3;
    l ..add(allOn) ..add(delay) ..addAll(ls)
      ..add(delay)
      ..add((){volume.amp = 0;})
      ..add(delay)
      ..add(allOff)
      ..add(delay)
      ..add((){volume.amp = Gain.loud;});
    new Sequence.from(l) ..run();
  }
}

// eof
