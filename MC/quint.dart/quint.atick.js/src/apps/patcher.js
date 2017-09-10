// Copyright © 2013-5 Ian George Burleigh

var V = Quint, v = new V([360,380],'Patch','Modular synthesis sandbox').resize();
var P = V.Patcher;

v.addMnu('0-1',function() {
	var osc = new P.Number(v.fg,P.nextPlace(),'0-1',0,1).movable().closable();
});
v.addMnu('0-1k',function() {
	var osc = new P.Number(v.fg,P.nextPlace(),'0-1k',0,1000).movable().closable();
});
v.addMnu('0-4k',function() {
	var osc = new P.Number(v.fg,P.nextPlace(),'0-4k',0,4000).movable().closable();
});
v.addMnu('sin~',function() {
	var osc = new P.Osc$(v.fg,P.nextPlace(),null,'sin~').movable().closable().type('sine');
});
v.addMnu('tri~',function() {
	var osc = new P.Osc$(v.fg,P.nextPlace(),null,'tri~').movable().closable().type('triangle');
});
v.addMnu('saw~',function() {
	var osc = new P.Osc$(v.fg,P.nextPlace(),null,'saw~').movable().closable().type('sawtooth');
});
v.addMnu('rect~',function() {
	var osc = new P.Osc$(v.fg,P.nextPlace(),null,'rect~').movable().closable().type('square');
});
v.addMnu('scope~',function() {
	(new P.Scope$(v.fg,P.nextPlace())).movable().closable();
});
v.addMnu('gain~',function() {
	(new P.Gain$(v.fg,P.nextPlace())).movable().closable();
});
//v.addMnu('*~',function() {
//	(new P.Times$(v.fg,P.nextPlace())).movable().closable();
//});

V.Audio.init();

var num = new P.Number(v.fg,[4,4],'0-4k',0,4000).movable().closable();
var osc = new P.Osc$(v.fg,[4,74],null,'sin~').movable().closable().type('sine');
var nmg = new P.Number(v.fg,[140,74],'0-1',0,1).movable().closable();
var gai = new P.Gain$(v.fg,[4,144]).movable().closable();
var out = new P.Out$(v.fg,[4,244]).movable();
var sco = new P.Scope$(v.fg,[140,244]).movable().closable();

num.connect(0,osc,0);
osc.connect(0,gai,0);
nmg.connect(0,gai,1);
gai.connect(0,out,0);
gai.connect(0,sco,0);

// eof
