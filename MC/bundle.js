// @flow
//****** space.js
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line

/*:: type flt = number; */
/*:: type int = number; */
/*:: type lgt = int; */
/*:: type idx = int; */
/*:: type str = string; */

// (function () {

MC.PI2  = Math.PI / 2;
MC.PIPI = 2 * Math.PI;

// normalize to <0,2pi)
MC.normPIPI = function (a/*:flt*/) /*:flt*/ {
  return 0 > a || MC.PIPI <= a
    ? a - (Math.floor(a / MC.PIPI) * MC.PIPI) : a;
};

// normalize to (-pi,pi>
MC.normPI = function (a/*:flt */) /*:flt */ {
  return (a = this.normPIPI(a)) <= Math.PI
    ? a : a - MC.PIPI;
};

class XY {
  /*:: x: *; y: *; */
  constructor (x/*:flt*/, y/*:flt*/) {
    this.x = x; this.y = y;
  }

  toString () {
    return `(${this.x}:${this.y})`;
  }

  make (x/*:flt*/, y/*:?flt*/) /*:XY*/ {
    return this.constructor.make(x, y);
  }

  static make (x/*:flt*/, y/*:?flt*/) /*:XY*/ {
    return new this(x, null != y ? y : x);
  }

  static _0 () {
    return this.make(0, 0);
  }

  clone () /*:XY*/ {
    return this.make(this.x, this.y);
  }

  is0 () /*:boolean*/ {
    return 0 === this.x && 0 === this.y;
  }

  eq (xy/*:XY*/) /*:boolean*/ {
    return this.x === xy.x && this.y === xy.y;
  }

  plus (xy/*:XY*/) /*:XY*/ {
    return this.make(this.x + xy.x, this.y + xy.y);
  }

  minus (xy/*:XY*/) /*:XY*/ {
    return this.make(this.x - xy.x, this.y - xy.y);
  }

  times (xyn/*:XY | number*/) /*:XY*/ {
    return xyn instanceof XY
      ? this.make(this.x * xyn.x, this.y * xyn.y)
      : this.make(this.x * xyn,   this.y * xyn);
  }

  div (xyn/*:XY | number*/) /*:XY*/ {
    return xyn instanceof this.constructor
      ? this.make(this.x / xyn.x, this.y / xyn.y)
      : this.make(this.x / xyn,   this.y / xyn);
  }

  neg () /*:XY*/ {
    return this.make(-this.x, -this.y);
  }

  mag () /*:flt*/ {
    return (this.x * this.x) + (this.y * this.y);
  }

  lgt () /*:flt*/ {
    return Math.sqrt(this.mag());
  }

  min (min/*:XY*/) {
    return this.make(Math.min(this.x, min.x), Math.min(this.y, min.y));
  }

  max (max/*:XY*/) {
    return this.make(Math.max(this.x, max.x), Math.max(this.y, max.y));
  }

  bound (min/*:XY*/, max/*:XY*/) {
    return this.min(max).max(min);
  }

  get minLgt () {
    return Math.min(this.x, this.y);
  }

  get maxLgt () {
    return Math.max(this.x, this.y);
  }

  dot (xy/*:XY*/) /*:flt*/ {
    return (this.x * xy.x) + (this.y * xy.y);
  }

  cross (xy/*:XY*/) /*:flt*/ {
    return (this.x * xy.y) - (this.y * xy.x);
  }

  unit () /*:XY*/ {
    const lgt = this.lgt();
    return 0 < lgt ? this.div(lgt) : this.make(1, 0);
  }

  angle () /*:flt*/ {
    if (0 === this.x)
      return 0 === this.y
        ? 0 : (0 < this.y ? 1 : 3) * MC.PI2;
    const a = Math.atan(this.y / this.x);
    return 0 < this.x ? a + Math.PI : a;
  }

  static fromXY (p/*:{x: number, y: number} */) /*:XY*/ {
    return this.make(p.x, p.y);
  }

  static fromWH (wh/*:{w: number, h: number} */) /*:XY*/ {
    return this.make(wh.w, wh.h);
  }

