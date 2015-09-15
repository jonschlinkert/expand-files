'use strict';

/**
 * Expose `utils`
 */

var lazy = require('lazy-cache')(require);

lazy('map-dest');
lazy('expand');
lazy('normalize-config', 'normalize');
lazy('global-modules', 'gm');
lazy('mixin-deep', 'merge');
lazy('expand-tilde', 'tilde');
lazy('globby', 'glob');
lazy('glob-parent', 'parent');
lazy('is-glob');

lazy.unixify = function unixify(fp) {
  return fp.split('\\').join('/');
};

module.exports = lazy;
