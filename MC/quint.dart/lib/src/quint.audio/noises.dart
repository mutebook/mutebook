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


// eof
