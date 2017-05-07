'use strict';
var nlpCore = require('./src/index');
// nlp.verbose('tagger');

// nlp.tagger(function(ts) {
//   console.log('hi!');
//   return ts;
// });

nlpCore.build('hello world').debug();

// var r = nlp('hello world');
// r.debug();
