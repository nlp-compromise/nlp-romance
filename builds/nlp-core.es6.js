(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.nlpCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports={
  "author": "Spencer Kelly <spencermountain@gmail.com> (http://spencermounta.in)",
  "name": "nlp-reomance",
  "description": "natural-language core for multi-language nlp",
  "version": "0.0.1",
  "main": "./builds/nlp-romance.js",
  "repository": {
    "type": "git",
    "url": "git://github.com/nlp-compromise/de-romance.git"
  },
  "scripts": {
    "test": "node ./scripts/test.js",
    "build": "node ./scripts/build/index.js",
    "demo": "node ./scripts/demo.js",
    "watch": "node ./scripts/watch.js"
  },
  "files": [
    "builds/",
    "docs/"
  ],
  "dependencies": {},
  "devDependencies": {
    "babel-preset-es2015": "^6.24.0",
    "babelify": "7.3.0",
    "babili": "0.0.11",
    "browserify": "13.0.1",
    "chalk": "^1.1.3",
    "codacy-coverage": "^2.0.0",
    "derequire": "^2.0.3",
    "efrt": "0.0.6",
    "eslint": "^3.1.1",
    "gaze": "^1.1.1",
    "http-server": "0.9.0",
    "nlp-corpus": "latest",
    "nyc": "^8.4.0",
    "shelljs": "^0.7.2",
    "tap-min": "^1.1.0",
    "tap-spec": "4.1.1",
    "tape": "4.6.0",
    "uglify-js": "2.7.0"
  },
  "license": "MIT"
}

},{}],2:[function(_dereq_,module,exports){
'use strict';
const tagset = {} //require('./tagset');

// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  black: '\x1b[30m'
};
//dont use colors on client-side
if (typeof module === 'undefined') {
  Object.keys(c).forEach((k) => {
    c[k] = '';
  });
}

//coerce any input into a string
exports.ensureString = (input) => {
  if (typeof input === 'string') {
    return input;
  } else if (typeof input === 'number') {
    return '' + input;
  }
  return '';
};
//coerce any input into a string
exports.ensureObject = (input) => {
  if (typeof input !== 'object') {
    return {};
  }
  if (input === null || input instanceof Array) {
    return {};
  }
  return input;
};

exports.titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.substr(1);
};

//shallow-clone an object
exports.copy = (o) => {
  let o2 = {};
  o = exports.ensureObject(o);
  Object.keys(o).forEach((k) => {
    o2[k] = o[k];
  });
  return o2;
};
exports.extend = (obj, a) => {
  obj = exports.copy(obj);
  const keys = Object.keys(a);
  for (let i = 0; i < keys.length; i++) {
    obj[keys[i]] = a[keys[i]];
  }
  return obj;
};

//colorization
exports.green = function(str) {
  return c.green + str + c.reset;
};
exports.red = function(str) {
  return c.red + str + c.reset;
};
exports.blue = function(str) {
  return c.blue + str + c.reset;
};
exports.magenta = function(str) {
  return c.magenta + str + c.reset;
};
exports.cyan = function(str) {
  return c.cyan + str + c.reset;
};
exports.yellow = function(str) {
  return c.yellow + str + c.reset;
};
exports.black = function(str) {
  return c.black + str + c.reset;
};
exports.printTag = function(tag) {
  if (tagset[tag]) {
    const color = tagset[tag].color || 'black';
    return exports[color](tag);
  }
  return tag;
};
exports.printTerm = function(t) {
  const tags = Object.keys(t.tags);
  for (let i = 0; i < tags.length; i++) {
    if (tagset[tags[i]]) {
      const color = tagset[tags[i]].color || 'black';
      return exports[color](t.out('text'));
    }
  }
  return c.reset + t.plaintext + c.reset;
};

exports.leftPad = function(str, width, char) {
  char = char || ' ';
  str = str.toString();
  while (str.length < width) {
    str += char;
  }
  return str;
};

exports.isArray = function(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

},{}],3:[function(_dereq_,module,exports){
'use strict';
const buildResult = _dereq_('./result/build');
const pkg = _dereq_('../package.json');
const log = _dereq_('./log');

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

},{"../package.json":1,"./log":5,"./result/build":7}],4:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../fns');

// const colors = {
//   'Person': '#6393b9',
//   'Pronoun': '#81acce',
//   'Noun': 'steelblue',
//   'Verb': 'palevioletred',
//   'Adverb': '#f39c73',
//   'Adjective': '#b3d3c6',
//   'Determiner': '#d3c0b3',
//   'Preposition': '#9794a8',
//   'Conjunction': '#c8c9cf',
//   'Value': 'palegoldenrod',
//   'Expression': '#b3d3c6'
// };

const tag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ->   ' + pos;
  title += fns.leftPad((reason || ''), 15);
  console.log('%c' + title, ' color: #a2c99c');
};
const untag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.leftPad('\'' + title + '\'', 12);
  title += '  ~*   ' + pos;
  title += '    ' + (reason || '');
  console.log('%c' + title, ' color: #b66a6a');
};
module.exports = {
  tag: tag,
  untag: untag,
};

},{"../fns":2}],5:[function(_dereq_,module,exports){
'use strict';
const client = _dereq_('./client');
const server = _dereq_('./server');

let enable = false;

module.exports = {
  enable: (str) => {
    if (str === undefined) {
      str = true;
    }
    enable = str;
  },
  tag: (t, pos, reason) => {
    if (enable === true || enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.tag(t, pos, reason);
      } else {
        server.tag(t, pos, reason);
      }
    }
  },
  unTag: (t, pos, reason) => {
    if (enable === true || enable === 'tagger') {
      if (typeof window !== 'undefined') {
        client.untag(t, pos, reason);
      } else {
        server.untag(t, pos, reason);
      }
    }
  }
};

},{"./client":4,"./server":6}],6:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../fns');

//use weird bash escape things for some colors
const tag = (t, pos, reason) => {
  let title = t.normal || '[' + t.silent_term + ']';
  title = fns.yellow(title);
  title = fns.leftPad('\'' + title + '\'', 20);
  title += '  ->   ' + fns.printTag(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.cyan(reason || '') + ')');
};

