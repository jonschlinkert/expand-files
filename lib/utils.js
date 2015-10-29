'use strict';

var path = require('path');

/**
 * Expose `utils`
 */

var utils = require('lazy-cache')(require);
var fn = require;

/**
 * Lazily required module dependencies
 */

require = utils;
require('map-dest');
require('object.omit', 'omit');
require('matched', 'glob');
require('normalize-path', 'unixify');
require('normalize-config', 'normalize');
require('mixin-deep', 'merge');
require('glob-parent', 'parent');
require('define-property', 'define');
require('resolve-dir', 'resolve');
require = fn;

utils.resolveCwd = function(opts) {
  if (opts.cwd) {
    opts.cwd = utils.resolve(opts.cwd);
  }
  if (opts.srcBase) {
    opts.cwd = path.join(opts.cwd, opts.srcBase);
  }
  return opts;
};

utils.resolveSrc = function(src, opts) {
  if (!opts.cwd) return src;
  return src.map(function (fp) {
    return path.join(opts.cwd, fp);
  });
};

utils.filterSrc = function(src, fn) {
  return src.filter(function (fp) {
    return fn(fp);
  });
};

utils.base = function(src, opts) {
  if (opts.base) return opts.base;
  var pattern = Array.isArray(src) ? src[0] : src;
  return utils.parent(pattern);
};

utils.pascal = function(name) {
  return 'is' + name.charAt(0).toUpperCase() + name.slice(1);
};

utils.is = function(obj, name) {
  utils.define(obj, utils.pascal(name), true);
  utils.define(obj, '_name', name.toLowerCase());
  return obj;
};

utils.isName = function(obj, name) {
  return obj['is' + name];
};

/**
 * Expose `utils`
 */

module.exports = utils;