  toRA () /*:RA*/ {
    const r = this.lgt();
    return 0 < r
      ? RA.make(r, this.angle()) : RA.make(0, 0); // eslint-disable-line
  }
}

class RA {
  /*:: r: *; a: *; */ // polar: r , (a)ngle; always normalized
  constructor (r/*:flt*/, a/*:flt*/) {
    this.r = r; this.a = a; this._norm();
  }

  toString () {
    return `(${this.r}/${this.a})`;
  }

  make (r/*:flt*/, a/*:flt*/) /*:RA*/ {
    return this.constructor.make(r, a);
  }

  static make (r/*:flt*/, a/*:flt*/) /*:RA*/ {
    return new this(r, a);
  }

  static _0 () {
    return this.make(0, 0);
  }

  clone () /*:RA*/ {
    return this.make(this.r, this.a);
  }

  is0 () /*:boolean*/ {
    return 0 === this.r;
  }

  eq (ra) /*:boolean*/ {
    return this.r === ra.r && (this.is0() || this.a === ra.a);
  }

  _norm () {
    if (0 > this.r) {
      this.r = -this.r; this.a += Math.PI;
    }
    this.a = MC.normPIPI(this.a);
  }

  toXY () /*:XY*/ {
    return MC.xy(this.r * Math.cos(this.a), this.r * Math.sin(this.a));
  }
}

class Trf { // transform
  /*:: xy: * */
  constructor (xy/*:XY*/) {
    this.xy = xy;
  }

  toString () {
    const xy = this.xy.toString();
    return `[${xy}]`;
  }

  static make (xy/*:XY*/) /*:Trf*/ {
    return new this(xy);
  }

  static _0 () {
    return this.make(XY._0());
  }

  svgString () {
    return this.is0()
      ? '' : `translate(${this.xy.x} ${this.xy.y}) `;
  }

  is0 () /*:boolean*/ {
    return this.xy.is0();
  }

  get dx () /*:flt*/ {
    return this.xy.x;
  }

  get dy () /*:flt*/ {
    return this.xy.y;
  }

  plus (xy/*:XY*/) /*:Trf*/ {
    return new this.constructor(this.xy.plus(xy));
  }
}

MC.XY  = XY;
MC.RA  = RA;
MC.Trf = Trf;

MC.xy  = (x, y) => XY.make(x, y);
MC.ra  = (r, a) => RA.make(r, a);
MC.trf = (xy)   => new Trf(xy);

// }());

// eof

//****** audio.js
// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line

/*:: type time = number; */
/*:: type val  = number; */

// (function () {

const Audio = {};
Audio.ctx = new AudioContext();
Audio.sr  = Audio.ctx.sampleRate;
Audio.now = () => Audio.ctx.currentTime;

Audio.dest = (null/*:?Gain*/);

Audio.mute = () => {
  if (Audio.dest)
    Audio.dest.node.gain.linearRampToValueAtTime(0, Audio.now() + .1);
};

Audio.after = (delay, fun) => {
  setTimeout(() => {
    fun();
  }, 1000 * delay);
};

Audio.sequence = (...steps) => {
  const step = () => {
    if (steps.length) {
      const [tout, fun] = steps.shift();
      setTimeout(() => {
        fun(); step();
      }, 1000 * tout);
    }
  };
  step();
};

window.addEventListener(
  'beforeunload',
  () => Audio.mute()
);

class ANode {
  /*:: _startState: 0 | 1 | 2; */
  constructor () {
    this._startState = 0;
  }

  inlet ()  /*: ?AudioNode */ { return null; } // eslint-disable-line
  outlet () /*: ?AudioNode */ { return null; } // eslint-disable-line

  start (when/*:time*/ = 0) /*:boolean*/ {
    if (0 !== this._startState)
      return false;
    this.nodeStart(when);
    this._startState = 1;
    return true;
  }

  stop (when/*:time*/ = 0) /*:boolean*/ {
    if (1 !== this._startState)
      return false;
    this.nodeStop(when);
    this._startState = 2;
    return true;
  }

