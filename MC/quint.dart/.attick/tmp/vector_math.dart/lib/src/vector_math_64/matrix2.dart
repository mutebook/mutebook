// Copyright (c) 2015, Google Inc. Please see the AUTHORS file for details.
// All rights reserved. Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

part of vector_math_64;

/// 2D Matrix.
/// Values are stored in column major order.
class Matrix2 {
  final Float64List _m2storage;

  /// The components of the matrix.
  Float64List get storage => _m2storage;

  /// Solve [A] * [x] = [b].
  static void solve(Matrix2 A, Vector2 x, Vector2 b) {
    final double a11 = A.entry(0, 0);
    final double a12 = A.entry(0, 1);
    final double a21 = A.entry(1, 0);
    final double a22 = A.entry(1, 1);
    final double bx = b.x;
    final double by = b.y;
    double det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    x.x = det * (a22 * bx - a12 * by);
    x.y = det * (a11 * by - a21 * bx);
  }

  /// Return index in storage for [row], [col] value.
  int index(int row, int col) => (col * 2) + row;

  /// Value at [row], [col].
  double entry(int row, int col) {
    assert((row >= 0) && (row < dimension));
    assert((col >= 0) && (col < dimension));

    return _m2storage[index(row, col)];
  }

  /// Set value at [row], [col] to be [v].
  setEntry(int row, int col, double v) {
    assert((row >= 0) && (row < dimension));
    assert((col >= 0) && (col < dimension));

    _m2storage[index(row, col)] = v;
  }

  /// New matrix with specified values.
  factory Matrix2(double arg0, double arg1, double arg2, double arg3) =>
      new Matrix2.zero()..setValues(arg0, arg1, arg2, arg3);

  /// Zero matrix.
  Matrix2.zero() : _m2storage = new Float64List(4);

  /// Identity matrix.
  factory Matrix2.identity() => new Matrix2.zero()..setIdentity();

  /// Copies values from [other].
  factory Matrix2.copy(Matrix2 other) => new Matrix2.zero()..setFrom(other);

  /// Matrix with values from column arguments.
  factory Matrix2.columns(Vector2 arg0, Vector2 arg1) =>
      new Matrix2.zero()..setColumns(arg0, arg1);

  /// Outer product of [u] and [v].
  factory Matrix2.outer(Vector2 u, Vector2 v) =>
      new Matrix2.zero()..setOuter(u, v);

  /// Rotation of [radians].
  factory Matrix2.rotation(double radians) =>
      new Matrix2.zero()..setRotation(radians);

  /// Sets the matrix with specified values.
  Matrix2 setValues(double arg0, double arg1, double arg2, double arg3) {
    _m2storage[3] = arg3;
    _m2storage[2] = arg2;
    _m2storage[1] = arg1;
    _m2storage[0] = arg0;
    return this;
  }

  /// Sets the entire matrix to the column values.
  Matrix2 setColumns(Vector2 arg0, Vector2 arg1) {
    final arg0Storage = arg0._v2storage;
    final arg1Storage = arg1._v2storage;
    _m2storage[0] = arg0Storage[0];
    _m2storage[1] = arg0Storage[1];
    _m2storage[2] = arg1Storage[0];
    _m2storage[3] = arg1Storage[1];
    return this;
  }

  /// Sets the entire matrix to the matrix in [arg].
  Matrix2 setFrom(Matrix2 arg) {
    final argStorage = arg._m2storage;
    _m2storage[3] = argStorage[3];
    _m2storage[2] = argStorage[2];
    _m2storage[1] = argStorage[1];
    _m2storage[0] = argStorage[0];
    return this;
  }

  /// Set [this] to the outer product of [u] and [v].
  Matrix2 setOuter(Vector2 u, Vector2 v) {
    final uStorage = u._v2storage;
    final vStorage = v._v2storage;
    _m2storage[0] = uStorage[0] * vStorage[0];
    _m2storage[1] = uStorage[0] * vStorage[1];
    _m2storage[2] = uStorage[1] * vStorage[0];
    _m2storage[3] = uStorage[1] * vStorage[1];
    return this;
  }

  /// Sets the diagonal to [arg].
  Matrix2 splatDiagonal(double arg) {
    _m2storage[0] = arg;
    _m2storage[3] = arg;
    return this;
  }

  /// Sets the diagonal of the matrix to be [arg].
  Matrix2 setDiagonal(Vector2 arg) {
    final argStorage = arg._v2storage;
    _m2storage[0] = argStorage[0];
    _m2storage[3] = argStorage[1];
    return this;
  }

