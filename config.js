'use strict';

var use = require('use');
var omit = require('object.omit');
var define = require('define-property');
var normalize = require('normalize-config');
var extend = require('extend-shallow');
var Base = require('base-methods');
var plugins = require('base-plugins');
var typeOf = require('kind-of');

function ExpandFiles(options) {
  if (!(this instanceof ExpandFiles)) {
    return new ExpandFiles(options);
  }
  Base.call(this);
  define(this, 'ExpandFiles', true);
  this.use(plugins());
  delete this.cache;
  this.options = options || {};
}

Base.extend(ExpandFiles);

ExpandFiles.prototype.expand = function(src, dest, options) {
  var config = normalize.apply(this, arguments);
  run(this, 'normalized', config);

  if (config.options.expand === true) {
    config = expandMapping(config, options);
    run(this, 'expanded', config);
  }

  for (var key in config) {
    this[key] = config[key];
  }
  return this;
};


// iterate over a files array and expand src-dest mappings
//=> { files: [ { src: [ '*.js' ], dest: 'dist/' } ] }
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

  var len = raw.src.length, i = -1;
  this.files = [];

  while (++i < len) {
    var node = new Node(raw.src[i], raw);
    if (!node.src) {
      continue;
    }
    this.files.push(node);
  }
}

function Node(fp, raw) {
  raw = raw || {};
  this.options = omit(raw.options, ['expand', 'flatten', 'rename', 'filter']);
  this.src = [fp];
  this.dest = mapDest(raw.dest, fp, raw.options);
  run(raw, 'node', this);
}

/**
 * Fill in missing properties if the necessary data
 * is specified on the global options.
 *
 * @param {Object} `config`
 * @param {Object} `options`
 * @return {Object}
 */

ExpandFiles.prototype.fillin = function(config, options) {
  config.options = extend({}, options, config.options);
  return config;
};


function filter(config, options) {

}

function mapDest(file, config) {

  return file;
}

function isObject(val) {
  return typeOf(val) === 'object';
}

function run(parent, key, child) {
  define(child, 'parent', parent);
  define(child, key, true);
  parent.run(child);
  if (child.emit) child.emit(key, child);
  if (parent.emit) parent.emit(key, child);
  delete child[key];
}

/**
 * Expose expand
 */

module.exports = ExpandFiles;
