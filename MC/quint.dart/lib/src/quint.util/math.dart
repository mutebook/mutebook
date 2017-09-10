part of quint.util;

class Math {
  static num min(num a, num b) => math.min(a,b);
  static num max(num a, num b) => math.max(a,b);

  static num log2(num v) => math.log(v) * math.LOG2E;
  static num exp2(num v) => math.exp(v / math.LOG2E);

  static num deg2rad(num d) => PI * d / 180;
  static num rad2deg(num r) => r / PI * 180;

  static num sin(num amp, num cps, num phs, num t) => amp * math.sin(PIPI*cps*t + phs);

  static var _rnd = new math.Random();
  static num rand(num min,num max) => min + _rnd.nextDouble() * (max-min);
}

num range2val(num v, num min, num max) => min + v * (max-min);
num val2range(num v, num min, num max) => (v - min) / (max-min);

num scale_val(num val, num minFrom, num maxFrom, num minTo, num maxTo)
=> range2val(val2range(val,minFrom,maxFrom),minTo,maxTo);

// eof
