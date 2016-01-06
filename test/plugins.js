'use strict';

require('mocha');
require('should');
var assert = require('assert');
require('assert-path')(assert);
var expand = require('expand');
var extend = require('extend-shallow');
var Files = require('..');
var config;

describe('plugins', function() {
  beforeEach(function() {
    config = new Files();
  });

  it('should use a plugin on a node', function() {
    config.use(function(files) {
      var render = expand(this.options);

      return function fn(node) {
        if (!node.rawNode) return fn;
        var ctx = extend({}, files, this.options, this.parent);
        render(node, ctx);
      };
    });

    config.expand({
      process: true,
      foo: 'test/fixtures',
      cwd: '<%= foo %>',
      bar: '*.js',
      src: '<%= bar %>',
      dest: '<%= options.cwd %>'
    });

    assert(config.files[0].src.length > 0);
    assert(config.files[0].options.cwd === 'test/fixtures');
  });

  it('should update files mappings with a plugin', function() {
    var File = require('vinyl');
    config.use(function() {
      return function fn(val) {
        if (!val.filesNode) return fn;
        val.parent.array = val.parent.array || [];
        val.path = val.src[0];
        var file = new File(val);
        file.dest = val.dest;
        file.options = val.options;
        val.parent.array.push(file);
      };
    });

    config.expand({
      mapDest: true,
      src: 'examples/*.js',
      dest: 'foo'
    });
    assert(config.array.length > 1);
  });

  it('should remove a node by deleting src', function() {
    var File = require('vinyl');
    config.use(function() {
      return function fn(val) {
        if (!val.filesNode) return fn;
        if (/options\.js$/.test(val.src[0])) {
          delete val.src;
        }
      };
    });

    config.expand({
      mapDest: true,
      src: 'examples/*.js',
      dest: 'foo'
    });

    assert(config.files.length === 2);
  });
});
