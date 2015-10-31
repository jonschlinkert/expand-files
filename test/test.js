require('mocha');
require('should');
var path = require('path');
var util = require('util');
var assert = require('assert');
var gm = require('global-modules');
var expand = require('expand');
var support = require('./support/utils');
var utils = require('../lib/utils');
var Files = require('..');

var inspect = function(obj) {
  return util.inspect(obj, null, 10);
};

function containEql(actual, expected) {
  var len = expected.length;
  var alen = actual.length;
  len = Math.min(len, alen);

  while (len--) {
    var a = actual[len];
    var b = expected[len];

    a.src.should.eql(b.src);
    a.dest.should.equal(b.dest);
  }
}

describe('files', function () {
  describe('instance', function () {
    it('should return an instance:', function () {
      var config = new Files();
      assert(config instanceof Files);
    });

    it('should return an instance without `new`:', function () {
      var config = Files();
      assert(config instanceof Files);
    });
  });

  describe('globbing', function () {
    it('should expand `src` glob patterns:', function () {
      var config = new Files();
      config.expand({src: 'test/fixtures/*.txt'});
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/a.txt'));
    });

    it('should include base property:', function () {
      var config = new Files();
      config.expand({src: 'test/fixtures/*.txt'});
      assert(config.cache.files[0].options.base, 'test/fixtures');
    });

    it('should use a `cwd` to expand `src` glob patterns:', function () {
      var config = new Files();
      config.expand({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/a.txt'));
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/b.txt'));
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/c.txt'));
    });

    it('should include base from the correct `cwd` when provided:', function () {
      var config = new Files();
      config.expand({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert(config.cache.files[0].options.base, '.');
    });

    it('should not expand glob patterns when `options.glob` is false', function () {
      var config = new Files();
      config.expand({src: 'test/fixtures/*.txt', glob: false});
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/*.txt'));
    });

    it('should not have a globParent when a non-glob pattern is specified:', function () {
      var config = new Files();
      config.expand({src: 'test/fixtures/a.txt'});
      assert(support.contains(config.cache.files[0].src, 'test/fixtures/a.txt'));
      assert(typeof config.cache.files[0].options.globParent === 'undefined');
    });
  });

  describe('options.expand', function () {
    describe('when expand is true', function () {
      it('should join the `cwd` to expanded `src` paths:', function () {
        var config = new Files();
        config.expand({
          src: '*.txt',
          options: {
            cwd: 'test/fixtures',
            expand: true
          }
        });

        assert.deepEqual(config.cache.files[0].src, ['test/fixtures/a.txt']);
        assert.deepEqual(config.cache.files[1].src, ['test/fixtures/b.txt']);
        assert.deepEqual(config.cache.files[2].src, ['test/fixtures/c.txt']);
      });

      it('should append `destBase` to generated dests:', function () {
        var config = new Files();
        config.expand({
          src: '*.txt',
          options: {
            cwd: 'test/fixtures',
            destBase: 'dist/',
            expand: true
          }
        });

        assert.deepEqual(config.cache.files[0].src, ['test/fixtures/a.txt']);
        assert.deepEqual(config.cache.files[0].dest, 'dist/a.txt');
        assert.deepEqual(config.cache.files[1].src, ['test/fixtures/b.txt']);
        assert.deepEqual(config.cache.files[1].dest, 'dist/b.txt');
        assert.deepEqual(config.cache.files[2].src, ['test/fixtures/c.txt']);
        assert.deepEqual(config.cache.files[2].dest, 'dist/c.txt');
      });

      it('should append `destBase` to `dest` of generated dests:', function () {
        var config = new Files();
        config.expand({
          src: '*.txt',
          dest: 'site',
          options: {
            cwd: 'test/fixtures',
            destBase: 'dist/',
            expand: true
          }
        });

        assert.deepEqual(config.cache.files[0].src, ['test/fixtures/a.txt']);
        assert.deepEqual(config.cache.files[0].dest, 'dist/site/a.txt');
        assert.deepEqual(config.cache.files[1].src, ['test/fixtures/b.txt']);
        assert.deepEqual(config.cache.files[1].dest, 'dist/site/b.txt');
        assert.deepEqual(config.cache.files[2].src, ['test/fixtures/c.txt']);
        assert.deepEqual(config.cache.files[2].dest, 'dist/site/c.txt');
      });

      it('should expand `src` paths into src-dest mappings:', function () {
        var config = new Files();
        config.expand({
          src: 'test/fixtures/*.txt',
          options: {
            expand: true
          }
        });

        containEql(config.cache.files, [{
          src: [ 'test/fixtures/a.txt' ],
          dest: 'test/fixtures/a.txt'
        }, {
          src: [ 'test/fixtures/b.txt' ],
          dest: 'test/fixtures/b.txt'
        }]);
      });

      it('should create `dest` properties using the src basename:', function () {
        var config = new Files();
        config.expand({
          options: {
            expand: true
          },
          src: 'test/fixtures/*.txt'
        });
        assert.equal(config.cache.files[0].dest, 'test/fixtures/a.txt');
      });

      it('should not prepend `cwd` to created `dest` mappings:', function () {
        var config = new Files();
        config.expand({
          options: {
            cwd: 'test/fixtures/',
            expand: true
          },
          src: '*.txt'
        });
        assert.equal(config.cache.files[0].dest, 'a.txt');
      });

      it('should expand `src` paths to src-dest mappings:', function () {
        var config = new Files();
        config.expand({
          src: '*.txt',
          options: {
            cwd: 'test/fixtures',
            expand: true
          }
        });

        var expected = [{
          src: ['test/fixtures/a.txt'],
          dest: 'a.txt'
        }, {
          src: ['test/fixtures/b.txt'],
          dest: 'b.txt'
        }];

        containEql(config.cache.files, expected);
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
      var config = new Files();
      config.expand({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });
      containEql(config.cache.files, expected);
    });

    it('should expand files objects when `expand` is on options:', function () {
      var config = new Files();
      config.expand({
        options: {expand: true},
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });

      containEql(config.cache.files, expected);
    });

    it('should expand files objects when expand is on the root:', function () {
      var config = new Files();
      config.expand({
        expand: true,
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      });

      containEql(config.cache.files, expected);
    });

    it('should expand files objects when `src` is an array:', function () {
      var config = new Files();
      config.expand({
        options: {expand: true},
        'foo/': ['test/fixtures/*.txt'],
        'bar/': ['test/fixtures/*.txt']
      });

      containEql(config.cache.files, expected);
    });
  });

  describe('plugins:', function () {
    it('should use a plugin on a node:', function () {
      var config = new Files();
      config.use(function(files) {
        var render = expand(this.options);

        return function fn(node) {
          if (!node.isRawNode) return fn;
          var opts = utils.merge({}, files.cache, this.options);
          render(this, opts);
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

      assert(config.cache.files[0].src.length > 0);
      assert(config.cache.files[0].options.cwd === 'test/fixtures');
    });

    it('should update files mappings with a plugin:', function () {
      var File = require('vinyl');
      var config = new Files();
      config.use(function(app) {
        app.array = [];

        return function fn(node) {
          if (!node.isNode) return fn;
          node.path = node.src[0];
          var file = new File(node);
          file.dest = node.dest;
          file.options = node.options;
          app.array.push(file);
        };
      });

      config.expand({
        expand: true,
        src: 'examples/*.js',
        dest: 'foo'
      });

      assert(config.array.length > 1);
    });
  });

  describe('options.flatten:', function () {
    it('should flatten dest paths:', function () {
      var config = new Files();
      config.expand({
        options: {
          expand: true,
          flatten: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      var expected = [
        {dest: 'dest/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ];

      containEql(config.cache.files, expected);
    });

    it('should not flatten dest paths when `flatten` is false', function () {
      var config = new Files();
      config.expand({
        options: {
          expand: true,
          flatten: false
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      var expected = [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ];

      containEql(config.cache.files, expected);
    });

    it('should not flatten dest paths when flatten is undefined:', function () {
      var config = new Files();
      config.expand({
        options: {
          expand: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      });

      var expected = [
        {dest: 'dest/test/fixtures/a/a.txt', src: ['test/fixtures/a/a.txt']},
        {dest: 'dest/test/fixtures/a/aa/aa.txt', src: ['test/fixtures/a/aa/aa.txt']},
        {dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt', src: ['test/fixtures/a/aa/aaa/aaa.txt']},
      ];

      containEql(config.cache.files, expected);
    });
  });
});

describe('expand mapping:', function () {
  var expected;
  var cwd;

  beforeEach(function (done) {
    cwd = process.cwd();
    process.chdir('test/fixtures');
    done();
  });

  afterEach(function (done) {
    process.chdir(cwd);
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

      var withoutSlash = new Files({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest'
      });
      var withSlash = new Files({
        options: {expand: true},
        src: ['a/**/*.txt'],
        dest: 'dest/'
      });

      containEql(withSlash, expected);
      containEql(withoutSlash, expected);
    });
  });

  describe('options.nonull:', function () {
    it('should return the original pattern when no files are found:', function () {
      var config = new Files();
      config.expand({
        options: {nonull: true},
        src: ['*.foo']
      });
      config.cache.files[0].src.should.containEql('*.foo');
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

      var config = new Files();
      config.expand({
        options: {
          expand: true,
          flatten: true
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      containEql(config.cache.files, expected);
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

      var config = new Files();
      config.expand({
        options: {
          expand: true,
          ext: '.foo'
        },
        src: ['**/foo.*/**'],
        dest: 'dest',
      });

      containEql(config.cache.files, expected);
    });

    it('should use extension when it is an empty string:', function () {
      var config = new Files();
      config.expand({
        options: {
          expand: true,
          ext: ''
        },
        src: ['a/**/*.txt'],
        dest: 'dest',
      });

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

      containEql(config.cache.files, expected);
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
          dest: 'dest/foo.bar/baz.qux/foo.foo' } ];

      var config = new Files();
      config.expand({
        options: {
          expand: true,
          ext: '.foo',
          extDot: 'first'
        },
        src: ['foo.*/**'],
        dest: 'dest'
      });
      containEql(config.cache.files, expected);
    });

    it('should replace everything after the last dot in the filename.', function () {
      var config = new Files();
      config.expand({
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
          dest: 'dest/foo.bar/baz.qux/foo.foo' } ];
      containEql(config.cache.files, expected);
    });
  });

  describe('options.destBase:', function () {
    it('should prepend destBase to dest:', function () {
      var config = new Files();
      config.expand({
        destBase: 'foo',
        src: '*.js',
        dest: 'bar'
      });
      assert.equal(config.cache.files[0].dest, 'foo/bar');
    });

    it('should expand a leading tilde in destBase:', function () {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      var config = new Files();
      config.expand({
        destBase: '~/foo',
        src: '*.js',
        dest: 'bar'
      });
      assert.equal(config.cache.files[0].dest, path.join(home, 'foo/bar'));
    });
  });

  describe('options.cwd:', function () {
    it('should append srcBase to the cwd:', function () {
      var config = new Files();
      config.expand({
        srcBase: 'foo',
        cwd: 'scaffolds',
        src: '*.txt'
      });
      assert.equal(config.cache.files[0].options.cwd, 'scaffolds/foo');
    });

    it('should expand a leading tilde in the cwd:', function () {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      var config = new Files();
      config.expand({
        cwd: '~/scaffolds',
        src: '*.txt'
      });
      assert.equal(config.cache.files[0].options.cwd, path.join(home, 'scaffolds'));
    });

    it('should expand a leading @ in the cwd:', function () {
      var config = new Files();
      config.expand({
        cwd: '@/scaffolds',
        src: '*.txt'
      });
      assert.equal(config.cache.files[0].options.cwd, path.join(gm, 'scaffolds'));
    });

    it('should expand a leading @ in the cwd when expand is true:', function () {
      var config = new Files();
      config.expand({
        expand: true,
        cwd: '@/scaffolds',
        src: '*.txt'
      });
      assert.equal(config.cache.files[0].options.cwd, path.join(gm, 'scaffolds'));
    });

    it('should strip cwd from filepath before joined to dest:', function () {
      var config = new Files();
      config.expand({
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

      assert.deepEqual(config.cache.files[0].src, expected[0].src);
      assert.deepEqual(config.cache.files[1].src, expected[1].src);
      assert.deepEqual(config.cache.files[2].src, expected[2].src);
      assert(config.cache.options.cwd === 'a');
    });
  });

  describe('options.rename:', function () {
    it('should support custom rename functions:', function () {
      var one = new Files();
      var two = new Files();

      one.expand({
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

      assert(one.cache.options.cwd === 'a');
      assert(one.cache.options.flatten === true);
      assert(one.cache.files.length === 3);

      two.expand({
        options: {
          expand: true,
          filter: 'isFile',
          permalink: ':dest/:upper(basename)',
          upper: function (str) {
            return str.toUpperCase();
          },
          rename: function (dest, fp, options) {
            var pattern = options.permalink;
            var ctx = options;
            ctx.ext = path.extname(fp);
            ctx.dest = dest;
            ctx.basename = path.basename(fp);
            var fn = expand({regex: /:([(\w ),]+)/});
            return fn(pattern, ctx);
          }
        },
        src: ['**/*'],
        dest: 'foo/bar'
      });
      assert(two.cache.files[0].dest === 'foo/bar/A.TXT');
    });

    it('should group expanded `src` arrays by dest paths:', function () {
      var config = new Files();
      config.expand({
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
      containEql(config.cache.files, expected);
    });
  });

  describe('options.filter:', function () {
    it('should support custom filter functions:', function () {
      var config = new Files();
      config.expand({
        options: {
          filter: function (str) {
            return !/\.js$/.test(str);
          }
        },
        src: ['*.json', '*.js']
      });
      assert(!config.cache.files[0].src.length);
    });

    it('should support filtering by `fs.lstat` type: `.isDirectory()`', function () {
      var config = new Files();
      config.expand({
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

      config.cache.files[0].src.should.eql(['a/aa', 'a/aa/aaa']);
      config.cache.files[0].dest.should.equal('dest/all');
    });

    it('should filter by fs.lstat method (false if file !exists):', function () {
      var config = new Files();
      config.expand({
        filter: 'isFile',
        src: 'a/b/c.txt'
      });
      assert(!config.cache.files[0].src.length);
    });

    it('should filter by fs.lstat method (truthy if file exists):', function () {
       var config = new Files();
       config.expand({
        options: {
          filter: 'isFile',
        },
        src: ['*.txt']
      });
      assert(config.cache.files[0].src.length > 0);
    });

    it('should support filtering by `fs.lstat` type: `.isFile()`', function () {
      var config = new Files();
      config.expand({
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

      config.cache.files[0].src.should.eql(['a/a.txt', 'a/aa/aa.txt', 'a/aa/aaa/aaa.txt']);
      config.cache.files[1].src.should.eql(['b/alpha.js', 'b/beta.js', 'b/gamma.js']);
    });

    it('should throw an error when the filter argument is invalid:', function () {
      (function () {
        config = new Files();
        config.expand({
          options: {expand: true, filter: 'isFil'},
          src: ['{a,b}/**/*'],
          dest: 'dest'
        });
      }).should.throw('[options.filter] `isFil` is not a valid fs.lstatSync method name');
    });

    it('should throw an error when the filter argument is invalid:', function () {
      (function () {
        config = new Files();
        config.expand({
          options: {expand: true, filter: 'isFil', statType: 'statSync'},
          src: ['{a,b}/**/*'],
          dest: 'dest'
        });
      }).should.throw('[options.filter] `isFil` is not a valid fs.statSync method name');
    });
  });

  describe('options.transform', function () {
    it('should modify the result with a custom transform function', function () {
       var config = new Files();
       config.use(function fn(node) {
        if (!node.isRawNode) return fn;
        node.pipeline = function() {};
        return node;
       });

       config.expand({
        src: ['*.txt']
      });

      assert(typeof config.cache.files[0].pipeline === 'function');
    });

    it('should work when `expand` is true:', function () {
      var config = new Files();
      config.use(function fn(node) {
        if (!node.isNode) return fn;
        node.pipeline = function () {};
        return node;
      });

      config.expand({
        options: {expand: true},
        src: ['*.txt']
      });

      assert(typeof config.cache.files[0].pipeline === 'function');
    });

  });
});

describe('events', function () {
  it('should emit events:', function (done) {
    var config = new Files();
    config.on('foo', function (val) {
      assert(val);
      done();
    });
    config.emit('foo', true);
  });

  it('should emit an event for `node`:', function (done) {
    var config = new Files();
    var i = 0;
    config.on('node', function (node) {
      assert(node);
      i++;
    });
    config.expand({src: '*.js'});
    assert(i > 0);
    done();
  });

  it('should emit an event for `node` when expand is true:', function (done) {
    var config = new Files();
    var i = 0;
    config.on('node', function (node) {
      assert(node);
      i++;
    });
    config.expand({src: '*.js', expand: true});
    assert(i > 0);
    done();
  });
});