  nodeStart (when/*:time*/) {} // eslint-disable-line
  nodeStop (when/*:time*/)  {} // eslint-disable-line

  // TODO allows only a single connection
  // redo like in patcher
  // keep track of connections; inquiries then possible
  sendTo (to/*:?ANode */ = null) {
    const out = this.outlet();
    if (out) {
      out.disconnect();
      if (to) {
        const inl = to.inlet();
        if (inl)
          out.connect(inl);
      }
    }
  }

  sendToDest () {
    this.sendTo(Audio.dest);
  }

  deleteAfter (delay/*:time*/) {
    Audio.after(delay + .01, () => {
      this.stop();
      this.sendTo();
    });
  }

  static _ramp (par/*:AudioParam*/, isExp/*:boolean*/,
    to/*:val*/, t2/*:: ?:time*/, from/*:: ?:val*/, t1/*:: ?:time*/
  ) {
    if (null == t1)   // eslint-disable-line
      t1 = Audio.now();
    if (null == t2)   // eslint-disable-line
      t2 = t1 = .12;
    par.cancelScheduledValues(t1);
    if (null != from) // eslint-disable-line
      par.setValueAtTime(from, t1);
    if (isExp) {
      const is0 = 0 >= to;
      par.exponentialRampToValueAtTime(is0 ? .0001 : to, t2);
      if (is0)
        par.setValueAtTime(to, t2);
    } else
      par.linearRampToValueAtTime(to, t2);
  }

  rampLin (par/*:AudioParam*/,
    to/*:val*/, t2/*:: ?:time*/, from/*:: ?:val*/, t1/*:: ?:time*/) {
    this.constructor._ramp(par, false, to, t2, from, t1);
  }

  rampExp (par/*:AudioParam*/,
    to/*:val*/, t2/*:: ?:time*/, from/*:: ?:val*/, t1/*:: ?:time*/) {
    this.constructor._ramp(par, true, to, t2, from, t1);
  }

  ramp (par/*:AudioParam*/,
    to/*:val*/, t2/*:: ?:time*/, from/*:: ?:val*/, t1/*:: ?:time*/) {
    const fr = null != from ? from : par.value; // eslint-disable-line
    this.constructor._ramp(par, to < fr, to, t2, from, t1);
  }

  ramps (par/*:AudioParam*/, when/*:time*/, ...as/*:Array<number>*/) {
    let from/*?number*/, t1/*?number*/;
    while (2 <= as.length) {
      const to = as.shift(), t2 = as.shift() + when;
      this.ramp(par, to, t2, from, t1);
      from = to; t1 = t2;
    }
  }

  nowRamps (par/*:AudioParam*/, ...as/*:Array<number>*/) {
    this.ramps(par, Audio.now(), ...as);
  }
}

class AuNode extends ANode {
  /*:: _node: * */
  constructor (node/*:AudioNode*/) {
    super();
    this._node = node;
  }

  inlet () {
    return this._node;
  }

  outlet () {
    return this._node;
  }
}

const hasStartStop = (cls) => class extends cls {
  nodeStart (when/*:time*/) {
    return this._node.start(when);
  }

  nodeStop (when/*:time*/) {
    return this._node.stop(when);
  }
};

class Osc extends hasStartStop(AuNode) {
  /*:: _phs: val; */
  constructor (type = 'sine') {
    super(Audio.ctx.createOscillator());
    this.node.type = type;
    this.cps = 0; this.phs = 0;
  }

  get node () {
    return ((this._node/*:any*/)/*:OscillatorNode*/);
  }

  get cps () {
    return this.node.frequency.value;
  }

  set cps (cps) {
    this.node.frequency.value = cps;
  }

  get phs () {
    return this._phs;
  }

  set phs (phs) {
    this._phs = phs;
    // TODO phase changes better with delay; setPeriodicWave clicks
    const node = this.node;
    if (node) {
      const ri = MC.ra(1, phs).toXY();
      const wave = Audio.ctx.createPeriodicWave(
        new Float32Array([0, ri.x]),
        new Float32Array([0, ri.y])
      );
      node.setPeriodicWave(wave);
    }
  }
}

