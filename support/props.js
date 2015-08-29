var forIn = require('for-in');
var toClipboard = require('to-clipboard');
var reserved = require('../lib/reserved');

function format(obj) {
  var res = '';
  forIn(obj, function (val, key) {
    if (key === 'options') {
      res += '\n**' + key + '**\n\n';

      forIn(val, function (v, k) {
        res += '- `' + v + '`\n';
      });
    }
  })
  return res;
}

toClipboard.sync(format(reserved));
