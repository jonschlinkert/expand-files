/*!
 * expand-files <https://github.com/jonschlinkert/expand-files>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var reserved = require('./lib/reserved');
var utils = require('./lib/utils')(require);

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(config, dest, options) {
  if (!(this instanceof Files)) {
    return new Files(config, dest, options);
  }
  if (dest || options || utils.typeOf(config) !== 'object') {
    config = this.toConfig.apply(this, arguments);
  }
  config.options = config.options || {};
  this.statCache = {};
  this.pathCache = {};
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
    var opts = utils.pick(config, reserved.options);
    var rest = utils.omit(config, reserved.options);
    rest.options = utils.merge({}, opts, rest.options);
    config = rest;

    if (!config.src) return this.normalize(config);

    opts = config.options;
    if (opts.cwd) {
      opts.cwd = resolve(opts.cwd);
    }

    // store the original `src`
    var orig = config.src;
    config.src = utils.arrayify(config.src);

    // expand glob patterns
    if (opts.glob !== false && utils.hasGlob(orig)) {
      config.src = utils.glob.sync(config.src, opts);
    }

    if (!config.src.length) {
      return utils.arrayify(config);
    }

    if (opts.expand === true) {
      return this.expandMapping(config);
    }

    var filter = this.filter(opts);
    config.src = config.src.filter(function (fp) {
      return filter(fp);
    });

    // use rename function to modify dest path
    config.dest = utils.mapDest.rename(config.dest, config.src, opts);

    if (opts.cwd) {
      config.src = config.src.map(function (fp) {
        return path.join(opts.cwd, fp);
      });
    }

    // if `transform` is defined, use it to modify the resulting config
    if (typeof opts.transform === 'function') {
      config = opts.transform(config);
    }
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
    var res = utils.toMapping(config);
    var files = [];

    var len = res.files.length, i = -1;

    while (++i < len) {
      var obj = res.files[i];
      obj = this.expand(obj);
      delete obj.options;
      files = files.concat(obj);
    }
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

      // `mapDest` always returns an array, since it can handle
      // `src` arrays, be we will always only pass one src file
      var result = utils.mapDest(fp, config.dest, config.options)[0];
      var dest = utils.unixify(result.dest);
      var src = utils.unixify(result.src);

      if (this.pathCache[dest]) {
        this.pathCache[dest].src.push(src);
      } else {
        result.src = [src];
        var res = result;

        // if `transform` is defined, use it to modify the result
        if (typeof config.options.transform === 'function') {
          res = config.options.transform(res, config);
        }

        files.push(res);
        this.pathCache[dest] = this.pathCache[dest] || result;
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
      throw new TypeError('expected src to be a string or array.');
    }
    var config = {};
    if (typeof dest !== 'string') {
      options = dest;
      dest = '';
    }
    config.options = options || {};
    config.src = src;
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
  }
};

/**
 * Resolve paths with special leading characters, in the
 * spirit of bash.
 *
 * @param {String} `dir`
 * @return {String}
 */

function resolve(dir) {
  if (dir.charAt(0) === '~') {
    dir = utils.tilde(dir);
  }
  if (dir.charAt(0) === '@') {
    dir = path.join(utils.gm, dir.slice(1));
  }
  return dir;
}

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
 * Expose `Files`. For now file expansion is done
 * in the constructor, but I might expose the individual
 * methods if it's useful.
 */

module.exports = Files;
