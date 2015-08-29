'use strict';

exports.taskKeys = [
  'options'
];

exports.targetKeys = [
  'files',
  'src',
  'dest'
];

exports.options = [
  'base',
  'cwd',
  'destBase',
  'expand',
  'ext',
  'extDot',
  'extend',
  'flatten',
  'rename',
  'process',
  'srcBase'
];

exports.all = exports.taskKeys
  .concat(exports.targetKeys)
  .concat(exports.options);