class Gain extends AuNode {
  /*:: static soft: val; static loud: val; static full: val; */
  constructor (gain = 0) {
    super(Audio.ctx.createGain());
    this.node.gain.value = gain;
  }

  get node () {
    return ((this._node/*:any*/)/*:GainNode*/);
  }

  get amp () {
    return this.node.gain.value;
  }

  set amp (amp) {
    this.ramp(this.node.gain, amp);
  }

  // square better than linear; could be exp.
  get amp2 () {
    return Math.sqrt(this.amp);
  }

  set amp2 (a2) {
    this.amp = a2 * a2;
  }
}

Gain.soft = 0.3; Gain.loud = 0.7; Gain.full = 1.0;

class OscGain extends ANode {
  /*:: osc: Osc; gai: Gain; */
  constructor (type = 'sine', gain = 0) {
    super();
    this.osc = new Osc(type);
    this.gai = new Gain(gain);
    this.osc.sendTo(this.gai);
  }

  inlet () {
    return this.osc.node;
  }

  outlet () {
    return this.gai.node;
  }

  nodeStart (when) {
    this.osc.nodeStart(when);
  }

  nodeStop (when) {
    this.osc.nodeStop(when);
  }
}

class Delay extends AuNode {
  constructor (delay = 0) {
    super(Audio.ctx.createDelay());
    this.delay = delay;
  }

  get node () {
    return ((this._node/*:any*/)/*:DelayNode*/);
  }

  get delay () {
    return this.node.delayTime;
  }

  set delay (delay) {
    this.node.delayTime = delay;
  }
}

class AudioBufferSource extends hasStartStop(AuNode) {
  constructor () {
    super(Audio.ctx.createBufferSource());
  }

  get node () {
    return ((this._node/*:any*/)/*:AudioBufferSourceNode*/);
  }

  nodeStart (when/*:time*/) {
    this.node.start(when);
  }

  nodeStop (when/*:time*/) {
    this.node.stop(when);
  }

  createBuffer (lgt/*:lgt*/, f/*: (idx: idx) => flt */) {
    const buf = Audio.ctx.createBuffer(1, lgt, Audio.sr);
    const dta = buf.getChannelData(0);
    for (let i = 0; i < lgt; ++i)
      dta[i] = f(i);
    this.node.buffer = buf;
    this.node.loop = true;
  }

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
}

class WhiteNoise extends AudioBufferSource {
  constructor () {
    super();
    this.createBuffer(8 * Audio.sr, () => (Math.random() * 2) - 1);
  }
}

// http://noisehack.com/generate-noise-web-audio-api
class PinkNoiseGenerator {  // filtered white noise
  /*:: _b0:*; _b1:*; _b2:*; _b3:*; _b4:*; _b5:*; _b6:*; */
  constructor () {
    this._b0 = .0; this._b1 = .0; this._b2 = .0; this._b3 = .0;
    this._b4 = .0; this._b5 = .0; this._b6 = .0;
  }

  nextSample () {
    const white = (Math.random() * 2) - 1;
    this._b0 = (0.99886 * this._b0) + (white * 0.0555179);
    this._b1 = (0.99332 * this._b1) + (white * 0.0750759);
    this._b2 = (0.96900 * this._b2) + (white * 0.1538520);
    this._b3 = (0.86650 * this._b3) + (white * 0.3104856);
    this._b4 = (0.55000 * this._b4) + (white * 0.5329522);
    this._b5 = (-0.7616 * this._b5) - (white * 0.0168980);

    // (roughly) compensate for gain
    const pink = (this._b0 + this._b1 + this._b2 + this._b3 + this._b4 +
                  this._b5 + this._b6 + (white * 0.5362)) * 0.22;
    this._b6 = white * 0.115926;
    return pink;
  }
}

class PinkNoise extends AudioBufferSource {
  constructor () {
    super();
    const gen = new PinkNoiseGenerator();
    this.createBuffer(8 * MC.Audio.sr, () => gen.nextSample());
  }
}

