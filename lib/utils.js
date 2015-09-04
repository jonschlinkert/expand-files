'use strict';

/**
 * Expose `utils`
 */

module.exports = function (fn) {
  var lazy = require('lazy-cache')(fn);
  lazy('map-dest');
  lazy('has-glob');
  lazy('expand');
  lazy('arr-flatten', 'flatten');
  lazy('files-objects', 'toMapping');
  lazy('global-modules', 'gm');
  lazy('kind-of', 'typeOf');
  lazy('object.pick', 'pick');
  lazy('object.omit', 'omit');
  lazy('mixin-deep', 'merge');
  lazy('expand-tilde', 'tilde');
  lazy('globby', 'glob');

  lazy.unixify = function unixify(fp) {
    return fp.split('\\').join('/');
  };

  lazy.arrayify = function arrayify(val) {
    return Array.isArray(val) ? val : [val];
  };

  lazy.replaceExt = function replaceExt(fp, opts) {
    opts = opts || {};
    if (typeof opts.extDot === 'undefined') {
      opts.extDot = 'first';
    }
    var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};
    return fp.replace(re[opts.extDot], opts.ext);
  };

  return lazy;
};

