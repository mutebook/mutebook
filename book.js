/* global CM:false book:false */
book.hook = function (/* tag, cs, parts */) {
  return false;
};

// TODO handle loading error if this file does not exist

book.pragma = function (tag, what, par) {
  if ('load' === tag && 'audio' === what) {
    CM.loadScripts(['../assets/audio_bundle.js']);
    return true;
  }
  return false;
};

// eof
