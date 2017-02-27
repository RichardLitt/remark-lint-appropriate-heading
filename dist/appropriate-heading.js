'use strict';

var rule = require('unified-lint-rule');
var is = require('unist-util-is');
var position = require('unist-util-position');
var toString = require('mdast-util-to-string');
var sep = require('path').sep;

function appropriateHeading(tree, file, preferred) {
  var dirnames = (file.dirname === '.' ? file.cwd : file.dirname).split(sep);
  var expected = dirnames[dirnames.length - 1].toLowerCase();
  var head = tree.children[0];
  var actual = void 0;

  if (!is('heading', head)) {
    file.message('Document must start with a heading', head || tree);
  } else if (position.start(head).line !== 1) {
    file.message('Heading does not start at beginning of document', head);
  } else {
    actual = toString(head).toLowerCase();

    if (actual !== expected) {
      file.warn('Heading \'' + actual + '\' is not the directory name', head);
    }
  }
}

module.exports = rule('remark-lint:appropriate-heading', appropriateHeading);