require('shelljs/global');
const assert = require('assert');
const chalk = require('chalk');

console.log(chalk.green('\n==sanity-test builds=='));
//sanity-test the builds
var libs = [
  require('../../builds/nlp-core.js'),
  require('../../builds/nlp-core.min.js'),
  require('../../builds/nlp-core.es6.min.js'),
];
libs.forEach((nlp, i) => {
  console.log(chalk.green('  - - #' + i));
  const r = nlp('Ich, ich bin dann König. Und du, du Königin');
  assert(r.length === 2);
});
console.log(chalk.green('\n  👍'));
