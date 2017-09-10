import 'dart:math' as Math;
import 'package:vector_math/vector_math.dart';

iota(int from, int to) {
  assert(from <= to);
  return new Iterable.generate(to-from+1, (i) => from+i);
}

calcOrbit(a,e,Omega,i,omega,domega,noise0,NInst) {

  var Npt  = 8;     // Phase points along orbital period 1pt/day  // 24
  var NOrb = 50;    // # orbits observed (5 yrs)                  // 100
  var NN = (Npt / 2).round();
  var nn = iota(1,NN);
  var Nel = 100; // # points to draw the ellipse
  //var nnel = [1 : 1 : Nel+1];

  var ecc = e;      // eccentricity

  var Orad = Omega/180*Math.PI;
  var irad = i/180*Math.PI;
  var oradI = omega/180*Math.PI;
  var phi = domega;     // Precession per orbit [arcsec]

  phi = phi * 220;    // Precession in 220 orbits = 5 years
  // phi = phi * 440;    % Precession in 440 orbits = 10 years
  var phirad = phi / 3600 / 180 * Math.PI;
  var oradP = oradI+phirad;
  // anglerad = angle / 180 * pi; % orbit inclination wrt the observer
  //print('Precession in 5 years [rad]: $phirad');

  var c = a * ecc;    // foci separation [mas]
  var b = Math.sqrt (a*a - c*c);   // minor semi-axis
  //print('a, b, c [mas]: $a $b $c');
  //print('Precession in 5 years [arcsec]: $phi');

  // RotMat = [Math.cos(phirad) -Math.sin(phirad); Math.sin(phirad) Math.cos(phirad)];
  var RotMatI = new Matrix3(  // TODO column major?
    Math.cos(Orad)*Math.cos(oradI)-Math.sin(Orad)*Math.cos(irad)*Math.sin(oradI), -Math.sin(Orad)*Math.cos(oradI)-Math.cos(Orad)*Math.cos(irad)*Math.sin(oradI), Math.sin(irad)*Math.sin(oradI),
    Math.cos(Orad)*Math.sin(oradI)+Math.sin(Orad)*Math.cos(irad)*Math.cos(oradI), -Math.sin(Orad)*Math.sin(oradI)+Math.cos(Orad)*Math.cos(irad)*Math.cos(oradI), -Math.sin(irad)*Math.cos(oradI),
    Math.sin(irad)*Math.sin(Orad), Math.sin(irad)*Math.cos(Orad), Math.cos(irad));

  var RotMatP = new Matrix3(  // TODO column major?
    Math.cos(Orad)*Math.cos(oradP)-Math.sin(Orad)*Math.cos(irad)*Math.sin(oradP), -Math.sin(Orad)*Math.cos(oradP)-Math.cos(Orad)*Math.cos(irad)*Math.sin(oradP), Math.sin(irad)*Math.sin(oradP),
    Math.cos(Orad)*Math.sin(oradP)+Math.sin(Orad)*Math.cos(irad)*Math.cos(oradP), -Math.sin(Orad)*Math.sin(oradP)+Math.cos(Orad)*Math.cos(irad)*Math.cos(oradP), -Math.sin(irad)*Math.cos(oradP),
    Math.sin(irad)*Math.sin(Orad), Math.sin(irad)*Math.cos(Orad), Math.cos(irad));

  // tmp = RotMat * [a; b];
  // ar = tmp(1);
  // br = tmp(2);

//  var tel = 2 * Math.PI * [1 , Nel] / Nel;

  var tel = iota(1,Nel).map((v) => 2 * Math.PI * v /Nel).toList();
  var xel = tel.map((v)=>a*Math.cos(v)+c).toList();
  var yel = tel.map((v)=>b*Math.sin(v)).toList();
  var zel = xel.map((v)=>0*v).toList();

  //!! tel = [tel (2 * pi) ];
  //print('n $nn');

  var eta1 = nn.map((v)=>1 / (6 + v*v)), maxEta1 = eta1.first; // lazy!!
  eta1 = eta1.map((v)=>maxEta1 - v); var maxEta1m = eta1.last;
  eta1 = eta1.map((v)=>Math.PI * v / maxEta1m);
  var eta2 = eta1.map((v)=>Math.PI * 2 - v).toList();

  var t = eta1.toList(); for (int i=eta2.length; --i>=0; ) t.add(eta2[i]); // TODO reversed
  t = t.map((v)=>Math.PI-v);

  var x = t.map((t)=>a * Math.cos(t) + c).toList();
  var y = t.map((t)=>b * Math.sin(t)).toList();
  var z = x.map((x)=>0 * x).toList();
  //print('xyz $x $y $z');

  var tmpI = [];
  for (int i=0; i<x.length; ++i)
    tmpI.add(new Vector3(x[i],y[i],z[i]).postmultiply(RotMatI));
  var xrI = tmpI.map((v)=>v[0]).toList();
  var yrI = tmpI.map((v)=>v[1]).toList();
  var zrI = tmpI.map((v)=>v[2]).toList();

  var tmpIel = [];
  for (int i=0; i<xel.length; ++i)
    tmpIel.add(new Vector3(xel[i],yel[i],zel[i]).postmultiply(RotMatI));
  var xrIel = tmpIel.map((v)=>v[0]).toList();
  var yrIel = tmpIel.map((v)=>v[1]).toList();
  var zrIel = tmpIel.map((v)=>v[2]).toList();

  var tmpP = [];
  for (int i=0; i<x.length; ++i)
    tmpP.add(new Vector3(x[i],y[i],z[i]).postmultiply(RotMatP));
  var xrP = tmpP.map((v)=>v[0]).toList();
  var yrP = tmpP.map((v)=>v[1]).toList();
  var zrP = tmpP.map((v)=>v[2]).toList();

  var xrPit = xrP.iterator;
  var dx = xrI.map((v) { xrPit.moveNext(); return v-xrPit.current;}).toList();
  var yrPit = yrP.iterator;
  var dy = yrI.map((v) { yrPit.moveNext(); return v-yrPit.current;}).toList();
  var zrPit = zrP.iterator;
  var dz = zrI.map((v) { zrPit.moveNext(); return v-zrPit.current;}).toList();
  var dzit = dz.iterator;
  var ds = dx.map((v) {dzit.moveNext(); var z=dzit.current; return Math.sqrt(v*v+z*z);});
  /*
   mat1 = [xrI; yrI];

  n_obs = [ 1 : 1 : NOrb];

  var ObsNoise = noise0 ./ sqrt(n_obs);
  aStr = num2str(a);
  aStr = strrep(aStr, '.', '-');
  NoiseStr = num2str(noise0);
  NoiseStr = strrep(NoiseStr, '.', '_');
  fname = ['Detect_HST_a' aStr '_n' NoiseStr '_NI' num2str(NInst) '.txt'];
  if (exist(fname)), delete(fname); end
  diary (fname)
  diary on

  EstPhi = zeros (1, NOrb);
  ErrPhi = zeros (1, NOrb);
  CurPhi = zeros (1, NInst);
  disp ('Observed orbits; estimated precession; error [arcsec]')

  for (int nn = 1; nn<=NOrb; ++nn) {
      var CurNoise = ObsNoise(nn);
      for ni = 1 : NInst
          noise1 = CurNoise * randn(1, Npt);
          noise2 = CurNoise * randn(1, Npt);
          xr_n = xrP + noise1;
          zr_n = zrP + noise2;
          mat2 = [xr_n; zr_n];
          RR =  mat2' \ mat1';
          CurPhi(ni) = atan2(RR(2,1), RR(1,1));
      end % for ni = 1 : NInst
      ErrPhi(nn) = std(CurPhi) * 180 / pi * 3600;
      EstPhi(nn) = mean(CurPhi) * 180 / pi * 3600;
      %disp ([nn EstPhi(nn) ErrPhi(nn)])
      fprintf (1, '%i \t%f \t%f\n', nn, EstPhi(nn), ErrPhi(nn));
      pause(0.1)
  }

  % scale to arcsec
  diary off

  MyFontSize = 11;

  figure(1) ;
  % plot (n_obs, EstPhi)
  % plot (dx_n, dy_n, 'o')
  title('n. points = 8, equispaced sampling');
  errorbar (n_obs, EstPhi, ErrPhi);
  xlim ([0 NOrb+1]);
  xlabel ('n_{orb}', 'fontsize', MyFontSize);
  ylabel ('\delta\omega [\muas]', 'fontsize', MyFontSize);
  saveas (1, 'prova1.fig');
  print('-GC:\Programmi\gs\gs9.14\bin\gswin64c.exe', '-r600', '-depsc2', 'prova1.eps');
  print('-GC:\Programmi\gs\gs9.14\bin\gswin64c.exe', '-djpeg', 'prova1.jpg');
*/
  /*
  figure(2);
  title('Orbit with non-equispaced sampling');
  plot (xel, yel);
  plot (x, y, 'r*'); // red star
  plot (0.0, 0.0, 'bo'); // blue circle
  text (5.0, 5.0, 'F');
  xlabel ('mas', 'fontsize', MyFontSize);
  ylabel ('mas', 'fontsize', MyFontSize);aaZAZzA
*/
/*
  figure(3);
  title('Three dimensional representation of the initial orbit');
  plot3 (xel, yel, zel);
  hold on
  xlabel ("x (mas)");
  ylabel ("y (mas)");
  zlabel ("z (mas)");
  plot3 (xrIel, yrIel, zrIel, "r");
  plot3 (xrIel, zel, zrIel, "g");
  hold off;
  saveas (3, 'prova3.fig');
  print('-GC:\Programmi\gs\gs9.14\bin\gswin64c.exe', '-r600', '-depsc2', 'prova3.eps');
  print('-GC:\Programmi\gs\gs9.14\bin\gswin64c.exe', '-djpeg', 'prova3.jpg');

  return % END

  */}
