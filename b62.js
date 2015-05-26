// dependencies
var Bignum = require('bignum');

var MAX_INT_PRECISION = Math.pow(2, 52);  // http://www.w3schools.com/js/js_numbers.asp

module.exports = B62;


var b62Operations = B62();
module.exports.encode = b62Operations.encode;
module.exports.decode = b62Operations.decode;


function B62(charset){
  charset = charset || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var base = charset.length;
  
  this.encode = function(input, encoding, opts){
    if(!input) { return ''; }
    
    if(typeof input === 'string' && opts && !encoding){
      input = Bignum(input, opts);
    } else if(typeof input === 'string'){
      input = Bignum.fromBuffer(new Buffer(input, encoding), opts);
    } else if (input instanceof Buffer){
      input = Bignum.fromBuffer(input, opts || encoding);
    } else {
      input = Bignum(input, opts || encoding);
    }
    
    var integer = input,
        dividend = Bignum(integer),
        result = '';
    
    if(integer.eq(0)) { return '0'; }
    
    while(integer.gt(MAX_INT_PRECISION)){
      integer = dividend.div(base);
      result = charset[remainder(dividend, base, integer)] + result;
      dividend = integer;
    }
    
    integer = integer.toNumber();
    
    while (integer > 0) {
      result = charset[integer % base] + result;
      integer = Math.floor(integer/base);
    }
    
    return result;
  };
  
  return this;
}


// returns the logarithm of y with base x (ie. logx (y))
function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

// Bing num remainder (not very performant)
function remainder(dividend, divisor, result) {
  if(!result){
    result = dividend.div(divisor);
  }
  return dividend.sub(result.mul(divisor));
}