// load and parse page content
/* global cm:false book:false */

(function () {

class BookAdapter extends cm.Adapter {
  constructor () {
    super();
    this.book = book;

    // reverse-lookup in toc
    const toc = this.book.toc;
    this.tocKeyPath = {};
    for (const key of Object.keys(toc))
      this.tocKeyPath[toc[key][1]] = key; //TOC

    this.thisTocKey =
      this.tocKeyPath[this.book.pagePath + this.book.pageFile];
  }

  tocTxLink (off = 0) { // TOC
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
    loadScript('js/3rd/highlight.pack.js', () => {
      document.querySelectorAll('pre code').forEach(
        /* global hljs:false */
        (block) => hljs.highlightBlock(block));
    });

  // mathjax, if any
  if (cm.parser.hasMath) {
    loadCSS('js/3rd/katex.min.css');
    loadScripts(['js/3rd/katex.min.js', 'js/3rd/katex-render.min.js']);
  }
};

if ('undefined' !== typeof document) {
  let src = book.source;
  if (!src)
    if ((src = document.querySelector('body > pre')))
      src = src.innerText;
    else
      src = '';
  setDocumentBody(src);
}

}());
// eof
