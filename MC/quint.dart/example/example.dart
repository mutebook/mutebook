import 'package:quint/quint.mach.dart';

main() {
  var c = new QuintMachine('#app') ..resize(400,400);
  handle(c.fg,xy(60,60)) ..r=16 ..movable();
}
