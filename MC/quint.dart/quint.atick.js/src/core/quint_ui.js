/* quint.js - a JavaScript library to build simple machines
 * Copyright © 2013-5 Ian George Burleigh
 * http://quinta.audio/Quint
 */

(function() { "use strict"; var Q = Quint, Q_ = Q.prototype, _;

var QUI = Q.UI = {};

//--- panel --------------------------------------------------------------------

QUI.Table = function(anchor,cls) {
	this.$ = anchor.append('table');
	if (cls) this.$.classed(cls,1);
};

_ = QUI.Table.prototype;

// add row to table
_.row = function() {
	return new QUI.Panel.Row(this);
};

// add horizontal line to table
_.hr = function() {
	this.$.append('tr').append('td').attr('colspan',99).classed('hr',1);
	return this;
};

QUI.Panel = function(anchor,title) {
	QUI.Table.call(this,anchor,'uiPanel');
	title && this.$.append('th').attr('colspan',99).text(title);
};

_ = Q._subclass_(QUI.Panel,QUI.Table);

// add a panel to  Quint
Q_.uiPanel = function(title) {
	return new QUI.Panel(this.bar,title);
};

QUI.Panel.Row = function(panel) {
	this.$ = panel.$.append('tr');
};

_ = QUI.Panel.Row.prototype;

// add cell to row with opt. cell span
_.cell = function(span) {
	return new QUI.Panel.Cell(this,span);
};

QUI.Panel.Cell = function(row,span) {
	this.$ = row.$.append('td').attr('colspan',span);
};

var QC_ = QUI.Panel.Cell.prototype;

//--- label --------------------------------------------------------------------

QUI.Label = function(anchor,text) {
	this.$ = anchor.$.append('label').text(text);
};

QC_.label = function(text) {
	return new QUI.Label(this,text);
};

// HTML input (abstract)
QUI.Input = function(anchor,attr) {
	var a = anchor.$ ? anchor.$ : anchor; // TODO hack for FOREIGN, consolidate
	this.$ = a.append('input').attr(attr);
};

_ = QUI.Input.prototype;

// get or set name
_.name = function(name) {
	if (undefined===name) return this.$.attr('name');
	this.$.attr('name',name);
	return this;
};

// enable/disable
_.enable = function(on) {
	this.$.attr('readonly', (undefined===on || on) ? null : 1);
	return this;
};

// disable
_.disable = function() {
	return this.enable(false);
};

// trigger click
_.click = function() {
	this.$[0][0].click();
	return this;
};

// add input to cell
QC_.input = function() {
	return new QUI.Input(this);
};

//--- button -------------------------------------------------------------------

QUI.Button = function(anchor,text,onClick) {
	QUI.Input.call(this,anchor,{type:'button',value:text,state:0});
	this.color('#999').onClick(onClick);
};

_ = Q._subclass_(QUI.Button,QUI.Input);

_._update = function() {
	var hsl = this.hsl;
	if (!this.isDown()) hsl = hsl.brighter();
	this.$.style('background-color',hsl);
	return this;
};

// set color
_.color = function(color) {
	this.hsl = d3.hsl(color);
	return this._update();
};

//--- radio --------------------------------------------------------------------

// check, opt. with click
_.check = function(click) {
	if (click && !this.isChecked()) this.click();
	else this.setChecked(true);
	return this;
};

// uncheck, opt. with click
_.uncheck = function(click) {
	if (click && this.isChecked()) this.click();
	else this.setChecked(false);
	return this;
};


//--- file ---------------------------------------------------------------------

QUI.File = function(anchor,accept,onChange) {
	QUI.Input.call(this,anchor,{type:'file',accept:accept});
	this.onChange(onChange);
};

_ = Q._subclass_(QUI.File,QUI.Input);

// on change fun(input)
_.onChange = function(onChange) {
	if (onChange) {
		var th = this;
		this.$.on('change',function() { onChange(th); });
	}
	return this;
};

// add button to cell
QC_.file = function(accept,onChange) {
	return new QUI.File(this,accept,onChange);
};

})();
// eof
