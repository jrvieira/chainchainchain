// import chain from 'chainchainchain'
const chain = require('./chainchainchain.js')

let test = []

let xo = { x: 'x' }
let yo = { y: 'y' }
let zo = { z: 'z' }
let fo = { f () { return this.x + this.y + this.z } }
let ch = chain(xo, yo, zo, fo)
 
test.push(
	ch.x + ch.y + ch.z == 'xyz'
)

test.push(
	ch.f() == 'xyz'
)

xo.x = yo.y = zo.z = 'chain'

test.push(
	ch.x + ch.y + ch.z == 'chainchainchain'
)

test.push(
	ch.f() == 'chainchainchain' 
)

if (test.includes(false)) throw new Error('test failed')
console.log('test passed\n')