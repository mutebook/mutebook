import 'package:quint/quint.dart';
import 'package:quint/quint.tuning.dart';

main() {
  harmonics('#app');
}

harmonics(el_sel) {
  var app = new WrappedResizableElement(el_sel);
  XY avail = app.availableRectangle();

  num FUND = Tun.cpsC4().val;
  int pad = 6, hh=avail.x~/6, numParts=9;
  var m = new QuintMachine(app,xy(avail.x,(numParts+1)*hh+(numParts+2)*pad)); // FIXME fit on smaller screens

  int ww = m.sz.x - 2*pad, wh = (m.sz.y - (numParts+2)*pad) ~/ (numParts+1);

  initAudio(m.el, () {
    XY tr(int i) => xy(pad, (i + 1) * pad + i * wh);
    XY gn = xy(8, 2);

    var addWave = new AddWave();
    m.bg.add(new WaveGadget(addWave, tr(0), xy(ww, wh), gn, 'complex waveform'));

    addWave.normAmp = 1;

    Gain mix = new Gain()
      ..sendToDest();

    List aws = [];
    for (int i = 1; i <= numParts; ++i) {
      var aw = m.bg.add(new AudioWaveGadget(tr(i), xy(ww, wh), gn, 'f×$i'))
        ..sliders(false, 0, true)
        ..fund = FUND
        ..cps = i
        ..onUpdate = (() => addWave.update())
        ..out.sendTo(mix);

      addWave.parts.add(aw.wave);
      aws.add(aw);
    }

    for (var aw in aws) aw.safeStart();

    onButton(int i) {
      switch (i) {
        case 0: // off
          for (var aw in aws) {
            aw.sla.val = 0;
            aw.slp.val = 0;
          }
          break;
        case 1: // sin
          int i = 0;
          for (var aw in aws) {
            aw.sla.val = (0 == i) ? 1 : 0;
            aw.slp.val = 0;
            ++i;
          }
          break;
        case 2: // tri
          int i = 0;
          for (var aw in aws) {
            ++i;
            aw.sla.val = (1 == i % 2) ? 1 / (i * i) : 0;
            aw.slp.val = (1 == i % 4) ? 0 : Math.PI;
          }
          break;
        case 3: // rect
          int i = 0;
          for (var aw in aws) {
            aw.sla.val = (0 == i % 2) ? 1 / (i + 1) : 0;
            aw.slp.val = 0;
            ++i;
          }
          break;
        case 4: // saw
          int i = 0;
          for (var aw in aws) {
            aw.sla.val = 1 / (i + 1);
            aw.slp.val = 0;
            ++i;
          }
          break;
      }
    }

    var ui = (new Panel.topRight(m.el)
      ..pull()).uiBox.col();
    var bs = ui.row().button2group(onButton);
    var au = ui.row();

    bs
      ..button2('sin')
      ..button2('tri')
      ..button2('rect')
      ..button2('saw');

    au.rangeGain(mix)
      ..val = Gain.soft / 2;
  });
}

// eof
