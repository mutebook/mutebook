/* global MC:true */

// normalize to <0,2pi)
Math.normPIPI = (a) => (
  0 > a || a >= this.PIPI
    ? a - ((a / this.PIPI).floor() * this.PIPI) : a);

// normalize to (-pi,pi>
Math.normPI = (a) =>
  ((a = this.normPIPI(a)) <= this.PI ? a : a - this.PIPI);

Math.PIPI = 2 * Math.PI;
Math.PI2  = Math.PI / 2;

Math.rand = (low, range) => low + (Math.random() * range);

// eof
