library tuningspiral;

import 'dart:math' as math;
import 'package:quint/quint.applets.dart';
export 'package:quint/quint.applets.dart';
import 'package:quint/quint.tuning.dart';
export 'package:quint/quint.tuning.dart';

class TuningSpiralApplet extends QuintApplet {
  TuningSpiralApplet(el_sel, [XY sz]): super(el_sel,sz) {
    initAudio(el, () {
      _make();
      _makeUi();
      _makeTones();
    });
  }

  TuningSpiral sp;
  GroupNode combG;
  Gain adj, mix;

  _make() {
    // TODO could be: onWindowSize = (w,h) => fullWindowSquare();
    // needs spiral etc. to resize as well
    var r = sz.min/2;
    sp = new TuningSpiral(Tun.pch(5),Tun.pchC4(),Tun.pch(12),r*.3,r*.9);
    bg.add(sp ..p=sz/2);
    combG = sp.group();

    mix = new Gain() ..sendToDest();
    adj = new Gain() ..sendTo(mix);
    adj.amp = 1 / numTones;
  }

  PanelBox ui1, ui2;
  Check chkComb;

  var volume;
  _makeUi() {
    ui1 = (new Panel.topLeft(el) ..pull()).uiBox;
    ui2 = (new Panel.topRight(el)..pull()).uiBox.col();
    volume = ui2.padH().rangeGain(mix) ..align(ALIGN.R) ..val = math.sqrt(Gain.soft);

    var grid = ui1.box('grid');
    var sett = ui1.box('settings');

    gridCheck(spGrid, text, color) {
      var check = grid.check((on) => spGrid.show(on)) ..makeLabel(text) ..labelColor = color;
      spGrid.stroke = color;
      return check;
    }

    gridCheck(sp.gridJust, 'just', 'blue');
    gridCheck(sp.gridMean, 'mean', 'lightblue');
    gridCheck(sp.grid12,   '12',   'grey');
    gridCheck(sp.grid31,   '31',   'green');
    gridCheck(sp.grid34,   '34',   'lightgreen');
    gridCheck(sp.grid53,   '53',   'lightgrey');

    chkComb = sett.check((on) => _updateCombinations()) ..makeLabel('comb.');
  }


  GroupNode hg;         // all harmonics
  List<GroupNode> hgs;  // each harmonic number has its own layer, higher on top

  static var colors = ['blue','maroon','green','orange'];
  static int numTones = colors.length, numParts = 8;
  List<SpiralTone> tones;

  _makeTones() {
    assert (numTones>0 && numParts>0);
    tones = listN(numTones, (i)
      => new SpiralTone(this,colors[i]) ..sendTo(adj));

    hg = sp.group(); hgs = listN(numParts, (i) => hg.group());

    for (var t in tones.reversed) t.makeUi(ui2.box(null));
    for (var t in tones) t.updateUi();
  }

  _updateCombinations() {
    bool on = (null!=chkComb /*FIXME reorganize*/) && chkComb.isChecked;
    if (!on) {
      combG.remAll(); return;
    }

    if (combG.isEmpty) {
      int tl = tones.length;
      forN(tl*(tl-1)~/2, (i) => combG.group());
    }

    int n = 0;
    forList(tones, (t1, i) {
      tones.skip(i+1).forEach((t2) {
        t1.combineWith(combG.nodes[n++],t2);
      });
    });
  }
}

class SpiralTone extends Tone {
  TuningSpiralApplet app; var color;
  List<Shape> partShapes = [];
  Shape get handle => partShapes.first;

  SpiralTone(this.app,this.color): super(TuningSpiralApplet.numParts) {
    this.app = app;
    setMulAmp(1);
  }

  Pch get pch => Tun.cps(super.cps).toPch();
  set pch(Pch pch) {
    super.cps = (pch.val>0) ? pch.toCps().val : 0;
    updateUi();
  }

  _onBeginUserMove(XY xy,Shape) {
    app.sp.lag(app.sp.xy2pch(xy),true);
  }

