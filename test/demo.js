const chain = require('../lib/chainchainchain')
const juzt = require('juzt')

function reload (module) {
	delete require.cache[require.resolve(module)]
	return require(module)
}

// Basic evaluation

let being = { is: 'being' }, human = { is: 'human' }, robot = { is: 'robot' }, cop = { is: 'cop' }, doc = { is: 'doc' }

let alex = chain(cop, robot)

juzt.test('set alex.name as "alex"', (alex.name = 'alex') === 'alex')
juzt.test('alex is chain object', chain.is(alex) === true)
juzt.test('alex name is "alex"', alex.name === 'alex')
juzt.test('name set on origin object', chain.origin(alex).name === alex.name)
juzt.test('chain.arr ok', chain.arr(alex).length === 3)
juzt.test('chain.arr ok', chain.arr(alex)[0] === chain.origin(alex))
juzt.test('chain.arr ok', chain.arr(alex)[1] === cop)
juzt.test('chain.arr ok', chain.arr(alex)[2] === robot)
juzt.test('chain.add ok', chain.add(alex, being).length === 4)
juzt.test('alex.name is "alex"', alex.name === 'alex')
juzt.test('alex.is is "cop"', alex.is === 'cop')
juzt.test('chain.raw ok', chain.raw(alex, 'is').length === 4)
juzt.test('chain.raw ok', chain.raw(alex, 'is')[0] === undefined)
juzt.test('chain.raw ok', chain.raw(alex, 'is')[1] === 'cop')
juzt.test('chain.raw ok', chain.raw(alex, 'is')[2] === 'robot')
juzt.test('chain.raw ok', chain.raw(alex, 'is')[3] === 'being')

// Methods

being.hi = function () { 
  return 'Hi, my name is ' + this.name + ' and I am a ' + this.is 
} 
juzt.test('alex method ok', alex.hi() === 'Hi, my name is alex and I am a cop')

// Diamond inheritance

let joe = chain(cop, human, being)

juzt.test('set joe.name as "joe"', (joe.name = 'joe') === 'joe')
juzt.test('joe method ok', joe.hi() === 'Hi, my name is joe and I am a cop')
juzt.test('alex method still ok', alex.hi() === 'Hi, my name is alex and I am a cop')
juzt.test('delete property', delete cop.is === true)
juzt.test('joe method still ok', joe.hi() === 'Hi, my name is joe and I am a human')
juzt.test('alex method still ok', alex.hi() === 'Hi, my name is alex and I am a robot')

// Branching

let skilled = { 
  is: 'skilled', 
  skill: 'shooting' 
}

juzt.test('set cop.is', (cop.is = 'cop') === 'cop')

let branch = chain(cop, skilled)

juzt.test('alex chain.rep ok', chain.rep(alex, cop, branch).length === 4)
juzt.test('alex chain.rep ok', chain.rep(alex, cop, branch)[0] === chain.origin(alex))
juzt.test('alex chain.rep ok', chain.rep(alex, cop, branch)[1] === branch)
juzt.test('alex chain.rep ok', chain.rep(alex, cop, branch)[2] === robot)
juzt.test('alex chain.rep ok', chain.rep(alex, cop, branch)[3] === being)
juzt.test('joe chain.rep ok', chain.rep(joe, cop, branch).length === 4)
juzt.test('joe chain.rep ok', chain.rep(joe, cop, branch)[0] === chain.origin(joe))
juzt.test('joe chain.rep ok', chain.rep(joe, cop, branch)[1] === branch)
juzt.test('joe chain.rep ok', chain.rep(joe, cop, branch)[2] === human)
juzt.test('joe chain.rep ok', chain.rep(joe, cop, branch)[3] === being)
juzt.test('alex chain.arr length ok', chain.arr(alex).length === 4)
juzt.test('alex.skill is "shooting"', alex.skill === 'shooting')
juzt.test('alex.is is "cop"', alex.is === 'cop')
juzt.test('alex chain.raw ok', chain.raw(alex, 'is').length === 4)
juzt.test('delete cop.is', delete cop.is === true)
juzt.test('alex chain.raw ok', chain.raw(alex, 'is')[0] === undefined)
juzt.test('alex chain.raw ok', chain.raw(alex, 'is')[1] === 'skilled')
juzt.test('alex chain.raw ok', chain.raw(alex, 'is')[2] === 'robot')
juzt.test('alex chain.raw ok', chain.raw(alex, 'is')[3] === 'being')
juzt.test('alex.is is "skilled"', alex.is === 'skilled')

juzt.test('set cop.is', (cop.is = 'cop') === 'cop')

juzt.test('joe chain.raw ok', chain.raw(joe, 'is').length === 4)
juzt.test('joe chain.raw ok', chain.raw(joe, 'is')[0] === undefined)
juzt.test('joe chain.raw ok', chain.raw(joe, 'is')[1] === 'cop')
juzt.test('joe chain.raw ok', chain.raw(joe, 'is')[2] === 'human')
juzt.test('joe chain.raw ok', chain.raw(joe, 'is')[3] === 'being')

juzt.test('joe chain.raw ok', chain.raw(joe, 'is', props => props).length === 4)
juzt.test('joe chain.raw ok', chain.raw(joe, 'is', props => props)[0] === undefined)
juzt.test('joe chain.raw ok', chain.raw(joe, 'is', props => props)[1] === 'cop')
juzt.test('joe chain.raw ok', chain.raw(joe, 'is', props => props)[2] === 'human')
juzt.test('joe chain.raw ok', chain.raw(joe, 'is', props => props)[3] === 'being')

// Changing default behaviour

chain.set.owncontext = true

//juzt.test('joe chain.raw ok', alex.hi() === 

juzt.test('bound alex.hi', alex.hi() === 'Hi, my name is undefined and I am a being')
juzt.test('bound joe.hi', joe.hi() === 'Hi, my name is undefined and I am a being')

juzt.over()