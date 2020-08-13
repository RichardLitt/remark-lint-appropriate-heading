const test = require('tape')
const remark = require('remark')
const lint = require('remark-lint')
const vfile = require('vfile')
const appropriateHeading = require('./')
const path = require('path')

/**
 * Creates file based on given options, runs remark-lint and returns resulting messages.
 *
 * @function
 * @param {VFileOptions} file
 * @param {string} [options]
 * @returns {string[]}
 */
const processFile = (file, options) =>
  remark().use(lint).use(appropriateHeading, options)
    .processSync(vfile(file))
    .messages.map(String)

const ok = `# Heading
`

const invalidHeading = `# Invalid
`

const missingHeading = `Paragraph
`

const tooLowHeading = `
# Heading
`

const empty = ``

const multiWordHeading = `# Multi-Word Heading
`

const disabledHeading = `<!--lint disable appropriate-heading-->
Paragraph
`

const allowHtmlComment = `<!-- some comment-->
# Heading
`

const allowHtmlCommentAndOneNewLine = `<!-- some comment-->

# Heading
`

const tooManyNewLinesAfterHtmlComment = `<!-- some comment-->


# Heading
`

test('remark-lint-appropriate-heading', (t) => {
  var fp = path.join('~', 'heading', 'readme.md')
  var mwfp = path.join('~', 'multi-word-heading', 'readme.md')

  t.deepEqual(
    processFile({ path: fp, contents: ok }),
    [],
    'should work on valid fixtures'
  )

  t.deepEqual(
    processFile({ path: mwfp, contents: multiWordHeading }, 'slug'),
    [],
    'should work on valid fixtures'
  )

  t.deepEqual(
    processFile({ path: fp, contents: invalidHeading }),
    [`${fp}:1:1-1:10: Heading 'invalid' is not the directory name`],
    'should warn for invalid headings (mismatch in directory and heading)'
  )

  t.deepEqual(
    processFile({ path: mwfp, contents: multiWordHeading }),
    [`${mwfp}:1:1-1:21: Heading 'multi-word heading' is not the directory name`],
    'should warn for invalid headings (mismatch in directory and heading)'
  )

  t.deepEqual(
    processFile({ path: fp, contents: missingHeading }),
    [`${fp}:1:1-1:10: Document must start with a heading`],
    'should warn if the first thing is not a heading'
  )

  t.deepEqual(
    processFile({ path: fp, contents: tooLowHeading }),
    [`${fp}:2:1-2:10: Heading does not start at beginning of document`],
    'should warn if the first heading is not on the first line'
  )

  t.deepEqual(
    processFile({ path: fp, contents: empty }),
    [`${fp}:1:1-1:1: Document must start with a heading`],
    'should warn without heading'
  )

  t.deepEqual(
    processFile({ path: fp, contents: disabledHeading }),
    [],
    'should work when disabling rule'
  )

  t.deepEqual(
    processFile({ path: fp, contents: allowHtmlComment }),
    [],
    'should work with html comment'
  )

  t.deepEqual(
    processFile({ path: fp, contents: allowHtmlCommentAndOneNewLine }),
    [],
    'should work with html comment'
  )

  t.deepEqual(
    processFile({ path: fp, contents: tooManyNewLinesAfterHtmlComment }),
    [`${fp}:4:1-4:10: Heading does not start at beginning of document`],
    'should warn if too much newlines after html comment'
  )

  t.end()
})
