const test = require('tape')
const remark = require('remark')
const lint = require('remark-lint')
const vfile = require('vfile')
const appropriateHeading = require('./')

const processor = remark().use(lint).use(appropriateHeading)

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

test('remark-lint-appropriate-heading', (t) => {
  var fp = '~/heading/readme.md'

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: ok})).messages.map(String),
    [],
    'should work on valid fixtures'
  )

  t.deepEqual(
    processor.processSync(vfile({path: fp, contents: invalidHeading})).messages.map(String),
    ['~/heading/readme.md:1:1-1:10: Heading \'invalid\' is not the directory name'],
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
