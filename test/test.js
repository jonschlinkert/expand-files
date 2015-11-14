'use strict';

require('mocha');
require('should');
var assert = require('assert');
var Files = require('..');

describe('expand files', function() {
  describe('constructor', function() {
    it('should create an instance', function() {
      var config = new Files();
      assert(config instanceof Files);
    });

    it('should expose the `isFiles` boolean on an instance', function() {
      var config = new Files();
      assert(config.isFiles === true);
    });

    it('should instantiate without `new`', function() {
      var config = Files();
      assert(config instanceof Files);
    });
  });

  describe('expand', function() {
    it('should expand a config object passed to constructor', function() {
      var config = new Files({
        src: '*.js',
        dest: 'foo/'
      });
      assert(config.files.length === 1);
      assert(config.files[0].src.length > 1);
    });
  });
});
