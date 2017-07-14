// (CM) parser and renderer; canonical js implementation

// namespace
const cm = {
  NUL : '\x00',   // also indicates line end
  LT  : '\x01',   // instead of html-special '<'
};

// for node.js
/* global module:false */
if ('undefined' !== typeof module)
  module.exports = cm;

// text input
class CM_input {
  constructor (tx) {
    // split to lines; trim trailing blanks
    let tx0 = tx.split('\n').map((line) => line.trimRight()).join(cm.NUL);
    // ensure that the last line is terminated
    if (cm.NUL !== tx0.charAt(tx0.length - 1))
      tx0 += cm.NUL;

    // set up generator (that way utf is handled)
    this._gen = (function *() {
      for (const c of tx0)
        yield c;
    }());

    // set up and initialize the generated queue
    this._que = []; this.peek();
  }

  // get next generated item
  _next () {
    const n = this._gen.next();
    if (n.done) // replace undefined
      n.value = cm.NUL;
    return n;
  }

  hasMore () {
    this.peek();
    return !this._que[0].done;
  }

  peek (ahead = 0) {
    while (this._que.length <= ahead)
      this._que.push(this._next());
    return this._que[ahead].value;
  }

  skip (n = 1) {
    while (0 < n--)
      this.next();
  }

  // next character (or NUL if done)
  next () {
    return this._que.length ? this._que.shift().value : this._next().value;
  }

  // next character with line continuation; also replaces NUL by ' '
  nextCont (escChar, always) {
    if (!this.hasMore())
      return cm.NUL;

    const c = this.next();
    if ((always && cm.NUL === c) || (escChar === c && cm.NUL === this.peek()))
      return ' ';

    return c;
  }

  // next line (raw)
  nextLine () {
    let line = '', c;
    while (cm.NUL !== (c = this.next()))
      line += c;
    return line;
  }

  isLower (ahead = 0) {
    const c = this.peek(ahead);
    return 'a' <= c && c <= 'z';
  }

  isDigit (ahead = 0) {
    const c = this.peek(ahead);
    return '0' <= c && c <= '9';
  }

  isWhite (ahead = 0) {
    const c = this.peek(ahead);
    return ' ' === c || '\t' === c; // '\n's have been removed
  }

  skipWhite () {
    if (!this.isWhite())
      return false;
    while (this.isWhite())
      this.next();
    return true;
  }

  skipRest () {
    while (cm.NUL !== this.next())
      ;
  }

  isEndOfLine () {
    return cm.NUL === this.peek();
  }

  // match (atLeast) n "c" characters; return how many
  matches (c, n = 1, atLeast = false) {
    let i = 0;
    while (c === this.peek(i))
      ++i;
    if (n === i || (atLeast && n < i)) {
      this.skip(i);
      return i;
    }
    return 0;
  }
}

// null adapter for output
class CM_adapter {
  anchor (href) {
    return href;
  }

  canonLink (href) {
    return href;
  }

  link (ln) {
    return this.canonLink(ln);
  }

  gotoLink (_ln, _anchor) {
      return '';
  }

  tocTxLink (_off = 0) {
    return ['', ''];
  }
}

// HTML target for output
class CM_html_adapter extends CM_adapter {
  anchor (href) { // TODO review
    return this.canonLink(this.pageFile + href);
  }

  canonLink (href) { // TODO needed?
    // http://stackoverflow.com/questions/14780350
    const a = document.createElement('a');
    a.href = href;
    return a.href;
  }

  link (ln) {
    return this.book.resolveLink(ln);
  }

  gotoLink (ln, anchor) {
    if (window === top) // not in a frame
      return '';
    return ` onclick=${JSON.stringify(`return cm.goto('${ln}','${anchor}')`)}`;
  }
}

// abstract output
class CM_output {
  constructor (outFun, adapter = null) {
    this.out = outFun;
    this.adapter = adapter || new CM_adapter();
    this._capture = null;   // captured output
    this._captures = [];    // a stack of captured output
  }

  begCapture () {
    if (null !== this._capture)
      this._captures.push(this._capture);
    this._capture = '';
  }

