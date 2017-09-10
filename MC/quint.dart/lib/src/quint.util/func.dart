part of quint.util;

// functional
class Func {
  static Iterable<int> iota(int n)        => new Iterable.generate(n, (i) => i);
  static Iterable mapIota(int n, f(int))  => new Iterable.generate(n, f);
}

void forList(Iterable list, f(el,int)) {
  int i = 0; var it = list.iterator;
  while (it.moveNext()) f(it.current,i++);
}

void forN(int n, f(int)) {
  for (int i=0; i<n; ++i) f(i);
}

List listN(int n, f(int)) => Func.mapIota(n,f).toList();

num sumList(List list, num f(el,int)) {
  num sum = 0; int i = 0; list.forEach((el) => sum += f(el,i++));
  return sum;
}

int listIndex(Iterable list, el, [int def]) {
  int i = 0; var it = list.iterator;
  while (it.moveNext()) {
    if (el==it.current) return i;
    ++i;
  }
  return def;
}

class Option<T> { // adapted from quiver
  final T _val;
  String toString() => (null == _val) ? 'Option[]' : 'Option[${_val}]';

  int get hashCode              => _val.hashCode;
  bool operator ==(Option that) => that._val == _val;

  const Option([this._val = null]);

  bool get hasVal => null != _val;

  T get val {
    checkState(hasVal, 'Option does not have value');
    return _val;
  }

  T or(T defVal) {
    checkArgument(null != defVal, 'defVal must not be null');
    return null == _val ? defVal : _val;
  }

  T get orNull => _val;
}

// eof
