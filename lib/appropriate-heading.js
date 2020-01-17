const rule = require('unified-lint-rule')
const is = require('unist-util-is')
const position = require('unist-util-position')
const toString = require('mdast-util-to-string')
const sep = require('path').sep
const GithubSlugger = require('github-slugger')
const slugger = new GithubSlugger()

const COMMENT = /<!--[\s\S]*-->/gm

function match (directory, title, mode) {
  if (mode === 'exact') {
    return directory === title
  }

  return directory === slugger.slug(title)
}

function matchNonCommentMarker (node) {
  if (!node || node.type !== 'html') {
    return true
  }

  return !node.value.match(COMMENT)
}

function startsAtBeginningOfDocument (tree, hasCommentMarker, firstNonCommentMarkerNode, firstNonCommentMarkerIndex) {
  if (hasCommentMarker) {
    // There should be maximum one line between the first non-comment marker
    // and the preceeding comment marker. We allow one line since remark introduces
    // a newline between comment and markup when auto-formating markdown.
    const firstLineforMarkup = position.start(firstNonCommentMarkerNode).line
    const lastLineForComment = position.end(tree.children[firstNonCommentMarkerIndex - 1]).line
    return firstLineforMarkup - lastLineForComment <= 2
  }

  // Otherwise marker should be on first line.
  return position.start(firstNonCommentMarkerNode).line === 1
}

function appropriateHeading (tree, file, preferred) {
  const dirnames = (file.dirname === '.' ? file.cwd : file.dirname).split(sep)
  const expected = dirnames[dirnames.length - 1].toLowerCase()
  const firstNonCommentMarkerIndex = tree.children.findIndex(matchNonCommentMarker)
  const hasCommentMarker = firstNonCommentMarkerIndex > 0
  const firstNonCommentMarkerNode = tree.children[hasCommentMarker ? firstNonCommentMarkerIndex : 0]

  if (!is('heading', firstNonCommentMarkerNode)) {
    file.message('Document must start with a heading', firstNonCommentMarkerNode || tree)
  } else if (!startsAtBeginningOfDocument(tree, hasCommentMarker, firstNonCommentMarkerNode, firstNonCommentMarkerIndex)) {
    file.message('Heading does not start at beginning of document', firstNonCommentMarkerNode)
  } else {
    const actual = toString(firstNonCommentMarkerNode).toLowerCase()

    if (!match(expected, actual, preferred || 'exact')) {
      file.message(`Heading '${actual}' is not the directory name`, firstNonCommentMarkerNode)
    }
  }
}

module.exports = rule('remark-lint:appropriate-heading', appropriateHeading)
