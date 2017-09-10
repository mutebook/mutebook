/* global MC:true */
var MC = MC || {};

MC.AuModule = class { // abstract
  get inlet () { // AudioNode
    return null;
  }

  get outlet () { // AudioNode
    return null;
  }

  // TODO right now allows only single connection; redo like in patcher
  // keep track of connections; inquiries then possible
  /* void */ sendTo (/* AuNode */ to = null) {
    if (this.outlet) {
      this.outlet.disconnect(0);
      if (to && to.inlet)
        this.outlet.connect(to.inlet);
    }
  }

  /* void */ sendToDest () {
    this.sendTo(MC.Audio.dest);
  }
};

MC.AuNode = class extends MC.AuModule { // abstract
  get node () {
    return this._node;
  }

  constructor (node) {
    super(); this._node = node;
  }

  get inlet () {
    return this.node;
  }

  get outlet () {
    return this.node;
  }
};

MC.AuStartStop = (Base) => class extends Base { // mixin
  constructor (...args) {
    super(...args);
    this._state = 0; // 0: new, 1: started, 2: stopped
  }

  safeStart (when) {
    if (0 === this._state) {
      if (this.node)
        this._start(when || 0);
      this._state = 1;
    }
  }

  safeStop (when) {
    if (1 === this._state) {
      if (this.node)
        this._stop(when || 0);
      this._state = 2;
    }
  }
};

MC.Osc = class extends MC.AuStartStop(MC.AuNode) {
  constructor (type = 'sine') {
    super(MC.Audio.hasCtx ? MC.Audio.ctx.createOscillator() : null);
    this._setWave(this._cps = 0, this._phs = 0);
    if (this.node) {
      this.node.type = type;
      this.node.frequency.value = this._cps;
    }
  }

  get cps () {
    return this._cps;
  }

  set cps (cps) {
    this._cps = cps;
    if (this.node)
      this.node.frequency.value = this._cps;
  }

  get phs () {
    return this._phs;
  }

  set phs (phs) {
    this._setWave(phs);
  }

  _setWave (cps, phs) {
    this._cps = cps; this._phs = phs;
    if (!this.node)
      return;
    // TODO phase changes better with delay; setPeriodicWave clicks
    const ri = MC.ra(1, phs).toXY();
    this.node.setPeriodicWave(
      MC.Audio.ctx.createPeriodicWave(
        new Float32Array([0, ri.x]), new Float32Array([0, ri.y])));
  }

  _start (when) {
    if (this.node)
      this.node.start(when);
  }

  _stop (when) {
    if (this.node)
      this.node.stop(when);
  }
};

MC.Gain = class extends MC.AuNode {
  constructor (gain = 0) {
    super(MC.Audio.hasCtx ? MC.Audio.ctx.createGain() : null);
    if (this.node)
      this.node.gain.value = gain;
    this._amp = 0;
  }

  get amp () {
    return this._amp;
  }

  set amp (a) {
    if (this.node)
      MC.Audio.ramp(this.node.gain, this._amp, this._amp = a);
  }

  // square better than linear; could be exp.
  get amp2 () {
    return Math.sqrt(this.amp);
  }

  set amp2 (a2) {
    this.amp = a2 * a2;
  }
};

MC.Gain.soft = 0.3; MC.Gain.loud = 0.7; MC.Gain.full = 1.0;

MC.OscGain = class extends MC.AuModule {
  constructor (type = 'sine', gain = 0) {
    super();
    this.osc = new MC.Osc(type);
    this.gai = new MC.Gain(gain);
    this.osc.sendTo(this.gai);
  }

  get outlet () {
    return this.gai.node;
  }

  safeStart (when) {
    this.osc.safeStart(when);
  }

  safeStop (when) {
    this.osc.safeStop(when);
  }
};