const untag = function(t, pos, reason) {
  let title = '-' + t.normal + '-';
  title = fns.red(title);
  title = fns.leftPad(title, 20);
  title += '  ~*   ' + fns.red(pos);
  title = fns.leftPad(title, 54);
  console.log('       ' + title + '(' + fns.red(reason || '') + ')');
};

module.exports = {
  tag: tag,
  untag: untag,
};

},{"../fns":2}],7:[function(_dereq_,module,exports){
'use strict';
const Text = _dereq_('./index');
const tokenize = _dereq_('./lib/tokenize');
const p = _dereq_('./paths');
const Terms = p.Terms;
const fns = p.fns;
const normalize = _dereq_('../term/methods/normalize').normalize;

//basically really dirty and stupid.
const normalizeLex = function(lex) {
  lex = lex || {};
  return Object.keys(lex).reduce((h, k) => {
    //add natural form
    h[k] = lex[k];
    let normal = normalize(k);
    //remove periods
    //normalize whitesace
    normal = normal.replace(/\s+/, ' ');
    //remove sentence-punctuaion too
    normal = normal.replace(/[.\?\!]/g, '');
    if (k !== normal) {
      //add it too
      h[normal] = lex[k];
    }
    return h;
  }, {});
};

const fromString = (str, lexicon) => {
  let sentences = [];
  //allow pre-tokenized input
  if (fns.isArray(str)) {
    sentences = str;
  } else {
    str = fns.ensureString(str);
    sentences = tokenize(str);
  }
  //make sure lexicon obeys standards
  lexicon = normalizeLex(lexicon);
  let list = sentences.map((s) => Terms.fromString(s, lexicon));

  let r = new Text(list, lexicon);
  //give each ts a ref to the result
  r.list.forEach((ts) => {
    ts.refText = r;
  });
  return r;
};
module.exports = fromString;

},{"../term/methods/normalize":22,"./index":9,"./lib/tokenize":11,"./paths":18}],8:[function(_dereq_,module,exports){
module.exports = {
  /** did it find anything? */
  found: function() {
    return this.list.length > 0;
  },
  /** just a handy wrap*/
  parent: function() {
    return this.reference || this;
  },
  /** how many Texts are there?*/
  length: function() {
    return this.list.length;
  },
  /** nicer than constructor.call.name or whatever*/
  isA: function() {
    return 'Text';
  },
  /** the whitespace before and after this match*/
  whitespace: function() {
    return {
      before: (str) => {
        this.list.forEach((ts) => {
          ts.whitespace.before(str);
        });
        return this;
      },
      after: (str) => {
        this.list.forEach((ts) => {
          ts.whitespace.after(str);
        });
        return this;
      }
    };
  }

};

},{}],9:[function(_dereq_,module,exports){
'use strict';
//a Text is an array of termLists
const getters = _dereq_('./getters');

function Text(arr, lexicon, reference) {
  this.list = arr || [];
  this.lexicon = lexicon;
  this.reference = reference;
  //apply getters
  let keys = Object.keys(getters);
  for(let i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], {
      get: getters[keys[i]]
    });
  }
}
_dereq_('./methods/loops')(Text);
_dereq_('./methods/out')(Text);
_dereq_('./methods/misc')(Text);

