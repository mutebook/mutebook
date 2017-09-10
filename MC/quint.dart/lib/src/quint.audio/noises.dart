part of quint.audio;

// ScriptProcessor is deprecated
//abstract class NoiseProcessor extends ScriptProcessor {
//  static const _lgt = 4096;
//
//  NoiseProcessor(): super(_lgt,1,1) {
//    node.onAudioProcess.listen((AudioProcessingEvent e) {
//      var out = e.outputBuffer.getChannelData(0);
//      for (var i=0; i<_lgt; ++i) out[i] = nextSample();
//    });
//  }
//
//  double nextSample();
//}
//
//class WhiteNoiseProcessor extends NoiseProcessor {
//  double nextSample() => Math.rand(-1,1);
//}

// http://noisehack.com/generate-noise-web-audio-api
class WhiteNoise extends AudioBufferSource {
  WhiteNoise() {
    createBuffer(8*Audio.sr, (i) => Math.rand(-1,1));
    safeStart();
  }
}

class PinkNoiseGenerator {  // filtered white noise
  double _b0 = .0, _b1 = .0, _b2 = .0, _b3 = .0, _b4 = .0, _b5 = .0, _b6 = .0;

  double _nextSample() {
    double white = Math.rand(-1,1);
    _b0 = 0.99886 * _b0 + white * 0.0555179;
    _b1 = 0.99332 * _b1 + white * 0.0750759;
    _b2 = 0.96900 * _b2 + white * 0.1538520;
    _b3 = 0.86650 * _b3 + white * 0.3104856;
    _b4 = 0.55000 * _b4 + white * 0.5329522;
    _b5 = -0.7616 * _b5 - white * 0.0168980;

    // (roughly) compensate for gain
    double pink = (_b0 + _b1 + _b2 + _b3 + _b4 + _b5 + _b6 + white * 0.5362) * 0.22;
    _b6 = white * 0.115926;

    return pink;
  }

  static var _gen = new PinkNoiseGenerator();
  static double nextSample() => _gen._nextSample();
}

//class PinkNoiseProcessor extends NoiseProcessor {  // filtered white noise
//  double nextSample() => PinkNoiseGenerator.nextSample();
//}

// http://noisehack.com/generate-noise-web-audio-api
class PinkNoise extends AudioBufferSource {
  PinkNoise() {
    createBuffer(8*Audio.sr, (i) => PinkNoiseGenerator.nextSample());
    safeStart();
  }
}

// eof
