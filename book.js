/* global book:false CM:false */

let qmNo = 0;

book.hook = function (tag, cs, parts) {
  let loadAudio = false;
  let quintSrc, quintFun, quintCode, divId;

  const toneButton = function (type) {
    const [tx, freq] = parts(2);
    const f = parseFloat(freq || tx) || 0;
    this.button(cs, `QM.Klang.tone(this,${f},'${type}')`);
    this.put(tx);
    this.secEnd();
    loadAudio = true;
  };

  const noiseButton = function () {
    const [tx, kind] = parts(2);
    const type = kind.trim() || tx;
    this.button(cs, `QM.Klang.noise(this,'${type}')`);
    this.put(tx);
    this.secEnd();
    loadAudio = true;
  };

  const quintMachine = function () {
    const [src, fun, caption] = parts(3);
    divId = 'quint_mach_' + (++qmNo);
    this.div(['app']);
    this.div(['quint'], ` id="${divId}"`);
    this.secEnd();
    this.div(['caption']);
    this.put(caption);
    this.secEnd();
    this.secEnd();

    quintSrc = this.link(src.trim());
    quintFun = 'window.app_' + fun.trim();
  };

  const quintMachineCode = function () {
    const [src, caption] = parts(2);
    divId = 'quint_mach_' + (++qmNo);
    this.div(['app']);
    this.div(['quint'], ` id="${divId}"`);
    this.secEnd();
    this.div(['caption']);
    this.put(caption);
    this.secEnd();
    this.secEnd();

    quintFun  = 'fun_' + divId;
    quintCode = `function ${quintFun} () { ${src} }`;
 };

  switch (tag) {
  case 'btn-sine:': {
    toneButton.apply(this, ['sine']);
    break;
  }

  case 'btn-square:': {
    toneButton.apply(this, ['square']);
    break;
  }

  case 'btn-saw:': {
    toneButton.apply(this, ['sawtooth']);
    break;
  }

  case 'btn-tri:': {
    toneButton.apply(this, ['triangle']);
    break;
  }

  case 'btn-noise:': {
    noiseButton.apply(this, []);
    break;
  }

  case 'quint:': {
    quintMachine.apply(this, []);
    break;
  }

  case 'quint-code:': {
    quintMachineCode.apply(this, []);
    break;
  }

  default:
    return false;
  }

  if (loadAudio)
    CM.loadScript('../audio/klang.js');

  if (quintSrc || quintCode) {
    CM.loadCSS('../assets/quint.css');
    let qs = [];
    if (quintSrc)
      if (0 <= quintSrc.indexOf('://'))
        qs = [quintSrc];
      else
        qs = ['../' + quintSrc];
    CM.loadScripts(qs, function () {
      try {
        if (quintCode)
          eval(quintCode);
        eval(`${quintFun}('#${divId}')`);
      } catch (err) {
        // console.log(err);
      }
    });
  }
  return true;
};

book.pragma = function (/* tag, what, par */) {
  return false;
};

// eof