class Filter extends AuNode {
  constructor (type = 'peaking') {
    super(Audio.ctx.createBiquadFilter());
    const node = this.node;
    node.type = type;
    node.frequency.value = 0;
    node.Q.value = 0;
    node.gain.value = 0;
  }

  get node () {
    return ((this._node/*:any*/)/*:BiquadFilterNode*/);
  }

  get Q () {
    return this.node.Q.value;
  }

  set Q (Q) {
    this.node.Q.value = Q;
  }

  get gain () {
    return this.node.gain.value;
  }

  set gain (gain) {
    this.node.gain.value = gain;
  }

  get cps () {
    return this.node.frequency.value;
  }

  set cps (cps) {
    this.node.frequency.value = cps;
  }
}

(Audio.dest = new Gain(1)).node.connect(Audio.ctx.destination);
Audio.beep  = (cps/*:val*/, amp/*:val*/, sec/*:time*/) => {
  const og = new OscGain();
  og.osc.cps = cps; og.sendToDest(); og.start();
  og.nowRamps(og.gai.node.gain, .3, sec / 3 * 2, 0, sec / 3);
  og.deleteAfter(sec);
};

Audio.testBeep = () => {
  Audio.beep(880, .3, .12);
};

MC.Osc        = Osc;
MC.Gain       = Gain;
MC.OscGain    = OscGain;
MC.Delay      = Delay;
MC.WhiteNoise = WhiteNoise;
MC.PinkNoise  = PinkNoise;
MC.Filter     = Filter;
MC.Audio      = Audio;

// }());

// eof

//****** autils.js
// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line
// (function () {

class Klang {
  static tone (owner/*:any*/, cps/*:val*/, type = 'sine') {
    if (!owner._klang) {
      const og = (new MC.OscGain(type)/*:OscGain*/); og.sendToDest();
      owner._klang = og;
      og.osc.cps = cps;
      og.start();
      og.nowRamps(og.gai.node.gain, .2, .23);
    } else {
      const og = (owner._klang/*:OscGain*/); delete owner._klang;
      og.nowRamps(og.gai.node.gain, 0, .23);
      og.deleteAfter(.3);
    }
  }

  static _bufferKlang (owner/*any*/, Cls/*: typeof AudioBufferSource*/) {
    if (!owner._klang) {
      const g = (new MC.Gain()/*:Gain*/); g.sendToDest();
      const b = new Cls(); b.sendTo(g);
      owner._klang = [g, b];
      b.start();
      g.nowRamps(g.node.gain, .2, .23);
    } else {
      let [g, b] = owner._klang; // eslint-disable-line
      delete owner._klang;
      /*:: g = (g: Gain); b = (b: AudioBufferSource)*/
      g.nowRamps(g.node.gain, 0, .23);
      g.deleteAfter(.3);
      b.deleteAfter(.3);
    }
  }

  static whiteNoise (owner/*any*/) {
    this._bufferKlang(owner, MC.WhiteNoise);
  }

  static pinkNoise (owner/*any*/) {
    this._bufferKlang(owner, MC.PinkNoise);
  }

  static noise (owner, type) {
    if ('white' === type)
      return this.whiteNoise(owner);
    if ('pink' === type)
      return this.pinkNoise(owner);
    return this.tone(owner, 0);
  }
}

MC.Klang = Klang;

// }());

// eof

//****** html.js
// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line

// (function () {
/*::
type ElSel = HTMLElement | WrappedElement | string;
*/

/*:: type OnResize = (lgt, lgt) => void; */
class WrappedElement {
  /*:: _el: HTMLElement; sz: XY; */
  /*:: _onResize: ?OnResize; */
  constructor (elSel/*:ElSel*/, sz/*:?XY*/) {
    this._el = WrappedElement.elSel(elSel);
    this.sz = sz ? sz.clone()
      : XY.make(this.el.clientWidth, this.el.clientHeight);
    this._onResize = null;
    window.addEventListener(
      'resize',
      () => this._callOnResize()
    );
  }

