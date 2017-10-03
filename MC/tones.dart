// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line
/*::
import type { MCAuNode } from './audio';
*/
(function () {

class Tone extends MC.AuNode {
  /*:: numParts: *; mix: *; adj: *; parts: *; */
  constructor (numParts/*:number*/) {
    this.numParts = numParts;
    adj = new MC.Gain(); mix = new MC.Gain(); adj.sendTo(mix);
    parts = listN(numParts,(i) => new OscGain() ..sendTo(adj) ..safeStart());
    setMulAmp(numParts);
  }

  final int numParts; List<OscGain> parts;
  Gain adj, mix;
  int audibleParts = 0;

  AudioNode get outlet => mix.outlet;

  static num MUL = .6;

  num  get cps      => parts.first.osc.cps;
  set cps(num cps)  { forList(parts, (part,i) => part.osc.cps = cps * (i+1)); }

  num  get amp      => mix.amp;
  set amp(num amp)  { mix.amp = amp; }

  num relAmp(int n) => parts[n].gai.amp;

  void setMulAmp(int np,[num mul]) {
    if (null==mul) mul = MUL;
    audibleParts = np;
    num sum = sumList(parts, (part,i) {
      num relAmp = (i<audibleParts) ? math.pow(mul,i) : 0;
      part.gai.amp = relAmp;
      return relAmp;
    });

    adj.amp = sum>0 ? 1/sum : 0;
  }
}

}());

// eof
