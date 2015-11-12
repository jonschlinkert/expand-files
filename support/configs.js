'use strict';

var path = require('path');
var merge = require('mixin-deep');
var expand = require('expand');

module.exports = [
  {
    section: 'files-object mappings',
    examples: [
      {
        description: 'expands "files-objects" into src-dest mappings',
        config: [{
          'foo/': 'test/fixtures/*.txt',
          'bar/': 'test/fixtures/*.txt'
        },
        {
          options: {
            mapDest: true
          },
          'foo/': 'test/fixtures/*.txt',
          'bar/': 'test/fixtures/*.txt'
        }]
      }
    ]
  },
  {
    section: '`src` normalization',
    examples: [
      {
        description: 'attempts to create node when no `src` exists',
        config: {foo: 'bar'}
      },
      {
        description: 'arrayifies the `src` property',
        config: {
          src: 'a',
          dest: 'b'
        }
      },
      {
        description: 'expands `src` glob patterns:',
        config: {
          src: 'test/fixtures/*.txt'
        }
      },
      {
        description: 'expands `src` glob patterns with `dest`:',
        config: {
          src: 'test/fixtures/*.txt',
          dest: 'dist/'
        }
      },
      {
        description: 'expands `src` glob patterns with `dest` and `cwd`:',
        config: {
          options: {
            cwd: 'test/fixtures',
            mapDest: true
          },
          src: '*.txt',
          dest: 'dist/'
        }
      },
      {
        description: 'uses a `cwd` to expand `src` glob patterns:',
        config: {
          src: '*.txt',
          options: {
            cwd: 'test/fixtures'
          }
        }
      }
    ]
  },
  {
    section: 'options.expand',
    examples: [{
      description: 'joins the `cwd` to expanded `src` paths:',
      config: {
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          mapDest: true
        }
      }
    },
    {
      description: 'expands `src` paths into src-dest mappings:',
      config: {
        src: 'test/fixtures/*.txt',
        options: {
          mapDest: true
        }
      }
    },
    {
      description: 'creates `dest` properties using the `src` basename:',
      config: {
        options: {
          mapDest: true
        },
        src: 'test/fixtures/*.txt'
      }
    },
    {
      description: 'does not prepend `cwd` to created `dest` mappings:',
      config: {
        options: {
          cwd: 'test/fixtures/',
          mapDest: true
        },
        src: '*.txt'
      }
    },
    {
      description: 'expands `src` paths to src-dest mappings:',
      config: {
        src: '*.txt',
        options: {
          cwd: 'test/fixtures',
          mapDest: true
        }
      }
    }]
  },
  {
    section: 'files objects:',
    examples: [{
      description: 'expands files objects when `src` is a string:',
      config: {
        options: {
          mapDest: true
        },
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      }
    },
    {
      description: 'expands files objects when `expand` is on options:',
      config: {
        options: {
          mapDest: true
        },
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      }
    },
    {
      description: 'expands files objects when expand is on the root:',
      config: {
        mapDest: true,
        'foo/': 'test/fixtures/*.txt',
        'bar/': 'test/fixtures/*.txt'
      }
    },
    {
      description: 'expands files objects when `src` is an array:',
      config: {
        options: {
          mapDest: true
        },
        'foo/': ['test/fixtures/*.txt'],
        'bar/': ['test/fixtures/*.txt']
      }
    }]
  },
  {
    section: 'options.flatten:',
    examples: [{
      description: 'flattens dest paths:',
      config: {
        options: {
          mapDest: true,
          flatten: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      }
    },
    {
      description: 'does not flatten `dest` paths when `flatten` is false',
      config: {
        options: {
          mapDest: true,
          flatten: false
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      }
    },
    {
      description: 'does not flatten `dest` paths when `flatten` is undefined:',
      config: {
        options: {
          mapDest: true
        },
        src: 'test/fixtures/a/**/*.txt',
        dest: 'dest',
      }
    }]
  },
  {
    section: 'trailing slashes:',
    examples: [{
      description: 'uses `dest` with or without trailing slash:',
      config: [{
        options: {
          mapDest: true
        },
        src: ['test/fixtures/a/**/*.txt'],
        dest: 'dest'
      },
      {
        options: {
          mapDest: true
        },
        src: ['test/fixtures/a/**/*.txt'],
        dest: 'dest/'
      }]
    },
    {
      description: 'flattens `dest` paths by joining pre-dest to src filepath:',
      config: {
        options: {
          mapDest: true,
          flatten: true
        },
        src: ['test/fixtures/a/**/*.txt'],
        dest: 'dest'
      }
    }]
  },
  {
    section: 'options.ext:',
    examples: [{
      description: 'uses the specified extension on dest files:',
      config: {
        options: {
          mapDest: true,
          ext: '.foo'
        },
        src: ['test/fixtures/**/foo.*/**'],
        dest: 'dest'
      }
    },
    {
      description: 'uses extension when it is an empty string:',
      config: {
        options: {
          mapDest: true,
          ext: ''
        },
        src: ['test/fixtures/a/**/*.txt'],
        dest: 'dest'
      }
    }]
  },
  {
    section: 'options.extDot:',
    examples: [{
      description: 'when `extDot` is `first`, everything after the first dot in the filename is replaced:',
      config: {
        options: {
          mapDest: true,
          ext: '.foo',
          extDot: 'first'
        },
        src: ['test/fixtures/foo.*/**'],
        dest: 'dest'
      }
    },
    {
      description: 'when `extDot` is `last`, everything after the last dot in the filename is replaced:',
      config: {
        options: {
          mapDest: true,
          ext: '.foo',
          extDot: 'last'
        },
        src: ['test/fixtures/foo.*/**'],
        dest: 'dest'
      }
    }]
  },
  {
    section: 'options.cwd:',
    examples: [{
      description: 'when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:',
      config: {
        options: {
          mapDest: true,
          cwd: 'a'
        },
        src: ['test/fixtures/**/*.txt'],
        dest: 'dest'
      }
    }]
  },
  {
    section: 'options.rename:',
    examples: [{
      description: 'supports custom rename function:',
      config: {
        options: {
          mapDest: true,
          flatten: true,
          cwd: 'a',
          rename: function(dest, fp, options) {
            return path.join(dest, options.cwd, 'foo', fp);
          }
        },
        src: ['test/fixtures/**/*.txt'],
        dest: 'dest'
      }
    },
    {
      description: 'exposes target properties as `this` to the rename function:',
      config: {
        options: {
          mapDest: true,
          filter: 'isFile',
          permalink: ':dest/:upper(basename)',
          upper: function(str) {
            return str.toUpperCase();
          },
          rename: function(dest, fp, options) {
            var pattern = options.permalink;
            var ctx = merge({}, this, options, {
              dest: dest
            });
            ctx.ext = ctx.extname;
            return expand(pattern, ctx, {
              regex: /:([(\w ),]+)/
            });
          }
        },
        src: ['test/fixtures/**/*'],
        dest: 'foo/bar'
      }
    },
    {
      description: 'expanded `src` arrays are grouped by dest paths:',
      config: {
        options: {
          mapDest: true,
          flatten: true,
          cwd: '',
          rename: function(dest, fp) {
            return path.join(dest, 'all' + path.extname(fp));
          }
        },
        src: ['test/fixtures/{a,b}/**/*'],
        dest: 'dest'
      }
    },
    {
      description: 'should flatten basename onto destbase',
      config: {
        options: {
          mapDest: true,
          flatten: true,
        },
        src: ['test/fixtures/{a,b}/**/*'],
        dest: 'dest'
      }
    },
    {
      description: 'should use plugins',
      config: {
        options: {
          mapDest: true,
          rename: false
        },
        src: ['test/fixtures/{a,b}/**/*'],
        dest: 'foo/:base'
      }
    }
  ]
}];

// var configs = [
//   {
//     foo: 'bar'
//   },
//   {
//     src: 'lib/*.js',
//     dest: 'dist/'
//   },
//   {
//     src: 'lib/*.js',
//     dest: 'dist/',
//     options: {
//       mapDest: true
//     }
//   },
//   {
//     src: '*.js',
//     dest: 'dist/',
//     cwd: 'lib'
//   },
//   {
//     src: '*.js',
//     dest: 'dist/',
//     cwd: 'lib',
//     mapDest: true
//   },
//   {
//     src: '*.js',
//     dest: 'dist/',
//     cwd: 'lib',
//     mapDest: true,
//     flatten: true
//   },
//   {
//     src: 'lib/*.js',
//     dest: 'dist/',
//     flatten: true
//   },
//   {
//     src: 'lib/*.js',
//     dest: 'dist/',
//     options: {
//       mapDest: true,
//       flatten: true
//     }
//   },
// ]