module.exports = Text;

},{"./getters":8,"./methods/loops":12,"./methods/misc":13,"./methods/out":14}],10:[function(_dereq_,module,exports){
//these are common word shortenings used in the lexicon and sentence segmentation methods
//there are all nouns,or at the least, belong beside one.
'use strict';

//common abbreviations
let compact = {
  Noun: [
    'arc',
    'al',
    'exp',
    'fy',
    'pd',
    'pl',
    'plz',
    'tce',
    'bl',
    'ma',
    'ba',
    'lit',
    'ex',
    'eg',
    'ie',
    'ca',
    'cca',
    'vs',
    'etc',
    'esp',
    'ft',
    //these are too ambiguous
    'bc',
    'ad',
    'md',
    'corp',
    'col'
  ],
  Organization: [
    'dept',
    'univ',
    'assn',
    'bros',
    'inc',
    'ltd',
    'co',
    //proper nouns with exclamation marks
    'yahoo',
    'joomla',
    'jeopardy'
  ],

  Place: [
    'Str',
    'rd',
    'st',
    'dist',
    'mt',
    'ave',
    'blvd',
    'cl',
    'ct',
    'cres',
    'hwy',
    //states
    'ariz',
    'cal',
    'calif',
    'colo',
    'conn',
    'fla',
    'fl',
    'ga',
    'ida',
    'ia',
    'kan',
    'kans',

    'minn',
    'neb',
    'nebr',
    'okla',
    'penna',
    'penn',
    'pa',
    'dak',
    'tenn',
    'tex',
    'ut',
    'vt',
    'va',
    'wis',
    'wisc',
    'wy',
    'wyo',
    'usafa',
    'alta',
    'ont',
    'que',
    'sask'
  ],

  Date: [
    'jan',
    'feb',
    'mar',
    'apr',
    'jun',
    'jul',
    'aug',
    'sep',
    'sept',
    'oct',
    'nov',
    'dec',
    'circa'
  ],

  //Honorifics
  Honorific: [
    'adj',
    'adm',
    'adv',
    'asst',
    'atty',
    'bldg',
    'brig',
    'capt',
    'cmdr',
    'comdr',
    'cpl',
    'det',
    'dr',
    'esq',
    'gen',
    'gov',
    'hon',
    'jr',
    'llb',
    'lt',
    'maj',
    'messrs',
    'mister',
    'mlle',
    'mme',
    'mr',
    'mrs',
    'ms',
    'mstr',
    'op',
    'ord',
    'phd',
    'prof',
    'pvt',
    'rep',
    'reps',
    'res',
    'rev',
    'sen',
    'sens',
    'sfc',
    'sgt',
    'sir',
    'sr',
    'supt',
    'surg'
  //miss
  //misses
  ]

};

//unpack the compact terms into the misc lexicon..
let abbreviations = {};
const keys = Object.keys(compact);
for (let i = 0; i < keys.length; i++) {
  const arr = compact[keys[i]];
  for (let i2 = 0; i2 < arr.length; i2++) {
    abbreviations[arr[i2]] = keys[i];
  }
}
module.exports = abbreviations;

},{}],11:[function(_dereq_,module,exports){
//(Rule-based sentence boundary segmentation) - chop given text into its proper sentences.
// Ignore periods/questions/exclamations used in acronyms/abbreviations/numbers, etc.
// @spencermountain 2017 MIT
'use strict';
const abbreviations = Object.keys(_dereq_('./abbreviations'));
//regs-
const abbrev_reg = new RegExp('\\b(' + abbreviations.join('|') + ')[.!?] ?$', 'i');
const acronym_reg = new RegExp('[ |\.][A-Z]\.?( *)?$', 'i');
const elipses_reg = new RegExp('\\.\\.+( +)?$');

//start with a regex:
const naiive_split = function (text) {
  let all = [];
  //first, split by newline
  let lines = text.split(/(\n+)/);
  for(let i = 0; i < lines.length; i++) {
    //split by period, question-mark, and exclamation-mark
    let arr = lines[i].split(/(\S.+?[.!?])(?=\s+|$)/g);
    for(let o = 0; o < arr.length; o++) {
      all.push(arr[o]);
    }
  }
  return all;
};

const sentence_parser = function (text) {
  text = text || '';
  text = '' + text;
  let sentences = [];
  //first do a greedy-split..
  let chunks = [];
  //ensure it 'smells like' a sentence
  if (!text || typeof text !== 'string' || /\S/.test(text) === false) {
    return sentences;
  }
  //start somewhere:
  let splits = naiive_split(text);
  //filter-out the grap ones
  for (let i = 0; i < splits.length; i++) {
    let s = splits[i];
    if (s === undefined || s === '') {
      continue;
    }
    //this is meaningful whitespace
    if (/\S/.test(s) === false) {
      //add it to the last one
      if (chunks[chunks.length - 1]) {
        chunks[chunks.length - 1] += s;
        continue;
      } else if (splits[i + 1]) { //add it to the next one
        splits[i + 1] = s + splits[i + 1];
        continue;
      }
    }
    //else, only whitespace, no terms, no sentence
    chunks.push(s);
  }

  //detection of non-sentence chunks:
  //loop through these chunks, and join the non-sentence chunks back together..
  for (let i = 0; i < chunks.length; i++) {
    let c = chunks[i];
    //should this chunk be combined with the next one?
    if (chunks[i + 1] !== undefined && (abbrev_reg.test(c) || acronym_reg.test(c) || elipses_reg.test(c))) {
      chunks[i + 1] = c + (chunks[i + 1] || '');
    } else if (c && c.length > 0) { //this chunk is a proper sentence..
      sentences.push(c);
      chunks[i] = '';
    }
  }
  //if we never got a sentence, return the given text
  if (sentences.length === 0) {
    return [text];
  }
  return sentences;
};

module.exports = sentence_parser;
// console.log(sentence_parser('john f. kennedy'));

},{"./abbreviations":10}],12:[function(_dereq_,module,exports){
'use strict';
//this methods are simply loops around each termList object.
const methods = [
  'toTitleCase',
  'toUpperCase',
  'toLowerCase',
  // 'toCamelCase',
  //
  // 'hyphenate',
  // 'dehyphenate',
  // 'trim',
  //
  // 'insertBefore',
  // 'insertAfter',
  // 'insertAt',
  //
  // 'replace',
  // 'replaceWith',
  //
  // 'delete',
  // 'lump',

  'tagger',

// 'tag',
// 'unTag',
];

const addMethods = (Text) => {
  methods.forEach((k) => {
    Text.prototype[k] = function () {
      for(let i = 0; i < this.list.length; i++) {
        this.list[i][k].apply(this.list[i], arguments);
      }
      return this;
    };
  });

  //add an extra optimisation for tag method
  Text.prototype.tag = function() {
    //fail-fast optimisation
    if (this.list.length === 0) {
      return this;
    }
    for(let i = 0; i < this.list.length; i++) {
      this.list[i].tag.apply(this.list[i], arguments);
    }
    return this;
  };
};

module.exports = addMethods;

},{}],13:[function(_dereq_,module,exports){
'use strict';
const Terms = _dereq_('../paths').Terms;


const miscMethods = (Text) => {

  const methods = {

    terms: function() {
      let list = [];
      //make a Terms Object for every Term
      this.list.forEach((ts) => {
        ts.terms.forEach((t) => {
          list.push(new Terms([t], ts.lexicon, this));
        });
      });
      let r = new Text(list, this.lexicon, this.parent);
      return r;
    },

  };

  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Text.prototype[k] = methods[k];
  });
  return Text;
};

module.exports = miscMethods;

},{"../paths":18}],14:[function(_dereq_,module,exports){
'use strict';
const topk = _dereq_('./topk');
const offset = _dereq_('./offset');
const termIndex = _dereq_('./indexes');

const methods = {
  text: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('text');
      return str;
    }, '');
  },
  normal: (r) => {
    return r.list.map((ts) => {
      let str = ts.out('normal');
      let last = ts.last();
      if (last) {
        let punct = last.endPunctuation();
        if (punct === '.' || punct === '!' || punct === '?') {
          str += punct;
        }
      }
      return str;
    }).join(' ');
  },
  root: (r) => {
    return r.list.map((ts) => {
      return ts.out('root');
    }).join(' ');
  },
  /** output where in the original output string they are*/
  offsets: (r) => {
    return offset(r);
  },
  /** output the tokenized location of this match*/
  index: (r) => {
    return termIndex(r);
  },
  grid: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('grid');
      return str;
    }, '');
  },
  color: (r) => {
    return r.list.reduce((str, ts) => {
      str += ts.out('color');
      return str;
    }, '');
  },
  array: (r) => {
    return r.list.map((ts) => {
      return ts.out('normal');
    });
  },
  csv: (r) => {
    return r.list.map((ts) => {
      return ts.out('csv');
    }).join('\n');
  },
  newlines: (r) => {
    return r.list.map((ts) => {
      return ts.out('newlines');
    }).join('\n');
  },
  json: (r) => {
    return r.list.reduce((arr, ts) => {
      let terms = ts.terms.map((t) => {
        return {
          text: t.text,
          normal: t.normal,
          tags: t.tag
        };
      });
      arr.push(terms);
      return arr;
    }, []);
  },
  html: (r) => {
    let html = r.list.reduce((str, ts) => {
      let sentence = ts.terms.reduce((sen, t) => {
        sen += '\n    ' + t.out('html');
        return sen;
      }, '');
      return str += '\n  <span class="nl-Satz">' + sentence + '\n  </span>';
    }, '');
    return '<span> ' + html + '\n</span>';
  },
  terms: (r) => {
    let arr = [];
    r.list.forEach((ts) => {
      ts.terms.forEach((t) => {
        arr.push({
          text: t.text,
          normal: t.normal,
          tags: Object.keys(t.tags)
        });
      });
    });
    return arr;
  },
  debug: (r) => {
    console.log('====');
    r.list.forEach((ts) => {
      console.log('   --');
      ts.debug();
    });
    return r;
  },
  topk: (r) => {
    return topk(r);
  }
};
methods.plaintext = methods.text;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;
methods.offset = methods.offsets;
methods.idexes = methods.index;
methods.frequency = methods.topk;
methods.freq = methods.topk;
methods.arr = methods.array;

