### expand patterns

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

### options.expand

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

### files objects:

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

### options.flatten:

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

### trailing slashes:

> uses `dest` with or without trailing slash:

```js
files({
  options: {
    expand: true
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
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'dest/test/fixtures/a.txt'
  },
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
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'dest/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'dest/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'dest/test/fixtures/d.txt'
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
    'test/fixtures/**/*.txt'
  ],
  dest: 'dest/'
});
```

**results in**

```js
[
  {
    src: [
      'test/fixtures/a.txt'
    ],
    dest: 'dest/test/fixtures/a.txt'
  },
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
  },
  {
    src: [
      'test/fixtures/b.txt'
    ],
    dest: 'dest/test/fixtures/b.txt'
  },
  {
    src: [
      'test/fixtures/c.txt'
    ],
    dest: 'dest/test/fixtures/c.txt'
  },
  {
    src: [
      'test/fixtures/d.txt'
    ],
    dest: 'dest/test/fixtures/d.txt'
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
    'a/**/*.txt'
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
      flatten: true
    },
    src: [],
    dest: 'dest'
  }
]
```

### options.ext:

> uses the specified extension on dest files:

```js
files({
  options: {
    expand: true,
    ext: '.foo'
  },
  src: [
    '**/foo.*/**'
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
    'a/**/*.txt'
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
      ext: ''
    },
    src: [],
    dest: 'dest'
  }
]
```

### options.extDot:

> when `extDot` is `first`, everything after the first dot in the filename is replaced:

```js
files({
  options: {
    expand: true,
    ext: '.foo',
    extDot: 'first'
  },
  src: [
    'foo.*/**'
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
      ext: '.foo',
      extDot: 'first'
    },
    src: [],
    dest: 'dest'
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
    'foo.*/**'
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
      ext: '.foo',
      extDot: 'last'
    },
    src: [],
    dest: 'dest'
  }
]
```

### options.cwd:

> when `cwd` is defined, the cwd is stripped from the filepath before joining to dest:

```js
files({
  options: {
    expand: true,
    cwd: 'a'
  },
  src: [
    '**/*.txt'
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

### options.rename:

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
    '**/*.txt'
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
    '**/*'
  ],
  dest: 'foo/bar'
});
```

**results in**

