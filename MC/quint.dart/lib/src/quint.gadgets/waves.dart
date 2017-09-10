part of quint.gadgets;

typedef void OnUpdate();

class WaveGadget extends GroupNode {
  num w, h; GridNode grid;
  WaveForm _wave;

  WaveGadget(WaveForm wf, XY p, XY sz, XY n, [String label]) {
    this.p = p; w = sz.x; h = sz.y;
    grid = this.add(new GridNode(xy0(),sz,n,label));
    this.add((_wave=wf));

    _wave ..sc=xy(w,h/2) ..tr=xy(0,h/2);
  }

  WaveForm get wave => _wave;
}

class AudioWaveGadget extends WaveGadget {
  Slider slp, sla, slf;

  AudioWaveGadget(XY p, XY sz, XY n, [String label])
  : super(new AudioWave(),p,sz,n,label);

  AudioWave get wave => _wave as AudioWave;

  void sliders(bool f, num p, bool a) {
    if (null!=p) slp = this.add(new Slider(xy(0,h/2),xy(w,0))
      ..color='orange' ..maxVal=Math.PIPI ..onVal=(num v) {
      wave.phs = v + p;
      if (null!=onUpdate) onUpdate();
    });

    if (a) sla = this.add(new Slider(xy(w,h/2),xy(0,-h/2))
      ..color=('yellow') ..maxVal=1 ..onVal = (num v) {
      wave.amp = v;
      if (null!=onUpdate) onUpdate();
    });

    if (f) slf = this.add(new Slider(xy(0,h),xy(w,0))
      ..color=('#2288A0') ..maxVal=1 ..onVal = (num v) {
      num cps = 1/Math.max(v,.01);
      wave.cps=cps; wave.cycles=cps;
      if (null!=p) {
        num sm = slp.maxVal, sv = slp.val;
        slp.maxVal = cps*Math.PIPI;
        slp.val    = sv/sm*slp.maxVal;  // keep phase handle
        if (null!=onUpdate) onUpdate();
      }
    });

    // z-order
    front(wave);
    if (null!=slp) slp.split(this);
    if (null!=sla) sla.split(this);
    if (null!=slf) slf.split(this);
  }

  OnUpdate onUpdate;

  num get fund    => wave.fund;
  set fund(num f) { wave.fund = f; }

  num get cps     => wave.cps;
  set cps(num n)  { wave ..cps=n ..cycles=n; if (null!=slp) slp.sz = xy(w/(n>0?n:1),0); }

  num get amp     => wave.amp;
  set amp(num a)  { wave.amp = a; }

  AuNode get out  => wave.out;

  void safeStart()=> wave.safeStart();
}

// eof
