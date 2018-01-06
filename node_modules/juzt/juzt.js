/*
MIT License

Copyright (c) 2018 jrvieira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

let failed = false
let testresults = []

module.exports.test = function (description, result) {
	// validate test arguments
	if (typeof description != 'string') throw new TypeError('test description is not a string')
	if (typeof result != 'boolean') throw new TypeError('test result is not a boolean')

	failed = failed || !result
	testresults.push([result ? '\x1b[32m'+'v'+'\x1b[0m' : '\x1b[31m'+'x'+'\x1b[0m' , '\x1b[2m'+description+'\x1b[0m'])

	return result
}

let over = false

module.exports.over = function () {

	if (over === false) {
		if (testresults.length === 0) {
			console.log('\x1b[2m'+'no tests to perform'+'\x1b[0m', '\n')
		} else {
			for (testresult of testresults) {
				console.log(...testresult)
			}
			console.log('\n', failed ? '\x1b[31m'+'test failed'+'\x1b[0m' : '\x1b[32m'+'all tests passed'+'\x1b[0m', '\n')
		}
	}
	
	over = true

	return process.exitCode = failed
}
