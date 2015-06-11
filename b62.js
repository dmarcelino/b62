'use strict';

// dependencies
var Bignum = require('bignum');

var MAX_INT_PRECISION = Math.pow(2, 52);  // http://www.w3schools.com/js/js_numbers.asp

exports = module.exports = B62;

var b62Operations = B62();
module.exports.encode = b62Operations.encode;
module.exports.decode = b62Operations.decode;

function B62(charset) {

  var base62 = function () { };
  base62.charset = charset || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  base62.base = base62.charset.length;

  base62.encode = function (input, encoding, opts) {
    var self = base62;
    if (!input) { return ''; }

    if (typeof input === 'string' && opts && !encoding) {
      input = new Bignum(input, opts);
    } else if (typeof input === 'string') {
      input = Bignum.fromBuffer(new Buffer(input, encoding), opts);
    } else if (input instanceof Buffer) {
      input = Bignum.fromBuffer(input, opts || encoding);
    } else {
      input = new Bignum(input, opts || encoding);
    }

    var binary = input,
      dividend = new Bignum(binary),
      result = '';

    if (binary.eq(0)) { return '0'; }

    while (binary.gt(MAX_INT_PRECISION)) {
      binary = dividend.div(self.base);
      result = self.charset[dividend.mod(self.base)] + result;
      dividend = binary;
    }

    binary = binary.toNumber();

    while (binary > 0) {
      result = self.charset[binary % self.base] + result;
      binary = Math.floor(binary / self.base);
    }

    return result;
  };

  base62.decode = function (str, encodingBase, opts) {
    var self = base62;
    var result = new Bignum(0),
      chars = str.split('').reverse(),
      multiplier = new Bignum(1),
      idx = 0;

    while (idx < chars.length /*&& multiplier < MAX_INT_PRECISION/self.base*/) {
      multiplier = Bignum.pow(self.base, idx);
      result = result.add(multiplier.mul(self.charset.indexOf(chars[idx])));
      idx++;
    }

    if (opts !== undefined && !encodingBase) {
      return result.toBuffer(opts);
    } else if (typeof encodingBase === 'number') {
      return result.toString(encodingBase);
    } else {
      return result.toBuffer(opts).toString(encodingBase);
    }
  };

  return base62;
}
