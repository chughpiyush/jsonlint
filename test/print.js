/* eslint-disable node/no-deprecated-api */
/* globals it */

var assert = require('assert')
var exported = require('../lib/printer')
var print = exported.print

function addTest (description, test) {
  if (typeof describe === 'function') {
    it(description, test)
  } else {
    exports['test print: ' + description] = test
  }
}

var tokens = [ // '/* start */{ "a":1, // c\n"0b": [ 2,3 ]}'
  { type: 'comment', raw: '/* start */' },
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'whitespace', raw: ' ' },
  { type: 'literal', raw: '"a"', value: 'a' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'literal', raw: '1', value: 1 },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'whitespace', raw: ' ' },
  { type: 'comment', raw: '// c' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: '"0b"', value: '0b' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: '[', value: '[' },
  { type: 'whitespace', raw: ' ' },
  { type: 'literal', raw: '2', value: 2 },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'literal', raw: '3', value: 3 },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: ']', value: ']' },
  { type: 'symbol', raw: '}', value: '}' }
]

addTest('concatenate tokens', function () {
  var output = print(tokens)
  assert.equal(output, '/* start */{ "a":1, // c\n"0b": [ 2,3 ]}')
})

addTest('omit whitespace', function () {
  var output = print(tokens, {})
  assert.equal(output, '/* start */{"a":1,/* c */"0b":[2,3]}')
})

addTest('introduce line breaks', function () {
  var output = print(tokens, { indent: '' })
  assert.equal(output, '/* start */\n{\n"a": 1, // c\n"0b": [\n2,\n3\n]\n}')
})

addTest('apply indent', function () {
  var output = print(tokens, { indent: '  ' })
  assert.equal(output, '/* start */\n{\n  "a": 1, // c\n  "0b": [\n    2,\n    3\n  ]\n}')
})

addTest('omit comments', function () {
  var output = print(tokens, { pruneComments: true })
  assert.equal(output, '{"a":1,"0b":[2,3]}')
})

addTest('strip quotes from object keys', function () {
  var output = print(tokens, { stripObjectKeys: true })
  assert.equal(output, '/* start */{a:1,/* c */"0b":[2,3]}')
})

addTest('keep comment locations', function () {
  // `// test
  // {// test
  // // test
  // a:/* test */1,// test
  // b:2// test
  // // test
  // }// test
  // // test`
  var tokens = [
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'literal', raw: 'a', value: 'a' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'comment', raw: '/* test */' },
    { type: 'literal', raw: '1', value: 1 },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'literal', raw: 'b', value: 'b' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'literal', raw: '2', value: 2 },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'comment', raw: '// test' },
    { type: 'whitespace', raw: '\n' },
    { type: 'comment', raw: '// test' }
  ]
  var output = print(tokens, { indent: '  ' })
  assert.equal(output, '// test\n{ // test\n  // test\n  a: /* test */ 1, // test\n  b: 2 // test\n  // test\n} // test\n// test')
  // `// test
  // { // test
  //   // test
  //   a: /* test */ 1, // test
  //   b: 2 // test
  //   // test
  // } // test
  // // test`
})

if (require.main === module) { require('test').run(exports) }