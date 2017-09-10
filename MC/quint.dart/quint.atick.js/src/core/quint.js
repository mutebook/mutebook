

//--- Quint --------------------------------------------------------------------

Q_._init = function(sz,divId,title) {
	this.sz		= sz;
	var parent	= d3.select('#'+divId);
	parent.style({'white-space':'nowrap'});
	var qiv = this.div	= parent.append('div').classed('quint',1);
	/* bar */ this.bar	= parent.append('div').classed('quint_bar',1);

	// these styles are the layout (table): do not move to css
	qiv.style({display:'inline-block',overflow:'hidden',width:sz[0]+'px',height:sz[1]+'px'});

	// inner
	var tbl = qiv.append('table').style({'border-style':'hidden',padding:'0',margin:'0',width:'100%',height:'100%'});

	var row = this.ttr = tbl.append('tr').classed('ttl',1).style('height','1.2em');
	this.ttl = row.append('td').classed('ttl',1).attr('colspan',2);

	row = tbl.append('tr').style('height','100%');	// Firefox needs this
	this.mnu = row.append('td').classed('mnu',1).style({display:'none'});
	this.svg = row.append('td').style({padding:'0',width:'100%'}).append('svg').classed('quint',1).style({width:'100%',height:'100%'});

	this.gs	= [];		// groups of elems
	this.bg = this.G();	// background group
	this.fg = this.G();	// foreground group
};

Q_.title = function(tx) {
	if (undefined === tx) return this.ttl.text();
	this.ttl.text(tx).style('display',tx ? null : 'none');
	this.ttr.style('display',tx ? null : 'none');
	return this;
};

Q_.addMnu = function(text,onClick) {
	this.mnu.style('display',null);
	var mi = this.mnu.append('div').classed('mnuitem',1).text(text);
	if (onClick) mi.on('click',function() { onClick(); });
	return this;
};

//--- SVG group ----------------------------------------------------------------

Q.G = function($) {
	Q.SVG.call(this,$);
};

_ = Q._subclass_(Q.G,Q.SVG);

_.clear = function() {
	this.$.selectAll('*').remove();
};

// new group, add to list of groups
Q_.G = function() {
	var g = new Q.G(this.svg.append('g'));
	this.gs.push(g);
	return g;
};

// retrieve group by index
Q_.g = function(i/*=0*/) {
	return this.gs[i||0];
};

// _.p: get or set
// fixed position get P0, null set
_.p = function(p) {
	if (undefined === p) return Q.P0;
	return this;
};

// global position
_.gp = function() {
	return this.p();
};

//--- subgroup -----------------------------------------------------------------

Q.SubG = function(g, p) {
	if (Q._fixForeignObjects_) this.fos = [];	// foreign objects
	this.g	 = g;								// parent group
	this.svg = g.$.append('svg');				// nested container
	Q.G.call(this,this.svg.append('g'));		// with a group
	this.p(p);									// set position
};

_ = Q._subclass_(Q.SubG,Q.G);

_.p = function(p) {
	if (undefined === p) return this._p.slice();
	this._p = p.slice();
	this.svg.attr({x:p[0],y:p[1]});
	if (Q._fixForeignObjects_) {
		var gp = this.gp();
		Q._arr_each(this.fos, function(fo) { fo._fix(gp); });
	}
	return this;
};

_.gp = function() {
	return Q.add(this.g.p(),this.p());
};

//--- SVG elem -----------------------------------------------------------------

Q.SVG.Elem = function($) {
	Q.SVG.call(this, $);
	this._p = Q.P0;	// stored p
};

_ = Q._subclass_(Q.SVG.Elem,Q.SVG);

_.p = function(p) {
	if (undefined === p) return this._p.slice();
	this._p = p.slice();
	return this;
};



_ = Q._subclass_(Q.SVG.Text,Q.SVG.Elem);
// set color
_.color = function(color) {
	return this.fill(color);
};

// get bounding box
_.bbox = function() {
	return this.$[0][0].getBBox();
};

// set text
_.text = function(text) {
	this.$.text(text);
	return this;
};

// set position size text
_.set = function(p,pt,text) {
	this.p(p).size(pt).text(text);
	return this;
};

// center in rect
_.ctr = function(p,sz) {
	var bbox = this.bbox();
	return this.move([(sz[0]-bbox.width)/2,(sz[1]+bbox.height/2)/2]);
};

// center near top of rect
_.ctrTop = function(p,sz) {
	var bbox = this.bbox();
	return this.move(Q.add(p,[(sz[0]-bbox.width)/2,bbox.height]));
};

// center on p
_.ctrP = function(p) {
	var bbox = this.bbox();
	return this.move([p[0]-bbox.width/2,p[1]+bbox.height/3]);
};

// put where
_.rightTop = function(p,sz) {
	var bbox = this.bbox();
	return this.move(Q.add(p,[sz[0]-bbox.width-2,bbox.height-2]));
};

