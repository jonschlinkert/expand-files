var util = require('util');
var forIn = require('for-in');
var inspect = require('stringify-object');
var configs = require('./configs');
var files = require('../');


function stringify(config) {
  return inspect(config, {
    singleQuotes: true,
    indent: '  '
  });
}

function format(arr) {
  var res = '# Patterns\n\n';
  arr.forEach(function (config) {
    forIn(config, function (val, key) {
      if (key === 'section') {
        res += section(val);
      } else if (key === 'examples') {
        res += examples(val);
      }
      res += '\n';
    });
  });
  return res;
}

function section(str) {
  return '## ' + str;
}

function description(str) {
  return '> ' + str;
}

function examples(arr) {
  var res = '';
  arr.forEach(function (config) {
    res += '\n';

    forIn(config, function (val, key) {
      if (key === 'description') {
        res += description(val);

      } else if (key === 'config') {
        res += formatEach(val);
      }
    });
  });
  return res;
}

function toMarkdown(config) {
  var res = '';
  res += '\n';
  res += '\n';
  res += '```js';
  res += '\n';
  res += 'files(' + stringify(config) + ');';
  res += '\n';
  res += '```';
  res += '\n';
  res += '\n';
  res += '**results in**';
  res += '\n';
  res += '\n';
  res += '```js';
  res += '\n';
  res += stringify(files(config));
  res += '\n';
  res += '```';
  res += '\n';
  return res;
}

function formatEach(configs) {
  configs = Array.isArray(configs) ? configs : [configs];
  var res = [];
  configs.forEach(function (config) {
    res.push(toMarkdown(config));
  });
  return res.join('\nand...\n');
}
var res = format(configs);

console.log(res)
