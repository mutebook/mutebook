var MC = MC || {};

MC.Utils = class {
  static tone (owner, cps) {
    let time = MC.Audio.now;
    if (!owner.osc) {
      const og = new MC.OscGain(); og.sendToDest();
      owner.osc = og;
      og.osc.cps = cps;
      // TODO
      const par = og.gai._node.gain;
      par.setValueAtTime(0, time);
      par.linearRampToValueAtTime(.2, time + 2);
      og.safeStart(time + .1);
    } else {
      const og = owner.osc; delete owner.osc;
      // TODO
      const par = og.gai._node.gain;
      par.exponentialRampToValueAtTime(.0001, time += .3);
      par.setValueAtTime(0, time += .1);
      MC.Async.after(1, () => {
        og.safeStop();
      });
    }
  }
};

// eof
