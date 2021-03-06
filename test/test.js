// import juzt from 'juzt'
const juzt = require('juzt')
// import chain from 'chainchainchain'
const chain = require('../lib/chainchainchain')


let xo = { x: 'x' }
let yo = { y: 'y' }
let zo = { z: 'z' }
let fo = { f () { return this.x + this.y + this.z } }
let ch = chain(xo, yo, zo, fo)

juzt.test('get chained properties', ch.x + ch.y + ch.z === 'xyz')
juzt.test('get chained method', ch.f() === 'xyz')

xo.x = yo.y = zo.z = 'chain'
juzt.test('get updated chained properties', ch.x + ch.y + ch.z === 'chainchainchain')
juzt.test('get updated chained method', ch.f() === 'chainchainchain')

// manupulation methods

let madd = {m: 'add'}
juzt.test('chain.add returns array', chain.add(ch, madd) instanceof Array)
juzt.test('with added object last', chain.arr(ch)[chain.arr(ch).length - 1] === madd)
juzt.test('get added object property', ch.m === 'add')

let mpre = {m: 'pre'}
juzt.test('chain.pre returns array', chain.pre(ch, mpre) instanceof Array)
juzt.test('with inned object first', chain.arr(ch)[1] === mpre)
juzt.test('get inned object property', ch.m === 'pre')

let mrep = {x: 'rep'}
juzt.test('chain.rep returns array', chain.rep(ch, xo, mrep) instanceof Array)
juzt.test('without replaced object', chain.arr(ch).includes(xo) === false)
juzt.test('get new object property', ch.x === 'rep')

let mrem = chain.rem(ch, yo)
juzt.test('chain.rem returns array', mrem instanceof Array)
juzt.test('without removed object', mrem.includes(yo) === false)
juzt.test('get removed object property', ch.y === undefined)

let mpop = chain.pop(ch)
juzt.test('chain.pop returns popped object', mpop === madd)
juzt.test('removed from chain', chain.arr(ch).includes(madd) === false)
juzt.test('get popped object property', chain.raw(ch, 'm').includes('add') === false)

let mshift = chain.shift(ch)
juzt.test('chain.shift returns shifted object', mshift === mpre)
juzt.test('removed from chain', chain.arr(ch).includes(mpre) === false)
juzt.test('get shifted object property', chain.raw(ch, 'm').includes('pre') === false)

let mrol = chain.rol(ch, -1)
juzt.test('chain.rol returns array', mrol instanceof Array)
juzt.test('with eldest made youngest', chain.arr(ch)[1] === fo)

let p = Symbol('p')
ch.p = p
juzt.test('property defined on origin', ch.p === p && chain.origin(ch).p === p)
delete ch.p
juzt.test('property deleted on origin', ch.p === undefined && chain.origin(ch).p === undefined)

chain.set.setchained = true
juzt.test('-- setchained set to true', chain.set.setchained)

fo.p = null
zo.p = null
ch.p = p
console.log(chain.arr(ch))
juzt.test('property defined on owners', fo.p === p && zo.p === p)
juzt.test('and on owners only', chain.origin(ch).p === undefined && xo.p === undefined)
delete ch.p
juzt.test('property deleted from owners', fo.p === undefined && zo.p === undefined)
juzt.test('property deleted from chain', ch.p === undefined)

chain.set.setchained = false
juzt.test('-- setchained reset to false', chain.set.setchained === false)

// evaluation methods

juzt.test('ch is chain', chain.is(ch))
juzt.test('{} is not chain', chain.is({}) === false)

ch.o = 'origin'
juzt.test('chain.origin returns origin object', chain.origin(ch).o === 'origin')

let originerr = false
try { chain.origin({}) } catch (err) { originerr = err }
if (juzt.test('chain.origin throws an error when argument is not a chain object', originerr instanceof Error)) {
	juzt.test('error is a TypeError', originerr.name === 'TypeError')
}

let marr = chain.arr(ch)
juzt.test('chain.arr returns array', marr instanceof Array)
juzt.test('with correct length', marr.length === 4)
juzt.test('and origin object', marr[0] === chain.origin(ch))

let mrawx = chain.raw(ch, 'x')
let mrawz = chain.raw(ch, 'z')
let mrawf = chain.raw(ch, 'f')
juzt.test('chain.raw should return an array when no callback is passed', mrawx instanceof Array)
juzt.test('ordered', mrawx[2] === 'rep')
juzt.test('chain.raw should return an array when no callback is passed', mrawz instanceof Array)
juzt.test('ordered', mrawz[3] === 'chain')
juzt.test('chain.raw should return an array when no callback is passed', mrawf instanceof Array)
juzt.test('ordered', typeof mrawf[1] === 'function')


juzt.test('property is same', mrawz[3] === zo.z) // cant be same, binding makes it a copy
let mrawzcallback = chain.raw(ch, 'z', function (raw) {
	return raw
})
let zi = 0
for (let p of mrawzcallback) {
	juzt.test('raw value is right', mrawzcallback[zi] === chain.raw(ch, 'z')[zi]) // idem
	zi ++
}


juzt.test('function is same', mrawf[1] === fo.f) // cant be same, binding makes it a copy
let mrawfcallback = chain.raw(ch, 'f', function (raw) {
	return raw
})
let fi = 0
for (let p of mrawfcallback) {
	juzt.test('raw value is right', p === chain.raw(ch, 'f')[fi]) // idem
	fi ++
}

juzt.test('ordered', ch.f() === 'repundefinedchain')

chain.set.owncontext = true

juzt.test('ordered', isNaN(ch.f()))

juzt.over()
