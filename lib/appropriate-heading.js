const rule = require('unified-lint-rule')
const is = require('unist-util-is')
const position = require('unist-util-position')
const toString = require('mdast-util-to-string')
const sep = require('path').sep

function appropriateHeading (tree, file, preferred) {
  const dirnames = (file.dirname === '.' ? file.cwd : file.dirname).split(sep)
  const expected = dirnames[dirnames.length - 1].toLowerCase()
  const head = tree.children[0]
  let actual

  if (!is('heading', head)) {
    file.message('Document must start with a heading', head || tree)
  } else if (position.start(head).line !== 1) {
    file.message('Heading does not start at beginning of document', head)
  } else {
    actual = toString(head).toLowerCase()

    if (actual !== expected) {
      file.warn(`Heading '${actual}' is not the directory name`, head)
    }
  }
}

module.exports = rule('remark-lint:appropriate-heading', appropriateHeading)
