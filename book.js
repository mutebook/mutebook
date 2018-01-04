/* global CM:false book:false */
book.hook = function (tag, cs, parts) {
  // this = HtmlPage
  let loadAudio = false;
  let quintSrc, quintFun, divId;

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

  let qmNo = 0;
  const quintMachine = function () {
    const [src, fun, caption] = parts(3);
    divId = 'quint_mach_' + (++qmNo);
    this.sec('div', ['appx']); // TODO
    this.sec('div', ['quint'], ` id="${divId}"`);
    this.secEnd();
    this.put(caption); // footer
    this.secEnd();

    quintSrc = this.link(src.trim());
    quintFun = fun.trim();
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

  default:
    return false;
  }

  if (loadAudio)
    CM.loadScript('../assets/audio_bundle.js');
  if (quintSrc) {
    CM.loadCSS('../assets/quint.css');
    CM.loadScripts(['../assets/quint.js', '../' + quintSrc], function () {
      try {
        eval(`${quintFun}('${divId}')`);
      } catch (err) {
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
