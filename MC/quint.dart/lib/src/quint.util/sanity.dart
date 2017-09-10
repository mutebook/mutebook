part of quint.util;
// adapted from quiver.check

typedef String msgFun();

String _msg(msg, [String defMsg = null]) {
  if (null == msg) msg = defMsg;
  else if (msg is msgFun) msg = msg();
  return null==msg ? '' : msg.toString();
}

bool checkArgument(bool test, [msg]) {
  if (!test) throw new ArgumentError(_msg(msg,'argument error'));
  return true;
}

bool checkState(bool test, [msg]) {
  if (!test) throw new StateError(_msg(msg,'state error'));
  return true;
}

// eof
