library noisespiral;

import 'dart:math' as math;
import 'dart:html';

import 'package:quint/quint.applets.dart';
export 'package:quint/quint.applets.dart';
import 'package:quint/quint.tuning.dart';
export 'package:quint/quint.tuning.dart';

// TODO display the Q curve on the spiral

class NoiseSpiralApplet extends QuintApplet {
  NoiseSpiralApplet(el_sel, [XY sz]): super(el_sel, sz) {
    // TODO could be: m.onWindowSize = (w,h) => m.fullWindowSquare();
    // needs spiral etc. to resize as well
    initAudio(el, () {
      _make();
      _makeAllFmts();
      _makeUi();
      _prepareMove();
    });
  }

  NoiseSpiral sp;
  Filter filter; Gain gain;

  AudioBufferSource pinkNoise, whiteNoise, fileBuffer;

  _make() {
    var r = sz.min / 2;
    sp = new NoiseSpiral(Tun.cps(1000/8),Tun.cps(1000),Tun.cps(8*1000), r*.3, r *.9);
    bg.add(sp ..p = sz / 2);

    gain   = new Gain();
    filter = new Filter('peaking');

    pinkNoise  = new PinkNoise();
    whiteNoise = new WhiteNoise();
    fileBuffer = new AudioBufferSource();

    _doFilter(null);

    mark = handle(sp,xy0(),'#0a0') ..r=sp.stpRad/3 ..hide();
  }

  PanelBox ui1, ui2, ui3, ui4, uic; Panel uip;
  Circle mark; Button quiz;

  _makeUi() {
    ui1 = (new Panel.topLeft(el)     ..pull()).uiBox;
    ui2 = (new Panel.topRight(el)    ..pull()).uiBox;
    ui3 = (new Panel.bottomLeft(el)  ..pull()).uiBox;
    ui4 = (new Panel.bottomRight(el) ..pull()).uiBox;
    uip = new Panel(el); uic = uip.uiBox;

    quiz = uic.button('Question',_onQuiz) ..addClass('large');
    uip.center();

    // 1
    var boxDivi = ui1.box('division');
    RadioGroup rgDivi = boxDivi.radioGroup('div');
    rgDivi.radio('/0', 0);
    rgDivi.radio('/1', 1);
    rgDivi.radio('/2', 2);
    rgDivi.radio('/3', 3);
    rgDivi.radio('/4', 4);
    rgDivi.radio('/6', 6);
    rgDivi.onRadio = _onDivi;

    boxDivi.check((on) => _showCps(on)) ..makeLabel('cps');
    boxDivi.check((on) => _onSnap(on))  ..makeLabel('snap');

    var boxFmts = ui1.box('formants');
    RadioGroup rgFmts = boxFmts.radioGroup('fmts');
    rgFmts.radios(['none','German']);
    rgFmts.onRadio = _showFmts;

    // 2
    RadioGroup rgQs = ui2.box('Q').radioGroup('Q');
    rgQs.radios(['0.5','1','2','4']);

    RadioGroup rgdB = ui2.box('dB').radioGroup('dB');
    rgdB.radios(['-12','-6','-3','+3','+6','+12']);

    rgQs.onRadio = (v) => filter.Q    = num.parse(v);
    rgdB.onRadio = (v) => filter.gain = num.parse(v);

    ui2.padV() ..rangeGain(gain,true).val = math.sqrt(Gain.soft);

    // 3
    var boxSrc = ui3.box('source');
    RadioGroup rgSrc = boxSrc.radioGroup('src');
    rgSrc.radios(['off','pink','white','file']);
    rgSrc.onRadio = _onSource;

    if (System.isIOS()) {
      var files = [ // TODO ask Thilo
        ['select file...', null],
        ['horn',        'http://quinta.audio/media/quint/horn.wav'],
        ['trombone',    'http://quinta.audio/media/quint/trombone.wav'],
        ['trumpet',     'http://quinta.audio/media/quint/trumpet.wav'],
        ['tuba',        'http://quinta.audio/media/quint/tuba.wav'],
      ];
      var sel = boxSrc.select((i) => _onFileRequested(files[i][1]));
      for (var f in files) {
        sel.el.append(new OptionElement() ..text=f[0]);
      }
    } else {
      boxSrc.fileUpload('audio/wav',_onFileUpload);
    }

    // 4
    var boxMode = ui4.box('mode');
    RadioGroup rgMode = boxMode.radioGroup('mode');
    rgMode.radios(['normal','sticky','quiz']);
    rgMode.onRadio = _onMode;

    // init
    rgDivi.click(); rgFmts.click();
    rgSrc.click();  rgMode.click();
    rgQs.click('0.5'); rgdB.click('+3');
  }