  /// Returns a printable string
  String toString() => '[0] ${getRow(0)}\n[1] ${getRow(1)}\n';

  /// Dimension of the matrix.
  int get dimension => 2;

  /// Access the element of the matrix at the index [i].
  double operator [](int i) => _m2storage[i];

  /// Set the element of the matrix at the index [i].
  void operator []=(int i, double v) {
    _m2storage[i] = v;
  }

  /// Check if two matrices are the same.
  bool operator ==(other) {
    return (other is Matrix2) &&
        (_m2storage[0] == other._m2storage[0]) &&
        (_m2storage[1] == other._m2storage[1]) &&
        (_m2storage[2] == other._m2storage[2]) &&
        (_m2storage[3] == other._m2storage[3]);
  }

  int get hashCode => quiver.hashObjects(_m2storage);

  /// Returns row 0
  Vector2 get row0 => getRow(0);

  /// Returns row 1
  Vector2 get row1 => getRow(1);

  /// Sets row 0 to [arg]
  set row0(Vector2 arg) => setRow(0, arg);

  /// Sets row 1 to [arg]
  set row1(Vector2 arg) => setRow(1, arg);

  /// Sets [row] of the matrix to values in [arg]
  void setRow(int row, Vector2 arg) {
    final argStorage = arg._v2storage;
    _m2storage[index(row, 0)] = argStorage[0];
    _m2storage[index(row, 1)] = argStorage[1];
  }

  /// Gets the [row] of the matrix
  Vector2 getRow(int row) {
    final r = new Vector2.zero();
    final rStorage = r._v2storage;
    rStorage[0] = _m2storage[index(row, 0)];
    rStorage[1] = _m2storage[index(row, 1)];
    return r;
  }

  /// Assigns the [column] of the matrix [arg]
  void setColumn(int column, Vector2 arg) {
    final argStorage = arg._v2storage;
    final entry = column * 2;
    _m2storage[entry + 1] = argStorage[1];
    _m2storage[entry + 0] = argStorage[0];
  }

  /// Gets the [column] of the matrix
  Vector2 getColumn(int column) {
    final r = new Vector2.zero();
    final entry = column * 2;
    final rStorage = r._v2storage;
    rStorage[1] = _m2storage[entry + 1];
    rStorage[0] = _m2storage[entry + 0];
    return r;
  }

  /// Create a copy of [this].
  Matrix2 clone() => new Matrix2.copy(this);

  /// Copy [this] into [arg].
  Matrix2 copyInto(Matrix2 arg) {
    final argStorage = arg._m2storage;
    argStorage[0] = _m2storage[0];
    argStorage[1] = _m2storage[1];
    argStorage[2] = _m2storage[2];
    argStorage[3] = _m2storage[3];
    return arg;
  }

  /// Returns a new vector or matrix by multiplying [this] with [arg].
  operator *(dynamic arg) {
    if (arg is double) {
      return scaled(arg);
    }
    if (arg is Vector2) {
      return transformed(arg);
    }
    if (arg.dimension == 2) {
      return multiplied(arg);
    }
    throw new ArgumentError(arg);
  }

  /// Returns new matrix after component wise [this] + [arg]
  Matrix2 operator +(Matrix2 arg) => clone()..add(arg);

  /// Returns new matrix after component wise [this] - [arg]
  Matrix2 operator -(Matrix2 arg) => clone()..sub(arg);

  /// Returns new matrix -this
  Matrix2 operator -() => clone()..negate();

  /// Zeros [this].
  Matrix2 setZero() {
    _m2storage[0] = 0.0;
    _m2storage[1] = 0.0;
    _m2storage[2] = 0.0;
    _m2storage[3] = 0.0;
    return this;
  }

  /// Makes [this] into the identity matrix.
  Matrix2 setIdentity() {
    _m2storage[0] = 1.0;
    _m2storage[1] = 0.0;
    _m2storage[2] = 0.0;
    _m2storage[3] = 1.0;
    return this;
  }

  /// Returns the tranpose of this.
  Matrix2 transposed() => clone()..transpose();

  Matrix2 transpose() {
    double temp = _m2storage[2];
    _m2storage[2] = _m2storage[1];
    _m2storage[1] = temp;
    return this;
  }

  /// Returns the component wise absolute value of this.
  Matrix2 absolute() {
    Matrix2 r = new Matrix2.zero();
    final rStorage = r._m2storage;
    rStorage[0] = _m2storage[0].abs();
    rStorage[1] = _m2storage[1].abs();
    rStorage[2] = _m2storage[2].abs();
    rStorage[3] = _m2storage[3].abs();
    return r;
  }

