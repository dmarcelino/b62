var assert = require('assert');
var b62 = require('../b62');


var testPairs = [
  { input: new Buffer([0]), output: '0' },
  { input: new Buffer([1]), output: '1' },
  { input: new Buffer([61]), output: 'Z' },
  { input: new Buffer([62]), output: '10' },
  { input: new Buffer([64]), output: '12' },
  { input: new Buffer([124]), output: '20' },
  { input: new Buffer([128]), output: '24' },
];

describe('b62 :: encode', function(){
  it('should encode a buffer to base62', function(){
    testPairs.forEach(function(pair){
      var res = b62.encode(pair.input);
      //console.log(pair.input, ':', res);
      assert.equal(res, pair.output);
    });
  });
});