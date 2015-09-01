'use strict';

/* deps: mocha */
var path = require('path');
var util = require('util');
var assert = require('assert');
var should = require('should');
var merge = require('mixin-deep');
var expand = require('expand');
var utils = require('./support/utils');
var files = require('../');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

describe('files', function () {
  describe('files array', function () {
    it('should make dest an empty string when undefined:', function () {
      var actual = files(['index.js', '*.md', '.*']);
      assert(actual[0].dest === '');
    });

    it('should create a src from the files array', function () {
      var actual = files(['index.js', '*.md', '.*']);
      assert(actual[0].src.length > 0);
    });
  });

  describe('expand', function () {
    it('should create a node when no `src` exists', function () {
      var actual = files({'foo': 'bar'});
      assert.deepEqual(actual, [{
        options: {},
        dest: 'foo',
        src: []
      }]);
    });

    it('should arrayify the `src` property', function () {
      var actual = files({src: 'a', dest: 'b'});
      actual[0].should.have.property('src');
      assert(Array.isArray(actual[0].src));
    });

    it('should expand `src` glob patterns:', function () {
      var actual = files({src: 'test/fixtures/*.txt'});
      assert(utils.contains(actual[0].src, 'test/fixtures/a.txt'));
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var actual = files({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert(utils.contains(actual[0].src, 'a.txt'));
      assert(utils.contains(actual[0].src, 'b.txt'));
      assert(utils.contains(actual[0].src, 'c.txt'));
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        var actual = files({src: '*.txt', options: {cwd: 'test/fixtures', expand: true}});
        assert.deepEqual(actual[0].src, ['test/fixtures/a.txt']);
        assert.deepEqual(actual[1].src, ['test/fixtures/b.txt']);
        assert.deepEqual(actual[2].src, ['test/fixtures/c.txt']);
      });

      it('should expand `src` paths into src-dest mappings:', function () {
        var actual = files({
          src: 'test/fixtures/*.txt',
          options: {
            expand: true
          }
        });

        actual.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'test/fixtures/a.txt'
        });
        actual.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'test/fixtures/b.txt'
        });
      });

      it('should create `dest` properties using the src basename:', function () {
        var actual = files({
          options: {
            expand: true
          },
          src: 'test/fixtures/*.txt'
        });
        assert.equal(actual[0].dest, 'test/fixtures/a.txt');
      });

      it('should not prepend `cwd` to created `dest` mappings:', function () {
        var actual = files({
          options: {
            cwd: 'test/fixtures/',
            expand: true
          },
          src: '*.txt'
        });
        assert.equal(actual[0].dest, 'a.txt');
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        var actual = files({
          src: '*.txt',
          options: {
            cwd: 'test/fixtures',
            expand: true
          }
        });

        actual.should.containEql({
          src: [ 'test/fixtures/a.txt' ],
          dest: 'a.txt'
        });
        actual.should.containEql({
          src: [ 'test/fixtures/b.txt' ],
          dest: 'b.txt'
        });
      });
    });
  });

  describe('files objects:', function () {
    var expected = [
      {src: ['test/fixtures/a.txt'], dest: 'foo/test/fixtures/a.txt'},
      {src: ['test/fixtures/b.txt'], dest: 'foo/test/fixtures/b.txt'},
      {src: ['test/fixtures/c.txt'], dest: 'foo/test/fixtures/c.txt'},
      {src: ['test/fixtures/d.txt'], dest: 'foo/test/fixtures/d.txt'},
      {src: ['test/fixtures/a.txt'], dest: 'bar/test/fixtures/a.txt'},
      {src: ['test/fixtures/b.txt'], dest: 'bar/test/fixtures/b.txt'},
      {src: ['test/fixtures/c.txt'], dest: 'bar/test/fixtures/c.txt'},
      {src: ['test/fixtures/d.txt'], dest: 'bar/test/fixtures/d.txt'}
    ];

    it('should expand files objects when `src` is a string:', function () {
      var actual = files({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when `expand` is on options:', function () {
      var actual = files({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when expand is on the root:', function () {
      var actual = files({
        expand: true,
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      actual.should.eql(expected);
    });

    it('should expand files objects when `src` is an array:', function () {
      var actual = files({
        options: {expand: true},
        'foo/': ['test/fixtures/*.txt'],
        'bar/': ['test/fixtures/*.txt']
      });
      actual.should.eql(expected);
    });
  });

  describe('options.flatten:', function () {
    it('should flatten dest paths:', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });

    it('should not flatten dest paths when `flatten` is false', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: false
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });

    it('should not flatten dest paths when flatten is undefined:', function () {
      var actual = files({
        options: {
          expand: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      assert.deepEqual(actual, [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ]);
    });
  });
});

describe('expand mapping:', function () {
  var actual, expected;

  beforeEach(function (done) {
    this.cwd = process.cwd();
    process.chdir('test/fixtures');
    done();
  });

  afterEach(function (done) {
    process.chdir(this.cwd);
    done();
  });

  describe('trailing slashes:', function () {
    it('should use dest with or without trailing slash:', function () {
      var expected = [{
        dest: 'dest/a/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/aa/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/aa/aaa/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }, ];

      var withoutSlash = files({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest'
      });
      var withSlash = files({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest/'
      });

      assert.deepEqual(withSlash, expected);
      assert.deepEqual(withoutSlash, expected);
    });
  });

  describe('options.flatten:', function () {
    it('should flatten dest paths by joining pre-dest to src filepath:', function () {
      var expected = [{
        dest: 'dest/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }, ];

      var actual = files({
        options: {
          expand: true,
          flatten: true
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assert.deepEqual(actual, expected);
    });
  });

  describe('options.ext:', function () {
    it('should use the specified extension on dest files:', function () {
      expected = [
        { src: [ 'foo.bar' ], dest: 'dest/foo.foo' },
        { src: [ 'foo.bar/baz.qux' ], dest: 'dest/foo.bar/baz.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz' ],
          dest: 'dest/foo.bar/baz.qux/fez.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz/x.y.z' ],
          dest: 'dest/foo.bar/baz.qux/fez.faz/x.foo' },
        { src: [ 'foo.bar/baz.qux/foo' ],
          dest: 'dest/foo.bar/baz.qux/foo.foo' }
      ];

      actual = files({
        options: {
          expand: true,
          ext: '.foo'
        },
        src: ['**/foo.*/**'],
        dest: 'dest',
      });
      assert.deepEqual(actual, expected);
    });

    it('should use extension when it is an empty string:', function () {
      expected = [{
        dest: 'dest/a/a',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/aa/aa',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/aa/aaa/aaa',
        src: ['a/aa/aaa/aaa.txt']
      }, ];
      assert.deepEqual(files({
        options: {
          expand: true,
          ext: ''
        },
        src: ['a/**/*.txt'],
        dest: 'dest',
      }), expected);
    });
  });


  describe('options.extDot:', function () {
    it('should replace everything after the first dot in the filename:', function () {
      expected = [ { src: [ 'foo.bar' ], dest: 'dest/foo.foo' },
        { src: [ 'foo.bar/baz.qux' ], dest: 'dest/foo.bar/baz.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz' ],
          dest: 'dest/foo.bar/baz.qux/fez.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz/x.y.z' ],
          dest: 'dest/foo.bar/baz.qux/fez.faz/x.foo' },
        { src: [ 'foo.bar/baz.qux/foo' ],
          dest: 'dest/foo.bar/baz.qux/foo.foo' } ]

      actual = files({
        options: {
          expand: true,
          ext: '.foo',
          extDot: 'first'
        },
        src: ['foo.*/**'],
        dest: 'dest'
      });
      assert.deepEqual(actual, expected);
    });

    it('should replace everything after the last dot in the filename.', function () {
      actual = files({
        options: {
          expand: true,
          ext: '.foo',
          extDot: 'last'
        },
        src: ['foo.*/**'],
        dest: 'dest'
      });

      expected = [ { src: [ 'foo.bar' ], dest: 'dest/foo.foo' },
        { src: [ 'foo.bar/baz.qux' ], dest: 'dest/foo.bar/baz.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz' ],
          dest: 'dest/foo.bar/baz.qux/fez.foo' },
        { src: [ 'foo.bar/baz.qux/fez.faz/x.y.z' ],
          dest: 'dest/foo.bar/baz.qux/fez.faz/x.y.foo' },
        { src: [ 'foo.bar/baz.qux/foo' ],
          dest: 'dest/foo.bar/baz.qux/foo.foo' } ]
      assert.deepEqual(actual, expected);
    });
  });

  describe('options.cwd:', function () {
    it('should strip cwd from filepath before joined to dest:', function () {
      var actual = files({
        options: {
          expand: true,
          cwd: 'a'
        },
        src: ['**/*.txt'],
        dest: 'dest'
      });

      var expected = [{
        dest: 'dest/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/aa/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/aa/aaa/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }];
      assert.deepEqual(actual, expected);
    });
  });

  describe('options.rename:', function () {
    it('should support custom rename functions:', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: true,
          cwd: 'a',
          rename: function (dest, fp, options) {
            return path.join(dest, options.cwd, 'foo', fp);
          }
        },
        src: ['**/*.txt'],
        dest: 'dest'
      });

      var expected = [{
        dest: 'dest/a/foo/a.txt',
        src: ['a/a.txt']
      }, {
        dest: 'dest/a/foo/aa.txt',
        src: ['a/aa/aa.txt']
      }, {
        dest: 'dest/a/foo/aaa.txt',
        src: ['a/aa/aaa/aaa.txt']
      }];

      assert.deepEqual(actual, expected);
    });

    it('should expose target properties as `this` to rename function:', function () {
      var actual = files({
        options: {
          expand: true,
          filter: 'isFile',
          permalink: ':dest/:upper(basename)',
          upper: function (str) {
            return str.toUpperCase();
          },
          rename: function (dest, fp, options) {
            var pattern = options.permalink;
            var ctx = merge({}, this, options, {dest: dest});
            ctx.ext = ctx.extname;
            return expand(pattern, ctx, {regex: /:([(\w ),]+)/});
          }
        },
        src: ['**/*'],
        dest: 'foo/bar'
      });

      actual[0].dest.should.equal('foo/bar/A.TXT');
    });

    it('should group expanded `src` arrays by dest paths:', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: true,
          cwd: '',
          rename: function (dest, fp) {
            return path.join(dest, 'all' + path.extname(fp));
          }
        },
        src: ['{a,b}/**/*'],
        dest: 'dest'
      });

      expected = [{
        src: ['a/a.txt', 'a/aa/aa.txt', 'a/aa/aaa/aaa.txt'],
        dest: 'dest/all.txt'
      }, {
        src: ['a/aa', 'a/aa/aaa'],
        dest: 'dest/all'
      }, {
        src: ['b/alpha.js', 'b/beta.js', 'b/gamma.js'],
        dest: 'dest/all.js'
      }];

      assert.deepEqual(actual, expected);
    });

    it('should support filtering by `fs.lstat` type: `.isDirectory()`', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: true,
          filter: 'isDirectory',
          rename: function (dest, fp) {
            return path.join(dest, 'all' + path.extname(fp));
          }
        },
        src: ['{a,b}/**/*'],
        dest: 'dest'
      });

      expected = [{
        src: ['a/aa', 'a/aa/aaa'],
        dest: 'dest/all'
      }];

      assert.deepEqual(actual, expected);
    });

    it('should support filtering by `fs.lstat` type: `.isFile()`', function () {
      var actual = files({
        options: {
          expand: true,
          flatten: true,
          filter: 'isFile',
          rename: function (dest, fp) {
            return path.join(dest, 'all' + path.extname(fp));
          }
        },
        src: ['{a,b}/**/*'],
        dest: 'dest'
      });

      expected = [{
        src: ['a/a.txt', 'a/aa/aa.txt', 'a/aa/aaa/aaa.txt'],
        dest: 'dest/all.txt'
      }, {
        src: ['b/alpha.js', 'b/beta.js', 'b/gamma.js'],
        dest: 'dest/all.js'
      }];

      assert.deepEqual(actual, expected);
    });

    it('should throw an error when the filter argument is invalid:', function () {
      (function () {
        files({
          options: {
            expand: true,
            filter: 'isFil'
          },
          src: ['{a,b}/**/*'],
          dest: 'dest'
        });
      }).should.throw('[options.filter] `isFil` is not a valid fs.lstat method name');
    });
  });
});
