'use strict';

/**
 * Expose `utils`
 */

var utils = require('lazy-cache')(require);
var fn = require;

/**
 * Lazily required module dependencies
 */

require = utils;
require('normalize-config', 'normalize');
require('define-property', 'define');
require('extend-shallow', 'extend');
require('resolve-dir', 'resolve');
require('glob-parent', 'parent');
require('relative', 'relative');
require('object.omit', 'omit');
require('matched', 'glob');
require('has-glob');
require = fn;

utils.base = function(src, options) {
  var opts = utils.extend({}, options);
  if (opts.base) {
    return opts.base === '.' ? '' : opts.base;
  }
  var pattern = Array.isArray(src) ? src[0] : src;
  var base = utils.parent(pattern);
  if (base === '.') {
    return '';
  }
  return base;
};

/**
 * Expose `utils`
 */

module.exports = utils;
