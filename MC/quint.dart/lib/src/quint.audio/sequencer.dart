part of quint.audio;

class SeqAction extends Comparable {
  num t; Function act;
  int n = 0;  // to differentiate instances with the same t
  SeqAction(this.t,this.act);

  int compareTo(SeqAction that) {
    int res = t.compareTo(that.t);
    if (0==res) res = n.compareTo(that.n);
    return res;
  }
}

class SeqActions {
  var set = new SplayTreeSet<SeqAction>();

  SeqActions();
  SeqActions.from(List ls, [num t=0]) {
    num t = 0;
    for (var l in ls) {
      if (l is num) { // advance time
        t += l; continue;
      }
      if (l is Action) {
        add(new SeqAction(t,l)); continue;
      }
      assert (false);
    }
  }

  void add(SeqAction act) {
    while (set.contains(act)) ++act.n;
    set.add(act);
  }

  void remove(SeqAction act) {
    set.remove(act);
  }

  void addAll(SeqActions as) {
    for (var a in as.set) add(a);
  }
}

class Sequence {
  var acts = new SeqActions();

  Sequence();
  Sequence.from(List ls): acts = new SeqActions.from(ls);

  void _runGroup(List<SeqAction> as) {
    for (var a in as) a.act();
  }

  void _step(double startTime) {
    var set = acts.set;
    if (set.isEmpty) return;
    var t = set.first.t, actGroup = [];
    while (!set.isEmpty && t == set.first.t) {
      var act = set.first;
      set.remove(act); actGroup.add(act);
    }
    var wt = math.max(0, t - (Audio.now - startTime));
    Async.oneShot(wt,() { _runGroup(actGroup); _step(startTime); });
  }

  void run() {
    _step(Audio.now);
  }
}

// eof