  _callOnResize() {
    if (this._onResize)
      this._onResize(window.innerWidth, window.innerHeight);
  }

  set onResize(f/*:OnResize*/) {
    this._onResize = f;
    this._callOnResize();
  }

  get minSize () {
    return 0;
  }

  resize (sz/*:?XY*/) {
    const _sz = sz ? sz : this.sz;
    const m = this.minSize;
    this.sz = _sz.max(XY.make(m, m));
  }

  resizeToSquare () {
    this.resize(XY.make(this.sz.maxLgt));
  }

  availableRectangle (min/*:XY*/ = MC.xy0(), max/*:?XY*/) /*:XY*/ {
    const p = this.el.parentElement;
    /*:: if (!p)
          return XY._0();
    */
    const pw = p.clientWidth;
    let   ph = p.clientHeight;

    // TODO hack
    if (768 >= pw)
      ph = pw;
    let sz = XY.make(pw, ph);
    if (max)
      sz = sz.min(max);
    sz = sz.max(min);
    return sz;
  }

  availableSquare () /*:XY*/ {
    return XY.make(this.availableRectangle().minLgt);
  }

  static elSel (elSel/*:ElSel*/) /*:HTMLElement*/ {
    if ('string' === typeof elSel)
      return ((document.querySelector(elSel)/*:any*/)/*:HTMLElement*/);
    if (WrappedElement.prototype === Object.getPrototypeOf(elSel))
      return ((elSel/*:any*/)/*:WrappedElement*/).el;
    return ((elSel/*:any*/)/*:HTMLElement*/);
  }

  get el () {
    return this._el;
  }

  addClass (cls/*:str*/) {
    this.el.classList.add(cls);
  }

  remClass (cls/*:str*/) {
    this.el.classList.remove(cls);
  }

  hasClass (cls/*:str*/) /*:boolean*/ {
    return this.el.classList.contains(cls);
  }

  toggleClass (cls/*:str*/, add/*:: ?:boolean*/) /*:boolean*/ {
    return this.el.classList.toggle(cls, add);
  }

  isShown () {
    return !this.hasClass('hidden');
  }

  show (on = true) {
    this.toggleClass('hidden', !on);
  }

  hide () {
    this.show(false);
  }

  set width (w/*:flt*/) {
    this.el.style.width  = `${w}px`;
  }

  set height (h/*:flt*/) {
    this.el.style.height = `${h}px`;
  }

  set color (c) {
    this.el.style.color = c;
  }

  set background (b) {
    this.el.style.background = b;
  }

  get sz () /*:XY*/ {
    return MC.xy(this.el.clientHeight, this.el.clientHeight);
  }

  set sz (xy /*:XY*/) {
    this.width  = xy.x;
    this.height = xy.y;
  }

  get bsz () /*:XY*/ {
    const r = this.el.getBoundingClientRect();
    return MC.xy(r.width, r.height);
  }
}

MC.WrappedElement = WrappedElement;
MC.wrapElement    = (elSel) => new WrappedElement(elSel);

class Container extends WrappedElement {
  /*:: innerElem: HTMLElement; scene: Scene; */
  constructor (elSel/*:ElSel*/, innerElem/*:HTMLElement*/, sz/*:?XY*/) {
    super(elSel, sz);
    this.innerElem = innerElem;
    this.el.style.position = 'relative';
    this.el.append(innerElem);
    const style = innerElem.style;
    style.position = 'absolute'
    style.width    = '100%'; style.height = '100%';
    this.resize(sz);
    this.scene = new Scene(this);
  }

  get minSize () { return 32 };

  get bg () /*:GroupNode*/ {
    return this.scene.bg;
  }

  get fg () /*:GroupNode*/ {
    return this.scene.fg;
  }
}

class SvgContainer extends Container {
  constructor (elSel/*:ElSel*/, sz/*:?XY*/) {
    super(elSel, new SVGSVGElement(), sz);
  }

  get svgElem () /*:SVGSVGElement*/ {
    return ((this.innerElem/*:any*/)/*:SVGSVGElement*/);
  }
}