  /// Returns the determinant of this matrix.
  double determinant() =>
      (_m2storage[0] * _m2storage[3]) - (_m2storage[1] * _m2storage[2]);

  /// Returns the dot product of row [i] and [v].
  double dotRow(int i, Vector2 v) {
    final vStorage = v._v2storage;
    return _m2storage[i] * vStorage[0] + _m2storage[2 + i] * vStorage[1];
  }

  /// Returns the dot product of column [j] and [v].
  double dotColumn(int j, Vector2 v) {
    final vStorage = v._v2storage;
    return _m2storage[j * 2] * vStorage[0] +
        _m2storage[(j * 2) + 1] * vStorage[1];
  }

  /// Trace of the matrix.
  double trace() {
    double t = 0.0;
    t += _m2storage[0];
    t += _m2storage[3];
    return t;
  }

  /// Returns infinity norm of the matrix. Used for numerical analysis.
  double infinityNorm() {
    double norm = 0.0;
    {
      double row_norm = 0.0;
      row_norm += _m2storage[0].abs();
      row_norm += _m2storage[1].abs();
      norm = row_norm > norm ? row_norm : norm;
    }
    {
      double row_norm = 0.0;
      row_norm += _m2storage[2].abs();
      row_norm += _m2storage[3].abs();
      norm = row_norm > norm ? row_norm : norm;
    }
    return norm;
  }

  /// Returns relative error between [this] and [correct]
  double relativeError(Matrix2 correct) {
    Matrix2 diff = correct - this;
    double correct_norm = correct.infinityNorm();
    double diff_norm = diff.infinityNorm();
    return diff_norm / correct_norm;
  }

  /// Returns absolute error between [this] and [correct]
  double absoluteError(Matrix2 correct) {
    double this_norm = infinityNorm();
    double correct_norm = correct.infinityNorm();
    double diff_norm = (this_norm - correct_norm).abs();
    return diff_norm;
  }

  /// Invert the matrix. Returns the determinant.
  double invert() {
    double det = determinant();
    if (det == 0.0) {
      return 0.0;
    }
    double invDet = 1.0 / det;
    double temp = _m2storage[0];
    _m2storage[0] = _m2storage[3] * invDet;
    _m2storage[1] = -_m2storage[1] * invDet;
    _m2storage[2] = -_m2storage[2] * invDet;
    _m2storage[3] = temp * invDet;
    return det;
  }

  /// Set this matrix to be the inverse of [arg]
  double copyInverse(Matrix2 arg) {
    double det = arg.determinant();
    if (det == 0.0) {
      setFrom(arg);
      return 0.0;
    }
    double invDet = 1.0 / det;
    final argStorage = arg._m2storage;
    _m2storage[0] = argStorage[3] * invDet;
    _m2storage[1] = -argStorage[1] * invDet;
    _m2storage[2] = -argStorage[2] * invDet;
    _m2storage[3] = argStorage[0] * invDet;
    return det;
  }

  /// Turns the matrix into a rotation of [radians]
  void setRotation(double radians) {
    double c = Math.cos(radians);
    double s = Math.sin(radians);
    _m2storage[0] = c;
    _m2storage[1] = s;
    _m2storage[2] = -s;
    _m2storage[3] = c;
  }

  /// Converts into Adjugate matrix and scales by [scale]
  Matrix2 scaleAdjoint(double scale) {
    double temp = _m2storage[0];
    _m2storage[0] = _m2storage[3] * scale;
    _m2storage[2] = -_m2storage[2] * scale;
    _m2storage[1] = -_m2storage[1] * scale;
    _m2storage[3] = temp * scale;
    return this;
  }

  /// Scale [this] by [scale].
  Matrix2 scale(double scale) {
    _m2storage[0] = _m2storage[0] * scale;
    _m2storage[1] = _m2storage[1] * scale;
    _m2storage[2] = _m2storage[2] * scale;
    _m2storage[3] = _m2storage[3] * scale;
    return this;
  }

  /// Create a copy of [this] scaled by [scale].
  Matrix2 scaled(double scale) => clone()..scale(scale);

  /// Add [o] to [this].
  Matrix2 add(Matrix2 o) {
    final oStorage = o._m2storage;
    _m2storage[0] = _m2storage[0] + oStorage[0];
    _m2storage[1] = _m2storage[1] + oStorage[1];
    _m2storage[2] = _m2storage[2] + oStorage[2];
    _m2storage[3] = _m2storage[3] + oStorage[3];
    return this;
  }

