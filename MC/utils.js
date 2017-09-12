var MC = MC || {};

MC.Utils = class {
  static tone (owner, cps, type = 'sine') {
    let time = MC.Audio.now;
    if (!owner.osc) {
      const og = new MC.OscGain(type); og.sendToDest();
      owner.osc = og;
      og.osc.cps = cps;
      // TODO
      const par = og.gai._node.gain;
      par.setValueAtTime(0, time);
      par.linearRampToValueAtTime(.2, time + .23);
      og.safeStart(time);
    } else {
      const og = owner.osc; owner.osc = null;
      // TODO
      const par = og.gai._node.gain;
      par.cancelScheduledValues(time);
      par.exponentialRampToValueAtTime(.0001, time += .3);
      par.setValueAtTime(0, time += .1);
      MC.Async.after(1, () => {
        og.safeStop();
      });
    }
  }

  static whiteNoise (owner) {
    let time = MC.Audio.now;
    if (!owner.on) {
      const g = new MC.Gain(); g.sendToDest();
      const n = new MC.WhiteNoise(); n.sendTo(g);
      owner.on = n; owner.og = g;
      // TODO
      const par = g._node.gain;
      par.setValueAtTime(0, time);
      par.linearRampToValueAtTime(.2, time + .23);
      n.safeStart(time);
    } else {
      const n = owner.on; owner.on = null;
      const g = owner.og; owner.og = null;
      // TODO
      const par = g._node.gain;
      par.cancelScheduledValues(time);
      par.exponentialRampToValueAtTime(.0001, time += .3);
      par.setValueAtTime(0, time += .1);
      MC.Async.after(1, () => {
        n.safeStop();
      });
    }
  }

  static pinkNoise (owner) {
    let time = MC.Audio.now;
    if (!owner.on) {
      const g = new MC.Gain(); g.sendToDest();
      const n = new MC.PinkNoise(); n.sendTo(g);
      owner.on = n; owner.og = g;
      // TODO
      const par = g._node.gain;
      par.setValueAtTime(0, time);
      par.linearRampToValueAtTime(.2, time + .23);
      n.safeStart(time);
    } else {
      const n = owner.on; owner.on = null;
      const g = owner.og; owner.og = null;
      // TODO
      const par = g._node.gain;
      par.cancelScheduledValues(time);
      par.exponentialRampToValueAtTime(.0001, time += .3);
      par.setValueAtTime(0, time += .1);
      MC.Async.after(1, () => {
        n.safeStop();
      });
    }
  }

  static noise (owner, type) {
    if ('white' === type)
      return this.whiteNoise(owner);
    if ('pink' === type)
      return this.pinkNoise(owner);
    return this.tone(owner, 0);
  }
};

// eof