  endCapture () {
    const res = this._capture;
    if (this._captures.length)
      this._capture = this._captures.pop();
    else
      this._capture = null;
    return res;
  }

  _encode (c) {
    return c;
  }

  put (tx) {
    if (null === this._capture) {
      let res = '';
      for (const c of tx)
        res += this._encode(c);
      this.out(res);
    } else
      this._capture += tx;
  }

  putEsc (c) {
    if ('n' === c)
      this.putBr();
    else
      this.put(c);
  }
}

// HTML output
class CM_html_output extends CM_output {
  constructor (outFun, adapter = null) {
    super(outFun, adapter);
    this._ends = [];
  }

  _encode (c) {
    switch (c) {
      case '&':   return '&amp;';
      case '<':   return '&lt;';
      case cm.LT: return '<';
      default:    return c;
    }
  }

  _attr (name, val) {
    return val ? ` ${name}=${JSON.stringify(val)}` : '';
  }

  _cls (cs) {
    return this._attr('class', cs.length ? cs.join(' ') : '');
  }

  putTag (tag, cs = [], extra = '', closed = false) {
    this.put(`${cm.LT}${tag}${this._cls(cs)}${extra}${closed ? '/' : ''}>`);
  }

  putEndTag (tag) {
    this.put(`${cm.LT}/${tag}>`);
  }

  putBr () {
    this.putTag('br', [], '', true);
  }

  sec (tag, cs = []) {
    this.putTag(tag, cs);
    this._ends.push(tag);
  }

  secEnd () {
    this.putEndTag(this._ends.pop());
  }

  h (n, anchor = '', cs = []) {
    this.sec(`h${n}`, cs);
  }

  p (cs = []) {
    this.sec('p', cs);
  }

  b () {
    this.sec('b');
  }

  em () {
    this.sec('em');
  }

  ul (cs = []) {
    this.sec('ul', cs);
  }

  ol (cs = []) {
    this.sec('ol', cs);
  }

  li () {
    this.sec('li');
  }

  pre (cs = []) {
    this.sec('pre', cs); this.sec('code', cs);
  }

  preEnd () {
    this.secEnd(); this.secEnd();
  }

  code () {
    this.sec('code');
  }

  hr (cs = []) {
    this.putTag('hr', cs, '', true);
  }

  span (cs = []) {
    this.sec('span', cs);
  }

  table (cs = []) {
    this.sec('table', cs);
  }

  tr () {
    this.sec('tr');
  }

  th () {
    this.sec('th');
  }

  td () {
    this.sec('td');
  }

  img (src, alt, cs = []) {
    this.putTag('img', cs,
      this._attr('src', this.adapter.link(src)) + this._attr('alt', alt));
  }

  anchor (ln) {
    this.putTag('a', [], this._attr('href', ln));
    this.putEndTag('a');
  }

  a (tx, ln, cs = []) {
    let trg;
    if (ln.startsWith('#'))
      trg = this._attr('href', ln);
    else {
      if (0 <= ln.indexOf('://')) // absolute
        cs.push('extern');
      const hashPos = ln.lastIndexOf('#');
      let anchor = '';
      if (0 <= hashPos) {
        anchor = ln.slice(hashPos);
        ln = ln.slice(0, hashPos);
      }
      trg = this._attr('href', this.adapter.link(ln) + anchor) +
                               this.adapter.gotoLink(ln, anchor);
    }
    this.putTag('a', cs, trg);
    this.put(tx);
    this.putEndTag('a');
  }
}

class CM_parser {
  _init () {
    this.chr =  {
      pgm: '@', cmt: '#', h: '=', hr: '-', p: '.', ul: '-', ol: '*',
      pre: '~', sec: '-', cls: '.', hook1: '{', hook2: '|', hook3: '}',
      esc: '\\', b: '', em: '', // b: '*', em: '/',
    };

    this._inPre = this._inPar =
    this._inList = this._inListItem =
    this._inTable =
    this._inB = this._inEm =
    this.hasPre = this.hasJax = false;

    this._sects = this._hooks = 0;
  }