  GroupNode gSpokes, gLabels;
  List<Pch> pchSpokes = [], pchSnap = [];

  _onDivi(String s) {
    if (null!=gSpokes) {
      gSpokes.remSelf(); gSpokes = null;
      gLabels.remSelf(); gLabels = null;
    }

    pchSpokes.clear(); pchSnap.clear();

    int d = num.parse(s).round();
    if (d<=0) return;

    pchSpokes = listN(d, (i) => sp.ctrPch + Tun.pch(i/d));
    gSpokes = sp.spokes(sp.bg,pchSpokes) ..backSelf() ..show() ..color = 'grey';
    gLabels = sp.fg.group();

    num p = sp.ctrPch.val - (sp.ctrPch.val - sp.minPch.val).truncate();
    while (p <= sp.maxPch.val) {
      var pch = Tun.pch(p);
      sp.labelPch(gLabels,pch,pch.toCps().toStringRounded(),'blue');
      pchSnap.add(pch);
      p += 1/d;
    }

    _showCps(_cpsShown);
  }

  bool _isSnap = false;
  _onSnap(bool on) => _isSnap = on;

  var _source;
  _onSource(s) {
    pinkNoise.sendTo(); whiteNoise.sendTo();
    fileBuffer.sendTo();

    switch ((_source=s)) {
      case 'off':
        break;
      case 'pink':
        pinkNoise.sendTo(gain);
        break;
      case 'white':
        whiteNoise ..sendTo(gain);
        break;
      case 'file':
        fileBuffer ..sendTo(gain) ..safeStart();
        break;
    }
  }

  var _mode; bool _answer;
  _onMode(s) {
    switch ((_mode=s)) {
      case 'normal':
        _markOff();
        quiz.hide();
        break;
      case 'sticky':
        quiz.hide();
        break;
      case 'quiz':
        _markOff();
        quiz.show(); _answer = false;
        break;
    }
  }

  _onFileUpload(File file) {
    fileBuffer ..safeStop() ..sendTo();
    if (null!=file) {
      fileBuffer = new AudioBufferSource() ..readFile(file, () {
        if ('file'==_source) _onSource(_source);
      });
    }
  }

  _onFileRequested(String url) {
    fileBuffer ..safeStop() ..sendTo();
    if (null!=url) {
      fileBuffer = new AudioBufferSource() ..requestFile(url, () {
        if ('file'==_source) _onSource(_source);
      });
    }
  }

  bool _cpsShown = false;
  _showCps(bool on) {
    _cpsShown = on;
    if (null!=gSpokes) gSpokes.show(!on);
    if (null!=gLabels) gLabels.show(on);  // TODO scale label size down on small screens
  }

  static var FMTS = [
    ['u',[300,350,400]],
    ['o',[440,500,560]],
    ['å',[600,700,800]],
    ['a',[900,1000,1250]],
    ['ö',[1250,1300,1400]],
    ['ü',[1400,1500,1600]],
    ['ä',[1600,1700,1800]],
    ['e',[2000,2200,2400]],
    ['i',[2800,3200,4000]],
  ];

  _makeAllFmts() {
    _makeFmts(FMTS);
  }

  XY atCps(num cps, num dr)
    => (sp.pch2ra(Tun.cps(cps).toPch()) + ra(dr,0)).toXY();

  GroupNode _fmsp, _fmtx;

  _makeFmts(List FMTS) {
    _fmsp = sp.bg.group() ..hide(); _fmtx = sp.fg.group() ..hide();
    for (var i=0; i<FMTS.length; ++i) {
      var fmt = FMTS[i], txt = fmt[0], fqs = fmt[1];

      var psa = [], psb = [], stp = 16;
      for (var j=0; j<stp; ++j) {
        var f = fqs[0] + j*(fqs[1]-fqs[0])/stp;
        psa.add(atCps(f,j));
        psb.add(atCps(f,0));
      }
      for (var j=0; j<stp; ++j) {
        var f = fqs[1] + j*(fqs[2]-fqs[1])/stp;
        psa.add(atCps(f,stp-j));
        psb.add(atCps(f,0));
      }
      psa.addAll(psb.reversed);
      spline(_fmsp,true,psa) ..color = 'orange';
      label(_fmtx,atCps(fmt[1][1],14),txt);
    }
  }

