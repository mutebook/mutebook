part of quint.util;

class System {
  static bool isIOS()     => new RegExp('iPad|iPhone|iPod').hasMatch(userAgent);
  static bool isFF()      => new RegExp('Firefox').hasMatch(userAgent);
  static bool isChrome()  => new RegExp('Chrome').hasMatch(userAgent);
  static bool isSafari()  => !isChrome() && new RegExp('Safari').hasMatch(userAgent);
  static bool isApple()   => isIOS() || isChrome();

  static Navigator get navigator    => window.navigator;
  static String    get userAgent    => navigator.userAgent;

  static void alert(msg)            => window.alert(msg.toString());

  // iOS does not have maxTouchPoints
  static int  get touchPoints  => isIOS() ? 1 : (null==navigator.maxTouchPoints) ? 0 : navigator.maxTouchPoints;
  static bool isTouch() => touchPoints > 0;

  static oneStream(mousy,touchy)   => isTouch() ? touchy : mousy;
}

// eof
