part of quint.widgets;

typedef num WaveF(num t);

class WaveForm extends Spline {
  WaveForm(): super(true);

  WaveF _f; num _x1, _dx, _x2;
  int normAmp;

  void setf(WaveF f, [num x1=0, num dx=0, num x2=0]) {
    _f = f; _x1 = x1; _dx = dx; _x2 = x2;
  }

  void setx(List<WaveForm> ws) { // as required by parts
    if (ws.isEmpty) {
      _x1 = _dx = _x2 = 0.0;
    } else {
      WaveForm first = ws.first;
      _x1 = first._x1; _dx = first._dx; _x2 = first._x2;
      for (var w in ws.skip(1)) {
        _x1 = Math.min(_x1, w._x1);
        _dx = Math.min(_dx, w._dx);
        _x2 = Math.max(_x2, w._x2);
      }
    }
  }

  num val(num t) => null!=_f ? _f(t) : 0;

  List<XY> _limit(List<XY> ps, num maxAmp) {
    num amp = ps.fold(0, (v,p) => Math.max(v,p.y.abs()));
    return (amp>maxAmp)
      ? ps.map((p)=>xy(p.x,p.y*maxAmp/amp)).toList()
      : ps;
  }

  void update() {
    List<XY> ps = [];
    if (null!=_f && _dx > 0) {
      int end = ((_x2-_x1)/_dx).round() + 1;
      num d = (_x2-_x1)/(end-1);
      for (int i=-1; i<=end; ++i) {
        num t = _x1 + i*d;
        ps.add(xy(t,-_f(t)));
      }
      if (null!=normAmp) ps = _limit(ps,normAmp);
    }
    this.ps = ps;
  }

  num avg() {
    if (_dx <= 0) return 0;

    int iEnd = ((_x2-_x1)/_dx).round(); assert(iEnd>=0);
    num sum = 0;
    for (int i = 0; i <= iEnd; ++i) sum += val(_x1 + i * _dx);
    return sum / iEnd;
  }
}

WaveForm waveform(GroupNode g,[stroke, fill])
  => g.add(new WaveForm() ..stroke=stroke .. fill=fill);

class SineWave extends WaveForm {
  num _cps = 1, _amp = 0, _phs = 0, _cycles = 1;
  SineWave() {
    _f = _wf;
  }

  num get cps       => _cps;
  set cps(num cps)  { _cps = cps; update(); }
  num get T         => _cps>0 ? 1/_cps : 0;

  num get amp       => _amp;
  set amp(num amp)  { _amp = amp; update(); }

  num get phs       => _phs;
  set phs(num phs)  { _phs = phs; update(); }

  num get cycles    => _cycles;
  set cycles(num n) { _cycles = n; update(); }

  num _wf(num t) => Math.sin(amp, _cps, -_phs, t);

  void update() {
    _x1 = 0; _dx = T/12; _x2 = T*_cycles;
    super.update();
  }
}

SineWave sinewave(GroupNode g,[stroke, fill])
  => g.add(new SineWave() ..stroke=stroke .. fill=fill);

class AudioWave extends SineWave {
  num _fund = 0; var _og = new OscGain();

  AudioWave();

  num get fund    => _fund;
  set fund(num f) { _fund = f; }

  AuNode get out    => _og.gai;
  void safeStart()  => _og.osc.safeStart();

  set cps(num cps) { _og.osc.cps = _fund*cps; super.cps = cps; }
  set amp(num amp) { _og.gai.amp = amp;       super.amp = amp; }
  set phs(num phs) { _og.osc.phs = phs;       super.phs = phs; }
}

AudioWave audiowave(GroupNode g,[stroke, fill])
  => g.add(new AudioWave() ..stroke=stroke .. fill=fill);

class AddWave extends WaveForm {  // additive synthesis
  List<WaveForm> _parts = [];
  AddWave() {
    _f = _wf;
  }

  List<WaveForm> get parts => _parts;
  set parts(List<WaveForm> parts) {
    _parts = parts; update();
  }

  num _wf(num t) => _parts.fold(0, (val, part) => val + part.val(t));

  void update() {
    setx(_parts);
    super.update();
  }
}

AddWave addwave(GroupNode g,[stroke, fill])
  => g.add(new AddWave() ..stroke=stroke .. fill=fill);

loadWaveHelpers() {
  ExtraMethods.addAll(GroupNode, {
    const Symbol('waveform'): waveform,
    const Symbol('sinewave'): sinewave,
    const Symbol('audiowave'): audiowave,
  });
}

// eof
