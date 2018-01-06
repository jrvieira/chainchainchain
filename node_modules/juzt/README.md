# juzt
Minimal .js unit testing


## Installation

```shell
$ npm install juzt
```


## Usage

**juzt** tests only take two arguments: a description string and a boolean expression that will fail the test if it evaluates to false.

```javascript
const juzt = require('juzt')

// these tests will pass:

let a = 1
let b = 2
juzt.test('sum of a and b is 3', a + b === 3)
juzt.test('this test passes', true)
juzt.test('', true)
juzt.test('boolean expression', !!a)
juzt.test('boolean expression', !!'test')

let e = false
try { throwanerror() } catch (err) { e = err }
if ( juzt.test('this should be an error', e instanceof Error) ) {
	juzt.test('with the correct type and message', e.name === 'ReferenceError' && e.message === 'throwanerror is not defined')
}

// these tests will fail:

b = 1
juzt.test('sum of a and b is 3', a + b === 3)
juzt.test('evaluates to false', false)
juzt.test('evaluates to false', !b)
juzt.test('evaluates to false', !'test')

let ee = false
try { a + b } catch (err) { ee = err }
juzt.test('is this an error? (no! this test will fail)', ee instanceof Error)

// these tests will throw an error:

juzt.test('not a boolean', a)
juzt.test('not a boolean', 1)
juzt.test('not a boolean', 0)
juzt.test(3, true)
juzt.test(true)
juzt.test()

// end testing

juzt.over()
```

Run
```shell
node yourtest.js
```

Useful for testing modules with [`npm test`](https://docs.npmjs.com/cli/test)

###### Licensed under MIT
