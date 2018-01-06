// import juzt from 'juzt'
let juzt = require('./../juzt')

function reload (module) {
	delete require.cache[require.resolve(module)]
	return require(module)
}

let tests = {
	pass: [],
	fail: [],
	error: []
}

// these tests will pass:

let a = 1
let b = 2
tests.pass.push(
	juzt.test('sum of a and b is 3', a + b === 3),
	juzt.test('this test passes', true),
	juzt.test('', true),
	juzt.test('boolean expression', !!a),
	juzt.test('boolean expression', !!'test')
)

let e = false
try { throwanerror() } catch (err) { e = err }
if (tests.pass.push(juzt.test('this should throw an error', e instanceof Error))) {
	tests.pass.push(
		juzt.test('with the correct type and message', e.name === 'ReferenceError' && e.message === 'throwanerror is not defined')
	)
}

// these tests will fail:

b = 1
tests.fail.push(
	juzt.test('sum of a and b is 3', a + b === 3),
	juzt.test('evaluates to false', false),
	juzt.test('evaluates to false', !b),
	juzt.test('evaluates to false', !'test')
)

let ee = false
try { a + b } catch (err) { ee = err }
tests.fail.push(
	juzt.test('is this an error? (no! this test will fail)', ee instanceof Error)
)

// these tests will throw an error:

tests.error.push(
	(function () { let r; try { juzt.test('not a boolean', a) } catch (err) { r = err } finally { return r } })(),
	(function () { let r; try { juzt.test('not a boolean', 1) } catch (err) { r = err } finally { return r } })(),
	(function () { let r; try { juzt.test('not a boolean', 0) } catch (err) { r = err } finally { return r } })(),
	(function () { let r; try { juzt.test(3, true) } catch (err) { r = err } finally { return r } })(),
	(function () { let r; try { juzt.test(true) } catch (err) { r = err } finally { return r } })(),
	(function () { let r; try { juzt.test() } catch (err) { r = err } finally { return r } })()
)

juzt = reload('./../juzt')

juzt.test('all passing tests passed', tests.pass.every(result => result === true))
juzt.test('all failing tests failed', tests.fail.every(result => result === false))
juzt.test('all error tests errored', tests.error.every(result => result instanceof Error))

// end testing

juzt.over()