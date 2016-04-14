const visit = require('unist-util-visit')
const sep = require('path').sep
const last = require('lodash').last

function appropriateHeading (ast, file, preferred, done) {
  visit(ast, (node, index, parent) => {
    const headingText = (file.directory && file.directory !== '.') ? last(file.directory.split(sep)) : last(process.cwd().split(sep))

    if (node.type === 'root') {
      if (node.children[0].type !== 'heading') {
        file.warn('Document must start with a heading')
      } else {
        if (
          (node.position.start.line !== 1) ||
          (node.position.start.column !== 1)
        ) {
          file.warn('Heading does not start at beginning of document')
        }

        if (
          node.children[0].children[0] &&
          (node.children[0].children[0].type === 'text') &&
          (node.children[0].children[0].value !== headingText)
        ) {
          file.warn(`Heading '${node.children[0].children[0].value}' is not the directory name`)
        }
      }
    }
  })

  done()
}

module.exports = {
  'appropriate-heading': appropriateHeading
}
