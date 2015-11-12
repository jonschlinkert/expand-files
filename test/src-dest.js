'use strict';

require('mocha');
require('should');
var assert = require('assert');
require('assert-path')(assert);
var Files = require('..');
var config;

describe('src', function() {
  beforeEach(function() {
    config = new Files({cwd: 'test/fixtures'});
  });

  it('should support config.src', function() {
    config.expand({src: 'a.txt'});
    assert(config.files[0].src[0], 'a.txt');
  });

  it('should support src as a string', function() {
    config.expand('a.txt');
    assert(config.files[0].src[0], 'a.txt');
  });

  it('should support src as a glob', function() {
    config.expand('*.txt');
    assert(config.files[0].src[0], 'a.txt');
  });

  it('should support src as an array', function() {
    config.expand('*.txt');
    assert(config.files[0].src[0], 'a.txt');
  });

  it('should support src as an array of globs', function() {
    config.expand(['*.txt', '*.js']);
    assert(config.files[0].src[0], 'a.txt');
  });
});

describe('dest', function() {
  beforeEach(function() {
    config = new Files({cwd: 'test/fixtures'});
  });

  it('should support config.dest', function() {
    config.expand({src: 'a.txt', dest: 'zzz'});
    assert(config.files[0].dest, 'zzz');
  });

  it('should support dest as a string', function() {
    config.expand('a.txt', 'zzz');
    assert(config.files[0].dest, 'zzz');
  });

  it('should support dest as an option', function() {
    config.expand('a.txt', {dest: 'zzz'});
    assert(config.files[0].dest, 'zzz');
  });
});
