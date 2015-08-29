# Patterns

## files-object mappings

> expands "files-objects" into src-dest mappings

```js
files({
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt',
      'test/fixtures/b.txt',
      'test/fixtures/c.txt',
      'test/fixtures/d.txt'
    ],
    dest: 'foo/'
  },
  {
    src: [
      'test/fixtures/a.txt',
      'test/fixtures/b.txt',
      'test/fixtures/c.txt',
      'test/fixtures/d.txt'
    ],
    dest: 'bar/'
  }
]
```

and...


```js
files({
  options: {
    expand: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'foo/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/test/fixtures/d.txt'
  },
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'bar/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'bar/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'bar/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'bar/test/fixtures/d.txt'
  }
]
```

## `src` normalization

> attempts to create node when no `src` exists

```js
files({
  foo: 'bar'
});
```

**results in**

```js
[
  {
    src: [],
    dest: 'foo',
    options: {}
  }
]
```

> arrayifies the `src` property

```js
files({
  src: 'a',
  dest: 'b'
});
```

**results in**

```js
[
  {
    src: [],
    dest: 'b',
    options: {}
  }
]
```

> expands `src` glob patterns:

```js
files({
  src: 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt',
      'test/fixtures/b.txt',
      'test/fixtures/c.txt',
      'test/fixtures/d.txt'
    ]
  }
]
```

> expands `src` glob patterns with `dest`:

```js
files({
  src: 'test/fixtures/*.txt',
  dest: 'dist/'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt',
      'test/fixtures/b.txt',
      'test/fixtures/c.txt',
      'test/fixtures/d.txt'
    ],
    dest: 'dist/'
  }
]
```

> expands `src` glob patterns with `dest` and `cwd`:

```js
files({
  options: {
    cwd: 'test/fixtures',
    expand: true
  },
  src: '*.txt',
  dest: 'dist/'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'dist/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'dist/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'dist/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'dist/d.txt'
  }
]
```

> uses a `cwd` to expand `src` glob patterns:

```js
files({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures'
  }
});
```

**results in**

```js
[
  {
    src: [
      'a.txt',
      'b.txt',
      'c.txt',
      'd.txt'
    ]
  }
]
```

## options.expand

> joins the `cwd` to expanded `src` paths:

```js
files({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures',
    expand: true
  }
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'd.txt'
  }
]
```

> expands `src` paths into src-dest mappings:

```js
files({
  src: 'test/fixtures/*.txt',
  options: {
    expand: true
  }
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'test/fixtures/d.txt'
  }
]
```

> creates `dest` properties using the `src` basename:

```js
files({
  options: {
    expand: true
  },
  src: 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'test/fixtures/d.txt'
  }
]
```

> does not prepend `cwd` to created `dest` mappings:

```js
files({
  options: {
    cwd: 'test/fixtures/',
    expand: true
  },
  src: '*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'd.txt'
  }
]
```

> expands `src` paths to src-dest mappings:

```js
files({
  src: '*.txt',
  options: {
    cwd: 'test/fixtures',
    expand: true
  }
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'd.txt'
  }
]
```

## files objects:

> expands files objects when `src` is a string:

```js
files({
  options: {
    expand: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'foo/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/test/fixtures/d.txt'
  },
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'bar/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'bar/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'bar/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'bar/test/fixtures/d.txt'
  }
]
```

> expands files objects when `expand` is on options:

```js
files({
  options: {
    expand: true
  },
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'foo/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/test/fixtures/d.txt'
  },
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'bar/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'bar/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'bar/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'bar/test/fixtures/d.txt'
  }
]
```

> expands files objects when expand is on the root:

```js
files({
  expand: true,
  'foo/': 'test/fixtures/*.txt',
  'bar/': 'test/fixtures/*.txt'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'foo/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/test/fixtures/d.txt'
  },
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'bar/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'bar/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'bar/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'bar/test/fixtures/d.txt'
  }
]
```

> expands files objects when `src` is an array:

