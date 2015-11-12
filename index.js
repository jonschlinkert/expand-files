'use strict';

var path = require('path');
var utils = require('./lib/utils');
var use = require('use');

function ExpandFiles(options) {
  if (!(this instanceof ExpandFiles)) {
    return new ExpandFiles(options);
  }
  this.ExpandFiles = true;
  use(this);
  this.options = options || {};
}

ExpandFiles.prototype.expand = function(src, dest, options) {
  var config = utils.normalize.apply(this, arguments);
  run(this, 'normalized', config);

  config = expandMapping(config, options);
  run(this, 'expanded', config);

  for (var key in config) {
    this[key] = config[key];
  }
  return this;
};

/**
 * iterate over a files array and expand src-dest mappings
 *
 * ```js
 * { files: [ { src: [ '*.js' ], dest: 'dist/' } ] }
 * ```
 * @param {Object} `config`
 * @param {Object} `options`
 * @return {Object}
 */

function expandMapping(config, options) {
  var len = config.files.length, i = -1;
  var res = [];

  while (++i < len) {
    var node = new RawNode(config.files[i], config);
    if (!node.files.length) {
      continue;
    }
    res.push.apply(res, node.files);
  }

  config.files = res;
  return config;
}

function RawNode(raw, config) {
  run(config, 'rawNode', raw);
  this.files = [];
  var paths = {};

  raw.options = resolvePaths(raw.options);
  var opts = utils.extend({}, raw.options);
  var filter = filterFiles(opts);

  var srcFiles = opts.glob !== false
    ? utils.glob.sync(raw.src, opts)
    : raw.src;

  srcFiles = srcFiles.filter(filter);

  if (config.options.mapDest) {
    var len = srcFiles.length, i = -1;
    while (++i < len) {
      var node = new Node(srcFiles[i], raw, config);
      var dest = node.dest;
      if (!node.src && !node.path) continue;
      var src = resolveArray(node.src, opts);

      if (paths[dest]) {
        paths[dest].src = paths[dest].src.concat(src);
      } else {
        node.src = arrayify(src);
        this.files.push(node);
        paths[dest] = node;
      }
    }

    if (!this.files.length) {
      node = raw;
      raw.src = [];
      this.files.push(raw);
    }

  } else {
    createNode(srcFiles, raw, this.files, config);
  }
}

function createNode(src, raw, files, config) {
  var node = new Node(src, raw, config);
  if (node.path || node.src) {
    files.push(node);
  }
}

function Node(src, raw, config) {
  this.options = utils.omit(raw.options, ['mapDest', 'flatten', 'rename', 'filter']);
  this.src = arrayify(src);
  if (raw.options.mapDest) {
    this.dest = mapDest(raw.dest, src, raw);
  } else {
    this.dest = rewriteDest(raw.dest, src, raw.options);
  }
  run(config, 'node', this);
}

function mapDest(dest, src, node) {
  var opts = node.options;

  if (opts.rename === false) {
    return dest;
  }

  var fp = src;
  if (fp && typeof fp === 'string') {
    fp = !utils.isGlob(fp) ? fp : '';
    var cwd = path.resolve(opts.cwd);
    fp = path.join(cwd, fp);
    fp = utils.relative(cwd, fp);
  } else {
    fp = '';
  }

  if (opts.flatten === true) {
    fp = path.basename(fp);
  }

  if (opts.base === true) {
    opts.base = utils.base(node.orig.src);
  }

  if (opts.base) {
    dest = path.join(dest, opts.base, path.basename(fp));
  } else {
    dest = path.join(dest, fp);
  }
  return rewriteDest(dest, src, opts);
}

/**
 * Used when `mapDest` is not true
 */

function rewriteDest(dest, src, opts) {
  dest = utils.resolve(dest);

  if (opts.destBase) {
    dest = path.join(opts.destBase, dest);
  }

  if (opts.extDot || opts.hasOwnProperty('ext')) {
    dest = rewriteExt(dest, opts);
  }

  if (typeof opts.rename === 'function') {
    return opts.rename(dest, src, opts);
  }
  return dest;
}

function rewriteExt(dest, opts) {
  var re = {first: /(\.[^\/]*)?$/, last: /(\.[^\/\.]*)?$/};

  if (opts.ext === false) {
    opts.ext = '';
  }

  if (opts.ext.charAt(0) !== '.') {
    opts.ext = '.' + opts.ext;
  }

  if (typeof opts.extDot === 'undefined') {
    opts.extDot = 'first';
  }

  dest = dest.replace(re[opts.extDot], opts.ext);
  if (dest.slice(-1) === '.') {
    dest = dest.slice(0, -1);
  }
  return dest;
}

function resolvePaths(opts) {
  if (opts.destBase) {
    opts.destBase = utils.resolve(opts.destBase);
  }
  if (opts.cwd) {
    opts.cwd = utils.resolve(opts.cwd);
  }
  return opts;
}

/**
 * Default filter function.
 *
 * @param {String} `fp`
 * @param {Object} `opts`
 * @return {Boolean} Returns `true` if a file matches.
 */

function filterFiles(opts) {
  if (typeof opts.filter === 'function') {
    return opts.filter;
  }
  return function(fp) {
    return true;
  };
}

function resolveArray(files, opts) {
  if (!opts.mapDest) return files;

  return files.map(function(fp) {
    return path.join(opts.cwd, fp);
  });
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

function run(parent, key, child) {
  utils.define(child, 'parent', parent);
  utils.define(child, 'orig', utils.extend({}, child));
  child[key] = true;
  parent.run(child);
  delete child[key];
}

/**
 * Expose expand
 */

module.exports = ExpandFiles;
