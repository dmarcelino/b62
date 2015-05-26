var assert = require('assert');
var b62 = require('../b62');

describe('b62 ::', function(){
  var testPairs = [
    { input: new Buffer([0]), output: '0' },
    { input: new Buffer([1]), output: '1' },
    { input: new Buffer([61]), output: 'Z' },
    { input: new Buffer([62]), output: '10' },
    { input: new Buffer([64]), output: '12' },
    { input: new Buffer([124]), output: '20' },
    { input: new Buffer([128]), output: '24' },
    { input: new Buffer([248]), output: '40' },
    { input: new Buffer([255]), output: '47' },
    { input: new Buffer([1, 0]), output: '48' },
    { input: new Buffer([15, 3]), output: 'ZZ' },
    { input: new Buffer([15, 4]), output: '100' },
    { input: new Buffer([198, 148, 68, 111, 0, 255]), output: 'ZZZZZZZZ' },
    { input: new Buffer([15, 255, 255, 255, 255, 255, 255]), output: 'kCQoBYJk3' },
    { input: new Buffer([16, 0, 0, 0, 0, 0, 0]), output: 'kCQoBYJk4' }, // > 2^52
    { input: new Buffer([16, 0, 0, 0, 0, 0, 6]), output: 'kCQoBYJka' }, // > 2^52
    { input: new Buffer([0x30, 0x17, 0xe8, 0x92, 0xe2, 0x3d, 0xff]), output: 'ZZZZZZZZZ' }, // > 2^52
  ];
  
  var stringTestPairs = [
    { input: '0', output: 'M' },
    { input: ' ', output: 'w' },    
    { input: '=', output: 'Z' },
    { input: '>', output: '10' },
    { input: '@', output: '12' },
    { input: '|', output: '20' },
    { input: '10000000000000', encoding: 'hex', output: 'kCQoBYJk4' }, // > 2^52
  ];
  
  describe('base62', function(){
    it('should encode a buffer to base62', function(){
      testPairs.forEach(function(pair){
        var res = b62.encode(pair.input);
        //console.log(pair.input, ':', res);
        assert.equal(res, pair.output);
      });
    });
    
    it('should encode a string to base62', function(){
      stringTestPairs.forEach(function(pair){
        var res = b62.encode(pair.input, pair.encoding);
        //console.log(pair.input, ':', res);
        assert.equal(res, pair.output);
      });
    });
    
    it("should encode a number to a Base62", function() {
      assert.equal(b62.encode(999), 'g7');
      assert.equal(b62.encode(65), '13');
      //test big numbers
      assert.equal(b62.encode(10000000000001), "2Q3rKTOF");
      assert.equal(b62.encode(10000000000002), "2Q3rKTOG");
    });
  });
});



describe('b62 :: other bases', function(){
  var testPairs = [
    { input: new Buffer([15, 255, 255, 255, 255, 255, 255]), output: '4503599627370495' },
    { input: new Buffer([16, 0, 0, 0, 0, 0, 0]),   output: '4503599627370496' },  // > 2^52
    { input: new Buffer([16, 0, 0, 0, 0, 0, 255]), output: '4503599627370751' },  // > 2^52
  ];
  
  
  it('should encode a buffer to base10', function(){
    var b10 = b62("0123456789");
    for(var i=0; i<=255; i++){
      assert.equal(b10.encode(new Buffer([i])), i); 
    }
    testPairs.forEach(function(pair){
      var res = b10.encode(pair.input);
      //console.log(pair.input, ':', res);
      assert.equal(res, pair.output);
    });
  });
  
  it('should encode a very big number to base10', function(){
    var b10 = b62("0123456789");
    assert.equal(b10.encode('9999999999999999', null, 10), '9999999999999999'); 
  });
});