// }());

//****** scene.js
// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line

// missing in flow
/*::
declare class SVGElement extends HTMLElement {}
declare class SVGGraphicsElement extends SVGElement {}
declare class SVGGElement extends SVGGraphicsElement {}
declare class SVGSVGElement extends SVGGraphicsElement {}
*/
// (function () {
class SceneNode {
  /*:: parent: ?GroupNode; scene: Scene; el: SVGElement; */
  constructor (parent/*:?GroupNode*/, scene/*:Scene*/, el/*:SVGElement*/) {
    this.parent = parent; this.scene = scene; this.el = el;
  }

  setElem (idx/*:idx*/, el/*SVGElement*/) {
    this.remElem();
    parent.el.children.insert(idx, this.el = el);
  }

  remElem () {
    if (this.el)
      this.el.remove();
  }

  _attrs () {} // eslint-disable-line

  getAttr (k/*:str*/) /*:?str*/ {
    return this.el.attributes.getNamedItem(k).value;
  }

  setAttr (k/*:str*/, v/*?:str | number */) {
    if (null == v)
      this.el.attributes.removeNamedItem(k);
    else {
      const attr = document.createAttribute(k);
      attr.value = ('string' === typeof v) ? v : v.toString();
      this.el.attributes.setNamedItem(attr);
    }
  }

  isShown () {
    return 'none' != this.getAttr('display');
  }

  show (on = true) {
    this.setAttr('display', on ? '' : 'none');
  }

  hide () {
    this.show(false);
  }

  set stroke (color) {
    this.setAttr('stroke', color);
  }

  get stroke () {
    return this.getAttr('stroke');
  }

  set fill (color) {
    this.setAttr('fill', color);
  }

  get fill () {
    return this.getAttr('fill');
  }

  set color (color) {
    this.stroke = color; this.fill = color;
  }

  set width (width) {
    this.setAttr('stroke-width', width);
  }

  set lineCap (cap) {
    this.setAttr('stroke-linecap', cap);
  }

  set lineJoin (join) {
    this.setAttr('stroke-linejoin', join);
  }

  set dashArray (pat) {
    this.setAttr('stroke-dasharray', pat);
  }

  solidStroke () {
    this.dashArray = null;
  }

  dottedStroke () {
    this.dashArray = '1,3';
  }

  dashedStroke () {
    this.dashArray = '3,2';
  }
}

class GroupNode extends SceneNode {
  /*:: nodes: Array<SceneNode>; trf: Trf; */
  // TODO remove scene
  constructor (parent/*:?GroupNode*/, scene/*:Scene*/) {
    super(parent, scene, new SVGGElement());
    this.nodes = []; this.trf = MC.trf0();
    this._attrs();
  }

  get trf () {
    return this.trf;
  }

  set trf (trf) {
    this.trf = trf; this._attrTR();
  }

  get p () /*:XY*/ {
    return this.trf.xy;
  }

  set p (p/*:XY*/) {
    this.trf.xy = p;
  }

  get gp () {
    const p = this.p;
    return parent ? parent.pageXOffset.plus(p) : p;
  }

  _attrTR () {
    this.setAttr('transform', this.trf.svgString());
  }

  _attrs () {
    super._attrs();
    this._attrTR();
  }

  isRoot () {
    return !!parent;
  }

  get isEmpty () {
    return !this.nodes.length;
  }

  group () {
    return this.add(new GroupNode(this, this.scene));
  }

  // nested bg - fg
  /*:: _bg: ?GroupNode; _fg: ?GroupNode; */

  get bg () /*:GroupNode*/ {
    return this._bg ?
      this._bg : this.back(this._bg = new GroupNode(this, this.scene));
  }

  get fg () /*:GroupNode*/ {
    return this._fg ?
      this._fg : this.front(this._fg = new GroupNode(this, this.scene));
  }

