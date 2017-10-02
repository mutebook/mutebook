// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line
(function () {

/*:: type time = number; */
/*:: type val  = number; */

const Audio = {};
Audio.ctx = new AudioContext();
Audio.sr  = Audio.ctx.sampleRate;
Audio.now = () => Audio.ctx.currentTime;

Audio.dest = (null/*:?Gain*/);

Audio.mute = () => {
  if (Audio.dest)
    Audio.dest.node.gain.value = 0;
};

Audio.ramp = (par/*:AudioParam*/, from/*:val*/, to/*:val*/, dt/*:time*/ = .12) /*:void*/ => {
  let time = Audio.now();
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
};

const Seq = {
  after (delay, fun) {
    setTimeout(() => {
      fun();
    }, 1000 * delay);
  },

  sequence (...steps) {
    const step = () => {
      if (steps.length) {
        const [tout, fun] = steps.shift();
        setTimeout(() => {
          fun(); step();
        }, 1000 * tout);
      }
    };
    step();
  }
};

// eof


window.addEventListener(
  'beforeunload',
  () => Audio.mute()
);

class ANode {
  inlet ()  /*: ?AudioNode */ { return null; } // eslint-disable-line
  outlet () /*: ?AudioNode */ { return null; } // eslint-disable-line

  // TODO allows only a single connection
  // redo like in patcher
  // keep track of connections; inquiries then possible
  sendTo (to/*:?ANode */ = null) /*:void*/ {
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

  sendToDest () /*:void*/ {
    this.sendTo(Audio.dest);
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

const mixStartStop = (cls) => class extends cls {
  start (when/*:time*/ = 0) /*:void*/ {
    const node = this._node;
    if (node.start)
      ((node.start/*:any*/)/*:(time)=>void*/)(when);
  }

  stop (when/*:time*/ = 0) /*:void*/ {
    const node = this._node;
    if (node.stop)
      ((node.stop/*:any*/)/*:(time)=>void*/)(when);
  }
};

class Osc extends mixStartStop(AuNode) {
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
    Audio.ramp(this.node.gain, this.amp, amp);
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
  /*:: osc: *; gai: *; */
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

  start (when = 0) {
    this.osc.start(when);
  }

  stop (when = 0) {
    this.osc.stop(when);
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

class AudioBufferSource extends mixStartStop(AuNode) {
  constructor () {
    super(Audio.ctx.createBufferSource());
  }

  get node () {
    return ((this._node/*:any*/)/*:AudioBufferSourceNode*/);
  }

  start (when = 0) {
    this.node.start(when);
  }

  stop (when = 0) {
    this.node.stop(when);
  }

  createBuffer (lgt/*:number*/, f/*: (index:number) => number */) {
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
Audio.beep  = (cps/*:val*/, amp/*:val*/, sec/*:time*/) /*:void*/ => {
  const og = new OscGain();
  og.osc.cps = cps; og.sendToDest(); og.start();

  let now = Audio.now();
  const par = og.gai.node.gain;
  par.setValueAtTime(0, now);
  par.linearRampToValueAtTime(.3, now += sec / 3 * 2);
  par.exponentialRampToValueAtTime(.0001, now += sec / 3);
  par.setValueAtTime(0, now += .1);

  Seq.after(sec + 1, () => {
    og.stop(); og.sendTo();
  });
};

Audio.testBeep = () /*:void*/ => {
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

}());

// eof
