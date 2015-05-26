// dependencies
var binaryString = require('binary-string');
var BitArray = require('bit-array');
var Bignum = require('bignum');

module.exports = B62;


var b62Operations = B62();
module.exports.encode = b62Operations.encode;
module.exports.decode = b62Operations.decode;


function B62(charset){
  charset = charset || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var base = charset.length;
  var frameSize = Math.ceil(getBaseLog(2, base));
  
  this.encode = function(input, encoding){
    if(!input) { return ''; }
    
    if(typeof input === 'string' && !encoding){
      encoding = 'utf8';
    } else if (input instanceof Buffer){
      input = input.toString('hex');
      encoding = 16;
    }
    
    var integer = Bignum(input, encoding),
        dividend = Bignum(integer),
        result = '';
    
    if(integer.eq(0)) { return '0'; }
    
    while(integer.gt(0)){
      integer = dividend.div(base);
      result = charset[remainder(dividend, base, integer)] + result;
      dividend = integer;
    }
    
    return result;
  };
  
  return this;
}


// returns the logarithm of y with base x (ie. logx (y))
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

// Bing num remainder
function remainder(dividend, divisor, result) {
  if(!result){
    result = dividend.div(divisor);
  }
  
  return dividend.sub(result.mul(divisor));
}