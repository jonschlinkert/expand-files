'use strict';

var path = require('path');
var util = require('util');
var glob = require('matched');
var obj = require('./support/configs');
var ExpandConfig = require('./config');
var config = new ExpandConfig();


config
  .use(function fn(val) {
    if (!val.rawNode) return fn;
    val.src = glob.sync(val.src, val.options);
    // console.log(val)
  })
  .use(function fn(val) {
    if (!val.node) return fn;
    val.path = val.src[0];
    delete val.src;
  })

config.expand({
  options: {
    expand: true,
    cwd: 'test/fixtures',
    rename: function(dest, src, options) {
      console.log(arguments);
      return dest;
    }
  },
  src: ['**/*.txt'],
  dest: 'dist/'
});

console.log(config.files)

// config.on('normalized', function(val) {
//   console.log(val);
// });

// var patterns = [
//   ['*.js', 'test/actual']
// ];

var res = [];

// obj.forEach(function(val) {
//   val.examples.forEach(function(example) {
//     config.expand.apply(config, [example.config]);
//     // console.log(config.files)
//     res.push.apply(res, config.files);
//   });
// });


