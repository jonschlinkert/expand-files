# expand-files [![NPM version](https://badge.fury.io/js/expand-files.svg)](http://badge.fury.io/js/expand-files)  [![Build Status](https://travis-ci.org/jonschlinkert/expand-files.svg)](https://travis-ci.org/jonschlinkert/expand-files)

> Expand glob patterns in a declarative configuration into src-dest mappings.

**Examples**

Expands `src` glob patterns and creates `dest` mappings:

```js
var files = require('expand-files');

// pass any "global" options to `files`
config = files({cwd: 'test/fixtures'});

// expand src-dest mappings 
config.expand({
  src: '*.txt',
  dest: 'dist/'
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

Each of the above results in something like this:

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

- [Install](#install)
- [Usage](#usage)
- [dest behavior](#dest-behavior)
- [Examples](#examples)
- [options](#options)
  * [mapDest](#mapdest)
  * [flatten](#flatten)
  * [ext](#ext)
  * [extDot](#extdot)
  * [cwd](#cwd)
  * [rename](#rename)
  * [filter](#filter)
  * [options properties](#options-properties)
- [Related projects](#related-projects)
- [Coverage](#coverage)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i expand-files --save
```

## Usage

```js
var files = require('expand-files');
var config = files();

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

## Examples

Supports any of the formats supported by the [files-objects][] library as well as any of the configurations in [examples.md](./examples.md).

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

Either way they will be normalized onto the `options` object to ensure that [globby][] and consuming libraries are passed the correct arguments.

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

## Related projects

* [expand](https://www.npmjs.com/package/expand): Recursively resolve templates in an object, string or array. | [homepage](https://github.com/jonschlinkert/expand)
* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and files in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-files](https://www.npmjs.com/package/expand-files): Expand glob patterns in a declarative configuration into src-dest mappings. | [homepage](https://github.com/jonschlinkert/expand-files)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand and normalize task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [expand-utils](https://www.npmjs.com/package/expand-utils): Utils shared by the expand libs. | [homepage](https://github.com/jonschlinkert/expand-utils)
* [map-dest](https://www.npmjs.com/package/map-dest): Map the destination path for a file based on the given source path and options. | [homepage](https://github.com/jonschlinkert/map-dest)
* [normalize-config](https://www.npmjs.com/package/normalize-config): Normalize a declarative configuration with any combination of src-dest mappings, files arrays, files objects and… [more](https://www.npmjs.com/package/normalize-config) | [homepage](https://github.com/jonschlinkert/normalize-config)

## Coverage

```
Statements   : 100% (106/106)
Branches     : 100% (57/57)
Functions    : 100% (11/11)
Lines        : 100% (104/104)
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/expand-files/issues/new).

## Author

**Jon Schlinkert**

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2015 Jon Schlinkert
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on November 13, 2015._