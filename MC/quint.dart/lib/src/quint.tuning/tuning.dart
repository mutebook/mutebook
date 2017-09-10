part of quint.tuning;

class Tun {
  static num concertA = 440.0;

  static Cps cps([num val=0])  => new Cps(val);
  static Rat rat([num val=1])  => new Rat(val);
  static Pch pch([num val=0])  => new Pch(val);
  static Edo edo([int val=1])  => new Edo(val);
  static Cts cts([num val=0])  => new Cts(val);

  static num get _cpsA4   => concertA;
  static num get _cpsC4   => concertA / 1.681792830507427;
  static num get _pchA4   => 4.75;
  static num get _pchC4   => 8;     // like csound
  static num get _pchLow  => -1e3;  // very low

  static Cps cpsA4()  => cps(_cpsA4);
  static Cps cpsC4()  => cps(_cpsC4);
  static Pch pchA4()  => pch(_pchA4);
  static Pch pchC4()  => pch(_pchC4);
  static Pch pchLow() => pch(_pchLow);
}

abstract class _Tun<T> implements Comparable<T> {
  num val;
  _Tun(this.val);
  T _new(num val);

  int get hashCode          => val.hashCode;
  bool operator ==(T that)  => (that as _Tun<T>).val == val;
  int compareTo(T that)     => val.compareTo((that as _Tun<T>).val);

  bool operator < (T that)  => val <  (that as _Tun<T>).val;
  bool operator > (T that)  => val >  (that as _Tun<T>).val;
  bool operator <=(T that)  => val <= (that as _Tun<T>).val;
  bool operator >=(T that)  => val >= (that as _Tun<T>).val;


  T clamp(T min, T max) => _new(val.clamp((min as _Tun<T>).val,(max as _Tun<T>).val));
}

// cps: frequency
class Cps extends _Tun<Cps> {
  Cps(num val): super(val); String toString() => val.toString();
  Cps _new(num val) => new Cps(val);

  static Cps minAudible = new Cps(8);
  static Cps maxAudible = new Cps(24e3);

  Pch toPch()   => (val>0) ? new Pch(Math.log2(val/Tun._cpsC4) + Tun._pchC4) : Tun.pchLow();
  Cts toCts()   => toPch().toCts();

  Cps operator +(Cps that)  => new Cps(val + that.val);
  Cps operator -(Cps that)  => new Cps(val - that.val);
  Cps operator *(Rat that)  => new Cps(val * that.val);
  Cps operator /(Rat that)  => new Cps(val / that.val);

  static num _nearCps = 1;
  bool isAlmost(Cps that)   => (val-that.val).abs() < _nearCps;

  String toStringRounded() {
    var cps = val, suf = '';
    cps = (cps*1000).round() / 1000;
    if (cps>=1000) {
      cps /= 1000; suf = 'k';
    }
    var res = cps.toStringAsPrecision(3);
    int lgt = res.length;
    if (res.indexOf('.') >= 0) {
      for ( ; ; --lgt) {
        var c = res[lgt-1];
        if ('.'==c) {
          --lgt; break;
        }
        if ('0'!=c) break;
      }
    }

    return res.substring(0,lgt) + suf;
  }
}

// rat: ratio of frequencies
class Rat extends _Tun<Rat> {
  Rat(num val): super(val); String toString() => val.toString();
  Rat _new(num val) => new Rat(val);

  Pch toPch()   => new Pch(Math.log2(val));
  Cts toCts()   => toPch().toCts();

  Rat operator *(Rat that)  => new Rat(val * that.val);
  Rat operator /(Rat that)  => new Rat(val / that.val);
}

// pch: pitch, +1 each octave, C4 = 8; or pitch delta
class Pch extends _Tun<Pch> {
  Pch(num val): super(val); String toString() => val.toString();
  Pch _new(num val) => new Pch(val);

  static Pch minAudible = Cps.minAudible.toPch();
  static Pch maxAudible = Cps.maxAudible.toPch();

  Cps toCps()       => new Cps(Math.exp2(val - Tun._pchC4) * Tun._cpsC4);
  Rat toRat()       => new Rat(Math.exp2(val));
  Edo toEdo(int div)=> new Edo(val * div);
  Cts toCts()       => new Cts(val * 1200);

  Pch operator +(Pch that)  => new Pch(val + that.val);
  Pch operator -(Pch that)  => new Pch(val - that.val);
  Pch mulRat    (Rat that)  => (toCps() * that).toPch();
  Pch divRat    (Rat that)  => (toCps() / that).toPch();

  static num _tinyDiff  = .001;

  bool isAlmost(Pch that)   => (val-that.val).abs() < _tinyDiff;

  Pch harm(int n)     => new Cps(toCps().val * (n+1)).toPch();
  Pch floor(Edo edo)  => new Pch((val*edo.val).floor() / edo.val);
  Pch round(Edo edo)  => new Pch((val*edo.val).round() / edo.val);
  Pch ceil(Edo edo)   => new Pch((val*edo.val).ceil()  / edo.val);

  Pch.fromMidi(int note): super(Tun._pchC4 + (note-60)/12);
}

// cts: cents
class Cts extends _Tun<Cts> {
  String toString() => val.toString();
  Cts(num val): super(val);
  Cts _new(num val) => new Cts(val);

  Pch toPch() => new Pch(val / 1200);
}

// edo: equal division of the octave
class Edo {
  num val; String toString() => val.toString();
  Edo(this.val);

  int get hashCode       => val.hashCode;
  bool operator ==(that) => that is Edo && that.val == val;

  Pch toPch(num steps)  => new Pch(steps / val);

  Iterable<int> allSteps() => Func.iota(val.ceil());
  Iterable<Pch> allPchs()  => allSteps().map((i) => toPch(i));
}

// eof
