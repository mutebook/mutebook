/* global MC:true */
var MC = MC || {};

MC.Async = class {
  static after (delay, fun) {
    setTimeout(() => {
      fun();
    }, 1000 * delay);
  }

  static sequence (...steps) {
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