_.rightBottom = function(p,sz) {
	var bbox = this.bbox();
	return this.move(Q.add(p,[sz[0]-bbox.width-2,sz[1]-2]));
};

VG_.text = function(p,pt,text) {
	return new Q.SVG.Text(this,p,pt,text);
};

VG_.textCtr = function(p,sz,pt,text) {
	return this.text(p,pt,text).ctr(p,sz);
};

VG_.textCtrTop = function(p,sz,pt,text) {
	return this.text(p,pt,text).ctrTop(p,sz);
};

VG_.textRightTop = function(p,sz,pt,text) {
	return this.text(p,pt,text).rightTop(p,sz);
};

VG_.textRightBottom = function(p,sz,pt,text) {
	return this.text(p,pt,text).rightBottom(p,sz);
};

VG_.textCtrP = function(p,pt,text) {
	return this.text(p,pt,text).ctrP(p);
};

//--- foreign objects ----------------------------------------------------------

Q.SVG.ForeignObject = function(g,p,sz,newFun/*(anchor,sz)*/) {
	var anchor = this.fo = g.$.append('foreignObject');
	if (Q._fixForeignObjects_) {
		g.fos.push(this.fo);
		this.fo.g = g;
		anchor = this.fo.div = this.fo.append('xhtml:div');
		anchor.style({position:'relative'});
		this.fo._fix = function(gp) {
			if (undefined===gp) gp = this.g.gp();
			this.div.style({left:gp[0]+'px',top:gp[1]+'px'});
		};
	}
	this.object = new newFun(anchor,sz);
	Q.SVG.Elem.call(this,this.object);
	return this.set(p,sz);
};

_ = Q._subclass_(Q.SVG.ForeignObject,Q.SVG.Elem);

_.pointerEvents = function(what) {
	this.fo.attr('pointer-events',what);
};

// get or set p
_.p = function(p) {
	if (undefined===p) return this._p.slice();
	return this.set(p,this._sz);
};

// get or set [w,h]
_.sz = function(sz) {
	if (undefined===sz) return this._sz.slice();
	return this.set(this._p,sz);
};

// set position [x,y] and size [w,h]
_.set = function(p,sz) {
	this._p  = p.slice();
	this._sz = sz.slice();
	this.fo.attr({x:p[0],y:p[1],width:sz[0],height:sz[1]});
	if (Q._fixForeignObjects_) this.fo._fix();
	return this;
};

VG_.foreignObject = function(p,sz,newFun) {
	return new Q.SVG.ForeignObject(this,p,sz,newFun);
};

//--- foreign ui ---------------------------------------------------------------

Q.SVG.Canvas = function(anchor,sz) {
	this.$ = anchor.append('xhtml:canvas').attr({width:sz[0]-2,height:sz[1]-2});
	this.ctx = this.$[0][0].getContext('2d');
};

_ = Q.SVG.Canvas.prototype;

VG_.canvas = function(p,sz) {
	var fo = this.foreignObject(p,sz,Q.SVG.Canvas);
	fo.pointerEvents('none');
	// TODO hack for drawing
	fo.object.refresh = function() {
		var p = fo.p(); fo.p(Q.P0); fo.p(p);
	};
	return fo.object;
};

/* TODO not prime time for foreign objects yet
Q.SVG.Check = function(anchor) {
	Q.UI.Check.call(this,anchor);
};

_ = Q._subclass_(VF.Check,Q.UI.Check);

VG_.check = function(p,sz) {
	var o = this.foreignObject(p,sz,VF.Check).object;
	o.onClick(function(o){alert(o.isChecked())})
	return o;
};
*/

//--- UI -----------------------------------------------------------------------

Q.SVG.Check = function(g,p,sz) {
	Q.SVG.Rect.call(this,g,p,sz);
	this.$.classed('check',1);
	this.round(3);
	this.on = false;
	var th = this;
	this.$.on('mousedown', function() {
		th.on = !th.on;
		th.$.classed('checked',th.on);
		th._onc && th._onc(th.on);
	});
};

_ = Q._subclass_(Q.SVG.Check,Q.SVG.Rect);

_.onCheck = function(f) {
	this._onc = f;
};

VG_.check = function(p,sz) {
	return new Q.SVG.Check(this,p,sz);
};

Q.SVG.Push = function(g,p,sz) {
	Q.SVG.Rect.call(this,g,p,sz);
	this.$.classed('push',1);
	this.round(3);
	this.on = false;
	var th = this;
	this.$.on('mouseup', function() {
		th._onp && th._onp();
	});
};

_ = Q._subclass_(Q.SVG.Push,Q.SVG.Rect);

_.onPush = function(f) {
	this._onp = f;
};

VG_.push = function(p,sz) {
	return new Q.SVG.Push(this,p,sz);
};

var P = Q.Part = {};
