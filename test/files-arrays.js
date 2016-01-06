'use strict';

require('mocha');
require('should');
var assert = require('assert');
require('assert-path')(assert);
var Files = require('..');
var config;

describe('files arrays', function() {
  beforeEach(function() {
    config = new Files();
  });

  it('should retain arbitrary properties on config', function() {
    config.expand({
      a: 'b',
      c: 'd',
      options: { cwd: 'test' },
      files: [
        {src: 'fixtures/*.txt', dest: 'foo/'},
      ]
    });
    assert.equal(config.a, 'b');
    assert.equal(config.c, 'd');
  });

  it('should support files arrays when `src` is a string', function() {
    config.expand({
      options: { cwd: 'test' },
      files: [
        {src: 'fixtures/*.txt', dest: 'foo/'},
        {src: 'fixtures/*.txt', dest: 'bar/'}
      ]
    });

    assert(config.files.length === 2);
  });

  it('should expand files arrays when `src` is a string', function() {
    config.expand({
      options: { mapDest: true, cwd: 'test' },
      files: [
        {src: 'fixtures/*.txt', dest: 'foo/'},
        {src: 'fixtures/*.txt', dest: 'bar/'}
      ]
    });
    assert(config.files.length > 2);
  });

  it('should retain arbitrary properties on files objects', function() {
    config.expand({
      options: { mapDest: true, cwd: 'test' },
      files: [
        {src: 'fixtures/[a-z].txt', dest: 'bar/', data: {title: 'My Blog'}}
      ]
    });
    assert(config.files[0].data);
  });

  it('should support files arrays when `src` is an array', function() {
    config.expand({
      options: { cwd: 'test' },
      files: [
        {src: ['fixtures/*.txt'], dest: 'foo/'},
        {src: ['fixtures/*.txt'], dest: 'bar/'}
      ]
    });

    assert(config.files.length === 2);
  });

  it('should expand files arrays when `src` is an array', function() {
    config.expand({
      options: { mapDest: true, cwd: 'test' },
      files: [
        {src: ['fixtures/*.txt'], dest: 'foo/'},
        {src: ['fixtures/*.txt'], dest: 'bar/'}
      ]
    });
    assert(config.files.length > 2);
  });

  it('should expand files arrays when "mapDest" is on the root', function() {
    config.expand({
      mapDest: true,
      files: [
        {src: 'test/fixtures/*.txt', dest: 'foo/'},
        {src: 'test/fixtures/*.txt', dest: 'bar/'}
      ]
    });
    assert(config.files.length > 2);
  });
});
