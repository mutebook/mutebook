library quint.test;

import 'package:test/test.dart';
import 'package:quint/quint.util.dart';
import 'package:quint/quint.space.dart';
import 'package:quint/quint.tuning.dart';
import 'dart:math' as math;

test_space() {
  group('coord', () {
    test('deg/rad', () {
      expect(Math.deg2rad(180), equals(math.PI));
      expect(Math.rad2deg(math.PI), equals(180));
    });
    test('XY', () {
      expect(xy0(), equals(xy(0,0)));
      expect(xy0(), isNot(equals(xy(0,0.1))));
      expect(xy(1,2)+xy(3,4), equals(xy(4,6)));
      expect(xy(1,2)-xy(3,4), equals(xy(-2,-2)));
      expect(xy(1,2)*3, equals(xy(3,6)));
      expect(xy(1,2)/4, equals(xy(.25,.5)));
      expect(xy(3,4).lgt(), equals(5));
      expect(xy(2,1).dot(xy(-1,2)), equals(0));
      expect(xy(1,1).toRA(), equals(ra(math.sqrt(2),Math.deg2rad(45))));
    });
    test('RA', () {
      expect(ra0(), equals(ra(0,0)));
      expect(ra(-1,2), equals(ra(1,2+math.PI)));
      expect(ra(1,1+2*math.PI), equals(ra(1,1)));
    });
    test('XY/RA', () {
      expect(xy0().toRA(), equals(ra0()));
    });
  });
}

test_tuning() {
  group('tuning', () {
    expect(Math.log2(2), equals(1));
    expect(Math.exp2(1), equals(2));
    test('Cps', () {
      expect(Tun.cps(), equals(new Cps(0)));
      expect(Tun.cpsC4().toPch(), equals(Tun.pchC4()));
    });
    test('Rat', () {
      expect(Tun.rat(3/2).toCts().toPch().isAlmost(Tun.cts(702).toPch()), equals(true));
    });
    test('Pch', () {
      expect((Tun.pchA4() - Tun.pchC4()).toCts(), equals(Tun.cts(900)));
    });
  });
}

main() {
  test_space();
  test_tuning();
}

// eof
