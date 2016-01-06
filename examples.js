'use strict';

var path = require('path');
var util = require('util');
var placeholders = require('placeholders');
var obj = require('./support/configs');
var Files = require('./');
var config = new Files();

function permalinks(data) {
  var interpolate = placeholders({data: data});

  return function fn(val) {
    if (!val.filesNode) return fn;
    var data = path.parse(val.src[0]);
    val.dest = interpolate(val.dest, data);
    console.log(val.dest)
  }
}

config.use(permalinks());

var res = [];

obj.forEach(function(val) {
  val.examples.forEach(function(example) {
    config.expand.apply(config, arrayify(example.config));
    // console.log(config.files)
    // res.push.apply(res, config.files);
  });
});

function arrayify(val) {
  return Array.isArray(val) ? val : [val];
}


var config = new Files();
function addFoo(config) {
  return function fn(node) {
    if (!node.filesNode) return fn;
    // return the plugin function if it's not a filesNode
    // this way we know with certainty that `node`
    // will be a filesNode
    node.options.foo = 'bar';
    node.dest = 'baz/';
    node.abc = 'xyz';
  };
}
config.use(addFoo);
console.log(config.expand({src: '*.js'}).files);
