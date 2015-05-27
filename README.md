[![npm version](https://badge.fury.io/js/b62.svg)](http://badge.fury.io/js/b62)
[![Build Status](https://travis-ci.org/dmarcelino/uuid-base62.svg?branch=master)](https://travis-ci.org/dmarcelino/uuid-base62)

# b62
Encode and decode strings to base62 (and others)

## Overview
The most popular [base62 encoder](https://www.npmjs.com/package/base62) and others only support converting a `number` to base62. This becomes a problem when trying to convert a big number with a precision higher than 52 bits like, for example, an UUID. Hence `b62`, which allows to convert strings (and not only) to base62.

> Meanwhile I've found [base-x](https://github.com/dcousens/base-x) which is much faster ([20x](https://gist.github.com/dmarcelino/879d4da2a0e0c32f7d74)) than b62! The only nuisance is that you need to supply a buffer. If performance is important to you, use base-x! In the future b62 may be changed to use base-x underneath.

## Instalation
```shell
npm i b62 -S
```

## Usage
```javascript
var b62 = require('b62');

var encoded = b62.encode("Hello World!");
// -> t8DGCJrgKz3AYSDn

var decoded = b62.decoded("t8DGCJrgKz3AYSDn");
// -> Hello World!
```

You can also use other bases, for example:
```javascript
var b64 = b62("-_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");

var encoded = b64.encode("Hi this is b64 example");
// -> _6og_Oo4zN64zN646Qb0_zs43Hq4Lz

var decoded = b62.decoded("t8DGCJrgKz3AYSDn");
// -> Hi this is b64 example
```

## License
MIT
