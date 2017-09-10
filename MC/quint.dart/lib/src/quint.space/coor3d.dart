part of quint.space;

class XYZ {
  num x = 0, y = 0, z = 0; String toString() => '[$x:$y:$z]';

  XYZ(this.x, this.y, this.z);
  XYZ clone() => xyz(x,y,z);

  bool is0() => 0==x && 0==y && 0==z; // TODO epsilon

  int get hashCode       => x.hashCode * 53 + y.hashCode * 31 + z.hashCode;
  bool operator ==(that) => that is XYZ && that.x == x && that.y == y && that.z == z;

  num get min => Math.min(x,Math.min(y,z)); // TODO needed ?
  num get max => Math.max(x,Math.max(y,z)); // TODO needed ?

  XYZ operator +(XYZ that)  => xyz(x + that.x, y + that.y, z + that.z);
  XYZ operator -(XYZ that)  => xyz(x - that.x, y - that.y, z - that.z);
  XYZ operator *(num scale) => xyz(x * scale, y * scale, z * scale);
  XYZ operator /(num scale) => xyz(x / scale, y / scale, z / scale);

  XYZ mul(XYZ that)         => xyz(x * that.x, y * that.y, z * that.z);
  XYZ div(XYZ that)         => xyz(x / that.x, y / that.y, z / that.z);
  XYZ neg()                 => xyz(-x, -y, -z);

  num mag()                 => x * x + y * y + z * z;
  num lgt()                 => math.sqrt(mag());

  num dot(XYZ that)         => x * that.x + y * that.y + z * that.z;
  XYZ cross(XYZ that)       => xyz(y*that.z - z*that.y,
                                   z*that.x - x*that.z,
                                   x*that.y - y*that.x);

  XYZ unit() { num l = lgt(); return l>0 ? this/l : xyz(0,0,1); }

  XYZ rot(Rot r) {
    final rv = r.v, rth = r.th;
    double dot = this.dot(rv);
    double mag = rv.mag(), lgt = math.sqrt(mag);
    double ct  = math.cos(rth), st = math.sin(rth);

    double u = rv.x, v = rv.y, w = rv.z,
          ux = u*x, vy = v*y, wz = w*z,
          uy = u*y, vz = v*z, wx = w*x,
          vx = v*x, wy = w*y, uz = u*z;

    return xyz(u*dot + (x*(v*v + w*w) - u*(vy+wz))*ct + lgt*(-wy+vz)*st,
               v*dot + (y*(u*u + w*w) - v*(ux+wz))*ct + lgt*( wx-uz)*st,
               w*dot + (z*(u*u + v*v) - w*(ux+vy))*ct + lgt*(-vx+uy)*st) / mag;
  }

  XYZ project(M4 mat) { // adapted from vector_math
    final m = mat.m;
    final d = 1.0 / (m[3]*x + m[7]*y + m[11]*z + m[15]);

    return xyz((m[0]*x + m[4]*y + m[8]*z + m[12]) * d,
               (m[1]*x + m[5]*y + m[9]*z + m[13]) * d,
               (m[2]*x + m[6]*y + m[10]*z + m[14])* d);
  }

  XYZ rotate(Quat q) {
    var ix = q.w * x + q.y * z - q.z * y;
    var iy = q.w * y + q.z * x - q.x * z;
    var iz = q.w * z + q.x * y - q.y * x;
    var iw = -q.x * x - q.y * y - q.z * z;

    return xyz(ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
               iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
               iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x);
  }
}

XYZ xyz(num x, num y, num z) => new XYZ(x,y,z);
XYZ xyz0()                   => xyz(0,0,0);     // origin
XYZ xyz1(num d)              => xyz(d,d,d);     // box

class M4 { // column major; adapted from vetor_math
  Float32List m;

  M4(List<num> l): m = new Float32List.fromList(l) {
    assert (16 == m.length);
  }

  M4.zero(): m = new Float32List(16);
  M4.identity(): m = new Float32List(16) {
    m[0] = m[5] = m[10] = m[15] = 1;
  }

  factory M4.fromTransQuat(XYZ trans, Quat q) {
    double x2 = q.x * 2, y2 = q.y * 2, z2 = q.z * 2;
    double xx = q.x * x2, xy = q.x * y2, xz = q.x * z2,
           yy = q.y * y2, yz = q.y * z2, zz = q.z * z2,
           wx = q.w * x2, wy = q.w * y2, wz = q.w * z2;

    return new M4([
      1.0 - (yy + zz), xy + wz, xz - wy, 0.0,
      xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
      xz + wy, yz - wx, 1.0 - (xx + yy), 0.0,
     trans.x, trans.y, trans.z, 1.0
    ]);
  }

  M4 clone() => new M4(m);

  void scale(XYZ xyz) {
    forN(4, (int i) {
      m[0+i] *= xyz.x;
      m[4+i] *= xyz.y;
      m[8+i] *= xyz.z;
    });
  }

  Matrix4 setFromTranslationRotationScale(
    Vector3 translation, Quaternion rotation, Vector3 scale) {
    setFromTranslationRotation(translation, rotation);
    this.scale(scale);
    return this;
  }
}

class Quat {
  num w, x, y, z;

  Quat(this.w,this.x,this.y,this.z) {
    _norm();
  }

  Quat.identity(): this(1,0,0,0);

  Quat operator *(num n)  => new Quat(math.cos(n * math.acos(w)), x, y, z);
  Quat neg()              => new Quat(w,-x,-y,-z);
  Quat mul(Quat q)        => new Quat(w*q.w - x*q.x - y*q.y - z*q.z,
                                      w*q.x + x*q.w + y*q.z - z*q.y,
                                      w*q.y - x*q.z + y*q.w + z*q.x,
                                      w*q.z + x*q.y - y*q.x + z*q.w);

  double scale() => math.sqrt(w*w + x*x + y*y + z*z);

  Rot toRot() {
    final s = scale();
    if (s > 0) {
      return new Rot(2 * math.acos(w), xyz(x/s,y/s,z/s));
    } else {
      return new Rot();
    }
  }

  void _norm() {
    final s = scale();
    w /= s; x /= s; y /= s; z /= s;
  }
}

class Rot {
  num th; XYZ v;

  Rot([this.th = 0, this.v = null]) {
    _norm();
  }

  Rot clone() => new Rot(th,v);

  Quat toQuat() {
    double s = math.sin(th / 2), c = math.cos(th / 2);
    return new Quat(c, v.x * s, v.y * s, v.z * s);
  }

  Rot operator +(Rot that) {
    if (0==th)      return that;
    if (0==that.th) return clone();
    return toQuat().mul(that.toQuat()).toRot();
  }

  Rot operator -(Rot that)  => this + that.neg();
  Rot operator *(num n)     => new Rot(th*n,v);
  Rot operator /(num n)     => new Rot(th/n,v);

  Rot neg()                 => new Rot(-th,v);

  void _norm() {
    th = Math.normPIPI(th);
     v = (null==v) ? xyz(0,0,1) : v.unit();
  }
}

// eof