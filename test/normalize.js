'use strict';

require('mocha');
require('should');
var util = require('util');
var assert = require('assert');
var Files = require('..');
var config;


describe('files', function () {
  beforeEach(function () {
    config = new Files();
  });

  describe('string', function () {
    it('should support src as a string:', function () {
      config.normalize('index.js');

      assert(config.cache.files[0].src[0] === 'index.js');
      assert(config.cache.files[0].dest === '');
    });

    it('should support dest as a string:', function () {
      config.normalize('index.js', 'foo');

      assert(config.cache.files[0].src[0] === 'index.js');
      assert(config.cache.files[0].dest === 'foo');
    });
  });

  describe('files array', function () {
    it('should make dest an empty string when undefined:', function () {
      config.normalize(['index.js', '*.md', '.*']);
      assert(config.cache.files[0].dest === '');
    });

    it('should create a src from the files array', function () {
      config.normalize(['index.js', '*.md', '.*']);
      assert(config.cache.files[0].src.length > 0);
    });
  });

  describe('src', function () {
    it('should create a node when no `src` exists', function () {
      config.normalize({'foo': 'bar'});
      assert.deepEqual(config.cache.files, [{
        options: {cwd: ''},
        dest: 'foo',
        src: ['bar']
      }]);
    });

    it('should arrayify the `src` property', function () {
      config.normalize({src: 'a', dest: 'b'});
      config.cache.files[0].should.have.property('src');
      assert(Array.isArray(config.cache.files[0].src));
    });
  });

  it('should normalize src-dest mappings to a files array:', function () {
    var foo = new Files();
    var bar = new Files();
    foo.normalize({'foo/': '*.js', 'bar/': '*.md'});
    bar.normalize({'foo/': '*.js'});

    assert(Array.isArray(foo.cache.files));
    assert(foo.cache.files[0].src[0] === '*.js');
    assert(foo.cache.files[0].dest === 'foo/');

    assert(bar.cache.files[0].src[0] === '*.js');
    assert(bar.cache.files[0].dest === 'foo/');

    assert(foo.cache.files[1].src[0] === '*.md');
    assert(foo.cache.files[1].dest === 'bar/');
  });

  it('should normalize src-dest mappings on a files object:', function () {
    config.normalize({
      files: {
        'foo/': '*.js',
        'bar/': '*.md'
      }
    });

    assert(Array.isArray(config.cache.files));
    assert(config.cache.files[0].src[0] === '*.js');
    assert(config.cache.files[0].dest === 'foo/');

    assert(config.cache.files[1].src[0] === '*.md');
    assert(config.cache.files[1].dest === 'bar/');
  });

  it('should normalize the first argument to src when it is a string:', function () {
    config.normalize('*.js');
    assert(config.cache.files[0].src[0] === '*.js');
  });

  it('should work when no src is defined:', function () {
    config.normalize({dest: 'out/'});
    assert(config.cache.files[0].dest === 'out/');
  });

  it('should normalize the first argument to src when it is an array:', function () {
    assert(config.normalize(['*.js']).cache.files[0].src[0] === '*.js');
    assert(config.normalize(['foo', 'bar', '*.js']).cache.files[0].src[0] === 'foo');
  });

  it('should normalize an array of src-dest mappings:', function () {
    config.normalize([
      {'a/': ['a/*.js']},
      {'b/': ['b/*.js']},
      {'c/': ['c/*.js']}
    ]);

    assert(config.cache.files[0].src[0] === 'a/*.js');
    assert(config.cache.files[0].dest === 'a/');
    assert(config.cache.files[1].src[0] === 'b/*.js');
    assert(config.cache.files[1].dest === 'b/');
    assert(config.cache.files[2].src[0] === 'c/*.js');
    assert(config.cache.files[2].dest === 'c/');
  });

  it('should convert the second arg to dest when it is a string:', function () {
    config.normalize('*.js', 'foo/');
    assert(config.cache.files[0].src[0] === '*.js');
    assert(config.cache.files[0].dest === 'foo/');
  });

  it('should convert the second arg to dest when the third args is an object:', function () {
    config.normalize('*.js', 'foo/', {cwd: ''});
    assert(config.cache.files[0].src[0] === '*.js');
    assert(config.cache.files[0].dest === 'foo/');
    assert(config.cache.files[0].options.cwd === '');
  });

  it('should arrayify src when args are converted:', function () {
    config.normalize('*.js', 'foo/');

    assert(Array.isArray(config.cache.files[0].src));
    assert(config.cache.files[0].src[0] === '*.js');
  });

  it('should support src and dest being passed on options:', function () {
    // this allows a default src/dest to be passed from main options
    // of consuming libraries
    config.normalize({options: {src: '*.js', dest: 'foo/'}});
    assert(Array.isArray(config.cache.files[0].src));
    assert(config.cache.files[0].src[0] === '*.js');
  });

  it('should convert an object with src-dest to a files array:', function () {
    config.normalize({dest: 'foo/', src: '*.js'});
    assert(Array.isArray(config.cache.files));
    assert(Array.isArray(config.cache.files[0].src));
    assert(config.cache.files[0].src[0] === '*.js');
    assert(config.cache.files[0].dest === 'foo/');
  });

  it('should support files as an array:', function () {
    config.normalize({files: ['*.js']});
    assert(config.cache.files[0].src[0] === '*.js');
  });

  it('should support files as an object:', function () {
    config.normalize({files: {'dist/': ['*.js']}});
    assert(config.cache.files[0].src[0] === '*.js');
    assert(config.cache.files[0].dest === 'dist/');
  });

  describe('options', function () {
    it('should get options from an options object:', function () {
      config.normalize({dest: 'foo/', src: ['*.js'], options: {cwd: 'c'}});
      assert(config.cache.options.cwd === 'c');
      assert(config.cache.files[0].options.cwd === 'c');
    });

    it('should pick options properties from an object:', function () {
      config.normalize({dest: 'foo/', src: '*.js', cwd: 'b'});
      assert(config.cache.options.cwd === 'b');
      assert(config.cache.files[0].options.cwd === 'b');
    });

    it('should pick options properties from a files array:', function () {
      config.normalize({files: [{'foo/': '*.js', cwd: 'f'}]});
      assert(config.cache.files[0].options.cwd === 'f');
    });

    it('should pick options properties from a files object:', function () {
      config.normalize({files: {'foo/': '*.js', cwd: 'e'}});
      assert(config.cache.files[0].options.cwd === 'e');
    });

    it('should pick options properties from src-dest mapping', function () {
      config.normalize({'foo/': '*.js', cwd: 'a'});
      assert(config.cache.options.cwd === 'a');
      assert(config.cache.files[0].options.cwd === 'a');
    });

    it('should extend "target" options onto objects:', function () {
      config.normalize({dest: 'foo/', src: '*.js'}, {process: true});

      assert(Array.isArray(config.cache.files));
      assert(Array.isArray(config.cache.files[0].src));
      assert(config.cache.files[0].src[0] === '*.js');
      assert(config.cache.files[0].dest === 'foo/');
      assert(config.cache.options.process === true);
    });

    it('should extend "context" options onto config:', function () {
      var fn = new Files({process: true});
      fn.normalize({dest: 'foo/', src: '*.js'});

      assert(Array.isArray(fn.cache.files));
      assert(Array.isArray(fn.cache.files[0].src));
      assert(fn.cache.files[0].src[0] === '*.js');
      assert(fn.cache.files[0].dest === 'foo/');
      assert(fn.cache.options.process === true);
    });

    it('should not format files objects when `format` is false:', function () {
      var fn = new Files({format: false});
      fn.normalize({dest: 'foo/', src: '*.js'});

      assert(Array.isArray(fn.cache.files));
      assert(Array.isArray(fn.cache.files[0].src));
      assert(fn.cache.files[0].src[0] === '*.js');
      assert(fn.cache.files[0].dest === 'foo/');
      assert(fn.cache.options.format === false);
    });

    it('should format files objects by default:', function () {
      config.normalize({dest: 'a/', src: '*.js', options: {cwd: 'b/'}});
      var keys = ['options', 'src', 'dest'];
      var i = -1;

      for (var key in config.cache.files[0]) {
        assert(keys[++i] === key);
      }
    });
  });
});
