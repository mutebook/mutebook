part of quint.util;

class RunOnce {
  static var _loaded = new Set<Function>();
  static void run(List<Function> fs) {
    for (var f in fs)
      if (!_loaded.contains(f)) {
        _loaded.add(f);
        f();
      }
  }
}

/* Allows to dynamically extend classes by methods */
class ExtraMethods {
  static Map<Type,Map<Symbol,Function>> _tsf = {};

  static void add(Type typ, Symbol sym, Function fun) {
    Map<Symbol,Function> sf = _tsf[typ];
    if (null==sf) _tsf[typ] = (sf = {});

    Function f = sf[sym];
    if (null==f)
      sf[sym] = fun;
    else
      checkArgument(f==fun,()=>'duplicate method');
  }

  static void addAll(Type typ, Map<Symbol,Function> map)
    => map.forEach((sym,fun) => add(typ,sym,fun));

  static Function get(Type typ,Symbol sym) {
    Map<Symbol,Function> sf = _tsf[typ];
    return (null!=sf) ? sf[sym] : null;
  }

  static dynamic apply(that, Type typ, Invocation inv) {
    Function f = get(typ,inv.memberName);
    assert(null!=f);
    // Invocation has a private member _arguments that we'd like, but cannot access.
    // instead we have to make it
    // TODO request feature
    List args = [that]; args.addAll(inv.positionalArguments);
    return Function.apply(f,args);
  }
}

// eof
