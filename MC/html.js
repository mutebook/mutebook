// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line

(function () {
/*::
type ElSel = HTMLElement | WrappedElement | string;
type XY = {x: number; y: number; };
*/

class WrappedElement {
  /*:: _el: HTMLElement; */
  constructor (elSel) {
    this._el = WrappedElement.elSel(elSel);
  }

  static elSel (elSel/*:ElSel*/) /*:HTMLElement*/ {
    if ('string' === typeof elSel)
      return ((document.querySelector(elSel)/*:any*/)/*:HTMLElement*/);
    if (WrappedElement.prototype === Object.getPrototypeOf(elSel))
      return ((elSel/*:any*/)/*:WrappedElement*/).el;
    return ((elSel/*:any*/)/*:HTMLElement*/);
  }

  get el () {
    return this._el;
  }

  addClass (cls/*:string*/) {
    this.el.classList.add(cls);
  }

  remClass (cls/*:string*/) {
    this.el.classList.remove(cls);
  }

  hasClass (cls/*:string*/) /*:boolean*/ {
    return this.el.classList.contains(cls);
  }

  toggleClass (cls/*:string*/, add/*:: ?:boolean*/) /*:boolean*/ {
    return this.el.classList.toggle(cls, add);
  }

  isShown () {
    return !this.hasClass('hidden');
  }

  show (on = true) {
    this.toggleClass('hidden', !on);
  }

  hide () {
    this.show(false);
  }

  set width (w/*:number*/) {
    this.el.style.width  = `${w}px`;
  }

  set height (h/*:number*/) {
    this.el.style.height = `${h}px`;
  }

  set color (c) {
    this.el.style.color = c;
  }

  set background (b) {
    this.el.style.background = b;
  }

  get sz () /*:XY*/ {
    return MC.xy(this.el.clientWidth, this.el.clientHeight);
  }

  set sz (xy /*:XY*/) {
    this.width  = xy.x;
    this.height = xy.y;
  }

  get bsz () /*:XY*/ {
    const r = this.el.getBoundingClientRect();
    return MC.xy(r.width, r.height);
  }
}

MC.WrappedElement = WrappedElement;
MC.wrapElement    = (elSel) => new WrappedElement(elSel);

}());

// eof
