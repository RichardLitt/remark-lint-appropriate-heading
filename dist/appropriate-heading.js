'use strict';

var rule = require('unified-lint-rule');
var is = require('unist-util-is');
var position = require('unist-util-position');
var toString = require('mdast-util-to-string');
var sep = require('path').sep;
var GithubSlugger = require('github-slugger');
var slugger = new GithubSlugger();

var COMMENT = /<!--[\s\S]*-->/gm;

function match(directory, title, mode) {
  if (mode === 'exact') {
    return directory === title;
  }

  return directory === slugger.slug(title);
}

function matchNonCommentMarker(node) {
  if (!node || node.type !== 'html') {
    return true;
  }

  return !node.value.match(COMMENT);
}

function startsAtBeginningOfDocument(tree, hasCommentMarker, firstNonCommentMarkerNode, firstNonCommentMarkerIndex) {
  if (hasCommentMarker) {
    // There should be maximum onle line between the first non-comment marker
    // and the preceeding comment marker. We allow one line since remark introduces
    // a newline between comment and markup when auto-formating markdown.
    var firstLineforMarkup = position.start(firstNonCommentMarkerNode).line;
    var lastLineForComment = position.end(tree.children[firstNonCommentMarkerIndex - 1]).line;
    return firstLineforMarkup - lastLineForComment <= 2;
  }

  // Otherwise marker should be on first line.
  return position.start(firstNonCommentMarkerNode).line === 1;
}

function appropriateHeading(tree, file, preferred) {
  var dirnames = (file.dirname === '.' ? file.cwd : file.dirname).split(sep);
  var expected = dirnames[dirnames.length - 1].toLowerCase();
  var firstNonCommentMarkerIndex = tree.children.findIndex(matchNonCommentMarker);
  var hasCommentMarker = firstNonCommentMarkerIndex > 0;
  var firstNonCommentMarkerNode = tree.children[hasCommentMarker ? firstNonCommentMarkerIndex : 0];

  if (!is('heading', firstNonCommentMarkerNode)) {
    file.message('Document must start with a heading', firstNonCommentMarkerNode || tree);
  } else if (!startsAtBeginningOfDocument(tree, hasCommentMarker, firstNonCommentMarkerNode, firstNonCommentMarkerIndex)) {
    file.message('Heading does not start at beginning of document', firstNonCommentMarkerNode);
  } else {
    var actual = toString(firstNonCommentMarkerNode).toLowerCase();

    if (!match(expected, actual, preferred || 'exact')) {
      file.warn('Heading \'' + actual + '\' is not the directory name', firstNonCommentMarkerNode);
    }
  }
}

module.exports = rule('remark-lint:appropriate-heading', appropriateHeading);