  /// Subtract [o] from [this].
  Matrix2 sub(Matrix2 o) {
    final oStorage = o._m2storage;
    _m2storage[0] = _m2storage[0] - oStorage[0];
    _m2storage[1] = _m2storage[1] - oStorage[1];
    _m2storage[2] = _m2storage[2] - oStorage[2];
    _m2storage[3] = _m2storage[3] - oStorage[3];
    return this;
  }

  /// Negate [this].
  Matrix2 negate() {
    _m2storage[0] = -_m2storage[0];
    _m2storage[1] = -_m2storage[1];
    _m2storage[2] = -_m2storage[2];
    _m2storage[3] = -_m2storage[3];
    return this;
  }

  /// Multiply [this] with [arg] and store it in [this].
  Matrix2 multiply(Matrix2 arg) {
    final m00 = _m2storage[0];
    final m01 = _m2storage[2];
    final m10 = _m2storage[1];
    final m11 = _m2storage[3];
    final argStorage = arg._m2storage;
    final n00 = argStorage[0];
    final n01 = argStorage[2];
    final n10 = argStorage[1];
    final n11 = argStorage[3];
    _m2storage[0] = (m00 * n00) + (m01 * n10);
    _m2storage[2] = (m00 * n01) + (m01 * n11);
    _m2storage[1] = (m10 * n00) + (m11 * n10);
    _m2storage[3] = (m10 * n01) + (m11 * n11);
    return this;
  }

  /// Multiply [this] with [arg] and return the product.
  Matrix2 multiplied(Matrix2 arg) => clone()..multiply(arg);

  /// Multiply a transposed [this] with [arg].
  Matrix2 transposeMultiply(Matrix2 arg) {
    final m00 = _m2storage[0];
    final m01 = _m2storage[1];
    final m10 = _m2storage[2];
    final m11 = _m2storage[3];
    final argStorage = arg._m2storage;
    _m2storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[1]);
    _m2storage[2] = (m00 * argStorage[2]) + (m01 * argStorage[3]);
    _m2storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[1]);
    _m2storage[3] = (m10 * argStorage[2]) + (m11 * argStorage[3]);
    return this;
  }

  /// Multiply [this] with a transposed [arg].
  Matrix2 multiplyTranspose(Matrix2 arg) {
    final m00 = _m2storage[0];
    final m01 = _m2storage[2];
    final m10 = _m2storage[1];
    final m11 = _m2storage[3];
    final argStorage = arg._m2storage;
    _m2storage[0] = (m00 * argStorage[0]) + (m01 * argStorage[2]);
    _m2storage[2] = (m00 * argStorage[1]) + (m01 * argStorage[3]);
    _m2storage[1] = (m10 * argStorage[0]) + (m11 * argStorage[2]);
    _m2storage[3] = (m10 * argStorage[1]) + (m11 * argStorage[3]);
    return this;
  }

  /// Transform [arg] of type [Vector2] using the transformation defined by
  /// [this].
  Vector2 transform(Vector2 arg) {
    final argStorage = arg._v2storage;
    final x = (_m2storage[0] * argStorage[0]) + (_m2storage[2] * argStorage[1]);
    final y = (_m2storage[1] * argStorage[0]) + (_m2storage[3] * argStorage[1]);
    argStorage[0] = x;
    argStorage[1] = y;
    return arg;
  }

  /// Transform a copy of [arg] of type [Vector2] using the transformation
  /// defined by [this]. If a [out] parameter is supplied, the copy is stored in
  /// [out].
  Vector2 transformed(Vector2 arg, [Vector2 out]) {
    if (out == null) {
      out = new Vector2.copy(arg);
    } else {
      out.setFrom(arg);
    }
    return transform(out);
  }

  /// Copies [this] into [array] starting at [offset].
  void copyIntoArray(List<num> array, [int offset = 0]) {
    int i = offset;
    array[i + 3] = _m2storage[3];
    array[i + 2] = _m2storage[2];
    array[i + 1] = _m2storage[1];
    array[i + 0] = _m2storage[0];
  }

  /// Copies elements from [array] into [this] starting at [offset].
  void copyFromArray(List<double> array, [int offset = 0]) {
    int i = offset;
    _m2storage[3] = array[i + 3];
    _m2storage[2] = array[i + 2];
    _m2storage[1] = array[i + 1];
    _m2storage[0] = array[i + 0];
  }
}
