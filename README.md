# expand-files [![NPM version](https://img.shields.io/npm/v/expand-files.svg?style=flat)](https://www.npmjs.com/package/expand-files) [![NPM downloads](https://img.shields.io/npm/dm/expand-files.svg?style=flat)](https://npmjs.org/package/expand-files) [![Build Status](https://img.shields.io/travis/jonschlinkert/expand-files.svg?style=flat)](https://travis-ci.org/jonschlinkert/expand-files)

Expand glob patterns in a declarative configuration into src-dest mappings.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save expand-files
```

**Examples**

Expands `src` glob patterns and creates `dest` mappings:

```js
var files = require('expand-files');

// pass any "global" options to `files`
config = files({cwd: 'test/fixtures'});

// src, dest list
config.expand('*.txt', 'dist/');

// expand src-dest object 
config.expand({
  src: '*.txt',
  dest: 'dist/'
});

// expand src-dest mappings 
config.expand({
  'dist/': '*.txt'
});

// expand files objects
config.expand({
  files: {
    'dist/': '*.txt'
  }
});

// expand files arrays
config.expand({
  files: [
    {src: '*.txt', dest: 'dist/'}
    //...
  ]
});
```

**Results**

All of the above result in the following array:

```js
[
  {src: ['test/fixtures/a.txt'], dest: 'dist/a.txt'},
  {src: ['test/fixtures/b.txt'], dest: 'dist/b.txt'},
  {src: ['test/fixtures/c.txt'], dest: 'dist/c.txt'},
  {src: ['test/fixtures/d.txt'], dest: 'dist/d.txt'}
]
```

See [examples](./examples.md) of possible configurations.

## Table of contents

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save expand-files
```

## Usage

```js
var files = require('expand-files');
var config = files(options);

// pass a list of arguments
config.expand('src', 'dest', options);

// or an object with `src`/`dest`
config.expand({
  options: options,
  src: ['src'], 
  dest: 'dest'
});

// or an object with a `files` object
config.expand({
  options: options,
  files: {
    src: 'src',
    dest: 'dest'
  }
});

// or an object with `files` mappings
config.expand({
  options: options,
  files: {
    'foo/': '*.js',
    'bar/': '*.js',
    'baz/': '*.js'
  }
});

// or an object with an array of `files` objects
config.expand({
  options: options,
  files: [
    {src: 'src', dest: 'dest'}
  ]
});

// or an object with an array of glob patterns
config.expand({
  options: options,
  files: ['*.js', '*.txt']
});
```

## dest behavior

By default, `src` is appended to the defined `dest`. If `flatten` is true, then `src` basename is appended to `dest`.

**Examples**

```js
config.expand({src: 'index.js', dest: 'dist/'});
//=> [ { src: [ 'index.js' ], dest: 'dist/' } ]

config.expand({src: 'index.js', dest: 'dist/', mapDest: true});
//=> [{ src: [ 'index.js' ], dest: 'dist/index.js' } ]
```

## Plugins

Plugins can be used to modify to resulting object. A plugin is a function that takes `config` as its only parameter.

**Example**

```js
var config = new Files();
function addFoo(config) {
  config.foo = 'bar';
}
config.use(addFoo);
console.log(config.expand({src: '*.js'}).files);
```

Results in an object that looks something like:

```js
{
  options: {},
  foo: 'bar', //<= our added property
  files: [{ 
    options: {}, 
    src: ['examples.js', 'gulpfile.js', 'index.js', 'utils.js'], 
    dest: '' } 
  ] 
}
```

### Nodes

It's also possible to modify individual files nodes as they're created on the `files` array. To do so, simply return a function in the plugin and it will be called on each node.

Additionally, you can either modify the node before it's normalized or after, by checking for the `rawNode` property or `filesNode` respectively.

**Examples**

```js
var config = new Files();
function updateNode(config) {
  config.foo = 'bar';

  return function fn(node) {
    if (!node.filesNode) return fn;
    // return the plugin function if it's not a filesNode
    // this way we know with certainty that `node`
    // will be a filesNode
    node.options.one = 'two';
    node.dest = 'baz/';
    node.abc = 'xyz';
  };
}
config.use(updateNode);
console.log(config.expand({src: '*.js'}).files);
```

Results in an object that looks something like:

```js
{
  options: {},
  foo: 'bar', //<= our added `config` property
  files: [{ 
    options: { one: 'two' }, 
    src: ['examples.js', 'gulpfile.js', 'index.js', 'utils.js'], 
    dest: 'baz/',
    abc: 'xyz' } 
  ] 
}
```

## Examples

