import '../applets/tuningspiral.dart';
import './ex.dart';

class Ex01 extends Ex {
  Ex01(el,sz): super(el,sz);

  PanelBox ui;
  exUi() {
    ui = (new Panel.bottomRight(el)).uiBox;
    int i = 0; ii() => (++i).toString();
    bs.add(ui.button(ii(), () => exAudibleRange()));
    bs.add(ui.button(ii(), () => exOctaves()));
    bs.add(ui.button(ii(), () => exBeats(8,8,8.6,4)));
    bs.add(ui.button(ii(), () => exBeats(8,8,9.3,8)));
    bs.add(ui.button(ii(), () => exBeats(8,9-1/20,9+1/20,6)));
//    bs.add(ui.button(ii(), () => tempScale()));
  }

  exAudibleRange() {
    var t1 = tones[0];
    num sec = 8;
    run([
      () => actSlide(t1,sp.minPch,sp.maxPch,sec),
      sec + 1,
      () => actSlide(t1,sp.maxPch,sp.minPch,sec/2),
      sec/2+2,
    ]);
  }

  exOctaves() {
    num sec = .9; var t1 = tones[0], l = [];
    for (var p in [5,6,7,8,9,10,11,12,11,10,9,8,7,6,5])
      l ..add(sec) ..add(()=>actPch(t1,Tun.pch(p)));
    run(l);
  }

  exBeats(p0,p1,p2,sec) {
    p0 = Tun.pch(p0); p1 = Tun.pch(p1); p2 = Tun.pch(p2);
    var t1 = tones[0], t2 = tones[1];
    run([
      () => actPch(t1,p1), () => actPch(t2,p0),
      sec/2,
      () => actSlide(t1,p1,p2, 3 * sec),
      3.6 * sec,
    ]);
  }

  tempScale() {
    var sec = 1.3; var t1 = tones[0], l = [];
    for (int i=0; i<=12; ++i)
      l ..add(sec) ..add(()=>actPch(t1,Tun.pch(8 + i/12)));
    run(l);
  }
}

main() {
  Tun.concertA = 412;
  var app = new WrappedResizableElement('#app');
  new Ex01(app,app.availableSquare());
}

// eof
