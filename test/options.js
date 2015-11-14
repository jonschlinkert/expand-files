'use strict';

require('mocha');
require('should');
var path = require('path');
var assert = require('assert');
require('assert-path')(assert);
var gm = require('global-modules');
var Files = require('..');
var config;

function assertFiles(config, len) {
  assert(config.files.length);
  if (len) {
    assert(config.files.length >= len);
  }
}

function assertSrc(config, n, len) {
  assert(config.files.length);
  assert(config.files[n].src.length);
  if (len) {
    assert(config.files[n].src.length >= len);
  }
}

function assertDest(config, n, expected) {
  assert.absolute(config.files[n].dest, expected);
}

function assertExt(config, n, expected) {
  assert.extname(config.files[n].dest, expected);
}

function assertBasename(config, n, expected) {
  assert.basename(config.files[n].dest, expected);
}

describe('options', function() {
  beforeEach(function() {
    config = new Files();
  });

  describe('options.base', function() {
    it('should get "options.base" from glob parent', function() {
      config.expand({src: 'test/fixtures/*.txt', base: true, mapDest: true});
      assert.equal(config.files[0].dest, 'test/fixtures/a.txt');
    });

    it('should use the base passed on the options', function() {
      config.expand({src: 'test/fixtures/*.txt', base: 'foo', mapDest: true});
      assert.equal(config.files[0].options.base, 'foo');
      assert.equal(config.files[0].dest, 'foo/a.txt');
    });

    it('should include base from the correct `cwd` when provided', function() {
      config.expand({src: '*.txt', options: {cwd: 'test/fixtures'}});
      assert(!config.files[0].options.base);
    });
  });

  describe('options.glob', function() {
    beforeEach(function() {
      config = new Files();
    });

    it('should not expand glob patterns when options.glob is false', function() {
      config.expand({
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          glob: false
        }
      });
      assert.deepEqual(config.files[0].src, ['*.txt']);
    });
  });

  describe('options.mapDest', function() {
    beforeEach(function() {
      config = new Files();
    });

    it('should join the `cwd` to expanded `src` paths', function() {
      config.expand({
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          mapDest: true
        }
      });

      assert.deepEqual(config.files[0].src, ['test/fixtures/a.txt']);
      assert.deepEqual(config.files[1].src, ['test/fixtures/b.txt']);
      assert.deepEqual(config.files[2].src, ['test/fixtures/c.txt']);
    });

    it('should expand `src` paths into src-dest mappings', function() {
      config.expand({
        src: 'test/fixtures/*.txt',
        options: {
          mapDest: true
        }
      });

      assert(config.files.length > 0);
      assert(typeof config.files[0].dest === 'string');
      assert(config.files[0].dest === 'test/fixtures/a.txt');
    });

    it('should create `dest` properties using the src basename', function() {
      config.expand({
        options: {
          mapDest: true
        },
        src: 'test/fixtures/*.txt'
      });
      assert.equal(config.files[0].dest, 'test/fixtures/a.txt');
    });

    it('should not prepend `cwd` to created `dest` mappings', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures/',
          mapDest: true
        },
        src: '*.txt'
      });
      assert.equal(config.files[0].dest, 'a.txt');
    });

    it('should expand `src` paths to src-dest mappings', function() {
      config.expand({
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          mapDest: true
        }
      });

      assertFiles(config);
      assertFiles(config, 1);
    });

    it('should use dest with trailing slash', function() {
      config.expand({
        options: { mapDest: true, cwd: 'test/fixtures/' },
        src: ['a/**/*.txt'],
        dest: 'dest/'
      });

      assertFiles(config);
      assertFiles(config, 2);
      assert.equal(config.files[0].dest, 'dest/a/a.txt');
    });

    it('should use dest without trailing slash', function() {
      config.expand({
        options: { mapDest: true, cwd: 'test/fixtures/' },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assertFiles(config);
      assertFiles(config, 2);
      assert.equal(config.files[0].dest, 'dest/a/a.txt');
    });
  });

  describe('options.destBase', function() {
    beforeEach(function() {
      config = new Files();
    });

    it('should prepend destBase to dest', function() {
      config.expand({
        options: {cwd: 'test/fixtures', destBase: 'foo'},
        src: '*.js',
        dest: 'bar'
      });
      assert.equal(config.files[0].dest, 'foo/bar');
    });

    it('should expand a leading tilde in destBase', function() {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      config.expand({
        options: {destBase: '~/foo', cwd: 'test/fixtures'},
        src: '*.js',
        dest: 'bar'
      });
      assert.equal(config.files[0].dest, path.join(home, 'foo/bar'));
    });

    it('should prepend `destBase` to generated dests', function() {
      config.expand({
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          destBase: 'dist/',
          mapDest: true
        }
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a.txt']);
      assert.equal(config.files[0].dest, 'dist/a.txt');
      assert.equal(config.files[1].src[0], ['test/fixtures/b.txt']);
      assert.equal(config.files[1].dest, 'dist/b.txt');
      assert.equal(config.files[2].src[0], ['test/fixtures/c.txt']);
      assert.equal(config.files[2].dest, 'dist/c.txt');
    });

    it('should prepend `destBase` to src dirname and generated dests', function() {
      config.expand({
        src: 'test/fixtures/*.txt',
        options: {
          destBase: 'dist/',
          mapDest: true
        }
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a.txt']);
      assert.equal(config.files[0].dest, 'dist/test/fixtures/a.txt');
      assert.equal(config.files[1].src[0], ['test/fixtures/b.txt']);
      assert.equal(config.files[1].dest, 'dist/test/fixtures/b.txt');
      assert.equal(config.files[2].src[0], ['test/fixtures/c.txt']);
      assert.equal(config.files[2].dest, 'dist/test/fixtures/c.txt');
    });

    it('should append `destBase` to `destpath` of generated dests', function() {
      config.expand({
        src: '*.txt',
        dest: 'site',
        options: {
          cwd: 'test/fixtures',
          destBase: 'dist/',
          mapDest: true
        }
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a.txt']);
      assert.equal(config.files[0].dest, 'dist/site/a.txt');
      assert.equal(config.files[1].src[0], ['test/fixtures/b.txt']);
      assert.equal(config.files[1].dest, 'dist/site/b.txt');
      assert.equal(config.files[2].src[0], ['test/fixtures/c.txt']);
      assert.equal(config.files[2].dest, 'dist/site/c.txt');
    });

    it('should append `destBase` to `destpath` and src dirname of generated dests', function() {
      config.expand({
        src: 'test/fixtures/*.txt',
        dest: 'site',
        options: {
          destBase: 'dist/',
          mapDest: true
        }
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a.txt']);
      assert.equal(config.files[0].dest, 'dist/site/test/fixtures/a.txt');
      assert.equal(config.files[1].src[0], ['test/fixtures/b.txt']);
      assert.equal(config.files[1].dest, 'dist/site/test/fixtures/b.txt');
      assert.equal(config.files[2].src[0], ['test/fixtures/c.txt']);
      assert.equal(config.files[2].dest, 'dist/site/test/fixtures/c.txt');
    });

    it('should append `destBase` to `dest` and src dirname of generated dests', function() {
      config.expand({
        src: '*.txt',
        dest: 'site',
        options: {
          cwd: 'test/fixtures',
          destBase: 'dist/',
          mapDest: true
        }
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a.txt']);
      assert.equal(config.files[0].dest, 'dist/site/a.txt');
      assert.equal(config.files[1].src[0], ['test/fixtures/b.txt']);
      assert.equal(config.files[1].dest, 'dist/site/b.txt');
      assert.equal(config.files[2].src[0], ['test/fixtures/c.txt']);
      assert.equal(config.files[2].dest, 'dist/site/c.txt');
    });
  });

  describe('options.flatten', function() {
    it('should flatten dest paths', function() {
      config.expand({
        options: {
          mapDest: true,
          flatten: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest'
      });

      assertFiles(config);
      assertFiles(config, 2);

      assert(config.files[0].dest, 'dest/a.txt');
      assert(config.files[0].dest, 'dest/aa.txt');
      assert(config.files[0].dest, 'dest/aaa.txt');
    });

    it('should not flatten dest paths when `flatten` is false', function() {
      config.expand({
        options: {
          mapDest: true,
          flatten: false
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest'
      });

      assertFiles(config);
      assertFiles(config, 2);

      assert(config.files[0].dest, 'dest/test/fixtures/a/a.txt');
      assert(config.files[0].dest, 'dest/test/fixtures/a/aa.txt');
      assert(config.files[0].dest, 'dest/test/fixtures/a/aaa.txt');
    });

    it('should not flatten dest paths when flatten is undefined', function() {
      config.expand({
        options: {
          mapDest: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest'
      });

      assertFiles(config);
      assertFiles(config, 2);

      assertDest(config, 0, 'dest/test/fixtures/a/a.txt');
      assertDest(config, 1, 'dest/test/fixtures/a/aa/aa.txt');
      assertDest(config, 2, 'dest/test/fixtures/a/aa/aaa/aaa.txt');
    });

    it('should flatten dest paths by joining pre-dest to src filepath', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          flatten: true
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assertDest(config, 0, 'dest/a.txt');
      assertDest(config, 1, 'dest/aa.txt');
      assertDest(config, 2, 'dest/aaa.txt');
    });
  });

  describe('options.nonull', function() {
    it('should return the original pattern when no files are found', function() {
      config.expand({
        options: {nonull: true, cwd: 'test/fixtures' },
        src: ['*.foo']
      });
      assert.equal(config.files[0].src[0], '*.foo');
    });
  });

  describe('options.ext', function() {
    it('should use the ext defined on the options', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: '.foo'
        },
        src: ['**/foo.*/**'],
        dest: 'dest'
      });

      assertExt(config, 0, '.foo');
      assertExt(config, 1, '.foo');
      assertExt(config, 2, '.foo');
      assertExt(config, 3, '.foo');
    });

    it('should work when ext does not have a leading dot', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: 'foo'
        },
        src: ['**/foo.*/**'],
        dest: 'dest'
      });

      assertExt(config, 0, '.foo');
      assertExt(config, 1, '.foo');
      assertExt(config, 2, '.foo');
      assertExt(config, 3, '.foo');
    });

    it('should use extension when it is an empty string', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: ''
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assertExt(config, 0, '');
      assertExt(config, 1, '');
      assertExt(config, 2, '');
    });

    it('should remove extension if options.ext is false', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: false
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assertExt(config, 0, '');
      assertExt(config, 1, '');
      assertExt(config, 2, '');
    });
  });

  describe('options.extDot', function() {
    it('should replace everything after the first dot in the filename', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: '.foo',
          extDot: 'first'
        },
        src: ['foo.*/**'],
        dest: 'dest'
      });

      assertBasename(config, 0, 'foo.foo');
      assertBasename(config, 1, 'baz.foo');
      assertBasename(config, 2, 'fez.foo');
      assertBasename(config, 3, 'x.foo');
      assertBasename(config, 4, 'foo.foo');
    });

    it('should replace everything after the last dot in the filename.', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          ext: '.foo',
          extDot: 'last'
        },
        src: ['foo.*/**'],
        dest: 'dest'
      });

      assertBasename(config, 0, 'foo.foo');
      assertBasename(config, 1, 'baz.foo');
      assertBasename(config, 2, 'fez.foo');
      assertBasename(config, 3, 'x.y.foo');
      assertBasename(config, 4, 'foo.foo');
    });
  });

  describe('options.cwd', function() {
    it('should use the cwd defined on the global options', function() {
      config = new Files({cwd: 'test/fixtures'})
      config.expand({
        src: '*.txt'
      });

      assert(config.files[0].src.length >= 4);
    });

    it('should expand a leading tilde in the cwd', function() {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      config.expand({
        cwd: '~/',
        src: '*.*'
      });
      assertFiles(config);
      assertFiles(config, 1);
      assert(config.files[0].options.cwd === home + '/');
    });

    it('should expand a leading tilde in the cwd and use mapDest', function() {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      config.expand({
        mapDest: true,
        cwd: '~/',
        src: '*.*'
      });
      assertFiles(config);
      assertFiles(config, 1);
      assert(config.files[0].options.cwd === home + '/');
    });

    it('should expand a leading tilde in the global options cwd', function() {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      var config = new Files({cwd: '~/'});
      config.expand({
        src: '*.*'
      });
      assertFiles(config);
      assertFiles(config, 1);
      assert(config.files[0].options.cwd === home + '/');
    });

    it('should use mapDest with leading tilde defined on global cwd', function() {
      var home = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
      var config = new Files({cwd: '~/'});
      config.expand({
        mapDest: true,
        src: '*.*'
      });
      assertFiles(config);
      assertFiles(config, 1);
      assert(config.files[0].options.cwd === home + '/');
    });

    it('should expand a leading @ in the cwd', function() {
      config.expand({
        cwd: '@/',
        src: '*.*'
      });
      assert.equal(config.files[0].options.cwd, gm + '/');
    });

    it('should expand a leading @ in the cwd when "mapDest" is true', function() {
      config.expand({
        mapDest: true,
        cwd: '@/',
        src: '*.*'
      });
      assert.equal(config.files[0].options.cwd, gm + '/');
    });

    it('should strip cwd from filepath before joined to dest', function() {
      config.expand({
        options: {
          mapDest: true,
          cwd: 'test/fixtures'
        },
        src: ['a/**/*.txt'],
        dest: 'dest'
      });

      assert.equal(config.files[0].src[0], ['test/fixtures/a/a.txt']);
      assert.equal(config.files[1].src[0], ['test/fixtures/a/aa/aa.txt']);
      assert.equal(config.files[2].src[0], ['test/fixtures/a/aa/aaa/aaa.txt']);

      assert.equal(config.files[0].dest, ['dest/a/a.txt']);
      assert.equal(config.files[1].dest, ['dest/a/aa/aa.txt']);
      assert.equal(config.files[2].dest, ['dest/a/aa/aaa/aaa.txt']);
    });
  });

  describe('options.rename', function() {
    it('should return the dest exactly as defined when rename is false', function() {
      config.expand({
        options: {
          mapDest: true,
          rename: false
        },
        src: 'test/fixtures/*.txt',
        dest: 'foo/'
      });

      assertDest(config, 0, 'foo/');
    });

    it('should support custom rename functions', function() {
      config.expand({
        options: {
          rename: function(dest, src, opts) {
            return path.join(dest, 'blah.txt');
          }
        },
        src: 'test/fixtures/*.txt',
        dest: 'foo/'
      });

      assertDest(config, 0, 'foo/blah.txt');
    });

    it('should support custom rename functions with cwd', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          rename: function(dest, src, opts) {
            return path.join(dest, 'blah.txt');
          }
        },
        src: '*.txt',
        dest: 'foo/'
      });

      assertDest(config, 0, 'foo/blah.txt');
    });

    it('should support custom rename functions with "mapDest"', function() {
      config.expand({
        options: {
          cwd: 'test/fixtures',
          mapDest: true,
          rename: function(dest, src, opts) {
            return path.join(path.dirname(dest), 'blah', path.basename(src));
          }
        },
        src: '*.txt',
        dest: 'foo/'
      });

      assertDest(config, 0, 'foo/blah/a.txt');
      assertDest(config, 1, 'foo/blah/b.txt');
      assertDest(config, 2, 'foo/blah/c.txt');
    });

    it('should group expanded `src` arrays by dest paths', function() {
      config.expand({
        options: {
          mapDest: true,
          flatten: true,
          cwd: 'test/fixtures',
          rename: function(dest, fp) {
            return path.join(path.dirname(dest), 'all' + path.extname(fp));
          }
        },
        src: ['{a,b}/**/*'],
        dest: 'dest'
      });

      assertDest(config, 0, 'dest/all.txt');
      assertDest(config, 1, 'dest/all');
      assertDest(config, 2, 'dest/all.js');
    });
  });

  describe('options.filter', function() {
    it('should support custom filter functions', function() {
      config.expand({
        options: {
          filter: function(str) {
            return !/\.js$/.test(str);
          }
        },
        src: ['*.json', '*.js']
      });
      assert(config.files[0].src.length === 1);
    });

    it('should exclude files with a filter function', function() {
      config.expand({
        options: {
          filter: function(fp) {
            return !/^a/.test(path.basename(fp));
          }
        },
        src: ['test/fixtures/*.txt']
      });

      assert(config.files[0].src[0] === 'test/fixtures/b.txt');
      var src = config.files[0].src;
      assert(src.indexOf('test/fixtures/a.txt') === -1);
    });
  });
});