const addMethods = (Text) => {
  Text.prototype.out = function(fn) {
    if (methods[fn]) {
      return methods[fn](this);
    }
    return methods.text(this);
  };
  Text.prototype.debug = function() {
    return methods.debug(this);
  };
  return Text;
};


module.exports = addMethods;

},{"./indexes":15,"./offset":16,"./topk":17}],15:[function(_dereq_,module,exports){
'use strict';
//find where in the original text this match is found, by term-counts
const termIndex = (r) => {
  let result = [];
  //find the ones we want
  let want = {};
  r.terms().list.forEach((ts) => {
    want[ts.terms[0].uid] = true;
  });

  //find their counts
  let sum = 0;
  let parent = r.all();
  parent.list.forEach((ts, s) => {
    ts.terms.forEach((t, i) => {
      if (want[t.uid] !== undefined) {
        result.push({
          text: t.text,
          normal: t.normal,
          term: sum,
          sentence: s,
          sentenceTerm: i
        });
      }
      sum += 1;
    });
  });

  return result;
};
module.exports = termIndex;

},{}],16:[function(_dereq_,module,exports){
'use strict';
/** say where in the original output string they are found*/

const findOffset = (parent, term) => {
  let sum = 0;
  for(let i = 0; i < parent.list.length; i++) {
    for(let o = 0; o < parent.list[i].terms.length; o++) {
      let t = parent.list[i].terms[o];
      if (t.uid === term.uid) {
        return sum;
      } else {
        sum += t.whitespace.before.length + t._text.length + t.whitespace.after.length;
      }
    }
  }
  return null;
};

//like 'text' for the middle, and 'normal' for the start+ends
//used for highlighting the actual words, without whitespace+punctuation
const trimEnds = function(ts) {
  let terms = ts.terms;
  if (terms.length <= 2) {
    return ts.out('normal');
  }
  //the start
  let str = terms[0].normal;
  //the middle
  for(let i = 1; i < terms.length - 1; i++) {
    let t = terms[i];
    str += t.whitespace.before + t.text + t.whitespace.after;
  }
  //the end
  str += ' ' + terms[ts.terms.length - 1].normal;
  return str;
};

//map over all-dem-results
const allOffset = (r) => {
  let parent = r.all();
  return r.list.map((ts) => {
    let words = [];
    for(let i = 0; i < ts.terms.length; i++) {
      words.push(ts.terms[i].normal);
    }
    let nrml = trimEnds(ts);
    let txt = ts.out('text');
    let startAt = findOffset(parent, ts.terms[0]);
    let beforeWord = ts.terms[0].whitespace.before;
    let wordStart = startAt + beforeWord.length;
    return {
      text: txt,
      normal: ts.out('normal'),
      //where we begin
      offset: startAt,
      length: txt.length,
      wordStart: wordStart,
      wordEnd: wordStart + nrml.length,
    // wordLength: words.join(' ').length
    };
  });
};
module.exports = allOffset;

},{}],17:[function(_dereq_,module,exports){
'use strict';
//
const topk = function (r, n) {
  //count occurance
  let count = {};
  r.list.forEach((ts) => {
    let str = ts.out('root');
    count[str] = count[str] || 0;
    count[str] += 1;
  });
  //turn into an array
  let all = [];
  Object.keys(count).forEach((k) => {
    all.push({
      normal: k,
      count: count[k],
    });
  });
  //add percentage
  all.forEach((o) => {
    o.percent = parseFloat(((o.count / r.list.length) * 100).toFixed(2));
  });
  //sort by freq
  all = all.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    return 1;
  });
  if (n) {
    all = all.splice(0, n);
  }
  return all;
};

module.exports = topk;

},{}],18:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  Terms: _dereq_('../terms'),
};

},{"../fns":2,"../terms":37}],19:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('./paths').fns;
const build_whitespace = _dereq_('./whitespace');
const makeUID = _dereq_('./makeUID');
//normalization
const normalize = _dereq_('./methods/normalize').normalize;

const Term = function(str) {
  this._text = fns.ensureString(str);
  this.tags = {};
  //seperate whitespace from the text
  let parsed = build_whitespace(this._text);
  this.whitespace = parsed.whitespace;
  this._text = parsed.text;
  this.parent = null;
  this.silent_term = '';
  this.lumped = false;
  //normalize the _text
  this.normal = normalize(this._text);
  //has this term been modified
  this.dirty = false;
  //make a unique id for this term
  this.uid = makeUID(this.normal);

  //getters/setters
  Object.defineProperty(this, 'text', {
    get: function() {
      return this._text;
    },
    set: function(txt) {
      txt = txt || '';
      this._text = txt.trim();
      this.dirty = true;
      if (this._text !== txt) {
        this.whitespace = build_whitespace(txt);
      }
      this.normalize();
    }
  });
  //bit faster than .constructor.name or w/e
  Object.defineProperty(this, 'isA', {
    get: function() {
      return 'Term';
    }
  });
};
Term.prototype.normalize = function() {
  return normalize(this.text);
};