Supports any of the formats supported by the [files-objects](https://github.com/jonschlinkert/files-objects) library as well as any of the configurations in [examples.md](./examples.md).

## options

### mapDest

Expand src-dest mappings. Creates a `dest` filepath for each `src` filepath.

**Type**: `Boolean`

**Default**: `undefined`

**Example:**

```js
config.expand({src: 'test/fixtures/*.js', dest: 'dist/', mapDest: true});
```

**results in**

```js
[ 
  {src: [ 'test/fixtures/x.js' ], dest: 'dist/test/fixtures/x.js' },
  {src: [ 'test/fixtures/y.js' ], dest: 'dist/test/fixtures/y.js' },
  {src: [ 'test/fixtures/z.js' ], dest: 'dist/test/fixtures/z.js' } 
]
```

### flatten

Flatten destination paths. Joins the `src` basename to the defined `dest` path.

**Type**: `Boolean`

**Default**: `undefined`

**Example:**

```js
config.expand({src: 'test/fixtures/*.js', dest: 'dist/', mapDest: true, flatten: true});
```

**results in**

```js
[ 
  {src: [ 'test/fixtures/x.js' ], dest: 'dist/x.js' },
  {src: [ 'test/fixtures/y.js' ], dest: 'dist/y.js' },
  {src: [ 'test/fixtures/z.js' ], dest: 'dist/z.js' } 
]
```

### ext

The extension to use on dest files.

**Type**: `String`

**Default**: `undefined`

**Example:**

```js
config.expand({src: '*.coffee', dest: 'dist/', ext: '.js'});
```

### extDot

The part of the extension to use on dest files when the extension is automatically mapped from `src` files.

**Type**: `String`

**Default**: `undefined`

**Choices**:

* `first`: everything after the first dot
* `last`: everything after the last dot

**Example:**

```js
config.expand({src: '*.js', dest: 'dist/', extDot: 'first'});
```

### cwd

**Type**: `String`

**Default**: `undefined`

**Example:**

```js
config.expand({src: '*.js', dest: 'dist/', cwd: true});
```

### rename

**Type**: `Function`

**Default**: `src` is appended to the defined `dest`. If `flatten` is true, then `src` basename is appended to `dest`.

**Example:**

```js
config.expand({
  src: '*.js', 
  dest: 'dist/', 
  rename: true
});
```

### filter

Filter by `fs.lstat` "type" or using a custom filter function.

**Type**: `Function|String`.

**Default**: `undefined`

**Example:**

Filter by `fs.lstat` method name:

```js
config.expand({src: '**/*', dest: 'dist/', filter: 'isFile'});
```

Filter function:

```js
config.expand({
  options: {
    filter: function (str) {
      return !/DS_Store/.test(str);
    }
  },
  // dotfiles
  src: ['.*']
});

// [ { src:
//      [ '.editorconfig',
//        '.git',
//        '.gitattributes',
//        '.gitignore',
//        '.jshintrc',
//        '.travis.yml',
//        '.verb.md' ],
//     dest: '' } ]
```

### options properties

The below "special" properties are fine to use either on an `options` object or on the root of the object passed to `expand-files`.

Either way they will be normalized onto the `options` object to ensure that [globby](https://github.com/sindresorhus/globby) and consuming libraries are passed the correct arguments.

**special properties**

* `base`
* `cwd`
* `destBase`
* `mapDest`
* `ext`
* `extDot`
* `extend`
* `flatten`
* `rename`
* `process`
* `srcBase`

**example**

Both of the following will result in `mapDest` being on the `options` object.

```js
config.expand({src: '*.js', dest: 'dist/', options: {mapDest: true}});
config.expand({src: '*.js', dest: 'dist/', mapDest: true});
```

Both result in something like:

```js
{
  options: { mapDest: true },
  files:
   [ { options: {}, src: [...], dest: 'dist/examples.js' },
     { options: {}, src: [...], dest: 'dist/gulpfile.js' },
     { options: {}, src: [...], dest: 'dist/index.js' },
     { options: {}, src: [...], dest: 'dist/utils.js' } ] 
}
```

## Coverage

```
Statements   : 100% (106/106)
Branches     : 100% (57/57)
Functions    : 100% (11/11)
Lines        : 100% (104/104)
```

## Related projects

You might also be interested in these projects:

* [expand](https://www.npmjs.com/package/expand): Recursively resolve templates in an object, string or array. | [homepage](https://github.com/jonschlinkert/expand "Recursively resolve templates in an object, string or array.")
* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and files in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-config "Expand tasks, targets and files in a declarative configuration.")
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files "Expand glob patterns in a declarative configuration into src-dest mappings.")
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target "Expand target definitions in a declarative configuration.")
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task "Expand and normalize task definitions in a declarative configuration.")
* [expand-utils](https://www.npmjs.com/package/expand-utils): Utils shared by the expand libs. | [homepage](https://github.com/jonschlinkert/expand-utils "Utils shared by the expand libs.")
* [map-dest](https://www.npmjs.com/package/map-dest): Map the destination path for a file based on the given source path and options. | [homepage](https://github.com/jonschlinkert/map-dest "Map the destination path for a file based on the given source path and options.")
* [normalize-config](https://www.npmjs.com/package/normalize-config): Normalize a declarative configuration with any combination of src-dest mappings, files arrays, files objects and… [more](https://github.com/jonschlinkert/normalize-config) | [homepage](https://github.com/jonschlinkert/normalize-config "Normalize a declarative configuration with any combination of src-dest mappings, files arrays, files objects and options into a consistent format so the config can easily be passed to any build system.")

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

_(This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/expand-files/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 25, 2016._