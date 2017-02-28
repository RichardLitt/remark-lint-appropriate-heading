const test = require('tape')
const remark = require('remark')
const lint = require('remark-lint')
const vfile = require('vfile')
const appropriateHeading = require('./')

const processorWithOptions = (options) => remark().use(lint).use(appropriateHeading, options)
const processor = processorWithOptions()

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

test('remark-lint-appropriate-heading', (t) => {
  var fp = '~/heading/readme.md'
  var mwfp = '~/multi-word-heading/readme.md'

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: ok})).messages.map(String),
    [],
    'should work on valid fixtures'
  )

  t.deepEqual(
    processorWithOptions('slug').processSync(vfile({path: mwfp, contents: multiWordHeading})).messages.map(String),
    [],
    'should work on valid fixtures'
  )

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: invalidHeading})).messages.map(String),
    ['~/heading/readme.md:1:1-1:10: Heading \'invalid\' is not the directory name'],
    'should warn for invalid headings (mismatch in directory and heading)'
  )

  t.deepEqual(
    processor.processSync(vfile({path: mwfp, contents: multiWordHeading})).messages.map(String),
    ['~/multi-word-heading/readme.md:1:1-1:21: Heading \'multi-word heading\' is not the directory name'],
    'should warn for invalid headings (mismatch in directory and heading)'
  )

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: missingHeading})).messages.map(String),
    ['~/heading/readme.md:1:1-1:10: Document must start with a heading'],
    'should warn if the first thing is not a heading'
  )

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: tooLowHeading})).messages.map(String),
    ['~/heading/readme.md:2:1-2:10: Heading does not start at beginning of document'],
    'should warn if the first heading is not on the first line'
  )

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: empty})).messages.map(String),
    ['~/heading/readme.md:1:1-1:1: Document must start with a heading'],
    'should warn without heading'
  )

  t.end()
})