MC.Audio = class {
  static init () {
    if (this.hasCtx)
      return;
    this.ctx  = new AudioContext();
    (this.dest = new MC.Gain(1)).node.connect(this.ctx.destination);
    window.addEventListener('beforeunload', () => this.mute());
    this.testBeep();
  }

  static get hasCtx () {
    return undefined !== this.ctx;
  }

  static get sr () {
    return this.hasCtx ? this.ctx.sampleRate.round() : 0;
  }

  static get now () {
    return this.hasCtx ? this.ctx.currentTime : 0.0;
  }

  static mute () {
    if (this.hasCtx)
      this.dest.node.gain.value = 0;
  }

  static ramp (par, from, to, dt = .12) {
    let time = this.now;
    par.cancelScheduledValues(time);
    time += .001;
    par.setValueAtTime(from, time);
    if (from < to)
      par.linearRampToValueAtTime(to, time + dt);
    else {
      const is0 = 0 === to;
      par.exponentialRampToValueAtTime(is0 ? .0001 : to, time + dt);
      if (is0)
        par.setValueAtTime(to, time + dt);
    }
    // fout .12
    // par.setTargetAtTime(val, time, dt);
  }

  static beep (cps, amp, sec) {
    const og = new MC.OscGain();
    og.osc.cps = cps; og.sendToDest(); og.safeStart();

    let time = this.now;
    // TODO
    const par = og.gai._node.gain;
    par.setValueAtTime(0, time);
    par.linearRampToValueAtTime(.3, time += sec / 3 * 2);
    par.exponentialRampToValueAtTime(.0001, time += sec / 3);
    par.setValueAtTime(0, time += .1);

    MC.Async.after(sec + 1, () => {
      og.safeStop(); og.sendTo();
    });

    // MC.Async.sequence(
    //   [0, () => (og.gai.amp = amp)],
    //   [sec, () => (og.gai.amp = 0)],
    //   [4, () => og.safeStop()]
    // );
  }

  static testBeep () {
    this.beep(880, .3, .2);
  }
};

MC.Audio.init();

// class Delay extends AuNode {
//   Delay(): super(_make());
//   DelayNode get node => _node;

//   static AudioNode _make()
//     => Audio.hasCtx ? Audio.ctx.createDelay() : null;

//   num _del = 0;
//   num get del       => _del;
//   set del(num del)  { _del = del; if (null!=node) node.delayTime.value = _del; }
// }

// typedef void OnFileRead();

// class AudioBufferSource extends AuNode with AuStartStopMixin {
//   AudioBufferSource(): super(_make());
//   AudioBufferSourceNode get node => _node;

//   static AudioNode _make()
//     => Audio.hasCtx ? Audio.ctx.createBufferSource() : null;

//   void _start(num when) => node.start(when);
//   void _stop(num when)  => node.stop(when);

//   void createBuffer(int lgt, double f(int)) {
//     if (null==node) return;
//     var buf = Audio.ctx.createBuffer(1,lgt,Audio.sr);
//     var dta = buf.getChannelData(0);
//     for (var i=0; i<lgt; ++i) dta[i] = f(i);
//     node ..buffer = buf ..loop = true;
//   }

//   void readFile(File file, [OnFileRead f]) {
//     if (null==node) return;
//     var reader = new FileReader();
//     reader ..onLoad.listen((e) {
//       Audio.ctx.decodeAudioData(reader.result.buffer).then((AudioBuffer buffer) {
//         node.buffer  = buffer;
//         node.loopEnd = buffer.duration;
//         node.loop    = true;
//         if (null!=f) f();
//       }, onError: (e) => System.alert('Cannot load this audio file.'));
//     }) ..readAsArrayBuffer(file);
//   }

//   void requestFile(String url, [OnFileRead f]) {
//     if (null==node) return;
//     var req = new HttpRequest();
//     req.open('GET',url);
//     req.responseType = 'arraybuffer';
//     req ..onLoad.listen((e) {
//       Audio.ctx.decodeAudioData(req.response).then((AudioBuffer buffer) {
//         node.buffer  = buffer;
//         node.loopEnd = buffer.duration;
//         node.loop    = true;
//         if (null!=f) f();
//       }, onError: (e)=> System.alert('Cannot load this audio file.'));
//     }) ..send();
//   }
// }

// class Filter extends AuNode {
//   Filter(String type): super(_make()) {
//     if (null!=node) node ..type = type ..frequency.value = 0 ..Q.value = 0 ..gain.value = 0;
//   }
//   BiquadFilterNode get node => _node;

//   static AudioNode _make() => Audio.hasCtx
//     ? Audio.ctx.createBiquadFilter()
//     : null;

//   set Q(num Q)       { if (null!=_node) node.Q.value = Q;            }
//   set gain(num gain) { if (null!=_node) node.gain.value = gain;      }
//   set cps(num cps)   { if (null!=_node) node.frequency.value = cps;  }
// }

// class ScriptProcessor extends AuNode {
//   ScriptProcessor(int size, int inChans, int outChans): super(_make(size,inChans,outChans));
//   ScriptProcessorNode get node => _node;

//   static AudioNode _make(int size, int inChans, int outChans)
//     => Audio.hasCtx ? Audio.ctx.createScriptProcessor(size,inChans,outChans) : null;
// }

// eof
