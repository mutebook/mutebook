import '../applets/tuningspiral.dart';
import './ex.dart';

class Ex02 extends Ex {
  Ex02(el,sz): super(el,sz);

  PanelBox ui;
  exUi() {
    ui = (new Panel.bottomRight(el)).uiBox;
    int i = 0; ii() => (++i).toString();
    bs.add(ui.button(ii(), () => tempDiaScale(false)));
    bs.add(ui.button(ii(), () => justDiaScale(false,false)));
    bs.add(ui.button(ii(), () => tempDiaScale(true)));
    bs.add(ui.button(ii(), () => justDiaScale(true,false)));
    bs.add(ui.button(ii(), () => justDiaScale(true,true)));
  }

  tempDiaScale(bool w) {
    var sec = 1.3; var t1 = tones[0], t2 = tones[1], l = [];
    if (w) l.add(()=>actPch(t2,Tun.pch(8)));
    for (int i in [0,2,4,5,7,9,11,12])
      l ..add(sec) ..add(()=>actPch(t1,Tun.pch(8 + i/12)));
    run(l);
  }

  justDiaScale(bool w, bool chrom) {
    var sec = 1.3; var t1 = tones[0], t2 = tones[1], l = [];
    num r(r) => Tun.rat(r).toPch().val;
    if (w) l.add(()=>actPch(t2,Tun.pch(8)));
    for (num rr in [1,9/8,5/4,4/3,3/2,5/3,chrom ? 48/25 : 30/16,2/1])
      l ..add(sec) ..add(()=>actPch(t1,Tun.pch(8 + r(rr))));
    run(l);
  }
}

main() {
  Tun.concertA = 412;
  var app = new WrappedResizableElement('#app');
  new Ex02(app,app.availableSquare());
}

// eof
