'use strict';

exports.build = require('./result/build');
exports.Result = require('./result');
exports.Terms = require('./terms');
exports.Term = require('./term');
exports.log = require('./log');
exports.version = require('../package.json').version;

//the main thing
// const core = function(str, lexicon) {
//   // this.tagset = tagset;
//   let r = buildResult(str, lexicon);
//   r.tagger();
//   return r;
// };


// core.tagger = function(fn) {
//   this.tagger = fn;
// };

//same as main method, except with no POS-tagging.
// core.tokenize = function(str) {
//   return buildResult(str);
// };


//this is useful
// core.version = pkg.version;
//turn-on some debugging
// core.verbose = function(str) {
//   log.enable(str);
// };

// if (typeof self !== 'undefined') {
//   self.core = core; // Web Worker
// }
// module.exports = core;
