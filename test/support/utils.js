'use strict';

var forIn = require('for-in');

var utils = module.exports;

function forOwn(o, fn, thisArg) {
  forIn(o, function (val, key) {
    if (o.hasOwnProperty(key)) {
      return fn.call(thisArg, o[key], key, o);
    }
  });
}

function some(o, cb, thisArg) {
  var res = false;
  forOwn(o, function (val, key) {
    if (cb(val, key, o)) {
      res = true;
      return false;
    }
  }, thisArg);
  return res;
}

function equals(a) {
  return function (b) {
    return a === b;
  };
}

utils.contains = function contains(o, val) {
  return some(o, equals(val));
};