  parse (cmInput, cmOutput) {
    this._init();
    this.inp = cmInput; this.out = cmOutput;

    while (this.inp.hasMore())
      if (this._inTable)
        this.tableLine();
      else {
        const chr = this.chr, c = this.inp.peek();
        if (this._inPre)
          this.mayBePre();
        else if (this._inList && this.mayBeContinuation())
          ;
        else if (c === chr.pgm && this.mayBePragma())
          ;
        else if (c === chr.cmt && this.mayBeComment())
          ;
        else if (c === chr.h   && this.mayBeHeader())
          ;
        else if ((c === chr.ul || c === chr.ol) && this.mayBeList())
          ;
        else if (c === chr.pre && this.mayBePre())
          ;
        else if (c === chr.sec && this.mayBeSec())
          ;
        else if (c === chr.hr  && this.mayBeHr())
          ;
        else if (this.mayBeEmptyLine())
          ;
        else this.doTopLine();
      }

    this.endAll();
  }

  nextCont () {
    return this.inp.nextCont(this.chr.esc, 0 < this._hooks);
  }

  endPar () {
    if (this._inPar)
      this.out.secEnd();
    this._inPar = false;
  }

  endList () {
    this.endListItem();
    if (this._inList)
      this.out.secEnd();
    this._inList = false;
  }

  endListItem () {
    if (this._inListItem)
      this.out.secEnd();
    this._inListItem = false;
  }

  endPre () {
    if (this._inPre)
      this.out.preEnd();
    this._inPre = false;
  }

  b (on = null) {
    if (null === on)
      this.b(!this._inB);
    else {
      if (on)
        this.out.b();
      else if (this._inB)
        this.out.secEnd();
      this._inB = on;
    }
  }

  em (on = null) {
    if (null === on)
      this.em(!this._inEm);
    else {
      if (on)
        this.out.em();
      else if (this._inEm)
        this.out.secEnd();
      this._inEm = on;
    }
  }

  endFlow () {
    this.b(false); this.em(false);
    // par, list: mutually exclusive
    this.endPar(); this.endList();
  }

  endAll () {
    this.endFlow(); this.endPre();
    while (this._sects) {
      this.out.secEnd();
      --this._sects;
    }
  }

  cs () {
    const cs = [];
    while (this.inp.matches(this.chr.cls))
      cs.push(this.ident());
    return cs;
  }

  anchor () {
    if (this.inp.matches(this.chr.anc))
      return this.ident();
    return '';
  }

  ident () {
    if (!this.inp.isLower())
      return '';
    let id = '';
    while (this.inp.isLower() || this.inp.isDigit())
      id += this.inp.next();
    return id;
  }

  mayBePre () {
    if (this.inp.matches(this.chr.pre, 3)) {
      const inPre = this._inPre;
      if (inPre)
        this.endPre();
      else {
        this.endFlow();
        this.hasPre = this._inPre = true;
        this.out.pre(this.cs());
      }
      this.inp.skipRest();
      return true;
    }

    if (this._inPre) {
      this.out.put(this.inp.nextLine());
      this.out.put('\n');
    }

    return false;
  }

  mayBeContinuation () {
    if (!this._inList || !this.inp.skipWhite())
      return false;
    this.out.put(' ');
    this.doLine();
    return true;
  }

  mayBePragma () {
    if (!this.inp.matches(this.chr.pgm))
      return false;

    const inp  = this.inp, chr = this.chr;
    const tag  = this.ident(); inp.skipWhite();
    const what = this.ident(); inp.skipWhite();
    const c = inp.next();

    switch (tag) {
    case 'chr':
      switch (what) {
      case 'pgm': chr.pgm = c;  break;
      case 'cmt': chr.cmt = c; break;
      case 'h':   chr.h   = c; break;
      case 'hr':  chr.hr  = c; break;
      case 'p':   chr.p   = c; break;
      case 'ul':  chr.ul  = c; break;
      case 'ol':  chr.ol  = c; break;
      case 'pre': chr.pre = c; break;
      case 'sec': chr.sec = c; break;
      case 'cls': chr.cls = c; break;
      case 'hook':
        [chr.hook1, chr.hook2, chr.hook3] = [c, inp.next(), inp.next()];
        break;
      case 'esc': chr.esc = c; break;
      case 'b':   chr.b   = c; break;
      case 'em':  chr.em  = c; break;
      default:
        break;
      }
      break;
    default:
      break;
    }

    return true;
  }

