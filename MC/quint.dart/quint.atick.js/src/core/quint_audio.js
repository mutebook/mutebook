/* quint.js - a JavaScript library to build simple machines
 * Copyright © 2013-5 Ian George Burleigh
 * http://quinta.audio/Quint
 */

(function() { "use strict"; var Q = Quint;

// Web Audio wrapper

QA.sampleRate = function() {
	return this.ctx.sampleRate;
};

// createAnalyser
// createGain
// createDelay
// createBiquadFilter
// createWaveShaper
// createConvolver
// createChannelSplitter
// createChannelMerger
// createDynamicsCompressor
// createOscillator
// createPeriodicWave

// to connect data (e(vent)-rate)
QA.DataNode = function() {
	this.con	= [];				// connected nodes
	this.fun 	= function() {};	// what to do
};

QA.DataNode.prototype.connect = function(other) {
	this.con.push(other);
	other.con.push(this);
};

QA.DataNode.prototype.disconnect = function(other) {
	Q._arr_remove(this.con,other);
	Q._arr_remove(other.con,this);
};

QA.dataNode = function() {
	return new QA.DataNode();
};

})();
// eof
