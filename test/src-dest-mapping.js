'use strict';

require('mocha');
require('should');
var assert = require('assert');
var Files = require('..');
var config;

describe('src-dest mappings', function() {
  beforeEach(function() {
    config = new Files();
  });

  it('should support files objects when `src` is a string', function() {
    config.expand({
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    });

    assert(config.files.length === 2);
  });

  it('should recognize options with src-dest mappings', function() {
    config.expand({
      options: {cwd: 'test/fixtures'},
      'foo/': '*.txt',
      'bar/': '*.txt'
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

  it('should expand files objects when expand is on the root', function() {
    config.expand({
      mapDest: true,
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    });
    assert(config.files.length > 2);
  });
});