```js
files({
  options: {
    expand: true
  },
  'foo/': [
    'test/fixtures/*.txt'
  ],
  'bar/': [
    'test/fixtures/*.txt'
  ]
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'foo/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/test/fixtures/d.txt'
  },
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'bar/test/fixtures/a.txt'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'bar/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'bar/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'bar/test/fixtures/d.txt'
  }
]
```

## options.flatten:

> flattens dest paths:

```js
files({
  options: {
    expand: true,
    flatten: true
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/aaa.txt'
  }
]
```

> does not flatten `dest` paths when `flatten` is false

```js
files({
  options: {
    expand: true,
    flatten: false
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/test/fixtures/a/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
  }
]
```

> does not flatten `dest` paths when `flatten` is undefined:

```js
files({
  options: {
    expand: true
  },
  src: 'test/fixtures/a/**/*.txt',
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/test/fixtures/a/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
  }
]
```

## trailing slashes:

> uses `dest` with or without trailing slash:

```js
files({
  options: {
    expand: true
  },
  src: [
    'test/fixtures/a/**/*.txt'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/test/fixtures/a/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
  }
]
```

and...


```js
files({
  options: {
    expand: true
  },
  src: [
    'test/fixtures/a/**/*.txt'
  ],
  dest: 'dest/'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/test/fixtures/a/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aaa/aaa.txt'
  }
]
```

> flattens `dest` paths by joining pre-dest to src filepath:

```js
files({
  options: {
    expand: true,
    flatten: true
  },
  src: [
    'test/fixtures/a/**/*.txt'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/a.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/aa.txt'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/aaa.txt'
  }
]
```

## options.ext:

> uses the specified extension on dest files:

```js
files({
  options: {
    expand: true,
    ext: '.foo'
  },
  src: [
    'test/fixtures/**/foo.*/**'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/foo.bar'
    ],
    dest: 'dest/test/fixtures/foo.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/foo'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
  }
]
```

> uses extension when it is an empty string:

```js
files({
  options: {
    expand: true,
    ext: ''
  },
  src: [
    'test/fixtures/a/**/*.txt'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt'
    ],
    dest: 'dest/test/fixtures/a/a'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aa'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/test/fixtures/a/aa/aaa/aaa'
  }
]
```

## options.extDot:

> when `extDot` is `first`, everything after the first dot in the filename is replaced:

```js
files({
  options: {
    expand: true,
    ext: '.foo',
    extDot: 'first'
  },
  src: [
    'test/fixtures/foo.*/**'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/foo.bar'
    ],
    dest: 'dest/test/fixtures/foo.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/foo'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
  }
]
```

> when `extDot` is `last`, everything after the last dot in the filename is replaced:

```js
files({
  options: {
    expand: true,
    ext: '.foo',
    extDot: 'last'
  },
  src: [
    'test/fixtures/foo.*/**'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/foo.bar'
    ],
    dest: 'dest/test/fixtures/foo.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/fez.faz/x.y.foo'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/foo'
    ],
    dest: 'dest/test/fixtures/foo.bar/baz.qux/foo.foo'
  }
]
```

## options.cwd:

> when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:

```js
files({
  options: {
    expand: true,
    cwd: 'a'
  },
  src: [
    'test/fixtures/**/*.txt'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    options: {
      expand: true,
      cwd: 'a'
    },
    src: [],
    dest: 'dest'
  }
]
```

## options.rename:

> supports custom rename function:

```js
files({
  options: {
    expand: true,
    flatten: true,
    cwd: 'a',
    rename: function (dest, fp, options) {
          return path.join(dest, options.cwd, 'foo', fp);
        }
  },
  src: [
    'test/fixtures/**/*.txt'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    options: {
      expand: true,
      flatten: true,
      cwd: 'a',
      rename: function (dest, fp, options) {
          return path.join(dest, options.cwd, 'foo', fp);
        }
    },
    src: [],
    dest: 'dest'
  }
]
```

> exposes target properties as `this` to the rename function:

```js
files({
  options: {
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
  src: [
    'test/fixtures/**/*'
  ],
  dest: 'foo/bar'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt',
      'test/fixtures/a/a.txt'
    ],
    dest: 'foo/bar/A.TXT'
  },
  {
    src: [
      'test/fixtures/a/aa/aa.txt'
    ],
    dest: 'foo/bar/AA.TXT'
  },
  {
    src: [
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'foo/bar/AAA.TXT'
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'foo/bar/B.TXT'
  },
  {
    src: [
      'test/fixtures/b/alpha.js'
    ],
    dest: 'foo/bar/ALPHA.JS'
  },
  {
    src: [
      'test/fixtures/b/beta.js'
    ],
    dest: 'foo/bar/BETA.JS'
  },
  {
    src: [
      'test/fixtures/b/gamma.js'
    ],
    dest: 'foo/bar/GAMMA.JS'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'foo/bar/C.TXT'
  },
  {
    src: [
      'test/fixtures/c/apple.coffee'
    ],
    dest: 'foo/bar/APPLE.COFFEE'
  },
  {
    src: [
      'test/fixtures/c/celery.coffee'
    ],
    dest: 'foo/bar/CELERY.COFFEE'
  },
  {
    src: [
      'test/fixtures/c/walnut.coffee'
    ],
    dest: 'foo/bar/WALNUT.COFFEE'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'foo/bar/D.TXT'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/fez.faz/x.y.z'
    ],
    dest: 'foo/bar/X.Y.Z'
  },
  {
    src: [
      'test/fixtures/foo.bar/baz.qux/foo'
    ],
    dest: 'foo/bar/FOO'
  },
  {
    src: [
      'test/fixtures/one.md'
    ],
    dest: 'foo/bar/ONE.MD'
  },
  {
    src: [
      'test/fixtures/three.md'
    ],
    dest: 'foo/bar/THREE.MD'
  },
  {
    src: [
      'test/fixtures/two.md'
    ],
    dest: 'foo/bar/TWO.MD'
  },
  {
    src: [
      'test/fixtures/x.js'
    ],
    dest: 'foo/bar/X.JS'
  },
  {
    src: [
      'test/fixtures/y.js'
    ],
    dest: 'foo/bar/Y.JS'
  },
  {
    src: [
      'test/fixtures/z.js'
    ],
    dest: 'foo/bar/Z.JS'
  }
]
```

> expanded `src` arrays are grouped by dest paths:

```js
files({
  options: {
    expand: true,
    flatten: true,
    cwd: '',
    rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
  },
  src: [
    'test/fixtures/{a,b}/**/*'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt',
      'test/fixtures/a/aa/aa.txt',
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/all.txt'
  },
  {
    src: [
      'test/fixtures/a/aa',
      'test/fixtures/a/aa/aaa'
    ],
    dest: 'dest/all'
  },
  {
    src: [
      'test/fixtures/b/alpha.js',
      'test/fixtures/b/beta.js',
      'test/fixtures/b/gamma.js'
    ],
    dest: 'dest/all.js'
  }
]
```

> supports filtering by `fs.lstat` type: `.isDirectory()`

```js
files({
  options: {
    expand: true,
    flatten: true,
    filter: 'isDirectory',
    rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
  },
  src: [
    'test/fixtures/{a,b}/**/*'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/aa',
      'test/fixtures/a/aa/aaa'
    ],
    dest: 'dest/all'
  }
]
```

> supports filtering by `fs.lstat` type: `.isFile()`

```js
files({
  options: {
    expand: true,
    flatten: true,
    filter: 'isFile',
    rename: function (dest, fp) {
          return path.join(dest, 'all' + path.extname(fp));
        }
  },
  src: [
    'test/fixtures/{a,b}/**/*'
  ],
  dest: 'dest'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a/a.txt',
      'test/fixtures/a/aa/aa.txt',
      'test/fixtures/a/aa/aaa/aaa.txt'
    ],
    dest: 'dest/all.txt'
  },
  {
    src: [
      'test/fixtures/b/alpha.js',
      'test/fixtures/b/beta.js',
      'test/fixtures/b/gamma.js'
    ],
    dest: 'dest/all.js'
  }
]
```