  XY _onMove(XY xy,Shape,bool byUser) {
    var sp = app.sp;
    var pch_ = sp.xy2pch(xy);
    if (byUser) pch_ = sp.lag(pch_);

    XY res;
    if (pch_ < sp.minPch) {
      pch = Tun.pch(0);
      res = xy0();
    } else {
      pch = (pch_ = pch_.clamp(sp.minPch, sp.maxPch));
      res = sp.pch2xy(pch_);
    }

    app._updateCombinations();
    return res;
  }

  Range rgeParts;

  _onParts(num val) {
    audibleParts = val.round().clamp(1,numParts);
    setMulAmp(audibleParts);
    updateUi();
  }

  _r(int i) => app.sp.markRad * math.sqrt(relAmp(i));

  makeUi(PanelBox box) {
    var row = box.row();
    var onOff = row.button2('◉') ..addClass('square') ..color = color;

    var col = row.col();
    var rg  = col.rangeGain(mix) ..val = math.sqrt(Gain.soft);
    rg.onValue = (val) => onOff.setDown(val>0);
    rg.onValue(rg.val); // set

    var rgVal = rg.val; // remember
    onOff.onToggle = (i) {
      if (i>0) {
        rg.val = rgVal;
      } else {
        rgVal = rg.val; rg.val = 0;
      }
    };

    rgeParts = col.range(1,numParts,1,_onParts) ..makeLabel(' ⋮');

    forN(numParts, (i) {
      var shape = circle(app.hgs[i], xy0(), _r(i), 'black', color);
      partShapes.add(shape);
    });

    handle.movable(_onMove,_onBeginUserMove);
  }

  updateUi() {
    var pch_ = pch;
    bool showParts = pch_ >= app.sp.minPch;
    forList(partShapes, (Circle c,i) {
      c ..r = _r(i)
        ..show(0==i || (showParts && i<=audibleParts))
        ..moveTo(app.sp.pch2xy(pch_.harm(i)));
    });

    rgeParts.setVal(audibleParts);
    app._updateCombinations();
  }

  combineWith(GroupNode g, SpiralTone that) {
    int np = this.audibleParts * that.audibleParts;
    if (g.nodes.length != np) {
      g.remAll(); forN(np, (i) => app.sp.mark(g,Tun.pch(),0));
    }

    const SCALE = .9;
    int i = 0; forList(parts,(p1,i1) {
      if (i1 >= this.audibleParts) return;
      forList(that.parts,(p2,i2) {
        if (i2 >= that.audibleParts) return;
        num df  = (p1.osc.cps - p2.osc.cps).abs();
        num da  = p1.gai.amp * p2.gai.amp;
        var pch = Tun.cps(df).toPch();
        num r   = (pch < Pch.minAudible) ? 0 : app.sp.markRad * da * SCALE;
        app.sp.setMark(g.nodes[i++], pch, r, that.color, this.color);
      });
    });
  }
}

class TuningSpiral extends PitchSpiral {
  TuningSpiral(Pch minPch,Pch ctrPch,Pch maxPch,num minRad,num maxRad)
  : super(minPch,ctrPch,maxPch,minRad,maxRad) {
    markPitch(bg,ctrPch,'pink','red');
    _makeGrids();
  }

  // pitch collections
  Iterable justPchs()
    => [1,25/24,16/15,10/9,9/8,6/5,5/4,4/3,
          24/25,15/16,9/10,8/9,5/6,4/5,3/4].map((r) => Tun.rat(r).toPch());

  Iterable meanPchs()
    => [1,1.07,1.118,1.1963,1.25,1.3375,1.4311,1.4953,1.6,1.6719,1.7889,1.8692]
      .map((r) => Tun.rat(r).toPch());

  // grids

  GroupNode gridJust, gridMean, grid12, grid31, grid34, grid53;

  _makeGrids() {
    gridJust = spokes(bg,justPchs());
    gridMean = spokes(bg,meanPchs());
    grid12   = spokes(bg,Tun.edo(12).allPchs());
    grid31   = spokes(bg,Tun.edo(31).allPchs());
    grid34   = spokes(bg,Tun.edo(34).allPchs());
    grid53   = spokes(bg,Tun.edo(53).allPchs());
  }
}

// eof
