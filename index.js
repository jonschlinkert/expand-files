/*!
 * expand-files <https://github.com/jonschlinkert/expand-files>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var Base = require('base-methods');
var plugins = require('base-plugins');
var utils = require('./lib/utils');

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(config) {
  if (!(this instanceof Files)) {
    return new Files(config);
  }

  this.options = config || {};
  Base.call(this);

  this.use(plugins());
  utils.define(this, 'statCache', {});
  utils.define(this, 'pathCache', {});
  this.cache = {};
}

/**
 * Inherit Files
 */

Base.extend(Files);

/**
 * Normalize the given `config` with [normalize-config][]. See that
 * library for the full range of features and options, or to create
 * issues related to normalization.
 *
 * @param {Object} `config`
 * @param {String} `dest`
 * @param {Object} `options`
 * @return {Object} Returns the instance.
 * @api public
 */

Files.prototype.normalize = function(/*config, dest, options*/) {
  this.cache = utils.normalize.apply(this, arguments);
  utils.is(this.cache, 'Files');
  this.run(this.cache);
  return this;
};

/**
 * Expand glob patterns in `src`.
 *
 * @param {Object} `config`
 * @return {Object}
 */

Files.prototype.expand = function(config) {
  if (!config.isNormalized) {
    this.normalize(config, this.options);
  } else {
    this.cache = config;
  }

  this.emit('expand', this.cache);

  var options = utils.merge({}, this.options, this.cache.options);
  var glob = utils.glob;
  var files = this.cache.files;
  var len = files.length, i = -1;

  if (options.glob === false) {
    return this;
  }

  if (typeof options.glob === 'function') {
    glob = options.glob;
  }

  while (++i < len) {
    var file = files[i];

    utils.is(file, 'node');
    this.cache.run(file);

    var opts = utils.merge({}, options, file.options);
    file.options = utils.resolveCwd(opts);

    opts.base = utils.base(file.src, opts);
    file.src = glob.sync(file.src, opts);
    if (!file.src.length) {
      this.emit('node', file);
      continue;
    }

    // run custom filter function on src files, if defined
    file.src = utils.filterSrc(file.src, this.filter(opts));

    if (opts.expand === true) {
      this.cache.files = this.expandMapping(file, opts);
      this.emit('node', file, this.cache.files);
      break;
    }

    file.dest = utils.mapDest.rename(file.dest, file.src, opts);
    if (opts && opts.cwd) {
      file.src = utils.resolveSrc(file.src, opts);
    }
    this.emit('node', file);
  }
  return this;
};

/**
 * Expand `src-dest` mappings.
 *
 * @param {Object} `config`
 * @param {Object} `options`
 * @return {Object}
 */

Files.prototype.expandMapping = function(file, options) {
  var opts = utils.merge({}, options, file.options);
  var filter = this.filter(opts);
  var rest = utils.omit(file, ['src', 'dest', 'files']);
  var len = file.src.length, i = -1;
  var files = [];

  while (++i < len) {
    var fp = file.src[i];
    if (!filter(fp)) continue;

    var resultFile = utils.mapDest(fp, file.dest, opts)[0];
    resultFile = utils.merge({}, rest, resultFile);

    utils.is(resultFile, 'node');
    this.cache.run(resultFile);

    var dest = utils.unixify(resultFile.dest);
    var src = utils.unixify(resultFile.src);

    if (this.pathCache[dest]) {
      this.pathCache[dest].src.push(src);
    } else {
      resultFile.src = [src];
      files.push(resultFile);
      this.pathCache[dest] = this.pathCache[dest] || resultFile;
    }
  }
  return files;
};

/**
 * Default filter function.
 *
 * @param {String} `fp`
 * @param {Object} `opts`
 * @return {Boolean} Returns `true` if a file matches.
 */

Files.prototype.filter = function(opts) {
  var filter = opts.filter;
  var statType = opts.statType || 'lstatSync';
  var self = this;

  return function (fp) {
    var isMatch = true;

    // if `options.filter` is a function, use it to
    // conditionally exclude a file from the result set
    if (typeof filter === 'function') {
      isMatch = filter(fp);

    // if `options.filter` is a string and matches a `fs.lstat`
    // method, call the `fs.lstat` method on the file
    } else if (typeof filter === 'string') {
      validateMethod(filter, statType);

      try {
        var stat = self.statCache[fp] || (self.statCache[fp] = fs[statType](fp));
        isMatch = stat[filter]();
      } catch (err) {
        isMatch = false;
      }
    } else {
      isMatch = true;
    }
    return isMatch;
  };
};

/**
 * When the `filter` option is a string, validate
 * that the it's a valid `fs.lstat` method name.
 *
 * @param {String} `method`
 * @return {Boolean}
 */

function validateMethod(method, type) {
  var methods = ['isFile', 'isDirectory', 'isSymbolicLink'];
  if (methods.indexOf(method) < 0) {
    var msg = '[options.filter] `' + method
      + '` is not a valid fs.' + type + ' method name';
    throw new Error(msg);
  }
}

/**
 * Expose `Files`.
 */

module.exports = Files;
