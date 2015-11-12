'use strict';

require('mocha');
require('should');
var assert = require('assert');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('base', function() {
    it('should return the base path from a glob', function() {
      assert.equal(utils.base('a/b/*.js'), 'a/b');
    });

    it('should return the dirname for non-globs', function() {
      assert.equal(utils.base('a/b/c.js'), 'a/b');
    });

    it('should return the base passed on options', function() {
      assert.equal(utils.base('./', {base: 'foo'}), 'foo');
    });

    it('should return an empty string if base is a dot', function() {
      assert.equal(utils.base('.'), '');
    });

    it('should return an empty string when opts.base is a dot', function() {
      assert.equal(utils.base('foo', {base: '.'}), '');
    });
  });
});
