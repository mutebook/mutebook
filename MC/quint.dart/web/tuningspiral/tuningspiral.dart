import '../applets/tuningspiral.dart';

main() {
  var app = new WrappedResizableElement('#app');
  new TuningSpiralApplet(app,app.availableSquare());
}

// eof
