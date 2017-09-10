/* quint.js - a JavaScript library to build simple machines
 * Copyright © 2013-5 Ian George Burleigh
 * http://quinta.audio/Quint
 */

(function() { "use strict"; var Q = Quint, QA = Q.Audio, _;

var P = Q.Patcher;
P.place = Q.P0;

P.nextPlace = function() {
	if (P.place[0]>60) P.place = Q.P0;
	P.place = Q.add(P.place,[6,4]);
	return P.place;
};

_ = P.UGen.prototype;

_.check = function(p) {
	p = Q.sub(p,[P.CSZ,P.CSZ]);
	return Q.SubG.prototype.check.call(this,p,[P.CS2,P.CS2]);
};

_.push = function(p) {
	p = Q.sub(p,[P.CSZ,P.CSZ]);
	return Q.SubG.prototype.push.call(this,p,[P.CS2,P.CS2]);
};

//------------------------------------------------------------------------------

P.Out$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'out~',['~'],[]);
	var in0 = this.ins[0].node = QA.gainNode(1), dest = QA.dest;
	this.check(this.box.ctr()).onCheck(function(on){
		if (on) {
			in0.connect(dest);
		} else {
			in0.disconnect(dest);
		}
	});
};

_ = Q._subclass_(P.Out$,P.UGen);

//----------------------------------------------------------------------------

P.Osc$ = function(g,p,/*opt*/sz,tag) {
	P.UGen.call(this,g,p,sz,tag,['frq'],['~']);
	var osc = this.osc = QA.ctx.createOscillator();
	osc.frequency.value = 0;

	(this.ins[0].node = QA.dataNode()).fun = function(v) {
		osc.frequency.value = v;
	};

	this.ots[0].node = osc;
	osc.start(0);
};

_ = Q._subclass_(P.Osc$,P.UGen);

_.type = function(type) {
	this.osc.type = type;
	return this;
};

//----------------------------------------------------------------------------

P.Gain$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'gain~',['~',''],['~']);
	var gai = this.gai = QA.ctx.createGain(), valt = this.valt;
	var amp = this.range('yellow',[8,20],[this.sz[0]-16,0],4,0,1,function(v){
			gai.gain.value = v; valt.$.text(v.toFixed(2));
	});
	amp.val(0.3);

	(this.ins[1].node = QA.dataNode()).fun = function(v) {
		amp.val(Q._bound(0,v,1));
	};

	this.ins[0].node = gai;
	this.ots[0].node = gai;
};

_ = Q._subclass_(P.Gain$,P.UGen);

P.Times$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'*~',['~',''],['~']);
	var gai = this.gai = QA.ctx.createGain(), valt = this.valt;
	var mul = function(v) {
		gai.gain.value = v; valt.$.text(v.toFixed(2));
	};
	mul(0.0);

	(this.ins[1].node = QA.dataNode()).fun = function(v) {
		mul(v);
	};

	this.ins[0].node = gai;
	this.ots[0].node = gai;
};

_ = Q._subclass_(P.Times$,P.UGen);

P.Times$$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'*~~',['~','~'],['~']);

	var LGT = 256;

	var in0 = QA.ctx.createScriptProcessor(LGT,1,1);
	var in1 = QA.ctx.createScriptProcessor(LGT,1,1);
	var out = QA.ctx.createScriptProcessor(LGT,1,1);
	var buf = new Array(LGT);

	for (var i=0; i<LGT; ++i) buf[i] = 0;	// clear

	in0.onaudioprocess = function(e) {
		var id = e.inputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) buf[i] *= id[i];
	};

	in1.onaudioprocess = function(e) {
		var id = e.inputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) buf[i] *= id[i];
	};

	out.onaudioprocess = function(e) {
		var od = e.outputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) {
			od[i] = buf[i]; buf[i] = 1;
		}
	};

	in0.connect(out);
	in1.connect(out);
	this.ins[0].node = in0;
	this.ins[1].node = in1;
	this.ots[0].node = out;
};

_ = Q._subclass_(P.Times$$,P.UGen);

