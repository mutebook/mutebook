/* quint.js - a JavaScript library to build simple machines
 * Copyright © 2013-5 Ian George Burleigh
 * http://quinta.audio/Quint
 */

(function() { "use strict"; var Q = Quint, QA = Q.Audio, _;

var P = Q.Patcher = {};

// sizes
P.DEF_SZ    = [96,46];
P.CSZ		= 5;		// control size
P.CS2		= 2*P.CSZ;

P.UGen = function(g,p,sz,tag,inTags,otTags) {
	this.sz = sz || P.DEF_SZ;
	this.mg = [2,2];	// margin to allow drawing outside
	Q.SubG.call(this,g,Q.sub(p,this.mg));
	this.box = this.rect(this.mg,this.sz).round(3);
	this.box.$.classed('ugen',1);
	if (tag) {
		var t = this.textRightTop(this.mg,Q.sub(this.sz,[2*P.CS2,0]),12,'['+tag+']');
		t.$.classed('tag',1);
	}

	this.valt = this.textRightBottom(this.mg,Q.sub(this.sz,[2*P.CS2,2]),12,'['+tag+']');
	this.valt.$.classed('tag',1).text('');

	var th = this;
	// patch points
	this.ins = Q._arr_collect(inTags,function(tag,i) {
		return new P.UGen.In(th,i,tag);
	});
	this.ots = Q._arr_collect(otTags,function(tag,i) {
		return new P.UGen.Ot(th,i,tag);
	});

	// active connections
	this.cin = [];
	this.cot = [];
};

_ = Q._subclass_(P.UGen,Q.SubG);

_.movable = function(isMovable) {
	if (undefined===isMovable||isMovable) {
		var th = this;
		this.box.movable(function(p) {
			th.p(Q.sub(p,th.mg));
			Q._arr_each(th.cin,function(cn) { cn.set(); });
			Q._arr_each(th.cot,function(cn) { cn.set(); });
			return th.mg; // but do not move within it
		});
		this.box.$.classed('movable',1);
	} else {
		this.box.movable(false);
		this.box.$.classed('movable',null);
	}
	return this;
};

_.closable = function(isClosable) {
	if (undefined===isClosable||isClosable) {
		this.closeBtn = this.push(this.clsP());
		var th = this;
		this.closeBtn.onPush(function(){th.close();});
	} else {
		delete this.closeBtn;
	}
	return this;
};

_.close = function() {
	while (this.cin.length>0) {	this.cin[0].remove(); }
	while (this.cot.length>0) {	this.cot[0].remove(); }
	this.remove();
};

_.clsP = function() {	// close box position
	return Q.add([this.box.sz()[0],P.CSZ-1],[-this.mg[0],this.mg[1]]);
};

_.inP = function(i,global) {	// input position
	var p = Q.add([P.CSZ*(i*3+2),P.CSZ-1],this.mg);
	if (global) p = Q.add(p,this.p());
	return p;
};

_.otP = function(i,global) {	// output position
	var p = Q.add([P.CSZ*(i*3+2),this.sz[1]-P.CSZ+1],this.mg);
	if (global) p = Q.add(p,this.p());
	return p;
};

_.connect = function(otI,inUg,inI) {
	return this.ots[otI].connect(inUg.ins[inI]);
};

P.UGen.InOt = function(ug,i,p1,p2,tag) {
	this.isSig = '~'==tag.substr(0,1);
	if (this.isSig) tag = tag.substr(1);
	this.ug = ug; this.i = i;
	this.cn = ug.circle(p1,P.CSZ);
	this.cn.$.classed('inot',1).classed('sig',this.isSig);
	ug.textCtrP(p2,11,tag).$.classed('tag',1);
//	this.node = this.isSig ? QA.gainNode(1) : QA.dataNode();
};

_ = P.UGen.InOt.prototype;

_.color = function(color) {
	this.cn.fill(color);
	return this;
};

P.UGen.In = function(ug,i,tag) {
	var p = ug.inP(i);
	P.UGen.InOt.call(this,ug,i,p,Q.add(p,[0,12]),tag);
	this.cn.$.classed('in',1);
	var th = this;
	this.cn.$
	.on('mouseover', function() {
		if (P.newCon) {
			th.cn.$.classed('over',P.newCon.begCon.canConnect(th));
			P.endCon = th;
		}
	})
	.on('mouseout', function() {
		if (P.newCon) {
			th.cn.$.classed('over',null);
			P.endCon = null;
		}
	});
};

_ = Q._subclass_(P.UGen.In,P.UGen.InOt);

P.UGen.Ot = function(ug,i,tag) {
	var p = ug.otP(i);
	P.UGen.InOt.call(this,ug,i,p,Q.sub(p,[0,14]),tag);
	this.cn.$.classed('ot',1);
	this.cn.cursor('s-resize');
	var th = this;
	this.cn.$.on('mousedown', function() {
		d3.event.stopPropagation();
		d3.event.preventDefault();
		th.cn.$.classed('down',1);
		P.newCon = new P.UGen.Con(th);
		Q.onMouseMove = function(mp) {
			P.newCon.overTo(mp);
		};
		Q.onMouseUp = function() {
			var clear = true;
			th.cn.$.classed('down',null);
			if (P.endCon) {
				P.endCon.cn.$.classed('over',null);	// must be here
				if (P.newCon.connect(P.endCon))
					clear = false;
			}
			if (clear) P.newCon.clear();
			P.endCon = P.newCon = null;
		};
	});
};

_ = Q._subclass_(P.UGen.Ot,P.UGen.InOt);

_.canConnect = function(In) {
	return 	this.matches(In) &&
		   !this.isConnected(In) &&
		    this.ug!==In.ug;
};

_.connect = function(In) {
	return (new P.UGen.Con(this)).connect(In);
};

_.isConnected = function(In) {
	var is = false;
	Q._arr_each(this.ug.cot,function(ot) {
		var ec = ot.endCon;
		if (ec.ug===In.ug && ec.i===In.i) is = true;
	});
	return is;
};

_.matches = function(other) {
	return this.isSig == other.isSig;
};

P.UGen.Con = function(begCon) {
	this.begCon = begCon;
	// thin so mouseover works TODO
	this.path = begCon.ug.g.path()
			   .width(1).fill('none')
			   .linecap('round').linejoin('round');
	this.path.$.classed('con',1).classed('sig',begCon.isSig);
	var th = this;
	this.path.cursor('no-drop').
	$.on('click', function() {
		th.remove();
	})
	.on('mouseenter', function() {
		th.path.$.classed('over',1);
	})
	.on('mouseleave', function() {
		th.path.$.classed('over',null);
	});

	this.set();
};

_ = P.UGen.Con.prototype;

_.clear = function() {
	this.path.remove();
};

_.remove = function() {
	this.clear();
	var b = this.begCon, e = this.endCon;
	delete this.begCon; delete this.endCon;
	Q._arr_remove(b.ug.cot,this);
	Q._arr_remove(e.ug.cin,this);
	if (b.isSig) b.node.disconnect();	// disconnects all output
	else b.node.disconnect(e.node);
	b.onDis && b.onDis(e);
	e.onDis && e.onDis(b);
	if (b.isSig) Q._arr_each(b.ug.cot, function(cn) {	// reconnect what remains
		cn.begCon.node.connect(cn.endCon.node);
	});
};

_.overTo = function(p) {
	this.path.set([this.ps[0],p]);
};

_.set = function() {
	var p0 = Q.add(this.begCon.ug.otP(this.begCon.i,true),[0,P.CSZ+1]);
	this.ps = [p0];

	if (this.endCon) { // connected
		var pe = Q.sub(this.endCon.ug.inP(this.endCon.i,true),[0,P.CSZ+1]);
		this.ps = [p0,Q.add(p0,[0,P.CS2]),Q.sub(pe,[0,P.CS2]),pe];
	}

	this.path.set(this.ps);
};

_.connect = function(endCon) {
	if (!this.begCon.canConnect(endCon)) return false;

	this.endCon = endCon;

	var b = this.begCon, e = this.endCon;

	b.ug.cot.push(this);
	e.ug.cin.push(this);

	this.path.width(b.isSig ? 7 : 5);
	this.set();

	b.onCon && b.onCon(e);
	e.onCon && e.onCon(b);

	b.node.connect(e.node);

	return true;
};

})();
// eof