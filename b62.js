'use strict';

// dependencies
var BaseX = require('base-x');

exports = module.exports = B62;

var b62Operations = B62();
module.exports.encode = b62Operations.encode;
module.exports.decode = b62Operations.decode;

function B62(charset) {

  var base62 = function () { };
  base62.charset = charset || "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  base62.baseX = BaseX(base62.charset);

  base62.encode = function (input, encoding) {
    var buf;
    if (!input) { return ''; }
    
    if (input instanceof Buffer) {
      buf = input;
    } else {
      buf = new Buffer(input, encoding);
    }
    
    return base62.baseX.encode(buf);
  };

  base62.decode = function (str, encoding) {
    if(encoding === 'raw'){
      return new Buffer(base62.baseX.decode(str));
    }
    
    var res = (new Buffer(base62.baseX.decode(str))).toString(encoding);
    console.log(res);
    return res;
  };

  return base62;
}