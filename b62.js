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
    
    var binary = input,
        dividend = Bignum(binary),
        result = '';
    
    if(binary.eq(0)) { return '0'; }
    
    while(binary.gt(MAX_INT_PRECISION)){
      binary = dividend.div(base);
      result = charset[remainder(dividend, base, binary)] + result;
      dividend = binary;
    }
    
    binary = binary.toNumber();
    
    while (binary > 0) {
      result = charset[binary % base] + result;
      binary = Math.floor(binary/base);
    }
    
    return result;
  };
  
  this.decode = decode = function(str, encodingBase, opts){
    var result = Bignum(0),
        chars = str.split('').reverse(),
        multiplier = Bignum(1),
        idx = 0;
        
    while(idx < chars.length /*&& multiplier < MAX_INT_PRECISION/base*/){
      multiplier = Bignum.pow(base, idx);
      result = result.add(multiplier.mul(charset.indexOf(chars[idx])));
      idx++;
    }
    
    if(opts !== undefined && !encodingBase){
      return result.toBuffer(opts);
    } else if(typeof encodingBase === 'number'){
      return result.toString(encodingBase);
    } else {
      return result.toBuffer(opts).toString(encodingBase);
    }
  };
  
  return this;
}


// Big num remainder (not very performant)
function remainder(dividend, divisor, quotient) {
  if(!quotient){
    quotient = dividend.div(divisor);
  }
  return dividend.sub(quotient.mul(divisor));
}
