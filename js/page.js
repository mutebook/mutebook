// load and parse page content
/* global cm:false cm_book:false */

(function () {

class BookAdapter extends cm.Adapter {
  constructor () {
    super();
    this.book = cm_book;

    // reverse-lookup in toc
    const toc = this.book.toc;
    this.tocKeyPath = {};
    for (const key of Object.keys(toc))
      this.tocKeyPath[toc[key][1]] = key;

    this.thisTocKey =
      this.tocKeyPath[this.book.pagePath + this.book.pageFile];
  }

  tocTxLink (off = 0) {
    const entry = this.book.tocEntry(this.thisTocKey);
    return entry ? this.book.tocTxLink(entry[4] + off)
                 : super.tocTxLink(off);
  }
}

cm.Adapter = BookAdapter;

cm.goto = (ln, anchor) => {
  const ev = window.event;
  if (ev.ctrlKey || ev.metaKey)
    return true; // follow href in another tab
  top.postMessage(['goto', ln, anchor], '*');
  return false;
};

const setDocumentBody = function (tx) {
  const html = cm.process(tx);
  document.body.innerHTML = `<article>${html}</article>`;

  // scroll to anchor, if any
  const els = document.querySelector(`a[href="${location.hash}"]`);
  if (els)
    els.scrollIntoView(true);

  // highlight code, if any
  if (cm.parser.hasPre)
    cm_book.loadScript('js/3rd/highlight.pack.js').onload = () => {
      document.querySelectorAll('pre code').forEach(
        /* global hljs:false */
        (block) => hljs.highlightBlock(block));
    };

  // mathjax, if any
  if (cm.parser.hasMath) {
    cm_book.loadCSS('js/3rd/katex.min.css');
    cm_book.loadScript('js/3rd/katex.min.js').onload = () => {
      cm_book.loadScript('js/3rd/katex-render.min.js');
    };
  }
};

if ('undefined' !== typeof document) {
  let src = cm_book.source;
  if (!src)
    if ((src = document.querySelector('body > pre')))
      src = src.innerText;
    else
      src = '';
  setDocumentBody(src);
}

if (cm_book.conf.statcounter)
  cm_book.loadScript('../statcounter.js');

}());
// eof
