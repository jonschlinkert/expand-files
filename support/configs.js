'use strict';

var path = require('path');
var merge = require('mixin-deep');
var expand = require('expand');

module.exports = [{
  section: 'expand patterns',
  examples: [{
    description: 'attempts to create node when no `src` exists',
    config: {
      foo: 'bar'
    }
  }, {
    description: 'arrayifies the `src` property',
    config: {
      src: 'a',
      dest: 'b'
    },
  }, {
    description: 'expands `src` glob patterns:',
    config: {
      src: 'test/fixtures/*.txt'
    },
  }, {
    description: 'uses a `cwd` to expand `src` glob patterns:',
    config: {
      src: '*.txt',
      options: {
        cwd: 'test/fixtures'
      }
    }
  }],
}, {
  section: 'options.expand',
  examples: [{
    description: 'joins the `cwd` to expanded `src` paths:',
    config: {
      src: '*.txt',
      options: {
        cwd: 'test/fixtures',
        expand: true
      }
    }
  }, {
    description: 'expands `src` paths into src-dest mappings:',
    config: {
      src: 'test/fixtures/*.txt',
      options: {
        expand: true
      }
    }
  }, {
    description: 'creates `dest` properties using the `src` basename:',
    config: {
      options: {
        expand: true
      },
      src: 'test/fixtures/*.txt'
    }
  }, {
    description: 'does not prepend `cwd` to created `dest` mappings:',
    config: {
      options: {
        cwd: 'test/fixtures/',
        expand: true
      },
      src: '*.txt'
    }
  }, {
    description: 'expands `src` paths to src-dest mappings:',
    config: {
      src: '*.txt',
      options: {
        cwd: 'test/fixtures',
        expand: true
      }
    }
  }],
}, {
  section: 'files objects:',
  examples: [{
    description: 'expands files objects when `src` is a string:',
    config: {
      options: {
        expand: true
      },
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    }
  }, {
    description: 'expands files objects when `expand` is on options:',
    config: {
      options: {
        expand: true
      },
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    }
  }, {
    description: 'expands files objects when expand is on the root:',
    config: {
      expand: true,
      'foo/': 'test/fixtures/*.txt',
      'bar/': 'test/fixtures/*.txt'
    }
  }, {
    description: 'expands files objects when `src` is an array:',
    config: {
      options: {
        expand: true
      },
      'foo/': ['test/fixtures/*.txt'],
      'bar/': ['test/fixtures/*.txt']
    }
  }]
}, {
  section: 'options.flatten:',
  examples: [{
    description: 'flattens dest paths:',
    config: {
      options: {
        expand: true,
        flatten: true
      },
      src: 'test/fixtures/a/**/*.txt',
      dest: 'dest',
    }
  }, {
    description: 'does not flatten `dest` paths when `flatten` is false',
    config: {
      options: {
        expand: true,
        flatten: false
      },
      src: 'test/fixtures/a/**/*.txt',
      dest: 'dest',
    }
  }, {
    description: 'does not flatten `dest` paths when `flatten` is undefined:',
    config: {
      options: {
        expand: true
      },
      src: 'test/fixtures/a/**/*.txt',
      dest: 'dest',
    }
  }]
}, {
  section: 'trailing slashes:',
  examples: [{
    description: 'uses `dest` with or without trailing slash:',
    config: [{
      options: {
        expand: true
      },
      src: ['test/fixtures/**/*.txt'],
      dest: 'dest'
    }, {
      options: {
        expand: true
      },
      src: ['test/fixtures/**/*.txt'],
      dest: 'dest/'
    }]
  }, {
    description: 'flattens `dest` paths by joining pre-dest to src filepath:',
    config: {
      options: {
        expand: true,
        flatten: true
      },
      src: ['a/**/*.txt'],
      dest: 'dest'
    }
  }]
}, {
  section: 'options.ext:',
  examples: [{
    description: 'uses the specified extension on dest files:',
    config: {
      options: {
        expand: true,
        ext: '.foo'
      },
      src: ['**/foo.*/**'],
      dest: 'dest'
    }
  }, {
    description: 'uses extension when it is an empty string:',
    config: {
      options: {
        expand: true,
        ext: ''
      },
      src: ['a/**/*.txt'],
      dest: 'dest'
    }
  }]
}, {
  section: 'options.extDot:',
  examples: [{
    description: 'when `extDot` is `first`, everything after the first dot in the filename is replaced:',
    config: {
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'first'
      },
      src: ['foo.*/**'],
      dest: 'dest'
    }
  }, {
    description: 'when `extDot` is `last`, everything after the last dot in the filename is replaced:',
    config: {
      options: {
        expand: true,
        ext: '.foo',
        extDot: 'last'
      },
      src: ['foo.*/**'],
      dest: 'dest'
    }
  }]
}, {
  section: 'options.cwd:',
  examples: [{
    description: 'when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:',
    config: {
      options: {
        expand: true,
        cwd: 'a'
      },
      src: ['**/*.txt'],
      dest: 'dest'
    }
  }]
}, {
  section: 'options.rename:',
  examples: [{
    description: 'supports custom rename function:',
    config: {
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
    }
  }, {
    description: 'exposes target properties as `this` to the rename function:',
    config: {
      options: {
        cwd: 'test/fixtures',
        expand: true,
        filter: 'isFile',
        permalink: ':dest/:upper(basename)',
        upper: function (str) {
          return str.toUpperCase();
        },
        rename: function (dest, fp, options) {
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
      src: ['**/*'],
      dest: 'foo/bar'
    }
  }, {
    description: 'expanded `src` arrays are grouped by dest paths:',
    config: {
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
    }
  }, {
    description: 'supports filtering by `fs.lstat` type: `.isDirectory()`',
    config: {
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
    }
  }, {
    description: 'supports filtering by `fs.lstat` type: `.isFile()`',
    config: {
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
    }
  }]
}];
