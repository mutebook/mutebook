/* global MC:true */
var MC = MC || {};

MC.XY = class {
  constructor (x, y) {
    if (undefined === x)
      x = y = 0;
    else if (undefined === y)
      y = x;
    this.x = x; this.y = y;
  }

  toString () {
    return `[${this.x}:${this.y}]`;
  }

  clone () {
    return MC.xy(this.x, this.y);
  }

  is0 () {
    return 0 === this.x && 0 === this.y;
  }

  eq (xy) {
    return this.x === xy.x && this.y === xy.y;
  }

  plus (xy) {
    return MC.xy(this.x + xy.x, this.y + xy.y);
  }

  minus (xy) {
    return MC.xy(this.x - xy.x, this.y - xy.y);
  }

  times (xyn) {
    return xyn instanceof this.constructor
      ? MC.xy(this.x * xyn.x, this.y * xyn.y)
      : MC.xy(this.x * xyn, this.y * xyn);
  }

  div (xyn) {
    return xyn instanceof this.constructor
      ? MC.xy(this.x / xyn.x, this.y / xyn.y)
      : MC.xy(this.x / xyn, this.y / xyn);
}

  neg () {
    return MC.xy(-this.x, -this.y);
  }

  mag () {
    return MC.xy(this.x * this.x, this.y * this.y);
  }

  lgt () {
    return Math.sqrt(this.mag());
  }

  dot (xy) {
    return (this.x * xy.x) + (this.y * xy.y);
  }

  cross (xy) {
    return (this.x * xy.y) - (this.y * xy.x);
  }

  unit () {
    const lgt = this.lgt();
    return 0 < lgt ? this.div(lgt) : MC.xy(1, 0);
  }

  _a () {
    if (0 === this.x)
      return 0 === this.y
        ? 0 : (0 < this.y ? 1 : 3) * Math.PI2;
    const a = Math.atan(this.y / this.x);
    return 0 < this.x ? a + Math.PI : a;
  }

  toRA () {
    const r = this.lgt();
    return 0 < r ? MC.ra(r, this._a()) : MC.ra();
  }

  static fromXY (p) {
    return MC.xy(p.x, p.y);
  }

  static fromWH (wh) {
    return MC.xy(wh.w, wh.h);
  }
};

MC.xy = (x, y) => new MC.XY(x, y);

MC.RA = class { // polar: r , (a)ngle; always normalized
  constructor (r, a) {
    if (undefined === r)
      r = a = 0;
    else if (undefined === a)
      a = 0;
    this.r = r; this.a = a; this._norm();
  }

  toString () {
    return `[${this.r}\\${this.a}]`;
  }

  clone () {
    return MC.ra(this.r, this.a);
  }

  is0 () {
    return 0 === this.r;
  }

  eq (ra) {
    return this.r === ra.r && (this.is0() || this.a === ra.a);
  }

  _norm () {
    if (0 > this.r) {
      this.r = -this.r; this.a += Math.PI;
    }
    this.a = Math.normPIPI(this.a);
  }

  toXY () {
    return MC.xy(this.r * Math.cos(this.a), this.r * Math.sin(this.a));
  }
};

MC.ra = (r, a) => new MC.RA(r, a);

// Transform
MC.Trf = class {
  constructor (xy) {
    this.xy = undefined === xy ? MC.xy() : xy;
  }

  toString () {
    return `[(${this.xy})]`;
  }

  svgString () {
    return this.is0() ? '' : `translate(${this.xy.x} ${this.xy.y}) `;
  }

  is0 () {
    return this.xy.is0();
  }

  get dx () {
    return this.xy.x;
  }

  get dy () {
    return this.xy.y;
  }

  plus (xy) {
    return new this.constructor(this.xy.plus(xy));
  }
};

MC.trf = (xy) => new MC.Trf(xy);

// eof