  mayBeComment () {
    if (!this.inp.matches(this.chr.cmt))
      return false;
    this.inp.skipRest();
    return true;
  }

  mayBeHeader () {
    const n = this.inp.matches(this.chr.h, 1, true);
    if (!n)
      return false;
    this.endFlow();
    this.out.h(n, this.anchor(), this.cs()); this.inp.skipWhite();
    this.doLine();
    this.out.secEnd();
    return true;
  }

  mayBeList () {
    const chr = this.chr, inp = this.inp, c = inp.peek();
    if ((chr.ul !== c && chr.ol !== c) ||
        (!inp.isWhite(1) && chr.cls !== inp.peek(1)))
      return false;

    const which = chr.ul === inp.next() ? 'u' : 'o';
    const cs = this.cs(); inp.skipWhite();
    if (which !== this._inList) {
      this.endFlow();
      this._inList = which;
      if ('u' === which)
        this.out.ul(cs);
      else
        this.out.ol(cs);
    }

    this.endListItem();
    this._inListItem = true;
    this.out.li();
    this.doLine();
    return true;
  }

  mayBeSec () {
    if (!this.inp.matches(this.chr.sec, 3))
      return false;

    this.endFlow();
    this.inp.skipWhite();

    let tag = this.ident(); const cs = this.cs();
    this.inp.skipRest();
    if (!tag && (cs.length || !this._sects))
      tag = 'div';
    if (tag) { // begin
      ++this._sects;
      if ('table' === tag) {
        this._inTable = true;
        this.out.table(cs);
      } else
        this.out.sec(tag, cs);
    } else if (this._sects) { // end
      this.endFlow();
      this.out.secEnd();
      --this._sects;
    }
    return true;
  }

  mayBeEmptyLine () {
    if (!this.inp.isEndOfLine())
      return false;
    this.endFlow(); this.inp.next();
    return true;
  }

  mayBeHr () {
    if (!this.inp.matches(this.chr.hr, 4, true))
      return false;
    this.endFlow();
    this.out.hr(this.cs());
    this.inp.skipRest();
    return true;
  }

  otherHook (tx) {
    const otherHookMap = {
      '=>': '⇒', '<=': '⇐',
      '->': '→', '<-': '←',
      '--': '–', '---': '—',
    };

    const val = otherHookMap[tx];
    if (undefined !== val)
      this.out.put(val);
  }

  // TODO make pluggable hooks
  processHook (hook, cs, parts) {
    const padParts = function (n) {
      const res = [];
      for (let i = 0; i < n; ++i) {
        let part = i < parts.length ? parts[i] : '';
        if (0 === i)
          part = part.trimLeft();
        res.push(part);
      }
      return res;
    };

    switch (hook) {
    case 'a': {
      let [tx, link] = padParts(2);
      if (!link.length)
        link = tx;
      this.out.a(tx, link, cs);
      break;
    }
    case 'img': {
      const [src, alt] = padParts(2);
      this.out.img(src, alt, cs);
      break;
    }
    case 'prev': case 'next': {
      const [tx, ln] = this.out.adapter.tocTxLink('prev' === hook ? -1 : +1);
      if (tx) {
        const [before] = padParts(1);
        this.out.span(cs);
        this.out.put(before);
        this.out.a(tx, ln, [], true);
        this.out.secEnd();
      }
      break;
    }
    case 'wp': {
      let [tx, link] = padParts(2);
      if (!link.length)
        link = tx;
      link = link.replace(/ /g, '_');
      link = `https://en.wikipedia.org/wiki/${link}`;
      cs.push('wp');
      this.out.a(tx, link, cs);
      break;
    }
    case 'x': {
      const [tx] = padParts(1);
      this.out.put(`$$${tx}$$`);
      this.hasJax = true;
      break;
    }
    default:
      break;
    }
  }

