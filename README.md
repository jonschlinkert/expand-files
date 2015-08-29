# expand-files [![NPM version](https://badge.fury.io/js/expand-files.svg)](http://badge.fury.io/js/expand-files)

> Expand glob patterns in a declarative configuration into src-dest mappings.

**Examples**

Expands `src` glob patterns and creates `dest` mappings:

```js
var files = require('expand-files');

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
  {src: ['test/fixtures/a.txt'], dest: 'dist/a.txt'},
  {src: ['test/fixtures/b.txt'], dest: 'dist/b.txt'},
  {src: ['test/fixtures/c.txt'], dest: 'dist/c.txt'},
  {src: ['test/fixtures/d.txt'], dest: 'dist/d.txt'}
]
```

See the [extensive examples](./examples.md) to see some of the possible configurations.

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i expand-files --save
```

## Usage

```js
var files = require('expand-files');

// pass a list of arguments
files(src, dest, options);

// or an object
files({
  options: options,
  src: src, 
  dest: dest
});
```

## dest behavior

By default, `src` is appended to the defined `dest`. If `flatten` is true, then `src` basename is appended to `dest`.

**Examples**

```js
files({src: 'index.js', dest: 'dist/'});
//=> [ { src: [ 'index.js' ], dest: 'dist/' } ]

files({src: 'index.js', dest: 'dist/', expand: true});
//=> [{ src: [ 'index.js' ], dest: 'dist/index.js' } ]
```

## Examples

Supports any of the formats supported by the [files-objects](https://github.com/jonschlinkert/files-objects) library as well as any of the configurations in [examples.md](./examples.md).

## options

### expand

Expand src-dest mappings. Creates a `dest` filepath for each `src` filepath.

**Type**: `Boolean`

**Default**: `undefined`

**Example:**

```js
files({src: 'test/fixtures/*.js', dest: 'dist/', expand: true});
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
files({src: 'test/fixtures/*.js', dest: 'dist/', expand: true, flatten: true});
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
files({src: '*.coffee', dest: 'dist/', ext: '.js'});
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
files({src: '*.js', dest: 'dist/', extDot: 'first'});
```

### cwd

**Type**: `String`

**Default**: `undefined`

**Example:**

```js
files({src: '*.js', dest: 'dist/', cwd: true});
```

### rename

**Type**: `Function`

**Default**: `src` is appended to the defined `dest`. If `flatten` is true, then `src` basename is appended to `dest`.

**Example:**

```js
files({
  src: '*.js', 
  dest: 'dist/', 
  rename: true
});
```

### filter

**Type**: `Function`

**Default**: `undefined`

**Example:**

```js
files({src: '*.js', dest: 'dist/', filter: 'isFile'});
```

### options properties

The below "special" properties are fine to use either on an `options` object or on the root of the object passed to `expand-files`.

Either way they will be normalized onto the `options` object to ensure that [globby](https://github.com/sindresorhus/globby) and consuming libraries are passed the correct arguments.

**special properties**

* `base`
* `cwd`
* `destBase`
* `expand`
* `ext`
* `extDot`
* `extend`
* `flatten`
* `rename`
* `process`
* `srcBase`

**example**

Both of the following will result in `expand` being on the `options` object.

```js
files({src: '*.js', dest: 'dist/', options: {expand: true}});
files({src: '*.js', dest: 'dist/', expand: true});
```

## Related projects

* [expand-config](https://www.npmjs.com/package/expand-config): Expand tasks, targets and options in a declarative configuraiton. | [homepage](https://github.com/jonschlinkert/expand-config)
* [expand-target](https://www.npmjs.com/package/expand-target): Expand target definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-target)
* [expand-task](https://www.npmjs.com/package/expand-task): Expand task definitions in a declarative configuration. | [homepage](https://github.com/jonschlinkert/expand-task)
* [files-objects](https://www.npmjs.com/package/files-objects): Expand files objects into src-dest mappings. | [homepage](https://github.com/jonschlinkert/files-objects)

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

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on August 29, 2015._
