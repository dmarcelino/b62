var assert = require('assert');
var b62 = require('../b62');

describe('b62', function () {
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
    { input: '9', output: 'V' },
    { input: ' ', output: 'w' },
    { input: '=', output: 'Z' },
    { input: '>', output: '10' },
    { input: '@', output: '12' },
    { input: '|', output: '20' },
    { input: '| ', output: '8gw' },
    { input: 'blah', output: '1NKyKY' },
    { input: 'Hello world', output: '73xPuGYmZai8Snq' },
    { input: '10000000000000', encoding: 'hex', output: 'kCQoBYJk4' }, // > 2^52
    { input: 'de305d5475b4431badb2eb6b9e546014', encoding: 'hex', output: '6LgoKL9f4A0C5NI9WZ6gpC' }, // > 2^52
  ];

  describe('Base62', function () {

    describe("encode", function () {
      it('should encode a buffer to Base62', function () {
        testPairs.forEach(function (pair) {
          var res = b62.encode(pair.input);
          //console.log(pair.input, ':', res);
          assert.equal(res, pair.output);
        });
      });

      it('should encode a string to Base62', function () {
        stringTestPairs.forEach(function (pair) {
          var res = b62.encode(pair.input, pair.encoding);
          //console.log(pair.input, ':', res);
          assert.equal(res, pair.output);
        });
      });

      it("should encode a number to Base62", function () {
        assert.equal(b62.encode(999), 'g7');
        assert.equal(b62.encode(65), '13');
        assert.equal(b62.encode(10000000000001), "2Q3rKTOF");
        assert.equal(b62.encode(10000000000002), "2Q3rKTOG");
      });
    });


    describe("decode", function () {
      it('should decode a buffer from Base62', function () {
        testPairs.forEach(function (pair) {
          var res = b62.decode(pair.output, null, {});
          assert(res instanceof Buffer);
          assert.equal(res.toString(), pair.input.toString());
        });
      });

      it('should decode a string from Base62', function () {
        stringTestPairs.forEach(function (pair) {
          var res = b62.decode(pair.output, pair.encoding);
          assert.equal(res, pair.input);
        });
      });

      it("should decode a number from Base62", function () {
        assert.equal(b62.decode('g7', 10), 999);
        assert.equal(b62.decode('13', 10), 65);
        assert.equal(b62.decode("2Q3rKTOF", 10), 10000000000001);
        assert.equal(b62.decode("2Q3rKTOH", 10), 10000000000003);
      });
    });

  });


  describe('other bases', function () {
    var b10 = b62("0123456789");
    var testPairs = [
      { input: new Buffer([15, 255, 255, 255, 255, 255, 255]), output: '4503599627370495' },
      { input: new Buffer([16, 0, 0, 0, 0, 0, 0]), output: '4503599627370496' },  // > 2^52
      { input: new Buffer([16, 0, 0, 0, 0, 0, 255]), output: '4503599627370751' },  // > 2^52
    ];

    describe("encode", function () {
      it('should encode a buffer to Base10', function () {
        for (var i = 0; i <= 255; i++) {
          assert.equal(b10.encode(new Buffer([i])), i);
        }

        testPairs.forEach(function (pair) {
          var res = b10.encode(pair.input);
          //console.log(pair.input, ':', res);
          assert.equal(res, pair.output);
        });
      });

      it('should encode a very big number to Base10', function () {
        assert.equal(b10.encode('9999999999999999', null, 10), '9999999999999999');
      });
    });

    describe("decode", function () {
      it('should decode a buffer from Base10', function () {
        for (var i = 0; i <= 255; i++) {
          var res = b10.decode('' + i, null, {});
          assert(res instanceof Buffer);
          assert.equal(res.toString(), new Buffer([i]).toString());
        }

        testPairs.forEach(function (pair) {
          var res = b10.decode(pair.output, null, {});
          assert(res instanceof Buffer);
          assert.equal(res.toString(), pair.input.toString());
        });
      });

      it('should decode a very big number from Base10', function () {
        assert.equal(b10.decode('9999999999999999', 10), '9999999999999999');
      });
    });
  });
});