  _showFmts(String s) {
    switch (s) {
      case 'German':  // TODO more
        _fmsp.show(); _fmtx.show();
        break;
      default:
        _fmsp.hide(); _fmtx.hide();
        break;
    }
  }

  bool isFiltering = null;
  Pch _doFilter(Pch pch,[bool initLag=false]) {
    bool willFilter = (null != pch);
    bool _switch = (null==isFiltering || isFiltering != willFilter);
    if (_switch) { // disconnect
      gain.sendTo(null); filter.sendTo(null);
    }

    if ((isFiltering = willFilter)) {
      pch = sp.lag(pch,initLag).clamp(sp.minPch, sp.maxPch);
      if (_isSnap) pch = sp.snap(pch, pchSnap);
      filter.cps = pch.toCps().val;
    }

    if (_switch) { // connect
      if (willFilter) {
        gain.sendTo(filter ..sendToDest());
      } else {
        gain.sendToDest();
      }
    }

    return pch;
  }

  _setLag(XY xy) {
    sp.lag(sp.xy2pch(xy),true);
  }

  bool _userMove = false;
  _onBeginUserMove(XY xy,Shape) {
    _setLag(xy);
    _userMove = true;
  }

  XY _onMoveMark(XY xy,Shape,bool byUser) {
    var pch = sp.xy2pch(xy - sp.p);
    pch = sp.lag(pch,!byUser);
    pch = pch.clamp(sp.minPch, sp.maxPch);

    pch = _doFilter(pch,true);

    return sp.pch2xy(pch);
  }

  _markOff() {
    _doFilter(null);
    mark ..hide();
  }

  _prepareMove() {
    mark ..movable(_onMoveMark,_onBeginUserMove);
    scene.onBeginEvent((XY p) {
      scene.onMoveBegin(p,
        (XY p) {
          if (_userMove) {
            // nothing
            _userMove = false;
          } else if ('sticky'==_mode && mark.isShown()) {
            // switch off
            _doFilter(null); mark ..hide();
          } else {
            _setLag(p);
            mark ..show() ..moveTo(p,false);
          }
        },
        (XY p) {
          mark..moveTo(p,true);
        },
        (XY p) {
          if('sticky'!=_mode)
            _markOff();
        });
    });
  }

  // TODO this is a prototype
  num del = 1.8; Pch _quizPch;
  _onQuiz() {
    if (!_answer) {
      _quizPch = Tun.pch(Math.rand(sp.minPch.val,sp.maxPch.val));
      if (_isSnap) _quizPch = sp.snap(_quizPch, pchSnap);
      new Sequence.from([
        () { quiz.disable(); },
        del, () { _doFilter(_quizPch,true); quiz.color = 'red'; },
        del, () { _doFilter(null); quiz.color = ''; },
        del, () { _doFilter(_quizPch,true); quiz.color = 'red'; },
        del, () { _doFilter(null); quiz.color = ''; },
        del, () { _doFilter(_quizPch,true); quiz.color = 'red'; },
        del, () { _doFilter(null); quiz.color = ''; },
        () {
          _answer = true;
          quiz ..text = 'Answer?' ..enable();
        }
      ]) ..run();
    } else {
      _answer = false;
      new Sequence.from([
        () { quiz.disable(); },
        () { mark ..moveTo(sp.pch2xy(_quizPch)+sp.p) ..show(); quiz.color = 'red'; },
        del, () { _doFilter(null); mark.hide(); quiz.color = ''; },
        del, () { mark ..moveTo(sp.pch2xy(_quizPch)+sp.p) ..show(); quiz.color = 'red'; },
        del, () { _doFilter(null); mark.hide(); quiz.color = ''; },
        () { quiz ..text = 'Question' ..enable(); }
      ]) ..run();
    }
  }
}

class NoiseSpiral extends PitchSpiral {
  NoiseSpiral(Cps minCps,Cps ctrCps,Cps maxCps,num minRad,num maxRad)
  : super(minCps.toPch(),ctrCps.toPch(),maxCps.toPch(),minRad,maxRad) {
    markPitch(fg,ctrCps.toPch(),'red');
  }
}

// eof
