'use strict';

require('mocha');
require('should');
var assert = require('assert');
require('assert-path')(assert);
var Files = require('..');
var config;

describe('files objects', function() {
  beforeEach(function() {
    config = new Files();
  });

  it('should retain arbitrary properties on config', function() {
    config.expand({
      a: 'b',
      c: 'd',
      options: { cwd: 'test' },
      src: 'fixtures/*.txt',
      dest: 'dist/'
    });
    assert.equal(config.a, 'b');
    assert.equal(config.c, 'd');
  });

  it('should support files objects when `src` is a string', function() {
    config.expand({
      options: { cwd: 'test' },
      'foo/': 'fixtures/*.txt',
      'bar/': 'fixtures/*.txt'
    });

    assert(config.files.length === 2);
  });

  it('should expand files objects when `src` is a string', function() {
    config.expand({
      options: { mapDest: true, cwd: 'test' },
      'foo/': 'fixtures/*.txt',
      'bar/': 'fixtures/*.txt'
    });
    assert(config.files.length > 2);
  });

  it('should support files objects when `src` is an array', function() {
    config.expand({
      options: { cwd: 'test' },
      'foo/': ['fixtures/*.txt'],
      'bar/': ['fixtures/*.txt']
    });

    assert(config.files.length === 2);
  });

  it('should expand files objects when `src` is an array', function() {
    config.expand({
      options: { mapDest: true, cwd: 'test' },
      'foo/': ['fixtures/*.txt'],
      'bar/': ['fixtures/*.txt']
    });
    assert(config.files.length > 2);
  });

  it('should expand files objects when "mapDest" is on the root', function() {
    config.expand({
      mapDest: true,
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    });
    assert(config.files.length > 2);
  });
});
