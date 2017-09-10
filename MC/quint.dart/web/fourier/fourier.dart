import 'package:quint/quint.dart';
import 'package:quint/quint.tuning.dart';

main() {
  fourier('#app');
}

// FIXME: slp, slf - ramping;
// TODO: instead of adding signals from partial waves, create complex wavetable ?
fourier(el_sel) {
  var app = new WrappedResizableElement(el_sel);
  XY avail = app.availableRectangle();

  num FUND = Tun.cpsC4().val / 2;
  int pad = 6, hh=90, numParts=5;
  var m = new QuintMachine(app,xy(avail.x,(numParts+3)*hh+(numParts+16)*pad));

  int ww = m.sz.x - 2*pad, wh = (m.sz.y - (numParts+16)*pad) ~/ (numParts+3);

  initAudio(m.el, () {
    XY tr(int i, num off) => xy(pad, (i + 1) * pad + (i + off) * wh);
    XY gn = xy(8, 2);

    var addWave = new AddWave(), trAddWave = tr(numParts, .2);
    m.bg.add(new WaveGadget(addWave, trAddWave, xy(ww, wh), xy(8, 2), 'complex waveform'));
    addWave.normAmp = 1;

    Gain mix = new Gain()
      ..sendToDest();

    List aws = []; // waves: parts and probe

    var probe = m.bg.add(new AudioWaveGadget(tr(numParts + 1, .4), xy(ww, wh), gn, 'probe'))
      ..sliders(true, -Math.PI2, true)
      ..fund = FUND
      ..amp = 1
      ..out.sendTo(mix);

    var probeWave = probe.wave;
    aws.add(probeWave);

    var productWave = new WaveForm();
    m.bg.add(new WaveGadget(productWave, tr(numParts + 2, .6), xy(ww, wh), gn, 'product'));
    productWave.normAmp = 1;

    var productMeter = meter(m.bg, tr(numParts + 2, 1.1), xy(ww, 0));
    productMeter.split(m.bg);

    updateProduct() {
      productWave.setx(aws);
      productWave.update();
      productMeter.val = productWave.avg() * 2; // 1/2 is the best match
    }

    probe.onUpdate = updateProduct;

    List ags = []; // gadgets w/o probe

    for (int i = 0; i < numParts; ++i) {
      var ag = m.bg.add(new AudioWaveGadget(tr(i, 0), xy(ww, wh), gn))
        ..fund = FUND
        ..onUpdate = (() {
        addWave.update();
        updateProduct();
      })
        ..sliders(true, -Math.PI2, true)
        ..out.sendTo(mix);

      ag
        ..slf.val = .5
        ..slp.val = ag.slp.minVal;
      addWave.parts.add(ag.wave);
      ags.add(ag);
      aws.add(ag.wave);
    }

    productWave.setf((t) => addWave.val(t) * probeWave.val(t));

    probe
      ..slf.val = .5
      ..slp.val = probe.slp.minVal
      ..out.sendTo(mix);

    for (var aw in ags) aw.safeStart();
    probe.safeStart();

    var au = (new Panel.topLeft(m.el)
      ..pull()).uiBox;
    var bs = (new Panel.topRight(m.el, trAddWave)).uiBox;

    bs.button('rand', () {
      for (var aw in ags) {
        aw.slf.val = Math.rand(.02, 1);
        aw.slp.val = Math.rand(0, Math.PIPI);
        aw.sla.val = Math.rand(.1, 1);
      }
    }).click();

    au.rangeGain(mix)
      ..val = Gain.soft;
  });
}

// eof
