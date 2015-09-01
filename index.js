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
var mapDest = require('map-dest');
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

    // use rename function to modify dest path
    config.dest = mapDest.rename(config.dest, config.src, config);
    return utils.arrayify(config);
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
   * Expand `src-dest` mappings.
   *
   * @param {Object} `config`
   * @return {Object}
   */

  expandMapping: function (config) {
    var len = config.src.length, i = -1;
    var filter = this.filter(config.options);
    var files = [];

    while (++i < len) {
      var fp = config.src[i];
      if (!filter(fp)) continue;

      var result = mapDest(fp, config.dest, config.options);
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
   * Default filter function.
   *
   * @param {String} `fp`
   * @param {Object} `opts`
   * @return {Boolean} Returns `true` if a file matches.
   */

  filter: function(opts) {
    var filter = opts.filter;

    return function (fp) {
      var isMatch = true;
      if (!filter) return isMatch;

      // if `options.filter` is a function, use it to
      // conditionally exclude a file from the result set
      if (typeof filter === 'function') {
        isMatch = filter(fp);

      // if `options.filter` is a string and matches a `fs.lstat`
      // method, call the `fs.lstat` method on the file
      } else if (typeof filter === 'string') {
        validateMethod(filter, opts);
        try {
          isMatch = fs.lstatSync(fp)[filter]();
        } catch (err) {
          isMatch = false;
        }
      }
      return isMatch;
    }
  }
};

/**
 * When the `filter` option is a string, validate
 * that the it's a valid `fs.lstat` method name.
 *
 * @param {String} `method`
 * @return {Boolean}
 */

function validateMethod(method) {
  var methods = ['isFile', 'isDirectory', 'isSymbolicLink'];
  if (methods.indexOf(method) < 0) {
    var msg = '[options.filter] `' + method + '` is not a valid fs.lstat method name';
    throw new Error(msg);
  }
}

/**
 * Expose `Files`. For now file expansion is done
 * in the constructor, but I might expose the individual
 * methods if it's useful.
 */

module.exports = Files;
