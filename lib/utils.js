'use strict';

/**
 * Expose `utils`
 */

var utils = module.exports;

utils.unixify = function unixify(fp) {
  return fp.split('\\').join('/');
};

utils.arrayify = function arrayify(val) {
  return Array.isArray(val) ? val : [val];
};

utils.replaceExt = function replaceExt(fp, opts) {
  opts = opts || {};
  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
  return fp.replace(re[opts.extDot], opts.ext);
};
