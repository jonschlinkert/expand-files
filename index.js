/*!
 * expand-files <https://github.com/jonschlinkert/expand-files>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var glob = require('globby');
var clone = require('clone-deep');
var pick = require('object.pick');
var omit = require('object.omit');
var merge = require('mixin-deep');
var parsePath = require('parse-filepath');
var toMapping = require('files-objects');
var reserved = require('./lib/reserved');
var utils = require('./lib/utils');

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(config, dest, options) {
  if (!(this instanceof Files)) {
    return new Files(config, dest, options);
  }
  if (arguments.length > 1 || typeof config !== 'object') {
    config = this.toConfig.apply(this, arguments);
  }
  this.cache = {};
  config = config || {};
  config.options = config.options || {};
  return this.expand(config);
}

/**
 * `Files` prototype methods
 */

Files.prototype = {
  constructor: Files,

  /**
   * Expand glob patterns in `src`.
   *
   * @param {Object} `config`
   * @return {Object}
   */

  expand: function(config) {
    var opts = pick(config, reserved.options);
    var rest = omit(config, reserved.options);
    config.options = merge({}, opts, rest.options);

    if (!config.src) return this.normalize(config);

    // grunt compatibility
    if (config.destBase && !config.dest) {
      config.dest = config.destBase;
      delete config.destBase;
    }
    if (config.srcBase && !config.cwd) {
      config.cwd = config.srcBase;
      delete config.srcBase;
    }

    // store the original `src`
    var orig = config.src;
    try {
      // attempt to expand glob patterns
      config.src = glob.sync(config.src, clone(config.options));
    } catch(err) {
      err.message = err.message + ': ' + JSON.stringify(config.src);
      throw err;
    }

    if (!config.src.length) {
      if (config.options.nonull === true) {
        config.src = orig;
      } else {
        config.src = [];
      }
      return utils.arrayify(config);
    }

    if (config.options.expand === true) {
      return this.expandMapping(config);
    }
    var res = pick(config, ['src', 'dest']);
    return utils.arrayify(res);
  },

  /**
   * Normalize the configuration passed to
   * the constructor.
   *
   * @param {Object} `config`
   * @return {Object}
   */

  normalize: function (config) {
    var orig = clone(config);
    var res = toMapping(config);
    var files = [];

    if (res.hasOwnProperty('files')) {
      var len = res.files.length, i = -1;

      while (++i < len) {
        var obj = res.files[i];
        obj.options = obj.options || {};
        obj = this.expand(obj);
        delete obj.options;
        files = files.concat(obj);
      }
    }
    if (!files.length) return orig;
    return files;
  },

  /**
   * Normalize arguments when passed as a list on
   * the constructor.
   *
   * ```js
   * files(src, dest, options);
   * ```
   * @param {String|Array} `src`
   * @param {String} `dest`
   * @param {Object} `options`
   * @return {object}
   */

  toConfig: function (src, dest, options) {
    if (typeof src !== 'string' && !Array.isArray(src)) {
      return src;
    }
    var config = {};
    config.src = src || '';
    if (typeof dest !== 'string') {
      options = dest;
      dest = '';
    }
    config.options = options || {};
    config.dest = dest || '';
    return config;
  },

  /**
   * Expand `src-dest` mappings.
   *
   * @param {Object} `config`
   * @return {Object}
   */

  expandMapping: function (config) {
    var len = config.src.length, i = -1;
    var files = [];

    while (++i < len) {
      var result = this.mapDest(config.src[i], config.dest, config);
      if (result === false) continue;
      var dest = utils.unixify(result.dest);
      var src = utils.unixify(result.src);
      if (this.cache[dest]) {
        this.cache[dest].src.push(src);
      } else {
        result.src = [src];
        var res = result;
        if (config.options.extend) {
          res = merge({}, config, res);
        }
        files.push(res);
        this.cache[dest] = this.cache[dest] || result;
      }
    }
    return files;
  },

  /**
   * Calculate destination paths based on configuration.
   *
   * @param {String|Array} `src`
   * @param {String} `dest`
   * @param {Object} `config`
   * @return {Object}
   */

  mapDest: function (src, dest, config) {
    var opts = config.options;
    var fp = src;

    var isMatch = this.filter(fp, opts);
    if (!isMatch) return false;

    // if `options.flatten` is defined, use the `src` basename
    if (opts.flatten) fp = path.basename(fp);

    // if `options.ext` is defined, use it to replace extension
    if (opts.hasOwnProperty('ext')) {
      fp = utils.replaceExt(fp, opts);
    }

    // use rename function to modify dest path
    var result = this.rename(dest, fp, config);

    // if `options.cwd` is defined, prepend it to `src`
    if (opts.cwd) {
      src = path.join(opts.cwd, src);
    }
    return {src: src, dest: result};
  },

  /**
   * Default filter function.
   *
   * @param {String} `fp`
   * @param {Object} `opts`
   * @return {Boolean} Returns `true` if a file matches.
   */

  filter: function(fp, opts) {
    var filter = opts.filter;
    var isMatch = true;

    if (!filter) return isMatch;

    // if `options.filter` is a function, use it to
    // conditionally exclude a file from the result set
    if (typeof filter === 'function') {
      isMatch = filter(fp);

    // if `options.filter` is a string and matches a `fs.lstat`
    // method, call the `fs.lstat` method on the file
    } else if (typeof filter === 'string') {
      if (['isFile', 'isDirectory', 'isSymbolicLink'].indexOf(filter) < 0) {
        var msg = '[options.filter] `' + filter
          + '` is not a valid fs.lstat method name';
        throw new Error(msg);
      }
      try {
        isMatch = fs.lstatSync(fp)[filter]();
      } catch (err) {
        isMatch = false;
      }
    }
    return isMatch;
  },

  /**
   * Default rename function.
   */

  rename: function(dest, src, config) {
    var opts = config.options;
    if (typeof opts.rename === 'function') {
      var ctx = parsePath(src);
      return opts.rename.call(ctx, dest, src, opts);
    }
    return dest ? path.join(dest, src) : src;
  }
};

/**
 * Expose `Files`. For now file expansion is done
 * in the constructor, but I might expose the individual
 * methods if it's useful.
 */

module.exports = Files;
