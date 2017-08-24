try { // TODO move
  eval('let arrow = () => 1');
} catch (err) {
  document.querySelector('article').innerHTML =
    '<br/><h2>These pages require a newer version of JavaScript. ' +
    'Please use a modern web browser.</h2>';
}

var book = {
  conf: {
    title:  'Mutebook',
    banner: 'Mutebook',
  },

  pageRoot: 'pg/',
  pagePath: cm_pagePath, pageFile: cm_pageFile,

  // TODO move
  goto: function (ln, anchor, target) {
    const ev = window.event;
    if (undefined !== ev && (ev.ctrlKey || ev.metaKey))
      return true; // follow href in another tab
    top.postMessage(['goto', ln, anchor, target], '*');
    return false;
  },

  // TODO move
  scrollTo: function (anchor) {
    if (!anchor)
      return;
    const els = document.querySelector(`a[name="${anchor.substr(1)}"]`);
    if (els)
      els.scrollIntoView(true);
  },

  // TODO move
  iframeSrc: function (id) {
    const file = book.toc.lst[book.toc.ids[id]][1];
    return 'index.php?pg=' + file;
  },

  // TODO consolidate & Move
  link (ln) {
    let idx = book.toc.ids[ln];
    if (undefined !== idx)
      return 'index.php?pg=' + book.toc.lst[idx][1];

    if (ln.startsWith('/'))
      return ln.substr(1);

    if (0 <= ln.indexOf('://'))
      return ln;

    let pos = ln.indexOf(':');
    if (pos < 0)
      return book.pageRoot + book.pagePath + ln;

    const head = ln.substr(0, pos), tail = ln.substr(++pos);
    idx = book.toc.ids[head];
    if (undefined === idx)
      return ln;

    const fil = book.toc.lst[idx][1];
    const dir = fil.substr(0, fil.lastIndexOf('/'));
    return book.pageRoot + dir + '/' + tail; // TODO PAGES
  }
};

if (cm_file.endsWith('.html')) // static
  book.pageFile = cm_file;

// eof