P.Plus$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'+~',['~',''],['~']);
	var LGT = 256;
	var node = QA.ctx.createScriptProcessor(LGT,1,1);

	var add = 0.0;
	(this.ins[1].node = QA.dataNode()).fun = function(v) {
		add = v;
	};

	node.onaudioprocess = function(e) {
		var id = e.inputBuffer.getChannelData(0);
		var od = e.outputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) od[i] = id[i]+add;
	};

	this.ins[0].node = node;
	this.ots[0].node = node;
};

_ = Q._subclass_(P.Plus$,P.UGen);

P.Plus$$ = function(g,p,/*opt*/sz) {
	P.UGen.call(this,g,p,sz,'+~~',['~','~'],['~']);

	var LGT = 256;

	var in0 = QA.ctx.createScriptProcessor(LGT,1,1);
	var in1 = QA.ctx.createScriptProcessor(LGT,1,1);
	var out = QA.ctx.createScriptProcessor(LGT,1,1);
	var buf = new Array(LGT);

	for (var i=0; i<LGT; ++i) buf[i] = 0;	// clear

	in0.onaudioprocess = function(e) {
		var id = e.inputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) buf[i] = id[i];
	};

	in1.onaudioprocess = function(e) {
		var id = e.inputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) buf[i] += id[i];
	};

	out.onaudioprocess = function(e) {
		var od = e.outputBuffer.getChannelData(0);
		for (var i=0; i<LGT; ++i) {
			od[i] = buf[i]; buf[i] = 0;
		}
	};

	in0.connect(out);
	in1.connect(out);
	this.ins[0].node = in0;
	this.ins[1].node = in1;
	this.ots[0].node = out;
};

_ = Q._subclass_(P.Plus$$,P.UGen);

//----------------------------------------------------------------------------

P.Number = function(g,p,tag,min,max,sz) {
	P.UGen.call(this,g,p,sz,tag,[],['']);
	var valt = this.valt, node = this.ots[0].node = QA.dataNode();
	/* var num = */ this.range('yellow',[8,20],[this.sz[0]-16,0],4,min,max,function(v) {
		valt.$.text(v.toFixed(2));
		Q._arr_each(node.con,function(c){c.fun(v);});
	});
};

_ = Q._subclass_(P.Number,P.UGen);

//----------------------------------------------------------------------------

P.Scope$ = function(g,p,/*opt*/sz) {
	sz = sz || [120,100];
	P.UGen.call(this,g,p,sz,'scope~',['~'],[]);
	var cp = Q.add([6,12],this.mg);
	this.csz = [sz[0]-12,sz[1]-24];
	this.cvs = this.canvas(cp,this.csz);
	this.cvs.$.style('border','1px dotted gray');
	this.cvs.ctx.fillStyle = this.box.$.style('fill');

	this.any  = QA.ctx.createAnalyser();
	this.any.fftSize = 2048;
	this.data = new Uint8Array(this.any.frequencyBinCount);

	this.ins[0].node = this.any;

	var th = this;
	this.ins[0].onCon = function() {
		th.tout = setInterval(function(){
			th.draw(); th.cvs.refresh();
		},222);
	};
	this.ins[0].onDis = function() {
		clearInterval(th.tout);
	};
};

_ = Q._subclass_(P.Scope$,P.UGen);

_.draw = function() {
	this.any.getByteTimeDomainData(this.data);
	var i = this.trigger();

	var ctx = this.cvs.ctx, data = this.data, lgt = data.length,
	w = this.csz[0], h = this.csz[1], scale = h/256;
	ctx.fillRect(0,0,w,h);
	ctx.beginPath();
	ctx.moveTo(0,(256-data[i])*scale);
	for (var j=0; j<w && i<lgt; ++i,++j)
		ctx.lineTo(j,(256-data[i])*scale);
	ctx.stroke();
};

_.trigger = function() {
	var data = this.data, lgt = this.data.length;
	for (var i=0; i<lgt && 128<=data[i]; ++i)	// find negative
		;
	if (i>=lgt) return 0;

	var last0 = -1, d;
	for (; i<lgt && (d=data[i])<134; ++i)		// until some small positive value
		if (d<128)	 last0 = -1;
		else
		if (last0<0) last0 = i;

	return 0<last0 ? last0 : 0;
};

})();
// eof