  insert/*::<T>*/ (idx/*:idx*/, nt/*:T*/) /*:T*/ {
    const n = ((nt/*:any*/)/*:SceneNode*/);
    if (null != n.parent)
      n.parent.rem(n);
    n.parent = this; n._setScene(scene);
    index = Math.min(index, nodes.length);
    nodes.insert(index,n); n.setElem(index,n.el);
    return nt;
  }

  add (n/*:SceneNode*/) /*:SceneNode*/ {
    return this.insert(this.nodes.length, n);
  }

  // void addAll(List<SceneNode> ns) {
  //   var ns_ = new List<SceneNode>.from(ns);  // add may modify ns
  //   for (var n in ns_) add(n);
  // }

  front (n/*:SceneNode*/) /*:SceneNode*/ {
    return this.add(n);
  }

  back/*::<T>*/ (n/*:T*/) /*:T*/ {
    return this.insert(0, n);
  }

  rem (n/*:SceneNode*/) {
    const ns = this.nodes;
    ns.splice(ns.indexOf(n), 1);
    n.remElem();
    n.parent = null;
  }

  // void frontSelf() { parent.front(this); }
  // void backSelf()  { parent.back(this);  }
  // void remSelf()   { parent.rem(this);   }

  // void remAll() {
  //   while (nodes.length>0)
  //     rem(nodes.first);
  // }

  // void noSuchMethod(Invocation inv) {
  //   try {
  //     return ExtraMethods.apply(this, GroupNode, inv);
  //   } catch(e) {
  //     return super.noSuchMethod(inv);
  //   }
  // }
}
/*
typedef void MoveEvent(XY); */
class Scene extends GroupNode {
  /*:: container: Container;*/
  constructor (container/*:Container*/) {
  }
}
/*
class Scene extends GroupNode {

  Scene(this.container) {
    scene = this; el = container.innerElem;
    _attrs();
  }

  void _attrs() {
    super._attrs();
    stroke = 'black'; width = 1; fill = 'none';
    lineCap = 'round';
  }

  // hooks
  String cursor;

  // moving
  XY _lastPointerPos = xy0(); int offX = 0, offY = 0;

  XY pointerPos(UIEvent e, bool first) {
    /* FIXME
        FF does not have offsetLeft/offsetTop
        FF jerky when moving mouse - sometimes reporting wrong pointer coordinates
     * /
    if (first) {
      var dof = System.isFF() ? xy0() : el.documentOffset;
      offX = window.scrollX - dof.x;
      offY = window.scrollY - dof.y;
    }

    var cl;
    if (e is MouseEvent) {
      cl = e.client;
    } else {
      var ts = (e as TouchEvent).targetTouches;
      if (ts.isEmpty) return _lastPointerPos;
      cl = ts.first.client;
    }

    _lastPointerPos = xy(cl.x+offX,cl.y+offY);
    return _lastPointerPos;
  }

  Object onBeginEvent(f(XY)) =>
    System.oneStream(el.onMouseDown,el.onTouchStart).listen((e) {
      e.preventDefault(); f(pointerPos(e,true));
    });

  MoveEvent _onMove, _onEnd;
  var _onPointerMove, _onPointerUp;

  void onMoveBegin(XY p, MoveEvent onBegin, MoveEvent onMove, [MoveEvent onEnd]) {
    if (null!=onBegin) onBegin(p);

    _onMove = onMove;
    _onPointerMove = System.oneStream(document.onMouseMove,document.onTouchMove).listen((e) {
      e.preventDefault();
      onMoveMove(pointerPos(e,false));
    });

    _onEnd = onEnd;
    _onPointerUp = System.oneStream(document.onMouseUp,document.onTouchEnd).listen((e) {
      e.preventDefault();
      onMoveEnd(pointerPos(e,false));
    });
  }

  void onMoveMove(XY p) {
    if (null!=_onMove) _onMove(p);
  }

  void onMoveEnd(XY p) {
    _onPointerMove.cancel(); _onPointerUp.cancel();
    if (null!=_onEnd) _onEnd(p);
    _onMove = _onEnd = null;
  }
}

abstract class LeafNode extends SceneNode {
  LeafNode();
}
*/
// }());

// eof

//******
//******
