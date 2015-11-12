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
    if (!val.node) return fn;
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
