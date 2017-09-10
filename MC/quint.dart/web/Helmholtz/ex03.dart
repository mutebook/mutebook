import '../applets/tuningspiral.dart';
import './ex.dart';

class Ex03 extends Ex {
  Ex03(el,sz): super(el,sz);

  PanelBox ui;
  exUi() {
    ui = (new Panel.bottomRight(el)).uiBox;
    int i = 0; ii() => (++i).toString();
    bs.add(ui.button(ii(), () => tempChords()));
    bs.add(ui.button(ii(), () => justChords()));
    bs.add(ui.button(ii(), () => temp()));
    bs.add(ui.button(ii(), () => just()));
  }

  var t = .7;

  tempC(num step) {
    return Tun.pch(8 + step/12);
  }

  List<num> jss;
  num r(r) => Tun.rat(r).toPch().val; //FIXME D changed from 9/8 to 10/9; more adjustments
  _makeJust() {
    var js = [8+r(1),0,8+r(9/8),0,8+r(5/4),8+r(4/3),0,8+r(3/2),0,8+r(5/3),0,8+r(30/16)];
    jss = [];
    for (var j in js) jss.add(j-2);
    for (var j in js) jss.add(j-1);
    for (var j in js) jss.add(j);
    for (var j in js) jss.add(j+1);
  }

  justC(num step) {
    return Tun.pch(jss[step+24]);
  }

  chords(C) {
    var t1 = tones[0], t2 = tones[1], t3 = tones[2];
    c(t,st) => () => actPch(t,C(st));
    run([
      c(t1,0),
      c(t2,4),
      c(t3,7),
      5 * t,
      c(t1,0),
      (tempC==C) ? c(t2,2) : () => actPch(t2,Tun.pch(8+r(10/9))),
      c(t3,9),
      5 * t,
      c(t1,-1),
      c(t2,2),
      c(t3,7),
      5 * t,
      c(t1,0),
      c(t2,4),
      c(t3,7),
      5,
    ]);
  }

  bach(C) {
    var t1 = tones[0], t2 = tones[1], t3 = tones[2], t4 = tones[3];
    c(t,st) => () => actPch(t,C(st));
    d(t,o) => (tempC==C) ? c(t,2+12*o) : () => actPch(t,Tun.pch(8+r(10/9)+o));
    run([
      c(t1,0-12), c(t2,4-12), c(t3,7-12),
      c(t4,0),t,c(t4,4),t,c(t4,7),t,c(t4,12),t,c(t4,16),t,c(t4,7),t,c(t4,12),t,c(t4,16),t,

      c(t1,0-12), d(t2,-1), c(t3,9-12),
      c(t4,0),t,d(t4,0),t,c(t4,9),t,d(t4,1),t,c(t4,17),t,c(t4,9),t,d(t4,1),t,c(t4,17),t,

      c(t1,-1-12), c(t2,2-12), c(t3,7-12),
      c(t4,-1),t,c(t4,2),t,c(t4,7),t,c(t4,14),t,c(t4,17),t,c(t4,7),t,c(t4,14),t,c(t4,17),t,

      c(t1,0-12), c(t2,4-12), c(t3,7-12),
      c(t4,0),t,c(t4,4),t,c(t4,7),t,c(t4,12),t,c(t4,16),t,c(t4,7),t,c(t4,12),t,c(t4,16),t,
    ]);
  }

  temp() {
    bach(tempC);
  }

  just() {
    _makeJust();
    bach(justC);
  }

  tempChords() {
    chords(tempC);
  }

  justChords() {
    _makeJust();
    chords(justC);
  }
}

main() {
  Tun.concertA = 412;
  var app = new WrappedResizableElement('#app');
  new Ex03(app,app.availableSquare());
}

// eof