  doHook () {
    const inp = this.inp, out = this.out;
    this._hooks++; out.begCapture();

    let simple = false, hooked = false, c = inp.peek();
    switch (c) {
    case '*': case '/': case '~':
      simple = inp.next();
      break;
    case ':':
      inp.skip();
      hooked = 'a'; // TODO remeve {a ...}
      break;
    default:
      hooked = this.ident();
    }

    const chr = this.chr;
    if (hooked) {
      const cs = this.cs(), parts = []; let part = '';
      inp.skipWhite();
      while (cm.NUL !== (c = this.nextCont()))
        if (chr.esc === c)
          part += c + inp.next();
        else if (chr.hook1 === c)
          part += this.doHook();
        else if (chr.hook2 === c) {
          parts.push(part); part = '';
        } else if (chr.hook3 === c)
          break;
        else
          part += c;

      parts.push(part);
      this.processHook(hooked, cs, parts);
    } else
    if (simple) {
      switch (simple) {
      case '*': out.b();    break;
      case '/': out.em();   break;
      case '~': out.code(); break;
      }

      while (cm.NUL !== (c = this.nextCont()))
        if (chr.esc === c)
          out.putEsc(this.inp.next());
        else if (chr.hook1 === c)
          out.put(this.doHook());
        else if (chr.hook3 === c)
          break;
        else
          out.put(c);

      out.secEnd();
    } else {
      let part = '';
      while (cm.NUL !== (c = this.nextCont()))
        if (chr.esc === c)
          part += c + inp.next();
        else if (chr.hook1 === c)
          part += this.doHook();
        else if (chr.hook3 === c)
          break;
        else
          part += c;
      this.otherHook(part);
    }

    --this._hooks;
    return out.endCapture();
  }

  doTopLine () {
    this.endList();
    if (this.inp.matches(this.chr.p)) { // explicit para
      this.endPar();
      this._inPar = true;
      this.out.p(this.cs());
    } else if (!this._inPar) { // implicit para
      this._inPar = true;
      this.out.p();
    }

    this.doLine();
    this.out.put(' ');
  }

  doChar (c) {
    if (this.chr.b === c)
      this.b();
    else if (this.chr.em === c)
      this.em();
    else
      this.out.put(c);
  }

  doLine () {
    const chr = this.chr; let c;
    while (cm.NUL !== (c = this.nextCont()))
      if (chr.esc === c)
        this.out.putEsc(this.inp.next());
      else if (chr.hook1 === c)
        this.out.put(this.doHook());
      else
        this.doChar(c);
  }

  tableCell (endChar) {
    let c;
    while (cm.NUL !== (c = this.nextCont()))
      if (this.chr.esc === c)
        this.out.putEsc(this.inp.next());
      else if (this.chr.hook1 === c)
        this.out.put(this.doHook());
      else if (endChar === c)
        break;
      else
        this.doChar(c);
  }

  tableLine () {
    const inp = this.inp, out = this.out;
    if (inp.matches(this.chr.sec, 3)) {
      inp.skipRest(); out.secEnd();
      this._inTable = false; --this._sects;
    } else {
      out.tr();
      let c;
      while (cm.NUL !== (c = this.nextCont()))
        if (this.chr.esc === c)
          out.putEsc(this.inp.next());
        else if ('[' === c) {
          out.th();
          this.tableCell(']');
          out.secEnd();
        } else if ('(' === c) {
          out.td();
          this.tableCell(')');
          out.secEnd();
        }
        // else ignored
      out.secEnd();
    }
  }
}

cm.Input   = CM_input;
cm.Output  = CM_html_output;
cm.Adapter = CM_html_adapter;
cm.Parser  = CM_parser;

cm.process = (tx) => {
  let outTx = '';
  const outFun = function (t) {
    outTx += t;
  };

  const inp = new cm.Input(tx), out = new cm.Output(outFun, new cm.Adapter());
  (cm.parser = new cm.Parser()).parse(inp, out);

  return outTx;
};

// eof
