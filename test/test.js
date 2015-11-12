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
      assert(config.ExpandFiles === true);
    });

    it('should instantiate without `new`', function() {
      var config = Files();
      assert(config instanceof Files);
    });
  });
});
