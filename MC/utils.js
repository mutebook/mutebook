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
      par.linearRampToValueAtTime(.2, time + .6);
      og.safeStart(time);
    } else {
      const og = owner.osc; owner.osc = null;
      // TODO
      const par = og.gai._node.gain;
      par.cancelScheduledValues(time);
      par.exponentialRampToValueAtTime(.0001, time += .6);
      par.setValueAtTime(0, time += .1);
      MC.Async.after(1, () => {
        og.safeStop();
      });
    }
  }
};

// eof
