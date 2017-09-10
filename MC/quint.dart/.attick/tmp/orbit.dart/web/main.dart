import 'dart:html';
import 'src/orbit.dart';
//import 'package:graph_qa/graph_qa.dart';

void main() {

  var pars = ['#par_a','#par_e','#par_Ω','#par_i','#par_ω','#par_d']
      .map((id) => Number.add(id)).toList();

  var par_n = Number.add('#par_n'),
      par_N = Number.add('#par_N');

  var satPars = [
    // a, e, Ω, i, ω, d
    ['UX25', [150.0, 0.17, 23.3, 275.5, 254.0, 0.23]],
    ['none', [000.0, 0.00, 00.0, 000.0, 000.0, 0.00]],
  ];

  fillSatPars(values) {
    for (int i = 0; i < values.length; ++i) {
      pars[i].value = values[i];
    }
  }

  var elPresets = querySelector('#presets');
  var elNoise   = querySelector('#noise');
  var elStat    = querySelector('#stat');
  var elButtons = querySelector('#buttons');

  var def = null, defs = [];

  for (var p in satPars) {
    var radio = new Radio('params', (e) => fillSatPars(p[1]));
    elPresets
      ..append(radio.element)
      ..appendText(p[0])
      ..appendHtml('<br/>');
    if (null == def) def = radio.element;
  }

  defs.add(def); def = null;

  for (var n in [['HST', 0.1]]) {
    var radio = new Radio('noise', (e) => par_n.value = n[1]);
    elNoise
      ..append(radio.element)
      ..appendText(n[0]);
    if (null == def) def = radio.element;
  }

  defs.add(def); def = null;

  for (var n in [100,1000,10000]) {
    var radio = new Radio('stat', (e) => par_N.value = n);
    elStat
      ..append(radio.element)
      ..appendText(n.toString());
    if (null == def) def = radio.element;
  }

  defs.add(def); def = null;

  var runButton;

  run() {
    if (runButton.disabled) return;
    runButton.disabled = true;
    // TODO worker here
    calcOrbit(pars[0].value,pars[1].value,pars[2].value,pars[3].value,
              pars[4].value,pars[5].value,par_n.value,par_N.value);
    runButton.disabled = false;
  }

  runButton = new Button('Calculate', (e) => run()).element;
  elButtons.append(runButton);

  for (def in defs) def.click();

  run();  // TODO out

  fig1() {
    var g = new GraphErrorBar(querySelector('#fig1'));
    g.setRange([0,-100],[51,100]);
    g.xAxis('n',eta(0,10,50)); g.yAxis('dom',eta(-100,50,100));
//    g.bars(estPhi,errPhi,0x000088,0x008800);
    g.render();
  }

  fig2() {
    var g = new GraphCurve2(querySelector('#fig2'));
    g.setRange([-150,-150],[200,150]);
    g.xAxis('mas',eta(-150,50,200));
    g.yAxis('mas',eta(-150,50,150));
//    g.curve2(xel,yel,0x000088);
//    for (int i=0; i<x.length; ++i) {
//      g.circle(6,x[i],y[i],0x880000);
//    }
    g.render();
  }

  fig3() {
    var g = new GraphCurve3(querySelector('#fig3'));
    g.setRange([-200,-200,-200],[200,200,200]);
    g.xAxis('mas',eta(-200,50,200));
    g.yAxis('mas',eta(-200,50,200));
    g.zAxis('mas',eta(-200,50,200));
//    g.curve3(xel,yel,zel,0x000088);
//    g.curve3(xrIel,yrIel,zrIel,0x000088);
//    g.curve3(xrIel,zel,zrIel,0x000088);
    g.render();
  }

  fig1(); fig2(); fig3();

  //figure1() {
  //  var simpleData = [2, 17, 16,2, -0.5, 47, -12, 3, 8, 23.2, 67, 14, -7.5, 0, 31];
  //  new Plot2D(querySelector('div#fig1'),simpleData);
  //}
  //figure1();

//  var f1 = new Graph2D(querySelector('div#fig1'));
//  f1.scene.add(f1.axis([200,0], 0x880000, 10));
//  f1.scene.add(f1.axis([0,-25], 0x880000, 10));
//  f1.scene.add(f1.axis([0,100], 0x880000));
//  f1.render();
//
//  var f2 = new Graph3D(querySelector('div#orbs'))..init();
//  var m2 = f2.lineMaterial(0x880000);
//  f2.scene.add(f2.line([[0,0],[200,0]],m2));
//  m2 = f2.lineMaterial(0x008800);
//  f2.scene.add(f2.line([[0,0],[0,100]],m2));
//  m2 = f2.lineMaterial(0x000088);
//  f2.scene.add(f2.line([[0,0,0],[0,0,100]],m2));
//  f2.render();

//  var q = new Plot3D(querySelector('div#orbs')); q.init();
}