_dereq_('./methods/tag')(Term);
_dereq_('./methods/out')(Term);
_dereq_('./methods/case')(Term);
_dereq_('./methods/punctuation')(Term);
module.exports = Term;

},{"./makeUID":20,"./methods/case":21,"./methods/normalize":22,"./methods/out":26,"./methods/punctuation":28,"./methods/tag":30,"./paths":33,"./whitespace":34}],20:[function(_dereq_,module,exports){
'use strict';
//this is a not-well-thought-out way to reduce our dependence on `object===object` reference stuff
//generates a unique id for this term
//may need to change when the term really-transforms? not sure.
const uid = (str) => {
  let nums = '';
  for(let i = 0; i < 5; i++) {
    nums += parseInt(Math.random() * 9, 10);
  }
  return str + '-' + nums;
};
module.exports = uid;

},{}],21:[function(_dereq_,module,exports){
'use strict';

const addMethods = (Term) => {

  const methods = {
    toUpperCase: function () {
      this.text = this.text.toUpperCase();
      this.tag('#UpperCase', 'toUpperCase');
      return this;
    },
    toLowerCase: function () {
      this.text = this.text.toLowerCase();
      this.unTag('#TitleCase');
      this.unTag('#UpperCase');
      return this;
    },
    toTitleCase: function () {
      this.text = this.text.replace(/^[a-z]/, (x) => x.toUpperCase());
      this.tag('#TitleCase', 'toTitleCase');
      return this;
    },
    //(camelCase() is handled in `./terms` )

    /** is it titlecased because it deserves it? Like a person's name? */
    needsTitleCase: function() {
      const titleCases = [
        'Person',
        'Place',
        'Organization',
        'Acronym',
        'UpperCase',
        'Currency',
        'RomanNumeral',
        'Month',
        'WeekDay',
        'Holiday',
        'Demonym',
      ];
      for(let i = 0; i < titleCases.length; i++) {
        if (this.tags[titleCases[i]]) {
          return true;
        }
      }
      //specific words that keep their titlecase
      //https://en.wikipedia.org/wiki/Capitonym
      const irregulars = [
        'i',
        'god',
        'allah',
      ];
      for(let i = 0; i < irregulars.length; i++) {
        if (this.normal === irregulars[i]) {
          return true;
        }
      }
      return false;
    }
  };
  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],22:[function(_dereq_,module,exports){
'use strict';
const killUnicode = _dereq_('./unicode');
const isAcronym = _dereq_('./isAcronym');


//some basic operations on a string to reduce noise
exports.normalize = function(str) {
  str = str || '';
  str = str.toLowerCase();
  str = str.trim();
  let original = str;
  //(very) rough asci transliteration -  bjŏrk -> bjork
  str = killUnicode(str);
  //hashtags, atmentions
  str = str.replace(/^[#@]/, '');
  // coerce single curly quotes
  str = str.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]+/g, '\'');
  // coerce double curly quotes
  str = str.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036"]+/g, '');
  //coerce unicode elipses
  str = str.replace(/\u2026/g, '...');
  //en-dash
  str = str.replace(/\u2013/g, '-');

  //strip leading & trailing grammatical punctuation
  if (/^[:;]/.test(str) === false) {
    str = str.replace(/\.{3,}$/g, '');
    str = str.replace(/['",\.!:;\?\)]$/g, '');
    str = str.replace(/^['"\(]/g, '');
  }
  //oh shucks,
  if (str === '') {
    str = original;
  }
  return str;
};

exports.addNormal = function (term) {
  let str = term._text || '';
  str = exports.normalize(str);
  //compact acronyms
  if (isAcronym(term._text)) {
    str = str.replace(/\./g, '');
  }
  //nice-numbers
  str = str.replace(/([0-9]),([0-9])/g, '$1$2');
  term.normal = str;
};


// console.log(normalize('Dr. V Cooper'));

},{"./isAcronym":23,"./unicode":24}],23:[function(_dereq_,module,exports){
'use strict';
//regs -
const periodAcronym = /([A-Z]\.)+[A-Z]?$/;
const oneLetterAcronym = /^[A-Z]\.$/;
const noPeriodAcronym = /[A-Z]{3}$/;

/** does it appear to be an acronym, like FBI or M.L.B. */
const isAcronym = function (str) {
  //like N.D.A
  if (periodAcronym.test(str) === true) {
    return true;
  }
  //like 'F.'
  if (oneLetterAcronym.test(str) === true) {
    return true;
  }
  //like NDA
  if (noPeriodAcronym.test(str) === true) {
    return true;
  }
  return false;
};
module.exports = isAcronym;

},{}],24:[function(_dereq_,module,exports){
const noUmlaut = (str) => {
  // ä, ö and ü, ß
  str = str.replace(/ä/u, 'ae');
  str = str.replace(/ö/u, 'oe');
  str = str.replace(/ü/u, 'ue');
  str = str.replace(/ß/u, 'ss');
  return str;
};
module.exports = noUmlaut;

},{}],25:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../../paths').fns;
const colors = {
  'Person': '#6393b9',
  'Pronoun': '#81acce',
  'Noun': 'steelblue',
  'Verb': 'palevioletred',
  'Adverb': '#f39c73',
  'Adjective': '#b3d3c6',
  'Determiner': '#d3c0b3',
  'Preposition': '#9794a8',
  'Conjunction': '#c8c9cf',
  'Value': 'palegoldenrod',
  'Expression': '#b3d3c6'
};

//a nicer logger for the client-side
const clientSide = (t) => {
  let color = 'silver';
  let tags = Object.keys(t.tags);
  for(let i = 0; i < tags.length; i++) {
    if (colors[tags[i]]) {
      color = colors[tags[i]];
      break;
    }
  }
  let word = fns.leftPad(t.text, 12);
  word += ' ' + tags;
  console.log('%c ' + word, 'color: ' + color);
};
module.exports = clientSide;

},{"../../paths":33}],26:[function(_dereq_,module,exports){
'use strict';
const renderHtml = _dereq_('./renderHtml');
const fns = _dereq_('../../paths').fns;
const clientDebug = _dereq_('./client');

const serverDebug = function(t) {
  let tags = Object.keys(t.tags).map((tag) => {
    return fns.printTag(tag);
  }).join(', ');
  let word = t.text;
  word = '\'' + fns.yellow(word || '-') + '\'';
  let silent = '';
  if (t.silent_term) {
    silent = '[' + t.silent_term + ']';
  }
  word = fns.leftPad(word, 25);
  word += fns.leftPad(silent, 5);
  console.log('   ' + word + '   ' + '     - ' + tags);
};

const methods = {
  /** a pixel-perfect reproduction of the input, with whitespace preserved */
  text: function(r) {
    return r.whitespace.before + r._text + r.whitespace.after;
  },
  /** a lowercased, punctuation-cleaned, whitespace-trimmed version of the word */
  normal: function(r) {
    return r.normal;
  },
  /** even-more normalized than normal */
  root: function(r) {
    return r.root || r.normal;
  },
  /** the &encoded term in a span element, with POS as classNames */
  html: function(r) {
    return renderHtml(r);
  },
  /** a simplified response for Part-of-Speech tagging*/
  tags: function(r) {
    return {
      text: r.text,
      normal: r.normal,
      tags: Object.keys(r.tags)
    };
  },
  /** check-print information for the console */
  debug: function(t) {
    if (typeof window !== 'undefined') {
      clientDebug(t);
    } else {
      serverDebug(t);
    }
  }
};

const addMethods = (Term) => {
  //hook them into result.proto
  Term.prototype.out = function(fn) {
    if (!methods[fn]) {
      fn = 'text';
    }
    return methods[fn](this);
  };
  return Term;
};

module.exports = addMethods;

},{"../../paths":33,"./client":25,"./renderHtml":27}],27:[function(_dereq_,module,exports){
'use strict';
//turn xml special characters into apersand-encoding.
//i'm not sure this is perfectly safe.
const escapeHtml = (s) => {
  const HTML_CHAR_MAP = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    ' ': '&nbsp;'
  };
  return s.replace(/[<>&"' ]/g, function(ch) {
    return HTML_CHAR_MAP[ch];
  });
};

//remove html elements already in the text
//not tested!
//http://stackoverflow.com/questions/295566/sanitize-rewrite-html-on-the-client-side
const sanitize = (html) => {
  const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';
  const tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
  let oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
};

//turn the term into ~properly~ formatted html
const renderHtml = function(t) {
  let classes = Object.keys(t.tags).filter((tag) => tag !== 'Term');
  classes = classes.map(c => 'nl-' + c);
  classes = classes.join(' ');
  let text = sanitize(t.text);
  text = escapeHtml(text);
  let el = '<span class="' + classes + '">' + text + '</span>';
  return escapeHtml(t.whitespace.before) + el + escapeHtml(t.whitespace.after);
};

module.exports = renderHtml;

},{}],28:[function(_dereq_,module,exports){
'use strict';
const endPunct = /([a-z])([,:;\/.(\.\.\.)\!\?]+)$/i;
const addMethods = (Term) => {

  const methods = {
    /** the punctuation at the end of this term*/
    endPunctuation: function() {
      let m = this.text.match(endPunct);
      if (m) {
        const allowed = {
          ',': 'comma',
          ':': 'colon',
          ';': 'semicolon',
          '.': 'period',
          '...': 'elipses',
          '!': 'exclamation',
          '?': 'question'
        };
        if (allowed[m[2]] !== undefined) {
          return m[2];
        }
      }
      return null;
    },
    setPunctuation: function(punct) {
      this.killPunctuation();
      this.text += punct;
      return this;
    },

    /** check if the term ends with a comma */
    hasComma: function () {
      if (this.endPunctuation() === 'comma') {
        return true;
      }
      return false;
    },

    killPunctuation: function () {
      this.text = this._text.replace(endPunct, '$1');
      return this;
    },
  };
  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{}],29:[function(_dereq_,module,exports){
'use strict';
const path = _dereq_('../../paths');
const tagset = {} //path.tags;

//recursively-check compatibility of this tag and term
const canBe = function(term, tag) {
  //fail-fast
  if (tagset[tag] === undefined) {
    return true;
  }
  //loop through tag's contradictory tags
  let enemies = tagset[tag].enemy || [];
  for (let i = 0; i < enemies.length; i++) {
    if (term.tags[enemies[i]] === true) {
      return false;
    }
  }
  if (tagset[tag].is !== undefined) {
    return canBe(term, tagset[tag].is); //recursive
  }
  return true;
};

module.exports = canBe;

},{"../../paths":33}],30:[function(_dereq_,module,exports){
'use strict';
const setTag = _dereq_('./setTag');
const unTag = _dereq_('./unTag');
const canBe = _dereq_('./canBe');

//symbols used in sequential taggers which mean 'do nothing'
//.tag('#Person #Place . #City')
const ignore = {
  '.': true
};
const addMethods = (Term) => {

  const methods = {
    /** set the term as this part-of-speech */
    tag: function(tag, reason) {
      if (ignore[tag] !== true) {
        setTag(this, tag, reason);
      }
    },
    /** remove this part-of-speech from the term*/
    unTag: function(tag, reason) {
      if (ignore[tag] !== true) {
        unTag(this, tag, reason);
      }
    },
    /** is this tag compatible with this word */
    canBe: function (tag) {
      tag = tag || '';
      if (typeof tag === 'string') {
        //everything can be '.'
        if (ignore[tag] === true) {
          return true;
        }
        tag = tag.replace(/^#/, '');
      }
      return canBe(this, tag);
    }
  };

  //hook them into term.prototype
  Object.keys(methods).forEach((k) => {
    Term.prototype[k] = methods[k];
  });
  return Term;
};

module.exports = addMethods;

},{"./canBe":29,"./setTag":31,"./unTag":32}],31:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech
const path = _dereq_('../../paths');
const log = path.log;
const fns = path.fns;
const unTag = _dereq_('./unTag');
// const tagset = path.tags;
const tagset = {} //require('../../../tagset');

const putTag = (term, tag, reason) => {
  tag = tag.replace(/^#/, '');
  //already got this
  if (term.tags[tag] === true) {
    return;
  }
  term.tags[tag] = true;
  log.tag(term, tag, reason);

  //extra logic per-each POS
  if (tagset[tag]) {
    //drop any conflicting tags
    let enemies = tagset[tag].enemy;
    for (let i = 0; i < enemies.length; i++) {
      if (term.tags[enemies[i]] === true) {
        unTag(term, enemies[i], reason);
      }
    }
    //apply implicit tags
    if (tagset[tag].is) {
      tagset[tag].is.forEach((doAlso) => {
        if (term.tags[doAlso] !== true) {
          putTag(term, doAlso, ' --> ' + tag); //recursive
        }
      });
    }
  }
};

//give term this tag
const wrap = function(term, tag, reason) {
  if (!term || !tag) {
    return;
  }
  //handle multiple tags
  if (fns.isArray(tag)) {
    tag.forEach((t) => putTag(term, t, reason)); //recursive
    return;
  }
  putTag(term, tag, reason);
  //add 'extra' tag (for some special tags)
  if (tagset[tag] && tagset[tag].also !== undefined) {
    putTag(term, tagset[tag].also, reason);
  }
};

module.exports = wrap;

},{"../../paths":33,"./unTag":32}],32:[function(_dereq_,module,exports){
'use strict';
//set a term as a particular Part-of-speech
const path = _dereq_('../../paths');
const log = path.log;
const tagset = {} //path.tags;

//remove a tag from a term
const unTag = (term, tag, reason) => {
  if (term.tags[tag]) {
    log.unTag(term, tag, reason);
    delete term.tags[tag];

    //delete downstream tags too
    if (tagset[tag]) {
      let also = tagset[tag].is;
      for (let i = 0; i < also.length; i++) {
        unTag(term, also[i], ' - -   - ');
      }
    }
  }
};

const wrap = (term, tag, reason) => {
  if (!term || !tag) {
    return;
  }
  //support '*' flag - remove all-tags
  if (tag === '*') {
    term.tags = {};
    return;
  }
  //remove this tag
  unTag(term, tag, reason);
  return;
};
module.exports = wrap;

},{"../../paths":33}],33:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  log: _dereq_('../log')
};

},{"../fns":2,"../log":5}],34:[function(_dereq_,module,exports){
'use strict';
//punctuation regs-
const before = /^(\s|-+|\.\.+)+/;
const minusNumber = /^( *)-(\$|€|¥|£)?([0-9])/;
const after = /(\s+|-+|\.\.+)$/;

//seperate the 'meat' from the trailing/leading whitespace.
//works in concert with ./src/result/tokenize.js
const build_whitespace = (str) => {
  let whitespace = {
    before: '',
    after: ''
  };
  //get before punctuation/whitespace
  //mangle 'far - fetched', but don't mangle '-2'
  let m = str.match(minusNumber);
  if (m !== null) {
    whitespace.before = m[1];
    str = str.replace(/^ */, '');
  } else {
    m = str.match(before);
    if (m !== null) {
      whitespace.before = str.match(before)[0];
      str = str.replace(before, '');
    }
  }
  //get after punctuation/whitespace
  m = str.match(after);
  if (m !== null) {
    str = str.replace(after, '');
    whitespace.after = m[0];
  }
  return {
    whitespace: whitespace,
    text: str
  };
};
module.exports = build_whitespace;

},{}],35:[function(_dereq_,module,exports){
'use strict';
const Term = _dereq_('../term');
const hasHyphen = /^([a-z]+)(-)([a-z0-9].*)/i;
const wordlike = /\S/;

const notWord = {
  '-': true,
  '–': true,
  '--': true,
  '...': true,
};

//turn a string into an array of terms (naiive for now, lumped later)
const fromString = function (str) {
  let result = [];
  let arr = [];
  //start with a naiive split
  str = str || '';
  if (typeof str === 'number') {
    str = '' + str;
  }
  const firstSplit = str.split(/(\S+)/);
  for(let i = 0; i < firstSplit.length; i++) {
    const word = firstSplit[i];
    if (hasHyphen.test(word) === true) {
      //support multiple-hyphenated-terms
      const hyphens = word.split('-');
      for(let o = 0; o < hyphens.length; o++) {
        if (o === hyphens.length - 1) {
          arr.push(hyphens[o]);
        } else {
          arr.push(hyphens[o] + '-');
        }
      }
    } else {
      arr.push(word);
    }
  }
  //greedy merge whitespace+arr to the right
  let carry = '';
  for (let i = 0; i < arr.length; i++) {
    //if it's more than a whitespace
    if (wordlike.test(arr[i]) === true && notWord[arr[i]] === undefined) {
      result.push(carry + arr[i]);
      carry = '';
    } else {
      carry += arr[i];
    }
  }
  //handle last one
  if (carry && result.length > 0) {
    result[result.length - 1] += carry; //put it on the end
  }
  return result.map((t) => new Term(t));
};
module.exports = fromString;

},{"../term":19}],36:[function(_dereq_,module,exports){
'use strict';

//getters/setters for the Terms class
module.exports = {

  parent: {
    get: function() {
      return this.refText || this;
    },
    set: function(r) {
      this.refText = r;
      return this;
    }
  },

  parentTerms: {
    get: function() {
      return this.refTerms || this;
    },
    set: function(r) {
      this.refTerms = r;
      return this;
    }
  },

  dirty: {
    get: function() {
      for(let i = 0; i < this.terms.length; i++) {
        if (this.terms[i].dirty === true) {
          return true;
        }
      }
      return false;
    },
    set: function(dirt) {
      this.terms.forEach((t) => {
        t.dirty = dirt;
      });
    }
  },

  refTerms: {
    get: function() {
      return this._refTerms || this;
    },
    set: function(ts) {
      this._refTerms = ts;
      return this;
    }
  },
  found: {
    get: function() {
      return this.terms.length > 0;
    }
  },
  length: {
    get: function() {
      return this.terms.length;
    }
  },
  isA: {
    get: function() {
      return 'Terms';
    }
  },
  whitespace: {
    get: function() {
      return {
        before: (str) => {
          this.firstTerm().whitespace.before = str;
          return this;
        },
        after: (str) => {
          this.lastTerm().whitespace.after = str;
          return this;
        },
      };
    }
  },


};

},{}],37:[function(_dereq_,module,exports){
'use strict';
const build = _dereq_('./build');
const getters = _dereq_('./getters');

//Terms is an array of Term objects, and methods that wrap around them
const Terms = function(arr, lexicon, refText, refTerms) {
  this.terms = arr;
  this.lexicon = lexicon;
  this.refText = refText;
  this._refTerms = refTerms;
  this.count = undefined;
  this.get = (n) => {
    return this.terms[n];
  };
  //apply getters
  let keys = Object.keys(getters);
  for (let i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], getters[keys[i]]);
  }
};

Terms.prototype.tagger = function() {
  return this
};

_dereq_('./methods/misc')(Terms);
_dereq_('./methods/out')(Terms);
_dereq_('./methods/loops')(Terms);

Terms.fromString = function(str, lexicon) {
  let termArr = build(str);
  let ts = new Terms(termArr, lexicon, null);
  //give each term a reference to this ts
  ts.terms.forEach((t) => {
    t.parentTerms = ts;
  });
  return ts;
};
module.exports = Terms;

},{"./build":35,"./getters":36,"./methods/loops":38,"./methods/misc":39,"./methods/out":40}],38:[function(_dereq_,module,exports){
'use strict';
//these methods are simply term-methods called in a loop

const addMethods = (Terms) => {

  const foreach = [
    ['tag'],
    ['unTag'],
    ['canBe'],
    ['toUpperCase', 'UpperCase'],
    ['toLowerCase'],
    ['toTitleCase', 'TitleCase'],
  // ['toCamelCase', 'CamelCase'],
  ];

  foreach.forEach((arr) => {
    let k = arr[0];
    let tag = arr[1];
    let myFn = function () {
      let args = arguments;
      this.terms.forEach((t) => {
        t[k].apply(t, args);
      });
      if (tag) {
        this.tag(tag, k);
      }
      return this;
    };
    Terms.prototype[k] = myFn;
  });
  return Terms;
};

module.exports = addMethods;

},{}],39:[function(_dereq_,module,exports){
'use strict';

const miscMethods = (Terms) => {

  const methods = {

    firstTerm: function() {
      return this.terms[0];
    },
    lastTerm: function() {
      return this.terms[this.terms.length - 1];
    },
    all: function() {
      return this.parent;
    },
    data: function() {
      return {
        text: this.out('text'),
        normal: this.out('normal'),
      };
    },
    term: function (n) {
      return this.terms[n];
    },
    first: function () {
      let t = this.terms[0];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    last: function () {
      let t = this.terms[this.terms.length - 1];
      return new Terms([t], this.lexicon, this.refText, this.refTerms);
    },
    slice: function (start, end) {
      let terms = this.terms.slice(start, end);
      return new Terms(terms, this.lexicon, this.refText, this.refTerms);
    },
    endPunctuation: function () {
      return this.last().terms[0].endPunctuation();
    },
    index: function() {
      let parent = this.parentTerms;
      let first = this.terms[0];
      if (!parent || !first) {
        return null; //maybe..
      }
      for(let i = 0; i < parent.terms.length; i++) {
        if (first === parent.terms[i]) {
          return i;
        }
      }
      return null;
    },
    termIndex: function() {
      let first = this.terms[0];
      let ref = this.refText || this;
      if (!ref || !first) {
        return null; //maybe..
      }
      let n = 0;
      for(let i = 0; i < ref.list.length; i++) {
        let ts = ref.list[i];
        for(let o = 0; o < ts.terms.length; o++) {
          if (ts.terms[o] === first) {
            return n;
          }
          n += 1;
        }
      }
      return n;
    },
    //number of characters in this match
    chars: function() {
      return this.terms.reduce((i, t) => {
        i += t.whitespace.before.length;
        i += t.text.length;
        i += t.whitespace.after.length;
        return i;
      }, 0);
    },
    //just .length
    wordCount: function() {
      return this.terms.length;
    },

    //this has term-order logic, so has to be here
    toCamelCase: function() {
      this.toTitleCase();
      this.terms.forEach((t, i) => {
        if (i !== 0) {
          t.whitespace.before = '';
        }
        t.whitespace.after = '';
      });
      this.tag('#CamelCase', 'toCamelCase');
      return this;
    }
  };

  //hook them into result.proto
  Object.keys(methods).forEach((k) => {
    Terms.prototype[k] = methods[k];
  });
  return Terms;
};

module.exports = miscMethods;

},{}],40:[function(_dereq_,module,exports){
'use strict';
const fns = _dereq_('../paths').fns;

const methods = {
  text: function (ts) {
    return ts.terms.reduce((str, t) => {
      str += t.out('text');
      return str;
    }, '');
  },


  normal: function (ts) {
    let terms = ts.terms.filter((t) => {
      return t.text;
    });
    terms = terms.map((t) => {
      return t.normal; //+ punct;
    });
    return terms.join(' ');
  },

  grid: function(ts) {
    var str = '  ';
    str += ts.terms.reduce((s, t) => {
      s += fns.leftPad(t.text, 11);
      return s;
    }, '');
    return str + '\n\n';
  },

  color: function(ts) {
    return ts.terms.reduce((s, t) => {
      s += fns.printTerm(t);
      return s;
    }, '');
  },
  csv: function(ts) {
    return ts.terms.map((t) => t.normal.replace(/,/g, '')).join(',');
  },

  newlines: function (ts) {
    return ts.terms.reduce((str, t) => {
      str += t.out('text').replace(/\n/g, ' ');
      return str;
    }, '').replace(/^\s/, '');
  },
  /** no punctuation, fancy business **/
  root: function (ts) {
    return ts.terms.filter((t) => t.text).map((t) => t.root).join(' ').toLowerCase();
  },

  html: function (ts) {
    return ts.terms.map((t) => t.render.html()).join(' ');
  },
  debug: function(ts) {
    ts.terms.forEach((t) => {
      t.out('debug');
    });
  }
};
methods.plaintext = methods.text;
methods.normalize = methods.normal;
methods.normalized = methods.normal;
methods.colors = methods.color;
methods.tags = methods.terms;


const renderMethods = (Terms) => {
  Terms.prototype.out = function(str) {
    if (methods[str]) {
      return methods[str](this);
    }
    return methods.text(this);
  };
  //check method
  Terms.prototype.debug = function () {
    return methods.debug(this);
  };
  return Terms;
};

module.exports = renderMethods;

},{"../paths":41}],41:[function(_dereq_,module,exports){
module.exports = {
  fns: _dereq_('../fns'),
  Term: _dereq_('../term')
};

},{"../fns":2,"../term":19}]},{},[3])(3)
});