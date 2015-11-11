'use strict';

var omit = require('object.omit');
var define = require('define-property');
var normalize = require('normalize-config');
var extend = require('extend-shallow');
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
  var config = normalize.apply(this, arguments);
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
  raw = raw || {};
  raw.src = raw.src || [];
  run(config, 'rawNode', raw);
  this.files = [];

  if (config.options.expand === true) {
    var len = raw.src.length, i = -1;
    while (++i < len) {
      createNode(raw.src[i], raw, this.files);
    }
  } else {
    createNode(raw.src, raw, this.files);
  }
}

function createNode(src, raw, files) {
  var node = new Node(src, raw);
  if (node.src) {
    files.push(node);
  }
}

function Node(fp, raw) {
  raw = raw || {};
  this.options = omit(raw.options, ['expand', 'flatten', 'rename', 'filter']);
  this.src = arrayify(fp);
  this.dest = mapDest(raw.dest, fp, raw.options);
  run(raw, 'node', this);
}

function filter(config, options) {

}

function mapDest(file, config) {
  return file;
}

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}

function run(parent, key, child) {
  define(child, 'parent', parent);
  child[key] = true;
  parent.run(child);
  delete child[key];
}

/**
 * Expose expand
 */

module.exports = ExpandFiles;