```js
[
  {
    src: [
      'examples.md'
    ],
    dest: 'foo/bar/EXAMPLES.MD'
  },
  {
    src: [
      'examples/files-objects.js'
    ],
    dest: 'foo/bar/FILES-OBJECTS.JS'
  },
  {
    src: [
      'examples/options.js',
      'node_modules/mocha/bin/options.js'
    ],
    dest: 'foo/bar/OPTIONS.JS'
  },
  {
    src: [
      'examples/src.js'
    ],
    dest: 'foo/bar/SRC.JS'
  },
  {
    src: [
      'index.js',
      'node_modules/clone-deep/index.js',
      'node_modules/clone-deep/node_modules/for-own/index.js',
      'node_modules/clone-deep/node_modules/is-plain-object/index.js',
      'node_modules/clone-deep/node_modules/is-plain-object/node_modules/isobject/index.js',
      'node_modules/clone-deep/node_modules/kind-of/index.js',
      'node_modules/clone-deep/node_modules/kind-of/node_modules/is-buffer/index.js',
      'node_modules/clone-deep/node_modules/lazy-cache/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/is-extendable/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/node_modules/ansi-wrap/index.js',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/mixin-object/index.js',
      'node_modules/data-store/index.js',
      'node_modules/data-store/node_modules/collection-visit/index.js',
      'node_modules/data-store/node_modules/collection-visit/node_modules/map-visit/index.js',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/index.js',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/index.js',
      'node_modules/data-store/node_modules/component-emitter/index.js',
      'node_modules/data-store/node_modules/extend-shallow/index.js',
      'node_modules/data-store/node_modules/extend-shallow/node_modules/is-extendable/index.js',
      'node_modules/data-store/node_modules/get-value/index.js',
      'node_modules/data-store/node_modules/get-value/node_modules/isobject/index.js',
      'node_modules/data-store/node_modules/get-value/node_modules/noncharacters/index.js',
      'node_modules/data-store/node_modules/has-own-deep/index.js',
      'node_modules/data-store/node_modules/has-value/index.js',
      'node_modules/data-store/node_modules/has-value/node_modules/has-values/index.js',
      'node_modules/data-store/node_modules/kind-of/index.js',
      'node_modules/data-store/node_modules/kind-of/node_modules/is-buffer/index.js',
      'node_modules/data-store/node_modules/lazy-cache/index.js',
      'node_modules/data-store/node_modules/mkdirp/index.js',
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/index.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/index.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/index.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/index.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/path-is-absolute/index.js',
      'node_modules/data-store/node_modules/set-value/index.js',
      'node_modules/data-store/node_modules/set-value/node_modules/isobject/index.js',
      'node_modules/data-store/node_modules/set-value/node_modules/noncharacters/index.js',
      'node_modules/data-store/node_modules/union-value/index.js',
      'node_modules/data-store/node_modules/union-value/node_modules/arr-union/index.js',
      'node_modules/data-store/node_modules/union-value/node_modules/is-extendable/index.js',
      'node_modules/expand/index.js',
      'node_modules/expand/node_modules/engine/index.js',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/index.js',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/node_modules/is-extendable/index.js',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/index.js',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/map-visit/index.js',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/index.js',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/index.js',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/index.js',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/index.js',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/node_modules/for-in/index.js',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/is-extendable/index.js',
      'node_modules/expand/node_modules/engine/node_modules/set-value/index.js',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/isobject/index.js',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/noncharacters/index.js',
      'node_modules/expand/node_modules/get-value/index.js',
      'node_modules/expand/node_modules/get-value/node_modules/isobject/index.js',
      'node_modules/expand/node_modules/get-value/node_modules/noncharacters/index.js',
      'node_modules/expand/node_modules/is-primitive/index.js',
      'node_modules/expand/node_modules/kind-of/index.js',
      'node_modules/expand/node_modules/kind-of/node_modules/is-buffer/index.js',
      'node_modules/expand/node_modules/lazy-cache/index.js',
      'node_modules/files-objects/index.js',
      'node_modules/files-objects/node_modules/extend-shallow/index.js',
      'node_modules/files-objects/node_modules/extend-shallow/node_modules/is-extendable/index.js',
      'node_modules/for-in/index.js',
      'node_modules/globby/index.js',
      'node_modules/globby/node_modules/array-union/index.js',
      'node_modules/globby/node_modules/array-union/node_modules/array-uniq/index.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/index.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/index.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/index.js',
      'node_modules/globby/node_modules/glob/node_modules/path-is-absolute/index.js',
      'node_modules/globby/node_modules/object-assign/index.js',
      'node_modules/mixin-deep/index.js',
      'node_modules/mixin-deep/node_modules/is-extendable/index.js',
      'node_modules/mocha/index.js',
      'node_modules/mocha/lib/interfaces/index.js',
      'node_modules/mocha/lib/reporters/index.js',
      'node_modules/mocha/node_modules/commander/index.js',
      'node_modules/mocha/node_modules/debug/node_modules/ms/index.js',
      'node_modules/mocha/node_modules/escape-string-regexp/index.js',
      'node_modules/mocha/node_modules/jade/index.js',
      'node_modules/mocha/node_modules/jade/lib/nodes/index.js',
      'node_modules/mocha/node_modules/jade/node_modules/commander/index.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/index.js',
      'node_modules/mocha/node_modules/jade/testing/index.js',
      'node_modules/mocha/node_modules/mkdirp/index.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/index.js',
      'node_modules/mocha/node_modules/supports-color/index.js',
      'node_modules/object.omit/index.js',
      'node_modules/object.omit/node_modules/for-own/index.js',
      'node_modules/object.omit/node_modules/is-extendable/index.js',
      'node_modules/object.pick/index.js',
      'node_modules/parse-filepath/index.js',
      'node_modules/parse-filepath/node_modules/is-absolute/index.js',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/index.js',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/index.js',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/node_modules/unc-path-regex/index.js',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-windows/index.js',
      'node_modules/parse-filepath/node_modules/map-cache/index.js',
      'node_modules/should/index.js',
      'node_modules/should/node_modules/should-equal/index.js',
      'node_modules/should/node_modules/should-format/index.js',
      'node_modules/should/node_modules/should-type/index.js',
      'node_modules/stringify-object/index.js',
      'node_modules/stringify-object/node_modules/is-plain-obj/index.js',
      'node_modules/stringify-object/node_modules/is-regexp/index.js',
      'node_modules/to-clipboard/index.js'
    ],
    dest: 'foo/bar/INDEX.JS'
  },
  {
    src: [
      'lib/reserved.js',
      'node_modules/files-objects/reserved.js'
    ],
    dest: 'foo/bar/RESERVED.JS'
  },
  {
    src: [
      'lib/utils.js',
      'node_modules/expand/node_modules/engine/lib/utils.js',
      'node_modules/expand/utils.js',
      'node_modules/mocha/lib/utils.js',
      'node_modules/mocha/node_modules/jade/lib/utils.js',
      'test/support/utils.js'
    ],
    dest: 'foo/bar/UTILS.JS'
  },
  {
    src: [
      'LICENSE',
      'node_modules/clone-deep/LICENSE',
      'node_modules/clone-deep/node_modules/for-own/LICENSE',
      'node_modules/clone-deep/node_modules/is-plain-object/LICENSE',
      'node_modules/clone-deep/node_modules/is-plain-object/node_modules/isobject/LICENSE',
      'node_modules/clone-deep/node_modules/kind-of/LICENSE',
      'node_modules/clone-deep/node_modules/kind-of/node_modules/is-buffer/LICENSE',
      'node_modules/clone-deep/node_modules/lazy-cache/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/is-extendable/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/node_modules/ansi-wrap/LICENSE',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/mixin-object/LICENSE',
      'node_modules/data-store/LICENSE',
      'node_modules/data-store/node_modules/collection-visit/LICENSE',
      'node_modules/data-store/node_modules/collection-visit/node_modules/map-visit/LICENSE',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/LICENSE',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/LICENSE',
      'node_modules/data-store/node_modules/component-emitter/LICENSE',
      'node_modules/data-store/node_modules/extend-shallow/LICENSE',
      'node_modules/data-store/node_modules/extend-shallow/node_modules/is-extendable/LICENSE',
      'node_modules/data-store/node_modules/get-value/LICENSE',
      'node_modules/data-store/node_modules/get-value/node_modules/isobject/LICENSE',
      'node_modules/data-store/node_modules/get-value/node_modules/noncharacters/LICENSE',
      'node_modules/data-store/node_modules/graceful-fs/LICENSE',
      'node_modules/data-store/node_modules/has-own-deep/LICENSE',
      'node_modules/data-store/node_modules/has-value/LICENSE',
      'node_modules/data-store/node_modules/has-value/node_modules/has-values/LICENSE',
      'node_modules/data-store/node_modules/kind-of/LICENSE',
      'node_modules/data-store/node_modules/kind-of/node_modules/is-buffer/LICENSE',
      'node_modules/data-store/node_modules/lazy-cache/LICENSE',
      'node_modules/data-store/node_modules/mkdirp/LICENSE',
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/LICENSE',
      'node_modules/data-store/node_modules/rimraf/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/node_modules/wrappy/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/node_modules/wrappy/LICENSE',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/path-is-absolute/license',
      'node_modules/data-store/node_modules/set-value/LICENSE',
      'node_modules/data-store/node_modules/set-value/node_modules/isobject/LICENSE',
      'node_modules/data-store/node_modules/set-value/node_modules/noncharacters/LICENSE',
      'node_modules/data-store/node_modules/union-value/LICENSE',
      'node_modules/data-store/node_modules/union-value/node_modules/arr-union/LICENSE',
      'node_modules/data-store/node_modules/union-value/node_modules/is-extendable/LICENSE',
      'node_modules/expand/LICENSE',
      'node_modules/expand/node_modules/engine/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/node_modules/is-extendable/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/map-visit/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/node_modules/for-in/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/is-extendable/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/set-value/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/isobject/LICENSE',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/noncharacters/LICENSE',
      'node_modules/expand/node_modules/get-value/LICENSE',
      'node_modules/expand/node_modules/get-value/node_modules/isobject/LICENSE',
      'node_modules/expand/node_modules/get-value/node_modules/noncharacters/LICENSE',
      'node_modules/expand/node_modules/is-primitive/LICENSE',
      'node_modules/expand/node_modules/kind-of/LICENSE',
      'node_modules/expand/node_modules/kind-of/node_modules/is-buffer/LICENSE',
      'node_modules/expand/node_modules/lazy-cache/LICENSE',
      'node_modules/files-objects/LICENSE',
      'node_modules/files-objects/node_modules/extend-shallow/LICENSE',
      'node_modules/files-objects/node_modules/extend-shallow/node_modules/is-extendable/LICENSE',
      'node_modules/for-in/LICENSE',
      'node_modules/globby/license',
      'node_modules/globby/node_modules/async/LICENSE',
      'node_modules/globby/node_modules/glob/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/inflight/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/inflight/node_modules/wrappy/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/inherits/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/once/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/once/node_modules/wrappy/LICENSE',
      'node_modules/globby/node_modules/glob/node_modules/path-is-absolute/license',
      'node_modules/globby/node_modules/object-assign/license',
      'node_modules/mixin-deep/LICENSE',
      'node_modules/mixin-deep/node_modules/is-extendable/LICENSE',
      'node_modules/mocha/LICENSE',
      'node_modules/mocha/node_modules/glob/LICENSE',
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/LICENSE',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/LICENSE',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/LICENSE',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/LICENSE',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/LICENSE',
      'node_modules/mocha/node_modules/jade/LICENSE',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/LICENSE',
      'node_modules/mocha/node_modules/mkdirp/LICENSE',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/LICENSE',
      'node_modules/mocha/node_modules/supports-color/license',
      'node_modules/object.omit/LICENSE',
      'node_modules/object.omit/node_modules/for-own/LICENSE',
      'node_modules/object.omit/node_modules/is-extendable/LICENSE',
      'node_modules/parse-filepath/LICENSE',
      'node_modules/parse-filepath/node_modules/is-absolute/LICENSE',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/LICENSE',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/LICENSE',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/node_modules/unc-path-regex/LICENSE',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-windows/LICENSE',
      'node_modules/parse-filepath/node_modules/map-cache/LICENSE',
      'node_modules/should/LICENSE',
      'node_modules/should/node_modules/should-equal/LICENSE',
      'node_modules/should/node_modules/should-format/LICENSE',
      'node_modules/should/node_modules/should-type/LICENSE',
      'node_modules/stringify-object/license',
      'node_modules/stringify-object/node_modules/is-plain-obj/license',
      'node_modules/to-clipboard/LICENSE'
    ],
    dest: 'foo/bar/LICENSE'
  },
  {
    src: [
      'node_modules/clone-deep/node_modules/for-own/package.json',
      'node_modules/clone-deep/node_modules/is-plain-object/node_modules/isobject/package.json',
      'node_modules/clone-deep/node_modules/is-plain-object/package.json',
      'node_modules/clone-deep/node_modules/kind-of/node_modules/is-buffer/package.json',
      'node_modules/clone-deep/node_modules/kind-of/package.json',
      'node_modules/clone-deep/node_modules/lazy-cache/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/is-extendable/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/node_modules/ansi-wrap/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/mixin-object/package.json',
      'node_modules/clone-deep/node_modules/shallow-clone/package.json',
      'node_modules/clone-deep/package.json',
      'node_modules/data-store/node_modules/collection-visit/node_modules/map-visit/package.json',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/package.json',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/package.json',
      'node_modules/data-store/node_modules/collection-visit/package.json',
      'node_modules/data-store/node_modules/component-emitter/package.json',
      'node_modules/data-store/node_modules/extend-shallow/node_modules/is-extendable/package.json',
      'node_modules/data-store/node_modules/extend-shallow/package.json',
      'node_modules/data-store/node_modules/get-value/node_modules/isobject/package.json',
      'node_modules/data-store/node_modules/get-value/node_modules/noncharacters/package.json',
      'node_modules/data-store/node_modules/get-value/package.json',
      'node_modules/data-store/node_modules/graceful-fs/package.json',
      'node_modules/data-store/node_modules/has-own-deep/package.json',
      'node_modules/data-store/node_modules/has-value/node_modules/has-values/package.json',
      'node_modules/data-store/node_modules/has-value/package.json',
      'node_modules/data-store/node_modules/kind-of/node_modules/is-buffer/package.json',
      'node_modules/data-store/node_modules/kind-of/package.json',
      'node_modules/data-store/node_modules/lazy-cache/package.json',
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/package.json',
      'node_modules/data-store/node_modules/mkdirp/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/node_modules/wrappy/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/node_modules/wrappy/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/path-is-absolute/package.json',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/package.json',
      'node_modules/data-store/node_modules/rimraf/package.json',
      'node_modules/data-store/node_modules/set-value/node_modules/isobject/package.json',
      'node_modules/data-store/node_modules/set-value/node_modules/noncharacters/package.json',
      'node_modules/data-store/node_modules/set-value/package.json',
      'node_modules/data-store/node_modules/union-value/node_modules/arr-union/package.json',
      'node_modules/data-store/node_modules/union-value/node_modules/is-extendable/package.json',
      'node_modules/data-store/node_modules/union-value/package.json',
      'node_modules/data-store/package.json',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/node_modules/is-extendable/package.json',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/package.json',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/map-visit/package.json',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/package.json',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/package.json',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/package.json',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/node_modules/for-in/package.json',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/package.json',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/is-extendable/package.json',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/package.json',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/isobject/package.json',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/noncharacters/package.json',
      'node_modules/expand/node_modules/engine/node_modules/set-value/package.json',
      'node_modules/expand/node_modules/engine/package.json',
      'node_modules/expand/node_modules/get-value/node_modules/isobject/package.json',
      'node_modules/expand/node_modules/get-value/node_modules/noncharacters/package.json',
      'node_modules/expand/node_modules/get-value/package.json',
      'node_modules/expand/node_modules/is-primitive/package.json',
      'node_modules/expand/node_modules/kind-of/node_modules/is-buffer/package.json',
      'node_modules/expand/node_modules/kind-of/package.json',
      'node_modules/expand/node_modules/lazy-cache/package.json',
      'node_modules/expand/package.json',
      'node_modules/files-objects/node_modules/extend-shallow/node_modules/is-extendable/package.json',
      'node_modules/files-objects/node_modules/extend-shallow/package.json',
      'node_modules/files-objects/package.json',
      'node_modules/for-in/package.json',
      'node_modules/globby/node_modules/array-union/node_modules/array-uniq/package.json',
      'node_modules/globby/node_modules/array-union/package.json',
      'node_modules/globby/node_modules/async/package.json',
      'node_modules/globby/node_modules/glob/node_modules/inflight/node_modules/wrappy/package.json',
      'node_modules/globby/node_modules/glob/node_modules/inflight/package.json',
      'node_modules/globby/node_modules/glob/node_modules/inherits/package.json',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/package.json',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/package.json',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/package.json',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/package.json',
      'node_modules/globby/node_modules/glob/node_modules/once/node_modules/wrappy/package.json',
      'node_modules/globby/node_modules/glob/node_modules/once/package.json',
      'node_modules/globby/node_modules/glob/node_modules/path-is-absolute/package.json',
      'node_modules/globby/node_modules/glob/package.json',
      'node_modules/globby/node_modules/object-assign/package.json',
      'node_modules/globby/package.json',
      'node_modules/mixin-deep/node_modules/is-extendable/package.json',
      'node_modules/mixin-deep/package.json',
      'node_modules/mocha/node_modules/commander/package.json',
      'node_modules/mocha/node_modules/debug/node_modules/ms/package.json',
      'node_modules/mocha/node_modules/debug/package.json',
      'node_modules/mocha/node_modules/diff/package.json',
      'node_modules/mocha/node_modules/escape-string-regexp/package.json',
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/package.json',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/package.json',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/package.json',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/package.json',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/package.json',
      'node_modules/mocha/node_modules/glob/package.json',
      'node_modules/mocha/node_modules/growl/package.json',
      'node_modules/mocha/node_modules/jade/node_modules/commander/package.json',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/package.json',
      'node_modules/mocha/node_modules/jade/package.json',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/package.json',
      'node_modules/mocha/node_modules/mkdirp/package.json',
      'node_modules/mocha/node_modules/supports-color/package.json',
      'node_modules/mocha/package.json',
      'node_modules/object.omit/node_modules/for-own/package.json',
      'node_modules/object.omit/node_modules/is-extendable/package.json',
      'node_modules/object.omit/package.json',
      'node_modules/object.pick/package.json',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/node_modules/unc-path-regex/package.json',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/package.json',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/package.json',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-windows/package.json',
      'node_modules/parse-filepath/node_modules/is-absolute/package.json',
      'node_modules/parse-filepath/node_modules/map-cache/package.json',
      'node_modules/parse-filepath/package.json',
      'node_modules/should/node_modules/should-equal/package.json',
      'node_modules/should/node_modules/should-format/package.json',
      'node_modules/should/node_modules/should-type/package.json',
      'node_modules/should/package.json',
      'node_modules/stringify-object/node_modules/is-plain-obj/package.json',
      'node_modules/stringify-object/node_modules/is-regexp/package.json',
      'node_modules/stringify-object/package.json',
      'node_modules/to-clipboard/node_modules/shell-escape/package.json',
      'node_modules/to-clipboard/package.json',
      'package.json'
    ],
    dest: 'foo/bar/PACKAGE.JSON'
  },
  {
    src: [
      'node_modules/clone-deep/node_modules/for-own/README.md',
      'node_modules/clone-deep/node_modules/is-plain-object/node_modules/isobject/README.md',
      'node_modules/clone-deep/node_modules/is-plain-object/README.md',
      'node_modules/clone-deep/node_modules/kind-of/node_modules/is-buffer/README.md',
      'node_modules/clone-deep/node_modules/kind-of/README.md',
      'node_modules/clone-deep/node_modules/lazy-cache/README.md',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/is-extendable/README.md',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/node_modules/ansi-wrap/README.md',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/node_modules/ansi-yellow/readme.md',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/lazy-cache/README.md',
      'node_modules/clone-deep/node_modules/shallow-clone/node_modules/mixin-object/README.md',
      'node_modules/clone-deep/node_modules/shallow-clone/README.md',
      'node_modules/clone-deep/README.md',
      'node_modules/data-store/node_modules/collection-visit/node_modules/map-visit/README.md',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/README.md',
      'node_modules/data-store/node_modules/collection-visit/node_modules/object-visit/README.md',
      'node_modules/data-store/node_modules/collection-visit/README.md',
      'node_modules/data-store/node_modules/component-emitter/Readme.md',
      'node_modules/data-store/node_modules/extend-shallow/node_modules/is-extendable/README.md',
      'node_modules/data-store/node_modules/extend-shallow/README.md',
      'node_modules/data-store/node_modules/get-value/node_modules/isobject/README.md',
      'node_modules/data-store/node_modules/get-value/node_modules/noncharacters/README.md',
      'node_modules/data-store/node_modules/get-value/README.md',
      'node_modules/data-store/node_modules/graceful-fs/README.md',
      'node_modules/data-store/node_modules/has-own-deep/README.md',
      'node_modules/data-store/node_modules/has-value/node_modules/has-values/README.md',
      'node_modules/data-store/node_modules/has-value/README.md',
      'node_modules/data-store/node_modules/kind-of/node_modules/is-buffer/README.md',
      'node_modules/data-store/node_modules/kind-of/README.md',
      'node_modules/data-store/node_modules/lazy-cache/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/node_modules/wrappy/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/node_modules/wrappy/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/README.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/path-is-absolute/readme.md',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/README.md',
      'node_modules/data-store/node_modules/rimraf/README.md',
      'node_modules/data-store/node_modules/set-value/node_modules/isobject/README.md',
      'node_modules/data-store/node_modules/set-value/node_modules/noncharacters/README.md',
      'node_modules/data-store/node_modules/set-value/README.md',
      'node_modules/data-store/node_modules/union-value/node_modules/arr-union/README.md',
      'node_modules/data-store/node_modules/union-value/node_modules/is-extendable/README.md',
      'node_modules/data-store/node_modules/union-value/README.md',
      'node_modules/data-store/README.md',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/node_modules/is-extendable/README.md',
      'node_modules/expand/node_modules/engine/node_modules/assign-deep/README.md',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/map-visit/README.md',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/node_modules/isobject/README.md',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/node_modules/object-visit/README.md',
      'node_modules/expand/node_modules/engine/node_modules/collection-visit/README.md',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/node_modules/for-in/README.md',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/for-own/README.md',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/node_modules/is-extendable/README.md',
      'node_modules/expand/node_modules/engine/node_modules/object.omit/README.md',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/isobject/README.md',
      'node_modules/expand/node_modules/engine/node_modules/set-value/node_modules/noncharacters/README.md',
      'node_modules/expand/node_modules/engine/node_modules/set-value/README.md',
      'node_modules/expand/node_modules/engine/README.md',
      'node_modules/expand/node_modules/get-value/node_modules/isobject/README.md',
      'node_modules/expand/node_modules/get-value/node_modules/noncharacters/README.md',
      'node_modules/expand/node_modules/get-value/README.md',
      'node_modules/expand/node_modules/is-primitive/README.md',
      'node_modules/expand/node_modules/kind-of/node_modules/is-buffer/README.md',
      'node_modules/expand/node_modules/kind-of/README.md',
      'node_modules/expand/node_modules/lazy-cache/README.md',
      'node_modules/expand/README.md',
      'node_modules/files-objects/node_modules/extend-shallow/node_modules/is-extendable/README.md',
      'node_modules/files-objects/node_modules/extend-shallow/README.md',
      'node_modules/files-objects/README.md',
      'node_modules/for-in/README.md',
      'node_modules/globby/node_modules/array-union/node_modules/array-uniq/readme.md',
      'node_modules/globby/node_modules/array-union/readme.md',
      'node_modules/globby/node_modules/glob/node_modules/inflight/node_modules/wrappy/README.md',
      'node_modules/globby/node_modules/glob/node_modules/inflight/README.md',
      'node_modules/globby/node_modules/glob/node_modules/inherits/README.md',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/README.md',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/README.md',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/README.md',
      'node_modules/globby/node_modules/glob/node_modules/once/node_modules/wrappy/README.md',
      'node_modules/globby/node_modules/glob/node_modules/once/README.md',
      'node_modules/globby/node_modules/glob/node_modules/path-is-absolute/readme.md',
      'node_modules/globby/node_modules/glob/README.md',
      'node_modules/globby/node_modules/object-assign/readme.md',
      'node_modules/globby/readme.md',
      'node_modules/mixin-deep/node_modules/is-extendable/README.md',
      'node_modules/mixin-deep/README.md',
      'node_modules/mocha/node_modules/commander/Readme.md',
      'node_modules/mocha/node_modules/debug/node_modules/ms/README.md',
      'node_modules/mocha/node_modules/debug/Readme.md',
      'node_modules/mocha/node_modules/diff/README.md',
      'node_modules/mocha/node_modules/escape-string-regexp/readme.md',
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/README.md',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/README.md',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/README.md',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/README.md',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/README.md',
      'node_modules/mocha/node_modules/glob/README.md',
      'node_modules/mocha/node_modules/growl/Readme.md',
      'node_modules/mocha/node_modules/jade/node_modules/commander/Readme.md',
      'node_modules/mocha/node_modules/supports-color/readme.md',
      'node_modules/mocha/README.md',
      'node_modules/object.omit/node_modules/for-own/README.md',
      'node_modules/object.omit/node_modules/is-extendable/README.md',
      'node_modules/object.omit/README.md',
      'node_modules/object.pick/README.md',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/node_modules/unc-path-regex/README.md',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/node_modules/is-unc-path/README.md',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-relative/README.md',
      'node_modules/parse-filepath/node_modules/is-absolute/node_modules/is-windows/README.md',
      'node_modules/parse-filepath/node_modules/is-absolute/README.md',
      'node_modules/parse-filepath/node_modules/map-cache/README.md',
      'node_modules/parse-filepath/README.md',
      'node_modules/should/node_modules/should-equal/README.md',
      'node_modules/should/node_modules/should-format/README.md',
      'node_modules/should/node_modules/should-type/README.md',
      'node_modules/should/Readme.md',
      'node_modules/stringify-object/node_modules/is-plain-obj/readme.md',
      'node_modules/stringify-object/node_modules/is-regexp/readme.md',
      'node_modules/stringify-object/readme.md',
      'node_modules/to-clipboard/node_modules/shell-escape/README.md',
      'node_modules/to-clipboard/README.md',
      'README.md'
    ],
    dest: 'foo/bar/README.MD'
  },
  {
    src: [
      'node_modules/clone-deep/node_modules/kind-of/node_modules/is-buffer/test/basic.js',
      'node_modules/data-store/node_modules/kind-of/node_modules/is-buffer/test/basic.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/node_modules/wrappy/test/basic.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/node_modules/wrappy/test/basic.js',
      'node_modules/expand/node_modules/kind-of/node_modules/is-buffer/test/basic.js',
      'node_modules/globby/node_modules/glob/node_modules/inflight/node_modules/wrappy/test/basic.js',
      'node_modules/globby/node_modules/glob/node_modules/once/node_modules/wrappy/test/basic.js',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/test/basic.js',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/test/basic.js',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/test/basic.js'
    ],
    dest: 'foo/bar/BASIC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/component-emitter/History.md',
      'node_modules/mocha/node_modules/debug/History.md',
      'node_modules/mocha/node_modules/growl/History.md',
      'node_modules/mocha/node_modules/jade/node_modules/commander/History.md',
      'node_modules/should/History.md'
    ],
    dest: 'foo/bar/HISTORY.MD'
  },
  {
    src: [
      'node_modules/data-store/node_modules/graceful-fs/fs.js',
      'node_modules/mocha/lib/browser/fs.js'
    ],
    dest: 'foo/bar/FS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/graceful-fs/graceful-fs.js',
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/graceful-fs.js'
    ],
    dest: 'foo/bar/GRACEFUL-FS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/graceful-fs/legacy-streams.js'
    ],
    dest: 'foo/bar/LEGACY-STREAMS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/graceful-fs/polyfills.js',
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/polyfills.js'
    ],
    dest: 'foo/bar/POLYFILLS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/bin/cmd.js',
      'node_modules/mocha/node_modules/mkdirp/bin/cmd.js'
    ],
    dest: 'foo/bar/CMD.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/bin/usage.txt',
      'node_modules/mocha/node_modules/mkdirp/bin/usage.txt'
    ],
    dest: 'foo/bar/USAGE.TXT'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/examples/pow.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/examples/pow.js',
      'node_modules/mocha/node_modules/mkdirp/examples/pow.js'
    ],
    dest: 'foo/bar/POW.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/example/parse.js',
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/parse.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/example/parse.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/parse.js'
    ],
    dest: 'foo/bar/PARSE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/readme.markdown',
      'node_modules/data-store/node_modules/mkdirp/readme.markdown',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/README.markdown',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/README.markdown',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/README.markdown',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/readme.markdown',
      'node_modules/mocha/node_modules/mkdirp/readme.markdown'
    ],
    dest: 'foo/bar/README.MARKDOWN'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/dash.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/dash.js'
    ],
    dest: 'foo/bar/DASH.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/default_bool.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/default_bool.js'
    ],
    dest: 'foo/bar/DEFAULT_BOOL.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/dotted.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/dotted.js'
    ],
    dest: 'foo/bar/DOTTED.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/long.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/long.js'
    ],
    dest: 'foo/bar/LONG.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/parse_modified.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/parse_modified.js'
    ],
    dest: 'foo/bar/PARSE_MODIFIED.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/short.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/short.js'
    ],
    dest: 'foo/bar/SHORT.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/node_modules/minimist/test/whitespace.js',
      'node_modules/mocha/node_modules/mkdirp/node_modules/minimist/test/whitespace.js'
    ],
    dest: 'foo/bar/WHITESPACE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/chmod.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/chmod.js',
      'node_modules/mocha/node_modules/mkdirp/test/chmod.js'
    ],
    dest: 'foo/bar/CHMOD.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/clobber.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/clobber.js',
      'node_modules/mocha/node_modules/mkdirp/test/clobber.js'
    ],
    dest: 'foo/bar/CLOBBER.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/mkdirp.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/mkdirp.js',
      'node_modules/mocha/node_modules/mkdirp/test/mkdirp.js'
    ],
    dest: 'foo/bar/MKDIRP.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/opts_fs_sync.js',
      'node_modules/mocha/node_modules/mkdirp/test/opts_fs_sync.js'
    ],
    dest: 'foo/bar/OPTS_FS_SYNC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/opts_fs.js',
      'node_modules/mocha/node_modules/mkdirp/test/opts_fs.js'
    ],
    dest: 'foo/bar/OPTS_FS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/perm_sync.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/perm_sync.js',
      'node_modules/mocha/node_modules/mkdirp/test/perm_sync.js'
    ],
    dest: 'foo/bar/PERM_SYNC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/perm.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/perm.js',
      'node_modules/mocha/node_modules/mkdirp/test/perm.js'
    ],
    dest: 'foo/bar/PERM.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/race.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/race.js',
      'node_modules/mocha/node_modules/mkdirp/test/race.js'
    ],
    dest: 'foo/bar/RACE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/rel.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/rel.js',
      'node_modules/mocha/node_modules/mkdirp/test/rel.js'
    ],
    dest: 'foo/bar/REL.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/return_sync.js',
      'node_modules/mocha/node_modules/mkdirp/test/return_sync.js'
    ],
    dest: 'foo/bar/RETURN_SYNC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/return.js',
      'node_modules/mocha/node_modules/mkdirp/test/return.js'
    ],
    dest: 'foo/bar/RETURN.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/root.js',
      'node_modules/mocha/node_modules/glob/test/root.js',
      'node_modules/mocha/node_modules/mkdirp/test/root.js'
    ],
    dest: 'foo/bar/ROOT.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/sync.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/sync.js',
      'node_modules/globby/node_modules/glob/sync.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/sync.js',
      'node_modules/mocha/node_modules/mkdirp/test/sync.js'
    ],
    dest: 'foo/bar/SYNC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/umask_sync.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/umask_sync.js',
      'node_modules/mocha/node_modules/mkdirp/test/umask_sync.js'
    ],
    dest: 'foo/bar/UMASK_SYNC.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/mkdirp/test/umask.js',
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/test/umask.js',
      'node_modules/mocha/node_modules/mkdirp/test/umask.js'
    ],
    dest: 'foo/bar/UMASK.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/bin.js'
    ],
    dest: 'foo/bar/BIN.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/common.js',
      'node_modules/globby/node_modules/glob/common.js',
      'node_modules/mocha/lib/interfaces/common.js'
    ],
    dest: 'foo/bar/COMMON.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/glob.js',
      'node_modules/globby/node_modules/glob/glob.js',
      'node_modules/mocha/lib/browser/glob.js',
      'node_modules/mocha/node_modules/glob/glob.js'
    ],
    dest: 'foo/bar/GLOB.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/inflight.js',
      'node_modules/globby/node_modules/glob/node_modules/inflight/inflight.js'
    ],
    dest: 'foo/bar/INFLIGHT.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/node_modules/wrappy/wrappy.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/node_modules/wrappy/wrappy.js',
      'node_modules/globby/node_modules/glob/node_modules/inflight/node_modules/wrappy/wrappy.js',
      'node_modules/globby/node_modules/glob/node_modules/once/node_modules/wrappy/wrappy.js'
    ],
    dest: 'foo/bar/WRAPPY.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inflight/test.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/test.js',
      'node_modules/globby/node_modules/glob/node_modules/inflight/test.js',
      'node_modules/globby/node_modules/glob/node_modules/inherits/test.js',
      'node_modules/mocha/lib/test.js',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/test.js',
      'node_modules/mocha/node_modules/growl/test.js',
      'node_modules/should/node_modules/should-equal/test.js',
      'node_modules/should/node_modules/should-format/tests/test.js',
      'test/test.js'
    ],
    dest: 'foo/bar/TEST.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/inherits_browser.js',
      'node_modules/globby/node_modules/glob/node_modules/inherits/inherits_browser.js',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/inherits_browser.js'
    ],
    dest: 'foo/bar/INHERITS_BROWSER.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/inherits/inherits.js',
      'node_modules/globby/node_modules/glob/node_modules/inherits/inherits.js',
      'node_modules/mocha/node_modules/glob/node_modules/inherits/inherits.js'
    ],
    dest: 'foo/bar/INHERITS.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/browser.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/browser.js',
      'node_modules/mocha/node_modules/debug/browser.js'
    ],
    dest: 'foo/bar/BROWSER.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/minimatch.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/minimatch.js',
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/minimatch.js'
    ],
    dest: 'foo/bar/MINIMATCH.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/example.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/example.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/example.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/example.js'
    ],
    dest: 'foo/bar/EXAMPLE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/Makefile',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/Makefile',
      'node_modules/mocha/node_modules/debug/Makefile',
      'node_modules/mocha/node_modules/jade/node_modules/commander/Makefile'
    ],
    dest: 'foo/bar/MAKEFILE'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/test/balanced.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/balanced-match/test/balanced.js'
    ],
    dest: 'foo/bar/BALANCED.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/example/map.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/test/map.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/example/map.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/node_modules/concat-map/test/map.js'
    ],
    dest: 'foo/bar/MAP.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/bash-comparison.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/bash-comparison.js',
      'node_modules/mocha/node_modules/glob/test/bash-comparison.js'
    ],
    dest: 'foo/bar/BASH-COMPARISON.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/bash-results.txt',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/bash-results.txt'
    ],
    dest: 'foo/bar/BASH-RESULTS.TXT'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/cases.txt',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/cases.txt'
    ],
    dest: 'foo/bar/CASES.TXT'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/dollar.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/dollar.js'
    ],
    dest: 'foo/bar/DOLLAR.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/empty-option.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/empty-option.js'
    ],
    dest: 'foo/bar/EMPTY-OPTION.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/generate.sh',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/generate.sh'
    ],
    dest: 'foo/bar/GENERATE.SH'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/negative-increment.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/negative-increment.js'
    ],
    dest: 'foo/bar/NEGATIVE-INCREMENT.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/nested.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/nested.js'
    ],
    dest: 'foo/bar/NESTED.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/order.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/order.js'
    ],
    dest: 'foo/bar/ORDER.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/pad.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/pad.js'
    ],
    dest: 'foo/bar/PAD.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/same-type.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/same-type.js'
    ],
    dest: 'foo/bar/SAME-TYPE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/sequence.js',
      'node_modules/globby/node_modules/glob/node_modules/minimatch/node_modules/brace-expansion/test/sequence.js'
    ],
    dest: 'foo/bar/SEQUENCE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/once.js',
      'node_modules/data-store/node_modules/rimraf/node_modules/glob/node_modules/once/test/once.js',
      'node_modules/globby/node_modules/glob/node_modules/once/once.js',
      'node_modules/globby/node_modules/glob/node_modules/once/test/once.js'
    ],
    dest: 'foo/bar/ONCE.JS'
  },
  {
    src: [
      'node_modules/data-store/node_modules/rimraf/rimraf.js'
    ],
    dest: 'foo/bar/RIMRAF.JS'
  },
  {
    src: [
      'node_modules/globby/node_modules/async/CHANGELOG.md'
    ],
    dest: 'foo/bar/CHANGELOG.MD'
  },
  {
    src: [
      'node_modules/globby/node_modules/async/lib/async.js'
    ],
    dest: 'foo/bar/ASYNC.JS'
  },
  {
    src: [
      'node_modules/mocha/bin/_mocha'
    ],
    dest: 'foo/bar/_MOCHA'
  },
  {
    src: [
      'node_modules/mocha/bin/mocha'
    ],
    dest: 'foo/bar/MOCHA'
  },
  {
    src: [
      'node_modules/mocha/images/error.png'
    ],
    dest: 'foo/bar/ERROR.PNG'
  },
  {
    src: [
      'node_modules/mocha/images/ok.png'
    ],
    dest: 'foo/bar/OK.PNG'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/debug.js',
      'node_modules/mocha/node_modules/debug/debug.js'
    ],
    dest: 'foo/bar/DEBUG.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/escape-string-regexp.js'
    ],
    dest: 'foo/bar/ESCAPE-STRING-REGEXP.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/events.js'
    ],
    dest: 'foo/bar/EVENTS.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/path.js'
    ],
    dest: 'foo/bar/PATH.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/progress.js',
      'node_modules/mocha/lib/reporters/progress.js'
    ],
    dest: 'foo/bar/PROGRESS.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/browser/tty.js'
    ],
    dest: 'foo/bar/TTY.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/context.js'
    ],
    dest: 'foo/bar/CONTEXT.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/hook.js'
    ],
    dest: 'foo/bar/HOOK.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/interfaces/bdd.js'
    ],
    dest: 'foo/bar/BDD.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/interfaces/exports.js'
    ],
    dest: 'foo/bar/EXPORTS.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/interfaces/qunit.js'
    ],
    dest: 'foo/bar/QUNIT.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/interfaces/tdd.js'
    ],
    dest: 'foo/bar/TDD.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/mocha.js',
      'node_modules/mocha/mocha.js',
      'node_modules/should/node_modules/should-format/tests/browser/mocha.js'
    ],
    dest: 'foo/bar/MOCHA.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/ms.js'
    ],
    dest: 'foo/bar/MS.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/pending.js'
    ],
    dest: 'foo/bar/PENDING.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/base.js'
    ],
    dest: 'foo/bar/BASE.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/doc.js'
    ],
    dest: 'foo/bar/DOC.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/dot.js'
    ],
    dest: 'foo/bar/DOT.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/html-cov.js'
    ],
    dest: 'foo/bar/HTML-COV.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/html.js'
    ],
    dest: 'foo/bar/HTML.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/json-cov.js'
    ],
    dest: 'foo/bar/JSON-COV.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/json-stream.js'
    ],
    dest: 'foo/bar/JSON-STREAM.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/json.js'
    ],
    dest: 'foo/bar/JSON.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/landing.js'
    ],
    dest: 'foo/bar/LANDING.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/list.js'
    ],
    dest: 'foo/bar/LIST.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/markdown.js'
    ],
    dest: 'foo/bar/MARKDOWN.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/min.js'
    ],
    dest: 'foo/bar/MIN.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/nyan.js'
    ],
    dest: 'foo/bar/NYAN.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/spec.js'
    ],
    dest: 'foo/bar/SPEC.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/tap.js'
    ],
    dest: 'foo/bar/TAP.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/templates/coverage.jade'
    ],
    dest: 'foo/bar/COVERAGE.JADE'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/templates/menu.jade'
    ],
    dest: 'foo/bar/MENU.JADE'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/templates/script.html'
    ],
    dest: 'foo/bar/SCRIPT.HTML'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/templates/style.html'
    ],
    dest: 'foo/bar/STYLE.HTML'
  },
  {
    src: [
      'node_modules/mocha/lib/reporters/xunit.js'
    ],
    dest: 'foo/bar/XUNIT.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/runnable.js'
    ],
    dest: 'foo/bar/RUNNABLE.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/runner.js'
    ],
    dest: 'foo/bar/RUNNER.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/suite.js'
    ],
    dest: 'foo/bar/SUITE.JS'
  },
  {
    src: [
      'node_modules/mocha/lib/template.html'
    ],
    dest: 'foo/bar/TEMPLATE.HTML'
  },
  {
    src: [
      'node_modules/mocha/mocha.css',
      'node_modules/should/node_modules/should-format/tests/browser/mocha.css'
    ],
    dest: 'foo/bar/MOCHA.CSS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/debug/component.json'
    ],
    dest: 'foo/bar/COMPONENT.JSON'
  },
  {
    src: [
      'node_modules/mocha/node_modules/debug/node.js',
      'node_modules/mocha/node_modules/jade/lib/nodes/node.js'
    ],
    dest: 'foo/bar/NODE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/diff/diff.js'
    ],
    dest: 'foo/bar/DIFF.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/examples/g.js'
    ],
    dest: 'foo/bar/G.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/examples/usr-local.js'
    ],
    dest: 'foo/bar/USR-LOCAL.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/test/open.js'
    ],
    dest: 'foo/bar/OPEN.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/graceful-fs/test/readdir-sort.js'
    ],
    dest: 'foo/bar/READDIR-SORT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/CONTRIBUTORS'
    ],
    dest: 'foo/bar/CONTRIBUTORS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/lib/lru-cache.js'
    ],
    dest: 'foo/bar/LRU-CACHE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/test/foreach.js'
    ],
    dest: 'foo/bar/FOREACH.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/lru-cache/test/memory-leak.js'
    ],
    dest: 'foo/bar/MEMORY-LEAK.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/bench.js'
    ],
    dest: 'foo/bar/BENCH.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/node_modules/sigmund/sigmund.js'
    ],
    dest: 'foo/bar/SIGMUND.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/test/brace-expand.js'
    ],
    dest: 'foo/bar/BRACE-EXPAND.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/test/caching.js'
    ],
    dest: 'foo/bar/CACHING.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/test/defaults.js'
    ],
    dest: 'foo/bar/DEFAULTS.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/node_modules/minimatch/test/extglob-ending-with-state-char.js'
    ],
    dest: 'foo/bar/EXTGLOB-ENDING-WITH-STATE-CHAR.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/00-setup.js'
    ],
    dest: 'foo/bar/00-SETUP.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/bash-results.json'
    ],
    dest: 'foo/bar/BASH-RESULTS.JSON'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/cwd-test.js'
    ],
    dest: 'foo/bar/CWD-TEST.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/globstar-match.js'
    ],
    dest: 'foo/bar/GLOBSTAR-MATCH.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/mark.js'
    ],
    dest: 'foo/bar/MARK.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/nocase-nomagic.js'
    ],
    dest: 'foo/bar/NOCASE-NOMAGIC.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/pause-resume.js'
    ],
    dest: 'foo/bar/PAUSE-RESUME.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/root-nomount.js'
    ],
    dest: 'foo/bar/ROOT-NOMOUNT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/stat.js'
    ],
    dest: 'foo/bar/STAT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/glob/test/zz-cleanup.js'
    ],
    dest: 'foo/bar/ZZ-CLEANUP.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/growl/lib/growl.js'
    ],
    dest: 'foo/bar/GROWL.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/bin/jade'
    ],
    dest: 'foo/bar/JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/jade.js',
      'node_modules/mocha/node_modules/jade/lib/jade.js'
    ],
    dest: 'foo/bar/JADE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/jade.md'
    ],
    dest: 'foo/bar/JADE.MD'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/jade.min.js'
    ],
    dest: 'foo/bar/JADE.MIN.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/compiler.js'
    ],
    dest: 'foo/bar/COMPILER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/doctypes.js'
    ],
    dest: 'foo/bar/DOCTYPES.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/filters.js'
    ],
    dest: 'foo/bar/FILTERS.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/inline-tags.js'
    ],
    dest: 'foo/bar/INLINE-TAGS.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/lexer.js'
    ],
    dest: 'foo/bar/LEXER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/attrs.js'
    ],
    dest: 'foo/bar/ATTRS.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/block-comment.js'
    ],
    dest: 'foo/bar/BLOCK-COMMENT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/block.js'
    ],
    dest: 'foo/bar/BLOCK.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/case.js'
    ],
    dest: 'foo/bar/CASE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/code.js'
    ],
    dest: 'foo/bar/CODE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/comment.js'
    ],
    dest: 'foo/bar/COMMENT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/doctype.js'
    ],
    dest: 'foo/bar/DOCTYPE.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/each.js'
    ],
    dest: 'foo/bar/EACH.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/filter.js'
    ],
    dest: 'foo/bar/FILTER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/literal.js'
    ],
    dest: 'foo/bar/LITERAL.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/mixin.js'
    ],
    dest: 'foo/bar/MIXIN.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/tag.js'
    ],
    dest: 'foo/bar/TAG.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/nodes/text.js'
    ],
    dest: 'foo/bar/TEXT.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/parser.js'
    ],
    dest: 'foo/bar/PARSER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/runtime.js',
      'node_modules/mocha/node_modules/jade/runtime.js'
    ],
    dest: 'foo/bar/RUNTIME.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/lib/self-closing.js'
    ],
    dest: 'foo/bar/SELF-CLOSING.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/node_modules/commander/lib/commander.js'
    ],
    dest: 'foo/bar/COMMANDER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/examples/pow.js.orig'
    ],
    dest: 'foo/bar/POW.JS.ORIG'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/node_modules/mkdirp/examples/pow.js.rej'
    ],
    dest: 'foo/bar/POW.JS.REJ'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/runtime.min.js'
    ],
    dest: 'foo/bar/RUNTIME.MIN.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/test.jade'
    ],
    dest: 'foo/bar/TEST.JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/testing/head.jade'
    ],
    dest: 'foo/bar/HEAD.JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/testing/index.jade'
    ],
    dest: 'foo/bar/INDEX.JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/testing/layout.jade'
    ],
    dest: 'foo/bar/LAYOUT.JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/testing/user.jade'
    ],
    dest: 'foo/bar/USER.JADE'
  },
  {
    src: [
      'node_modules/mocha/node_modules/jade/testing/user.js'
    ],
    dest: 'foo/bar/USER.JS'
  },
  {
    src: [
      'node_modules/mocha/node_modules/supports-color/cli.js'
    ],
    dest: 'foo/bar/CLI.JS'
  },
  {
    src: [
      'node_modules/should/as-function.js'
    ],
    dest: 'foo/bar/AS-FUNCTION.JS'
  },
  {
    src: [
      'node_modules/should/bower.json'
    ],
    dest: 'foo/bar/BOWER.JSON'
  },
  {
    src: [
      'node_modules/should/CONTRIBUTING.md'
    ],
    dest: 'foo/bar/CONTRIBUTING.MD'
  },
  {
    src: [
      'node_modules/should/gulpfile.js'
    ],
    dest: 'foo/bar/GULPFILE.JS'
  },
  {
    src: [
      'node_modules/should/lib/assertion-error.js'
    ],
    dest: 'foo/bar/ASSERTION-ERROR.JS'
  },
  {
    src: [
      'node_modules/should/lib/assertion.js'
    ],
    dest: 'foo/bar/ASSERTION.JS'
  },
  {
    src: [
      'node_modules/should/lib/config.js'
    ],
    dest: 'foo/bar/CONFIG.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/_assert.js'
    ],
    dest: 'foo/bar/_ASSERT.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/assert.js'
    ],
    dest: 'foo/bar/ASSERT.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/bool.js'
    ],
    dest: 'foo/bar/BOOL.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/chain.js'
    ],
    dest: 'foo/bar/CHAIN.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/contain.js'
    ],
    dest: 'foo/bar/CONTAIN.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/eql.js'
    ],
    dest: 'foo/bar/EQL.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/error.js'
    ],
    dest: 'foo/bar/ERROR.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/match.js'
    ],
    dest: 'foo/bar/MATCH.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/number.js'
    ],
    dest: 'foo/bar/NUMBER.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/property.js'
    ],
    dest: 'foo/bar/PROPERTY.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/string.js'
    ],
    dest: 'foo/bar/STRING.JS'
  },
  {
    src: [
      'node_modules/should/lib/ext/type.js'
    ],
    dest: 'foo/bar/TYPE.JS'
  },
  {
    src: [
      'node_modules/should/lib/should.js',
      'node_modules/should/should.js'
    ],
    dest: 'foo/bar/SHOULD.JS'
  },
  {
    src: [
      'node_modules/should/lib/util.js',
      'node_modules/should/node_modules/should-format/util.js'
    ],
    dest: 'foo/bar/UTIL.JS'
  },
  {
    src: [
      'node_modules/should/node_modules/should-equal/format.js',
      'support/format.js'
    ],
    dest: 'foo/bar/FORMAT.JS'
  },
  {
    src: [
      'node_modules/should/node_modules/should-format/tests/browser/index.html'
    ],
    dest: 'foo/bar/INDEX.HTML'
  },
  {
    src: [
      'node_modules/should/node_modules/should-format/tests/browser/tests.js'
    ],
    dest: 'foo/bar/TESTS.JS'
  },
  {
    src: [
      'node_modules/should/node_modules/should-type/types.js'
    ],
    dest: 'foo/bar/TYPES.JS'
  },
  {
    src: [
      'node_modules/should/should.min.js'
    ],
    dest: 'foo/bar/SHOULD.MIN.JS'
  },
  {
    src: [
      'node_modules/to-clipboard/node_modules/shell-escape/shell-escape.js'
    ],
    dest: 'foo/bar/SHELL-ESCAPE.JS'
  },
  {
    src: [
      'node_modules/to-clipboard/node_modules/shell-escape/test/advanced.js'
    ],
    dest: 'foo/bar/ADVANCED.JS'
  },
  {
    src: [
      'node_modules/to-clipboard/node_modules/shell-escape/test/more.js'
    ],
    dest: 'foo/bar/MORE.JS'
  },
  {
    src: [
      'node_modules/to-clipboard/node_modules/shell-escape/test/simple.js'
    ],
    dest: 'foo/bar/SIMPLE.JS'
  },
  {
    src: [
      'support/configs.js'
    ],
    dest: 'foo/bar/CONFIGS.JS'
  },
  {
    src: [
      'support/props.js'
    ],
    dest: 'foo/bar/PROPS.JS'
  },
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
    '{a,b}/**/*'
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
      cwd: '',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: [],
    dest: 'dest'
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
    '{a,b}/**/*'
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
      filter: 'isDirectory',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: [],
    dest: 'dest'
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
    '{a,b}/**/*'
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
      filter: 'isFile',
      rename: function (dest, fp) {
        return path.join(dest, 'all' + path.extname(fp));
      }
    },
    src: [],
    dest: 'dest'
  }
]
```


