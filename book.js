/* global CM:false book:false */
book.loadAudio = function () {
  CM.loadScript('../assets/audio_bundle.js');
};

let qmNo = 0;

book.hook = function (tag, cs, parts) {
  // this = HtmlPage
  let loadAudio = false;
  let quintSrc, quintFun, quintCode, divId;

  const toneButton = function (type) {
    const [tx, freq] = parts(2);
    let f = freq || tx;
    f = parseFloat(f); if (isNaN(f)) f = 0;
    this.button(cs, `MC.Klang.tone(this,${f},'${type}')`);
    this.put(tx);
    this.secEnd();
    loadAudio = true;
  };

  const noiseButton = function () {
    const [tx, kind] = parts(2);
    const type = kind.trim() || tx;
    this.button(cs, `MC.Klang.noise(this,'${type}')`);
    this.put(tx);
    this.secEnd();
    loadAudio = true;
  };

  const quintMachine = function () {
    const [src, fun, caption] = parts(3);
    loadAudio = true; // TODO

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

    quintFun = 'fun_' + divId;
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
    CM.loadScript('../assets/audio_bundle.js');
  if (quintSrc || quintCode) {
    CM.loadCSS('../assets/quint.css');
    const qs = ['../assets/quint.dart.js','../assets/quint.js'];
    if (quintSrc)
      qs.push('../' + quintSrc);
    CM.loadScripts(qs, function () {
      try {
        if (quintCode)
          eval(quintCode);
        eval(`${quintFun}('#${divId}')`);
      } catch (err) {
        console.log(err)
        // nix
      }
    });
  }
  return true;
};

// TODO handle loading error if this file does not exist

book.pragma = function (/* tag, what, par */) {
  // handle custom pragmas
  return false;
};

// eof
