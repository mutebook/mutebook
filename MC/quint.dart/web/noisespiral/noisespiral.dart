import '../applets/noisespiral.dart';

main() {
  var app = new WrappedResizableElement('#app');
  new NoiseSpiralApplet(app,app.availableSquare());
}

// eof
