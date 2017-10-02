// @flow
/*:: var MC = {}; */ /* global MC:true */
var MC = MC || {}; // eslint-disable-line
(function () {

MC.PI2  = Math.PI / 2;
MC.PIPI = 2 * Math.PI;

// normalize to <0,2pi)
MC.normPIPI = function (a/*:number*/) /*:number*/ {
  return a < 0 || MC.PIPI <= a
    ? a - (Math.floor(a / MC.PIPI) * MC.PIPI) : a;
};

// normalize to (-pi,pi>
MC.normPI = function (a/*:number */) /*:number */ {
  return (a = this.normPIPI(a)) <= Math.PI
    ? a : a - MC.PIPI;
};

class XY {
  /*:: x: *; y: *; */
  constructor (x/*:number*/, y/*:number*/) {
    this.x = x; this.y = y;
  }

  toString () {
    return `(${this.x}:${this.y})`;
  }

  static make (x/*:number*/, y/*:number*/) /*:XY*/ {
    return new this(x, y);
  }

  make (x/*:number*/, y/*:number*/) /*:XY*/ {
    return this.constructor.make(x, y);
  }

  clone () /*:XY*/ {
    return this.make(this.x, this.y);
  }

  is0 () /*:boolean*/ {
    return 0 === this.x && 0 === this.y;
  }

  eq (xy/*:XY*/) /*:boolean*/ {
    return this.x === xy.x && this.y === xy.y;
  }

  plus (xy/*:XY*/) /*:XY*/ {
    return this.make(this.x + xy.x, this.y + xy.y);
  }

  minus (xy/*:XY*/) /*:XY*/ {
    return this.make(this.x - xy.x, this.y - xy.y);
  }

  times (xyn/*:XY | number*/) /*:XY*/ {
    return xyn instanceof XY
      ? this.make(this.x * xyn.x, this.y * xyn.y)
      : this.make(this.x * xyn,   this.y * xyn);
  }

  div (xyn/*:XY | number*/) /*:XY*/ {
    return xyn instanceof this.constructor
      ? this.make(this.x / xyn.x, this.y / xyn.y)
      : this.make(this.x / xyn,   this.y / xyn);
  }

  neg () /*:XY*/ {
    return this.make(-this.x, -this.y);
  }

  mag () /*:number*/ {
    return (this.x * this.x) + (this.y * this.y);
  }

  lgt () /*:number*/ {
    return Math.sqrt(this.mag());
  }

  dot (xy/*:XY*/) /*:number*/ {
    return (this.x * xy.x) + (this.y * xy.y);
  }

  cross (xy/*:XY*/) /*:number*/ {
    return (this.x * xy.y) - (this.y * xy.x);
  }

  unit () /*:XY*/ {
    const lgt = this.lgt();
    return 0 < lgt ? this.div(lgt) : this.make(1, 0);
  }

  angle () /*:number*/ {
    if (0 === this.x)
      return 0 === this.y
        ? 0 : (0 < this.y ? 1 : 3) * MC.PI2;
    const a = Math.atan(this.y / this.x);
    return 0 < this.x ? a + Math.PI : a;
  }

  static fromXY (p/*:{x: number, y: number} */) /*:XY*/ {
    return this.make(p.x, p.y);
  }

  static fromWH (wh/*:{w: number, h: number} */) /*:XY*/ {
    return this.make(wh.w, wh.h);
  }

  toRA () /*:RA*/ {
    const r = this.lgt();
    return 0 < r
      ? RA.make(r, this.angle()) : RA.make(0, 0); // eslint-disable-line
  }
}

class RA {
  /*:: r: *; a: *; */ // polar: r , (a)ngle; always normalized
  constructor (r/*:number*/, a/*:number*/) {
    this.r = r; this.a = a; this._norm();
  }

  toString () {
    return `(${this.r}/${this.a})`;
  }

  static make (r/*:number*/, a/*:number*/) /*:RA*/ {
    return new this(r, a);
  }

  make (r/*:number*/, a/*:number*/) /*:RA*/ {
    return this.constructor.make(r, a);
  }

  clone () /*:RA*/ {
    return this.make(this.r, this.a);
  }

  is0 () /*:boolean*/ {
    return 0 === this.r;
  }

  eq (ra) /*:boolean*/ {
    return this.r === ra.r && (this.is0() || this.a === ra.a);
  }

  _norm () /*:void*/ {
    if (0 > this.r) {
      this.r = -this.r; this.a += Math.PI;
    }
    this.a = MC.normPIPI(this.a);
  }

  toXY () /*:XY*/ {
    return MC.xy(this.r * Math.cos(this.a), this.r * Math.sin(this.a));
  }
}

class Trf { // transform
  /*:: xy: * */
  constructor (xy/*:XY*/) {
    this.xy = xy;
  }

  toString () {
    const xy = this.xy.toString();
    return `[${xy}]`;
  }

  svgString () {
    return this.is0()
      ? '' : `translate(${this.xy.x} ${this.xy.y}) `;
  }

  is0 () /*:boolean*/ {
    return this.xy.is0();
  }

  get dx () /*:number*/ {
    return this.xy.x;
  }

  get dy () /*:number*/ {
    return this.xy.y;
  }

  plus (xy/*:XY*/) /*:Trf*/ {
    return new this.constructor(this.xy.plus(xy));
  }
}

MC.XY  = XY;
MC.RA  = RA;
MC.Trf = Trf;

MC.xy  = (x, y) => new XY(x, y);
MC.ra  = (r, a) => new RA(r, a);
MC.trf = (xy) => new MC.Trf(xy);

MC.xy0 = () => MC.xy(0, 0);
MC.ra0 = () => MC.ra(0, 0);

}());

// eof
