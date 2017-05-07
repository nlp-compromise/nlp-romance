'use strict';
const buildResult = require('./result/build');
const pkg = require('../package.json');
const log = require('./log');

//the main thing
const core = function(str, lexicon) {
  // this.tagset = tagset;
  let r = buildResult(str, lexicon);
  r.tagger();
  return r;
};

//same as main method, except with no POS-tagging.
core.tokenize = function(str) {
  return buildResult(str);
};

//this is useful
core.version = pkg.version;

//turn-on some debugging
core.verbose = function(str) {
  log.enable(str);
};

if (typeof self !== 'undefined') {
  self.core = core; // Web Worker
}
module.exports = core;
