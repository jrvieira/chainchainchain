Chainchainchain favors composition over inheritance without breaking JavaScript.



## Installation

```shell
$ npm install chainchainchain
```


## Usage

```javascript
const chain = require('chainchainchain')

let xo = { x: 'x' }
let yo = { y: 'y' }
let zo = { z: 'z' }
let fo = { f () { return this.x + this.y + this.z } }

let ch = chain(xo, yo, zo, fo)

ch.x // 'x'
ch.y // 'y'
ch.z // 'z'
ch.f() // 'xyz'

xo.x = yo.y = zo.z = 'chain'

ch.f() // 'chainchainchain'
```


## Documentation

[chainchainchain.jrvieira.com](http://jrvieira.github.io/chainchainchain)


###### Licensed under MIT
