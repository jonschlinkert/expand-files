/*!
 * expand-files <https://github.com/jonschlinkert/expand-files>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var define = require('define-property');
var utils = require('./lib/utils');

/**
 * Create an instance of `Files` to expand src-dest
 * mappings on the given `config`.
 */

function Files(options) {
  if (!(this instanceof Files)) {
    return new Files(options);
  }
  this.options = options || {};
  define(this, 'statCache', {});
  define(this, 'pathCache', {});
}

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
  var config = utils.normalize.apply(this, arguments);
  for (var key in config) {
    this[key] = config[key];
  }
  return this;
};


/**
 * Expand glob patterns in `src`.
 *
 * @param {Object} `config`
 * @return {Object}
 */

Files.prototype.expand = function(config, context) {
  if (!config.isNormalized) {
    config = this.normalize(config);
  }

  var options = utils.merge({}, this.options, config.options);
  if (options.process === true) {
    var ctx = utils.merge({}, options.parent, context || config);
    var fn = utils.expand(this.options);
    config = fn(config, ctx);
  }

  var files = config.files;
  var len = files.length, i = -1;

  if (options.glob === false) {
    return this;
  }

  while (++i < len) {
    var file = files[i];
    var opts = utils.merge({}, options, file.options);
    file.options = resolveCwd(opts);

    file.src = utils.glob.sync(file.src, opts);
    if (!file.src.length) continue;

    // run custom filter function on src files, if defined
    file.src = filterSrc(file.src, this.filter(opts));

    if (opts.expand === true) {
      config.files = this.expandMapping(file, opts);
      break;
    }

    file.dest = utils.mapDest.rename(file.dest, file.src, opts);

    if (opts && opts.cwd) {
      file.src = resolveSrc(file.src, opts);
    }

    // if `transform` is defined, use it to modify the resulting config
    if (typeof opts.transform === 'function') {
      file = opts.transform(file);
    }
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

Files.prototype.expandMapping = function(config, options) {
  var opts = utils.merge({}, options, config.options);
  var len = config.src.length, i = -1;
  var filter = this.filter(opts);
  var files = [];

  while (++i < len) {
    var fp = config.src[i];
    if (!filter(fp)) continue;

    var result = utils.mapDest(fp, config.dest, opts)[0];
    var dest = utils.unixify(result.dest);
    var src = utils.unixify(result.src);

    if (this.pathCache[dest]) {
      this.pathCache[dest].src.push(src);
    } else {
      result.src = [src];
      var res = result;

      // if `transform` is defined, use it to modify the result
      if (typeof opts.transform === 'function') {
        res = opts.transform(res, config);
      }

      files.push(res);
      this.pathCache[dest] = this.pathCache[dest] || result;
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

function resolveCwd(opts) {
  if (opts.cwd) {
    opts.cwd = resolve(opts.cwd);
  }
  if (opts.srcBase) {
    opts.cwd = path.join(opts.cwd, opts.srcBase);
  }
  return opts;
}

function resolveSrc(src, opts) {
  if (!opts.cwd) return src;
  return src.map(function (fp) {
    return path.join(opts.cwd, fp);
  });
}

function filterSrc(src, fn) {
  return src.filter(function (fp) {
    return fn(fp);
  });
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
 * Expose `Files`.
 */

module.exports = Files;
