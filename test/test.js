// import juzt from 'juzt'
const juzt = require('./juzt')
// import chain from 'chainchainchain'
const chain = require('./../chainchainchain')


let xo = { x: 'x' }
let yo = { y: 'y' }
let zo = { z: 'z' }
let fo = { f () { return this.x + this.y + this.z } }
let ch = chain(xo, yo, zo, fo)

juzt.test('get chained properties', ch.x + ch.y + ch.z == 'xyz')
juzt.test('get chained method', ch.f() == 'xyz')

xo.x = yo.y = zo.z = 'chain'

juzt.test('get updated chained properties', ch.x + ch.y + ch.z == 'chainchainchain')
juzt.test('get updated chained method', ch.f() == 'chainchainchain')


juzt.over()